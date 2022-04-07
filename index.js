const express=require('express');
const mongoose=require('mongoose');
const User=require('./schema/user');
const Vendor=require('./schema/Man');
const Order=require('./schema/order');
const { request } = require('express');
const XLSX=require('xlsx');
const { path } = require('express/lib/application');
var fetcher;
var app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const uri = "mongodb+srv://taruneluri:taruneluri@cluster0.gkezw.mongodb.net/capstone?retryWrites=true&w=majority";
mongoose.connect(uri).then(()=>{console.log("DataBase Connected !!")});
const connection=mongoose.connection;
app.get('/',function(req,res){
    res.sendFile(__dirname+'/pages/index.html');
})
app.get('/login',function(req,res){
    res.sendFile(__dirname+'/pages/login.html');
})
app.get('/reg',function(req,res){
    res.sendFile(__dirname+'/pages/reg.html');
})
app.get('/dashboard/:email',function(req,res){
    fetcher=req.params.email;
    Order.findOne({cemail:fetcher},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            //console.log(result);
            res.sendFile(__dirname+'/pages/dashboard.html');      
        }
    })
})
app.get('/fetchorder',function(req,res){
    Order.findOne({cemail:fetcher},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("fetched !!")
            console.log(result);
            res.send(result);
        }
    })
})
app.get('/m',function(req,res){
    res.sendFile(__dirname+'/pages/manager/index.html');
})
app.get('/mlogin',function(req,res){
    res.sendFile(__dirname+'/pages/manager/login.html');
})
app.get('/mreg',function(req,res){
    res.sendFile(__dirname+'/pages/manager/reg.html');
})
app.get('/mdashboard',(req,res)=>{
    res.sendFile(__dirname+'/pages/manager/dashboard.html');
});
app.get('/newadd',(req,res)=>{
    res.sendFile(__dirname+'/pages/add.html');
});
app.get('/vUpdatePswd',(req,res)=>{
    res.sendFile(__dirname+'/pages/manager/update.html');
})
app.get('/paperupdate',(req,res)=>{
    res.sendFile(__dirname+'/pages/updatepaper.html')
})
app.post('/register',function(req,res){
    var a=req.body.fname;
    var b=req.body.lname;
    var c=req.body.location;
    var d=req.body.contact;
    var e=req.body.email;
    var f=req.body.pswd;
    User.findOne({mobileno:d,email:e},function(err,result){
        if(err)
        {
            console.log(err)
        }
        else{
            if(result==null)
            {
                User.create({
                    firstname:a,
                    lastname:b,
                    location:c,
                    mobileno:d,
                    email:e,
                    password:f
                },function(err){
                    if(err)
                    {
                        console.log(err);    
                    }
                    else{
                        console.log("Data Inserted!");
                        res.redirect('/newadd');
                    }
                })
            }
            else{
                res.redirect('/reg')
            }
        }
    });
});
app.post('/login',function(req,res){
    var f=req.body.pswd;
    var e=req.body.email;
    User.findOne({password:f,email:e},function(err,result){
        if(err)
        {
            console.log(err);
        }
        else{
            if(result==null)
            {
                res.redirect('/login')
                console.log("invalid User");
            }
            else
            {
                var temp=result.email;
                res.redirect('/dashboard/'+temp);
            }
        }
    })
});
app.post('/vreg',(req,res)=>{
    var a=req.body.vname;
    var b=req.body.Npname;
    var c=req.body.units;
    var d=req.body.vlocation;
    var e=req.body.vcontact;
    var f=req.body.vemail;
    var g=req.body.vpswd;
    var h=req.body.price;
    var i=req.body.desc;
    Vendor.findOne({vmail:f,mobile:e},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/mlogin');
        }
        else
        {
            if(result==null)
            {
                Vendor.create({
                    vname:a,
                    pname:b,
                    units:c,
                    location:d,
                    mobile:e,
                    vmail:f,
                    vpassword:g,
                    price:h,
                    pdesc:i
                },(err)=>{
                    if(err)
                    {
                        console.log(err);
                        res.redirect('/mreg');
                    }
                    else
                    {
                        console.log("vendor registered");
                        res.redirect('/mlogin')
                    }
                })
            }
        }
    })
});
app.post('/mlogin',(req,res)=>{
    var a=req.body.vemail;
    var b=req.body.vpswd;
    Vendor.findOne({vmail:a,vpassword:b},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/');
        }
        else
        {
            if(result==null)
            {
                console.log("invalid user !!");
                res.redirect('/mlogin');
            }
            else
            {
                console.log(result);
                res.redirect('/mdashboard');
            }
        }
    })
});
app.post('/check',(req,res)=>{
    const checkemail = req.body.oemail;
    const selection=req.body.i1;
    const startDate  = req.body.timefrom;
    const endDate    = req.body.timeto;
    const diffInMs   = new Date(endDate) - new Date(startDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    User.findOne({email:checkemail},(err,result)=>{
        if(err || result==null){
            console.log(err); 
            res.redirect('/newadd');
        }
        else
        {
            Vendor.findOne({pname:selection},(err,data)=>{
                if(err || result==null){
                    console.log(err);
                    res.redirect('/newadd');
                }
                else
                {
                    a(result,data);
                    res.redirect('/login');
                }
            })
        }
    })
    function a(udata,pdata)
    {
        Order.create({
            cname:udata.firstname,
            caddress:udata.location,
            cemail:udata.email,
            ccontact:udata.mobileno,
            cpaper:selection,
            cbill:(pdata.price * diffInDays),
            sdate:startDate,
            edate:endDate,
            nodays:diffInDays,
            vemail:pdata.vmail
        },(err)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log('order placed');
                
            }
        })
    }
})
app.get('/addfetch',(req,res)=>{
    Vendor.find({},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(result==null)
            {
                console.log("ADD page Null values!!");
            }
            else
            {
                console.log('fetched');
                res.send(result);
            }
        }
    })
});
app.post('/download',(req,res)=>{
    var confirm=req.body.demail;
    var wb=XLSX.utils.book_new();
    Order.find({vemail:confirm},(err,data)=>{
        if(err || data==null)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
            var temp = JSON.stringify(data);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'/public/exportdata.xlsx'
           XLSX.utils.book_append_sheet(wb,ws,"sheet1");
           XLSX.writeFile(wb,down);
           res.download(down);
        }
    })
});
app.post('/vUpdatePswd',(req,res)=>{
    var email=req.body.vumail;
    var mob=req.body.vumob;
    var cpswd=req.body.vcpswd;
    var npswd=req.body.vnpswd;
    Vendor.updateOne({vmail:email,mobile:mob,vpassword:cpswd},{vpassword:npswd},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.redirect('/vUpdatePswd')
        }
        else
        {
            if(result.upsertedId==null)
            {
                res.redirect('/vUpdatePswd')
            }
            else{
                console.log("vendor password update sucesss !!");
                console.log(result);
                res.redirect('/mdashboard')
            }            
        }
    })
})
app.listen(3000,()=>{console.log('Server Started !')});