import { toast } from 'sonner';

import { Env } from '@/libs/Env';

type ImgBBUploadResponse = {
  data: {
    id: string;
    title: string;
    url: string;
    width: string;
    height: string;
    size: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
};

const upload = async (file: File): Promise<ImgBBUploadResponse | undefined> => {
  try {
    const form = new FormData();
    form.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${Env.NEXT_PUBLIC_IMGBB_KEY}`, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();

    return data as ImgBBUploadResponse;
  } catch (error) {
    console.error(error);
    toast.error('Failed to upload image');
    throw error;
  }
};

export const images = {
  upload,
};
