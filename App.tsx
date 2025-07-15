
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context.tsx';

import LandingPage from './LandingPage.tsx';
import DashboardPage from './DashboardPage.tsx';
import UpsellPage from './UpsellPage.tsx';
import AdminPage from './AdminPage.tsx';


// --- ETAPA 6: App Flow & Routing ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state } = useApp();
    const location = useLocation();

    if (!state.user) {
        // Redireciona para a página de cadastro se o usuário não estiver logado.
        return <Navigate to="/landing" state={{ from: location }} replace />;
    }
    
    const nonVipLessonsCount = state.settings.lessons.filter(l => !l.isVip).length;

    // Redireciona para a página de upsell se o acesso gratuito expirou OU se todas as aulas gratuitas foram concluídas.
    if (state.user.registrationDate && state.settings.freeAccessDays > 0) {
        const registrationTime = new Date(state.user.registrationDate).getTime();
        const freeAccessEndDate = registrationTime + state.settings.freeAccessDays * 24 * 60 * 60 * 1000;
        if (Date.now() > freeAccessEndDate) {
            return <Navigate to="/upsell" state={{ from: location }} replace />;
        }
    }
    if (nonVipLessonsCount > 0 && state.user.progress.length >= nonVipLessonsCount) {
        return <Navigate to="/upsell" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const AppRoutes = () => {
    const { state } = useApp();
    
    return (
        <Routes>
            {/* A rota raiz redireciona para a landing page se não estiver logado, ou para o dashboard se estiver. */}
            <Route path="/" element={state.user ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />

            <Route path="/landing" element={<LandingPage />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/upsell" element={<UpsellPage />} />
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Um catch-all amigável que redireciona para a raiz. */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
  return (
    <AppProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </AppProvider>
  );
}

export default App;