import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

export default function Tags() {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState({
        tagname: '',
        desc: ''
    });
    const userReputation = localStorage.getItem("Reputation");


    const fetchTags = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/tag/gettag", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const tags = await response.json();
            setTags(tags);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const addTag = async () => {
        try {
            if (userReputation < 50) {
                alert('You need at least 50 reputations to create a new tag.');
                return;
            }

            const response = await fetch("http://localhost:8000/api/tag/addtag", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTag)
            });

            if (response.ok) {
                // Tag added successfully, reset input fields
                setNewTag({ tagname: '', desc: '' });

                // Refresh the tags list
                fetchTags();
            } else {
                const errorData = await response.json();
                console.error('Error adding tag:', errorData.error);
            }
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return (
        <div style={{ height: '100%', marginTop: '13vh', zIndex: 1, backgroundColor: 'white' }}>
            <div className="">
                <div className="stack-index">
                    <div className="stack-index-content" >
                        <Sidebar />
                        <div className="main">
                            <h1>Tags</h1>
                            <div className='mt-3'>
                                A tag is a keyword or label that categorizes your question with other, similar questions.
                                Using the right tags makes it easier for others to find and answer your question.
                            </div>

                            {/* Add Tag Form */}
                            <div className="mt-3">
                                <h2>Add Tag</h2>
                                <form>
                                    <label htmlFor="tagname">Tag Name:</label>
                                    <input
                                        type="text"
                                        id="tagname"
                                        name="tagname"
                                        value={newTag.tagname}
                                        onChange={(e) => setNewTag({ ...newTag, tagname: e.target.value })}
                                        required
                                    />

                                    <label htmlFor="desc">Description:</label>
                                    <input
                                        type="text"
                                        id="desc"
                                        name="desc"
                                        value={newTag.desc}
                                        onChange={(e) => setNewTag({ ...newTag, desc: e.target.value })}
                                        required
                                    />

                                    <button type="button" onClick={addTag}>Add Tag</button>
                                </form>
                            </div>

                            {/* Display Tags */}
                            <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
                                {tags.length > 0 && tags.map((tag) => (
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
            </div>
        </div>
    );
}
