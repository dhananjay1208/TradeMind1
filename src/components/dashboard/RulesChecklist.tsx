'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TradingRule } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Shield, AlertCircle } from 'lucide-react';

interface RulesChecklistProps {
  onAllRulesChecked: (checked: boolean) => void;
}

export function RulesChecklist({ onAllRulesChecked }: RulesChecklistProps) {
  const { user } = useAuth();
  const [rules, setRules] = useState<TradingRule[]>([]);
  const [checkedRules, setCheckedRules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRules();
    }
  }, [user]);

  useEffect(() => {
    // Check if all rules are checked
    const allChecked = rules.length > 0 && checkedRules.size === rules.length;
    onAllRulesChecked(allChecked);
  }, [checkedRules, rules, onAllRulesChecked]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trading_rules')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('rule_order', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRuleCheck = (ruleId: string, checked: boolean) => {
    setCheckedRules((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(ruleId);
      } else {
        newSet.delete(ruleId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            My Trading Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (rules.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                No Trading Rules Found
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Please set up your trading rules in the settings before starting to trade.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allChecked = checkedRules.size === rules.length;
  const progress = (checkedRules.size / rules.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            My Trading Rules
          </CardTitle>
          <div className="text-sm font-medium">
            <span className={allChecked ? 'text-green-600' : 'text-muted-foreground'}>
              {checkedRules.size}/{rules.length}
            </span>
          </div>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              allChecked ? 'bg-green-500' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={rule.id} className="flex items-start gap-3">
              <Checkbox
                id={`rule-${rule.id}`}
                checked={checkedRules.has(rule.id)}
                onCheckedChange={(checked) =>
                  handleRuleCheck(rule.id, checked as boolean)
                }
                className="mt-1"
              />
              <Label
                htmlFor={`rule-${rule.id}`}
                className="flex-1 text-sm leading-relaxed cursor-pointer"
              >
                <span className="font-medium text-primary mr-2">
                  {index + 1}.
                </span>
                {rule.rule_text}
                {rule.category && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({rule.category})
                  </span>
                )}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
