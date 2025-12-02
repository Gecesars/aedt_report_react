import { useMutation, useQuery } from "@tanstack/react-query";
import { createSimulationVideo, fetchSimulationStatus } from "../services/aedtApi";
import { SimulationVideoRequest } from "../types/simulations";

export const useSimulationJob = (designId: string) =>
  useMutation({
    mutationFn: (payload: SimulationVideoRequest) => createSimulationVideo(designId, payload)
  });

export const useSimulationStatus = (jobId: string | null) =>
  useQuery({
    queryKey: ["simulation-status", jobId],
    queryFn: () => (jobId ? fetchSimulationStatus(jobId) : Promise.reject("jobId")),
    enabled: !!jobId,
    refetchInterval: jobId ? 4000 : false
  });
