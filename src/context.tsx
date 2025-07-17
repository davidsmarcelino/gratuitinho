
import React, { createContext, useReducer, useEffect, useCallback, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AppState, Action, Lesson, AdminSettings, Testimonial, AppContextType, Coach, User, FreeClassInfo, AssessmentData } from './types.ts';

// ========= SUPABASE SETUP =========
// Credentials are now loaded from environment variables for security.
// See .env.example and bancodedados.md for setup instructions.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const areCredentialsMissing = !supabaseUrl || !supabaseKey;

const effectiveSupabaseUrl = areCredentialsMissing ? 'http://localhost:8000' : supabaseUrl;
const effectiveSupabaseKey = areCredentialsMissing ? 'dummy-key-for-local-dev' : supabaseKey;


if (areCredentialsMissing) {
  console.warn(`****************************************************************
ATENÇÃO: As credenciais do Supabase não foram configuradas.
Crie um arquivo .env na raiz do projeto e adicione VITE_SUPABASE_URL e VITE_SUPABASE_KEY.
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
  {
    name: 'Maria S., 34 anos',
    text: 'Eu não acreditava que seria possível, mas perdi 5kg no primeiro mês seguindo as aulas gratuitas! Mudou minha vida!',
    image: 'https://picsum.photos/seed/aluna1/100/100',
  },
  {
    name: 'Juliana P., 28 anos',
    text: 'O treino é rápido, intenso e cabe na minha rotina corrida. Finalmente algo que funciona pra mim. Recomendo demais!',
    image: 'https://picsum.photos/seed/aluna2/100/100',
    videoId: '3tmd-ClpJxA'
  },
  {
    name: 'Carla M., 42 anos',
    text: 'Finalmente entendi como me alimentar direito sem passar fome. As dicas são de ouro!',
    image: 'https://picsum.photos/seed/aluna3/100/100',
  }
];

const DEFAULT_COACH: Coach = {
    name: 'Davids Lima',
    bio: 'Há mais de 10 anos dedico minha vida a transformar corpos e vidas. Desenvolvi um método único e cientificamente comprovado que já ajudou mais de 5.000 mulheres a conquistarem o corpo dos seus sonhos.\n\nMinha missão é provar que toda mulher pode emagrecer de forma saudável e duradoura, sem dietas restritivas ou exercícios extremos.',
    image: 'https://i.imgur.com/sIqP9wQ.png',
    certifications: [
        "Educação Física - CREF 123456-G/SP",
        "Especialização em Nutrição Esportiva",
        "Certificado em Treinamento Funcional",
        "Pós-graduação em Fisiologia do Exercício",
        "Especialista em Emagrecimento Feminino"
    ]
};

const DEFAULT_FREE_CLASSES: FreeClassInfo[] = [
    { 
        title: "Aula 1: Metabolismo Acelerado", 
        description: "Aprenda a acelerar seu metabolismo natural e queimar gordura 24 horas por dia.",
        features: ["Técnicas comprovadas cientificamente", "Queima de gordura otimizada"]
    },
    { 
        title: "Aula 2: Alimentação Estratégica", 
        description: "Descubra como comer mais e ainda assim perder peso com nossa estratégia nutricional.",
        features: ["Sem contar calorias", "Receitas práticas"]
    },
    { 
        title: "Aula 3: Mindset Vencedor", 
        description: "Transforme sua mente para manter os resultados para sempre e eliminar a autosabotagem.",
        features: ["Técnicas de motivação", "Hábitos duradouros"]
    },
];

const INITIAL_SETTINGS: AdminSettings = {
  landingPage: {
    heroTitleHighlight: 'Perca 15kg',
    heroTitle: 'em 90 Dias',
    heroSubtitle: 'Sem Dietas Restritivas',
    heroDescription: 'Descubra o método científico que já transformou mais de 10.000 mulheres.',
    heroImage: 'https://i.imgur.com/gWahM2y.png',
    vslEnabled: false,
    beforeAndAfter: [],
  },
  freeClassesSection: {
    title: '3 Aulas Gratuitas Que Vão Mudar Sua Vida',
    subtitle: 'Acesse gratuitamente nosso conteúdo exclusivo e comece sua transformação hoje mesmo.',
    classes: DEFAULT_FREE_CLASSES,
  },
  dashboard: {
    promoLinkText: 'Garanta com desconto consultoria VIP',
    promoLinkUrl: '/upsell'
  },
  coach: DEFAULT_COACH,
  lessons: DEFAULT_LESSONS,
  testimonials: DEFAULT_TESTIMONIALS,
  upsellPage: {
    title: 'SEU PRÓXIMO PASSO PARA A TRANSFORMAÇÃO COMPLETA!',
    subtitle: 'Você provou que é capaz. Agora, vamos acelerar seus resultados com minha consultoria premium.',
    subtitleNoMedia: 'Você provou que é capaz. Agora, vamos acelerar seus resultados com minha consultoria premium.',
    features: [
        "Acesso vitalício a todas as aulas VIP",
        "Treinos novos toda semana",
        "Acompanhamento nutricional personalizado",
        "Grupo exclusivo de alunas no WhatsApp",
        "Suporte direto comigo para tirar dúvidas"
    ],
    mediaType: 'video',
    videoUrl: 'https://www.youtube.com/embed/GFQ3_h3sHCY',
    imageUrl: 'https://i.imgur.com/sIqP9wQ.png',
    fullPrice: 'R$497,00',
    promoPrice: 'R$197,00',
    ctaLink: '#',
    installmentsEnabled: true,
    installmentsNumber: 12,
    installmentsPrice: 'R$ 19,70',
  },
  freeAccessDays: 7,
  offerCountdownHours: 24,
};


// ========= STATE MANAGEMENT (Context & Reducer) =========
export const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_USER':
      // Prevent adding duplicates to the local state
      if (state.users.some(u => u.email === action.payload.email)) {
        return state;
      }
      return {...state, users: [...state.users, action.payload]};
    case 'UPDATE_ASSESSMENT':
      if (!state.user) return state;
      const updatedUserWithAssessment = { ...state.user, assessment: action.payload };
      return {
        ...state,
        user: updatedUserWithAssessment,
        users: state.users.map(u => u.email === updatedUserWithAssessment.email ? updatedUserWithAssessment : u),
      };
    case 'COMPLETE_LESSON':
      if (!state.user || state.user.progress.includes(action.payload)) return state;
      const updatedUserWithProgress = { ...state.user, progress: [...state.user.progress, action.payload] };
      return {
          ...state,
          user: updatedUserWithProgress,
          users: state.users.map(u => u.email === updatedUserWithProgress.email ? updatedUserWithProgress : u),
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload };
    case 'SET_STATE':
        return {...action.payload, syncStatus: state.syncStatus || 'idle' };
    default:
      return state;
  }
};

const MissingCredentialsWarning = () => (
    <div className="h-screen w-full flex items-center justify-center bg-dark-900 text-white p-8">
        <div className="max-w-2xl text-center bg-dark-800 p-8 rounded-lg border border-red-500 shadow-lg">
            <h1 className="text-3xl font-heading text-red-400 mb-4">Configuração Incompleta</h1>
            <p className="text-lg text-gray-300 mb-6">
                As credenciais do Supabase (seu banco de dados) não foram configuradas. O aplicativo não pode funcionar sem elas.
            </p>
            <p className="text-gray-400">
                Por favor, siga as instruções no arquivo <code className="bg-dark-700 text-brand-light px-2 py-1 rounded">bancodedados.md</code> para criar seu banco de dados e configurar as variáveis de ambiente.
            </p>
        </div>
    </div>
);


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    users: [],
    settings: INITIAL_SETTINGS,
    appStatus: 'loading',
    syncStatus: 'idle',
  });

  // Effect to load initial settings and user data
  useEffect(() => {
    const loadInitialData = async () => {
      let loadedSettings = INITIAL_SETTINGS;
      try {
        const storedSettingsJSON = localStorage.getItem('gratuitinho_settings');
        if (storedSettingsJSON) {
          const storedSettings = JSON.parse(storedSettingsJSON);
          loadedSettings = {
            ...INITIAL_SETTINGS,
            ...storedSettings,
            landingPage: { ...INITIAL_SETTINGS.landingPage, ...(storedSettings.landingPage || {}) },
            freeClassesSection: { ...INITIAL_SETTINGS.freeClassesSection, ...(storedSettings.freeClassesSection || {}) },
            dashboard: { ...INITIAL_SETTINGS.dashboard, ...(storedSettings.dashboard || {}) },
            coach: { ...INITIAL_SETTINGS.coach, ...(storedSettings.coach || {}) },
            upsellPage: { ...INITIAL_SETTINGS.upsellPage, ...(storedSettings.upsellPage || {}) },
            lessons: storedSettings.lessons || INITIAL_SETTINGS.lessons,
            testimonials: storedSettings.testimonials || INITIAL_SETTINGS.testimonials,
          };
        }
      } catch (error) {
        console.error("Failed to load settings from localStorage", error);
      }
      
      try {
        const { data: usersFromSupabase, error } = await supabase.from('users').select('*');
        if (error) {
            throw new Error(`Supabase fetch error: ${error.message}`);
        }

        const users: User[] = (usersFromSupabase || []).map((dbUser: any) => {
            const assessment = dbUser.assessment_age != null ? {
              age: dbUser.assessment_age,
              height: dbUser.assessment_height,
              weight: dbUser.assessment_weight,
              activityLevel: dbUser.assessment_activity_level,
              goal: dbUser.assessment_goal,
              sleepQuality: dbUser.assessment_sleep_quality,
              foodQuality: dbUser.assessment_food_quality,
              trainingLocation: dbUser.assessment_training_location,
              imc: dbUser.assessment_imc,
              idealWeight: dbUser.assessment_ideal_weight,
            } : null;

            return {
              name: dbUser.name,
              email: dbUser.email,
              whatsapp: dbUser.whatsapp,
              registrationDate: dbUser.registrationDate,
              progress: dbUser.progress || [],
              assessment: assessment as AssessmentData | null,
            };
        });
        
        // Load logged-in user from local storage for a persistent session.
        // This ensures the user stays logged in even after closing the browser.
        const storedUserEmail = localStorage.getItem('gratuitinho_user_email');
        const currentUser = storedUserEmail ? (users.find(u => u.email === storedUserEmail) || null) : null;

        dispatch({ type: 'SET_STATE', payload: { user: currentUser, users: users, settings: loadedSettings, appStatus: 'ready', syncStatus: 'idle' } });
      } catch (error) {
        console.error("Failed to load users from Supabase", error);
        dispatch({ type: 'SET_STATE', payload: { ...state, settings: loadedSettings, users: [], user: null, appStatus: 'ready' } });
      }
    };

    if (!areCredentialsMissing) {
      loadInitialData();
    } else {
      dispatch({ type: 'SET_STATE', payload: { ...state, appStatus: 'ready' } });
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to save settings to localStorage
  useEffect(() => {
    if (state.appStatus === 'ready') {
      localStorage.setItem('gratuitinho_settings', JSON.stringify(state.settings));
    }
  }, [state.settings, state.appStatus]);

  // Effect to save updated user to Supabase and local storage
  const userJson = JSON.stringify(state.user);
  useEffect(() => {
    if (areCredentialsMissing || state.appStatus !== 'ready' || !state.user) {
      if (!state.user) {
        // When logging out, remove the user's email from persistent storage.
        localStorage.removeItem('gratuitinho_user_email');
      }
      return;
    }
    
    const user = state.user;
    // Persist the current user's email to localStorage.
    // This is the key to keeping the user logged in across sessions.
    localStorage.setItem('gratuitinho_user_email', user.email);
       
    const syncUser = async () => {
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });

        const userPayload = {
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp,
            registrationDate: user.registrationDate,
            progress: user.progress,
            assessment_age: user.assessment?.age ?? null,
            assessment_height: user.assessment?.height ?? null,
            assessment_weight: user.assessment?.weight ?? null,
            assessment_activity_level: user.assessment?.activityLevel ?? null,
            assessment_goal: user.assessment?.goal ?? null,
            assessment_sleep_quality: user.assessment?.sleepQuality ?? null,
            assessment_food_quality: user.assessment?.foodQuality ?? null,
            assessment_training_location: user.assessment?.trainingLocation ?? null,
            assessment_imc: user.assessment?.imc ?? null,
            assessment_ideal_weight: user.assessment?.idealWeight ?? null,
        };
        
        const { error } = await supabase.from('users').upsert([userPayload] as any, { onConflict: 'email' });

        if (error) {
            console.error('Error saving user data to Supabase:', error);
            dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
        } else {
            console.log("User data successfully synced with Supabase.");
            dispatch({ type: 'SET_SYNC_STATUS', payload: 'success' });
            setTimeout(() => dispatch({ type: 'SET_SYNC_STATUS', payload: 'idle' }), 2000);
        }
    };

    syncUser();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userJson, state.appStatus]);
  
  const logout = useCallback(() => {
    dispatch({type: 'SET_USER', payload: null});
    // Clear the persistent session on logout.
    localStorage.removeItem('gratuitinho_user_email');
  }, [dispatch]);

  if (areCredentialsMissing) {
      return <MissingCredentialsWarning />;
  }

  return (
    <AppContext.Provider value={{ state, dispatch, logout }}>
      {state.appStatus === 'loading' ? <div className="h-screen w-full flex items-center justify-center bg-dark-900"><div className="text-brand text-xl">Carregando...</div></div> : children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
