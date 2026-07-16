import { useState, useEffect } from "react";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useLocation } from "wouter";
import { LogOut, Menu, X, Plus, Trash2, Edit2 } from "lucide-react";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataCadastro: string;
}

export default function Clientes() {
  const { user, isAuthenticated, loading, logout } = useLocalAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 98765-4321", endereco: "Rua A, 123", dataCadastro: "2026-05-20" },
    { id: 2, nome: "Maria Santos", email: "maria@email.com", telefone: "(11) 99876-5432", endereco: "Rua B, 456", dataCadastro: "2026-05-18" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
  }>({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

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

  const handleAddCliente = () => {
    if (editingId) {
      setClientes(clientes.map(c =>
        c.id === editingId
          ? { ...c, ...formData }
          : c
      ));
      setEditingId(null);
    } else {
      setClientes([...clientes, {
        id: Math.max(...clientes.map(c => c.id), 0) + 1,
        ...formData,
        dataCadastro: new Date().toISOString().split("T")[0],
      }]);
    }
    setFormData({ nome: "", email: "", telefone: "", endereco: "" });
    setShowForm(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
    });
    setEditingId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

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
                  background: item.path === "/clientes" ? "rgba(124, 58, 237, 0.4)" : "rgba(124, 58, 237, 0.2)",
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
              Gestão de Clientes
            </h1>
            <p style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0"
            }}>
              Gerencie seus clientes e contatos
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
              onClick={() => setShowForm(!showForm)}
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
              <Plus size={18} /> Novo Cliente
            </button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            backdropFilter: "blur(10px)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 1rem 0" }}>
              {editingId ? "Editar Cliente" : "Novo Cliente"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <input
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  boxSizing: "border-box"
                }}
              />
              <input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  boxSizing: "border-box"
                }}
              />
              <input
                placeholder="Telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  boxSizing: "border-box"
                }}
              />
              <input
                placeholder="Endereço"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={handleAddCliente}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                {editingId ? "Atualizar" : "Adicionar"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ nome: "", email: "", telefone: "", endereco: "" });
                }}
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Clientes */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: "12px",
          padding: "1.5rem",
          backdropFilter: "blur(10px)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 1rem 0" }}>Clientes</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? "12px" : "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(124, 58, 237, 0.2)" }}>
                  <th style={{ textAlign: "left", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Nome</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Telefone</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Endereço</th>
                  <th style={{ textAlign: "center", padding: "12px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} style={{ borderBottom: "1px solid rgba(124, 58, 237, 0.1)" }}>
                    <td style={{ padding: "12px" }}>{cliente.nome}</td>
                    <td style={{ padding: "12px", color: "rgba(255, 255, 255, 0.7)" }}>{cliente.email}</td>
                    <td style={{ padding: "12px", color: "rgba(255, 255, 255, 0.7)" }}>{cliente.telefone}</td>
                    <td style={{ padding: "12px", color: "rgba(255, 255, 255, 0.7)" }}>{cliente.endereco}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          onClick={() => handleEdit(cliente)}
                          style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "none",
                            color: "#93c5fd",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          style={{
                            background: "rgba(239, 68, 68, 0.2)",
                            border: "none",
                            color: "#fca5a5",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
