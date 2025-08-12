'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'materi' | 'step' | 'test' | 'question';
  item: Record<string, unknown> | null;
  materiList?: Array<{ id: string; title: string; type: string }>;
  testList?: Array<{ id: string; type: string; materiId: string }>;
  onSave: (data: unknown) => Promise<void>;
}

export function AdminEditModal({
  isOpen,
  onClose,
  type,
  item,
  materiList = [],
  testList = [],
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item && isOpen) {
      setFormData({ ...item });
    }
  }, [item, isOpen]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev: Record<string, unknown>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
      toast.success(`${getTypeLabel(type)} berhasil diperbarui`);
      onClose();
    } catch (error) {
      toast.error(`Gagal memperbarui ${getTypeLabel(type).toLowerCase()}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'materi':
        return 'Materi';
      case 'step':
        return 'Step';
      case 'test':
        return 'Test';
      case 'question':
        return 'Question';
      default:
        return 'Item';
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case 'materi':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                value={String(formData.title || '')}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Masukkan judul materi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={String(formData.slug || '')}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="Masukkan slug materi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Input
                id="category"
                value={String(formData.category || '')}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Masukkan kategori materi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipe *</Label>
              <Select
                value={String(formData.type || '')}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe materi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENGANTAR">Pengantar</SelectItem>
                  <SelectItem value="SUB_MATERI">Sub Materi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'step':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="materiId">Materi *</Label>
              <Select
                value={String(formData.materiId || '')}
                onValueChange={(value) => handleInputChange('materiId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih materi" />
                </SelectTrigger>
                <SelectContent>
                  {materiList.map((materi) => (
                    <SelectItem key={materi.id} value={materi.id}>
                      {materi.title} ({materi.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul Step *</Label>
              <Input
                id="title"
                value={String(formData.title || '')}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Masukkan judul step"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Urutan *</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={String(formData.order || '')}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                placeholder="Nomor urutan step"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Konten (Markdown) *</Label>
              <MDEditor
                value={String(formData.content || '')}
                onChange={(val) => handleInputChange('content', val || '')}
                height={300}
                preview="edit"
                hideToolbar={false}
                data-color-mode="light"
              />
            </div>
          </>
        );

      case 'test':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="materiId">Materi *</Label>
              <Select
                value={String(formData.materiId || '')}
                onValueChange={(value) => handleInputChange('materiId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih materi" />
                </SelectTrigger>
                <SelectContent>
                  {materiList.map((materi) => (
                    <SelectItem key={materi.id} value={materi.id}>
                      {materi.title} ({materi.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipe Test *</Label>
              <Select
                value={String(formData.type || '')}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRE">Pre Test</SelectItem>
                  <SelectItem value="POST">Post Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'question':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="testId">Test *</Label>
              <Select
                value={String(formData.testId || '')}
                onValueChange={(value) => handleInputChange('testId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih test" />
                </SelectTrigger>
                <SelectContent>
                  {testList.map((test) => {
                    const materi = materiList.find((m) => m.id === test.materiId);
                    return (
                      <SelectItem key={test.id} value={test.id}>
                        {materi?.title} - {test.type} Test
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Pertanyaan *</Label>
              <Textarea
                id="question"
                value={String(formData.question || '')}
                onChange={(e) => handleInputChange('question', e.target.value)}
                placeholder="Masukkan pertanyaan"
                required
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>Opsi Jawaban *</Label>
              {((formData.options as string[]) || ['', '', '', '']).map(
                (option: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="font-medium w-6">{index}.</span>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [
                          ...((formData.options as string[]) || ['', '', '', '']),
                        ];
                        newOptions[index] = e.target.value;
                        handleInputChange('options', newOptions);
                      }}
                      placeholder={`Opsi ${index + 1}`}
                      required
                    />
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={formData.answer === index}
                      onChange={() => handleInputChange('answer', index)}
                      className="w-5 h-5"
                    />
                  </div>
                )
              )}
              <p className="text-sm text-gray-600">
                Pilih radio button untuk menentukan jawaban yang benar
              </p>
            </div>
          </>
        );

      default:
        return <div>Tipe tidak dikenal</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {getTypeLabel(type)}</DialogTitle>
          <DialogDescription>
            Perbarui informasi {getTypeLabel(type).toLowerCase()} di bawah ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
