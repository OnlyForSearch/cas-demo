var dataTablesLanguage = {
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
};

//顶部流程隐藏、显示按钮
function btnFlowClick() {
    var flowLineObj = document.getElementById("flowLine");
    if (!flowLineObj.style.display || flowLineObj.style.display == "block") {
        flowLineObj.style.display = "none";
    }
    else {
        flowLineObj.style.display = "block";
    }
}

function getMainFrameByOracleServer(oraServCiId){
    var actionUrl = "/servlet/databaseDiasAction.do?";
    actionUrl += "method=getMainFrameByOracleServer&oraServCiId=" + oraServCiId;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST", actionUrl, false);
    xmlhttp.send();
    if(xmlhttp.status == 200) {
        var jsonData = DiasCtrlMsg.parseJson(xmlhttp.responseText);
        return jsonData.CI_ID;
    }
}

function getNameByOracleServerId(oraServCiId){
    var actionUrl = "/servlet/databaseDiasAction.do?";
    actionUrl += "method=getNameByOracleServerId&oraServCiId=" + oraServCiId;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST", actionUrl, false);
    xmlhttp.send();
    if(xmlhttp.status == 200) {
        var jsonData = DiasCtrlMsg.parseJson(xmlhttp.responseText);
        return jsonData.CI_NAME;
    }
}

var DiasCtrlMsg = new function(){
    this.sendCtrlMsgSync = function (ciId, ctrlColId, params) {
        var actionUrl = "/servlet/databaseDiasAction.do?";
        actionUrl += "method=sendCtrlCmd&ciId=" + ciId + "&ctrlColId=" + ctrlColId;
        if(params!=null)
            actionUrl += "&" + params.join("&");
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.Open("POST", actionUrl, false);
        xmlhttp.send();
        if(xmlhttp.status == 200) {
            return xmlhttp.responseText;
        }
    };
    //根据控制命令集Id异步发送控制命令
    this.sendCtrlMsg = function (ciId, ctrlColId, callback, params, batchId) {
        var actionUrl = "/servlet/databaseDiasAction.do?";
        actionUrl += "method=sendCtrlCmd&ciId=" + ciId + "&ctrlColId=" + ctrlColId;
        if(batchId!=null && batchId!="")
            actionUrl += "&diasBatchId=" + batchId;
        if(params!=null)
            actionUrl += "&" + params.join("&");
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.Open("POST",actionUrl, true);
        xmlhttp.onreadystatechange = function () {
            callback(xmlhttp);
        };
        xmlhttp.send();
    };
    //解析Json
    this.parseJson = function (strJson) {
        var json;
        try {
            json = eval("(" + strJson + ")");
        }
        catch (err) {
            json = null;
        }
        return json;
    };
    this.isError = function(json){
    	if(!json || !json.items)return false;
        var items = json.items;
        var item = items[0];
        var errcode = item.errcode;
        if(errcode!=null && errcode != "" && errcode == "0") {
            return true;
        } else {
            return false;
        }
    }
    //取得Select语句控制命令的结果
    this.getSelectItem = function(json){
        var items = json.items;
        var item = items[0];
        var oriValue = item.oriValue;
        return oriValue;
    };
    //从控制命令返回数据转换成DataTables数据
    this.parseDataset = function(dataItems) {
        var arrs = new Array();
        for (var i = 0; i < dataItems.length; i++) {
            var item = dataItems[i];
            var arr = new Array()
            for (var key in item) {
                arr.push(item[key]);
            }
            arrs.push(arr);
        }
        return arrs;
    }
    //取得表格头部列
    this.parseColumns = function(dataItems){
        var item = dataItems[0];
        var cols = new Array();
        for (var obj in item) {
            cols.push({
                //"mData":obj,
                "sTitle":obj
            });
        }
        return cols;
    }
}


