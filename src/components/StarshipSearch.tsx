"use client";

import { useState } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function StarshipSearch({ onSearch }: SearchProps) {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    onSearch(search);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search starships..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-80"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Search
      </button>
    </div>
  );
}
