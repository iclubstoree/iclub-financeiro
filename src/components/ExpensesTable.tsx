
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2, CreditCard, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/currency';

export interface Expense {
  id: number;
  date: string;
  dueDate: string;
  store: string;
  category: string;
  costCenter: string;
  type: string;
  description: string;
  value: number;
  paid: boolean;
  recurring: boolean;
  recurrence?: string;
  notes?: string;
}

type SortField = 'date' | 'dueDate' | 'store' | 'category' | 'value' | 'paid';
type SortDirection = 'asc' | 'desc';

interface ExpensesTableProps {
  expenses: Expense[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onSort: (field: SortField, direction: SortDirection) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onMarkPaid: (expense: Expense) => void;
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onSort,
  onEdit,
  onDelete,
  onMarkPaid
}) => {
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  const getStatusColor = (paid: boolean, dueDate: string) => {
    if (paid) return 'success';
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return 'error';
    if (due.toDateString() === today.toDateString()) return 'warning';
    return 'primary';
  };

  const getStatusBadge = (paid: boolean, dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);

    let text = 'Pendente';
    let className = 'bg-blue-100 text-blue-800';

    if (paid) {
      text = 'Pago';
      className = 'bg-green-100 text-green-800';
    } else if (due < today) {
      text = 'Atrasado';
      className = 'bg-red-100 text-red-800';
    } else if (due.toDateString() === today.toDateString()) {
      text = 'Vence Hoje';
      className = 'bg-yellow-100 text-yellow-800';
    }

    return <Badge className={className}>{text}</Badge>;
  };

  const SortIcon: React.FC<{field: SortField;}> = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="opacity-30" />;
    return sortDirection === 'asc' ?
    <ChevronUp size={12} className="text-green-600" /> :
    <ChevronDown size={12} className="text-green-600" />;
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Saídas</CardTitle>
            <div className="text-sm text-gray-500">
              {expenses.length} resultado{expenses.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th
                    className="text-left p-3 cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('date')}>

                    <div className="flex items-center gap-1">
                      Data
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th
                    className="text-left p-3 cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('dueDate')}>

                    <div className="flex items-center gap-1">
                      Vencimento
                      <SortIcon field="dueDate" />
                    </div>
                  </th>
                  <th
                    className="text-left p-3 cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('store')}>

                    <div className="flex items-center gap-1">
                      Loja
                      <SortIcon field="store" />
                    </div>
                  </th>
                  <th
                    className="text-left p-3 cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('category')}>

                    <div className="flex items-center gap-1">
                      Categoria
                      <SortIcon field="category" />
                    </div>
                  </th>
                  <th className="text-left p-3">Centro de Custo</th>
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Descrição</th>
                  <th
                    className="text-right p-3 cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('value')}>

                    <div className="flex items-center gap-1 justify-end">
                      Valor
                      <SortIcon field="value" />
                    </div>
                  </th>
                  <th
                    className="text-center p-3 cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('paid')}>

                    <div className="flex items-center gap-1 justify-center">
                      Status
                      <SortIcon field="paid" />
                    </div>
                  </th>
                  <th className="text-center p-3">Recorrente</th>
                  <th className="text-center p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) =>
                <tr key={expense.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">{formatDate(expense.date)}</td>
                    <td className="p-3">{formatDate(expense.dueDate)}</td>
                    <td className="p-3 font-medium">{expense.store}</td>
                    <td className="p-3">
                      <Badge variant="outline">{expense.category}</Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{expense.costCenter}</td>
                    <td className="p-3">
                      <Badge variant={expense.type === 'Fixo' ? 'default' : 'secondary'}>
                        {expense.type}
                      </Badge>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="truncate" title={expense.description}>
                        {expense.description}
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {formatCurrency(expense.value)}
                    </td>
                    <td className="p-3 text-center">
                      {getStatusBadge(expense.paid, expense.dueDate)}
                    </td>
                    <td className="p-3 text-center">
                      {expense.recurring ?
                    <Badge className="bg-blue-100 text-blue-800">
                          {expense.recurrence || 'Sim'}
                        </Badge> :

                    <Badge className="bg-gray-100 text-gray-800">Não</Badge>
                    }
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {!expense.paid &&
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onMarkPaid(expense)}
                        title="Pagar">

                            <CreditCard size={16} />
                          </Button>
                      }
                        <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => onEdit(expense)}
                        title="Editar">

                          <Edit size={16} />
                        </Button>
                        <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(expense)}
                        title="Excluir">

                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {expenses.map((expense) =>
            <Card key={expense.id} className="border-l-4 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{expense.description}</div>
                    <div className="flex gap-1">
                      {!expense.paid &&
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onMarkPaid(expense)}
                      title="Pagar">

                          <CreditCard size={16} />
                        </Button>
                    }
                      <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => onEdit(expense)}
                      title="Editar">

                        <Edit size={16} />
                      </Button>
                      <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(expense)}
                      title="Excluir">

                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {formatCurrency(expense.value)}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {getStatusBadge(expense.paid, expense.dueDate)}
                    <Badge variant="outline">{expense.category}</Badge>
                    <Badge variant={expense.type === 'Fixo' ? 'default' : 'secondary'}>
                      {expense.type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div><strong>Loja:</strong> {expense.store}</div>
                    <div><strong>Data:</strong> {formatDate(expense.date)}</div>
                    <div><strong>Vencimento:</strong> {formatDate(expense.dueDate)}</div>
                    <div><strong>Centro:</strong> {expense.costCenter}</div>
                  </div>
                  
                  {expense.recurring &&
                <div className="mt-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        Recorrente - {expense.recurrence || 'Mensal'}
                      </Badge>
                    </div>
                }
                </CardContent>
              </Card>
            )}
          </div>

          {/* Empty State */}
          {expenses.length === 0 &&
          <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">Nenhuma saída encontrada</div>
              <div className="text-gray-400 text-sm">
                Tente ajustar os filtros ou adicionar uma nova saída
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* Pagination and Footer */}
      {totalPages > 1 &&
      <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 order-2 sm:order-1">
                Exibindo {startItem} a {endItem} de {totalItems} resultados
              </div>
              <div className="flex items-center space-x-1 order-1 sm:order-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1">

                  <ChevronLeft size={16} />
                  Previous
                </Button>
                
                {generatePageNumbers().map((page) =>
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={page === currentPage ? "bg-green-600 hover:bg-green-700 text-white" : ""}>

                    {page}
                  </Button>
              )}
                
                <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1">

                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }

      {/* Summary Footer */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex gap-6">
              <div className="text-gray-600">
                <span className="font-medium">Total de Saídas:</span> {totalItems}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Valor Total:</span> {
                formatCurrency(expenses.reduce((sum, expense) => sum + expense.value, 0))
                }
              </div>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="text-red-600">
                <span className="font-medium">Atrasadas:</span> {
                expenses.filter((e) => !e.paid && new Date(e.dueDate) < new Date()).length
                }
              </div>
              <div className="text-green-600">
                <span className="font-medium">Pagas:</span> {
                expenses.filter((e) => e.paid).length
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default ExpensesTable;