import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import { MongoServerClosedError } from 'mongodb';
dotenv.config();

//CONNECT TO MONGODB DATABASE
/* mongoose.connect('mongodb+srv://w360_db_admin:BXue8mhe1qGeBEXn@cluster0.c7g73bo.mongodb.net/w360-studio?retryWrites=true&w=majority&appName=Cluster0',{
  useNewUrlParser: true,
  useUnifiedTopology: true
}) */
mongoose.connect('mongodb://root:OgqihO1oZaXUwrv8L17COI026i8H14odHzyd3QlOoA4EOdsTyTB9oMmxPmOPgJJQ@92.112.192.75:5432/w360-studio?directConnection=true&authSource=admin',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})      
.then(() => {
  console.log('Connected to the database');
})
.catch(err => {
  console.error('Error connecting to the database:', err);
});

export class Location {
    constructor(longitude, latitude) {
      this.longitude = longitude;
      this.latitude = latitude;
    }
}

const Schema = mongoose.Schema;

const ReactionTypes = {
    LIKE: 'like',
    LOVE: 'love',
    HAHA: 'haha',
    WOW: 'wow',
    SAD: 'sad',
    ANGRY: 'angry'
};

const Content = new Schema({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    creator: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true 
    },

    reactions: [{
        type: {
          type: String,
          enum: Object.values(ReactionTypes)
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
    }],

    comments: [{
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        content: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
    }],

    publishedDate: {
        type : Date,
        default: Date.now
    },

    category:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
        //require: true 
    },

    location : {
        type : {
            longitude : {
                type: Number,
                required : true
            },
            latitude : {
                type: Number,
                required: true
            }
        },
        required : true
    },

    files: [{
        filename:{
            type: String,
            required: true
        },
        caption: String,
    }],

    /* images: [{
        imageUrl: {
            type: String,
            required: true
        },
        caption: String,
    }],

    videos : [{
        videoUrl: {
            type: String,
            required: true
        },
        caption: String,
    }], */

    active: {
        type: Boolean,
        required: true,
        default: true
    }

    //extra fields.

})

const Category = new Schema({
    name: {
        type: String,
        required: true
    },

    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],

    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
})

const User = new Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    nickname: {
        type: String, 
        required: true
    },

    photo_profile: {
        type: String
    },

    email: {
        type: String,
        required: true
    },

    region: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    password_resset:{
        token: String,
        expire: Date
    },

    preferences:{
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }]
    },

    bookmarks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],

    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],

    register_token: String,
    active: Boolean
},
{ timestamps: true }
)

const Articles = new Schema({
    title: String,
    category: Array,
    description: String,
    link: String,
    creator: String,
    pubDate: String,
    thumbnail: String,
    content: String,
    valid: Boolean
},
{ timestamps: true }
);

const Creators = new Schema({
    name: String,
},
{ timestamps: true }
)

const Category_Article = new Schema({
    categoryid: String,
    articlesid: Array
})

const Chat = new Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent'
        }
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const chat = mongoose.model('Chat', Chat);
export const category = mongoose.model('Category', Category);
export const article = mongoose.model('Articles', Articles);
export const creator = mongoose.model('Creators', Creators);
export const category_article = mongoose.model('Category_Article', Category_Article);
export const user = mongoose.model('Users', User);
export const content = mongoose.model('Content', Content);