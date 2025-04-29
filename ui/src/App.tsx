import { useState } from "react";
import { KanjiList } from "./components/KanjiList";
import { StudyMode } from "./components/StudyMode";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [activeTab, setActiveTab] = useState<'edit' | 'study'>('edit');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Retain Study App</h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('edit')}
              className={`text-white hover:underline ${activeTab === 'edit' ? 'font-semibold underline' : ''}`}
            >
              Edit Subject
            </button>
            <button
              onClick={() => setActiveTab('study')}
              className={`text-white hover:underline ${activeTab === 'study' ? 'font-semibold underline' : ''}`}
            >
              Study Mode
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {activeTab === 'edit' && <KanjiList />}
        {activeTab === 'study' && <StudyMode />}
      </main>

      <Toaster position="top-center" />
    </div>
  );
}


