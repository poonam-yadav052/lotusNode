var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Matiere = require('./Matiere');

router.get('/getUsers/', function (req, res) {
    Matiere.getusers(function(err,rows){
        if(err) {
            res.status(400).json({messege:"Fail",result:err});
        }
        else
        {
            res.json({messege:"Success",result:rows});
        }
    });
});

router.get('/getUser/', function (req, res) {    
    console.log("getUser req==="+JSON.stringify(req.query));
    Matiere.getuser(req.query,function(err,rows){
        if(err) {
            res.status(400).json({messege:"Fail",result:err});
        }
        else
        {
            res.json({messege:"Success",result:rows});
        }
    });
});

router.get('/getUserMax/', function (req, res) {    
    Matiere.getUserMax(function(err,rows){
        if(err) {
            res.status(400).json({messege:"Fail",result:err});
        }
        else
        {
            res.json({messege:"Success",result:rows});
        }
    });
});

router.get('/getUserRoles/', function (req, res) {    
    Matiere.getUserRoles(req.query,function(err,rows){
        if(err) {
            res.status(400).json({messege:"Fail",result:err});
        }
        else
        {
            res.json({messege:"Success",result:rows});
        }
    });
});

router.get('/getUserPermission/', function (req, res) {    
    Matiere.getUserPermission(req.query,function(err,rows){
        if(err) {
            res.status(400).json({messege:"Fail",result:err});
        }
        else
        {
            res.json({messege:"Success",result:rows});
        }
    });
});

router.get('/getCeditLimit/', function (req, res) {   
    console.log("query==="+JSON.stringify(req.query)); 
    Matiere.getUpdateUserCreditLimit(req.query,function(err,rows){
        if(err) {
            res.status(400).json({messege:"Fail",result:err});
        }
        else
        {
            res.json({messege:"Success",result:rows});
        }
    });
});

router.post('/saveUser/', function (req, res) {
    console.log("req==="+JSON.stringify(req.body));    
    if(req.body.added_by_roleId=="1"){
        Matiere.createUser(req.body,function(err,count){
            console.log("INN=1==");
            if(err)
            {
                res.status(400).json({messege:"Fail",result:err});
            }
            else{
                res.json({messege:"Success",result:count});
            }
        });
    }else{
        if(req.body.added_by_roleId=="5"){
            res.status(400).json({messege:"Success",result:"User not allow to add credit limit"});
        }else{
            Matiere.checkCreditLimit(req.body,function(err1,result){
                //console.log("result==="+JSON.stringify(result[0].creditLimit));
                //console.log("req.body.creditLimit=="+(result[0].creditLimit)+"===="+parseInt(req.body.creditLimit));
                if(parseInt(result[0].creditLimit)>=parseInt(req.body.creditLimit)){
                    //console.log("INN===");
                    req.body.addedBy_Creditlimit = parseInt(result[0].creditLimit);
                    Matiere.createUser(req.body,function(err,count){
                        //console.log("INN=1==");
                        if(err)
                        {
                            res.status(400).json({messege:"Fail",result:err});
                        }
                        else{
                            res.json({messege:"Success",result:count});
                        }
                    });
                }else{
                    res.json({messege:"Success",result:"credit_limit_not_available"});
                }
            }); 
        } 
    }     
});

