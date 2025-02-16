import { useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TableState {
  search: string;
  page: number;
  hyperdriveFilter: string;
  crewFilter: string;
  compareOpen: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | '';
}

export function useTableUrlState(initialState: Partial<TableState>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  // Read state from URL
  const getStateFromUrl = useCallback((): TableState => {
    if (!searchParams) {
      return {
        search: initialState.search ?? '',
        page: initialState.page ?? 1,
        hyperdriveFilter: initialState.hyperdriveFilter ?? '',
        crewFilter: initialState.crewFilter ?? '',
        compareOpen: initialState.compareOpen ?? false,
        sortBy: initialState.sortBy ?? '',
        sortOrder: initialState.sortOrder ?? '',
      };
    }

    return {
      search: searchParams.get('search') ?? initialState.search ?? '',
      page: (Number(searchParams.get('page')) || (initialState.page ?? 1)),
      hyperdriveFilter: searchParams.get('hyperdriveFilter') ?? initialState.hyperdriveFilter ?? '',
      crewFilter: searchParams.get('crewFilter') ?? initialState.crewFilter ?? '',
      compareOpen: (searchParams.get('compare') === 'true') || (initialState.compareOpen ?? false),
      sortBy: searchParams.get('sortBy') ?? initialState.sortBy ?? '',
      sortOrder: (searchParams.get('sortOrder') as TableState['sortOrder']) ?? initialState.sortOrder ?? '',
    };
  }, [searchParams, initialState]);

  // Update URL with new state
  const updateUrl = useCallback((newState: Partial<TableState>) => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());

    // Update only provided values
    Object.entries(newState).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    // Create new URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [router, searchParams]);

  // Initialize state from URL on mount only
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const state = getStateFromUrl();
      if (state.hyperdriveFilter || state.crewFilter || state.search || state.page > 1) {
        updateUrl(state);
      }
    }
  }, [getStateFromUrl, updateUrl]);

  return {
    getStateFromUrl,
    updateUrl,
  };
} 