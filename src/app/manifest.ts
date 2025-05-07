import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pattern Paradise - Where Creativity Pays Off',
    short_name: 'Pattern Paradise',
    description:
      'Buy, sell and test crocheting & knitting patterns from designers worldwide! Join exclusive tester calls and grow your pattern paradise business effortlessly.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#ed8332',
    // @ts-ignore
    display_override: 'standalone',
    // @ts-ignore
    gcm_sender_id: '608358089878',
    icons: [
      {
        src: '/favicon.ico?v=3',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: 'https://pattern-paradise.shop/icons/main/16.png',
        sizes: '16x16',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://pattern-paradise.shop/icons/main/32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://pattern-paradise.shop/icons/main/64.png',
        sizes: '64x64',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://pattern-paradise.shop/icons/main/128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://pattern-paradise.shop/icons/main/256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://pattern-paradise.shop/icons/main/512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://pattern-paradise.shop/icons/main/1024.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    id: 'pattern-paradise',
    dir: 'auto',
    lang: 'en',
    orientation: 'portrait',
    prefer_related_applications: false,
    shortcuts: [
      {
        name: 'View tester chats',
        url: '/app/secure/test/chats',
        description: 'View chats for your testings',
      },
      {
        name: 'View chats',
        url: '/app/secure/chats',
        description: 'View chats with other users',
      },
      {
        name: 'Create pattern',
        url: '/app/secure/sell/submit',
        description: 'Create a new pattern',
      },
    ],
    categories: ['productivity'],
  };
}
