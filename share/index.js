const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');

const app = express({
    limit: "10mb"
});

// Middleware
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
app.use(morgan('dev'));

// Enable file upload (still middleware)
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    },
    // safeFileNames: true,
    // preserveExtension: true,
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
            // return res.json({"status": "good"});
            // return res.status(500).send(err);

            for (let file in req.files) {
                file = req.files[file];
                // We want to name the file 'file.ext_timestamp.ext' so if we want to cut off the file extension we can just cut the timestamp and extra extension off
                // Aka, split by _ and take the first part
                const newFileName = _.replace(_.toLower(file.name), / /g, '_') + '_' + Date.now() + path.extname(file.name);

                const outputDirectory = process.env.UPLOAD_DIR || path.join(__dirname, 'public/uploads/');

                const filePath = path.join(outputDirectory, newFileName);
                file.mv(filePath, async (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            }

            return res.json({
                message: "success"
            });

        }
    } catch (err) {
        return res.status(500).send(err);
    }
});

// TODO: Create route for GETTING files

// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});