import { content, user } from "../Database/database.js";

const getcontents = async (req,res) => {
    res.status(200).send(await content.find({}));
}

const postcontent = async (req, res) => {
    try{
        const files = []
        const new_content = req.body;
        
        for(let file of req.files){
            files.push({"filename": file.originalname, "caption": new_content.caption})
        }
        
        const new_insert = new content({
                creator: req.user.id,
            content: new_content.content,
            title: new_content.title,
            location: {longitude: new_content.longitude ,latitude: new_content.latitude},
            files: files
        });
        
        req.user.posts.push(new_insert.id);
        req.user.save();

        //WE HAVE SOME ISSUES WITH:
        //REQUEST IS DONE WITH LATITUDE AND LONGITUDE SEPERATE
        //NOT AS AN OBJECT TOGETHER
        //THAT WHY THEY INSERT THAT WAY INTO DATABASE
        
        await new_insert.save();
        res.status(201).send('content added to database');
    }catch(error){
        res.send(error);
    }
}

const deletecontent = async (req, res) => {
    const content_id = req.params.id;
    
    //CHECK IF THE CONTENT EXISTS
    //AND IF THE OWNER IS THE USER WHO REQUESTED
    const content_to_delete = await content.findOne({ _id:content_id, creator:req.user._id });
    
    if(!content_to_delete){
        res.status(400).send('no content with this id, or the user is not the owner');
    }else{
        //DELETE THE CONTENT
        content_to_delete.active = false;
        await content_to_delete.save();
        res.status(201).send('the content has been deleted');
    }
}

const editcontent = async (req, res) => {
    const content_id = req.params.id;
    
    //CHECK IF THE CONTENT EXISTS
    //AND IF THE OWNER IS THE USER WHO REQUESTED
    const content_to_edit = await content.findOne({ _id:content_id, creator:req.user._id });
    
    if(!content_to_edit){
        res.status(400).send('no content with this id, or the user is not the owner');
    }else{
        //GIVE THE CONTENT FOR EDIT
        res.status(201).send({content_to_edit});
    }
}

const posteditcontent = async (req, res) => {
    const content_id = req.params.id;
    
    //CHECK IF THE CONTENT EXISTS
    //AND IF THE OWNER IS THE USER WHO REQUESTED
    const content_to_edit = await content.findOne({ _id:content_id, creator:req.user._id });
    
    if(!content_to_edit){
        res.status(400).send('no content with this id, or the user is not the owner');
    }else{
        //UPDATE THE EDITED CONTENT
        try{
            const result = await content.updateOne({_id:content_id}, {
                title: req.body.title,
                content: req.body.content
            });
            res.status(201).send('content updated');
        }catch{
            res.status(400);
        }
    }
}

const postcomment = async (req, res) => {
    const content_id = req.params.id;
    const user_to_comment = req.user;

    const content_to_comment = await content.findOne({ _id:content_id });
    
    //CHECK IF THE CONTENT EXISTS
    if(!content_to_comment){
        res.status(400).send('no content with this id');
    }else{
        content_to_comment.comments.push({
            commenter: user_to_comment._id,
            content: req.body.text
        });
        await content_to_comment.save();
        res.status(201).send('comment posted');
    }
}

const editcomment = async (req, res) => {
    const content_id = req.params.id;
    const user_to_comment = req.user;
    const comment_id = req.params.comment_id;
    let errro_count = 0;

    //CHECK IF THE CONTENT EXISTS
    const content_to_comment = await content.findOne({ _id:content_id });
    if(!content_to_comment){
        res.status(400).send('no content with this id');
    }

    content_to_comment.comments.forEach(comment => {
        if(comment._id.toString() === comment_id && comment.commenter.toString() === user_to_comment._id.toString()){
            res.status(201).send(comment);
        }else if(errro_count === (content_to_comment.comments.length - 1)){    
            res.status(400).send('no comment with that id or not matching user');
        }else{
            errro_count++;
        }
    })
}

const posteditcomment = async (req, res) => {
    const content_id = req.params.id;
    const user_to_comment = req.user;
    const comment_id = req.params.comment_id;
    const text = req.body.text;
    let errro_count = 0;

    //CHECK IF THE CONTENT EXISTS
    const content_to_comment = await content.findOne({ _id:content_id });
    if(!content_to_comment){
        res.status(400).send('no content with this id');
    }

    for(let comment of content_to_comment.comments){
        if(comment._id.toString() === comment_id && comment.commenter.toString() === user_to_comment._id.toString()){
            comment.content = text;
            await content_to_comment.save();
            res.status(201).send('comment updated');
        }else if(errro_count === (content_to_comment.comments.length - 1)){    
            res.status(400).send('no comment with that id or not matching user');
        }else{
            errro_count++;
        }
    }
}

