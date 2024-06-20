const multer = require('multer');
const path = require("path");
const uploadPath = path.join(path.resolve("."), "public", "uploads");

const storage = multer.diskStorage({
    destination: uploadPath, // Replace with your desired storage location
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {    
        return cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1500000
    },
    fileFilter(req, file, cb) {
        checkFileType(file,cb)
    },
});

module.exports = upload;