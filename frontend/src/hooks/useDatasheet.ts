import { useQuery } from "@tanstack/react-query";
import { fetchDatasheet } from "../services/aedtApi";

export const useDatasheet = (designId: string) =>
  useQuery({
    queryKey: ["datasheet", designId],
    queryFn: () => fetchDatasheet(designId),
    enabled: !!designId
  });
