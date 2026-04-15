import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Award, Heart, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663505194534/PThi8BHL38Un8J878g3nSp/cake-hero_ef634c6a.jpg";
const ABOUT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663505194534/PThi8BHL38Un8J878g3nSp/cake-wedding_9df40aea.jpg";

const features = [
  { icon: Heart, title: "Feito com Amor", desc: "Cada bolo é preparado com carinho e dedicação para tornar seu momento especial." },
  { icon: Award, title: "Qualidade Premium", desc: "Ingredientes selecionados e técnicas refinadas para um sabor incomparável." },
  { icon: Clock, title: "Encomenda Personalizada", desc: "Criamos o bolo dos seus sonhos sob medida para cada ocasião." },
  { icon: Star, title: "Clientes Satisfeitos", desc: "Centenas de clientes felizes com nossas criações artesanais." },
];

export default function Home() {
  const { data: featuredProducts, isLoading } = trpc.products.featured.useQuery({ limit: 6 });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Bolo elegante Taise Sena Confeitaria"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container pt-20">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="bg-accent/90 text-accent-foreground mb-4 text-xs tracking-widest uppercase font-medium px-3 py-1">
                ✨ Confeitaria Artesanal
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white leading-tight mb-4">
                Momentos Doces,<br />
                <span className="text-accent italic">Memórias Eternas</span>
              </h1>
              <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                Bolos artesanais e doces finos criados com amor para tornar cada celebração inesquecível.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/catalogo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg gap-2">
                    Ver Catálogo <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button size="lg" variant="outline" className="rounded-full px-8 border-white/50 text-white hover:bg-white/10 bg-transparent">
                    Encomendar
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
          <span className="text-xs tracking-widest uppercase">Role para baixo</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
          />
        </div>
      </section>

      {/* ── Features Strip ────────────────────────────────────────── */}
      <section className="bg-white border-y border-border py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2 p-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="border-accent text-accent mb-3 text-xs tracking-widest uppercase">
              Nossa Vitrine
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
              Criações em Destaque
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Cada peça é uma obra de arte comestível, criada com técnica e paixão pela confeitaria.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="font-serif text-lg">Em breve nossos produtos estarão disponíveis aqui.</p>
              <p className="text-sm mt-2">Adicione produtos pelo painel administrativo.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/catalogo">
              <Button variant="outline" size="lg" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white gap-2 px-8">
                Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── About Teaser ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                <img
                  src={ABOUT_IMAGE}
                  alt="Taise Sena Confeitaria"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-accent/20 border border-accent/30 -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <Badge variant="outline" className="border-accent text-accent text-xs tracking-widest uppercase">
                Nossa História
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                Arte e Sabor em Cada Criação
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Taise Sena Confeitaria nasceu da paixão pela arte da confeitaria. Com anos de experiência e dedicação, transformamos ingredientes simples em obras de arte que encantam os olhos e deliciam o paladar.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Cada bolo é único, criado especialmente para você e para o seu momento especial. Do casamento ao aniversário, da festa ao dia a dia — celebramos a vida com doçura.
              </p>
              <Link href="/sobre">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 gap-2 mt-2">
                  Conheça Nossa História <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[oklch(0.22_0.04_30)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              Pronto para Encomendar?
            </h2>
            <p className="text-white/70 max-w-md mx-auto mb-8 leading-relaxed">
              Entre em contato conosco e vamos criar o bolo perfeito para o seu momento especial.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contato">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg gap-2">
                  Fazer Encomenda <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <WhatsAppButton />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating />
    </div>
  );
}
