'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { MenuItem as MenuItemType, MenuSection } from '@/types';
import { applyTheme } from '@/lib/themes/themeUtils';
import { ThemeConfig } from '@/lib/themes/themeTypes';

const MenuItemCard = ({ item }: { item: MenuItemType }) => {


    if (item.isSignature) {
        return (
            <div className={`${item._isSquareMobile ? 'col-span-1 flex-col md:flex-row md:items-center' : 'col-span-2 flex-row items-center'} md:col-span-2 group signature-card p-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-between text-background border border-primary/30`}>
                <div className={`text-left flex-1 ${item._isSquareMobile ? 'mb-3 md:mb-0' : 'mr-2 md:mr-0'}`}>
                    <h4 className="font-sans text-sm font-medium text-background leading-snug break-words">{item.name}</h4>
                    {item.description && <p className="text-[10px] text-background/80 mt-1">{item.description}</p>}
                </div>
                <div className="flex justify-end md:items-center"><span className="text-sm font-bold bg-secondary/25 text-background px-3 py-1 rounded-full whitespace-nowrap">{item.price}</span></div>
            </div>
        )
    }

    return (
        <div className={`group bg-secondary p-3 sm:p-4 rounded-xl shadow-sm border border-primary/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full ${item._isForcedRectangular ? 'col-span-2 md:col-span-1' : ''}`}>
            <div>
                {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
                <h4 className="font-sans text-sm font-medium text-foreground break-words leading-snug mb-2">
                    {item.name}
                </h4>
                {item.description && <p className="font-sans text-[10px] text-text/70 leading-relaxed mb-2">{item.description}</p>}
            </div>
            {item.price && <div className="flex justify-end mt-auto pt-2"><span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.price}</span></div>}
        </div>
    );
};

