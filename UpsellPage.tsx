

import React from 'react';
import { useApp } from './context.tsx';
import { CountdownTimer, CTAButton, CheckIcon } from './components.tsx';

// --- ETAPA 4: Upsell Page ---
const UpsellPage = () => {
    const { state } = useApp();
    const { upsellPage } = state.settings;
    const offerEndDate = Date.now() + state.settings.offerCountdownHours * 60 * 60 * 1000;
    
    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center bg-dark-800 p-6 md:p-10 rounded-lg border border-gray-700 shadow-2xl">
                <h1 className="text-3xl md:text-5xl font-heading text-brand mb-4">{upsellPage.title}</h1>
                <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">{upsellPage.subtitle}</p>
                <div className="mb-8">
                    <iframe className="w-full aspect-video rounded-lg" src={upsellPage.videoUrl} title="Premium Offer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
                
                 <div className="my-8 text-left max-w-lg mx-auto">
                    <h3 className="text-2xl font-bold text-white text-center mb-6">O que você vai receber:</h3>
                    <ul className="space-y-3">
                        {upsellPage.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                <span className="text-gray-300 text-lg">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-8 bg-dark-900/50 border border-dark-700 rounded-lg py-6">
                    <p className="text-gray-400 text-xl">De <span className="line-through">{upsellPage.fullPrice}</span> por apenas:</p>
                    <p className="text-6xl font-bold text-brand my-2">{upsellPage.promoPrice}</p>
                    <p className="text-gray-300">ou 12x de R$19,70</p>
                </div>
                <div className="mb-8">
                    <h3 className="text-2xl font-heading text-white mb-4">ESTA OFERTA EXPIRA EM:</h3>
                    <CountdownTimer targetDate={offerEndDate} large />
                </div>
                <CTAButton onClick={() => alert('Redirecionando para o checkout...')}>
                    QUERO ENTRAR AGORA E GARANTIR MEU DESCONTO
                </CTAButton>
            </div>
        </div>
    );
};

export default UpsellPage;