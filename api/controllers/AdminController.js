const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { Admin } = require("../models/Admin");
const { Blog } = require("./../models/Blog");
const { Content } = require("./../models/Content");
const { MetaTag } = require("./../models/MetaTag");
const  instagramGetUrl  = require("instagram-url-direct");


///Add Admin
exports.registerAdmin = async (req, res) => {
  let { email, password, name } = req.body;

  try {
    const verifydata = await Admin.find({ email: email });
    console.log(verifydata);
    if (verifydata !== []) {
      const hasedpassword = bcrypt.hashSync(password, 10);
      let data = new Admin({
        email: email,
        name: name,

        password: hasedpassword,
      });
      await data.save();
      res.status(200).json({
        message: "Admin register successfully",
        status: true,
        data,
      });
    } else {
      res.status(400).json({
        Error_Message: "User already registered",
        status: false,
        statusText: "User already registered",
      });
    }
  } catch (error) {
    res.status(500).json({
      Error_Message: error,
      status: false,
      statusText: "User already registered with this email",
    });
  }
};
///login admin
exports.loginAdmin = async (req, res) => {
  console.log("body=====", req.body);
  const { email, password } = req.body;
  console.log("body=====", email, password);
  try {
    let data = await Admin.findOne({ email: email });
    console.log("=========", data);
    const isMatch = await bcrypt.compare(password, data.password);
    if (isMatch) {
      const token = jwt.sign(data.toObject(), "secret", { expiresIn: "7d" });
      res.status(200).json({
        status: true,
        message: "UserLogin Successfully",
        user: data,
        token,
      });
    } else {
      res.status(400).json({
        message: "Invalid Email or password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Error_Message: error,
    });
  }
};

///Add Blog
exports.addBlog = async (req, res) => {
  const images = req.files;
  let { title, description, publisherName, p1, p2, p3, p4, title2, date } =
    req.body;
  try {
    let data = new Blog({
      title: title,
      description: description,
      publisherName: publisherName,
      p1: p1,
      p2: p2,
      p3: p3,
      p4: p4,
      title2: title2,
      date: date,
      img1: `http://localhost:6002/photo/${images.photo1[0].filename}`,
      img2: `http://localhost:6002/photo/${images.photo2[0].filename}`,
      //   img2:`http://localhost:5000/profile/${req.file.filename}`,
    });
    await data.save();
    res.status(200).json({
      message: "Blog Created",
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      Error_Message: error,
      status: false,
      statusText: "Blog not created",
    });
  }
};

//Delete Blog
exports.deleteBlog = async (req, res) => {
  const deleteBlog = await Blog.findByIdAndRemove(req.params.id);
  if (!deleteBlog) {
    return next(new AppError("Invalid Vehicle Id Provided", 400));
  }
  res.json({ success: true, deleteBlog, message: "Blog Deleted" });
};

//get all Blogs
exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find();
  res.json({ success: true, blogs });
};
//Update Blog
exports.updateBlog = async (req, res) => {
  let { id } = req.params;
  const images = req.files;
  let { title, description, publisherName, p1, p2, p3, p4, title2, date,photo1,photo2 } =
    req.body;

    console.log("images",images.photo1,images.photo2)
  try {
    let data = await Blog.findById({ _id: id });

    data.title = title;
    data.description = description;
    data.publisherName = publisherName;
    data.p1 = p1;
    data.p2 = p2;
    data.p3 = p3;
    data.p4 = p4;
    data.img1=photo1;
    data.img2=photo2;

    data.title2 = title2; 
    data.date = date;

    if(images.photo1 != undefined)
    {
        if(images?.photo1[0]?.filename)
    {

        console.log("images.photo1[0].filename",images.photo1[0].filename)
        data.img1 = `http://localhost:6002/photo/${images.photo1[0].filename}`;
    }
  

    }
    if(images.photo2 != undefined)
    {
  
    if(images?.photo2[0]?.filename)
    {

        data.img2 = `http://localhost:6002/photo/${images.photo2[0].filename}`;

    }

    }


    
      await data.save();
    // console.log("dataCompleProfile123", data);
    if (data) {
      res.status(200).json({
        message: "Information Updated",
        data,
      });
    } else {
      res.status(400).json("No data found");
    }
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json(error);
  }
};

