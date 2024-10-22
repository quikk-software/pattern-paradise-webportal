import { useParams } from 'next/navigation';

const useRedirect = () => {
  const params = useParams();

  const redirectParam = params['redirect'];
  const redirectTo = typeof redirectParam === 'string' ? redirectParam : '/';

  return {
    // Taken from Query Parameter `redirect`. Defaults to "/", if no `redirect` Query Parameter is provided.
    redirectUrl: redirectTo,
  };
};

export default useRedirect;
