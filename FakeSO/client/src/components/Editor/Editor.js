import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

export default function Editor(props) {
    const [value, setValue] = useState("");
    const [html, setHtml] = useState("");
    const [state, setState] = useState(false);
    const [failed, setFailed] = useState(false);
    const [credentials, setCredentials] = useState({ title: "", tags: "" })
    const navigate = useNavigate();

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleTextareaChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= 140) {
            setValue(inputValue);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/question/addquestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ title: credentials.title, question: value, tags: credentials.tags }),
        });

        const json = await response.json()
        console.log(json);

        if (json["status"] === true) {
            setState(true);
            window.scrollTo(0, 0)
            navigate("/questions");
        } else {
            setFailed(true);
        }
        setHtml(parse(json.message));
    }
    console.log(html);

    return (

        <div Style="background-color:#f8f9f9; height:100%; margin-top:10vh; z-index:1;">
            {(
                () => {
                    if (state === true) {

                        return (<>
                            <div class="alert alert-success alert-dismissible" role="alert">
                            <strong>Question Added Successfully</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </>)

                    }
                }
            )()}

            <div className="container mb-5" Style="width:70%; display:block; margin:auto;">
                <div class="card mt-5" Style="background-color:hsl(206,100%,97%);">
                    <div class="card-header">
                        <h3><b>Ask a Question</b></h3>
                    </div>
                    <div class="card-body">
                        <h5>Steps</h5>
                        <ul>
                            <li>Enter the question title (max. 50 characters).</li>
                            <li>Enter the question summary (max. 140 characters).</li>
                            <li>Enter tag names. Tag names are separated by whitespace. A new tag name can only be created by a user with at least 50 reputation points.</li>
                            <li>A button to create a new question</li>
                        </ul>
                    </div>
                </div>

                <form onSubmit={handleSubmit} method='post'>

                    <div class="card mb-3 mt-5">
                        <div class="card-body">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Title</label>
                                <input type="text" class="form-control" name="title" onChange={onChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Title" />
                                <small id="emailHelp" class="form-text text-muted">Enter Your title in few Words</small>
                            </div>

                        </div>
                    </div>

                    <textarea
                        value={value}
                        onChange={handleTextareaChange}
                        className="form-control mt-3"
                        placeholder={`Enter your question (max 140 characters)`}
                        rows="5"
                        required
                    />

                    <div class="card mt-3">
                        <div class="card-body">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Question Tags</label>
                                <input type="text" name="tags" onChange={onChange} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Tags" />
                                <small id="emailHelp" class="form-text text-muted">Enter Question Tags</small>
                            </div>
                        </div>
                    </div>

                    <button type='submit' className="btn btn-primary mt-5 mb-5">Ask Question</button>
                </form>
            </div>

            {failed && <div class="alert alert-danger red" role="alert">
                <strong>You donot have the reputation to add new tags</strong>
            </div>}
        </div>
    )
}
