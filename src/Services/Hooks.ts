import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./enums";
import { Set, getAllSets } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { getSetById } from "./pokemon.service";

export const useSets = () => {
    return useQuery<Set[]>({
      queryKey: [QueryKeys.sets],
      queryFn: async () => {
        const sets = await getAllSets();
        return sets;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      enabled: true,
      retry: 1,
      retryDelay: 3000,
    });
  };
  export const useSet = (Cardid: string) => {
    return useQuery<Set>({
      queryKey: [QueryKeys.set, Cardid],
      queryFn: async () => {
        const set = await getSetById(Cardid);
        return set;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      enabled: true,
      retry: 1,
      retryDelay: 3000,
    });
  };