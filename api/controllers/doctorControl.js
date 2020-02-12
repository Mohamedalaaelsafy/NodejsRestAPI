const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');


const Doctor = require('../models/doctorSchema')






exports.register = (req , res , next)=>{
    Doctor.find({email: req.body.email})
    .exec()
    .then(doctor=>{
        if(doctor.length >= 1){
            return res.status(409).json({
                message: 'email has been exist'
            })
            
        }else{
            
            bcrypt.hash(req.body.password , 10 , (err , hash)=>{
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                 
                } else  {
                    const doctorinfo = new Doctor({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                        description: req.body.description,
                        specialty: req.body.specialty,
                        location: req.body.location,
                        city:  req.body.city,
                        phone_number: req.body.phone_number,
                        date: req.body.date
                       
                    })
                    jwt.sign({doctorinfo}, 'secretkey', (err , token)=>{
                        if (err) {

                            res.status(409).json({error:err})
                            
                        }
                        doctorinfo.save()
                        .then(result =>{
                            
                            console.log(result);
                            
                            res.status(201).json({
                                message: 'User Created',
                                doctor:doctorinfo,
                                token: token
                                
                            })
                            console.log(token);
                        })
                        .catch(err=>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            })
                        })
                    })
                 
                }
            })
        }
    })
}




exports.signin =  (req , res ,  next)=>{
    Doctor.find({email: req.body.email})
    .exec()
    .then(doctor =>{
        if (doctor.length < 1) {
            return res.status(401).json({
                message:'Auth Failed'
            });
        } 
        bcrypt.compare(req.body.password , doctor[0].password , (err , result)=>{
            if(err){
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            if (result) {
                const token = jwt.sign(
                {
                    email: doctor[0].email,
                    doctorId: doctor[0]._id
                },
                process.env.JWT_KEY ,
                {
                    expiresIn: "1h"
                }
                
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                })
            }
              res.status(401).json({
                message: 'Auth Failed'
            });
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};



exports.update = function(req , res){
    var conditions = {_id: req.params.id};

    Doctor.update(conditions , req.body)
    .then(doc=>{
        if (!doc) {
            return res.status(409).end();
        }
        return res.status(200).json({
            message: 'Profile updated'
        })
    })
    .catch(err=>{
        console.log(err);
    })
}



exports.delete = (req , res , next)=>{
    Doctor.remove({_id: req.params.doctorId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.getdoctorinfo =  (req , res  , next)=>{
    const id = req.params.doctorId;
    Doctor.findById(id)
    .select('firstname lastname email _id profile_image')
    .exec()
    .then(doc=>{        
        if (doc) {
            console.log('from the database',doc);
        } else {
            console.log('invalid ID')
        }
           
            if (doc) {
                res.status(200).json({
                    doctor: doc,
                    
                });  
            } else {
                res.status(404).json({message: 'err'})
            }
           
        })
         .catch(err =>{ 
            console.log(err);
            res.status(500).json({error: err})
         });
}


