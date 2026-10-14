import { horizontalWheelDelta } from "@/lib/horizontal-scroll";
import { useEffect, useRef, useState } from "react";
import {
  Wrench, Cog, ShieldCheck, Truck, Phone, MapPin, MessageCircle,
  ArrowRight, Clock, Star, Send,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { saveLead } from "@/lib/leads-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroImg from "@/assets/hero-forklift.jpg";
import partsImg from "@/assets/parts.jpg";
import maintenanceImg from "@/assets/maintenance.jpg";
import teamJoaquimImg from "@/assets/team-joaquim.jpeg";

const WHATSAPP_NUMBER = "5585999999999"; // Substituir pelo número real (DDD 85 — Ceará)
const WHATSAPP_DISPLAY = "(85) 99999-9999";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  email: z.string().trim().email("E-mail inválido").max(120).or(z.literal("")),
  localizacao: z.string().trim().min(2, "Informe sua cidade").max(120),
  tipoServico: z.string().trim().min(2, "Selecione um tipo de serviço").max(60),
  descricao: z.string().trim().min(10, "Descreva o serviço (mín. 10 caracteres)").max(1000),
});

const TIPOS_SERVICO = [
  "Venda de peças",
  "Manutenção preventiva",
  "Reparo emergencial",
  "Diagnóstico técnico",
  "Outro",
];


