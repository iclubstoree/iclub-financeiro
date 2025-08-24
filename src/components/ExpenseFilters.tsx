
import React, { useState } from 'react';
import { ChevronDown, Filter, X, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FilterState {
  searchTerm: string;
  dateRange: string;
  customStartDate: string;
  customEndDate: string;
  stores: string[];
  categories: string[];
  costCenters: string[];
  types: string[];
  paymentStatus: string;
  recurrence: string;
  cardFilter: string;
}

interface ExpenseFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  selectedCard: string | null;
  onCardClear: () => void;
}

// Data for dropdowns - in a real app, these would come from the database
const storesOptions = [
'Loja Centro',
'Loja Shopping',
'Loja Online',
'Matriz'];


const categoriesOptions = [
'Aluguel',
'Fornecedores',
'Marketing',
'Utilities',
'Salários',
'Impostos'];


const costCentersOptions = [
'Administrativo',
'Vendas',
'Marketing',
'Recursos Humanos',
'Financeiro'];


const typesOptions = [
'Fixo',
'Variável'];


const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  selectedCard,
  onCardClear
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleMultiSelectChange = (key: keyof FilterState, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value) ?
    currentValues.filter((v) => v !== value) :
    [...currentValues, value];

    handleFilterChange(key, newValues);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.dateRange) count++;
    if (filters.customStartDate && filters.customEndDate) count++;
    if (filters.stores.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.costCenters.length > 0) count++;
    if (filters.types.length > 0) count++;
    if (filters.paymentStatus) count++;
    if (filters.recurrence) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0 || selectedCard;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
        {hasActiveFilters &&
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Filtros aplicados
          </Badge>
        }
      </div>

      <Card className="p-4 bg-white">
        <div className="space-y-4">
          {/* Main Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar descrição, loja, categoria..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="pl-10 bg-white" />
              </div>
            </div>

            {/* Period */}
            <div className="space-y-2">
              <Label>Período</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="thisMonth">Este mês</SelectItem>
                  <SelectItem value="lastMonth">Mês passado</SelectItem>
                  <SelectItem value="thisYear">Este ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Store */}
            <div className="space-y-2">
              <Label>Loja</Label>
              <Select
                value={filters.stores.length > 0 ? filters.stores[0] : ''}
                onValueChange={(value) => handleFilterChange('stores', value ? [value] : [])}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Todas as lojas" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Todos</SelectItem>
                  {storesOptions.map((store) =>
                  <SelectItem key={store} value={store}>
                      {store}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categorias</Label>
              <Select
                value={filters.categories.length > 0 ? filters.categories[0] : ''}
                onValueChange={(value) => handleFilterChange('categories', value ? [value] : [])}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Todos</SelectItem>
                  {categoriesOptions.map((category) =>
                  <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Paid */}
            <div className="space-y-2">
              <Label>Pagos</Label>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) => handleFilterChange('paymentStatus', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Card Filter */}
          {selectedCard &&
          <div className="flex items-center gap-2 pt-2 border-t">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {selectedCard === 'overdue' && 'Atrasadas'}
                {selectedCard === 'today' && 'Vencendo Hoje'}
                {selectedCard === 'upcoming' && 'Próximas'}
                {selectedCard === 'recurring' && 'Recorrentes'}
                {selectedCard === 'non-recurring' && 'Não Recorrentes'}
                {selectedCard === 'total' && 'Total'}
                <button
                onClick={onCardClear}
                className="ml-2 text-green-600 hover:text-green-800">

                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          }

          {/* More Filters Toggle */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-gray-600 hover:text-gray-900">

              <Filter className="mr-2 h-4 w-4" />
              Mais filtros
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}>

              <X className="mr-2 h-4 w-4" />
              Limpar filtros
            </Button>
          </div>

          {/* More Filters Section */}
          {showMoreFilters &&
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              {/* Cost Centers */}
              <div className="space-y-2">
                <Label>Centro de Custo</Label>
                <Select
                value={filters.costCenters.length > 0 ? filters.costCenters[0] : ''}
                onValueChange={(value) => handleFilterChange('costCenters', value ? [value] : [])}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Todos os centros" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="">Todos</SelectItem>
                    {costCentersOptions.map((center) =>
                  <SelectItem key={center} value={center}>
                        {center}
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status */}
              <div className="space-y-2">
                <Label>Status do Pagamento</Label>
                <Select
                value={filters.paymentStatus}
                onValueChange={(value) => handleFilterChange('paymentStatus', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="overdue">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Types */}
              <div className="space-y-2">
                <Label>Tipos</Label>
                <Select
                value={filters.types.length > 0 ? filters.types[0] : ''}
                onValueChange={(value) => handleFilterChange('types', value ? [value] : [])}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="">Todos</SelectItem>
                    {typesOptions.map((type) =>
                  <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          }

          {/* Custom Date Range */}
          {filters.dateRange === 'custom' &&
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input
                type="date"
                value={filters.customStartDate}
                onChange={(e) => handleFilterChange('customStartDate', e.target.value)}
                className="bg-white" />

              </div>
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input
                type="date"
                value={filters.customEndDate}
                onChange={(e) => handleFilterChange('customEndDate', e.target.value)}
                className="bg-white" />

              </div>
            </div>
          }
        </div>
      </Card>
    </div>);

};

export default ExpenseFilters;