import { useEffect, useState } from "react";
import { fetchKanji } from "../services/kanjiService";
import { KanjiEntry } from "../types/kanjiEntry";
import { toast } from "react-toastify";

export function StudyMode() {
  // State for all kanji data and study session control
  const [allKanji, setAllKanji] = useState<KanjiEntry[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string>("");
  const [studyList, setStudyList] = useState<KanjiEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [isStudying, setIsStudying] = useState<boolean>(false);

  useEffect(() => {
    // Fetch all kanji data on component mount
    fetchKanji().then(setAllKanji).catch(console.error);
  }, []);

  // Helper to parse chapter input (e.g. "1,3-5")
  const parseChapters = (input: string): number[] => {
    const chapters: number[] = [];
    const parts = input.split(/[,\s]+/);
    for (let part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end)) {
          const low = Math.min(start, end);
          const high = Math.max(start, end);
          for (let c = low; c <= high; c++) {
            chapters.push(c);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num)) {
          chapters.push(num);
        }
      }
    }
    // Remove duplicates and sort
    const uniqueChapters = Array.from(new Set(chapters));
    uniqueChapters.sort((a, b) => a - b);
    return uniqueChapters;
  };

  const handleStartStudy = () => {
    const chapterNumbers = parseChapters(selectedChapters);
    let entries = allKanji;
    if (chapterNumbers.length > 0) {
      entries = allKanji.filter(entry => chapterNumbers.includes(entry.chapter));
    }
    if (entries.length === 0) {
      toast.error("No kanji found for the selected chapters.");
      return;
    }
    // Shuffle the list randomly
    const shuffled = [...entries].sort(() => Math.random() - 0.5);
    setStudyList(shuffled);
    setCurrentIndex(0);
    setRevealed(false);
    setIsStudying(true);
  };

  const handleRevealToggle = () => {
    setRevealed(prev => !prev);
  };

  const handleNext = () => {
    if (currentIndex < studyList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRevealed(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setRevealed(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4 font-bold">Study Mode</h1>

      {!isStudying ? (
        /* Selection UI */
        <div>
          <div className="mb-4">
            <label className="mr-2">Chapters to study:</label>
            <input
              type="text"
              value={selectedChapters}
              onChange={(e) => setSelectedChapters(e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="e.g. 1,2,5-7"
            />
          </div>
          <button
            onClick={handleStartStudy}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Start Study
          </button>
        </div>
      ) : (
        /* Flashcard Study UI */
        <div className="p-6 max-w-md mx-auto mt-6 bg-white rounded-xl shadow-md text-center">
          {studyList.length > 0 && (
            <div>
              {/* Display the current card */}
              {!revealed ? (
                <div className="text-2xl font-bold mb-4">
                  {studyList[currentIndex].key}
                </div>
              ) : (
                <div>
                  <div className="text-4xl font-bold mb-4 text-center">
                    {studyList[currentIndex].kanji}
                  </div>
                  <div className="mb-2 text-left">
                    <strong>Keyword:</strong> {studyList[currentIndex].key}
                  </div>
                  <div className="mb-2 text-left">
                    <strong>Strokes:</strong> {studyList[currentIndex].strokes}{" "}
                    <strong>Number:</strong> {studyList[currentIndex].number}{" "}
                    <strong>Chapter:</strong> {studyList[currentIndex].chapter}
                  </div>
                  {(studyList[currentIndex].story) && (
                    <div className="text-left">
                      <strong>Story:</strong> {studyList[currentIndex].story }
                    </div>
                  )}
                </div>
              )}

              {/* Reveal button */}
              <button
                onClick={handleRevealToggle}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {revealed ? "Hide Answer" : "Reveal Answer"}
              </button>

              {/* Navigation buttons */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  &larr; Previous
                </button>
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} / {studyList.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === studyList.length - 1}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