const deletecomment = async (req, res) => {
    const content_id = req.params.id;
    const user_to_comment = req.user;
    const comment_id = req.params.comment_id;
    let errro_count = 0;

    //CHECK IF THE CONTENT EXISTS
    const content_to_comment = await content.findOne({ _id:content_id });
    if(!content_to_comment){
        res.status(400).send('no content with this id');
    }

    for(let comment of content_to_comment.comments){
        if(comment._id.toString() === comment_id && comment.commenter.toString() === user_to_comment._id.toString()){
            let index = content_to_comment.comments.indexOf(comment);
            content_to_comment.comments.splice(index,1);
            await content_to_comment.save();
            res.status(201).send('comment deleted');
        }else if(errro_count === (content_to_comment.comments.length - 1)){    
            res.status(400).send('no comment with that id or not matching user');
        }else{
            errro_count++;
        }
    }
}

const savecontent = async (req, res) => {
    const content_id = req.params.id;
    const user_to_save = req.user;

    //CHEKC IF THE CONTENT EXISTS
    const content_to_save = await content.findOne({ _id:content_id });
    if(!content_to_save){
        res.status(400).send('no content with this id');
    }else{
        user_to_save.bookmarks.push(content_to_save._id);
        await user_to_save.save();
        res.status(201).send('bookmark content');
    }
}

const deletesavecontent = async (req, res) => {
    const content_id = req.params.id;
    const user_to_save = req.user;

    //CHECK IF THE CONTENT EXISTS
    const content_to_delete = await content.findOne({ _id: content_id });
    if(!content_to_delete){
        res.status(400).send('no content with this id');
    }else if(!(user_to_save.bookmarks.some(id => id.equals(content_id)))){
        res.status(400).send('content not saved');
    }else{
        let index = user_to_save.bookmarks.indexOf(content_id);
        user_to_save.bookmarks.splice(index,1);
        await user_to_save.save();
        res.status(201).send('content removed from bookmarks');
    }
}

const reacttocontent = async (req, res) => {
    const content_id = req.params.id;
    const user_to_react = req.user;

    //CHECK IF THE CONTENT EXISTS
    const content_to_react = await content.findOne({ _id:content_id });
    if(!content_to_react){
        res.status(400).send('no content with this id');
    }else if(content_to_react.reactions.some(reaction => reaction.user.equals(user_to_react._id))){
        for(let reaction of content_to_react.reactions){
            if(reaction.user.toString() === user_to_react._id.toString()){
                if(reaction.type === req.body.react){
                    let index = content_to_react.reactions.indexOf(reaction);
                    content_to_react.reactions.splice(index,1);
                    await content_to_react.save();
                    res.status(201).send('reaction removed');
                }else{
                    reaction.type = req.body.react;
                    reaction.timestamp = Date.now();
                    await content_to_react.save();
                    res.status(201).send('reaction changed');
                }
            }
        }
    }else{
        content_to_react.reactions.push({
            type: req.body.react,
            user: user_to_react._id
        });
        await content_to_react.save();
        res.status(201).send('react added to post');
    }
}

const get_locations = async (req, res) => {
    const contents = await content.find({})
    const location_table = []
    for(let content of contents){   
        location_table.push({"name": content.title,
            "lat": content.location.latitude,
            "lon": content.location.longitude
        })
    }
    res.send(location_table);
}

const screen_posts = async (req, res) => {
    const lefttop = req.body.lefttop;
    const righttop = req.body.righttop;
    const rightbot = req.body.rightbot;
    const allposts = await content.find({});
    const screenposts = [];

    rightbot.longitude = righttop.longitude;

    for(let post of allposts){
        let latitude = post.location.latitude;
        let longitude = post.location.longitude;
        
        if(latitude > rightbot.latitude && latitude < lefttop.latitude
            && longitude < rightbot.longitude && longitude > lefttop.longitude){

            screenposts.push(post);
        }
    }

    res.status(201).send(screenposts);
}


export const contentController = {
    getcontents,
    postcontent,
    deletecontent,
    editcontent,
    posteditcontent, 
    postcomment,
    editcomment,
    posteditcomment,
    deletecomment,
    savecontent,
    deletesavecontent,
    reacttocontent,
    get_locations,
    screen_posts
}