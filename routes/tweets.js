const router = require("express").Router();
const Tweet = require("../models/Tweet");
const tweet = require("../models/Tweet");


//create a tweet

router.post("/",async (req,res)=>{
    const newTweet = new tweet(req.body);
    try{
        const savedtweet = await newTweet.save();
        res.status(200).json(savedtweet);
    }catch(err){
        res.status(500).json(err);
    }
});


//delete a post

router.delete("/:id/delete",async (req,res)=>{
     try{
        const tweet = await Tweet.findById(req.params.id);
        if(tweet.userId === req.body.userId){
           await tweet.deleteOne();
           res.status(200).json("The post has been deleted");
        }else{
            res.status(403).json("You can delete only your post");
        } 
     }catch(err){
         res.status(500).json(err);
     }
});
//get a post
router.get("/:id/read",async (req,res)=>{
    try{
        const tweet = await Tweet.findById(req.params.id);
        res.status(200).json(tweet);
    }catch(err){
        res.status(500).json(err);
    }
})

//get timeline posts

module.exports = router