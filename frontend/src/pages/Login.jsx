import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

import Input from '../components/Input';
import Button from '../components/Button';

// 🚀 Importa a função isolada de requisição
import { loginUser } from '../services/api';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Executa a requisição limpa através do nosso Service
            const data = await loginUser(email, password);

            // Passa o token para a função do App.jsx e redireciona
            onLogin(data.access_token);
            navigate('/');
            
        } catch (err) {
            // O Axios guarda a resposta de erro do FastAPI em err.response.data
            const errorMessage = err.response?.data?.detail || 'Erro ao conectar com o servidor.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-50 px-4">
            <div className="w-full max-w-sm p-8 bg-white border border-zinc-200 rounded-lg shadow-sm">
                
                <div className="flex flex-col items-center text-center mb-8">
                    <img src={logoImg} alt="Logo" className="h-30 w-auto object-contain mb-4 mx-auto" />
                    <h1 className="text-2xl font-semibold text-black tracking-tight mb-1">Bem vindo de volta!</h1>
                    <p className="text-sm text-zinc-500">Insira suas credenciais para acessar a plataforma</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center font-medium">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        placeholder="nome@exemplo.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Senha"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                        }}
                        required
                        disabled={loading}
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>

            </div>
        </div>
    );
}