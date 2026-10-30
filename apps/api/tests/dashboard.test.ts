import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';

const app = createApp();

describe('Dashboards & Navigation API (TC-DASH-01 to TC-DASH-04)', () => {
  const brandEmail = `dash_brand_${Date.now()}@example.com`;
  const creatorEmail = `dash_creator_${Date.now()}@example.com`;
  const emptyBrandEmail = `dash_empty_brand_${Date.now()}@example.com`;
  const password = 'Password123!';

  let brandToken = '';
  let brandId = '';
  let creatorToken = '';
  let creatorId = '';
  let emptyBrandToken = '';

  beforeAll(async () => {
    // 1. Register active brand
    const bRes = await request(app).post('/api/v1/auth/register').send({
      email: brandEmail,
      password,
      role: 'brand',
    });
    brandToken = bRes.body.token;
    brandId = bRes.body.user.id;

    // 2. Register creator
    const cRes = await request(app).post('/api/v1/auth/register').send({
      email: creatorEmail,
      password,
      role: 'creator',
    });
    creatorToken = cRes.body.token;
    creatorId = cRes.body.user.id;

    await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        displayName: 'Kai Jackson',
        niche: 'Fitness & Recovery',
        platforms: [{ name: 'TikTok', handle: '@kaifit', followers: 22000 }],
        audienceSize: 22000,
      });

    // 3. Register empty brand
    const ebRes = await request(app).post('/api/v1/auth/register').send({
      email: emptyBrandEmail,
      password,
      role: 'brand',
    });
    emptyBrandToken = ebRes.body.token;

    // 4. Create campaign under active brand
    const campRes = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        title: 'Electrolyte Hydration Pack Promotion',
        category: 'Fitness & Wellness',
        goals: 'Drive trial',
        targetAudience: 'Runners and gym enthusiasts',
        deliverables: '1 Reel',
        timeline: '14 days',
        budget: '$400',
        requirements: 'Demonstrate pre/post workout mix',
      });
    const campId = campRes.body.id;

    await request(app)
      .post(`/api/v1/campaigns/${campId}/publish`)
      .set('Authorization', `Bearer ${brandToken}`);

    // Creator applies
    await request(app)
      .post(`/api/v1/campaigns/${campId}/apply`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ pitchNote: 'Active trail runner interested in electrolyte reviews!' });
  });

  afterAll(async () => {
    await prisma.application.deleteMany();
    await prisma.campaign.deleteMany({
      where: { brandId: { in: [brandId] } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: [brandEmail, creatorEmail, emptyBrandEmail] } },
    });
    await prisma.$disconnect();
  });

  it('TC-DASH-01: Brand Dashboard Rendering', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('brand');
    expect(res.body.metrics).toBeDefined();
    expect(res.body.metrics.totalCampaigns).toBeGreaterThanOrEqual(1);
    expect(res.body.metrics.activeCampaignsCount).toBeGreaterThanOrEqual(1);
    expect(res.body.metrics.pendingApplicationsCount).toBeGreaterThanOrEqual(1);
    expect(res.body.activeCampaigns).toBeDefined();
  });

  it('TC-DASH-02: Creator Dashboard Rendering', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('creator');
    expect(res.body.metrics).toBeDefined();
    expect(res.body.applications).toBeDefined();
    expect(res.body.applications.length).toBeGreaterThanOrEqual(1);
    expect(res.body.matchedOpportunities).toBeDefined();
  });

  it('TC-DASH-03: Role-Tailored Navigation & Data Segregation', async () => {
    const brandDash = await request(app)
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${brandToken}`);

    const creatorDash = await request(app)
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${creatorToken}`);

    // Brand sees brand-specific campaign management and metrics
    expect(brandDash.body.role).toBe('brand');
    expect(brandDash.body.activeCampaigns).toBeDefined();
    expect(brandDash.body.matchedOpportunities).toBeUndefined();

    // Creator sees creator-specific matched opportunities and applications
    expect(creatorDash.body.role).toBe('creator');
    expect(creatorDash.body.matchedOpportunities).toBeDefined();
    expect(creatorDash.body.activeCampaigns).toBeUndefined();
  });

  it('TC-DASH-04: Dashboard Empty State Onboarding Indicators', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${emptyBrandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.emptyState).toBe(true);
    expect(res.body.onboardingAction).toBeDefined();
    expect(res.body.onboardingAction).toContain('Create your first campaign');
  });
});
