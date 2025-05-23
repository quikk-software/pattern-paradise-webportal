import { useEffect, useState } from 'react';

const useVerificationType = () => {
  const [verificationType, setVerificationType] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const verificationType = params.get('confirmationType');
      setVerificationType(verificationType ?? undefined);
    }
  }, []);

  return {
    verificationType,
  };
};

export default useVerificationType;
