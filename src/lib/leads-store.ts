export type Lead = {
  id: string;
  createdAt: string;
  nome: string;
  telefone: string;
  email: string;
  localizacao: string;
  tipoServico: string;
  descricao: string;
};

const KEY = "joaquim:leads";

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Lead[];
  } catch {
    return [];
  }
}

export function saveLead(lead: Omit<Lead, "id" | "createdAt">): Lead {
  const full: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const all = [full, ...getLeads()];
  localStorage.setItem(KEY, JSON.stringify(all));
  return full;
}

export function deleteLead(id: string) {
  const all = getLeads().filter((l) => l.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearLeads() {
  localStorage.removeItem(KEY);
}
