
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EntityForm from '@/components/EntityForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

interface EntityCrudProps {
  entityType: 'loja' | 'categoria' | 'centroCusto' | 'tipo' | 'usuario';
  title: string;
  icon: React.ComponentType<any>;
  data: any[];
  onDataChange: (newData: any[]) => void;
}

const EntityCrud: React.FC<EntityCrudProps> = ({
  entityType,
  title,
  icon: Icon,
  data,
  onDataChange
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{entity: any;} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) =>
  item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.endereco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (formData: any) => {
    try {
      let newData;
      if (editingEntity) {
        // Update existing
        newData = data.map((item) =>
        item.id === editingEntity.id ? { ...formData, id: editingEntity.id } : item
        );
        toast.success(`${title.slice(0, -1)} atualizado com sucesso!`);
      } else {
        // Add new
        const newId = Math.max(...data.map((item) => item.id || 0)) + 1;
        newData = [...data, { ...formData, id: newId }];
        toast.success(`${title.slice(0, -1)} criado com sucesso!`);
      }

      onDataChange(newData);
      setShowForm(false);
      setEditingEntity(null);
    } catch (error) {
      toast.error(`Erro ao salvar ${title.slice(0, -1).toLowerCase()}`);
    }
  };

  const handleEdit = (entity: any) => {
    setEditingEntity(entity);
    setShowForm(true);
  };

  const handleDelete = (entity: any) => {
    setDeleteDialog({ entity });
  };

  const confirmDelete = () => {
    if (deleteDialog) {
      try {
        const newData = data.filter((item) => item.id !== deleteDialog.entity.id);
        onDataChange(newData);
        toast.success(`${title.slice(0, -1)} excluído com sucesso!`);
      } catch (error) {
        toast.error(`Erro ao excluir ${title.slice(0, -1).toLowerCase()}`);
      }
      setDeleteDialog(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntity(null);
  };

  const renderEntityDetails = (item: any) => {
    switch (entityType) {
      case 'loja':
        return (
          <div>
            <div className="font-medium">{item.nome}</div>
            {item.endereco && <div className="text-sm text-gray-600">{item.endereco}</div>}
            <div className="text-xs text-gray-500 mt-1">
              {item.telefone && <span className="mr-3">📞 {item.telefone}</span>}
              {item.email && <span>📧 {item.email}</span>}
            </div>
          </div>);

      case 'categoria':
        return (
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.cor || '#22C55E' }} />

            <div>
              <div className="font-medium">{item.nome}</div>
              {item.descricao && <div className="text-sm text-gray-600">{item.descricao}</div>}
            </div>
          </div>);

      case 'centroCusto':
        return (
          <div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{item.nome}</div>
              {item.codigo && <Badge variant="outline" className="text-xs">{item.codigo}</Badge>}
            </div>
            {item.descricao && <div className="text-sm text-gray-600">{item.descricao}</div>}
          </div>);

      case 'tipo':
        return (
          <div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{item.nome}</div>
              {item.recorrente && <Badge className="text-xs bg-green-100 text-green-800">Recorrente</Badge>}
            </div>
            {item.descricao && <div className="text-sm text-gray-600">{item.descricao}</div>}
          </div>);

      case 'usuario':
        return (
          <div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{item.nome}</div>
              <Badge variant={item.ativo ? "default" : "secondary"} className="text-xs">
                {item.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">{item.email}</div>
            {item.cargo && <div className="text-xs text-gray-500">{item.cargo}</div>}
          </div>);

      default:
        return (
          <div>
            <div className="font-medium">{item.nome}</div>
            {item.descricao && <div className="text-sm text-gray-600">{item.descricao}</div>}
          </div>);

    }
  };

  if (showForm) {
    return (
      <EntityForm
        entityType={entityType}
        entity={editingEntity}
        onSave={handleSave}
        onCancel={handleCancel} />);


  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon size={20} />
              <span>{title}</span>
              <Badge variant="outline">{data.length}</Badge>
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
                Adicionar {title.slice(0, -1)}
              </Button>
              
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={`Buscar ${title.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" />

              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredData.length === 0 ?
              <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Nenhum resultado encontrado' : `Nenhum ${title.slice(0, -1).toLowerCase()} cadastrado`}
                </div> :

              filteredData.map((item) =>
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    {renderEntityDetails(item)}
                    <div className="flex space-x-2">
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}>

                        <Edit size={14} className="mr-1" />
                        Editar
                      </Button>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="text-red-600 hover:bg-red-50 hover:border-red-300">

                        <Trash2 size={14} className="mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
              )
              }
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!deleteDialog}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir "${deleteDialog?.entity?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog(null)} />

    </>);

};

export default EntityCrud;