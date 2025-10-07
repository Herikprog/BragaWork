import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppSectionProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppSection({ 
  phoneNumber, 
  message = "Olá! Gostaria de solicitar um orçamento para desenvolvimento de website." 
}: WhatsAppSectionProps) {
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    console.log("WhatsApp opened with message:", message);
  };

  return (
    <section id="whatsapp" className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwQkZGRiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 relative inline-block">
            Solicite Seu Orçamento
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
          </h2>
          <p className="text-lg text-muted-foreground mb-10 mt-8">
            Entre em contato conosco pelo WhatsApp e receba uma proposta personalizada para o seu projeto
          </p>

          <Button
            size="lg"
            onClick={openWhatsApp}
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-6 h-auto shadow-xl shadow-[#25D366]/20 hover:shadow-2xl hover:shadow-[#25D366]/30 transition-all duration-300 animate-pulse hover:animate-none hover-elevate active-elevate-2"
            data-testid="button-whatsapp"
          >
            <MessageCircle className="mr-3 h-6 w-6" />
            Fale Conosco no WhatsApp
          </Button>

          <p className="text-sm text-muted-foreground mt-6">
            Respondemos em até 1 hora durante horário comercial
          </p>
        </div>
      </div>
    </section>
  );
}
