import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import "./MyTags.css";

export default function MyTags() {
    const [userTags, setUserTags] = useState([]);

    useEffect(() => {
        const fetchUserTags = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/tag/getuserstags", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const tags = await response.json();
                    setUserTags(tags);
                } else {
                    console.error('Error fetching user tags:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user tags:', error);
            }
        };

        fetchUserTags();
    }, []);

    return (
        <div className="container" style={{ height: '100vh', marginTop: '13vh', zIndex: 1, backgroundColor: 'white' }}>
            <ProfileSidebar />
            <div className='header_and_content' style={{ width: '100%' }}>
                <ProfileHeader />
                <div className="main">
                    <h2>Your Tags</h2>
                    <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
                        {userTags.length > 0 && userTags.map((tag) => (
                            <div className="col" key={tag._id}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <NavLink
                                            className="card-title p-1"
                                            to={{ pathname: `/questionOntags/${tag.tagname}` }}
                                            style={{ color: 'hsl(205,47%,42%)', backgroundColor: 'hsl(205,46%,92%)', borderRadius: '5px', display: 'inline' }}
                                        >
                                            {tag.tagname}
                                        </NavLink>
                                        <p className="card-text m-2">{tag.desc.slice(0, 100)}...</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
