"use client";

import { useState } from "react";
import StarshipSearch from "@/components/StarshipSearch";
import StarshipTable from "@/components/StarshipTable";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Star Wars Fleet Dashboard</h1>

      {/* Search Bar */}
      <StarshipSearch onSearch={setSearchQuery} />

      {/* Starship Table */}
      <StarshipTable searchQuery={searchQuery} />
    </div>
  );
}
