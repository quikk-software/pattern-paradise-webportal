import { useEffect, useState } from 'react';

const useVerificationCode = () => {
  const [verificationCode, setVerificationCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verificationCode = params.get('code');
    setVerificationCode(verificationCode ?? undefined);
  }, []);

  return {
    verificationCode,
  };
};

export default useVerificationCode;
