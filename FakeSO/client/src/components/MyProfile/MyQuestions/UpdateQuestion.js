import React, { useRef, useState, useEffect } from "react";
import parse from "html-react-parser";
import { useParams } from 'react-router-dom';


export default function UpdateQuestion(props) {
       
    const params = useParams();
    const [value, setValue] = useState("");
    const [state, setState] = useState(false);
    const [credentials, setCredentials] = useState({ title: "", tags: "" })
    const [question, setQuestion] = useState([]);

    const fetchQuestion= async(id)=>{
        // ... (fetchQuestion function remains the same)
    }

    const updateQue = async(e, id)=>{
        // ... (updateQue function remains the same)
    }

    const getValue = (value) => {
        setValue(value);
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    useEffect(()=>{
        fetchQuestion(params.type);
    }, [])

    return (
        <div>
            <div Style="background-color:#f8f9f9; height:100%; margin-top:10vh; z-index:1;">
                {(
                    () => {
                        if (state === true) {

                            return (<>
                                <div class="alert alert-success alert-dismissible" role="alert">
                                    Your Query is Updated <strong>Successfully</strong>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </>)

                        }
                    }
                )()}

                <div className="container mb-5" Style="width:70%; display:block; margin:auto;">
                    <div class="card mt-5" Style="background-color:hsl(206,100%,97%);">
                        <div class="card-header">
                            <h3><b>Update a Public Question</b></h3>
                        </div>
                        <div class="card-body">
                        </div>
                    </div>

                    <form onSubmit={(e)=>updateQue(e, question._id)} method='post'>
                        <div class="card mb-3 mt-5">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Title</label>
                                    <input type="text" class="form-control" name="title" onChange={onChange} value={credentials.title} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Title" />
                                    <small id="emailHelp" class="form-text text-muted">Enter Your title in few Words</small>
                                </div>
                            </div>
                        </div>

                        <textarea
                            value={question.question}
                            onChange={(e) => getValue(e.target.value)}
                            placeholder="Enter your question..."
                            rows={10}
                            cols={80}
                            name="question"
                        ></textarea>

                        <div class="card mt-3">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Question Tags</label>
                                    <input type="text" name="tags" onChange={onChange} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Tags" value={credentials.tags} />
                                    <small id="emailHelp" class="form-text text-muted">Enter Question Tags</small>
                                </div>
                            </div>
                        </div>

                        <button type='submit' className="btn btn-primary mt-5 mb-5">Update Question</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
