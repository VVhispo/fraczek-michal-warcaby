var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
app.use(express.static('static')) // serwuje stronę index.html

app.use(express.json())

let loggedUsers = []

let awaitingMoves = []

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.post("/loginUser", function (req, res) {
    let response = {
        success: false,
        error: "",
        userid: "",
    }
    if (loggedUsers.includes(req.body.username)) response.error = "Username taken!"
    else if (req.body.username.length < 1) response.error = "You must have a name!"
    else if (loggedUsers.length == 2) response.error = "2/2 users playing!"
    else {
        response.success = true;
        loggedUsers.push(req.body.username)
        response.userid = (loggedUsers.length == 1) ? 1 : 2
    }
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(response))
})

app.post("/getPlayers", function (req, res) {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ users: loggedUsers }))
})

app.post("/resetUsers", function (req, res) {
    loggedUsers = []
    awaitingMoves = []
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({}))
})

app.post("/pawnMove", function (req, res) {
    awaitingMoves.push({
        pawnToMove: req.body.pawnToMove,
        whereToMove: req.body.whereToMove,
        for: (req.body.user == "white") ? "black" : 'white',
        out: false
    })
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({}))
})

app.post('/getMoves', function (req, res) {
    let movesforyou = awaitingMoves.filter(function (item) {
        if (item.for == req.body.user) return true
        return false;
    });
    if (movesforyou.length > 0) {
        res.setHeader("content-type", "application/json");
        awaitingMoves.splice(awaitingMoves.indexOf(movesforyou[0]), 1)
        res.end(JSON.stringify(movesforyou[0]))
    } else {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({}))
    }
})

app.post('/pawnOut', function (req, res) {
    awaitingMoves.push({
        pawnToMove: req.body.pawnToMove,
        for: (req.body.user == "white") ? "black" : 'white',
        out: true
    })
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({}))
})