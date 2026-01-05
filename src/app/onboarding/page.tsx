'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProfileStep } from '@/components/onboarding/ProfileStep';
import { RiskLimitsStep } from '@/components/onboarding/RiskLimitsStep';
import { TradingRulesStep, TradingRule } from '@/components/onboarding/TradingRulesStep';
import { GoalsStep } from '@/components/onboarding/GoalsStep';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

const DEFAULT_TRADING_RULES: TradingRule[] = [
  {
    id: '1',
    text: 'Risk Management First - Never risk more than defined limits',
    category: 'Risk Management',
    isActive: true,
  },
  {
    id: '2',
    text: 'Always Honor Stop Loss - No moving SL against the trade',
    category: 'Risk Management',
    isActive: true,
  },
  {
    id: '3',
    text: 'Proper Position Sizing - Size based on SL distance, not conviction',
    category: 'Risk Management',
    isActive: true,
  },
  {
    id: '4',
    text: 'Be Agile in Booking Profits - Don\'t be greedy, book partial profits',
    category: 'Profit Taking',
    isActive: true,
  },
  {
    id: '5',
    text: 'Never Let a Winner Turn into a Loser - Trail SL to breakeven',
    category: 'Profit Taking',
    isActive: true,
  },
  {
    id: '6',
    text: 'Be Patient - Wait for Proper Entry - No FOMO trades',
    category: 'Discipline',
    isActive: true,
  },
  {
    id: '7',
    text: 'Stick to Daily/Weekly/Monthly Targets - Stop when target achieved',
    category: 'Discipline',
    isActive: true,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Profile
  const [fullName, setFullName] = useState('');
  const [startingCapital, setStartingCapital] = useState('');

  // Step 2: Risk Limits
  const [maxDailyLoss, setMaxDailyLoss] = useState('');
  const [maxTradeLoss, setMaxTradeLoss] = useState('');
  const [maxTradesPerDay, setMaxTradesPerDay] = useState('');

  // Step 3: Trading Rules
  const [tradingRules, setTradingRules] = useState<TradingRule[]>(DEFAULT_TRADING_RULES);

  // Step 4: Goals
  const [dailyTarget, setDailyTarget] = useState('');
  const [weeklyTarget, setWeeklyTarget] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState('');

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!fullName.trim()) {
          toast({
            title: 'Validation Error',
            description: 'Please enter your full name',
            variant: 'destructive',
          });
          return false;
        }
        if (!startingCapital || parseFloat(startingCapital) <= 0) {
          toast({
            title: 'Validation Error',
            description: 'Please enter a valid starting capital',
            variant: 'destructive',
          });
          return false;
        }
        return true;

      case 2:
        if (!maxDailyLoss || parseFloat(maxDailyLoss) <= 0) {
          toast({
            title: 'Validation Error',
            description: 'Please enter a valid max daily loss',
            variant: 'destructive',
          });
          return false;
        }
        if (!maxTradeLoss || parseFloat(maxTradeLoss) <= 0) {
          toast({
            title: 'Validation Error',
            description: 'Please enter a valid max loss per trade',
            variant: 'destructive',
          });
          return false;
        }
        if (!maxTradesPerDay || parseInt(maxTradesPerDay) <= 0) {
          toast({
            title: 'Validation Error',
            description: 'Please enter a valid max trades per day',
            variant: 'destructive',
          });
          return false;
        }
        return true;

      case 3:
        const activeRules = tradingRules.filter((r) => r.isActive);
        if (activeRules.length === 0) {
          toast({
            title: 'Validation Error',
            description: 'Please select at least one trading rule',
            variant: 'destructive',
          });
          return false;
        }
        return true;

      case 4:
        if (!dailyTarget || parseFloat(dailyTarget) <= 0) {
          toast({
            title: 'Validation Error',
            description: 'Please enter a valid daily profit target',
            variant: 'destructive',
          });
          return false;
        }
        if (!weeklyTarget || parseFloat(weeklyTarget) <= 0) {
          toast({
            title: 'Validation Error',
            description: 'Please enter a valid weekly profit target',
            variant: 'destructive',
          });
          return false;
        }
        if (!monthlyTarget || parseFloat(monthlyTarget) <= 0) {
          toast({
            title: 'Validation Error',
            description: 'Please enter a valid monthly profit target',
            variant: 'destructive',
          });
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    if (!validateStep(currentStep) || !user) return;

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          starting_capital: parseFloat(startingCapital),
          current_capital: parseFloat(startingCapital),
          max_daily_loss: parseFloat(maxDailyLoss),
          max_trade_loss: parseFloat(maxTradeLoss),
          max_trades_per_day: parseInt(maxTradesPerDay),
          daily_target: parseFloat(dailyTarget),
          weekly_target: parseFloat(weeklyTarget),
          monthly_target: parseFloat(monthlyTarget),
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Insert trading rules
      const rulesToInsert = tradingRules
        .filter((rule) => rule.isActive)
        .map((rule, index) => ({
          user_id: user.id,
          rule_order: index + 1,
          rule_text: rule.text,
          category: rule.category,
          is_active: true,
        }));

      const { error: rulesError } = await supabase
        .from('trading_rules')
        .insert(rulesToInsert);

      if (rulesError) throw rulesError;

      toast({
        title: 'Success!',
        description: 'Your profile has been set up successfully',
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Setup Your Trading Profile</h1>
          <p className="text-muted-foreground">
            Complete these steps to get started with TradeMind
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <ProfileStep
              fullName={fullName}
              startingCapital={startingCapital}
              onFullNameChange={setFullName}
              onStartingCapitalChange={setStartingCapital}
            />
          )}

          {currentStep === 2 && (
            <RiskLimitsStep
              maxDailyLoss={maxDailyLoss}
              maxTradeLoss={maxTradeLoss}
              maxTradesPerDay={maxTradesPerDay}
              onMaxDailyLossChange={setMaxDailyLoss}
              onMaxTradeLossChange={setMaxTradeLoss}
              onMaxTradesPerDayChange={setMaxTradesPerDay}
            />
          )}

          {currentStep === 3 && (
            <TradingRulesStep rules={tradingRules} onRulesChange={setTradingRules} />
          )}

          {currentStep === 4 && (
            <GoalsStep
              dailyTarget={dailyTarget}
              weeklyTarget={weeklyTarget}
              monthlyTarget={monthlyTarget}
              onDailyTargetChange={setDailyTarget}
              onWeeklyTargetChange={setWeeklyTarget}
              onMonthlyTargetChange={setMonthlyTarget}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={loading} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Finish
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
