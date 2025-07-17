interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_AI_FEEDBACK_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}