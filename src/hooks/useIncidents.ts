import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Incident {
  id: number;
  userId: number;
  toolId: number | null;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  resolution: string | null;
  user: { id: number; name: string; email: string; career: string };
  tool: { id: number; name: string; code: string } | null;
}

export function useMyIncidents() {
  return useQuery({
    queryKey: ["my-incidents"],
    queryFn: async () => {
      const res = await api.get<Incident[]>("/incidents");
      return res as Incident[];
    },
  });
}

export function useAllIncidents() {
  return useQuery({
    queryKey: ["all-incidents"],
    queryFn: async () => {
      const res = await api.get<Incident[]>("/incidents");
      return res as Incident[];
    },
  });
}

export function useIncidentStats() {
  return useQuery({
    queryKey: ["incident-stats"],
    queryFn: async () => {
      const res = await api.get<{ total: number; open: number; inProgress: number; resolved: number; closed: number }>("/incidents/stats");
      return res;
    },
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { toolId?: number; title: string; description: string; severity?: string }) => {
      const res = await api.post("/incidents", data);
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-incidents"] });
      qc.invalidateQueries({ queryKey: ["all-incidents"] });
      qc.invalidateQueries({ queryKey: ["incident-stats"] });
    },
  });
}

export function useUpdateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; status?: string; resolution?: string; severity?: string }) => {
      const res = await api.patch(`/incidents/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-incidents"] });
      qc.invalidateQueries({ queryKey: ["all-incidents"] });
      qc.invalidateQueries({ queryKey: ["incident-stats"] });
    },
  });
}
