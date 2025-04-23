'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import React, { useState, useRef } from 'react';
import axios from 'axios';

import { OfferModel } from '@/models/offer.model';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from 'primereact/inputicon';

const affiliateStores = [
    { label: 'Shopee', value: 'shopee' },
    { label: 'Amazon', value: 'amazon' },
    { label: 'Magazine Luiza', value: 'magazineluiza' },
];

const categories = [
    { label: 'Eletrônicos', value: 'eletronicos' },
    { label: 'Moda', value: 'moda' },
    { label: 'Casa e Decoração', value: 'casa' },
    { label: 'Saúde e Beleza', value: 'beleza' },
];

const detectStoreAndCategory = (url: string) => {
    if (url.startsWith('https://amzn.to/') || url.includes('amzn.to') || url.includes('amazon')) return { store: 'amazon', category: '', locked: true };
    if (url.startsWith('https://s.shopee.com.br/') || url.includes('s.shopee.com.br') || url.includes('shopee')) return { store: 'shopee', category: '', locked: true };
    if (url.startsWith('https://divulgador.magalu.com/') || url.includes('magalu') || url.includes('magazineluiza'))
        return { store: 'magazineluiza', category: '', locked: true };

    return { store: '', category: '', locked: false };
};

const PublishPage = () => {
    const [shortUrl, setShortUrl] = useState('');
    const [offerData, setOfferData] = useState<OfferModel>({
        title: '',
        description: '',
        image: '',
        url: '',
        store: '',
        category: '',
        storeLocked: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [manualImage, setManualImage] = useState('');
    const toast = useRef<Toast>(null);
    const { handleSubmit, control, setValue, reset, formState: { errors } } = useForm({ mode: 'onChange' });

    const router = useRouter();


    const initialOfferData = (): OfferModel => {
        return { title: '', description: '', image: '', url: '', store: '', category: '', storeLocked: false };
    }

    function resetOfferData() {
        setOfferData(initialOfferData());
        setValue('title', '');
        setValue('description', '');
        setValue('url', '');
        setValue('store', '');
        setValue('category', '');
        setManualImage('');
    }

    const fetchOfferData = async () => {
        if (!shortUrl) {
            toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Por favor, insira um link válido.', life: 3000 });
            return;
        }

        resetOfferData();
        setIsLoading(true);

        try {
            const response = await axios.post('https://api.linkpreview.net', null, {
                params: { q: shortUrl },
                headers: { 'X-Linkpreview-Api-Key': '8a9c62467f729b7fbbed1ca5509d5501' }
            });

            const { title, description, image, url } = response.data;
            const { store, category, locked } = detectStoreAndCategory(url);

            if (!title && !description) {
                toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Não foi possível recuperar os dados. Preencha manualmente.', life: 4000 });
            }

            const updatedOfferData = { title, description, image, url, store, category, storeLocked: locked };
            setOfferData(updatedOfferData);

            setValue('title', title || '');
            setValue('description', description || '');
            setValue('url', url || '');
            setValue('store', store);
            setValue('category', category);
        } catch (error) {
            console.error('Erro ao buscar dados da oferta:', error);
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar os dados. Adicione manualmente.', life: 5000 });
        }
        setIsLoading(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function submitForm(data: any) {
        const finalImage = offerData.image || manualImage;

        if (!finalImage) {
            toast.current?.show({ severity: 'warn', summary: 'Imagem necessária', detail: 'Adicione uma imagem para o produto.', life: 3000 });
            return;
        }

        const payload = {
            ...data,
            image: finalImage,
            shortUrl
        };

        console.log('Enviando dados ao backend:', payload);

        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Oferta publicada com sucesso!', life: 3000 });

        // Simulated backend request
        // axios.post('/api/offers', payload);
    }

    function handleBackToHome() {
        reset();
        resetOfferData();
        setShortUrl('');
        router.push('/');
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Toast ref={toast} />

            <Card className="w-4/5 mx-auto p-5 shadow-md">
                <h2 className="text-center mb-5">Publicar Oferta</h2>

                <div className="flex gap-2 mb-4">
                    <div className="flex w-full">
                        <IconField iconPosition="left" className="w-full">
                            <InputIcon className="pi pi-search" />
                            <InputText value={shortUrl}
                                onChange={(e) => setShortUrl(e.target.value)}
                                placeholder="Cole o link da oferta aqui" className="w-full input-focus" />
                        </IconField>
                    </div>
                    <Button
                        label={'Avançar'}
                        onClick={fetchOfferData}
                        disabled={isLoading}
                        className="p-button-primary"
                    />
                </div>


                {offerData.url && (
                    <form onSubmit={handleSubmit(submitForm)} className="grid grid-cols-1 gap-4">
                        {/* Store and Category Dropdowns side by side */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-field">
                                <label htmlFor="store">Loja:</label>
                                <Controller
                                    name="store"
                                    control={control}
                                    rules={{ required: 'Loja é obrigatória' }}
                                    render={({ field }) => (
                                        <Dropdown
                                            {...field}
                                            options={affiliateStores}
                                            placeholder="Selecione a loja"
                                            className={`w-full input-focus ${errors.store ? 'p-invalid' : ''}`}
                                            disabled={offerData.storeLocked}
                                        />
                                    )}
                                />
                                {errors.store && <small className="text-red-500">{errors.store.message?.toString()}</small>}
                            </div>
                            <div className="p-field">
                                <label htmlFor="category">Categoria:</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: 'Categoria é obrigatória' }}
                                    render={({ field }) => <Dropdown {...field} options={categories} placeholder="Selecione a categoria" className={`w-full input-focus ${errors.category ? 'p-invalid' : ''}`} />}
                                />
                                {errors.category && <small className="text-red-500">{errors.category.message?.toString()}</small>}
                            </div>
                        </div>

                        <div className="p-field">
                            <label htmlFor="title">Título:</label>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'Título é obrigatório' }}
                                render={({ field }) => <InputText {...field} placeholder="Digite um título" className={`w-full input-focus ${errors.title ? 'p-invalid' : ''}`} />}
                            />
                            {errors.title && <small className="text-red-500">{errors.title.message?.toString()}</small>}

                        </div>

                        <div className="p-field">
                            <label htmlFor="description">Descrição:</label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'Descrição é obrigatória' }}
                                render={({ field }) => <InputText {...field} placeholder="Digite uma descrição" className={`w-full input-focus ${errors.description ? 'p-invalid' : ''}`} />}
                            />
                            {errors.description && <small className="text-red-500">{errors.description.message?.toString()}</small>}
                        </div>


                        {offerData.image || manualImage ? <Image src={offerData.image || manualImage} alt="Preview" preview className="w-full max-w-xs" /> : <p>Sem imagem</p>}

                        <div className="flex justify-between mt-4">
                            <Button type="button" label="Voltar para Home" className="p-button-secondary" onClick={handleBackToHome} />
                            <Button type="submit" label="Publicar Oferta" className="p-button-success" />
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default PublishPage;
