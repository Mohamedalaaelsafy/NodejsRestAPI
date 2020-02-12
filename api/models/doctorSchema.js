const mongoose = require('mongoose');


const doctorSchema =  new mongoose.Schema({
    _id            : mongoose.Schema.Types.ObjectId,
    firstname      : {type: String , required: true},
    lastname       : {type: String , required: true , lowercase: true},
    email          : {type: String, required:true , unique: true},
    password       : {type: String , required: true},
    profile_image  : {type: String , default: 'no image set'},
    description    : {type: String , default: 'No description added'},
    Specialty      : {type: String , default: 'have no Specialty'},
    location       : { type: [Number], index: { type: '2dsphere', sparse: true}},
    city           : String, 
    phone_number   : {type: Number },
    date           : {
                       type: Date,
                       default: Date.now
                     } 

})




module.exports = mongoose.model('Doctor' , doctorSchema);