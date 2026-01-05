'use client';

import { useState, useMemo } from 'react';
import { Trade } from '@/types';
import { TradeCard } from './TradeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Search, Filter, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface TradeListProps {
  trades: Trade[];
  onTradeClick?: (trade: Trade) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'pnl-desc' | 'pnl-asc' | 'symbol-asc' | 'symbol-desc';
type FilterOption = 'all' | 'winners' | 'losers';

export function TradeList({ trades, onTradeClick }: TradeListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [brokerFilter, setBrokerFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter and sort trades
  const filteredAndSortedTrades = useMemo(() => {
    let filtered = [...trades];

    // Filter by search term (symbol)
    if (searchTerm) {
      filtered = filtered.filter(trade =>
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by win/loss
    if (filterBy === 'winners') {
      filtered = filtered.filter(trade => trade.is_winner === true);
    } else if (filterBy === 'losers') {
      filtered = filtered.filter(trade => trade.is_winner === false);
    }

    // Filter by broker
    if (brokerFilter !== 'all') {
      filtered = filtered.filter(trade => trade.broker === brokerFilter);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(trade => trade.trade_date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(trade => trade.trade_date <= endDate);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime();
        case 'date-asc':
          return new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime();
        case 'pnl-desc':
          return (b.pnl || 0) - (a.pnl || 0);
        case 'pnl-asc':
          return (a.pnl || 0) - (b.pnl || 0);
        case 'symbol-asc':
          return a.symbol.localeCompare(b.symbol);
        case 'symbol-desc':
          return b.symbol.localeCompare(a.symbol);
        default:
          return 0;
      }
    });

    return filtered;
  }, [trades, searchTerm, sortBy, filterBy, brokerFilter, startDate, endDate]);

  // Calculate statistics for filtered trades
  const stats = useMemo(() => {
    const totalPnL = filteredAndSortedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalTrades = filteredAndSortedTrades.length;
    const winningTrades = filteredAndSortedTrades.filter(t => t.is_winner === true).length;
    const losingTrades = filteredAndSortedTrades.filter(t => t.is_winner === false).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    return {
      totalPnL,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
    };
  }, [filteredAndSortedTrades]);

  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total P&L</div>
            <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.totalPnL)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Trades</div>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {stats.winRate.toFixed(1)}%
              <Badge variant="outline" className="text-xs">
                {stats.winningTrades}W / {stats.losingTrades}L
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Avg P&L</div>
            <div className={`text-2xl font-bold ${
              stats.totalTrades > 0 && stats.totalPnL / stats.totalTrades >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {stats.totalTrades > 0
                ? formatCurrency(stats.totalPnL / stats.totalTrades)
                : formatCurrency(0)
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter and sort your trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Search by Symbol */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Symbol</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="e.g., RELIANCE"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                  <SelectItem value="pnl-desc">P&L (Highest First)</SelectItem>
                  <SelectItem value="pnl-asc">P&L (Lowest First)</SelectItem>
                  <SelectItem value="symbol-asc">Symbol (A-Z)</SelectItem>
                  <SelectItem value="symbol-desc">Symbol (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Win/Loss */}
            <div className="space-y-2">
              <Label htmlFor="filter">Filter</Label>
              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                <SelectTrigger id="filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="winners">Winners Only</SelectItem>
                  <SelectItem value="losers">Losers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Broker Filter */}
            <div className="space-y-2">
              <Label htmlFor="broker">Broker</Label>
              <Select value={brokerFilter} onValueChange={setBrokerFilter}>
                <SelectTrigger id="broker">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brokers</SelectItem>
                  <SelectItem value="ZERODHA">Zerodha</SelectItem>
                  <SelectItem value="GROWW">Groww</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchTerm || filterBy !== 'all' || brokerFilter !== 'all' || startDate || endDate) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary">Symbol: {searchTerm}</Badge>
              )}
              {filterBy !== 'all' && (
                <Badge variant="secondary">
                  {filterBy === 'winners' ? 'Winners' : 'Losers'}
                </Badge>
              )}
              {brokerFilter !== 'all' && (
                <Badge variant="secondary">Broker: {brokerFilter}</Badge>
              )}
              {(startDate || endDate) && (
                <Badge variant="secondary">
                  Date: {startDate || '...'} to {endDate || '...'}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trade List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredAndSortedTrades.length} Trade{filteredAndSortedTrades.length !== 1 ? 's' : ''}
          </h3>
        </div>

        {filteredAndSortedTrades.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {trades.length === 0
                  ? 'No trades yet. Start logging your trades!'
                  : 'No trades match your filters. Try adjusting the filters.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAndSortedTrades.map((trade) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onClick={() => onTradeClick?.(trade)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
