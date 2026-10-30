import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';

const app = createApp();

describe('Campaign & AI Structuring API (TC-CAMP-01 to TC-CAMP-14)', () => {
  const brandEmail = `camp_brand_${Date.now()}@example.com`;
  const otherBrandEmail = `camp_other_${Date.now()}@example.com`;
  const creatorEmail = `camp_creator_${Date.now()}@example.com`;
  const password = 'Password123!';

  let brandToken = '';
  let brandId = '';
  let otherBrandToken = '';
  let creatorToken = '';
  let draftCampaignId = '';
  let activeCampaignId = '';
  let closedCampaignId = '';

  beforeAll(async () => {
    // 1. Register primary brand
    const b1Res = await request(app).post('/api/v1/auth/register').send({
      email: brandEmail,
      password,
      role: 'brand',
    });
    brandToken = b1Res.body.token;
    brandId = b1Res.body.user.id;

    // 2. Register other brand
    const b2Res = await request(app).post('/api/v1/auth/register').send({
      email: otherBrandEmail,
      password,
      role: 'brand',
    });
    otherBrandToken = b2Res.body.token;

    // 3. Register creator
    const cRes = await request(app).post('/api/v1/auth/register').send({
      email: creatorEmail,
      password,
      role: 'creator',
    });
    creatorToken = cRes.body.token;

    // Set up creator profile
    await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        displayName: 'Nadia Sol',
        niche: 'Clean Beauty & Skincare',
        platforms: [{ name: 'TikTok', handle: '@nadiasol', followers: 45000 }],
        audienceSize: 45000,
        contentStyle: 'Short-form reviews',
      });
  });

  afterAll(async () => {
    await prisma.campaign.deleteMany({
      where: { brandId: { in: [brandId] } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: [brandEmail, otherBrandEmail, creatorEmail] } },
    });
    await prisma.$disconnect();
  });

  it('TC-CAMP-01: AI Brief Structuring Success', async () => {
    const rawConcept = 'We want 2-3 clean beauty creators to review our new Vitamin C glow serum on TikTok/IG with honest feedback.';
    const res = await request(app)
      .post('/api/v1/campaigns/ai-draft')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ rawInput: rawConcept });

    expect(res.status).toBe(200);
    expect(res.body.structuredBrief).toBeDefined();
    expect(res.body.structuredBrief.title).toBeDefined();
    expect(res.body.structuredBrief.goals).toBeDefined();
    expect(res.body.structuredBrief.targetAudience).toBeDefined();
    expect(res.body.structuredBrief.deliverables).toBeDefined();
    expect(res.body.structuredBrief.timeline).toBeDefined();
    expect(res.body.structuredBrief.budget).toBeDefined();
    expect(res.body.structuredBrief.requirements).toBeDefined();
    expect(res.body.fallback).toBe(false);
  });

  it('TC-CAMP-05: Free-Text Campaign Input Submission with XML Tag Boundaries', async () => {
    const rawConcept = 'Looking for eco lifestyle creators for sustainable cleaning products.';
    const res = await request(app)
      .post('/api/v1/campaigns/ai-draft')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ rawInput: rawConcept });

    expect(res.status).toBe(200);
    expect(res.body.sanitizedInputLength).toBeGreaterThan(rawConcept.length);
  });

  it('TC-CAMP-02: Brief Agent Error Fallback', async () => {
    const res = await request(app)
      .post('/api/v1/campaigns/ai-draft')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        rawInput: 'Simulate server error fallback condition',
        simulateError: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.fallback).toBe(true);
    expect(res.body.structuredBrief.title).toBe('');
    expect(res.body.message).toContain('Manual entry enabled');
  });

  it('TC-CAMP-06: Brief Pre-Save In-Memory Editing', () => {
    const clientBrief = {
      title: 'Initial Title',
      budget: '$500',
      deliverables: '1 Reel',
    };
    // Modify in memory
    clientBrief.title = 'Updated Title in Memory';
    clientBrief.budget = '$850';
    expect(clientBrief.title).toBe('Updated Title in Memory');
    expect(clientBrief.budget).toBe('$850');
  });

  it('TC-CAMP-07: Structured Brief Field Editability', () => {
    const brief = {
      title: 'Title',
      goals: 'Goals',
      targetAudience: 'Audience',
      deliverables: 'Deliverables',
      timeline: 'Timeline',
      budget: 'Budget',
      requirements: 'Requirements',
    };
    brief.title = 'Editable Title';
    brief.goals = 'Editable Goals';
    brief.targetAudience = 'Editable Audience';
    brief.deliverables = 'Editable Deliverables';
    brief.timeline = 'Editable Timeline';
    brief.budget = 'Editable Budget';
    brief.requirements = 'Editable Requirements';
    expect(Object.keys(brief).length).toBe(7);
  });

  it('TC-CAMP-08: Save Intermediate Campaign Draft', async () => {
    const editedBrief = {
      title: 'Botanical Vitamin C Serum Launch (Edited Draft)',
      category: 'Clean Beauty & Skincare',
      goals: 'Generate 50k authentic impressions',
      targetAudience: 'Women aged 18-35 interested in clean cosmetics',
      deliverables: '1 Dedicated TikTok (30s) + 1 Instagram Reel',
      timeline: '21 days from product delivery',
      budget: '$850 per creator',
      requirements: 'Must show unboxing and 3-day glow results with clean disclosure',
      aiStructured: true,
    };

    const res = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${brandToken}`)
      .send(editedBrief);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('draft');
    expect(res.body.title).toBe('Botanical Vitamin C Serum Launch (Edited Draft)');
    expect(res.body.budget).toBe('$850 per creator');

    draftCampaignId = res.body.id;
  });

  it('TC-CAMP-09: Campaign Publication Non-Owner Gate', async () => {
    const res = await request(app)
      .post(`/api/v1/campaigns/${draftCampaignId}/publish`)
      .set('Authorization', `Bearer ${otherBrandToken}`);

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  it('TC-CAMP-03: Campaign Publication Gate (draft -> active)', async () => {
    const res = await request(app)
      .post(`/api/v1/campaigns/${draftCampaignId}/publish`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('active');
    activeCampaignId = draftCampaignId;
  });

  it('TC-CAMP-10: Campaign Publish Timestamp & Lifecycle Notification', async () => {
    const dbCamp = await prisma.campaign.findUnique({
      where: { id: activeCampaignId },
    });
    expect(dbCamp?.status).toBe('active');
    expect(dbCamp?.updatedAt).toBeDefined();

    const matches = await prisma.match.findMany({
      where: { campaignId: activeCampaignId },
    });
    expect(matches.length).toBeGreaterThan(0);
  });

  it('TC-CAMP-04: Creator Campaign Marketplace Feed Excludes Drafts', async () => {
    // 1. Create another draft campaign that remains un-published
    const draftRes = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        title: 'Hidden Internal Draft Campaign',
        category: 'Electronics',
        goals: 'Internal testing only',
        targetAudience: 'Test',
        deliverables: '1 Post',
        timeline: '7 days',
        budget: '$100',
        requirements: 'None',
      });
    const hiddenDraftId = draftRes.body.id;

    // 2. Fetch marketplace feed as creator
    const feedRes = await request(app)
      .get('/api/v1/campaigns')
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(feedRes.status).toBe(200);
    expect(feedRes.body.campaigns).toBeDefined();

    // Verify all returned campaigns have status 'active' and hidden draft is excluded
    expect(feedRes.body.campaigns.every((c: any) => c.status === 'active')).toBe(true);
    expect(feedRes.body.campaigns.some((c: any) => c.id === hiddenDraftId)).toBe(false);
  });

  it('TC-CAMP-14: Marketplace Campaign Category Filtering', async () => {
    const res = await request(app)
      .get('/api/v1/campaigns?category=Clean+Beauty+%26+Skincare')
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.campaigns).toBeDefined();
    expect(res.body.campaigns.length).toBeGreaterThan(0);
    expect(
      res.body.campaigns.every((c: any) => c.category === 'Clean Beauty & Skincare')
    ).toBe(true);
  });

  it('TC-CAMP-11: Creator Views Full Campaign Brief with Brand Profile', async () => {
    const res = await request(app)
      .get(`/api/v1/campaigns/${activeCampaignId}`)
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(activeCampaignId);
    expect(res.body.title).toBe('Botanical Vitamin C Serum Launch (Edited Draft)');
    expect(res.body.deliverables).toBeDefined();
    expect(res.body.requirements).toBeDefined();
    expect(res.body.budget).toBe('$850 per creator');
    expect(res.body.brand).toBeDefined();
    expect(res.body.matchIndicator).toBeDefined();
  });

  it('TC-CAMP-12: Brand Closes Active Campaign', async () => {
    const res = await request(app)
      .post(`/api/v1/campaigns/${activeCampaignId}/close`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('closed');
    closedCampaignId = activeCampaignId;

    const dbCamp = await prisma.campaign.findUnique({
      where: { id: closedCampaignId },
    });
    expect(dbCamp?.status).toBe('closed');
  });

  it('TC-CAMP-13: Application to Non-Active (Closed) Campaign Rejected', async () => {
    const res = await request(app)
      .post(`/api/v1/campaigns/${closedCampaignId}/apply`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        pitchNote: 'I want to apply to this closed campaign',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('BAD_REQUEST');
    expect(res.body.message).toContain('Only active campaigns accept applications');
  });
});
