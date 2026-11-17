import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const htmlPath = path.join(distDir, 'index.html');

let html = fs.readFileSync(htmlPath, 'utf8');

// Inline the render-blocking CSS into the HTML document.
// Vite injects a single <link rel="stylesheet"> for the app CSS.
// Inlining removes the separate network round-trip on Slow 4G (~170ms savings).
const cssLinkMatch = html.match(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/);
if (cssLinkMatch) {
  const cssHref = cssLinkMatch[1];
  const cssPath = path.join(distDir, cssHref.replace(/^\//, ''));
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    html = html.replace(cssLinkMatch[0], `<style>${css}</style>`);
  }
}

fs.writeFileSync(htmlPath, html);
