import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';

import { useStore } from '../store';

const SEARCH_RESULTS = gql`
  query searchResults($searchTerm: String!) {
    searchResults: search(term: $searchTerm) {
      type: __typename
      id
      content
      ... on Task {
        approachCount
      }
      ... on Approach {
        task {
          id
          content
        }
      }
    }
  }
`;

export default function Search({ searchTerm = null }) {
  const { setLocalAppState, query, AppLink } = useStore();
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const term = event.target.search.value;

    setLocalAppState({
      component: { name: 'Search', props: { searchTerm: term } },
    });
  };

  useEffect(() => {
    if (searchTerm) {
      query(SEARCH_RESULTS, { variables: { searchTerm } }).then(
        ({ data }) => {
          setSearchResults(data.searchResults);
        }
      );
    }
  }, [searchTerm, query]);

  return (
    <div>
      <div className="main-container">
        <form method="post" onSubmit={handleSearchSubmit}>
          <div className="center">
            <input
              type="search"
              name="search"
              className="input-append"
              defaultValue={searchTerm}
              placeholder="Search all tasks and approaches"
              required
            />
            <div className="">
              <button className="btn btn-append" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      {searchResults && (
        <div>
          <h2>Search Results</h2>
          <div className="y-spaced">
            {searchResults.length === 0 && (
              <div className="box box-primary">No results</div>
            )}
            {searchResults.map((item, index) => (
              <div key={index} className="box box-primary">
                <AppLink
                  to="TaskPage"
                  taskId={
                    item.type === 'Approach' ? item.task.id : item.id
                  }
                >
                  <span className="search-label">{item.type}</span>{' '}
                  {item.content.substr(0, 250)}
                </AppLink>
                <div className="search-sub-line">
                  {item.type === 'Task'
                    ? `Approaches: ${item.approachCount}`
                    : `Task: ${item.task.content.substr(0, 250)}`}
                </div>
              </div>
            ))}
          </div>
          <AppLink to="Home">{'<'} Home</AppLink>
        </div>
      )}
    </div>
  );
}
