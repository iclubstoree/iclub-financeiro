import React from 'react';
import { Plus, Upload, MessageSquare, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onAddExpense: () => void;
  onImport: () => void;
  onChatAI: () => void;
  onExportCSV: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddExpense,
  onImport,
  onChatAI,
  onExportCSV,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      {/* Left side - Main action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onAddExpense}
          className="bg-green-500 text-white hover:bg-green-600 focus:bg-green-600">

          <Plus size={16} />
          Adicionar Saída
        </Button>
        
        <Button
          variant="outline"
          onClick={onImport}>

          <Upload size={16} />
          Importar
        </Button>
        
        <Button
          variant="outline"
          onClick={onChatAI}>

          <MessageSquare size={16} />
          Chat IA
        </Button>
        
        {hasActiveFilters &&
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="text-red-600 border-red-200 hover:bg-red-50">

            <X size={16} />
            Limpar Filtros
          </Button>
        }
      </div>
      
      {/* Right side - Export action */}
      <div className="flex justify-end sm:justify-start">
        <Button
          variant="outline"
          onClick={onExportCSV}
          className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300">

          <Download size={16} />
          Exportar CSV
        </Button>
      </div>
    </div>);

};

export default ActionButtons;