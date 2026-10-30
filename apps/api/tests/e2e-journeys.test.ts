import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';
import { MANDATORY_TRUST_DISCLAIMER } from '@collabtrust/shared';

const app = createApp();

describe('End-to-End User Journey Tests (TC-E2E-01 to TC-E2E-04)', () => {
  const brandEmail = `e2e_brand_${Date.now()}@example.com`;
  const creatorEmail = `e2e_creator_${Date.now()}@example.com`;
  const password = 'StrongPassword123!';

  let brandToken = '';
  let brandId = '';
  let creatorToken = '';
  let creatorId = '';
  let creatorProfileId = '';
  let campaignId = '';
  let applicationId = '';
  let collaborationId = '';

  afterAll(async () => {
    if (campaignId) {
      await prisma.message.deleteMany({ where: { collaboration: { campaignId } } });
      await prisma.collaboration.deleteMany({ where: { campaignId } });
      await prisma.application.deleteMany({ where: { campaignId } });
      await prisma.match.deleteMany({ where: { campaignId } });
      await prisma.campaign.deleteMany({ where: { id: campaignId } });
    }
    await prisma.user.deleteMany({
      where: { email: { in: [brandEmail, creatorEmail] } },
    });
    await prisma.$disconnect();
  });

  it('TC-E2E-01: J-1 Brand Journey: Register -> Complete Profile -> AI Structuring -> Publish (Steps 1-5)', async () => {
    // 1. Brand Registration
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: brandEmail,
        password,
        role: 'brand',
      });
    expect(regRes.status).toBe(201);
    brandToken = regRes.body.token;
    brandId = regRes.body.user.id;

    // 2. Complete Brand Profile
    const profRes = await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        companyName: 'Aura Botanicals',
        category: 'Clean Beauty & Skincare',
        description: 'Plant-based certified cruelty-free facial oils and serums',
        website: 'https://aurabotanicals.example.com',
        budgetRange: '$500 - $2,000',
        goals: 'Grow organic community engagement with micro-creators',
      });
    expect(profRes.status).toBe(200);
    expect(profRes.body.profile.profileComplete).toBe(true);

    // 3. Enter Free-text campaign idea for AI structuring
    const aiRes = await request(app)
      .post('/api/v1/campaigns/ai-draft')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        rawInput: 'Looking for 2 creators to review our calming lavender face mist for evening routines.',
      });
    expect(aiRes.status).toBe(200);
    expect(aiRes.body.structuredBrief).toBeDefined();
    expect(aiRes.body.fallback).toBe(false);

    // 4. Save intermediate draft with client edits
    const draftRes = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        title: 'Calming Lavender Face Mist Launch',
        category: 'Clean Beauty & Skincare',
        rawInput: 'Looking for 2 creators to review our calming lavender face mist for evening routines.',
        goals: 'Generate 40k views and highlight soothing organic ingredients',
        targetAudience: 'Mindful evening skincare enthusiasts aged 20-35',
        deliverables: '1 Instagram Reel + 1 Story with discount code',
        timeline: '21 days',
        budget: '$650 per creator',
        requirements: 'Must show mist texture and evening wind-down routine',
        aiStructured: true,
      });
    expect(draftRes.status).toBe(201);
    expect(draftRes.body.status).toBe('draft');
    campaignId = draftRes.body.id;

    // 5. Publish campaign (transitions to active and triggers matching)
    const pubRes = await request(app)
      .post(`/api/v1/campaigns/${campaignId}/publish`)
      .set('Authorization', `Bearer ${brandToken}`);
    expect(pubRes.status).toBe(200);
    expect(pubRes.body.status).toBe('active');
  });

  it('TC-E2E-03: J-2 Creator Journey: Register -> Complete Profile -> Feed & Fit Indicator (Steps 1-6)', async () => {
    // 1. Creator Registration
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: creatorEmail,
        password,
        role: 'creator',
      });
    expect(regRes.status).toBe(201);
    creatorToken = regRes.body.token;
    creatorId = regRes.body.user.id;

    // 2. Complete Creator Profile
    const profRes = await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        displayName: 'Aria Bennett',
        niche: 'Clean Beauty & Skincare',
        platforms: [{ name: 'TikTok', handle: '@ariaskin', followers: 38000 }],
        audienceSize: 38000,
        contentStyle: 'Evening unwind routines and clean ingredient deep-dives',
        collaborationPrefs: 'Paid partnerships and honest product gifted trials',
        bio: 'Sharing intentional daily skincare rituals.',
      });
    expect(profRes.status).toBe(200);
    creatorProfileId = profRes.body.profile.id;

    // 3. Browse Campaign Feed and filter by category
    const feedRes = await request(app)
      .get('/api/v1/campaigns?category=Clean+Beauty+%26+Skincare')
      .set('Authorization', `Bearer ${creatorToken}`);
    expect(feedRes.status).toBe(200);
    expect(feedRes.body.campaigns.some((c: any) => c.id === campaignId)).toBe(true);

    // 4. View Campaign Detail with Brand Profile and Match Indicator
    const detailRes = await request(app)
      .get(`/api/v1/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${creatorToken}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.brand.brandProfile.companyName).toBe('Aura Botanicals');

    // 5. View Brand Objective Trust Indicators
    const brandRes = await request(app)
      .get(`/api/v1/brands/${brandId}`)
      .set('Authorization', `Bearer ${creatorToken}`);
    expect(brandRes.status).toBe(200);
    expect(brandRes.body.companyName).toBe('Aura Botanicals');
  });

  it('TC-E2E-04: J-2 Creator Journey: Apply -> Confirm Invitation -> Message -> Complete (Steps 7-10)', async () => {
    // 1. Creator applies with standardized pitchNote
    const applyRes = await request(app)
      .post(`/api/v1/campaigns/${campaignId}/apply`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        pitchNote: 'I would love to feature your Calming Lavender Face Mist in my Sunday night unwind routine video!',
      });
    expect(applyRes.status).toBe(201);
    expect(applyRes.body.status).toBe('pending');
    applicationId = applyRes.body.id;

    // 2. Track application on creator dashboard
    const dashRes = await request(app)
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${creatorToken}`);
    expect(dashRes.status).toBe(200);
    expect(dashRes.body.applications.some((a: any) => a.id === applicationId)).toBe(true);
  });

  it('TC-E2E-02: J-1 Brand Journey: Review Matches/Signals -> Accept -> Lifecycle -> Close (Steps 6-13)', async () => {
    // 1. Brand views matched creators with fit explanations and disclaimer
    const matchRes = await request(app)
      .get(`/api/v1/campaigns/${campaignId}/matches`)
      .set('Authorization', `Bearer ${brandToken}`);
    expect(matchRes.status).toBe(200);
    expect(matchRes.body.matches.length).toBeGreaterThan(0);
    expect(matchRes.body.disclaimer).toBe(MANDATORY_TRUST_DISCLAIMER);

    // 2. Brand views creator trust signals with non-verdict compliance
    const trustRes = await request(app)
      .get(`/api/v1/creators/${creatorProfileId}/trust-signals`)
      .set('Authorization', `Bearer ${brandToken}`);
    expect(trustRes.status).toBe(200);
    expect(trustRes.body.disclaimer).toBe(MANDATORY_TRUST_DISCLAIMER);

    // 3. Brand reviews campaign applications and accepts Aria Bennett
    const appsRes = await request(app)
      .get(`/api/v1/campaigns/${campaignId}/applications`)
      .set('Authorization', `Bearer ${brandToken}`);
    expect(appsRes.status).toBe(200);
    expect(appsRes.body.applications.some((a: any) => a.id === applicationId)).toBe(true);

    const acceptRes = await request(app)
      .post(`/api/v1/applications/${applicationId}/decision`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ decision: 'accepted' });
    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.status).toBe('accepted');
    expect(acceptRes.body.collaboration.status).toBe('invited');
    collaborationId = acceptRes.body.collaboration.id;

    // 4. Creator confirms invitation (invited -> accepted)
    const confirmRes = await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ status: 'accepted' });
    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.status).toBe('accepted');

    // 5. Activate collaboration (accepted -> in_progress)
    const actRes = await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ status: 'in_progress' });
    expect(actRes.status).toBe(200);
    expect(actRes.body.status).toBe('in_progress');

    // 6. Exchange messages in collaboration thread
    await request(app)
      .post(`/api/v1/collaborations/${collaborationId}/messages`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ content: 'Product received! Filming the Reel tomorrow.' });

    await request(app)
      .post(`/api/v1/collaborations/${collaborationId}/messages`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ content: 'Sounds great Aria, looking forward to it!' });

    const threadRes = await request(app)
      .get(`/api/v1/collaborations/${collaborationId}/messages`)
      .set('Authorization', `Bearer ${brandToken}`);
    expect(threadRes.body.messages.length).toBe(2);

    // 7. Deliverable submitted and marked complete
    await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ deliverableDelivered: true });

    const completeRes = await request(app)
      .put(`/api/v1/collaborations/${collaborationId}/status`)
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ status: 'completed' });
    expect(completeRes.status).toBe(200);
    expect(completeRes.body.status).toBe('completed');

    // 8. Brand closes campaign
    const closeRes = await request(app)
      .post(`/api/v1/campaigns/${campaignId}/close`)
      .set('Authorization', `Bearer ${brandToken}`);
    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('closed');
  });
});