const pages = [{to: '/#topo', label: 'Início'}, {to: '/#servicos', label: 'Serviços'}, {to: '/#diferenciais', label: 'Sobre'}, {to: '/#contato', label: 'Contato'}] as const;
export function SiteLayout({children}: {children: React.ReactNode}) {
  const contentRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const labels = ['Início', 'Serviços', 'Como funciona', 'Sobre', 'Depoimentos', 'Equipe', 'Contato', 'Informações'];
  const moveTo = (index: number) => {
    const root = contentRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.scrollTo({left: Math.max(0, Math.min(labels.length - 1, index)) * root.clientWidth, behavior: reduced ? 'instant' : 'smooth'});
  };
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let wheelTotal = 0;
    let lastWheelAt = 0;
    let wheelLockedUntil = 0;
    const onWheel = (event: WheelEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const panel = target?.closest<HTMLElement>('.horizontal-panel');
      let canScrollVertically = false;
      for (let element = target; element && element !== root; element = element.parentElement) {
        const style = getComputedStyle(element);
        if (!/(auto|scroll)/.test(style.overflowY)) continue;
        if (element.scrollHeight <= element.clientHeight + 1) continue;
        if (event.deltaY > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 2 : element.scrollTop > 2) {
          canScrollVertically = true;
          break;
        }
        if (element === panel) break;
      }
      const delta = horizontalWheelDelta({deltaX: event.deltaX, deltaY: event.deltaY, deltaMode: event.deltaMode, width: root.clientWidth, controlKey: event.ctrlKey, interactive: !!target?.closest('textarea, input, select, [role="listbox"], [role="option"]'), canScrollVertically});
      if (delta === null) return;
      event.preventDefault();
      const now = Date.now();
      if (now < wheelLockedUntil) return;
      if (now - lastWheelAt > 180) wheelTotal = 0;
      lastWheelAt = now;
      wheelTotal += delta;
      if (Math.abs(wheelTotal) < 40) return;
      const next = Math.max(0, Math.min(root.children.length - 1, Math.round(root.scrollLeft / root.clientWidth) + Math.sign(wheelTotal)));
      root.scrollTo({left: next * root.clientWidth, behavior: preference.matches ? 'instant' : 'smooth'});
      wheelTotal = 0;
      wheelLockedUntil = now + 650;
    };
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      const panel = target?.closest<HTMLElement>('.horizontal-panel');
      if (!panel || !root.contains(panel)) return;
      root.scrollTo({left: panel.offsetLeft - root.offsetLeft, behavior: preference.matches ? 'instant' : 'smooth'});
    };
    const onLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest('a') : null;
      if (!target || target.target === '_blank') return;
      const url = new URL(target.href, window.location.href);
      if (url.origin !== location.origin || url.pathname !== '/' || !url.hash) return;
      const destination = document.getElementById(url.hash.slice(1));
      if (!destination || !root.contains(destination)) return;
      event.preventDefault();
      history.replaceState(history.state, '', url.hash);
      syncHash();
    };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(Math.round(root.scrollLeft / root.clientWidth)));
    };
    const onResize = () => {
      const index = Math.round(root.scrollLeft / root.clientWidth);
      root.scrollTo({left: index * root.clientWidth, behavior: 'instant'});
      onScroll();
    };
    const resize = new ResizeObserver(onResize);
    resize.observe(root);
    root.addEventListener('wheel', onWheel, {passive: false});
    root.addEventListener('scroll', onScroll, {passive: true});
    document.addEventListener('click', onLink);
    window.addEventListener('hashchange', syncHash);
    const initialFrame = requestAnimationFrame(syncHash);
    const targets = Array.from(root.querySelectorAll<HTMLElement>('section > .site-container > *, .horizontal-panel > .site-container > *'));
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('scroll-pending');
        entry.target.classList.add('scroll-enter');
        observer?.unobserve(entry.target);
      }
    }, {root, threshold: 0, rootMargin: '0px -24px 0px 0px'}) : null;
    if (!preference.matches && observer) targets.forEach((element, index) => {
      element.style.setProperty('--scroll-delay', ((index % 3) * 65) + 'ms');
      element.classList.add('scroll-pending');
      observer.observe(element);
    });
    const showAll = () => {
      if (!preference.matches) return;
      observer?.disconnect();
      targets.forEach(element => element.classList.remove('scroll-pending', 'scroll-enter'));
    };
    preference.addEventListener('change', showAll);
    return () => {
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onLink);
      window.removeEventListener('hashchange', syncHash);
      preference.removeEventListener('change', showAll);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initialFrame);
      resize.disconnect();
      observer?.disconnect();
      targets.forEach(element => {
        element.classList.remove('scroll-pending', 'scroll-enter');
        element.style.removeProperty('--scroll-delay');
      });
    };
  }, []);
  return <><Toaster richColors position="top-center" /><div className="horizontal-site bg-background text-foreground">
    <Nav />
    <main id="conteudo" ref={contentRef} className="horizontal-track" tabIndex={0} aria-label="Conteúdo com rolagem horizontal" onKeyDown={event => {
      if ((event.target as HTMLElement).closest('input, textarea, select, button, a, [role="combobox"], [contenteditable]') || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); moveTo(active + 1); }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); moveTo(active - 1); }
      if (event.key === 'Home') { event.preventDefault(); moveTo(0); }
      if (event.key === 'End') { event.preventDefault(); moveTo(labels.length - 1); }
    }}>{children}<div className="horizontal-panel footer-panel"><Footer /></div></main>
    <nav className="scroll-controls" aria-label="Navegar pelas telas">
      <span className="text-xs text-muted-foreground hidden sm:block">Role para explorar <ArrowRight className="inline h-3 w-3" /></span>
      <div className="flex items-center gap-2 sm:gap-4">
        <button type="button" onClick={() => moveTo(active - 1)} disabled={active === 0} aria-label="Tela anterior" className="scroll-button"><ArrowRight className="h-4 w-4 rotate-180" /></button>
        <span className="text-sm min-w-32 text-center" aria-live="polite"><strong>{String(active + 1).padStart(2, '0')}</strong> / {labels.length} · {labels[active]}</span>
        <button type="button" onClick={() => moveTo(active + 1)} disabled={active === labels.length - 1} aria-label="Próxima tela" className="scroll-button"><ArrowRight className="h-4 w-4" /></button>
      </div>
      <div className="scroll-progress" aria-hidden="true"><span style={{width: ((active + 1) / labels.length * 100) + '%'}} /></div>
    </nav>
    <FloatingWhatsapp />
  </div></>;
}

