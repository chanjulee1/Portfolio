import React, { useEffect } from "react";
import { useState } from "react";
import  AdminSidebar  from './AdminSidebar';

export default function AdminHome() {
    const [user, setUser] = useState(0);

    const [questions, setQuestions] = useState([]);
    const [Tags, setTags] = useState([]);
    const [count, setCount] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8000/api/question/fetchquestions`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data));
    }, [])


    useEffect(() => {
        const freqOfTags = [];
        const tag = [];
        const cnt = [];

        questions.map(question => question.tags.split(" ").map(tag => {
            freqOfTags[tag] = 0;
        }))

        questions.map(question => question.tags.split(" ").map(tag => {
            freqOfTags[tag] = freqOfTags[tag] + 1;
        }))

        for (const i in freqOfTags) {
            tag.push(i);
            cnt.push(parseInt(freqOfTags[i]));
        }

        setTags(tag);
        setCount(cnt);

    }, [questions]);

    return (
        <div className='container' Style="background-color:#f8f9f9; height:100%; margin-top:20vh; z-index:1;">
            <AdminSidebar />
        <br/>
        </div>
    );
    }