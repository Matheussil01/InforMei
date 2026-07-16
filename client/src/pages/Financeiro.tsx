import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { LogOut, Menu, X, Plus, Trash2, Edit2 } from "lucide-react";

export default function Financeiro() {
  const { user, isAuthenticated, loading, logout } = useLocalAuth();
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    descricao: string;
    tipo: "receita" | "despesa";
    valor: string;
    data: string;
    categoria: string;
  }>({
    descricao: "",
    tipo: "receita",
    valor: "",
    data: new Date().toISOString().split("T")[0],
    categoria: "",
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

  const handleAddTransaction = () => {
    if (!formData.descricao || !formData.valor || !formData.categoria) {
      alert("Preencha todos os campos!");
      return;
    }

    if (editingId) {
      updateTransaction(editingId, {
        descricao: formData.descricao,
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        data: formData.data,
        categoria: formData.categoria,
      });
      setEditingId(null);
    } else {
      addTransaction({
        descricao: formData.descricao,
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        data: formData.data,
        categoria: formData.categoria,
      });
    }
    setFormData({ descricao: "", tipo: "receita", valor: "", data: new Date().toISOString().split("T")[0], categoria: "" });
    setShowForm(false);
  };

  const handleEdit = (id: number) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setFormData({
        descricao: transaction.descricao,
        tipo: transaction.tipo,
        valor: transaction.valor.toString(),
        data: transaction.data,
        categoria: transaction.categoria,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      deleteTransaction(id);
    }
  };

  const totalReceitas = transactions.filter(t => t.tipo === "receita").reduce((sum, t) => sum + t.valor, 0);
  const totalDespesas = transactions.filter(t => t.tipo === "despesa").reduce((sum, t) => sum + t.valor, 0);
  const saldo = totalReceitas - totalDespesas;

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
          gap: "1.5rem"
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
                  background: "rgba(124, 58, 237, 0.2)",
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
              Financeiro
            </h1>
            <p style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0"
            }}>
              Gerencie suas receitas e despesas
            </p>
          </div>

          <div style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap"
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
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({ descricao: "", tipo: "receita", valor: "", data: new Date().toISOString().split("T")[0], categoria: "" });
              }}
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s"
              }}
            >
              <Plus size={18} />
              Nova Transação
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem"
          }}>
            <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", margin: "0 0 8px 0" }}>Receitas</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981", margin: "0" }}>R$ {totalReceitas.toFixed(2)}</p>
          </div>
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem"
          }}>
            <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", margin: "0 0 8px 0" }}>Despesas</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444", margin: "0" }}>R$ {totalDespesas.toFixed(2)}</p>
          </div>
          <div style={{
            background: "rgba(124, 58, 237, 0.1)",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem"
          }}>
            <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", margin: "0 0 8px 0" }}>Saldo</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: saldo >= 0 ? "#10b981" : "#ef4444", margin: "0" }}>R$ {saldo.toFixed(2)}</p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            backdropFilter: "blur(10px)"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 1.5rem 0" }}>
              {editingId ? "Editar Transação" : "Nova Transação"}
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "1rem",
              marginBottom: "1.5rem"
            }}>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "8px" }}>Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Venda de serviço"
                  style={{
                    width: "100%",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    color: "white",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "8px" }}>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as "receita" | "despesa" })}
                  style={{
                    width: "100%",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    color: "white",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "8px" }}>Valor</label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: "100%",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    color: "white",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "8px" }}>Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    color: "white",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "8px" }}>Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Ex: Serviços, Aluguel, etc"
                  style={{
                    width: "100%",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    color: "white",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end"
            }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ descricao: "", tipo: "receita", valor: "", data: new Date().toISOString().split("T")[0], categoria: "" });
                }}
                style={{
                  background: "rgba(124, 58, 237, 0.2)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTransaction}
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                {editingId ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: "16px",
          padding: "2rem",
          backdropFilter: "blur(10px)",
          overflowX: "auto"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 1.5rem 0" }}>Transações</h2>

          {transactions.length === 0 ? (
            <p style={{
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
              padding: "2rem"
            }}>
              Nenhuma transação registrada
            </p>
          ) : (
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: isMobile ? "12px" : "14px"
            }}>
              <thead>
                <tr style={{
                  borderBottom: "2px solid rgba(124, 58, 237, 0.2)"
                }}>
                  <th style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: "600"
                  }}>
                    Descrição
                  </th>
                  <th style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: "600"
                  }}>
                    Categoria
                  </th>
                  <th style={{
                    textAlign: "right",
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: "600"
                  }}>
                    Valor
                  </th>
                  <th style={{
                    textAlign: "center",
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: "600"
                  }}>
                    Tipo
                  </th>
                  <th style={{
                    textAlign: "center",
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: "600"
                  }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: "1px solid rgba(124, 58, 237, 0.1)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(124, 58, 237, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={{
                      padding: "16px",
                      color: "white"
                    }}>
                      {tx.descricao}
                    </td>
                    <td style={{
                      padding: "16px",
                      color: "rgba(255, 255, 255, 0.7)"
                    }}>
                      {tx.categoria}
                    </td>
                    <td style={{
                      textAlign: "right",
                      padding: "16px",
                      color: tx.tipo === "receita" ? "#10b981" : "#ef4444",
                      fontWeight: "600"
                    }}>
                      R$ {tx.valor.toFixed(2)}
                    </td>
                    <td style={{
                      textAlign: "center",
                      padding: "16px",
                      color: tx.tipo === "receita" ? "#10b981" : "#ef4444"
                    }}>
                      {tx.tipo === "receita" ? "Receita" : "Despesa"}
                    </td>
                    <td style={{
                      textAlign: "center",
                      padding: "16px"
                    }}>
                      <div style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center"
                      }}>
                        <button
                          onClick={() => handleEdit(tx.id)}
                          style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            color: "#93c5fd",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px"
                          }}
                        >
                          <Edit2 size={14} />
                          {!isMobile && "Editar"}
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          style={{
                            background: "rgba(239, 68, 68, 0.2)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#fca5a5",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px"
                          }}
                        >
                          <Trash2 size={14} />
                          {!isMobile && "Deletar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
