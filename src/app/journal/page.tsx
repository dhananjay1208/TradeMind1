'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Trade } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { TradeEntryForm } from '@/components/journal/TradeEntryForm';
import { TradeList } from '@/components/journal/TradeList';
import { TradeDetailModal } from '@/components/journal/TradeDetailModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Plus, List } from 'lucide-react';

export default function JournalPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!profile?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        fetchTrades();
      }
    }
  }, [user, profile, authLoading, router]);

  // Set up real-time subscription for trades
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('trades_journal_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Trade change detected:', payload);
          fetchTrades();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchTrades = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('trade_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trades. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowDetailModal(true);
  };

  const handleModalClose = () => {
    setShowDetailModal(false);
    setSelectedTrade(null);
  };

  const handleTradeUpdated = () => {
    fetchTrades();
    // If we're viewing details, refresh the selected trade
    if (selectedTrade) {
      supabase
        .from('trades')
        .select('*')
        .eq('id', selectedTrade.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setSelectedTrade(data);
          }
        });
    }
  };

  const handleTradeAdded = () => {
    fetchTrades();
    // Switch to list view after adding a trade
    setActiveTab('list');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading trade journal...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 pb-20 md:pb-6">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="h-8 w-8" />
                Trade Journal
              </h1>
              <p className="text-muted-foreground mt-1">
                Track and analyze all your trades
              </p>
            </div>

            {/* Mobile Add Button */}
            <Button
              className="md:hidden"
              onClick={() => setActiveTab('add')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Trade Entry Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <TradeEntryForm onTradeAdded={handleTradeAdded} />
                </div>
              </div>

              {/* Right Column - Trade List */}
              <div className="lg:col-span-2">
                <TradeList
                  trades={trades}
                  onTradeClick={handleTradeClick}
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout with Tabs */}
          <div className="md:hidden">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'add')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Trades ({trades.length})
                </TabsTrigger>
                <TabsTrigger value="add" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Trade
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                <TradeList
                  trades={trades}
                  onTradeClick={handleTradeClick}
                />
              </TabsContent>

              <TabsContent value="add" className="mt-6">
                <TradeEntryForm onTradeAdded={handleTradeAdded} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Stats Summary */}
          {trades.length > 0 && (
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-4">All-Time Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                  <div className="text-2xl font-bold">{trades.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Winners</div>
                  <div className="text-2xl font-bold text-green-600">
                    {trades.filter(t => t.is_winner === true).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Losers</div>
                  <div className="text-2xl font-bold text-red-600">
                    {trades.filter(t => t.is_winner === false).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                  <div className="text-2xl font-bold">
                    {trades.length > 0
                      ? ((trades.filter(t => t.is_winner === true).length / trades.length) * 100).toFixed(1)
                      : 0
                    }%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <MobileNav />

      {/* Trade Detail Modal */}
      <TradeDetailModal
        trade={selectedTrade}
        open={showDetailModal}
        onClose={handleModalClose}
        onTradeUpdated={handleTradeUpdated}
      />
    </div>
  );
}
