import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import _ from "lodash";
import path from "path";
import moment from "moment";
import database from "sqlite-async";

// Emulate __dirname
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database setup + functions
const db = await database.open("share.db");

await db.exec(`
    CREATE TABLE IF NOT EXISTS files
    (
        id       INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        filename TEXT                              NOT NULL,
        password TEXT                              NOT NULL,
        archived BOOLEAN                           NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tokens
    (
        id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        filerecord INTEGER                           NOT NULL,
        token      TEXT                              NOT NULL,
        expires    INTEGER                           NOT NULL,
        isvoid     BOOLEAN                           NOT NULL DEFAULT 0
    );
`);

function newFile(filename, password) {
    return db.run("INSERT INTO files (filename, password) VALUES (?, ?)", [filename, password]);
}

// newShareFile("external-content.duckduckgo.com.jpg_1637264633341.jpg", "password");


// Misc functions
function makeID(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

// Express setup
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({limit: "100mb"}));
app.use(express.json());
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));
app.use(morgan("dev"));

app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Routes
app.get('/share/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post("/share/upload", async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        } else {
            for (let file in req.files) {
                file = req.files[file];
                // We want to name the file 'file.ext_timestamp.ext' so if we want to cut off the file extension we can just cut the timestamp and extra extension off
                // Aka, split by _ and take the first part
                const newFileName = _.replace(_.toLower(file.name), / /g, '_') + '_' + Date.now() + path.extname(file.name);

                const outputDirectory = process.env.UPLOAD_DIR || path.join(__dirname, 'public/uploads/');

                const filePath = path.join(outputDirectory, newFileName);
                let result = await file.mv(filePath);
            }

            return res.json({
                message: "success"
            });

        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

app.get("/share/download/:token", async (req, res) => {
    const token = req.params.token;

    let tokenResult = await db.get(`
        SELECT *
        FROM tokens
        WHERE token = '${token}'
    `);

    if (!tokenResult) {
        return res.sendFile(path.join(__dirname, 'public/404.html'));
    }

    let fileResult = await db.get(`
        SELECT *
        FROM files
        WHERE id = ${tokenResult.filerecord}
          AND archived = 0
    `);

    if (!fileResult) {
        return res.sendFile(path.join(__dirname, 'public/404.html'));
    }

    const expires = moment.unix(tokenResult.expires);
    const now = moment();

    // Set the token to void (one time use)
    await db.run(`
        UPDATE tokens
        SET isvoid = 1
        WHERE id = ${tokenResult.id}
    `);

    if (now.isAfter(expires) || tokenResult.isvoid) {
        // Redirect to the unlock page
        return res.send(`<script>window.location.href = "/share/view/${fileResult.filename}";</script>`);
    }
    res.header('Content-Disposition', 'filename="' + fileResult.filename + '"');
    return res.sendFile(path.join(__dirname, 'uploads/' + fileResult.filename));

});

app.get('/share/view/:filename', async (req, res) => {
    // Check if the file has a password
    const filename = req.params.filename;
    let fileResult = await db.get(`
        SELECT *
        FROM files
        WHERE filename = '${filename}'
          AND archived = 0
    `);

    if (fileResult) {
        if (['', null, undefined].includes(fileResult.password)) {
            const token = makeID(32);
            const expires = moment().add(5, 'seconds').unix();

            await db.run(`
                INSERT INTO tokens (token, filerecord, expires)
                VALUES ('${token}', ${fileResult.id}, ${expires})
            `);

            return res.send(`<script>window.location.href = "/share/download/${token}";</script>`);
        }
    }

    console.log(fileResult);

    res.sendFile(path.join(__dirname, 'public/view.html'));
});

app.post("/share/unlock/:filename", async (req, res) => {
    const password = req.body.password;
    const filename = req.params.filename;

    let fileResult = await db.get(`
        SELECT *
        FROM files
        WHERE filename = '${filename}'
          AND password = '${password}'
          AND archived = 0
    `);

    if (!fileResult) {
        return res.status(404).send("File not found");
    }

    const fileRecordId = fileResult.id;
    const token = makeID(32);
    const expires = moment().add(5, 'seconds').unix();

    await db.run(`
        INSERT INTO tokens (token, filerecord, expires)
        VALUES ('${token}', ${fileRecordId}, ${expires})
    `);

    return res.json({token: token});

});


// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});