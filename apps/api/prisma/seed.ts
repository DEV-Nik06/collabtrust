import { PrismaClient, Role, CampaignStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seed...');

  // Clean existing seed data
  await prisma.message.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.application.deleteMany();
  await prisma.match.deleteMany();
  await prisma.trustSignal.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.brandProfile.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // 1. Create Brand User & Profile
  const brandUser = await prisma.user.create({
    data: {
      email: 'brand@ecoglow.com',
      passwordHash,
      role: Role.brand,
      tokenVersion: 0,
      brandProfile: {
        create: {
          companyName: 'EcoGlow Skincare',
          category: 'Beauty & Skincare',
          description: 'Sustainable, cruelty-free botanical skincare for everyday wellness.',
          website: 'https://ecoglow.example.com',
          budgetRange: '$500 - $2,500',
          goals: 'Build awareness for organic summer skincare lineup with micro-creators.',
          profileComplete: true,
        },
      },
    },
    include: {
      brandProfile: true,
    },
  });

  // 2. Create Creator Users & Profiles
  const creatorUser1 = await prisma.user.create({
    data: {
      email: 'alex@creators.example.com',
      passwordHash,
      role: Role.creator,
      tokenVersion: 0,
      creatorProfile: {
        create: {
          displayName: 'Alex Rivera',
          niche: 'Clean Beauty & Wellness',
          platforms: [
            { platform: 'instagram', handle: '@alexrivera_glow', followers: 32000, avgLikes: 1400 },
            { platform: 'tiktok', handle: '@alexglows', followers: 48000, avgLikes: 3500 },
          ],
          audienceSize: 48000,
          contentStyle: 'Short-form educational tutorials, authentic unfiltered product reviews, routine breakdowns.',
          collaborationPrefs: 'Gifted + paid partnerships, dedicated Reels/TikTok videos.',
          bio: 'Esthetician and mindful living creator passionate about clean ingredients.',
          profileComplete: true,
        },
      },
    },
    include: {
      creatorProfile: true,
    },
  });

  const creatorUser2 = await prisma.user.create({
    data: {
      email: 'maya@creators.example.com',
      passwordHash,
      role: Role.creator,
      tokenVersion: 0,
      creatorProfile: {
        create: {
          displayName: 'Maya Patel',
          niche: 'Sustainable Lifestyle',
          platforms: [
            { platform: 'instagram', handle: '@mayalivinggreen', followers: 21000, avgLikes: 950 },
          ],
          audienceSize: 21000,
          contentStyle: 'Minimalist aesthetic flatlays, sustainable swaps, in-depth blog guides.',
          collaborationPrefs: 'Sponsored carousels, authentic brand ambassadorships.',
          bio: 'Zero-waste advocate showing that eco-friendly habits can be simple and elegant.',
          profileComplete: true,
        },
      },
    },
    include: {
      creatorProfile: true,
    },
  });

  // 3. Create Sample Active Campaign
  const campaign = await prisma.campaign.create({
    data: {
      brandId: brandUser.id,
      title: 'Summer Glow Serum Launch',
      category: 'Beauty & Skincare',
      rawInput: 'We want 2-3 clean beauty creators to review our new Vitamin C glow serum on TikTok/IG.',
      goals: 'Generate 50k impressions and showcase clean ingredient breakdown.',
      targetAudience: 'Women aged 18-34 interested in clean cosmetics and dermatological wellness.',
      deliverables: '1 dedicated Instagram Reel + 1 TikTok video with product link in bio.',
      timeline: '4 weeks from product receipt',
      budget: '$800 - $1,500',
      requirements: 'Must be verified clean beauty or skincare niche. No competing brand mentions.',
      status: CampaignStatus.active,
      aiStructured: true,
    },
  });

  // 4. Create Sample Match Result with transparent advisory rationale
  if (creatorUser1.creatorProfile) {
    await prisma.match.create({
      data: {
        campaignId: campaign.id,
        creatorProfileId: creatorUser1.creatorProfile.id,
        score: 92.5,
        explanation: 'Strong audience overlap in Clean Beauty, high organic engagement rate (4.2%), and demonstrated expertise in skincare ingredient analysis.',
        factors: {
          nicheFit: 0.95,
          audienceMatch: 0.90,
          engagementQuality: 0.92,
        },
        criteriaHash: 'hash_summer_glow_v1',
      },
    });

    // 5. Add Advisory Trust Signal
    await prisma.trustSignal.create({
      data: {
        creatorProfileId: creatorUser1.creatorProfile.id,
        signalType: 'ENGAGEMENT_CONSISTENCY',
        signalValue: 'Consistent engagement patterns across 90-day window with organic comment-to-like distribution.',
        severity: 'info',
        metadata: { ratio: 0.042, windowDays: 90 },
      },
    });

    // 6. Create Sample Pending Application from Alex Rivera
    await prisma.application.create({
      data: {
        campaignId: campaign.id,
        creatorProfileId: creatorUser1.creatorProfile.id,
        pitchNote: 'I love clean botanical serums! Would love to feature your Vitamin C glow serum on my weekly clean beauty routine reel and TikTok tutorial.',
        status: 'pending',
      },
    });
  }

  console.log('[Seed] Database successfully seeded:');
  console.log(`- 1 Brand User: brand@ecoglow.com (pw: Password123!)`);
  console.log(`- 2 Creator Users: alex@creators.example.com, maya@creators.example.com (pw: Password123!)`);
  console.log(`- 1 Active Campaign: "${campaign.title}"`);
}

main()
  .catch((e) => {
    console.error('[Seed] Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
