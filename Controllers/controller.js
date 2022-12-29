const knex = require('../database/db');
const {generateToken} = require('../jwt/jwt');

const CreateBlogUser = async(req,res)=>{
    try {
        if(req.body.Email.includes('@')){
            var strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
            if(strongPassword.test(req.body.Password)){
                let UserAccount = await knex('blogUser').insert(req.body)
                res.json({Account:UserAccount,mesg:'Account Created Successfully...'})
            }else{
                res.json({message:'Please Choose a Strong Password , there should be lower and upper alphabets ,number and special charecter and length should be eight'})
            }
        }else{
            res.json({message:'Invalid Email'})
        }
    } catch (error) {
        if(error.code =='ER_DUP_ENTRY'){
            res.json({mesg:'This account allready exist.'})
        }
    }
}

const LoginBlogUser = async(req,res)=>{
    const {Email,Password} = req.body;
    try {
        let Data2 = await knex('blogUser').where({Email:Email,Password:Password})
        if(Data2[0].Email == Email){
            if(Data2[0].Password == Password){
                const token = generateToken(Data2[0].id)
                res.cookie('userToken',token)
                res.json({meg:'login successfull...',logInUser:Data2})
            }else{
                res.json({message:'Wrong Password'})
            }
        }else{
            res.json({message:"Wrong Email"})
        }
    } catch (error) {
        res.json({mesg:error})
    }
}

const CreateBlogPosts = async(req,res)=>{
    try {
        await knex('blogPosts').insert({Title:req.body['Title'],Discription:req.body['Discription'],UserId:req.UserData[0]['id']})
        res.json({message:'post has been uploaded successfully...'})
    } catch (error) {   
        res.json({mesg:error.message})
    }
}

const SeeAllBlogPosts = async(req,res)=>{
    try {   
        let allposts = await knex('blogPosts');
        let UserAccount = await knex('blogUser');
        const Posts_Data = [];
        for(let UserData of allposts){
            for(let bUser of UserAccount){
                if(bUser['id']==UserData['UserId']){
                    let PostObj = {PostsId:UserData['id'],Title:UserData['Title'],Discription:UserData['Discription'],PostsUser:bUser['Name']}
                    Posts_Data.push(PostObj)
                }
            }
        }
        res.json({Posts:Posts_Data})
    } catch (error) {
        res.json({message:error.message})
    }
}

const LikeDislikeBlogUser = async(req,res)=>{
    try {
        let likeData = await knex('LikeDislike').where({userId:req.UserData[0]['id'],PostsId:req.body["PostsId"]})
        if(likeData != 0){
            if(req.body.Like == true){
                await knex('LikeDislike').where({userId:req.UserData[0]['id'],PostsId:req.body['PostsId']}).update({Like:req.body['Like']})
                res.json({message:'Like uploaded successfully...'})
            }else{
                await knex('LikeDislike').where({userId:req.UserData[0]['id'],PostsId:req.body['PostsId']}).update({Like:req.body['Like']})
                res.json({message:'DisLike uploaded successfully...'})
            }
        }else{
            let post_UserData = await knex('blogPosts').where({id:req.body["PostsId"]})
            if(post_UserData != 0){
                if(req.body.Like == true){
                    await knex('LikeDislike').insert({userId:req.UserData[0]['id'],PostsId:req.body['PostsId'],Like:req.body['Like']})
                    res.json({message:'Like uploaded successfully...'})
                }else{
                    await knex('LikeDislike').insert({userId:req.UserData[0]['id'],PostsId:req.body['PostsId'],Like:req.body['Like']})
                    res.json({message:'DisLike uploaded successfully...'})
                }
            }else{
                res.json({message:"Havn't created any post"})
            }
        }
    } catch (error) {
        res.json({message:error.message})
    }
}

const SeeLikeDislikePosts = async(req,res)=>{
    try {
        const data = await knex.select('blogPosts.UserId','blogPosts.Title','blogPosts.Discription','LikeDislike.userId','LikeDislike.PostsId','LikeDislike.Like')
        .from('blogPosts').innerJoin('LikeDislike','blogPosts.id','LikeDislike.PostsId')
        var User_data = await knex('blogUser')
        var blogData = await knex('blogPosts')
        let SeeAllPosts = [];
        for(let post of blogData){
            var likeUser = [];
            for(let info of data){
                if(post['id'] == info['PostsId']){
                    if(info['Like'] != 0){
                        for(let user of User_data){
                            if(user['id']==info['userId']){
                                likeUser.push(user['Name'])
                            }
                        }
                    }
                }
            }
            for(let User of User_data){
                if(User['id'] == post['UserId']){
                    var obj = {PostUser:User['Name'],Title:post['Title'],Discription:post['Discription'],LikeUser:likeUser,TotalLike:likeUser.length}
                    SeeAllPosts.push(obj)
                }
            }
        }
        res.json({data:SeeAllPosts})
    } catch (error) {
        res.json({message:error.message})
    }
}

const DeleteblogPosts = async(req,res)=>{
    try {
        let post_data = await knex('blogPosts').where({UserId:req.UserData[0]['id'],id:req.body.PostsId})
        if(req.body.PostsId == post_data[0]['id']){
            await knex('blogPosts').where({id:req.body.PostsId}).del()
            await knex('LikeDislike').where({PostsId:req.body.PostsId}).del()
            res.json({message:'Post Deleted Successfully...'})
        }else{
            res.json({message:'You can not delete other person of post'})
        }
    } catch (error) {
        if(error.message ==  "Cannot read properties of undefined (reading 'id')"){
            res.json({message:'This Post Id Allready Deleted'})
        }else{
            res.json({message:error.message})
        }
    }
}

module.exports = {
    CreateBlogUser,
    LoginBlogUser,
    CreateBlogPosts,
    SeeAllBlogPosts,
    LikeDislikeBlogUser,
    SeeLikeDislikePosts,
    DeleteblogPosts
}
