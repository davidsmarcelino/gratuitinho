
import React, { useState } from 'react';
import { useApp } from './context.tsx';
import { AdminSettings, Lesson, Testimonial, BeforeAndAfterImage } from './types.ts';
import { CTAButton, CheckCircleIcon, exportToCSV, MiniProgressBar, TrendingUpIcon, UsersIcon, PencilIcon, TrashIcon, PlusIcon } from './components.tsx';

type AdminTab = 'metrics' | 'users' | 'lessons' | 'content' | 'settings';

const TABS: { id: AdminTab, label: string }[] = [
    { id: 'metrics', label: 'Métricas' },
    { id: 'users', label: 'Alunos' },
    { id: 'lessons', label: 'Aulas' },
    { id: 'content', label: 'Conteúdo' },
    { id: 'settings', label: 'Configurações' },
];

const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    // Regular expression to find the YouTube ID from various URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    }
    // If it's not a valid URL, assume it's already an ID
    return url;
};

// --- ETAPA 5: Admin Panel ---
const AdminPage = () => {
    const { state, dispatch } = useApp();
    const [settings, setSettings] = useState(state.settings);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<AdminTab>('metrics');

    const handleSave = () => {
        setIsSaving(true);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
        setTimeout(() => {
            setIsSaving(false);
            alert('Configurações salvas!');
        }, 1000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: keyof AdminSettings, field: string) => {
        setSettings(prev => {
            const currentSection = prev[section];
            if (typeof currentSection === 'object' && currentSection !== null && !Array.isArray(currentSection)) {
                const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
                return {
                    ...prev,
                    [section]: {
                        ...currentSection,
                        [field]: value
                    }
                };
            }
            return prev;
        });
    };
    
    const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number, field: keyof Lesson) => {
        const newLessons = [...settings.lessons];
        const target = e.target as HTMLInputElement;
        let value: string | boolean = target.type === 'checkbox' ? target.checked : target.value;

        if (field === 'videoId') {
            value = extractYouTubeId(String(value));
        }
        
        (newLessons[index] as any)[field] = value;
        setSettings(prev => ({...prev, lessons: newLessons}));
    };
    
    const handleAddLesson = () => {
        const newLesson: Lesson = {
            id: Date.now(), // Simple unique ID
            title: 'Nova Aula',
            description: 'Descrição da nova aula.',
            videoId: '',
            thumbnail: 'https://i.imgur.com/gWahM2y.png', // Default thumbnail
            moduleId: 'Módulo Gratuito',
            isVip: false
        };
        setSettings(prev => ({ ...prev, lessons: [...prev.lessons, newLesson] }));
    };

    const handleRemoveLesson = (index: number) => {
        if (window.confirm('Tem certeza que deseja remover esta aula?')) {
            const newLessons = settings.lessons.filter((_, i) => i !== index);
            setSettings(prev => ({ ...prev, lessons: newLessons }));
        }
    };
    
    const handleTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: keyof Testimonial) => {
        const newTestimonials = [...settings.testimonials];
        (newTestimonials[index] as any)[field] = e.target.value;
        setSettings(prev => ({...prev, testimonials: newTestimonials}));
    };

    const handleAddTestimonial = () => {
        const newTestimonial: Testimonial = {
            name: 'Nome da Aluna',
            text: 'Texto do depoimento.',
            image: 'https://picsum.photos/100/100',
            videoId: ''
        };
        setSettings(prev => ({ ...prev, testimonials: [...prev.testimonials, newTestimonial] }));
    };

    const handleRemoveTestimonial = (index: number) => {
        if (window.confirm('Tem certeza que deseja remover este depoimento?')) {
            const newTestimonials = settings.testimonials.filter((_, i) => i !== index);
            setSettings(prev => ({ ...prev, testimonials: newTestimonials }));
        }
    };
    
    const handleCoachCertificationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const certifications = e.target.value.split('\n');
        setSettings(prev => ({ ...prev, coach: { ...prev.coach, certifications }}));
    };

    const handleUpsellFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const features = e.target.value.split('\n');
        setSettings(prev => ({ ...prev, upsellPage: { ...prev.upsellPage, features }}));
    };

    const handleImageUpload = (file: File, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleLessonThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files?.[0]) {
            handleImageUpload(e.target.files[0], (image) => {
                const newLessons = [...settings.lessons];
                newLessons[index].thumbnail = image;
                setSettings(prev => ({ ...prev, lessons: newLessons }));
            });
        }
    };

    const handleCoachImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleImageUpload(e.target.files[0], (image) => setSettings(prev => ({
                ...prev, coach: { ...prev.coach, image }
            })));
        }
    };

    const handleBeforeAfterChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newBeforeAfter = [...settings.landingPage.beforeAndAfter];
        newBeforeAfter[index].name = e.target.value;
        setSettings(prev => ({...prev, landingPage: {...prev.landingPage, beforeAndAfter: newBeforeAfter}}));
    };
    
    const handleBeforeAfterImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number, type: 'before' | 'after') => {
        if (e.target.files?.[0]) {
            handleImageUpload(e.target.files[0], (image) => {
                const newBeforeAfter = [...settings.landingPage.beforeAndAfter];
                newBeforeAfter[index][type] = image;
                setSettings(prev => ({...prev, landingPage: {...prev.landingPage, beforeAndAfter: newBeforeAfter}}));
            });
        }
    };

    const handleAddBeforeAfter = () => {
        const newPair: BeforeAndAfterImage = {
            name: 'Nome da Aluna',
            before: 'https://i.imgur.com/8m92n3T.png',
            after: 'https://i.imgur.com/gWahM2y.png'
        };
        setSettings(prev => ({...prev, landingPage: {...prev.landingPage, beforeAndAfter: [...prev.landingPage.beforeAndAfter, newPair]}}));
    };

    const handleRemoveBeforeAfter = (index: number) => {
        if (window.confirm('Tem certeza que deseja remover este par de fotos?')) {
            const newBeforeAfter = settings.landingPage.beforeAndAfter.filter((_, i) => i !== index);
            setSettings(prev => ({...prev, landingPage: {...prev.landingPage, beforeAndAfter: newBeforeAfter}}));
        }
    };
    
    const assessmentLabels = {
        goal: { emagrecer: 'Emagrecer', definir: 'Definir', ganhar_massa: 'Ganhar Massa' },
        activityLevel: { sedentaria: 'Sedentária', ativa: 'Ativa', muito_ativa: 'Muito Ativa' }
    };

    const freeLessons = settings.lessons.filter(l => !l.isVip);
    const totalUsers = state.users.length;
    const usersWhoCompleted = freeLessons.length > 0 ? state.users.filter(u => u.progress.length >= freeLessons.length).length : 0;
    const averageProgress = totalUsers > 0 ? (state.users.reduce((acc, user) => acc + (freeLessons.length > 0 ? (user.progress.length / freeLessons.length) * 100 : 0), 0) / totalUsers) : 0;

    const AdminHeader = () => (
        <div className="sticky top-0 bg-dark-800/80 backdrop-blur-md z-30 pt-4 -mx-8 px-8">
            <div className="container mx-auto max-w-6xl flex justify-between items-center pb-4">
                <h1 className="text-3xl font-heading">Painel Administrativo</h1>
                <CTAButton onClick={handleSave} className="w-auto py-2 px-6 text-base" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </CTAButton>
            </div>
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id ? 'border-brand text-brand' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-dark-800 min-h-screen text-white">
            <div className="container mx-auto max-w-6xl">
                <AdminHeader />
                <main className="mt-8">
                    {activeTab === 'metrics' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-dark-900 p-6 rounded-lg border border-gray-700 flex items-center gap-4"><div className="bg-blue-500/10 p-3 rounded-full"><UsersIcon className="w-8 h-8 text-blue-400" /></div><div><p className="text-3xl font-bold">{totalUsers}</p><p className="text-gray-400">Total de Cadastros</p></div></div>
                            <div className="bg-dark-900 p-6 rounded-lg border border-gray-700 flex items-center gap-4"><div className="bg-green-500/10 p-3 rounded-full"><CheckCircleIcon className="w-8 h-8 text-green-400" /></div><div><p className="text-3xl font-bold">{usersWhoCompleted}</p><p className="text-gray-400">Concluíram o Gratuito</p></div></div>
                            <div className="bg-dark-900 p-6 rounded-lg border border-gray-700 flex items-center gap-4"><div className="bg-brand/10 p-3 rounded-full"><TrendingUpIcon className="w-8 h-8 text-brand" /></div><div><p className="text-3xl font-bold">{averageProgress.toFixed(0)}%</p><p className="text-gray-400">Progresso Médio</p></div></div>
                        </div>
                    )}
                    {activeTab === 'users' && (
                        <div className="bg-dark-900 p-6 rounded-lg border border-gray-700">
                            <button onClick={() => exportToCSV(state.users, state.settings.lessons)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">Exportar para CSV</button>
                            <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-dark-700"><tr><th className="px-6 py-3">Nome</th><th className="px-6 py-3">Contato</th><th className="px-6 py-3 w-48">Progresso</th><th className="px-6 py-3">IMC</th><th className="px-6 py-3">Objetivo</th><th className="px-6 py-3">Nível Ativ.</th><th className="px-6 py-3">Sono</th><th className="px-6 py-3">Aliment.</th></tr></thead><tbody>{state.users.map(user => {const progressPercent = freeLessons.length > 0 ? (user.progress.length / freeLessons.length) * 100 : 0; const tooltipText = `Aulas Concluídas (${user.progress.length}/${freeLessons.length}):\n${freeLessons.filter(l => user.progress.includes(l.id)).map(l => `• ${l.title}`).join('\n') || 'Nenhuma'}`; return (<tr key={user.email} className="bg-dark-800 border-b border-gray-700 hover:bg-dark-700/50"><td className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.name}</td><td className="px-6 py-4">{user.email}<br/>{user.whatsapp}</td><td className="px-6 py-4"><div className="flex items-center gap-3"><MiniProgressBar percentage={progressPercent} tooltip={tooltipText} /><span className="font-medium text-white">{progressPercent.toFixed(0)}%</span></div></td><td className="px-6 py-4">{user.assessment?.imc ? user.assessment.imc.toFixed(2) : 'N/A'}</td><td className="px-6 py-4">{user.assessment ? assessmentLabels.goal[user.assessment.goal] : 'N/A'}</td><td className="px-6 py-4">{user.assessment ? assessmentLabels.activityLevel[user.assessment.activityLevel] : 'N/A'}</td><td className="px-6 py-4">{user.assessment ? `${user.assessment.sleepQuality}/5` : 'N/A'}</td><td className="px-6 py-4">{user.assessment ? `${user.assessment.foodQuality}/5` : 'N/A'}</td></tr>);})}</tbody></table></div>
                        </div>
                    )}
                    {activeTab === 'lessons' && (
                        <div className="bg-dark-900 p-6 rounded-lg border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Aulas Gratuitas e VIP</h2><div className="space-y-6">{settings.lessons.map((lesson, index) => (<div key={lesson.id} className="relative p-4 border border-gray-700 rounded-md bg-dark-800"><button onClick={() => handleRemoveLesson(index)} title="Remover Aula" className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition-colors"><TrashIcon className="w-5 h-5" /></button><h3 className="font-bold text-lg mb-2 flex items-center gap-2">{lesson.isVip && <span className="text-xs bg-yellow-400 text-dark-900 font-bold px-2 py-1 rounded-full">VIP</span>} Aula {index + 1}: {lesson.title}</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-1 block">Título:</label>
                                        <input type="text" value={lesson.title} onChange={e => handleLessonChange(e, index, 'title')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-1 block">ID ou URL do Vídeo YouTube:</label>
                                        <input type="text" value={lesson.videoId} onChange={e => handleLessonChange(e, index, 'videoId')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-300 mb-1 block">Descrição:</label>
                                        <textarea value={lesson.description} onChange={e => handleLessonChange(e, index, 'description')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2 h-20" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-300 mb-1 block">Thumbnail:</label>
                                        <div className="flex items-center gap-4">
                                            <img src={lesson.thumbnail} alt="Thumbnail preview" className="w-32 h-auto rounded-md object-cover bg-dark-700"/>
                                            <div className="flex-grow">
                                                <label htmlFor={`lesson-thumb-upload-${index}`} className="cursor-pointer bg-dark-700 border border-gray-600 rounded-md py-2 px-4 text-sm font-medium text-gray-300 hover:bg-gray-600 flex items-center gap-2 w-fit">
                                                    <PencilIcon className="w-4 h-4" /> Trocar Imagem...
                                                </label>
                                                <input id={`lesson-thumb-upload-${index}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleLessonThumbnailUpload(e, index)} />
                                                <label className="text-sm font-medium text-gray-300 mb-1 mt-2 block">ou cole a URL da imagem:</label>
                                                <input type="text" value={lesson.thumbnail} onChange={e => handleLessonChange(e, index, 'thumbnail')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm font-medium text-gray-300">É VIP?</label>
                                        <input type="checkbox" checked={!!lesson.isVip} onChange={e => handleLessonChange(e, index, 'isVip')} className="h-4 w-4 text-brand bg-gray-700 border-gray-600 rounded focus:ring-brand" />
                                    </div>
                                </div>
                            </div>))}</div><div className="mt-6"><button onClick={handleAddLesson} className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded transition-colors"><PlusIcon className="w-5 h-5" /> Adicionar Nova Aula</button></div>
                        </div>
                    )}
                    {activeTab === 'content' && (
                        <div className="space-y-8">
                            <div className="bg-dark-900 p-6 rounded-lg border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4">Landing Page - Hero Section</h2>
                                <div className="space-y-4">
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Título (Destaque Laranja)</label><input type="text" value={settings.landingPage.heroTitleHighlight} onChange={(e) => handleInputChange(e, 'landingPage', 'heroTitleHighlight')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Título (Restante)</label><input type="text" value={settings.landingPage.heroTitle} onChange={(e) => handleInputChange(e, 'landingPage', 'heroTitle')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Subtítulo</label><input type="text" value={settings.landingPage.heroSubtitle} onChange={(e) => handleInputChange(e, 'landingPage', 'heroSubtitle')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label><textarea value={settings.landingPage.heroDescription} onChange={(e) => handleInputChange(e, 'landingPage', 'heroDescription')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2 h-24"></textarea></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">URL da Imagem Principal</label><input type="text" value={settings.landingPage.heroImage} onChange={(e) => handleInputChange(e, 'landingPage', 'heroImage')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                </div>
                            </div>
                            <div className="bg-dark-900 p-6 rounded-lg border border-gray-700"><h2 className="text-2xl font-bold mb-4">Fotos Antes & Depois</h2><div className="space-y-4">{settings.landingPage.beforeAndAfter.map((item, index) => (<div key={index} className="relative p-4 border border-gray-700 rounded-md bg-dark-800"><button onClick={() => handleRemoveBeforeAfter(index)} title="Remover" className="absolute top-2 right-2 text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button><div className="grid md:grid-cols-3 gap-4 items-end"><div><label className="block text-sm font-medium text-gray-300 mb-1">Nome da Aluna</label><input type="text" value={item.name} onChange={(e) => handleBeforeAfterChange(e, index)} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2"/></div><div><label htmlFor={`before-img-${index}`} className="block text-sm font-medium text-gray-300 mb-1">Foto "Antes"</label><input id={`before-img-${index}`} type="file" accept="image/*" onChange={(e) => handleBeforeAfterImageUpload(e, index, 'before')} className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand/20 file:text-brand hover:file:bg-brand/30"/></div><div><label htmlFor={`after-img-${index}`} className="block text-sm font-medium text-gray-300 mb-1">Foto "Depois"</label><input id={`after-img-${index}`} type="file" accept="image/*" onChange={(e) => handleBeforeAfterImageUpload(e, index, 'after')} className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand/20 file:text-brand hover:file:bg-brand/30"/></div></div></div>))}</div><div className="mt-4"><button onClick={handleAddBeforeAfter} className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded transition-colors"><PlusIcon className="w-5 h-5" /> Adicionar Par Antes/Depois</button></div></div>
                            <div className="bg-dark-900 p-6 rounded-lg border border-gray-700"><h2 className="text-2xl font-bold mb-4">Seção "Conheça o Treinador"</h2><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-300 mb-1">Nome do Treinador</label><input type="text" value={settings.coach.name} onChange={(e) => handleInputChange(e, 'coach', 'name')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Bio do Treinador</label><textarea value={settings.coach.bio} onChange={(e) => handleInputChange(e, 'coach', 'bio')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2 h-32"></textarea></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Foto do Treinador</label><div className="flex items-center gap-4 mt-2"><img src={settings.coach.image} alt="Coach preview" className="w-24 h-24 rounded-lg object-cover bg-dark-700"/><label htmlFor="coach-image-upload" className="cursor-pointer bg-dark-700 border border-gray-600 rounded-md py-2 px-4 text-sm font-medium text-gray-300 hover:bg-gray-600 flex items-center gap-2"><PencilIcon className="w-4 h-4" />Trocar imagem...</label><input id="coach-image-upload" name="coach-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleCoachImageUpload} /></div></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Certificações (uma por linha)</label><textarea value={settings.coach.certifications.join('\n')} onChange={handleCoachCertificationsChange} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2 h-32"></textarea></div></div></div>
                             <div className="bg-dark-900 p-6 rounded-lg border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4">Página de Upsell</h2>
                                <div className="space-y-4">
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Título</label><input type="text" value={settings.upsellPage.title} onChange={(e) => handleInputChange(e, 'upsellPage', 'title')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Subtítulo</label><textarea value={settings.upsellPage.subtitle} onChange={(e) => handleInputChange(e, 'upsellPage', 'subtitle')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2 h-24"></textarea></div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Mídia</label>
                                        <select value={settings.upsellPage.mediaType} onChange={(e) => setSettings(prev => ({...prev, upsellPage: {...prev.upsellPage, mediaType: e.target.value as any}}))} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2">
                                            <option value="video">Vídeo</option>
                                            <option value="image">Imagem</option>
                                            <option value="none">Nenhum</option>
                                        </select>
                                    </div>
                                    {settings.upsellPage.mediaType === 'video' && (
                                        <div><label className="block text-sm font-medium text-gray-300 mb-1">URL do Vídeo (YouTube Embed)</label><input type="text" value={settings.upsellPage.videoUrl} onChange={(e) => handleInputChange(e, 'upsellPage', 'videoUrl')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    )}
                                    {settings.upsellPage.mediaType === 'image' && (
                                        <div><label className="block text-sm font-medium text-gray-300 mb-1">URL da Imagem</label><input type="text" value={settings.upsellPage.imageUrl} onChange={(e) => handleInputChange(e, 'upsellPage', 'imageUrl')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    )}
                                    {settings.upsellPage.mediaType === 'none' && (
                                        <div><label className="block text-sm font-medium text-gray-300 mb-1">Subtítulo (quando não há mídia)</label><textarea value={settings.upsellPage.subtitleNoMedia || ''} onChange={(e) => handleInputChange(e, 'upsellPage', 'subtitleNoMedia')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2 h-24" /></div>
                                    )}
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Benefícios da Oferta (um por linha)</label><textarea value={settings.upsellPage.features.join('\n')} onChange={handleUpsellFeaturesChange} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2 h-32"></textarea></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Link do CTA (Checkout)</label><input type="text" value={settings.upsellPage.ctaLink} onChange={(e) => handleInputChange(e, 'upsellPage', 'ctaLink')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Preço Cheio (Ex: R$497,00)</label><input type="text" value={settings.upsellPage.fullPrice} onChange={(e) => handleInputChange(e, 'upsellPage', 'fullPrice')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-1">Preço Promocional (Ex: R$197,00)</label><input type="text" value={settings.upsellPage.promoPrice} onChange={(e) => handleInputChange(e, 'upsellPage', 'promoPrice')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                    <div className="flex items-center gap-4"><input id="installmentsEnabled" type="checkbox" checked={settings.upsellPage.installmentsEnabled} onChange={(e) => handleInputChange(e, 'upsellPage', 'installmentsEnabled')} className="h-4 w-4 text-brand bg-gray-700 border-gray-600 rounded focus:ring-brand" /><label htmlFor="installmentsEnabled" className="text-sm text-gray-300">Habilitar parcelamento</label></div>
                                    {settings.upsellPage.installmentsEnabled && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium text-gray-300 mb-1">Número de Parcelas</label><input type="number" value={settings.upsellPage.installmentsNumber} onChange={(e) => setSettings(p => ({...p, upsellPage: {...p.upsellPage, installmentsNumber: Number(e.target.value)}}))} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                            <div><label className="block text-sm font-medium text-gray-300 mb-1">Valor da Parcela</label><input type="text" value={settings.upsellPage.installmentsPrice} onChange={(e) => handleInputChange(e, 'upsellPage', 'installmentsPrice')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-dark-900 p-6 rounded-lg border border-gray-700"><h2 className="text-2xl font-bold mb-4">Depoimentos</h2><div className="space-y-6">{settings.testimonials.map((testimonial, index) => (<div key={index} className="relative p-4 border border-gray-700 rounded-md bg-dark-800"><button onClick={() => handleRemoveTestimonial(index)} title="Remover Depoimento" className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition-colors"><TrashIcon className="w-5 h-5"/></button><h3 className="font-bold text-lg mb-2">Depoimento {index + 1}</h3><div className="grid md:grid-cols-2 gap-4"><div><label className="text-sm font-medium text-gray-300 mb-1 block">Nome:</label><input type="text" value={testimonial.name} onChange={e => handleTestimonialChange(e, index, 'name')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div><div><label className="text-sm font-medium text-gray-300 mb-1 block">URL da Imagem:</label><input type="text" value={testimonial.image} onChange={e => handleTestimonialChange(e, index, 'image')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div><div className="md:col-span-2"><label className="text-sm font-medium text-gray-300 mb-1 block">Texto:</label><textarea value={testimonial.text} onChange={e => handleTestimonialChange(e, index, 'text')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2 h-20" /></div><div className="md:col-span-2"><label className="text-sm font-medium text-gray-300 mb-1 block">ID do Vídeo YouTube (Opcional):</label><input type="text" value={testimonial.videoId || ''} onChange={e => handleTestimonialChange(e, index, 'videoId')} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /></div></div></div>))}</div><div className="mt-6"><button onClick={handleAddTestimonial} className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded transition-colors"><PlusIcon className="w-5 h-5" /> Adicionar Novo Depoimento</button></div></div>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                         <div className="bg-dark-900 p-6 rounded-lg border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Configurações Gerais</h2>
                            <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
                                <div><label htmlFor="freeAccessDays" className="block text-sm font-medium text-gray-300 mb-1">Tempo de Acesso Gratuito (dias)</label><input type="number" id="freeAccessDays" value={settings.freeAccessDays} onChange={(e) => setSettings({...settings, freeAccessDays: Number(e.target.value)})} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /><p className="text-xs text-gray-500 mt-1">Defina 0 para acesso ilimitado.</p></div>
                                <div><label htmlFor="offerCountdownHours" className="block text-sm font-medium text-gray-300 mb-1">Duração da Oferta (horas)</label><input type="number" id="offerCountdownHours" value={settings.offerCountdownHours} onChange={(e) => setSettings({...settings, offerCountdownHours: Number(e.target.value)})} className="w-full bg-dark-700 border border-gray-600 rounded-md p-2" /><p className="text-xs text-gray-500 mt-1">Tempo do contador na Landing Page e Upsell.</p></div>
                                <div className="flex items-center mt-2"><input type="checkbox" id="vsl" checked={settings.landingPage.vslEnabled} onChange={(e) => handleInputChange(e, 'landingPage', 'vslEnabled')} className="h-4 w-4 text-brand bg-gray-700 border-gray-600 rounded focus:ring-brand" /><label htmlFor="vsl" className="ml-2 block text-sm text-gray-300">Ativar Vídeo de Vendas (VSL) na Landing Page</label></div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
