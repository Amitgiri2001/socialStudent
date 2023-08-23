const { validationResult } = require('express-validator');
const PostModel = require('../models/PostModel');
const User = require('../models/UserModel');
const fs = require('fs');
const path = require('path');

//multer
const multer = require('multer');

//create one post
exports.createPost = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty() == false) {
    return res.status(422).json({ "message": "Validation fails", error: result.array() });
  }
  const title = req.body.title;
  const content = req.body.content;

  //creator of the post
  // console.log("User", req.userId)
  const creator = req.userId;

  //image url from multer
  // console.log("req.file", req.file);
  let imageUrl = req.file.path.replaceAll("\\", "/");
  // console.log("imageUrl", imageUrl);

  // Create post in db
  const Post = new PostModel({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: creator,
  });

  //for when i get the user i need to pass it into my post
  let getUser;
  Post.save().then((result) => {

    //we need to update the user as well
    const user = User.findById(creator)
      .then((user) => {
        getUser = user;
        //add post to the user
        user.posts.push(Post);
        return user.save();
      })
      .then((results) => {
        res.status(201).json({
          message: 'Post created successfully!',
          post: Post,
          creator: { _id: getUser._id, name: getUser.name }
        });
      })


  }).catch(error => { console.log("post data error"); console.log(error) });

};

//get all posts
exports.getPosts = (req, res, next) => {
  //find posts in the database
  //get the page number
  const pageNo = req.query.page || 1;
  let totalItems;
  const perPage = 2;

  //first call no of documents we have
  PostModel.find().countDocuments()
    .then((res) => {
      totalItems = res;
      return PostModel.find().skip((pageNo - 1) * perPage).limit(perPage)
    })
    .then((posts) => {
      res.status(200).json({
        message: "Posts fetch from DB successfully",
        posts: posts,
        totalItems: totalItems
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({
        message: "Posts can't fetch from DB successfully",
        error: error
      });
    });


};

//get one post by id
exports.getPostById = (req, res, next) => {
  const postId = req.params.postId;

  //find post on DB
  const post = PostModel.findById(postId)
    .then((post) => {
      res.status(200).json({
        message: "Post fetch from DB successfully",
        post: post
      });
    }).catch((error) => {
      console.log(error);
      res.status(404).json({
        message: "Post can't fetch from DB successfully",
        error: error
      });
    });
};


//update a post using id

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title1 = req.body.title;
  const content1 = req.body.content;
  let imageUrl1 = req.body.image;



  // console.log("Title: ", req.body)

  //if we pick one file
  if (req.file) {

    imageUrl1 = req.file.path.replaceAll("\\", "/");
  }
  //if we set imageUrl==null then
  if (!imageUrl1) {
    console.log("Setting imageUrl to null");
    return res.json({ message: "Image not uploaded", error })
  }

  const post = PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        throw new Error("No post found ");
      }
      //Authorization

      console.log(req.userId, " ", post.creator.toString());
      if (req.userId !== post.creator.toString()) {
        const error = new Error("You are not allowed to update others post.");
        error.statusCode = 403;
        throw error;
      }

      // console.log("prev post: " + post);
      post.title = title1;
      post.content = content1;

      //delete the previous post image
      if (post.imageUrl !== imageUrl1) {
        clearImage(post.imageUrl);
      }
      post.imageUrl = imageUrl1;
      // console.log("New post: " + post);
      return post.save();



    })
    .then((resPost) => {
      res.status(200).json({
        message: "Post updated successfully",
        post: resPost
      });
    })
    .catch(err => { console.log("Error in update Post"); console.log(err); });


};



//delete a post by id
exports.deletePostById = (req, res, next) => {
  const postId = req.params.postId;

  PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        throw new Error("No post found ");
      }

      //authorization
      // console.log(req.userId, " ", post.creator.toString());
      if (req.userId !== post.creator.toString()) {
        const error = new Error("You are not allowed to update others post.");
        error.statusCode = 403;
        throw error;
      }
      clearImage(post.imageUrl);
      return PostModel.findByIdAndDelete(postId);
    })
    .then((resPost) => {
      const userID = req.userId;
      return User.findById(userID)

    })
    .then(user => {
      user.posts.pull(postId);
      return user.save();
    }).then((result) => {
      res.status(200).json({
        message: "Post deleted successfully",
      });
    })
    .catch(err => { console.log("Error in delete Post"); console.log(err); });
}


//one user all post
exports.getAllPostsOfUser = async (req, res, next) => {

  //get userId from url
  const userId = req.params.userId;
  let userPosts = [];

  const AllPosts = await PostModel.find();
  if (!AllPosts) {
    throw new Error("No posts of that user");
  }

  for (let post of AllPosts) {
    // console.log(post.creator.toString())
    if (post.creator.toString() === userId) {
      userPosts.push(post);
    }
  }

  res.status(200).json({
    message: "all posts fetched successfully",
    posts: userPosts
  });
}
//delete a file from the directory
const clearImage = imagePath => {
  const path1 = path.join(__dirname, '..', imagePath);
  // console.log("The path is: ", path1);
  fs.unlink(path1, (err) => { if (err) { console.log("Delete image failed"); console.log(err); } });
}

exports.deleteAllPosts = async (req, res, next) => {
  try {
    // Delete all posts
    await Post.deleteMany({}); // This will delete all documents in the Post collection

    return res.status(200).json({ message: 'All posts have been deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while deleting posts.' });
  }
};

