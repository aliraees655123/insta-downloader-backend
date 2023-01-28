const express = require('express');
const {registerAdmin,loginAdmin,addBlog,deleteBlog,getBlogs,updateBlog,
    addContent,getContents,updateContent,
    deleteContent,addTag,getTags,deleteTag,updateTag,findLink} =require('./../controllers/AdminController')
const router1 = express.Router();
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: "./upload",
    filename: (req, file, cb) => {
      return cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
  
  const upload = multer({
    storage: storage,
  });




  const uploadFields = upload.fields([
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
   
  ]);

router1.post('/register',  registerAdmin);
router1.post('/login',  loginAdmin);
router1.post("/addBlog", uploadFields, addBlog);
router1.put("/updateBlog/:id", uploadFields, updateBlog);
router1.delete("/deleteBlog/:id", deleteBlog);
router1.get("/getBlogs", getBlogs);




router1.post("/addContent", addContent);
router1.get("/getContents", getContents);
router1.put("/updateContent/:id", updateContent);
router1.delete("/deleteContent/:id", deleteContent);


router1.post("/addTag", addTag);
router1.get("/getTags", getTags);
router1.delete("/deleteTag/:id", deleteTag);
router1.put("/updateTag/:id", updateTag);


router1.post("/findLink", findLink);

module.exports = router1;