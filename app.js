var mongoose = require('mongoose');
var express = require('express');
var faker  = require('faker');
var path   = require('path');
var dataModel = require('./models/data');
var XLSX = require('xlsx');

//connect to db
mongoose.connect('mongodb://localhost:27017/exportExcel',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log('error in connection',err));

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//set the static folder path
app.use(express.static(path.resolve(__dirname,'public')));

//default page
app.get('/',(req,res)=>{
    dataModel.find((err,data)=>{
             if(err){
                console.log(err)
             }else{
                 if(data!=''){
                     res.render('home',{data:data});
                 }else{
                     res.render('home',{data:''});
                 }
             }
    })
});

//generate fake data using faker and save it in db
app.post('/',(req,res)=>{
    for(var i=1;i<=100;i++){
        var data = new dataModel({
            firstname:faker.name.firstName(),
            lastname:faker.name.lastName(),
            phno:faker.phone.phoneNumber(),
            city:faker.address.city(),
            state:faker.address.state(),
            country:faker.address.country()
        });
        data.save((err,data)=>{
            if(err){
                console.log(err)
            }
        })
    }
    res.redirect('/')
});

app.post('/exportdata',(req,res)=>{
    var wb = XLSX.utils.book_new(); //new workbook
    dataModel.find((err,data)=>{
        if(err){
            console.log(err)
        }else{
            var temp = JSON.stringify(data);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'/public/exportdata.xlsx'
           XLSX.utils.book_append_sheet(wb,ws,"sheet1");
           XLSX.writeFile(wb,down);
           res.download(down);
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at '+port));

