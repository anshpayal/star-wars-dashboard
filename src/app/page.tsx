"use client";

import { useState } from "react";
import { useStarships } from "@/hooks/useStarships";
import StarshipSearch from "@/components/StarshipSearch";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: starships, isLoading, error } = useStarships(searchQuery);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Star Wars Fleet Dashboard</h1>

      {/* Search Bar */}
      <StarshipSearch onSearch={setSearchQuery} />

      {/* Loading State */}
      {isLoading && <p className="mt-4">Loading starships...</p>}

      {/* Error State */}
      {error && <p className="mt-4 text-red-500">Failed to fetch starships.</p>}

      {/* Starship List */}
      <ul className="mt-4 space-y-2">
        {starships?.map((ship) => (
          <li key={ship.name} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{ship.name}</h2>
            <p className="text-sm text-gray-600">{ship.model}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
