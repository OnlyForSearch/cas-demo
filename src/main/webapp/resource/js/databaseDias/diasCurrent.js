DiasGlobal = {
    currentCiId:undefined,//1000000000662,
    mainFrameCiId:undefined,
    currentServer:undefined,//"itmtest",
    oTable:undefined,
    aDataSet:undefined,
    errMsg:undefined,
    initFinal:false,
    GET_ORACLE_PROCESS_LIST:10005001,
    GET_ORACLE_SQL_TEXT_BY_ID:10005002,
    GET_PROCESS_COUNT:10005003
};

$(document).ready(function(){
    var urlParam = getUrlParam();

	DiasGlobal.currentCiId=urlParam.oraInstanceId;
    DiasGlobal.mainFrameCiId=getMainFrameByOracleServer(DiasGlobal.currentCiId);
    DiasGlobal.currentServer=getNameByOracleServerId(DiasGlobal.currentCiId);
    getProcessList();
});

function fnFormatDetails(oTableLocal, nTr, strSql, sessionCnt) {
    var aData = oTableLocal.fnGetData(nTr);
    if (!aData) return null;
    var sOut = '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-left:5px;">';
    sOut += '<tr><td colspan="2" align="left">SQL语句: ' + strSql + '</td></tr>';
    sOut += '<tr bgcolor="#AAAAAA">'
        +'<td width="75%" align="left">当前<span style=\'color:"red"\'>'+sessionCnt+'</span>个会话正在执行该SQL</td><td width="25%" align="right">'
        +'<table border="0" cellspacing="0" cellpadding="0">'
        +'    <tr>'
        +'        <td width="20" align="center"><img src="../../resource/image/databaseDias/ico_kill_process.png" width="16" height="16"/></td>'
        +'        <td width="60" align="left"><a href="#" class="tool_menu" onclick="clickKillProcess(\''+aData["SID"]+','+aData["SERIAL#"]+'\')">杀进程</a></td>'
        +'        <td width="20" align="center"><img src="../../resource/image/databaseDias/ico_sql_dias.png" width="16" height="16"/></td>'
        +'        <td width="90" align="left"><a href="javascript:void(0)" onclick="openSqlDias(\''+aData["SQL_ID"]+'\')" class="tool_menu">SQL诊断</a></td>'
        +'    </tr>'
        +'</table>'
        +'</td></tr>';
    sOut += '</table>';
    return sOut;
}

