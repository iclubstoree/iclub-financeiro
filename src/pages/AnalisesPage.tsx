
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Receipt,
  Calculator,
  Percent,
  DollarSign,
  Calendar,
  Filter } from
'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '@/components/Layout';
import ExpenseFilters from '@/components/ExpenseFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/currency';

// Mock data - In a real application, this would come from an API
const mockExpenses = [
{ id: 1, date: '2024-01-15', dueDate: '2024-01-15', store: 'Loja Centro', category: 'Aluguel', costCenter: 'Administrativo', type: 'Fixo', description: 'Aluguel Janeiro', value: 5500, paid: true, recurring: true },
{ id: 2, date: '2024-01-16', dueDate: '2024-01-16', store: 'Loja Shopping', category: 'Salários', costCenter: 'Recursos Humanos', type: 'Fixo', description: 'Salários Janeiro', value: 12800, paid: true, recurring: true },
{ id: 3, date: '2024-01-18', dueDate: '2024-01-18', store: 'Loja Centro', category: 'Marketing', costCenter: 'Marketing', type: 'Variável', description: 'Facebook Ads', value: 1200, paid: true, recurring: false },
{ id: 4, date: '2024-01-20', dueDate: '2024-01-25', store: 'Matriz', category: 'Utilities', costCenter: 'Administrativo', type: 'Fixo', description: 'Energia elétrica', value: 890, paid: false, recurring: true },
{ id: 5, date: '2024-01-22', dueDate: '2024-01-22', store: 'Loja Online', category: 'Fornecedores', costCenter: 'Operacional', type: 'Variável', description: 'Estoque produtos', value: 8500, paid: true, recurring: false },
// Add more months of data for the 6-month evolution
{ id: 6, date: '2023-12-15', dueDate: '2023-12-15', store: 'Loja Centro', category: 'Aluguel', costCenter: 'Administrativo', type: 'Fixo', description: 'Aluguel Dezembro', value: 5500, paid: true, recurring: true },
{ id: 7, date: '2023-12-16', dueDate: '2023-12-16', store: 'Loja Shopping', category: 'Salários', costCenter: 'Recursos Humanos', type: 'Fixo', description: 'Salários Dezembro', value: 12800, paid: true, recurring: true },
{ id: 8, date: '2023-11-15', dueDate: '2023-11-15', store: 'Loja Centro', category: 'Aluguel', costCenter: 'Administrativo', type: 'Fixo', description: 'Aluguel Novembro', value: 5500, paid: true, recurring: true },
{ id: 9, date: '2023-11-16', dueDate: '2023-11-16', store: 'Loja Shopping', category: 'Salários', costCenter: 'Recursos Humanos', type: 'Fixo', description: 'Salários Novembro', value: 12800, paid: true, recurring: true },
{ id: 10, date: '2023-10-15', dueDate: '2023-10-15', store: 'Loja Centro', category: 'Aluguel', costCenter: 'Administrativo', type: 'Fixo', description: 'Aluguel Outubro', value: 5500, paid: true, recurring: true },
{ id: 11, date: '2023-10-16', dueDate: '2023-10-16', store: 'Loja Shopping', category: 'Salários', costCenter: 'Recursos Humanos', type: 'Fixo', description: 'Salários Outubro', value: 12800, paid: true, recurring: true },
{ id: 12, date: '2023-09-15', dueDate: '2023-09-15', store: 'Loja Centro', category: 'Marketing', costCenter: 'Marketing', type: 'Variável', description: 'Campanha Setembro', value: 2400, paid: true, recurring: false },
{ id: 13, date: '2023-08-15', dueDate: '2023-08-15', store: 'Matriz', category: 'Impostos', costCenter: 'Financeiro', type: 'Eventual', description: 'IPTU', value: 3200, paid: true, recurring: false }];


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
}

