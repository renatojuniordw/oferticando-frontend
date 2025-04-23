import { useState, useEffect } from "react";

import { DataScroller } from "primereact/datascroller"

import { Promotion } from "@/models/promotion.model";
import { PromotionItem } from "../promotionItem";

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
        const mockData: PromoOrAd[] = [];
        for (let i = 0; i < 100; i++) {
            if ((i + 1) % 6 === 0) {
                mockData.push({ isAd: true });
            } else {
                mockData.push({
                    id: i + 1,
                    title: `Promoção #${i + 1}`,
                    store: 'Amazon',
                    creator: 'Renato',
                    image: 'https://www.loja.canon.com.br/wcsstore/CDBCatalogAssetStore/EOSR524105-01.jpg',
                    link: 'https://www.amazon.com.br',
                    clicks: Math.floor(Math.random() * 100),
                });
            }
        }
        setPromotions(mockData);
    }, []);

    const itemTemplate = (promo: PromoOrAd) => {
        if ('isAd' in promo) {
            return (
                <div className="p-4 mb-4">
                    <div className="bg-gray-100 border border-dashed border-gray-300 p-6 rounded text-center text-sm text-gray-500">
                        Espaço reservado para anúncio Google Ads
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