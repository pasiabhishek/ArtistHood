const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const name = path.basename(file.originalname, extension);
        let count = 1;
        let filename = `${name}${extension}`;

        while (fs.existsSync(path.join("uploads", filename))) {
            filename = `${name}(${count})${extension}`;
            count++;
        }
        cb(null, filename);
    }
});


const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, },
});

module.exports = upload;