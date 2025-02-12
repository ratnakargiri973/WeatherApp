import React, { useState, useEffect } from 'react';
import './Weather.css';
import { MdDelete } from "react-icons/md";

const cityList = ["London", "New York", "Los Angeles", "Las Vegas"];

function Weather() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState([]);
    const [searchHighlight, setSearchHighlight] = useState(null);

    const fetchWeather = async () => {
        let newData = [];
        let newHighlightedIndex = [];

        for (let i = 0; i < cityList.length; i++) {
            newHighlightedIndex.push(i);
            setHighlightedIndex([...newHighlightedIndex]);
            
            const response = await fetch(`https://python3-dot-parul-arena-2.appspot.com/test?cityname=${cityList[i]}`);
            const result = await response.json();

            const dataAge = calculateDataAge(result.date_and_time);
            newData.push({
                city: cityList[i],
                description: result.description,
                temperature: result.temp_in_celsius,
                pressure: result.pressure_in_hPa,
                dataAge: dataAge,
            });

            setData([...newData]);
            await new Promise(res => setTimeout(res, 1000));
        }
    };

    const calculateDataAge = (dateTime) => {
        const currentTime = new Date();
        const fetchedTime = new Date(dateTime);
        return Math.floor((currentTime - fetchedTime) / (1000 * 60 * 60));
    };

    const handleDelete = (index) => {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
    };

    const handleDescriptionChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].description = value;
        setData(updatedData);
    };

    const handleSearch = () => {
        const index = data.findIndex(item => item.city.toLowerCase() === search.toLowerCase());
        if (index !== -1) {
            setSearchHighlight(index);
            setTimeout(() => setSearchHighlight(null), 3000);
        }
    };

    return (
        <div className='container'>
            <div className='nav'>
                <h2>Ratnakar's Weather App</h2>
            </div>

            <div className='table-container'>
                <div className='left-table'>
                    <button onClick={fetchWeather}>Get Weather</button>
                    <table>
                        <thead>
                            <tr><th>City</th></tr>
                        </thead>
                        <tbody>
                            {cityList.map((city, index) => (
                                <tr key={city} className={highlightedIndex.includes(index) ? "highlighted" : ""}>
                                    <td>{city}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='right-table'>
                    <div className='search'>
                        <input 
                            type="text" 
                            value={search} 
                            placeholder='Enter city' 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                        <button className='searchBtn' onClick={handleSearch}>Search</button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>City</th>
                                <th>Description</th>
                                <th>Temperature (℃)</th>
                                <th>Pressure (hPa)</th>
                                <th>Data Age (hrs)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="6" className="no-data">No Data</td></tr>
                            ) : (
                                data.map((d, index) => (
                                    <tr key={index} className={searchHighlight === index ? "search-highlight" : ""}>
                                        <td>{d.city}</td>
                                        <td>
                                            <input 
                                                type="text" 
                                                value={d.description} 
                                                onChange={(e) => handleDescriptionChange(index, e.target.value)} 
                                                className='desc-input'
                                            />
                                        </td>
                                        <td>{d.temperature}</td>
                                        <td>{d.pressure}</td>
                                        <td>{d.dataAge}</td>
                                        <td>
                                            <button className="deleteBtn" onClick={() => handleDelete(index)}>
                                                <MdDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Weather;
