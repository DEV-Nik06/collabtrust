import { PROHIBITED_TERMINOLOGY } from '@collabtrust/shared';

/**
 * Wraps untrusted user input with XML delimiters per docs/04-ai/prompt-specifications.md
 */
export function wrapXml(tag: string, content: string): string {
  // Strip closing tag injections
  const sanitized = content.replace(new RegExp(`</${tag}>`, 'gi'), '');
  return `<${tag}>\n${sanitized.trim()}\n</${tag}>`;
}

/**
 * Validates that generated text does not contain prohibited definitive fraud/authenticity claims.
 * Per docs/04-ai/safety-guardrails.md §2.
 */
export function containsProhibitedTerminology(text: string): { hasViolation: boolean; violations: string[] } {
  const lower = text.toLowerCase();
  const violations: string[] = [];

  for (const term of PROHIBITED_TERMINOLOGY) {
    if (lower.includes(term.toLowerCase())) {
      violations.push(term);
    }
  }

  return {
    hasViolation: violations.length > 0,
    violations,
  };
}
