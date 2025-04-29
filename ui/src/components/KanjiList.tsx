import { useEffect, useState } from "react";
import { fetchKanji, updateKanji } from "../services/kanjiService";
import { KanjiEntry } from "../types/KanjiEntry";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function KanjiList() {
  const [kanjiList, setKanjiList] = useState<KanjiEntry[]>([]);
  const [editingKanji, setEditingKanji] = useState<KanjiEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function loadKanji() {
      const kanji = await fetchKanji();
      setKanjiList(kanji);
    }
    loadKanji();
  }, []);

  const handleEditClick = (kanji: KanjiEntry) => {
    setEditingKanji({ ...kanji });
  };

  const handleSaveClick = async () => {
    if (editingKanji) {
      try {
        await updateKanji(editingKanji);
        toast.success("Kanji updated successfully!");
        setEditingKanji(null);
        const updatedKanji = await fetchKanji();
        setKanjiList(updatedKanji);
      } catch (error) {
        toast.error("Error updating kanji. Please try again.");
      }
    }
  };

  const handleCancelClick = () => {
    setEditingKanji(null);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingKanji) {
      const { name, value } = e.target;
      setEditingKanji({ ...editingKanji, [name]: name === "number" || name === "chapter" || name === "strokes" ? Number(value) : value });
    }
  };

  const filteredKanji = kanjiList.filter(entry => {
    if (!searchTerm.trim()) {
      return true;
    }
    const search = searchTerm.trim().toLowerCase();
    if (!isNaN(Number(search))) {
      return entry.chapter === Number(search);
    } else {
      return entry.key.toLowerCase() === search;
    }
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by keyword or chapter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleClearSearch}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      <div className="grid gap-4">
        {filteredKanji.map((kanji) => (
          <div key={kanji.key} className="p-4 border rounded shadow-md bg-white">
            {editingKanji?.key === kanji.key ? (
              <div className="space-y-2">
                <div>
                  <strong>Number:</strong>
                  <input
                    name="number"
                    value={editingKanji.number}
                    onChange={handleChange}
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div>
                  <strong>Chapter:</strong>
                  <input
                    name="chapter"
                    value={editingKanji.chapter}
                    onChange={handleChange}
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div>
                  <strong>Strokes:</strong>
                  <input
                    name="strokes"
                    value={editingKanji.strokes}
                    onChange={handleChange}
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div>
                  <strong>Story:</strong>
                  <textarea
                    name="story"
                    value={editingKanji.story}
                    onChange={handleChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveClick}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Keyword:</strong> {kanji.key}</p>
                <p><strong>Kanji:</strong> {kanji.kanji}</p>
                <p><strong>Number:</strong> {kanji.number}</p>
                <p><strong>Chapter:</strong> {kanji.chapter}</p>
                <p><strong>Strokes:</strong> {kanji.strokes}</p>
                <p><strong>Story:</strong> {kanji.story}</p>
                <button
                  onClick={() => handleEditClick(kanji)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
