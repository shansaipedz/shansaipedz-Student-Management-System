import React, { useState } from 'react';
import './App.css'; 

// Function to calculate age from birthdate
const calculateAge = (birthdate) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Helper function to validate the date format (YYYY/MM/DD)
const isValidDate = (dateString) => {
  // Regular expression to check if the date is in the correct format
  const regex = /^\d{4}\/\d{2}\/\d{2}$/;

  // Check if the string matches the format YYYY/MM/DD
  if (!regex.test(dateString)) {
    return false;
  }

  // Check if the date is a valid calendar date
  const [year, month, day] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const DataTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    course: 'IT',
    birthdate: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate birthdate before proceeding
    if (!isValidDate(form.birthdate)) {
      alert("Please enter a valid birthdate in the format YYYY/MM/DD.");
      return;
    }

    if (form.lastName && form.firstName && form.course && form.birthdate) {
      const newData = [...data, form];
      setData(newData);
      setFilteredData(newData);
      setForm({ lastName: '', firstName: '', course: 'IT', birthdate: '' });
    }
  };

  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const birthdate = new Date(item.birthdate);

      // Parse and extract year, month, and day from the birthdate
      const birthYear = birthdate.getFullYear();
      const birthMonth = birthdate.getMonth() + 1; // 0-based, so we add 1
      const birthDay = birthdate.getDate();

      let minDateMatches = true;
      let maxDateMatches = true;

      // Handle partial input for Min Birthdate
      if (minDate) {
        const [minYear, minMonth, minDay] = minDate.split('-').map(Number); // Convert to numbers
        if (minYear && birthYear < minYear) minDateMatches = false;
        if (minYear && birthYear === minYear && minMonth && birthMonth < minMonth) minDateMatches = false;
        if (minYear && birthYear === minYear && minMonth && birthMonth === minMonth && minDay && birthDay < minDay) minDateMatches = false;
      }

      // Handle partial input for Max Birthdate
      if (maxDate) {
        const [maxYear, maxMonth, maxDay] = maxDate.split('-').map(Number); // Convert to numbers
        if (maxYear && birthYear > maxYear) maxDateMatches = false;
        if (maxYear && birthYear === maxYear && maxMonth && birthMonth > maxMonth) maxDateMatches = false;
        if (maxYear && birthYear === maxYear && maxMonth === birthMonth && maxDay && birthDay > maxDay) maxDateMatches = false;
      }

      // Apply search term filter (for Last Name, First Name, Course, or Age)
      const matchesSearch = 
        (item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calculateAge(item.birthdate).toString().includes(searchTerm));

      return minDateMatches && maxDateMatches && matchesSearch;
    });

    setFilteredData(filtered); 
  };

  const clearFilter = () => {
    setSearchTerm(''); // Clear search term
    setMinDate('');    // Clear min date
    setMaxDate('');    // Clear max date
    setFilteredData(data); // Reset to original data
  };

  return (
    <div className="table-container">

      {/* Form to add new entries */}
      <form onSubmit={handleSubmit} className="form-container">
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Course:</label>
          <select name="course" value={form.course} onChange={handleChange}>
            <option value="IT">IT</option>
            <option value="IS">IS</option>
            <option value="CS">CS</option>
            <option value="DS">DS</option>
          </select>
        </div>
        <div>
          <label>Birthdate (YYYY/MM/DD):</label>
          <input 
            type="text" 
            name="birthdate" 
            value={form.birthdate} 
            onChange={handleChange} 
            placeholder="YYYY/MM/DD"
            required 
          />
        </div>
        <button type="submit">Add Student</button>
      </form>

      {/* Search and Filter Section */}
      <div className="filter-container">
        <input type="text" placeholder="Search by Last Name, First Name, Course, or Age" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <div>
          <label>Min Birthdate: </label>
          <input type="text" value={minDate} onChange={(e) => setMinDate(e.target.value)} placeholder="YYYY or YYYY-MM or YYYY-MM-DD" />
          <br />
          <label>Max Birthdate: </label>
          <input type="text" value={maxDate} onChange={(e) => setMaxDate(e.target.value)} placeholder="YYYY or YYYY-MM or YYYY-MM-DD" />
        </div>
        <button onClick={handleFilter}>Filter</button>
        <button onClick={clearFilter}>Clear Filter</button>
      </div>

      {/* Data Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Course</th>
            <th>Birthdate</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.lastName}</td>
                <td>{item.firstName}</td>
                <td>{item.course}</td>
                <td>{item.birthdate}</td>
                <td>{calculateAge(item.birthdate)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
