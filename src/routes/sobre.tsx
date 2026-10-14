import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/site/pages";
export const Route = createFileRoute("/sobre")({
 head: () => ({meta: [
  {title: "Sobre | Manutenção elétrica e a combustão"},
  {name: "description", content: "Manutenção elétrica e a combustão de empilhadeiras, peças e reparos em Fortaleza e região metropolitana. Solicite seu orçamento."},
  {property: "og:title", content: "Sobre | Manutenção elétrica e a combustão"},
 ]}),
 component: AboutPage,
});
