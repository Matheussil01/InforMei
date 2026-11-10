<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=220&section=header&text=InforMei&fontSize=65&fontColor=FFFFFF&fontAlignY=42&color=E10600&animation=fadeIn&stroke=FFFFFF&strokeWidth=1" alt="Banner InforMei" />

  <h3>Gestão inteligente para Microempreendedores Individuais</h3>
  <p>Clientes, finanças, documentos e informações em uma única plataforma.</p>

  <a href="https://github.com/Matheussil01/InforMei">
    <img src="https://img.shields.io/badge/GitHub-Reposit%C3%B3rio-E10600?style=for-the-badge&logo=github&logoColor=white" alt="Repositório GitHub" />
  </a>
  <a href="https://informei.onrender.com/">
  <img src="https://img.shields.io/badge/Projeto-InforMei-151515?style=for-the-badge" alt="Projeto InforMei" />
</div>

---

## <span style="color:#E10600">Sobre o projeto</span>

O **InforMei** é uma plataforma web desenvolvida para auxiliar **Microempreendedores Individuais (MEIs)** a organizar atividades importantes do dia a dia em um só lugar. A proposta é tornar a gestão do negócio mais simples e acessível, reunindo recursos relacionados a clientes, finanças, documentos e novidades do setor.

Este projeto também representa a aplicação prática de conhecimentos em desenvolvimento web, integração entre front-end e back-end e organização de dados.

## Funcionalidades do projeto

- **Gestão de clientes:** organização de informações e cadastros de clientes.
- **Controle financeiro:** acompanhamento das informações financeiras do negócio.
- **Documentos:** área voltada à organização de documentos.
- **Informações para MEIs:** acesso a conteúdos e novidades relevantes para microempreendedores.
- **Interface web:** navegação e visualização dos recursos da plataforma.

> A disponibilidade de cada recurso pode depender da configuração do ambiente e da versão do projeto.

## Tecnologias utilizadas

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,js,html,css,tailwind,vite,nodejs,express,mysql&theme=dark" alt="React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Vite, Node.js, Express e MySQL" />
</div>

| Camada | Tecnologias |
| :-- | :-- |
| **Front-end** | React, TypeScript, Vite e Tailwind CSS |
| **Back-end** | Node.js, Express e tRPC |
| **Banco de dados** | MySQL e Drizzle ORM |
| **Componentes e interface** | Radix UI e Lucide React |
| **Ferramentas** | Git, GitHub, pnpm, Prettier e Vitest |

## Estrutura do repositório

```text
InforMei/
├── client/             # Aplicação front-end
├── server/             # Aplicação back-end
├── shared/             # Código e definições compartilhadas
├── drizzle/            # Arquivos relacionados ao banco de dados
├── patches/            # Ajustes em dependências
├── references/         # Referências do projeto
├── package.json        # Dependências e comandos
├── vite.config.ts      # Configuração do Vite
└── tsconfig.json       # Configuração do TypeScript
```

## Como executar localmente

**Pré-requisitos:** Node.js e pnpm instalados. Dependendo das funcionalidades utilizadas, também serão necessárias configurações de ambiente e conexão com o banco de dados.

**1. Clone o repositório**

```bash
git clone https://github.com/Matheussil01/InforMei.git
```

**2. Acesse a pasta**

```bash
cd InforMei
```

**3. Instale as dependências**

```bash
pnpm install
```

**4. Configure as variáveis de ambiente necessárias** para o servidor e os serviços utilizados. Consulte os arquivos de configuração do projeto; não publique credenciais no GitHub.

**5. Inicie o ambiente de desenvolvimento**

```bash
pnpm dev
```

> Observação: o comando de desenvolvimento usa `NODE_ENV=development` no script do projeto. No Windows, pode ser necessário utilizar um terminal compatível ou adaptar a definição da variável de ambiente.

### Comandos úteis

| Comando | Descrição |
| :-- | :-- |
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera o build de produção |
| `pnpm start` | Inicia a versão de produção após o build |
| `pnpm check` | Verifica os tipos com TypeScript |
| `pnpm test` | Executa testes com Vitest |
| `pnpm db:push` | Gera e executa migrações do Drizzle; requer banco configurado |

## Objetivo

Oferecer uma solução que ajude microempreendedores a centralizar tarefas administrativas, com uma experiência mais organizada e prática. O projeto também contribuiu para o desenvolvimento de habilidades técnicas na criação de aplicações web.

## Desenvolvedor

<div align="center">
  <strong>Matheus Faustino</strong>
  <p>Desenvolvedor Front-end | Estudante de Ciência da Computação</p>
  <a href="https://github.com/Matheussil01">
    <img src="https://img.shields.io/badge/GitHub-Matheussil01-151515?style=for-the-badge&logo=github&logoColor=white" alt="GitHub de Matheus" />
  </a>
  <a href="https://www.linkedin.com/in/matheussil01/">
    <img src="https://img.shields.io/badge/LinkedIn-Conectar-E10600?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn de Matheus" />
  </a>
</div>

---

<div align="center">
  <p>Desenvolvido para transformar organização em praticidade.</p>
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=110&section=footer&color=E10600" alt="Rodapé vermelho" />
</div>
