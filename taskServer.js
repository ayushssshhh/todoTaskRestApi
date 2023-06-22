//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const { object } = require("webidl-conversions");
const bodyParser = require("body-parser");
const port = 5000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ToDoApp', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log("Connected to db");
    })

const taskSchema = {
    username: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true,
    }
};

const Task = mongoose.model("Task", taskSchema);


app.route('/task/:user')
    .get((req, res) => {
        const user = req.params.user
        Task.find({ username: user })
            .then((result) => {
                if (result) {
                    res.send(result)
                } else {
                    res.send("no result found")
                }
            })
    })

    .post((req, res) => {
        const user = req.params.user
        let newTaks = new Task({
            username: user,
            task: req.body.task
        })

        newTaks.save()
            .then((result, err) => {
                if (err) {
                    console.log("----------Error---------\n" + err);
                    res.send("----------Error---------\n" + err);
                } else {
                    console.log("Post Successful");
                    res.send("Post Successful");
                }
            })

    })

    .delete((req, res) => {
        const user = req.params.user
        Task.deleteMany({ username: user })
            .then((result) => {
                res.send("deleted successfully");
            })
    })

app.route("/task/:user/:work")
    .delete((req, res) => {
        const user = req.params.user
        const work = req.params.work
        Task.deleteOne({ username: user, task: work })
            .then((result) => {
                res.send("deleted successfully");
            })
    })

    .put((req, res) => {
        const user = req.params.user
        const work = req.params.work
        Task.replaceOne(
            { username: user, task: work },
            {
                username: user,
                task: req.body.task
            },
            { overwrite: true }
        ).then((result, err) => {
            if (!err) {
                res.send("updated successfuly");
            }

            else {
                res.send("error");
            }
        })
    })

app.listen(process.env.PORT || 3000, () => {
    console.log("server started on 3000");
})