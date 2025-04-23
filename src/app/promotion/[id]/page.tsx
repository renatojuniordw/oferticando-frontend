'use client';

import { Divider } from 'primereact/divider';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

import PageHeader from '@/components/layout/PageHeader';
import ListPromotions from '@/components/listPromotions';

const PromotionPage = () => {
  const router = useRouter();

  const promotion = {
    id: 1,
    title: '[APP] Câmera de Segurança Elsys Wi-Fi [APP] Câmera de Segurança Elsys Wi-Fi ...',
    store: 'KaBuM!',
    creator: 'Renato Bezerra',
    image:
      'https://www.loja.canon.com.br/wcsstore/CDBCatalogAssetStore/EOSR524105-01.jpg',
    user: 'Renato Junior',
    link: 'https://www.loja.canon.com.br',
  };

  return (
    <>
      <PageHeader onBack={() => router.back()} />

      <div className="container mx-auto px-4 py-6">

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Coluna da imagem */}
          <div className="w-full flex justify-center">
            <Image
              src={promotion.image}
              alt={promotion.title}
              imageClassName="w-full max-w-[280px] object-contain"
              preview
            />
          </div>

          {/* Coluna do conteúdo */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
                {promotion.title}
              </h1>
              <p className="text-sm font-bold text-orange-600 mt-1">Vendido por {promotion.store} </p>

              <div className="mt-4">
                <a href={promotion.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button label="Ir para loja" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg" icon="pi pi-external-link" />
                </a>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              Postado por {promotion.creator}
            </p>

            <Divider />


          </div>
        </div>

        <div className="p-4 mb-4">
          <div className="bg-gray-100 border border-dashed border-gray-300 p-6 rounded text-center text-sm text-gray-500">
            {/* Substitua pelo código real do Google Ads aqui */}
            {/* <AdSense /> */}
            Espaço reservado para anúncio Google Ads
          </div>
        </div>

        <Divider />

        <div>
          <h2 className="font-semibold text-lg leading-snug mb-1">
            Outras Ofertas
          </h2>
          <div className="flex flex-col h-[calc(100vh-650px)]">
            <ListPromotions showControls={false} />
          </div>
        </div>

      </div>


    </>
  );
}

export default PromotionPage