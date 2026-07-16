import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Login() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const loginMutation = trpc.auth.login.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
  };

  const handleBack = () => {
    window.location.href = "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      if (result.success && result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("isLoggedIn", "true");
        
        toast.success("Login realizado com sucesso!");
        
        // Redirecionar imediatamente
        navigate("/dashboard", { replace: true });
      } else {
        setError("Falha ao fazer login");
        toast.error("Falha ao fazer login");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e3a8a 75%, #0f766e 100%)",
      padding: "1rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Elementos decorativos */}
      <div style={{
        position: "absolute",
        top: "-50%",
        right: "-10%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)",
        borderRadius: "50%"
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "-30%",
        left: "-5%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(15, 118, 110, 0.1) 0%, transparent 70%)",
        borderRadius: "50%"
      }} />

      {/* Container Principal */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "500px"
      }}>
        {/* Botão Voltar */}
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.7)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "2rem",
            fontSize: "14px",
            transition: "color 0.3s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        {/* Card de Login */}
        <div style={{
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
        }}>
          {/* Logo/Título */}
          <h1 style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "0.5rem",
            textAlign: "center"
          }}>
            InforMEI
          </h1>
          
          <p style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.6)",
            textAlign: "center",
            marginBottom: "2rem"
          }}>
            Faça login na sua conta
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "0.5rem"
              }}>
                Email
              </label>
              <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center"
              }}>
                <Mail size={18} style={{
                  position: "absolute",
                  left: "12px",
                  color: "rgba(124, 58, 237, 0.6)"
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    transition: "all 0.3s",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.2)";
                  }}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "0.5rem"
              }}>
                Senha
              </label>
              <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center"
              }}>
                <Lock size={18} style={{
                  position: "absolute",
                  left: "12px",
                  color: "rgba(124, 58, 237, 0.6)"
                }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    transition: "all 0.3s",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.2)";
                  }}
                />
              </div>
            </div>

            {/* Lembrar-me */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer"
                }}
              />
              <label style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer"
              }}>
                Lembrar-me
              </label>
            </div>

            {/* Erro */}
            {error && (
              <div style={{
                padding: "12px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#fca5a5",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            {/* Botão Entrar */}
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "rgba(124, 58, 237, 0.5)" : "linear-gradient(to right, #7c3aed, #3b82f6)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Cadastro */}
          <p style={{
            textAlign: "center",
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "1.5rem"
          }}>
            Não tem conta?{" "}
            <button
              onClick={() => navigate("/cadastro")}
              style={{
                background: "none",
                border: "none",
                color: "#a78bfa",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px"
              }}
            >
              Criar uma agora
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
