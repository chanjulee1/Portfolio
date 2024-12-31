import React from 'react';
import '../MyProfile/ProfileSidebar/profileSidebar.css';
import { NavLink } from 'react-router-dom'

export default function AdminSidebar() {
    return (
        <div className='profile_sidebar'>
            <div className="sidebar-container">
                <div className="sidebar-options">
                    <div className="sidebar-option">
                        <NavLink className="sideLink" to="/adminuser">User</NavLink>
                    </div>
                    <div className="sidebar-option">
                        <NavLink className="sideLink" to="/Adminquestions">Questions</NavLink>
                    </div>
                    <div className="sidebar-option">
                        <NavLink  className="sideLink" to="/Adminanswer">answer</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
