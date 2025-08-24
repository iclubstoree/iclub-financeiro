
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Calendar,
  Building,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Download,
  Filter } from
'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/currency';

interface DRELineItem {
  name: string;
  value: number;
  children?: DRELineItem[];
  isExpanded?: boolean;
}

interface PeriodOption {
  value: string;
  label: string;
  shortLabel: string;
}

const DrePage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['receitas', 'custos', 'despesas-operacionais', 'resultado-financeiro']));

  // Period selection options
  const periodOptions: PeriodOption[] = [
  { value: '2024-01', label: 'Janeiro 2024', shortLabel: 'Jan/24' },
  { value: '2023-12', label: 'Dezembro 2023', shortLabel: 'Dez/23' },
  { value: '2023-11', label: 'Novembro 2023', shortLabel: 'Nov/23' },
  { value: '2023-10', label: 'Outubro 2023', shortLabel: 'Out/23' }];


  const quickPeriods = [
  { label: 'Este Mês', value: '2024-01' },
  { label: 'Último Trimestre', value: '2023-Q4' },
  { label: 'Este Ano', value: '2024' }];


  // Enhanced DRE data structure following Brazilian accounting standards
  const dreConsolidado = {
    receitaBruta: 158600,
    deducoesReceita: {
      impostosSobreVendas: 12200,
      devolucoes: 3400,
      descontos: 7200,
      total: 22800
    },
    receitaLiquida: 135800,
    custoProdutosVendidos: {
      materiasPrimas: 28500,
      maoDeObraDireta: 12800,
      custosIndiretosFabricacao: 8900,
      total: 50200
    },
    resultadoBruto: 85600,
    despesasOperacionais: {
      vendas: {
        comissoes: 8500,
        propaganda: 4200,
        fretes: 2800,
        total: 15500
      },
      administrativas: {
        salarios: 18500,
        alugueis: 6200,
        servicos: 4800,
        total: 29500
      },
      total: 45000
    },
    resultadoOperacional: 40600,
    resultadoFinanceiro: {
      receitasFinanceiras: 2800,
      despesasFinanceiras: 8400,
      total: -5600
    },
    resultadoAntesImpostos: 35000,
    impostoRenda: 7700,
    resultadoLiquido: 27300
  };

  const drePorLoja = [
  {
    loja: 'Loja Centro',
    receitaBruta: 96000,
    deducoesReceita: 14200,
    receitaLiquida: 81800,
    custoProdutos: 30120,
    resultadoBruto: 51680,
    despesasOperacionais: 28500,
    resultadoOperacional: 23180,
    resultadoFinanceiro: -2800,
    impostos: 4076,
    resultadoLiquido: 16304
  },
  {
    loja: 'Loja Shopping',
    receitaBruta: 62600,
    deducoesReceita: 8600,
    receitaLiquida: 54000,
    custoProdutos: 20080,
    resultadoBruto: 33920,
    despesasOperacionais: 16500,
    resultadoOperacional: 17420,
    resultadoFinanceiro: -2800,
    impostos: 3624,
    resultadoLiquido: 10996
  }];


  const toggleExpanded = (item: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(item)) {
      newExpanded.delete(item);
    } else {
      newExpanded.add(item);
    }
    setExpandedItems(newExpanded);
  };

  const DRELineComponent: React.FC<{
    item: DRELineItem;
    level?: number;
    color?: 'green' | 'red' | 'blue' | 'gray';
    id?: string;
  }> = ({ item, level = 0, color = 'gray', id }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = id ? expandedItems.has(id) : false;
    const indent = level * 24;

    const getColorClasses = (color: string, isTotal = false) => {
      const colorMap = {
        green: isTotal ? 'text-green-800 bg-green-50' : 'text-green-700',
        red: isTotal ? 'text-red-800 bg-red-50' : 'text-red-700',
        blue: isTotal ? 'text-blue-800 bg-blue-50' : 'text-blue-700',
        gray: isTotal ? 'text-gray-800 bg-gray-50' : 'text-gray-700'
      };
      return colorMap[color as keyof typeof colorMap];
    };

    return (
      <div>
        <div
          className={`flex justify-between items-center py-2 px-3 border-b hover:bg-gray-50 cursor-pointer ${
          level === 0 ? 'font-semibold border-b-2' : ''} ${
          level === 0 && item.name.includes('TOTAL') ? getColorClasses(color, true) : ''}`}
          style={{ paddingLeft: `${indent + 12}px` }}
          onClick={hasChildren && id ? () => toggleExpanded(id) : undefined}>

          <div className="flex items-center space-x-2">
            {hasChildren && id &&
            <div className="w-4 h-4 flex items-center justify-center">
                {isExpanded ?
              <ChevronDown size={14} className="text-gray-500" /> :

              <ChevronRight size={14} className="text-gray-500" />
              }
              </div>
            }
            {!hasChildren && id && <div className="w-4" />}
            <span className={level === 0 ? 'font-bold' : ''}>{item.name}</span>
          </div>
          <span className={`font-semibold ${getColorClasses(color)} ${
          item.value < 0 ? 'text-red-600' : ''}`
          }>
            {item.value < 0 && color !== 'red' ? '(' : ''}{formatCurrency(Math.abs(item.value))}{item.value < 0 && color !== 'red' ? ')' : ''}
          </span>
        </div>
        
        {hasChildren && id && isExpanded &&
        <div>
            {item.children!.map((child, index) =>
          <DRELineComponent
            key={index}
            item={child}
            level={level + 1}
            color={color} />

          )}
          </div>
        }
      </div>);

  };

  const buildDREStructure = (): DRELineItem[] => {
    return [
    {
      name: 'RECEITA OPERACIONAL BRUTA',
      value: dreConsolidado.receitaBruta,
      children: [
      { name: 'Vendas de Produtos', value: 125000 },
      { name: 'Prestação de Serviços', value: 33600 }]

    },
    {
      name: 'DEDUÇÕES DA RECEITA BRUTA',
      value: -dreConsolidado.deducoesReceita.total,
      children: [
      { name: 'Impostos sobre Vendas', value: -dreConsolidado.deducoesReceita.impostosSobreVendas },
      { name: 'Devoluções de Vendas', value: -dreConsolidado.deducoesReceita.devolucoes },
      { name: 'Descontos Concedidos', value: -dreConsolidado.deducoesReceita.descontos }]

    },
    {
      name: 'RECEITA OPERACIONAL LÍQUIDA',
      value: dreConsolidado.receitaLiquida
    },
    {
      name: 'CUSTO DOS PRODUTOS VENDIDOS',
      value: -dreConsolidado.custoProdutosVendidos.total,
      children: [
      { name: 'Matérias-primas', value: -dreConsolidado.custoProdutosVendidos.materiasPrimas },
      { name: 'Mão-de-obra Direta', value: -dreConsolidado.custoProdutosVendidos.maoDeObraDireta },
      { name: 'Custos Indiretos de Fabricação', value: -dreConsolidado.custoProdutosVendidos.custosIndiretosFabricacao }]

    },
    {
      name: 'RESULTADO OPERACIONAL BRUTO',
      value: dreConsolidado.resultadoBruto
    },
    {
      name: 'DESPESAS OPERACIONAIS',
      value: -dreConsolidado.despesasOperacionais.total,
      children: [
      {
        name: 'Despesas de Vendas',
        value: -dreConsolidado.despesasOperacionais.vendas.total,
        children: [
        { name: 'Comissões', value: -dreConsolidado.despesasOperacionais.vendas.comissoes },
        { name: 'Propaganda e Marketing', value: -dreConsolidado.despesasOperacionais.vendas.propaganda },
        { name: 'Fretes e Carretos', value: -dreConsolidado.despesasOperacionais.vendas.fretes }]

      },
      {
        name: 'Despesas Administrativas',
        value: -dreConsolidado.despesasOperacionais.administrativas.total,
        children: [
        { name: 'Salários e Encargos', value: -dreConsolidado.despesasOperacionais.administrativas.salarios },
        { name: 'Aluguéis', value: -dreConsolidado.despesasOperacionais.administrativas.alugueis },
        { name: 'Serviços de Terceiros', value: -dreConsolidado.despesasOperacionais.administrativas.servicos }]

      }]

    },
    {
      name: 'RESULTADO OPERACIONAL LÍQUIDO',
      value: dreConsolidado.resultadoOperacional
    },
    {
      name: 'RESULTADO FINANCEIRO',
      value: dreConsolidado.resultadoFinanceiro.total,
      children: [
      { name: 'Receitas Financeiras', value: dreConsolidado.resultadoFinanceiro.receitasFinanceiras },
      { name: 'Despesas Financeiras', value: -dreConsolidado.resultadoFinanceiro.despesasFinanceiras }]

    },
    {
      name: 'RESULTADO ANTES DOS TRIBUTOS',
      value: dreConsolidado.resultadoAntesImpostos
    },
    {
      name: 'PROVISÃO PARA IMPOSTO DE RENDA',
      value: -dreConsolidado.impostoRenda
    },
    {
      name: 'RESULTADO LÍQUIDO DO EXERCÍCIO',
      value: dreConsolidado.resultadoLiquido
    }];

  };

  const DreConsolidadoView = () => {
    const dreItems = buildDREStructure();

    return (
      <div className="space-y-1">
        {dreItems.map((item, index) => {
          const isReceita = item.name.includes('RECEITA') && !item.name.includes('DEDUÇÕES');
          const isDespesa = item.name.includes('CUSTO') || item.name.includes('DESPESAS') || item.name.includes('DEDUÇÕES') || item.name.includes('PROVISÃO');
          const isResultado = item.name.includes('RESULTADO');

          let color: 'green' | 'red' | 'blue' | 'gray' = 'gray';
          if (isReceita) color = 'green';else
          if (isDespesa) color = 'red';else
          if (isResultado) color = 'blue';

          const itemId = item.children ? `item-${index}` : undefined;

          return (
            <DRELineComponent
              key={index}
              item={item}
              color={color}
              id={itemId} />);


        })}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-900">MARGEM LÍQUIDA</span>
            <span className="text-xl font-bold text-blue-700">
              {(dreConsolidado.resultadoLiquido / dreConsolidado.receitaLiquida * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>);

  };

  const DrePorLojaView = () =>
  <div className="space-y-6">
      {drePorLoja.map((loja, index) =>
    <Card key={index} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center space-x-3">
              <Building size={24} className="text-blue-600" />
              <span className="text-xl">{loja.loja}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              <div className="flex justify-between items-center py-3 px-4 bg-green-50 border-b">
                <span className="font-semibold text-green-800">Receita Operacional Bruta</span>
                <span className="font-bold text-green-700">{formatCurrency(loja.receitaBruta)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 border-b">
                <span className="text-red-700">(-) Deduções da Receita</span>
                <span className="text-red-600">({formatCurrency(loja.deducoesReceita)})</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-green-50 border-b">
                <span className="font-semibold text-green-800">Receita Operacional Líquida</span>
                <span className="font-bold text-green-700">{formatCurrency(loja.receitaLiquida)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 border-b">
                <span className="text-red-700">(-) Custo dos Produtos Vendidos</span>
                <span className="text-red-600">({formatCurrency(loja.custoProdutos)})</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-blue-50 border-b">
                <span className="font-semibold text-blue-800">Resultado Operacional Bruto</span>
                <span className="font-bold text-blue-700">{formatCurrency(loja.resultadoBruto)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 border-b">
                <span className="text-red-700">(-) Despesas Operacionais</span>
                <span className="text-red-600">({formatCurrency(loja.despesasOperacionais)})</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-blue-50 border-b">
                <span className="font-semibold text-blue-800">Resultado Operacional Líquido</span>
                <span className="font-bold text-blue-700">{formatCurrency(loja.resultadoOperacional)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 border-b">
                <span className="text-red-700">Resultado Financeiro</span>
                <span className="text-red-600">({formatCurrency(Math.abs(loja.resultadoFinanceiro))})</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 border-b">
                <span className="text-red-700">(-) Provisão p/ Imposto de Renda</span>
                <span className="text-red-600">({formatCurrency(loja.impostos)})</span>
              </div>
              <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-blue-100 to-blue-200 border-t-2 border-blue-400">
                <span className="text-lg font-bold text-blue-900">RESULTADO LÍQUIDO</span>
                <span className="text-xl font-bold text-blue-800">{formatCurrency(loja.resultadoLiquido)}</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Margem Líquida: </span>
                  <span className="font-semibold text-blue-700">
                    {(loja.resultadoLiquido / loja.receitaLiquida * 100).toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Participação no Total: </span>
                  <span className="font-semibold text-blue-700">
                    {(loja.resultadoLiquido / dreConsolidado.resultadoLiquido * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    )}
    </div>;


  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Enhanced Header with Period Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demonstração do Resultado do Exercício</h1>
            <p className="text-gray-600 mt-1">Análise detalhada dos resultados operacionais e financeiros</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Quick Period Selection */}
            <div className="flex space-x-1">
              {quickPeriods.map((period) =>
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}>

                  {period.label}
                </Button>
              )}
            </div>
            
            {/* Period Dropdown */}
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">

                {periodOptions.map((option) =>
                <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-1" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-1" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Líquida</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(dreConsolidado.receitaLiquida)}</p>
                </div>
                <TrendingUp size={24} className="text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Custos + Despesas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(dreConsolidado.custoProdutosVendidos.total + dreConsolidado.despesasOperacionais.total)}
                  </p>
                </div>
                <TrendingDown size={24} className="text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resultado Líquido</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(dreConsolidado.resultadoLiquido)}</p>
                </div>
                <FileText size={24} className="text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Margem Líquida</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(dreConsolidado.resultadoLiquido / dreConsolidado.receitaLiquida * 100).toFixed(1)}%
                  </p>
                </div>
                <BarChart3 size={24} className="text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DRE Tabs */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="consolidado" className="w-full">
              <div className="border-b bg-gray-50 px-6 py-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="consolidado" className="flex items-center space-x-2">
                    <BarChart3 size={16} />
                    <span>Consolidado</span>
                  </TabsTrigger>
                  <TabsTrigger value="por-loja" className="flex items-center space-x-2">
                    <Building size={16} />
                    <span>Por Loja</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="consolidado" className="p-6 mt-0">
                <DreConsolidadoView />
              </TabsContent>
              
              <TabsContent value="por-loja" className="p-6 mt-0">
                <DrePorLojaView />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>);

};

export default DrePage;