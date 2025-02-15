"use client";

import { useState, useMemo } from "react";
import { useStarships } from "@/hooks/useStarships";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import StarshipFilters from "./StarshipFilters";

export interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  crew: string;
  hyperdrive_rating: string;
}

interface StarshipTableProps {
  searchQuery: string;
}

export default function StarshipTable({ searchQuery }: StarshipTableProps) {
  const [page, setPage] = useState(1);
  const [hyperdriveFilter, setHyperdriveFilter] = useState("");
  const [crewFilter, setCrewFilter] = useState("");

  const { data, isLoading, error } = useStarships(
    searchQuery,
    page,
    hyperdriveFilter,
    crewFilter
  );

  const columns = useMemo<ColumnDef<Starship>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "model", header: "Model" },
      { accessorKey: "manufacturer", header: "Manufacturer" },
      { accessorKey: "crew", header: "Crew Size" },
      { accessorKey: "hyperdrive_rating", header: "Hyperdrive Rating" },
    ],
    []
  );

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p className="mt-4">🚀 Loading starships...</p>;

  if (error)
    return (
      <div className="mt-4 text-red-500 text-center">
        ❌ {error.message || "Failed to fetch starships. Please try again."}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="mt-4">
      {/* Filters */}
      <StarshipFilters
        setHyperdriveFilter={setHyperdriveFilter}
        setCrewFilter={setCrewFilter}
        hyperdriveFilter={hyperdriveFilter} // Pass current state
        crewFilter={crewFilter} // Pass current state
      />

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 shadow-md mt-4">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2 text-left">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                No starships found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={!data?.previous}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={!data?.next}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
