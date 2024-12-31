import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import parse from "html-react-parser";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './content.css'
export default function Content(props) {

    const navigate = useNavigate();
    const editor = useRef(null);
    const params = useParams();
    const [value, setValue] = useState("");
    const [question, setQuestion] = useState([])
    const [html, setHtml] = useState("");
    const [state, setState] = useState(false);
    const [answers, setAnswer] = useState([]);
    const [vote, setVotes] = useState({});
    const [voteStatus, setVoteStatus] = useState({});
    const [loginstatus, setloginstatus] = useState(false);
    const [quevoteStatus, setqueVoteStatus] = useState({});
    const [queVote, setQueVote] = useState();
    const [commentSectionState, setCommentSectionState] = useState({});
    const [commentSectionVisibility, setCommentSectionVisibility] = useState({});
    const [startIndex, setStartIndex] = useState(0);
    const [commentPageIndexes, setCommentPageIndexes] = useState({});
    const commentsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(0);
    const [views, setViews] = useState(0);
    const [questionCommentInput, setQuestionCommentInput] = useState("");
    const [questionComments, setQuestionComments] = useState([]);
    const [currentQuestionComments, setCurrentQuestionComments] = useState([]);
    const [currentCommentPage, setCurrentCommentPage] = useState(0);
    const [commentVoteStatus, setCommentVoteStatus] = useState(0);
    const [questionCommentVisibility, setQuestionCommentVisibility] = useState(false);


    const toggleCommentSection = (ansId) => {
        setCommentSectionVisibility((prevState) => ({
            ...prevState,
            [ansId]: !prevState[ansId],
        }));
    };

    const userReputation = localStorage.getItem("Reputation");
    // to show the comment box
    const [show, setShow] = useState(false);

    // to add a new comment
    const [comment, setComment] = useState({});
    const [commentState, setCommentState] = useState(false);

    const config = useMemo(() => ({
        buttons: ["bold", "italic", "link", "unlink", "ul", "ol", "underline", "image", "font", "fontsize", "brush", "redo", "undo", "eraser", "table"],
    }), []);


    const isLoggedIn = () => {
        if (localStorage.getItem('username') !== null) {
            setloginstatus(true);
        }
    }
    
    const fetchQuestion = async (id) => {

        await fetch(`http://localhost:8000/api/question/fetchQueById/${id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then((data) => {
            setQuestion(data);
            setHtml(parse(data.question));
            setViews(data.views);
        })
    }

    const fetchAnswers = async (id) => {
        await fetch(`http://localhost:8000/api/answer/fetchanswer/${id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then((data) => {
            setAnswer(data);
        })
    }

    const getValue = (newvalue) => {
        setValue(newvalue);
    };


    const handleSubmit = async (e, id) => {

        e.preventDefault();
        if(localStorage.getItem("Reputation") >= 50){
        const response = await fetch(`http://localhost:8000/api/answer/addanswer/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ answer: value }),
        });

        const json = await response.json()


        if (json["status"] === true) {
            setState(true);
            setValue("");
            window.location.reload(true);
            window.scrollTo(0, 0)
        }

    }  else {
        alert("Not enough reputation");
    }
    }

    const upvoteQue = async (e, id) => {
        if (localStorage.getItem("username") !== null) {
            if(localStorage.getItem("Reputation") >= 50){
                e.preventDefault();
                document.getElementById("quedownvotbtn").disabled = false;
                document.getElementById("queupvotebtn").disabled = true;
        
                try {
                    const response = await fetch(`http://localhost:8000/api/question/upvote/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ answer: value }),
                    });
        
                    if (!response.ok) {
                        const jsonResponse = await response.json();
                        if (jsonResponse.status === "alreadyVoted") {
                            // Display a message to the user that they have already upvoted.
                            alert("You have already upvoted this question.");
                        } else {
                            const errorMessage = jsonResponse.error || 'Error upvoting question';
                            throw new Error(errorMessage);
                        }
                    }
        
                    let json = await response.json();
        
                    if (json.status === "upvoted") {
                        setqueVoteStatus(json);
                        window.location.reload(true);
                    }
                } catch (error) {
                    alert(error.message);
                }
            } else {
                alert("Not enough Reputation");
            }
        } else {
            navigate("/login");
        }
    }
    
    const downvoteQue = async (e, id) => {
        if (localStorage.getItem("username") !== null) {
            if(localStorage.getItem("Reputation") >= 50){
                e.preventDefault();
                document.getElementById("queupvotebtn").disabled = false;
        
                try {
                    const response = await fetch(`http://localhost:8000/api/question/downvote/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
        
                    if (!response.ok) {
                        const jsonResponse = await response.json();
                        if (jsonResponse.status === "alreadyVoted") {
                            // Display a message to the user that they have already downvoted.
                            alert("You have already downvoted this question.");
                        } else {
                            const errorMessage = jsonResponse.error || 'Error downvoting question';
                            throw new Error(errorMessage);
                        }
                    }
        
                    let json = await response.json();
        
                    if (json.status === "downvoted") {
                        setqueVoteStatus(json);
                        window.location.reload(true);
                    }
                } catch (error) {
                    alert(error.message);
                }
            } else {
                alert("User Doesnt have enough reputation");
            }
        } else {
            navigate("/login");
        }
    }

    const upvote = async (e, id) => {
        if (localStorage.getItem("username") !== null) {
            if(localStorage.getItem("Reputation") >= 50){
            e.preventDefault();
            document.getElementById("quedownvotbtn").disabled = false;
    
            try {
                const response = await fetch(`http://localhost:8000/api/answer/upvote/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!response.ok) {
                    const jsonResponse = await response.json();
                    const errorMessage = jsonResponse.error || 'Error upvoting answer';
                    throw new Error(errorMessage);
                }
    
                let json = await response.json();
                setVoteStatus(json);
                window.location.reload(true);
            } catch (error) {
                alert(error.message);
            }
        } else {
            alert("User Doesn't have enough reputation points");
        }
        } else {
            navigate("/login");
        }
    };
    
    const downvote = async (e, id) => {
        if (localStorage.getItem("username") !== null) {
            if(localStorage.getItem("Reputation") >= 50){
            e.preventDefault();
    
            try {
                const response = await fetch(`http://localhost:8000/api/answer/downvote/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!response.ok) {
                    const jsonResponse = await response.json();
                    const errorMessage = jsonResponse.error || 'Error downvoting answer';
                    throw new Error(errorMessage);
                }
    
                let json = await response.json();
                setVoteStatus(json);
                window.location.reload(true);
            } catch (error) {
                alert(error.message);
            }
        }else {
            alert("User doesn't have enough reputation");
        } 
    } else {
        navigate("/login");
    }
    
    };

    const fetchVotes = async () => {
        const response = await fetch(`http://localhost:8000/api/answer/fetchVotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let json = await response.json();

        setVotes(json);
    }

    const fetchQueVotes = async (id) => {
        const response = await fetch(`http://localhost:8000/api/question/fetchVotes/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let json = await response.json();

        setQueVote(json);
    }

    const handleNextCommentPage = (ansId) => {
        const updatedIndex = startIndex + commentsPerPage;
        setStartIndex(updatedIndex);
    };
    
    // Function to handle previous page of comments
    const handlePrevCommentPage = (ansId) => {
        const updatedIndex = Math.max(startIndex - commentsPerPage, 0);
        setStartIndex(updatedIndex);
    };

    const onChange = (e) => {
        setComment({ ...comment, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        const storedCommentState = localStorage.getItem('commentState');
        if (storedCommentState === 'true') {
            setCommentState(true);
        }
    }, []);

    const addComment = async (e, id) => {
        e.preventDefault();

        try {
            if (userReputation < 50) {
                alert('You need at least 50 reputations to add a comment.');
                return;
            }

            const response = await fetch(`http://localhost:8000/api/comment/addcomment/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: comment.comment, qid: question._id }),
            });

            if (!response.ok) {
                alert('Error adding comment. Please try again later.');
                return;
            }

            const json = await response.json();

            if (json.status === true) {
                setCommentState(true);
                localStorage.setItem('commentState', 'true');
                window.location.reload(true);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const closeAlert = () => {
        setCommentState(false);
        localStorage.removeItem('commentState');
    };

    const upVoteComment = async (e, id) => {
        e.preventDefault();
      
        try {
          const response = await fetch(`http://localhost:8000/api/comment/upvotecomment/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
      
          const data = await response.json();
      
          // Check if the response is successful
          if (response.ok) {
            console.log('Response:', data);
            window.location.reload(true);
          } else {
            // If response is not successful, pop up an alert with the error message
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          // If there's an exception, pop up an alert with the error message
          alert(`Error: ${error.message}`);
          console.error('Error:', error);
        }
      };


    const fetchComments = async (id) => {
        await fetch(`http://localhost:8000/api/comment/fetchComments`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ qid: question._id, ansid: id })
        }).then(response => response.json()).then(data => setComment(data))
    }

    const handleQuestionCommentChange = (value) => {
        setQuestionCommentInput(value);
    };
    
    const postQuestionComment = async (e) => {
        e.preventDefault();
        try {
            // Check if the user has enough reputation to add a comment
            if (!localStorage.getItem("username")) {
                alert('You need to login to post a comment');
                return;
            }
    
            console.log(questionCommentInput);
    
            // Make a request to add a comment for the question
            const response = await fetch(`http://localhost:8000/api/question-comment/add/${question._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentText: questionCommentInput, qid: question._id }),
            });
    
            // Log the entire response text
            const responseText = await response.text();
            alert(responseText);
    
            // Check if the request was successful
            if (!response.ok) {
                alert('Error adding comment. Please try again later.');
                return;
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    
    
    
    const fetchQuestionComments = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/question-comment/getcomments/${id}`, // Assuming `id` is the question ID
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (!response.ok) {
                console.error("Error fetching question comments.");
                return;
            }
    
            const data = await response.json();
            setQuestionComments(data);
        } catch (error) {
            console.error("Error fetching question comments:", error);
        }
    };

    const upVoteQuestionComment = async (e, id) => {
        e.preventDefault();
        console.log(localStorage);
        if(localStorage.getItem("username")){
            try {
                // You can implement your upvote logic here
                const response = await fetch(`http://localhost:8000/api/question-comment/upvote/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
        
                const data = await response.json();
        
                // Check if the response is successful
                if (response.ok) {
                    window.location.reload(true);
                } else {
                    alert('Already Voted');
                }
            } catch (error) {
                alert("Already Voted ", JSON.stringify(error));
            }
        } else {
            navigate('/login');
        }
    };

    const toggleQuestionCommentVisibility = () => {
        setQuestionCommentVisibility((prevVisibility) => !prevVisibility);
    };

    const handleNextQuestionCommentPage = () => {
        const updatedPage = currentCommentPage + 1;
        setCurrentCommentPage(updatedPage);
    };
    
    const handlePrevQuestionCommentPage = () => {
        const updatedPage = Math.max(currentCommentPage - 1, 0);
        setCurrentCommentPage(updatedPage);
    };
    
    useEffect(() => {
        isLoggedIn();
        fetchQuestion(params.type);
        fetchAnswers(params.type);
        fetchQuestionComments(params.type);
        fetchVotes();
        fetchQueVotes(params.type);
    }, []);

    useEffect(() => {
        const startIndex = currentCommentPage * commentsPerPage;
        const endIndex = startIndex + commentsPerPage;
        setCurrentQuestionComments(questionComments.slice(startIndex, endIndex));
    }, [currentCommentPage, questionComments]);

    return (
        <div className='content-page'>
        
        <div Style="height:100%; margin-top:13vh; z-index:1; background-color:white ">
            <div class="">


                <div className="stack-index">
                    <div className="stack-index-content" >
                    <Sidebar />

            {(
                () => {
                    if (state === true) {

                        return (<>
                            <div className="alert alert-success alert-dismissible" role="alert">
                                Your Answer is Posted <strong>Successfully</strong>
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </>)

                    }
                }
            )()}
            {(
                () => {
                    if (commentState === true) {

                        return (<>
                            <div className="alert alert-success alert-dismissible" role="alert">
                                Your Comment is Posted <strong>Successfully</strong>
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </>)

                    }
                }
            )()}
            <div className="container" Style="height:100vh;width:70%;display:block; margin:auto;">

                <div className="d-flex flex-row">
                    <div className="d-flex flex-column col-md-0 mt-0 mx-0">
                        <button className='btn btn-white' id="queupvotebtn" onClick={(e) => upvoteQue(e, question._id)} Style="width:15px; border:2px; color: red;">👍</button>
                        <div className='mx-3'>{queVote}</div>
                        <button className='btn btn-white' id="quedownvotbtn" onClick={(e) => downvoteQue(e, question._id)} Style="width:15px; border:none;"> 👎</button>
                    </div>
                    <div className="d-flex flex-column flex-shrink-0 col-md-9 mx-0">
                        <h1>{question.title}</h1>
                        <div className='mt-5'>{html}</div>
                        <small className='d-flex flex-row-reverse'>
                            Posted By: {question.postedBy} | Date: {new Date(question.date).toLocaleString()}
                        </small>

                        {currentQuestionComments.length > 0 ? (
                            <div>
                                <h4>Comments ({questionComments.length})</h4>
                                {currentQuestionComments.slice(startIndex, startIndex + commentsPerPage).map(comment => (
                                <div key={comment._id} className="d-flex flex-row mt-0 mx-0 align-items-center">
                                    <div>
                                        <div className='mx-3'>{comment.votes}</div>
                                        <button
                                            className='btn btn-white'
                                            id={`commentupvotebtn${comment._id}`}
                                            onClick={(e) => upVoteQuestionComment(e, comment._id)}
                                            style={{ width: '15px', border: '2px', color: 'red' }}
                                            disabled={commentVoteStatus[comment._id]}
                                        >
                                            👍
                                        </button>
                                    </div>
                                    <div className="comment-box">
                                        <p>{comment.comment}</p>
                                        <small>Posted By: {comment.postedBy}</small>
                                    </div>
                                </div>
                            ))}
                                <div>
                                    <button onClick={handlePrevQuestionCommentPage} disabled={currentCommentPage === 0}>
                                        Prev
                                    </button>
                                    <span>Page {currentCommentPage + 1}</span>
                                    <button
                                        onClick={handleNextQuestionCommentPage}
                                        disabled={currentCommentPage === Math.ceil(questionComments.length / commentsPerPage) - 1}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p>No comments to show.</p>
                        )}
                        {questionCommentVisibility && (
                        <div className="title mt-3">
                            <form method="POST" onSubmit={(e) => postQuestionComment(e)}>
                            <div className="d-flex flex-row align-items-center">
                                <textarea
                                className="form-control mr-2"
                                placeholder="Type your comment here..."
                                value={questionCommentInput}
                                onChange={(e) => handleQuestionCommentChange(e.target.value)}
                                ></textarea>
                                <button type="submit" className="btn btn-primary">
                                Post Comment
                                </button>
                            </div>
                            </form>
                        </div>
                        )}

                        {/* Button to toggle question comment section visibility */}
                        <button onClick={toggleQuestionCommentVisibility} className='btn btn-link mt-2'>
                        {questionCommentVisibility ? 'Hide Comments' : 'Add a Comment'}
                        </button>
                    </div>
                </div>
                <hr Style={{
                    background: "black",
                    height: "2px",
                    border: "none",
                }}
                /><hr />

                    
                <h4>{answers.length} Answers</h4>
                <p>Views: {views}</p>
                {answers.length > 0 && (
                    <div className='mt-5'>
                        {answers.slice(currentPage * 5, (currentPage + 1) * 5).map((ans) => (
                            <div className="">

                                <div className="d-flex flex-row">
                                    <div className="d-flex flex-column col-md-0 mt-0 mx-0">
                                        <button className='btn btn-white' id={"ansupvotebtn" + ans._id} onClick={(e) => upvote(e, ans._id)} Style="width:15px; border:none;">👍</button>
                                        <div className='mx-3'>{vote[ans._id]}</div>
                                        <button className='btn btn-white' id = {"ansdownvotebtn" + ans._id} onClick={(e) => downvote(e, ans._id)} Style="width:15px; border:none;">👎</button>
                                        {(
                                            () => {
                                                if (ans.status === "Accepted") {
                                                    return (<><button className='btn btn-white'><i className="fa fa-check" Style="font-size:25px;color:lightgreen;"></i></button></>)
                                                }
                                            }
                                        )()}
                                    </div>
                                    <div className="d-flex flex-column flex-shrink-0 col-md-9 mx-0">
                                        <p>{parse(ans.answer)}</p>

                                        <small className='d-flex flex-row-reverse'>Posted By : {ans.postedBy}</small>

                                        

                                        <div className="comments" Style="display:relative; bottom:0px;">
                                            <div className="comment">
                                                <div className="comments" style={{ display: 'relative', bottom: '0px' }}>
                                                {ans.comments.length > 0 && (
                                                    <div className="comment">
                                                        {ans.comments.slice(startIndex, startIndex + commentsPerPage).map(comment => (
                                                        <div key={comment._id} className="d-flex flex-row mt-0 mx-0 align-items-center">
                                                            <div>
                                                                <div className='mx-3'>{comment.votes}</div>
                                                                <button className='btn btn-white' id="commentupvotebtn" onClick={(e) => upVoteComment(e, comment._id)} style={{ width: '15px', border: '2px', color: 'red' }}>👍</button>
                                                            </div>
                                                            <div className="comment-box">
                                                            <p>{comment.comment}</p>
                                                            <small>Posted By: {comment.postedBy}</small>
                                                            </div>
                                                        </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {ans.comments.length > commentsPerPage && (
                                                    <div>
                                                        <button onClick={() => handlePrevCommentPage(ans._id)} disabled={startIndex === 0}>
                                                            Prev
                                                        </button>
                                                        <button
                                                            onClick={() => handleNextCommentPage(ans._id)}
                                                            disabled={startIndex + commentsPerPage >= ans.comments.length}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                            <p onClick={() => toggleCommentSection(ans._id)}>
                                Add a comment
                            </p>
                                        {commentSectionVisibility[ans._id] && (
                                <div className="title">
                                    <form method="POST" onSubmit={(e) => addComment(e, ans._id)}>
                                        <textarea
                                            type="text"
                                            placeholder="Add Your comment.."
                                            rows={5}
                                            cols={100}
                                            name="comment"
                                            onChange={onChange}
                                        ></textarea>
                                        <br />
                                        <button type="submit" className='btn btn-primary'>
                                            Add comment
                                        </button>
                                    </form>
                                </div>
                            )}
                                        </div>


                                    </div>
                                </div>

                                <hr Style={{
                                    background: "#959595",
                                    height: "2px",
                                    border: "none",
                                }}
                                /><hr />

                            </div>
                        ))}
                        <div>
                    <button onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))} disabled={currentPage === 0}>
                        Prev
                    </button>
                    <span>Page {currentPage + 1}</span>
                    <button
                        onClick={() =>
                            setCurrentPage((prevPage) =>
                                Math.min(prevPage + 1, Math.ceil(answers.length / 5) - 1)
                            )
                        }
                        disabled={currentPage === Math.ceil(answers.length / 5) - 1}
                    >
                        Next
                    </button>
                </div>
                    </div>
                )}

                <h4>Your Answer</h4>
                <form onSubmit={(e) => handleSubmit(e, question._id)} method='POST'>
                <textarea
                    placeholder="Your answer..."
                    rows={10}
                    cols={80}
                    name="answer"
                    onChange={(e) => getValue(e.target.value)}
                    value={value}
                ></textarea>


                    {
                        loginstatus === true ? (<button type='submit' className="btn btn-primary mt-5 mb-3">Post Your Answer</button>) : <></>
                    }

                </form>
            </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}