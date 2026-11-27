import { expect } from 'chai';
import { applyCspNonce } from './csp';

describe('applyCspNonce', () => {
  const nonce = 'request-specific-nonce';

  it('resolves nonce placeholders', () => {
    const html = '<meta name="csp-nonce" content="{{cspNonce}}"><script nonce="{{cspNonce}}"></script>';

    expect(applyCspNonce(html, nonce)).to.equal(
      `<meta name="csp-nonce" content="${nonce}"><script nonce="${nonce}"></script>`
    );
  });

  it('adds the nonce to Angular generated initial scripts', () => {
    const html = '<script src="polyfills.js" type="module"></script><script src="main.js" type="module"></script>';

    expect(applyCspNonce(html, nonce)).to.equal(
      `<script nonce="${nonce}" src="polyfills.js" type="module"></script>`
      + `<script nonce="${nonce}" src="main.js" type="module"></script>`
    );
  });

  it('does not add a duplicate nonce', () => {
    const html = '<script NONCE="existing-nonce" src="main.js"></script>';

    expect(applyCspNonce(html, nonce)).to.equal(html);
  });

  it('adds the nonce to module preloads', () => {
    const html = '<link rel="modulepreload" href="chunk.js"><link rel="stylesheet" href="styles.css">';

    expect(applyCspNonce(html, nonce)).to.equal(
      `<link nonce="${nonce}" rel="modulepreload" href="chunk.js"><link rel="stylesheet" href="styles.css">`
    );
  });
});
