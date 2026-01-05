'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ReadyToTradeButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function ReadyToTradeButton({
  onClick,
  disabled,
  loading,
}: ReadyToTradeButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        size="lg"
        className="w-full max-w-md h-16 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Starting Trading Day...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-6 w-6" />
            I Am Ready to Trade
          </>
        )}
      </Button>

      {disabled && !loading && (
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Please complete all steps above before starting your trading day
        </p>
      )}
    </div>
  );
}
