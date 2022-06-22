import { useEffect } from 'react';
import { ResponseError } from 'superagent';
import useSWR from 'swr';

import isArray from 'lodash/isArray';

import { useAppDispatch, useAppSelector, useDebounce } from '@/hooks';
import { checkBreed, IBreed } from '@/types';
import { parseErrorResponse, request } from '@/utils';


const fetcher = async (
  path: string,
  limit: number,
  offset: number,
  search: string,
) => {
  const res = await request.get(
    `${path}?limit=${limit}&offset=${offset}&search=${
      search ? encodeURIComponent(search) : ''
    }`
  );

  if (typeof res.body?.count === 'number' && isArray(res.body?.results)) {
    const hasMore = limit < res.body.count;
    const breeds: IBreed[] = [];
    for (const breed of res.body.results) breeds.push(checkBreed(breed));
    return { breeds, hasMore };
  }

  const error = new Error() as ResponseError;
  res.body = { ...res.body, detail: 'Invalid response body.' };
  error.response = res;
  throw error;
};


export default function BreedsMasterRetrieve() {
  const {
    limit,
    offset,
    searchBarOn,
    searchBreed,
  } = useAppSelector((state) => state.master);
  const debouncedSearchBreed = useDebounce(searchBreed, 250);
  const dispatch = useAppDispatch();

  const { data, error, isValidating } = useSWR([
    '/breeds', limit, offset, searchBarOn ? debouncedSearchBreed : ''
  ], fetcher);

  useEffect(() => {
    if (isValidating) {
      dispatch({ type: 'START_RETRIEVE_MASTER' });
    } else {
      dispatch({ type: 'STOP_RETRIEVE_MASTER' });
    }

    if (error) {
      const errorRetrieve = parseErrorResponse(error?.response?.body, []);
      dispatch({ type: 'MASTER_ERROR', errorRetrieve });
      dispatch({ type: 'SET_BREEDS', breeds: [] });
    } else if (data) {
      dispatch({ type: 'MASTER_ERROR', errorRetrieve: {} });
      dispatch({ type: 'SET_BREEDS', breeds: data.breeds });
      dispatch({ type: 'SET_HAS_MORE', hasMore: data.hasMore });
    }
  }, [data, error, isValidating, dispatch]);

  return <></>;
}