
# Guia Completo do Aplicativo FitConsult

Olá! Este documento é um guia para te ajudar a entender e gerenciar todas as partes do seu aplicativo de fitness, mesmo que você não entenda de programação. Ele foi feito para que você possa encontrar facilmente onde alterar textos, imagens, aulas e outras configurações, e também para saber quais arquivos de código são responsáveis por cada funcionalidade.

## Sumário
1.  [Identidade Visual e Componentes Principais](#1-identidade-visual-e-componentes-principais)
2.  [Estrutura dos Arquivos (Referência Rápida)](#2-estrutura-dos-arquivos-referência-rápida)
3.  [Página Inicial (Landing Page)](#3-página-inicial-landing-page)
4.  [Painel da Aluna (Dashboard)](#4-painel-da-aluna-dashboard)
5.  [Página de Oferta (Upsell)](#5-página-de-oferta-upsell)
6.  [Painel Administrativo: O seu Centro de Controle](#6-painel-administrativo-o-seu-centro-de-controle)
    *   [Métricas Principais](#métricas-principais)
    *   [Configurações Gerais](#configurações-gerais)
    *   [Conteúdo da Landing Page](#conteúdo-da-landing-page)
    *   [Seção "Conheça o Treinador"](#seção-conheça-o-treinador)
    *   [Aulas Gratuitas e VIP](#aulas-gratuitas-e-vip)
    *   [Depoimentos](#depoimentos)
    *   [Gerenciar Alunos](#gerenciar-alunos)

---

### 1. Identidade Visual e Componentes Principais

Esta seção descreve os elementos visuais que formam a identidade do seu aplicativo.

*   **Paleta de Cores:**
    *   **Cor Principal (Laranja `brand`):** `"#FF7A59"` - Usada para todos os botões de ação importantes (CTAs), links e destaques visuais para chamar a atenção do usuário.
    *   **Fundo Escuro (Dark `900`):** `"#121212"` - Cor de fundo principal da maioria das telas, criando uma atmosfera premium e focada, similar à da Netflix.
    *   **Elementos de Fundo (Dark `800`/`700`):** `"#1E1E1E"` e `"#2A2A2A"` - Usados para cards, seções e modais para criar contraste e hierarquia visual.
    *   **Onde é definido:** A paleta de cores primária está no arquivo `index.html`, dentro da tag `<script>` em `tailwind.config`.

*   **Botão Principal (CTA - Call to Action):**
    *   **Aparência:** É o botão laranja, grande e com texto em maiúsculo. Ele tem um leve efeito de "pulo" ao passar o mouse para incentivar o clique.
    *   **Função:** É usado para as ações mais importantes que você quer que a usuária tome, como "Começar Agora Grátis", "Quero Entrar Agora", "Gerar Minha Análise".
    *   **Localização no Código:** Este botão é um componente reutilizável chamado `CTAButton` e seu estilo está definido no arquivo `src/components.tsx`.

---

### 2. Estrutura dos Arquivos (Referência Rápida)

Se o seu aplicativo fosse um carro, estes seriam os papéis de cada peça principal. Todos os arquivos de código-fonte agora vivem dentro da pasta `src`.

*   `index.html`: O **chassi** do carro. Estrutura base que carrega tudo, define as cores e fontes.
*   `package.json`: A **lista de peças** do carro. Define todas as dependências do projeto e os scripts para rodar e construir o app.
*   `src/context.tsx`: O **motor e o painel de controle** do carro. Guarda todos os dados (alunas, progresso, configurações), salva e busca informações do banco de dados (Supabase) e mantém tudo sincronizado. É o cérebro do app.
*   `src/components.tsx`: A **caixa de ferramentas e peças**. Contém todos os componentes visuais reutilizáveis: `CTAButton` (botões laranja), `Modal` (pop-ups), `Carousel` (carrossel de aulas), `LessonCard` (card de aula), ícones, etc.
*   `src/LandingPage.tsx`, `src/DashboardPage.tsx`, `src/UpsellPage.tsx`, `src/AdminPage.tsx`: As **partes do carro montadas**. São as páginas que a usuária vê, construídas usando as peças do `components.tsx` e os dados do `context.tsx`.
*   `src/App.tsx`: O **GPS** do carro. Define as rotas. Quando a usuária clica em um link, este arquivo decide qual página (ex: `DashboardPage`) deve ser mostrada.
*   `src/types.ts`: O **manual de instruções**. Define a estrutura dos dados. Diz ao código o que é uma "Aluna" (tem nome, email, etc.) ou uma "Aula" (tem título, vídeo, etc.).
*   `guia.md` e `bancodedados.md`: A documentação do projeto.

---

### 3. Página Inicial (Landing Page)

Esta é a primeira página que uma visitante vê. O objetivo dela é convencer a visitante a se cadastrar para ter acesso às aulas gratuitas.

*   **Funcionalidades e Botões:**
    *   **Botão "Cadastre-se" (Header) e "Começar Agora Grátis" (Hero):** Ambos são botões `CTAButton` que abrem um pop-up (Modal) com o formulário de cadastro.
    *   **Formulário de Cadastro:** Pede nome, e-mail e WhatsApp. Ao ser preenchido, a função `handleSubmit` é chamada para verificar se a aluna já existe. Se não, cria um novo cadastro; se sim, faz o login.
    *   **Depoimentos em Vídeo:** Nos cards de depoimento, um ícone de "Play" aparece sobre a foto se um ID de vídeo do YouTube for fornecido. Clicar nele abre um modal (`Modal`) com o player de vídeo (`YouTubeEmbed`).

*   **Localização no Código:**
    *   **Estrutura e Conteúdo:** `src/LandingPage.tsx` contém toda a organização da página: seções, textos e imagens.
    *   **Componentes Visuais:** `src/components.tsx` fornece o `CTAButton`, `Modal`, `TestimonialCard` e ícones.
    *   **Edição do Conteúdo:** O conteúdo dinâmico (títulos, depoimentos, dados do coach) é gerenciado por você no `src/AdminPage.tsx` e carregado via `src/context.tsx`.

---

### 4. Painel da Aluna (Dashboard)

Esta é a área exclusiva para alunas cadastradas.

*   **Funcionalidades e Botões:**
    *   **Autoavaliação (`AssessmentForm`):** Formulário que aparece para novas alunas. O botão **"Gerar Minha Análise"** (`CTAButton`) envia os dados para a IA do Google (`GoogleGenAI`) para gerar um feedback personalizado. A lógica está toda em `src/DashboardPage.tsx`.
    *   **Botão "Fazer minha autoavaliação":** `CTAButton` com uma animação pulsante (`animate-pulse-orange`) para chamar a atenção.
    *   **Cards de Aula (`LessonCard`):** Cada card no carrossel representa uma aula. Eles podem ter um selo de "VIP" ou "Concluída". Clicar em uma aula liberada abre o player de vídeo. Clicar em uma aula VIP bloqueada abre o modal de upsell (`UpsellRedirectModal`).
    *   **Botão "Marcar como Concluída":** Dentro do modal da aula, este `CTAButton` atualiza o progresso da aluna.

*   **Localização no Código:**
    *   **Estrutura e Lógica:** `src/DashboardPage.tsx` orquestra toda a página, decidindo se mostra a avaliação ou a lista de aulas, e controlando o que acontece ao clicar em cada aula.
    *   **Dados da Aluna:** `src/context.tsx` fornece todos os dados da aluna logada (nome, progresso, etc.) e as funções para salvar as atualizações.
    *   **Componentes Visuais:** `src/components.tsx` fornece a `ProgressBar`, `Carousel`, `LessonCard` e todos os modais usados aqui.

---

### 5. Página de Oferta (Upsell)

Esta página é mostrada para vender seu programa completo.

*   **Funcionalidades e Botões:**
    *   **Vídeo de Vendas:** Um player do YouTube (`iframe`) que é carregado com o link que você define no painel de admin.
    *   **Botão "QUERO ENTRAR AGORA":** O principal `CTAButton` da página, que futuramente irá redirecionar para o seu link de checkout.

*   **Localização no Código:**
    *   **Estrutura e Conteúdo:** `src/UpsellPage.tsx` é o arquivo que monta esta página.
    *   **Edição do Conteúdo:** O link do vídeo e os textos de preço são gerenciados por você no `src/AdminPage.tsx`.

---

### 6. Painel Administrativo: O seu Centro de Controle

Esta é a sua área de gerenciamento. Para acessar, visite `[URL_DO_SEU_APP]/#/admin`.

*   **Botão "Salvar Todas as Alterações":** Este `CTAButton`, localizado no final da página, é o mais importante. Ele pega todas as mudanças que você fez e as salva no `localStorage` do navegador, para que o resto do aplicativo possa usá-las.

*   **Botão "Exportar para CSV":** Gera e baixa uma planilha com os dados de todas as alunas, ideal para análises.

*   **Localização no Código:**
    *   **Estrutura e Lógica:** `src/AdminPage.tsx` contém toda a interface e as funções para alterar as configurações.
    *   **Salvando os Dados:** A função `handleSave` chama o `src/context.tsx` para executar a ação `UPDATE_SETTINGS`, que persiste as novas configurações.

#### Onde cada configuração do Admin é usada:

*   **Configurações Gerais:**
    *   *Tempo de Acesso Gratuito:* Usado em `src/DashboardPage.tsx` para calcular o tempo restante no `CountdownTimer` e em `src/App.tsx` para redirecionar para a página de upsell quando o tempo expira.
*   **Conteúdo da Landing Page:**
    *   *Título, Subtítulo e Imagem Principal (Hero):* Exibidos no topo do `src/LandingPage.tsx`. A imagem pode ser carregada do seu computador ou inserida via URL.
*   **Seção "Conheça o Treinador":**
    *   *Nome, Imagem, Bio, Certificações:* Todos esses dados são exibidos na seção "CONHEÇA SEU TREINADOR" no `src/LandingPage.tsx`.
*   **Aulas Gratuitas e VIP:**
    *   *Título, ID do Vídeo, Descrição, Thumbnail:* Usados para construir os `LessonCard` no `src/DashboardPage.tsx`. A imagem de thumbnail pode ser carregada do seu computador ou inserida via URL.
*   **Depoimentos:**
    *   *Nome, Imagem, Texto, Vídeo:* Usados para construir os `TestimonialCard` no `src/LandingPage.tsx`.
*   **Gerenciar Alunos:**
    *   A tabela lista todas as alunas com seus dados principais, como nome, e-mail, WhatsApp e progresso nas aulas.

Com este guia, você tem total autonomia para gerenciar e evoluir seu aplicativo. Boas vendas!
