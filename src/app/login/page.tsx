

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

import { login } from '@/services/auth';
import { ROUTES } from '@/shared/routes';

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginForm>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await login(data.email, data.password);
            localStorage.setItem('token', response.access_token);
            // localStorage.setItem('user', JSON.stringify(response.user));
            router.push(ROUTES.PROFILE.PROMOTIONS);
        } catch (error: any) {
            setErrorMessage('E-mail ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-6">
                <h1 className="text-xl font-bold mb-4 text-center">Área de Afiliados</h1>

                <p className="text-sm text-gray-500 my-6 text-center">
                    Acesso restrito. Somente usuários autorizados podem publicar promoções e links de afiliados.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">E-mail</label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Informe seu e-mail',
                                pattern: {
                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: 'E-mail inválido'
                                }
                            }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    placeholder="seu@email.com"
                                    className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                                />
                            )}
                        />
                        {errors.email && <small className="text-red-500">{errors.email.message}</small>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Senha</label>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: 'Informe sua senha' }}
                            render={({ field }) => (
                                <Password
                                    {...field}
                                    toggleMask
                                    feedback={false}
                                    placeholder="••••••••"
                                    className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                                    inputClassName="w-full"
                                />
                            )}
                        />
                        {errors.password && <small className="text-red-500">{errors.password.message}</small>}
                    </div>

                    <Button
                        label="Entrar"
                        type="submit"
                        loading={loading}
                        disabled={!isValid || loading}
                        className="w-full"
                    />
                    {errorMessage && (
                        <div className="text-red-500 text-sm text-center mt-2">{errorMessage}</div>
                    )}
                </form>


            </div>


        </div>
    );
}