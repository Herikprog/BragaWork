import ProjectCarousel from "../ProjectCarousel";

export default function ProjectCarouselExample() {
  const mockProjects = [
    {
      title: "Site Corporativo Moderno",
      description: "Website empresarial desenvolvido com tecnologias avançadas, design responsivo e otimizado para conversões.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      projectUrl: "#",
      tags: ["Responsivo", "Moderno", "SEO"],
    },
    {
      title: "E-commerce Completo",
      description: "Loja virtual robusta com carrinho de compras, sistema de pagamento integrado e painel administrativo.",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      projectUrl: "#",
      tags: ["E-commerce", "Pagamentos", "Dashboard"],
    },
    {
      title: "Portal de Notícias",
      description: "Portal dinâmico com sistema de gestão de conteúdo, área de comentários e newsletter automática.",
      imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop",
      projectUrl: "#",
      tags: ["CMS", "Newsletter", "Blog"],
    },
  ];

  return <ProjectCarousel projects={mockProjects} />;
}
