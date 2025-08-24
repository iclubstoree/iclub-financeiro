
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, TrendingUp, Calculator, FileText, Plus, Edit, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  expensePreviews?: ExpensePreview[];
}

interface ExpensePreview {
  id: string;
  description: string;
  value: number;
  store?: string;
  dueDate?: string;
  category?: string;
  costCenter?: string;
  type?: string;
  paid?: boolean;
  isEditing?: boolean;
  missingFields?: string[];
}

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdd?: (expenses: any[]) => void;
}

const QUICK_ACTIONS = [
{
  icon: Plus,
  title: 'Adicionar uma saída',
  description: 'Adicione gastos com linguagem natural',
  prompt: 'Adicionar uma saída'
},
{
  icon: TrendingUp,
  title: 'Análise de Tendências',
  description: 'Analise padrões nos seus gastos',
  prompt: 'Analise as tendências dos meus gastos nos últimos 3 meses'
},
{
  icon: Calculator,
  title: 'Orçamento Inteligente',
  description: 'Sugestões para otimizar gastos',
  prompt: 'Me ajude a criar um orçamento baseado nos meus gastos históricos'
},
{
  icon: FileText,
  title: 'Relatório Executivo',
  description: 'Gere um resumo financeiro',
  prompt: 'Crie um relatório executivo das minhas finanças'
},
{
  icon: Sparkles,
  title: 'Insights Personalizados',
  description: 'Descubra oportunidades de economia',
  prompt: 'Quais são as principais oportunidades de economia nas minhas despesas?'
}];


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
{ value: 'impostos', label: 'Impostos' }];


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


// AI Rules for mapping
const AI_RULES = [
{ trigger: ['propaganda', 'anúncio', 'publicidade', 'ads', 'facebook', 'google'], costCenter: 'marketing', category: 'marketing' },
{ trigger: ['aluguel', 'locação'], category: 'aluguel', type: 'fixo' },
{ trigger: ['salário', 'folha'], category: 'salarios', costCenter: 'rh', type: 'fixo' },
{ trigger: ['fornecedor', 'compra'], category: 'fornecedores' },
{ trigger: ['luz', 'água', 'energia', 'internet'], category: 'utilities', type: 'fixo' }];


