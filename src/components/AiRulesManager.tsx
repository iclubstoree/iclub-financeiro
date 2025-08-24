
import React, { useState } from 'react';
import { Bot, Plus, Edit, Trash2, Search, Power, PowerOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

interface AiRule {
  id: number;
  nome: string;
  descricao: string;
  condicao: string;
  acao: {
    categoria?: string;
    centroCusto?: string;
    tipo?: string;
    store?: string;
  };
  ativo: boolean;
  prioridade: number;
}

const AiRulesManager: React.FC = () => {
  const [rules, setRules] = useState<AiRule[]>([
  {
    id: 1,
    nome: 'Aluguel Automático',
    descricao: 'Classifica pagamentos de aluguel automaticamente',
    condicao: 'descrição contém "aluguel" ou "locação"',
    acao: { categoria: 'Aluguel', centroCusto: 'Administrativo', tipo: 'Fixo' },
    ativo: true,
    prioridade: 1
  },
  {
    id: 2,
    nome: 'Fornecedores',
    descricao: 'Identifica compras de fornecedores',
    condicao: 'valor > 1000 e descrição contém "compra" ou "fornecedor"',
    acao: { categoria: 'Fornecedores', centroCusto: 'Vendas' },
    ativo: true,
    prioridade: 2
  },
  {
    id: 3,
    nome: 'Utilities',
    descricao: 'Classifica contas de utilidades públicas',
    condicao: 'descrição contém "água" ou "luz" ou "energia" ou "internet"',
    acao: { categoria: 'Utilities', centroCusto: 'Administrativo', tipo: 'Fixo' },
    ativo: false,
    prioridade: 3
  }]
  );

  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AiRule | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{rule: AiRule;} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRules = rules.filter((rule) =>
  rule.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
  rule.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
  rule.condicao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRule = (ruleId: number) => {
    setRules((prev) => prev.map((rule) =>
    rule.id === ruleId ? { ...rule, ativo: !rule.ativo } : rule
    ));

    const rule = rules.find((r) => r.id === ruleId);
    toast.success(`Regra "${rule?.nome}" ${rule?.ativo ? 'desativada' : 'ativada'} com sucesso!`);
  };

  const handleEdit = (rule: AiRule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleDelete = (rule: AiRule) => {
    setDeleteDialog({ rule });
  };

  const confirmDelete = () => {
    if (deleteDialog) {
      setRules((prev) => prev.filter((rule) => rule.id !== deleteDialog.rule.id));
      toast.success(`Regra "${deleteDialog.rule.nome}" removida com sucesso!`);
      setDeleteDialog(null);
    }
  };

  const RuleForm = () => {
    const [formData, setFormData] = useState<Partial<AiRule>>(
      editingRule || {
        nome: '',
        descricao: '',
        condicao: '',
        acao: {},
        ativo: true,
        prioridade: rules.length + 1
      }
    );

    const handleSave = () => {
      if (!formData.nome || !formData.descricao || !formData.condicao) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      if (editingRule) {
        setRules((prev) => prev.map((rule) =>
        rule.id === editingRule.id ? { ...(formData as AiRule), id: editingRule.id } : rule
        ));
        toast.success('Regra atualizada com sucesso!');
      } else {
        const newId = Math.max(...rules.map((r) => r.id)) + 1;
        setRules((prev) => [...prev, { ...(formData as AiRule), id: newId }]);
        toast.success('Nova regra criada com sucesso!');
      }

      setShowForm(false);
      setEditingRule(null);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{editingRule ? 'Editar Regra' : 'Nova Regra de IA'}</span>
            <Button variant="ghost" size="sm" onClick={() => {setShowForm(false);setEditingRule(null);}}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome da Regra *</Label>
            <Input
              value={formData.nome || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Classificar Aluguel" />

          </div>

          <div>
            <Label>Descrição *</Label>
            <Textarea
              value={formData.descricao || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva o que esta regra faz..."
              rows={2} />

          </div>

          <div>
            <Label>Condição *</Label>
            <Textarea
              value={formData.condicao || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, condicao: e.target.value }))}
              placeholder="Ex: descrição contém 'aluguel' e valor > 1000"
              rows={2} />

            <p className="text-xs text-gray-500 mt-1">
              Use condições como: "descrição contém 'texto'", "valor &gt; 100", "store = 'Loja Centro'"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoria (Ação)</Label>
              <Select
                value={formData.acao?.categoria || ''}
                onValueChange={(value) => setFormData((prev) => ({
                  ...prev,
                  acao: { ...prev.acao, categoria: value }
                }))}>

                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aluguel">Aluguel</SelectItem>
                  <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Centro de Custo (Ação)</Label>
              <Select
                value={formData.acao?.centroCusto || ''}
                onValueChange={(value) => setFormData((prev) => ({
                  ...prev,
                  acao: { ...prev.acao, centroCusto: value }
                }))}>

                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Prioridade</Label>
              <Input
                type="number"
                value={formData.prioridade || 1}
                onChange={(e) => setFormData((prev) => ({ ...prev, prioridade: parseInt(e.target.value) || 1 }))}
                className="w-20"
                min="1" />

            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.ativo !== false}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ativo: checked }))} />

              <Label>Regra ativa</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {setShowForm(false);setEditingRule(null);}}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
              Salvar Regra
            </Button>
          </div>
        </CardContent>
      </Card>);

  };

  if (showForm) {
    return <RuleForm />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span>Regras de IA</span>
              <Badge variant="outline">{rules.length}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white">

                <Plus size={16} className="mr-2" />
                Adicionar Nova Regra
              </Button>
              
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar regras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" />

              </div>
            </div>

            {/* Rules List */}
            <div className="space-y-3">
              {filteredRules.length === 0 ?
              <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Nenhuma regra encontrada' : 'Nenhuma regra configurada'}
                </div> :

              filteredRules.
              sort((a, b) => a.prioridade - b.prioridade).
              map((rule) =>
              <div key={rule.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="font-medium">{rule.nome}</div>
                            <Badge variant={rule.ativo ? "default" : "secondary"} className="text-xs">
                              {rule.ativo ? 'Ativa' : 'Inativa'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Prioridade {rule.prioridade}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">{rule.descricao}</div>
                          
                          <div className="text-xs text-gray-500">
                            <strong>Se:</strong> {rule.condicao}
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-1">
                            <strong>Então:</strong> {' '}
                            {rule.acao.categoria && `Categoria: ${rule.acao.categoria} • `}
                            {rule.acao.centroCusto && `Centro: ${rule.acao.centroCusto} • `}
                            {rule.acao.tipo && `Tipo: ${rule.acao.tipo}`}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRule(rule.id)}
                      className={rule.ativo ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}>

                            {rule.ativo ? <Power size={16} /> : <PowerOff size={16} />}
                          </Button>
                          
                          <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(rule)}>

                            <Edit size={14} className="mr-1" />
                            Editar
                          </Button>
                          
                          <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(rule)}
                      className="text-red-600 hover:bg-red-50 hover:border-red-300">

                            <Trash2 size={14} className="mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
              )
              }
            </div>

            {rules.length > 0 &&
            <div className="text-xs text-gray-500 pt-4 border-t">
                💡 As regras são executadas por ordem de prioridade. Regras com prioridade menor são executadas primeiro.
              </div>
            }
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!deleteDialog}
        title="Remover Regra de IA"
        message={`Tem certeza que deseja remover a regra "${deleteDialog?.rule?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog(null)} />

    </>);

};

export default AiRulesManager;