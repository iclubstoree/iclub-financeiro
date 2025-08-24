
import React, { useState } from 'react';
import { Plus, Copy, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ExpenseFormData {
  date: string;
  dueDate: string;
  store: string;
  category: string;
  costCenter: string;
  type: string;
  description: string;
  value: string;
  paid: string;
  recurring: string;
  recurrence: string;
  customRecurrence?: {
    interval: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
  notes: string;
  origin?: string;
}

interface ValidationError {
  field: keyof ExpenseFormData;
  message: string;
}

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: ExpenseFormData[]) => void;
  initialData?: Partial<ExpenseFormData>;
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
{ value: 'anual', label: 'Anual' },
{ value: 'personalizada', label: 'Personalizada' }];


const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSubmit, initialData = {} }) => {
  const getDefaultFormData = (): ExpenseFormData => ({
    date: '',
    dueDate: '',
    store: '',
    category: '',
    costCenter: '',
    type: '',
    description: '',
    value: '',
    paid: 'nao',
    recurring: 'nao',
    recurrence: '',
    notes: '',
    origin: initialData.origin || 'manual',
    ...initialData
  });

  const [forms, setForms] = useState<ExpenseFormData[]>([getDefaultFormData()]);
  const [errors, setErrors] = useState<Record<number, ValidationError[]>>({});

  const validateForm = (formData: ExpenseFormData, index: number): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    // Required fields validation
    if (!formData.description.trim()) {
      validationErrors.push({ field: 'description', message: 'Descrição é obrigatória' });
    }
    if (!formData.value.trim()) {
      validationErrors.push({ field: 'value', message: 'Valor é obrigatório' });
    }
    if (!formData.store) {
      validationErrors.push({ field: 'store', message: 'Loja é obrigatória' });
    }
    if (!formData.dueDate) {
      validationErrors.push({ field: 'dueDate', message: 'Data de vencimento é obrigatória' });
    }

    return validationErrors;
  };

  const handleInputChange = (index: number, field: keyof ExpenseFormData, value: string | boolean | object) => {
    setForms((prev) => prev.map((form, i) =>
    i === index ? { ...form, [field]: value } : form
    ));

    // Clear errors for this field
    setErrors((prev) => ({
      ...prev,
      [index]: (prev[index] || []).filter((error) => error.field !== field)
    }));
  };

  const addForm = () => {
    setForms((prev) => [...prev, getDefaultFormData()]);
  };

  const copyForm = (index: number) => {
    const formToCopy = { ...forms[index] };
    setForms((prev) => [...prev, formToCopy]);
  };

  const removeForm = (index: number) => {
    if (forms.length === 1) {
      onClose();
      return;
    }
    setForms((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleSubmit = () => {
    const allErrors: Record<number, ValidationError[]> = {};
    let hasErrors = false;

    forms.forEach((form, index) => {
      const formErrors = validateForm(form, index);
      if (formErrors.length > 0) {
        allErrors[index] = formErrors;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(allErrors);
      toast.error('Por favor, corrija os campos obrigatórios destacados');
      return;
    }

    onSubmit(forms);
    toast.success(forms.length === 1 ? 'Saída adicionada com sucesso!' : `${forms.length} saídas adicionadas com sucesso!`, {
      duration: 3000
    });
    onClose();
  };

  const getFieldError = (formIndex: number, field: keyof ExpenseFormData) => {
    return errors[formIndex]?.find((error) => error.field === field);
  };

  const getInputClassName = (formIndex: number, field: keyof ExpenseFormData, baseClassName = "") => {
    const error = getFieldError(formIndex, field);
    return error ? `${baseClassName} border-red-500 focus:border-red-500 focus:ring-red-500` : baseClassName;
  };

  return (
    <div className="space-y-4">
      {forms.map((formData, index) =>
      <Card key={index} className="animate-slide-in-up bg-white">
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between">
              <CardTitle>
                {forms.length === 1 ? 'Nova Saída' : `Saída ${index + 1}`}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => copyForm(index)}
                className="text-gray-600 hover:text-gray-800">

                  <Copy size={16} className="mr-1" />
                  Copiar
                </Button>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => removeForm(index)}
                className="text-gray-600 hover:text-gray-800">

                  <X size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="space-y-6">
              {/* Primeira linha - Datas e Loja */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`date-${index}`}>Data</Label>
                  <Input
                  id={`date-${index}`}
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                  className={getInputClassName(index, 'date', "bg-white")} />

                </div>
                <div>
                  <Label htmlFor={`dueDate-${index}`}>Data de Vencimento *</Label>
                  <Input
                  id={`dueDate-${index}`}
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange(index, 'dueDate', e.target.value)}
                  className={getInputClassName(index, 'dueDate', "bg-white")} />

                  {getFieldError(index, 'dueDate') &&
                <p className="text-red-500 text-xs mt-1">{getFieldError(index, 'dueDate')?.message}</p>
                }
                </div>
                <div>
                  <Label htmlFor={`store-${index}`}>Loja *</Label>
                  <Select value={formData.store} onValueChange={(value) => handleInputChange(index, 'store', value)}>
                    <SelectTrigger className={getInputClassName(index, 'store', "bg-white")}>
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
                  {getFieldError(index, 'store') &&
                <p className="text-red-500 text-xs mt-1">{getFieldError(index, 'store')?.message}</p>
                }
                </div>
              </div>

              {/* Segunda linha - Categoria, Centro de Custo e Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`category-${index}`}>Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange(index, 'category', value)}>
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
                  <Label htmlFor={`costCenter-${index}`}>Centro de Custo</Label>
                  <Select value={formData.costCenter} onValueChange={(value) => handleInputChange(index, 'costCenter', value)}>
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
                  <Label htmlFor={`type-${index}`}>Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange(index, 'type', value)}>
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
                  <Label htmlFor={`description-${index}`}>Descrição *</Label>
                  <Input
                  id={`description-${index}`}
                  placeholder="Digite a descrição da saída"
                  value={formData.description}
                  onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                  className={getInputClassName(index, 'description', "bg-white")} />

                  {getFieldError(index, 'description') &&
                <p className="text-red-500 text-xs mt-1">{getFieldError(index, 'description')?.message}</p>
                }
                </div>
                <div>
                  <Label htmlFor={`value-${index}`}>Valor (R$) *</Label>
                  <Input
                  id={`value-${index}`}
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.value}
                  onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                  className={getInputClassName(index, 'value', "bg-white")} />

                  {getFieldError(index, 'value') &&
                <p className="text-red-500 text-xs mt-1">{getFieldError(index, 'value')?.message}</p>
                }
                </div>
              </div>

              {/* Quarta linha - Pago e Recorrência */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Pago</Label>
                  <Select value={formData.paid} onValueChange={(value) => handleInputChange(index, 'paid', value)}>
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
                  <Select value={formData.recurring} onValueChange={(value) => handleInputChange(index, 'recurring', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.recurring === 'sim' &&
              <div>
                    <Label>Tipo de Recorrência</Label>
                    <Select value={formData.recurrence} onValueChange={(value) => handleInputChange(index, 'recurrence', value)}>
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

              {/* Recorrência personalizada */}
              {formData.recurring === 'sim' && formData.recurrence === 'personalizada' &&
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label>Intervalo</Label>
                    <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.customRecurrence?.interval || ''}
                  onChange={(e) => handleInputChange(index, 'customRecurrence', {
                    ...formData.customRecurrence,
                    interval: parseInt(e.target.value) || 1
                  })}
                  className="bg-white" />

                  </div>
                  <div>
                    <Label>Unidade</Label>
                    <Select
                  value={formData.customRecurrence?.unit || 'months'}
                  onValueChange={(value) => handleInputChange(index, 'customRecurrence', {
                    ...formData.customRecurrence,
                    unit: value as 'days' | 'weeks' | 'months' | 'years'
                  })}>

                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="days">Dias</SelectItem>
                        <SelectItem value="weeks">Semanas</SelectItem>
                        <SelectItem value="months">Meses</SelectItem>
                        <SelectItem value="years">Anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
            }

              {/* Observações */}
              <div>
                <Label htmlFor={`notes-${index}`}>Observações</Label>
                <Textarea
                id={`notes-${index}`}
                placeholder="Digite observações adicionais"
                value={formData.notes}
                onChange={(e) => handleInputChange(index, 'notes', e.target.value)}
                rows={3}
                className="bg-white" />

              </div>

              {/* Botões individuais para formulário único */}
              {forms.length === 1 &&
            <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                type="button"
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white">

                    Salvar Saída
                  </Button>
                </div>
            }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões para adicionar mais saídas */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={addForm}
          className="text-gray-600 hover:text-gray-800">

          <Plus size={16} className="mr-1" />
          Adicionar mais saídas
        </Button>
      </div>

      {/* Botões globais quando há múltiplos formulários */}
      {forms.length > 1 &&
      <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {forms.length} saídas para salvar
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white">

                  Salvar todas as saídas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default ExpenseForm;