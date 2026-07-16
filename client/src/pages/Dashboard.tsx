import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { LogOut, Menu, X, TrendingUp, TrendingDown, Wallet, BarChart3, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useLocalAuth();
  const { calculateStats, transactions } = useTransactions();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [periodFilter, setPeriodFilter] = useState<'ano' | 'mes' | 'semana'>('ano');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = useState(0);

  // Atualizar quando as transações mudam
  useEffect(() => {
    const handleTransactionsUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('transactionsUpdated', handleTransactionsUpdate);
    return () => window.removeEventListener('transactionsUpdated', handleTransactionsUpdate);
  }, []);

  const getMonthName = (month: number) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[month - 1];
  };

  // Calcular dados baseado no período selecionado
  const stats = calculateStats(periodFilter, selectedMonth, selectedYear);
  const totalReceita = stats.totalReceita;
  const totalDespesa = stats.totalDespesa;
  const saldo = stats.saldo;

  // Pegar últimas transações para exibir na tabela
  const recentTransactions = stats.transacoes.slice(0, 5);

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
              Bem-vindo, {user?.name}!
            </h1>
            <p style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0"
            }}>
              {user?.nomeEmpresa}
            </p>
          </div>

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
        </div>

        {/* Period Filter */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
          backdropFilter: "blur(10px)",
          marginBottom: "2rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap"
          }}>
            <Calendar size={20} style={{ color: "rgba(124, 58, 237, 0.8)" }} />
            <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Filtrar por:</span>
          </div>

          <div style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap"
          }}>
            {/* Ano Button */}
            <button
              onClick={() => setPeriodFilter('ano')}
              style={{
                background: periodFilter === 'ano' ? "rgba(124, 58, 237, 0.4)" : "rgba(124, 58, 237, 0.1)",
                border: `2px solid ${periodFilter === 'ano' ? "rgba(124, 58, 237, 0.8)" : "rgba(124, 58, 237, 0.3)"}`,
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: periodFilter === 'ano' ? "600" : "400",
                transition: "all 0.2s"
              }}
            >
              📅 Ano
            </button>

            {/* Mês Button */}
            <button
              onClick={() => setPeriodFilter('mes')}
              style={{
                background: periodFilter === 'mes' ? "rgba(124, 58, 237, 0.4)" : "rgba(124, 58, 237, 0.1)",
                border: `2px solid ${periodFilter === 'mes' ? "rgba(124, 58, 237, 0.8)" : "rgba(124, 58, 237, 0.3)"}`,
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: periodFilter === 'mes' ? "600" : "400",
                transition: "all 0.2s"
              }}
            >
              📆 Mês
            </button>

            {/* Semana Button */}
            <button
              onClick={() => setPeriodFilter('semana')}
              style={{
                background: periodFilter === 'semana' ? "rgba(124, 58, 237, 0.4)" : "rgba(124, 58, 237, 0.1)",
                border: `2px solid ${periodFilter === 'semana' ? "rgba(124, 58, 237, 0.8)" : "rgba(124, 58, 237, 0.3)"}`,
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: periodFilter === 'semana' ? "600" : "400",
                transition: "all 0.2s"
              }}
            >
              📊 Semana
            </button>
          </div>

          {/* Seletores adicionais */}
          {periodFilter === 'ano' && (
            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Selecione o ano:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{
                  background: "rgba(124, 58, 237, 0.2)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  marginTop: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          )}

          {periodFilter === 'mes' && (
            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Selecione o mês:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{
                  background: "rgba(124, 58, 237, 0.2)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  marginTop: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                  <option key={month} value={month}>{getMonthName(month)}</option>
                ))}
              </select>
            </div>
          )}

          {periodFilter === 'semana' && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", margin: "0" }}>
                Mostrando transações dos últimos 7 dias
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div key={refreshKey} style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "1.5rem",
          marginBottom: "3rem"
        }}>
          {/* Receitas Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)",
            border: "2px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "16px",
            padding: "2rem",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            cursor: "pointer",
            transform: "translateY(0)",
            boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 16px 48px rgba(16, 185, 129, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(16, 185, 129, 0.1)";
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}>
              <div>
                <p style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: "0 0 12px 0",
                  fontWeight: "500"
                }}>
                  RECEITAS
                </p>
                <p style={{
                  fontSize: isMobile ? "28px" : "36px",
                  fontWeight: "bold",
                  margin: "0",
                  color: "#10b981"
                }}>
                  R$ {totalReceita.toFixed(2)}
                </p>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "12px"
                }}>
                  <ArrowUpRight size={16} style={{ color: "#10b981" }} />
                  <span style={{
                    fontSize: "12px",
                    color: "#10b981"
                  }}>
                    +12% este período
                  </span>
                </div>
              </div>
              <div style={{
                background: "rgba(16, 185, 129, 0.2)",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <TrendingUp size={32} style={{ color: "#10b981" }} />
              </div>
            </div>
          </div>

          {/* Despesas Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)",
            border: "2px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "16px",
            padding: "2rem",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            cursor: "pointer",
            transform: "translateY(0)",
            boxShadow: "0 8px 32px rgba(239, 68, 68, 0.1)"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 16px 48px rgba(239, 68, 68, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(239, 68, 68, 0.1)";
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}>
              <div>
                <p style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: "0 0 12px 0",
                  fontWeight: "500"
                }}>
                  DESPESAS
                </p>
                <p style={{
                  fontSize: isMobile ? "28px" : "36px",
                  fontWeight: "bold",
                  margin: "0",
                  color: "#ef4444"
                }}>
                  R$ {totalDespesa.toFixed(2)}
                </p>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "12px"
                }}>
                  <ArrowDownLeft size={16} style={{ color: "#ef4444" }} />
                  <span style={{
                    fontSize: "12px",
                    color: "#ef4444"
                  }}>
                    -5% este período
                  </span>
                </div>
              </div>
              <div style={{
                background: "rgba(239, 68, 68, 0.2)",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <TrendingDown size={32} style={{ color: "#ef4444" }} />
              </div>
            </div>
          </div>

          {/* Saldo Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 100%)",
            border: "2px solid rgba(124, 58, 237, 0.3)",
            borderRadius: "16px",
            padding: "2rem",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            cursor: "pointer",
            transform: "translateY(0)",
            boxShadow: "0 8px 32px rgba(124, 58, 237, 0.1)"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 16px 48px rgba(124, 58, 237, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(124, 58, 237, 0.1)";
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}>
              <div>
                <p style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: "0 0 12px 0",
                  fontWeight: "500"
                }}>
                  SALDO TOTAL
                </p>
                <p style={{
                  fontSize: isMobile ? "28px" : "36px",
                  fontWeight: "bold",
                  margin: "0",
                  color: saldo >= 0 ? "#10b981" : "#ef4444"
                }}>
                  R$ {saldo.toFixed(2)}
                </p>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "12px"
                }}>
                  <BarChart3 size={16} style={{ color: "rgba(124, 58, 237, 0.8)" }} />
                  <span style={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.6)"
                  }}>
                    Posição atual
                  </span>
                </div>
              </div>
              <div style={{
                background: "rgba(124, 58, 237, 0.2)",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Wallet size={32} style={{ color: "rgba(124, 58, 237, 0.8)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Transações Recentes */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: "16px",
          padding: "2rem",
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "0 0 1.5rem 0"
          }}>
            Transações Recentes
          </h2>

          {recentTransactions.length === 0 ? (
            <p style={{
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
              padding: "2rem"
            }}>
              Nenhuma transação registrada neste período
            </p>
          ) : (
            <div style={{
              overflowX: "auto"
            }}>
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
                      textAlign: "right",
                      padding: "16px",
                      color: "rgba(255, 255, 255, 0.6)",
                      fontWeight: "600"
                    }}>
                      Valor
                    </th>
                    <th style={{
                      textAlign: "right",
                      padding: "16px",
                      color: "rgba(255, 255, 255, 0.6)",
                      fontWeight: "600"
                    }}>
                      Tipo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
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
                        textAlign: "right",
                        padding: "16px",
                        color: tx.tipo === "receita" ? "#10b981" : "#ef4444",
                        fontWeight: "600"
                      }}>
                        R$ {tx.valor.toFixed(2)}
                      </td>
                      <td style={{
                        textAlign: "right",
                        padding: "16px",
                        color: tx.tipo === "receita" ? "#10b981" : "#ef4444"
                      }}>
                        {tx.tipo === "receita" ? "Receita" : "Despesa"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
