const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const clientRoute = require('./api/routes/clientRoute');
const doctorRoute = require('./api/routes/doctorRoute');


 
mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://MohamedAlaa:'+ process.env.MONGO_ATLAS_PW + 
'@cluster0-6sqrj.mongodb.net/test?retryWrites=true&w=majority', 
 {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
 },
).
then(() => console.log('Connected')).
catch(err => console.log(err));

mongoose.Promise = global.Promise;


app.use(morgan('dev'));
app.use('/doctorimages', express.static('doctorimages'));
app.use('/clientimages',express.static('clientimages'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req , res , next)=>{
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Origin' , 'Origin, XRequested-With, Content_Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    } 
    next();
});

app.use('/client' , clientRoute); 
app.use('/doctor' , doctorRoute); 



app.use((req , res , next)=>{
    const error = new Error('Happy error');
    error.status = 404;
    next(error);
});

app.use((error , req , res , next)=>{
    res.status(error.status ||500);
    res.json({
        error: {
            message : error.message
        }
    });
});


module.exports = app;