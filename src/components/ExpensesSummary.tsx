
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import { Badge } from '@/components/ui/badge';

interface SummaryItem {
  id: string;
  title: string;
  value: number;
  count: number;
  color: 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success' | 'neutral';
}

interface ExpensesSummaryProps {
  summaryData: SummaryItem[];
  selectedCard: string | null;
  onCardSelect: (cardId: string | null) => void;
}

const ExpensesSummary: React.FC<ExpensesSummaryProps> = ({
  summaryData,
  selectedCard,
  onCardSelect
}) => {
  const getCardStyles = (item: SummaryItem) => {
    const isSelected = selectedCard === item.id;

    // Base styles
    let styles = 'cursor-pointer transition-all duration-200 hover:shadow-md ';

    // Color styles based on item color and selection state
    if (isSelected) {
      switch (item.id) {
        case 'overdue':
          styles += 'bg-red-500 text-white border-red-500';
          break;
        case 'today':
          styles += 'bg-green-500 text-white border-green-500';
          break;
        case 'upcoming':
          styles += 'bg-yellow-600 text-white border-yellow-600';
          break;
        case 'recurring':
          styles += 'bg-emerald-600 text-white border-emerald-600';
          break;
        case 'non-recurring':
          styles += 'bg-slate-500 text-white border-slate-500';
          break;
        case 'total':
          styles += 'bg-green-600 text-white border-green-600';
          break;
        default:
          styles += 'bg-gray-500 text-white border-gray-500';
      }
    } else {
      switch (item.id) {
        case 'overdue':
          styles += 'bg-white border-red-500 border-2 text-gray-900 hover:bg-red-50';
          break;
        case 'today':
          styles += 'bg-white border-green-500 border-2 text-gray-900 hover:bg-green-50';
          break;
        case 'upcoming':
          styles += 'bg-white border-yellow-600 border-2 text-gray-900 hover:bg-yellow-50';
          break;
        case 'recurring':
          styles += 'bg-white border-emerald-600 border-2 text-gray-900 hover:bg-emerald-50';
          break;
        case 'non-recurring':
          styles += 'bg-slate-500 text-white border-slate-500';
          break;
        case 'total':
          styles += 'bg-green-600 text-white border-green-600';
          break;
        default:
          styles += 'bg-white border-gray-200 border text-gray-900 hover:bg-gray-50';
      }
    }

    return styles;
  };

  const handleCardClick = (cardId: string) => {
    if (selectedCard === cardId) {
      onCardSelect(null); // Deselect if already selected
    } else {
      onCardSelect(cardId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {summaryData.map((item) =>
      <Card
        key={item.id}
        className={getCardStyles(item)}
        onClick={() => handleCardClick(item.id)}>

          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-2">
              <p className="text-sm md:text-base font-bold break-words leading-tight">
                {formatCurrency(item.value)}
              </p>
              <Badge
              variant="secondary"
              className="text-xs">

                {item.count} {item.count === 1 ? 'item' : 'itens'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>);

};

export default ExpensesSummary;