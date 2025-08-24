
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Users, Store, Tag, Building } from 'lucide-react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserPreferences from '@/components/UserPreferences';
import EntityCrud from '@/components/EntityCrud';
import AiRulesManager from '@/components/AiRulesManager';

const ConfiguracoesPage: React.FC = () => {
  const { t } = useTranslation();

  // Mock data for entities
  const [lojas, setLojas] = useState([
  { id: 1, nome: 'Loja Centro', endereco: 'Rua Principal, 123', telefone: '(11) 3333-4444', email: 'centro@iclub.com' },
  { id: 2, nome: 'Loja Shopping', endereco: 'Shopping Center, Loja 45', telefone: '(11) 5555-6666', email: 'shopping@iclub.com' },
  { id: 3, nome: 'Loja Online', endereco: 'Virtual', telefone: '(11) 7777-8888', email: 'online@iclub.com' }]
  );

  const [categorias, setCategorias] = useState([
  { id: 1, nome: 'Aluguel', descricao: 'Aluguel de imóveis e espaços', cor: '#22C55E' },
  { id: 2, nome: 'Fornecedores', descricao: 'Pagamentos a fornecedores e parceiros', cor: '#3B82F6' },
  { id: 3, nome: 'Utilities', descricao: 'Água, luz, internet e telecomunicações', cor: '#F59E0B' },
  { id: 4, nome: 'Marketing', descricao: 'Campanhas, publicidade e promoção', cor: '#EF4444' },
  { id: 5, nome: 'Pessoal', descricao: 'Salários, benefícios e treinamentos', cor: '#8B5CF6' }]
  );

  const [centrosCusto, setCentrosCusto] = useState([
  { id: 1, nome: 'Administrativo', descricao: 'Despesas administrativas gerais', codigo: 'ADM' },
  { id: 2, nome: 'Vendas', descricao: 'Despesas relacionadas a vendas', codigo: 'VEND' },
  { id: 3, nome: 'Marketing', descricao: 'Despesas de marketing e publicidade', codigo: 'MKT' },
  { id: 4, nome: 'Operacional', descricao: 'Despesas operacionais das lojas', codigo: 'OPE' },
  { id: 5, nome: 'TI', descricao: 'Tecnologia da informação', codigo: 'TI' }]
  );

  const [tipos, setTipos] = useState([
  { id: 1, nome: 'Fixo', descricao: 'Despesas fixas mensais', recorrente: true },
  { id: 2, nome: 'Variável', descricao: 'Despesas variáveis conforme necessidade', recorrente: false },
  { id: 3, nome: 'Eventual', descricao: 'Despesas eventuais ou sazonais', recorrente: false },
  { id: 4, nome: 'Investimento', descricao: 'Investimentos e melhorias', recorrente: false }]
  );

  const [usuarios, setUsuarios] = useState([
  { id: 1, nome: 'Admin Sistema', email: 'admin@iclub.com', cargo: 'Administrador', ativo: true },
  { id: 2, nome: 'João Silva', email: 'joao@iclub.com', cargo: 'Gerente Financeiro', ativo: true },
  { id: 3, nome: 'Maria Santos', email: 'maria@iclub.com', cargo: 'Analista Financeiro', ativo: true },
  { id: 4, nome: 'Carlos Lima', email: 'carlos@iclub.com', cargo: 'Contador', ativo: false }]
  );

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('settings.title') || 'Configurações'}</h1>
          <p className="text-gray-600 mt-1">Configure o sistema conforme suas necessidades</p>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="lojas">Lojas</TabsTrigger>
            <TabsTrigger value="categorias">Categorias</TabsTrigger>
            <TabsTrigger value="centros-custo">Centros</TabsTrigger>
            <TabsTrigger value="tipos">Tipos</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="ia">Regras IA</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="mt-6">
            <UserPreferences />
          </TabsContent>

          <TabsContent value="lojas" className="mt-6">
            <EntityCrud
              entityType="loja"
              title="Lojas"
              icon={Store}
              data={lojas}
              onDataChange={setLojas} />

          </TabsContent>

          <TabsContent value="categorias" className="mt-6">
            <EntityCrud
              entityType="categoria"
              title="Categorias"
              icon={Tag}
              data={categorias}
              onDataChange={setCategorias} />

          </TabsContent>

          <TabsContent value="centros-custo" className="mt-6">
            <EntityCrud
              entityType="centroCusto"
              title="Centros de Custo"
              icon={Building}
              data={centrosCusto}
              onDataChange={setCentrosCusto} />

          </TabsContent>

          <TabsContent value="tipos" className="mt-6">
            <EntityCrud
              entityType="tipo"
              title="Tipos"
              icon={Settings}
              data={tipos}
              onDataChange={setTipos} />

          </TabsContent>

          <TabsContent value="usuarios" className="mt-6">
            <EntityCrud
              entityType="usuario"
              title="Usuários"
              icon={Users}
              data={usuarios}
              onDataChange={setUsuarios} />

          </TabsContent>

          <TabsContent value="ia" className="mt-6">
            <AiRulesManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>);

};

export default ConfiguracoesPage;