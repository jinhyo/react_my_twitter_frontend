import { createSelector, createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "searchSlice",
  initialState: {
    searchWord: "",
    searchResults: null,
    showSearchResults: true
  },
  reducers: {
    setSearchWord: (state, { payload: word }) => {
      state.searchWord = word;
    },
    setSearchResults: (state, { payload: results }) => {
      state.searchResults = results;
    },
    clearSearchResults: state => {
      state.searchResults = null;
    },
    setShowSearchResults: (state, { payload: bool }) => {
      state.showSearchResults = bool;
    }
  }
});

const selectSearchWord = createSelector(
  state => state.searchWord,

  searchWord => searchWord
);

const selectSearchResults = createSelector(
  state => state.searchResults,

  searchResults => searchResults
);

const selectShowSearchResults = createSelector(
  state => state.showSearchResults,

  showSearchResults => showSearchResults
);

export const searchActions = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
export const SEARCH = searchSlice.name;
export const searchSelector = {
  searchWord: state => selectSearchWord(state[SEARCH]),
  searchResults: state => selectSearchResults(state[SEARCH]),
  showSearchResults: state => selectShowSearchResults(state[SEARCH])
};
