function showAuditWin(){
	var auditDiv = document.getElementById('auditWinDiv');
	var grid = Ext.getCmp(auditDiv.target);
	var auditId = -1;
	var store = grid.getStore();
	if(store.getCount() > 0){
		var record = store.getAt(0);
  		auditId = record.data.AUDIT_ID || -1;
	}
	//报表必须提供AUDIT_ID
	if(auditId == -1){
		Ext.Msg.show({
			title : '提示',
			msg : '获取阅办批次信息错误！',
			width : 220,
			buttons : Ext.Msg.OK,
			icon : Ext.Msg.INFO
		});
		return false;
	}
	gatherAuditInfoForm = new Ext.form.FormPanel({
			frame : true,
			labelWidth : 100,
			autoHeight : true,
			labelAlign : 'right',
			items : [{
						fieldLabel : '网元ID',
						name : 'auditId',
						hiddenName : 'auditId',
						value : auditId,
						xtype : 'hidden'
					},{
						xtype : 'textarea',
						anchor : '98%',
						style : 'margin:5 0 8 0',
						name : 'auditHisInfo',
						hiddenName : 'auditHisInfo',
						height : 180,
						readOnly : true,
						fieldLabel : '历史阅办意见'
					},{
						xtype : 'textarea',
						name : 'auditInfo',
						hiddenName : 'auditInfo',
						anchor : '98%',
						height : 90,
						fieldLabel : '请填写阅办意见'
					}],
			buttons : [{ 
				text : '确定',
				handler : function(){
					var frm = gatherAuditInfoForm.getForm();
					var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					var paramArr = new Array();
					paramArr.push("auditInfo="+frm.findField('auditInfo').getValue());
					paramArr.push("auditId="+frm.findField('auditId').getValue());
					xmlhttp.Open("POST",'/servlet/AlarmReportServlet?action=18&'+paramArr.join("&"),false);
					xmlhttp.send("");
					if(isSuccess(xmlhttp)){
						Ext.Msg.show({
							title : '提示',
							msg : '阅办意见保存成功！',
							width:200,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.INFO
						});
						gatherAuditInfoWin.close();
					}
			}},{text : '返回',handler : function(){gatherAuditInfoWin.close();}}],
			listeners : {
				render : function(){
					var frm = gatherAuditInfoForm.getForm();
					var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					xmlhttp.Open("POST",'/servlet/AlarmReportServlet?action=19&auditId='+frm.findField('auditId').getValue(),false);
					xmlhttp.send("");
					if(isSuccess(xmlhttp)){
						var oRows = xmlhttp.responseXML.selectNodes('/root/rowSet');
						for(var i=0;i<oRows.length;i++){
							var auditInfo = oRows[i].selectSingleNode("AUDIT_INFO").text;
							var prevValue = frm.findField('auditHisInfo').getValue() || "";
							frm.findField('auditHisInfo').setValue(prevValue+auditInfo+ "\r\n");
						}
					}
				}
			}
		});
	
	gatherAuditInfoWin = new Ext.Window({
		width : 800,
		autoHeight : true,
		layout	: "fit",
		resizable : false,
		modal : true,
		items : gatherAuditInfoForm
	});
	gatherAuditInfoWin.show();
}

function showAuditBox(){
	var staffs = $getSysVar('SYS_AUDIT_STAFFS');
	var curStaffId = getCurrentStaffId();
	//没有阅办权根
	if(staffs.indexOf(curStaffId) == -1) return false;
	var auditDiv = document.getElementById('auditWinDiv');
	if(!auditDiv)
	{
		auditDiv = document.createElement("div");
		auditDiv.id = 'auditWinDiv';
		auditDiv.target = this.id;
		auditDiv.style.position = 'absolute';
		auditDiv.style.zIndex = 99999;
		var imgUrl = $getSysVar('BON_AUDIT_IMAGE_URL');
		auditDiv.innerHTML = '<div><img src="'+imgUrl+'" height="150px;" width="150px;"/></div><div style="margin-bottom:5px;text-align:center;"><button onclick="showAuditWin()" style="height:26px;padding-top:3px;" type="button">提交阅办意见</button></div>';
		document.body.appendChild(auditDiv);
		this.on('bodyresize',showAuditBox);
	}
	var grid = Ext.getCmp(auditDiv.target);
	var posArr = grid.getPosition();
	var posX = posArr[0] + grid.getInnerWidth() - 170;
	var posY = posArr[1] + grid.getInnerHeight() - 195;
	auditDiv.style.top = posY + "px";
	auditDiv.style.left = posX + "px";
}

function setbackgroundAlarm(record,rowIndex,rowParams,store)
{
 var v=record.get('STAFF_NAME');//员工姓名
 var v2=record.get('V1');
 var v3=record.get('TYPE_NAME');
 var v4=record.get('EXEC_STAFF');
//获取行记录的KPI_ID字段的值,然后根据不同的值返回在CSS定义的不同样式
 if (v == '小计'&& v2 != '总计'){
    return 'x-grid-back-yellow'	
  }  
  
  
  if (v2 == '总计' && v== '小计'){
    return 'x-grid-back-red'	
  }  
  
  if (v3 == '总计'){
  	return 'x-grid-back-red'
  }
  
  if (v3 != '总计' && v4 == '小计'){
  	return 'x-grid-back-yellow'	
  }
  
  if (v3 == '总计' && v4 == '小计'){
  	return 'x-grid-back-red'
  }
  
}