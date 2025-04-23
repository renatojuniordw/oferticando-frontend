'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

interface EditForm {
  title: string;
}

export default function EditPromotionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<EditForm>({
    mode: 'onChange',
    defaultValues: {
      title: ''
    }
  });

  const onSubmit = (data: EditForm) => {
    console.log('Promoção editada:', { id, ...data });
    router.push('/profile/promotions');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-6 text-center">Editar Título da Promoção</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título da Oferta</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'O título é obrigatório' }}
              render={({ field }) => (
                <InputText {...field} placeholder="Digite o novo título" className={`w-full ${errors.title ? 'p-invalid' : ''}`} />
              )}
            />
            {errors.title && <small className="text-red-500">{errors.title.message}</small>}
          </div>
          <Button label="Salvar alterações" type="submit" disabled={!isValid} className="w-full" />
        </form>
      </div>
    </div>
  );
}
