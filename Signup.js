const express =require('express');
const mongoose= require('mongoose');
const bodyParser=require('body-parser');
 
const app=express();
app.use(bodyParser.json());

const mongoURI ='mongodb://localhost:27017/CRM';

mongoose.connect(mongoURI)
.then(()=>
console.log('Mongodb is connected Successfully'))

.catch((error)=>
console.log('error'));

const signSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true

    },
    Password:{
        type:String,
        required:true,

    },
})
const Signup =mongoose.model('Signup',signSchema);

app.post('/api/signup',async(req,res)=>{
    try{
        const{Username,Email,Password}=req.body;

        if(!Username||!Email||!Password){
            return res.status(400).json({message:'All fields are Required'});
        }
        const newSign= new Signup({Username,Email,Password});

        await newSign.save();
        res.status(201).json({message:'Sign up successfully'});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Error creating sign'});
    }
});
const PORT=3002;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})