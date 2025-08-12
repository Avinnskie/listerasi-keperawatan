'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { AdminPageTemplate } from '@/components/templates';
import { AdminForm } from '@/components/organisms';
import { AdminDataTable } from '@/components/organisms/admin-data-table';
import { AdminEditModal } from '@/components/organisms/admin-edit-modal';
import { Label } from '@/components/atoms';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    materiId: string;
    materi?: {
      id: string;
      title: string;
      type: string;
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
    type: string;
  };
};

export default function AdminMateriPage() {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [stepList, setStepList] = useState<Step[]>([]);
  const [testList, setTestList] = useState<Test[]>([]);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState('konten');

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'PENGANTAR' | 'SUB_MATERI'>('PENGANTAR');

  const [stepMateriId, setStepMateriId] = useState('');
  const [stepTitle, setStepTitle] = useState('');
  const [stepContent, setStepContent] = useState('');
  const [stepOrder, setStepOrder] = useState(1);

  const [testMateriId, setTestMateriId] = useState('');
  const [testType, setTestType] = useState<'PRE' | 'POST'>('PRE');
  const [availableTestTypes, setAvailableTestTypes] = useState<('PRE' | 'POST')[]>(['PRE', 'POST']);

  const [questionMateriId, setQuestionMateriId] = useState('');
  const [questionTestId, setQuestionTestId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answerIndex, setAnswerIndex] = useState(0);

  // Edit states
  const [editingMateri, setEditingMateri] = useState<Materi | null>(null);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Loading states
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    fetchMateriList();
  }, []);

  useEffect(() => {
    if (activeTab === 'konten') {
      fetchStepList();
    } else if (activeTab === 'ujian') {
      fetchAllTests();
      fetchQuestionList();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!questionMateriId) {
      setTestList([]);
      return;
    }
    fetchTestsForMateri(questionMateriId);
  }, [questionMateriId]);

  useEffect(() => {
    if (!testMateriId) {
      setAvailableTestTypes(['PRE', 'POST']);
      return;
    }

    fetchTestsForMateri(testMateriId).then((tests) => {
      const existingTypes = tests.map((t) => t.type);
      const availableTypes = (['PRE', 'POST'] as ('PRE' | 'POST')[]).filter(
        (type) => !existingTypes.includes(type)
      );

      setAvailableTestTypes(availableTypes.length ? availableTypes : ['PRE', 'POST']);

      if (availableTypes.length && !availableTypes.includes(testType)) {
        setTestType(availableTypes[0]);
      }
    });
  }, [testMateriId, materiList, testType]);

  const fetchMateriList = async () => {
    try {
      const res = await fetch('/api/materi');
      if (!res.ok) throw new Error('Failed to fetch materi list');
      const data = await res.json();
      setMateriList(data);
    } catch (error) {
      toast.error(`Error fetching materi: ${String(error)}`);
      console.error(error);
    }
  };

  const fetchStepList = async () => {
    setIsLoadingSteps(true);
    try {
      const res = await fetch('/api/step');
      if (!res.ok) throw new Error('Failed to fetch steps');
      const data = await res.json();
      setStepList(data);
    } catch (error) {
      toast.error(`Error fetching steps: ${String(error)}`);
      console.error(error);
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const fetchAllTests = async () => {
    setIsLoadingTests(true);
    try {
      const res = await fetch('/api/test');
      if (!res.ok) throw new Error('Failed to fetch tests');
      const data = await res.json();
      setTestList(data);
    } catch (error) {
      toast.error(`Error fetching tests: ${String(error)}`);
      console.error(error);
    } finally {
      setIsLoadingTests(false);
    }
  };

  const fetchQuestionList = async () => {
    setIsLoadingQuestions(true);
    try {
      const res = await fetch('/api/question');
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      setQuestionList(data);
    } catch (error) {
      toast.error(`Error fetching questions: ${String(error)}`);
      console.error(error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const fetchTestsForMateri = async (materiId: string): Promise<Test[]> => {
    try {
      const res = await fetch(`/api/test?materiId=${materiId}`);
      if (!res.ok) throw new Error('Failed to fetch tests');
      const data = await res.json();
      setTestList(data);
      return data;
    } catch (error) {
      toast.error(`Error fetching tests: ${String(error)}`);
      console.error(error);
      return [];
    }
  };

  const submitMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/materi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, category, type }),
      });
      if (!res.ok) throw new Error('Gagal menambah materi');
      const newMateri = await res.json();
      toast.success('Materi berhasil ditambah! 🎉');
      setMateriList((prev) => [...prev, newMateri]);
      setTitle('');
      setSlug('');
      setCategory('');
      setType('PENGANTAR');
    } catch (error) {
      toast.error(`Gagal menambah materi: ${String(error)}`);
    }
  };

  const submitStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepMateriId) return toast.warning('Pilih Materi dulu!');

    if (!stepContent || stepContent.trim() === '') {
      return toast.warning('Konten step tidak boleh kosong!');
    }

    try {
      const res = await fetch('/api/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: stepTitle,
          content: stepContent,
          order: stepOrder,
          materiId: stepMateriId,
        }),
      });
      if (!res.ok) throw new Error('Gagal menambah step');
      toast.success('Step berhasil ditambah! 📝');
      setStepMateriId('');
      setStepTitle('');
      setStepContent('');
      setStepOrder(1);
    } catch (error) {
      toast.error(`Gagal menambah step: ${String(error)}`);
    }
  };

  const submitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMateriId) return toast.warning('Pilih Materi dulu!');
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materiId: testMateriId,
          type: testType,
        }),
      });
      if (!res.ok) throw new Error('Gagal menambah test');

      await fetchTestsForMateri(testMateriId);

      toast.success(`${testType} Test berhasil ditambah! ✅`);

      if (testType === 'PRE' && availableTestTypes.includes('POST')) {
        setTestType('POST');
      } else {
        setTestType('PRE');
      }
    } catch (error) {
      toast.error(`Gagal menambah test: ${String(error)}`);
    }
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTestId) return toast.warning('Pilih Test dulu!');
    if (options.some((opt) => !opt.trim())) return toast.warning('Semua opsi harus diisi!');
    try {
      const res = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: questionTestId,
          question: questionText,
          options,
          answer: answerIndex,
        }),
      });
      if (!res.ok) throw new Error('Gagal menambah question');
      toast.success('Question berhasil ditambah! ❓');

      setQuestionText('');
      setOptions(['', '', '', '']);
      setAnswerIndex(0);

      if (questionMateriId) {
        fetchTestsForMateri(questionMateriId);
      }
    } catch (error) {
      toast.error(`Gagal menambah question: ${String(error)}`);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleEditMateri = async (data: unknown) => {
    const materiData = data as Materi;
    const res = await fetch(`/api/materi?id=${materiData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materiData),
    });
    if (!res.ok) throw new Error('Failed to update materi');
    await fetchMateriList();
  };

  const handleEditStep = async (data: unknown) => {
    const stepData = data as Step;
    const res = await fetch(`/api/step?id=${stepData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stepData),
    });
    if (!res.ok) throw new Error('Failed to update step');
    await fetchStepList();
  };

  const handleEditTest = async (data: unknown) => {
    const testData = data as Test;
    const res = await fetch(`/api/test?id=${testData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    if (!res.ok) throw new Error('Failed to update test');
    await fetchAllTests();
  };

  const handleEditQuestion = async (data: unknown) => {
    const questionData = data as Question;
    const res = await fetch(`/api/question?id=${questionData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
    });
    if (!res.ok) throw new Error('Failed to update question');
    await fetchQuestionList();
  };

  const handleDeleteMateri = async (item: Materi) => {
    const res = await fetch(`/api/materi?id=${item.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete materi');
    await fetchMateriList();
  };

  const handleDeleteStep = async (item: Step) => {
    const res = await fetch(`/api/step?id=${item.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete step');
    await fetchStepList();
  };

  const handleDeleteTest = async (item: Test) => {
    const res = await fetch(`/api/test?id=${item.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete test');
    await fetchAllTests();
  };

  const handleDeleteQuestion = async (item: Question) => {
    const res = await fetch(`/api/question?id=${item.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete question');
    await fetchQuestionList();
  };

  const materiOptions = materiList.map((m) => ({
    value: m.id,
    label: `${m.title} (${m.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'})`,
  }));

  const typeOptions = [
    { value: 'PENGANTAR', label: 'Pengantar' },
    { value: 'SUB_MATERI', label: 'Sub Materi' },
  ];

  return (
    <AdminPageTemplate title="Admin Panel - Kelola Materi">
      <Tabs defaultValue="konten" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="konten">Kelola Konten Materi</TabsTrigger>
          <TabsTrigger value="ujian">Kelola Ujian</TabsTrigger>
        </TabsList>

        <TabsContent value="konten" className="space-y-6">
          <AdminForm
            title="Tambah Materi"
            onSubmit={submitMateri}
            submitText="Tambah Materi"
            submitColor="bg-[#38e078]"
            fields={[
              {
                label: 'Title',
                placeholder: 'Masukkan judul materi',
                value: title,
                onChange: (e) => setTitle(e.target.value),
                required: true,
              },
              {
                label: 'Slug',
                placeholder: 'Masukkan slug materi',
                value: slug,
                onChange: (e) => setSlug(e.target.value),
                required: true,
              },
              {
                label: 'Category',
                placeholder: 'Masukkan kategori materi',
                value: category,
                onChange: (e) => setCategory(e.target.value),
                required: true,
              },
              {
                label: 'Type',
                type: 'select',
                placeholder: 'Pilih tipe materi',
                value: type,
                onChange: (e) => setType(e.target.value as 'PENGANTAR' | 'SUB_MATERI'),
                options: typeOptions,
                required: true,
              },
            ]}
          />

          <AdminForm
            title="Tambah Step"
            onSubmit={submitStep}
            submitText="Tambah Step"
            submitColor="bg-[#38e078]"
            fields={[
              {
                label: 'Materi',
                type: 'select',
                placeholder: 'Pilih Materi',
                value: stepMateriId,
                onChange: (e) => setStepMateriId(e.target.value),
                options: materiOptions,
                required: true,
              },
              {
                label: 'Judul Step',
                placeholder: 'Masukkan judul step',
                value: stepTitle,
                onChange: (e) => setStepTitle(e.target.value),
                required: true,
              },
              {
                label: 'Order',
                inputType: 'number',
                placeholder: 'Nomor urutan step',
                value: stepOrder,
                onChange: (e) => setStepOrder(Number(e.target.value)),
                required: true,
                min: 1,
              },
            ]}
          >
            <div className="space-y-2">
              <Label required>Isi Konten (Markdown Editor)</Label>
              <MDEditor
                value={stepContent}
                onChange={(val) => setStepContent(val || '')}
                height={300}
                preview="edit"
                hideToolbar={false}
                data-color-mode="light"
              />
            </div>
          </AdminForm>

          <AdminDataTable
            title="Daftar Materi"
            data={materiList}
            columns={[
              {
                key: 'title',
                label: 'Judul',
                sortable: true
              },
              {
                key: 'category',
                label: 'Kategori',
                sortable: true
              },
              {
                key: 'type',
                label: 'Tipe',
                render: (item) => (
                  <Badge variant={item.type === 'PENGANTAR' ? 'default' : 'secondary'}>
                    {item.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'}
                  </Badge>
                ),
                sortable: true
              },
              {
                key: 'slug',
                label: 'Slug'
              }
            ]}
            onEdit={(item) => setEditingMateri(item)}
            onDelete={handleDeleteMateri}
            searchPlaceholder="Cari materi..."
            searchFields={['title', 'category', 'slug']}
          />

          <AdminDataTable
            title="Daftar Steps"
            data={stepList}
            columns={[
              {
                key: 'title',
                label: 'Judul Step',
                sortable: true
              },
              {
                key: 'order',
                label: 'Urutan',
                sortable: true
              },
              {
                key: 'materi',
                label: 'Materi',
                render: (item) => (
                  <div>
                    <div className="font-medium">{item.materi?.title || 'Loading...'}</div>
                    <div className="text-sm text-gray-500">
                      {item.materi?.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'}
                    </div>
                  </div>
                )
              },
              {
                key: 'content',
                label: 'Konten',
                render: (item) => (
                  <div className="max-w-xs">
                    <p className="truncate text-sm text-gray-600">
                      {item.content?.substring(0, 100) || 'Tidak ada konten'}...
                    </p>
                  </div>
                )
              }
            ]}
            onEdit={(item) => setEditingStep(item)}
            onDelete={handleDeleteStep}
            onAdd={() => fetchStepList()}
            searchPlaceholder="Cari steps..."
            searchFields={['title']}
          />
        </TabsContent>

        <TabsContent value="ujian" className="space-y-6">
          <section className="border p-6 rounded-lg shadow bg-white">
            <h2 className="text-xl font-semibold mb-4">Tambah Test</h2>
            <form onSubmit={submitTest} className="space-y-4">
              <div>
                <Label required>Materi</Label>
                <select
                  value={testMateriId}
                  onChange={(e) => setTestMateriId(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
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
                <Label required>Tipe Test</Label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as 'PRE' | 'POST')}
                  className="border p-2 w-full rounded"
                  disabled={availableTestTypes.length === 0}
                >
                  {availableTestTypes.includes('PRE') && <option value="PRE">Pre Test</option>}
                  {availableTestTypes.includes('POST') && <option value="POST">Post Test</option>}
                </select>
              </div>

              {testList.length > 0 && testMateriId && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200 mt-2">
                  <h3 className="font-medium text-blue-800">Test yang sudah ada:</h3>
                  <ul className="list-disc pl-5 mt-1">
                    {testList.map((test) => (
                      <li key={test.id} className="text-blue-600">
                        {test.type} Test ({test.questions?.length || 0} soal)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="bg-[#38e078] text-white px-4 py-2 rounded hover:bg-purple-700"
                disabled={availableTestTypes.length === 0}
              >
                Tambah Test
              </button>

              {availableTestTypes.length === 0 && testMateriId && (
                <p className="text-amber-600">
                  Semua tipe test (PRE dan POST) sudah ditambahkan untuk materi ini.
                </p>
              )}
            </form>
          </section>

          <section className="border p-6 rounded-lg shadow bg-white">
            <h2 className="text-xl font-semibold mb-4">Tambah Question</h2>
            <form onSubmit={submitQuestion} className="space-y-4">
              <div>
                <Label required>Materi</Label>
                <select
                  value={questionMateriId}
                  onChange={(e) => {
                    setQuestionMateriId(e.target.value);
                    setQuestionTestId('');
                  }}
                  required
                  className="border p-2 w-full rounded"
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
                <Label required>Test</Label>
                <select
                  value={questionTestId}
                  onChange={(e) => setQuestionTestId(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                  disabled={!questionMateriId || testList.length === 0}
                >
                  <option value="">-- Pilih Test --</option>
                  {testList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.type} Test ({t.questions?.length || 0} soal)
                    </option>
                  ))}
                </select>

                {questionMateriId && testList.length === 0 && (
                  <p className="text-red-500 mt-1">
                    Belum ada test untuk materi ini. Tambahkan test terlebih dahulu.
                  </p>
                )}
              </div>

              <div>
                <Label required>Pertanyaan</Label>
                <input
                  type="text"
                  placeholder="Pertanyaan"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </div>

              <div className="space-y-3">
                <Label required>Opsi Jawaban</Label>
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center">
                    <span className="mr-2 font-medium w-8">{i}.</span>
                    <input
                      type="text"
                      placeholder={`Opsi ${i + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      required
                      className="border p-2 w-full rounded"
                    />
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={answerIndex === i}
                      onChange={() => setAnswerIndex(i)}
                      className="ml-3 h-5 w-5"
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label>Jawaban Benar: Opsi {answerIndex}</Label>
              </div>

              <button
                type="submit"
                className="bg-[#38e078] hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Tambah Question
              </button>
            </form>
          </section>

          <AdminDataTable
            title="Daftar Tests"
            data={testList}
            columns={[
              {
                key: 'type',
                label: 'Tipe Test',
                render: (item) => (
                  <Badge variant={item.type === 'PRE' ? 'default' : 'secondary'}>
                    {item.type} Test
                  </Badge>
                ),
                sortable: true
              },
              {
                key: 'materi',
                label: 'Materi',
                render: (item) => (
                  <div>
                    <div className="font-medium">{item.materi?.title || 'Loading...'}</div>
                    <div className="text-sm text-gray-500">
                      {item.materi?.type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi'}
                    </div>
                  </div>
                )
              },
              {
                key: 'questions',
                label: 'Jumlah Soal',
                render: (item) => (
                  <Badge variant="outline">
                    {item.questions?.length || 0} soal
                  </Badge>
                )
              }
            ]}
            onEdit={(item) => setEditingTest(item)}
            onDelete={handleDeleteTest}
            onAdd={() => fetchAllTests()}
            searchPlaceholder="Cari tests..."
          />

          {/* Tabel Data Questions */}
          <AdminDataTable
            title="Daftar Questions"
            data={questionList}
            columns={[
              {
                key: 'question',
                label: 'Pertanyaan',
                render: (item) => (
                  <div className="max-w-md">
                    <p className="truncate">{item.question}</p>
                  </div>
                ),
                sortable: true
              },
              {
                key: 'test',
                label: 'Test',
                render: (item) => (
                  <div>
                    <div className="font-medium">
                      {item.test?.materi?.title || 'Loading...'}
                    </div>
                    <Badge variant={item.test?.type === 'PRE' ? 'default' : 'secondary'} className="text-xs">
                      {item.test?.type} Test
                    </Badge>
                  </div>
                )
              },
              {
                key: 'answer',
                label: 'Jawaban Benar',
                render: (item) => (
                  <div className="text-center">
                    <Badge variant="outline">Opsi {item.answer}</Badge>
                  </div>
                )
              },
              {
                key: 'options',
                label: 'Jumlah Opsi',
                render: (item) => (
                  <Badge variant="outline">
                    {item.options?.length || 0} opsi
                  </Badge>
                )
              }
            ]}
            onEdit={(item) => setEditingQuestion(item)}
            onDelete={handleDeleteQuestion}
            onAdd={() => fetchQuestionList()}
            searchPlaceholder="Cari questions..."
            searchFields={['question']}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Modals */}
      <AdminEditModal
        isOpen={!!editingMateri}
        onClose={() => setEditingMateri(null)}
        type="materi"
        item={editingMateri}
        materiList={materiList}
        onSave={handleEditMateri}
      />

      <AdminEditModal
        isOpen={!!editingStep}
        onClose={() => setEditingStep(null)}
        type="step"
        item={editingStep}
        materiList={materiList}
        onSave={handleEditStep}
      />

      <AdminEditModal
        isOpen={!!editingTest}
        onClose={() => setEditingTest(null)}
        type="test"
        item={editingTest}
        materiList={materiList}
        onSave={handleEditTest}
      />

      <AdminEditModal
        isOpen={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        type="question"
        item={editingQuestion}
        materiList={materiList}
        testList={testList}
        onSave={handleEditQuestion}
      />
    </AdminPageTemplate>
  );
}
