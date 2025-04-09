import { useEffect, useState } from 'react';

const usePreselectedRoles = () => {
  const [preselectedRoles, setPreselectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const preselectedRoles = params.get('preselectedRoles');
      setPreselectedRoles(
        Array.isArray(preselectedRoles)
          ? preselectedRoles
          : !!preselectedRoles
            ? [preselectedRoles]
            : [],
      );
    }
  }, []);

  return {
    preselectedRoles,
  };
};

export default usePreselectedRoles;
