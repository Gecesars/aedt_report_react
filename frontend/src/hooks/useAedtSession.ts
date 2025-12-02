import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectSession, fetchSessionStatus, startSession } from "../services/aedtApi";

export const useSessionStatus = () =>
  useQuery({ queryKey: ["session-status"], queryFn: fetchSessionStatus, refetchInterval: 10000 });

export const useConnectSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session-status"] })
  });
};

export const useStartSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (force: boolean) => startSession(force),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session-status"] })
  });
};
