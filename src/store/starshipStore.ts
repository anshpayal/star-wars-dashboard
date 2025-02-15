import { atom } from "jotai";
import { Starship } from "@/hooks/useStarships";

// Atom to store selected starships (max 3)
export const selectedStarshipsAtom = atom<Starship[]>([]);
