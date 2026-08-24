import { Coffee, Leaf, Cookie } from 'lucide-react';

export default function MenuHeader() {
  return (
    <header className="text-center pt-16 pb-12 px-6 relative font-sans">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#8A4B2B]"></div>
      <div className="inline-block border-b-2 border-[#8B4A27] pb-4 mb-2">
        <h1 className="font-headline text-5xl md:text-6xl text-[#5A2E1B] mb-2">Cafe 9:50</h1>
        <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#8B4A27]">Brewing Memories</p>
      </div>
      <div className="mt-6 flex justify-center gap-4 text-[#8B4A27]/60">
        <Coffee size={24} strokeWidth={1.5} />
        <Leaf size={24} strokeWidth={1.5} />
        <Cookie size={24} strokeWidth={1.5} />
      </div>
    </header>
  );
}
