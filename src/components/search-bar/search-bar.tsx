import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ onSearchResults }: { onSearchResults: (products: any[]) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    try {
      const response = await axios.get(`/api/products`, {
        params: { search: value }
      });
      onSearchResults(response.data.products);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="px-40">
      <div className="min-w-3/4 max-w-full mx-auto mt-4 bg-gray-400">
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300 border-2 border-solid border-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            className="peer h-full w-full outline-none text-sm px-3 border-2 border-solid border-gray-400"
            type="text"
            id="search"
            placeholder="Search something.. eg. Name/Brand/Category"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
