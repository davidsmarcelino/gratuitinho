
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, supabase } from './context.tsx';
import { User, Testimonial } from './types.ts';
import { 
    CountdownTimer, CTAButton, YouTubeEmbed, Modal, PlayCircleIcon, 
    CheckIcon, ArrowRightIcon, ArrowUpIcon,
    MetabolismIcon, NutritionIcon, MindsetIcon, EnergyIcon, WaistlineIcon,
    WeightLossIcon, ConfidenceIcon, SleepIcon, SpeedIcon
} from './components.tsx';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`fixed bottom-5 right-5 z-50 p-3 rounded-full bg-brand hover:bg-brand-dark text-white shadow-lg transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Go to top"
        >
            <ArrowUpIcon className="w-6 h-6" />
        </button>
    );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial; onPlayVideo: (videoId: string) => void }> = ({ testimonial, onPlayVideo }) => (
    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-brand/20">
        <div className="relative mb-4">
            <img src={testimonial.image} alt={testimonial.name} className="w-24 h-24 rounded-full border-4 border-dark-700" />
            {testimonial.videoId && (
                <button 
                    onClick={() => onPlayVideo(testimonial.videoId!)}
                    aria-label="Play video testimonial"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                    <PlayCircleIcon />
                </button>
            )}
        </div>
        <p className="text-gray-300 italic flex-grow">{`"${testimonial.text}"`}</p>
        <p className="text-white font-bold text-center mt-4">- {testimonial.name}</p>
    </div>
);

const BeforeAndAfterCard: React.FC<{ beforeImage: string, afterImage: string, name: string }> = ({ beforeImage, afterImage, name }) => (
    <div className="bg-dark-900/50 rounded-lg overflow-hidden border border-dark-700 shadow-lg hover:shadow-brand/20 transition-shadow duration-300 transform hover:-translate-y-2">
        <div className="grid grid-cols-2">
            <div>
                <img src={beforeImage} alt={`Antes - ${name}`} className="aspect-[3/4] object-cover w-full h-full" />
                <p className="text-center bg-gray-700 text-white py-1 font-semibold text-sm">ANTES</p>
            </div>
            <div>
                <img src={afterImage} alt={`Depois - ${name}`} className="aspect-[3/4] object-cover w-full h-full" />
                <p className="text-center bg-brand text-white py-1 font-semibold text-sm">DEPOIS</p>
            </div>
        </div>
        <div className="p-4 text-center">
            <p className="font-bold text-white">{name}</p>
        </div>
    </div>
);


const LandingPageHeader: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-20 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold font-heading">FitConsult</h1>
                <nav className="hidden md:flex items-center space-x-8 text-sm">
                    <a href="#aulas" onClick={(e) => handleNavClick(e, 'aulas')} className="hover:text-brand transition-colors">Aulas</a>
                    <a href="#resultados" onClick={(e) => handleNavClick(e, 'resultados')} className="hover:text-brand transition-colors">Resultados</a>
                    <a href="#depoimentos" onClick={(e) => handleNavClick(e, 'depoimentos')} className="hover:text-brand transition-colors">Depoimentos</a>
                    <a href="#coach" onClick={(e) => handleNavClick(e, 'coach')} className="hover:text-brand transition-colors">Sobre</a>
                </nav>
                <button onClick={onCtaClick} className="bg-brand hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-lg transition-colors text-sm shadow-lg shadow-brand/20">
                    Cadastre-se
                </button>
            </div>
        </header>
    );
};

const lessons = [
    { 
        icon: MetabolismIcon, 
        title: "Aula 1: Metabolismo Acelerado", 
        description: "Aprenda a acelerar seu metabolismo natural e queimar gordura 24 horas por dia.",
        features: ["Técnicas comprovadas cientificamente", "Queima de gordura otimizada"]
    },
    { 
        icon: NutritionIcon, 
        title: "Aula 2: Alimentação Estratégica", 
        description: "Descubra como comer mais e ainda assim perder peso com nossa estratégia nutricional.",
        features: ["Sem contar calorias", "Receitas práticas"]
    },
    { 
        icon: MindsetIcon, 
        title: "Aula 3: Mindset Vencedor", 
        description: "Transforme sua mente para manter os resultados para sempre e eliminar a autosabotagem.",
        features: ["Técnicas de motivação", "Hábitos duradouros"]
    },
];

const benefits = [
    { icon: EnergyIcon, title: "Mais Disposição", description: "Sinta-se energizada o dia todo com nosso método de ativação metabólica." },
    { icon: WaistlineIcon, title: "Menos Barriga", description: "Reduza medidas e elimine a gordura localizada de forma natural." },
    { icon: WeightLossIcon, title: "Emagrecimento Real", description: "Perca peso de forma saudável e mantenha os resultados para sempre." },
    { icon: ConfidenceIcon, title: "Autoestima Elevada", description: "Reconquiste sua confiança e se sinta bem com seu corpo." },
    { icon: SleepIcon, title: "Sono Reparador", description: "Durma melhor e acorde mais descansada com nossa abordagem holística." },
    { icon: SpeedIcon, title: "Resultados Rápidos", description: "Veja mudanças reais já nas primeiras semanas do programa." }
];

const LandingPage = () => {
    const { state, dispatch } = useApp();
    const navigate = useNavigate();
    
    const [isRegModalOpen, setRegModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
    const [isVidModalOpen, setVidModalOpen] = useState(false);
    const [videoToPlay, setVideoToPlay] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenRegModal = () => {
        setError(null);
        setRegModalOpen(true);
    };
    const handleCloseRegModal = () => setRegModalOpen(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Check for existing user first.
            const response = await supabase
                .from('users')
                .select('*')
                .eq('email', formData.email)
                .maybeSingle();

            const { data: existingUser, error: fetchError } = response;

            if (fetchError) {
                throw new Error(`Erro ao verificar usuário: ${fetchError.message}`);
            }

            if (existingUser) {
                // User exists, log them in
                // Manually construct the user object to avoid deep type instantiation errors.
                const typedUser: User = {
                    name: existingUser.name,
                    email: existingUser.email,
                    whatsapp: existingUser.whatsapp,
                    registrationDate: existingUser.registrationDate,
                    progress: existingUser.progress || [],
                    assessment: existingUser.assessment || null,
                };
                dispatch({ type: 'SET_USER', payload: typedUser });
                navigate('/dashboard');
            } else {
                // User does not exist, create new one
                const newUserPayload = {
                    ...formData,
                    registrationDate: new Date().toISOString(),
                    progress: [] as number[],
                };

                // We create a plain object for insertion to avoid deep type instantiation errors with the Supabase client.
                const userToInsert = {
                    ...newUserPayload,
                    assessment: null,
                };

                const { error: insertError } = await supabase
                    .from('users')
                    .insert([userToInsert] as any);

                if (insertError) {
                    if (insertError.code === '23505') { // Handle unique constraint violation
                        throw new Error('Este e-mail já está cadastrado.');
                    }
                    throw new Error(`Erro ao criar usuário: ${insertError.message}`);
                }
                
                // If insert is successful, create the full User object for the state
                const newUser: User = {
                    ...newUserPayload,
                    assessment: null,
                };
                dispatch({ type: 'ADD_USER', payload: newUser });
                dispatch({ type: 'SET_USER', payload: newUser });
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error("Registration failed:", err);
            setError(err.message || 'Ocorreu um erro. Por favor, tente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handlePlayVideo = (videoId: string) => {
        setVideoToPlay(videoId);
        setVidModalOpen(true);
    };

    const handleCloseVidModal = () => {
        setVidModalOpen(false);
        setVideoToPlay(null);
    };
    
    const offerEndDate = Date.now() + (state.settings.offerCountdownHours || 24) * 60 * 60 * 1000;
    
    return (
        <div className="bg-dark-900 overflow-x-hidden">
            <LandingPageHeader onCtaClick={handleOpenRegModal} />
            
            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen bg-dark-900 text-white flex items-center pt-24 pb-12">
                     <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800"></div>
                     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,122,89,0.1),rgba(255,255,255,0))]"></div>
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl font-black font-heading uppercase leading-tight tracking-tighter">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand">Perca 15kg</span> em 90 Dias
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-bold mt-2 text-gray-200">Sem Dietas Restritivas</h2>
                            <p className="mt-6 text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
                                Descubra o método científico que já transformou mais de 10.000 mulheres.
                            </p>
                            <div className="mt-8 bg-dark-800/50 border border-dark-700 p-4 rounded-lg max-w-sm mx-auto md:mx-0 backdrop-blur-sm">
                                <p className="font-bold uppercase text-sm text-gray-300">Esta Oferta Termina em:</p>
                                <CountdownTimer targetDate={offerEndDate} />
                            </div>
                            <div className="mt-8">
                                <CTAButton onClick={handleOpenRegModal} className="flex items-center justify-center gap-2 max-w-sm mx-auto md:mx-0">
                                    <ArrowRightIcon className="w-6 h-6" /> Começar Agora Grátis
                                </CTAButton>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="relative">
                                <img src="https://i.imgur.com/gWahM2y.png" alt="Mulher se exercitando" className="w-full h-auto rounded-lg shadow-2xl shadow-brand/10" />
                                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm text-dark-900 p-3 rounded-lg shadow-lg">
                                    <p className="font-bold">Resultados Reais</p>
                                    <p className="text-sm">Transformação em 90 dias</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lessons Section */}
                <section id="aulas" className="py-24 bg-gray-100 text-dark-800">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">3 Aulas Gratuitas Que Vão Mudar Sua Vida</h2>
                        <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">Acesse gratuitamente nosso conteúdo exclusivo e comece sua transformação hoje mesmo.</p>
                        <div className="grid md:grid-cols-3 gap-8">
                            {lessons.map((lesson, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 text-left shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                    <div className="text-brand w-16 h-16 flex items-center justify-center rounded-2xl bg-brand/10 mb-6 text-brand-dark">
                                        {React.createElement(lesson.icon, {className: "w-10 h-10"})}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{lesson.title}</h3>
                                    <p className="text-gray-600 mb-5 min-h-[72px]">{lesson.description}</p>
                                    <ul className="space-y-2">
                                        {lesson.features.map(feature => (
                                            <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                                                <CheckIcon className="w-5 h-5 text-green-500"/> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                         <div className="mt-16">
                            <CTAButton onClick={handleOpenRegModal} className="inline-flex items-center justify-center gap-2 w-auto">
                                Quero Acessar Grátis <ArrowRightIcon className="w-5 h-5" />
                            </CTAButton>
                        </div>
                    </div>
                </section>

                {/* Before & After Section */}
                {state.settings.landingPage.beforeAndAfter.length > 0 && (
                    <section id="resultados" className="py-24 bg-dark-800">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-16 text-center text-white">Resultados Reais de Alunas Reais</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {state.settings.landingPage.beforeAndAfter.map((item, index) => (
                                    <BeforeAndAfterCard key={index} beforeImage={item.before} afterImage={item.after} name={item.name} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
                
                {/* Benefits Section */}
                 <section className="py-24 bg-dark-900">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">Resultados que vão além da balança</h2>
                        <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">Nosso método foi criado para uma transformação completa no seu corpo e na sua vida.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {benefits.map((benefit) => (
                                <div key={benefit.title} className="text-white bg-dark-700/50 p-6 rounded-xl border border-dark-700 transform hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
                                    {React.createElement(benefit.icon, {className: "w-12 h-12 text-brand mb-5"})}
                                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-gray-400">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social Proof */}
                <section id="depoimentos" className="py-24 bg-dark-800">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-16 text-center">O QUE NOSSAS ALUNAS DIZEM</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {state.settings.testimonials.length > 0 ? (
                                state.settings.testimonials.slice(0, 3).map((testimonial, index) => (
                                    <TestimonialCard key={index} testimonial={testimonial} onPlayVideo={handlePlayVideo} />
                                ))
                            ) : <p className="text-center text-gray-400 md:col-span-3">Nenhum depoimento disponível.</p>}
                        </div>
                    </div>
                </section>
                
                {/* Coach Section */}
                <section id="coach" className="py-24 bg-gray-100 text-dark-800">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-5 gap-12 items-center">
                            <div className="md:col-span-2">
                                <img src={state.settings.coach.image} alt={state.settings.coach.name} className="w-full rounded-lg shadow-2xl aspect-[4/5] object-cover" />
                            </div>
                            <div className="md:col-span-3">
                                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2">CONHEÇA SEU TREINADOR</h2>
                                <h3 className="text-2xl font-bold text-brand-dark mb-4">{state.settings.coach.name}</h3>
                                <p className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">
                                    {state.settings.coach.bio}
                                </p>
                                <div className="mt-8">
                                    <h4 className="text-xl font-bold font-heading mb-4">Formação e Certificações</h4>
                                    <ul className="space-y-3">
                                        {state.settings.coach.certifications.map((cert, index) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <CheckIcon className="w-6 h-6 text-brand" />
                                                <span className="text-gray-600 font-medium">{cert}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-10">
                                    <CTAButton onClick={handleOpenRegModal} className="inline-flex items-center justify-center gap-2 w-auto">
                                        Quero Acessar Grátis Agora! <ArrowRightIcon className="w-5 h-5" />
                                    </CTAButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <footer className="text-center p-6 bg-dark-800 border-t border-dark-700">
                 <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} FitConsult. Todos os direitos reservados.</p>
            </footer>

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-900/80 backdrop-blur-sm z-40 md:hidden border-t border-dark-700">
                 <CTAButton onClick={handleOpenRegModal}>Quero Acessar Grátis</CTAButton>
            </div>
            
            {/* Video Modal */}
            <Modal isOpen={isVidModalOpen} onClose={handleCloseVidModal}>
                {videoToPlay && <YouTubeEmbed videoId={videoToPlay} />}
            </Modal>
            
            {/* Registration Modal */}
            <Modal isOpen={isRegModalOpen} onClose={handleCloseRegModal}>
                <h2 className="text-2xl font-heading text-center mb-2">Crie seu Acesso Gratuito</h2>
                <p className="text-center text-gray-400 mb-6">Preencha os campos abaixo para começar.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-md text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="name" className="sr-only">Seu nome completo</label>
                        <input id="name" type="text" name="name" placeholder="Seu nome completo" required onChange={handleChange} value={formData.name} className="w-full bg-dark-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand focus:outline-none" disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Seu melhor e-mail</label>
                        <input id="email" type="email" name="email" placeholder="Seu melhor e-mail" required onChange={handleChange} value={formData.email} className="w-full bg-dark-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand focus:outline-none" disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="whatsapp" className="sr-only">Seu WhatsApp com DDD</label>
                        <input id="whatsapp" type="tel" name="whatsapp" placeholder="Seu WhatsApp com DDD" required onChange={handleChange} value={formData.whatsapp} className="w-full bg-dark-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand focus:outline-none" disabled={isLoading} />
                    </div>
                    <CTAButton type="submit" className={isLoading ? 'opacity-70 cursor-not-allowed' : ''} disabled={isLoading}>
                        {isLoading ? 'Cadastrando...' : 'Quero Acessar Agora!'}
                    </CTAButton>
                </form>
            </Modal>
            <ScrollToTopButton />
        </div>
    );
};

export default LandingPage;
