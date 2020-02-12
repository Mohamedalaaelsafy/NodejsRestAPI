const express = require('express');
const router =  express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check_auth');

const clientcontrollers = require('../controllers/clientControl')
const clientcontrollers1 = require('../controllers/clientProfileControl')




const storage = multer.diskStorage({
    destination: function(req, file , cb){
        cb(null , './clientimages/')
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




router.post('/signup'  ,clientcontrollers.register);

router.post('/profile' , upload.single('profile_image') ,clientcontrollers1.profile);

router.post('/login' , clientcontrollers.Login);

router.put('/:id' , clientcontrollers.Update);

router.get('/:clientId' ,clientcontrollers.GetUserInfo);

router.delete('/:clientId' ,clientcontrollers.DeleteUser);

router.get('/' , (req , res , next)=>{
    res.status(200).json({
        message: 'Omar Hesham Lemon'
    })
})






module.exports = router;