import { motion } from "framer-motion";
import { ShoppingBag, Tag, MessageSquare, Plus, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_user");
    setLocation("/login");
  };

  const stats = [
    {
      label: "Produtos",
      value: 0,
      icon: ShoppingBag,
      color: "text-rose-600",
      bg: "bg-rose-50",
      href: "/admin/produtos",
    },
    {
      label: "Categorias",
      value: 0,
      icon: Tag,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/categorias",
    },
    {
      label: "Mensagens",
      value: 0,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/mensagens",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-rose-900">Taise Sena</h1>
            <p className="text-gray-600">Painel Administrativo</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a href={stat.href}>
                  <div className={`${stat.bg} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <Icon className={`${stat.color} w-12 h-12 opacity-20`} />
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/produtos">
              <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Produto
              </Button>
            </a>
            <a href="/admin/categorias">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Categoria
              </Button>
            </a>
            <a href="/admin/mensagens">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Ver Mensagens
              </Button>
            </a>
            <a href="/">
              <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Voltar ao Site
              </Button>
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
