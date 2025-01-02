const express = require('express');
const Question = require("../models/Question");
const User = require("../models/User");
const Answer = require("../models/Answer");
const Tags = require("../models/Tags.js");

const ApiFeatures = require("../utils/init");
const fetchuser = require('../middleware/fetchuser');
const mongoose = require('mongoose')

const router = express.Router();

// Finding Tags helper function

const fetchExistingTagsFromDB = async () => {
    try {
        const tags = await Tags.find();
        console.log(tags);
        return tags.map(tag => tag.tagname);
    } catch (error) {
        console.error("Error fetching tags from DB:", error.message);
        return [];
    }
};

router.post('/addquestion', fetchuser, async (req, res) => {
    try {
        const { title, question, tags } = req.body;

        // Check if the tags are valid (existing or added by a user with enough reputation)
        const existingTags = await fetchExistingTagsFromDB();
        const newTags = tags.split(' ').filter(tag => !existingTags.includes(tag));
        const foundUser = await User.findOne({ username: req.user.username });
        console.log(foundUser.reputation);
        console.log(req.data);
        if (newTags.length > 0 && foundUser.reputation < 50) {
            console.log('here');
            return res.json({ status: false, message: 'Not enough reputation to add new tags.' });
        }
        else {
            console.log('here');
            let newQuestionData = {
                user: req.user.id,
                title: title,
                question: question,
                tags: tags,
                postedBy: req.user.username,
                votes: 0
            };
            console.log(newTags.length);
            if (newTags.length > 0) {
                newQuestionData.tags = tags;
                
                for (const newTag of newTags) {
                    await Tags.create({ tagname: newTag, desc: "New Tag", createdBy: req.user.id });
                }
            }

            let newQuestion = await Question.create(newQuestionData);

        res.json({ status: true, message: 'Added Query Successfully' });
    }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: false, message: 'Internal Server Error' });
    }
});

router.post('/fetchquestions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions.reverse());
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal server error");
    }
})

router.post('/fetchQueByHigherVotes', async (req, res) => {
    try {
        const questions = await Question.find({}).sort({ votes: -1 });
        res.json(questions);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal server error");
    }
})

router.post('/fetchquebyactive', async (req, res) => {
    try {
        // Fetch questions and sort based on the latest answer time
        const questions = await Question.aggregate([
            {
                $lookup: {
                    from: 'answers', // the name of the answers collection
                    localField: '_id',
                    foreignField: 'questionid',
                    as: 'answers'
                }
            },
            {
                $addFields: {
                    latestAnswerTime: {
                        $max: '$answers.date'
                    }
                }
            },
            {
                $sort: { latestAnswerTime: -1 }
            }
        ]);

        res.json(questions);
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Internal server error');
    }
});

