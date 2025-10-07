import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectCarousel from "@/components/ProjectCarousel";
import WhatsAppSection from "@/components/WhatsAppSection";
import Footer from "@/components/Footer";

export default function Home() {
  // Todo: replace with actual data from backend
  const projects = [
    {
      title: "Site Corporativo Moderno",
      description: "Website empresarial desenvolvido com tecnologias avançadas, design responsivo e otimizado para conversões. Inclui sistema de gestão de conteúdo e integração com redes sociais.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      projectUrl: "#projeto-corporativo",
      tags: ["Responsivo", "Moderno", "SEO"],
    },
    {
      title: "E-commerce Completo",
      description: "Loja virtual robusta com carrinho de compras, sistema de pagamento integrado, painel administrativo e controle de estoque. Interface intuitiva e segura para vendas online.",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      projectUrl: "#projeto-ecommerce",
      tags: ["E-commerce", "Pagamentos", "Dashboard"],
    },
    {
      title: "Portal de Notícias",
      description: "Portal dinâmico com sistema de gestão de conteúdo, área de comentários, newsletter automática e painel de controle para editores. Design otimizado para SEO.",
      imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop",
      projectUrl: "#projeto-portal",
      tags: ["CMS", "Newsletter", "Blog"],
    },
    {
      title: "Sistema de Gestão",
      description: "Aplicação web para gestão empresarial com dashboard interativo, relatórios em tempo real, controle de usuários e módulos personalizáveis conforme necessidade do cliente.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      projectUrl: "#projeto-sistema",
      tags: ["Dashboard", "Relatórios", "Gestão"],
    },
    {
      title: "Landing Page Conversiva",
      description: "Página de alta conversão desenvolvida com foco em performance e experiência do usuário. Inclui formulários otimizados, CTAs estratégicos e integração com ferramentas de marketing.",
      imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
      projectUrl: "#projeto-landing",
      tags: ["Landing Page", "Conversão", "Marketing"],
    },
  ];

  // Todo: replace with actual phone number
  const whatsappNumber = "5511999999999";

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <ProjectCarousel projects={projects} />
      <WhatsAppSection phoneNumber={whatsappNumber} />
      <Footer />
    </div>
  );
}
