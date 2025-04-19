import { useEffect, useState } from 'react';

const useAffiliate = () => {
  const [affiliate, setAffiliate] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const affiliateFromQuery = params.get('affiliate');
      setAffiliate(affiliateFromQuery ?? undefined);
    }
  }, []);

  return {
    affiliate,
  };
};

export default useAffiliate;