function clickKillProcess(processId){
//    var killMsg = "kill -9 "+processId;
    var killMsg = "alter system kill session '"+processId+"' immediate;";
    openDialog(killMsg);
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
$('#tbProcessList tbody td').live('click', function () {
    var tabNode = this.parentNode.parentNode.parentNode;
    if(tabNode==null || tabNode.id!="tbProcessList") {
        return false;
    }
    var openRows = isOpened(DiasGlobal.oTable);
    if (openRows != null) {
        for (var i = 0; i < openRows.length; i++) {
            DiasGlobal.oTable.fnClose(openRows[i].nParent);
        }
    }
    var nTr = $(this).parents('tr')[0];
    var aData = DiasGlobal.oTable.fnGetData(nTr);
    if (!aData) return false;
    var params = new Array();
    if(!aData["SQL_ID"]){
        alert("没有查询到SQL_ID");
        return false;
    }
    params.push("sql_id="+aData["SQL_ID"]);
    var strJson = DiasCtrlMsg.sendCtrlMsgSync(DiasGlobal.currentCiId,DiasGlobal.GET_ORACLE_SQL_TEXT_BY_ID,params);
    var jsonData = DiasCtrlMsg.parseJson(strJson);
    if(!jsonData) {
        alert("获取SQL语句出错！");
    }
    DiasGlobal.oTable.fnOpen(nTr,
        fnFormatDetails(DiasGlobal.oTable, nTr,jsonData.items[0].oriValue[0].SQL_TEXT,jsonData.items[0].oriValue[0].CNT),
        'details');
});

function getProcessList() {
    var params = new Array();
    params.push("service_id="+DiasGlobal.currentServer);
    DiasCtrlMsg.sendCtrlMsg(DiasGlobal.mainFrameCiId,DiasGlobal.GET_PROCESS_COUNT,processCntSendCallback,params);
    //DiasCtrlMsg.sendCtrlMsg(DiasGlobal.currentCiId,DiasGlobal.GET_ORACLE_PROCESS_LIST,processListSendCallback,null);

    DiasGlobal.oTable = createTableAjax($('#tbProcessList'), ["SID","STATE","MACHINE","SPID","SERIAL#","DB_TIME","PREV_SQL_ID","SQL_ID","USERNAME","STATUS"],
        DiasGlobal.currentCiId, DiasGlobal.GET_ORACLE_PROCESS_LIST, null,getUrlParam().batchId);

    $("#tbProcessList tbody tr").click(function (e) {
        if ($(this).hasClass('row_selected')) {
            $(this).removeClass('row_selected');
        }
        else {
            DiasGlobal.oTable.$('tr.row_selected').removeClass('row_selected');
            $(this).addClass('row_selected');
        }
    });
}

function processCntSendCallback(retrunXmlhttp){
    if (retrunXmlhttp.readyState == 4) {
        var jsonData = DiasCtrlMsg.parseJson(retrunXmlhttp.responseText);
        var aResult = jsonData.items[0].oriValue .split("\n");
        var all = aResult[0];
        var oracle = aResult[1];
        document.getElementById("allProcessCount").innerHTML=all;
        document.getElementById("oracleProcessCount").innerHTML=oracle;
        document.getElementById("otherProcessCount").innerHTML=all-oracle;
    }
}

/*
function processListSendCallback(retrunXmlhttp) {
    if (retrunXmlhttp.readyState == 4) {
        var jsonData = DiasCtrlMsg.parseJson(retrunXmlhttp.responseText);
        if (DiasCtrlMsg.isError(jsonData)) {
            DiasGlobal.aCol = DiasCtrlMsg.parseColumns(jsonData.items[0].oriValue);
            DiasGlobal.aDataSet = DiasCtrlMsg.parseDataset(jsonData.items[0].oriValue);
            initTable();
        }
        else {
            //错误处理
            doError();
        }
    }
}
*/
/*
function initTable() {
    DiasGlobal.oTable = $('#tbProcessList').dataTable({
        "aaData": DiasGlobal.aDataSet,
        "aoColumns":DiasGlobal.aCol,
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据",
            "sZeroRecords": "没有查找到数据",
            "sProcessing": "正在加载数据...",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "sZeroRecords": "没有检索到数据",
            "sSearch": "名称:",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            }
        },
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
    $("#tbProcessList tbody tr").click(function (e) {
        if ($(this).hasClass('row_selected')) {
            $(this).removeClass('row_selected');
        }
        else {
            DiasGlobal.oTable.$('tr.row_selected').removeClass('row_selected');
            $(this).addClass('row_selected');
        }
    });

}
*/

function fnGetSelected(oTableLocal) {
    return oTableLocal.$('tr.row_selected');
}

function doError(jsonData) {
    if (DiasGlobal.errMsg == null) {
        DiasGlobal.errMsg = new Array();
    }
    if (jsonData) {
        DiasGlobal.errMsg.push(jsonData.errmsg);
    }else{
        DiasGlobal.errMsg.push("未知错误！");
    }
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
    window.open("sqlDias.html?sqlID="+sqlId+"&oraInstanceId="+DiasGlobal.currentCiId);
}

function showDiasTopo(){

    var urlParam = getUrlParam();
    var sTime = getParamData(urlParam.sTime);
    var eTime = getParamData(urlParam.eTime);
    var DBID = urlParam.dbid;

    var INSTANCE_NUMBER = urlParam.instance_number;
    var BEGIN_SNAP_ID = urlParam.begin_snap_ID;
    var END_SNAP_ID = urlParam.end_snap_id;
    var BATCH_ID = urlParam.batchId;

    var currentCiId = urlParam.oraInstanceId;

    var p ={
        dbid: DBID,
        instance_number: INSTANCE_NUMBER,
        begin_snap_ID: BEGIN_SNAP_ID,
        end_snap_id: END_SNAP_ID,
        batchId: BATCH_ID,
        oraInstanceId: currentCiId,
        sTime : sTime,
        eTime : eTime
    };
//    window.location="diasTopo.html?" + $.param(p);
    window.location="diasHistory.html?" + $.param(p);
}

function showDiasReport(){
    window.location="diasReport.html" + location.search;
}