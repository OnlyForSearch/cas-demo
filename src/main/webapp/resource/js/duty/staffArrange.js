var StaffArrange = new Object();

Ext.onReady(initExt);

function initExt() {
	var e = document.getElementById("staffArrangeDiv");
	StaffArrange.tabs = new Ext.TabPanel({
		renderTo : e,
		resizeTabs : true,
		minTabWidth : 115,
		tabWidth : 135,
		width : e.clientWidth,
		height : e.clientHeight, 
		enableTabScroll : true,
		defaults : {autoScroll : true}
	});
	
	loadData();
}

function addTab(dutyName, dutyId){
    StaffArrange.tabs.add({
        title: dutyName,
        iconCls: 'tabs',
        cls : 'layTab',
        html : '<iframe name="arrangeFrm" scrolling="auto" frameborder="0" width="100%" height="100%" src="dutyArrange.html?dutyId=' + dutyId + '"></iframe>'
    }).show();
}

function addMsgTab() {
	 StaffArrange.tabs.add({
        title: "无值班表",
        iconCls: 'tabs',
        html : '您没有相应的值班排班信息'
    });
}

function loadData() {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST","../../servlet/DutyAction?action=39",false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp)) {
		var arrangeNodes = xmlhttp.responseXML.selectNodes("//rowSet");
		if(arrangeNodes.length == 0) {
			addMsgTab();
		} else {
			for(var i=0,arrangeNode;arrangeNode = arrangeNodes[i];i++) {
				addTab(arrangeNode.selectSingleNode("DUTY_NAME").text, arrangeNode.selectSingleNode("DUTY_ID").text);
			}
			StaffArrange.tabs.setActiveTab(0);
		}
	}
}