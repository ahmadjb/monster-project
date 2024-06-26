const router = require('express').Router()
const bcrypt = require('bcrypt');
const User = require('../models/settingUp');

const Post = require('../models/post');
const AWS = require('aws-sdk');
require('dotenv').config();
 
// Add the AWS configuration with your credentials here
AWS.config.update({
    accessKeyId: 'AKIAU6KJJN4CLSVULJ6Y',
    secretAccessKey: 'JFlyKV/zmms3ALXWCowwATv9o93Vi4tcSRT+ge9D',
    region: 'us-east-1' // Update with your AWS region
});


// Define a route for generating presigned URLs
router.get("/presigned-url", async (req, res) => {
    const s3 = new AWS.S3();
    const key = req.query.key; // Object key passed from the client

    const params = {
        Bucket: 'monsterapifile',
        Key: key,
        Expires: 20 // Expiry time in seconds
    };

    s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
            console.error('Error generating presigned URL:', err);
            res.status(500).send('Error generating presigned URL');
        } else {
            res.send(url);
        }
    });
});




router.post("/", async (req, res) => {
    try {
        const { title, desc, img, url } = req.body;
        const post = new Post({ title, desc, img, url });
        const createPost = await post.save();

        if (createPost) res.status(201).json(createPost)

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/", async (req, res) => {

    const posts = await Post.find();

    if (posts) res.status(200).json(posts);
});


router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ message: "Email already innn use" });
        }

        // If user doesn't exist, proceed with sign-up process
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Password is correct, create JWT token or set session
        // Here you can create a JWT token and send it back to the client for authentication in subsequent requests
        res.status(200).json({ message: "Sign-in successful", user });
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router