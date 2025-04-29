import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/api/static/product/listProducts';

let cachedFeed: string | null = null;
let lastGenerated: number | null = null;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export async function GET() {
  const now = Date.now();

  if (cachedFeed && lastGenerated && now - lastGenerated < CACHE_DURATION) {
    return new NextResponse(cachedFeed, {
      headers: {
        'Content-Type': 'application/rss+xml',
      },
    });
  }

  const products = await listProducts({
    overridePageNumber: 1,
    overridePageSize: 50000,
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>Pattern Paradise</title>
        <link>${process.env.NEXT_PUBLIC_URL}</link>
        <description>Discover beautiful crochet and knitting patterns</description>
        ${products
          .map(
            (product) => `
          <item>
            <title>${escapeXml(product.title)}</title>
            <link>${process.env.NEXT_PUBLIC_URL}/app/products/${product.id}</link>
            <description>${escapeXml(product.description + ' ' + product.hashtags.map((tag) => `#${tag}`).join(' '))}</description>
            <pubDate>${new Date(product.createdAt).toUTCString()}</pubDate>
            <guid>${process.env.NEXT_PUBLIC_URL}/app/products/${product.id}</guid>
            ${
              product.imageUrls.length > 0
                ? `
              <media:content 
                url="${getPinterestImageUrl(product.imageUrls[0])}" 
                medium="image"
              />
            `
                : ''
            }
          </item>
        `,
          )
          .join('')}
      </channel>
    </rss>`;

  // Cache the generated feed
  cachedFeed = feed;
  lastGenerated = now;

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}

// Helper to escape special XML characters
function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function getPinterestImageUrl(originalUrl: string) {
  return originalUrl.replace('/upload/', '/upload/w_1000,h_1500,c_fill/');
}
