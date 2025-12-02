import { useQuery } from "@tanstack/react-query";
import { fetchSParameters } from "../services/aedtApi";

export const useSParameters = (designId: string) =>
  useQuery({ queryKey: ["sparameters", designId], queryFn: () => fetchSParameters(designId), enabled: !!designId });
