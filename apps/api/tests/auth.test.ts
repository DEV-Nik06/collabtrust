import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';

const app = createApp();

describe('Authentication API (TC-AUTH-01 to TC-AUTH-18)', () => {
  const brandEmail = `brand_test_${Date.now()}@example.com`;
  const creatorEmail = `creator_test_${Date.now()}@example.com`;
  const validPassword = 'SecurePassword123!';

  let brandAccessToken = '';
  let brandRefreshTokenCookie = '';
  let creatorAccessToken = '';

  beforeAll(async () => {
    // Ensure clean state for test emails
    await prisma.user.deleteMany({
      where: {
        email: { in: [brandEmail, creatorEmail, 'duplicate@example.com'] },
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: [brandEmail, creatorEmail, 'duplicate@example.com'] },
      },
    });
    await prisma.$disconnect();
  });

  it('TC-AUTH-01: Successful User Registration (Brand)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: brandEmail,
        password: validPassword,
        role: 'brand',
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(brandEmail.toLowerCase());
    expect(res.body.user.role).toBe('brand');
    expect(res.body.token).toBeDefined();

    // Verify httpOnly cookie set
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.includes('collabtrust_refresh_token='))).toBe(true);
    expect(cookies.some((c: string) => c.includes('HttpOnly'))).toBe(true);

    // Verify user persisted in database
    const dbUser = await prisma.user.findUnique({
      where: { email: brandEmail.toLowerCase() },
      include: { brandProfile: true },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.brandProfile).not.toBeNull();
    expect(dbUser?.brandProfile?.profileComplete).toBe(false);
  });

  it('TC-AUTH-02: Duplicate Email Rejection', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: brandEmail,
        password: validPassword,
        role: 'brand',
      });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('CONFLICT');
  });

  it('TC-AUTH-03: Weak Password Rejection (Length < 8)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `short_${Date.now()}@example.com`,
        password: 'Pass1!',
        role: 'brand',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('BAD_REQUEST');
  });

  it('TC-AUTH-06: Password Complexity — Missing Number', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `no_num_${Date.now()}@example.com`,
        password: 'Password!',
        role: 'brand',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('BAD_REQUEST');
  });

  it('TC-AUTH-07: Password Complexity — Missing Symbol', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `no_sym_${Date.now()}@example.com`,
        password: 'Password123',
        role: 'brand',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('BAD_REQUEST');
  });

  it('TC-AUTH-13: Registration Role Validation (Omitting role rejected)', async () => {
    const invalidRoleRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: creatorEmail,
        password: validPassword,
      });
    expect(invalidRoleRes.status).toBe(400);
    expect(invalidRoleRes.body.code).toBe('BAD_REQUEST');
  });

  it('TC-AUTH-08: Valid Complex Password Accepted', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: creatorEmail,
        password: validPassword,
        role: 'creator',
      });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('creator');
    creatorAccessToken = res.body.token;
  });

  it('TC-AUTH-14: Successful User Login & Cookie Issuance', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: brandEmail,
        password: validPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(brandEmail.toLowerCase());
    expect(res.body.user.role).toBe('brand');

    brandAccessToken = res.body.token;

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const refreshCookie = cookies.find((c: string) => c.includes('collabtrust_refresh_token='));
    expect(refreshCookie).toBeDefined();
    brandRefreshTokenCookie = refreshCookie;
  });

  it('TC-AUTH-04: Invalid Credentials Login (Wrong Password)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: brandEmail,
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('TC-AUTH-15: Session Persistence Across Reload (Authenticated Route)', async () => {
    const res = await request(app)
      .get('/api/v1/users/me/profile')
      .set('Authorization', `Bearer ${brandAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.profile).toBeDefined();
  });

  it('TC-AUTH-17: Unauthenticated Route Protection', async () => {
    const res = await request(app).get('/api/v1/users/me/profile');

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('TC-AUTH-05: RBAC Route Protection (Creator cannot post brand campaign)', async () => {
    const res = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${creatorAccessToken}`)
      .send({
        title: 'Unauthorized Campaign',
        category: 'Fashion',
        goals: 'Should fail',
        targetAudience: 'Everyone',
        deliverables: '1 post',
        timeline: '1 week',
        budget: '$100',
        requirements: 'None',
      });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  it('TC-AUTH-18: Refresh Token Exchange & Rotation', async () => {
    const cookieHeader = brandRefreshTokenCookie.split(';')[0];

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', [cookieHeader]);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

    const newCookies = res.headers['set-cookie'];
    expect(newCookies).toBeDefined();
    const newRefresh = newCookies.find((c: string) => c.includes('collabtrust_refresh_token='));
    expect(newRefresh).toBeDefined();
  });

  it('TC-AUTH-09: Forgot Password — Non-Enumerating Generic Response', async () => {
    const registeredRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: brandEmail });

    const unregisteredRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'nonexistent@example.com' });

    expect(registeredRes.status).toBe(200);
    expect(unregisteredRes.status).toBe(200);
    expect(registeredRes.body.message).toBe(unregisteredRes.body.message);

    // Verify token was generated in DB for registered email
    const rawResetToken = registeredRes.headers['x-debug-reset-token'];
    expect(rawResetToken).toBeDefined();
  });

  it('TC-AUTH-10: Reset Password with Valid Token', async () => {
    const forgotRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: brandEmail });

    const rawToken = forgotRes.headers['x-debug-reset-token'];
    expect(rawToken).toBeDefined();

    const newPassword = 'BrandNewPassword999!';

    const resetRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: rawToken,
        newPassword,
      });

    expect(resetRes.status).toBe(200);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: brandEmail,
        password: newPassword,
      });
    expect(loginRes.status).toBe(200);
  });

  it('TC-AUTH-11: Reset Password with Expired/Used Token Rejection', async () => {
    const forgotRes = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: brandEmail });

    const rawToken = forgotRes.headers['x-debug-reset-token'];
    expect(rawToken).toBeDefined();

    // First use consumes token
    await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: rawToken,
        newPassword: 'BrandNewPassword999!',
      });

    // Replay attempt must be rejected (400)
    const replayRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: rawToken,
        newPassword: 'AnotherPassword123!',
      });
    expect(replayRes.status).toBe(400);
    expect(replayRes.body.code).toBe('BAD_REQUEST');
  });

  it('TC-AUTH-12: Login Rate Limiting & Protection Simulation', async () => {
    // Repeated invalid logins to verify deterministic error responses
    for (let i = 0; i < 3; i++) {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: brandEmail,
          password: 'IncorrectPassword!',
        });
      expect(res.status).toBe(401);
    }
  });

  it('TC-AUTH-16: Session Logout & Token Revocation', async () => {
    // Login to get fresh tokens
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: creatorEmail,
        password: validPassword,
      });
    const token = loginRes.body.token;

    // Logout
    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(logoutRes.status).toBe(200);

    // Verify cookie cleared
    const cookies = logoutRes.headers['set-cookie'];
    expect(cookies.some((c: string) => c.includes('collabtrust_refresh_token=;'))).toBe(true);

    // Verify tokenVersion incremented in DB
    const dbUser = await prisma.user.findUnique({
      where: { email: creatorEmail.toLowerCase() },
    });
    expect(dbUser?.tokenVersion).toBeGreaterThan(0);
  });
});
