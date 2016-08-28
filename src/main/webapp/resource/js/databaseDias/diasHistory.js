var DiasHistory = {
    currentCiId:undefined,/*1000000000662,*/
    mainFrameCiId:undefined,
    //currentServer:"itmtest",
    GET_RES_EXPEND_CHART:10005011,
    DBID:undefined,
    INSTANCE_NUMBER:undefined,
    BEGIN_SNAP_ID:undefined,
    END_SNAP_ID:undefined,
    BATCH_ID : undefined,
    GET_ELAPSE_TIME_TB:{ctrlId:10005021,tableId:"elapsedList",windowId:"elapsedWindow",windowTitle:"elapsed",
        column:['SQL_ID','CPUTIME','ELAPSED','EXECUTIONS','elapsed/exec','DB_Time','MODULE','SQL_TEXT']
    },
    GET_CPU_TIME_TB:{ctrlId:10005022,tableId:"cpuList",windowId:"cpuWindow",windowTitle:"cpu",
        column:['SQL_ID','CPUTIME','ELAPSED','EXECUTIONS','ELAPSED_EXEC','DB_TIME','MODULE','SQL_TEXT']
    },
    GET_GETS_TB:{ctrlId:10005023,tableId:"getsList",windowId:"getsWindow",windowTitle:"gets",
        column:['SQL_ID','BGET','EXEC','GETS_EXEC','TOTAL_GETS','CPUTIME','ELAPSED','MODULE','SQL_TEXT']
    },
    GET_READS_TB:{ctrlId:10005024,tableId:"readsList",windowId:"readsWindow",windowTitle:"reads",
        column:['SQL_ID','DSKR','EXEC','READS_EXEC','TOTAL_READS','CPUTIME','ELAPSED','MODULE','SQL_TEXT']
    },
    GET_PARSE_CALLS_TB:{ctrlId:10005025,tableId:"parseCallsList",windowId:"parseCallsWindow",windowTitle:"reads",
        column:['SQL_ID','PRSC','EXEC','TOTAL_PARSECALLS','MODULE','SQL_TEXT']
    },
    //GET_SHARABLE_MEMORY_TB:{ctrlId:10005026,tableId:""},
    //GET_VERSION_COUNT_TB:{ctrlId:10005027,tableId:""},
    //GET_CLUSTER_WAITE_TIME_TB:{ctrlId:10005028,tableId:""},
    //GET_EXECUTIONS:{ctrlId:10005029,tableId:""},
    GET_TOP_EVENT_TB:{ctrlId:10005012,column:['WAIT_CLASS','PCTWTT','TIME','AVGWT','WAITS','EVENT']},
    GET_TOP_EVENT_SQL:10005013,
    GET_SQL_TEXT:10005002,
    oTopEventTable:undefined,
    sTime : undefined,
    eTime : undefined
};

// 控制命令 id 配置
var CTRL_COL_CFG = {
    DBID: 10005066,
    INSTANCE_NUMBER: 10005067,
    BEGIN_SNAP_ID: 10005068,
    END_SNAP_ID: 10005069
};

$(document).ready(function(){
    DiasHistory.urlParam = getUrlParam();
    DiasHistory.sTime = getParamData(DiasHistory.urlParam.sTime);
    DiasHistory.eTime = getParamData(DiasHistory.urlParam.eTime);

    DiasHistory.DBID = DiasHistory.urlParam.dbid;
    DiasHistory.INSTANCE_NUMBER = DiasHistory.urlParam.instance_number;
    DiasHistory.BEGIN_SNAP_ID = DiasHistory.urlParam.begin_snap_ID;
    DiasHistory.END_SNAP_ID = DiasHistory.urlParam.end_snap_id;
    DiasHistory.BATCH_ID = DiasHistory.urlParam.batchId;

    DiasHistory.currentCiId = DiasHistory.urlParam.oraInstanceId;

    $("#sTime").val(DiasHistory.sTime);
    $("#eTime").val(DiasHistory.eTime);

    getResExpendChart();
    getTopEventTable();
});

function getResExpendChart(){
    var params = new Array();
    params.push("DBID="+DiasHistory.DBID);
    params.push("INSTANCE_NUMBER="+DiasHistory.INSTANCE_NUMBER);
    params.push("BEGIN_SNAP_ID="+DiasHistory.BEGIN_SNAP_ID);
    params.push("END_SNAP_ID="+DiasHistory.END_SNAP_ID);
    DiasCtrlMsg.sendCtrlMsg(DiasHistory.currentCiId,DiasHistory.GET_RES_EXPEND_CHART,
        resExpendChartCallback,params,DiasHistory.BATCH_ID);
}

