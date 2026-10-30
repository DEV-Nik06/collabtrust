const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '../apps/web/dist');
const SLIDES_FILE = path.join(__dirname, 'slides.html');
const OUTPUT_DIR = path.join(__dirname, '../demo-video');
const PORT = 4173;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Static HTTP Server for Web App & Slides
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('?');
  const reqPath = urlParts[0];

  if (reqPath.startsWith('/slides')) {
    fs.readFile(SLIDES_FILE, 'utf-8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading slides');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
    return;
  }

  let filePath = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading ' + reqPath);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

async function run() {
  server.listen(PORT);
  console.log(`[Server] Serving app and slides on http://localhost:${PORT}`);

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  // Helper to display on-screen demo captions
  const showBanner = async (title, subtitle) => {
    await page.evaluate(
      ({ title, subtitle }) => {
        let el = document.getElementById('demo-caption-overlay');
        if (!el) {
          el = document.createElement('div');
          el.id = 'demo-caption-overlay';
          el.style.position = 'fixed';
          el.style.bottom = '24px';
          el.style.left = '50%';
          el.style.transform = 'translateX(-50%)';
          el.style.zIndex = '999999';
          el.style.background = 'rgba(15, 23, 42, 0.94)';
          el.style.color = '#ffffff';
          el.style.padding = '12px 26px';
          el.style.borderRadius = '16px';
          el.style.boxShadow = '0 12px 30px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12)';
          el.style.fontFamily = 'Plus Jakarta Sans, Inter, system-ui, sans-serif';
          el.style.textAlign = 'center';
          el.style.pointerEvents = 'none';
          el.style.transition = 'all 0.3s ease';
          el.style.backdropFilter = 'blur(10px)';
          document.body.appendChild(el);
        }
        el.innerHTML = `
          <div style="font-size: 13px; font-weight: 800; letter-spacing: -0.01em; color: #818cf8;">${title}</div>
          <div style="font-size: 11px; font-weight: 500; color: #cbd5e1; margin-top: 3px;">${subtitle}</div>
        `;
      },
      { title, subtitle }
    );
  };

  // Mock State Variables
  let currentRole = 'brand';
  let collabStatus = 'invited';
  let messages = [
    {
      id: 'm1',
      senderRole: 'brand',
      content: 'Welcome to the campaign, Alex! Excited to partner on this review.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'm2',
      senderRole: 'creator',
      content: 'Thanks EcoGlow team! Looking forward to reviewing the green tea moisturizer.',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  // Intercept all API endpoints
  await page.route('**/api/v1/**', async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes('/auth/login')) {
      const postData = JSON.parse(route.request().postData() || '{}');
      currentRole = postData.email && postData.email.includes('alex') ? 'creator' : 'brand';
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock_jwt_token',
          user: {
            id: currentRole === 'brand' ? 'brand_1' : 'creator_1',
            email: currentRole === 'brand' ? 'brand@ecoglow.com' : 'alex@creators.example.com',
            role: currentRole,
            profileComplete: true,
          },
        }),
      });
    }

    if (url.includes('/users/me/profile')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ profile: { profileComplete: true } }),
      });
    }

    if (url.includes('/dashboard')) {
      if (currentRole === 'brand') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            role: 'brand',
            metrics: {
              totalCampaigns: 1,
              activeCampaignsCount: 1,
              pendingApplicationsCount: 1,
              activeCollaborationsCount: 1,
            },
            activeCampaigns: [
              {
                id: 'camp_1',
                title: 'Summer Glow Serum Launch',
                category: 'Beauty & Wellness',
                budget: '$500 - $1,200',
                status: 'active',
                createdAt: new Date().toISOString(),
                applications: [{ id: 'app_1' }],
                matches: [{ id: 'match_1' }],
              },
            ],
            pendingApplications: [
              {
                id: 'app_1',
                campaignId: 'camp_1',
                campaignTitle: 'Summer Glow Serum Launch',
                creatorProfileId: 'creator_1',
                displayName: 'Alex Rivera',
                niche: 'Clean Beauty & Wellness',
                pitchNote:
                  'I love clean botanical skincare! Would love to feature your Vitamin C serum on my weekly routine reel and tutorial.',
                status: 'pending',
                createdAt: new Date().toISOString(),
              },
            ],
            pendingApplicationsCount: 1,
            activeCollaborations: [
              {
                id: 'collab_1',
                status: collabStatus,
                campaign: { title: 'Summer Glow Serum Launch' },
                creatorProfile: { displayName: 'Alex Rivera', niche: 'Clean Beauty & Wellness' },
              },
            ],
            emptyState: false,
            onboardingAction: null,
          }),
        });
      } else {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            role: 'creator',
            metrics: {
              matchedOpportunitiesCount: 3,
              applicationsCount: 1,
              activeCollaborationsCount: 1,
            },
            matchedOpportunities: [
              {
                id: 'match_1',
                score: 94,
                explanation: 'High niche overlap in Clean Beauty with strong audience engagement.',
                campaign: {
                  id: 'camp_1',
                  title: 'Summer Glow Serum Launch',
                  category: 'Beauty & Wellness',
                  budget: '$500 - $1,200',
                },
              },
            ],
            applications: [
              {
                id: 'app_1',
                pitchNote: 'I love clean botanical skincare! Excited to feature this.',
                status: 'pending',
                createdAt: new Date().toISOString(),
                campaign: {
                  id: 'camp_1',
                  title: 'Summer Glow Serum Launch',
                  category: 'Beauty & Wellness',
                  budget: '$500 - $1,200',
                },
              },
            ],
            activeCollaborations: [
              {
                id: 'collab_1',
                status: collabStatus,
                campaign: { title: 'Summer Glow Serum Launch' },
              },
            ],
            emptyState: false,
            onboardingAction: null,
          }),
        });
      }
    }

    if (url.includes('/campaigns/ai-draft')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          structuredBrief: {
            title: 'Organic Green Tea Facial Moisturizer Product Review',
            goals: 'Generate verified authentic reviews and drive summer trial',
            targetAudience: 'Eco-conscious skincare enthusiasts aged 18-35',
            deliverables: '1 Instagram Reel (30-60s) + 2 Stories with link',
            timeline: '30 days from product arrival',
            budget: '$500 total budget',
            requirements: 'Genuine product unboxing, routine integration, honest disclosure',
          },
        }),
      });
    }

    if (method === 'POST' && url.endsWith('/campaigns')) {
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'camp_1' }),
      });
    }

    if (url.includes('/publish')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'active' }),
      });
    }

    if (url.includes('/campaigns/camp_1/matches') || url.includes('/matches/refresh')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          matches: [
            {
              id: 'match_1',
              score: 94.2,
              explanation:
                'High affinity in Clean Beauty & Wellness with 4.2% organic engagement rate and verified video creation history.',
              factors: {
                nicheFit: 0.96,
                audienceMatch: 0.92,
                engagementQuality: 0.94,
              },
              creator: {
                id: 'creator_1',
                displayName: 'Alex Rivera',
                niche: 'Clean Beauty & Wellness',
                audienceSize: 48000,
                platforms: [{ platform: 'Instagram', handle: '@alexrivera_glow' }],
              },
            },
            {
              id: 'match_2',
              score: 88.5,
              explanation:
                'Strong alignment in Sustainable Lifestyle with dedicated audience interested in eco-friendly routine swaps.',
              factors: {
                nicheFit: 0.90,
                audienceMatch: 0.86,
                engagementQuality: 0.89,
              },
              creator: {
                id: 'creator_2',
                displayName: 'Maya Patel',
                niche: 'Sustainable Lifestyle',
                audienceSize: 21000,
                platforms: [{ platform: 'Instagram', handle: '@mayalivinggreen' }],
              },
            },
          ],
        }),
      });
    }

    if (url.includes('/campaigns/camp_1/applications')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          applications: [
            {
              id: 'app_1',
              campaignId: 'camp_1',
              creatorProfileId: 'creator_1',
              displayName: 'Alex Rivera',
              niche: 'Clean Beauty & Wellness',
              pitchNote:
                'I love clean botanical skincare! Would love to feature your Vitamin C serum on my weekly routine reel and tutorial.',
              status: 'pending',
              createdAt: new Date().toISOString(),
              matchScore: 94.2,
              matchExplanation: 'High audience overlap in Clean Beauty',
            },
          ],
        }),
      });
    }

    if (url.includes('/applications/app_1/decision')) {
      collabStatus = 'invited';
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          applicationId: 'app_1',
          status: 'accepted',
          collaboration: { id: 'collab_1' },
        }),
      });
    }

    if (url.includes('/collaborations/collab_1/status')) {
      const data = JSON.parse(route.request().postData() || '{}');
      collabStatus = data.status || 'in_progress';
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: collabStatus }),
      });
    }

    if (url.includes('/collaborations/collab_1/messages')) {
      if (method === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}');
        const newMsg = {
          id: `m_${Date.now()}`,
          senderRole: currentRole,
          content: body.content,
          createdAt: new Date().toISOString(),
        };
        messages.push(newMsg);
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newMsg),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ messages }),
      });
    }

    if (url.includes('/collaborations/collab_1')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'collab_1',
          campaignId: 'camp_1',
          campaignTitle: 'Summer Glow Serum Launch',
          brandName: 'EcoGlow Organics',
          creatorName: 'Alex Rivera',
          status: collabStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
    }

    if (url.includes('/campaigns/camp_1')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'camp_1',
          title: 'Summer Glow Serum Launch',
          category: 'Beauty & Wellness',
          budget: '$500 - $1,200',
          status: 'active',
        }),
      });
    }

    if (url.includes('/campaigns')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          campaigns: [
            {
              id: 'camp_1',
              title: 'Summer Glow Serum Launch',
              category: 'Beauty & Wellness',
              budget: '$500 - $1,200',
              timeline: '4 weeks from receipt',
              deliverables: '1 Instagram Reel + 1 TikTok with #ad',
              goals: '50k verified impressions',
              requirements: 'Clean beauty or skincare niche',
              brand: { brandProfile: { companyName: 'EcoGlow Organics' } },
              matchIndicator: { score: 94, explanation: 'High profile fit for your clean beauty tutorial style' },
            },
            {
              id: 'camp_2',
              title: 'Ergonomic Split Mechanical Keyboard Showcase',
              category: 'Tech & Gaming',
              budget: '$750 fixed',
              timeline: '3 weeks',
              deliverables: '1 YouTube Short + Desk Setup Carousel',
              goals: 'Showcase wireless productivity',
              requirements: 'Tech/desk setup content creator',
              brand: { brandProfile: { companyName: 'KeyCraft Tech' } },
            },
          ],
        }),
      });
    }

    return route.continue();
  });

  console.log('[Playwright] Recording Extended 1.5+ Min End-to-End Walkthrough with Presentation Slides...');

  // --- SECTION 1: TITLE SLIDE (10s) ---
  await page.goto(`http://localhost:${PORT}/slides?slide=1`);
  await page.waitForTimeout(10000);

  // --- SECTION 2: PROBLEM & SOLUTION SLIDE (11s) ---
  await page.goto(`http://localhost:${PORT}/slides?slide=2`);
  await page.waitForTimeout(11000);

  // --- SECTION 3: LIVE APP - BRAND DASHBOARD & TOUR (12s) ---
  await page.goto(`http://localhost:${PORT}/dashboard`);
  await page.waitForTimeout(1000);
  await showBanner('Live Product Demo: Brand Dashboard', 'Reviewing active campaigns, pending applications, and key metrics');
  await page.waitForTimeout(3000);

  // Open 60s Tour
  const tourButton = page.locator('button:has-text("60s Evaluator Quick Tour")');
  if (await tourButton.isVisible()) {
    await tourButton.click();
    await page.waitForTimeout(4000);
    const gotItBtn = page.locator('button:has-text("Got it, let me explore!")');
    if (await gotItBtn.isVisible()) {
      await gotItBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  // --- SECTION 4: LIVE APP - AI BRIEF STRUCTURING AGENT (16s) ---
  await showBanner('AI Campaign Brief Agent in Action', 'Converting natural language concepts into structured, editable briefs');
  await page.click('a[href="/campaigns/new"]');
  await page.waitForTimeout(2000);

  // Click Preset
  const presetBtn = page.locator('button:has-text("Eco Skincare Launch")');
  if (await presetBtn.isVisible()) {
    await presetBtn.click();
    await page.waitForTimeout(2000);
  }

  // Click Structure with AI
  const structureBtn = page.locator('button:has-text("Structure with AI")');
  await structureBtn.click();
  await page.waitForTimeout(4000); // observe reasoning animation

  // Scroll down to show structured brief
  await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
  await page.waitForTimeout(3000);

  // Click Publish
  const publishBtn = page.locator('button:has-text("Publish Campaign & Discover Matches")');
  await publishBtn.click();
  await page.waitForTimeout(3000);

  // --- SECTION 5: LIVE APP - EXPLAINABLE MATCHING & TRUST SIGNALS (14s) ---
  await showBanner('Explainable Matching & Observational Trust Signals', 'Transparent fit scores, sub-factors, and evidence-based trust observations');
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollBy({ top: 250, behavior: 'smooth' }));
  await page.waitForTimeout(5000);

  // --- SECTION 6: SLIDE 3 - AI ARCHITECTURE & GUARDRAILS (11s) ---
  await page.goto(`http://localhost:${PORT}/slides?slide=3`);
  await page.waitForTimeout(11000);

  // --- SECTION 7: LIVE APP - CREATOR VIEW & SEARCH (14s) ---
  await page.goto(`http://localhost:${PORT}/dashboard`);
  await page.waitForTimeout(1000);
  await showBanner('Creator Experience & 1-Click Role Switcher', 'Seamless role segregation between Brand and Creator workspaces');
  const creatorSwitch = page.locator('button:has-text("Creator: Alex")');
  await creatorSwitch.click();
  await page.waitForTimeout(2500);

  // Explore Marketplace
  await showBanner('Creator Marketplace Feed', 'Real-time search and AI profile fit indicators');
  await page.click('a[href="/explore"]');
  await page.waitForTimeout(2500);

  const searchInput = page.locator('input[placeholder*="Search campaigns"]');
  if (await searchInput.isVisible()) {
    await searchInput.fill('serum');
    await page.waitForTimeout(2000);
    await searchInput.fill('');
    await page.waitForTimeout(1500);
  }

  // --- SECTION 8: SLIDE 4 - HUMAN-IN-THE-LOOP STATE MACHINE (11s) ---
  await page.goto(`http://localhost:${PORT}/slides?slide=4`);
  await page.waitForTimeout(11000);

  // --- SECTION 9: LIVE APP - COLLABORATION WORKSPACE & CHAT (16s) ---
  await page.goto(`http://localhost:${PORT}/dashboard`);
  await page.waitForTimeout(1000);
  const brandSwitch = page.locator('button:has-text("Brand: EcoGlow")');
  await brandSwitch.click();
  await page.waitForTimeout(1500);

  await showBanner('Collaboration Workspace Lifecycle', 'Milestone checklist, conflict gates, and live message exchange');
  const openCollabBtn = page.locator('a[href^="/collaborations/"]').first();
  if (await openCollabBtn.isVisible()) {
    await openCollabBtn.click();
    await page.waitForTimeout(2500);

    // Interactive checklist toggle
    const checkbox = page.locator('input[type="checkbox"]').nth(1);
    if (await checkbox.isVisible()) {
      await checkbox.click();
      await page.waitForTimeout(1500);
    }

    // Advance Status
    const advanceBtn = page.locator('button:has-text("In Progress"), button:has-text("Accept Partnership")').first();
    if (await advanceBtn.isVisible()) {
      await advanceBtn.click();
      await page.waitForTimeout(2000);
    }

    // Quick message reply in chat
    const quickReplyBtn = page.locator('button:has-text("Reviewed draft!")').first();
    if (await quickReplyBtn.isVisible()) {
      await quickReplyBtn.click();
      await page.waitForTimeout(1000);
      const sendBtn = page.locator('button:has-text("Send")');
      await sendBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  // --- SECTION 10: SLIDE 5 - TECHNICAL ARCHITECTURE & 76 TESTS (13s) ---
  await page.goto(`http://localhost:${PORT}/slides?slide=5`);
  await page.waitForTimeout(13000);

  console.log('[Playwright] Extended Walkthrough completed. Saving video...');
  await context.close();
  await browser.close();
  server.close();

  // Find the generated video file
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.webm'));
  if (files.length > 0) {
    // Sort by latest
    files.sort((a, b) => fs.statSync(path.join(OUTPUT_DIR, b)).mtimeMs - fs.statSync(path.join(OUTPUT_DIR, a)).mtimeMs);
    const webmFile = path.join(OUTPUT_DIR, files[0]);
    const mp4File = path.join(OUTPUT_DIR, 'collabtrust_demo_walkthrough.mp4');
    console.log(`[FFmpeg] Transcoding ${webmFile} to MP4...`);
    try {
      execSync(`ffmpeg -y -i "${webmFile}" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p "${mp4File}"`, {
        stdio: 'inherit',
      });
      console.log(`[Success] Extended Video created: ${mp4File}`);
    } catch (e) {
      console.log('[Notice] Transcoding skipped or completed. WebM is ready at:', webmFile);
    }
  }
}

run().catch((err) => {
  console.error('[Error] Walkthrough failed:', err);
  process.exit(1);
});
