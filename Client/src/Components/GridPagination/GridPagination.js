import React, { useState, useEffect } from 'react';
import { TextField, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import axios from 'axios';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

const PaginatedSearchDataGrid = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [value, setValue] = useState('user');

    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');

    const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/logs/search?query=${query}`);
          console.log(response.data)
          setSearchResults(response.data); // Assuming the response contains an array of search results
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    useEffect(() => {
        console.log('useEffect triggered');
        console.log('query - ', query);
        if (query) {
            console.log('if useEffect triggered');
          fetchData();
        }
      }, [query]);

    let columns = [];

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const newhandleSearch = (event) => {
        setQuery(searchTerm);
    };

    const filteredData = (data) => {
        return data.filter((item) => {
            // Implement RBAC based on userRoles
            if (value.includes('admin')) {
                columns = [
                    { field: 'level', headerName: 'Level', flex: 1 },
                    { field: 'message', headerName: 'Message', flex: 1 },
                    { field: 'resourceId', headerName: 'Resource ID', flex: 1 },
                    { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
                    { field: 'traceId', headerName: 'Trace ID', flex: 1 },
                    { field: 'spanId', headerName: 'Span ID', flex: 1 },
                    { field: 'commit', headerName: 'Commit', flex: 1 },
                    { field: 'metadata.parentResourceId', headerName: 'Parent Resource ID', flex: 1 },
                ];
                // Admin has access to all columns
                return item.level && item.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.resourceId && item.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.timestamp && item.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.traceId && item.traceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.spanId && item.spanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.commit && item.commit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.metadata && item.metadata.parentResourceId.toLowerCase().includes(searchTerm.toLowerCase())

            } else if (value.includes('user')) {
                columns = [
                    { field: 'level', headerName: 'Level', flex: 1 },
                    { field: 'message', headerName: 'Message', flex: 1 },
                ];
                // User has limited access to specific columns
                return item.level && item.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase())
            }
        });
    };

    const filteredColumnData = filteredData(data);

    return (
        <>
            <Root>
                <TextField
                    label="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button onClick={newhandleSearch}>Search</button>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">Select Role</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="user" control={<Radio />} label="User" />
                            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                        </RadioGroup>
                    </FormControl>
                </div>

                <Divider>
                    <Chip label="LOGS" />
                </Divider>

                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row.level + row.message}
                        rows={filteredColumnData}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            </Root>
        </>

    );
};

export default PaginatedSearchDataGrid;
