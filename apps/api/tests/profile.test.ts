import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';

const app = createApp();

describe('Profile API (TC-PROF-01 to TC-PROF-08)', () => {
  const brandEmail = `prof_brand_${Date.now()}@example.com`;
  const creatorEmail = `prof_creator_${Date.now()}@example.com`;
  const password = 'Password123!';

  let brandToken = '';
  let brandId = '';
  let creatorToken = '';
  let creatorId = '';

  beforeAll(async () => {
    // 1. Register brand
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
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [brandEmail, creatorEmail] } },
    });
    await prisma.$disconnect();
  });

  it('TC-PROF-01: Brand Profile Creation', async () => {
    const res = await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        companyName: 'Lumina Skincare',
        category: 'Clean Cosmetics',
        description: 'Clean, botanical active serums',
        website: 'https://luminaskincare.example.com',
        budgetRange: '$1,000 - $3,000',
        goals: 'Grow organic micro-creator presence on TikTok',
      });

    expect(res.status).toBe(200);
    expect(res.body.profile).toBeDefined();
    expect(res.body.profile.companyName).toBe('Lumina Skincare');
    expect(res.body.profile.profileComplete).toBe(true);
  });

  it('TC-PROF-05: Profile Timestamp Auto-Update', async () => {
    const res = await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        companyName: 'Lumina Skincare',
        category: 'Clean Cosmetics',
        description: 'Clean, botanical active serums with updated timestamp',
      });

    expect(res.status).toBe(200);
    expect(res.body.profile.updatedAt).toBeDefined();
  });

  it('TC-PROF-03: Brand Profile Update', async () => {
    const res = await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${brandToken}`)
      .send({
        companyName: 'Lumina Skincare International',
        category: 'Clean Cosmetics & Fragrance',
        description: 'Updated international bio',
        website: 'https://lumina.example.com',
        budgetRange: '$2,000 - $5,000',
        goals: 'Expand globally',
      });

    expect(res.status).toBe(200);
    expect(res.body.profile.companyName).toBe('Lumina Skincare International');
    expect(res.body.profile.budgetRange).toBe('$2,000 - $5,000');
  });

  it('TC-PROF-02: Creator Profile Creation', async () => {
    const createRes = await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        displayName: 'Jordan Lee',
        niche: 'Sustainable Fashion',
        platforms: [
          { name: 'Instagram', handle: '@jordan_sustainable', followers: 12500 },
          { name: 'TikTok', handle: '@jordanrecycles', followers: 24000 },
        ],
        audienceSize: 36500,
        contentStyle: 'Upcycling thrift finds and sustainable outfit routines',
        collaborationPrefs: 'Gifted + sponsored videos',
        bio: 'Sharing mindful fashion choices everyday.',
      });

    expect(createRes.status).toBe(200);
    expect(createRes.body.profile.displayName).toBe('Jordan Lee');
    expect(createRes.body.profile.profileComplete).toBe(true);
  });

  it('TC-PROF-06: Creator Profile Update', async () => {
    const updateRes = await request(app)
      .put('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        displayName: 'Jordan Lee (Eco-Stylist)',
        niche: 'Sustainable Fashion & Minimalism',
        platforms: [
          { name: 'Instagram', handle: '@jordan_sustainable', followers: 15000 },
        ],
        audienceSize: 15000,
        bio: 'Updated bio highlighting conscious living.',
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.profile.displayName).toBe('Jordan Lee (Eco-Stylist)');
  });

  it('TC-PROF-04: Creator Views Brand Public Profile', async () => {
    const res = await request(app)
      .get(`/api/v1/brands/${brandId}`)
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.companyName).toBe('Lumina Skincare International');
    expect(res.body.category).toBe('Clean Cosmetics & Fragrance');
    // Ensure sensitive fields (passwords, tokenVersion, email) are omitted
    expect(res.body.passwordHash).toBeUndefined();
    expect(res.body.tokenVersion).toBeUndefined();
  });

  it('TC-PROF-07: Brand Views Creator Public Profile', async () => {
    const res = await request(app)
      .get(`/api/v1/creators/${creatorId}`)
      .set('Authorization', `Bearer ${brandToken}`);

    expect(res.status).toBe(200);
    expect(res.body.displayName).toBe('Jordan Lee (Eco-Stylist)');
    expect(res.body.niche).toBe('Sustainable Fashion & Minimalism');
    expect(res.body.platforms).toBeDefined();
    expect(res.body.passwordHash).toBeUndefined();
  });

  it('TC-PROF-08: Profile Completeness Guidance (GET /api/v1/users/me/profile)', async () => {
    const res = await request(app)
      .get('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.profile).toBeDefined();
    expect(res.body.profile.displayName).toBe('Jordan Lee (Eco-Stylist)');
    expect(res.body.profile.profileComplete).toBe(true);
  });
});
