'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

import ListPromotions from '@/components/listPromotions';
import { ROUTES } from '@/shared/routes';

const MyPromotionsPage = () => {
    const router = useRouter();

    return (
        <section className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Meus Oferticandos</h1>
                <Button
                    text
                    icon="pi pi-plus"
                    className="!text-orange-500"
                    onClick={() => router.push(ROUTES.PROFILE.PROMOTIONS_NEW)}
                />
            </div>

            <div className="flex flex-col h-[calc(100vh-160px)]">
                <ListPromotions showControls={true} />
            </div>
        </section>
    );
};

export default MyPromotionsPage;