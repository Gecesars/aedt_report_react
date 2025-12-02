import { useQuery } from "@tanstack/react-query";
import { fetchGeometryImage, fetchRadiation } from "../services/aedtApi";

export const useRadiation = (designId: string) =>
  useQuery({ queryKey: ["radiation", designId], queryFn: () => fetchRadiation(designId), enabled: !!designId });

export const useGeometryImage = (designId: string, view = "isometric") =>
  useQuery({ queryKey: ["geometry-image", designId, view], queryFn: () => fetchGeometryImage(designId, view), enabled: !!designId });
