var db = require('../db');
var md5 = require('md5');
var Matiere = {
    getusers: function(callback)
    {
        return db.query('SELECT lt_users.ID,userRole,userName,loginName,password,notes,status,createdDate,lastLogin,roleName,createdBy,lt_betsettings.`ID` as betSettingId, lt_betsettings.cricket,lt_betsettings.fancyMarkets,lt_betsettings.exchRuns,lt_betsettings.football,lt_betsettings.Tennis,lt_betsettings.horseRacing,lt_betsettings.greyhoundRacing,lt_betsettings.casino, lt_positiontaking.`ID` as positionTakingId, `sport` as posSport, lt_positiontaking.`cricket` as posCricket, lt_positiontaking.`football` as posFootball, lt_positiontaking.`tennis` as posTennis, lt_positiontaking.`horseRacing` as posHorseRacing, lt_positiontaking.`greyhoundRacing` as posGreyhoundRacing, lt_positiontaking.`casino` as posCasino, (select creditLimit from lt_creditlimit where lt_creditlimit.userId=lt_users.ID ORDER by `lt_creditlimit`.`createdDate` DESC LIMIT 1) as creditLimit ,(select paymentThreshould from lt_creditlimit where lt_creditlimit.userId=lt_users.ID ORDER by `lt_creditlimit`.`createdDate` DESC LIMIT 1) as paymentThreshould,(select lt_creditlimit.ID from lt_creditlimit where lt_creditlimit.userId=lt_users.ID ORDER by `lt_creditlimit`.`createdDate` DESC LIMIT 1) as creditlimitId from lt_users INNER JOIN lt_userroles ON lt_userroles.ID=lt_users.userRole left join lt_betsettings ON lt_betsettings.userId=lt_users.ID         left join lt_positiontaking ON lt_positiontaking.userId=lt_users.ID where 1', callback);
    },  
    getUserMax: function(callback)
    {
        return db.query('SELECT userName from lt_users order by ID desc limit 1', callback);
    },
    createUser: function (Users, callback) {
        console.log("createUser");
        // username two input box value  
        userName1 = Users.userName1;
        userName2 = Users.userName2;
        //L9870405M fix string of user name 
        userName = "L9870405M-"+userName1+userName2;
        //get current  date
        var moment = require('moment');
        var formatted = moment().format('Y-M-D hh:mm:ss');   
        //insert user details        
        return db.query('Insert into lt_users(userName,loginName, userRole, password, notes, status,createdDate,lastLogin,createdBy) values(?, ?,?,?,?,?,?, ?, ?)',[userName, Users.loginName, Users.userRole, Users.password, Users.notes, Users.status,formatted,formatted,Users.addedBy],function(err, result) {
            console.log("createUser 1");
            if(!err){
                //add credit limit
                userId = result.insertId;
                db.query('Insert into lt_creditlimit(userId,creditLimit) values(?, ?)',[userId,Users.creditLimit]);
                if(Users.added_by_roleId!="1"){
                    //get addedby user credit limit
                    var total = Users.addedBy_Creditlimit-Users.creditLimit;
                    //update added by user credit
                    db.query('update lt_creditlimit set creditLimit='+total+' where userId='+Users.addedBy+' order by lt_creditlimit.createdDate desc limit 1');
                }

                db.query('INSERT INTO lt_betsettings(userId,cricket, fancyMarkets, exchRuns, football, Tennis, horseRacing, greyhoundRacing,casino) values(?, ?, ?, ?, ?, ?, ?, ?, ?)',[ userId, "", "", "", "", "", "", "", ""]);
                
                //add position taking
                db.query('INSERT INTO lt_positiontaking(userId,sport, cricket, football, tennis, horseRacing, greyhoundRacing, casino) values(?, ?, ?, ?, ?, ?, ?, ?)',[ userId, Users.agentPosition, Users.agentPosition, Users.agentPosition, Users.agentPosition, Users.agentPosition, Users.agentPosition, Users.agentPosition],callback);
                //return result;
            }else{
                //console.log("createUser 2");
                //return error
                return err;
            }          
        });        
    },
    checkCreditLimit:function (Users, callback) {
        return db.query('SELECT creditLimit from lt_creditlimit where userId='+Users.addedBy+' order by createdDate desc limit 1', callback);
    },
    getUpdateUserCreditLimit:function (Users, callback) {
        let where_con = ' 1';
        if(Users.userId>0){
            where_con = 'userId='+Users.userId+' order by createdDate desc limit 1';
        }
        return db.query('SELECT creditLimit,paymentThreshould,userId,lt_users.userName,lt_users.loginName,lt_users.password,lt_users.notes,lt_users.status,lt_users.createdDate from lt_creditlimit left join lt_users ON lt_users.ID=lt_creditlimit.userId where '+where_con, callback);
    },
    updateUser: function (Users, callback) {
        //console.log("update user data==="+JSON.stringify(Users.userId));
    //Update bet setting -         
        var str = "`cricket`='"+JSON.stringify(Users.cricket)+"',`fancyMarkets`='"+JSON.stringify(Users.fancyMarkets)+"',`exchRuns`='"+JSON.stringify(Users.exchRuns)+"',`football`='"+JSON.stringify(Users.football)+"',`Tennis`='"+JSON.stringify(Users.Tennis)+"',`horseRacing`='"+JSON.stringify(Users.horseRacing)+"',`greyhoundRacing`='"+JSON.stringify(Users.greyhoundRacing)+"',`casino`='"+JSON.stringify(Users.casino)+"'";        
        db.query('UPDATE `lt_betsettings` SET '+str+' WHERE  userId='+Users.userId);
        
    //Add New Credit limit   
        let new_creditLimit = Users.old_Creditlimit + parseInt(Users.creditLimit);     
        let total = Users.addedBy_Creditlimit-Users.creditLimit;        
        db.query('Insert into lt_creditlimit(userId,creditLimit,paymentThreshould) values(?, ?, ?)',[Users.userId,new_creditLimit,Users.paymentThreshould]);
        
    //update added by user cerdit limit
        if(Users.added_by_roleId!="1"){
            db.query('update lt_creditlimit set creditLimit='+total+' where userId='+Users.addedBy+' order by lt_creditlimit.createdDate desc limit 1');
        }
    //update position takiing 
        db.query('UPDATE `lt_positiontaking` SET `sport`='+Users.posSport+',`cricket`='+Users.posCricket+',`football`='+Users.posFootball+',`tennis`='+Users.posTennis+',`horseRacing`='+Users.posHorseRacing+',`greyhoundRacing`='+Users.posGreyhoundRacing+',`casino`='+Users.posCasino+' WHERE userId='+Users.userId);
    //update user password, status and notes
       return db.query('UPDATE `lt_users` set `password`="'+Users.password+'", `notes`="'+Users.notes+'", `status`="'+Users.status+'" where ID='+Users.userId,callback);
    },
    getuser: function(User,callback)
    {
        var moment = require('moment');
        var formatted = moment().format('Y-M-D hh:mm:ss');
        //console.log("user ID==="+JSON.stringify(User.userId))
        return db.query('SELECT lt_users.ID,lt_users.userName,lt_users.loginName,lt_users.password,lt_users.notes,lt_users.status,lt_users.createdDate,lt_users.lastLogin,lt_betsettings.`ID` as betSettingId, lt_betsettings.cricket,lt_betsettings.fancyMarkets,lt_betsettings.exchRuns,lt_betsettings.football,lt_betsettings.Tennis,lt_betsettings.horseRacing,lt_betsettings.greyhoundRacing,lt_betsettings.casino, lt_positiontaking.`ID` as positionTakingId, `sport` as posSport, lt_positiontaking.`cricket` as posCricket, lt_positiontaking.`football` as posFootball, lt_positiontaking.`tennis` as posTennis, lt_positiontaking.`horseRacing` as posHorseRacing, lt_positiontaking.`greyhoundRacing` as posGreyhoundRacing, lt_positiontaking.`casino` as posCasino, (select creditLimit from lt_creditlimit where lt_creditlimit.userId=lt_users.ID ORDER by `lt_creditlimit`.`createdDate` DESC LIMIT 1) as creditLimit ,(select paymentThreshould from lt_creditlimit where lt_creditlimit.userId=lt_users.ID ORDER by `lt_creditlimit`.`createdDate` DESC LIMIT 1) as paymentThreshould,(select lt_creditlimit.ID from lt_creditlimit where lt_creditlimit.userId=lt_users.ID ORDER by `lt_creditlimit`.`createdDate` DESC LIMIT 1) as creditlimitId from lt_users left join lt_betsettings ON lt_betsettings.userId=lt_users.ID         left join lt_positiontaking ON lt_positiontaking.userId=lt_users.ID where lt_users.ID='+User.userId+' ', callback);
    },
    login: function (Users, callback) {     
       // var password = md5(Users.password);  
        return db.query('SELECT * from lt_users where loginName="'+Users.userName+'" and password="'+Users.password+'"', callback);
    },
    getUserRoles: function(Users,callback)
    {
        var where_con = " 1";
        if(Users.roleId>0){
            where_con = " ID="+Users.roleId;
        }
        return db.query('SELECT * from lt_userroles where '+where_con, callback);
    },
    getUserPermission: function(Users,callback)
    {
        var where_con = " 1";
        if(Users.roleId>0){
            where_con = " roleId="+Users.roleId;
        }
        return db.query('SELECT * from lt_userpermissions where '+where_con, callback);
    },
    getPositionTakiing: function(Users,callback)
    {
        var where_con = " 1";
        if(Users.userId>0){
            where_con = " createdBy="+Users.userId;
        }
        return db.query('SELECT lt_users.ID,userRole,userName,loginName,password,notes,status,createdDate,lastLogin,createdBy,sport,cricket,football,tennis,horseRacing,greyhoundRacing,casino from lt_users inner join lt_positiontaking ON lt_positiontaking.userId=lt_users.ID where '+where_con, callback);
    },
    updatePositionTakiing: function(Users,callback)
    {
        //console.log("DAta==="+JSON.stringify(Users));        
        let userIds = Users.userIds;
        const userIds_arr = userIds.split(",");
        //console.log("userIds_arr==="+userIds_arr.length);
        for(var i=0;i<userIds_arr.length;i++){                
            if(i==(userIds_arr.length-1)){
                db.query('Update lt_positiontaking SET sport='+Users.sport+',cricket='+Users.sport+',football='+Users.sport+',tennis='+Users.sport+',horseRacing='+Users.sport+',greyhoundRacing='+Users.sport+',casino='+Users.sport+' where lt_positiontaking.userId='+userIds_arr[i],callback);
            }else{
                db.query('Update lt_positiontaking SET sport='+Users.sport+',cricket='+Users.sport+',football='+Users.sport+',tennis='+Users.sport+',horseRacing='+Users.sport+',greyhoundRacing='+Users.sport+',casino='+Users.sport+' where lt_positiontaking.userId='+userIds_arr[i]);
            }
        }
    },
    addStakes: function(Users,callback)
    {
        let stakes = Users.stake;
        const stakes_arr = stakes.split(",");
        for(var i=0;i<stakes_arr.length;i++){                
            if(i==(stakes_arr.length-1)){
                db.query('Insert into lt_stake(userId,stake,createdBy) values(?, ?, ?)',[Users.userId,stakes_arr[i],Users.addedBy],callback);
            }else{
                db.query('Insert into lt_stake(userId,stake,createdBy) values(?, ?, ?)',[Users.userId,stakes_arr[i],Users.addedBy]);
            }
        }
    },
    getStakes: function(Users,callback)
    {
        db.query('Select * from lt_stake where userId='+Users.userId,callback);      
    },
    addBetSlip: function(Users,callback)
    {        
        db.query('Insert into lt_betslip(odds, stakeId, liability, event, marketId, userId, betConfirm, createdBy) values(?, ?, ?, ?, ?, ?, ?, ?)',[Users.odds,Users.stakeId,Users.liability,Users.event,Users.marketId,Users.userId,Users.betConfirm,Users.createdBy],callback);            
    },
    getBetSlip: function(Users,callback)
    {
        db.query('Select lt_betslip.odds, lt_betslip.stakeId, lt_betslip.liability, lt_betslip.event, lt_betslip.marketId, lt_betslip.userId, lt_betslip.betConfirm, lt_betslip.createdBy,stake,lt_stake.ID as stakeId from lt_betslip inner join lt_stake ON lt_stake.ID=lt_betslip.stakeId where lt_betslip.userId='+Users.userId,callback);      
    },
}

module.exports = Matiere;