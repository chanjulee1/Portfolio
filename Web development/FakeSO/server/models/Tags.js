const mongoose = require('mongoose');
const { Schema } = mongoose;

const TagSchema = new Schema({
    tagname: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

const Tag = mongoose.model('tag', TagSchema);
Tag.createIndexes();
module.exports = Tag;
