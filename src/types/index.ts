export type MenuItem = {
  name: string;
  price: number | string;
  description?: string;
  isMostOrdered?: boolean;
  isSignature?: boolean;
  customTag?: string;
  _isSquareMobile?: boolean;
  _isForcedRectangular?: boolean;
};

export type MenuSection = {
  id: string;
  title: string;
  subtitle?: string;
  preheader?: string;
  items: MenuItem[];
};
