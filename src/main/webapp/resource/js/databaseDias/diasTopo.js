DiasTopo = {
    IMG_BASE_PATH: "../../resource/image/databaseDias/topo_icon/",
    urlParam: undefined,
    sTime: undefined,
    eTime: undefined,
    currentCiId:undefined,// 1000024637043,//1000000000662,
    mainFrameCiId: undefined,
    actionUrl: "/servlet/databaseDiasAction.do?",
    aDataSet:undefined,
    oTableList:undefined,
    DBID:undefined,//1269998372,
    INSTANCE_NUMBER:undefined,//1,
    begin_snap_id:undefined,//9321,
    end_snap_id:undefined,//9899,
    BATCH_ID:undefined,
    GET_BACKGROUND_DUMP_DEST:10005030,
    GET_ALERT_LOG:10005031,
    GET_LOG_SWAP_INTERVAL:10005032,
    GET_LOG_GROUP:10005033,
    GET_ELAPSE_TIME_TB:10005021,
    GET_ELAPSE_TIME_COLUMN:["SQL_TEXT","CPUTIME","SQL_ID","MODULE","EXECUTIONS","DB_Time","elapsed/exec","ELAPSED"],
    GET_CPU_TIME_TB:10005022,
    GET_CPU_TIME_COLUMN:['SQL_ID','CPUTIME','ELAPSED','EXECUTIONS','ELAPSED_EXEC','DB_TIME','MODULE','SQL_TEXT'],
    GET_GETS_TB:10005023,
    GET_GETS_COLUMN:['SQL_ID','BGET','EXEC','GETS_EXEC','TOTAL_GETS','CPUTIME','ELAPSED','MODULE','SQL_TEXT'],
    GET_READS_TB:10005024,
    GET_READS_COLUMN:['SQL_ID','DSKR','EXEC','READS_EXEC','TOTAL_READS','CPUTIME','ELAPSED','MODULE','SQL_TEXT'],
    GET_PARSE_CALLS_TB:10005025,
    GET_PARSE_CALLS_COLUMN:['SQL_ID','PRSC','EXEC','TOTAL_PARSECALLS','MODULE','SQL_TEXT'],
    GET_SHARABLE_MEMORY_TB:10005026,
    GET_SHARABLE_MEMORY_COLUMN:["SQL_ID","SHARABLE_MEM","%Total SharedMem","MODULE","MODULE"],
    GET_VERSION_COUNT_TB:10005027,
    GET_VERSION_COUNT_COLUMN:["SQL_ID","VERSION_COUNT","EXEC","MODULE","SQL_TEXT"],
    GET_CLUSTER_WAITE_TIME_TB:10005028,
    GET_CLUSTER_WAITE_TIME_COLUMN:["SQL_ID","Cluster Wait Time","%Total Cluster Wait Time","ELAPSED"
        ,"CPUTIME","MODULE","SQL_TEXT"],
    GET_EXECUTIONS:10005029,
    GET_EXECUTIONS_COLUMN:["elapsed/exec","%DB time","SQL_TEXT","ELAPSED","EXECUTIONS","CPUTIME"],
    GET_ALL_PARAMETER:10005077,
    GET_LISTEN_CFG:10005078,
    GET_REDO_LOG_1:10005079,
    GET_REDO_LOG_2:10005080,
    GET_LISTEN_LOG:10005081
};

var _diasMode;

// 控制命令 id 配置
var CTRL_COL_CFG = {
    DBID: 10005066,
    INSTANCE_NUMBER: 10005067,
    BEGIN_SNAP_ID: 10005068,
    END_SNAP_ID: 10005069
};

$(document).ready(function () {
    initPage();
});

function computerAlarm() {
    var computerIcon = document.getElementById("computerImg");
    computerIcon.src = DiasTopo.IMG_BASE_PATH + "my_computer_alert.png";
}

function networkAlarm() {
    var networkIcon = document.getElementById("networkImg");
    networkIcon.src = DiasTopo.IMG_BASE_PATH + "network_alert.png";
}

function databaseAlarm() {
    var databaseIcon = document.getElementById("databaseImg");
    databaseIcon.src = DiasTopo.IMG_BASE_PATH + "database_alert.png";
}