function resExpendChartCallback(retrunXmlhttp){
    if (retrunXmlhttp.readyState == 4) {
        var flashWidth = document.body.clientWidth * 0.85;
            var jsonData = DiasCtrlMsg.parseJson(retrunXmlhttp.responseText);
            if (DiasCtrlMsg.isError(jsonData)) {
                var chartJson = createChartJson(jsonData);
                var perfChart = new FusionCharts("/resource/fusion_charts/swf/MSLine.swf",
                    "resCountChart", flashWidth, "280", "0");
                perfChart.setJSONData(chartJson);
                perfChart.render("resCountChartDiv");
            }
            else {
                //错误处理
                //doError();
                alert("读取控制命令返回结果发生错误！");
            }
    }
}

function createChartJson(json) {
    var items = json.items[0].oriValue;
    var chartJson = {};
    chartJson.chart = {
        "caption": "资源消耗图",
        "xaxisname":"SNAP ID",
        "yaxisname":"CPU TIME",
        "showvalues":"0",
        "labelStep" : "1"
    };
    var category = new Array();

    var cpuCountData = new Array();
    var dbTimeData = new Array();
    var dbCpuData = new Array();

    for (var i = 0; i < items.length; i++) {
        category.push({"label": items[i].SNAP_ID});
        cpuCountData.push({"value": items[i].CPU_COUNT});
        dbTimeData.push({"value": items[i].DB_TIME_VAL});
        dbCpuData.push({"value": items[i].DB_CPU_VAL});
    }

    chartJson.categories ={category: new Array()};
    chartJson.categories.category.push(category);

    chartJson.dataset = new Array();
    var set = {
        "seriesname": "CPU COUNT",
        "data": cpuCountData};
    chartJson.dataset.push(set);

    set = {
        "seriesname": "DB TIME",
        "data": dbTimeData};
    chartJson.dataset.push(set);

    set = {
        "seriesname": "DB CPU",
        "data": dbCpuData};
    chartJson.dataset.push(set);
    return chartJson;
}

function showTable(type) {
    var ctrlColId,tableId,windowId,windowTitle,tableCols;
    if (type == "elapsed") {
        ctrlColId = DiasHistory.GET_ELAPSE_TIME_TB.ctrlId;
        tableId = DiasHistory.GET_ELAPSE_TIME_TB.tableId;
        windowId = DiasHistory.GET_ELAPSE_TIME_TB.windowId;
        windowTitle = DiasHistory.GET_ELAPSE_TIME_TB.windowTitle;
        tableCols = DiasHistory.GET_ELAPSE_TIME_TB.column;
    }else if(type == "cpu"){
        ctrlColId = DiasHistory.GET_CPU_TIME_TB.ctrlId;
        tableId = DiasHistory.GET_CPU_TIME_TB.tableId;
        windowId = DiasHistory.GET_CPU_TIME_TB.windowId;
        windowTitle = DiasHistory.GET_CPU_TIME_TB.windowTitle;
        tableCols = DiasHistory.GET_CPU_TIME_TB.column;
    }else if(type == "gets"){
        ctrlColId = DiasHistory.GET_GETS_TB.ctrlId;
        tableId = DiasHistory.GET_GETS_TB.tableId;
        windowId = DiasHistory.GET_GETS_TB.windowId;
        windowTitle = DiasHistory.GET_GETS_TB.windowTitle;
        tableCols = DiasHistory.GET_GETS_TB.column;
    }else if(type == "reads"){
        ctrlColId = DiasHistory.GET_READS_TB.ctrlId;
        tableId = DiasHistory.GET_READS_TB.tableId;
        windowId = DiasHistory.GET_READS_TB.windowId;
        windowTitle = DiasHistory.GET_READS_TB.windowTitle;
        tableCols = DiasHistory.GET_READS_TB.column;
    }else if(type == "parseCalls"){
        ctrlColId = DiasHistory.GET_PARSE_CALLS_TB.ctrlId;
        tableId = DiasHistory.GET_PARSE_CALLS_TB.tableId;
        windowId = DiasHistory.GET_PARSE_CALLS_TB.windowId;
        windowTitle = DiasHistory.GET_PARSE_CALLS_TB.windowTitle;
        tableCols = DiasHistory.GET_PARSE_CALLS_TB.column;
    }
    getNoSqlTable(ctrlColId,tableId,windowId,windowTitle,tableCols);
}

