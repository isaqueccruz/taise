import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-base font-semibold text-foreground tracking-wide">
                  Taise Sena
                </span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-light">
                  Confeitaria
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer",
                    location === link.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/contato">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-sm">
                Encomendar
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-border shadow-lg">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={cn(
                    "block py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted hover:text-primary"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link href="/contato">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                  Encomendar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
