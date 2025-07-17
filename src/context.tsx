import React, { createContext, useReducer, useEffect, useCallback, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AppState, Action, Lesson, AdminSettings, Testimonial, AppContextType, Coach, User, FreeClassInfo, AssessmentData } from './types.ts';
import { merge } from 'lodash-es';

// ========= SUPABASE SETUP =========
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const areCredentialsMissing = !supabaseUrl || !supabaseKey;
const effectiveSupabaseUrl = areCredentialsMissing ? 'http://localhost:8000' : supabaseUrl;
const effectiveSupabaseKey = areCredentialsMissing ? 'dummy-key-for-local-dev' : supabaseKey;

if (areCredentialsMissing) {
  console.warn(`****************************************************************
ATENÇÃO: As credenciais do Supabase não foram configuradas.
Consulte o arquivo bancodedados.md para mais detalhes.
O aplicativo não funcionará corretamente sem elas.
****************************************************************`);
}
export const supabase = createClient(effectiveSupabaseUrl, effectiveSupabaseKey);

// ========= CONSTANTS & DEFAULTS =========
const DEFAULT_LESSONS: Lesson[] = [
  { id: 1, moduleId: 'Módulo Gratuito', title: 'AULA 1: O Início da Transformação', description: 'Descubra os pilares para um emagrecimento definitivo e saudável.', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://i.imgur.com/8m92n3T.png' },
  { id: 2, moduleId: 'Módulo Gratuito', title: 'AULA 2: Treino Queima-Gordura', description: 'Um treino intenso e rápido para acelerar seu metabolismo ao máximo.', videoId: 'L_LUpnjgPso', thumbnail: 'https://i.imgur.com/gWahM2y.png' },
  { id: 3, moduleId: 'Módulo Gratuito', title: 'AULA 3: Alimentação Inteligente', description: 'Aprenda a comer bem sem passar fome e continue perdendo peso.', videoId: '3tmd-ClpJxA', thumbnail: 'https://i.imgur.com/k4Pk2A9.png' },
  { id: 4, moduleId: 'Programa VIP', title: 'AVANÇADO: Ciclos de Carboidratos', description: 'Domine a técnica de ciclagem de carboidratos para resultados extremos.', videoId: 'GFQ3_h3sHCY', thumbnail: 'https://i.imgur.com/Xys41F7.png', isVip: true },
  { id: 5, moduleId: 'Programa VIP', title: 'AVANÇADO: Treinamento com Pesos', description: 'Construa massa muscular magra e defina seu corpo.', videoId: 'GFQ3_h3sHCY', thumbnail: 'https://i.imgur.com/L8aD5fG.png', isVip: true },
  { id: 6, moduleId: 'Programa VIP', title: 'MENTALIDADE: Foco Inabalável', description: 'Desenvolva uma mentalidade de campeã para nunca mais desistir.', videoId: 'GFQ3_h3sHCY', thumbnail: 'https://i.imgur.com/tYmCgA9.png', isVip: true },
];
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: 'Maria S., 34 anos', text: 'Eu não acreditava que seria possível, mas perdi 5kg no primeiro mês seguindo as aulas gratuitas! Mudou minha vida!', image: 'https://picsum.photos/seed/aluna1/100/100' },
  { name: 'Juliana P., 28 anos', text: 'O treino é rápido, intenso e cabe na minha rotina corrida. Finalmente algo que funciona pra mim. Recomendo demais!', image: 'https://picsum.photos/seed/aluna2/100/100', videoId: '3tmd-ClpJxA' },
  { name: 'Carla M., 42 anos', text: 'Finalmente entendi como me alimentar direito sem passar fome. As dicas são de ouro!', image: 'https://picsum.photos/seed/aluna3/100/100' }
];
const DEFAULT_COACH: Coach = {
    name: 'Davids Lima', bio: 'Há mais de 10 anos dedico minha vida a transformar corpos e vidas...', image: 'https://i.imgur.com/sIqP9wQ.png',
    certifications: [ "Educação Física", "Especialização em Nutrição Esportiva", "Certificado em Treinamento Funcional" ]
};
const DEFAULT_FREE_CLASSES: FreeClassInfo[] = [
    { title: "Aula 1: Metabolismo Acelerado", description: "Aprenda a acelerar seu metabolismo.", features: ["Técnicas comprovadas", "Queima de gordura otimizada"] },
    { title: "Aula 2: Alimentação Estratégica", description: "Descubra como comer mais e perder peso.", features: ["Sem contar calorias", "Receitas práticas"] },
    { title: "Aula 3: Mindset Vencedor", description: "Transforme sua mente para resultados duradouros.", features: ["Técnicas de motivação", "Hábitos duradouros"] },
];
const INITIAL_SETTINGS: AdminSettings = {
  landingPage: { heroTitleHighlight: 'Perca 15kg', heroTitle: 'em 90 Dias', heroSubtitle: 'Sem Dietas Restritivas', heroDescription: 'Descubra o método científico...', heroImage: 'https://i.imgur.com/gWahM2y.png', vslEnabled: false, beforeAndAfter: [] },
  freeClassesSection: { title: '3 Aulas Gratuitas Que Vão Mudar Sua Vida', subtitle: 'Acesse nosso conteúdo exclusivo e comece sua transformação.', classes: DEFAULT_FREE_CLASSES },
  dashboard: { promoLinkText: 'Garanta com desconto consultoria VIP', promoLinkUrl: '/upsell' },
  coach: DEFAULT_COACH,
  lessons: DEFAULT_LESSONS,
  testimonials: DEFAULT_TESTIMONIALS,
  upsellPage: { title: 'SEU PRÓXIMO PASSO PARA A TRANSFORMAÇÃO COMPLETA!', subtitle: 'Você provou que é capaz. Agora, vamos acelerar seus resultados com minha consultoria premium.', subtitleNoMedia: 'Você provou que é capaz...', features: [ "Acesso vitalício", "Treinos novos", "Acompanhamento nutricional", "Grupo exclusivo", "Suporte direto" ], mediaType: 'video', videoUrl: 'https://www.youtube.com/embed/GFQ3_h3sHCY', imageUrl: 'https://i.imgur.com/sIqP9wQ.png', fullPrice: 'R$497,00', promoPrice: 'R$197,00', ctaLink: '#', installmentsEnabled: true, installmentsNumber: 12, installmentsPrice: 'R$ 19,70' },
  freeAccessDays: 7, offerCountdownHours: 24,
};

