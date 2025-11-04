const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    filename: (req,file,callback)=>{

        callback(null,file.originalname)

        
    }
})

const cloudUpload  = multer({storage})


module.exports = cloudUpload;