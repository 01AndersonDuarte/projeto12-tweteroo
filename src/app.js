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
    const { page } = req.query;
    const maxTweets = 10;

    const posicaoFinal = page * maxTweets;
    const posicaoInicial = 10 * (page - 1);

    const tweetsInvertidos = tweets.map(t => t);
    const enviarTweets = [];
    tweetsInvertidos.reverse();

    if (tweets.length === 0) {
        return res.send(tweetsInvertidos);
    } else {
        tweetsInvertidos.filter((t, index) => {
            if (index >= posicaoInicial && index < posicaoFinal) {
                enviarTweets.push(
                    {
                        username: t.username,
                        avatar: usuarios.find(u => u.username === t.username).avatar,
                        tweet: t.tweet
                    });
            }
        });
        return res.send(enviarTweets);
    }
});
app.post("/tweets", (req, res) => {
    const { user } = req.headers;
    const { tweet } = req.body;

    if (usuarios.find(u => u.username === user)) {
        tweets.push({ username: user, tweet: tweet });
        return res.status(201).send("OK");
    }
    res.sendStatus(401);
});

const PORT = 5000;
app.listen(PORT, () => console.log("Executando na porta 5000..."));