import type { MenuSection, MenuItem as MenuItemType } from '@/types';
import { Pizza } from 'lucide-react';

interface FullMenuProps {
  sections: MenuSection[];
}

const MenuItem = ({ item }: { item: MenuItemType }) => (
    <div className="group">
      <div className="flex justify-between items-baseline border-b border-[#8B4A27]/20 border-dotted pb-1">
        <span className={`font-sans text-sm font-medium uppercase tracking-wide ${item.isSignature ? 'text-[#8B4A27] font-semibold' : ''}`}>{item.name}</span>
        {item.price && <span className="font-sans text-sm font-medium">{item.price}</span>}
      </div>
      {item.description && <p className="font-sans text-xs text-[#6B3A20]/80 mt-1 leading-relaxed">{item.description}</p>}
    </div>
);

const PizzaMenuItem = ({ item }: { item: MenuItemType }) => (
    <div className="group">
        <div className="flex justify-between items-baseline border-b border-[#F6E4C7]/20 pb-1">
            <span className={`font-sans text-sm font-medium uppercase tracking-wide ${item.isSignature ? 'text-[#F3E2C9]' : ''}`}>{item.name}</span>
            {item.prices && <div className="flex text-sm font-medium"><span className="w-12 text-right">{item.prices.ny}</span><span className="w-12 text-right">{item.prices.neap}</span></div>}
        </div>
        {item.description && <p className="font-sans text-xs opacity-70 mt-1">{item.description}</p>}
    </div>
);


export default function FullMenu({ sections }: FullMenuProps) {
  return (
    <div className="animate-in fade-in-50">
      {sections.map(section => {
        if (section.id === 'pizzaStation') {
          return (
            <div key={section.id} className="bg-[#8A4B2B] text-[#F6E4C7] py-12 px-8 -mx-[2px]">
                <div className="text-center mb-8 border-b border-[#F6E4C7]/20 pb-4">
                    <p className="font-sans text-xs tracking-widest uppercase opacity-80 mb-2">Straight From Wood Fire Oven!</p>
                    <div className="flex items-center justify-center gap-2">
                        <Pizza size={32} />
                        <h2 className="font-headline text-4xl">{section.title}</h2>
                    </div>
                </div>
                {section.subtitle && (
                    <div className="flex justify-center gap-6 mb-8 text-xs font-sans text-center opacity-80 whitespace-pre-line">
                        <div className="max-w-[150px]"><span className="font-semibold block mb-1">NEW YORK STYLE</span>A thin, hand-tossed crust, soft in the center, crisp at the edge, and perfectly foldable.</div>
                        <div className="w-px bg-[#F6E4C7]/30"></div>
                        <div className="max-w-[150px]"><span className="font-semibold block mb-1">NEAPOLITAN</span>Our Neapolitan base is crafted with long-rested dough, giving you a pillowy centre, crispy edges, and that signature smoky char.</div>
                    </div>
                )}
                <div className="space-y-6">
                     <div className="flex justify-end text-xs opacity-60 mb-2 font-sans tracking-wide"><span className="w-12 text-right">NY</span><span className="w-12 text-right">NEAP</span></div>
                     {section.items.map(item => (
                         <PizzaMenuItem key={item.name} item={item} />
                     ))}
                </div>
            </div>
          )
        }
        
        return (
            <section key={section.id} className="px-8 mb-12">
                {section.title && <h2 className="font-headline text-3xl text-center mb-2">{section.title}</h2>}
                {section.subtitle && <p className="font-sans text-xs text-center text-[#6B3A20]/70 italic mb-6 max-w-md mx-auto whitespace-pre-line">{section.subtitle}</p>}
                <div className="space-y-5">
                    {section.items.map(item => <MenuItem key={item.name} item={item} />)}
                </div>
                {section.id === 'beverageCompanions' && (
                  <div className="mt-12 text-center space-y-2">
                      <p className="font-headline text-2xl text-[#8B4A27]">“Impressed by the drinks? turn the page”</p>
                      <p className="font-sans text-sm font-medium uppercase tracking-widest">The food's ready to steal the show!</p>
                  </div>
                )}
            </section>
        )
      })}
    </div>
  );
}
