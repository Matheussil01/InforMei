import { useState, useEffect } from "react";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useLocation } from "wouter";
import { LogOut, Menu, X, Plus, Trash2, Download, AlertCircle, Calendar } from "lucide-react";

interface Documento {
  id: number;
  nome: string;
  tipo: "boleto" | "nf" | "recibo" | "outro";
  dataVencimento: string;
  valor: number;
  status: "pago" | "pendente" | "vencido";
}

export default function Documentos() {
  const { user, isAuthenticated, loading, logout } = useLocalAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [documentos, setDocumentos] = useState<Documento[]>([
    { id: 1, nome: "Boleto #001", tipo: "boleto", dataVencimento: "2026-06-10", valor: 1500, status: "pendente" },
    { id: 2, nome: "NF #2026-001", tipo: "nf", dataVencimento: "2026-05-30", valor: 2000, status: "vencido" },
    { id: 3, nome: "Recibo #001", tipo: "recibo", dataVencimento: "2026-06-15", valor: 800, status: "pago" },
  ]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/login", { replace: true });
    }
  }, [shouldRedirect, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e3a8a 75%, #0f766e 100%)",
        color: "white"
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated || shouldRedirect) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleDelete = (id: number) => {
    setDocumentos(documentos.filter(d => d.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return { bg: "rgba(16, 185, 129, 0.2)", text: "#6ee7b7" };
      case "pendente":
        return { bg: "rgba(245, 158, 11, 0.2)", text: "#fcd34d" };
      case "vencido":
        return { bg: "rgba(239, 68, 68, 0.2)", text: "#fca5a5" };
      default:
        return { bg: "rgba(107, 114, 128, 0.2)", text: "#d1d5db" };
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "boleto":
        return "🧾";
      case "nf":
        return "📄";
      case "recibo":
        return "✓";
      default:
        return "📎";
    }
  };

  const pendingDocumentos = documentos.filter(d => d.status === "vencido" || d.status === "pendente");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e3a8a 75%, #0f766e 100%)",
      color: "white",
      display: "flex",
      flexDirection: isMobile ? "column" : "row"
    }}>
      {/* Sidebar */}
      {(!isMobile || sidebarOpen) && (
        <div style={{
          width: isMobile ? "100%" : sidebarOpen ? "280px" : "0",
          background: "rgba(15, 23, 42, 0.95)",
          borderRight: isMobile ? "none" : "1px solid rgba(124, 58, 237, 0.2)",
          borderBottom: isMobile ? "1px solid rgba(124, 58, 237, 0.2)" : "none",
          padding: sidebarOpen ? "1.5rem 1rem" : "0",
          transition: "all 0.3s ease",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          position: isMobile ? "relative" : "relative"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "white",
              margin: "0"
            }}>
              InforMEI
            </h2>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "24px"
                }}
              >
                <X size={24} />
              </button>
            )}
          </div>

          <nav style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flex: 1
          }}>
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Financeiro", path: "/financeiro" },
              { label: "Clientes", path: "/clientes" },
              { label: "Documentos", path: "/documentos" }
            ].map(item => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  background: item.path === "/documentos" ? "rgba(124, 58, 237, 0.4)" : "rgba(124, 58, 237, 0.2)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  fontSize: "14px"
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: isMobile ? "1rem" : "2rem",
        overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "bold",
              margin: "0 0 8px 0"
            }}>
              Gestão de Documentos
            </h1>
            <p style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0"
            }}>
              Gerencie seus boletos, notas fiscais e recibos
            </p>
          </div>

          <div style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center"
          }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: "rgba(124, 58, 237, 0.2)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  color: "white",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Menu size={20} />
              </button>
            )}
            <button
              style={{
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px"
              }}
            >
              <Plus size={18} /> Upload
            </button>
          </div>
        </div>

        {/* Alertas de Vencimento */}
        {pendingDocumentos.length > 0 && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "start",
            gap: "1rem",
            backdropFilter: "blur(10px)"
          }}>
            <AlertCircle size={24} style={{ color: "#fca5a5", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "0.5rem", color: "#fca5a5" }}>
                Atenção: {pendingDocumentos.length} documento(s) pendente(s)
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", margin: "0" }}>
                Você tem documentos vencidos ou próximos do vencimento. Verifique abaixo.
              </p>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          {[
            { label: "Total", value: documentos.length, color: "rgba(255, 255, 255, 0.1)" },
            { label: "Pendentes", value: documentos.filter(d => d.status === "pendente").length, color: "rgba(245, 158, 11, 0.1)" },
            { label: "Vencidos", value: documentos.filter(d => d.status === "vencido").length, color: "rgba(239, 68, 68, 0.1)" },
            { label: "Pagos", value: documentos.filter(d => d.status === "pago").length, color: "rgba(16, 185, 129, 0.1)" }
          ].map((stat, i) => (
            <div key={i} style={{
              background: stat.color,
              border: "1px solid rgba(124, 58, 237, 0.2)",
              borderRadius: "12px",
              padding: "1.5rem",
              backdropFilter: "blur(10px)"
            }}>
              <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", margin: "0 0 0.5rem 0" }}>{stat.label}</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Lista de Documentos */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: "12px",
          padding: "1.5rem",
          backdropFilter: "blur(10px)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 1rem 0" }}>Documentos</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? "12px" : "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(124, 58, 237, 0.2)" }}>
                  <th style={{ textAlign: "left", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Documento</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Tipo</th>
                  <th style={{ textAlign: "right", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Valor</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Vencimento</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Status</th>
                  <th style={{ textAlign: "center", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc) => {
                  const statusColor = getStatusColor(doc.status);
                  const vencimentoDate = new Date(doc.dataVencimento);
                  const hoje = new Date();
                  const diasRestantes = Math.ceil((vencimentoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={doc.id} style={{ borderBottom: "1px solid rgba(124, 58, 237, 0.1)" }}>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "18px" }}>{getTypeIcon(doc.tipo)}</span>
                          {doc.nome}
                        </div>
                      </td>
                      <td style={{ padding: "12px", color: "rgba(255, 255, 255, 0.7)" }}>
                        {doc.tipo.toUpperCase()}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>
                        R$ {doc.valor.toLocaleString("pt-BR")}
                      </td>
                      <td style={{ padding: "12px", color: "rgba(255, 255, 255, 0.7)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Calendar size={16} />
                          {new Date(doc.dataVencimento).toLocaleDateString("pt-BR")}
                          {diasRestantes > 0 && diasRestantes <= 7 && (
                            <span style={{ fontSize: "12px", color: "#fcd34d" }}>({diasRestantes}d)</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: statusColor.bg,
                          color: statusColor.text
                        }}>
                          {doc.status === "pago" ? "Pago" : doc.status === "pendente" ? "Pendente" : "Vencido"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "none",
                            color: "#93c5fd",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            <Download size={16} />
                          </button>
                          <button onClick={() => handleDelete(doc.id)} style={{
                            background: "rgba(239, 68, 68, 0.2)",
                            border: "none",
                            color: "#fca5a5",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
