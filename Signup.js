const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017/CRM';

mongoose.connect(mongoURI)
    .then(() =>
        console.log('Mongodb is connected Successfully'))

    .catch((error) =>
        console.log('error'));

const signSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,

    },
    gender:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        
    },
    hobbies:{
        type:[String],
    }
})
const Signup = mongoose.model('Signup', signSchema);

app.post('/api/signup', async (req, res) => {
    try {
        const { Username, Email, Password,gender,status,hobbies} = req.body;

        if (!Username || !Email || !Password || !status|| !gender) {
            return res.status(400).json({ message: 'All fields are Required' });
        }
        const newSign = new Signup({
             Username,
             Email, 
             Password,
             gender,
             status,
             hobbies:hobbies||[]});

        await newSign.save();
        res.status(201).json({ message: 'Sign up successfully', Signup: newSign });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating sign' });
    }
});

// Login Api
app.post('/api/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(400).json({ message: 'Email and password are required' });

        }
        // Find the signup email
        const existinguser = await Signup.findOne({ Email });
        if (!existinguser) {
            return res.status(400).json({ message: 'Invalid Email or password' });
        }
        // data matched check
        if(existinguser.Password!=Password){
            return res.status(400).json({message:'Invalid Password'});

        }
        res.status(200).json({message:'Login successful',user:existinguser});
    }
    catch (error) {
     console.error('Error during Login',error);
     res.status(500).json({message:'Error during Login'});
    }
})

// delete api 
app.delete('/api/delete/:id',async(req,res)=>{
    try{
    const{id}=req.params;
    // find user by id 
    const deleteduser =await Signup.findByIdAndDelete(id);
    if(!deleteduser){
        return res.status(400).json({message:'User not found'});
    }
    res.status(200).json({message:'User deleted successfully',user:deleteduser});
}
 catch(error){
    console.error('Error deleting user',error);
    res.status(500).json({message:'Error deleting user'});
 }
})

// get api
// Get API to fetch users with status 'Activ

app.get('/api/users/active',async(req,res)=>{
    try{
        const activeusers =await Signup.find({status:'Active'});
        if(activeusers.length===0){
            return res.status(404).json({message:'No Active Users'});
        }
        res.status(200).json({users:activeusers});
    }
    catch(error){
        console.error('getting error');
        res.status(500).json({message:"error"});
    }
});
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})