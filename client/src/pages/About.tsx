import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart, Award, Star, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const ABOUT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663505194534/PThi8BHL38Un8J878g3nSp/cake-wedding_9df40aea.jpg";
const CAKE2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663505194534/PThi8BHL38Un8J878g3nSp/cake-rose-gold_9d756c58.jpg";

const values = [
  { icon: Heart, title: "Paixão", desc: "Cada criação nasce do amor genuíno pela arte da confeitaria." },
  { icon: Award, title: "Excelência", desc: "Padrão premium em ingredientes, técnica e apresentação." },
  { icon: Star, title: "Criatividade", desc: "Designs únicos e personalizados para cada cliente." },
  { icon: Leaf, title: "Qualidade", desc: "Ingredientes frescos e selecionados em cada receita." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 bg-secondary/30 border-b border-border">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="outline" className="border-accent text-accent mb-3 text-xs tracking-widest uppercase">
              Nossa História
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-3">
              Sobre a Taise Sena Confeitaria
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Uma história de amor, dedicação e muito açúcar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                <img src={ABOUT_IMAGE} alt="Taise Sena" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-accent/20 border border-accent/30 -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <h2 className="font-serif text-3xl font-semibold text-foreground">
                Uma Paixão Transformada em Arte
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Taise Sena Confeitaria nasceu de um sonho: transformar momentos comuns em memórias extraordinárias através da arte da confeitaria. Com anos de dedicação e aperfeiçoamento constante, cada criação é uma expressão de amor e talento.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Especializada em bolos artesanais, doces finos e criações personalizadas, a confeitaria atende desde celebrações íntimas até grandes eventos, sempre com o mesmo cuidado e atenção aos detalhes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Cada encomenda é tratada como única — porque cada cliente, cada celebração e cada momento merece algo verdadeiramente especial.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-3">Nossos Valores</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Os pilares que guiam cada criação da Taise Sena Confeitaria.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Second image section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5 order-2 md:order-1"
            >
              <h2 className="font-serif text-3xl font-semibold text-foreground">
                Cada Detalhe Importa
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Da escolha dos ingredientes à finalização artística, cada etapa do processo é executada com precisão e carinho. Utilizamos apenas ingredientes de alta qualidade para garantir não apenas a beleza visual, mas também um sabor incomparável.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nosso compromisso é superar expectativas — criando não apenas bolos, mas experiências que ficam na memória de todos os presentes.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-1 md:order-2"
            >
              <div className="rounded-2xl overflow-hidden aspect-square shadow-xl">
                <img src={CAKE2} alt="Detalhes do bolo" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating />
    </div>
  );
}
