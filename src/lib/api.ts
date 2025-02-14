import { initContract } from "@ts-rest/core";

const c = initContract();

export const starshipContract = c.router({
  getStarships: {
    method: "GET",
    path: "/starships/",
    query: c.type<{ search?: string }>(),
    responses: {
      200: c.type<{ count: number; results: Starship[] }>(),
    },
  },
});

export interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  crew: string;
  hyperdrive_rating: string;
}
