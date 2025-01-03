import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
import '../MyProfile/MyAnswers/postsAns.css';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

export default function Posts({ posts }) {

    const [vote, setVotes] = useState({});

    const deleteAnswer = async (id) => {
        const response = axios.delete(`http://localhost:8000/api/admin/deleteanswer/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            
            alert("Answer is deleted refresh the page to see the changes");
            return response.json()
        })
        const data = await response.json()
        if (data.status === 'success') {
            
        }
    }


    return (
        <>
            <ul>
                {posts.map(answer => (
                    <div className="all-questions">
                        <div className="all-questions-container">
                            <div className="all-questions-left">
                                <div className="all-options">
                                    <div className="all-option">
                                        <p>{vote[answer._id]}</p>
                                        <span>votes</span>
                                    </div>
                                    <div className="all-option">
                                        <p>0</p>
                                        <span>views</span>
                                    </div>
                                    <Button variant="outlined" startIcon={<DeleteIcon />}   onClick={() => deleteAnswer(answer._id)}>Delete</Button>

                                </div>
                            </div>

                            <div className="question-answer">
                                <NavLink to={{ pathname: `/question/${answer.questionid}` }} className="GotoQues"><h4>Go to Question</h4></NavLink>
                                <div style={{ width: "90%", }}>
                                    <p Style="font-size:25px;">{parse(answer.answer)}</p>
                                </div>
                                
                                <div className="author">
                                    <div className="author-details">
                                        <p>{answer.postedBy}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </ul>
        </>
    )
}
