var opTABLE = null;
var insertColumns = null;
var updateColumns = null;
var updateKeys = null;
var privilegeColumn = null;
var privilegeValue = null;
var updateKeyValue = null;
var textfieldCss = "margin:-1px 1px 0 0;height:22px;line-height:18px";
var oGrid = null;
var currentStaffId = null;
var currentStaffRegionId = null;

iniCurrentStaffId();
iniCurrentStaffRegionId();

function doRowdblclick(grid,columnIndex,e){
	oGrid = grid;
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var getColumnsSql = "SELECT OPERATION_TABLE,INSERT_COLUMNS,UPDATE_COLUMNS,UPDATE_KEY,PRIVILEGE_COLUMN FROM REPORT_ACTION_CFG WHERE GET_VALUE_CFG_ID=" + this.result.key;
   	oXMLHTTP.open("POST","../../servlet/@Deprecated/ExecServlet?action=101&paramValue=" + getAESEncode(encodeURIComponent(getColumnsSql)),false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{   
   		record = this.getStore().getAt(columnIndex);
   		opTABLE = oXMLHTTP.responseXML.selectSingleNode("/root/rowSet").getAttribute('id');
   		insertColumns = oXMLHTTP.responseXML.selectSingleNode("/root/rowSet/INSERT_COLUMNS").text;
   		updateColumns = oXMLHTTP.responseXML.selectSingleNode("/root/rowSet/UPDATE_COLUMNS").text;
   		updateKeys = oXMLHTTP.responseXML.selectSingleNode("/root/rowSet/UPDATE_KEY").text;
   		privilegeColumn = oXMLHTTP.responseXML.selectSingleNode("/root/rowSet/PRIVILEGE_COLUMN").text;
   		if(privilegeColumn){
   			privilegeValue = parseField(record.get(privilegeColumn));
   		}
   		
   		if(privilegeValue == null){
   			showOpwin();
   		}else if(privilegeValue == currentStaffRegionId){
   			showOpwin();
   		}
   	}
}

function parseField(value){
	if(!value) return null;
	var regExp = new RegExp("<(.| )+?>", "gim");
	if(regExp.test(value))
    	return value.replace(regExp, "");
    else
    	return value;
}

function buildFormField(opColumns){
	var fields = new Array();
	if(opColumns){
		var columns = eval(opColumns);
		for(var i=0;i<columns.length;i++){			
			var tField = {
				fieldLabel : columns[i][1],
				anchor : '90%',
				name : columns[i][1],
				hiddenName : columns[i][1],
				allowBlank : true,
				style : textfieldCss,
				value : parseField(record.get(columns[i][1])),
				valueType : columns[i][0]
			};
			fields.push(tField);
		}
	}
	return fields;
}

function doInsert(){
	var sqlPrefix = "INSERT INTO " + opTABLE;
	var column = "";
	var columnValues = "";
	
	var sql = "";
	var frm = insertForm.getForm();
	var columns = eval(insertColumns);
	for(var i=0;i<columns.length;i++){
		column += "," + columns[i][2];
		var v = frm.findField(columns[i][1]).getValue();
		if(columns[i][0].toUpperCase() == "STRING"){
			v = "'" + v + "'";
		}
		columnValues += "," + v;
	}
	column = column.substring(1,column.length);
	columnValues = columnValues.substring(1,columnValues.length);
	sql = sqlPrefix +"("+ column + ") values(" + columnValues +")";
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
   	oXMLHTTP.open("POST","../../servlet/@Deprecated/ExecServlet?action=5&sql=" + sql,false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{
    	Ext.MessageBox.show({
    		width : 160,
    		msg : '创建成功!',
    		icon:Ext.MessageBox.INFO,buttons:{"ok":"确定"},
    		fn:function(){
    				win.close();
    				oGrid.getStore().reload();
    		}
    	});
   	}
}

function doUpdate(){
	var sqlPrefix = "UPDATE " + opTABLE + " SET ";
	var sqlSuffix = " WHERE 1=1";
	var keys = eval(updateKeys);
	for(var i=0;i<keys.length;i++){
		var v = parseField(record.get(keys[i][1]));
		if(keys[i][0].toUpperCase() == "STRING"){
			v = "'" + v + "'"; 			
		}
		sqlSuffix += " AND " + keys[i][1] + "=" + v;
	}
	var sql = "";
	var frm = updateForm.getForm();
	var columns = eval(updateColumns);
	for(var i=0;i<columns.length;i++){
		var v = frm.findField(columns[i][1]).getValue();
		if(columns[i][0].toUpperCase() == "STRING"){
			v = "'" + v + "'"; 			
		}
		sql += "," + columns[i][2] + "=" + v;
	}
	sql = sql.substring(1,sql.length); 	
	sql = sqlPrefix + sql + sqlSuffix;
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
   	oXMLHTTP.open("POST","../../servlet/@Deprecated/ExecServlet?action=5&sql=" + sql,false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{   		   		
    	Ext.MessageBox.show({
    		width : 160,
    		msg : '更新成功!',
    		icon:Ext.MessageBox.INFO,buttons:{"ok":"确定"},
    		fn:function(){
    				win.close();
    				oGrid.getStore().reload();
    		}
    	});
   	}
}

function showOpwin(){
	var insertFormField = buildFormField(insertColumns);
	var updateFormField = buildFormField(updateColumns);	
	insertForm = new Ext.form.FormPanel({
		frame : false,
		border : false,
		labelWidth : 60,
		autoHeight : true,
		layout : 'form',
		labelAlign : 'right',
		buttonAlign : 'center',
		defaultType : 'textfield',
		bodyStyle : 'text-align:center;padding:10,0,0,10;',
		items : [insertFormField],
		buttons : [{
					text : '创建',
					handler : doInsert
				},{
					text : '关闭',
					handler : function(){
						win.close();
					}
				}]
	});
	
	updateForm = new Ext.form.FormPanel({
			frame : false,
			border : false,
			labelWidth : 60,
			autoHeight : true,
			layout : 'form',
			labelAlign : 'right',
			buttonAlign : 'center',
			defaultType : 'textfield',
			bodyStyle : 'text-align:center;padding:10,0,0,10;',
			items : [updateFormField],
			buttons : [{
						text : '更新',
						handler : doUpdate
					},{
						text : '关闭',
						handler : function(){
							win.close();
						}
					}]
		});
	var tabPanelItem = new Array();
	if(updateColumns){ 
		tabPanelItem.push({
			title : '更新',
			layout : 'fit',
			autoHeight : true,
			items : [updateForm]
	   	});
	}
	if(insertColumns){
		tabPanelItem.push({
			title : '新建',
			layout : 'fit',
			autoHeight : true,
			items : [insertForm]
	   	});
	}
	tabPanel = new Ext.TabPanel({
			width : 550,
   			autoHeight : true,
   			border : false,
   			activeTab : 0,
   			deferredRender : true,
			layoutOnTabChange : true,
   			items : [tabPanelItem],
   			listeners : {
   				'tabchange' : function(tab, panel){
   					win.syncSize();
   				}
   			}
	});
	
	win = new Ext.Window({
   			width : 550,
   			autoHeight : true,
   			iconCls : "icon-grid",
			layout : 'fit',
			closeAction : 'close',
			modal : true,
			animateTarget : Ext.getBody(),
			items : [tabPanel]
   		});
   	win.show();
}

function iniCurrentStaffId()
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "../../servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP))
	{
		currentStaffId = oXMLHTTP.responseXML.selectSingleNode("/root/staff_id").text;
	}
}

function iniCurrentStaffRegionId(){
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var sql = "SELECT REGION_ID FROM STAFF WHERE STAFF_ID=" + currentStaffId; 
   	oXMLHTTP.open("POST","../../servlet/@Deprecated/ExecServlet?action=101&paramValue=" + getAESEncode(encodeURIComponent(sql)),false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{
   		currentStaffRegionId = oXMLHTTP.responseXML.selectSingleNode("/root/rowSet").getAttribute('id');
   	}
}