
import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EntityFormProps {
  entityType: 'loja' | 'categoria' | 'centroCusto' | 'tipo' | 'usuario';
  entity?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const EntityForm: React.FC<EntityFormProps> = ({
  entityType,
  entity,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (entity) {
      setFormData(entity);
    } else {
      // Initialize empty form based on entity type
      switch (entityType) {
        case 'loja':
          setFormData({ nome: '', endereco: '', telefone: '', email: '' });
          break;
        case 'categoria':
          setFormData({ nome: '', descricao: '', cor: '#22C55E' });
          break;
        case 'centroCusto':
          setFormData({ nome: '', descricao: '', codigo: '' });
          break;
        case 'tipo':
          setFormData({ nome: '', descricao: '', recorrente: false });
          break;
        case 'usuario':
          setFormData({ nome: '', email: '', cargo: '', ativo: true });
          break;
      }
    }
  }, [entity, entityType]);

  const validate = () => {
    const newErrors: any = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (entityType === 'usuario' && !formData.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    }

    if (entityType === 'usuario' && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const getTitle = () => {
    const action = entity ? 'Editar' : 'Adicionar';
    switch (entityType) {
      case 'loja':return `${action} Loja`;
      case 'categoria':return `${action} Categoria`;
      case 'centroCusto':return `${action} Centro de Custo`;
      case 'tipo':return `${action} Tipo`;
      case 'usuario':return `${action} Usuário`;
      default:return action;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{getTitle()}</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome || ''}
              onChange={(e) => updateField('nome', e.target.value)}
              className={errors.nome ? 'border-red-500' : ''} />

            {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
          </div>

          {/* Loja specific fields */}
          {entityType === 'loja' &&
          <>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                id="endereco"
                value={formData.endereco || ''}
                onChange={(e) => updateField('endereco', e.target.value)} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                  id="telefone"
                  value={formData.telefone || ''}
                  onChange={(e) => updateField('telefone', e.target.value)} />

                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)} />

                </div>
              </div>
            </>
          }

          {/* Categoria specific fields */}
          {entityType === 'categoria' &&
          <>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                id="descricao"
                value={formData.descricao || ''}
                onChange={(e) => updateField('descricao', e.target.value)}
                rows={3} />

              </div>
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input
                id="cor"
                type="color"
                value={formData.cor || '#22C55E'}
                onChange={(e) => updateField('cor', e.target.value)}
                className="w-20 h-10" />

              </div>
            </>
          }

          {/* Centro de Custo specific fields */}
          {entityType === 'centroCusto' &&
          <>
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                id="codigo"
                value={formData.codigo || ''}
                onChange={(e) => updateField('codigo', e.target.value)}
                placeholder="Ex: ADM, VEND, MKT" />

              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                id="descricao"
                value={formData.descricao || ''}
                onChange={(e) => updateField('descricao', e.target.value)}
                rows={3} />

              </div>
            </>
          }

          {/* Tipo specific fields */}
          {entityType === 'tipo' &&
          <>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                id="descricao"
                value={formData.descricao || ''}
                onChange={(e) => updateField('descricao', e.target.value)}
                rows={3} />

              </div>
              <div className="flex items-center space-x-2">
                <input
                type="checkbox"
                id="recorrente"
                checked={formData.recorrente || false}
                onChange={(e) => updateField('recorrente', e.target.checked)}
                className="rounded" />

                <Label htmlFor="recorrente">Tipo recorrente por padrão</Label>
              </div>
            </>
          }

          {/* Usuario specific fields */}
          {entityType === 'usuario' &&
          <>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''} />

                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                id="cargo"
                value={formData.cargo || ''}
                onChange={(e) => updateField('cargo', e.target.value)} />

              </div>
              <div className="flex items-center space-x-2">
                <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo !== false}
                onChange={(e) => updateField('ativo', e.target.checked)}
                className="rounded" />

                <Label htmlFor="ativo">Usuário ativo</Label>
              </div>
            </>
          }

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              <Save size={16} className="mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);

};

export default EntityForm;