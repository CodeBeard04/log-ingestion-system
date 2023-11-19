import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import axios from 'axios';

import { TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

const PaginatedSearchDataGrid = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [value, setValue] = useState('user');
    const [startTimeValue, setStartTimeValue] = useState();
    const [endTimeValue, setEndTimeValue] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState();
    const [selectedOption, setSelectedOption] = useState('');

    let filteredColumnData;

    useEffect(() => {
        if (query) {
            fetchData();
        }
    }, [query]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('http://localhost:3000/logs/search', {
                params: {
                    startDateTime: startTimeValue,
                    endDateTime: endTimeValue,
                }
            });
            setSearchResults(response.data.records);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/logs/search`, {
                params: {
                    query: query,
                    selectedOption: selectedOption,
                } 
            });
            setSearchResults(response.data.records);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const filteredData = (data) => {
        return data && data.filter((item) => {
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

    if (isEmpty(searchResults)) {
        filteredColumnData = filteredData(data);
    } else {
        filteredColumnData = filteredData(searchResults);
    }

    return (
        <>
            <Root>

                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Select</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectedOption}
                        label="Select"
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="level">Level</MenuItem>
                        <MenuItem value="resourceId">Resource Id</MenuItem>
                        <MenuItem value="traceId">Trace Id</MenuItem>
                        <MenuItem value="spanId">Span Id</MenuItem>
                        <MenuItem value="commit">Commit</MenuItem>
                        <MenuItem value="parentResourceId">Parent Resource Id</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

                <Button variant="contained" onClick={newhandleSearch}>Search</Button>

                <form onSubmit={handleSubmit}>
                    <label>
                        Start Date and Time:
                        <input
                            type="datetime-local"
                            value={startTimeValue}
                            onChange={(e) => setStartTimeValue(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        End Date and Time:
                        <input
                            type="datetime-local"
                            value={endTimeValue}
                            onChange={(e) => setEndTimeValue(e.target.value)}
                        />
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                </form>


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
