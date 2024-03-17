export type Pet = {
  idMascota: number;
  nombre: string;
  raza: string;
  edad: number;
  peso: number;
  idMedicamento: number;
  idCliente: number;
  image?: string;
};

export const breeds = [
  'affenpinscher',
  'african',
  'airedale',
  'akita',
  'appenzeller',
  'basenji',
  'beagle',
  'bluetick',
  'borzoi',
  'bouvier',
  'boxer',
  'brabancon',
  'briard',
  'buhund',
  'bulldog',
  'bullterrier',
  'cattledog',
  'chihuahua',
  'chow',
  'clumber',
  'cockapoo',
  'collie',
  'coonhound',
  'corgi',
  'cotondetulear',
  'dachshund',
  'dalmatian',
  'dane',
  'deerhound',
  'dhole',
  'dingo',
  'doberman',
  'elkhound',
  'pug',
];
