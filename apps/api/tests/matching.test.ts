import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';
import { MANDATORY_TRUST_DISCLAIMER } from '@collabtrust/shared';

const app = createApp();

describe('Matching & Trust Signal API (TC-MATCH-01 to TC-MATCH-09, TC-TRUST-01 to TC-TRUST-07)', () => {
  const brandEmail = `match_brand_${Date.now()}@example.com`;
  const otherBrandEmail = `match_other_${Date.now()}@example.com`;
  const creatorEmail = `match_creator_${Date.now()}@example.com`;
  const password = 'Password123!';

  let brandToken = '';
  let brandId = '';
  let otherBrandToken = '';
  let creatorToken = '';
  let creatorProfileId = '';
  let activeCampaignId = '';
  let emptyCampaignId = '';

  beforeAll(async () => {
    // 1. Register brand
    const bRes = await request(app).post('/api/v1/auth/register').send({
      email: brandEmail,
      password,
      role: 'brand',
    });
    brandToken = bRes.body.token;
    brandId = bRes.body.user.id;

    // 2. Register other brand
    const oRes = await request(app).post('/api/v1/auth/register').send({
      email: otherBrandEmail,
      password,
      role: 'brand',
    });
    otherBrandToken = oRes.body.token;

    // 3. Register creator
    const cRes = await request(app).post('/api/v1/auth/register').send({
      email: creatorEmail,
      password,
      role: 'creator',
    });
    creatorToken = cRes.body.token;

    // 4. Setup creator profile
    const profRes = await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        displayName: 'Sora Tanaka',
        niche: 'Sustainable Living & Zero Waste',
        platforms: [{ name: 'Instagram', handle: '@soraliving', followers: 28000 }],
        audienceSize: 28000,
        contentStyle: 'Mindful aesthetic carousels',
        bio: 'Zero-waste lifestyle tips and sustainable home routines.',
      });
    creatorProfileId = profRes.body.profile.id;

    // 5. Create and publish campaign
    const campRes = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        title: 'Zero Waste Home Essentials Campaign',
        category: 'Sustainable Living',
        goals: 'Promote eco kitchen essentials',
        targetAudience: 'Conscious home shoppers',
        deliverables: '1 Carousel + 2 Stories',
        timeline: '14 days',
        budget: '$600',
        requirements: 'Must feature authentic daily use in sustainable kitchen setup',
      });
    activeCampaignId = campRes.body.id;

    await request(app)
      .post(`/api/v1/campaigns/${activeCampaignId}/publish`)
      .set('Authorization', `Bearer ${brandToken}`);

    // 6. Create empty campaign with rare category for empty state test
    const emptyCampRes = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        title: 'Deep Sea Exploration Drone Launch',
        category: 'Marine Robotics',
        goals: 'Find commercial robotics pilots',
        targetAudience: 'Marine engineers',
        deliverables: '1 Deep Sea Video',
        timeline: '60 days',
        budget: '$10000',
        requirements: 'Must have submarine piloting experience',
      });
    emptyCampaignId = emptyCampRes.body.id;
  });

  afterAll(async () => {
    await prisma.match.deleteMany({
      where: { campaignId: { in: [activeCampaignId, emptyCampaignId] } },
    });
    await prisma.campaign.deleteMany({
      where: { brandId: { in: [brandId] } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: [brandEmail, otherBrandEmail, creatorEmail] } },
    });
    await prisma.$disconnect();
  });

  it('TC-MATCH-01: Creator Matching Generation', async () => {
    const res = await request(app)
      .get(`/api/v1/campaigns/${activeCampaignId}/matches`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.matches).toBeDefined();
    expect(res.body.matches.length).toBeGreaterThan(0);
    expect(res.body.matches[0].score).toBeGreaterThan(50);
  });

  it('TC-MATCH-06: Brand Matches Ranking & Fit Factors', async () => {
    const res = await request(app)
      .get(`/api/v1/campaigns/${activeCampaignId}/matches`)
      .set('Authorization', `Bearer ${brandToken}`);

    // Verify ordering by score descending
    const scores = res.body.matches.map((m: any) => m.score);
    const sorted = [...scores].sort((a, b) => b - a);
    expect(scores).toEqual(sorted);

    // Verify fit factors included
    const firstMatch = res.body.matches[0];
    expect(firstMatch.factors).toBeDefined();
  });

  it('TC-MATCH-07: Creator Pre-Computed Match Indicator', async () => {
    const res = await request(app)
      .get(`/api/v1/campaigns/${activeCampaignId}`)
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.matchIndicator).toBeDefined();
    expect(res.body.matchIndicator.score).toBeDefined();
  });

  it('TC-MATCH-02: Match Explanation Presence', async () => {
    const res = await request(app)
      .get(`/api/v1/campaigns/${activeCampaignId}/matches`)
      .set('Authorization', `Bearer ${brandToken}`);

    const firstMatch = res.body.matches[0];
    expect(firstMatch.explanation).toBeDefined();
    expect(typeof firstMatch.explanation).toBe('string');
    expect(firstMatch.explanation.length).toBeGreaterThan(15);
  });

  it('TC-MATCH-03: Zero Match Empty State', async () => {
    const res = await request(app)
      .get(`/api/v1/campaigns/${emptyCampaignId}/matches`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.matches).toEqual([]);
    expect(res.body.message).toContain('No matching creators found');
  });

  it('TC-MATCH-04: Zero Autonomous Outreach on Match', async () => {
    // Verify that retrieving matches does not generate automated applications or messages
    const apps = await prisma.application.findMany({
      where: { campaignId: activeCampaignId },
    });
    expect(apps.length).toBe(0);

    const collabs = await prisma.collaboration.findMany({
      where: { campaignId: activeCampaignId },
    });
    expect(collabs.length).toBe(0);
  });

  it('TC-MATCH-05: Match Cache Reuse & Refresh Invalidation', async () => {
    // 1. Initial query
    const res1 = await request(app)
      .get(`/api/v1/campaigns/${activeCampaignId}/matches`)
      .set('Authorization', `Bearer ${brandToken}`);
    const hash1 = res1.body.matches[0].criteriaHash;

    // 2. Trigger refresh
    const refreshRes = await request(app)
      .post('/api/v1/matches/refresh')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({ campaignId: activeCampaignId });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.message).toContain('refreshed successfully');

    // 3. Subsequent query has updated hash
    const res2 = await request(app)
      .get(`/api/v1/campaigns/${activeCampaignId}/matches`)
      .set('Authorization', `Bearer ${brandToken}`);
    const hash2 = res2.body.matches[0].criteriaHash;

    expect(hash2).toContain('refresh');
    expect(hash2).not.toBe(hash1);
  });

  it('TC-MATCH-08: Manual Creator Search & Filtering', async () => {
    const res = await request(app)
      .get('/api/v1/creators?niche=Sustainable')
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.creators).toBeDefined();
    expect(res.body.creators.length).toBeGreaterThan(0);
    expect(res.body.creators.some((c: any) => c.displayName === 'Sora Tanaka')).toBe(true);
  });

  it('TC-MATCH-09: Profile Insight Agent Summary', async () => {
    const res = await request(app)
      .get(`/api/v1/creators/${creatorProfileId}/insights`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
    expect(res.body.contentHighlights).toBeDefined();
    expect(res.body.audienceFitNotes).toBeDefined();
    expect(res.body.advisoryNote).toBe(MANDATORY_TRUST_DISCLAIMER);
  });

  it('TC-TRUST-07: Trust Signal Access Control', async () => {
    // 1. Unauthenticated request -> 401
    const unauthRes = await request(app).get(`/api/v1/creators/${creatorProfileId}/trust-signals`);
    expect(unauthRes.status).toBe(401);

    // 2. Creator request -> 403 Forbidden (brand only)
    const creatorRes = await request(app)
      .get(`/api/v1/creators/${creatorProfileId}/trust-signals`)
      .set('Authorization', `Bearer ${creatorToken}`);
    expect(creatorRes.status).toBe(403);
    expect(creatorRes.body.code).toBe('FORBIDDEN');
  });

  it('TC-TRUST-01: Trust Signal Observational Format', async () => {
    const res = await request(app)
      .get(`/api/v1/creators/${creatorProfileId}/trust-signals`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.signals).toBeDefined();
    expect(res.body.signals.length).toBeGreaterThan(0);
    expect(res.body.disclaimer).toBeDefined();
  });

  it('TC-TRUST-03: Mandatory Disclaimer Verification', async () => {
    const res = await request(app)
      .get(`/api/v1/creators/${creatorProfileId}/trust-signals`)
      .set('Authorization', `Bearer ${brandToken}`);

    // Verbatim mandatory disclaimer check (TC-TRUST-03)
    expect(res.body.disclaimer).toBe(MANDATORY_TRUST_DISCLAIMER);
  });

  it('TC-TRUST-05: Trust Signal Severity Tagging', async () => {
    const res = await request(app)
      .get(`/api/v1/creators/${creatorProfileId}/trust-signals`)
      .set('Authorization', `Bearer ${brandToken}`);

    // Valid severity tagging (TC-TRUST-05)
    const validSeverities = ['info', 'note', 'anomaly'];
    for (const signal of res.body.signals) {
      expect(validSeverities).toContain(signal.severity);
    }
  });

  it('TC-TRUST-02: Non-Verdict Compliance Check (No prohibited fraud terms)', async () => {
    const res = await request(app)
      .get(`/api/v1/creators/${creatorProfileId}/trust-signals`)
      .set('Authorization', `Bearer ${brandToken}`);

    const prohibitedPatterns = [
      /\bfake\b/i,
      /\bguaranteed fraud\b/i,
      /\bcertified authentic\b/i,
      /\b100% fraudulent\b/i,
      /\bfraud confirmed\b/i,
    ];

    for (const signal of res.body.signals) {
      for (const pattern of prohibitedPatterns) {
        expect(signal.signalValue).not.toMatch(pattern);
      }
    }
  });

  it('TC-TRUST-04: Trust Signal Groundedness & Expansion Metadata', async () => {
    const res = await request(app)
      .get(`/api/v1/creators/${creatorProfileId}/trust-signals`)
      .set('Authorization', `Bearer ${brandToken}`);

    const signalsWithMeta = res.body.signals.filter((s: any) => s.metadata !== null);
    expect(signalsWithMeta.length).toBeGreaterThan(0);
    expect(signalsWithMeta[0].metadata.selfReported).toBe(true);
  });

  it('TC-TRUST-06: Brand Objective Trust Indicators', async () => {
    const res = await request(app)
      .get(`/api/v1/brands/${brandId}`)
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.completedCampaigns).toBeDefined();
    expect(typeof res.body.completedCampaigns).toBe('number');
  });
});
