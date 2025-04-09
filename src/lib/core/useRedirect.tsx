import { useEffect, useState } from 'react';

const useRedirect = () => {
  const [redirectTo, setRedirectTo] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get('redirect');
      setRedirectTo(redirectParam || '/');
    }
  }, []);

  return {
    redirectUrl: redirectTo,
  };
};

export default useRedirect;
