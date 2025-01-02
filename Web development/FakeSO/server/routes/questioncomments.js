const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const QuestionComment = require('../models/QuestionCommnet');
const fetchuser = require('../middleware/fetchuser');

router.use(fetchuser);

// Get All Question Comments
router.get('/getcomments/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;

        if (!questionId) {
            return res.status(400).json({ error: 'Missing questionId in the request parameters' });
        }

        const questionComments = await QuestionComment.find({ questionId });
        res.json(questionComments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Upvote and Downvote
router.post('/upvote/:id', fetchuser, async (req, res) => {
    try {
        const comment = await QuestionComment.findById(req.params.id);

        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        // Check if the user has already voted
        if (comment.voteUsers.includes(req.user.id)) {
            return res.status(400).send('You have already voted on this comment');
        }

        // Your upvote logic here, for example:
        comment.votes += 1;
        comment.voteUsers.push(req.user.id);

        // Save the updated comment
        await comment.save();

        res.send('Upvoted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Add Comment
router.post('/add/:id', fetchuser, async (req, res) => {
    console.log('here');
    console.log(req.body);
    try {
        const {  commentText } = req.body;
        const questionId = req.params.id;
        // Create a new comment
        const newComment = new QuestionComment({
            questionId,
            postedUserId: req.user.id,
            postedBy: req.user.username,
            comment: commentText,
        });

        // Save the new comment
        await newComment.save();

        res.send('Comment added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
