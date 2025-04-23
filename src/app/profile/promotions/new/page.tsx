'use client';

import React, { useState, useRef } from 'react';

import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';

import { OfferModel } from '@/models/offer.model';
import PageHeader from '@/components/layout/PageHeader';

import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';


const affiliateStores = [
    { label: 'Shopee', value: 'shopee' },
    { label: 'Amazon', value: 'amazon' },
    { label: 'Magazine Luiza', value: 'magazineluiza' }
];

const categories = [
    { label: 'Eletrônicos', value: 'eletronicos' },
    { label: 'Moda', value: 'moda' },
    { label: 'Casa e Decoração', value: 'casa' },
    { label: 'Saúde e Beleza', value: 'beleza' }
];

const detectStoreAndCategory = (url: string) => {
    if (url.includes('amazon')) return { store: 'amazon', category: '', locked: true };
    if (url.includes('shopee')) return { store: 'shopee', category: '', locked: true };
    if (url.includes('magalu')) return { store: 'magazineluiza', category: '', locked: true };
    return { store: '', category: '', locked: false };
};

const PublishPage = () => {
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const [shortUrl, setShortUrl] = useState('');
    const [manualImage, setManualImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [offerData, setOfferData] = useState<OfferModel>({
        title: '',
        description: '',
        image: '',
        url: '',
        store: '',
        category: '',
        storeLocked: false
    });

    const { control, setValue, handleSubmit, formState: { errors }, reset } = useForm({ mode: 'onChange' });

    const resetForm = () => {
        setOfferData({ title: '', description: '', image: '', url: '', store: '', category: '', storeLocked: false });
        setManualImage('');
        setShortUrl('');
        reset();
    };

    const fetchOfferData = async () => {
        if (!shortUrl) {
            toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Insira um link válido.', life: 3000 });
            return;
        }

        resetForm();
        setIsLoading(true);

        try {
            const response = await axios.post('https://api.linkpreview.net', null, {
                params: { q: shortUrl },
                headers: { 'X-Linkpreview-Api-Key': '8a9c62467f729b7fbbed1ca5509d5501' }
            });

            const { title, description, image, url } = response.data;
            const { store, category, locked } = detectStoreAndCategory(url);

            setOfferData({ title, description, image, url, store, category, storeLocked: locked });

            setValue('title', title || '');
            setValue('description', description || '');
            setValue('url', url || '');
            setValue('store', store);
            setValue('category', category);

            if (!title && !description) {
                toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os dados manualmente.', life: 4000 });
            }

        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar dados.', life: 5000 });
        }

        setIsLoading(false);
    };

    const submitForm = (data: any) => {
        const finalImage = offerData.image || manualImage;
        if (!finalImage) {
            toast.current?.show({ severity: 'warn', summary: 'Imagem obrigatória', detail: 'Adicione uma imagem.', life: 3000 });
            return;
        }

        const payload = { ...data, image: finalImage, shortUrl };
        console.log('Payload enviado:', payload);

        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Oferta publicada!', life: 3000 });
        // axios.post('/api/offers', payload);
    };

    return (
        <>
            <PageHeader title="Publicar Oferta" onBack={() => router.back()} />
            <div className="container mx-auto px-4 py-6">

                <Toast ref={toast} />

                {!offerData.url && (
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch">
                        <div className="flex-1">
                            <IconField iconPosition="left" className="w-full">
                                <InputIcon className="pi pi-search" />
                                <InputText
                                    value={shortUrl}
                                    onChange={(e) => setShortUrl(e.target.value)}
                                    placeholder="Cole aqui o link da oferta"
                                    className="w-full input-focus"
                                />
                            </IconField>
                        </div>
                        <Button label="Avançar" onClick={fetchOfferData} disabled={isLoading} />
                    </div>
                )}

                {offerData.url && (
                    <form onSubmit={handleSubmit(submitForm)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full">
                                {offerData.image || manualImage ? (
                                    <Image src={offerData.image || manualImage} alt="Imagem da oferta" preview className="w-full rounded-lg" />
                                ) : (
                                    <div className="text-center text-gray-400">Sem imagem</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label>Loja</label>
                                <Controller
                                    name="store"
                                    control={control}
                                    rules={{ required: 'Loja obrigatória' }}
                                    render={({ field }) => (
                                        <Dropdown {...field} options={affiliateStores} placeholder="Selecione a loja" className={`w-full ${errors.store ? 'p-invalid' : ''}`} disabled={offerData.storeLocked} />
                                    )}
                                />
                                {errors.store && <small className="text-red-500">{errors.store.message?.toString()}</small>}
                            </div>

                            <div>
                                <label>Categoria</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: 'Categoria obrigatória' }}
                                    render={({ field }) => (
                                        <Dropdown {...field} options={categories} placeholder="Selecione a categoria" className={`w-full ${errors.category ? 'p-invalid' : ''}`} />
                                    )}
                                />
                                {errors.category && <small className="text-red-500">{errors.category.message?.toString()}</small>}
                            </div>

                            <div>
                                <label>Título</label>
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{ required: 'Título obrigatório' }}
                                    render={({ field }) => (
                                        <InputText {...field} placeholder="Digite o título da promoção" className={`w-full ${errors.title ? 'p-invalid' : ''}`} />
                                    )}
                                />
                                {errors.title && <small className="text-red-500">{errors.title.message?.toString()}</small>}
                            </div>

                            <div>
                                <label>Descrição</label>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: 'Descrição obrigatória' }}
                                    render={({ field }) => (
                                        <InputText {...field} placeholder="Descreva sua promoção" className={`w-full ${errors.description ? 'p-invalid' : ''}`} />
                                    )}
                                />
                                {errors.description && <small className="text-red-500">{errors.description.message?.toString()}</small>}
                            </div>
                        </div>


                    </form>
                )}

                {offerData.url && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button type="button" label="Cancelar" className="p-button-secondary w-32" onClick={resetForm} />
                        <Button type="submit" label="Publicar" className="p-button-success w-32" />
                    </div>
                )}
            </div>
        </>
    );
};

export default PublishPage;
