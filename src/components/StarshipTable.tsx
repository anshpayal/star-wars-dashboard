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
} from "@tanstack/react-table";
import CompareModal from "./CompareModal";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [page, setPage] = useState(1);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedStarships, setSelectedStarships] = useAtom(
    selectedStarshipsAtom
  );

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
      { accessorKey: "hyperdrive_rating", header: "Hyperdrive Rating" },
    ],
    [selectedStarships]
  );

  const table = useReactTable({
    data: filteredStarships,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
      <div className="w-full">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-radius-lg">
          <thead className="rounded-t-lg">
            <tr className="bg-gray-100 dark:bg-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                headerGroup.headers.map((header) => (
                  <th 
                    key={header.id} 
                    className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg">No starships found</span>
                    <span className="text-sm">Try adjusting your search or filters</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
        {/* Compare Button */}
        {selectedStarships.length > 1 && (
          <button
            onClick={() => setShowCompare(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg 
                     hover:bg-indigo-700 transition-colors duration-200"
          >
            <span>Compare Selected ({selectedStarships.length})</span>
          </button>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                     bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg border 
                     border-gray-300 dark:border-gray-600 hover:bg-gray-50 
                     dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!data?.previous}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Compare Modal */}
      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
      />
    </div>
  );
}
