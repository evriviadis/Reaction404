import mongoose, { mongo } from 'mongoose';
import { content, Location } from '../Database/database.js'; // Assuming you've defined your Post model in a file called postModel.js
// Connect to MongoDB
mongoose.connect('mongodb+srv://w360_db_admin:BXue8mhe1qGeBEXn@cluster0.c7g73bo.mongodb.net/w360-studio?retryWrites=true&w=majority&appName=Cluster0',{
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    // Create a new location
    const newLocation = new Location(123.456, 78.910);
    
    console.log(newLocation);
    // Create new image objects
    const images = [
        { imageUrl: W360Image.getImageURL(), caption: 'Image 1 caption' },
        { imageUrl: 'https://example.com/image2.jpg', caption: 'Image 2 caption' }
    ];
    // Create new video objects
    const videos = [
        { videoUrl: 'https://example.com/video1.mp4', description: 'Video 1 description' },
        { videoUrl: 'https://example.com/video2.mp4', description: 'Video 2 description' }
    ];
    // Create a new post template
    
    
    const newPost = new Content({
        creator: '6646068e31f8ec1c9e54cf95', // Replace with actual user ID
        content: 'This is a template post - edited.',
        title: 'This is a title - edited',
        location: newLocation,
        images: images,
        videos: videos,
        likes: [],
        comments: []
    });
    // Save the new post template
    return newPost.save();
})
.then(savedPost => {
    console.log('New template post saved:', savedPost);
})
.catch(error => {
    console.error('Error saving template post:', error);
});

class W360Image {
    filename = "";
    path = "";

    constructor(file){
        this.file = file;
        //change image filename = "image2.jpg";
        //save path
        this.filename = "newRandomGeneratedName.jpg";
        this.path = this.determineBestSavingLocationForThisFile;
        const image_id =  SaveToDisk(file);

        //kane to save se ena folder
    }
    
    determineBestSavingLocationForThisFile(){
        return "/images/2024/05/";
    }
    
    getImageURL(){
        return this.path+"/"+this.filename;
    }
    

}