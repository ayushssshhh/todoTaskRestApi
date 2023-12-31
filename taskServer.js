//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const { object } = require("webidl-conversions");
const bodyParser = require("body-parser");
const port = 5000;
const cors = require("cors");
require("dotenv").config();




const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// 'mongodb://127.0.0.1:27017/ToDoApp'

mongoose.connect(process.env.MONGODB_URI)
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
                    res.send({ result: 'fail' })
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
                    res.send({ result: "fail" });
                } else {
                    console.log("Post Successful");
                    res.send({ result: "success" });
                }
            })

    })

app.route('/task/:user/:task')
    .get((req, res) => {
        const user = req.params.user
        const work = req.params.task
        let newTaks = new Task({
            username: user,
            task: work
        })

        newTaks.save()
            .then((result, err) => {
                if (err) {
                    console.log("----------Error---------\n" + err);
                    res.send({ result: "fail" });
                } else {
                    console.log("Post Successful");
                    res.send({ result: "success" });
                }
            })
    })

// .delete((req, res) => {
//     const user = req.params.user
//     Task.deleteMany({ username: user })
//         .then((result) => {
//             res.send({result : "success"});
//         })
// })

app.route("/delete/:user/:work")
    .get((req, res) => {
        const user = req.params.user
        const work = req.params.work
        Task.deleteOne({ username: user, task: work })
            .then((result) => {
                res.send({ result: "success" });
            })
    })

app.route("/alter/:user/:work/:newTask")
    .put((req, res) => {
        const user = req.params.user
        const work = req.params.work
        Task.replaceOne(
            { username: user, task: work },
            {
                username: user,
                task: req.params.newTask
            },
            { overwrite: true }
        ).then((result, err) => {
            if (!err) {
                res.send({ result: "success" });
            }

            else {
                res.send({ result: "error" });
            }
        })
    })

app.listen(process.env.PORT || 3000, () => {
    console.log("server started on 3000");
})