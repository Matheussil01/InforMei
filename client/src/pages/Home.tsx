import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, FileText, Bell, Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: TrendingUp,
      title: "Dashboard Financeiro",
      description: "Controle suas receitas e despesas em tempo real com gráficos intuitivos",
    },
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Organize seus clientes e mantenha histórico de transações",
    },
    {
      icon: FileText,
      title: "Documentos & Boletos",
      description: "Gerencie seus documentos com alertas de vencimento automáticos",
    },
    {
      icon: Bell,
      title: "Notificações Inteligentes",
      description: "Receba alertas sobre seu faturamento anual e saldo financeiro",
    },
  ];

  const team = [
    { name: "Andrey Oliveira", role: "Desenvolvedor" },
    { name: "Augusto Neves", role: "Designer" },
    { name: "Mateus José", role: "Product Manager" },
    { name: "Matheus Faustino", role: "Desenvolvedor" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #0f172a, #1e1b4b, #0c2340)",
      color: "white",
      overflow: "hidden"
    }}>
      {/* Navigation */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "0 1rem"
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px"
        }}>
          <div style={{
            fontSize: "clamp(18px, 5vw, 24px)",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            InforMEI
          </div>
          
          {/* Desktop Menu */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "24px"
          }}
          className="hidden md:flex">
              <a href="#features" style={{ textDecoration: "none", color: "white", fontSize: "14px" }}>Recursos</a>
              <a href="#about" style={{ textDecoration: "none", color: "white", fontSize: "14px" }}>Sobre</a>
              <a href="#team" style={{ textDecoration: "none", color: "white", fontSize: "14px" }}>Equipe</a>
            </div>
            
            {/* Desktop Button */}
            <button onClick={() => navigate("/login")} style={{
              background: "linear-gradient(to right, #7c3aed, #3b82f6)",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px"
            }}>
              Entrar
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                display: "none"
              }}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "16px",
            background: "rgba(0, 0, 0, 0.4)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <a href="#features" style={{ textDecoration: "none", color: "white" }} onClick={() => setMobileMenuOpen(false)}>Recursos</a>
            <a href="#about" style={{ textDecoration: "none", color: "white" }} onClick={() => setMobileMenuOpen(false)}>Sobre</a>
            <a href="#team" style={{ textDecoration: "none", color: "white" }} onClick={() => setMobileMenuOpen(false)}>Equipe</a>
            <Button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} style={{
              background: "linear-gradient(to right, #7c3aed, #3b82f6)",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%"
            }}>
              Entrar
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        paddingTop: "80px",
        overflow: "hidden",
        padding: "80px 1rem 2rem"
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "80px",
            left: "40px",
            width: "288px",
            height: "288px",
            backgroundColor: "rgba(168, 85, 247, 0.2)",
            borderRadius: "50%",
            filter: "blur(80px)",
            mixBlendMode: "multiply"
          }}></div>
          <div style={{
            position: "absolute",
            top: "160px",
            right: "40px",
            width: "288px",
            height: "288px",
            backgroundColor: "rgba(6, 182, 212, 0.2)",
            borderRadius: "50%",
            filter: "blur(80px)",
            mixBlendMode: "multiply"
          }}></div>
        </div>

        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0",
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          width: "100%"
        }}>
          <h1 style={{
            fontSize: "clamp(2rem, 8vw, 4rem)",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            lineHeight: "1.2"
          }}>
            Gerencie seu <span style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MEI</span> com Inteligência
          </h1>
          <p style={{
            fontSize: "clamp(1rem, 4vw, 1.25rem)",
            color: "#d1d5db",
            marginBottom: "2rem",
            maxWidth: "600px",
            margin: "0 auto 2rem",
            lineHeight: "1.6"
          }}>
            A plataforma completa para microempreendedores. Controle financeiro, gestão de clientes e documentos em um único lugar.
          </p>
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <Button onClick={() => navigate("/cadastro")} style={{
              background: "linear-gradient(to right, #a855f7, #7c3aed)",
              color: "white",
              border: "none",
              padding: "12px 32px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              maxWidth: "300px",
              justifyContent: "center",
              fontSize: "16px"
            }}>
              Começar Agora <ArrowRight size={20} />
            </Button>
            <Button onClick={() => navigate("/login")} style={{
              background: "transparent",
              color: "white",
              border: "2px solid rgba(168, 85, 247, 0.5)",
              padding: "10px 30px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%",
              maxWidth: "300px",
              fontSize: "16px"
            }}>
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: "4rem 1rem",
        maxWidth: "1280px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
          fontWeight: "bold",
          marginBottom: "3rem",
          textAlign: "center"
        }}>
          Funcionalidades Poderosas
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem"
        }}>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} style={{
                background: "rgba(30, 27, 75, 0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "16px",
                padding: "2rem",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
                }}
              >
                <Icon size={32} style={{ color: "#a855f7", marginBottom: "1rem" }} />
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: "#d1d5db",
                  fontSize: "0.95rem",
                  lineHeight: "1.5"
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: "4rem 1rem",
        maxWidth: "1280px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
          fontWeight: "bold",
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          Sobre InforMEI
        </h2>
        <p style={{
          fontSize: "clamp(1rem, 3vw, 1.1rem)",
          color: "#d1d5db",
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          lineHeight: "1.8"
        }}>
          InforMEI é uma plataforma desenvolvida especificamente para microempreendedores que desejam profissionalizar sua gestão financeira. Com ferramentas intuitivas e design moderno, facilitamos o controle de receitas, despesas, clientes e documentos em um único lugar.
        </p>
      </section>

      {/* Team Section */}
      <section id="team" style={{
        padding: "4rem 1rem",
        maxWidth: "1280px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
          fontWeight: "bold",
          marginBottom: "3rem",
          textAlign: "center"
        }}>
          Nosso Time
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem"
        }}>
          {team.map((member, idx) => (
            <div key={idx} style={{
              background: "rgba(30, 27, 75, 0.4)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                borderRadius: "50%",
                margin: "0 auto 1rem"
              }}></div>
              <h3 style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                marginBottom: "0.5rem"
              }}>
                {member.name}
              </h3>
              <p style={{
                color: "#a855f7",
                fontSize: "0.9rem"
              }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "2rem 1rem",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px"
      }}>
        <p>© 2026 InforMEI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
