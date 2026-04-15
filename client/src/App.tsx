import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminMessages from "./pages/admin/AdminMessages";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Login Component
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("auth_token", "admin_token_" + Date.now());
        localStorage.setItem("admin_user", JSON.stringify({ username: "admin", role: "admin" }));
        toast.success("Login realizado com sucesso!");
        setLocation("/admin");
      } else {
        toast.error("Usuário ou senha incorretos!");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-900 mb-2">Taise Sena</h1>
          <p className="text-gray-600">Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={loading}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-gray-600">
            <strong>Credenciais padrão:</strong>
          </p>
          <p className="text-sm text-gray-600">Usuário: <code className="bg-white px-2 py-1 rounded">admin</code></p>
          <p className="text-sm text-gray-600">Senha: <code className="bg-white px-2 py-1 rounded">admin123</code></p>
        </div>
      </Card>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const isAuthenticated = localStorage.getItem("auth_token");
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/catalogo" component={Catalog} />
      <Route path="/produto/:id" component={ProductDetail} />
      <Route path="/sobre" component={About} />
      <Route path="/contato" component={Contact} />
      <Route path="/login" component={Login} />

      {/* Admin Routes */}
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route path="/admin/produtos" component={() => <ProtectedRoute component={AdminProducts} />} />
      <Route path="/admin/produtos/novo" component={() => <ProtectedRoute component={AdminProducts} />} />
      <Route path="/admin/categorias" component={() => <ProtectedRoute component={AdminCategories} />} />
      <Route path="/admin/mensagens" component={() => <ProtectedRoute component={AdminMessages} />} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