const ChatModal: React.FC<ChatModalProps> = ({ open, onOpenChange, onExpenseAdd }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: '1',
    type: 'ai',
    content: `👋 Olá! Sou sua assistente de IA financeira. 

Estou aqui para ajudar você com:
• **Adicionar saídas** com linguagem natural
• **Análises inteligentes** dos seus gastos
• **Sugestões de otimização** e economia  
• **Relatórios personalizados** e insights
• **Planejamento** de orçamento e metas

**Exemplos de comandos:**
• "adicionar aluguel 1000 castanhal hoje"
• "aluguel 1000 castanhal hoje e tráfego pago 1000 belém amanhã"
• "adicionar propaganda facebook 500 matriz"

Como posso te ajudar hoje?`,
    timestamp: new Date(),
    suggestions: [
    'Adicionar uma saída',
    'Analisar meus gastos do mês',
    'Criar um orçamento inteligente',
    'Mostrar oportunidades de economia']

  }]
  );
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced natural language processing with better Portuguese date recognition
  const parseExpenseText = (text: string): ExpensePreview[] => {
    const expenses: ExpensePreview[] = [];

    // Split by common separators
    const parts = text.split(/\s+e\s+|,|;|\n/).map((part) => part.trim()).filter(Boolean);

    for (const part of parts) {
      const expense: ExpensePreview = {
        id: Math.random().toString(),
        description: '',
        value: 0,
        missingFields: []
      };

      // Enhanced Portuguese date recognition
      const hoje = new Date().toISOString().split('T')[0];
      const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const depois_amanha = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

      // More comprehensive date patterns
      if (/\b(hoje|hj)\b/i.test(part)) {
        expense.dueDate = hoje;
      } else if (/\b(amanhã|amanha|manhã)\b/i.test(part)) {
        expense.dueDate = amanha;
      } else if (/\b(depois\s*de\s*amanhã|depois\s*amanha)\b/i.test(part)) {
        expense.dueDate = depois_amanha;
      } else {
        // Match various date formats
        const dateMatch = part.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/) ||
        part.match(/\b(\d{4})-(\d{2})-(\d{2})\b/) ||
        part.match(/\b(\d{1,2})[\/\-](\d{1,2})\b/); // DD/MM format
        if (dateMatch) {
          if (dateMatch[3]) {
            // Full date DD/MM/YYYY or YYYY-MM-DD
            const year = dateMatch[3].length === 4 ? dateMatch[3] : `20${dateMatch[3]}`;
            expense.dueDate = `${year}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
          } else {
            // DD/MM format - assume current year
            const year = new Date().getFullYear();
            expense.dueDate = `${year}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
          }
        }
      }

      // Extract value with better number recognition
      const valueMatch = part.match(/(?:r\$\s*)?(\d+(?:[.,]\d{1,3})?)/i) ||
      part.match(/(\d+)\s*(?:reais?|real)/i);
      if (valueMatch) {
        expense.value = parseFloat(valueMatch[1].replace(',', '.'));
      }

      // Extract description (remove processed parts)
      let description = part.
      replace(/(?:r\$\s*)?(\d+(?:[.,]\d{1,3})?)/i, '').
      replace(/\b(hoje|hj|amanhã|amanha|manhã|depois\s*de\s*amanhã|\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?|\d{4}-\d{2}-\d{2})\b/gi, '').
      replace(/\b(loja\s+centro|loja\s+shopping|loja\s+online|matriz|castanhal|belém)\b/gi, '').
      replace(/\b(reais?|real)\b/gi, '').
      trim();

      expense.description = description || 'Despesa';

      // Apply AI rules
      for (const rule of AI_RULES) {
        if (rule.trigger.some((trigger) => part.toLowerCase().includes(trigger))) {
          if (rule.category) expense.category = rule.category;
          if (rule.costCenter) expense.costCenter = rule.costCenter;
          if (rule.type) expense.type = rule.type;
        }
      }

      // Extract store/location with more patterns
      const storeMatches = [
      { pattern: /\bcastanhal\b/i, store: 'loja-centro' },
      { pattern: /\bbelém\b/i, store: 'loja-shopping' },
      { pattern: /\bloja\s+centro\b/i, store: 'loja-centro' },
      { pattern: /\bloja\s+shopping\b/i, store: 'loja-shopping' },
      { pattern: /\bloja\s+online\b/i, store: 'loja-online' },
      { pattern: /\bmatriz\b/i, store: 'matriz' },
      { pattern: /\bcentro\b/i, store: 'loja-centro' },
      { pattern: /\bshopping\b/i, store: 'loja-shopping' },
      { pattern: /\bonline\b/i, store: 'loja-online' }];


      for (const match of storeMatches) {
        if (match.pattern.test(part)) {
          expense.store = match.store;
          break;
        }
      }

      // Check for missing required fields
      if (!expense.description.trim()) expense.missingFields?.push('description');
      if (!expense.value) expense.missingFields?.push('value');
      if (!expense.store) expense.missingFields?.push('store');
      if (!expense.dueDate) expense.missingFields?.push('dueDate');

      expenses.push(expense);
    }

    return expenses;
  };

  const generateAIResponse = (userMessage: string): {response: string;suggestions?: string[];expensePreviews?: ExpensePreview[];} => {
    const lowerMessage = userMessage.toLowerCase();

    // Handle numbered choices from user
    const numberMatch = userMessage.match(/^(\d+)$/);
    if (numberMatch) {
      const choice = parseInt(numberMatch[1]);

      // Find the last AI message with missing info questions
      const lastAIMessage = [...messages].reverse().find((m) => m.type === 'ai' && m.content.includes('escolha uma opção'));

      if (lastAIMessage) {
        // Process the numbered choice and continue the flow
        return {
          response: `✅ Opção ${choice} selecionada. Continuando o processo...`,
          suggestions: ['Confirmar', 'Editar', 'Cancelar']
        };
      }
    }

    // Check if it's an expense addition request
    if (lowerMessage.includes('adicionar') || lowerMessage.includes('aluguel') || lowerMessage.includes('tráfego') || lowerMessage.includes('propaganda') || /\d+/.test(userMessage)) {
      const expenses = parseExpenseText(userMessage);

      if (expenses.length > 0) {
        const hasAllRequired = expenses.every((e) => e.description && e.value && e.store && e.dueDate);

        if (hasAllRequired) {
          return {
            response: `✅ **${expenses.length === 1 ? 'Saída identificada' : 'Saídas identificadas'}:**

${expenses.map((expense, i) => `**${i + 1}.** ${expense.description} - ${expense.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
📍 Loja: ${STORES.find((s) => s.value === expense.store)?.label}
📅 Vencimento: ${new Date(expense.dueDate!).toLocaleDateString('pt-BR')}
${expense.category ? `🏷️ Categoria: ${CATEGORIES.find((c) => c.value === expense.category)?.label}` : ''}
${expense.costCenter ? `🏢 Centro de Custo: ${COST_CENTERS.find((cc) => cc.value === expense.costCenter)?.label}` : ''}
`).join('\n')}

Confirma a adição ${expenses.length === 1 ? 'desta saída' : 'destas saídas'}?`,
            expensePreviews: expenses,
            suggestions: ['Confirmar', 'Editar antes de confirmar', 'Cancelar']
          };
        } else {
          // Enhanced questioning system for missing information
          const firstExpense = expenses[0];
          const missing = firstExpense.missingFields || [];

          if (missing.includes('store')) {
            return {
              response: `📍 **Qual a loja para "${firstExpense.description}" (${firstExpense.value ? firstExpense.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'valor não informado'})?**

Por favor, escolha uma opção:

**1.** ${STORES[0].label}
**2.** ${STORES[1].label}
**3.** ${STORES[2].label}
**4.** ${STORES[3].label}

Digite apenas o número da sua escolha (1, 2, 3 ou 4).`,
              expensePreviews: expenses,
              suggestions: ['1', '2', '3', '4']
            };
          }

          if (missing.includes('dueDate')) {
            return {
              response: `📅 **Qual a data de vencimento para "${firstExpense.description}"?**

Escolha uma opção:

**1.** Hoje
**2.** Amanhã
**3.** Escolher data específica

Digite o número da sua escolha.`,
              expensePreviews: expenses,
              suggestions: ['1', '2', '3']
            };
          }

          if (missing.includes('value')) {
            return {
              response: `💰 **Qual o valor para "${firstExpense.description}"?**

Por favor, informe o valor em reais (ex: 1000 ou R$ 1.500,00).`,
              expensePreviews: expenses,
              suggestions: ['R$ 100', 'R$ 500', 'R$ 1.000']
            };
          }

          // Fallback for general missing info
          return {
            response: `📝 **Informações faltando para "${firstExpense.description}":**

❌ **Faltando:** ${missing.map((field) => {
              switch (field) {
                case 'description':return 'Descrição';
                case 'value':return 'Valor';
                case 'store':return 'Loja';
                case 'dueDate':return 'Data de vencimento';
                default:return field;
              }
            }).join(', ')}

Por favor, complete essas informações.`,
            expensePreviews: expenses,
            suggestions: ['Tentar novamente', 'Cancelar']
          };
        }
      }
    }

    // Handle other AI responses
    const responses = [
    {
      trigger: ['análise', 'tendência', 'padrão', 'histórico'],
      response: `📊 **Análise de Tendências - Últimos 3 Meses**

**Principais Insights:**
• Seus gastos com aluguel representam 45% do total (R$ 10.500)
• Aumento de 12% em despesas operacionais vs. mês anterior  
• Economia de 8% em marketing através de otimizações

**Tendências Identificadas:**
✅ Gastos fixos estáveis e previsíveis
⚠️ Variação alta em fornecedores (+25% em Jan/24)
📈 Crescimento sustentável nos investimentos em marketing

**Recomendações:**
1. Revisar contratos com fornecedores para melhor previsibilidade
2. Implementar teto de gastos variáveis (sugestão: R$ 3.000/mês)
3. Manter investimento atual em marketing (ROI positivo)`,
      suggestions: [
      'Como reduzir custos com fornecedores?',
      'Análise detalhada por centro de custo',
      'Projeção para os próximos 6 meses']

    }];


    for (const response of responses) {
      if (response.trigger.some((trigger) => lowerMessage.includes(trigger))) {
        return response;
      }
    }

    // Default response
    return {
      response: `Entendi sua pergunta sobre "${userMessage}". 

Baseado nos seus dados financeiros, posso te ajudar com análises mais específicas. Que tal começar com uma dessas opções:

• **Adicionar saída:** "adicionar aluguel 1000 castanhal hoje"
• **Análise detalhada** de uma categoria específica
• **Comparativo de períodos** (mês atual vs. anterior)  
• **Identificação de padrões** de gastos
• **Sugestões de otimização** personalizadas

Qual dessas opções te interessaria mais?`,
      suggestions: [
      'Adicionar uma saída',
      'Análise por categoria',
      'Comparativo mensal',
      'Padrões de gastos',
      'Sugestões de economia']

    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      const { response, suggestions, expensePreviews } = generateAIResponse(userMessage.content);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        suggestions,
        expensePreviews
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Confirmar') {
      handleConfirmExpenses();
    } else if (suggestion === 'Editar antes de confirmar') {
      // Enable editing mode for the latest expense previews
      setMessages((prev) => prev.map((msg, index) => {
        if (index === prev.length - 1 && msg.expensePreviews) {
          return {
            ...msg,
            expensePreviews: msg.expensePreviews.map((exp) => ({ ...exp, isEditing: true }))
          };
        }
        return msg;
      }));
    } else if (/^\d+$/.test(suggestion)) {
      // Handle numbered choices - automatically process and continue flow
      const choice = parseInt(suggestion);

      // Get the last AI message to understand context
      const lastMessage = messages[messages.length - 1];

      if (lastMessage?.content.includes('Qual a loja')) {
        // Store selection
        const selectedStore = STORES[choice - 1];
        if (selectedStore && lastMessage.expensePreviews) {
          const updatedExpenses = lastMessage.expensePreviews.map((exp) => ({
            ...exp,
            store: selectedStore.value,
            missingFields: exp.missingFields?.filter((f) => f !== 'store') || []
          }));

          // Automatically continue with updated expense
          const updatedMessage = `${selectedStore.label} selecionada. Processando...`;
          setInputValue(updatedMessage);
          setTimeout(() => {
            // Trigger re-evaluation with updated expense
            const { response, suggestions, expensePreviews } = generateAIResponse(`adicionar ${updatedExpenses[0].description} ${updatedExpenses[0].value} ${selectedStore.value} ${updatedExpenses[0].dueDate || 'hoje'}`);

            const aiMessage: ChatMessage = {
              id: Date.now().toString(),
              type: 'ai',
              content: response,
              timestamp: new Date(),
              suggestions,
              expensePreviews
            };

            setMessages((prev) => [...prev, {
              id: Date.now().toString(),
              type: 'user',
              content: updatedMessage,
              timestamp: new Date()
            }, aiMessage]);
          }, 500);
          return;
        }
      } else if (lastMessage?.content.includes('data de vencimento')) {
        // Date selection
        let selectedDate = '';
        if (choice === 1) selectedDate = 'hoje';else
        if (choice === 2) selectedDate = 'amanhã';else
        if (choice === 3) selectedDate = new Date().toISOString().split('T')[0]; // Today as default

        const updatedMessage = `Data ${choice === 1 ? 'hoje' : choice === 2 ? 'amanhã' : 'específica'} selecionada.`;
        setInputValue(updatedMessage);
        setTimeout(() => handleSendMessage(), 100);
        return;
      }

      // Fallback for other numbered selections
      setInputValue(suggestion);
      setTimeout(() => handleSendMessage(), 100);
    } else {
      setInputValue(suggestion);
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const handleConfirmExpenses = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.expensePreviews) {
      const expenses = lastMessage.expensePreviews.map((preview) => ({
        ...preview,
        origin: 'chat',
        paid: preview.paid || false,
        recurring: false
      }));

      if (onExpenseAdd) {
        onExpenseAdd(expenses);
        toast.success(`${expenses.length === 1 ? 'Saída adicionada' : `${expenses.length} saídas adicionadas`} com sucesso!`);

        // Add confirmation message
        const confirmMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: `✅ **Confirmado!** ${expenses.length === 1 ? 'A saída foi adicionada' : `As ${expenses.length} saídas foram adicionadas`} com sucesso.

Os valores e totais foram atualizados automaticamente na tela principal.

Posso ajudar com mais alguma coisa?`,
          timestamp: new Date(),
          suggestions: [
          'Adicionar mais saídas',
          'Ver análise atualizada',
          'Configurar alertas']

        };

        setMessages((prev) => [...prev, confirmMessage]);
      }
    }
  };

  const handleExpenseEdit = (expenseId: string, field: string, value: any) => {
    setMessages((prev) => prev.map((msg) => ({
      ...msg,
      expensePreviews: msg.expensePreviews?.map((exp) =>
      exp.id === expenseId ? { ...exp, [field]: value } : exp
      )
    })));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const ExpensePreviewCard: React.FC<{expense: ExpensePreview;}> = ({ expense }) => {
    if (expense.isEditing) {
      return (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Descrição *</Label>
                  <Input
                    value={expense.description}
                    onChange={(e) => handleExpenseEdit(expense.id, 'description', e.target.value)}
                    className="bg-white" />

                </div>
                <div>
                  <Label>Valor (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={expense.value || ''}
                    onChange={(e) => handleExpenseEdit(expense.id, 'value', parseFloat(e.target.value) || 0)}
                    className="bg-white" />

                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Loja *</Label>
                  <Select value={expense.store || ''} onValueChange={(value) => handleExpenseEdit(expense.id, 'store', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {STORES.map((store) =>
                      <SelectItem key={store.value} value={store.value}>{store.label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data de Vencimento *</Label>
                  <Input
                    type="date"
                    value={expense.dueDate || ''}
                    onChange={(e) => handleExpenseEdit(expense.id, 'dueDate', e.target.value)}
                    className="bg-white" />

                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Categoria</Label>
                  <Select value={expense.category || ''} onValueChange={(value) => handleExpenseEdit(expense.id, 'category', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {CATEGORIES.map((cat) =>
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Centro de Custo</Label>
                  <Select value={expense.costCenter || ''} onValueChange={(value) => handleExpenseEdit(expense.id, 'costCenter', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {COST_CENTERS.map((cc) =>
                      <SelectItem key={cc.value} value={cc.value}>{cc.label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExpenseEdit(expense.id, 'isEditing', false)}>

                  <X size={16} className="mr-1" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleExpenseEdit(expense.id, 'isEditing', false);
                    // You could add validation here
                  }}>

                  <Check size={16} className="mr-1" />
                  Confirmar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>);

    }

    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{expense.description}</h4>
              <p className="text-2xl font-bold text-green-600">
                {expense.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExpenseEdit(expense.id, 'isEditing', true)}>

              <Edit size={16} />
            </Button>
          </div>
          
          <div className="space-y-2 text-sm">
            {expense.store &&
            <div><strong>Loja:</strong> {STORES.find((s) => s.value === expense.store)?.label}</div>
            }
            {expense.dueDate &&
            <div><strong>Vencimento:</strong> {new Date(expense.dueDate).toLocaleDateString('pt-BR')}</div>
            }
            {expense.category &&
            <div><strong>Categoria:</strong> {CATEGORIES.find((c) => c.value === expense.category)?.label}</div>
            }
            {expense.costCenter &&
            <div><strong>Centro de Custo:</strong> {COST_CENTERS.find((cc) => cc.value === expense.costCenter)?.label}</div>
            }
          </div>
          
          {expense.missingFields && expense.missingFields.length > 0 &&
          <div className="mt-3">
              <Badge variant="destructive" className="text-xs">
                Faltando: {expense.missingFields.join(', ')}
              </Badge>
            </div>
          }
        </CardContent>
      </Card>);

  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare size={20} />
            Chat IA - Assistente Financeira
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Quick Actions */}
          <div className="w-72 space-y-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Ações Rápidas</h3>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action, index) =>
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow bg-white"
                onClick={() => handleQuickAction(action.prompt)}>

                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <action.icon className="text-green-600 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4 border rounded-lg bg-white">
              <div className="space-y-4">
                {messages.map((message) =>
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ?
                    'bg-blue-600 text-white' :
                    'bg-gradient-to-r from-green-500 to-emerald-500 text-white'}`
                    }>
                        {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      
                      <div className="space-y-2">
                        <Card className={message.type === 'user' ? 'bg-blue-50' : 'bg-gray-50'}>
                          <CardContent className="p-3">
                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                            <div className="text-xs text-gray-500 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Expense Previews */}
                        {message.expensePreviews &&
                      <div className="space-y-2">
                            {message.expensePreviews.map((expense) =>
                        <ExpensePreviewCard key={expense.id} expense={expense} />
                        )}
                          </div>
                      }
                        
                        {/* Suggestions */}
                        {message.suggestions &&
                      <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) =>
                        <Badge
                          key={index}
                          variant="secondary"
                          className={`cursor-pointer ${
                          suggestion === 'Confirmar' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                          suggestion === 'Editar antes de confirmar' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                          'hover:bg-gray-200'}`
                          }
                          onClick={() => handleSuggestionClick(suggestion)}>

                                {suggestion}
                              </Badge>
                        )}
                          </div>
                      }
                      </div>
                    </div>
                  </div>
                )}
                
                {isTyping &&
                <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <Card className="bg-gray-50">
                        <CardContent className="p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                }
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2 mt-4">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta ou comando (ex: 'adicionar aluguel 1000 castanhal hoje')..."
                disabled={isTyping}
                className="bg-white" />

              <Button
                onClick={handleSendMessage}
                disabled={isTyping || !inputValue.trim()}
                className="bg-green-600 hover:bg-green-700 text-white">

                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);

};

export default ChatModal;