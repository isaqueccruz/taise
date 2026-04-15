import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";

type CategoryForm = { name: string; slug: string; description: string };
const emptyForm: CategoryForm = { name: "", slug: "", description: "" };

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function AdminCategories() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const { data: categories, isLoading } = trpc.categories.list.useQuery();

  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); toast.success("Categoria criada!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); toast.success("Categoria atualizada!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); toast.success("Categoria removida!"); setDeleteId(null); },
    onError: (e) => toast.error(e.message),
  });

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: { id: number; name: string; slug: string; description?: string | null }) => {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description ?? "" });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(emptyForm); };

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return; }
    if (!form.slug.trim() || !/^[a-z0-9-]+$/.test(form.slug)) { toast.error("Slug inválido (use apenas letras minúsculas, números e hífens)"); return; }
    if (editingId) {
      updateMutation.mutate({ id: editingId, name: form.name, slug: form.slug, description: form.description || undefined });
    } else {
      createMutation.mutate({ name: form.name, slug: form.slug, description: form.description || undefined });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-sidebar-foreground">Categorias</h1>
            <p className="text-sidebar-foreground/50 text-sm mt-0.5">Organize seus produtos por categoria</p>
          </div>
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white rounded-full gap-2">
            <Plus className="w-4 h-4" /> Nova Categoria
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-sidebar-accent rounded-xl h-16 animate-pulse" />)}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-sidebar-accent rounded-xl border border-sidebar-border p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-medium text-sidebar-foreground">{cat.name}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-sidebar-foreground/40 font-mono">/{cat.slug}</span>
                    {cat.description && (
                      <span className="text-xs text-sidebar-foreground/50 truncate">{cat.description}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(cat)} className="h-8 px-2 text-sidebar-foreground/50 hover:text-sidebar-primary">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(cat.id)} className="h-8 px-2 text-sidebar-foreground/50 hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-sidebar-foreground/50">
            <div className="text-4xl mb-3">🏷️</div>
            <h3 className="font-serif text-lg text-sidebar-foreground mb-2">Nenhuma categoria ainda</h3>
            <p className="text-sm mb-4">Crie categorias para organizar seus produtos.</p>
            <Button onClick={openCreate} className="bg-primary text-white rounded-full gap-2">
              <Plus className="w-4 h-4" /> Criar Categoria
            </Button>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingId ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Nome *</Label>
              <Input
                placeholder="Ex: Bolos de Casamento"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Slug *</Label>
              <Input
                placeholder="bolos-de-casamento"
                value={form.slug}
                onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Apenas letras minúsculas, números e hífens.</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Descrição</Label>
              <Textarea
                placeholder="Descrição opcional..."
                rows={2}
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} className="rounded-full">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={isPending} className="bg-primary hover:bg-primary/90 text-white rounded-full gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza? Os produtos desta categoria não serão removidos, mas perderão a associação.
            </AlertDialogDescription>
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
