import { SocialShareCard } from '@/components/social-share-card';
import { getProduct } from '@/lib/api/static/product/getProduct';
import { getTestingByProductId } from '@/lib/api/static/testing/getTestingByProductId';

interface Props {
  params: { productId: string };
  searchParams: { theme?: string };
}

export default async function TesterCallPreviewDetailsPage({ params, searchParams }: Props) {
  const { productId } = params;
  const theme = searchParams.theme || 'neutral';
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://pattern-paradise.shop';

  const product = await getProduct(productId);
  const testing = await getTestingByProductId(productId);

  if (!product || !testing) {
    return null;
  }

  return (
    <div className="w-[1080px] h-[1920px] bg-white">
      <SocialShareCard
        product={product}
        testing={testing}
        theme={theme}
        baseUrl={baseUrl}
        isDownloadVersion
      />
    </div>
  );
}