const CraftMenuItemCard = ({ item }: { item: MenuItemType }) => {


    return (
        <div className={`group bg-secondary p-3 sm:p-4 rounded-xl shadow-sm border border-primary/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full ${item._isForcedRectangular ? 'col-span-2 md:col-span-1' : ''}`}>
            <div>
                {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
                <h4 className="font-sans text-sm font-medium break-words leading-snug mb-2">{item.name}</h4>
                {item.description && <p className="font-sans text-[10px] text-text/70 leading-relaxed mb-2">{item.description}</p>}
            </div>
            <div className="flex justify-end mt-auto pt-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.price}</span>
            </div>
        </div>
    );
}

const SpecialBlueDreamCard = ({ item }: { item: MenuItemType }) => (
    <div className={`group bg-[#F0F8FF] p-4 rounded-xl shadow-sm border border-[#B0E0E6]/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full ${item._isForcedRectangular ? 'col-span-2 md:col-span-1' : ''}`}>
        <div>
            {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-[#2e4c5a] bg-secondary px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
            <h4 className="font-sans text-sm font-medium text-[#2e4c5a] break-words mb-2">{item.name}</h4>
            {item.description && <p className="text-[10px] text-[#2e4c5a]/60 mt-1 leading-relaxed mb-2">{item.description}</p>}
        </div>
        <div className="flex justify-end mt-auto pt-2">
            <span className="text-xs font-semibold text-[#2e4c5a] bg-secondary px-2 py-0.5 rounded-full whitespace-nowrap">{item.price}</span>
        </div>
    </div>
);

const WhispersOfLoveCard = ({ item }: { item: MenuItemType }) => (
    <div className="group bg-gradient-to-br from-[#8B4A4A] via-[#7A3B3B] to-[#6B3030] p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-rose-200/30 flex flex-col justify-between h-full">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <iconify-icon icon="solar:heart-bold" className="text-rose-200/90 text-base flex-shrink-0"></iconify-icon>
                <h4 className="font-sans text-sm font-semibold text-background break-words">{item.name}</h4>
            </div>
            {item.description && <p className="text-[10px] text-background/70 mt-2 leading-relaxed mb-2">{item.description}</p>}
            {(item.isMostOrdered || item.customTag) && (
                <span className="inline-block mt-1 mb-2 text-[10px] font-bold text-background bg-secondary/20 backdrop-blur-sm px-2 py-1 rounded-full uppercase">{item.customTag || "BESTSELLER"}</span>
            )}
        </div>
        <div className="flex justify-end mt-auto pt-2">
            <span className="text-xs font-bold text-background bg-secondary/15 backdrop-blur-sm px-3 py-1.5 rounded-full whitespace-nowrap">{item.price}</span>
        </div>
    </div>
);



const SummerEditCard = ({ item }: { item: MenuItemType }) => (
    <div className="group bg-gradient-to-br from-[#FFF3E0] via-[#FFF8E7] to-[#FFFDE7] p-3 sm:p-4 rounded-2xl shadow-sm border border-[#FFB300]/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
        <div>
            {item.customTag && (
                <span className={`inline-block mb-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded self-start ${item.customTag.toLowerCase() === 'trending' ? 'text-[#BF360C] bg-[#FF3D00]/10' : 'text-[#E65100] bg-[#FFB300]/20'}`}>
                    {item.customTag}
                </span>
            )}
            <h4 className="font-sans text-sm font-medium text-[#5D4037] break-words leading-snug mb-2">{item.name}</h4>
            {item.description && <p className="font-sans text-[10px] text-[#5D4037]/70 leading-relaxed mb-2">{item.description}</p>}
        </div>
        <div className="flex justify-end mt-auto pt-2">
            <span className="text-xs font-bold text-[#E65100] bg-[#FFB300]/15 px-2 py-0.5 rounded-full">₹{item.price}</span>
        </div>
    </div>
);

const MonsoonEditCard = ({ item, withRain = false }: { item: MenuItemType, withRain?: boolean }) => (
    <div className="group relative overflow-hidden bg-secondary/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-sm border border-white/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-[#E3F2FD]/80 before:to-[#BBDEFB]/80">
        {withRain && (
            <div 
                className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-overlay" 
                style={{ backgroundImage: 'url(/img/weather/texture-rain-fg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
        )}
        <div className="relative z-10">
            {item.customTag && (
                <span className="inline-block mb-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded self-start text-[#1565C0] bg-secondary/50 backdrop-blur-sm">
                    {item.customTag}
                </span>
            )}
            <h4 className="font-sans text-sm font-medium text-[#0D47A1] break-words leading-snug mb-2">{item.name}</h4>
            {item.description && <p className="font-sans text-[10px] text-[#1565C0]/80 leading-relaxed mb-2">{item.description}</p>}
        </div>
        <div className="flex justify-end mt-auto pt-2 relative z-10">
            <span className="text-xs font-bold text-[#0D47A1] bg-secondary/40 backdrop-blur-sm px-2 py-0.5 rounded-full">₹{item.price}</span>
        </div>
    </div>
);

const MatchaCard = ({ item }: { item: MenuItemType }) => (
    <div className="group bg-gradient-to-br from-[#F0F7F0] via-[#F5FAF5] to-[#FAFFF5] p-3 sm:p-4 rounded-xl shadow-sm border border-[#8FBC8F]/10 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
        <div>
            {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-[#4A7C59] bg-[#8FBC8F]/10 px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
            <h4 className="font-sans text-sm font-medium text-[#3A5A3A] min-w-0 break-words mb-2">
                {item.name}
            </h4>
            {item.description && <p className="font-sans text-[10px] text-text/70 leading-relaxed mb-2">{item.description}</p>}
        </div>
        {item.price && <div className="flex justify-end mt-auto pt-2"><span className="text-xs font-semibold text-[#4A7C59] bg-[#8FBC8F]/10 px-2 py-0.5 rounded-full whitespace-nowrap">{item.price}</span></div>}
    </div>
);


const ColdFrappeItemCard = ({ item }: { item: MenuItemType }) => {
    if (item.isSignature) {
        return (
            <div className={`${item._isSquareMobile ? 'col-span-1 flex-col md:flex-row md:items-center' : 'col-span-2 flex-row items-center'} md:col-span-2 group signature-card p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-between text-background border border-primary/30`}>
                <div className={`text-left flex-1 ${item._isSquareMobile ? 'mb-3 md:mb-0' : 'mr-2 md:mr-0'}`}>
                    <h4 className="font-sans text-sm font-medium text-background leading-snug break-words">{item.name}</h4>
                    {item.description && <p className="text-[10px] text-background/80 mt-1 leading-relaxed">{item.description}</p>}
                </div>
                <div className="flex justify-end md:items-center"><span className="text-sm font-bold bg-secondary/25 text-background px-3 py-1 rounded-full whitespace-nowrap">{item.price}</span></div>
            </div>
        )
    }

    const category = (item.name.toLowerCase().includes('brew') || item.name.toLowerCase().includes('tonic')) ? 'Brew' : 'Frappe';

    return (
        <div className={`group bg-secondary p-3 sm:p-4 rounded-xl shadow-sm border border-primary/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full ${item._isForcedRectangular ? 'col-span-2 md:col-span-1' : ''}`}>
            <div>
                {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
                <h4 className="font-sans text-sm font-medium mb-1 min-w-0 break-words">{item.name}</h4>
                {item.description && <p className="font-sans text-[10px] text-text/70 leading-relaxed mb-2">{item.description}</p>}
            </div>
            <div className="flex justify-between items-center mt-auto pt-3 text-xs text-primary font-semibold">
                <span>{category}</span>
                <span className="bg-primary/10 px-2 py-0.5 rounded-full">{item.price}</span>
            </div>
        </div>
    )
}

const PizzaItemCard = ({ item }: { item: MenuItemType }) => {
    if (item.isSignature) {
        return (
            <div className="group signature-card p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-background border border-primary/30 flex flex-col justify-between h-full">
                <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <h4 className="font-sans text-sm font-medium text-background leading-snug break-words flex-1 min-w-0">{item.name}</h4>
                    </div>
                    {item.description && <p className="text-[10px] text-background/80 mb-4 leading-relaxed">{item.description}</p>}
                </div>
                <div className="mt-auto pt-2">
                    {item.price && (
                        <div className="flex justify-end">
                            <div className="flex justify-end md:items-center"><span className="text-sm font-bold bg-secondary/25 text-background px-3 py-1 rounded-full whitespace-nowrap">{item.price}</span></div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    let icon = 'solar:pizza-linear';
    if (item.name.toLowerCase().includes('farmville')) icon = 'solar:leaf-linear';
    if (item.name.toLowerCase().includes('four cheese')) icon = 'solar:ruler-pen-linear';

    return (
        <div className="group bg-secondary p-4 sm:p-5 rounded-xl shadow-sm border border-primary/10 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
            <div>
                {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-sans text-sm sm:text-base font-medium text-primary min-w-0 break-words flex-1">{item.name}</h4>
                    <iconify-icon icon={icon} className="text-primary/40 flex-shrink-0"></iconify-icon>
                </div>
                {item.description && <p className="text-[10px] text-text/70 mb-4 leading-relaxed">{item.description}</p>}
            </div>
            <div className="mt-auto pt-2">
                {item.price && (
                    <div className="flex justify-end">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.price}</span>
                    </div>
                )}
            </div>
        </div>
    )
};

const BitesItemCard = ({ item }: { item: MenuItemType }) => {


    if (item.isSignature) {
        return (
            <div className={`${item._isSquareMobile ? 'col-span-1 flex-col md:flex-row md:items-center' : 'col-span-2 flex-row items-center'} md:col-span-2 group signature-card p-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-between text-background border border-primary/30`}>
                <div className={`text-left flex-1 ${item._isSquareMobile ? 'mb-3 md:mb-0' : 'mr-2 md:mr-0'}`}>
                    <h4 className="font-sans text-sm font-medium text-background leading-snug break-words">{item.name}</h4>
                    {item.description && <p className="text-[10px] text-background/80 mt-1 leading-relaxed">{item.description}</p>}
                </div>
                <div className="flex justify-end md:items-center"><span className="text-sm font-bold bg-secondary/25 text-background px-3 py-1 rounded-full whitespace-nowrap">{item.price}</span></div>
            </div>
        )
    }

    return (
        <div className={`group bg-secondary p-3 sm:p-4 rounded-xl shadow-sm border border-primary/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full ${item._isForcedRectangular ? 'col-span-2 md:col-span-1' : ''}`}>
            <div>
                {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
                <h4 className="font-sans text-sm font-medium text-foreground break-words leading-snug mb-2">
                    {item.name}
                </h4>
                {item.description && <p className="font-sans text-[10px] text-text/70 leading-relaxed mb-2">{item.description}</p>}
            </div>
            {item.price && <div className="flex justify-end mt-auto pt-2"><span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.price}</span></div>}
        </div>
    );
};

const ShakeItemCard = ({ item }: { item: MenuItemType }) => {


    if (item.isSignature) {
        return (
            <div className={`${item._isSquareMobile ? 'col-span-1 flex-col md:flex-row md:items-center' : 'col-span-2 flex-row items-center'} md:col-span-3 group signature-card p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-between text-background border border-primary/30`}>
                <div className={`text-left flex-1 ${item._isSquareMobile ? 'mb-3 md:mb-0' : 'mr-2 md:mr-0'}`}>
                    <h4 className="font-sans text-sm font-medium text-background leading-snug break-words">{item.name}</h4>
                    {item.description && <p className="text-[10px] text-background/80 mt-1 leading-relaxed">{item.description}</p>}
                </div>
                <div className="flex justify-end md:items-center"><span className="text-sm font-bold bg-secondary/25 text-background px-3 py-1 rounded-full whitespace-nowrap">{item.price}</span></div>
            </div>
        )
    }

    return (
        <div className="group bg-[#fff8f0] p-3 sm:p-4 rounded-xl border border-primary/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
            <div>
                {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
                <h4 className="font-sans text-sm font-medium min-w-0 break-words mb-1">{item.name}</h4>
                {item.description && (
                    <p className="text-[9px] text-primary/50 mt-1 leading-relaxed">{item.description}</p>
                )}
            </div>
            {item.price && <div className="flex justify-end mt-auto pt-2"><span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.price}</span></div>}
        </div>
    )
};

const DessertItemCard = ({ item }: { item: MenuItemType }) => {


    if (item.isSignature) {
        return (
            <div className={`${item._isSquareMobile ? 'col-span-1 flex-col md:flex-row md:items-center' : 'col-span-2 flex-row items-center'} md:col-span-2 group signature-card p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-between text-background border border-primary/30`}>
                <div className={`text-left flex-1 ${item._isSquareMobile ? 'mb-3 md:mb-0' : 'mr-2 md:mr-0'}`}>
                    <h4 className="font-sans text-sm font-medium text-background leading-snug break-words">{item.name}</h4>
                    {item.description && <p className="text-[10px] text-background/80 leading-relaxed">{item.description}</p>}
                </div>
                <div className="flex justify-end md:items-center"><span className="text-sm font-bold bg-secondary/25 text-background px-3 py-1 rounded-full whitespace-nowrap">{item.price}</span></div>
            </div>
        )
    }

    return (
        <div className={`group bg-secondary p-3 sm:p-4 rounded-xl shadow-sm border border-primary/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full ${item._isForcedRectangular ? 'col-span-2 md:col-span-1' : ''}`}>
            <div>
                {(item.isMostOrdered || item.customTag) && <span className="inline-block mb-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{item.customTag || "Bestseller"}</span>}
                <h4 className="font-sans text-sm font-medium mb-1 min-w-0 break-words">{item.name}</h4>
                {item.description && <p className="font-sans text-[10px] text-text/70 leading-relaxed mb-2">{item.description}</p>}
            </div>
            {item.price && <div className="flex justify-end mt-auto pt-2"><span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.price}</span></div>}
        </div>
    )
};


function getSectionConfig(sectionId: string) {
    let CardComponent: any = MenuItemCard;
    let gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

    switch (sectionId) {
        case 'pizza':
            CardComponent = PizzaItemCard;
            gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
            break;
        case 'summer-edit':
            CardComponent = SummerEditCard;
            break;
        case 'whispers-of-love':
            CardComponent = WhispersOfLoveCard;
            gridCols = 'grid-cols-1 md:grid-cols-2';
            break;
        case 'classic-espresso-bar':
            CardComponent = MenuItemCard;
            break;
        case 'craft-coffees':
            CardComponent = CraftMenuItemCard;
            break;
        case 'cold-brews':
        case 'frappe-to-go':
            CardComponent = ColdFrappeItemCard;
            break;
        case 'bites-for-sides':
        case 'healthy-salads':
        case 'fries-corner':
        case 'pasta':
        case 'sandwiches':
        case 'burgers':
            CardComponent = BitesItemCard;
            break;
        case 'shakes':
            CardComponent = ShakeItemCard;
            gridCols = 'grid-cols-2 md:grid-cols-3';
            break;
        case 'dessert':
            CardComponent = DessertItemCard;
            break;
        case 'blue-dream':
            CardComponent = SpecialBlueDreamCard;
            gridCols = 'grid-cols-1 md:grid-cols-2';
            break;
        case 'matcha':
            CardComponent = MatchaCard;
            break;
        default:
            CardComponent = MenuItemCard;
            break;
    }

    return { CardComponent, gridCols };
}

const SectionComponent = ({ section: originalSection }: { section: MenuSection }) => {
    let currentCell = 0;
    const itemsCount = originalSection.items.length;
    const processedItems = originalSection.items.map((item, index) => {
        let isSquare = false;
        let isForcedRectangular = false;
        const isLastItem = index === itemsCount - 1;

        if (item.isSignature) {
            if (currentCell % 2 === 1) {
                isSquare = true;
                currentCell += 1;
            } else {
                currentCell += 2;
            }
        } else {
            if (isLastItem && currentCell % 2 === 0) {
                isForcedRectangular = true;
                currentCell += 2;
            } else {
                currentCell += 1;
            }
        }
        return { ...item, _isSquareMobile: isSquare, _isForcedRectangular: isForcedRectangular };
    });
    const section = { ...originalSection, items: processedItems };
    let CardComponent;
    let gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

    if (section.id === 'summer-edit') {
        return (
            <section id={section.id} className="reveal -mx-4 sm:-mx-6 px-4 sm:px-6 py-10 rounded-2xl shadow-md" style={{ background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 40%, #FFF9C4 100%)', border: '1.5px solid #FFB30040' }}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-[#FF8F00]/10 border border-[#FF8F00]/30 rounded-full px-4 py-1.5 mb-4">
                            <iconify-icon icon="emojione:sun" width="16"></iconify-icon>
                            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#E65100]">Limited Season Special</span>
                            <iconify-icon icon="emojione:sun" width="16"></iconify-icon>
                        </div>
                        <h3 className="font-script text-4xl sm:text-5xl text-[#BF360C] mb-2">{section.title}</h3>
                        {section.subtitle && <p className="font-sans text-xs text-[#6D4C41]/80 italic max-w-sm mx-auto leading-relaxed">{section.subtitle}</p>}
                    </div>
                    {/* Drinks */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <iconify-icon icon="solar:cup-hot-bold" className="text-[#F57F17]" width="16"></iconify-icon>
                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#F57F17]">Sips</span>
                            <span className="h-px flex-1 bg-[#FFB300]/30"></span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {section.items.slice(0, 8).map(item => <SummerEditCard key={item.name} item={item} />)}
                        </div>
                    </div>
                    {/* Desserts */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <iconify-icon icon="solar:ice-cream-linear" className="text-[#F57F17]" width="16"></iconify-icon>
                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#F57F17]">Sweet Escapes</span>
                            <span className="h-px flex-1 bg-[#FFB300]/30"></span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {section.items.slice(8).map(item => <SummerEditCard key={item.name} item={item} />)}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (section.id === 'monsoon-edit') {
        return (
            <section id={section.id} className="reveal -mx-4 sm:-mx-6 px-4 sm:px-6 py-10 rounded-2xl shadow-md relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)', border: '1.5px solid #64B5F640' }}>
                <div className="absolute inset-0 z-0">
                    <RainEffectCanvas />
                </div>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-secondary/30 backdrop-blur-sm border border-white/40 rounded-full px-4 py-1.5 mb-4">
                            <iconify-icon icon="meteocons:rain-fill" width="16" className="text-[#1976D2]"></iconify-icon>
                            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D47A1]">Monsoon Special</span>
                            <iconify-icon icon="meteocons:rain-fill" width="16" className="text-[#1976D2]"></iconify-icon>
                        </div>
                        <h3 className="font-script text-4xl sm:text-5xl text-[#0D47A1] mb-2">{section.title}</h3>
                        {section.subtitle && <p className="font-sans text-xs text-[#1565C0]/80 italic max-w-sm mx-auto leading-relaxed">{section.subtitle}</p>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {section.items.map(item => <MonsoonEditCard key={item.name} item={item} />)}
                    </div>
                </div>
            </section>
        );
    }

    if (section.id === 'pizza') {
        return (
            <section id={section.id} className="reveal -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 bg-gradient-to-br from-[#f5e6d3] via-background to-[#ede0d0] rounded-2xl border border-primary/10 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    {section.preheader && (
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <iconify-icon icon="game-icons:wood-pile" className="text-primary text-lg opacity-70"></iconify-icon>
                            <p className="font-sans text-sm font-medium uppercase tracking-widest text-primary">{section.preheader}</p>
                            <iconify-icon icon="game-icons:wood-pile" className="text-primary text-lg opacity-70"></iconify-icon>
                        </div>
                    )}
                    <div className="flex items-end gap-3 mb-6 px-1">
                        <iconify-icon icon="mdi:fire" className="text-[#D2691E] text-3xl mb-1 opacity-80"></iconify-icon>
                        <h3 className="font-script text-3xl text-primary">{section.title}</h3>
                        <span className="h-px flex-1 bg-primary/20 mb-2"></span>
                        <iconify-icon icon="mdi:fire" className="text-[#D2691E] text-3xl mb-1 opacity-80"></iconify-icon>
                    </div>

                    <div className="text-center -mt-4 mb-8 max-w-2xl mx-auto bg-secondary/50 p-6 rounded-xl border border-primary/10">
                        <p className="font-sans text-sm font-medium uppercase tracking-widest text-primary mb-4">Choice of Base</p>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-xs text-[#6B3A20]/80">
                            <div>
                                <h4 className="font-sans font-semibold text-sm text-primary mb-1">NEW YORK STYLE</h4>
                                <p>A thin, hand-tossed crust, soft in the center, crisp at the edge, and perfectly foldable.</p>
                            </div>
                            <div>
                                <h4 className="font-sans font-semibold text-sm text-primary mb-1">NEAPOLITAN</h4>
                                <p>Crafted with long-rested dough, giving you a pillowy centre, crispy edges, and that signature smoky char.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.items.map(item => <PizzaItemCard key={item.name} item={item} />)}
                    </div>
                </div>
            </section>
        );
    }

    switch (section.id) {
        case 'whispers-of-love':
            CardComponent = WhispersOfLoveCard;
            gridCols = 'grid-cols-1 md:grid-cols-2';
            break;

        case 'classic-espresso-bar':
            CardComponent = MenuItemCard;
            break;
        case 'craft-coffees':
            CardComponent = CraftMenuItemCard;
            break;
        case 'cold-brews':
        case 'frappe-to-go':
            CardComponent = ColdFrappeItemCard;
            break;
        case 'bites-for-sides':
        case 'healthy-salads':
        case 'fries-corner':
        case 'pasta':
            CardComponent = BitesItemCard;
            break;
        case 'sandwiches':
        case 'burgers':
            CardComponent = BitesItemCard;
            break;
        case 'shakes':
            CardComponent = ShakeItemCard;
            gridCols = 'grid-cols-2 md:grid-cols-3';
            break;
        case 'dessert':
            CardComponent = DessertItemCard;
            break;
        case 'blue-dream':
            CardComponent = SpecialBlueDreamCard;
            gridCols = 'grid-cols-1 md:grid-cols-2';
            break;
        case 'matcha':
            CardComponent = MatchaCard;
            break;
        case 'affogato':
        case 'hot-teas':
        case 'iced-teas':
        case 'hot-chocolate':
        case 'craft-mocktails':
        case 'healthy-juices':
        case 'smoothies':
        case 'beverage-companions':
        case 'garlic-bread':
        case 'calzone':
        case 'meal-bowls':
        case 'ramen-tales':
        case 'meal-combos':
            CardComponent = MenuItemCard;
            break;
        default:
            CardComponent = MenuItemCard;
    }

    return (
        <section id={section.id} className="reveal">
            {section.preheader && (
                <p className="font-sans text-sm font-medium uppercase tracking-widest text-primary text-center mb-2">{section.preheader}</p>
            )}
            <div className="flex items-end gap-3 mb-6 px-1">
                {section.id === 'ramen-tales' && (
                    <iconify-icon icon="fluent-emoji-high-contrast:chopsticks" className="text-primary text-2xl mb-1 opacity-60"></iconify-icon>
                )}
                <h3 className="font-script text-3xl text-primary">{section.title}</h3>
                <span className="h-px flex-1 bg-primary/20 mb-2"></span>
                {section.id === 'ramen-tales' && (
                    <iconify-icon icon="fluent-emoji-high-contrast:steaming-bowl" className="text-primary text-2xl mb-1 opacity-60"></iconify-icon>
                )}
            </div>
            {section.subtitle && (
                <p className="font-sans text-xs text-center text-[#6B3A20]/80 italic -mt-4 mb-6 max-w-lg mx-auto whitespace-pre-line">{section.subtitle}</p>
            )}
            <div className={`grid ${gridCols} gap-3`}>
                {section.items.map(item => <CardComponent key={item.name} item={item} />)}
            </div>
            {section.id === 'beverage-companions' && (
                <div className="mt-12 text-center space-y-2 reveal">
                    <p className="font-script text-3xl text-primary">“Impressed by the drinks?<br />scroll the page”</p>
                    <p className="font-sans text-sm font-medium uppercase tracking-widest text-primary">The food's ready to steal the show!</p>
                </div>
            )}
        </section>
    );
};

import dynamic from 'next/dynamic';

const RainEffectCanvas = dynamic(() => import('../components/RainEffectCanvas'), { ssr: false });

export default function MenuClient({ 
    initialSections, 
    initialTheme 
}: { 
    initialSections: MenuSection[], 
    initialTheme: ThemeConfig 
}) {
    const [sections] = useState<MenuSection[]>(initialSections);
    const [theme] = useState<ThemeConfig>(initialTheme);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSections = useMemo(() => {
        if (!searchQuery) return sections;
        return sections.map(section => ({
            ...section,
            items: section.items.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        })).filter(section => section.items.length > 0);
    }, [sections, searchQuery]);

    const [showBackToTop, setShowBackToTop] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const navRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (theme) {
            const root = document.documentElement;
            applyTheme(theme, root);
        }
    }, [theme]);

    useEffect(() => {
        if (!sections.length) return;

        // Small delay to ensure DOM has updated with the new sections
        const timeoutId = setTimeout(() => {
            const observerOptions = {
                root: null,
                rootMargin: '-100px 0px -60% 0px', // Focus on top-ish part of viewport
                threshold: 0
            };

            const activeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, observerOptions);

            const revealElementsSnapshot = document.querySelectorAll('section[id]');
            revealElementsSnapshot.forEach(el => activeObserver.observe(el));

            // Original reveal observer
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            const revealElements = document.querySelectorAll('.reveal');
            revealElements.forEach(el => revealObserver.observe(el));

            // Cleanup function will close over the current elements
            return () => {
                revealElementsSnapshot.forEach(el => activeObserver.unobserve(el));
                revealElements.forEach(el => {
                    try {
                        revealObserver.unobserve(el);
                    } catch (e) { }
                });
            };
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [sections]);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-scroll nav bar to active item
    useEffect(() => {
        if (activeSection && navRef.current) {
            const activeItem = navRef.current.querySelector(`[data-section="${activeSection}"]`);
            if (activeItem) {
                const navContainer = navRef.current;
                const itemOffset = (activeItem as HTMLElement).offsetLeft;
                const itemWidth = (activeItem as HTMLElement).offsetWidth;
                const containerWidth = navContainer.offsetWidth;

                // Center the active item
                navContainer.scrollTo({
                    left: itemOffset - (containerWidth / 2) + (itemWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [activeSection]);

    return (
        <div style={theme ? {
            '--primary': theme.primaryColor,
            '--accent': theme.accentColor,
            '--font-main': theme.fontFamily
        } as React.CSSProperties : {}}>
            {/* Hero Section */}
            {theme?.showHeroVideo !== false && (
                <div className="w-full h-[80dvh] md:h-[70vh] rounded-b-[2.5rem] overflow-hidden relative">
                    <video 
                        src={theme?.heroVideoUrl || "/hero.mp4"}
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover absolute inset-0"
                    />
                    
                    {/* Subtle bottom gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Scroll Down Indicator */}
                    <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center gap-2 z-10 text-background/90 drop-shadow-md pointer-events-none">
                        <span className="font-sans text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase animate-pulse">Scroll Down</span>
                        <iconify-icon icon="solar:round-alt-arrow-down-linear" width="24" className="animate-bounce"></iconify-icon>
                    </div>
                </div>
            )}

            <header className="pt-6 sm:pt-8 pb-4 px-4 sm:px-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2 reveal active">
                    <Image
                        src={theme?.logoUrl || "/logo.png"}
                        alt="Cafe 9:50 Logo"
                        width={180}
                        height={60}
                        className="h-12 w-auto object-contain"
                        priority
                    />
                </div>
                <div className="flex items-center gap-3 relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-background transition-colors reveal active duration-500 relative z-[101]"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        <iconify-icon icon={isMenuOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"} width="20"></iconify-icon>
                    </button>

                    {/* Dropdown Menu Overlay */}
                    {isMenuOpen && (
                        <>
                            {/* Invisible Backdrop for click-outside */}
                            <div 
                                className="fixed inset-0 z-[90]" 
                                onClick={() => setIsMenuOpen(false)}
                            />
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-background rounded-2xl shadow-xl border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-200 z-[100] p-4">
                                {/* Menu Title */}
                                <h2 className="font-script text-2xl text-primary mb-4">Quick Links</h2>

                                {/* Menu Items */}
                                <nav className="space-y-2">
                                    <a
                                        href={theme?.instagramUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group border border-transparent hover:border-primary/20"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center flex-shrink-0 transition-colors">
                                            <iconify-icon icon="hugeicons:instagram" width="20" className="text-primary group-hover:text-background transition-colors"></iconify-icon>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-sans text-sm font-semibold text-primary transition-colors">Instagram</p>
                                            <p className="font-sans text-[10px] text-primary/60">@cafenine50</p>
                                        </div>
                                    </a>

                                    <a
                                        href={theme?.mobileNumber ? `tel:${theme.mobileNumber.replace(/\s+/g, '')}` : "#"}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group border border-transparent hover:border-primary/20"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center flex-shrink-0 transition-colors">
                                            <iconify-icon icon="solar:phone-linear" width="20" className="text-primary group-hover:text-background transition-colors"></iconify-icon>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-sans text-sm font-semibold text-primary transition-colors">Call Us</p>
                                            <p className="font-sans text-[10px] text-primary/60">+91 8349476548</p>
                                        </div>
                                    </a>

                                    <a
                                        href={theme?.reviewUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group border border-transparent hover:border-primary/20"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center flex-shrink-0 transition-colors">
                                            <iconify-icon icon="solar:star-linear" width="20" className="text-primary group-hover:text-background transition-colors"></iconify-icon>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-sans text-sm font-semibold text-primary transition-colors">Review Us</p>
                                            <p className="font-sans text-[10px] text-primary/60">Google Reviews</p>
                                        </div>
                                    </a>
                                </nav>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Inline Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 reveal active">
                <div className="relative max-w-md mx-auto">
                    <iconify-icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" width="20"></iconify-icon>
                    <input
                        type="text"
                        placeholder="Search for coffee, pizza, desserts..."
                        className="w-full bg-secondary/50 border border-primary/10 rounded-full py-3 pl-12 pr-4 font-sans text-sm text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
                        >
                            <iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon>
                        </button>
                    )}
                </div>
            </div>

            <nav className="sticky top-0 z-40 glass-nav border-b border-primary/10 mb-6 sm:mb-8 transition-all duration-300 transform mt-0 translate-y-0 relative">
                <div className="max-w-7xl mx-auto px-2 sm:px-4">
                    <ul ref={navRef} className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-3 sm:py-4 px-1 items-center">
                        {filteredSections.map((section) => {
                            // Don't show garlic bread or calzone in the top nav as they are under pizza
                            if (section.id === 'garlic-bread' || section.id === 'calzone') return null;

                            const isActive = activeSection === section.id;

                            return (
                                <li key={section.id} className="snap-start shrink-0" data-section={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className={`whitespace-nowrap px-5 sm:px-8 py-3 sm:py-4 rounded-full font-sans text-sm sm:text-base font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center min-w-[100px] sm:min-w-[120px] ${isActive
                                                ? 'bg-primary text-background shadow-lg shadow-primary/30 scale-105'
                                                : 'bg-[#fffefb] border border-primary/15 text-primary hover:bg-primary/5'
                                            }`}
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">

                {filteredSections.length === 0 && (
                    <div className="text-center py-20">
                        <iconify-icon icon="solar:map-point-remove-linear" width="48" className="text-primary/50 mb-4"></iconify-icon>
                        <p className="text-primary/70 font-sans">No items matched your search.</p>
                    </div>
                )}

                {filteredSections.map((section, index) => {
                    // Group pizza, garlic-bread, and calzone together
                    if (section.id === 'pizza') {
                        const garlicBreadSection = filteredSections.find(s => s.id === 'garlic-bread');
                        const calzoneSection = filteredSections.find(s => s.id === 'calzone');

                        return (
                            <section key={section.id} id="pizza" className="reveal -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 bg-gradient-to-br from-[#f5e6d3] via-background to-[#ede0d0] rounded-2xl border border-primary/10 shadow-sm">
                                <div className="max-w-7xl mx-auto space-y-12">
                                    {/* Pizza Section */}
                                    <div>
                                        {section.preheader && (
                                            <div className="flex items-center justify-center gap-3 mb-2">
                                                <iconify-icon icon="game-icons:wood-pile" className="text-primary text-lg opacity-70"></iconify-icon>
                                                <p className="font-sans text-sm font-medium uppercase tracking-widest text-primary">{section.preheader}</p>
                                                <iconify-icon icon="game-icons:wood-pile" className="text-primary text-lg opacity-70"></iconify-icon>
                                            </div>
                                        )}
                                        <div className="flex items-end gap-3 mb-6 px-1">
                                            <iconify-icon icon="mdi:fire" className="text-[#D2691E] text-3xl mb-1 opacity-80"></iconify-icon>
                                            <h3 className="font-script text-3xl text-primary">{section.title}</h3>
                                            <span className="h-px flex-1 bg-primary/20 mb-2"></span>
                                            <iconify-icon icon="mdi:fire" className="text-[#D2691E] text-3xl mb-1 opacity-80"></iconify-icon>
                                        </div>

                                        <div className="text-center -mt-4 mb-8 max-w-2xl mx-auto bg-secondary/50 p-6 rounded-xl border border-primary/10">
                                            <p className="font-sans text-sm font-medium uppercase tracking-widest text-primary mb-4">Choice of Base</p>
                                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-xs text-[#6B3A20]/80">
                                                <div>
                                                    <h4 className="font-sans font-semibold text-sm text-primary mb-1">NEW YORK STYLE</h4>
                                                    <p>A thin, hand-tossed crust, soft in the center, crisp at the edge, and perfectly foldable.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-sans font-semibold text-sm text-primary mb-1">NEAPOLITAN</h4>
                                                    <p>Crafted with long-rested dough, giving you a pillowy centre, crispy edges, and that signature smoky char.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {section.items.map(item => <PizzaItemCard key={item.name} item={item} />)}
                                        </div>
                                    </div>

                                    {/* Garlic Bread Section */}
                                    {garlicBreadSection && (
                                        <div id="garlic-bread">
                                            <div className="flex items-end gap-3 mb-6 px-1">
                                                <h3 className="font-script text-3xl text-primary">{garlicBreadSection.title}</h3>
                                                <span className="h-px flex-1 bg-primary/20 mb-2"></span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {garlicBreadSection.items.map(item => <MenuItemCard key={item.name} item={item} />)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Calzone Section */}
                                    {calzoneSection && (
                                        <div id="calzone">
                                            <div className="flex items-end gap-3 mb-6 px-1">
                                                <h3 className="font-script text-3xl text-primary">{calzoneSection.title}</h3>
                                                <span className="h-px flex-1 bg-primary/20 mb-2"></span>
                                            </div>
                                            {calzoneSection.subtitle && (
                                                <p className="font-sans text-xs text-center text-[#6B3A20]/80 italic -mt-4 mb-6 max-w-lg mx-auto whitespace-pre-line">{calzoneSection.subtitle}</p>
                                            )}
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {calzoneSection.items.map(item => <MenuItemCard key={item.name} item={item} />)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    }

                    // Skip garlic-bread and calzone as they're rendered with pizza
                    if (section.id === 'garlic-bread' || section.id === 'calzone') {
                        return null;
                    }

                    return <SectionComponent key={section.id} section={section} />;
                })}
                <div className="max-w-7xl mx-auto py-4 text-center reveal">
                    <p className="font-sans text-[10px] sm:text-xs font-medium text-primary bg-primary/5 py-3 px-6 rounded-xl inline-block border border-primary/10">Prices are exclusive of GST. Applicable GST will be added to your bill.</p>
                </div>

            </main>

            <footer className="mt-8 text-center pt-6 pb-4 px-2 sm:px-6 border-t border-primary/10 bg-secondary/40 reveal">
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-4 gap-2 sm:gap-6 mb-6 text-primary w-full max-w-3xl">
                        <a href={theme?.instagramUrl || "#"} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform flex flex-col items-center justify-start gap-1.5 sm:gap-2 text-center">
                            <iconify-icon icon="hugeicons:instagram" width="22" className="sm:w-[24px]"></iconify-icon>
                            <span className="font-sans text-[9.5px] sm:text-[11px] lowercase tracking-tight sm:tracking-wider leading-tight">@cafenine50</span>
                        </a>
                        <a href={theme?.mobileNumber ? `tel:${theme.mobileNumber.replace(/\s+/g, '')}` : "#"} className="hover:scale-105 transition-transform flex flex-col items-center justify-start gap-1.5 sm:gap-2 text-center">
                            <iconify-icon icon="solar:phone-linear" width="22" className="sm:w-[24px]"></iconify-icon>
                            <span className="font-sans text-[9.5px] sm:text-[11px] tracking-tight sm:tracking-wider leading-tight">+91 8349476548</span>
                        </a>
                        <a href={theme?.address ? `https://maps.google.com/?q=${encodeURIComponent(theme.address)}` : "#"} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform flex flex-col items-center justify-start gap-1.5 sm:gap-2 text-center">
                            <iconify-icon icon="solar:globus-linear" width="22" className="sm:w-[24px]"></iconify-icon>
                            <span className="font-sans text-[9.5px] sm:text-[11px] uppercase tracking-tight sm:tracking-wider leading-tight">cafenine50.com</span>
                        </a>
                        <a href={theme?.reviewUrl || "#"} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform flex flex-col items-center justify-start gap-1.5 sm:gap-2 text-center">
                            <iconify-icon icon="solar:star-linear" width="22" className="sm:w-[24px]"></iconify-icon>
                            <span className="font-sans text-[9.5px] sm:text-[11px] lowercase tracking-tight sm:tracking-wider leading-tight">review us</span>
                        </a>
                    </div>

                    <div className="max-w-md mx-auto mb-6 text-center">
                        <p className="font-sans text-[10px] text-primary/60 uppercase tracking-[0.2em] mb-2">Visit Us</p>
                        <p className="font-sans text-[12px] text-primary leading-relaxed">
                            5, AZAD NAGAR, INFRONT OF PUSHPA MISSION HOSPITAL,<br />
                            UJJAIN (M.P) 456010
                        </p>
                    </div>

                    <div className="w-full border-t border-primary/5 pt-6 pb-2">
                        <p className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-primary mb-2 font-semibold">Cafe 9:50</p>
                        <p className="font-sans text-sm text-primary/60 font-medium">
                            Made with love by <a href="https://zaaykatech.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition-colors font-semibold">zaaykatech.com</a>
                        </p>
                    </div>
                </div>
            </footer>

            {showBackToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary text-background shadow-lg hover:bg-[#6B3A20] transition-all duration-300 flex items-center justify-center z-50 animate-in fade-in slide-in-from-bottom"
                    aria-label="Back to top"
                >
                    <iconify-icon icon="solar:alt-arrow-up-linear" width="20" class="sm:w-6"></iconify-icon>
                </button>
            )}
        </div>
    );
}
