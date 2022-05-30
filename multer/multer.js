const multer = require('multer');
const fs = require('fs');
const { todayDate } = require('../others/dateGenerator');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const path = './uploads'
        // fs.mkdirSync(path, { recursive: true })
        cb(null, "./Public/images")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
        return cb(new Error('Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'), false);
    }
    cb(null, true);
}

exports.upload = multer({ storage: storage, fileFilter: fileFilter })