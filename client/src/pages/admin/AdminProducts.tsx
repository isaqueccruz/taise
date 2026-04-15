import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";

type ProductForm = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: string;
  featured: boolean;
  available: boolean;
  servings: string;
  ingredients: string;
};

const emptyForm: ProductForm = {
  name: "", description: "", price: "", imageUrl: "",
  categoryId: "", featured: false, available: true,
  servings: "", ingredients: "",
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80";

export default function AdminProducts() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: products, isLoading } = trpc.products.list.useQuery({});
  const { data: categories } = trpc.categories.list.useQuery();

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); toast.success("Produto criado!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); toast.success("Produto atualizado!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); toast.success("Produto removido!"); setDeleteId(null); },
    onError: (e) => toast.error(e.message),
  });

  const uploadMutation = trpc.products.uploadImage.useMutation({
    onSuccess: (data) => { setForm(f => ({ ...f, imageUrl: data.url })); toast.success("Imagem enviada!"); },
    onError: (e) => { toast.error("Erro ao enviar imagem: " + e.message); },
  });

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: typeof products extends (infer T)[] | undefined ? T : never) => {
    if (!p) return;
    setEditingId((p as { id: number }).id);
    setForm({
      name: (p as { name: string }).name,
      description: (p as { description?: string | null }).description ?? "",
      price: (p as { price: string }).price,
      imageUrl: (p as { imageUrl?: string | null }).imageUrl ?? "",
      categoryId: (p as { categoryId?: number | null }).categoryId?.toString() ?? "",
      featured: (p as { featured: boolean }).featured,
      available: (p as { available: boolean }).available,
      servings: (p as { servings?: string | null }).servings ?? "",
      ingredients: (p as { ingredients?: string | null }).ingredients ?? "",
    });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(emptyForm); };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Arquivo muito grande (máx 5MB)"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string).split(",")[1];
      await uploadMutation.mutateAsync({ fileName: file.name, fileBase64: base64, mimeType: file.type });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return; }
    if (!form.price || isNaN(parseFloat(form.price))) { toast.error("Preço inválido"); return; }
    const payload = {
      name: form.name,
      description: form.description || undefined,
      price: parseFloat(form.price).toFixed(2),
      imageUrl: form.imageUrl || undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      featured: form.featured,
      available: form.available,
      servings: form.servings || undefined,
      ingredients: form.ingredients || undefined,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-sidebar-foreground">Produtos</h1>
            <p className="text-sidebar-foreground/50 text-sm mt-0.5">Gerencie os produtos do catálogo</p>
          </div>
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white rounded-full gap-2">
            <Plus className="w-4 h-4" /> Novo Produto
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-sidebar-accent rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-sidebar-accent rounded-xl border border-sidebar-border overflow-hidden group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={p.imageUrl || PLACEHOLDER}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {p.featured && (
                      <Badge className="bg-accent text-accent-foreground text-xs gap-1">
                        <Star className="w-3 h-3 fill-current" />
                      </Badge>
                    )}
                    {!p.available && (
                      <Badge variant="secondary" className="text-xs">Indisponível</Badge>
                    )}
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-medium text-sidebar-foreground text-sm leading-tight line-clamp-1">
                      {p.name}
                    </h3>
                    <span className="font-semibold text-sidebar-primary text-sm flex-shrink-0">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parseFloat(p.price))}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-xs text-sidebar-foreground/50 line-clamp-2">{p.description}</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Link href={`/produto/${p.id}`}>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-sidebar-foreground/50 hover:text-sidebar-foreground">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(p)} className="h-7 px-2 text-sidebar-foreground/50 hover:text-sidebar-primary">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="h-7 px-2 text-sidebar-foreground/50 hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-sidebar-foreground/50">
            <div className="text-5xl mb-4">🎂</div>
            <h3 className="font-serif text-lg text-sidebar-foreground mb-2">Nenhum produto ainda</h3>
            <p className="text-sm mb-4">Adicione seu primeiro produto ao catálogo.</p>
            <Button onClick={openCreate} className="bg-primary text-white rounded-full gap-2">
              <Plus className="w-4 h-4" /> Criar Produto
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingId ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Foto do Produto</Label>
              <div className="relative">
                {form.imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video">
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setForm(f => ({ ...f, imageUrl: "" }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary bg-muted/30"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Clique para enviar foto</span>
                        <span className="text-xs">JPG, PNG, WEBP — máx 5MB</span>
                      </>
                    )}
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">ou cole uma URL</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <Input
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                className="text-sm"
              />
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Nome *</Label>
              <Input
                placeholder="Ex: Bolo de Chocolate Belga"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Descrição</Label>
              <Textarea
                placeholder="Descreva o produto..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                className="resize-none"
              />
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Preço (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Categoria</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm(f => ({ ...f, categoryId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Servings + Ingredients */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Porções</Label>
              <Input
                placeholder="Ex: 10 a 15 fatias"
                value={form.servings}
                onChange={(e) => setForm(f => ({ ...f, servings: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Ingredientes</Label>
              <Textarea
                placeholder="Liste os principais ingredientes..."
                rows={2}
                value={form.ingredients}
                onChange={(e) => setForm(f => ({ ...f, ingredients: e.target.value }))}
                className="resize-none"
              />
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(v) => setForm(f => ({ ...f, featured: v }))}
                />
                <Label htmlFor="featured" className="text-sm cursor-pointer flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-accent" /> Destaque
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="available"
                  checked={form.available}
                  onCheckedChange={(v) => setForm(f => ({ ...f, available: v }))}
                />
                <Label htmlFor="available" className="text-sm cursor-pointer flex items-center gap-1">
                  {form.available ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                  {form.available ? "Disponível" : "Indisponível"}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} className="rounded-full">Cancelar</Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-white rounded-full gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? "Salvar Alterações" : "Criar Produto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.
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
