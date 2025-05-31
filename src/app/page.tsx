'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type SearchMode = 'linear' | 'binary';

export default function Home() {
  const TABLE_SIZE = 30;

  const [table, setTable] = useState<(number | null)[]>(Array(TABLE_SIZE).fill(null));
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('linear');
  const [searchIndex, setSearchIndex] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [binarySearchTableIndex, setBinarySearchTableIndex] = useState<number | null>(null);
  const [binarySearchSortedIndex, setBinarySearchSortedIndex] = useState<number | null>(null);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Insert number via hashing (value % TABLE_SIZE)
  const handleInsert = () => {
    const num = parseInt(inputValue);
    if (isNaN(num)) return;

    const index = num % TABLE_SIZE;
    setTable((prev) => {
      const newTable = [...prev];
      newTable[index] = num; // overwrite for simplicity
      return newTable;
    });

    setInputValue('');
    setSearchResult(null);
    setSearchIndex(null);
  };
  const handleRandomFill = () => {
    const COUNT = 10; // Number of random numbers to insert
    const randomNumbers = Array.from({ length: COUNT }, () =>
      Math.floor(Math.random() * 1000)
    );
    setTable((prev) => {
      const newTable = [...prev];
      randomNumbers.forEach((num) => {
        const index = num % TABLE_SIZE;
        newTable[index] = num; // overwrite for simplicity
      });
      return newTable;
    });
    setSearchResult(null);
    setSearchIndex(null);
  };

  // Linear search animation
  const linearSearch = async (arr: (number | null)[], target: number) => {
    setSearching(true);
    for (let i = 0; i < arr.length; i++) {
      setSearchIndex(i);
      await delay(600);
      if (arr[i] === target) {
        setSearchResult(`Found at index ${i} (linear search)`);
        setSearching(false);
        return;
      }
    }
    setSearchResult('Not found (linear search)');
    setSearching(false);
  };

  // Binary search animation on sorted array
  const binarySearch = async (arr: number[], target: number, originalTable: (number | null)[]) => {
    setSearching(true);
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      setBinarySearchSortedIndex(mid); // Highlight in sorted array
      // Find the index of arr[mid] in the original table
      const tableIdx = originalTable.findIndex((v) => v === arr[mid]);
      setSearchIndex(null); // Don't highlight in hash table using searchIndex
      setBinarySearchTableIndex(tableIdx); // Highlight correct cell in hash table
      await delay(600);

      if (arr[mid] === target) {
        setSearchResult(`Found at index ${mid} (binary search)`);
        setSearching(false);
        setBinarySearchSortedIndex(null);
        return;
      } else if (arr[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    setSearchResult('Not found (binary search)');
    setSearching(false);
    setBinarySearchSortedIndex(null);
  };

  // In handleSearch, reset the new state:
  const handleSearch = () => {
    const num = parseInt(searchValue);
    if (isNaN(num)) return;
    setSearchResult(null);
    setSearchIndex(null);
    setBinarySearchTableIndex(null);
    setBinarySearchSortedIndex(null);

    if (searchMode === 'linear') {
      linearSearch(table, num);
    } else {
      const sorted = table.filter((v): v is number => v !== null).sort((a, b) => a - b);
      binarySearch(sorted, num, table);
    }
  };

  // ...existing code...
  // ...existing code...
  return (
  <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-2">
    <div className="bg-gray-800/90 shadow-2xl rounded-3xl p-4 sm:p-8 w-full max-w-xs sm:max-w-2xl flex flex-col items-center border border-gray-700">
      <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-blue-300 tracking-tight text-center">
        Hash Table Visualizer
      </h1>

      {/* Insert Section */}
      <div className="mb-6 sm:mb-8 w-full flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="number"
          placeholder="Number to insert"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={searching}
          className="border-2 border-blue-700 focus:border-blue-400 bg-gray-900 text-blue-100 placeholder-blue-400 rounded-xl p-3 w-full sm:w-44 transition"
        />
        <button
          onClick={handleInsert}
          disabled={searching}
          className="bg-blue-700 hover:bg-blue-600 transition text-white px-6 py-2 rounded-xl font-semibold shadow disabled:opacity-50 w-full sm:w-auto"
        >
          Insert
        </button>
        <button
          onClick={handleRandomFill}
          disabled={searching}
          className="bg-indigo-700 hover:bg-indigo-600 transition text-white px-6 py-2 rounded-xl font-semibold shadow disabled:opacity-50 w-full sm:w-auto"
        >
          Random Fill
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-6 sm:mb-8 w-full flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="number"
          placeholder="Number to search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          disabled={searching}
          className="border-2 border-green-700 focus:border-green-400 bg-gray-900 text-green-100 placeholder-green-400 rounded-xl p-3 w-full sm:w-44 transition"
        />
        <select
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value as SearchMode)}
          disabled={searching}
          className="border-2 border-gray-700 rounded-xl p-3 bg-gray-900 text-gray-100 transition w-full sm:w-auto"
        >
          <option value="linear">Linear Search</option>
          <option value="binary">Binary Search</option>
        </select>
        <button
          onClick={handleSearch}
          disabled={searching}
          className="bg-green-700 hover:bg-green-600 transition text-white px-6 py-2 rounded-xl font-semibold shadow disabled:opacity-50 w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Display hash table */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 mb-6 w-full">
        {table.map((val, i) => (
          <motion.div
            key={i}
            className={`h-12 sm:h-16 flex items-center justify-center border-2 rounded-2xl font-bold text-lg sm:text-xl shadow-sm transition
              ${(searchMode === 'binary' && binarySearchTableIndex === i) ||
                (searchMode === 'linear' && searchIndex === i)
                ? 'bg-yellow-400/80 border-yellow-500 scale-105 text-gray-900'
                : 'bg-gray-900 border-gray-700 text-gray-100 hover:scale-105 hover:shadow-md'
              }
            `}
          >
            {val === null ? <span className="text-gray-600">–</span> : val}
          </motion.div>
        ))}
      </div>

      {/* For binary search: show sorted array */}
      {searchMode === 'binary' && (
        <div className="mb-4 w-full">
          <h2 className="font-semibold mb-2 text-gray-300 text-center text-base sm:text-lg">Sorted array for binary search:</h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
            {table
              .filter((v): v is number => v !== null)
              .sort((a, b) => a - b)
              .map((val, i) => (
                <motion.div
                  key={i}
                  className={`h-12 sm:h-16 flex items-center justify-center border-2 rounded-2xl font-bold text-lg sm:text-xl shadow-sm transition
                    ${binarySearchSortedIndex === i
                      ? 'bg-yellow-400/80 border-yellow-500 scale-105 text-gray-900'
                      : 'bg-gray-900 border-gray-700 text-gray-100 hover:scale-105 hover:shadow-md'
                    }
                  `}
                >
                  {val}
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Result message */}
      {searchResult && (
        <div className="text-base sm:text-lg font-semibold mt-6 text-center text-purple-300 bg-purple-900/70 rounded-xl px-4 py-2 shadow">
          {searchResult}
        </div>
      )}
    </div>
    <footer className="mt-8 text-gray-500 text-xs sm:text-sm text-center">Modern UI Hash Table Visualizer &copy; 2025</footer>
  </main>
);
  // ...existing code...
  // ...existing code...
}