function getNoSqlTable(ctrlColId,tableId,windowId,windowTitle,tableCols) {
    var params = new Array();
    params.push("DBID=" + DiasHistory.DBID);
    params.push("INST_NUM=" + DiasHistory.INSTANCE_NUMBER);
    params.push("BEGIN_SNAP_ID=" + DiasHistory.BEGIN_SNAP_ID);
    params.push("END_SNAP_ID=" + DiasHistory.END_SNAP_ID);

    var oTabObj = createTableAjax($('#'+tableId), tableCols,DiasHistory.currentCiId, ctrlColId, params, DiasHistory.BATCH_ID);

    $("#"+windowId)[0].title = windowTitle + " 表格";
    $('#'+windowId).dialog({
        buttons: [
            {
                text: "关闭",
                handler: function () {
                    $.fn.dialog.close($('#'+windowId));
                }
            }
        ]
    });
    
    $("#"+tableId + " tbody tr").click(function (e) {
        if ($(this).hasClass('row_selected')) {
            $(this).removeClass('row_selected');
        }
        else {
            $("#"+tableId +' tr.row_selected').removeClass('row_selected');
            $(this).addClass('row_selected');
        }
    });
    $("#"+ tableId +' tbody td').live('click', function () {
        var tabNode = this.parentNode.parentNode.parentNode;
        if(tabNode==null || tabNode.id!=tableId) {
            return false;
        }
        var openRows = isOpened(oTabObj);
        if (openRows != null) {
            for (var i = 0; i < openRows.length; i++) {
            	oTabObj.fnClose(openRows[i].nParent);
            }
        }

        var nTr = $(this).parents('tr')[0];
        var aData = oTabObj.fnGetData(nTr);
        if (!aData) return false;
        if(!aData["SQL_ID"]){
            alert("没有查询到SQL_ID");
            return false;
        }
        var params = new Array();
        params.push("sql_id="+aData["SQL_ID"]);
        var strJson = DiasCtrlMsg.sendCtrlMsgSync(DiasHistory.currentCiId,DiasHistory.GET_SQL_TEXT,params);
        var jsonData = DiasCtrlMsg.parseJson(strJson);
        if(jsonData && jsonData.items[0].oriValue[0]){
        	oTabObj.fnOpen(nTr, fnFormatDetails(oTabObj, nTr,
                jsonData.items[0].oriValue[0].SQL_TEXT,jsonData.items[0].oriValue[1].SQL_TEXT,aData["SQL_ID"]), 'details');
        }else{
            alert("没有查询到SQL语句！");
        }
    });
}

function getTopEventTable() {
    var params = new Array();
    params.push("DBID=" + DiasHistory.DBID);
    params.push("INST_NUM=" + DiasHistory.INSTANCE_NUMBER);
    params.push("BEGIN_SNAP_ID=" + DiasHistory.BEGIN_SNAP_ID);
    params.push("END_SNAP_ID=" + DiasHistory.END_SNAP_ID);

    var oTop5Table = createTableAjax($('#topEventTable'), DiasHistory.GET_TOP_EVENT_TB.column,
                DiasHistory.currentCiId, DiasHistory.GET_TOP_EVENT_TB.ctrlId, params, DiasHistory.BATCH_ID);

    $("#topEventTable tbody tr").click(function (e) {
        if ($(this).hasClass('row_selected')) {
            $(this).removeClass('row_selected');
        }
        else {
            $('#topEventTable tr.row_selected').removeClass('row_selected');
            $(this).addClass('row_selected');
        }
    });

    $('#topEventTable tbody td').live('click', function () {
        var tabNode = this.parentNode.parentNode.parentNode;
        if(tabNode==null || tabNode.id!="topEventTable") {
            return false;
        }
        var openRows = isOpened(oTop5Table);
        if (openRows != null) {
            for (var i = 0; i < openRows.length; i++) {
                oTop5Table.fnClose(openRows[i].nParent);
            }
        }

        ////////////////
        var nTr = $(this).parents('tr')[0];
        var aData = oTop5Table.fnGetData(nTr);
        if (!aData) return false;
        if(!aData["EVENT"]){
            alert("没有查询到EVENT");
            return false;
        }
        var params = new Array();
        params.push("EVENT_NAME="+aData["EVENT"]);
        params.push("BEGIN_SNAP_ID="+DiasHistory.sTime);
        params.push("END_SNAP_ID="+DiasHistory.eTime);
        var strJson = DiasCtrlMsg.sendCtrlMsgSync(DiasHistory.currentCiId,DiasHistory.GET_TOP_EVENT_SQL,params);
        var jsonData = DiasCtrlMsg.parseJson(strJson);
        if(!jsonData) {
            alert("获取SQL语句出错！");
            return false;
        }
        if(jsonData.items[0].oriValue[0] && jsonData.items[0].oriValue[0].SQL_ID){
            oTop5Table.fnOpen(nTr, fnFormatDetails(oTop5Table, nTr,
                jsonData.items[0].oriValue[0].SQL_TEXT,jsonData.items[0].oriValue[0].CNT,jsonData.items[0].oriValue[0].SQL_ID), 'details');
        }else{
            alert("没有查询到SQL语句！");
        }
    });
}

