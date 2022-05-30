import express from "express";
import ws from "ws";
import { v4 as uuidv4 } from "uuid";
import { validateBattlemapCreateInfo } from "./validate/battlemap-create-info.mjs"




const app = express();

app.use("/session", express.json());

app.use(express.static('public'));

let activeSessions = new Map();

app.post("/session", (req, res) => {
    let sessionID = uuidv4();
    console.log(req.body);
    if (!validateBattlemapCreateInfo(req.body)) {
        res.statusCode = 400;
        res.end();
        return;
    }
    activeSessions.set(sessionID, {
        password: req.body.password,
        dmPassword: req.body.dmPassword,
        battlemap: {
            imagePalette: ["public/test1.png"],
            width: req.body.width,
            height: req.body.height,
            tileLayers: [
                {
                    layers: new Array(req.body.height).fill(0).map(e => {
                        return new Array(req.body.width).fill(0);
                    })
                }
            ],
            shapeLayers: [],
            tokens: []
        }
    });
    res.end(sessionID);
});

app.get("/session/:sessionID/battlemap", (req, res) => {
    let sessionID = req.params.sessionID;
    if (activeSessions.has(sessionID)) {
        res.statusCode = 200;
        res.end(JSON.stringify(activeSessions.get(sessionID).battlemap));
    } else {
        res.statusCode = 404;
        res.end("Not found!");
    }
})

app.listen(process.env.PORT || 3000);