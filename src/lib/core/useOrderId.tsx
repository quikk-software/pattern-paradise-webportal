import { useEffect, useState } from 'react';

const useOrderId = () => {
  const [orderId, setOrderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderIdQuery = params.get('orderId');
    setOrderId(orderIdQuery ?? undefined);
  }, []);

  return {
    orderId,
  };
};

export default useOrderId;
