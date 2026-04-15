import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mensagem deve ter ao menos 10 caracteres"),
});

type FormData = z.infer<typeof schema>;

const contactInfo = [
  { icon: MapPin, label: "Localização", value: "Brasil" },
  { icon: Phone, label: "WhatsApp", value: "+55 (00) 00000-0000" },
  { icon: Mail, label: "E-mail", value: "contato@taisesena.com.br" },
  { icon: Clock, label: "Horário", value: "Seg–Sáb: 8h às 18h" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      reset();
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    },
    onError: (err) => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      console.error(err);
    },
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 bg-secondary/30 border-b border-border">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="outline" className="border-accent text-accent mb-3 text-xs tracking-widest uppercase">
              Fale Conosco
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-3">
              Entre em Contato
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Pronto para criar algo especial? Fale conosco e vamos tornar seu sonho realidade.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  Vamos Conversar
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Seja para uma encomenda especial, dúvidas sobre nossos produtos ou apenas para dizer olá — estamos aqui para você!
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{info.label}</p>
                      <p className="text-sm font-medium text-foreground">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-3">Prefere falar pelo WhatsApp?</p>
                <WhatsAppButton />
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {submitted ? (
                <div className="bg-card rounded-2xl border border-border p-10 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground">Mensagem Enviada!</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Obrigada pelo contato! Responderemos em breve. 🎂
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Enviar outra mensagem
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="bg-card rounded-2xl border border-border p-8 space-y-5 shadow-sm"
                >
                  <h3 className="font-serif text-xl font-semibold text-foreground">Enviar Mensagem</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-medium">Nome *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        {...register("name")}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...register("email")}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-sm font-medium">Telefone / WhatsApp</Label>
                      <Input
                        id="phone"
                        placeholder="(00) 00000-0000"
                        {...register("phone")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-sm font-medium">Assunto</Label>
                      <Input
                        id="subject"
                        placeholder="Ex: Encomenda de bolo"
                        {...register("subject")}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-sm font-medium">Mensagem *</Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva sua encomenda ou dúvida..."
                      rows={5}
                      {...register("message")}
                      className={errors.message ? "border-destructive resize-none" : "resize-none"}
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-full gap-2 py-5"
                  >
                    {submitMutation.isPending ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating />
    </div>
  );
}
