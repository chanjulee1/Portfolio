const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('fake Stack Overflow');
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/question", require("./routes/questions"));
app.use("/api/answer", require("./routes/answers"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/tag", require("./routes/tags"));
app.use("/api/question-comment", require("./routes/questioncomments"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

connectToMongo().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}).catch(error => {
    console.error("Error connecting to MongoDB:", error.message);
});