const AnalisesPage: React.FC = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    dateRange: 'last30days',
    customStartDate: '',
    customEndDate: '',
    stores: [],
    categories: [],
    costCenters: [],
    types: [],
    paymentStatus: '',
    recurrence: ''
  });

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      dateRange: '',
      customStartDate: '',
      customEndDate: '',
      stores: [],
      categories: [],
      costCenters: [],
      types: [],
      paymentStatus: '',
      recurrence: ''
    });
  };

  // Filter expenses based on current filters
  const filteredExpenses = useMemo(() => {
    let filtered = [...mockExpenses];

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((expense) =>
      expense.description.toLowerCase().includes(searchLower) ||
      expense.store.toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (filters.dateRange) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseDateOnly = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());

        switch (filters.dateRange) {
          case 'today':
            return expenseDateOnly.getTime() === today.getTime();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return expenseDateOnly.getTime() === yesterday.getTime();
          case 'last7days':
            const week = new Date(today);
            week.setDate(week.getDate() - 7);
            return expenseDateOnly >= week;
          case 'last30days':
            const month = new Date(today);
            month.setDate(month.getDate() - 30);
            return expenseDateOnly >= month;
          case 'thisMonth':
            return expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear();
          case 'lastMonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return expenseDate.getMonth() === lastMonth.getMonth() &&
            expenseDate.getFullYear() === lastMonth.getFullYear();
          case 'thisYear':
            return expenseDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Filter by custom date range
    if (filters.customStartDate && filters.customEndDate) {
      const startDate = new Date(filters.customStartDate);
      const endDate = new Date(filters.customEndDate);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    }

    // Filter by stores
    if (filters.stores.length > 0) {
      filtered = filtered.filter((expense) => filters.stores.includes(expense.store));
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((expense) => filters.categories.includes(expense.category));
    }

    // Filter by cost centers
    if (filters.costCenters.length > 0) {
      filtered = filtered.filter((expense) => filters.costCenters.includes(expense.costCenter));
    }

    // Filter by types
    if (filters.types.length > 0) {
      filtered = filtered.filter((expense) => filters.types.includes(expense.type));
    }

    // Filter by payment status
    if (filters.paymentStatus) {
      const now = new Date();
      filtered = filtered.filter((expense) => {
        const dueDate = new Date(expense.dueDate);
        switch (filters.paymentStatus) {
          case 'paid':
            return expense.paid;
          case 'pending':
            return !expense.paid && dueDate >= now;
          case 'overdue':
            return !expense.paid && dueDate < now;
          default:
            return true;
        }
      });
    }

    // Filter by recurrence
    if (filters.recurrence) {
      filtered = filtered.filter((expense) => {
        switch (filters.recurrence) {
          case 'recurring':
            return expense.recurring;
          case 'non-recurring':
            return !expense.recurring;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [mockExpenses, filters]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalValue = filteredExpenses.reduce((sum, expense) => sum + expense.value, 0);
    const totalCount = filteredExpenses.length;
    const averageTicket = totalCount > 0 ? totalValue / totalCount : 0;
    const recurringCount = filteredExpenses.filter((expense) => expense.recurring).length;
    const recurringPercentage = totalCount > 0 ? recurringCount / totalCount * 100 : 0;

    return [
    {
      title: 'Total de Saídas',
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Quantidade de Lançamentos',
      value: totalCount.toString(),
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(averageTicket),
      icon: Calculator,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: '% Recorrentes',
      value: formatPercentage(recurringPercentage),
      icon: Percent,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }];

  }, [filteredExpenses]);

  // Generate 6-month evolution data
  const evolutionData = useMemo(() => {
    const last6Months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthExpenses = mockExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === date.getMonth() &&
        expenseDate.getFullYear() === date.getFullYear();
      });

      const total = monthExpenses.reduce((sum, expense) => sum + expense.value, 0);

      last6Months.push({
        mes: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        valor: total,
        quantidade: monthExpenses.length
      });
    }

    return last6Months;
  }, []);

  // Calculate Top 5 Cost Centers
  const topCostCenters = useMemo(() => {
    const centerTotals = filteredExpenses.reduce((acc, expense) => {
      if (!acc[expense.costCenter]) {
        acc[expense.costCenter] = 0;
      }
      acc[expense.costCenter] += expense.value;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = Object.values(centerTotals).reduce((sum, value) => sum + value, 0);

    return Object.entries(centerTotals).
    map(([nome, valor]) => ({
      nome,
      valor,
      percentual: totalValue > 0 ? valor / totalValue * 100 : 0
    })).
    sort((a, b) => b.valor - a.valor).
    slice(0, 5);
  }, [filteredExpenses]);

  const chartColors = ['#22C55E', '#3B82F6', '#EAB308', '#8B5CF6', '#6B7280'];

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análises</h1>
          <p className="text-gray-600 mt-1">Análise detalhada das suas finanças</p>
        </div>

        {/* Filters */}
        <ExpenseFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters} />


        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                      <Icon size={24} className={kpi.color} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>);

          })}
        </div>

        {/* 6-Month Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="text-green-600" size={20} />
              <span>Evolução dos Últimos 6 Meses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false} />

                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />

                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Total']}
                    labelFormatter={(label) => `Mês: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} />

                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#22C55E"
                    strokeWidth={3}
                    dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }} />

                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Cost Centers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="text-blue-600" size={20} />
                <span>Top 5 Centros de Custo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCostCenters.map((centro, index) =>
                <div key={centro.nome} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: chartColors[index] || '#6B7280' }} />

                      <div>
                        <span className="font-medium text-gray-900">{centro.nome}</span>
                        <p className="text-sm text-gray-600">{formatPercentage(centro.percentual)} do total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(centro.valor)}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary by Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="text-purple-600" size={20} />
                <span>Resumo do Período</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-medium">Despesas Pagas</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(filteredExpenses.filter((e) => e.paid).reduce((sum, e) => sum + e.value, 0))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {filteredExpenses.filter((e) => e.paid).length} lançamentos
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="font-medium">Despesas Pendentes</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(filteredExpenses.filter((e) => !e.paid).reduce((sum, e) => sum + e.value, 0))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {filteredExpenses.filter((e) => !e.paid).length} lançamentos
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium">Despesas Recorrentes</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(filteredExpenses.filter((e) => e.recurring).reduce((sum, e) => sum + e.value, 0))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {filteredExpenses.filter((e) => e.recurring).length} lançamentos
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>);

};

export default AnalisesPage;