import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {  // file access mil jaata hai multer ke saath, cb is callback function
      cb(null, './public/temp'); // cb(error, pathOfDestination)
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname); // not a good practice
    }
  })
  
export const upload = multer({ storage: storage }) // can be replaced with storage only in ES6