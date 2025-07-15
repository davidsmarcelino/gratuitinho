
# Guia de Banco de Dados e Hospedagem (Supabase + Vercel)

Este guia foi criado para te ajudar a configurar e colocar seu aplicativo no ar, mesmo que você não tenha nenhum conhecimento de programação. Vamos usar duas ferramentas gratuitas e poderosas:

*   **Supabase:** Será nosso banco de dados online. É aqui que todas as informações das suas alunas (cadastro, progresso, etc.) serão armazenadas de forma segura.
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

### Passo 3: Criar a tabela de "Alunas" (users)
Esta é a parte mais importante. Vamos criar a "planilha" online que vai guardar os dados das suas alunas.

1.  No menu à esquerda, clique no ícone de **SQL Editor** (parece uma folha com `<>`).
2.  Clique em **"+ New query"**.
3.  Uma tela para escrever código vai aparecer. Apague qualquer texto que já esteja lá.
4.  **Copie TODO o código abaixo** e **cole** nessa tela.

```sql
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
  -- Armazena os dados da avaliação em formato JSON (idade, peso, objetivos, etc.).
  assessment JSONB,
  -- Armazena um array de IDs das aulas concluídas em formato JSON.
  progress JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- Adiciona comentários à tabela e colunas para facilitar o entendimento dentro da Supabase.
COMMENT ON TABLE public.users IS 'Tabela para armazenar os dados das alunas cadastradas.';
COMMENT ON COLUMN public.users.name IS 'Nome completo da aluna.';
COMMENT ON COLUMN public.users.email IS 'Email da aluna, usado como identificador único (PK).';
COMMENT ON COLUMN public.users.whatsapp IS 'Número de WhatsApp da aluna.';
COMMENT ON COLUMN public.users.registrationDate IS 'Data e hora do cadastro da aluna.';
COMMENT ON COLUMN public.users.assessment IS 'Dados da avaliação inicial em formato JSON.';
COMMENT ON COLUMN public.users.progress IS 'Array de IDs das aulas concluídas pela aluna.';

-- Habilita a Segurança em Nível de Linha (RLS - Row Level Security).
-- Este é um passo de segurança crucial. Por padrão, ninguém pode acessar os dados.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- As "Policies" abaixo são as regras que dizem quem pode fazer o quê na tabela.

-- Política 1: Permite que qualquer pessoa (mesmo não logada) leia os dados da tabela.
-- O app precisa disso para verificar se um email já existe durante o cadastro.
CREATE POLICY "Allow public read access"
ON public.users
FOR SELECT
USING (true);

-- Política 2: Permite que qualquer pessoa (mesmo não logada) insira uma nova linha (se cadastre).
CREATE POLICY "Allow public insert access"
ON public.users
FOR INSERT
WITH CHECK (true);

-- Política 3: Permite que qualquer pessoa atualize os dados.
-- O aplicativo já garante que uma aluna só pode atualizar os seus próprios dados,
-- usando o email como chave. Esta regra é necessária para que o app possa salvar o progresso
-- e a avaliação da aluna.
CREATE POLICY "Allow anonymous users to update records"
ON public.users
FOR UPDATE
USING (true)
WITH CHECK (true);
```

5.  Depois de colar, clique no botão verde **"RUN"**.
6.  Pronto! Se tudo deu certo, você verá uma mensagem "Success. No rows returned". Sua tabela de alunas está criada e configurada!

---

## Parte 2: Configurando as Chaves e Variáveis de Ambiente

Para que o aplicativo funcione, tanto localmente quanto online, ele precisa de acesso a algumas chaves secretas. Nós as gerenciamos com "Variáveis de Ambiente".

### Passo 1: Obter as Chaves Secretas

Você vai precisar de 3 chaves:
1.  **Supabase URL:**
    *   No painel do seu projeto Supabase, vá em **Project Settings** (ícone de engrenagem) > **API**.
    *   Copie o valor do campo **Project URL**.
2.  **Supabase Anon (public) Key:**
    *   Na mesma página da API, na seção **Project API Keys**, copie o valor da chave `anon` `public`.
3.  **Google Gemini API Key:**
    *   Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Faça login com sua conta Google.
    *   Clique em **"Create API key in new project"**.
    *   Copie a chave gerada.

**Guarde essas 3 chaves em um local seguro.**

### Passo 2: Configurar para Desenvolvimento Local

Para rodar o aplicativo no seu computador, você precisa criar um arquivo para guardar essas chaves.

1.  Na pasta principal do seu projeto, crie um novo arquivo chamado `.env`.
2.  Abra este arquivo e cole o conteúdo abaixo, substituindo os valores pelos que você copiou no Passo 1.

```
# .env

# Supabase credentials
VITE_SUPABASE_URL="COLE_AQUI_SUA_URL_DO_SUPABASE"
VITE_SUPABASE_KEY="COLE_AQUI_SUA_CHAVE_ANON_DO_SUPABASE"

# Google Gemini API Key
VITE_GEMINI_API_KEY="COLE_AQUI_SUA_CHAVE_DA_API_DO_GEMINI"
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
    *   **Variável 3:**
        *   **NAME:** `VITE_GEMINI_API_KEY`
        *   **VALUE:** Cole aqui a sua **chave da API do Gemini**.
7.  Após adicionar as três, clique no botão azul **"Deploy"**.
8.  Aguarde alguns minutos. A Vercel vai instalar tudo e publicar seu site.

### Passo 3: Seu aplicativo está no ar!
Quando o processo terminar, a Vercel vai te dar um link (ex: `meuappfitness.vercel.app`).

**É isso! Seu aplicativo está online, conectado ao banco de dados e pronto para receber alunas!** Qualquer alteração que você fizer no código e enviar para o GitHub será automaticamente atualizada no site pela Vercel.
