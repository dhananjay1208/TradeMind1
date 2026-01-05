'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GripVertical, Pencil, Check, X } from 'lucide-react';
import { useState } from 'react';

export interface TradingRule {
  id: string;
  text: string;
  category: string;
  isActive: boolean;
}

interface TradingRulesStepProps {
  rules: TradingRule[];
  onRulesChange: (rules: TradingRule[]) => void;
}

export function TradingRulesStep({ rules, onRulesChange }: TradingRulesStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const toggleRule = (id: string) => {
    const updatedRules = rules.map((rule) =>
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    );
    onRulesChange(updatedRules);
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingId) {
      const updatedRules = rules.map((rule) =>
        rule.id === editingId ? { ...rule, text: editText } : rule
      );
      onRulesChange(updatedRules);
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const moveRule = (index: number, direction: 'up' | 'down') => {
    const newRules = [...rules];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < rules.length) {
      [newRules[index], newRules[newIndex]] = [newRules[newIndex], newRules[index]];
      onRulesChange(newRules);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Trading Rules</CardTitle>
        <CardDescription>
          Review and customize your trading rules. These will help maintain discipline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col gap-1 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => moveRule(index, 'up')}
                  disabled={index === 0}
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
              </div>

              <Checkbox
                id={rule.id}
                checked={rule.isActive}
                onCheckedChange={() => toggleRule(rule.id)}
                className="mt-1"
              />

              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={rule.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {editingId === rule.id ? (
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
                </Label>
                <p className="text-xs text-muted-foreground">{rule.category}</p>
              </div>

              <div className="flex gap-1">
                {editingId === rule.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={saveEdit}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={cancelEdit}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => startEdit(rule.id, rule.text)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
