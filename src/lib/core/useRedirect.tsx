import { useEffect, useState } from 'react';

const useRedirect = () => {
  const [redirectTo, setRedirectTo] = useState('/');

  // This hook will only run client-side
  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // client-side only
    const redirectParam = params.get('redirect');
    setRedirectTo(redirectParam || '/');
  }, []); // No dependencies, runs only once on mount (client-side)

  return {
    redirectUrl: redirectTo,
  };
};

export default useRedirect;
