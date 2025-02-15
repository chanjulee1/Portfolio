const express = require('express');
const Admin = require("../models/Admin");
const User = require("../models/User");
const router = express.Router();

const LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Question = require("../models/Question")
const Answer = require("../models/Answer")

const JWT_SECRET = 'Darshitisagoodboy';

router.post('/createuser', [
    body('username', 'Name Must have atleast 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {

    // If there are errors return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0]['msg'] });
    }

    try {
        let user = await Admin.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exist" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await Admin.create({
            username: req.body.username,
            email: req.body.email,
            password: secPass,

        })

        const data = {
            user: {
                id: user.id,
                username: user.username
            }
        }

        console.log(data);
        const authtaken = jwt.sign(data, JWT_SECRET);

        localStorage.setItem('token', authtaken);
        localStorage.setItem('username', req.body.username);
        res.json({ 'success': authtaken, 'username': req.body.username });
    }
    catch (err) {
        console.error(err.message);
        res.status(400).json({ error: "Internal server error" });
    }


})

router.post('/users',async (req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/questions',async(req,res)=>{
    try {
        const questions = await Question.find();
        res.json(questions);
    }
    catch(e){
         console.log(e.message);
         res.status(500).send("internel server error");
    }
})

router.post('/noOfUsers',async(req,res)=>{
    try {
        const users = await User.find();
        res.json(users.length);
    }
    catch(e){
         console.log(e.message);
         res.status(500).send("internel server error");
    }
})

router.post('/noOfQuestions',async(req,res)=>{
    try {
        const questions = await Question.find();
        res.json(questions.length);
    }
    catch(e){
         console.log(e.message);
         res.status(500).send("internel server error");
    }
}
)

router.post('/noOfAnswers',async(req,res)=>{
    try{
        const answer = await Answer.find();
        res.json(answer.length);

    }
    catch(e){
        console.log(e.message);
        res.status(500).send("internel server error");
    }
})
 
router.post('/noOfAccept',async(req,res)=>{
    try{
        const answer = await Answer.find({status:"Accepted"});
        res.json(answer.length);
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("internel server error");
    }
})

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        // Find and remove the user
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove all questions posted by the user
        await Question.deleteMany({ user: req.params.id });

        // Remove all answers posted by the user
        await Answer.deleteMany({ postedId: req.params.id });

        // Remove all comments posted by the user
        await Comment.deleteMany({ postedId: req.params.id });

        res.json({ status: "deleted" });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});


router.delete('/deleteQuestion/:id',async (req,res) => {
    try{
           await Question.findByIdAndRemove(req.params.id,async(err,data)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("deleted");

                        await Answer.deleteMany({questionid : req.params.id}, (err, data)=>{
                            if(err)
                            {
                                console.log(err);
                                console.log("Not deleted Answers");
                            }
                            else
                            {
                                console.log("All answers are deleted");
                            }
                        });
                    }
            });

            res.json({"status": "deleted"});
        }
        catch (e) {
            res.status(500).send("Internal Server Error");
        }
    }) 

    router.delete('/deleteanswer/:id',async (req,res) => {
        try{
                Answer.findByIdAndRemove(req.params.id,(err,data)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("deleted");
                        }
                });
                res.json({"status": "deleted"});
            }
            catch (e) {
                res.status(500).send("Internal Server Error");
            }
        })
        


router.get('/question-by-month',async(req,res)=>{
    try{
        const questions = await Question.aggregate([
            {
                $match: { date: { $exists: true } }
              },
            {
                
                $group: {
                    _id: { $month: "$date" },
                    count: { $sum: 1 }
                }
            }
       ]);
       res.json(questions);
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("internel server error");
    }
})  

router.get('/question-by-year',async(req,res)=>{
    try{
        const questions = await Question.aggregate([
            {
                $match: { date: { $exists: true } }
              },
            {
                
                $group: {
                    _id: { $year: "$date" },
                    count: { $sum: 1 }
                }
            }
       ]);
       res.json(questions);
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("internel server error");
    }
})



module.exports = router;