import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  crew: string;
  hyperdrive_rating: string;
}

interface StarshipResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Starship[];
}

const fetchStarships = async (search?: string, page: number = 1) => {
  const response = await axios.get<StarshipResponse>("https://swapi.dev/api/starships/", {
    params: { search, page },
  });
  return response.data;
};

export const useStarships = (search: string, page: number) => {
  return useQuery({
    queryKey: ["starships", search, page],
    queryFn: () => fetchStarships(search, page),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
