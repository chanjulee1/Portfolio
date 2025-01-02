import React from 'react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';


var mydiv = {
  margin: '8% 8%',
};
export default function AdminUser() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:8000/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json()
    setUsers(data)
    setFilteredUsers(data)
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredData = users.filter((user) => {
      return user.username.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredUsers(filteredData);
  };


  const deleteUser = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this user?");
    
    if (shouldDelete) {
      try {
        await fetch(`http://localhost:8000/api/admin/deleteUser/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Remove the deleted user from the state
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
  
        try {
          await fetchUsers();
          window.location.reload();
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again later.');
      }
    }
  };
  

  return (
    <div className='container' Style="background-color:#f8f9f9; height:100%; margin-top:20vh; z-index:1;">
      <AdminSidebar />
      <div Style="display:block">
      <div class="input-group">
      <div class="form-outline">
        <input type="text" className='form-control' placeholder="Search From UserName" name="search" onChange={handleSearch} />
        </div>
        <button id="search-button" type="button" class="btn btn-primary">
    <i class="fa fa-search"></i>
  </button>
  </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th  style={{ width: '250px',textAlign:'center', height: '40px' }}scope="col" >User Name </th>
              <th style={{ width: '250px',textAlign:'center', height: '40px' }} scope="col">User Email</th>
              <th style={{ width: '250px',textAlign:'center', height: '40px' }} scope="col">Delete</th>
            </tr>
          </thead>
        </table>

        <div>
        {filteredUsers.length === 0 && (
          <div>
            <p>No users found.</p>
          </div>
        )}
          {filteredUsers.map((user, index) => {
            return (
              <div key={index}>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td style={{ width: '250px',textAlign:'center', height: '40px' }} >
                        <button className='btn btn-outline-primary' style={{ width: '150px', height: '40px' }}><NavLink to={{ pathname: `/UserProfileAnalysis/${user.username}`}}>{user.username}</NavLink></button>
                      </td>
                      <td  style={{ width: '250px',textAlign:'center', height: '40px' }}>{user.email}</td>
                      <td style={{ width: '250px',textAlign:'center', height: '40px' }}>
                        <Button  variant="outlined" startIcon={<DeleteIcon />}  aria-hidden="true" onClick={() => deleteUser(user._id)}>     delete</Button>
                      </td>
                     
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </div>
    </div>

  )
}
