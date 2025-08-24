
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import ActionButtons from '@/components/ActionButtons';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseFilters from '@/components/ExpenseFilters';
import ExpensesSummary from '@/components/ExpensesSummary';
import ExpensesTable, { Expense } from '@/components/ExpensesTable';
import { ImportModal, ChatModal, ExpenseEditModal, ExpenseDeleteModal } from '@/components/modals';
import { toast } from '@/lib/toast-config';

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

const initialFilters: FilterState = {
  searchTerm: '',
  dateRange: '',
  customStartDate: '',
  customEndDate: '',
  stores: [],
  categories: [],
  costCenters: [],
  types: [],
  paymentStatus: '',
  recurrence: '',
  cardFilter: ''
};

// Mock data para demonstração
const mockExpenses: Expense[] = [
{
  id: 1,
  date: '2024-01-15',
  dueDate: '2024-01-10', // Atrasado
  store: 'Loja Centro',
  category: 'Aluguel',
  costCenter: 'Administrativo',
  type: 'Fixo',
  description: 'Aluguel da loja centro',
  value: 3500.00,
  paid: false,
  recurring: true,
  recurrence: 'Mensal',
  notes: 'Aluguel mensal da loja centro'
},
{
  id: 2,
  date: '2024-01-14',
  dueDate: new Date().toISOString().split('T')[0], // Hoje
  store: 'Loja Shopping',
  category: 'Fornecedores',
  costCenter: 'Vendas',
  type: 'Variável',
  description: 'Compra de produtos para estoque',
  value: 2800.50,
  paid: false,
  recurring: false,
  notes: 'Compra de produtos para reposição de estoque'
},
{
  id: 3,
  date: '2024-01-13',
  dueDate: '2024-01-13',
  store: 'Loja Online',
  category: 'Marketing',
  costCenter: 'Marketing',
  type: 'Variável',
  description: 'Campanha publicitária Google Ads',
  value: 1200.00,
  paid: true,
  recurring: false,
  notes: 'Campanha para produtos em destaque'
},
{
  id: 4,
  date: '2024-01-12',
  dueDate: '2024-01-25', // Futuro
  store: 'Matriz',
  category: 'Utilities',
  costCenter: 'Administrativo',
  type: 'Fixo',
  description: 'Conta de energia elétrica',
  value: 890.30,
  paid: false,
  recurring: true,
  recurrence: 'Mensal'
},
{
  id: 5,
  date: '2024-01-11',
  dueDate: '2024-01-30',
  store: 'Loja Centro',
  category: 'Salários',
  costCenter: 'Recursos Humanos',
  type: 'Fixo',
  description: 'Folha de pagamento Janeiro',
  value: 15600.00,
  paid: false,
  recurring: true,
  recurrence: 'Mensal'
},
{
  id: 6,
  date: '2024-01-10',
  dueDate: '2024-01-20',
  store: 'Loja Shopping',
  category: 'Impostos',
  costCenter: 'Financeiro',
  type: 'Fixo',
  description: 'ICMS Janeiro',
  value: 4200.75,
  paid: false,
  recurring: true,
  recurrence: 'Mensal'
}];


