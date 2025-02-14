"use client";

import { useState, useMemo } from "react";
import { useStarships } from "@/hooks/useStarships";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

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
  const { data, isLoading, error } = useStarships(searchQuery, page);

  // Define table columns
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

  if (isLoading) return <p className="mt-4">Loading starships...</p>;
  if (error)
    return <p className="mt-4 text-red-500">Failed to fetch starships.</p>;

  return (
    <div className="mt-4">
      <table className="w-full border-collapse border border-gray-300 shadow-md">
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

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!data?.previous}
          className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">Page {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!data?.next}
          className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
