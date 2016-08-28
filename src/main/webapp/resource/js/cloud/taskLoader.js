var cloudTask = new Object();
cloudTask.TaskLoader = function(taskId,okFn,failFn,showDiv,step) {
	this.taskId = taskId;
	this.okFn = okFn;
	this.failFn = failFn||this.defaultFailFn;
	this.showDiv = showDiv||window.document.body.insertAdjacentElement("beforeEnd",document.createElement("div"));
	this.step = step||10000;
	this.timer;
	this.taskObj = {"taskState":"init"};
	this.taskTab;
	this.taskWaitSpan;
	this.taskBtn;

	this.init();
	this.reloadTaskInfo();
	this.refreshTask();
}

cloudTask.TaskLoader.prototype = {
	init:function() {
		var task = this;
		var uID = document.uniqueID;
		this.showDiv.innerHTML = '<fieldset style="padding:5px 0 5px 0;" id="task_fldset"><legend>������Ϣ</legend>'
			+ '<table width="99%" style="margin:0 0 0 2"><tr><td><IE:button id="btn_'+uID+'" value="��ʱˢ��"/></td>'
		    + '<td align="right">&nbsp;<span id="wait_span_'+uID+'" style="display:none;">'
		    + '<span style="background : url(/resource/image/ani_wait1.gif) no-repeat;height:24px;width:24px;">&nbsp;</span>'
            + '<span style="height:24px;font-family:����;font-size:9pt;font-weight:bold;padding:5px 0 0 0px;">���ڶ�ȡ����,���Ժ�......</span>'
            + '</span></td></table>'
			+ '<table id="tab_'+uID+'" cellspacing="1" cellpadding="0" align="left" bgcolor="#A4CDEF" width="99%" style="margin:2 0 5 5;">'
			+ '<tr style="height:23px;background-color:#CCDAF1;;text-align: center">'
			+ '<td><b>��������</b></td><td><b>����״̬</b></td><td><b>����ʼʱ��</b></td><td><b>��ʼʱ��</b></td><td><b>����ʱ��</b></td><td><b>��ϸ��Ϣ</b></td></tr>'
			+ '<tr style="background-color:#FFFFFF;height:23px;"><td colspan="6" align="center">�����ѯ��...</td></tr></table></fieldset>';

		document.getElementById("btn_"+uID).onclick = function() {
			task.loadTaskInfo();
		}
		this.taskBtn = document.getElementById("btn_"+uID);
		this.taskWaitSpan = document.getElementById("wait_span_"+uID);
		this.taskTab = document.getElementById("tab_"+uID);
	},
		
	loadTaskInfo:function() {
		var task = this;
		var taskUrl = "/servlet/logServlet?tag=11&taskId=" + task.taskId;
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

        xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readystate==4) {
				//ˢ�³ɹ������ˢ����ʾ��
				task.taskWaitSpan.style.display= "none";
				task.taskBtn.disabled = false;
				
				if(isSuccess(xmlhttp)) {
					var oXML = xmlhttp.responseXML;
					var taskState = {"success":"�����","error":"����ʧ��","queued":"�ȴ�ִ��","running":"���ڽ�����"};
					var resultObj = {
						"taskId":task.taskId,
						"taskName":oXML.selectSingleNode("/root/task/taskName").text,
						"progress":oXML.selectSingleNode("/root/task/progress").text,
						"taskState":oXML.selectSingleNode("/root/task/taskState").text,
						"queueTime":oXML.selectSingleNode("/root/task/queueTime").text,
						"startTime":oXML.selectSingleNode("/root/task/startTime").text,
						"completeTime":oXML.selectSingleNode("/root/task/completeTime").text,
						"detailInfo":oXML.selectSingleNode("/root/task/detailInfo").text
					};
					task.taskObj = resultObj;
			
					task.taskTab.deleteRow(1);
					var oTR = task.taskTab.insertRow();
					oTR.style.height="23px";
					oTR.style.backgroundColor="#FFFFFF";
			
					var oTD = oTR.insertCell();
                    oTD.style.padding = "3px";
					oTD.innerHTML = resultObj.taskName;
				    oTD = oTR.insertCell();
                    oTD.style.padding = "3px";
					oTD.innerHTML = resultObj.taskState=="running"?"��ǰ���ȣ�"+resultObj.progress+"%":taskState[resultObj.taskState];
					oTD = oTR.insertCell();
                    oTD.style.padding = "3px";
					oTD.innerHTML = resultObj.queueTime;
					oTD = oTR.insertCell();
                    oTD.style.padding = "3px";
					oTD.innerHTML = resultObj.startTime;
					oTD = oTR.insertCell();
                    oTD.style.padding = "3px";
					oTD.innerHTML = resultObj.completeTime;
					oTD = oTR.insertCell();
                    oTD.style.padding = "3px";
					oTD.innerHTML = resultObj.detailInfo;
				} else {
					task.taskObj = {
						"taskId":task.taskId,
						"taskState":"error",
						"detailInfo":"��ѯ������Ϣʧ��"
					};
				}
			}
		};
		xmlhttp.Open("POST",taskUrl,true);
		xmlhttp.send();

		//��ʾˢ����
		this.taskWaitSpan.style.display = "";
		task.taskBtn.disabled = true;
	},

	refreshTask:function() {
		var taskState = this.taskObj.taskState;
		if(taskState=="success") {
			window.clearTimeout(this.timer);
			this.okFn.call(this);
		} else if(taskState == "error"){
			window.clearTimeout(this.timer);
			this.failFn.call(this);
		} else {
			var self = this;
			window.setTimeout(function(){self.refreshTask()},2000)
		}
	},

	reloadTaskInfo:function() {
		this.loadTaskInfo();
		var self = this;
		this.timer = window.setTimeout(function(){self.reloadTaskInfo()},this.step)
	},
	
	defaultFailFn:function() {
		EMsg("������ʧ�ܣ�ʧ��ԭ�����������ϸ��Ϣ!");
	}
}

cloudTask.showWait = function(waitDiv,waitText) {
	var wd = waitDiv||document.getElementById("waitDiv");
	if(wd) {
		wd.style.display = "";
	}
    else{
        waitText = waitText || "�������ύ������˴��������ĵȴ�..." ;
        var sDivHTML = "<div id='waitDiv' style='display:none;'>\
        <div style='width:expression(document.body.offsetWidth);height:expression(document.body.offsetHeight);\
        z-index: 1000; position: absolute;left: 0px; top: 0px;filter:alpha(opacity=50); background-color:White'>\
        </div>\
        <div style='z-index: 1100; left: 25%; right: 25%; position: absolute;\
	     text-align: center; width: 50%; height: 50px; border: #009900 1px solid;\
	     background-color: #f9fff6; left: expression((this.offsetParent.clientWidth/2)-(this.clientWidth/2)+this.offsetParent.scrollLeft);\
	     top: expression((this.offsetParent.clientHeight/2)-(this.clientHeight/2)+this.offsetParent.scrollTop);'>\
            <br>\
                <span style='background : url(/resource/image/ani_wait1.gif) no-repeat;height:24px;width:24px;'>&nbsp;</span>\
                <span style='padding:5px 0 0 0;height:24px'>"+waitText+"</span>\
            </div>\
        </div>";
        window.document.body.insertAdjacentHTML("afterBegin", sDivHTML);
        cloudTask.showWait();
    }
}
cloudTask.hiddenWait = function(waitDiv) {
	var wd = waitDiv||document.getElementById("waitDiv");
	if(wd) {
		wd.style.display = "none";
	}
}
