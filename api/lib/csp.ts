/**
 * Applies the per-request CSP nonce to the HTML shell.
 *
 * Angular adds the initial polyfills and main module scripts during the
 * production build, so those tags do not exist in src/index.html and cannot
 * contain the nonce placeholder. Under `strict-dynamic`, parser-inserted
 * scripts must carry the nonce themselves.
 */
export function applyCspNonce(html: string, nonce: string): string {
  const nonceAttribute = `nonce="${nonce}"`;
  const withResolvedPlaceholders = html.replace(/{{cspNonce}}/g, nonce);

  const withScriptNonces = withResolvedPlaceholders.replace(/<script\b[^>]*>/gi, (tag) => {
    if (/\snonce\s*=/i.test(tag)) {
      return tag;
    }
    return tag.replace(/^<script\b/i, (openingTag) => `${openingTag} ${nonceAttribute}`);
  });

  return withScriptNonces.replace(
    /<link\b(?=[^>]*\brel\s*=\s*["']modulepreload["'])[^>]*>/gi,
    (tag) => {
      if (/\snonce\s*=/i.test(tag)) {
        return tag;
      }
      return tag.replace(/^<link\b/i, (openingTag) => `${openingTag} ${nonceAttribute}`);
    }
  );
}
