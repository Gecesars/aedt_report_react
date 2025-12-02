import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listProjects, openProject, uploadProject } from "../services/aedtApi";

export const useProjects = () =>
  useQuery({ queryKey: ["projects"], queryFn: listProjects, refetchInterval: 15000 });

export const useUploadProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })
  });
};

export const useOpenProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { projectId: string; openInGui?: boolean }) =>
      openProject(vars.projectId, vars.openInGui ?? true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries();
    }
  });
};
