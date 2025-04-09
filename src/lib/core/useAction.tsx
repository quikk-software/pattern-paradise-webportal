import { useEffect, useState } from 'react';

const useAction = () => {
  const [action, setAction] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const actionFromQuery = params.get('action');
      setAction(actionFromQuery ?? undefined);
    }
  }, []);

  return {
    action,
  };
};

export default useAction;
