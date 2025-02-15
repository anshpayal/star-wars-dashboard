"use client";

interface StarshipFiltersProps {
  setHyperdriveFilter: (filter: string) => void;
  setCrewFilter: (filter: string) => void;
  hyperdriveFilter: string;
  crewFilter: string;
}

export default function StarshipFilters({
  setHyperdriveFilter,
  setCrewFilter,
  hyperdriveFilter,
  crewFilter,
}: StarshipFiltersProps) {
  return (
    <div className="flex gap-4 mt-4">
      {/* Hyperdrive Rating Filter */}
      <div>
        <label className="block text-sm font-medium">Hyperdrive Rating</label>
        <select
          className="border p-2 rounded w-40"
          value={hyperdriveFilter} // <-- Fix: Bind value to state
          onChange={(e) => setHyperdriveFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="<1.0">{"<1.0"}</option>
          <option value="1.0-2.0">1.0 - 2.0</option>
          <option value=">2.0">{">2.0"}</option>
        </select>
      </div>

      {/* Crew Size Filter */}
      <div>
        <label className="block text-sm font-medium">Crew Size</label>
        <select
          className="border p-2 rounded w-40"
          value={crewFilter} // <-- Fix: Bind value to state
          onChange={(e) => setCrewFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="1-5">1 - 5</option>
          <option value="6-50">6 - 50</option>
          <option value="50+">50+</option>
        </select>
      </div>
    </div>
  );
}
