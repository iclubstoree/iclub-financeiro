
import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ExpenseData {
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

interface ExpenseEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseData | null;
  onSave: (expense: ExpenseData) => void;
  onDelete: (expense: ExpenseData) => void;
}

const STORES = [
{ value: 'loja-centro', label: 'Loja Centro' },
{ value: 'loja-shopping', label: 'Loja Shopping' },
{ value: 'loja-online', label: 'Loja Online' },
{ value: 'matriz', label: 'Matriz' }];


const CATEGORIES = [
{ value: 'aluguel', label: 'Aluguel' },
{ value: 'fornecedores', label: 'Fornecedores' },
{ value: 'marketing', label: 'Marketing' },
{ value: 'utilities', label: 'Utilities' },
{ value: 'salarios', label: 'Salários' },
{ value: 'impostos', label: 'Impostos' },
{ value: 'manutencao', label: 'Manutenção' },
{ value: 'outros', label: 'Outros' }];


const COST_CENTERS = [
{ value: 'administrativo', label: 'Administrativo' },
{ value: 'vendas', label: 'Vendas' },
{ value: 'marketing', label: 'Marketing' },
{ value: 'operacional', label: 'Operacional' },
{ value: 'financeiro', label: 'Financeiro' },
{ value: 'rh', label: 'Recursos Humanos' }];


const TYPES = [
{ value: 'fixo', label: 'Fixo' },
{ value: 'variavel', label: 'Variável' },
{ value: 'eventual', label: 'Eventual' }];


const RECURRENCE_OPTIONS = [
{ value: 'mensal', label: 'Mensal' },
{ value: 'bimestral', label: 'Bimestral' },
{ value: 'trimestral', label: 'Trimestral' },
{ value: 'semestral', label: 'Semestral' },
{ value: 'anual', label: 'Anual' }];


const ExpenseEditModal: React.FC<ExpenseEditModalProps> = ({
  open,
  onOpenChange,
  expense,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<ExpenseData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (expense) {
      setFormData({ ...expense });
      setHasChanges(false);
      setErrors({});
    }
  }, [expense]);

  const handleInputChange = (field: keyof ExpenseData, value: any) => {
    if (!formData) return;

    setFormData((prev) => ({ ...prev!, [field]: value }));
    setHasChanges(true);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!formData) return false;

    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }
    if (!formData.store) {
      newErrors.store = 'Loja é obrigatória';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!formData) return;

    if (!validateForm()) {
      toast.error('Por favor, corrija os campos obrigatórios');
      return;
    }

    onSave(formData);
    toast.success('Saída atualizada com sucesso!', { duration: 3000 });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!formData) return;
    onDelete(formData);
    onOpenChange(false);
  };

  const getInputClassName = (field: string, baseClassName = "") => {
    return errors[field] ? `${baseClassName} border-red-500 focus:border-red-500` : baseClassName;
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="flex items-center justify-between">
            <span>Editar Saída</span>
            {hasChanges &&
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                Alterações pendentes
              </Badge>
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 bg-white">
          {/* Basic Information */}
          <Card className="bg-white">
            <CardContent className="p-6 space-y-6">
              {/* Primeira linha - Datas e Loja */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-white" />

                </div>
                <div>
                  <Label htmlFor="dueDate">Data de Vencimento *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className={getInputClassName('dueDate', 'bg-white')} />

                  {errors.dueDate &&
                  <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
                  }
                </div>
                <div>
                  <Label htmlFor="store">Loja *</Label>
                  <Select value={formData.store} onValueChange={(value) => handleInputChange('store', value)}>
                    <SelectTrigger className={getInputClassName('store', 'bg-white')}>
                      <SelectValue placeholder="Selecione a loja" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {STORES.map((store) =>
                      <SelectItem key={store.value} value={store.value}>
                          {store.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.store &&
                  <p className="text-red-500 text-xs mt-1">{errors.store}</p>
                  }
                </div>
              </div>

              {/* Segunda linha - Categoria, Centro de Custo e Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {CATEGORIES.map((category) =>
                      <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="costCenter">Centro de Custo</Label>
                  <Select value={formData.costCenter} onValueChange={(value) => handleInputChange('costCenter', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione o centro de custo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {COST_CENTERS.map((center) =>
                      <SelectItem key={center.value} value={center.value}>
                          {center.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {TYPES.map((type) =>
                      <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Terceira linha - Descrição e Valor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    placeholder="Digite a descrição da saída"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={getInputClassName('description', 'bg-white')} />

                  {errors.description &&
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  }
                </div>
                <div>
                  <Label htmlFor="value">Valor (R$) *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.value || ''}
                    onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                    className={getInputClassName('value', 'bg-white')} />

                  {errors.value &&
                  <p className="text-red-500 text-xs mt-1">{errors.value}</p>
                  }
                </div>
              </div>

              {/* Classificação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Pago</Label>
                  <Select
                    value={formData.paid ? 'sim' : 'nao'}
                    onValueChange={(value) => handleInputChange('paid', value === 'sim')}>

                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Recorrência</Label>
                  <Select
                    value={formData.recurring ? 'sim' : 'nao'}
                    onValueChange={(value) => handleInputChange('recurring', value === 'sim')}>

                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.recurring &&
                <div>
                    <Label>Tipo de Recorrência</Label>
                    <Select value={formData.recurrence || ''} onValueChange={(value) => handleInputChange('recurrence', value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione a recorrência" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {RECURRENCE_OPTIONS.map((option) =>
                      <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                  </div>
                }
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Digite observações adicionais"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="bg-white" />

              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {Object.keys(errors).length > 0 &&
          <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                Por favor, corrija os campos obrigatórios antes de salvar.
              </AlertDescription>
            </Alert>
          }

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700">

              <X className="mr-2 h-4 w-4" />
              Excluir Saída
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!hasChanges}>

                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);

};

export default ExpenseEditModal;