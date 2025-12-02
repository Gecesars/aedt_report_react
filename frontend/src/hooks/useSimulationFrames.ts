import { useQuery } from "@tanstack/react-query";
import { fetchSimulationFrames } from "../services/aedtApi";

export const useSimulationFrames = (jobId: string | null) =>
  useQuery({
    queryKey: ["simulation-frames", jobId],
    queryFn: () => (jobId ? fetchSimulationFrames(jobId) : Promise.reject("jobId")),
    enabled: !!jobId,
    refetchInterval: jobId ? 8000 : false
  });