function Nav() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
    <a href="#conteudo" className="sr-only focus:not-sr-only focus:block focus:p-3">Pular para o conteúdo</a>
    <div className="site-container flex min-h-20 items-center justify-between gap-4 py-3">
      <a href="/#topo" onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-ember"><Truck className="h-5 w-5 text-ink" /></span><span className="font-display font-bold text-ink text-lg sm:text-xl leading-tight max-w-64">Manutenção elétrica e a combustão</span></a>
      <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-6 text-sm font-semibold">{pages.map(p => <a key={p.to} href={p.to} className="py-2 hover:text-ember">{p.label}</a>)}</nav>
      <a href={'https://wa.me/' + WHATSAPP_NUMBER} target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex items-center gap-2 rounded-full bg-ink text-cream px-4 py-2 text-sm font-semibold"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
      <button type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(!open)} className="md:hidden rounded-lg border border-border p-3 shrink-0">{open ? 'Fechar' : 'Menu'}</button>
    </div>
    {open && <nav id="menu-mobile" aria-label="Navegação no celular" className="site-container md:hidden flex flex-col pb-4">{pages.map(p => <a key={p.to} href={p.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-semibold hover:bg-muted">{p.label}</a>)}</nav>}
  </header>;
}
export function HomePage() { return <SiteLayout><div className="horizontal-panel intro-panel"><Hero /><LogosStrip /></div><div className="horizontal-panel"><Services /></div><div className="horizontal-panel"><HowItWorks /></div><div className="horizontal-panel"><WhyUs /></div><div className="horizontal-panel"><Testimonials /></div><div className="horizontal-panel"><Team /></div><div className="horizontal-panel"><LeadForm /></div></SiteLayout>; }
/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-ember opacity-30 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="site-container py-12 lg:py-16 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <p className="text-sm font-semibold text-ink-soft tracking-wide">
            <MapPin className="inline h-3.5 w-3.5 text-ember mr-1 -mt-0.5" />
            Fortaleza e região metropolitana · desde 2008
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] font-bold text-balance text-ink">
            Sua empilhadeira <span className="relative inline-block">
              <span className="relative z-10">parada</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-amber/70 -z-0 rounded" />
            </span> custa caro.
            <br className="hidden sm:block" />
            <span className="text-ember">Rodando de novo ainda hoje.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
            Peças originais, manutenção preventiva e reparos rápidos para sua frota. Solicite orçamento e fale direto com um técnico em minutos.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-ember text-ink px-6 py-3.5 text-sm font-semibold shadow-ember hover:scale-[1.02] transition-transform">
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
            <a href="/#contato" className="group inline-flex items-center gap-2 rounded-full border border-ink/15 text-ink px-6 py-3.5 text-sm font-semibold hover:bg-ink/5 transition-colors">
              Solicitar orçamento
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-ember">
            <img src={heroImg} alt="Empilhadeira laranja em galpão iluminado" className="h-full w-full object-cover" width={1600} height={1200} />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent" />
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
      <div className="site-container py-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
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
      title: "Manutenção elétrica e a combustão",
      desc: "Manutenção preventiva de empilhadeiras elétricas e a combustão, com checklist completo para evitar paradas e prolongar a vida útil da máquina.",
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
    <section id="servicos" className="py-14 sm:py-20">
      <div className="site-container">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-balance">
            Peça, manutenção, reparo. Tudo com a mesma equipe.
          </h2>
          <p className="mt-4 text-ink-soft">
            Da peça que falta até o reparo emergencial — sem enrolação, técnicos certificados e orçamento transparente.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((it) => (
            <article
              key={it.title}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-7 hover:shadow-ember transition-all duration-500 `}
            >
              {it.img && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <img src={it.img} alt="" className="h-full w-full object-cover" loading="lazy" width={1200} height={900} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
                </div>
              )}
              <div className="relative">
                <div className="flex items-start justify-between">
                  <it.icon className="h-7 w-7 text-ember" strokeWidth={1.75} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold rounded-full bg-amber/30 text-ink px-2.5 py-1 group-hover:bg-amber/90">
                    {it.tag}
                  </span>
                </div>
                <h3 className={`mt-6 text-xl font-bold text-ink transition-colors ${it.img ? "group-hover:text-cream" : ""}`}>
                  {it.title}
                </h3>
                <p className={`mt-2 text-sm text-ink-soft transition-colors leading-relaxed ${it.img ? "group-hover:text-cream/80" : ""}`}>
                  {it.desc}
                </p>
                <a href="/#contato" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ember group-hover:text-amber">
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
    <section id="como-funciona" className="py-14 sm:py-20 bg-gradient-ink text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      <div className="relative site-container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-balance max-w-2xl">
              Quatro passos. Direto ao ponto.
            </h2>
          </div>
          <p className="text-cream/70 max-w-md">
            Sem cadastros complicados, sem espera. Do primeiro contato à máquina rodando.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="font-display text-6xl font-bold text-ember">{s.n}</div>
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
    <section id="diferenciais" className="py-14 sm:py-20">
      <div className="site-container grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-soft">
          <img src={maintenanceImg} alt="Técnico realizando manutenção em empilhadeira" className="w-full h-full object-cover" loading="lazy" width={1200} height={900} />
        </div>
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-balance">
            Comecei em 2008 com uma caixa de ferramentas na garupa da moto.
          </h2>
          <p className="mt-4 text-ink-soft">
            Hoje são 18 anos de oficina e a equipe cresceu, mas o jeito de atender continua o mesmo: aparecer rápido e resolver de verdade.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {bullets.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border p-5 bg-card hover:border-ember/40 transition-colors">
                <b.icon className="h-6 w-6 text-ember" strokeWidth={1.75} />
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

/* ---------------- TEAM ---------------- */
type Member = {
  name: string;
  role: string;
  years: string;
  quote: string;
  img?: string;
};

function Team() {
  // TODO: substituir pela foto real de cada pessoa (img) quando o cliente enviar.
  const members: Member[] = [
    {
      name: "Joaquim Andrade",
      role: "Fundador & Mestre de oficina",
      years: "32 anos com empilhadeiras",
      quote: "Máquina parada é prejuízo. A gente trata cada chamado como se fosse o nosso próprio galpão.",
    },
    {
      name: "Rafael Moura",
      role: "Coordenador técnico",
      years: "12 anos na equipe",
      quote: "Gosto do problema difícil. O cliente fica tranquilo quando entende o que estamos fazendo na máquina dele.",
    },
    {
      name: "Carla Nogueira",
      role: "Atendimento e peças",
      years: "7 anos com a Joaquim",
      quote: "Atendo no WhatsApp como atenderia um vizinho. Resposta rápida, sem enrolação e com a peça certa.",
    },
    {
      name: "Diego Tavares",
      role: "Técnico de campo",
      years: "9 anos em manutenção",
      quote: "Saio com a van abastecida de peças. Quando dá pra resolver no mesmo dia, a gente resolve no mesmo dia.",
    },
    {
      // TODO: confirmar sobrenome e tempo de empresa com o cliente.
      name: "Joaquim",
      role: "Atendimento e notas fiscais",
      years: "Equipe Manutenção elétrica e a combustão",
      quote: "Cuido do atendimento e da nota fiscal de cada serviço, e ainda acompanho o pessoal nas visitas de manutenção pela região.",
      img: teamJoaquimImg,
    },
  ];
  return (
    <section id="equipe" className="border-t border-border">
      <div className="site-container pt-24 pb-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink text-balance">
          A equipe por trás do atendimento.
        </h2>
        <p className="mt-4 text-ink-soft max-w-2xl mx-auto">
          Cada chamado tem um nome e um rosto. Estas são as pessoas que vão resolver o seu problema.
        </p>
      </div>
      {members.map((m, i) => (
        <TeamRow key={m.name} m={m} index={i} />
      ))}
    </section>
  );
}

function TeamRow({ m, index }: { m: Member; index: number }) {
  const reversed = index % 2 === 1;
  const initials = m.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div      className="site-container py-12 grid lg:grid-cols-2 gap-10 items-center"
    >
      <div className={reversed ? "lg:order-2" : ""}>
        {m.img ? (
          <img
            src={m.img}
            alt={m.name}
            className="aspect-square w-full max-w-sm mx-auto rounded-3xl object-cover shadow-soft"
          />
        ) : (
          <div className="aspect-square w-full max-w-sm mx-auto rounded-3xl bg-gradient-ember shadow-ember grid place-items-center">
            <span className="text-6xl font-bold text-ink">{initials}</span>
          </div>
        )}
      </div>
      <div className={reversed ? "lg:order-1" : ""}>
        <h3 className="text-2xl sm:text-3xl font-bold text-ink">{m.name}</h3>
        <p className="mt-1 text-sm font-semibold text-ink-soft">{m.role} · {m.years}</p>
        <blockquote className="mt-5 text-lg text-ink-soft leading-relaxed max-w-md">
          "{m.quote}"
        </blockquote>
      </div>
    </div>
  );
}

/* ---------------- LEAD FORM ---------------- */
function LeadForm() {
  const [form, setForm] = useState({
    nome: "", telefone: "", email: "", localizacao: "", tipoServico: "", descricao: "",
  });
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
    const lead = saveLead(parsed.data);
    const msg = encodeURIComponent(
      `Olá, Manutenção elétrica e a combustão! 👋\n\n` +
      `Acabei de enviar uma solicitação pelo site:\n\n` +
      `🧾 *Protocolo:* ${lead.id.slice(0, 8).toUpperCase()}\n` +
      `🕒 *Enviado em:* ${new Date(lead.createdAt).toLocaleString("pt-BR")}\n\n` +
      `👤 *Nome:* ${parsed.data.nome}\n` +
      `📱 *Telefone:* ${parsed.data.telefone}\n` +
      `📧 *E-mail:* ${parsed.data.email || "—"}\n` +
      `📍 *Localização:* ${parsed.data.localizacao}\n` +
      `🔧 *Tipo de serviço:* ${parsed.data.tipoServico}\n\n` +
      `📝 *Descrição:*\n${parsed.data.descricao}\n\n` +
      `Aguardo retorno, obrigado!`
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    const win = window.open(whatsappUrl, "_blank");
    if (!win || win.closed) {
      toast.error("Não foi possível abrir o WhatsApp automaticamente.", {
        action: {
          label: "Abrir manualmente",
          onClick: () => window.open(whatsappUrl, "_blank"),
        },
        duration: 10000,
      });
    } else {
      toast.success("Solicitação enviada! Estamos te redirecionando ao WhatsApp.");
    }
    setForm({ nome: "", telefone: "", email: "", localizacao: "", tipoServico: "", descricao: "" });
    setLoading(false);
  }

  return (
    <section id="contato" className="py-14 sm:py-20 bg-cream relative overflow-hidden">
      <div className="absolute -top-32 right-0 h-96 w-96 bg-gradient-ember opacity-20 rounded-full blur-3xl" />
      <div className="relative site-container grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
        <div className="lg:sticky lg:top-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-balance">Fale com a nossa equipe.</h2>
          <p className="mt-4 text-ink-soft">
            Preencha o formulário ou chame direto no WhatsApp. Sua mensagem chega organizada para o técnico responsável.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-700 px-3 py-1.5 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5" /> Respondemos em até 1 hora no horário comercial
          </div>

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
                <div className="font-semibold text-ink">(85) 4002-8922</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber/30 text-ink">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Atendimento</div>
                <div className="font-semibold text-ink">Fortaleza e Região Metropolitana</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-soft">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="lead-nome" label="Nome completo *" value={form.nome} onChange={(v) => update("nome", v)} placeholder="Seu nome" />
            <Field id="lead-telefone" label="WhatsApp / Telefone *" value={form.telefone} onChange={(v) => update("telefone", v)} placeholder="(85) 99999-9999" type="tel" inputMode="tel" />
            <Field id="lead-email" label="E-mail" value={form.email} onChange={(v) => update("email", v)} placeholder="opcional" type="email" />
            <Field id="lead-localizacao" label="Cidade / Localização *" value={form.localizacao} onChange={(v) => update("localizacao", v)} placeholder="Cidade - UF" />
          </div>
          <div className="mt-4">
            <label htmlFor="lead-tipo-servico" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Tipo de serviço *
            </label>
            <Select value={form.tipoServico} onValueChange={(v) => update("tipoServico", v)}>
              <SelectTrigger id="lead-tipo-servico" className="w-full h-auto rounded-xl border-input bg-background px-4 py-3 text-sm text-ink focus:ring-2 focus:ring-ember/40 focus:border-ember">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_SERVICO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <label htmlFor="lead-descricao" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              O que você precisa? *
            </label>
            <textarea
              id="lead-descricao"
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

function Field({ id, label, value, onChange, placeholder, type = "text", inputMode }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{label}</label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
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
    <section className="py-14 sm:py-20">
      <div className="site-container">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-balance">
            O que os clientes dizem.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <figure key={t.name} className="rounded-3xl border border-border bg-card p-7 hover:shadow-soft transition-shadow flex flex-col justify-between">
              <blockquote className="text-ink leading-relaxed">"{t.text}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-amber/40 text-ink font-bold text-sm shrink-0">
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
      <div className="site-container py-16 grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-ember">
              <Truck className="h-5 w-5 text-ink" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold text-cream">Manutenção elétrica e a combustão</div>
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
            <li><a href="/#servicos" className="hover:text-ember">Venda de peças</a></li>
            <li><a href="/#servicos" className="hover:text-ember">Manutenção preventiva</a></li>
            <li><a href="/#servicos" className="hover:text-ember">Reparos emergenciais</a></li>
            <li><a href="/#servicos" className="hover:text-ember">Diagnóstico técnico</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-cream mb-4">Contato</h4>
          <ul className="space-y-2 text-sm">
            <li>{WHATSAPP_DISPLAY}</li>
            <li>contato@joaquimempilhadeiras.com.br</li>
            <li>Fortaleza e Região Metropolitana</li>
            <li>Seg-Sex 08h às 18h · Plantão 24h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="site-container py-5 text-xs text-cream/50 flex flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} Manutenção elétrica e a combustão. Todos os direitos reservados.</span>
          {/* TODO: inserir CNPJ real assim que o cliente enviar — não publicar com número fictício */}
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
