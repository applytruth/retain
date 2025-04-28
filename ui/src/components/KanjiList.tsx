import React, { useState, useEffect } from "react";
import { fetchKanji, updateKanji } from "../services/kanjiService";
import { KanjiEntry } from "../types/KanjiEntry";
import { toast } from "react-toastify";

const KanjiList = () => {
  const [kanjiList, setKanjiList] = useState<KanjiEntry[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const loadKanji = async () => {
      try {
        const data = await fetchKanji();
        setKanjiList(data);
      } catch (error) {
        console.error("Error loading kanji:", error);
      }
    };
    loadKanji();
  }, []);

  const handleInputChange = (index: number, field: keyof KanjiEntry, value: string | number) => {
    const updatedList = [...kanjiList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setKanjiList(updatedList);
  };

  const handleSave = async (kanji: KanjiEntry) => {
    try {
      await updateKanji(kanji);
      toast.success("Kanji updated successfully");
    } catch (error) {
      console.error("Error saving kanji:", error);
      toast.error("Failed to save kanji");
    }
  };

  const filteredKanjiList = kanjiList.filter((kanji) =>
    kanji.key.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by keyword"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKanjiList.map((kanji, index) => (
          <div key={kanji.key} className="border rounded p-4 shadow">
            <h2 className="text-2xl mb-2">{kanji.kanji}</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm">Keyword</label>
                <input
                  type="text"
                  value={kanji.key}
                  disabled
                  className="border rounded px-2 py-1 w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm">Number</label>
                <input
                  type="number"
                  value={kanji.number}
                  onChange={(e) => handleInputChange(index, "number", Number(e.target.value))}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-sm">Chapter</label>
                <input
                  type="number"
                  value={kanji.chapter}
                  onChange={(e) => handleInputChange(index, "chapter", Number(e.target.value))}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-sm">Strokes</label>
                <input
                  type="number"
                  value={kanji.strokes}
                  onChange={(e) => handleInputChange(index, "strokes", Number(e.target.value))}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-sm">Story</label>
                <textarea
                  value={kanji.story}
                  onChange={(e) => handleInputChange(index, "story", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  rows={3}
                />
              </div>
              <button
                onClick={() => handleSave(kanji)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanjiList;
