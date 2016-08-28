var dataTablesLanguage = {
    "sLengthMenu": "ÿҳ��ʾ _MENU_ ����¼",
    "sInfo": "�� _START_ �� _END_ /�� _TOTAL_ ������",
    "sInfoEmpty": "û������",
    "sZeroRecords": "û�в��ҵ�����",
    "sProcessing": "���ڼ�������...",
    "sInfoFiltered": "(�� _MAX_ �������м���)",
    "sZeroRecords": "û�м���������",
    "sSearch": "����:",
    "oPaginate": {
        "sFirst": "��ҳ",
        "sPrevious": "ǰһҳ",
        "sNext": "��һҳ",
        "sLast": "βҳ"
    }
};

//�����������ء���ʾ��ť
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
    //���ݿ������Id�첽���Ϳ�������
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
    //����Json
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
    //ȡ��Select����������Ľ��
    this.getSelectItem = function(json){
        var items = json.items;
        var item = items[0];
        var oriValue = item.oriValue;
        return oriValue;
    };
    //�ӿ������������ת����DataTables����
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
    //ȡ�ñ��ͷ����
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
    // �����������ء���ʾ��ť
    $('#flowShowHideBtn').click(function() {
        if (flowLine.is(':visible')) {
            flowLine.hide();
        } else {
            flowLine.show();
        }
    });

    // ����
    $('#flow_back').click(function() {
        if (typeof back === 'function')
        	back();
        else
        	history.back();
    });
    
	var oraInstanceId = $request('oraInstanceId');
    // �����б�
	$('#goToFlowListBtn').click(function() {
		location = 'diasReportList.html?oraInstanceId=' + oraInstanceId;
	});
	
    // SQL ��� 
	$('#goToSqlDiasBtn').click(function() {
		window.open("sqlDias.html?oraInstanceId=" + oraInstanceId);
	});

    // �������̵�ͼ�ڵ�λ��
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
 * dataTable�ؼ�����
 * ����:
 *		$jq: ��ű��� jquery ����
 *		columnCfg: �����������飬�����ÿ�����ֱ������(xxTitle)������ dataTable �������ö���({sTitle: 'xxTitle'...})
 *		dataSet: ���ݼ�(json����)
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
        // ��������С�� 10 ʱ������ʾ��ҳ��ť
        if (dataSet.length <= 10)
            bPaginate = false;    	
    }

    return $jq.dataTable( {
        aaData: dataSet,
        aoColumns: aoColumnCfg,
        oLanguage : {
            "sLengthMenu": "ÿҳ��ʾ _MENU_ ����¼",
            "sInfo": "�� _START_ �� _END_ /�� _TOTAL_ ������",
            "sInfoEmpty": "û������",
            "sZeroRecords": "û�в��ҵ�����",
            "sProcessing": "���ڼ�������...",
            "sInfoFiltered": "(�� _MAX_ �������м���)",
            "sZeroRecords": "û�м���������",
            "sSearch": "����:",
            "oPaginate": {
                "sFirst": "��ҳ",
                "sPrevious": "ǰһҳ",
                "sNext": "��һҳ",
                "sLast": "βҳ"
            }
        },
        "bSort":false,
        "iDisplayLength": 10,
        "bPaginate": false, //�ı�ÿҳ��ʾ��������
        "sPaginationType": "full_numbers",
        "bPaginate": bPaginate, //��ҳ����
        "bLengthChange": false, //�ı�ÿҳ��ʾ��������
        "bFilter": false, //���˹���
        "bSort": false, //������
        "bInfo": false,//ҳ����Ϣ
        "bAutoWidth": true,//�Զ����,
        "bDestroy":true//�Ƿ����پɶ���
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
            "sLengthMenu": "ÿҳ��ʾ _MENU_ ����¼",
            "sInfo": "�� _START_ �� _END_ /�� _TOTAL_ ������",
            "sInfoEmpty": "û������",
            "sZeroRecords": "û�в��ҵ�����",
            "sProcessing": "���ڼ�������...",
            "sInfoFiltered": "(�� _MAX_ �������м���)",
            "sZeroRecords": "û�м���������",
            "sSearch": "����:",
            "oPaginate": {
                "sFirst": "��ҳ",
                "sPrevious": "ǰһҳ",
                "sNext": "��һҳ",
                "sLast": "βҳ"
            }
        },
        "bSort":false,
        "iDisplayLength": 10,
        "bPaginate": false, //�ı�ÿҳ��ʾ��������
        "sPaginationType": "full_numbers",
        "bPaginate": true, //��ҳ����
        "bLengthChange": false, //�ı�ÿҳ��ʾ��������
        "bFilter": false, //���˹���
        "bSort": false, //������
        "bInfo": false,//ҳ����Ϣ
        "bDestroy":true,//�Ƿ����پɶ���
        "bAutoWidth": true,//�Զ����,
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
     "caption": "��Դ����ͼ",
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
        str = "δ�ɼ���"
    }
    return str;
}
