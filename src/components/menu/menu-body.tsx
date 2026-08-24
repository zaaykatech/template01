'use client';

import { useState, useTransition, useEffect } from 'react';
import type { MenuSection } from '@/types';
import { type IntelligentSearchOutput } from '@/ai/flows/intelligent-search';
import { searchMenuItems } from '@/actions/menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FullMenu from './full-menu';

interface MenuBodyProps {
  allSections: MenuSection[];
}

export default function MenuBody({ allSections }: MenuBodyProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IntelligentSearchOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSearch = (formData: FormData) => {
    const searchQuery = formData.get('query') as string;
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    startTransition(async () => {
      try {
        const results = await searchMenuItems(searchQuery);
        setSearchResults(results);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Search Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        setSearchResults([]);
      }
    });
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
  };

  return (
    <div className="font-sans">
      <section className="px-8 mb-12">
        <form action={handleSearch} className="relative flex items-center gap-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="query"
            placeholder="Craving something special? Ask me!"
            className="bg-background/80 border-[#8B4A27]/30 focus:bg-white focus:border-primary pl-9"
            autoComplete="off"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-12 h-8 w-8"
              onClick={clearSearch}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button type="submit" variant="outline" size="icon" disabled={isPending} className="border-[#8B4A27]/30 shrink-0">
            {isPending ? <Loader2 className="animate-spin" /> : <Search />}
          </Button>
        </form>
      </section>

      {isPending ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : searchResults !== null ? (
        searchResults.length > 0 ? (
          <section className="px-8 mb-12 animate-in fade-in-50">
            <h2 className="font-headline text-3xl text-center mb-6">Search Results</h2>
            <div className="space-y-4 max-w-md mx-auto">
              {searchResults.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex justify-between items-baseline border-b border-[#8B4A27]/20 border-dotted pb-1">
                  <span className="text-sm font-medium uppercase tracking-wide">{item.name}</span>
                  <span className="text-sm font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="px-8 mb-12 text-center animate-in fade-in-50">
            <p className="text-[#6B3A20]/80">No results found for "{query}".</p>
            <p className="text-xs text-[#6B3A20]/60 mt-1">Try searching for "strong cold coffee" or "something with chocolate".</p>
          </section>
        )
      ) : (
        <FullMenu sections={allSections} />
      )}
    </div>
  );
}
