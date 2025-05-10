import { useEffect, useState } from 'react';

const useAffiliate = () => {
  const [affiliate, setAffiliate] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const affiliateFromQuery = params.get('affiliate');
      if (affiliateFromQuery) {
        setAffiliate(affiliateFromQuery ?? undefined);
        return;
      }
      const affiliateFromStorage = sessionStorage.getItem('affiliate');
      setAffiliate(affiliateFromStorage ?? undefined);
    }
  }, []);

  return {
    affiliate,
  };
};

export default useAffiliate;
