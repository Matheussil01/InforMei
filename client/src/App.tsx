import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Informativo from "./pages/Informativo";
import Financeiro from "./pages/Financeiro";
import Clientes from "./pages/Clientes";
import Documentos from "./pages/Documentos";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/cadastro"} component={Cadastro} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/informativo"} component={Informativo} />
      <Route path={"/financeiro"} component={Financeiro} />
      <Route path={"/clientes"} component={Clientes} />
      <Route path={"/documentos"} component={Documentos} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
