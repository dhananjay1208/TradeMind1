'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, User, Shield, Target, BookOpen, Lock } from 'lucide-react';
import { TradingRule } from '@/components/onboarding/TradingRulesStep';

interface TradingRuleDB {
  id: string;
  rule_order: number;
  rule_text: string;
  category: string;
  is_active: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile settings
  const [fullName, setFullName] = useState('');
  const [startingCapital, setStartingCapital] = useState('');

  // Risk limits
  const [maxDailyLoss, setMaxDailyLoss] = useState('');
  const [maxTradeLoss, setMaxTradeLoss] = useState('');
  const [maxTradesPerDay, setMaxTradesPerDay] = useState('');

  // Goals
  const [dailyTarget, setDailyTarget] = useState('');
  const [weeklyTarget, setWeeklyTarget] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState('');

  // Trading rules
  const [tradingRules, setTradingRules] = useState<TradingRule[]>([]);

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setStartingCapital(profile.starting_capital?.toString() || '');
      setMaxDailyLoss(profile.max_daily_loss?.toString() || '');
      setMaxTradeLoss(profile.max_trade_loss?.toString() || '');
      setMaxTradesPerDay(profile.max_trades_per_day?.toString() || '');
      setDailyTarget(profile.daily_target?.toString() || '');
      setWeeklyTarget(profile.weekly_target?.toString() || '');
      setMonthlyTarget(profile.monthly_target?.toString() || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      loadTradingRules();
    }
  }, [user]);

  const loadTradingRules = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trading_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('rule_order', { ascending: true });

      if (error) throw error;

      if (data) {
        const rules: TradingRule[] = data.map((rule: TradingRuleDB) => ({
          id: rule.id,
          text: rule.rule_text,
          category: rule.category,
          isActive: rule.is_active,
        }));
        setTradingRules(rules);
      }
    } catch (error: any) {
      console.error('Error loading trading rules:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!fullName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your full name',
        variant: 'destructive',
      });
      return;
    }

    if (!startingCapital || parseFloat(startingCapital) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid starting capital',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          starting_capital: parseFloat(startingCapital),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRiskLimits = async () => {
    if (!user) return;

    if (!maxDailyLoss || parseFloat(maxDailyLoss) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid max daily loss',
        variant: 'destructive',
      });
      return;
    }

    if (!maxTradeLoss || parseFloat(maxTradeLoss) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid max loss per trade',
        variant: 'destructive',
      });
      return;
    }

    if (!maxTradesPerDay || parseInt(maxTradesPerDay) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid max trades per day',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          max_daily_loss: parseFloat(maxDailyLoss),
          max_trade_loss: parseFloat(maxTradeLoss),
          max_trades_per_day: parseInt(maxTradesPerDay),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Risk limits updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating risk limits:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update risk limits',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoals = async () => {
    if (!user) return;

    if (!dailyTarget || parseFloat(dailyTarget) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid daily profit target',
        variant: 'destructive',
      });
      return;
    }

    if (!weeklyTarget || parseFloat(weeklyTarget) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid weekly profit target',
        variant: 'destructive',
      });
      return;
    }

    if (!monthlyTarget || parseFloat(monthlyTarget) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid monthly profit target',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          daily_target: parseFloat(dailyTarget),
          weekly_target: parseFloat(weeklyTarget),
          monthly_target: parseFloat(monthlyTarget),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Goals updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating goals:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update goals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRules = async () => {
    if (!user) return;

    const activeRules = tradingRules.filter((r) => r.isActive);
    if (activeRules.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one trading rule',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Delete all existing rules
      const { error: deleteError } = await supabase
        .from('trading_rules')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Insert updated rules
      const rulesToInsert = tradingRules.map((rule, index) => ({
        user_id: user.id,
        rule_order: index + 1,
        rule_text: rule.text,
        category: rule.category,
        is_active: rule.isActive,
      }));

      const { error: insertError } = await supabase
        .from('trading_rules')
        .insert(rulesToInsert);

      if (insertError) throw insertError;

      toast({
        title: 'Success',
        description: 'Trading rules updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating trading rules:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update trading rules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = (id: string) => {
    const updatedRules = tradingRules.map((rule) =>
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    );
    setTradingRules(updatedRules);
  };

  const updateRuleText = (id: string, text: string) => {
    const updatedRules = tradingRules.map((rule) =>
      rule.id === id ? { ...rule, text } : rule
    );
    setTradingRules(updatedRules);
  };

  const moveRule = (index: number, direction: 'up' | 'down') => {
    const newRules = [...tradingRules];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < tradingRules.length) {
      [newRules[index], newRules[newIndex]] = [newRules[newIndex], newRules[index]];
      setTradingRules(newRules);
    }
  };

  const addNewRule = () => {
    const newRule: TradingRule = {
      id: `new-${Date.now()}`,
      text: 'New trading rule',
      category: 'Custom',
      isActive: true,
    };
    setTradingRules([...tradingRules, newRule]);
  };

  const deleteRule = (id: string) => {
    setTradingRules(tradingRules.filter((rule) => rule.id !== id));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, risk limits, trading rules, and account security
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Rules</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and trading capital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startingCapital">Starting Capital (INR)</Label>
                <Input
                  id="startingCapital"
                  type="number"
                  placeholder="e.g., 100000"
                  value={startingCapital}
                  onChange={(e) => setStartingCapital(e.target.value)}
                  min="0"
                  step="1000"
                />
                <p className="text-sm text-muted-foreground">
                  Your initial trading capital
                </p>
              </div>
              <Button onClick={handleSaveProfile} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Limits Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Management</CardTitle>
              <CardDescription>
                Configure your risk limits to protect your capital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="maxDailyLoss">Max Daily Loss (INR)</Label>
                <Input
                  id="maxDailyLoss"
                  type="number"
                  placeholder="e.g., 2000"
                  value={maxDailyLoss}
                  onChange={(e) => setMaxDailyLoss(e.target.value)}
                  min="0"
                  step="100"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum amount you're willing to lose in a single day
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTradeLoss">Max Loss Per Trade (INR)</Label>
                <Input
                  id="maxTradeLoss"
                  type="number"
                  placeholder="e.g., 500"
                  value={maxTradeLoss}
                  onChange={(e) => setMaxTradeLoss(e.target.value)}
                  min="0"
                  step="50"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum amount you're willing to lose on a single trade
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTradesPerDay">Max Trades Per Day</Label>
                <Input
                  id="maxTradesPerDay"
                  type="number"
                  placeholder="e.g., 5"
                  value={maxTradesPerDay}
                  onChange={(e) => setMaxTradesPerDay(e.target.value)}
                  min="1"
                  step="1"
                />
                <p className="text-sm text-muted-foreground">
                  Limit the number of trades to avoid overtrading
                </p>
              </div>
              <Button onClick={handleSaveRiskLimits} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Risk Limits
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Trading Rules</CardTitle>
              <CardDescription>
                Manage your trading rules to maintain discipline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {tradingRules.map((rule, index) => (
                  <RuleItem
                    key={rule.id}
                    rule={rule}
                    index={index}
                    totalRules={tradingRules.length}
                    onToggle={toggleRule}
                    onUpdateText={updateRuleText}
                    onMove={moveRule}
                    onDelete={deleteRule}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={addNewRule} variant="outline">
                  Add New Rule
                </Button>
                <Button onClick={handleSaveRules} disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Rules
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Profit Targets</CardTitle>
              <CardDescription>
                Set and update your profit goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dailyTarget">Daily Profit Target (INR)</Label>
                <Input
                  id="dailyTarget"
                  type="number"
                  placeholder="e.g., 1000"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(e.target.value)}
                  min="0"
                  step="100"
                />
                <p className="text-sm text-muted-foreground">
                  Your target profit for each trading day
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyTarget">Weekly Profit Target (INR)</Label>
                <Input
                  id="weeklyTarget"
                  type="number"
                  placeholder="e.g., 5000"
                  value={weeklyTarget}
                  onChange={(e) => setWeeklyTarget(e.target.value)}
                  min="0"
                  step="500"
                />
                <p className="text-sm text-muted-foreground">
                  Your cumulative profit target for the week
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyTarget">Monthly Profit Target (INR)</Label>
                <Input
                  id="monthlyTarget"
                  type="number"
                  placeholder="e.g., 20000"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(e.target.value)}
                  min="0"
                  step="1000"
                />
                <p className="text-sm text-muted-foreground">
                  Your cumulative profit target for the month
                </p>
              </div>
              <Button onClick={handleSaveGoals} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Goals
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleChangePassword} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface RuleItemProps {
  rule: TradingRule;
  index: number;
  totalRules: number;
  onToggle: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onDelete: (id: string) => void;
}

function RuleItem({
  rule,
  index,
  totalRules,
  onToggle,
  onUpdateText,
  onMove,
  onDelete,
}: RuleItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(rule.text);

  const handleSave = () => {
    onUpdateText(rule.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(rule.text);
    setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex flex-col gap-1 mt-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onMove(index, 'up')}
          disabled={index === 0}
        >
          ↑
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onMove(index, 'down')}
          disabled={index === totalRules - 1}
        >
          ↓
        </Button>
      </div>

      <input
        type="checkbox"
        checked={rule.isActive}
        onChange={() => onToggle(rule.id)}
        className="mt-1 h-4 w-4 rounded border-gray-300"
      />

      <div className="flex-1 space-y-1">
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="mt-1"
            autoFocus
          />
        ) : (
          <span className={!rule.isActive ? 'line-through opacity-60' : ''}>
            {index + 1}. {rule.text}
          </span>
        )}
        <p className="text-xs text-muted-foreground">{rule.category}</p>
      </div>

      <div className="flex gap-1">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(rule.id)}>
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