const SaidasPage: React.FC = () => {
  const { t } = useTranslation();
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'date' | 'dueDate' | 'store' | 'category' | 'value' | 'paid'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load user preferences on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        if (preferences.pageSize) {
          setItemsPerPage(preferences.pageSize);
        }
      } catch (error) {
        console.error('Error parsing user preferences:', error);
      }
    }
  }, []);

  // Modal states
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Função para filtrar despesas
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Filtro por termo de busca
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((expense) =>
      expense.description.toLowerCase().includes(term) ||
      expense.store.toLowerCase().includes(term) ||
      expense.category.toLowerCase().includes(term)
      );
    }

    // Filtro por lojas
    if (filters.stores.length > 0) {
      filtered = filtered.filter((expense) => filters.stores.includes(expense.store));
    }

    // Filtro por categorias
    if (filters.categories.length > 0) {
      filtered = filtered.filter((expense) => filters.categories.includes(expense.category));
    }

    // Filtro por centros de custo
    if (filters.costCenters.length > 0) {
      filtered = filtered.filter((expense) => filters.costCenters.includes(expense.costCenter));
    }

    // Filtro por tipos
    if (filters.types.length > 0) {
      filtered = filtered.filter((expense) => filters.types.includes(expense.type));
    }

    // Filtro por status de pagamento
    if (filters.paymentStatus) {
      const today = new Date();
      filtered = filtered.filter((expense) => {
        if (filters.paymentStatus === 'paid') return expense.paid;
        if (filters.paymentStatus === 'pending') return !expense.paid && new Date(expense.dueDate) >= today;
        if (filters.paymentStatus === 'overdue') return !expense.paid && new Date(expense.dueDate) < today;
        return true;
      });
    }

    // Filtro por recorrência
    if (filters.recurrence) {
      filtered = filtered.filter((expense) => {
        if (filters.recurrence === 'recurring') return expense.recurring;
        if (filters.recurrence === 'non-recurring') return !expense.recurring;
        return true;
      });
    }

    // Filtro por cartão selecionado
    if (filters.cardFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((expense) => {
        const dueDate = new Date(expense.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (filters.cardFilter === 'overdue') return !expense.paid && dueDate < today;
        if (filters.cardFilter === 'today') return !expense.paid && dueDate.getTime() === today.getTime();
        if (filters.cardFilter === 'upcoming') return !expense.paid && dueDate > today;
        if (filters.cardFilter === 'recurring') return expense.recurring;
        if (filters.cardFilter === 'non-recurring') return !expense.recurring;
        if (filters.cardFilter === 'total') return true;
        return true;
      });
    }

    return filtered;
  }, [expenses, filters]);

  // Função para ordenar despesas (dueDate desc com date desc como tie-breaker)
  const sortedExpenses = useMemo(() => {
    const sorted = [...filteredExpenses].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      let result: number;

      if (sortField === 'date' || sortField === 'dueDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'value') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortField === 'paid') {
        aValue = a.paid ? 1 : 0;
        bValue = b.paid ? 1 : 0;
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortDirection === 'asc') {
        result = aValue > bValue ? 1 : -1;
      } else {
        result = aValue < bValue ? 1 : -1;
      }

      // Tie-breaker: if values are equal and sorting by dueDate, use date as secondary sort
      if (result === 0) {
        if (sortField === 'dueDate') {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          result = sortDirection === 'asc' ?
          dateA > dateB ? 1 : -1 :
          dateA < dateB ? 1 : -1;
        } else if (sortField === 'date') {
          const dueDateA = new Date(a.dueDate).getTime();
          const dueDateB = new Date(b.dueDate).getTime();
          result = sortDirection === 'asc' ?
          dueDateA > dueDateB ? 1 : -1 :
          dueDateA < dueDateB ? 1 : -1;
        }
      }

      return result;
    });

    return sorted;
  }, [filteredExpenses, sortField, sortDirection]);

  // Paginação
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedExpenses.slice(startIndex, endIndex);
  }, [sortedExpenses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  // Calcular dados do resumo
  const summaryData = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const overdue = filteredExpenses.filter((e) => !e.paid && new Date(e.dueDate) < today);
    const dueToday = filteredExpenses.filter((e) => !e.paid && e.dueDate === todayStr);
    const upcoming = filteredExpenses.filter((e) => !e.paid && new Date(e.dueDate) > today);
    const recurring = filteredExpenses.filter((e) => e.recurring);
    const nonRecurring = filteredExpenses.filter((e) => !e.recurring);
    const total = filteredExpenses;

    return [
    {
      id: 'overdue',
      title: 'Atrasadas',
      value: overdue.reduce((sum, e) => sum + e.value, 0),
      count: overdue.length,
      color: 'error' as const
    },
    {
      id: 'today',
      title: 'Vencendo Hoje',
      value: dueToday.reduce((sum, e) => sum + e.value, 0),
      count: dueToday.length,
      color: 'warning' as const
    },
    {
      id: 'upcoming',
      title: 'Próximas',
      value: upcoming.reduce((sum, e) => sum + e.value, 0),
      count: upcoming.length,
      color: 'primary' as const
    },
    {
      id: 'recurring',
      title: 'Recorrentes',
      value: recurring.reduce((sum, e) => sum + e.value, 0),
      count: recurring.length,
      color: 'info' as const
    },
    {
      id: 'non-recurring',
      title: 'Não Recorrentes',
      value: nonRecurring.reduce((sum, e) => sum + e.value, 0),
      count: nonRecurring.length,
      color: 'neutral' as const
    },
    {
      id: 'total',
      title: 'Total',
      value: total.reduce((sum, e) => sum + e.value, 0),
      count: total.length,
      color: 'success' as const
    }];

  }, [filteredExpenses]);

  // Handlers
  const handleAddExpense = () => {
    setShowInlineForm(true);
  };

  const handleFormSubmit = (formsData: any[]) => {
    const newExpenses: Expense[] = formsData.map((formData, index) => ({
      id: expenses.length + index + 1,
      date: formData.date || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      store: formData.store,
      category: formData.category || 'Outros',
      costCenter: formData.costCenter || 'Administrativo',
      type: formData.type || 'Variável',
      description: formData.description,
      value: parseFloat(formData.value),
      paid: formData.paid === 'sim',
      recurring: formData.recurring === 'sim',
      recurrence: formData.recurrence === 'personalizado' ?
      `${formData.customRecurrence?.interval || 1} ${formData.customRecurrence?.unit || 'months'}` :
      formData.recurrence,
      notes: formData.notes
    }));

    setExpenses((prev) => [...prev, ...newExpenses]);
    setShowInlineForm(false);
  };

  const handleChatExpenseAdd = (chatExpenses: any[]) => {
    const newExpenses: Expense[] = chatExpenses.map((expenseData, index) => ({
      id: expenses.length + index + 1,
      date: new Date().toISOString().split('T')[0],
      dueDate: expenseData.dueDate,
      store: expenseData.store,
      category: expenseData.category || 'Outros',
      costCenter: expenseData.costCenter || 'Administrativo',
      type: expenseData.type || 'Variável',
      description: expenseData.description,
      value: parseFloat(expenseData.value),
      paid: expenseData.paid || false,
      recurring: expenseData.recurring || false,
      recurrence: expenseData.recurrence,
      notes: ''
    }));

    setExpenses((prev) => [...prev, ...newExpenses]);
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditModalOpen(true);
  };

  const handleDeleteExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteModalOpen(true);
  };

  const handleSaveExpense = (updatedExpense: Expense) => {
    setExpenses((prev) => prev.map((e) => e.id === updatedExpense.id ? updatedExpense : e));
  };

  const handleMarkPaid = (expense: Expense) => {
    const updatedExpense = { ...expense, paid: true };
    setExpenses((prev) => prev.map((e) => e.id === expense.id ? updatedExpense : e));
    toast.expenseMarkedPaid();
  };

  const handleConfirmDelete = (id: number, deleteRecurring: boolean) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSort = (field: typeof sortField, direction: typeof sortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset para primeira página quando filtros mudarem
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSelectedCard(null);
    setCurrentPage(1);
    toast.success('Filtros limpos!');
  };

  const handleCardSelect = (cardId: string | null) => {
    setSelectedCard(cardId);
    setFilters((prev) => ({
      ...prev,
      cardFilter: cardId || ''
    }));
    setCurrentPage(1);
  };

  const clearCardSelection = () => {
    setSelectedCard(null);
    setFilters((prev) => ({
      ...prev,
      cardFilter: ''
    }));
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== ''
    );
  };

  const handleImport = () => {
    setImportModalOpen(true);
  };

  const handleChatAI = () => {
    setChatModalOpen(true);
  };

  const handleImportComplete = (data: any[]) => {
    const newExpenses = data.map((item, index) => ({
      id: expenses.length + index + 1,
      date: item['Data'],
      dueDate: item['Data de Vencimento'],
      store: item['Loja'],
      category: item['Categoria'],
      costCenter: item['Centro de Custo'],
      type: item['Tipo'],
      description: item['Descrição'],
      value: parseFloat(item['Valor']),
      paid: item['Pago'] === 'Sim',
      recurring: item['Recorrente'] === 'Sim',
      recurrence: item['Recorrência'],
      notes: item['Observações']
    }));

    setExpenses((prev) => [...prev, ...newExpenses]);
  };

  const handleExportCSV = () => {
    // Implementação básica de exportação CSV
    const csvContent = [
    ['Data', 'Vencimento', 'Loja', 'Categoria', 'Centro de Custo', 'Tipo', 'Descrição', 'Valor', 'Pago', 'Recorrente'],
    ...sortedExpenses.map((expense) => [
    expense.date,
    expense.dueDate,
    expense.store,
    expense.category,
    expense.costCenter,
    expense.type,
    expense.description,
    expense.value.toString(),
    expense.paid ? 'Sim' : 'Não',
    expense.recurring ? 'Sim' : 'Não']
    )];


    const csv = csvContent.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'saidas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV exportado com sucesso!');
  };

  useEffect(() => {
    // Reset página quando filtros mudarem
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Listen for preference changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userPreferences' && e.newValue) {
        try {
          const preferences = JSON.parse(e.newValue);
          if (preferences.pageSize && preferences.pageSize !== itemsPerPage) {
            setItemsPerPage(preferences.pageSize);
            setCurrentPage(1); // Reset to first page when page size changes
          }
        } catch (error) {
          console.error('Error parsing updated preferences:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [itemsPerPage]);

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saídas</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as saídas financeiras</p>
          </div>
        </div>

        {/* Action Buttons */}
        <ActionButtons
          onAddExpense={handleAddExpense}
          onImport={handleImport}
          onChatAI={handleChatAI}
          onExportCSV={handleExportCSV}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters()} />


        {/* Inline Form */}
        {showInlineForm &&
        <ExpenseForm
          onClose={() => setShowInlineForm(false)}
          onSubmit={handleFormSubmit} />

        }

        {/* Filters */}
        <ExpenseFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          selectedCard={selectedCard}
          onCardClear={clearCardSelection} />


        {/* Summary Cards */}
        <ExpensesSummary
          summaryData={summaryData}
          selectedCard={selectedCard}
          onCardSelect={handleCardSelect} />


        {/* Expenses Table */}
        <ExpensesTable
          expenses={paginatedExpenses}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={sortedExpenses.length}
          onPageChange={handlePageChange}
          onSort={handleSort}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          onMarkPaid={handleMarkPaid} />


        {/* Modals */}
        <ImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          onImportComplete={handleImportComplete} />


        <ChatModal
          open={chatModalOpen}
          onOpenChange={setChatModalOpen}
          onExpenseAdd={handleChatExpenseAdd} />


        <ExpenseEditModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          expense={selectedExpense}
          onSave={handleSaveExpense}
          onDelete={handleDeleteExpense} />


        <ExpenseDeleteModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          expense={selectedExpense}
          onDelete={handleConfirmDelete} />

      </div>
    </Layout>);

};

export default SaidasPage;