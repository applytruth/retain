import { useState } from "react";
import data from "../data/Heisig.json";

interface KanjiEntry {
  key: string;
  kanji: string;
  chapter: number;
  number: number;
  strokes: number;
  description: string;
}

export default function Flashcard() {
  const kanjiList: KanjiEntry[] = data.Heisig;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = kanjiList[index];

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md text-center">
      <div className="text-2xl font-bold mb-4">
        {flipped ? current.kanji : current.key}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setFlipped(!flipped)}
      >
        {flipped ? "Show English" : "Show Kanji"}
      </button>
      <div className="mt-4">
        <button
          className="text-sm text-gray-600 underline"
          onClick={() => {
            setFlipped(false);
            setIndex((prev) => (prev + 1) % kanjiList.length);
          }}
        >
          Next Word →
        </button>
      </div>
    </div>
  );
}
