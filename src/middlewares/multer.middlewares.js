import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
      console.log("wokiing 1");
    },
    
    filename: function (req, file, cb) {
      console.log("wokiing 1");
      cb(null, file.originalname)
    }
  })
  console.log("store disk");
  
export const upload = multer({ 
    storage, 
})