function queryHistory(){
	var nowTime=new Date();//取今天的日期
	var endTime = new Date(Date.parse($('#eTime').val().replace("-", "/")));
	if(endTime>nowTime) {
		alert("查询时间不能大于当前时间");
		return;
	}
    var beginSnapId = getSyncData(CTRL_COL_CFG.BEGIN_SNAP_ID, {
        DBID: DiasHistory.DBID,
        INSTANCE_NUM: DiasHistory.INSTANCE_NUMBER,
        BEGIN_DATE: $('#sTime').val()
    }).BEGIN_SNAP_ID;
    var endSnapId = getSyncData(CTRL_COL_CFG.END_SNAP_ID, {
        DBID: DiasHistory.DBID,
        INSTANCE_NUM: DiasHistory.INSTANCE_NUMBER,
        END_DATE: $('#eTime').val()
    }).END_SNAP_ID;

    DiasHistory.BEGIN_SNAP_ID = beginSnapId;
    DiasHistory.END_SNAP_ID = endSnapId;

    var p ={
        dbid: DiasHistory.DBID,
        instance_number: DiasHistory.INSTANCE_NUMBER,
        begin_snap_ID: DiasHistory.BEGIN_SNAP_ID,
        end_snap_id: DiasHistory.END_SNAP_ID,
        batchId: DiasHistory.BATCH_ID,
        oraInstanceId: DiasHistory.currentCiId,
        sTime : $('#sTime').val(),
        eTime : $('#eTime').val()
    };
    window.location="diasHistory.html?" + $.param(p);
}

function getSyncData(ctrlColId, paramsObj) {
    var params = [];
    for (var p in paramsObj || {}) {
        params.push(p + '=' + paramsObj[p]);
    }
    if (params.length == 0)
        params = null;

    var result = DiasCtrlMsg.sendCtrlMsgSync(DiasHistory.currentCiId, ctrlColId, params);
    var json = DiasCtrlMsg.parseJson(result);
    var oriValue = DiasCtrlMsg.getSelectItem(json);
    if (oriValue)
        return oriValue[0];
    else
        return {};
}

function showDiasReport(){
    var p ={
        dbid: DiasHistory.DBID,
        instance_number: DiasHistory.INSTANCE_NUMBER,
        begin_snap_ID: DiasHistory.BEGIN_SNAP_ID,
        end_snap_id: DiasHistory.END_SNAP_ID,
        batchId: DiasHistory.BATCH_ID,
        oraInstanceId: DiasHistory.currentCiId,
        sTime : DiasHistory.sTime,
        eTime : DiasHistory.eTime
    };

    window.location="diasReport.html?" + $.param(p);
}

////////////这里跟其他js文件有重复,以后整合
function fnFormatDetails(oTableLocal, nTr, strSql, sessionCnt, sqlId) {
    var aData = oTableLocal.fnGetData(nTr);
    if (!aData) return null;
    var sOut = '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-left:5px;">';
    sOut += '<tr><td colspan="2" align="left" height="40">SQL语句: <textarea cols="125" rows="4" name="sqlTxt" id="sqlTxt">' + strSql + '</textarea></td></tr>';
    sOut += '<tr bgcolor="#AAAAAA">'
        +'<td width="75%" align="left" height="26">当前<span style=\'color:"red"\'>'+sessionCnt+'</span>个会话正在执行该SQL</td><td width="25%" align="right">'
        +'<table border="0" cellspacing="0" cellpadding="0">'
        +'    <tr>'
        +'        <td width="20" align="center"></td>'
        +'        <td width="60" align="left"></td>'
        +'        <td width="20" align="center"><img src="../../resource/image/databaseDias/ico_sql_dias.png" width="16" height="16"/></td>'
        +'        <td width="90" align="left"><a href="javascript:void(0)" onclick="openSqlDias(\''+sqlId+'\')" class="tool_menu">SQL诊断</a></td>'
        +'    </tr>'
        +'</table>'
        +'</td></tr>';
    sOut += '</table>';
    return sOut;
}

function openDialog(msg){
    $('#tbKill').text(msg);
    $('#divKillText').dialog({
        buttons:[{
            text:"关闭",
            handler:function(){
                $.fn.dialog.close($('#divKillText'));
            }
        }]
    });
}

function openSqlDias(sqlId){
    window.open("sqlDias.html?sqlID="+sqlId+"&oraInstanceId="+DiasHistory.currentCiId);
}

function isOpened(localTable) {
    var sets = localTable.fnSettings();
    var aoOpenRows = sets.aoOpenRows;
    if (aoOpenRows && aoOpenRows.length > 0) {
        return aoOpenRows;
    }
    else {
        return null;
    }
}