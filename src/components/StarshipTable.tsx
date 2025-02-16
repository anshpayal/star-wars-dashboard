"use client";
import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { selectedStarshipsAtom } from "@/store/starshipStore";
import { Starship } from "@/hooks/useStarships";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import CompareModal from "./CompareModal";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useTableUrlState } from '@/hooks/useTableUrlState';

interface StarshipTableProps {
  searchQuery: string;
  hyperdriveFilter: string;
  crewFilter: string;
  isLoading?: boolean;
}

// interface StarshipResponse {
//   results: Starship[];
//   next: string | null;
//   previous: string | null;
// }

export default function StarshipTable({ 
  searchQuery, 
  hyperdriveFilter, 
  crewFilter, 
  isLoading: parentLoading 
}: StarshipTableProps) {
  const { getStateFromUrl, updateUrl } = useTableUrlState({});
  const urlState = getStateFromUrl();
  const [page, setPage] = useState(urlState.page);
  const [showCompare, setShowCompare] = useState(urlState.compareOpen);
  const [selectedStarships, setSelectedStarships] = useAtom(
    selectedStarshipsAtom
  );
  const [sorting, setSorting] = useState<SortingState>(() => {
    return urlState.sortBy ? [{ id: urlState.sortBy, desc: urlState.sortOrder === 'desc' }] : [];
  });

  const { data, isLoading } = useQuery({
    queryKey: ["starships", page],
    queryFn: async () => {
      const response = await fetch(`https://swapi.dev/api/starships/?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch starships');
      return response.json();
    },
    staleTime: 300000, // 5 minutes
    // cacheTime: 3600000, // 1 hour
  });

  const filteredStarships = useMemo(() => {
    if (!data?.results) return [];
    
    return data.results.filter((starship: Starship) => {
      // Search filter
      const searchMatch = !searchQuery || 
        starship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        starship.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        starship.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());

      // Hyperdrive filter
      let hyperdriveMatch = true;
      if (hyperdriveFilter) {
        const rating = parseFloat(starship.hyperdrive_rating);
        if (!isNaN(rating)) {
          switch (hyperdriveFilter) {
            case "<1.0": hyperdriveMatch = rating < 1.0; break;
            case "1.0-2.0": hyperdriveMatch = rating >= 1.0 && rating <= 2.0; break;
            case ">2.0": hyperdriveMatch = rating > 2.0; break;
          }
        }
      }

      // Crew filter
      let crewMatch = true;
      if (crewFilter) {
        const crewSize = parseInt(starship.crew.replace(/,/g, ''));
        if (!isNaN(crewSize)) {
          switch (crewFilter) {
            case "1-5": crewMatch = crewSize >= 1 && crewSize <= 5; break;
            case "6-50": crewMatch = crewSize >= 6 && crewSize <= 50; break;
            case "50+": crewMatch = crewSize > 50; break;
          }
        }
      }

      return searchMatch && hyperdriveMatch && crewMatch;
    });
  }, [data?.results, searchQuery, hyperdriveFilter, crewFilter]);

  const sortedData = useMemo(() => {
    if (!sorting.length) return filteredStarships;

    return [...filteredStarships].sort((a, b) => {
      const ratingA = parseFloat(a.hyperdrive_rating);
      const ratingB = parseFloat(b.hyperdrive_rating);

      if (isNaN(ratingA) && isNaN(ratingB)) return 0;
      if (isNaN(ratingA)) return 1;
      if (isNaN(ratingB)) return -1;

      return sorting[0].desc ? ratingB - ratingA : ratingA - ratingB;
    });
  }, [filteredStarships, sorting]);

  const handleSelect = (starship: Starship) => {
    setSelectedStarships((prev) => {
      if (prev.some((s) => s.name === starship.name)) {
        return prev.filter((s) => s.name !== starship.name);
      }
      return prev.length < 3 ? [...prev, starship] : prev;
    });
  };

  const columns = useMemo<ColumnDef<Starship>[]>(
    () => [
      {
        id: "select",
        header: "Select",
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedStarships.some(
              (s) => s.name === row.original.name
            )}
            onChange={() => handleSelect(row.original)}
          />
        ),
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "model", header: "Model" },
      { accessorKey: "manufacturer", header: "Manufacturer" },
      { accessorKey: "crew", header: "Crew Size" },
      { 
        accessorKey: "hyperdrive_rating", 
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2"
              onClick={() => {
                const newSorting = column.getToggleSortingHandler()?.({});
                const sortOrder = column.getIsSorted() === 'asc' ? 'desc' : 
                                column.getIsSorted() === 'desc' ? '' : 'asc';
                updateUrl({ 
                  sortBy: sortOrder ? 'hyperdrive_rating' : '', 
                  sortOrder: sortOrder 
                });
              }}
            >
              Hyperdrive Rating
              <ArrowUpDown className="h-4 w-4" />
            </button>
          );
        },
        cell: ({ row }) => {
          const rating = parseFloat(row.original.hyperdrive_rating);
          return (
            <div className="text-right">
              {isNaN(rating) ? row.original.hyperdrive_rating : rating.toFixed(1)}
            </div>
          );
        },
      },
    ],
    [selectedStarships, updateUrl]
  );

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    enableSorting: true,
  });

  // Update URL when page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ page: newPage });
  };

  // Update URL when compare modal opens/closes
  const handleCompareToggle = (isOpen: boolean) => {
    setShowCompare(isOpen);
    updateUrl({ compareOpen: isOpen });
  };

  if (isLoading || parentLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg pb-4">
      {/* Table Container */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-medium whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 
                         hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 min-w-[120px]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controls Container */}
      <div className="mt-4 px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Compare Button */}
        {selectedStarships.length > 1 && (
          <button
            onClick={() => setShowCompare(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 
                     bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                     transition-colors duration-200"
          >
            <span>Compare Selected ({selectedStarships.length})</span>
          </button>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                     bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg border 
                     border-gray-300 dark:border-gray-600 hover:bg-gray-50 
                     dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!data?.previous}
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         bg-white dark:bg-gray-800 rounded-lg border border-gray-300 
                         dark:border-gray-600"
          >
            Page {page}
          </span>

          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                     bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg border 
                     border-gray-300 dark:border-gray-600 hover:bg-gray-50 
                     dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!data?.next}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Compare Modal */}
      <CompareModal
        isOpen={showCompare}
        onClose={() => handleCompareToggle(false)}
      />
    </div>
  );
}
