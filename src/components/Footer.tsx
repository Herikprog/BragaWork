import { Button } from "@/components/ui/button";
import { Instagram, MessageCircle } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com",
      color: "hover:text-[#E4405F]",
    },
    {
      name: "TikTok",
      icon: SiTiktok,
      url: "https://tiktok.com",
      color: "hover:text-[#000000] dark:hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/5511999999999",
      color: "hover:text-[#25D366]",
    },
  ];

  const quickLinks = [
    { name: "Início", href: "#home" },
    { name: "Sobre", href: "#about" },
    { name: "Projetos", href: "#projects" },
    { name: "WhatsApp", href: "#whatsapp" },
  ];

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const openSocialLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    console.log("Opening social link:", url);
  };

  return (
    <footer id="contact" className="bg-background border-t border-primary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo-braga-work.jpg" 
                alt="BragaWork Logo" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-primary">BragaWork</span>
            </div>
            <p className="text-muted-foreground">
              Desenvolvendo soluções digitais modernas para impulsionar seu negócio.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Links Rápidos</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`footer-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Redes Sociais</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  onClick={() => openSocialLink(social.url)}
                  className={`border-primary/30 hover:border-primary/50 transition-all hover-elevate ${social.color}`}
                  data-testid={`social-${social.name.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/10 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} BragaWork. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
