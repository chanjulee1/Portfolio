const express = require('express');

const Tags = require("../models/Tags");
const fetchuser = require('../middleware/fetchuser');

const router = express.Router();

router.post("/addtag", fetchuser, async(req, res) => {
    const tagInstance = new Tags({
        tagname: req.body.tagname,
        desc: req.body.desc,
        createdBy: req.user.id  // Include the user ID in the createdBy field
    });
    
    try {
        const savedTag = await tagInstance.save({ maxTimeMS: 30000 }); // Increase the timeout to 30 seconds (adjust as needed)
        res.json({ success: "Added tags successfully", status: true });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/gettag", fetchuser, async(req, res) => {
    try {
        let tags = await Tags.find();
        res.json(tags);
    } catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
});

router.post("/tagdesc/:tagname", fetchuser, async(req, res) => {
    try {
        let tag = await Tags.findOne({ tagname: req.params.tagname });
        res.json(tag);
    } catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
});

router.post("/getuserstags", fetchuser, async (req, res) => {
    try {
        let userTags = await Tags.find({ createdBy: req.user.id });
        res.json(userTags);
    } catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
});

module.exports = router;