function initPage() {
    DiasTopo.urlParam = getUrlParam();
    _diasMode = DiasTopo.urlParam.diasMode;
    DiasTopo.sTime = getParamData(DiasTopo.urlParam.sTime);
    DiasTopo.eTime = getParamData(DiasTopo.urlParam.eTime);
    DiasTopo.DBID = DiasTopo.urlParam.dbid;

    DiasTopo.INSTANCE_NUMBER = DiasTopo.urlParam.instance_number;
    DiasTopo.begin_snap_id = DiasTopo.urlParam.begin_snap_ID;
    DiasTopo.end_snap_id = DiasTopo.urlParam.end_snap_id;
    DiasTopo.BATCH_ID = DiasTopo.urlParam.batchId;

    DiasTopo.currentCiId = DiasTopo.urlParam.oraInstanceId;

    $("#sTime").val(DiasTopo.sTime);
    $("#eTime").val(DiasTopo.eTime);

    DiasTopo.mainFrameCiId = getMainFrameByOracleServer(DiasTopo.currentCiId);
    getDatabaseParameter(DiasTopo.currentCiId);
    getAlarmCount(DiasTopo.mainFrameCiId,DiasTopo.sTime,DiasTopo.eTime);

}

function getDatabaseParameter(oraServCiId) {
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST", DiasTopo.actionUrl + "method=getDatabaseParameter&oraServCiId=" + oraServCiId, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        var jsonData = DiasCtrlMsg.parseJson(xmlhttp.responseText);
        var rec = jsonData.record;
        document.getElementById("SHORT_DESCRIPTION").innerHTML = nullToStr(rec.SHORT_DESCRIPTION);
        document.getElementById("START_TIME").innerHTML = nullToStr(rec.START_TIME);
        document.getElementById("IS_RAC").innerHTML = nullToStr(rec.IS_RAC);
        document.getElementById("LOG_MODE").innerHTML = nullToStr(rec.LOG_MODE);
        document.getElementById("MAX_CONN_NUM").innerHTML = nullToStr(rec.MAX_CONN_NUM);
        document.getElementById("SGA_TARGET").innerHTML = nullToStr(rec.SGA_TARGET);
        document.getElementById("PGA_AGGREATE_TARGET").innerHTML = nullToStr(rec.PGA_AGGREATE_TARGET);
        document.getElementById("OPEN_CURSORS").innerHTML = nullToStr(rec.OPEN_CURSORS);
        document.getElementById("VERSION_NUMBER").innerHTML = nullToStr(rec.VERSION_NUMBER);
    }
}

function getAlarmCount(mainFrameCiId, sTime, eTime) {
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST", DiasTopo.actionUrl + "method=getAlarmCount&mainFrameCiId=" + mainFrameCiId
        + "&sTime=" + sTime + "&eTime=" + eTime, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        var jsonData = DiasCtrlMsg.parseJson(xmlhttp.responseText);
        if (jsonData.mainFrameCnt && jsonData.mainFrameCnt > 0) {
            computerAlarm();
        }
        if (jsonData.networkCnt && jsonData.networkCnt > 0) {
            networkAlarm();
        }
    }
}

function getPerfChart(type) {
    var mainFrameCiId=DiasTopo.mainFrameCiId;
    var sTime=DiasTopo.sTime;
    var eTime=DiasTopo.eTime;
    var method="";
    var chartType="Line";
    if (type == "cpu") {
        method = "getCpuUseRate";
    }
    else if (type == "memory") {
        method = "getMemUseRate";
    }
    else if (type == "swap") {
        method = "getSwapUseRate";
    }
    else if (type == "filesystem") {
        method = "getFsUseRate";
        chartType = "MSLine";
    }

    var perfChart = new FusionCharts("/resource/fusion_charts/swf/"+chartType+".swf",
        "perfChart", "758", "437", "0");
    perfChart.setJSONUrl(DiasTopo.actionUrl+"method="+method+"&mainFrameCiId="
        +mainFrameCiId+"&sTime=" + sTime + "&eTime=" + eTime);
//    myChart.setJSONUrl("../../resource/fusion_charts/d.json");
    perfChart.render("perfChartDiv");
    $('#perfWindow').dialog({
        buttons: [
            {
                text: "关闭",
                handler: function () {
                    $.fn.dialog.close($('#perfWindow'));
                }
            }
        ]
    });
}

