import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  crew: string;
  hyperdrive_rating: string;
}

const fetchStarships = async (search?: string) => {
  const response = await axios.get("https://swapi.dev/api/starships/", {
    params: { search },
  });
  return response.data.results as Starship[];
};

export const useStarships = (search: string) => {
  return useQuery({
    queryKey: ["starships", search],
    queryFn: () => fetchStarships(search),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
