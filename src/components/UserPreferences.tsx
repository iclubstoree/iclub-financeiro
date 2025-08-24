
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export interface UserPreferences {
  nDiasProximas: number;
  pageSize: number;
  sortByDate: boolean;
}

const UserPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
    return {
      nDiasProximas: 7,
      pageSize: 10,
      sortByDate: true
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would typically save to localStorage or API
      localStorage.setItem('userPreferences', JSON.stringify(preferences));

      toast.success('Preferências salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar preferências');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Save size={20} />
          <span>Preferências do Sistema</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium mb-2">
              Dias para considerar "Próximas"
            </Label>
            <Input
              type="number"
              value={preferences.nDiasProximas}
              onChange={(e) => updatePreference('nDiasProximas', parseInt(e.target.value) || 7)}
              className="w-24"
              min="1"
              max="90" />

            <p className="text-xs text-gray-600 mt-1">
              Saídas com vencimento nos próximos {preferences.nDiasProximas} dias serão consideradas "Próximas"
            </p>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">
              Itens por página
            </Label>
            <select
              value={preferences.pageSize}
              onChange={(e) => updatePreference('pageSize', parseInt(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">

              <option value={10}>10 itens</option>
              <option value={20}>20 itens</option>
              <option value={50}>50 itens</option>
              <option value={100}>100 itens</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Quantidade de itens exibidos por página na tabela de saídas
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="text-sm font-medium">Ordenar por data por padrão</Label>
            <p className="text-xs text-gray-600">Listas serão ordenadas por data automaticamente</p>
          </div>
          <Switch
            checked={preferences.sortByDate}
            onCheckedChange={(checked) => updatePreference('sortByDate', checked)} />

        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white">

            <Save size={16} className="mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Preferências'}
          </Button>
        </div>
      </CardContent>
    </Card>);

};

export default UserPreferences;