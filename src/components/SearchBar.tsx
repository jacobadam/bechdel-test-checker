"use client";

import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { Movie } from "@/types/movieTypes";
import { getMovieByTitle } from "@/utils/  bechdelTestApi";
import { decode } from "html-entities";

interface SearchBarProps {
  onSearch: (movieTitle: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMovieSelection = useRef(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    if (isMovieSelection.current) {
      isMovieSelection.current = false;
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const moviesData = await getMovieByTitle(searchTerm);
        setSearchResults(moviesData);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMovieSelect = (movie: Movie) => {
    isMovieSelection.current = true;
    setSearchTerm(decode(movie.title));
    onSearch(movie.title);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-auto sm:w-80 gap-1">
        <input
          type="search"
          id="input"
          className="block w-full max-w-xs px-4 py-2 text-base font-normal shadow-xs text-red bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed text-center"
          placeholder="Search for a movie..."
          required
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>

      {isLoading && (
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#ff914d] my-4"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {searchResults.length > 0 && (
        <ul className="w-80 border rounded p-2 mt-4 sm:mt-0">
          {searchResults.map((movie, index) => (
            <li
              key={index}
              onClick={() => handleMovieSelect(movie)}
              className="cursor-pointer hover:bg-gray-50 p-2 text-red-400"
            >
              {decode(movie.title)} ({movie.year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default SearchBar;
