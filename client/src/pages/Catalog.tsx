import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products, isLoading } = trpc.products.list.useQuery(
    selectedCategory ? { categoryId: selectedCategory, available: true } : { available: true }
  );

  const filtered = products?.filter((p) =>
    search.trim() === "" ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="pt-28 pb-10 bg-secondary/30 border-b border-border">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="outline" className="border-accent text-accent mb-3 text-xs tracking-widest uppercase">
              Nossa Vitrine
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-3">
              Catálogo de Produtos
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Explore nossa seleção de bolos artesanais e doces finos criados com amor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-border py-3 shadow-sm">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-full border-border bg-muted/50 text-sm"
              />
            </div>
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                Todos
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎂</div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                {search ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {search ? "Tente uma busca diferente." : "Em breve novos produtos serão adicionados."}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating />
    </div>
  );
}
