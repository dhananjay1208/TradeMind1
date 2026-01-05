'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mood } from '@/types';
import { Smile } from 'lucide-react';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodChange: (mood: Mood) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

const moods: { value: Mood; emoji: string; label: string; description: string }[] = [
  {
    value: 'Confident',
    emoji: '😊',
    label: 'Confident',
    description: 'Ready and focused',
  },
  {
    value: 'Neutral',
    emoji: '😐',
    label: 'Neutral',
    description: 'Balanced mindset',
  },
  {
    value: 'Anxious',
    emoji: '😰',
    label: 'Anxious',
    description: 'Uncertain or worried',
  },
  {
    value: 'Aggressive',
    emoji: '😤',
    label: 'Aggressive',
    description: 'High energy, watch out',
  },
  {
    value: 'Calm',
    emoji: '🧘',
    label: 'Calm',
    description: 'Peaceful and patient',
  },
];

export function MoodSelector({
  selectedMood,
  onMoodChange,
  notes,
  onNotesChange,
}: MoodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="h-5 w-5 text-primary" />
          Pre-Market Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-3 block">
            How are you feeling today?
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => onMoodChange(mood.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:border-primary/50 ${
                  selectedMood === mood.value
                    ? 'border-primary bg-primary/10 shadow-md scale-105'
                    : 'border-muted hover:bg-accent'
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs font-medium text-center leading-tight">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {moods.find((m) => m.value === selectedMood)?.description}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="market-notes" className="text-sm font-medium mb-2 block">
            Market Notes & Observations
          </Label>
          <Textarea
            id="market-notes"
            placeholder="What's happening in the market today? Any key levels, news, or observations..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Document market conditions, key levels, and your trading plan for today
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
