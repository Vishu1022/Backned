const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017/Form';
mongoose.connect(mongoURI)
    .then(() =>
        console.log("mongodb is conneceted successfully")
    )
    .catch((error) =>
        console.log('Error'));

const formSchema = new mongoose.Schema({
    Mobile: {
        type: String,
        required: true,
        unique: true,
    },
    Name: {
        type: String,
        required: true,

    },
    

})
const Form = mongoose.model('Form', formSchema);

// Signup api 
app.post('/api/signup', async(req, res) => {
    try {
        const { Mobile, Name } = req.body;

        if (!Mobile || !Name) {
            return res.status(400).json({ message: 'All fields are required' });
        }
       const User= new Form({
        Mobile,
        Name,
        
       });

       await User.save();
       return res.status(200).json({message:'Signup successfully',Form:User});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error creating user"});

    }
});
// get api 
app.get('api/getdata',async(req,res)=>{
    try{
        const Data=await Form.find();
        return res.status(200).json({message:'Data fetched successfully',Data:Form});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:'Fetching data error'});
    }
})


const PORT = 3003;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})