import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Wrench, Cog, ShieldCheck, Truck, Phone, MapPin, MessageCircle,
  ArrowRight, CheckCircle2, Clock, Sparkles, Star, Send,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import heroImg from "@/assets/hero-forklift.jpg";
import partsImg from "@/assets/parts.jpg";
import maintenanceImg from "@/assets/maintenance.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joaquim Empilhadeiras — Peças, Manutenção e Suporte Especializado" },
      { name: "description", content: "Venda de peças, manutenção preventiva e reparatória para empilhadeiras. Atendimento rápido pelo WhatsApp e orçamento sem compromisso." },
      { property: "og:title", content: "Joaquim Empilhadeiras" },
      { property: "og:description", content: "Peças originais, manutenção preventiva e reparatória para sua frota. Orçamento em minutos." },
    ],
  }),
  component: Index,
});

const WHATSAPP_NUMBER = "5511999999999"; // Substituir pelo número real
const WHATSAPP_DISPLAY = "(11) 99999-9999";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  email: z.string().trim().email("E-mail inválido").max(120).or(z.literal("")),
  localizacao: z.string().trim().min(2, "Informe sua cidade").max(120),
  descricao: z.string().trim().min(10, "Descreva o serviço (mín. 10 caracteres)").max(1000),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />
      <Nav />
      <Hero />
      <LogosStrip />
      <Services />
      <HowItWorks />
      <WhyUs />
      <LeadForm />
      <Testimonials />
      <Footer />
      <FloatingWhatsapp />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#topo" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-ember shadow-ember">
            <Truck className="h-5 w-5 text-ink" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-ink text-[15px]">Joaquim</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground -mt-0.5">Empilhadeiras</div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft">
          <a href="#servicos" className="hover:text-ember transition-colors">Serviços</a>
          <a href="#como-funciona" className="hover:text-ember transition-colors">Como funciona</a>
          <a href="#diferenciais" className="hover:text-ember transition-colors">Diferenciais</a>
          <a href="#contato" className="hover:text-ember transition-colors">Contato</a>
        </nav>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-4 py-2 text-sm font-semibold hover:bg-ember hover:text-ink transition-all shadow-soft"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-ember opacity-30 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-ink-soft">
            <Sparkles className="h-3.5 w-3.5 text-ember" /> Atendimento técnico desde 2008
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] font-bold text-balance text-ink">
            Sua empilhadeira <span className="relative inline-block">
              <span className="relative z-10">parada</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-amber/70 -z-0 rounded" />
            </span> custa caro.
            <br className="hidden sm:block" />
            <span className="bg-gradient-ember bg-clip-text text-transparent">A gente devolve o movimento.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
            Peças originais, manutenção preventiva e reparos rápidos para sua frota. Solicite orçamento e fale direto com um técnico em minutos.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contato" className="group inline-flex items-center gap-2 rounded-full bg-ink text-cream px-6 py-3.5 text-sm font-semibold shadow-soft hover:shadow-ember transition-all">
              Solicitar orçamento
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-ember text-ink px-6 py-3.5 text-sm font-semibold shadow-ember hover:scale-[1.02] transition-transform">
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {[
              { k: "+1.200", v: "frotas atendidas" },
              { k: "24h", v: "resposta média" },
              { k: "98%", v: "clientes satisfeitos" },
            ].map((s) => (
              <div key={s.v} className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-ember">{s.k}</span>
                <span className="text-ink-soft">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-3xl overflow-hidden shadow-ember">
            <img src={heroImg} alt="Empilhadeira laranja em galpão iluminado" className="h-full w-full object-cover" width={1600} height={1200} />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-6 sm:-left-10 bg-background rounded-2xl shadow-soft p-4 pr-6 flex items-center gap-3 animate-float">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/15">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Última manutenção</div>
              <div className="text-sm font-semibold text-ink">Concluída em 3h12</div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 sm:-right-8 bg-ink text-cream rounded-2xl shadow-soft p-4 max-w-[200px]">
            <div className="flex items-center gap-1.5 text-amber">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
            </div>
            <p className="mt-2 text-xs leading-snug">"Atendimento rápido, peça chegou no mesmo dia."</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider opacity-60">Logística Vega</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- LOGOS ---------------- */
function LogosStrip() {
  const brands = ["Toyota", "Hyster", "Yale", "Linde", "Still", "Crown"];
  return (
    <section className="border-y border-border bg-cream/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Trabalhamos com</span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {brands.map((b) => (
            <span key={b} className="font-display text-lg font-semibold text-ink/50 hover:text-ember transition-colors">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SERVICES ---------------- */
function Services() {
  const items = [
    {
      icon: Cog,
      title: "Peças originais e paralelas",
      desc: "Estoque amplo de filtros, garfos, correntes, bombas hidráulicas e componentes elétricos para todas as marcas.",
      tag: "Pronta entrega",
      img: partsImg,
    },
    {
      icon: ShieldCheck,
      title: "Manutenção preventiva",
      desc: "Planos mensais com checklist completo para evitar paradas inesperadas e prolongar a vida útil da máquina.",
      tag: "Plano mensal",
    },
    {
      icon: Wrench,
      title: "Reparos e diagnóstico",
      desc: "Equipe técnica para reparos hidráulicos, motor, transmissão e sistema elétrico — atendimento no local.",
      tag: "Atendimento in loco",
      img: maintenanceImg,
    },
  ];
  return (
    <section id="servicos" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">O que fazemos</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-ink text-balance">
            Tudo que sua empilhadeira precisa, em um único lugar.
          </h2>
          <p className="mt-4 text-ink-soft">
            Da peça que falta até o reparo emergencial — atendimento sem enrolação, técnicos certificados e orçamento transparente.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <article
              key={it.title}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-7 hover:shadow-ember transition-all duration-500 ${
                i === 1 ? "md:row-span-2 lg:row-span-1" : ""
              }`}
            >
              {it.img && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <img src={it.img} alt="" className="h-full w-full object-cover" loading="lazy" width={1200} height={900} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
                </div>
              )}
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-ember shadow-ember">
                    <it.icon className="h-5 w-5 text-ink" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold rounded-full bg-amber/30 text-ink px-2.5 py-1 group-hover:bg-amber/90">
                    {it.tag}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-ink group-hover:text-cream transition-colors">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft group-hover:text-cream/80 transition-colors leading-relaxed">
                  {it.desc}
                </p>
                <a href="#contato" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ember group-hover:text-amber">
                  Solicitar <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    { n: "01", title: "Você solicita", desc: "Preenche o formulário ou chama no WhatsApp com o que precisa." },
    { n: "02", title: "A gente analisa", desc: "Verificamos peça, modelo, urgência e enviamos a melhor solução." },
    { n: "03", title: "Entramos em contato", desc: "Orçamento claro, prazo definido e confirmação rápida." },
    { n: "04", title: "Realizamos o serviço", desc: "Entrega da peça ou atendimento técnico no local combinado." },
  ];
  return (
    <section id="como-funciona" className="py-24 bg-gradient-ink text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-amber font-semibold">Como funciona</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-balance max-w-2xl">
              Quatro passos. Zero burocracia.
            </h2>
          </div>
          <p className="text-cream/70 max-w-md">
            Sem cadastros complicados, sem espera. Do primeiro contato à máquina rodando, tudo direto e humano.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="font-display text-6xl font-bold bg-gradient-ember bg-clip-text text-transparent">{s.n}</div>
              <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-cream/70 leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 right-0 translate-x-1/2 text-cream/30">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY US ---------------- */
function WhyUs() {
  const bullets = [
    { icon: Clock, title: "Resposta em até 1 hora", desc: "Equipe dedicada no horário comercial e plantão para emergências." },
    { icon: ShieldCheck, title: "Garantia em todos os serviços", desc: "Peças e mão de obra com garantia formal e nota fiscal." },
    { icon: Truck, title: "Atendimento na sua operação", desc: "Vamos até o seu galpão, sem custo de deslocamento na região." },
    { icon: Star, title: "Avaliação 4.9/5", desc: "Mais de 300 empresas confiam no nosso atendimento." },
  ];
  return (
    <section id="diferenciais" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-soft">
            <img src={maintenanceImg} alt="Técnico realizando manutenção" className="w-full h-full object-cover" loading="lazy" width={1200} height={900} />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-gradient-ember rounded-2xl p-5 shadow-ember max-w-[220px]">
            <div className="font-display text-3xl font-bold text-ink">17 anos</div>
            <div className="text-sm text-ink/80">de chão de fábrica e oficina</div>
          </div>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">Por que Joaquim</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-ink text-balance">
            Confiança não se improvisa — se constrói no torno.
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {bullets.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border p-5 bg-card hover:border-ember/40 transition-colors">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber/30">
                  <b.icon className="h-5 w-5 text-ink" strokeWidth={2.2} />
                </div>
                <h3 className="mt-4 font-bold text-ink">{b.title}</h3>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- LEAD FORM ---------------- */
function LeadForm() {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", localizacao: "", descricao: "" });
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos");
      return;
    }
    setLoading(true);
    const msg = encodeURIComponent(
      `Olá, Joaquim Empilhadeiras!%0A%0A` +
      `*Nome:* ${parsed.data.nome}%0A` +
      `*Telefone:* ${parsed.data.telefone}%0A` +
      `*E-mail:* ${parsed.data.email || "—"}%0A` +
      `*Localização:* ${parsed.data.localizacao}%0A` +
      `*Serviço:* ${parsed.data.descricao}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      toast.success("Solicitação enviada! Estamos te redirecionando ao WhatsApp.");
      setForm({ nome: "", telefone: "", email: "", localizacao: "", descricao: "" });
      setLoading(false);
    }, 400);
  }

  return (
    <section id="contato" className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute -top-32 right-0 h-96 w-96 bg-gradient-ember opacity-20 rounded-full blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
        <div className="lg:sticky lg:top-24">
          <span className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">Fale com a gente</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-ink text-balance">
            Conte o que está acontecendo. Respondemos em minutos.
          </h2>
          <p className="mt-4 text-ink-soft">
            Preencha o formulário ou chame direto no WhatsApp. Sua mensagem chega organizada para o técnico responsável.
          </p>

          <div className="mt-8 space-y-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-ember/60 transition-colors">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp direto</div>
                <div className="font-semibold text-ink">{WHATSAPP_DISPLAY}</div>
              </div>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-ember/15 text-ember">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Telefone fixo</div>
                <div className="font-semibold text-ink">(11) 4002-8922</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber/30 text-ink">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Atendimento</div>
                <div className="font-semibold text-ink">São Paulo e Grande SP</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-soft">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nome completo *" value={form.nome} onChange={(v) => update("nome", v)} placeholder="Seu nome" />
            <Field label="WhatsApp / Telefone *" value={form.telefone} onChange={(v) => update("telefone", v)} placeholder="(11) 99999-9999" />
            <Field label="E-mail" value={form.email} onChange={(v) => update("email", v)} placeholder="opcional" type="email" />
            <Field label="Cidade / Localização *" value={form.localizacao} onChange={(v) => update("localizacao", v)} placeholder="Cidade - UF" />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              O que você precisa? *
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => update("descricao", e.target.value)}
              rows={5}
              maxLength={1000}
              placeholder="Ex: Empilhadeira Toyota 2.5t parou de funcionar — preciso de diagnóstico e orçamento."
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember/40 focus:border-ember resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-ember text-ink font-bold py-4 shadow-ember hover:scale-[1.01] transition-transform disabled:opacity-60"
          >
            {loading ? "Enviando..." : <>Enviar solicitação <Send className="h-4 w-4" /></>}
          </button>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Ao enviar, você concorda em ser contatado por WhatsApp, telefone ou e-mail.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={255}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember/40 focus:border-ember"
      />
    </div>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const items = [
    { name: "Marcos R.", role: "Logística Vega", text: "Chamei às 8h, às 11h o técnico já estava aqui. Empilhadeira voltou no mesmo dia." },
    { name: "Patrícia L.", role: "Indústria Norte", text: "Plano preventivo mudou nossa operação. Zero parada nos últimos 6 meses." },
    { name: "Eduardo S.", role: "Centro de Distribuição", text: "Preço justo, peça original e nota fiscal. Atendimento humano, sem robô." },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.2em] text-ember font-semibold">Quem confia</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-ink text-balance">
            Operações que escolheram parar de quebrar a cabeça.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <figure key={t.name} className="rounded-3xl border border-border bg-card p-7 hover:shadow-soft transition-shadow">
              <div className="flex gap-0.5 text-ember">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-ink leading-relaxed">"{t.text}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-ember text-ink font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-ink text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-ember">
              <Truck className="h-5 w-5 text-ink" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold text-cream">Joaquim Empilhadeiras</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-cream/50">Peças · Manutenção · Suporte</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed max-w-sm">
            Especialistas em manter sua frota em movimento. Atendimento técnico humano, peças confiáveis e prazo cumprido.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-cream mb-4">Serviços</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#servicos" className="hover:text-ember">Venda de peças</a></li>
            <li><a href="#servicos" className="hover:text-ember">Manutenção preventiva</a></li>
            <li><a href="#servicos" className="hover:text-ember">Reparos emergenciais</a></li>
            <li><a href="#servicos" className="hover:text-ember">Diagnóstico técnico</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-cream mb-4">Contato</h4>
          <ul className="space-y-2 text-sm">
            <li>{WHATSAPP_DISPLAY}</li>
            <li>contato@joaquimempilhadeiras.com.br</li>
            <li>São Paulo e Grande SP</li>
            <li>Seg-Sex 08h às 18h · Plantão 24h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 text-xs text-cream/50 flex flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} Joaquim Empilhadeiras. Todos os direitos reservados.</span>
          <span>CNPJ 00.000.000/0001-00</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- FLOATING WHATSAPP ---------------- */
function FloatingWhatsapp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank" rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-soft animate-pulse-ring hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
