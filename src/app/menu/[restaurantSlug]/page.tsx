import MenuClient from '../../MenuClient';

export default async function RestaurantMenuPage({
  params
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  
  return <MenuClient restaurantSlug={restaurantSlug} />;
}
