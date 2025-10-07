import { Smartphone, Rocket, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function About() {
  const features = [
    {
      icon: Smartphone,
      title: "Design Responsivo",
      description: "Sites que funcionam perfeitamente em todos os dispositivos",
    },
    {
      icon: Rocket,
      title: "Performance Otimizada",
      description: "Carregamento rápido para melhor experiência do usuário",
    },
    {
      icon: Search,
      title: "SEO Otimizado",
      description: "Melhor posicionamento nos resultados de busca",
    },
  ];

  const techStack = [
    { icon: "fab fa-html5", name: "HTML5", delay: "0.1s" },
    { icon: "fab fa-css3-alt", name: "CSS3", delay: "0.2s" },
    { icon: "fab fa-js-square", name: "JavaScript", delay: "0.3s" },
    { icon: "fab fa-react", name: "React", delay: "0.4s" },
    { icon: "fab fa-node-js", name: "Node.js", delay: "0.5s" },
    { icon: "fas fa-database", name: "MySQL", delay: "0.6s" },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 relative inline-block">
            O Que Fazemos
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
          </h2>
          <p className="text-lg text-muted-foreground mt-6">
            Especializados em criar experiências digitais únicas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary mb-6">
              BragaWork - Seu Parceiro Digital
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Na BragaWork, desenvolvemos sites modernos e funcionais que não apenas impressionam
              visualmente, mas também convertem visitantes em clientes. Nossa expertise combina
              design inovador com tecnologia de ponta para criar soluções que fazem a diferença
              no seu negócio.
            </p>

            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-4 border-card-border bg-card/50 hover:border-primary/50 hover-elevate transition-all duration-300 hover:translate-x-2"
                  data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <Card
                key={index}
                className="p-6 border-card-border bg-card/50 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: tech.delay }}
                data-testid={`tech-${tech.name.toLowerCase()}`}
              >
                <link
                  rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                />
                <i className={`${tech.icon} text-4xl text-primary`} />
                <span className="text-sm font-semibold text-foreground">{tech.name}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
