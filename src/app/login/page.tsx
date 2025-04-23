

'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useState } from 'react';

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

    const onSubmit = (data: LoginForm) => {
        setLoading(true);
        console.log('Login:', data);
        setTimeout(() => {
            router.push('/profile/promotions');
        }, 1000);
    };

    return (
        <>
            <div className="flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-6">
                    <h1 className="text-xl font-bold mb-4 text-center">Área de Afiliados</h1>

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


                        <p className="text-sm text-gray-500 my-6 text-center">
                            Acesso restrito. Somente usuários autorizados podem publicar promoções e links de afiliados.
                        </p>

                        <Button
                            label="Entrar"
                            type="submit"
                            loading={loading}
                            disabled={!isValid || loading}
                            className="w-full"
                        />
                    </form>


                </div>


            </div>

            <div className="p-4 mb-4">
                <div className="bg-gray-100 border border-dashed border-gray-300 p-6 rounded text-center text-sm text-gray-500">
                    {/* Substitua pelo código real do Google Ads aqui */}
                    {/* <AdSense /> */}
                    Espaço reservado para anúncio Google Ads

                </div>
            </div></>
    );
}