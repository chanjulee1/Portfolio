const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
    // Id of Question
    questionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question'
    },
    // Answer posted By user
    answer: {
        type: String,
        required: true
    },
    // Id Of User who has posted answer for a particular question
    postedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    // Username of user who has posted Answer for a particular question
    postedBy: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Not Accepted"
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    voteUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
});

const Answer = mongoose.model('answer', AnswerSchema);
Answer.createIndexes();
module.exports = Answer;
