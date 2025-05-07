'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import { getCategories } from '@/services/categories';
import { getRetailStores } from '@/services/retailStores';


import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';

import PageHeader from '@/components/layout/PageHeader';

import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';

import { createProduct } from '@/services/products';

interface FormProductPayload {
    title: string;
    description: string;
    affiliate_link: string;
    resolved_link: string;
    image_url: string;
    image?: File | null;
    retail_store: number | '';
    category: number | '';
    subcategory: number | '';
    slug: string;
}

const detectStoreAndCategory = (url: string, storesList: any[]) => {
    if (!url || storesList.length === 0) return { store: '', category: '' };

    const lojaDetectada = storesList.find((store) => {
        const keyword = store.label.toLowerCase().replace(/\s+/g, '');
        return url.toLowerCase().includes(keyword);
    });

    return {
        store: lojaDetectada?.value || '',
        category: ''
    };
};

const generateSlug = (text: string) =>
    text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();

const PublishPage = () => {
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const [shortUrl, setShortUrl] = useState('');
    const [manualImage, setManualImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [useCustomImage, setUseCustomImage] = useState(false);
    const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);

    const [storesList, setStoresList] = useState([]);
    const [categoriesList, setCategoriesList] = useState<{ value: number; label: string; subcategories?: { name: string; id: number }[] }[]>([]);
    const [subcategoriesList, setSubcategoriesList] = useState<{ label: string; value: number }[]>([]);

    const [offerData, setOfferData] = useState({
        title: '',
        description: '',
        affiliate_link: '',
        resolved_link: '',
        image_url: '',
        image: '',
        retail_store: '',
        category: '',
        active: true,
        slug: ''
    });

    const { control, setValue, handleSubmit, formState: { errors }, reset } = useForm<FormProductPayload>({ mode: 'onChange' });

    useEffect(() => {

        const fetchInitialData = async () => {
            try {
                const [categoriesRes, storesRes] = await Promise.all([
                    getCategories(),
                    getRetailStores()
                ]);
                const formattedCategories = categoriesRes.data
                    .map((cat: any) => ({
                        ...cat,
                        label: cat.name,
                        value: cat.id
                    }))
                    .sort((a: any, b: any) => a.label.localeCompare(b.label));
                const formattedStores = storesRes.data
                    .map((store: any) => ({
                        ...store,
                        label: store.name,
                        value: store.id
                    }))
                    .sort((a: any, b: any) => a.label.localeCompare(b.label));

                setCategoriesList(formattedCategories);
                setStoresList(formattedStores);
                setSubcategoriesList([]);
            } catch (err) {
                console.error('Erro ao buscar dados iniciais:', err);
            }
        };

        fetchInitialData();
    }, []);

    const resetForm = () => {
        setOfferData({
            title: '',
            description: '',
            affiliate_link: '',
            resolved_link: '',
            image_url: '',
            image: '',
            retail_store: '',
            category: '',
            active: true,
            slug: ''
        });
        setManualImage('');
        setShortUrl('');
        setImageFile(null);
        setCustomImagePreview(null);
        setSubcategoriesList([]);
        reset({
            title: '',
            description: '',
            affiliate_link: '',
            resolved_link: '',
            image_url: '',
            retail_store: '',
            category: '',
            subcategory: '',
            slug: ''
        });
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
            const { store, category } = detectStoreAndCategory(url, storesList);

            setOfferData({ title, description, affiliate_link: shortUrl, resolved_link: url, image_url: image, image: '', retail_store: store, category, active: true, slug: '' });

            setValue('title', title || '');
            const generatedSlug = generateSlug(title || '');
            setValue('slug', generatedSlug);

            setValue('description', description || '');
            setValue('resolved_link', url || shortUrl);
            setValue('retail_store', store);
            setValue('category', Number(category));

            setValue('affiliate_link', shortUrl);
            setValue('image_url', image || '');

            if (!title && !description) {
                toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os dados manualmente.', life: 4000 });
            }

        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 5000 });
        }

        setIsLoading(false);
    };

    const submitForm = async (data: FormProductPayload) => {
        const generatedSlug = generateSlug(data.title || '');

        if (!data.slug) {
            setValue('slug', generatedSlug);
            data.slug = generatedSlug;
        }

        let imageUrl = data.image_url || manualImage;

        if (useCustomImage && imageFile) {
            const formData = new FormData();
            formData.append('files', imageFile);

            try {
                const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                imageUrl = uploadRes.data?.[0]?.url || imageUrl;
            } catch (uploadErr) {
                toast.current?.show({ severity: 'error', summary: 'Erro ao fazer upload da imagem', detail: 'Tente novamente.', life: 4000 });
                return;
            }
        }

        if (!imageUrl && !imageFile) {
            toast.current?.show({ severity: 'warn', summary: 'Imagem obrigatória', detail: 'Adicione uma imagem.', life: 3000 });
            return;
        }

        createProduct({
            title: data.title,
            description: data.description,
            affiliate_link: data.affiliate_link,
            resolved_link: data.resolved_link,
            image_url: imageUrl,
            active: true,
            slug: data.slug,
            categoryId: data.category,
            subcategoryId: data.subcategory,
            retailStoreId: data.retail_store,
        })
            .then(() => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto cadastrado com sucesso!', life: 3000 });
                resetForm();
            })
            .catch((err) => {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar produto.', life: 5000 });
                console.error('Erro ao salvar produto:', err);
            });
    };

    return (
        <>
            <PageHeader title="Publicar Oferta" onBack={() => router.back()} />
            <div className="container mx-auto px-4 py-6">

                <Toast ref={toast} />

                {!offerData.resolved_link && (
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

                {offerData.resolved_link && (
                    <form onSubmit={handleSubmit(submitForm)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Controller name="affiliate_link" control={control} render={({ field }) => <input type="hidden" {...field} />} />
                        <Controller name="resolved_link" control={control} render={({ field }) => <input type="hidden" {...field} />} />
                        <Controller name="image_url" control={control} render={({ field }) => <input type="hidden" {...field} />} />
                        <Controller name="slug" control={control} render={({ field }) => <input type="hidden" {...field} />} />
                        <Controller name="subcategory" control={control} render={({ field }) => <input type="hidden" {...field} />} />

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full">
                                {!useCustomImage && (offerData.image_url || manualImage) ? (
                                    <Image src={offerData.image_url || manualImage} alt="Imagem da oferta" preview className="w-full rounded-lg" />
                                ) : useCustomImage && customImagePreview ? (
                                    <Image src={customImagePreview} alt="Imagem da oferta" preview className="w-full rounded-lg" />
                                ) : (
                                    <div className="text-center text-gray-400">Sem imagem</div>
                                )}
                            </div>
                            <div className="w-full mt-2 flex items-center">
                                <Checkbox inputId="useCustomImage" checked={useCustomImage} onChange={(e) => setUseCustomImage(!!e.checked)} />
                                <label htmlFor="useCustomImage" className="ml-2">Usar minha própria imagem</label>
                            </div>
                            {useCustomImage && (
                                <div className="w-full mt-2">
                                    <label htmlFor="imageUpload" className="block mb-1 font-medium">Upload da imagem</label>
                                    <label
                                        htmlFor="imageUpload"
                                        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
                                    >
                                        Selecionar imagem
                                    </label>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const file = e.target.files[0];
                                                setImageFile(file);
                                                setCustomImagePreview(URL.createObjectURL(file));
                                            } else {
                                                setImageFile(null);
                                                setCustomImagePreview(null);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    {imageFile && <p className="mt-2 text-sm text-green-600">{imageFile.name}</p>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label>Loja</label>
                                <Controller
                                    name="retail_store"
                                    control={control}
                                    rules={{ required: 'Loja obrigatória' }}
                                    render={({ field }) => (
                                        <Dropdown
                                            {...field}
                                            options={storesList}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Selecione a loja"
                                            className={`w-full ${errors.retail_store ? 'p-invalid' : ''}`}
                                            disabled={!!offerData.retail_store}
                                        />
                                    )}
                                />
                                {errors.retail_store && <small className="text-red-500">{errors.retail_store.message?.toString()}</small>}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label>Categoria</label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: 'Categoria obrigatória' }}
                                        render={({ field }) => {
                                            const handleCategoryChange = (e: any) => {
                                                field.onChange(e.value);
                                                const selected = categoriesList.find((cat: { value: number; subcategories?: any[] }) => cat.value === e.value);
                                                setSubcategoriesList((selected?.subcategories || []).map((sub: any) => ({
                                                    label: sub.name,
                                                    value: sub.id
                                                })));
                                                setValue('subcategory', '');
                                            };
                                            return (
                                                <Dropdown
                                                    value={field.value}
                                                    onChange={handleCategoryChange}
                                                    options={categoriesList}
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    placeholder="Selecione a categoria"
                                                    className={`w-full ${errors.category ? 'p-invalid' : ''}`}
                                                />
                                            );
                                        }}
                                    />
                                    {errors.category && <small className="text-red-500">{errors.category.message?.toString()}</small>}
                                </div>

                                <div className="flex-1">
                                    <label>Subcategoria</label>
                                    <Controller
                                        name="subcategory"
                                        control={control}
                                        rules={{ required: 'Subcategoria obrigatória' }}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={subcategoriesList}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Selecione a subcategoria"
                                                className={`w-full ${errors.subcategory ? 'p-invalid' : ''}`}
                                            />
                                        )}
                                    />
                                    {errors.subcategory && <small className="text-red-500">{errors.subcategory.message?.toString()}</small>}
                                </div>
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
                                <div className="flex justify-end gap-4 mt-4">
                                    <Button type="button" label="Cancelar" className="p-button-secondary w-32" onClick={resetForm} />
                                    <Button type="submit" label="Publicar" className="p-button-success w-32" />
                                </div>
                            </div>
                        </div>


                    </form>
                )}

            </div>
        </>
    );
};

export default PublishPage;
