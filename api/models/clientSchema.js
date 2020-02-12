const mongoose = require('mongoose');


const clientSchema = mongoose.Schema({
    _id             : mongoose.Schema.Types.ObjectId,
    firstname       : {type: String , required: true},
    lastname        : {type: String , required: true},
    email           : {type: String, required:true , unique: true},
    password        : {type: String , required: true},
    profile_image   : String,
    description     : String,
    phone_number    : {type: Number , default: 0},
    age             : {type: Number , default: 0},
    weight          : {type: Number , default: 0},
    length          : {type: Number , default: 0},
    location: { type: [Number], index: { type: '2dsphere', sparse: true}},
    city            : String,     
    heart_beat      : {type: Number , default: 0},
    blood_oxygen    : {type: Number , default: 0},
    temprature      : {type: Number , default: 0},
    blood_pressure  : {type: Number , default: 0},
    data            : {
                        type: Date ,
                        default: Date.now
                      }
    

})



module.exports = mongoose.model('Client' , clientSchema);