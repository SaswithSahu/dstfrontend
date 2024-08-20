import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    firstName: '',
    mode: '',
    examCenter: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const api = process.env.REACT_APP_API || 'http://184.72.181.95:8000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${api}/users`);
        
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (userId) => {
    const confirmation = window.confirm("Are you sure you want to delete this user?");
    
    if (confirmation) {
      try {
        await axios.delete(`${api}/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    } else {
      alert('User deletion canceled');
    }
  };
  const filteredUsers = users.filter((user) => {
    const firstNameMatch = user.first_name.toLowerCase().includes(filters.firstName.toLowerCase());
    const modeMatch = user.mode.toLowerCase().includes(filters.mode.toLowerCase());
   
    return firstNameMatch && modeMatch;
  });
  const usersToDisplay = [...filteredUsers];
  usersToDisplay.shift(1);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="user-table-container">
      <h1 className='dateds'>User Data</h1>

      <div className="filter">
        <input
          type="text"
          name="firstName"
          placeholder="Filter by First Name"
          value={filters.firstName}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="mode"
          placeholder="Filter by Mode"
          value={filters.mode}
          onChange={handleFilterChange}
        />

      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Phone Number</th>
            <th>College Name</th>
            <th>Mode</th>
            <th>Exam Center</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersToDisplay.map((user) => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.phone_number}</td>
              <td>{user.college_name}</td>
              <td>{user.mode}</td>
              <td>{user.exam_center}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
