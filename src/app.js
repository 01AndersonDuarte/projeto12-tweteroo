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

app.get("/tweets", (req, res) => {
    const { page } = req.query;
    const maxTweets = 10;

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
    // console.log(enviarTweets);
    return res.send(enviarTweets);

    // if (tweets.length === 0) {
    //     return res.send(tweetsInvertidos);
    // } else {
    //     tweetsInvertidos.filter((t, index) => {
    //         if (index >= posicaoInicial && index < posicaoFinal) {
    //             enviarTweets.push(
    //                 {
    //                     username: t.username,
    //                     avatar: usuarios.find(u => u.username === t.username).avatar,
    //                     tweet: t.tweet
    //                 });
    //         }
    //     });
    //     console.log(enviarTweets);
    //     return res.send(enviarTweets);
    // }
});
app.post("/tweets", (req, res) => {
    const { user } = req.headers;
    const { tweet } = req.body;

    if (user === undefined || tweet === undefined ||
        typeof (user) !== 'string' || typeof (tweet) !== 'string' ||
        user === "" || tweet === "") {

        return res.sendStatus(401);

    } else if (usuarios.find(u => u.username === user)) {
        tweets.push({ username: user, tweet: tweet });
        return res.status(201).send("OK");
    }
    res.sendStatus(401);
});

const PORT = 5000;
app.listen(PORT, () => console.log("Executando na porta 5000..."));