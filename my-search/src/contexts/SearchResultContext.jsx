import React, { createContext, useState, useContext } from 'react';

const SearchResultContext = createContext();

export const SearchResultProvider = ({ children }) => {
    const [resultsState, setResultsState] = useState({
        query: '',
        model: 'pro',
        tableData: [],
        chartData: [],
        majorFields: [],
        lastLoadedQuery: '',
        isLoading: false,
        error: null,
    });

    return (
        <SearchResultContext.Provider value={{ resultsState, setResultsState }}>
        {children}
        </SearchResultContext.Provider>
    );
};

export const useSearchResults = () => useContext(SearchResultContext);