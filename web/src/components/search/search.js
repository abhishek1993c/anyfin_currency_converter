import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
// import { FixedSizeList } from 'react-window/';

import axios from 'axios';

const Search = () => {
  const [cityList, setCityList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [token, setToken] = useState('');
  const [searchResult, setsearchResult] = useState({});
  const [myList, setMyList] = useState([]);
  const [SEK, setSEK] = useState(1);
  const getDataFromAPI = () => {
    console.log('Options Fetched from API');
  };

  const rows = searchResult;

  const updateText = (e) => {
    setSearchText(e.target.value);
  };

  const search = () => {
    console.log(searchText);
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    axios
      .get(`http://localhost:5000/countries/search/${searchText}`, config)
      .then((res) => {
        setCityList(res.data);
      });
  };

  const updateToken = (e) => {
    setToken(e.target.value);
  };

  const updateSEK = (e) => {
    setSEK(e.target.value);
  };

  const lookup = (e) => {
    setCityList([]);
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    axios
      .get(
        `http://localhost:5000/countries/lookup/${e.target.textContent}`,
        config
      )
      .then((res) => {
        setsearchResult(res.data);
      });
  };

  const addToList = () => {
    setCityList([]);
    setsearchResult([]);
    if (myList.filter((rec) => rec.name === searchResult.name).length === 0) {
      setMyList(myList.concat(searchResult));
    }
  };

  return (
    <>
      <Grid
        style={{ marginLeft: '5%', marginTop: 'auto' }}
        container
        justifyContent='flex-start'
        alignItems='center'
        direction='row'
        width='100%'
      >
        <div style={{ padding: '10px' }}>
          <Typography variant='h4' component='h4'>
            Search a city
          </Typography>
        </div>
        <div style={{ padding: '10px' }}>
          <TextField
            onChange={updateText}
            variant='outlined'
            label='Search Box'
          />
        </div>
        <div>
          <IconButton aria-label='search' onClick={search}>
            <SearchIcon fontSize='large' />
          </IconButton>
        </div>
        <div style={{ marginRight: '0' }}>
          <TextField onChange={updateToken} variant='outlined' label='Token' />
        </div>

        <div style={{ padding: '10px', alignSelf: 'flex-end' }}>
          <Typography variant='h6' gutterBottom>
            Enter SEK amount
          </Typography>
          <TextField
            onChange={updateSEK}
            variant='outlined'
            label='SEK amount'
            value={SEK}
          />
        </div>
      </Grid>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='flex-start'
        height='100%'
        width='100%'
      >
        <Grid
          item
          xs={3}
          style={{ gridArea: 'a', alignSelf: 'flex-start', padding: '20px' }}
        >
          {cityList.length > 0 && (
            <List component='nav' aria-label='secondary mailbox folders'>
              {cityList.map((city) => {
                return (
                  <ListItem button key={city} onClick={lookup}>
                    <ListItemText primary={city} />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Grid>
        <Grid
          item
          xs={6}
          xs={3}
          style={{ gridArea: 'c', alignSelf: 'flex-start', padding: '20px' }}
        >
          {Object.keys(searchResult).length > 0 && (
            <TableContainer component={Paper}>
              <Table className='no-class' aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Name</TableCell>
                    <TableCell align='center'>Population</TableCell>
                    <TableCell align='center'>Currency</TableCell>
                    <TableCell align='center'>Exchange rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key='searchResults'>
                    <TableCell component='th' scope='row'>
                      {searchResult.name}
                    </TableCell>
                    <TableCell align='center'>
                      {searchResult.population}
                    </TableCell>
                    <TableCell align='center'>
                      {Object.keys(searchResult.currencies).join()}
                    </TableCell>
                    <TableCell align='center'>
                      {Object.keys(searchResult.currencies)
                        .map((key) => searchResult.currencies[key])
                        .join()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button color='primary' onClick={addToList}>
                Add to your list
              </Button>
            </TableContainer>
          )}
        </Grid>
        {/* </Grid> */}
        <Grid
          item
          style={{
            gridArea: 'd',
            alignSelf: 'flex-end',
            padding: '20px',
            width: '40%',
          }}
        >
          <div>
            <TableContainer component={Paper}>
              <Table className='no-class' aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Name</TableCell>
                    <TableCell align='center'>Population</TableCell>
                    <TableCell align='center'>Currency</TableCell>
                    <TableCell align='center'>SEK equivalent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(myList).length > 0 ? (
                    myList.map((rec) => (
                      <TableRow key='searchResults'>
                        <TableCell component='th' scope='row'>
                          {rec.name}
                        </TableCell>
                        <TableCell align='center'>{rec.population}</TableCell>
                        <TableCell align='center'>
                          {Object.keys(rec.currencies).join()}
                        </TableCell>
                        <TableCell align='center'>
                          {Math.round(
                            (SEK /
                              rec.currencies[Object.keys(rec.currencies)[0]]) *
                              100
                          ) / 100}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow key='searchResults'>
                      <Typography
                        variant='body2'
                        gutterBottom
                        alignSelf='center'
                      >
                        Add countries to start seeing their equivalent values
                      </Typography>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Search;
