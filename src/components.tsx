import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Lesson } from './types.ts';
import { useNavigate } from 'react-router-dom';

// ========= ICONS (SVG Components) =========
export const LockIcon = ({className = 'w-8 h-8'}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
export const PlayIcon = ({className = 'w-12 h-12'}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M8 5v14l11-7z"></path></svg>
);
export const CheckCircleIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
export const PlayCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-white text-opacity-80 hover:text-opacity-100 transition-opacity">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
        <path d="m9 17 8-5-8-5z"></path>
    </svg>
);

export const ChevronLeftIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export const ChevronRightIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export const PlusIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export const StarIcon = ({className = 'w-6 h-6'}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.966-7.417 3.966 1.481-8.279-6.064-5.828 8.332-1.151z"/>
    </svg>
);

export const UsersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16.5 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export const TrendingUpIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

// ========= HELPER FUNCTIONS =========
export const calculateBMI = (weight: number, height: number) => {
    if(height <= 0) return 0;
    return weight / ((height / 100) * (height / 100));
};

export const calculateIdealWeight = (height: number) => {
    const min = 18.5 * ((height / 100) * (height / 100));
    const max = 24.9 * ((height / 100) * (height / 100));
    return `${min.toFixed(1)}kg - ${max.toFixed(1)}kg`;
};

const escapeCsvCell = (cell: any): string => {
    if (cell === null || cell === undefined) {
        return '';
    }
    const cellStr = String(cell);
    // If the cell contains a comma, a double quote, or a newline, wrap it in double quotes.
    if (cellStr.search(/("|,|\n)/g) >= 0) {
        // Escape any double quotes within the string by doubling them.
        return `"${cellStr.replace(/"/g, '""')}"`;
    }
    return cellStr;
};

export const exportToCSV = (users: User[], lessons: Lesson[]) => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Data de Cadastro', 'Progresso (%)', 'IMC', 'Peso Ideal', 'Objetivo', 'Nível Atividade', 'Qualidade Sono', 'Qualidade Alimentação', 'Local de Treino'];
    const nonVipLessons = lessons.filter(l => !l.isVip);
    
    const rows = users.map(user => {
        const progressPercent = nonVipLessons.length > 0 ? (user.progress.length / nonVipLessons.length) * 100 : 0;
        const rowData = [
            user.name,
            user.email,
            user.whatsapp,
            new Date(user.registrationDate).toLocaleDateString('pt-BR'),
            progressPercent.toFixed(0),
            user.assessment?.imc ? user.assessment.imc.toFixed(2) : 'N/A',
            user.assessment?.idealWeight || 'N/A',
            user.assessment?.goal || 'N/A',
            user.assessment?.activityLevel || 'N/A',
            user.assessment?.sleepQuality || 'N/A',
            user.assessment?.foodQuality || 'N/A',
            user.assessment?.trainingLocation || 'N/A'
        ];
        return rowData.map(escapeCsvCell).join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alunos_fitconsult.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


// ========= REUSABLE UI COMPONENTS =========
export const Modal: React.FC<{ isOpen: boolean; onClose?: () => void; children: React.ReactNode; size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' }> = ({ isOpen, onClose, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClass = {
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl'
    }[size];

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
            <div className={`bg-dark-900 rounded-lg shadow-xl w-full ${sizeClass} p-6 my-8 relative`} onClick={e => e.stopPropagation()}>
                {onClose && <button onClick={onClose} className="absolute top-2 right-4 text-white text-3xl hover:text-gray-300 z-10">&times;</button>}
                {children}
            </div>
        </div>
    );
};

export const UpsellRedirectModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/upsell');
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="text-center">
                <StarIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-heading mb-2">Conteúdo Exclusivo VIP</h2>
                <p className="text-gray-300 mb-6">
                    Esta aula faz parte do nosso programa premium. Faça o upgrade agora para ter acesso completo e acelerar seus resultados!
                </p>
                <CTAButton onClick={handleRedirect} className="w-full">
                    Quero Fazer Upgrade Agora
                </CTAButton>
            </div>
        </Modal>
    );
};


export const CountdownTimer: React.FC<{ targetDate: number; onComplete?: () => void, large?: boolean }> = ({ targetDate, onComplete, large = false }) => {
    const calculateTimeLeft = useCallback(() => {
        const difference = targetDate - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
    useEffect(() => {
        const timer = setTimeout(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
                if(onComplete) onComplete();
            }
        }, 1000);
        return () => clearTimeout(timer);
    });
    
    const combinedHours = timeLeft.days * 24 + timeLeft.hours;
    const numberClass = large ? 'text-5xl' : 'text-2xl';
    const labelClass = large ? 'text-sm' : 'text-xs';


    return (
        <div className="flex items-center justify-center space-x-2 font-heading">
            <div className="text-center">
                <span className={numberClass}>{String(combinedHours).padStart(2, '0')}</span>
                <span className={`block ${labelClass} text-gray-400`}>Horas</span>
            </div>
            <span className={`${numberClass} text-brand-light pb-2`}>:</span>
            <div className="text-center">
                 <span className={numberClass}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                 <span className={`block ${labelClass} text-gray-400`}>Minutos</span>
            </div>
            <span className={`${numberClass} text-brand-light pb-2`}>:</span>
            <div className="text-center">
                <span className={numberClass}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                 <span className={`block ${labelClass} text-gray-400`}>Segundos</span>
            </div>
        </div>
    );
};

export const YouTubeEmbed: React.FC<{ videoId: string }> = ({ videoId }) => (
    <div className="aspect-video w-full">
        <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&showinfo=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        ></iframe>
    </div>
);

