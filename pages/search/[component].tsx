import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import usePhysicalData from '../../hooks/usePhysicalData';
import SearchCard from '../../components/SearchCard';
import classNames from 'classnames';

import { PhysicalData } from '../../hooks/usePhysicalData';

const Results = ({ data, numberOfResults, component }) => {
  return (
    <div
      className="pt-8 pb-6 flex gap-x-4 gap-y-4 lg:w-[1024px] flex-wrap justify-center"
      role="list"
    >
      {data.length > 0 &&
        data
          .slice(0, numberOfResults)
          .map((item: any, index: number) => (
            <SearchCard type={component} key={index} information={item} />
          ))}
    </div>
  );
};

const Search: NextPage = () => {
  const router = useRouter();
  const { component } = router.query;
  const [searchText, setSearchText] = useState<string>('');
  const [resultFitered, setResultFitered] = useState<any>([]);
  // const [numberOfResults, setNumberOfResults] = useState<number>();
  const [isFirstSearch, setIsFirstSearch] = useState<boolean>(false);
  const searchForm = useRef<HTMLFormElement>(null);
  const { result, setData }: PhysicalData = usePhysicalData();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsPerPage = 10;

  const startIdx = (currentPage - 1) * resultsPerPage;
  const endIdx = startIdx + resultsPerPage;

  useEffect(() => {
    if (!component) {
      return;
    }
    setData(component);
  }, [component, setData]);

  useEffect(() => {
    if (!result) {
      return;
    }
    setResultFitered(result);
    return () => {};
  }, [result]);

  /**
   * @name filterSearch
   * @description Function to filter the search by component and by search text
   * @param {Array} result
   * @param {String} component
   * @param {String} search
   * @returns
   */
  const filterSearch = (result: any[], component: string, search: string) => {
    switch (component) {
      case 'capsules':
        return result.filter((capsule) => {
          if (
            capsule.serial !== null &&
            capsule.last_update !== null &&
            capsule.status !== null &&
            capsule.type !== null
          ) {
            return (
              capsule.serial.toLowerCase().includes(search.toLowerCase()) ||
              capsule.last_update
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              capsule.status.toLowerCase().includes(search.toLowerCase()) ||
              capsule.type.toLowerCase().includes(search.toLowerCase())
            );
          }
          return false;
        });
      case 'cores':
        return result.filter((core) => {
          if (
            core.serial !== null &&
            core.last_update !== null &&
            core.status !== null
          ) {
            return (
              core.serial.toLowerCase().includes(search.toLowerCase()) ||
              core.last_update.toLowerCase().includes(search.toLowerCase()) ||
              core.status.toLowerCase().includes(search.toLowerCase())
            );
          }
          return false;
        });
      case 'launches':
        return result.filter((launch) => {
          if (launch.name !== null) {
            return launch.name.toLowerCase().includes(search.toLowerCase());
          }
          return false;
        });
      case 'payloads':
        return result.filter((payload) => {
          if (payload.name !== null) {
            return payload.name.toLowerCase().includes(search.toLowerCase());
          }
          return false;
        });
      case 'rockets':
        return result.filter((rocket) => {
          if (rocket.description !== null) {
            return rocket.description
              .toLowerCase()
              .includes(search.toLowerCase());
          }
          return false;
        });
      default:
        break;
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFirstSearch) {
      setIsFirstSearch(true);
    }
    const searchResponse = filterSearch(
      result,
      component as string,
      searchText
    );
    setResultFitered(searchResponse);
  };
  return (
    <main className="flex justify-center items-center flex-col min-h-[76vh]">
      <div className="flex flex-col justify-center md:w-[768px] gap-y-4 text-center">
        <div className="flex justify-center py-10">
          <h1 className="dark:text-white text-5xl md:text-6xl font-space capitalize">
            {component}
          </h1>
        </div>
        <form
          className="flex items-center"
          onSubmit={handleSearch}
          ref={searchForm}
        >
          <label htmlFor="voice-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-2.5  dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500 font-space"
              placeholder="Write the search term here..."
              required
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-3 ml-2 text-base font-medium text-white bg-amber-700 rounded-lg border border-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-900 font-space"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5 sm:mr-2 -ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <span className="hidden sm:inline-flex">Search</span>
          </button>
        </form>
      </div>
      <div className="flex justify-center flex-col pb-8">
        <div
          className={classNames('pt-8 text-center dark:text-gray-300', {
            hidden: !isFirstSearch,
          })}
          role="status"
        >
          <p>{resultFitered.length} results that matched your search</p>
        </div>
        <Results
          data={resultFitered.slice(startIdx, endIdx)}
          numberOfResults={resultsPerPage}
          component={component}
        />
        <div className="flex justify-center">
          <button
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <button
            className="px-3 py-2 ml-2 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            onClick={handleNextPage}
            disabled={resultFitered.length <= endIdx}
          >
            Next Page
          </button>
        </div>
      </div>
    </main>
  );
};

export default Search;
