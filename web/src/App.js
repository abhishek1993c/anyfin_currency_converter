import React from 'react';
import './App.css';

import Search from './components/search/search';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <p>Search for cities and know the exchange rates.</p>
      </header>
      <Search />
    </div>
  );
}

export default App;
