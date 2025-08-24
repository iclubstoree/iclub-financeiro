
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface ImportError {
  row: number;
  field: string;
  message: string;
  value: string;
}

interface ImportData {
  valid: any[];
  errors: ImportError[];
  headers: string[];
}

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (data: any[]) => void;
}

const REQUIRED_HEADERS = [
'Data',
'Data de Vencimento',
'Loja',
'Categoria',
'Centro de Custo',
'Tipo',
'Descrição',
'Valor',
'Pago',
'Recorrente'];


const ImportModal: React.FC<ImportModalProps> = ({ open, onOpenChange, onImportComplete }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'processing'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      processFile(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    multiple: false
  });

  const processFile = async (file: File) => {
    setStep('processing');
    setProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        throw new Error('Arquivo deve conter pelo menos um cabeçalho e uma linha de dados');
      }

      // Simular progresso
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      const headers = lines[0].split(',').map((h) => h.trim());
      const errors: ImportError[] = [];
      const valid: any[] = [];

      // Validar cabeçalhos EXATOS
      const missingHeaders = REQUIRED_HEADERS.filter((required) =>
      !headers.includes(required)
      );

      if (missingHeaders.length > 0) {
        throw new Error(`Cabeçalhos obrigatórios não encontrados: ${missingHeaders.join(', ')}`);
      }

      // Processar dados
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const rowData: any = {};
        let hasError = false;

        headers.forEach((header, index) => {
          const value = values[index] || '';

          switch (header) {
            case 'Data':
            case 'Data de Vencimento':
              if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                errors.push({
                  row: i + 1,
                  field: header,
                  message: 'Data deve estar no formato AAAA-MM-DD',
                  value
                });
                hasError = true;
              }
              rowData[header] = value;
              break;

            case 'Valor':
              const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
              if (isNaN(numValue) || numValue <= 0) {
                errors.push({
                  row: i + 1,
                  field: header,
                  message: 'Valor deve ser um número positivo',
                  value
                });
                hasError = true;
              }
              rowData[header] = numValue;
              break;

            case 'Pago':
            case 'Recorrente':
              const boolValue = value.toLowerCase();
              if (!['sim', 'não', 'true', 'false', '1', '0'].includes(boolValue)) {
                errors.push({
                  row: i + 1,
                  field: header,
                  message: 'Deve ser "Sim", "Não", "True", "False", "1" ou "0"',
                  value
                });
                hasError = true;
              }
              rowData[header] = ['sim', 'true', '1'].includes(boolValue);
              break;

            default:
              if (!value && REQUIRED_HEADERS.includes(header)) {
                errors.push({
                  row: i + 1,
                  field: header,
                  message: 'Campo obrigatório não pode estar vazio',
                  value
                });
                hasError = true;
              }
              rowData[header] = value;
          }
        });

        if (!hasError) {
          valid.push(rowData);
        }
      }

      setImportData({ valid, errors, headers });
      setStep('preview');

    } catch (error) {
      toast.error(`Erro ao processar arquivo: ${error.message}`);
      setStep('upload');
      setFile(null);
    }
  };

  const handleCommit = async () => {
    if (!importData || importData.valid.length === 0) {
      toast.error('Nenhum dado válido para importar');
      return;
    }

    try {
      // Simular processo de importação
      setStep('processing');
      setProgress(0);

      for (let i = 0; i <= 100; i += 20) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      await onImportComplete(importData.valid);
      toast.success(`${importData.valid.length} registros importados com sucesso!`);
      handleClose();
    } catch (error) {
      toast.error('Erro ao importar dados');
      setStep('preview');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setImportData(null);
    setProgress(0);
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const csvContent = [
    REQUIRED_HEADERS.join(','),
    '2024-01-15,2024-01-20,Loja Centro,Aluguel,Administrativo,Fixo,"Aluguel mensal",3500.00,Não,Sim',
    '2024-01-16,2024-01-25,Loja Shopping,Utilities,Operacional,Fixo,"Conta de luz",890.30,Não,Sim'].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_importacao.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={20} />
            Importar Saídas
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' &&
        <div className="space-y-6">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Importe suas saídas através de um arquivo CSV, XLS ou XLSX. O arquivo deve conter exatamente os cabeçalhos especificados.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload do Arquivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                  {...getRootProps()}
                  className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    `}>

                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    {isDragActive ?
                  <p className="text-blue-600">Solte o arquivo aqui...</p> :

                  <>
                        <p className="text-gray-600 mb-2">
                          Arraste e solte um arquivo aqui, ou clique para selecionar
                        </p>
                        <p className="text-sm text-gray-500">
                          Formatos aceitos: CSV, XLS, XLSX
                        </p>
                      </>
                  }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Cabeçalhos Obrigatórios
                    <Button variant="outline" size="sm" onClick={downloadTemplate}>
                      <Download size={16} className="mr-2" />
                      Template
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {REQUIRED_HEADERS.map((header, index) =>
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {header}
                      </Badge>
                  )}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Os cabeçalhos devem estar exatamente como mostrado acima (incluindo acentos e espaços).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        }

        {step === 'processing' &&
        <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Processando arquivo...</h3>
              <p className="text-gray-600">Validando dados e verificando erros</p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        }

        {step === 'preview' && importData &&
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{importData.valid.length}</p>
                      <p className="text-sm text-gray-600">Registros Válidos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-red-600" size={20} />
                    <div>
                      <p className="text-2xl font-bold text-red-600">{importData.errors.length}</p>
                      <p className="text-sm text-gray-600">Erros Encontrados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={20} />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{file?.name.length > 20 ? `${file?.name.substring(0, 20)}...` : file?.name}</p>
                      <p className="text-sm text-gray-600">Arquivo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="valid" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="valid">
                  Dados Válidos ({importData.valid.length})
                </TabsTrigger>
                <TabsTrigger value="errors">
                  Erros ({importData.errors.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="valid" className="space-y-4">
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {REQUIRED_HEADERS.slice(0, 6).map((header) =>
                      <TableHead key={header}>{header}</TableHead>
                      )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importData.valid.slice(0, 10).map((row, index) =>
                    <TableRow key={index}>
                          {REQUIRED_HEADERS.slice(0, 6).map((header) =>
                      <TableCell key={header} className="max-w-32 truncate">
                              {typeof row[header] === 'boolean' ?
                        row[header] ? 'Sim' : 'Não' :
                        String(row[header] || '-')
                        }
                            </TableCell>
                      )}
                        </TableRow>
                    )}
                    </TableBody>
                  </Table>
                  {importData.valid.length > 10 &&
                <div className="p-4 text-center text-sm text-gray-500 border-t">
                      E mais {importData.valid.length - 10} registros...
                    </div>
                }
                </div>
              </TabsContent>

              <TabsContent value="errors" className="space-y-4">
                {importData.errors.length > 0 ?
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Linha</TableHead>
                          <TableHead>Campo</TableHead>
                          <TableHead>Erro</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importData.errors.map((error, index) =>
                    <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{error.field}</TableCell>
                            <TableCell className="text-red-600">{error.message}</TableCell>
                            <TableCell className="max-w-32 truncate">{error.value}</TableCell>
                          </TableRow>
                    )}
                      </TableBody>
                    </Table>
                  </div> :

              <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                    <p className="text-green-600 font-semibold">Nenhum erro encontrado!</p>
                  </div>
              }
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => {setStep('upload');setFile(null);}}>
                  Novo Arquivo
                </Button>
                <Button
                onClick={handleCommit}
                disabled={importData.valid.length === 0}
                className="bg-green-600 hover:bg-green-700">

                  Importar {importData.valid.length} Registros
                </Button>
              </div>
            </div>
          </div>
        }
      </DialogContent>
    </Dialog>);

};

export default ImportModal;