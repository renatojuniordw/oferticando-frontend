'use client';

import React, { useEffect, useRef, useState } from 'react';


import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Skeleton } from 'primereact/skeleton';

import { DataScroller } from 'primereact/datascroller';

import { useRouter } from 'next/navigation';
import { Divider } from 'primereact/divider';
import AdSense from '@/components/adSense/AdSense';

interface Promotion {
  id: number;
  title: string;
  store: string;
  creator: string;
  image: string;
  user: string;
  link: string;
}

type VirtualItem = Promotion | { isAd: true };

const basePromotions: Promotion[] = [
  {
    id: 1,
    title: '[APP] Câmera de Segurança Elsys Wi-Fi...',
    store: 'KaBuM!',
    creator: 'Renato Bezerra',
    image:
      'https://www.loja.canon.com.br/wcsstore/CDBCatalogAssetStore/EOSR524105-01.jpg',
    user: 'Renato Junior',
    link: 'https://www.loja.canon.com.br',
  },
  {
    id: 2,
    title: 'Headset Gamer Mancer Aura...',
    store: 'Pichau',
    creator: 'Renato Bezerra',
    image:
      'https://www.loja.canon.com.br/wcsstore/CDBCatalogAssetStore/EOSR524105-01.jpg',
    user: 'Bezerra Renato',
    link: 'https://www.loja.canon.com.br',
  },
];

const Home = () => {
  const router = useRouter();

  const [items, setItems] = useState<VirtualItem[]>([]);

  useEffect(() => {
    const generatedItems: VirtualItem[] = [];
    for (let i = 0; i < 100; i++) {
      if ((i + 1) % 6 === 0) {
        generatedItems.push({ isAd: true });
      } else {
        const index = i % basePromotions.length;
        generatedItems.push({
          ...basePromotions[index],
          title: `${basePromotions[index].title} #${i + 1}`,
        });
      }
    }
    setItems(generatedItems);
  }, []);

  const itemTemplate = (promo: VirtualItem | undefined) => {
    if (!promo) return null;
    if ('isAd' in promo) {
      return (
        <div className="p-4 mb-4">
          <div className="bg-gray-100 border border-dashed border-gray-300 p-6 rounded text-center text-sm text-gray-500">
            {/* Substitua pelo código real do Google Ads aqui */}
            {/* <AdSense /> */}
            Espaço reservado para anúncio Google Ads

          </div>
        </div>
      );
    }

    return (
      <div className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
          {/* Coluna da Imagem */}
          <div className="w-full">
            <Image
              src={promo.image}
              alt={promo.title}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>

          {/* Coluna do conteúdo */}
          <div className="flex flex-col md:flex-row justify-between w-full">
            <div className="flex-1">
              <h2 className="font-semibold text-lg leading-snug mb-1">
                {promo.title}
              </h2>
              <p className="text-sm font-bold text-orange-600 mb-1">
                Vendido por {promo.store}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Postado por {promo.creator}
              </p>
            </div>

            <div className="flex flex-col items-end justify-between min-w-[120px] ml-0 md:ml-4 mt-4 md:mt-0">
              <Button
                label="Ver promoção"
                icon="pi pi-shopping-cart"
                className="w-full md:w-auto focus:outline-none focus:ring-0 border-none shadow-none"
                onClick={() => router.push(`/promotion/${promo.id}`)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <DataScroller
          value={items}
          itemTemplate={itemTemplate}
          rows={5}
          inline
          scrollHeight="100%"
          className="rounded-lg h-full overflow-auto"
        />
      </div>
    </section>
  );
};

export default Home;
