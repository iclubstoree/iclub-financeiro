
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="text-red-500" size={20} />,
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="text-yellow-500" size={20} />,
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      default:
        return {
          icon: <AlertTriangle className="text-blue-500" size={20} />,
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {styles.icon}
                <span>{title}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{message}</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                {cancelText}
              </Button>
              <Button className={styles.confirmButton} onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default ConfirmDialog;