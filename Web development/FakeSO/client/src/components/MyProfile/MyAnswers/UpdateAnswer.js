import React, { useRef, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

export default function UpdateAnswer() {
  const params = useParams();
  const [answer, setAnswer] = useState([]);
  const [value, setValue] = useState("");
  const [state, setState] = useState(false);

  const fetchAnswer = async (id) => {
    const response = await fetch(`http://localhost:8000/api/answer/userAnstoUpdate/${id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      return response.json();
    }).then((data) => {
      setAnswer(data);
    })
  }

  const updateAns = async (e, id) => {
    e.preventDefault();

    let response = await fetch(`http://localhost:8000/api/answer/updateans/${id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer: value })
    })

    let json = await response.json();

    console.log(json);

    if (json.status === "updated") {
      setState(true);
      window.scrollTo(0, 0)
    }
  }

  const getValue = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    fetchAnswer(params.type);
  }, [])

  return (
    <div Style="background-color:#f8f9f9; height:100%; margin-top:11vh; z-index:1;">
      {state && (
        <div class="alert alert-success alert-dismissible" role="alert">
          Your Answer is Updated <strong>Successfully</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      <div className="container mb-5" Style="width:70%; display:block; margin:auto;">
        <div class="card mt-5" Style="background-color:hsl(206,100%,97%);">
          <div class="card-header">
            <h3><b>Update Your Answer</b></h3>
          </div>
          <div class="card-body">
            <h5 class="card-title">Writing a Good Answer</h5>
            <p class="card-text">Write your answer in such a way that others can easily understand and satisfy with your content</p>
          </div>
        </div>

        <form method='post' className="mt-3" onSubmit={(e) => updateAns(e, answer._id)}>
          <textarea
            value={value}
            onChange={getValue}
            rows={10} // Adjust the number of rows as needed
            className="form-control"
            placeholder="Type your answer here..."
          />

          <button type='submit' className="btn btn-primary mt-5 mb-5">Submit</button>
        </form>
      </div>
    </div>
  )
}
