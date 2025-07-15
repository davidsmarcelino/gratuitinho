

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from './context.tsx';
import { Lesson, AssessmentData } from './types.ts';
import { CTAButton, YouTubeEmbed, Modal, UpsellRedirectModal, Carousel, LessonCard, PlayIcon, calculateBMI, calculateIdealWeight, RatingSlider, ProgressBar, ClockIcon, CountdownTimer, CheckCircleIcon } from './components.tsx';
import { GoogleGenAI } from '@google/genai';

// Base64 encoded completion sound (short, pleasant chime in WAV format)
const completionSound = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAP//8/8/8/b35e/N4c/Gx8bHw7/Ev8O/w7/Cv8O/xL/HvsS+xL3DvsO9w8HDu8O/w77CvcK+wr3BvMG+wb3BvcG9wb7Bv8G/wr/CvsK+wr/Bv8G+wb3BvcG9wb7BvMG+wb3CvMK/w7/Ev8W/xb/Gv8e/xL/DvcO+w7/Dv8M/w4HDgsN9wr3CvcK9wb3BvsG9wb3BvsG9wb3BvsG8wbzCvsO/xL/Fv8b/x7/Iv8m/yr/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s/yz/LP8s-");


const AssessmentForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const { state, dispatch } = useApp();
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsGeneratingFeedback(true);
        setFeedback(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const assessmentData: AssessmentData = {
            age: Number(data.age),
            height: Number(data.height),
            weight: Number(data.weight),
            activityLevel: data.activityLevel as any,
            goal: data.goal as any,
            sleepQuality: Number(data.sleep),
            foodQuality: Number(data.food),
            trainingLocation: data.trainingLocation as any,
            imc: calculateBMI(Number(data.weight), Number(data.height)),
            idealWeight: calculateIdealWeight(Number(data.height)),
        };

        dispatch({ type: 'UPDATE_ASSESSMENT', payload: assessmentData });

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

            const goalMap = {
                emagrecer: 'Emagrecer',
                definir: 'Definir o corpo',
                ganhar_massa: 'Ganhar massa muscular'
            };

            const activityMap = {
                sedentaria: 'Sedentária',
                ativa: 'Ativa',
                muito_ativa: 'Muito ativa'
            };
            
            const trainingLocationMap = {
                casa: 'Em casa',
                academia: 'Na academia',
                outro: 'Outro local (ar livre, etc)'
            };

            const prompt = `
                Você é a "FitConsult AI", uma coach de fitness virtual para mulheres. Seu tom é motivador, empático e positivo. Use frases curtas e diretas.

                A aluna ${state.user?.name} preencheu uma avaliação:
                - Objetivo: ${goalMap[assessmentData.goal]}
                - Local de Treino: ${trainingLocationMap[assessmentData.trainingLocation]}
                - Nível de Atividade: ${activityMap[assessmentData.activityLevel]}
                - Qualidade do Sono: ${assessmentData.sleepQuality}/5
                - Qualidade da Alimentação: ${assessmentData.foodQuality}/5
                - IMC: ${assessmentData.imc.toFixed(1)}

                Gere uma mensagem de boas-vindas e análise (máximo de 4-5 frases). A mensagem deve:
                1. Cumprimentar a aluna pelo nome.
                2. Fazer uma análise encorajadora baseada nos dados, mencionando o local de treino para personalizar a dica, e focando no potencial de melhoria.
                3. Fazer duas perguntas curtas para reflexão baseadas nos dados de menor pontuação (sono ou alimentação).
                4. Terminar com uma frase inspiradora e dizer que a primeira aula está liberada.

                Exemplo de como estruturar sua resposta (use quebras de linha):
                Olá, Maria! Parabéns por dar este passo! Seus dados mostram que seu objetivo é emagrecer e você treina em casa, o que é ótimo para criar consistência. Com foco na melhoria da sua alimentação, você verá resultados incríveis.

                Para começar, que tal refletir:
                - Qual pequena troca alimentar você poderia fazer esta semana?
                - O que você acredita que mais impacta sua qualidade de sono hoje?

                Estou animada para começar com você. Sua primeira aula já está liberada!
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const feedbackText = response.text;
            setFeedback(feedbackText);

        } catch (error) {
            console.error("Error generating feedback with AI:", error);
            const fallbackText = `Olá, ${state.user?.name}! Recebemos sua avaliação. Estamos muito animadas para começar esta jornada com você e te ajudar a alcançar seu objetivo. Sua primeira aula já está liberada. Vamos com tudo!`;
            setFeedback(fallbackText);
        } finally {
            setIsGeneratingFeedback(false);
        }
    };
    
    const sleepLabels = ["Muito Ruim", "Ruim", "Regular", "Boa", "Excelente"];
    const foodLabels = ["Muito Ruim", "Ruim", "Regular", "Boa", "Excelente"];

    if (isGeneratingFeedback) {
        return (
             <div className="text-center py-12">
                 <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand mx-auto"></div>
                 <h2 className="text-2xl font-heading text-white mt-6">Analisando seus dados...</h2>
                 <p className="text-gray-400 mt-2">Estamos preparando um feedback personalizado para você!</p>
            </div>
        )
    }

    if (feedback) {
        return (
            <div className="text-center">
                <h2 className="text-3xl font-heading text-brand mb-4">Análise Personalizada Pronta!</h2>
                <div className="text-lg text-gray-300 mb-8 text-left whitespace-pre-line px-2">{feedback}</div>
                <CTAButton onClick={onComplete}>Começar Agora!</CTAButton>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-heading text-center mb-2">Autoavaliação Rápida</h1>
            <p className="text-center text-gray-400 mb-8">Vamos personalizar sua jornada. Responda com sinceridade.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <input type="number" name="age" placeholder="Idade" required className="bg-dark-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand focus:outline-none" />
                    <input type="number" name="height" placeholder="Altura (cm)" required className="bg-dark-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand focus:outline-none" />
                    <input type="number" name="weight" placeholder="Peso (kg)" required className="bg-dark-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand focus:outline-none" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nível de atividade:</label>
                    <select name="activityLevel" required className="w-full bg-dark-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand focus:outline-none">
                        <option value="sedentaria">Sedentária (trabalho sentada, pouco movimento)</option>
                        <option value="ativa">Ativa (caminho, faço tarefas domésticas)</option>
                        <option value="muito_ativa">Muito Ativa (trabalho físico ou esportes)</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo principal:</label>
                    <select name="goal" required className="w-full bg-dark-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand focus:outline-none">
                        <option value="emagrecer">Emagrecer</option>
                        <option value="definir">Definir o corpo</option>
                        <option value="ganhar_massa">Ganhar massa muscular</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Onde você costuma treinar?</label>
                    <select name="trainingLocation" required className="w-full bg-dark-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand focus:outline-none">
                        <option value="casa">Em casa</option>
                        <option value="academia">Na academia</option>
                        <option value="outro">Outro (parque, ar livre, etc.)</option>
                    </select>
                </div>
                <RatingSlider
                  label="Qualidade do sono"
                  name="sleep"
                  valueLabels={sleepLabels}
                  defaultValue={3}
                />
                <RatingSlider
                  label="Qualidade da alimentação"
                  name="food"
                  valueLabels={foodLabels}
                  defaultValue={3}
                />
                <CTAButton type="submit">Gerar Minha Análise</CTAButton>
            </form>
        </div>
    );
};

const AssessmentPrompt: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    return (
        <div className="text-center flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-3xl font-heading mb-4">Bem-vinda à sua área de treinos!</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl">Para começar e personalizar sua experiência, precisamos de algumas informações. Vamos fazer uma autoavaliação rápida?</p>
            <CTAButton onClick={onStart} className="animate-pulse-orange max-w-sm">
                Fazer minha autoavaliação
            </CTAButton>
        </div>
    );
};

const AccessTimerInfo: React.FC<{ registrationDate: string; freeAccessDays: number }> = ({ registrationDate, freeAccessDays }) => {
    if (freeAccessDays <= 0) return null; // Don't show if access is permanent

    const registrationTime = new Date(registrationDate).getTime();
    const freeAccessEndDate = registrationTime + freeAccessDays * 24 * 60 * 60 * 1000;
    const startDateString = new Date(registrationDate).toLocaleDateString('pt-BR');
    const endDateString = new Date(freeAccessEndDate).toLocaleDateString('pt-BR');
    
    return (
        <div className="bg-dark-900/50 border border-dark-700 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-brand" />
                Seu Acesso Gratuito
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-dark-800 p-3 rounded-md">
                    <p className="text-xs text-gray-400 uppercase">Tempo Restante</p>
                    <CountdownTimer targetDate={freeAccessEndDate} />
                </div>
                <div className="bg-dark-800 p-3 rounded-md flex flex-col justify-center">
                    <p className="text-xs text-gray-400 uppercase">Início</p>
                    <p className="text-lg font-bold font-heading">{startDateString}</p>
                </div>
                <div className="bg-dark-800 p-3 rounded-md flex flex-col justify-center">
                    <p className="text-xs text-gray-400 uppercase">Expira em</p>
                    <p className="text-lg font-bold font-heading">{endDateString}</p>
                </div>
            </div>
        </div>
    );
};

const SyncStatusIndicator = () => {
    const { state } = useApp();
    const { syncStatus } = state;

    if (syncStatus === 'idle') {
        return null; // Don't show anything when idle
    }

    const contentMap = {
        syncing: { Icon: ClockIcon, text: "Sincronizando...", color: "text-gray-400", spin: true },
        success: { Icon: CheckCircleIcon, text: "Salvo!", color: "text-green-400", spin: false },
        error: { 
            Icon: () => <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 font-bold text-xs leading-none">!</div>,
            text: "Falha ao salvar", 
            color: "text-red-400", 
            spin: false 
        }
    };
    
    const current = contentMap[syncStatus];

    return (
        <div className={`flex items-center gap-2 text-sm ${current.color} transition-opacity`}>
            <current.Icon className={`w-4 h-4 ${current.spin ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{current.text}</span>
        </div>
    );
}

