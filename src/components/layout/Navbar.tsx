'use client';

import { useState } from 'react';
import LogoSVG from '@/assets/svg/LogoSVG';

import { SearchIcon } from 'primereact/icons/search';
import { useRouter } from 'next/navigation';


const Navbar = () => {
    const router = useRouter();

    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="border-b shadow-sm sticky top-0 bg-white z-50">
            {/* Topo padrão */}
            {!searchOpen && (
                <div className="container mx-auto px-4 py-3 flex items-center justify-between md:justify-start gap-4 items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-4 self-center">
                        <button onClick={() => router.push('/')} className="focus:outline-none">
                            <LogoSVG width={200} />
                        </button>
                    </div>

                    {/* Busca desktop */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden w-full max-w-xl px-4 py-2">
                            <SearchIcon className="mr-2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Busque por promoções"
                                className="w-full outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Mobile - botão da lupa */}
                    <div className="md:hidden ml-auto self-center">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <SearchIcon />
                        </button>
                    </div>
                    {/* Ícone do usuário */}
                    <div className="md:hidden self-center">
                        <button
                            onClick={() => router.push(`/login`)}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <i className="pi pi-user text-gray-600"></i>
                        </button>
                    </div>
                    <div className="hidden md:flex items-center gap-2 ml-4 self-center">
                        <button
                            onClick={() => router.push(`/login`)}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <i className="pi pi-user text-gray-600"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Campo de busca fullscreen mobile */}
            {searchOpen && (
                <div className="md:hidden px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="p-2 text-gray-700"
                        >
                            <i className="pi pi-angle-left"></i>
                        </button>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Busque por promoções"
                            className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm"
                        />
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;