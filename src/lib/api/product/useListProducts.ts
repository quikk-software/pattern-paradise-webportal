import { client } from '@/@types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { combineArraysById } from '@/lib/core/utils';
import { ProductFilterObject } from '@/lib/constants';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import {
  setHasNextPage,
  setPageNumber,
  setPageSize,
  setProducts,
  updateFilterField,
} from '@/lib/features/filter/filterSlice';

export const useListProducts = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const { products } = useSelector((store: Store) => store.filter);

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const dispatch = useDispatch();

  const fetch = async (filter?: ProductFilterObject) => {
    const response = await handleFn(
      async () =>
        await client.api.listProducts({
          pageNumber: filter?.pageNumber ?? pagination.pageNumber,
          pageSize: filter?.pageSize ?? pagination.pageSize,
          ignoreIpAddress: filter?.status === 'Created',
          ...filter,
        }),
    );

    if (filter?.pageNumber === 1) {
      dispatch(setProducts(response?.data.products ?? []));
    } else {
      dispatch(setProducts([...combineArraysById(products, response?.data.products ?? [], 'id')]));
    }

    dispatch(setPageNumber((response?.data.pageNumber ?? pagination.pageNumber) + 1));
    dispatch(setPageSize(response?.data.pageSize ?? pagination.pageSize));
    dispatch(setHasNextPage(response?.data.hasNextPage ?? pagination.hasNextPage));

    pagination.handlePaginationPayload(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    ...pagination,
    fetch,
    data: products,
  };
};
