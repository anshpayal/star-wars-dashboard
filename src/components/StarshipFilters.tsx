"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, Gauge, Users } from "lucide-react";

interface StarshipFiltersProps {
  hyperdriveFilter: string;
  crewFilter: string;
  onFilterChange: {
    hyperdrive: (value: string) => void;
    crew: (value: string) => void;
  };
}

export default function StarshipFilters({
  hyperdriveFilter,
  crewFilter,
  onFilterChange
}: StarshipFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-200">Filters</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {(hyperdriveFilter || crewFilter) && '(Active)'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Hyperdrive Rating Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              <Gauge className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Hyperdrive Rating
            </label>
            <select
              value={hyperdriveFilter}
              onChange={(e) => onFilterChange.hyperdrive(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 
                       dark:focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="">All Ratings</option>
              <option value="<1.0">Less than 1.0</option>
              <option value="1.0-2.0">1.0 - 2.0</option>
              <option value=">2.0">Greater than 2.0</option>
            </select>
          </div>

          {/* Crew Size Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Crew Size
            </label>
            <select
              value={crewFilter}
              onChange={(e) => onFilterChange.crew(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 
                       dark:focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="">All Sizes</option>
              <option value="1-5">Small (1-5)</option>
              <option value="6-50">Medium (6-50)</option>
              <option value="50+">Large (50+)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(hyperdriveFilter || crewFilter) && (
            <button
              onClick={() => {
                onFilterChange.hyperdrive("");
                onFilterChange.crew("");
              }}
              className="mt-4 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300
                       border border-gray-300 dark:border-gray-600 rounded-md
                       hover:bg-gray-50 dark:hover:bg-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
