

'use client';

import { Promotion } from '@/models/promotion.model';
import { ROUTES } from '@/shared/routes';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

interface PromotionItemProps {
    promo: Promotion;
    showControls?: boolean;
    variant?: 'default' | 'compact';
}

export const PromotionItem = ({
    promo,
    variant = 'default',
    showControls = false
}: PromotionItemProps) => {
    const router = useRouter();
    const titleSize = variant === 'compact' ? 'text-sm md:text-lg' : 'text-lg';

    return (
        <div className="p-4 mb-4">
            <div className="flex flex-row gap-4 w-full">
                {/* Imagem */}
                <div className={variant === 'compact' ? "w-[40%] flex items-center" : "w-[20%] flex items-center"}>
                    <Image
                        width='100%'
                        src={promo.image_url}
                        alt={promo.title}
                        className="rounded-lg object-cover w-full h-auto"
                    />
                </div>
                {/* Conteúdo sempre ao lado da imagem */}
                <div className={`${variant === 'compact' ? "w-[60%]" : "w-[80%]"} flex flex-col justify-between gap-2`}>
                    <div>
                        <h2 className={`${titleSize} font-semibold text-gray-900 mb-1`}>
                            {promo.title}
                        </h2>
                        <p className="text-sm text-orange-600 font-medium mb-1">Vendido por {promo.retail_store.name}</p>
                        <p className="text-sm  font-medium my-3">Postado por {promo.user.nickname}</p>
                        {showControls ? (
                            <div className="flex flex-col items-end justify-end min-w-[120px] ml-0 md:ml-4 mt-4 md:mt-0">
                                <Button
                                    text
                                    severity="danger"
                                    icon="pi pi-trash"
                                    className="p-button-sm w-full md:w-auto"
                                    onClick={() => console.log('Ocultar promoção', promo.id)}
                                />

                            </div>
                        ) : (
                            <div className="flex flex-col items-end justify-end min-w-[120px] ml-0 md:ml-4 mt-4 md:mt-0">
                                <Button
                                    text
                                    icon="pi pi-eye"
                                    className="w-full md:w-auto focus:outline-none focus:ring-0 border-none shadow-none"
                                    onClick={() => router.push(ROUTES.PROMOTION_VIEW(promo.id))}
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};