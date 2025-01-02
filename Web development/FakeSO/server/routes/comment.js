const express = require('express');

const fetchuser = require('../middleware/fetchuser');
const Comment = require("../models/Comment");
const { route } = require('./questions');

const router = express.Router();

// To add a new Comment of a perticular answer of a question.
router.post('/addcomment/:id',fetchuser, async (req, res) => {
    try {

        let comment = await Comment.create({
            questionid: req.body.qid,
            answerid: req.params.id,
            postedId: req.user.id,
            postedBy: req.user.username,
            comment: req.body.comment
        })

        res.json({ "Success": "Added Commnet Successfully", "status": true })
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})

// To fetch all comments related to perticular answer of any question

router.post("/fetchComments", async(req, res)=>{
    try{

        let comments = await Comment.find({questionid : req.body.qid, answerid:req.body.ansid});

        res.json(comments);
    }
    catch(e)
    {
        console.log(e.message);
        res.status(400).send("Internal server error");
    }
})

router.post('/upvotecomment/:id', fetchuser, async (req, res) => {
    try {
      const commentId = req.params.id;
      const userId = req.user.id;
  
      // Check if the user has already voted for this comment
      const existingVote = await Comment.findOne({
        _id: commentId,
        voteUsers: userId,
      });
  
      if (existingVote) {
        return res.status(400).json({ message: 'You have already upvoted this comment' });
      }
  
      // Update the comment with the new vote
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $inc: { votes: 1 }, // Increment the vote count
          $push: { voteUsers: userId }, // Add the user to the list of voteUsers
        },
        { new: true }
      );
  
      res.json(updatedComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = router