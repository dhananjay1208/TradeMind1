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
      <Card className="bg-gradient-to-br from-profit/5 to-profit/10 border-profit/20">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-profit/10">
              <QuoteIcon className="h-6 w-6 text-profit-light" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-white/10 animate-pulse rounded-lg" />
              <div className="h-5 bg-white/10 animate-pulse rounded-lg w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card className="bg-gradient-to-br from-profit/5 to-profit/10 border-profit/20">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <QuoteIcon className="h-6 w-6 text-profit-light" />
            <p className="text-muted-foreground italic">No quote available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-profit/5 to-profit/10 border-profit/20 relative overflow-hidden group hover:from-profit/10 hover:to-profit/15 transition-all">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="h-32 w-32 text-profit-light" />
      </div>
      <CardContent className="p-8 relative z-10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-profit/15 shrink-0">
            <QuoteIcon className="h-7 w-7 text-profit-light" />
          </div>
          <div className="flex-1 space-y-4">
            <blockquote className="text-xl font-semibold leading-relaxed text-foreground">
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
