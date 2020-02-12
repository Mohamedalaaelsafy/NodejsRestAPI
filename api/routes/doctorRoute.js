const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check_auth');

const doctorcontrollers = require('../controllers/doctorControl');


const doctorcontrollers1 = require('../controllers/docProfileControl');


const secretKey = require('secret-key');




const storage = multer.diskStorage({
    destination: function(req, file , cb){
        cb(null , './doctorimages/')
    },
    filename: function(req , file , cb){ 
        cb(null , file.fieldname + "-" + Date.now().toString() + "-" +file.originalname);
    }
});

const fileFilter = (req , file , cb)=>{
    // reject a file 
    if (file.mimeType === 'image/jpeg' || file.mimeType=== 'image/png') {
        cb(new Error('message') , true);
    }else{
        cb(null , false);
    }  
};

const upload = multer({
    storage: storage ,
    limits: {
    fileSize: 1024*1024 *5 //x 5 MB 
          },
         
 });



router.post('/signup', doctorcontrollers.register);

router.post('/profile', upload.single('profile_image') ,  doctorcontrollers1.profile);

router.post('/login' , doctorcontrollers.signin);

router.put('/:id' ,  doctorcontrollers.update);

router.delete('/:doctorId', doctorcontrollers.delete);

router.get('/:doctorId' , doctorcontrollers.getdoctorinfo);



router.post('/secret', (req , res , next)=>{

    console.log(secretKey.create('1EEA6DC-JAM4DP2-PHVYPBN-V0XCJ9X'));
});

router.get('/' , (req , res , next)=>{
    res.status(200).json({
        message: 'Mohamed Alaa El-Safy'
    })
})




module.exports = router;