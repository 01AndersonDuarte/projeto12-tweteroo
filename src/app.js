import express from "express";
import cors from "cors";

const app = express();

app.use(cors())
app.use(express.json())

const usuarios = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (
        username === undefined || avatar === undefined ||
        typeof (username) !== 'string' || typeof (avatar) !== 'string' ||
        username === "" || avatar === ""
    ) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }
    usuarios.push({ username, avatar });
    res.status(201).send("OK");
});

app.get("/tweets/:USERNAME", (req, res)=>{
    const usuario = req.params.USERNAME;
    const enviarTweets = [];

    tweets.filter(t => {
        if (t.username===usuario) {
            enviarTweets.push(
                {
                    username: t.username,
                    avatar: usuarios.find(u => u.username === t.username).avatar,
                    tweet: t.tweet
                });
        }
    });
    res.send(enviarTweets);
});
app.get("/tweets", (req, res) => {
    let { page } = req.query;
    const maxTweets = 10;

    if (page === undefined) {
        page = 1;
    } else if (page < 1) {
        return res.status(400).send("Informe uma página válida!");
    }

    const posicaoFinal = page * maxTweets;
    const posicaoInicial = 10 * (page - 1);

    const tweetsInvertidos = tweets.map(t => t);
    const enviarTweets = [];
    tweetsInvertidos.reverse();

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

});
app.post("/tweets", (req, res) => {
    const { user } = req.headers;
    const { tweet } = req.body;

    if (user === undefined || tweet === undefined ||
        typeof (user) !== 'string' || typeof (tweet) !== 'string' ||
        user === "" || tweet === "") {

        return res.sendStatus(400);

    } else if (usuarios.find(u => u.username === user)) {
        tweets.push({ username: user, tweet: tweet });
        return res.status(201).send("OK");
    }
    res.sendStatus(401);
});

const PORT = 5000;
app.listen(PORT, () => console.log("Executando na porta 5000..."));