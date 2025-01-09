import { useState } from 'react';

export const usePagination = (
  initialPageNumber: number = 1,
  initialPageSize: number = 20,
  autoPagination: boolean = true,
) => {
  const [count, setCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const handlePaginationPayload = (payload: any) => {
    setCount(payload?.count ?? 0);
    setTotalPages(payload?.totalPages ?? 0);
    setHasPreviousPage(payload?.hasPreviousPage ?? false);
    setHasNextPage(payload?.hasNextPage ?? false);
    if (Boolean(payload?.hasNextPage)) {
      let newPageNumber = initialPageNumber;
      if (payload?.pageNumber !== undefined && autoPagination) {
        newPageNumber = Number(payload.pageNumber) + 1;
      }
      setPageNumber(newPageNumber);
    }
    setPageSize(payload?.pageSize ?? initialPageSize);
  };

  const reset = () => {
    setCount(0);
    setTotalPages(0);
    setHasPreviousPage(false);
    setHasNextPage(true);
    setPageNumber(initialPageNumber);
    setPageSize(initialPageSize);
  };

  return {
    handlePaginationPayload,
    count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    pageNumber,
    pageSize,
    reset,
  };
};