export const CTAButton: React.FC<{ children: React.ReactNode; onClick?: () => void, className?: string, type?: 'button' | 'submit' | 'reset', disabled?: boolean }> = ({ children, onClick, className = '', type = 'button', disabled }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full font-bold uppercase text-white bg-brand hover:bg-brand-dark transition-all duration-300 transform hover:scale-105 rounded-lg text-lg py-4 px-8 shadow-lg shadow-brand/30 hover:shadow-brand/50 ${className}`}
  >
    {children}
  </button>
);

// ========= NEW LINE-ART ICONS =========
export const MetabolismIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
export const NutritionIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20.94c1.5 0 2.75-1.12 2.75-2.69 0-1.5-1.5-2.42-2.75-2.42-1.25 0-2.75.92-2.75 2.42 0 1.57 1.25 2.69 2.75 2.69z"/><path d="M12 3.06C7 3.06 5 8 5 9.5c0 3.12 3 5.5 7 5.5s7-2.38 7-5.5C19 8 17 3.06 12 3.06z"/><path d="M12 3a1.5 1.5 0 0 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>;
export const MindsetIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a10 10 0 0 0-4.32 19.14"/><path d="M12 2a10 10 0 0 1 4.32 19.14"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/><circle cx="12" cy="12" r="4"/><path d="M12 16a2 2 0 0 0 2-2"/><path d="M12 8a2 2 0 0 0-2 2"/><path d="M16 12a2 2 0 0 0-2-2"/><path d="M8 12a2 2 0 0 0 2 2"/></svg>;
export const EnergyIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
export const WaistlineIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
export const WeightLossIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><path d="M18.7 8a5 5 0 0 1-6.4 2.3L7 15.4V11l-4 4 4 4v-4.4l5.3-5.3c.6-.6 1.5-.7 2.2-.4l3.2 1.6"/></svg>;
export const ConfidenceIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
export const SleepIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>;
export const SpeedIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/><path d="M14 12v.01"/><path d="m15.5 13.5.01.01"/><path d="M10 12v.01"/><path d="m8.5 13.5.01.01"/><path d="M7 12v.01"/><path d="M5.5 10.5.01.01"/><path d="M17 12v.01"/><path d="m18.5 10.5.01.01"/></svg>;

export const ArrowRightIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
export const CheckIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>;
export const ArrowUpIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;

export const RatingSlider: React.FC<{
  label: string;
  name: string;
  valueLabels: string[];
  defaultValue?: number;
}> = ({ label, name, valueLabels, defaultValue = 3 }) => {
  const [value, setValue] = useState(defaultValue);
  const min = 1;
  const max = valueLabels.length;
  const currentValueLabel = valueLabels[value - 1] || '';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}: <span className="font-bold text-brand">{currentValueLabel}</span>
      </label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer range-lg accent-brand"
      />
       <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
        <span>{valueLabels[0]}</span>
        <span>{valueLabels[valueLabels.length - 1]}</span>
      </div>
    </div>
  );
};


// ========= NETFLIX-STYLE DASHBOARD COMPONENTS =========
export const ProgressBar: React.FC<{
    value: number;
    max: number;
    label: string;
}> = ({ value, max, label }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className="text-sm font-bold text-white">{value} / {max}</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2.5">
                <div 
                    className="bg-brand h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export const MiniProgressBar: React.FC<{ percentage: number; tooltip?: string }> = ({ percentage, tooltip }) => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    return (
        <div className="w-full bg-dark-700 rounded-full h-2.5" title={tooltip || `${clampedPercentage.toFixed(0)}%`}>
            <div
                className="bg-brand h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${clampedPercentage}%` }}
            ></div>
        </div>
    );
};

export const LessonCard: React.FC<{ 
    lesson: Lesson;
    isLocked: boolean;
    isCompleted: boolean;
    onClick: () => void;
}> = ({ lesson, isLocked, isCompleted, onClick }) => {
    return (
        <div
            className="group relative flex-shrink-0 w-64 h-36 rounded-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 shadow-lg"
            onClick={onClick}
            role="button"
            aria-label={lesson.title}
        >
            <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
                <h3 className="text-white font-bold text-sm leading-tight">{lesson.title}</h3>
            </div>

            {isCompleted && (
                <div className="absolute top-2 right-2 flex items-center bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <CheckIcon className="w-3 h-3 mr-1"/> Concluída
                </div>
            )}

            {lesson.isVip && !isCompleted && (
                 <div className="absolute top-2 left-2 flex items-center bg-yellow-400/90 text-dark-900 text-xs font-bold px-2 py-1 rounded-full">
                    <StarIcon className="w-3 h-3 mr-1"/> VIP
                </div>
            )}
            
            {isLocked && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                    <LockIcon className="w-10 h-10 text-gray-300" />
                </div>
            )}
        </div>
    );
};

export const Carousel: React.FC<{
    title: string;
    children: React.ReactNode;
}> = ({ title, children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth 
                : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };
    
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="relative group">
                <button 
                    onClick={() => scroll('left')}
                    className="absolute top-0 bottom-0 left-0 z-10 w-12 bg-gradient-to-r from-dark-800 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label="Scroll left"
                >
                    <ChevronLeftIcon className="w-8 h-8"/>
                </button>
                <div 
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-auto pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {children}
                </div>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute top-0 bottom-0 right-0 z-10 w-12 bg-gradient-to-l from-dark-800 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label="Scroll right"
                >
                    <ChevronRightIcon className="w-8 h-8"/>
                </button>
            </div>
        </div>
    );
};