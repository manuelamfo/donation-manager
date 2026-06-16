import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleFakeSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            onLogin();
            navigate('/');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-50 px-4">
            <div className="w-full max-w-sm p-8 bg-white border border-zinc-200 rounded-lg shadow-sm">
                <div className="flex flex-col items-center text-center mb-8">
                    <img
                        src={logoImg}
                        alt="Logo"
                        className="h-30 w-auto object-contain mb-4 mx-auto"
                    />
                    <h1 className="text-2xl font-semibold text-black tracking-tight mb-1">
                        Bem vindo de volta!
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Insira suas credenciais para acessar a plataforma
                    </p>
                </div>

                <form onSubmit={handleFakeSubmit} className="flex flex-col gap-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="nome@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Senha"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit">
                        Entrar
                    </Button>
                </form>

            </div>
        </div>
    );
}