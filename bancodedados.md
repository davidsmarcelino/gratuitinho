# Guia de Banco de Dados e Hospedagem (Supabase + Vercel)

Este guia foi criado para te ajudar a configurar e colocar seu aplicativo no ar, mesmo que você não tenha nenhum conhecimento de programação. Vamos usar duas ferramentas gratuitas e poderosas:

*   **Supabase:** Será nosso banco de dados online. É aqui que todas as informações das suas alunas (cadastro, progresso, etc.) e as configurações do site serão armazenadas de forma segura.
*   **Vercel:** Será nossa plataforma de hospedagem. É ela que vai pegar o código do aplicativo e publicá-lo na internet para que suas alunas possam acessá-lo.

Siga os passos com calma. Ao final, seu aplicativo estará funcionando 100% online!

---

## Parte 1: Configurando o Banco de Dados na Supabase

### Passo 1: Criar sua conta na Supabase
1.  Acesse o site [supabase.com](https://supabase.com).
2.  Clique em **"Start your project"**.
3.  A forma mais fácil de se cadastrar é usando sua conta do GitHub. Se não tiver uma, pode criar na hora.

### Passo 2: Criar um novo projeto
1.  Dentro do painel da Supabase, clique em **"New Project"**.
2.  **Name:** Dê um nome para o seu projeto (ex: `MeuAppFitness`).
3.  **Database Password:** Crie uma senha forte e **GUARDE-A EM UM LUGAR SEGURO**. Você pode usar um gerador de senhas.
4.  **Region:** Escolha a região mais próxima de onde suas alunas estão (ex: `South America (Sao Paulo)`).
5.  Clique em **"Create new project"** e aguarde alguns minutos enquanto a mágica acontece.

### Passo 3: Criar as Tabelas no Banco de Dados
Esta é a parte mais importante. Vamos criar as "planilhas" online que vão guardar os dados.

1.  No menu à esquerda, clique no ícone de **SQL Editor** (parece uma folha com `<>`).
2.  Clique em **"+ New query"**.
3.  Uma tela para escrever código vai aparecer. Apague qualquer texto que já esteja lá.
4.  **Copie TODO o código abaixo** e **cole** nessa tela.

```sql
-- ========= TABELA DE ALUNAS (USERS) =========

-- Cria a tabela "users" para armazenar todas as informações das alunas.
CREATE TABLE public.users (
  -- Nome completo da aluna.
  name TEXT NOT NULL,
  -- Email da aluna. Este é o identificador único e a chave principal.
  email TEXT NOT NULL PRIMARY KEY,
  -- Número de WhatsApp da aluna.
  whatsapp TEXT NOT NULL,
  -- Data e hora em que a aluna se cadastrou. O valor padrão é a hora atual.
  "registrationDate" TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Campos da avaliação (separados para melhor organização dos dados).
  assessment_age INT,
  assessment_height INT,
  assessment_weight INT,
  assessment_activity_level TEXT,
  assessment_goal TEXT,
  assessment_sleep_quality INT,
  assessment_food_quality INT,
  assessment_training_location TEXT,
  assessment_imc NUMERIC(5, 2),
  assessment_ideal_weight TEXT,
  -- Armazena um array de IDs das aulas concluídas em formato JSON.
  progress JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- Adiciona comentários para clareza.
COMMENT ON TABLE public.users IS 'Tabela para armazenar os dados das alunas cadastradas.';
COMMENT ON COLUMN public.users.email IS 'Email da aluna, usado como identificador único (PK).';
COMMENT ON COLUMN public.users.assessment_age IS 'Idade da aluna na avaliação.';
COMMENT ON COLUMN public.users.assessment_imc IS 'IMC calculado na avaliação.';
COMMENT ON COLUMN public.users.assessment_goal IS 'Objetivo principal da aluna (ex: emagrecer).';

-- Habilita a Segurança em Nível de Linha (RLS - Row Level Security).
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO PARA A TABELA 'users'
-- Permite que qualquer pessoa leia, insira ou atualize registros.
-- A lógica de segurança do app garante que um usuário só edite seus próprios dados.
CREATE POLICY "Allow public access to users"
ON public.users
FOR ALL
USING (true)
WITH CHECK (true);


-- ========= TABELA DE CONFIGURAÇÕES (SETTINGS) =========

-- Cria a tabela "settings" para armazenar as configurações globais do aplicativo.
-- Teremos apenas uma linha nesta tabela, identificada pelo id=1.
CREATE TABLE public.settings (
    id BIGINT PRIMARY KEY,
    -- A coluna 'config' armazena o objeto JSON completo das configurações.
    config JSONB,
    -- Registra automaticamente a data da última atualização.
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilita a Segurança em Nível de Linha (RLS).
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO PARA A TABELA 'settings'

-- Política 1: Permite que qualquer pessoa (mesmo não logada) leia as configurações.
-- Isso é necessário para que todos os visitantes vejam a landing page corretamente.
CREATE POLICY "Allow public read access to settings"
ON public.settings
FOR SELECT
USING (true);

-- Política 2: Permite que qualquer pessoa (protegido pela senha do admin no app) atualize as configurações.
-- Isso permite que o painel de admin salve as alterações no banco de dados.
CREATE POLICY "Allow admin update access to settings"
ON public.settings
FOR UPDATE
USING (true)
WITH CHECK (true);


-- ========= INSERIR DADOS INICIAIS =========

-- Insere a configuração inicial na tabela 'settings'.
-- O JSON abaixo contém todas as configurações padrão do aplicativo.
-- Copie o conteúdo de INITIAL_SETTINGS do arquivo src/context.tsx se precisar atualizar.
INSERT INTO public.settings (id, config)
VALUES (1, '{
  "landingPage": {
    "heroTitleHighlight": "Perca 15kg",
    "heroTitle": "em 90 Dias",
    "heroSubtitle": "Sem Dietas Restritivas",
    "heroDescription": "Descubra o método científico que já transformou mais de 10.000 mulheres.",
    "heroImage": "https://i.imgur.com/gWahM2y.png",
    "vslEnabled": false,
    "beforeAndAfter": []
  },
  "freeClassesSection": {
    "title": "3 Aulas Gratuitas Que Vão Mudar Sua Vida",
    "subtitle": "Acesse gratuitamente nosso conteúdo exclusivo e comece sua transformação hoje mesmo.",
    "classes": [
      {
        "title": "Aula 1: Metabolismo Acelerado",
        "description": "Aprenda a acelerar seu metabolismo natural e queimar gordura 24 horas por dia.",
        "features": ["Técnicas comprovadas cientificamente", "Queima de gordura otimizada"]
      },
      {
        "title": "Aula 2: Alimentação Estratégica",
        "description": "Descubra como comer mais e ainda assim perder peso com nossa estratégia nutricional.",
        "features": ["Sem contar calorias", "Receitas práticas"]
      },
      {
        "title": "Aula 3: Mindset Vencedor",
        "description": "Transforme sua mente para manter os resultados para sempre e eliminar a autosabotagem.",
        "features": ["Técnicas de motivação", "Hábitos duradouros"]
      }
    ]
  },
  "coach": {
    "name": "Davids Lima",
    "bio": "Há mais de 10 anos dedico minha vida a transformar corpos e vidas. Desenvolvi um método único e cientificamente comprovado que já ajudou mais de 5.000 mulheres a conquistarem o corpo dos seus sonhos.\\n\\nMinha missão é provar que toda mulher pode emagrecer de forma saudável e duradoura, sem dietas restritivas ou exercícios extremos.",
    "image": "https://i.imgur.com/sIqP9wQ.png",
    "certifications": [
      "Educação Física - CREF 123456-G/SP",
      "Especialização em Nutrição Esportiva",
      "Certificado em Treinamento Funcional",
      "Pós-graduação em Fisiologia do Exercício",
      "Especialista em Emagrecimento Feminino"
    ]
  },
  "lessons": [
    { "id": 1, "moduleId": "Módulo Gratuito", "title": "AULA 1: O Início da Transformação", "description": "Descubra os pilares para um emagrecimento definitivo e saudável.", "videoId": "dQw4w9WgXcQ", "thumbnail": "https://i.imgur.com/8m92n3T.png" },
    { "id": 2, "moduleId": "Módulo Gratuito", "title": "AULA 2: Treino Queima-Gordura", "description": "Um treino intenso e rápido para acelerar seu metabolismo ao máximo.", "videoId": "L_LUpnjgPso", "thumbnail": "https://i.imgur.com/gWahM2y.png" },
    { "id": 3, "moduleId": "Módulo Gratuito", "title": "AULA 3: Alimentação Inteligente", "description": "Aprenda a comer bem sem passar fome e continue perdendo peso.", "videoId": "3tmd-ClpJxA", "thumbnail": "https://i.imgur.com/k4Pk2A9.png" },
    { "id": 4, "moduleId": "Programa VIP", "title": "AVANÇADO: Ciclos de Carboidratos", "description": "Domine a técnica de ciclagem de carboidratos para resultados extremos.", "videoId": "GFQ3_h3sHCY", "thumbnail": "https://i.imgur.com/Xys41F7.png", "isVip": true },
    { "id": 5, "moduleId": "Programa VIP", "title": "AVANÇADO: Treinamento com Pesos", "description": "Construa massa muscular magra e defina seu corpo.", "videoId": "GFQ3_h3sHCY", "thumbnail": "https://i.imgur.com/L8aD5fG.png", "isVip": true },
    { "id": 6, "moduleId": "Programa VIP", "title": "MENTALIDADE: Foco Inabalável", "description": "Desenvolva uma mentalidade de campeã para nunca mais desistir.", "videoId": "GFQ3_h3sHCY", "thumbnail": "https://i.imgur.com/tYmCgA9.png", "isVip": true }
  ],
  "testimonials": [
    { "name": "Maria S., 34 anos", "text": "Eu não acreditava que seria possível, mas perdi 5kg no primeiro mês seguindo as aulas gratuitas! Mudou minha vida!", "image": "https://picsum.photos/seed/aluna1/100/100" },
    { "name": "Juliana P., 28 anos", "text": "O treino é rápido, intenso e cabe na minha rotina corrida. Finalmente algo que funciona pra mim. Recomendo demais!", "image": "https://picsum.photos/seed/aluna2/100/100", "videoId": "3tmd-ClpJxA" },
    { "name": "Carla M., 42 anos", "text": "Finalmente entendi como me alimentar direito sem passar fome. As dicas são de ouro!", "image": "https://picsum.photos/seed/aluna3/100/100" }
  ],
  "upsellPage": {
    "title": "SEU PRÓXIMO PASSO PARA A TRANSFORMAÇÃO COMPLETA!",
    "subtitle": "Você provou que é capaz. Agora, vamos acelerar seus resultados com minha consultoria premium.",
    "subtitleNoMedia": "Você provou que é capaz. Dê o próximo passo e acelere seus resultados com minha consultoria premium.",
    "features": [
      "Acesso vitalício a todas as aulas VIP",
      "Treinos novos toda semana",
      "Acompanhamento nutricional personalizado",
      "Grupo exclusivo de alunas no WhatsApp",
      "Suporte direto comigo para tirar dúvidas"
    ],
    "mediaType": "video",
    "videoUrl": "https://www.youtube.com/embed/GFQ3_h3sHCY",
    "imageUrl": "https://i.imgur.com/L8aD5fG.png",
    "fullPrice": "R$497,00",
    "promoPrice": "R$197,00",
    "ctaLink": "#"
  },
  "freeAccessDays": 7,
  "offerCountdownHours": 24
}');
```

5.  Depois de colar, clique no botão verde **"RUN"**.
6.  Pronto! Suas tabelas estão criadas e configuradas!

---

## Parte 2: Configurando as Chaves e Variáveis de Ambiente

Para que o aplicativo funcione, tanto localmente quanto online, ele precisa de acesso a algumas chaves secretas. Nós as gerenciamos com "Variáveis de Ambiente".

### Passo 1: Obter as Chaves Secretas

Você vai precisar de até 3 chaves principais:
1.  **Supabase URL:**
    *   No painel do seu projeto Supabase, vá em **Project Settings** (ícone de engrenagem) > **API**.
    *   Copie o valor do campo **Project URL**.
2.  **Supabase Anon (public) Key:**
    *   Na mesma página da API, na seção **Project API Keys**, copie o valor da chave `anon` `public`.
3.  **Google Gemini API Key (Opcional, para Feedback da IA):**
    *   Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Faça login com sua conta Google.
    *   Clique em **"Create API key in new project"**.
    *   Copie a chave gerada. Esta chave habilita a funcionalidade de feedback automático e personalizado para as alunas após a avaliação inicial. Se você não configurar esta chave, o sistema usará uma mensagem padrão.

**Guarde essas chaves em um local seguro.**

### Passo 2: Configurar para Desenvolvimento Local

Para rodar o aplicativo no seu computador, você precisa criar um arquivo para guardar essas chaves.

1.  Na pasta principal do seu projeto, crie um novo arquivo chamado `.env`.
2.  Abra este arquivo e cole o conteúdo abaixo, substituindo os valores pelos que você copiou no Passo 1.

```
# .env

# Supabase credentials (Obrigatório)
VITE_SUPABASE_URL="COLE_AQUI_SUA_URL_DO_SUPABASE"
VITE_SUPABASE_KEY="COLE_AQUI_SUA_CHAVE_ANON_DO_SUPABASE"

# Google Gemini API Key (Opcional, para o feedback da IA)
# O sistema usará esta chave para gerar análises personalizadas.
# Se esta variável não for definida, uma mensagem padrão será usada.
VITE_AI_FEEDBACK_API_KEY="COLE_AQUI_SUA_CHAVE_DA_API_DO_GEMINI"
```
3.  Salve o arquivo. **Importante:** Este arquivo `.env` nunca deve ser enviado para o GitHub. Ele é apenas para o seu uso local.

---

## Parte 3: Publicando o Aplicativo na Vercel

### Passo 1: Colocar seu código no GitHub
A Vercel precisa encontrar seu código em um repositório do GitHub.

1.  Crie uma conta em [github.com](https://github.com), se ainda não tiver.
2.  Crie um **"new repository"** (novo repositório). Dê a ele o nome que quiser.
3.  Faça o upload de todos os arquivos do seu projeto para este repositório. A maneira mais fácil para iniciantes é usar o [GitHub Desktop](https://desktop.github.com/).

### Passo 2: Publicar na Vercel e Configurar as Chaves
1.  Acesse [vercel.com](https://vercel.com) e crie sua conta usando o **GitHub**.
2.  No painel da Vercel, clique em **"Add New..." -> "Project"**.
3.  A Vercel vai mostrar seus repositórios do GitHub. **Selecione o repositório do seu aplicativo** que você criou no Passo 1 e clique em **"Import"**.
4.  A Vercel vai detectar que é um projeto Vite e configurar tudo automaticamente. Antes de publicar, precisamos adicionar as chaves secretas.
5.  Encontre e expanda a seção **"Environment Variables"** (Variáveis de Ambiente).
6.  Adicione as 3 variáveis, uma de cada vez, usando as chaves que você obteve na Parte 2:
    *   **Variável 1:**
        *   **NAME:** `VITE_SUPABASE_URL`
        *   **VALUE:** Cole aqui a sua **URL do Supabase**.
    *   **Variável 2:**
        *   **NAME:** `VITE_SUPABASE_KEY`
        *   **VALUE:** Cole aqui a sua **chave anon do Supabase**.
    *   **Variável 3 (Opcional):**
        *   **NAME:** `VITE_AI_FEEDBACK_API_KEY`
        *   **VALUE:** Cole aqui a sua **chave da API do Gemini**.
7.  Após adicionar as três, clique no botão azul **"Deploy"**.
8.  Aguarde alguns minutos. A Vercel vai instalar tudo e publicar seu site.

### Passo 3: Seu aplicativo está no ar!
Quando o processo terminar, a Vercel vai te dar um link (ex: `meuappfitness.vercel.app`).

**É isso! Seu aplicativo está online, conectado ao banco de dados e pronto para receber alunas!** Qualquer alteração que você fizer no código e enviar para o GitHub será automaticamente atualizada no site pela Vercel.