import { useQuery } from "@tanstack/react-query";
import { fetchDesignSummary } from "../services/aedtApi";

export const useDesignSummary = (designId: string) =>
  useQuery({ queryKey: ["design-summary", designId], queryFn: () => fetchDesignSummary(designId), enabled: !!designId });
