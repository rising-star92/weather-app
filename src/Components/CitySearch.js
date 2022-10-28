import { useState, useEffect } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { geoApiOptions, GEO_API_URL } from '../API';

const CitySearch = ({ onSearchChange }) => {
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const onSearchCountry = searchData => {
    setCountrySearch(searchData)
  }

  const onSearchCity = searchData => {
    setCitySearch(searchData);
    onSearchChange(searchData);
  };

  const loadCountries = inputValue => {
    return fetch(`${GEO_API_URL}/countries?namePrefix=${inputValue}`, geoApiOptions)
      .then(response => response.json())
      .then(response => {
        return {
          options: response.data.map(country => {
            console.log(country)
            return {
              code: `${country.code}`,
              label: `${country.name}`,
            }
          })
        }
      })
      .catch(err => console.error(err));
  }


  const loadCities = inputValue => {
    return fetch(`${GEO_API_URL}/cities?namePrefix=${inputValue}&countryIds=${countrySearch?.code}`, geoApiOptions)
      .then(response => response.json())
      .then(response => {
        return {
          options: response.data.map(city => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            }
          })
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <>    
      <AsyncPaginate
        placeholder='Enter a Country'
        debounceTimeout={600}
        value={countrySearch}
        onChange={onSearchCountry}
        loadOptions={loadCountries}
      />
      <div style={{margin: "20px 0px"}} />
      <AsyncPaginate
        placeholder='Enter a city'
        debounceTimeout={600}
        value={citySearch}
        onChange={onSearchCity}
        loadOptions={loadCities}
      />
    </>
  );
};

export default CitySearch;
