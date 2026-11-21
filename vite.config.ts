import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function inlineBuildCss(): Plugin {
  return {
    name: 'inline-build-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const htmlAsset = bundle['index.html'];
      if (!htmlAsset || htmlAsset.type !== 'asset' || typeof htmlAsset.source !== 'string') {
        return;
      }

      const cssLinkPattern =
        /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["'](\/?assets\/[^"']+\.css)["'][^>]*>/gi;

      let updatedHtml = htmlAsset.source;
      const inlinedAssets = new Set<string>();

      updatedHtml = updatedHtml.replace(cssLinkPattern, (fullTag, hrefPath: string) => {
        const assetKey = hrefPath.replace(/^\/+/, '');
        const cssAsset = bundle[assetKey];
        if (!cssAsset || cssAsset.type !== 'asset') {
          return fullTag;
        }
        const cssContent =
          typeof cssAsset.source === 'string'
            ? cssAsset.source
            : Buffer.from(cssAsset.source).toString('utf8');
        const safeCss = cssContent.replace(/<\/style/gi, '\\3c /style');
        inlinedAssets.add(assetKey);
        return `<style>${safeCss}</style>`;
      });

      if (inlinedAssets.size > 0) {
        htmlAsset.source = updatedHtml;
        for (const key of inlinedAssets) {
          delete bundle[key];
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), inlineBuildCss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