router.post('/updateUser/', function (req, res) {
    //console.log("req update==="+JSON.stringify(req.body));
    if(req.body.added_by_roleId=="1"){
        Matiere.getUpdateUserCreditLimit(req.body,function(err,result1){
            req.body.old_Creditlimit = parseInt(result1[0].creditLimit);
            Matiere.updateUser(req.body,function(err,count){
                if(err)
                {
                    res.status(400).json({messege:"Fail",result:err});
                }
                else{
                    res.json({messege:"Success",result:count});
                }
            });
        });
    }else{
        if(req.body.added_by_roleId=="5"){
            res.json({messege:"Success",result:"User not allow to add credit limit"});
        }else{
            Matiere.checkCreditLimit(req.body,function(err,result){
                if(err)
                {
                    res.status(400).json({messege:"Fail",result:err});
                }
                else{
                    //res.json(count);
                    console.log("result==="+JSON.stringify(result[0].creditLimit));
                    console.log("req body creditLimit=="+(result[0].creditLimit)+"===="+parseInt(req.body.creditLimit));
                    if(parseInt(result[0].creditLimit)>=parseInt(req.body.creditLimit)){                       
                        console.log("INN===");
                        req.body.addedBy_Creditlimit = parseInt(result[0].creditLimit);
                        Matiere.getUpdateUserCreditLimit(req.body,function(err,result1){
                            req.body.old_Creditlimit = parseInt(result1[0].creditLimit);
                            Matiere.updateUser(req.body,function(err,count){
                                if(err)
                                {
                                    res.status(400).json({messege:"Fail",result:err});
                                }
                                else{
                                    res.json({messege:"Success",result:count});
                                }
                            });
                        });                
                    }else{
                        res.json({messege:"Success",result:"credit_limit_not_available"});
                    }
                }
            }); 
        }
    }
});

router.post('/login/', function (req, res) {
    console.log("req update==="+JSON.stringify(req.body));
    if(req.body.userName!="" && req.body.passord!=""){
        Matiere.login(req.body,function(err,rows){
            if(err)
            {
                res.status(400).json({messege:"Fail",result:err});
            }
            else{
                if(rows.length>0){
                res.json({messege:"Success",result:rows});
                }else{
                    res.json({messege:"Success",result:"Invalid login details!"});
                }
            }
        });
    }else{
        res.json({messege:"Success",result:"User Name and Password can not be empty!"});
    }
});

router.get('/getPositionTakiing/', function (req, res) {
    //console.log("req getPositionTakiing==="+JSON.stringify(req.query));
    if(req.query.userId!=""){
        Matiere.getPositionTakiing(req.query,function(err,rows){
            if(err)
            {
                res.status(400).json({messege:"Fail",result:err});
            }
            else{               
                res.json({messege:"Success",result:rows});               
            }
        });
    }else{
        res.json({messege:"Success",result:"User userId can not be empty!"});
    }
});

router.post('/updatePositionTakiing/', function (req, res) {
    //console.log("req getPositionTakiing==="+JSON.stringify(req.query));
    
    Matiere.updatePositionTakiing(req.body,function(err,rows){
        if(err)
        {
            res.status(400).json({messege:"Fail",result:err});
        }
        else{               
            res.json({messege:"Success",result:rows});               
        }
    });    
});

router.post('/addStakes/', function (req, res) {
    //console.log("req getPositionTakiing==="+JSON.stringify(req.query));    
    Matiere.addStakes(req.body,function(err,rows){
        if(err)
        {
            res.status(400).json({messege:"Fail",result:err});
        }
        else{               
            res.json({messege:"Success",result:rows});               
        }
    });    
});

router.get('/getStakes/', function (req, res) {
    //console.log("req getPositionTakiing==="+JSON.stringify(req.query));    
    Matiere.getStakes(req.query,function(err,rows){
        if(err)
        {
            res.status(400).json({messege:"Fail",result:err});
        }
        else{               
            res.json({messege:"Success",result:rows});               
        }
    });    
});

router.post('/addBetSlip/', function (req, res) {
    //console.log("req getPositionTakiing==="+JSON.stringify(req.query));    
    Matiere.addBetSlip(req.body,function(err,rows){
        if(err)
        {
            res.status(400).json({messege:"Fail",result:err});
        }
        else{               
            res.json({messege:"Success",result:rows});               
        }
    });    
});

router.get('/getBetSlip/', function (req, res) {
    //console.log("req getPositionTakiing==="+JSON.stringify(req.query));    
    Matiere.getBetSlip(req.query,function(err,rows){
        if(err)
        {
            res.status(400).json({messege:"Fail",result:err});
        }
        else{               
            res.json({messege:"Success",result:rows});               
        }
    });    
});

module.exports = router;