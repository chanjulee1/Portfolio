import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import PostsAns from './PostsAns';
import Pagination from '../../Questions/Pagination';
import './myanswer.css';

export default function Profile() {

    const [filters, setFilters] = useState({ startDate: "", endDate: "", tags: "", status: "" });

    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const [answers, setAnswers] = useState([]);

    // for pagination in Answers in profile section.
    const [postPerPage] = useState(4);
    const [currentPage, setcurrentPage] = useState(1);

    const fetchAllFilteredAnswers = async () => {
        const response = await fetch(`http://localhost:8000/api/answer/fetchUserFilteredAnswers/${localStorage.getItem("username")}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startDate: filters.startDate, endDate: filters.endDate, tags: filters.tags , status:filters.status})

        }).then(response => {
            return response.json();
        }).then(data => setAnswers(data));
    };

    const [usedTags, setUsedTags] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8000/api/answer/givenAnswersTags/${localStorage.getItem("username")}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setUsedTags(data));
    }, []);

    

    useEffect(() => {
        fetchAllFilteredAnswers();
    }, [filters])

    // This function will find the No. of answers given by a User
    useEffect(() => {
        fetch(`http://localhost:8000/api/answer/fetchUserAnswers/${localStorage.getItem("username")}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(data => setAnswers(data));
    },[]);

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = answers.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNum => setcurrentPage(pageNum);

    return (
        <div className="container" Style="height:100vh;margin-top:13vh; z-index:1; background-color:white">
            <ProfileSidebar />
            <div className='header_and_content'>
                <ProfileHeader />

                <div className="questions">
                    <div className="question">
                        <PostsAns posts={currentPosts} />
                    </div>

                </div>
                <div className="container">

                    <Pagination postsPerPage={postPerPage} totalPosts={answers.length} paginate={paginate} />
                </div>

            </div>
        </div>
    )
}
