import { useState, useEffect } from "react";

import { DataScroller } from "primereact/datascroller"

import { Promotion } from "@/models/promotion.model";
import { PromotionItem } from "../promotionItem";
import AdSense from "../adSense/AdSense";
import { getProducts } from '@/services/products';

interface Props {
    showControls: boolean;
}
type PromoOrAd = Promotion | { isAd: true };

const ListPromotions = ({ showControls }: Props) => {
    const [promotions, setPromotions] = useState<PromoOrAd[]>([]);
    const [variant, setVariant] = useState<'default' | 'compact'>('default');

    useEffect(() => {
        const checkScreenSize = () => {
            const isMobile = window.innerWidth < 768;
            setVariant(isMobile ? 'compact' : 'default');
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setPromotions(response.data);
            } catch (error) {
                console.error('Erro ao buscar promoções:', error);
            }
        };

        fetchProducts();
    }, []);

    const itemTemplate = (promo: PromoOrAd) => {
        if ('isAd' in promo) {
            return (
                <div className="p-4 mb-4">
                    <div className="bg-gray-100 border border-dashed border-gray-300 p-6 rounded text-center text-sm text-gray-500">
                        Espaço reservado para anúncio Google Ads
                        {/* <AdSense /> */}
                    </div>
                </div>
            );
        }

        return (
            <PromotionItem promo={promo} variant={variant} showControls={showControls} />
        );
    };


    return (
        <DataScroller
            inline
            rows={5}
            value={promotions}
            scrollHeight="100%"
            itemTemplate={itemTemplate}
            className="rounded-lg h-full overflow-auto"
        />
    )
}

export default ListPromotions;