// ========= STATE MANAGEMENT (Context & Reducer) =========
export const AppContext = createContext<AppContextType | undefined>(undefined);
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    case 'ADD_USER': return state.users.some(u => u.email === action.payload.email) ? state : {...state, users: [...state.users, action.payload]};
    case 'UPDATE_ASSESSMENT':
      if (!state.user) return state;
      const updatedUserWithAssessment = { ...state.user, assessment: action.payload };
      return { ...state, user: updatedUserWithAssessment, users: state.users.map(u => u.email === updatedUserWithAssessment.email ? updatedUserWithAssessment : u) };
    case 'COMPLETE_LESSON':
      if (!state.user || state.user.progress.includes(action.payload)) return state;
      const updatedUserWithProgress = { ...state.user, progress: [...state.user.progress, action.payload] };
      return { ...state, user: updatedUserWithProgress, users: state.users.map(u => u.email === updatedUserWithProgress.email ? updatedUserWithProgress : u) };
    case 'UPDATE_SETTINGS': return { ...state, settings: action.payload };
    case 'SET_SYNC_STATUS': return { ...state, syncStatus: action.payload };
    case 'SET_STATE': return {...action.payload, syncStatus: state.syncStatus || 'idle' };
    default: return state;
  }
};

const MissingCredentialsWarning = () => (
    <div className="h-screen w-full flex items-center justify-center bg-dark-900 text-white p-8">
        <div className="max-w-2xl text-center bg-dark-800 p-8 rounded-lg border border-red-500 shadow-lg">
            <h1 className="text-3xl font-heading text-red-400 mb-4">Configuração Incompleta</h1>
            <p className="text-lg text-gray-300 mb-6">As credenciais do Supabase não foram configuradas.</p>
            <p className="text-gray-400">Siga as instruções no arquivo <code className="bg-dark-700 text-brand-light px-2 py-1 rounded">bancodedados.md</code>.</p>
        </div>
    </div>
);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null, users: [], settings: INITIAL_SETTINGS, appStatus: 'loading', syncStatus: 'idle',
  });

  useEffect(() => {
    const loadInitialData = async () => {
      let loadedSettings = INITIAL_SETTINGS;
      try {
        // Busca as configurações do Supabase como fonte primária.
        const { data: settingsData, error: settingsError } = await supabase.from('settings').select('config').eq('id', 1).single();
        if (settingsError) console.error("Erro ao buscar configs do Supabase, usando padrão:", settingsError.message);
        
        if (settingsData?.config) {
            // Usa lodash.merge para fazer um deep merge, garantindo que novas chaves no código sejam adicionadas.
            loadedSettings = merge({}, INITIAL_SETTINGS, settingsData.config);
        } else {
            // Se não encontrar no Supabase, tenta o localStorage como fallback.
            const storedSettingsJSON = localStorage.getItem('gratuitinho_settings');
            if (storedSettingsJSON) {
                loadedSettings = merge({}, INITIAL_SETTINGS, JSON.parse(storedSettingsJSON));
            }
        }
      } catch (error) {
        console.error("Falha ao carregar configurações:", error);
      }
      
      try {
        const { data: usersFromSupabase, error } = await supabase.from('users').select('*');
        if (error) throw new Error(`Supabase fetch error: ${error.message}`);

        const users: User[] = (usersFromSupabase || []).map((dbUser: any) => {
            const assessment = dbUser.assessment_age != null ? {
              age: dbUser.assessment_age, height: dbUser.assessment_height, weight: dbUser.assessment_weight,
              activityLevel: dbUser.assessment_activity_level, goal: dbUser.assessment_goal,
              sleepQuality: dbUser.assessment_sleep_quality, foodQuality: dbUser.assessment_food_quality,
              trainingLocation: dbUser.assessment_training_location, imc: dbUser.assessment_imc,
              idealWeight: dbUser.assessment_ideal_weight,
            } : null;
            return {
              name: dbUser.name, email: dbUser.email, whatsapp: dbUser.whatsapp,
              registrationDate: dbUser.registrationDate, progress: dbUser.progress || [],
              assessment: assessment as AssessmentData | null,
            };
        });
        
        const storedUserEmail = localStorage.getItem('gratuitinho_user_email');
        const currentUser = storedUserEmail ? (users.find(u => u.email === storedUserEmail) || null) : null;

        dispatch({ type: 'SET_STATE', payload: { user: currentUser, users: users, settings: loadedSettings, appStatus: 'ready', syncStatus: 'idle' } });
      } catch (error) {
        console.error("Falha ao carregar usuários do Supabase", error);
        dispatch({ type: 'SET_STATE', payload: { ...state, settings: loadedSettings, users: [], user: null, appStatus: 'ready' } });
      }
    };

    if (!areCredentialsMissing) {
      loadInitialData();
    } else {
      dispatch({ type: 'SET_STATE', payload: { ...state, appStatus: 'ready' } });
    }
  }, []);

  const userJson = JSON.stringify(state.user);
  useEffect(() => {
    if (areCredentialsMissing || state.appStatus !== 'ready' || !state.user) {
      if (!state.user) localStorage.removeItem('gratuitinho_user_email');
      return;
    }
    
    const user = state.user;
    localStorage.setItem('gratuitinho_user_email', user.email);
       
    const syncUser = async () => {
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });
        const userPayload = {
            name: user.name, email: user.email, whatsapp: user.whatsapp,
            registrationDate: user.registrationDate, progress: user.progress,
            assessment_age: user.assessment?.age ?? null, assessment_height: user.assessment?.height ?? null,
            assessment_weight: user.assessment?.weight ?? null, assessment_activity_level: user.assessment?.activityLevel ?? null,
            assessment_goal: user.assessment?.goal ?? null, assessment_sleep_quality: user.assessment?.sleepQuality ?? null,
            assessment_food_quality: user.assessment?.foodQuality ?? null, assessment_training_location: user.assessment?.trainingLocation ?? null,
            assessment_imc: user.assessment?.imc ?? null, assessment_ideal_weight: user.assessment?.idealWeight ?? null,
        };
        const { error } = await supabase.from('users').upsert([userPayload] as any, { onConflict: 'email' });
        if (error) {
            console.error('Erro ao salvar dados do usuário no Supabase:', error);
            dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
        } else {
            dispatch({ type: 'SET_SYNC_STATUS', payload: 'success' });
            setTimeout(() => dispatch({ type: 'SET_SYNC_STATUS', payload: 'idle' }), 2000);
        }
    };
    syncUser();
  }, [userJson, state.appStatus]);
  
  const logout = useCallback(() => {
    dispatch({type: 'SET_USER', payload: null});
    localStorage.removeItem('gratuitinho_user_email');
  }, []);

  const saveSettings = useCallback(async (newSettings: AdminSettings) => {
    if(areCredentialsMissing) {
        // Salva apenas localmente se as credenciais não estiverem configuradas
        console.warn("Credenciais do Supabase ausentes. Salvando configurações apenas localmente.");
        dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
        localStorage.setItem('gratuitinho_settings', JSON.stringify(newSettings));
        return;
    }

    dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });
    try {
      dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
      localStorage.setItem('gratuitinho_settings', JSON.stringify(newSettings));
      
      const { error } = await supabase
        .from('settings')
        .update({ config: newSettings, updated_at: new Date().toISOString() } as any)
        .eq('id', 1);

      if (error) throw error;

      dispatch({ type: 'SET_SYNC_STATUS', payload: 'success' });
      setTimeout(() => dispatch({ type: 'SET_SYNC_STATUS', payload: 'idle' }), 2000);
    } catch (error) {
      console.error('Erro ao salvar configurações no Supabase:', error);
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
      throw error; // Propaga o erro para o componente que chamou
    }
  }, []);

  if (areCredentialsMissing && state.appStatus === 'ready') {
      return <MissingCredentialsWarning />;
  }

  return (
    <AppContext.Provider value={{ state, dispatch, logout, saveSettings }}>
      {state.appStatus === 'loading' ? <div className="h-screen w-full flex items-center justify-center bg-dark-900"><div className="text-brand text-xl">Carregando...</div></div> : children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};
