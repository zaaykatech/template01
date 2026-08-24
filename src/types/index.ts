export type MenuItem = {
  name: string;
  price?: number | string;
  prices?: {
    ny: number;
    neap: number;
  };
  description?: string;
  isMostOrdered?: boolean;
  isSignature?: boolean;
  customTag?: string;
  isMonsoon?: boolean;
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
