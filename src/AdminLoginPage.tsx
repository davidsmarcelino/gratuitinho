
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CTAButton } from './components.tsx';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({ login: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Credentials check
        if (formData.login === 'aptus' && formData.password === 'nico123') {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Login ou senha incorretos.');
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-dark-800 p-8 rounded-lg border border-gray-700 shadow-lg">
                <h1 className="text-3xl font-heading text-center text-white mb-6">Acesso Restrito</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-md text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="login" className="sr-only">Login</label>
                        <input
                            id="login"
                            name="login"
                            type="text"
                            autoComplete="username"
                            required
                            value={formData.login}
                            onChange={handleChange}
                            placeholder="Login"
                            className="w-full bg-dark-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Senha</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Senha"
                            className="w-full bg-dark-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand focus:outline-none"
                        />
                    </div>
                    <CTAButton type="submit">Entrar</CTAButton>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
