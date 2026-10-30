import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';

const app = createApp();

describe('Collaboration Workflow API (TC-COLLAB-01 to TC-COLLAB-12)', () => {
  const brandEmail = `collab_brand_${Date.now()}@example.com`;
  const creator1Email = `collab_creator1_${Date.now()}@example.com`;
  const creator2Email = `collab_creator2_${Date.now()}@example.com`;
  const nonParticipantEmail = `collab_outsider_${Date.now()}@example.com`;
  const password = 'Password123!';

  let brandToken = '';
  let brandId = '';
  let creator1Token = '';
  let creator2Token = '';
  let outsiderToken = '';
  let campaignId = '';
  let applicationId1 = '';
  let applicationId2 = '';
  let collaborationId = '';

  beforeAll(async () => {
    // 1. Register brand
    const bRes = await request(app).post('/api/v1/auth/register').send({
      email: brandEmail,
      password,
      role: 'brand',
    });
    brandToken = bRes.body.token;
    brandId = bRes.body.user.id;

    // 2. Register creator 1
    const c1Res = await request(app).post('/api/v1/auth/register').send({
      email: creator1Email,
      password,
      role: 'creator',
    });
    creator1Token = c1Res.body.token;

    await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creator1Token}`)
      .send({
        displayName: 'Elena Rostova',
        niche: 'Clean Cosmetics',
        platforms: [{ name: 'TikTok', handle: '@elenaglow', followers: 52000 }],
        audienceSize: 52000,
        contentStyle: 'Short-form educational routines',
      });

    // 3. Register creator 2
    const c2Res = await request(app).post('/api/v1/auth/register').send({
      email: creator2Email,
      password,
      role: 'creator',
    });
    creator2Token = c2Res.body.token;

    await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creator2Token}`)
      .send({
        displayName: 'Liam Chen',
        niche: 'Clean Cosmetics',
        platforms: [{ name: 'Instagram', handle: '@liamchen', followers: 18000 }],
        audienceSize: 18000,
      });

    // 4. Register outsider creator
    const outRes = await request(app).post('/api/v1/auth/register').send({
      email: nonParticipantEmail,
      password,
      role: 'creator',
    });
    outsiderToken = outRes.body.token;

    // 5. Create and publish campaign
    const campRes = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        title: 'Hydrating Botanical Essence Review',
        category: 'Clean Cosmetics',
        goals: 'Drive trial and customer awareness',
        targetAudience: 'Skincare enthusiasts',
        deliverables: '1 TikTok Video',
        timeline: '14 days',
        budget: '$750',
        requirements: 'Honest review with clean ingredient highlights',
      });
    campaignId = campRes.body.id;

    await request(app)
      .post(`/api/v1/campaigns/${campaignId}/publish`)
      .set('Authorization', `Bearer ${brandToken}`);
  });

  afterAll(async () => {
    if (campaignId) {
      await prisma.message.deleteMany({ where: { collaboration: { campaignId } } });
      await prisma.collaboration.deleteMany({ where: { campaignId } });
      await prisma.application.deleteMany({ where: { campaignId } });
      await prisma.campaign.deleteMany({ where: { id: campaignId } });
    }
    await prisma.user.deleteMany({
      where: {
        email: { in: [brandEmail, creator1Email, creator2Email, nonParticipantEmail] },
      },
    });
    await prisma.$disconnect();
  });

  it('TC-COLLAB-01: Creator Submits Application with standardized pitchNote', async () => {
    const res = await request(app)
      .post(`/api/v1/campaigns/${campaignId}/apply`)
      .set('Authorization', `Bearer ${creator1Token}`)
      .send({
        pitchNote: 'I love clean botanical skincare and have an audience that values honest ingredient deep-dives!',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('pending');
    expect(res.body.pitchNote).toContain('honest ingredient deep-dives');

    applicationId1 = res.body.id;
  });

  it('TC-COLLAB-02: Duplicate Application Prevented', async () => {
    const res = await request(app)
      .post(`/api/v1/campaigns/${campaignId}/apply`)
      .set('Authorization', `Bearer ${creator1Token}`)
      .send({
        pitchNote: 'Second attempt to apply should be rejected',
      });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('CONFLICT');
  });

  it('TC-COLLAB-08: Brand Lists Campaign Applications with Match Scores and Pitch Notes', async () => {
    // Also submit application for creator 2
    const app2Res = await request(app)
      .post(`/api/v1/campaigns/${campaignId}/apply`)
      .set('Authorization', `Bearer ${creator2Token}`)
      .send({
        pitchNote: 'Would love to collaborate on this product!',
      });
    applicationId2 = app2Res.body.id;

    const listRes = await request(app)
      .get(`/api/v1/campaigns/${campaignId}/applications`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.applications).toBeDefined();
    expect(listRes.body.applications.length).toBe(2);

    const app1 = listRes.body.applications.find((a: any) => a.id === applicationId1);
    expect(app1).toBeDefined();
    expect(app1.displayName).toBe('Elena Rostova');
    expect(app1.pitchNote).toBeDefined();
  });

  it('TC-COLLAB-09: Brand Declines Application', async () => {
    const res = await request(app)
      .post(`/api/v1/applications/${applicationId2}/decision`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ decision: 'declined' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('declined');
    expect(res.body.collaboration).toBeNull();
  });

  it('TC-COLLAB-03: Brand Accepts Application & Initializes Collaboration (status: invited)', async () => {
    const res = await request(app)
      .post(`/api/v1/applications/${applicationId1}/decision`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ decision: 'accepted' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('accepted');
    expect(res.body.collaboration).toBeDefined();
    expect(res.body.collaboration.status).toBe('invited');

    collaborationId = res.body.collaboration.id;
  });

  it('TC-COLLAB-06: Unconfirmed Collaboration Cannot Be Activated Directly (Conflict Gate)', async () => {
    // Brand attempts to activate collaboration before creator acknowledges
    const res = await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ status: 'in_progress' });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('CONFLICT');
    expect(res.body.message).toContain('Cannot activate collaboration before creator acknowledgement');
  });

  it('TC-COLLAB-07: Wrong-Role / Non-Participant Status Change Rejected', async () => {
    const res = await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${outsiderToken}`)
      .send({ status: 'accepted' });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  it('TC-COLLAB-10: Creator Explicit Confirmation Gate (invited -> accepted)', async () => {
    const res = await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${creator1Token}`)
      .send({ status: 'accepted' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('accepted');
  });

  it('TC-COLLAB-11: Collaboration Lifecycle State Visibility', async () => {
    const res = await request(app)
      .get(`/api/v1/collaborations/${collaborationId}`)
      .set('Authorization', `Bearer ${creator1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(collaborationId);
    expect(res.body.status).toBe('accepted');
    expect(res.body.campaignTitle).toBe('Hydrating Botanical Essence Review');
    expect(res.body.creatorName).toBe('Elena Rostova');
  });

  it('TC-COLLAB-04: Message Thread Exchange', async () => {
    // 1. Creator posts first message
    const msg1Res = await request(app)
      .post(`/api/v1/collaborations/${collaborationId}/messages`)
      .set('Authorization', `Bearer ${creator1Token}`)
      .send({ content: 'Hi team, package arrived safely! Script outline ready.' });

    expect(msg1Res.status).toBe(201);
    expect(msg1Res.body.content).toContain('Script outline ready');

    // 2. Brand replies
    const msg2Res = await request(app)
      .post(`/api/v1/collaborations/${collaborationId}/messages`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ content: 'Excited to see the first draft, Elena!' });

    expect(msg2Res.status).toBe(201);

    // 3. Retrieve thread chronologically
    const threadRes = await request(app)
      .get(`/api/v1/collaborations/${collaborationId}/messages`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(threadRes.status).toBe(200);
    expect(threadRes.body.messages.length).toBe(2);
    expect(threadRes.body.messages[0].senderRole).toBe('creator');
    expect(threadRes.body.messages[1].senderRole).toBe('brand');
  });

  it('TC-COLLAB-12: Mutual Deliverable Completion Request in Progress', async () => {
    // Move to in_progress first
    await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ status: 'in_progress' });

    // Creator marks deliverable delivered
    const res = await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${creator1Token}`)
      .send({ deliverableDelivered: true });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in_progress');
    expect(res.body.deliverableNotice).toBeDefined();
  });

  it('TC-COLLAB-05: Collaboration Completion', async () => {
    const res = await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');

    const dbCollab = await prisma.collaboration.findUnique({
      where: { id: collaborationId },
    });
    expect(dbCollab?.status).toBe('completed');
  });
});