router.post('/fetchQueById/:id', async (req, res) => {
    try {
        let question = await Question.findOne({ _id: req.params.id });

        if (!question) {
            return res.status(404).send("Question not Found");
        }

        // Increment the views field by 1
        question.views = (question.views || 0) + 1;

        // Fetch the associated user based on the userId in the question
        const user = await User.findOne({ _id: question.userId });

        // Add the username to the response
        question.username = user ? user.username : null;

        // Save the updated question
        await question.save();

        res.json(question);
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/updateque/:id', async(req, res)=>{
    try{

        const {title, question, tags} = req.body;
        const newquestion = {};

        newquestion.title = title;
        newquestion.question = question;
        newquestion.tags = tags;
        let fetchquestion = await Question.findByIdAndUpdate(req.params.id, {$set : newquestion}, {new : true});

        res.json({status:"updated"});
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/deleteque/:id', async(req, res)=>{
    try{

        let deletequestion = await Question.findByIdAndDelete(req.params.id);
        await Answer.deleteMany({questionid : req.params.id});
        res.json({status:"deleted"});
        
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

//finding questions of uses.
router.post('/fetchUserQuestions/:username', async (req, res) => {
    try {
        let user = await User.findOne({ username: req.params.username });

        const questions = await Question.find({ user: user._id });

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


//for finding filtered questions of specific user
router.post('/fetchUserFilteredQuestions/:username', async (req, res) => {
    try {
        let user = await User.findOne({ username: req.params.username });

        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const tags = req.body.tags;

        const questions = await Question.find({
            user: user._id
        });

        if (!questions) {
            return res.status(404).send("Question not Found");
        }

        const afterDateapplied = [];
        questions.map(que => {
            const year = que.date.getUTCFullYear();
            var month = que.date.getUTCMonth()+1;
            var day  = que.date.getUTCDate();
            
            if(month>='0' && month<='9') month = "0"+month;
            if(day>='0' && day<='9') day = "0"+day;
            
            const date = year+"-"+month+"-"+day;

            if (date >= startDate && date <= endDate) {
                afterDateapplied.push(que);
            }
        })

        const afterTagsapplied = [];
        if(tags){
        afterDateapplied.map(que => {
             if(que.tags.split(" ").includes(tags)){
                 afterTagsapplied.push(que);
             }
        })
        res.json(afterTagsapplied);
    }
    else {

        res.json(afterDateapplied);}
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

//for finding filtered questions
router.post('/fetchUserFilteredQuestions', async (req, res) => {
    try {
        let user = await User.find();

        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const tags = req.body.tags;

        const questions = await Question.find();

        if (!questions) {
            return res.status(404).send("Question not Found");
        }

        const afterDateapplied = [];
        questions.map(que => {
            const year = que.date.getUTCFullYear();
            var month = que.date.getUTCMonth()+1;
            var day  = que.date.getUTCDate();
            
            if(month>='0' && month<='9') month = "0"+month;
            if(day>='0' && day<='9') day = "0"+day;
            
            const date = year+"-"+month+"-"+day;

            if (date >= startDate && date <= endDate) {
                afterDateapplied.push(que);
            }
        })

        const afterTagsapplied = [];
        if(tags){
        afterDateapplied.map(que => {
             if(que.tags.split(" ").includes(tags)){
                 afterTagsapplied.push(que);
             }
        })
        res.json(afterTagsapplied);
    }
    else {

        res.json(afterDateapplied);}
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})



//for getting all tags used by all.

router.post("/usedtags", async(req, res)=>{
    try{
        
        let user = await User.find();
        const questions = await Question.find();

        const tags = [];

        questions.map(que => {
            que.tags.split(" ").map(tag => {
                if (tags.indexOf(tag)==-1) tags.push(tag);
            })
        })

        res.json(tags);
    }
    catch(e)
    {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})

//for getting all tags used by user.

router.post("/usedtags/:username", async(req, res)=>{
    try{
        
        let user = await User.findOne({ username: req.params.username });
        const questions = await Question.find({
            user: user._id
        });

        const tags = [];

        questions.map(que => {
            que.tags.split(" ").map(tag => {
                if (tags.indexOf(tag)==-1) tags.push(tag);
            })
        })

        res.json(tags);
    }
    catch(e)
    {
        res.status(400).send("Internal Server Error");
    }
})

router.post("/upvote/:id", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const question = await Question.findById(req.params.id);

        // Check if the user has already upvoted
        if (question.voteUsers.includes(userId) || req.user.reputation < 50) {
            return res.status(400).json({ "status": "alreadyUpvoted", "message": "User has already upvoted this question." });
        }

        const vote = question.votes + 1;

        // Add userId to voteUsers
        question.voteUsers.push(userId);

        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, {
            $set: { "votes": vote, "voteUsers": question.voteUsers },
        });

        res.json({ "status": "upvoted" });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/downvote/:id", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const question = await Question.findById(req.params.id);

        // Check if the user has already downvoted
        if (question.voteUsers.includes(userId)) {
            return res.status(400).json({ "status": "alreadyDownvoted", "message": "User has already downvoted this question." });
        }

        const vote = question.votes - 1;

        // Add userId to voteUsers
        question.voteUsers.push(userId);

        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, {
            $set: { "votes": vote, "voteUsers": question.voteUsers },
        });

        res.json({ "status": "downvoted" });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/fetchVotes/:id", async (req, res) => {
    const question = await Question.findById(req.params.id);

    if(question)
    {
        res.json(question.votes);
    }
    
})

router.post("/fetchallVotes", async (req, res) => {
    const allQuestion = await Question.find();
    const obj = {};

    allQuestion.map(que => {
        obj[que._id] = que.votes;
    })
    res.json(obj);
})

// fetch all the questions on a perticulat tag
router.post("/fetchQuePertag/:name", async (req, res) => {

    const questions = await Question.find();
    const questionsPertag = [];

    questions.map(que => {
        que.tags.split(" ").map(tag => {
            if (tag.toLowerCase() === req.params.name) {
                questionsPertag.push(que);
            }
        })
    })
    res.json(questionsPertag);
})


router.post("/answeredQue", async (req, res) => {

    const answers = await Answer.find();
    const questions = await Question.find();

    let ansobj = {};


    answers.map(ans => {
        if (ansobj[ans.questionid] == null) {
            ansobj[ans.questionid] = 1;
        }
    })
    const answeredQuestion = [];

    questions.map(que => {
        if (ansobj[que._id] === 1) {
            answeredQuestion.push(que);
        }
    })

    res.json(answeredQuestion);
})

router.post("/unansweredQue", async (req, res) => {
    const answers = await Answer.find();
    const questions = await Question.find();

    let ansobj = {};


    answers.map(ans => {
        if (ansobj[ans.questionid] == null) {
            ansobj[ans.questionid] = 1;
        }
    })
    const unansweredQuestion = [];

    questions.map(que => {
        if (ansobj[que._id] == null) {
            unansweredQuestion.push(que);
        }
    })

    res.json(unansweredQuestion);
})

// search questions
router.post("/search", async (req, res) => {

    try {
        let questions = await Question.find({"title": {$regex : req.query.keyword, $options: "i"}});

        if(questions.length === 0)
        {
            questions = await Question.find({"tags": {$regex : req.query.keyword, $options: "i"}});
        }
        res.json(questions);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router