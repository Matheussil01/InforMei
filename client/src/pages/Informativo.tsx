import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, DollarSign, TrendingUp, FileText } from "lucide-react";

export default function Informativo() {
  const [, navigate] = useLocation();

  const topics = [
    {
      id: "mei",
      icon: BookOpen,
      title: "O que é MEI?",
      description: "Entenda o conceito de Microempreendedor Individual",
      content: [
        "MEI (Microempreendedor Individual) é uma categoria de formalização para profissionais autônomos.",
        "Permite que você trabalhe por conta própria de forma legal e segura.",
        "Oferece benefícios como acesso a crédito, previdência social e emissão de recibos.",
        "O limite de faturamento anual é de R$ 81.000,00.",
        "Você pode ter até um funcionário contratado.",
      ],
    },
    {
      id: "tributacao",
      icon: DollarSign,
      title: "Tributação do MEI",
      description: "Como funciona a tributação para MEIs",
      content: [
        "O MEI paga uma contribuição mensal fixa de 5% do salário mínimo.",
        "Essa contribuição é destinada ao INSS (Instituto Nacional de Seguro Social).",
        "Você também precisa pagar impostos sobre os serviços prestados.",
        "O regime tributário do MEI é simplificado e facilitado.",
        "Existem deduções permitidas que reduzem a base de cálculo dos impostos.",
      ],
    },
    {
      id: "precificacao",
      icon: TrendingUp,
      title: "Precificação de Serviços",
      description: "Como precificar seus serviços corretamente",
      content: [
        "Calcule seus custos fixos e variáveis mensais.",
        "Determine a margem de lucro desejada (geralmente 20-50%).",
        "Pesquise os preços praticados no mercado.",
        "Considere o tempo investido em cada serviço.",
        "Revise seus preços periodicamente conforme a inflação.",
      ],
    },
    {
      id: "lucro",
      icon: TrendingUp,
      title: "Maximizando o Lucro",
      description: "Estratégias para aumentar seus ganhos",
      content: [
        "Reduza custos operacionais sem comprometer a qualidade.",
        "Aumente o volume de clientes através de marketing.",
        "Ofereça serviços complementares para aumentar o ticket médio.",
        "Negocie melhores condições com fornecedores.",
        "Invista em sua qualificação e desenvolvimento profissional.",
      ],
    },
    {
      id: "organizacao",
      icon: FileText,
      title: "Organização Financeira",
      description: "Como manter suas finanças organizadas",
      content: [
        "Mantenha um registro detalhado de todas as receitas e despesas.",
        "Separe as finanças pessoais das finanças do negócio.",
        "Faça um planejamento mensal e acompanhe os resultados.",
        "Guarde documentos fiscais por pelo menos 5 anos.",
        "Utilize ferramentas de gestão financeira para facilitar o controle.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Button asChild variant="ghost" className="text-2xl font-bold gradient-text">
            <a href="/">InforMEI</a>
          </Button>
          <div className="flex items-center gap-4">
            <a href="/" className="hover:text-purple-400 transition-colors">Voltar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container">
          <div className="text-center animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Centro de <span className="gradient-text">Conhecimento MEI</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Aprenda tudo sobre como formalizar, gerenciar e crescer seu negócio como Microempreendedor Individual
            </p>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 relative">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={topic.id}
                  className="group card border-purple-500/20 hover:border-purple-500/50 cursor-pointer transition-all hover:bg-purple-500/10"
                  onClick={() => navigate(`/informativo/${topic.id}`)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{topic.title}</CardTitle>
                    <CardDescription className="text-gray-400">{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                      onClick={() => navigate(`/informativo/${topic.id}`)}
                    >
                      Saiba Mais <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 relative">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="card border-green-500/20 bg-green-500/10 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-400 mb-2">81.000</div>
                <p className="text-sm text-gray-400">Limite de faturamento anual</p>
              </CardContent>
            </Card>
            <Card className="card border-blue-500/20 bg-blue-500/10 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">5%</div>
                <p className="text-sm text-gray-400">Contribuição mensal do INSS</p>
              </CardContent>
            </Card>
            <Card className="card border-purple-500/20 bg-purple-500/10 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">1</div>
                <p className="text-sm text-gray-400">Funcionário permitido</p>
              </CardContent>
            </Card>
            <Card className="card border-cyan-500/20 bg-cyan-500/10 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">Simples</div>
                <p className="text-sm text-gray-400">Regime tributário</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="container">
          <Card className="card border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-center p-12">
            <CardContent>
              <h2 className="text-3xl font-bold mb-4">Pronto para Gerenciar seu MEI?</h2>
              <p className="text-gray-300 mb-6">Use a InforMEI para controlar suas finanças e crescer seu negócio</p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <a href="/dashboard">Acessar Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-20">
        <div className="container text-center text-gray-400 text-sm">
          <p>© 2026 InforMEI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
