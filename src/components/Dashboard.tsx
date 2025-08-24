
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Wallet,
  TrendingDown,
  Clock,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  FileText,
  Settings } from
'lucide-react';
import { formatCurrency, formatDateTime, getCurrentDate } from '@/lib/currency';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  // Sample data - in real app this would come from API/state
  const dashboardData = {
    totalBalance: 15420.50,
    monthlyExpenses: -3250.75,
    pendingTransactions: 7,
    lastUpdate: getCurrentDate(),
    recentTransactions: [
    { id: 1, description: 'Aluguel', amount: -1200.00, date: '2024-01-15', category: 'Moradia' },
    { id: 2, description: 'Freelance', amount: 2500.00, date: '2024-01-14', category: 'Receita' },
    { id: 3, description: 'Supermercado', amount: -320.50, date: '2024-01-13', category: 'Alimentação' }]

  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: {
      value: number;
      isPositive: boolean;
    };
    className?: string;
  }> = ({ title, value, icon, trend, className = '' }) =>
  <div className={`card hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {trend &&
      <div className={`flex items-center space-x-1 text-xs ${
      trend.isPositive ? 'text-green-600' : 'text-red-600'}`
      }>
            {trend.isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
      }
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>;


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-heading-2 text-gray-900">
            {t('dashboard.title')}
          </h1>
          <p className="text-caption mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <RefreshCw size={16} />
          <span>
            {t('dashboard.lastUpdate')}: {formatDateTime(dashboardData.lastUpdate)}
          </span>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t('dashboard.welcome')}
            </h2>
            <p className="text-green-100">
              Tenha controle total sobre suas finanças
            </p>
          </div>
          <div className="hidden sm:block">
            <Wallet size={48} className="text-green-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('dashboard.totalBalance')}
          value={formatCurrency(dashboardData.totalBalance)}
          icon={<Wallet size={20} />}
          trend={{ value: 12.5, isPositive: true }}
          className="border-l-4 border-green-500" />

        <StatCard
          title={t('dashboard.monthlyExpenses')}
          value={formatCurrency(Math.abs(dashboardData.monthlyExpenses))}
          icon={<TrendingDown size={20} />}
          trend={{ value: 8.2, isPositive: false }}
          className="border-l-4 border-red-500" />

        <StatCard
          title={t('dashboard.pendingTransactions')}
          value={dashboardData.pendingTransactions.toString()}
          icon={<Clock size={20} />}
          className="border-l-4 border-yellow-500" />

      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading-4">Transações Recentes</h3>
          <button className="btn btn-secondary text-sm">
            Ver Todas
          </button>
        </div>
        
        <div className="space-y-4">
          {dashboardData.recentTransactions.map((transaction) =>
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">

              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.amount > 0 ?
              'bg-green-100 text-green-600' :
              'bg-red-100 text-red-600'}`
              }>
                  {transaction.amount > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`
              }>
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="btn btn-primary p-4 flex flex-col items-center space-y-2">
          <TrendingDown size={24} />
          <span className="text-sm">Nova Saída</span>
        </button>
        <button className="btn btn-secondary p-4 flex flex-col items-center space-y-2">
          <ArrowUp size={24} />
          <span className="text-sm">Nova Receita</span>
        </button>
        <button className="btn btn-secondary p-4 flex flex-col items-center space-y-2">
          <FileText size={24} />
          <span className="text-sm">Relatório</span>
        </button>
        <button className="btn btn-secondary p-4 flex flex-col items-center space-y-2">
          <Settings size={24} />
          <span className="text-sm">Configurar</span>
        </button>
      </div>
    </div>);

};

export default Dashboard;