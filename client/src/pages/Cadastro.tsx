import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Mail, Lock, User, Building2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Cadastro() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    nomeEmpresa: "",
    cnpj: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    nomeEmpresa: "",
    cnpj: "",
  });

  const registerMutation = trpc.auth.register.useMutation();

  // Validação em tempo real
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email é obrigatório";
    if (!emailRegex.test(email)) return "Email inválido";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Senha é obrigatória";
    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (!/[A-Z]/.test(password)) return "Deve conter uma letra maiúscula";
    if (!/[0-9]/.test(password)) return "Deve conter um número";
    return "";
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return "Confirmação de senha é obrigatória";
    if (password !== confirmPassword) return "As senhas não coincidem";
    return "";
  };

  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, "");
    if (!cnpj) return "CNPJ é obrigatório";
    if (cleanCNPJ.length !== 14) return "CNPJ deve ter 14 dígitos";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");

    // Validação em tempo real
    let newError = "";
    if (name === "email") {
      newError = validateEmail(value);
    } else if (name === "password") {
      newError = validatePassword(value);
    } else if (name === "confirmPassword") {
      newError = validateConfirmPassword(formData.password, value);
    } else if (name === "cnpj") {
      newError = validateCNPJ(value);
    }

    setValidationErrors(prev => ({ ...prev, [name]: newError }));
  };

  const validateStep1 = () => {
    const nomeError = !formData.nome ? "Nome é obrigatório" : "";
    const emailError = validateEmail(formData.email);

    setValidationErrors(prev => ({
      ...prev,
      nome: nomeError,
      email: emailError,
    }));

    return !nomeError && !emailError;
  };

  const validateStep2 = () => {
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    setValidationErrors(prev => ({
      ...prev,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    }));

    return !passwordError && !confirmPasswordError;
  };

  const validateStep3 = () => {
    const nomeEmpresaError = !formData.nomeEmpresa ? "Nome da empresa é obrigatório" : "";
    const cnpjError = validateCNPJ(formData.cnpj);

    setValidationErrors(prev => ({
      ...prev,
      nomeEmpresa: nomeEmpresaError,
      cnpj: cnpjError,
    }));

    return !nomeEmpresaError && !cnpjError;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;

    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    setError("");

    try {
      const result = await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        nome: formData.nome,
        nomeEmpresa: formData.nomeEmpresa,
        cnpj: formData.cnpj,
      });

      if (result.success) {
        toast.success("Conta criada com sucesso!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar conta";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = "/";
  };

  const renderInputField = (
    label: string,
    name: string,
    type: string = "text",
    placeholder: string = ""
  ) => {
    const hasError = validationErrors[name as keyof typeof validationErrors];
    const isValid = formData[name as keyof typeof formData] && !hasError;

    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{
          display: "block",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "8px",
          color: "rgba(255, 255, 255, 0.9)"
        }}>
          {label}
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={type}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleInputChange}
            placeholder={placeholder}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(15, 23, 42, 0.6)",
              border: `1px solid ${hasError ? "#ef4444" : isValid ? "#10b981" : "rgba(124, 58, 237, 0.3)"}`,
              borderRadius: "8px",
              color: "white",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "all 0.2s"
            }}
          />
          {isValid && (
            <Check size={18} style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#10b981"
            }} />
          )}
          {hasError && (
            <AlertCircle size={18} style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#ef4444"
            }} />
          )}
        </div>
        {hasError && (
          <p style={{
            fontSize: "12px",
            color: "#fca5a5",
            marginTop: "6px",
            margin: "6px 0 0 0"
          }}>
            {hasError}
          </p>
        )}
      </div>
    );
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

        {/* Card de Cadastro */}
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
            marginBottom: "8px",
            color: "white"
          }}>
            Criar Conta
          </h1>

          <p style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.6)",
            marginBottom: "2rem"
          }}>
            Passo {step} de 3
          </p>

          {/* Progress Bar */}
          <div style={{
            display: "flex",
            gap: "8px",
            marginBottom: "2rem"
          }}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: "4px",
                  background: i <= step ? "linear-gradient(to right, #7c3aed, #3b82f6)" : "rgba(124, 58, 237, 0.2)",
                  borderRadius: "2px",
                  transition: "all 0.3s"
                }}
              />
            ))}
          </div>

          {/* Erro Global */}
          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "1.5rem",
              color: "#fca5a5",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Step 1: Dados Pessoais */}
          {step === 1 && (
            <div>
              {renderInputField("Nome Completo", "nome", "text", "Seu nome")}
              {renderInputField("Email", "email", "email", "seu@email.com")}
            </div>
          )}

          {/* Step 2: Senha */}
          {step === 2 && (
            <div>
              {renderInputField("Senha", "password", "password", "Mínimo 6 caracteres")}
              <p style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.5)",
                marginBottom: "1rem"
              }}>
                A senha deve conter: letra maiúscula, número e mínimo 6 caracteres
              </p>
              {renderInputField("Confirmar Senha", "confirmPassword", "password", "Repita sua senha")}
            </div>
          )}

          {/* Step 3: Dados da Empresa */}
          {step === 3 && (
            <div>
              {renderInputField("Nome da Empresa", "nomeEmpresa", "text", "Sua empresa")}
              {renderInputField("CNPJ", "cnpj", "text", "00.000.000/0000-00")}
            </div>
          )}

          {/* Botões */}
          <div style={{
            display: "flex",
            gap: "12px",
            marginTop: "2rem"
          }}>
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              style={{
                flex: 1,
                padding: "12px",
                background: "rgba(124, 58, 237, 0.2)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                color: "white",
                borderRadius: "8px",
                cursor: step === 1 ? "not-allowed" : "pointer",
                fontWeight: "600",
                opacity: step === 1 ? 0.5 : 1,
                transition: "all 0.2s"
              }}
            >
              Anterior
            </button>

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "linear-gradient(to right, #7c3aed, #3b82f6)",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s"
                }}
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: loading ? "rgba(16, 185, 129, 0.5)" : "linear-gradient(to right, #10b981, #059669)",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s"
                }}
              >
                {loading ? "Criando..." : "Criar Conta"}
              </button>
            )}
          </div>

          {/* Link para Login */}
          <p style={{
            textAlign: "center",
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "1.5rem"
          }}>
            Já tem conta? <a
              href="#"
              onClick={() => navigate("/login")}
              style={{
                color: "#7c3aed",
                textDecoration: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
