"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import StarshipSearch from "@/components/StarshipSearch";
import StarshipTable from "@/components/StarshipTable";
import StarshipFilters from "@/components/StarshipFilters";
import { Sun, Moon } from "lucide-react";
import { useTableUrlState } from '@/hooks/useTableUrlState';

export default function DashboardPage() {
  const { getStateFromUrl, updateUrl } = useTableUrlState({
    search: '',
    page: 1,
    hyperdriveFilter: '',
    crewFilter: '',
    compareOpen: false,
  });

  // Initialize state from URL
  const urlState = getStateFromUrl();
  const [searchQuery, setSearchQuery] = useState<string>(urlState.search);
  const [hyperdriveFilter, setHyperdriveFilter] = useState<string>(urlState.hyperdriveFilter);
  const [crewFilter, setCrewFilter] = useState<string>(urlState.crewFilter);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Sync with URL parameters on mount
  useEffect(() => {
    const state = getStateFromUrl();
    setSearchQuery(state.search);
    setHyperdriveFilter(state.hyperdriveFilter);
    setCrewFilter(state.crewFilter);
  }, []);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle search with URL update
  const handleSearch = useCallback((query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    updateUrl({ search: query });
    setIsLoading(false);
  }, [updateUrl]);

  // Handle filter changes with URL update
  const handleFilterChange = useMemo(() => ({
    hyperdrive: (value: string) => {
      setHyperdriveFilter(value);
      updateUrl({ hyperdriveFilter: value });
    },
    crew: (value: string) => {
      setCrewFilter(value);
      updateUrl({ crewFilter: value });
    }
  }), [updateUrl]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Star Wars Fleet Dashboard
            </h1>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <StarshipSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="md:col-span-1">
              <StarshipFilters 
                hyperdriveFilter={hyperdriveFilter}
                crewFilter={crewFilter}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Table */}
            <div className="md:col-span-3 rounded-lg">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <StarshipTable 
                  searchQuery={searchQuery} 
                  hyperdriveFilter={hyperdriveFilter}
                  crewFilter={crewFilter}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 