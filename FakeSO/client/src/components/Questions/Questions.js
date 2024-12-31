import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './questions.css';
import '../Header/header.css';
import Posts from './Posts';
import Pagination from './Pagination';

export default function Questions() {

    const [questions, setQuestions] = useState([])
    const [usernameExists, setUsernameExists] = useState(false);

    // for pagination
    const [postPerPage] = useState(5);
    const [currentPage, setcurrentPage] = useState(1);

    const fetchAllQuestions = async () => {
        await fetch("http://localhost:8000/api/question/fetchquestions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))
    }

    // Function to sort questions by higher votes question displays first
    const sortByActivity = async () => {
        await fetch("http://localhost:8000/api/question/fetchquebyactive", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))
    }

    // Function to filter all the questions which are answered.

    const answeredQuestions = async()=>{
        await fetch("http://localhost:8000/api/question/answeredQue", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))
    }

    const unansweredQuestions = async() => {
        await fetch("http://localhost:8000/api/question/unansweredQue", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))
    }

    useEffect(() => {
        fetchAllQuestions();
        const storedUsername = localStorage.getItem('username');
        setUsernameExists(!!storedUsername);

    }, []);

    // logic to find index of posts to display questions
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = questions.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNum => setcurrentPage(pageNum);

    return (
        <>
            <div Style="height:100%; margin-top:13vh; z-index:1; background-color:white">
                <div class="">


                    <div className="stack-index">
                        <div className="stack-index-content" >
                            <Sidebar />


                            <div className="main">
                                <div className="main-container">
                                    <div className="main-top">
                                        <h2>All Questions</h2>
                                        {usernameExists && <NavLink to="/editor"><button>Ask Question</button></NavLink>}
                                    </div>

                                    <div className='main-desc'>
                                        <p>{questions.length} Questions</p>
                                        <div className="main-filter">
                                            <div className="main-tabs">
                                                <div className="main-tab">
                                                    <NavLink className="tab" onClick={answeredQuestions}>Newest</NavLink>
                                                </div>
                                                <div className="main-tab">
                                                    <NavLink onClick={sortByActivity}>Active</NavLink>
                                                </div>
                                                <div className="main-tab">
                                                    <NavLink onClick={unansweredQuestions}>Unanswered</NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* This displays all questions */}
                                    <div className="questions">
                                        <div className="question">
                                            <Posts posts={currentPosts} />
                                        </div>

                                    </div>
                                    <div className="container">

                                        <Pagination postsPerPage={postPerPage} totalPosts={questions.length} currentPage={currentPage} paginate={paginate} />
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </>

    )
}
