
import React, { useState } from 'react';
import { Trash2, AlertTriangle, DollarSign, Calendar, Store } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Expense {
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

interface ExpenseDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  onDelete: (id: number, deleteRecurring: boolean) => void;
}

const ExpenseDeleteModal: React.FC<ExpenseDeleteModalProps> = ({
  open,
  onOpenChange,
  expense,
  onDelete
}) => {
  const [deleteRecurring, setDeleteRecurring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!expense) return null;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Simular delay de processamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await onDelete(expense.id, deleteRecurring);

      if (expense.recurring && deleteRecurring) {
        toast.success('Despesa e todas as recorrências foram excluídas!');
      } else {
        toast.success('Despesa excluída com sucesso!');
      }

      onOpenChange(false);
      setDeleteRecurring(false);
    } catch (error) {
      toast.error('Erro ao excluir despesa');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onOpenChange(false);
      setDeleteRecurring(false);
    }
  };

  const getImpactLevel = () => {
    if (expense.recurring) return 'high';
    if (expense.value > 5000) return 'medium';
    return 'low';
  };

  const impactLevel = getImpactLevel();

  const impactInfo = {
    high: {
      color: 'bg-red-500',
      text: 'Alto Impacto',
      description: 'Esta ação afetará múltiplas despesas recorrentes'
    },
    medium: {
      color: 'bg-orange-500',
      text: 'Médio Impacto',
      description: 'Despesa de valor alto - revisar com cuidado'
    },
    low: {
      color: 'bg-yellow-500',
      text: 'Baixo Impacto',
      description: 'Despesa única de valor baixo/médio'
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 size={20} />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Impact Alert */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="flex items-center justify-between">
                <span>Esta ação não pode ser desfeita</span>
                <Badge className={`${impactInfo[impactLevel].color} text-white`}>
                  {impactInfo[impactLevel].text}
                </Badge>
              </div>
              <p className="mt-1 text-sm">{impactInfo[impactLevel].description}</p>
            </AlertDescription>
          </Alert>

          {/* Expense Details */}
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-red-700">Despesa a ser excluída:</h3>
                  <Badge variant={expense.paid ? "success" : "destructive"}>
                    {expense.paid ? 'Pago' : 'Pendente'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Store size={16} className="text-gray-500" />
                    <span className="font-medium">{expense.store}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>Vence: {new Date(expense.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-500" />
                    <span className="font-bold text-lg">
                      R$ {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>{expense.category}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-medium mb-1">Descrição:</p>
                  <p className="text-gray-700">{expense.description}</p>
                  
                  {expense.notes &&
                  <>
                      <p className="font-medium mb-1 mt-3">Observações:</p>
                      <p className="text-gray-600 text-sm">{expense.notes}</p>
                    </>
                  }
                </div>

                {expense.recurring &&
                <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                      <span className="font-medium text-orange-700">Despesa Recorrente</span>
                      <Badge variant="outline">{expense.recurrence}</Badge>
                    </div>
                    
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        Esta despesa se repete {expense.recurrence?.toLowerCase()}. Você pode escolher excluir apenas esta ocorrência ou todas as futuras.
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                      id="deleteRecurring"
                      checked={deleteRecurring}
                      onCheckedChange={(checked) => setDeleteRecurring(checked as boolean)} />

                      <Label htmlFor="deleteRecurring" className="text-sm">
                        Excluir também todas as ocorrências futuras desta despesa recorrente
                      </Label>
                    </div>
                  </div>
                }
              </div>
            </CardContent>
          </Card>



          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}>

              Cancelar
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700">

              {isDeleting ?
              <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Excluindo...
                </div> :

              <>
                  <Trash2 size={16} className="mr-2" />
                  {expense.recurring && deleteRecurring ? 'Excluir Todas' : 'Excluir Despesa'}
                </>
              }
            </Button>
          </div>

          {/* Summary */}
          {deleteRecurring && expense.recurring &&
          <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <span className="font-medium">Resumo da ação:</span>
                <ul className="mt-1 text-sm list-disc list-inside">
                  <li>Despesa atual será excluída</li>
                  <li>Todas as ocorrências futuras desta despesa recorrente serão excluídas</li>
                  <li>Esta ação não pode ser desfeita</li>
                </ul>
              </AlertDescription>
            </Alert>
          }
        </div>
      </DialogContent>
    </Dialog>);

};

export default ExpenseDeleteModal;