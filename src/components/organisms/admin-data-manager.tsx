'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Label } from '@/components/atoms';
import { EditIcon, TrashIcon, EyeIcon } from 'lucide-react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type Materi = {
  id: string;
  title: string;
  type: 'PENGANTAR' | 'SUB_MATERI';
  slug: string;
  category: string;
};

type Step = {
  id: string;
  title: string;
  content: string;
  order: number;
  materiId: string;
  materi?: {
    id: string;
    title: string;
    type: string;
  };
};

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  testId: string;
  test?: {
    id: string;
    type: string;
    materi: {
      id: string;
      title: string;
    };
  };
};

type Test = {
  id: string;
  type: 'PRE' | 'POST';
  materiId: string;
  questions?: Question[];
  materi?: {
    id: string;
    title: string;
  };
};

type AdminDataManagerProps = {
  type: 'materi' | 'step' | 'test' | 'question';
  materiList: Materi[];
  testList?: Test[];
  onDataChange: () => void;
};

export const AdminDataManager: React.FC<AdminDataManagerProps> = ({
  type,
  materiList,
  testList = [],
  onDataChange,
}) => {
  const [data, setData] = useState<(Materi | Step | Test | Question)[]>([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [editingItem, setEditingItem] = useState<Materi | Step | Test | Question | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editMateriType, setEditMateriType] = useState<'PENGANTAR' | 'SUB_MATERI'>('PENGANTAR');
  const [editTestType, setEditTestType] = useState<'PRE' | 'POST'>('PRE');
  const [editContent, setEditContent] = useState('');
  const [editOrder, setEditOrder] = useState(1);
  const [editMateriId, setEditMateriId] = useState('');
  const [editTestId, setEditTestId] = useState('');
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState(['', '', '', '']);
  const [editAnswer, setEditAnswer] = useState(0);

  useEffect(() => {
    if (showList) {
      fetchData();
    }
  }, [showList, type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (type) {
        case 'materi':
          endpoint = '/api/materi';
          break;
        case 'step':
          endpoint = '/api/step';
          break;
        case 'test':
          endpoint = '/api/test';
          break;
        case 'question':
          // For questions, we need to fetch all questions
          const responses = await Promise.all(
            testList.map(async (test) => {
              const res = await fetch(`/api/test/edit/${test.id}`);
              if (res.ok) {
                const testData = await res.json();
                return testData.questions || [];
              }
              return [];
            })
          );
          setData(responses.flat());
          setLoading(false);
          return;
      }
      
      const res = await fetch(endpoint);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      toast.error(`Error fetching ${type}: ${String(error)}`);
    }
    setLoading(false);
  };

  const handleEdit = (item: Materi | Step | Test | Question) => {
    setEditingItem(item);
    
    // Pre-fill form based on type
    switch (type) {
      case 'materi': {
        const materiItem = item as Materi;
        setEditTitle(materiItem.title);
        setEditSlug(materiItem.slug);
        setEditCategory(materiItem.category);
        setEditMateriType(materiItem.type);
        break;
      }
      case 'step': {
        const stepItem = item as Step;
        setEditTitle(stepItem.title);
        setEditContent(stepItem.content);
        setEditOrder(stepItem.order);
        setEditMateriId(stepItem.materiId);
        break;
      }
      case 'test': {
        const testItem = item as Test;
        setEditTestType(testItem.type);
        setEditMateriId(testItem.materiId);
        break;
      }
      case 'question': {
        const questionItem = item as Question;
        setEditQuestion(questionItem.question);
        setEditOptions(questionItem.options);
        setEditAnswer(questionItem.answer);
        setEditTestId(questionItem.testId);
        break;
      }
    }
    
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      let updateData: Record<string, unknown> = {};
      
      switch (type) {
        case 'materi':
          updateData = {
            title: editTitle,
            slug: editSlug,
            category: editCategory,
            type: editMateriType,
          };
          break;
        case 'step':
          updateData = {
            title: editTitle,
            content: editContent,
            order: editOrder,
            materiId: editMateriId,
          };
          break;
        case 'test':
          updateData = {
            type: editTestType,
            materiId: editMateriId,
          };
          break;
        case 'question':
          updateData = {
            question: editQuestion,
            options: editOptions,
            answer: editAnswer,
            testId: editTestId,
          };
          break;
      }

      const res = await fetch(`/api/${type}/edit/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error(`Failed to update ${type}`);

      toast.success(`${type} berhasil diupdate! ✅`);
      setShowEditModal(false);
      setEditingItem(null);
      fetchData();
      onDataChange();
    } catch (error) {
      toast.error(`Error updating ${type}: ${String(error)}`);
    }
  };

  const handleDelete = async (item: Materi | Step | Test | Question) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${type} ini?`)) return;

    try {
      const res = await fetch(`/api/${type}/edit/${item.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(`Failed to delete ${type}`);

      toast.success(`${type} berhasil dihapus! 🗑️`);
      fetchData();
      onDataChange();
    } catch (error) {
      toast.error(`Error deleting ${type}: ${String(error)}`);
    }
  };

  const renderListItem = (item: Materi | Step | Test | Question) => {
    switch (type) {
      case 'materi': {
        const materiItem = item as Materi;
        return (
          <div key={materiItem.id} className="border p-4 rounded-lg bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{materiItem.title}</h3>
                <p className="text-sm text-gray-600">Slug: {materiItem.slug}</p>
                <p className="text-sm text-gray-600">Kategori: {materiItem.category}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  materiItem.type === 'PENGANTAR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {materiItem.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(materiItem)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  title="Edit"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(materiItem)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  title="Hapus"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'step': {
        const stepItem = item as Step;
        return (
          <div key={stepItem.id} className="border p-4 rounded-lg bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{stepItem.title}</h3>
                <p className="text-sm text-gray-600">Order: {stepItem.order}</p>
                <p className="text-sm text-gray-600">
                  Materi: {stepItem.materi?.title || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {stepItem.content.substring(0, 100)}...
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(stepItem)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  title="Edit"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(stepItem)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  title="Hapus"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'test': {
        const testItem = item as Test;
        return (
          <div key={testItem.id} className="border p-4 rounded-lg bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{testItem.type} Test</h3>
                <p className="text-sm text-gray-600">
                  Materi: {testItem.materi?.title || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600">
                  Jumlah Soal: {testItem.questions?.length || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(testItem)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  title="Edit"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(testItem)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  title="Hapus"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'question': {
        const questionItem = item as Question;
        return (
          <div key={questionItem.id} className="border p-4 rounded-lg bg-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{questionItem.question}</h3>
                <p className="text-sm text-gray-600">
                  Test: {questionItem.test?.type} - {questionItem.test?.materi?.title}
                </p>
                <div className="mt-2 text-sm">
                  <p className="font-medium">Opsi:</p>
                  {questionItem.options.map((option: string, idx: number) => (
                    <p key={idx} className={`ml-2 ${idx === questionItem.answer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                      {idx}. {option} {idx === questionItem.answer && '(Benar)'}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(questionItem)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  title="Edit"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(questionItem)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  title="Hapus"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const renderEditForm = () => {
    switch (type) {
      case 'materi':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <Label>Slug</Label>
              <input
                type="text"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <Label>Category</Label>
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                value={editMateriType}
                onChange={(e) => setEditMateriType(e.target.value as 'PENGANTAR' | 'SUB_MATERI')}
                className="w-full p-2 border rounded"
              >
                <option value="PENGANTAR">Pengantar</option>
                <option value="SUB_MATERI">Sub Materi</option>
              </select>
            </div>
          </div>
        );

      case 'step':
        return (
          <div className="space-y-4">
            <div>
              <Label>Materi</Label>
              <select
                value={editMateriId}
                onChange={(e) => setEditMateriId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Pilih Materi --</option>
                {materiList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Title</Label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <Label>Order</Label>
              <input
                type="number"
                value={editOrder}
                onChange={(e) => setEditOrder(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={1}
                required
              />
            </div>
            <div>
              <Label>Konten (Markdown Editor)</Label>
              <MDEditor
                value={editContent}
                onChange={(val) => setEditContent(val || '')}
                height={300}
                preview="edit"
                hideToolbar={false}
                data-color-mode="light"
              />
            </div>
          </div>
        );

      case 'test':
        return (
          <div className="space-y-4">
            <div>
              <Label>Materi</Label>
              <select
                value={editMateriId}
                onChange={(e) => setEditMateriId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Pilih Materi --</option>
                {materiList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Type</Label>
              <select
                value={editTestType}
                onChange={(e) => setEditTestType(e.target.value as 'PRE' | 'POST')}
                className="w-full p-2 border rounded"
              >
                <option value="PRE">Pre Test</option>
                <option value="POST">Post Test</option>
              </select>
            </div>
          </div>
        );

      case 'question':
        return (
          <div className="space-y-4">
            <div>
              <Label>Test</Label>
              <select
                value={editTestId}
                onChange={(e) => setEditTestId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Pilih Test --</option>
                {testList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.type} Test - {t.materi?.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Pertanyaan</Label>
              <input
                type="text"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-3">
              <Label>Opsi Jawaban</Label>
              {editOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-medium w-8">{i}.</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...editOptions];
                      newOptions[i] = e.target.value;
                      setEditOptions(newOptions);
                    }}
                    className="flex-1 p-2 border rounded"
                    required
                  />
                  <input
                    type="radio"
                    name="edit-correct-answer"
                    checked={editAnswer === i}
                    onChange={() => setEditAnswer(i)}
                    className="h-5 w-5"
                  />
                </div>
              ))}
              <p className="text-sm text-gray-600">Jawaban Benar: Opsi {editAnswer}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kelola {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <EyeIcon size={16} />
          {showList ? 'Sembunyikan' : 'Lihat'} Daftar
        </button>
      </div>

      {showList && (
        <div className="border rounded-lg p-4 bg-gray-50">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Belum ada data {type}</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {data.map(renderListItem)}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            
            <form onSubmit={handleUpdate}>
              {renderEditForm()}
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
