const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/fake_so";

const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.mongoURI || mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo;
