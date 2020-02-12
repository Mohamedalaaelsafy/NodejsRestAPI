const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const Doctor = require('../models/doctorSchema')







exports.profile = exports.register = (req , res , next)=>{
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
                        profile_image: req.file.path,
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