///AddContent
exports.addContent = async (req, res) => {
//   console.log(req.body);

  let {
    page,
    mainHeading,
    copyLinkTxt,
    placeHolderTxt,
    feature,
    featureTxt,
    videoTxt,
    sliderData,
    questionsHeading,
    questionsText,
    btnQuestionTxt,
    faqData,
    termConditionsText,
    privacyText,
    faqTxt,
    emailTxt,
    subscribeBtnTxt,
    language,
    path,
    videoD,
    imageD,
    download


  } = req.body;
  try {

    const contents = await Content.find();

    let filteredArr = contents?.filter((obj) => (obj.page === page && obj.language===language));

    if(filteredArr === [])
    {
      
          let data = new Content({
            page,
            mainHeading,
            copyLinkTxt,
            placeHolderTxt,
            feature,
            featureTxt,
            videoTxt,
            sliderData,
            questionsHeading,
            questionsText,
            btnQuestionTxt,
            faqData,
            termConditionsText,
            privacyText,
            faqTxt,
            emailTxt,
            subscribeBtnTxt,
            language,
            path,
            videoD,
          imageD,
          download
          });
          await data.save();
          res.status(200).json({
            message: "Content Created",
            status: true,
            data,
          });
    }
    else{
        res.status(201).json({
            message: "Content with this page and language already created",
            status: false,
    
          });
    }

    console.log("filteredArr",filteredArr)

   
  } catch (error) {
    res.status(500).json({
      Error_Message: error,
      status: false,
      statusText: "Content not created",
    });
  }
};

//get all Content
exports.getContents = async (req, res) => {
  const contents = await Content.find();
  res.json({ success: true, contents });
};

//Update Content
exports.updateContent = async (req, res) => {
  console.log(req.body);
  let { id } = req.params;

  let {
    page,
    mainHeading,
    copyLinkTxt,
    placeHolderTxt,
    feature,
    featureTxt,
    videoTxt,
    sliderData,
    questionsHeading,
    questionsText,
    language,
    btnQuestionTxt,
    faqData,
    termConditionsText,
    privacyText,
    faqTxt,
    emailTxt,
    subscribeBtnTxt,
    path,
    videoD,
    imageD,
    download
  
  } = req.body;

  let newData = {
    page,
    mainHeading,
    copyLinkTxt,
    placeHolderTxt,
    feature,
    featureTxt,
    videoTxt,
    sliderData,
    questionsHeading,
    questionsText,
    btnQuestionTxt,
    path,
    faqData,
    termConditionsText,
    privacyText,
    faqTxt,
    language,
    emailTxt,
    subscribeBtnTxt,
    videoD,
    imageD,
    download
  };
  try {


    const contents = await Content.find();

    let filteredArr = contents?.filter((obj) => (obj.page === page && obj.language===language));


    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      newData,
      { new: true }
    );
   
    if (!updatedContent) {
      return next(new AppError("Invalid Content Id Provided", 404));
    }

    res.json({
      success: true,
      message: "Content Updated Succesfully",
      updatedContent,
    });


    
  } catch (error) {
    res.status(500).json({
      Error_Message: error,
      status: false,
      statusText: "Content not Updated",
    });
  }
};

//Delete Content
exports.deleteContent = async (req, res) => {
    const deleteCon = await Content.findByIdAndRemove(req.params.id);
    if (!deleteCon) {
      return next(new AppError("Invalid Vehicle Id Provided", 400));
    }
    res.json({ success: true, deleteCon, message: "Content Deleted" });
  };


  //Find Link
exports.findLink = async (req, res) => {
    console.log(req.body.link)
    console.log(req.body)
    try{
        let links = await instagramGetUrl(req.body.link)
        console.log(links)
          
            // console.log("driver....", driver,newDriver);
            res.json({ success: true, links });
    }
    catch(err)
    {
        // console.log(err)
    }
  };


  ///Add MetaTage
exports.addTag = async (req, res) => {
 
    let { name,detail} =
      req.body;
    try {
        const mataTag = await MetaTag.find();

        let filteredArr = mataTag?.filter((obj) => obj.name === name );



      let data = new MetaTag({
        name: name,
        detail: detail,
    
    
      });
      await data.save();
      res.status(200).json({
        message: "MetaTag Created",
        status: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        Error_Message: error,
        status: false,
        statusText: "MetaTag not created",
      });
    }
  };


  //get all Tags
exports.getTags = async (req, res) => {
    const tags = await MetaTag.find();
    res.json({ success: true, tags });
  };
  

  //Delete Tag
exports.deleteTag = async (req, res) => {
    const deleteTag = await MetaTag.findByIdAndRemove(req.params.id);
    if (!deleteTag) {
      return  res.json({ success: false,  message: "Check MetaTag id" });;
    }
    res.json({ success: true, deleteTag, message: "Meta Tag Deleted" });
  };


//Update Tag
exports.updateTag = async (req, res) => {
    let { id } = req.params;
  
    let { name,detail } =
      req.body;
    try {
      let data = await MetaTag.findById({ _id: id });
  
      data.name = name;
      data.detail = detail;
  
        await data.save();

      if (data) {
        res.status(200).json({
          message: "Information Updated",
          data,
        });
      } else {
        res.status(400).json("No data found");
      }
    } catch (error) {
      console.log("ERROR", error);
      res.status(500).json(error);
    }
  };
  