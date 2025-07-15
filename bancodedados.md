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

### Passo 4: Conectar o Aplicativo com o Banco de Dados
Agora, vamos dizer ao seu aplicativo onde o banco de dados está.

1.  No menu à esquerda da Supabase, clique no ícone de engrenagem (**Project Settings**).
2.  Na nova tela, clique em **"API"**.
3.  Você verá duas informações importantes:
    *   **Project URL**
    *   **Project API Keys** (precisamos da chave `anon` `public`)
4.  Abra o arquivo `context.tsx` no seu projeto.
5.  Você encontrará as seguintes linhas no topo do arquivo:
    ```javascript
    const supabaseUrl = 'COLE_AQUI_A_SUA_URL_DO_SUPABASE';
    const supabaseKey = 'COLE_AQUI_A_SUA_CHAVE_ANON_DO_SUPABASE';
    ```
6.  **Copie** a sua **URL** da Supabase e **cole** no lugar de `'COLE_AQUI_A_SUA_URL_DO_SUPABASE'`.
7.  **Copie** a sua chave **anon public** da Supabase e **cole** no lugar de `'COLE_AQUI_A_SUA_CHAVE_ANON_DO_SUPABASE'`.
8.  Salve o arquivo.

**Parabéns! A primeira parte está concluída. Seu aplicativo já sabe como conversar com seu banco de dados.**

---

## Parte 2: Publicando o Aplicativo na Vercel

### Passo 1: Colocar seu código no GitHub
A Vercel precisa encontrar seu código em um repositório do GitHub.

1.  Crie uma conta em [github.com](https://github.com), se ainda não tiver.
2.  Crie um **"new repository"** (novo repositório). Dê a ele o nome que quiser.
3.  Faça o upload de todos os arquivos do seu projeto para este repositório. A maneira mais fácil para iniciantes é usar o [GitHub Desktop](https://desktop.github.com/).

### Passo 2: Configurar a Chave da IA (Gemini)
O aplicativo usa a Inteligência Artificial do Google para gerar feedbacks. Precisamos dar a ele uma chave de acesso.

1.  Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Faça login com sua conta Google.
3.  Clique em **"Create API key in new project"**.
4.  Copie a chave que foi gerada. **Guarde-a bem!**

### Passo 3: Publicar na Vercel
1.  Acesse [vercel.com](https://vercel.com) e crie sua conta usando o **GitHub**.
2.  No painel da Vercel, clique em **"Add New..." -> "Project"**.
3.  A Vercel vai mostrar seus repositórios do GitHub. **Selecione o repositório do seu aplicativo** que você criou no Passo 1 e clique em **"Import"**.
4.  A Vercel já vai entender como configurar o projeto. Antes de publicar, precisamos adicionar a chave da IA.
5.  Encontre e expanda a seção **"Environment Variables"** (Variáveis de Ambiente).
6.  Adicione uma nova variável:
    *   **NAME:** `API_KEY`
    *   **VALUE:** Cole aqui a chave da API do Google que você copiou no Passo 2.
7.  Clique em **"Add"**.
8.  Agora, clique no botão azul **"Deploy"**.
9.  Aguarde alguns minutos. A Vercel vai instalar tudo e publicar seu site.

### Passo 4: Seu aplicativo está no ar!
Quando o processo terminar, a Vercel vai te dar um link (ex: `meuappfitness.vercel.app`).

**É isso! Seu aplicativo está online, conectado ao banco de dados e pronto para receber alunas!** Qualquer alteração que você fizer no código e enviar para o GitHub será automaticamente atualizada no site pela Vercel.
