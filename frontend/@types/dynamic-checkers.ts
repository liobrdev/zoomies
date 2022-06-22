import { IBreed } from '@/types';


export const checkBreed = (breed: any): IBreed => {
  if (
    !!breed &&
    !!breed.breed_name && typeof breed.breed_name === 'string' &&
    !!breed.thumbnail_url && typeof breed.thumbnail_url === 'string'
  ) {
    const obj: IBreed = {
      breed_name: breed.breed_name,
      thumbnail_url: breed.thumbnail_url,
    };

    return obj;
  }

  throw new Error("Failed 'checkBreed'");
};