function getTableSpace(){
    var mainFrameCiId=DiasTopo.mainFrameCiId;
    var sTime=DiasTopo.sTime;
    var eTime=DiasTopo.eTime;
/*
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST", DiasTopo.actionUrl + "method=getTableSpaceList&mainFrameCiId=" + DiasTopo.currentCiId//1000000000662
        + "&sTime=" + sTime + "&eTime=" + eTime, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        var jsonData = DiasCtrlMsg.parseJson(xmlhttp.responseText);
        DiasTopo.aDataSet=jsonData;
    }
*/
    if(DiasTopo.oTable==null){
        DiasTopo.oTable = $('#tableSpaceList').dataTable({
            //"aaData": DiasTopo.aDataSet,
            sAjaxSource : DiasTopo.actionUrl + "method=getTableSpaceList&mainFrameCiId=" + DiasTopo.currentCiId
                + "&sTime=" + sTime + "&eTime=" + eTime,
            "aoColumns": [
                { "mData": "SHORT_DESCRIPTION","sTitle": "名称" },
                { "mData": "TBS_TYPE","sTitle": "类型" },
                { "mData": "TBS_SIZE","sTitle": "总大小(G)" },
                { "mData": "TSRATE","sTitle": "使用率(%)"},
                { "mData": "TSFREESIZE","sTitle": "剩余大小(G)"}
            ],
            "bRetrieve":true,
            "oLanguage": dataTablesLanguage,
            "bSort": false,
            "iDisplayLength": 10,
            "bPaginate": false, //改变每页显示数据数量
            "sPaginationType": "full_numbers",
            "bPaginate": true, //翻页功能
            "bLengthChange": false, //改变每页显示数据数量
            "bFilter": false, //过滤功能
            "bSort": false, //排序功能
            "bInfo": false,//页脚信息
            "bAutoWidth": true//自动宽度
        });
    }
    $('#tableSpaceList').width();
    $('#tableSpaceWindow').dialog({
        buttons: [
            {
                text: "关闭",
                handler: function () {
                    $.fn.dialog.close($('#tableSpaceWindow'));
                }
            }
        ]
    });
}

function getAlertLog(){
    var ALERT_LOG_PATH,ORA_SID;
    var responseText = DiasCtrlMsg.sendCtrlMsgSync(DiasTopo.currentCiId,DiasTopo.GET_BACKGROUND_DUMP_DEST,null);
    var jsonData = DiasCtrlMsg.parseJson(responseText);
    if(DiasCtrlMsg.isError(jsonData)){
        var items = DiasCtrlMsg.getSelectItem(jsonData);
        ALERT_LOG_PATH=items[0].BACKGROUND_DUMP_DEST;
        ORA_SID = items[1].BACKGROUND_DUMP_DEST;
        var params = new Array();
        params.push("ALERT_LOG_PATH="+ALERT_LOG_PATH + "/alert_" + ORA_SID + ".log");
        responseText = DiasCtrlMsg.sendCtrlMsgSync(DiasTopo.mainFrameCiId,DiasTopo.GET_ALERT_LOG,params);
        jsonData = DiasCtrlMsg.parseJson(responseText);
        if(DiasCtrlMsg.isError(jsonData)) {
            var oriValue = DiasCtrlMsg.getSelectItem(jsonData);
            var tailLog=oriValue;
            openDialog(tailLog);
        }else{
            alert("获取AlertLog发生错误！");
        }
    }
    else {
        alert("获取AlertLog发生错误！");
    }
}


function openDialog(msg){
    $('#tbLog').text(msg);
    $('#logViewWindow').dialog({
        buttons:[{
            text:"关闭",
            handler:function(){
                $.fn.dialog.close($('#logViewWindow'));
            }
        }]
    });
}

function getNoSqlTable(ctrlColId,tableColumn,tableId,windowId) {
    var params = new Array();
    params.push("DBID=" + DiasTopo.DBID);
    params.push("INST_NUM=" + DiasTopo.INSTANCE_NUMBER);
    params.push("BEGIN_SNAP_ID=" + DiasTopo.begin_snap_id);
    params.push("END_SNAP_ID=" + DiasTopo.end_snap_id);

    createTableAjax($('#'+tableId),tableColumn,DiasTopo.currentCiId,ctrlColId,params);

//    $("#"+windowId)[0].title = windowTitle;
    $("#"+windowId).dialog({
        buttons: [
            {
                text: "关闭",
                handler: function () {
                    $.fn.dialog.close($("#"+windowId));
                }
            }
        ]
    });
//    DiasTopo.oTableList.fnDraw();
}

function queryTopo(){
    var beginSnapId = getSyncData(CTRL_COL_CFG.BEGIN_SNAP_ID, {
        DBID: DiasTopo.DBID,
        INSTANCE_NUM: DiasTopo.INSTANCE_NUMBER,
        BEGIN_DATE: $('#sTime').val()
    }).BEGIN_SNAP_ID;
    var endSnapId = getSyncData(CTRL_COL_CFG.END_SNAP_ID, {
        DBID: DiasTopo.DBID,
        INSTANCE_NUM: DiasTopo.INSTANCE_NUMBER,
        END_DATE: $('#eTime').val()
    }).END_SNAP_ID;

    DiasTopo.BEGIN_SNAP_ID = beginSnapId;
    DiasTopo.END_SNAP_ID = endSnapId;

    var p ={
        dbid: DiasTopo.DBID,
        instance_number: DiasTopo.INSTANCE_NUMBER,
        begin_snap_ID: DiasTopo.BEGIN_SNAP_ID,
        end_snap_id: DiasTopo.END_SNAP_ID,
        batchId: DiasTopo.BATCH_ID,
        oraInstanceId: DiasTopo.currentCiId,
        sTime : $('#sTime').val(),
        eTime : $('#eTime').val()
    };
    window.location="diasTopo.html?" + $.param(p);
}

