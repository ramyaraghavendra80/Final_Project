import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const history = useHistory();

  const handleSearch = () => {
    if (query.trim() !== '') {
      history.push(`/results/${query}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Movies"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;
