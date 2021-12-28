import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import _ from "lodash";
import path from "path";
import moment from "moment";
import database from "sqlite-async";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import sanitizeHtml from 'sanitize-html';

if (process.env.NODE_ENV === "development") {
    dotenv.config();
}


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
        alias    TEXT,
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

// Misc functions
function makeID(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

// Express setup
const app = express();

// Middleware
// app.use(cors());
app.use(bodyParser.json({limit: "100mb"}));
app.use(express.json());
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));
app.use(morgan("dev"));

// set up rate limiter: maximum of five requests per minute (additional on top of nginx rate limiter)
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    standardHeaders: true,
    legacyHeaders: true,
    message: "Too many requests from this IP, please try again later."
});


app.use("/share/*", limiter);

app.use(fileUpload({
    createParentPath: true, limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size
    }, abortOnLimit: true, useTempFiles: true, tempFileDir: '/tmp/'
}));

// Routes
app.get('/share/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post("/share/upload", async (req, res) => {
    let files = [];
    let totalSize = 0;
    try {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        } else {
            for (let file in req.files) {
                file = req.files[file];
                // We want to name the file 'file.ext_timestamp.ext' so if we want to cut off the file extension we can just cut the timestamp and extra extension off
                // Aka, split by _ and take the first part
                const newFileName = _.replace(_.toLower(sanitizeHtml(file.name, {
                    allowedTags: [],
                    allowedAttributes: {}
                })), / /g, '_') + '_' + Date.now() + path.extname(file.name);

                const outputDirectory = process.env.UPLOAD_DIR || path.join(__dirname, 'public/uploads/');

                const filePath = path.join(outputDirectory, newFileName);
                let result = await file.mv(filePath);

                // Add the file to the payload, so we can send an email
                files.push({
                    name: file.name, size: `${humanFileSize(file.size, true, 2)}`
                });
                totalSize += file.size;
            }

            // Send an email with the file info
            // Convert the files object into an HTML table
            let table = '<table><thead><tr><th>File</th><th>Size</th></tr></thead><tbody>';
            for (let file of files) {
                table += `<tr>
                            <td>${sanitizeHtml(file.name, {
                    allowedTags: [],
                    allowedAttributes: {}
                })}</td>
                            <td>${file.size}</td>
                          </tr>`;
            }
            table += '</tbody></table>';

            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            const msg = {
                to: process.env.MAIL_TO,
                from: process.env.MAIL_FROM,
                subject: `New file${files.length > 1 ? 's' : ''} uploaded`,
                html: `
                        <head>
                        <style type="text/css">
                                table  {border-collapse:collapse;border-spacing:0;}
    table td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
  table th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal; background-color: #8d8d8d; color: #fff;}
table *{border-color:inherit;text-align:left;vertical-align:top}
                        </style>
                        </head>
                        <h1>New file${files.length > 1 ? 's' : ''} uploaded!</h1>
                        <span>${files.length} new file${files.length > 1 ? 's have' : ' has'} been uploaded by ${ip}:</span><br /><br />
                        Total size: ${humanFileSize(totalSize, true, 2)}<br />
                        ${table}`
            };

            sgMail.send(msg)
                .catch(err => {
                    console.error(err);
                });

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
    return res.sendFile(path.join(process.env.DOWNLOAD_DIR || path.join(__dirname, 'public/downloads/'), fileResult.filename));

});

app.get('/share/view/:filenameOrAlias', async (req, res) => {
    // Check if the file has a password
    const filename = req.params.filenameOrAlias;
    let fileResult = await db.get(`
        SELECT *
        FROM files
        WHERE (filename = '${filename}'
            OR alias = '${filename}')
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

app.post("/share/unlock/:filenameOrAlias", async (req, res) => {
    const password = req.body.password;
    const filename = req.params.filenameOrAlias;

    let fileResult = await db.get(`
        SELECT *
        FROM files
        WHERE (filename = '${filename}' OR alias = '${filename}')
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