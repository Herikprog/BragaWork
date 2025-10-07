import { Button } from "@/components/ui/button";
import { ChevronDown, Rocket, Eye } from "lucide-react";

export default function Hero() {
  const codeSnippets = [
    { text: "console.log('Hello World');", delay: "0s", top: "10%", left: "10%" },
    { text: "function createWebsite() {", delay: "2s", top: "20%", right: "15%" },
    { text: "  return 'Amazing Site';", delay: "4s", top: "60%", left: "5%" },
    { text: "}", delay: "6s", top: "70%", right: "10%" },
    { text: "<div class='success'>", delay: "8s", top: "40%", left: "80%" },
  ];

  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWhatsApp = () => {
    document.querySelector("#whatsapp")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {codeSnippets.map((snippet, index) => (
          <div
            key={index}
            className="absolute text-primary/30 font-mono text-sm animate-float"
            style={{
              top: snippet.top,
              left: snippet.left,
              right: snippet.right,
              animationDelay: snippet.delay,
            }}
          >
            {snippet.text}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
          <span className="text-foreground">Desenvolvemos Sites</span>
          <br />
          <span className="text-primary drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
            Para Seu Negócio
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Transformamos suas ideias em soluções digitais modernas e funcionais que impulsionam o crescimento do seu negócio.
        </p>

        <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            onClick={scrollToWhatsApp}
            className="bg-primary hover:bg-primary/90 text-primary-foreground hover-elevate active-elevate-2 shadow-lg shadow-primary/20"
            data-testid="button-solicitar-orcamento"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Solicitar Orçamento
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToProjects}
            className="border-primary/50 text-foreground hover:bg-primary/10 hover-elevate active-elevate-2"
            data-testid="button-ver-projetos"
          >
            <Eye className="mr-2 h-5 w-5" />
            Ver Projetos
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-primary" />
      </div>
    </section>
  );
}
