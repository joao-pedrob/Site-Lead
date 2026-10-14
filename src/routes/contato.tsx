import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/pages";
export const Route = createFileRoute("/contato")({
 head: () => ({meta: [
  {title: "Contato | Manutenção elétrica e a combustão"},
  {name: "description", content: "Manutenção elétrica e a combustão de empilhadeiras, peças e reparos em Fortaleza e região metropolitana. Solicite seu orçamento."},
  {property: "og:title", content: "Contato | Manutenção elétrica e a combustão"},
 ]}),
 component: ContactPage,
});