$(function() {
    var flowLine = $('#flow_process');
    // 顶部流程隐藏、显示按钮
    $('#flowShowHideBtn').click(function() {
        if (flowLine.is(':visible')) {
            flowLine.hide();
        } else {
            flowLine.show();
        }
    });

    // 返回
    $('#flow_back').click(function() {
        if (typeof back === 'function')
        	back();
        else
        	history.back();
    });
    
	var oraInstanceId = $request('oraInstanceId');
    // 报告列表
	$('#goToFlowListBtn').click(function() {
		location = 'diasReportList.html?oraInstanceId=' + oraInstanceId;
	});
	
    // SQL 诊断 
	$('#goToSqlDiasBtn').click(function() {
		window.open("sqlDias.html?oraInstanceId=" + oraInstanceId);
	});

    // 设置流程导图节点位置
    var isShowState = flowLine.is(':visible');
    flowLine.show().find('.item_name').each(function() {
        var item = $(this);
        var parentItem = item.parent();
        var parentPos = parentItem.position();
        var left = parentPos.left + (parentItem.width() - item.width())/2;
        var top = parentPos.top + parentItem.height() + 5;

        item.css({
            left: left,
            top: top
        });
    });
    if (!isShowState)
        flowLine.hide();
});


/**
 * dataTable控件调用
 * 参数:
 *		$jq: 存放表格的 jquery 对象
 *		columnCfg: 列名配置数组，列配置可以是直接列名(xxTitle)，或者 dataTable 的列配置对象({sTitle: 'xxTitle'...})
 *		dataSet: 数据集(json对象)
 */
function createDataTable($jq, columnCfg, dataSet, forcePagerCfg ) {
    var aoColumnCfg = [];
    for (var i = 0; i < columnCfg.length; i++) {
        var colCfg = columnCfg[i];
        if (typeof colCfg == 'object')
            aoColumnCfg.push(colCfg);
        else
            aoColumnCfg.push({"sTitle": colCfg, "mData": colCfg });
    }
    var bPaginate = true;
    
    if (typeof forcePagerCfg != 'undefined' && forcePagerCfg != null) {
    	bPaginate = forcePagerCfg;
    } else {
        // 数据数量小于 10 时，不显示分页按钮
        if (dataSet.length <= 10)
            bPaginate = false;    	
    }

    return $jq.dataTable( {
        aaData: dataSet,
        aoColumns: aoColumnCfg,
        oLanguage : {
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
        "bSort":false,
        "iDisplayLength": 10,
        "bPaginate": false, //改变每页显示数据数量
        "sPaginationType": "full_numbers",
        "bPaginate": bPaginate, //翻页功能
        "bLengthChange": false, //改变每页显示数据数量
        "bFilter": false, //过滤功能
        "bSort": false, //排序功能
        "bInfo": false,//页脚信息
        "bAutoWidth": true,//自动宽度,
        "bDestroy":true//是否销毁旧对象
    });
}

function createTableAjax($jq, columnCfg, ciId, ctrlColId, params,diasBatchId){
    var actionUrl = "/servlet/databaseDiasAction.do?";
    actionUrl += "method=getDataTables&ciId=" + ciId + "&ctrlColId=" + ctrlColId;
    if(diasBatchId!=null && diasBatchId!="") {
        actionUrl += "&diasBatchId=" + diasBatchId;
    }
    if(params!=null)
        actionUrl += "&" + params.join("&");

    var aoColumnCfg = [];
    for (var i = 0; i < columnCfg.length; i++) {
        var colCfg = columnCfg[i];
        if (typeof colCfg == 'object')
            aoColumnCfg.push(colCfg);
        else
            aoColumnCfg.push({"sTitle":colCfg,"mData":colCfg});
    }

    var jqTable = $jq.dataTable( {
        oLanguage : {
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
        "bSort":false,
        "iDisplayLength": 10,
        "bPaginate": false, //改变每页显示数据数量
        "sPaginationType": "full_numbers",
        "bPaginate": true, //翻页功能
        "bLengthChange": false, //改变每页显示数据数量
        "bFilter": false, //过滤功能
        "bSort": false, //排序功能
        "bInfo": false,//页脚信息
        "bDestroy":true,//是否销毁旧对象
        "bAutoWidth": true,//自动宽度,
        "bProcessing": true,
        "bServerSide": false,
        "sAjaxSource": actionUrl,
        "aoColumns": aoColumnCfg
    });
    return jqTable;
}


function getParamData(strParam){
    return decodeURIComponent(strParam.replace(/\+/g, "%20"));
}

function createMSChartByJson(json,chart) {
    var items = json.items[0].oriValue;
    var chartJson = {};
    chartJson.chart = chart;
    /*
     {
     "caption": "资源消耗图",
     "xaxisname":"SNAP ID",
     "yaxisname":"CPU TIME",
     "showvalues":"0",
     "labelStep" : "1"
     }
    */
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


function nullToStr(str) {
    if (str == null || str == "null") {
        str = "未采集到"
    }
    return str;
}
