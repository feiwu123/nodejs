var express = require('express');
var router = express.Router();
var server = new express();

server.use('/', router);

var nodeExcel = require('excel-export');

const disableLayout ={layout: false};

router.get('/test', function(req, res, next) {
    res.json({
        code:200
    })
})

// disable interface layout.hbs  user config layout: false
router.get('/exportExcel', function(req, res, next) {
    var conf ={};
    conf.stylesXmlFile = "styles.xml";
    conf.name = "mysheet";
    conf.cols = [{
        caption:'string',
        type:'string',
        beforeCellWrite:function(row, cellData){
            return cellData.toUpperCase();
        }
    },{
        caption:'date',
        type:'date',
        beforeCellWrite:function(){
            var originDate = new Date(Date.UTC(1899,11,30));
            return function(row, cellData, eOpt){
                console.log((cellData - originDate));
                if (eOpt.rowNum%2){
                    eOpt.styleIndex = 1;
                }
                else{
                    eOpt.styleIndex = 2;
                }
                if (cellData === null){
                    eOpt.cellType = 'string';
                    return 'N/A';
                } else
                    return (cellData - originDate) / (24 * 60 * 60 * 1000);
            }
        }()
    },{
        caption:'bool',
        type:'bool'
    },{
        caption:'number',
        type:'number'
    }];
    conf.rows = [
        ['pi', '2013-12-5', true, 3.14],
        ["e", new Date(2012, 4, 1), false, 2.7182],
        ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
        ["null date", null, true, 1.414]
    ];
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent("导出列表")+".xlsx");
    res.end(result, 'binary');
});

router.get('/exportmultisheetExcel', function(req, res, next) {
    var confs = [];
    var conf = {};
    conf.cols = [{
        caption: 'string',
        type: 'string'
    },
        {
            caption: 'date',
            type: 'date'
        },
        {
            caption: 'bool',
            type: 'bool'
        },
        {
            caption: 'number 2',
            type: 'number'
        }];
    conf.rows = [['hahai', (new Date(Date.UTC(2013, 4, 1))).oaDate(), true, 3.14], ["e", (new Date(2012, 4, 1)).oaDate(), false, 2.7182], ["M&M<>'", (new Date(Date.UTC(2013, 6, 9))).oaDate(), false, 1.2], ["null", null, null, null]];
    for (var i = 0; i < 3; i++) {
        conf = JSON.parse(JSON.stringify(conf));   //clone
        conf.name = 'sheet'+i;
        confs.push(conf);
    }
    var result = nodeExcel.execute(confs);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.end(result, 'binary');
});

server.get('/',function (req, res) {
    res.send('123');
})
var server=server.listen(3031,function(){
    console.log('3031')
})