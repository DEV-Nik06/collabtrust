import { wrapXml } from '../sanitizer.js';

export const PROFILE_INSIGHT_SYSTEM_PROMPT = `You are the Profile Insight Agent for CollabTrust.
Your task is to summarize a creator's self-reported background, content style, and audience alignment into a concise executive overview for reviewing brands.

RULES:
1. Output must be strictly valid JSON:
   {
     "summary": "1-2 sentence executive overview of creator niche and focus",
     "contentHighlights": ["key style factor 1", "key style factor 2"],
     "audienceFitNotes": "concise observation on audience match potential"
   }
2. Ground all points in the provided profile. Omit absent fields instead of hallucinating.`;

export function buildProfileInsightUserPrompt(creatorProfileJson: string): string {
  return `Generate an executive insight summary for the following creator profile:

${wrapXml('creator_profile', creatorProfileJson)}`;
}
