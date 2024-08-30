import { useState, useEffect } from 'react';
import axios from 'axios';

const Found = ({ handleSearch }) => {
  return (
    <div>
      find countries <input onChange={handleSearch} />
    </div>
  );
};

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (country.capital && api_key) {
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}&units=metric`
      )
      
        .then(response => setWeather(response.data))
        .catch(error => {
          setError('Error fetching weather data');
          console.error('Error fetching weather data:', error);
        });
    }
  }, [country, api_key]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />

      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};

const CountryList = ({ countries, handleShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleShow(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />;
  }

  return <p>No matches found</p>;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setSelectedCountry(null); // Reset selected country when the query changes
  };

  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  useEffect(() => {
    if (query) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const filteredCountries = response.data.filter(country =>
            country.name.common.toLowerCase().includes(query.toLowerCase())
          );
          setCountries(filteredCountries);
        });
    } else {
      setCountries([]);
    }
  }, [query]);

  return (
    <div>
      <Found handleSearch={handleSearch} />
      {selectedCountry ? (
        <CountryDetails country={selectedCountry} />
      ) : (
        <CountryList countries={countries} handleShow={handleShow} />
      )}
    </div>
  );
}

export default App;
