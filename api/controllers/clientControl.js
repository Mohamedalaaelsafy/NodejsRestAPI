const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const Client = require('../models/clientSchema');










exports.register = (req , res , next)=>{    
    Client.find({email: req.body.email})
    .exec()
    .then(client=>{
        if(client.length >= 1){
            return res.status(409).json({
                message: 'email has been exist'
            })
            
        }else{
            
            bcrypt.hash(req.body.password , 10 , (err , hash)=>{
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                 
                } else {
                    const client = new Client({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                        description: req.body.description,
                        phone_number: req.body.phone_number,
                        age: req.body.age,
                        weight: req.body.weight ,
                        length: req.body.length,
                        location: req.body.location,
                        city: req.body.city,
                        heart_beat         : req.body.heart_beat,
                        blood_oxygen       : req.body.blood_oxygen,
                        temprature         : req.body.temprature,
                        blood_pressure     : req.body.blood_oxygen,
                        date               : req.body.date
                       
                    })
                    jwt.sign({client}, 'secretkey', (err , token)=>{
                        if (err) {

                            res.status(409).json({error:err})
                            
                        }
                        client.save()
                        .then(result =>{
                            
                            console.log(result);
                            res.status(201).json({
                                message: 'User Created',
                                client: client,
                                token: token
                                
                            })
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


exports.Update = function(req , res){
    var conditions = {_id: req.params.id};

    Client.update(conditions , req.body)
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



exports.Login =  (req , res ,  next)=>{
    Client.find({email: req.body.email})
    .exec()
    .then(client =>{
        if (client.length <1) {
            return res.status(401).json({
                message:'Auth Failed'
            }),
            console.log('1st');
        } 
        bcrypt.compare(req.body.password , client[0].password , (err , result)=>{
            if(err){
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            if (result) {
                const Token =jwt.sign(
                 {
                    email: client[0].email,
                    clientId: client[0]._id,
                    
                },
            
                process.env.WT_KEY ,
                
                {
                    expiresIn: "1h"
                },
                
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: Token
                }),
                console.log('3st');
            }
            return res.status(401).json({
                message: 'Auth Failed'
            });
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}


exports.DeleteUser =(req , res , next)=>{
    Client.remove({_id: req.params.clientId})
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


exports.GetUserInfo = (req , res  , next)=>{
    const id = req.params.clientId;
    Client.findById(id)
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
                    product: doc,
                    
                });  
            } else {
                res.status(404).json({message: 'Sorry...We have no data for this productID'})
            }
           
        })
         .catch(err =>{ 
            console.log(err);
            res.status(500).json({error: err})
         });
}