'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from '@/types';
import { supabase } from '@/lib/supabase';
import { Quote as QuoteIcon, Sparkles } from 'lucide-react';

export function QuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Select random quote
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        setQuote(randomQuote);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <QuoteIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <QuoteIcon className="h-6 w-6 text-primary" />
            <p className="text-muted-foreground italic">No quote available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="h-24 w-24 text-primary" />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10 shrink-0">
            <QuoteIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <blockquote className="text-lg font-medium leading-relaxed">
              "{quote.quote_text}"
            </blockquote>
            {quote.author && (
              <p className="text-sm text-muted-foreground font-medium">
                — {quote.author}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
