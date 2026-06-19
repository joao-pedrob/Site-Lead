import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, MessageCircle, Mail, Phone, MapPin, Wrench, Inbox, RefreshCw } from "lucide-react";
import { getLeads, deleteLead, clearLeads, type Lead } from "@/lib/leads-store";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Solicitações — Joaquim Empilhadeiras" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const WHATSAPP_NUMBER = "5585999999999"; // DDD 85 — Ceará

function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("");

  function refresh() {
    setLeads(getLeads());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleDelete(id: string) {
    deleteLead(id);
    refresh();
    toast.success("Solicitação removida");
  }

  function handleClear() {
    if (!confirm("Apagar todas as solicitações?")) return;
    clearLeads();
    refresh();
    toast.success("Lista limpa");
  }

  const filtered = leads.filter((l) =>
    [l.nome, l.telefone, l.localizacao, l.tipoServico, l.descricao]
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream">
      <Toaster richColors position="top-center" />

      <header className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-amber font-semibold">Painel interno</div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold">Solicitações recebidas</h1>
            <p className="mt-2 text-cream/70 text-sm">
              Visualização simples dos leads enviados pelo formulário do site.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-full bg-cream/10 hover:bg-cream/20 text-cream px-4 py-2 text-sm font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Atualizar
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-full bg-destructive/90 hover:bg-destructive text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Limpar tudo
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-ember text-ink">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-ink font-display">{leads.length}</div>
              <div className="text-xs text-ink-soft uppercase tracking-wider">solicitações totais</div>
            </div>
          </div>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar por nome, cidade, serviço..."
            className="w-full sm:w-80 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember/40 focus:border-ember"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
            <Inbox className="h-10 w-10 mx-auto text-ink-soft/50" />
            <p className="mt-4 text-ink font-semibold">Nenhuma solicitação por aqui</p>
            <p className="mt-1 text-sm text-ink-soft">
              Os pedidos enviados pelo formulário aparecerão nesta lista.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((l) => (
              <article
                key={l.id}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft hover:border-ember/40 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-lg font-bold text-ink">{l.nome}</h2>
                      <span className="text-[10px] font-mono uppercase tracking-wider rounded-full bg-amber/30 text-ink px-2 py-0.5">
                        #{l.id.slice(0, 8)}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-ink-soft">
                      {new Date(l.createdAt).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Olá ${l.nome}, sou da Joaquim Empilhadeiras retornando sobre sua solicitação #${l.id.slice(0, 8).toUpperCase()} (${l.tipoServico}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                    <button
                      onClick={() => handleDelete(l.id)}
                      aria-label="Remover"
                      className="grid h-8 w-8 place-items-center rounded-full text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <InfoItem icon={Phone} label="Telefone" value={l.telefone} />
                  <InfoItem icon={Mail} label="E-mail" value={l.email || "—"} />
                  <InfoItem icon={MapPin} label="Local" value={l.localizacao} />
                  <InfoItem icon={Wrench} label="Serviço" value={l.tipoServico} />
                </div>

                <div className="mt-4 rounded-xl bg-muted/60 border border-border p-4">
                  <div className="text-[10px] uppercase tracking-wider text-ink-soft font-semibold mb-1">
                    Descrição
                  </div>
                  <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{l.descricao}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs text-ink-soft/70 text-center">
          As solicitações ficam salvas localmente no navegador (demonstração). Para histórico
          compartilhado entre dispositivos, conecte um backend.
        </p>
      </main>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ember/10 text-ember">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-ink-soft font-semibold">{label}</div>
        <div className="text-ink font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
