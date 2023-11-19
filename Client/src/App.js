import { useState, useEffect } from 'react';
import axios from 'axios';
import React, { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import PaginatedSearchDataGrid from './Components/GridPagination/GridPagination';

// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

function App() {

  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  useEffect(() => {
    axios.get('http://localhost:3000/logs')
      .then(logs => setLogs(logs.data))
      .catch(err => console.log(err));
  }, [])

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div>
      <h1></h1>
      <PaginatedSearchDataGrid data={logs} />

    </div>
  )

}

export default App;
