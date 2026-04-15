import { Link } from "wouter";
import { Instagram, Facebook, Heart, ShoppingBag } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[oklch(0.22_0.04_30)] text-[oklch(0.95_0.01_50)]">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-base font-semibold text-white tracking-wide">
                  Taise Sena
                </span>
                <span className="text-[10px] text-white/50 tracking-widest uppercase font-light">
                  Confeitaria
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Criando momentos doces e inesquecíveis com bolos artesanais e doces finos feitos com amor e dedicação.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/tay.guerra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-white font-medium mb-4 text-sm tracking-widest uppercase">
              Navegação
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Início" },
                { href: "/catalogo", label: "Catálogo" },
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-white/60 hover:text-accent transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-white font-medium mb-4 text-sm tracking-widest uppercase">
              Contato
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>📍 Brasil</li>
              <li>
              <a
                href="https://wa.me/5571988461789"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                📱 WhatsApp
              </a>
              </li>
              <li>
                <a
                  href="mailto:isaquec946@gmail.com"
                  className="hover:text-accent transition-colors"
                >
                  ✉️ isaquec946@gmail.com
                </a>
              </li>
              <li>🕐 Seg–Sáb: 8h às 18h</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {year} Taise Sena Confeitaria. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-primary fill-primary" /> e muito açúcar
          </p>
        </div>
      </div>
    </footer>
  );
}
