
import React, { useState } from 'react';
import { X, Plus, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExpenseFormData {
  id: string;
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
  customRecurrenceInterval: string;
  customRecurrenceUnit: string;
  notes: string;
}

interface MultiExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: ExpenseFormData[]) => void;
}

const createEmptyForm = (): ExpenseFormData => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
  customRecurrenceInterval: '1',
  customRecurrenceUnit: 'months',
  notes: ''
});

const MultiExpenseForm: React.FC<MultiExpenseFormProps> = ({ onClose, onSubmit }) => {
  const [forms, setForms] = useState<ExpenseFormData[]>([createEmptyForm()]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(forms);
    onClose();
  };

  const handleInputChange = (formId: string, field: keyof ExpenseFormData, value: string) => {
    setForms((prevForms) =>
    prevForms.map((form) =>
    form.id === formId ?
    { ...form, [field]: value } :
    form
    )
    );
  };

  const addNewForm = () => {
    setForms((prev) => [...prev, createEmptyForm()]);
  };

  const copyForm = (formId: string) => {
    const formToCopy = forms.find((form) => form.id === formId);
    if (formToCopy) {
      const copiedForm = {
        ...formToCopy,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        date: '', // Clear date fields for new entry
        dueDate: ''
      };
      setForms((prev) => [...prev, copiedForm]);
    }
  };

  const removeForm = (formId: string) => {
    if (forms.length === 1) {
      onClose();
    } else {
      setForms((prev) => prev.filter((form) => form.id !== formId));
    }
  };

  const submitSingleForm = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (form) {
      onSubmit([form]);
      onClose();
    }
  };

  const renderForm = (formData: ExpenseFormData, index: number) =>
  <Card key={formData.id} className="animate-slide-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {forms.length > 1 ? `Nova Saída ${index + 1}` : 'Nova Saída'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => removeForm(formData.id)}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Primeira linha - Datas e Loja */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`date-${formData.id}`}>Data *</Label>
              <Input
              id={`date-${formData.id}`}
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange(formData.id, 'date', e.target.value)}
              required />

            </div>
            <div>
              <Label htmlFor={`dueDate-${formData.id}`}>Data de Vencimento *</Label>
              <Input
              id={`dueDate-${formData.id}`}
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange(formData.id, 'dueDate', e.target.value)}
              required />

            </div>
            <div>
              <Label htmlFor={`store-${formData.id}`}>Loja *</Label>
              <Select value={formData.store} onValueChange={(value) => handleInputChange(formData.id, 'store', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a loja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loja-centro">Loja Centro</SelectItem>
                  <SelectItem value="loja-shopping">Loja Shopping</SelectItem>
                  <SelectItem value="loja-online">Loja Online</SelectItem>
                  <SelectItem value="matriz">Matriz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Segunda linha - Categoria, Centro de Custo e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`category-${formData.id}`}>Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange(formData.id, 'category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                  <SelectItem value="fornecedores">Fornecedores</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="salarios">Salários</SelectItem>
                  <SelectItem value="impostos">Impostos</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`costCenter-${formData.id}`}>Centro de Custo *</Label>
              <Select value={formData.costCenter} onValueChange={(value) => handleInputChange(formData.id, 'costCenter', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o centro de custo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="rh">Recursos Humanos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`type-${formData.id}`}>Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange(formData.id, 'type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixo">Fixo</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                  <SelectItem value="eventual">Eventual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Terceira linha - Descrição e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`description-${formData.id}`}>Descrição *</Label>
              <Input
              id={`description-${formData.id}`}
              placeholder="Digite a descrição da saída"
              value={formData.description}
              onChange={(e) => handleInputChange(formData.id, 'description', e.target.value)}
              required />

            </div>
            <div>
              <Label htmlFor={`value-${formData.id}`}>Valor (R$) *</Label>
              <Input
              id={`value-${formData.id}`}
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.value}
              onChange={(e) => handleInputChange(formData.id, 'value', e.target.value)}
              required />

            </div>
          </div>

          {/* Quarta linha - Status e Recorrência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`paid-${formData.id}`}>Status de Pagamento *</Label>
              <Select value={formData.paid} onValueChange={(value) => handleInputChange(formData.id, 'paid', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Pago</SelectItem>
                  <SelectItem value="nao">Não Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`recurring-${formData.id}`}>Recorrência *</Label>
              <Select value={formData.recurring} onValueChange={(value) => handleInputChange(formData.id, 'recurring', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a recorrência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Recorrente</SelectItem>
                  <SelectItem value="nao">Não Recorrente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Configuração de Recorrência */}
          {formData.recurring === 'sim' &&
        <div className="space-y-4">
              <div>
                <Label htmlFor={`recurrence-${formData.id}`}>Tipo de Recorrência</Label>
                <Select value={formData.recurrence} onValueChange={(value) => handleInputChange(formData.id, 'recurrence', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a recorrência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="bimestral">Bimestral</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Configuração Personalizada */}
              {formData.recurrence === 'personalizado' &&
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor={`interval-${formData.id}`}>Intervalo *</Label>
                    <Input
                id={`interval-${formData.id}`}
                type="number"
                min="1"
                placeholder="1"
                value={formData.customRecurrenceInterval}
                onChange={(e) => handleInputChange(formData.id, 'customRecurrenceInterval', e.target.value)}
                required />

                  </div>
                  <div>
                    <Label htmlFor={`unit-${formData.id}`}>Unidade *</Label>
                    <Select value={formData.customRecurrenceUnit} onValueChange={(value) => handleInputChange(formData.id, 'customRecurrenceUnit', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Dias</SelectItem>
                        <SelectItem value="weeks">Semanas</SelectItem>
                        <SelectItem value="months">Meses</SelectItem>
                        <SelectItem value="years">Anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
          }
            </div>
        }

          {/* Observações */}
          <div>
            <Label htmlFor={`notes-${formData.id}`}>Observações</Label>
            <Textarea
            id={`notes-${formData.id}`}
            placeholder="Digite observações adicionais"
            value={formData.notes}
            onChange={(e) => handleInputChange(formData.id, 'notes', e.target.value)}
            rows={3} />

          </div>

          {/* Botões individuais (apenas se houver um formulário) */}
          {forms.length === 1 &&
        <div className="flex flex-col sm:flex-row gap-2">
              <Button
            type="button"
            variant="outline"
            onClick={addNewForm}
            className="flex items-center gap-2">

                <Plus size={16} />
                Adicionar mais saídas
              </Button>
              <Button
            type="button"
            variant="outline"
            onClick={() => copyForm(formData.id)}
            className="flex items-center gap-2">

                <Copy size={16} />
                Copiar saída
              </Button>
              <Button
            type="button"
            variant="outline"
            onClick={onClose}>

                Cancelar
              </Button>
              <Button
            type="button"
            onClick={() => submitSingleForm(formData.id)}
            className="bg-blue-600 hover:bg-blue-700">

                Salvar Saída
              </Button>
            </div>
        }

          {/* Botões individuais para múltiplos formulários (sem salvar) */}
          {forms.length > 1 &&
        <div className="flex flex-col sm:flex-row gap-2">
              <Button
            type="button"
            variant="outline"
            onClick={addNewForm}
            className="flex items-center gap-2">

                <Plus size={16} />
                Adicionar mais saídas
              </Button>
              <Button
            type="button"
            variant="outline"
            onClick={() => copyForm(formData.id)}
            className="flex items-center gap-2">

                <Copy size={16} />
                Copiar saída
              </Button>
            </div>
        }
        </div>
      </CardContent>
    </Card>;


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {forms.map((formData, index) => renderForm(formData, index))}
      
      {/* Botões globais (apenas se houver múltiplos formulários) */}
      {forms.length > 1 &&
      <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Salvar todas as saídas ({forms.length})
              </Button>
            </div>
          </CardContent>
        </Card>
      }
    </form>);

};

export default MultiExpenseForm;