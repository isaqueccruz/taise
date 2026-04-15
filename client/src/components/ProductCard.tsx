import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  imageUrl?: string | null;
  featured: boolean;
  available: boolean;
  servings?: string | null;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80";

export default function ProductCard({ product, className }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(product.price));

  return (
    <div
      className={cn(
        "group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        !product.available && "opacity-70",
        className
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.imageUrl || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.featured && (
            <Badge className="bg-accent text-accent-foreground text-xs font-medium gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-current" /> Destaque
            </Badge>
          )}
          {!product.available && (
            <Badge variant="secondary" className="text-xs">Indisponível</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-serif font-medium text-foreground text-lg leading-tight line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
          {product.servings && (
            <p className="text-xs text-muted-foreground mt-1">🍰 {product.servings}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-serif text-xl font-semibold text-primary">
            {formattedPrice}
          </span>
          <Link href={`/produto/${product.id}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-full gap-1.5 shadow-sm"
              disabled={!product.available}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Ver mais
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
