const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.get("/",(req,res)=>{
    res.send("hey its user route")
})

//Update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password == await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
               $set: req.body,
            });
            res.status(200).json("Account has been updated")
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("you can update your account")
    }
})



//Delete user
router.delete("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted succesfully")
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("you can delete only your account")
    }
});



//Get user

router.get("/getuser/:id",async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt,...other}=user._doc
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err);
    }
});


//Follow user

router.put("/:id/follow",async (req,res)=>{
    if(req.body.userId!==req.params.id){
         try{
             const user = await User.findById(req.params.id);
             const currentUser = await User.findById(req.body.userId);
             if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("user has been followed");
            }
            else{
                 res.status(403).json("you already follow this user")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you can follow yourself")
    }
})

//Unfollow user


router.put("/:id/unfollow",async (req,res)=>{
    if(req.body.userId!==req.params.id){
         try{
             const user = await User.findById(req.params.id);
             const currentUser = await User.findById(req.body.userId);
             if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json("user has been unfollowed");
            }
            else{
                 res.status(403).json("you don't follow this user")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you can unfollow yourself")
    }
})



module.exports = router;