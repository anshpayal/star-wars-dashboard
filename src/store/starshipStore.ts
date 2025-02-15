import { atomWithStorage } from "jotai/utils";
import { Starship } from "@/hooks/useStarships";

// Persist selected starships in localStorage
export const selectedStarshipsAtom = atomWithStorage<Starship[]>(
  "selectedStarships",
  []
);
