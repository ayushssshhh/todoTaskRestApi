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

mongoose.connect(process.env.MONGODB_URI , { useUnifiedTopology: true, useNewUrlParser: true })
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
                    res.send({result : 'fail'})
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
                    res.send({result : "fail"});
                } else {
                    console.log("Post Successful");
                    res.send({result : "success"});
                }
            })

    })

    app.route('/task/:user/:task')
        .get((req , res)=>{
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
                    res.send({result : "fail"});
                } else {
                    console.log("Post Successful");
                    res.send({result : "success"});
                }
            })
        })

    .delete((req, res) => {
        const user = req.params.user
        Task.deleteMany({ username: user })
            .then((result) => {
                res.send({result : "success"});
            })
    })

app.route("/task/alter/:id")
    .delete((req, res) => {
        const taskId = req.params.id
        Task.deleteOne({id : taskId })
            .then((result , err) => {
                if(err){
                    res.send({result : err})
                } else{
                    res.send({result : result});
                }
            })
    })

app.route("/task/alter/:id/:user")
    .put((req, res) => {
        const user = req.params.user
        const userId = req.params.id
        Task.replaceOne(
            { id: userId},
            {
                username: user,
                task: req.body.task
            },
            { overwrite: true }
        ).then((result, err) => {
            if (!err) {
                res.send({result : "success"});
            }

            else {
                res.send({result : "error"});
            }
        })
    })

app.listen(process.env.PORT || 3000, () => {
    console.log("server started on 3000");
})