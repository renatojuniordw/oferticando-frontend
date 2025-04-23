'use client';

import React from 'react';
import ListPromotions from '@/components/listPromotions';

const HomePage = () => {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <ListPromotions showControls={false} />
      </div>
    </section>
  );
};

export default HomePage;
