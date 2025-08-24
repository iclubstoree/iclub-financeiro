
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      // Navigation
      nav: {
        saidas: 'Saídas',
        analises: 'Análises',
        dre: 'DRE',
        configuracoes: 'Configurações'
      },

      // Common
      common: {
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        cancel: 'Cancelar',
        save: 'Salvar',
        edit: 'Editar',
        delete: 'Excluir',
        search: 'Pesquisar',
        filter: 'Filtrar',
        export: 'Exportar',
        import: 'Importar',
        print: 'Imprimir'
      },

      // Dashboard
      dashboard: {
        title: 'iClub - Gestão Financeira',
        subtitle: 'Controle suas finanças de forma inteligente',
        welcome: 'Bem-vindo ao sistema de gestão financeira',
        totalBalance: 'Saldo Total',
        monthlyExpenses: 'Gastos do Mês',
        pendingTransactions: 'Transações Pendentes',
        lastUpdate: 'Última atualização'
      },

      // Expenses (Saídas)
      expenses: {
        title: 'Controle de Saídas',
        addExpense: 'Nova Saída',
        totalExpenses: 'Total de Saídas',
        category: 'Categoria',
        amount: 'Valor',
        date: 'Data',
        description: 'Descrição',
        noExpenses: 'Nenhuma saída registrada'
      },

      // Analysis (Análises)
      analysis: {
        title: 'Análises Financeiras',
        monthlyComparison: 'Comparativo Mensal',
        categoryBreakdown: 'Gastos por Categoria',
        trends: 'Tendências',
        insights: 'Insights'
      },

      // DRE (Demonstração do Resultado do Exercício)
      dre: {
        title: 'Demonstração do Resultado',
        revenue: 'Receitas',
        expenses: 'Despesas',
        netResult: 'Resultado Líquido',
        period: 'Período'
      },

      // Settings (Configurações)
      settings: {
        title: 'Configurações',
        profile: 'Perfil',
        categories: 'Categorias',
        notifications: 'Notificações',
        backup: 'Backup',
        language: 'Idioma',
        currency: 'Moeda',
        timezone: 'Fuso Horário'
      }
    }
  }
};

i18n.
use(initReactI18next).
init({
  resources,
  lng: 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18n;