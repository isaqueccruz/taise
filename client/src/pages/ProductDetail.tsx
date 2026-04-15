import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShoppingBag, Users, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id ?? "0");

  const { data: product, isLoading, error } = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: !isNaN(productId) && productId > 0 }
  );

  const formattedPrice = product
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parseFloat(product.price))
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-28 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
            <div className="bg-muted rounded-2xl aspect-square" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-20 bg-muted rounded" />
              <div className="h-10 bg-muted rounded w-1/3" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-28 pb-16 text-center">
          <div className="text-6xl mb-4">🎂</div>
          <h1 className="font-serif text-2xl text-foreground mb-2">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-6">Este produto pode ter sido removido ou não existe.</p>
          <Link href="/catalogo">
            <Button className="bg-primary text-white rounded-full">Ver Catálogo</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container pt-28 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/">
            <span className="hover:text-primary cursor-pointer transition-colors">Início</span>
          </Link>
          <span>/</span>
          <Link href="/catalogo">
            <span className="hover:text-primary cursor-pointer transition-colors">Catálogo</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden aspect-square shadow-xl">
              <img
                src={product.imageUrl || PLACEHOLDER_IMAGE}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-accent text-accent-foreground gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" /> Destaque
                </Badge>
              </div>
            )}
            {!product.available && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <Badge variant="secondary" className="text-base px-4 py-2">Indisponível</Badge>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl font-bold text-primary">{formattedPrice}</span>
                {!product.available && (
                  <Badge variant="secondary">Indisponível</Badge>
                )}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              {product.servings && (
                <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Porções</p>
                    <p className="text-sm font-medium text-foreground">{product.servings}</p>
                  </div>
                </div>
              )}
              <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Disponibilidade</p>
                  <p className="text-sm font-medium text-foreground">
                    {product.available ? "Disponível" : "Indisponível"}
                  </p>
                </div>
              </div>
            </div>

            {product.ingredients && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Ingredientes</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-border pt-5 space-y-3">
              <p className="text-sm text-muted-foreground">
                🎂 Todos os nossos produtos são feitos sob encomenda. Entre em contato para verificar disponibilidade e prazos.
              </p>
              <div className="flex flex-wrap gap-3">
                {product.available && (
                  <WhatsAppButton productName={product.name} />
                )}
                <Link href="/contato">
                  <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Fazer Encomenda
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back button */}
        <div className="mt-12">
          <Link href="/catalogo">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
      <WhatsAppButton floating />
    </div>
  );
}
