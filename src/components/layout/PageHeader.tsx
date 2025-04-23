'use client';

import { Button } from 'primereact/button';

interface PageHeaderProps {
    title?: string;
    onBack: () => void;
}

const PageHeader = ({ title, onBack }: PageHeaderProps) => (
    <div className="container mx-auto py-2">
        <div className="flex items-center gap-4">
            <Button
                icon="pi pi-chevron-left"
                onClick={onBack}
                className="border-none shadow-none ring-0"
                text
            />
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
        </div>
    </div>
);


export default PageHeader;