const DashboardPage = () => {
    const { state, dispatch, logout } = useApp();
    const navigate = useNavigate();

    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
    const [isAssessmentModalOpen, setAssessmentModalOpen] = useState(false);

    useEffect(() => {
        if (!state.user) {
            navigate('/');
        }
    }, [state.user, navigate]);

    if (!state.user) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-dark-900">
                <div className="text-brand text-xl">Redirecionando...</div>
            </div>
        );
    }

    const { user } = state;

    const freeLessons = useMemo(() => state.settings.lessons.filter(l => !l.isVip), [state.settings.lessons]);
    const vipLessons = useMemo(() => state.settings.lessons.filter(l => l.isVip), [state.settings.lessons]);

    const handleLessonClick = (lesson: Lesson) => {
        const isCompleted = user.progress.includes(lesson.id);
        const firstIncompleteLesson = freeLessons.sort((a,b) => a.id - b.id).find(l => !user.progress.includes(l.id));

        if (lesson.isVip && !isCompleted) {
            setIsUpsellModalOpen(true);
            return;
        }

        if (!lesson.isVip) {
            if (!firstIncompleteLesson || lesson.id === firstIncompleteLesson.id || user.progress.includes(lesson.id)) {
                setSelectedLesson(lesson);
            } else {
                alert('Conclua a aula anterior para desbloquear este conteúdo.');
            }
        }
    };

    const handleCloseModal = () => {
        setSelectedLesson(null);
    };

    const handleCompleteLesson = () => {
        if (selectedLesson && !user.progress.includes(selectedLesson.id)) {
            dispatch({ type: 'COMPLETE_LESSON', payload: selectedLesson.id });
            completionSound.play().catch(e => console.error("Error playing sound:", e));
        }
        handleCloseModal();
    };

    const nextLesson = useMemo(() => {
        return freeLessons.sort((a,b) => a.id - b.id).find(l => !user.progress.includes(l.id));
    }, [freeLessons, user.progress]);

    const DashboardHeader = () => (
        <header className="bg-dark-900 p-4 flex justify-between items-center shadow-lg sticky top-0 z-20">
            <h1 className="text-xl md:text-2xl font-bold font-heading text-white">Olá, <span className="text-brand">{user.name.split(' ')[0]}</span>!</h1>
            <div className="flex-grow flex justify-center">
                 <button 
                    onClick={() => navigate('/upsell')}
                    className="text-brand-light font-bold animate-pulse-orange rounded-full px-4 py-2 text-sm hover:text-brand transition-colors"
                >
                    Garanta com desconto consultoria VIP
                </button>
            </div>
            <div className="flex items-center gap-4">
                <SyncStatusIndicator />
                <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors border border-gray-600 px-3 py-1 rounded-md hover:bg-dark-700">Sair</button>
            </div>
        </header>
    );

    const WelcomeBanner = () => {
        if (!nextLesson) {
             return (
                 <div className="bg-gradient-to-r from-brand to-brand-dark rounded-lg p-6 mb-8 text-center text-white shadow-lg">
                    <h2 className="text-2xl font-bold font-heading mb-2">Parabéns!</h2>
                    <p className="opacity-90 mb-4">Você completou todas as aulas gratuitas. Dê o próximo passo para uma transformação completa!</p>
                    <CTAButton onClick={() => navigate('/upsell')} className="w-auto inline-block bg-white text-brand hover:bg-gray-200">Conheça o Programa VIP</CTAButton>
                 </div>
             );
        }
        return (
            <div className="relative rounded-lg overflow-hidden mb-8 group cursor-pointer shadow-2xl shadow-brand/10" onClick={() => handleLessonClick(nextLesson)}>
                <img src={nextLesson.thumbnail} alt={nextLesson.title} className="w-full h-auto md:h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end">
                    <div className="p-6 md:p-8">
                         <p className="text-brand font-bold uppercase text-sm">Sua Próxima Aula</p>
                         <h2 className="text-2xl md:text-4xl font-bold font-heading my-2 text-white">{nextLesson.title}</h2>
                         <p className="text-gray-200 mb-4 hidden md:block max-w-2xl">{nextLesson.description}</p>
                         <div className="flex items-center gap-3 text-white font-bold bg-brand/30 backdrop-blur-sm rounded-full p-2 pl-4 w-fit group-hover:bg-brand/50 transition-colors">
                            <PlayIcon className="w-8 h-8 text-white" />
                            <span>Assistir Agora</span>
                         </div>
                    </div>
                </div>
            </div>
        );
    };

    const LessonPlayerModal = () => (
         <Modal isOpen={!!selectedLesson} onClose={handleCloseModal} size="3xl">
            {selectedLesson && (
                <div className="bg-dark-900 rounded-lg">
                    <YouTubeEmbed videoId={selectedLesson.videoId} />
                    <div className="p-6">
                        <h2 className="text-2xl font-bold font-heading mb-2">{selectedLesson.title}</h2>
                        <p className="text-gray-400 mb-6">{selectedLesson.description}</p>
                         { !user.progress.includes(selectedLesson.id) ? (
                            <CTAButton onClick={handleCompleteLesson}>
                                Marcar como Concluída
                            </CTAButton>
                        ) : (
                            <div className="text-center font-bold text-green-400 border border-green-400/50 rounded-lg p-3">
                                Aula Concluída!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );

    return (
        <div className="bg-dark-800 min-h-screen text-white">
            <DashboardHeader />
            <main className="container mx-auto p-4 md:p-8">
                
                { !user.assessment ? (
                    <AssessmentPrompt onStart={() => setAssessmentModalOpen(true)} />
                ) : (
                    <>
                        <WelcomeBanner />
                        <AccessTimerInfo registrationDate={user.registrationDate} freeAccessDays={state.settings.freeAccessDays} />
                        
                        <ProgressBar 
                            value={user.progress.length}
                            max={freeLessons.length}
                            label="Progresso no Módulo Gratuito"
                        />
                        <div className="my-8">
                            <Carousel title="Módulo Gratuito">
                                {freeLessons.map(lesson => (
                                    <LessonCard
                                        key={lesson.id}
                                        lesson={lesson}
                                        isLocked={nextLesson ? lesson.id > nextLesson.id : false}
                                        isCompleted={user.progress.includes(lesson.id)}
                                        onClick={() => handleLessonClick(lesson)}
                                    />
                                ))}
                            </Carousel>
                        </div>

                        <Carousel title="Programa VIP">
                            {vipLessons.map(lesson => (
                                <LessonCard
                                    key={lesson.id}
                                    lesson={lesson}
                                    isLocked={true}
                                    isCompleted={false}
                                    onClick={() => handleLessonClick(lesson)}
                                />
                            ))}
                        </Carousel>
                    </>
                )}

            </main>

            <LessonPlayerModal />

            <UpsellRedirectModal 
                isOpen={isUpsellModalOpen}
                onClose={() => setIsUpsellModalOpen(false)}
            />
            
            <Modal isOpen={isAssessmentModalOpen && !user.assessment} onClose={() => setAssessmentModalOpen(false)} size="2xl">
                <AssessmentForm onComplete={() => setAssessmentModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default DashboardPage;