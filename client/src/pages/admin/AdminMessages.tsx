import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Mail, MailOpen, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";

type MessageItem = {
  id: number; name: string; email: string; phone: string | null;
  subject: string | null; message: string; productId: number | null;
  read: boolean; createdAt: Date;
};

export default function AdminMessages() {
  const utils = trpc.useUtils();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewMessage, setViewMessage] = useState<MessageItem | null>(null);

  const { data: messages, isLoading } = trpc.contact.listMessages.useQuery();

  const markReadMutation = trpc.contact.markRead.useMutation({
    onSuccess: () => utils.contact.listMessages.invalidate(),
  });

  const deleteMutation = trpc.contact.deleteMessage.useMutation({
    onSuccess: () => { utils.contact.listMessages.invalidate(); toast.success("Mensagem removida!"); setDeleteId(null); },
    onError: (e) => toast.error(e.message),
  });

  const handleView = (msg: MessageItem) => {
    setViewMessage(msg);
    if (!msg.read) markReadMutation.mutate({ id: msg.id, read: true });
  };

  const unread = messages?.filter(m => !m.read).length ?? 0;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-semibold text-sidebar-foreground">Mensagens</h1>
              {unread > 0 && (
                <Badge className="bg-primary text-white text-xs">{unread} não lida{unread !== 1 ? "s" : ""}</Badge>
              )}
            </div>
            <p className="text-sidebar-foreground/50 text-sm mt-0.5">Mensagens e encomendas de clientes</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="bg-sidebar-accent rounded-xl h-20 animate-pulse" />)}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border p-4 cursor-pointer transition-all hover:border-primary/30 ${
                  msg.read
                    ? "bg-sidebar-accent border-sidebar-border"
                    : "bg-sidebar-accent border-primary/40 shadow-sm"
                }`}
                onClick={() => handleView(msg)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      msg.read ? "bg-sidebar-border" : "bg-primary/20"
                    }`}>
                      {msg.read
                        ? <MailOpen className="w-4 h-4 text-sidebar-foreground/40" />
                        : <Mail className="w-4 h-4 text-primary" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-medium ${msg.read ? "text-sidebar-foreground/70" : "text-sidebar-foreground"}`}>
                          {msg.name}
                        </span>
                        {!msg.read && <Badge className="bg-primary/20 text-primary text-xs border-0 px-1.5 py-0">Nova</Badge>}
                        {msg.subject && (
                          <span className="text-xs text-sidebar-foreground/40 truncate">— {msg.subject}</span>
                        )}
                      </div>
                      <p className="text-xs text-sidebar-foreground/50 mt-0.5">{msg.email} {msg.phone ? `· ${msg.phone}` : ""}</p>
                      <p className="text-sm text-sidebar-foreground/60 mt-1 line-clamp-1">{msg.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs text-sidebar-foreground/30">
                      {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }}
                      className="h-7 px-1.5 text-sidebar-foreground/30 hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-sidebar-foreground/50">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <h3 className="font-serif text-lg text-sidebar-foreground mb-2">Nenhuma mensagem</h3>
            <p className="text-sm">As mensagens dos clientes aparecerão aqui.</p>
          </div>
        )}
      </div>

      {/* View Message Dialog */}
      <Dialog open={!!viewMessage} onOpenChange={(o) => !o && setViewMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Mensagem de {viewMessage?.name}</DialogTitle>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">E-mail</p>
                  <a href={`mailto:${viewMessage.email}`} className="text-primary hover:underline">{viewMessage.email}</a>
                </div>
                {viewMessage.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Telefone</p>
                    <a href={`https://wa.me/${viewMessage.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{viewMessage.phone}</a>
                  </div>
                )}
                {viewMessage.subject && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Assunto</p>
                    <p className="font-medium">{viewMessage.subject}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Data</p>
                  <p>{new Date(viewMessage.createdAt).toLocaleString("pt-BR")}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Mensagem</p>
                <div className="bg-muted/50 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {viewMessage.message}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <a
                  href={`mailto:${viewMessage.email}?subject=Re: ${viewMessage.subject ?? "Sua mensagem"}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white gap-2">
                    <Mail className="w-4 h-4" /> Responder por E-mail
                  </Button>
                </a>
                {viewMessage.phone && (
                  <a
                    href={`https://wa.me/${viewMessage.phone.replace(/\D/g, "")}?text=Olá ${viewMessage.name}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Mensagem</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              className="bg-destructive hover:bg-destructive/90 rounded-full"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
