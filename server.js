var express = require('express');
var fs = require('fs');
var querystring = require('querystring');
var app = express();
var mysql = require('mysql');
var pool = mysql.createPool({
    host : 'localhost',
    port : 3306,
    database : 'test',
    user : 'root',
    password : ''
});
app.get('/collector/import',function(req,res){
    res.writeHead(200,{'Content-Type' : 'text/html'});
    res.write('<head><meta charset="utf-8" /></head>');
    var file = fs.createReadStream('index.html');
    file.pipe(res);
})
app.post('/collector/import',function(req,res){
    req.on('data',function(data){
        var params = querystring.parse(data.toString());
        pool.getConnection(function(err,connection){
            if(err){
                console.log('与mysql数据库建立连接失败');
            }else{
                console.log('与mysql数据库建立连接成功');
                connection.query('insert into user set ?',{
                    name : params.name,
                    sex : params.sex,
                    age : params.age,
                    tel : params.tel
                },function(err,result){
                    if(err){
                        connection.release();
                        res.send('插入数据失败');
                    }else{
                        connection.release();
                        res.send('插入数据成功');
                    }
                })
            }
        })
    })
})
app.listen(1337,'127.0.0.1',function(){
    console.log('服务器正在监听');
})