import { Instagram, Phone, Globe } from 'lucide-react';

export default function MenuFooter() {
  return (
    <footer className="bg-[#5A2E1B] text-[#F3E2C9] py-12 px-6 text-center font-sans">
      <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-70">Time To Order</p>
      
      <div className="flex justify-center gap-6 mb-6">
        <a href="https://www.instagram.com/CAFENINE50" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100" aria-label="Instagram">
          <Instagram size={24} />
        </a>
        <a href="tel:+918349476548" className="opacity-80 hover:opacity-100" aria-label="Phone">
          <Phone size={24} />
        </a>
        <a href="http://CAFENINE50.COM" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100" aria-label="Website">
          <Globe size={24} />
        </a>
      </div>

      <p className="font-sans text-sm font-medium mb-1">@CAFENINE50</p>
      <p className="font-sans text-sm font-medium mb-4">+91 8349476548</p>
      
      <div className="w-12 h-px bg-[#F3E2C9]/30 mx-auto my-4"></div>
      
      <p className="font-sans text-[10px] leading-relaxed opacity-70 max-w-xs mx-auto">
        5, AZAD NAGAR, INFRONT OF PUSHPA MISSION HOSPITAL,<br/>UJJAIN (M.P) 456010
      </p>
    </footer>
  );
}
