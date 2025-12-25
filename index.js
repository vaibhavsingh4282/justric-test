import html from './index.html';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Check if the request is for a static asset (CSS, Images, etc.)
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      // If the file is found, return it (this fixes the broken CSS/Images)
      if (response.status !== 404) {
        return response;
      }
    }

    // 2. Fallback: If no specific file is found, serve the main HTML
    // Make sure 'index.html' is in your root folder
    const html = await env.ASSETS.fetch(new Request(new URL('/index.html', url)));
    return html;
  },
};
