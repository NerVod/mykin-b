const User = require('../model/User');
const Wallpost = require('../model/Wallpost')


exports.createNewPost = async (req, res) => {
    try {
        console.log('req.body create post :', req.body)
        let post = new Wallpost({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            location: req.body.location,
            createdDate: req.body.createdDate,
            likes: req.body.likes,
            author: req.body.author,
            nameUser: req.body.nameUser,
            prenomUser: req.body.prenomUser,
        });

        let createdPost = await post.save();
        res.status(200).json({
            message: "nouveau post enregistré",
            data: createdPost,
        })
    }catch (err){
        console.log('catch create new post', err);
        res.status(500).json({
            error: err
        })
    }
}


exports.getUserWallposts = async (req, res) => {
    const auteur = req.body.user
    const userPosts = []
    try {
        // console.log("req.body getuserwallpost :", auteur)
        const posts = await Wallpost.find()
        // console.log('post :', posts)
        for( let onePost of posts) {
            if( onePost.author === auteur) {
                userPosts.push(onePost)
            }
        }
        const reversedUserPosts = userPosts.reverse();
        res.json(reversedUserPosts)
        
        
    } catch {
        console.log('pas de post')
        res.json({msg: false})
    }
    
    
}

exports.hasWallPost = async (req, res) => {
    const auteur = req.body.user
    // console.log("req.body getuserwallpost :", req.body)
    const userPosts = []
    try {
        const posts = await Wallpost.find()
        // console.log('post :', posts)
        for( let onePost of posts) {
            if( onePost.author === auteur) {
                userPosts.push(onePost)
            }
        }
        if(userPosts.length !== 0){
            res.json({hasposts: true})
        } else {
            res.json({hasposts: false})
        }
        

    } catch {
        console.log('pas de post')
        res.json({msg: false})
    }
}
