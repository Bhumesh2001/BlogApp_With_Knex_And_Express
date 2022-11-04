const express = require('express');
const Router = express.Router()
const Controller = require('../Controllers/controller');
const { verifyToken } = require('../jwt/jwt');

Router.post('/CreateBlogUser',Controller.CreateBlogUser)

Router.get('/LoginBlogUser',Controller.LoginBlogUser)

Router.post('/CreateBlogPosts',verifyToken,Controller.CreateBlogPosts)

Router.get('/SeeAllPosts',verifyToken,Controller.SeeAllBlogPosts)

Router.post('/LikeBlogUser',verifyToken,Controller.LikeDislikeBlogUser)

Router.get('/SeeLikeDislikePosts',verifyToken,Controller.SeeLikeDislikePosts)

Router.delete('/Deleteblogposts',verifyToken,Controller.DeleteblogPosts)

module.exports = Router