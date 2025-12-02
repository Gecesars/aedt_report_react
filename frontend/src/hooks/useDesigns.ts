import { useMemo } from "react";
import { useProjects } from "./useProjects";

export const useDesigns = () => {
  const { data, ...rest } = useProjects();
  const designs = useMemo(() => {
    if (!data?.projects) return [];
    return data.projects.flatMap((project) =>
      project.designs.map((designId) => ({ projectId: project.project_id, designId }))
    );
  }, [data]);
  return { designs, projects: data?.projects ?? [], ...rest };
};