function getSyncData(ctrlColId, paramsObj) {
    var params = [];
    for (var p in paramsObj || {}) {
        params.push(p + '=' + paramsObj[p]);
    }
    if (params.length == 0)
        params = null;

    var result = DiasCtrlMsg.sendCtrlMsgSync(DiasTopo.currentCiId, ctrlColId, params);
    var json = DiasCtrlMsg.parseJson(result);
    var oriValue = DiasCtrlMsg.getSelectItem(json);
    if (oriValue)
        return oriValue[0];
    else
        return {};
}

function showFullParameter(){
    var params = null;
    var column = ["NUM","NAME","DISPLAY_VALUE","IS_DEFAULT"];
    var fullTable = createTableAjax($('#fullParameterTable'),column,DiasTopo.currentCiId,DiasTopo.GET_ALL_PARAMETER,params);
    $("#fullParameterWindow")[0].title = "完整参数信息";
    $('#fullParameterWindow').dialog({
        buttons: [
            {
                text: "关闭",
                handler: function () {
                    $.fn.dialog.close($('#fullParameterWindow'));
                }
            }
        ]
    });
    fullTable.fnDraw();
}

function showTwoTableRedoLog(){
    createTableAjax($('#redoTable1'),["THREAD#","SEQUENCE#","FIRST_TIME"],DiasTopo.currentCiId,DiasTopo.GET_REDO_LOG_1,null);
    createTableAjax($('#redoTable2'),["GROUP#","THREAD#","MEMBERS","BYTES"],DiasTopo.currentCiId,DiasTopo.GET_REDO_LOG_2,null);
    $("#redoLogWin").dialog({
        buttons: [
            {
                text: "关闭",
                handler: function () {
                    $.fn.dialog.close($("#redoLogWin"));
                }
            }
        ]
    });
}

function getListenerCfg(){
    var responseText = DiasCtrlMsg.sendCtrlMsgSync(DiasTopo.mainFrameCiId,DiasTopo.GET_LISTEN_CFG,null);
    var jsonData = DiasCtrlMsg.parseJson(responseText);
    if(DiasCtrlMsg.isError(jsonData)) {
    	var tailLog = DiasCtrlMsg.getSelectItem(jsonData);
        openDialog(tailLog);
    }
    else {
        alert("获取监听配置发生错误！");
    }
}

function openAlarmList(){
	var alarmUrl = "/workshop/alarmManage/alarmMergeList.htm?comeFrom=dbDias&cfgView=1&isRefresh=true";
	alarmUrl += "&sTime=" + $('#sTime').val();
	alarmUrl += "&eTime=" + $('#eTime').val();
	alarmUrl += "&kpi_id=2010010500001";
	alarmUrl += "&neId=" + DiasTopo.mainFrameCiId;
	window.open(alarmUrl);
}

function openDiasHistroy(){
	var openUrl;
	if(_diasMode=="curr"){
		//跳到诊断当前相关:oracle进程列表
		openUrl = "/workshop/databaseDias/diasCurrent.html" + location.search;
	}else{
		//跳到诊断历史相关:查看系统最近情况-资源消耗分析
		openUrl = "/workshop/databaseDias/diasHistory.html" + location.search;
	}
	window.location = openUrl;
}

function showListenLogGroup(){
	var oraServCiId = DiasTopo.currentCiId;
	var listenLogPath;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST", DiasTopo.actionUrl + "method=getListenLogPath&oraServCiId=" + oraServCiId, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
    	 var jsonData = DiasCtrlMsg.parseJson(xmlhttp.responseText);
    	 if(jsonData && jsonData.success) {
    		 listenLogPath = jsonData.listenLogPath;
    	     var params = new Array();
    	     params.push("LISTEN_LOG_PATH=" + listenLogPath);
    		 var responseText = DiasCtrlMsg.sendCtrlMsgSync(DiasTopo.mainFrameCiId,DiasTopo.GET_LISTEN_LOG,params);
    		 jsonData = DiasCtrlMsg.parseJson(responseText);
    		 if(DiasCtrlMsg.isError(jsonData)){
    			 var tailLog = DiasCtrlMsg.getSelectItem(jsonData);
    			 openDialog(tailLog);
    		 }else{
    			 alert("取得网管监听日志组错误");
    		 }
    	 }
    	 else{
    		 alert("从CMDB取得网管监听日志组路径错误！");
    	 }
    }
}

function showDiasReport(){
    window.location="diasReport.html" + location.search;
}