import { useEffect, useState } from 'react';

const useVerificationCode = () => {
  const [verificationCode, setVerificationCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('code');
    setVerificationCode(redirectParam ?? undefined);
  }, []);

  return {
    verificationCode,
  };
};

export default useVerificationCode;
