const express = require('express');
const answer = require('../models/Answer');

const fetchuser = require('../middleware/fetchuser');
const Answer = require("../models/Answer");
const { route } = require('./questions');
const User = require("../models/User");
const Comment = require("../models/Comment.js");
const LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
const userUtils = require('../utils/userUtils'); 
const Question = require("../models/Question");
const router = express.Router();
const mongoose = require('mongoose')

router.post('/addanswer/:id', fetchuser, async (req, res) => {
    try {
        let newanswer = await Answer.create({
            questionid: req.params.id,
            answer: req.body.answer,
            postedId: req.user.id,
            postedBy: req.user.username,
            votes: 0
        })

        res.json({ "Success": "Added Answer Successfully", "status": true })
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/fetchanswer", async (req, res) => {
    try {
        const answers = await Answer.find();
        res.json(answers);
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/fetchanswer/:id", async (req, res) => {
    try {
        const answers = await Answer.find({ questionid: req.params.id });
        
        const answersWithComments = await Promise.all(answers.map(async (answer) => {
            const comments = await Comment.find({ answerid: answer._id });
            return { ...answer.toObject(), comments };
        }));

        res.json(answersWithComments);
    } catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
});

router.post("/userAnstoUpdate/:id", async (req, res)=>{
    try{
        const answer = await Answer.findOne({_id: req.params.id});
        res.json(answer);
    }
    catch(e)
    {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/updateans/:id", async (req, res)=>{
    try{
        const answer = await Answer.findByIdAndUpdate(req.params.id, {$set: {answer: req.body.answer}});

        res.json({status: "updated"});
    }
    catch(e)
    {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post('/fetchUserAnswers', async (req, res) => {
    try {

        const answers = await Answer.find();
        

        if (!answers) {
            return res.status(404).send("Question not Found");
        }

        res.json(answers);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/fetchUserAnswers/:username', async (req, res) => {
    try {

        const answers = await Answer.find({ postedBy: req.params.username });

        if (!answers) {
            return res.status(404).send("Question not Found");
        }

        res.json(answers);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

// This is for filtering answeres based on Date,tag and status
router.post('/fetchUserFilteredAnswers/:username', async (req, res) => {
    try {

        const answers = await Answer.find({ postedBy: req.params.username });

        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const tags = req.body.tags;
        const status = req.body.status;

        if (!answers) {
            return res.status(404).send("Answers not Found");
        }

        const afterDateapplied = [];
        answers.map(ans => {
            const year = ans.date.getUTCFullYear();
            var month = ans.date.getUTCMonth() + 1;
            var day = ans.date.getUTCDate();

            if (month >= '0' && month <= '9') month = "0" + month;
            if (day >= '0' && day <= '9') day = "0" + day;

            const date = year + "-" + month + "-" + day;

            if (date >= startDate && date <= endDate) {
                afterDateapplied.push(ans);
            }
        })

        const afterTagsapplied = [];
        var tagAppiled = false;
        if (tags) {
            for (i in afterDateapplied) {
                const que = await Question.find({ _id: afterDateapplied[i].questionid });
                if (que[0].tags.split(" ").includes(tags)) {
                    afterTagsapplied.push(afterDateapplied[i]);
                }
            }
            tagAppiled = true;
        }

        const afterStatusApplied = [];
        var statusAppiled = false;
        if (status) {
            if (tagAppiled) {
                afterTagsapplied.map(ans => {
                    if (ans.status === status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            else {
                afterDateapplied.map(ans => {
                    if (ans.status = status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            statusAppiled = true;
        }

        if (statusAppiled)
            res.json(afterStatusApplied);
        else if (tagAppiled)
            res.json(afterTagsapplied);
        else {
            res.json(afterDateapplied);
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/fetchAllFilteredAnswers', async (req, res) => {
    try {

        const answers = await Answer.find();

        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const tags = req.body.tags;
        const status = req.body.status;

        if (!answers) {
            return res.status(404).send("Answers not Found");
        }

        const afterDateapplied = [];
        answers.map(ans => {
            const year = ans.date.getUTCFullYear();
            var month = ans.date.getUTCMonth() + 1;
            var day = ans.date.getUTCDate();

            if (month >= '0' && month <= '9') month = "0" + month;
            if (day >= '0' && day <= '9') day = "0" + day;

            const date = year + "-" + month + "-" + day;

            if (date >= startDate && date <= endDate) {
                afterDateapplied.push(ans);
            }
        })

        const afterTagsapplied = [];
        var tagAppiled = false;
        if (tags) {
            for (i in afterDateapplied) {
                const que = await Question.find({ _id: afterDateapplied[i].questionid });
                if (que[0].tags.split(" ").includes(tags)) {
                    afterTagsapplied.push(afterDateapplied[i]);
                }
            }
            tagAppiled = true;
        }

        const afterStatusApplied = [];
        var statusAppiled = false;
        if (status) {
            if (tagAppiled) {
                afterTagsapplied.map(ans => {
                    if (ans.status === status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            else {
                afterDateapplied.map(ans => {
                    if (ans.status = status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            statusAppiled = true;
        }

        if (statusAppiled)
            res.json(afterStatusApplied);
        else if (tagAppiled)
            res.json(afterTagsapplied);
        else {
            res.json(afterDateapplied);
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/givenAllAnswersTags", async (req, res) => {
    try {
        const answers = await Answer.find();

        const questions = [];

        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }
        const tags = [];

        questions.map(que => {
            que[0].tags.split(" ").map(tag => {
                if (tags.indexOf(tag) == -1) tags.push(tag);
            })
        })

        res.json(tags);
    }
    catch (e) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})


router.post("/givenAnswersTags/:username", async (req, res) => {
    try {
        const answers = await Answer.find({ postedBy: req.params.username });

        const questions = [];

        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }
        const tags = [];

        questions.map(que => {
            que[0].tags.split(" ").map(tag => {
                if (tags.indexOf(tag) == -1) tags.push(tag);
            })
        })

        res.json(tags);
    }
    catch (e) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})


router.post('/fetchUserAnsweredQuestions/:username', async (req, res) => {
    try {

        const answers = await Answer.find({ postedBy: req.params.username });

        const questions = [];

        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }

        if (!questions) {
            return res.status(404).send("Question not Found");
        }

        res.json(questions);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})


router.post('/fetchUserAcceptedAnsweredQuestions/:username', async (req, res) => {
    try {

        const answers = await Answer.find({ $and: [{ postedBy: req.params.username }, { status: "Accepted" }] });

        const questions = [];

        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }

        if (!questions) {
            return res.status(404).send("Question not Found");
        }

        res.json(questions);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/findNumberOfAns", async (req, res) => {
    try {
        const answers = await Answer.find();

        let obj = {};

        answers.map(answer => {

            if (obj[answer.questionid] == null) {
                obj[answer.questionid] = 1;
            }
            else {
                obj[answer.questionid] += 1;
            }

        })

        res.json(obj);
    }
    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/upvote/:id", fetchuser, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({ "error": "Answer not found", "status": false });
        }
        
        if(req.user.reputationPoints < 50) {
            return res.status(400).json({ "error": "User has less than 50 reputation", "status": false });
        }
        const hasVoted = answer.voteUsers.includes(req.user.id);
        if (hasVoted) {
            return res.status(400).json({ "error": "User has already voted", "status": false });
        }

        // Update answer votes and votedUsers
        const updatedAnswer = await Answer.findByIdAndUpdate(
            req.params.id,
            {
                $inc: { "votes": 1 },
                $push: { "voteUsers": req.user.id }
            },
            { new: true }
        );

        console.log(answer.questionid);

        // Assuming you have the userId available in req.user.id
        const userId = answer.postedId;
        const reputationPoints = 10; // Adjust the points accordingly

        // Update user reputation using the utility function
        await userUtils.updateUserReputation(userId, reputationPoints);

        res.json({ "status": "upvoted" });
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

router.post("/fetchVotes", async (req, res) => {
    const allAnswers = await Answer.find();
    const obj = {};

    allAnswers.map(ans => {
        obj[ans._id] = ans.votes;
    })
    res.json(obj);
})

router.post("/downvote/:id", fetchuser, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({ "error": "Answer not found", "status": false });
        }

        // Check if the user has already downvoted
        const hasDownvoted = answer.voteUsers.includes(req.user.id);
        if (hasDownvoted) {
            return res.status(400).json({ "error": "User has already voted", "status": false });
        }

        const vote = answer.votes - 1;

        // Update answer votes and votedUsers
        const updatedAnswer = await Answer.findByIdAndUpdate(
            req.params.id,
            {
                $set: { "votes": vote },
                $push: { "voteUsers": req.user.id }
            },
            { new: true }
        );

        const userId = answer.postedId;
        await userUtils.updateUserReputationdown(userId);

        res.json({ "status": "downvoted" });
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/acceptanswer/:id", async (req, res) => {
    try {
        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { $set: { "status": "Accepted" } });
        res.json({ "status": "Accepted" });
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server error");
    }
})

router.post("/points", async (req, res) => {
    try {
        let username = localStorage.getItem("username");

        let answers = await Answer.find({ $and: [{ "postedBy": username }, { "status": "Accepted" }] });

        res.json({ "points": answers.length * 5 });
    }
    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})


router.post("/deleteans/:id", async(req, res)=>{
    try{
        await Answer.deleteOne({_id : req.params.id});

        res.json({"status":"deleted"})
    }
    catch(e)
    {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

module.exports = router