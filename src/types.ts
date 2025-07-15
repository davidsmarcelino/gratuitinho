

// ========= TYPES =========
export type User = {
  name: string;
  email: string;
  whatsapp: string;
  registrationDate: string; // Changed from number to string
  assessment?: AssessmentData | null;
  progress: number[]; // Array of completed lesson IDs
};

export type AssessmentData = {
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentaria' | 'ativa' | 'muito_ativa';
  goal: 'emagrecer' | 'definir' | 'ganhar_massa';
  sleepQuality: number;
  foodQuality: number;
  trainingLocation: 'casa' | 'academia' | 'outro';
  imc: number;
  idealWeight: string;
};

export type Lesson = {
  id: number;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  moduleId: string; // e.g., "Módulo Gratuito", "Programa VIP"
  isVip?: boolean;
};

export type Testimonial = {
  name:string;
  text: string;
  image: string; // URL
  videoId?: string; // YouTube Video ID
};

export type Coach = {
  name: string;
  bio: string;
  image: string; // URL
  certifications: string[];
};

export type BeforeAndAfterImage = {
    before: string; // data URL
    after: string; // data URL
    name: string; // student name
}

export type AdminSettings = {
  landingPage: {
    title: string;
    subtitle: string;
    vslEnabled: boolean;
    beforeAndAfter: BeforeAndAfterImage[];
  };
  coach: Coach;
  lessons: Lesson[];
  testimonials: Testimonial[];
  upsellPage: {
    videoUrl: string;
    fullPrice: string;
    promoPrice: string;
    title: string;
    subtitle: string;
    features: string[];
  };
  freeAccessDays: number;
  offerCountdownHours: number;
};

export type AppState = {
  user: User | null;
  users: User[];
  settings: AdminSettings;
  appStatus: 'loading' | 'ready';
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
};

export type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_ASSESSMENT'; payload: AssessmentData }
  | { type: 'COMPLETE_LESSON'; payload: number }
  | { type: 'UPDATE_SETTINGS'; payload: AdminSettings }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'SET_SYNC_STATUS'; payload: AppState['syncStatus'] };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  logout: () => void;
}

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_SUPABASE_URL: string;
      readonly VITE_SUPABASE_KEY: string;
      readonly VITE_GEMINI_API_KEY?: string;
    };
  }
}