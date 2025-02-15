import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

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

const fetchStarships = async (search?: string, page: number = 1): Promise<StarshipResponse> => {
  try {
    const response = await axios.get<StarshipResponse>("https://swapi.dev/api/starships/", {
      params: { search, page },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Check for network error
      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server. Check your connection.");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch starships.");
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const useStarships = (search: string, page: number, hyperdriveFilter: string, crewFilter: string) => {
  return useQuery({
    queryKey: ["starships", search, page, hyperdriveFilter, crewFilter],
    queryFn: async () => {
      const data = await fetchStarships(search, page);

      if (!data.results) throw new Error("No starships found.");

      const filteredData = data.results.filter((starship) => {
        const hyperdrive = parseFloat(starship.hyperdrive_rating);
        const crewSize = parseInt(starship.crew);

        let passesHyperdrive = true;
        if (hyperdriveFilter === "<1.0") passesHyperdrive = hyperdrive < 1.0;
        if (hyperdriveFilter === "1.0-2.0") passesHyperdrive = hyperdrive >= 1.0 && hyperdrive <= 2.0;
        if (hyperdriveFilter === ">2.0") passesHyperdrive = hyperdrive > 2.0;

        let passesCrew = true;
        if (crewFilter === "1-5") passesCrew = crewSize >= 1 && crewSize <= 5;
        if (crewFilter === "6-50") passesCrew = crewSize >= 6 && crewSize <= 50;
        if (crewFilter === "50+") passesCrew = crewSize > 50;

        return passesHyperdrive && passesCrew;
      });

      return { ...data, results: filteredData };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: (failureCount, error) => {
      if (error.message.includes("Network error")) return failureCount < 2; // Retry 2 times for network issues
      return failureCount < 3; // Retry 3 times for other issues
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (max 5s)
  });
};
