import express from "express";
import cors from "cors";

const app = express();

app.use(cors())
app.use(express.json())

const usuarios = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;
    usuarios.push({ username, avatar });
    res.send("OK");
});

app.get("/tweets", (req, res) => {
    res.send(tweets.map((t)=> ({avatar: usuarios.find(u=>u.username===t.username).avatar, username: t.username, tweet: t.tweet})))
});
app.post("/tweets", (req, res) => {
    const { user } = req.headers;
    const { tweet } = req.body;

    console.log(user);
    console.log("BOLL: " + usuarios.find(u => u.username === user));
    if (usuarios.find(u => u.username === user)) {
        tweets.push({username: user, tweet: tweet});
        return res.status(201).send("OK");
    }
    res.sendStatus(401);
});

const PORT = 5000;
app.listen(PORT, () => console.log("Executando na porta 5000..."));