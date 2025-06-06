import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/api/static/product/listProducts';
import { GetProductResponse } from '@/@types/api-types';
import { generateTitle } from '@/lib/utils';
import { getLocale, getTranslations } from 'next-intl/server';

let cachedFeed: string | null = null;
let lastGenerated: number | null = null;

export async function GET() {
  const now = Date.now();

  const locale = await getLocale();
  const t = await getTranslations();

  const products = await listProducts({
    overridePageNumber: 1,
    overridePageSize: 50000,
    categories: ['Knitting'],
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>Pattern Paradise</title>
        <link>${process.env.NEXT_PUBLIC_URL}</link>
        <description>Discover beautiful knitting patterns</description>
        ${products
          .map((product) => {
            const { title, description } = generatePinterestMetadata(product, t);
            return `
          <item>
            <title>${escapeXml(title)}</title>
            <link>${process.env.NEXT_PUBLIC_URL}/${locale}/app/products/${product.id}</link>
            <description>${escapeXml(description)}</description>
            <pubDate>${new Date(product.createdAt).toUTCString()}</pubDate>
            <guid>${process.env.NEXT_PUBLIC_URL}/${locale}/app/products/${product.id}-knitting</guid>
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
        `;
          })
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
  return originalUrl.replace('/upload/', '/upload/w_1000,h_1500,c_pad,b_white/');
}

function generatePinterestMetadata(
  product: GetProductResponse,
  t: any,
): {
  title: string;
  description: string;
} {
  function trimBySentence(content: string, limit: number): string {
    if (content.length <= limit) return content;
    const sentences = content.split(/(?<=[.?!])\s+/);
    let result = '';
    for (const sentence of sentences) {
      if ((result + sentence).length + 1 <= limit) {
        result += sentence + ' ';
      } else {
        break;
      }
    }
    return result.trim();
  }

  const MAX_TITLE = 100;
  const MAX_DESCRIPTION = 500;

  const productTitleClean = product.title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const subcategoryPart = product.subCategories.slice(0, 2).join(' ');
  const rawTitle = product.isFree
    ? t('rss.knitting.freeProduct.title', {
        title: generateTitle({
          title: productTitleClean,
          category: product.category,
        }),
        subcategory: subcategoryPart,
      })
    : t('rss.knitting.product.title', {
        title: generateTitle({
          title: productTitleClean,
          category: product.category,
        }),
        subcategory: subcategoryPart,
      });

  const titleWithoutCategory = generateTitle({
    title: productTitleClean,
  });
  const title =
    rawTitle.length > MAX_TITLE ? rawTitle.slice(0, MAX_TITLE - 1).trim() + '…' : rawTitle;

  const categories = product.subCategories.slice(0, 5).join(', ');
  const descTitle = generateTitle({
    title: titleWithoutCategory,
  });

  const coreDescriptionSentences = [
    product.isFree
      ? t('rss.knitting.freeProduct.description', {
          title: descTitle,
          categories,
        })
      : t('rss.knitting.product.description', {
          title: descTitle,
          categories,
        }),
  ];

  const uniqueHashtags = Array.from(
    new Set(product.hashtags.map((tag) => `#${tag.toLowerCase()}`)),
  ).slice(0, 10);
  const hashtagBlock = uniqueHashtags.join(' ');
  const spaceForDescription = MAX_DESCRIPTION - hashtagBlock.length - 1;

  const trimmedDescription = trimBySentence(
    coreDescriptionSentences.join(' '),
    spaceForDescription,
  );

  const finalDescription = `${trimmedDescription} ${hashtagBlock}`.trim();

  return { title, description: finalDescription };
}
