const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionCommentSchema = new Schema({
    // Id of the Question
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        required: true
    },

    // Id Of User who has posted the comment
    postedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    // Username of the user who has posted the comment
    postedBy: {
        type: String,
        required: true
    },

    comment: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    votes: {
        type: Number,
        default: 0
    },

    voteUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
});

const QuestionComment = mongoose.model('questioncomment', QuestionCommentSchema);
QuestionComment.createIndexes();

module.exports = QuestionComment;