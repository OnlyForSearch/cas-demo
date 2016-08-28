function showAuditWin(){
	var auditDiv = document.getElementById('auditWinDiv');
	var grid = Ext.getCmp(auditDiv.target);
	var auditId = -1;
	var store = grid.getStore();
	if(store.getCount() > 0){
		var record = store.getAt(0);
  		auditId = record.data.AUDIT_ID || -1;
	}
	//��������ṩAUDIT_ID
	if(auditId == -1){
		Ext.Msg.show({
			title : '��ʾ',
			msg : '��ȡ�İ�������Ϣ����',
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
						fieldLabel : '��ԪID',
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
						fieldLabel : '��ʷ�İ����'
					},{
						xtype : 'textarea',
						name : 'auditInfo',
						hiddenName : 'auditInfo',
						anchor : '98%',
						height : 90,
						fieldLabel : '����д�İ����'
					}],
			buttons : [{ 
				text : 'ȷ��',
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
							title : '��ʾ',
							msg : '�İ��������ɹ���',
							width:200,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.INFO
						});
						gatherAuditInfoWin.close();
					}
			}},{text : '����',handler : function(){gatherAuditInfoWin.close();}}],
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
	//û���İ�Ȩ��
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
		auditDiv.innerHTML = '<div><img src="'+imgUrl+'" height="150px;" width="150px;"/></div><div style="margin-bottom:5px;text-align:center;"><button onclick="showAuditWin()" style="height:26px;padding-top:3px;" type="button">�ύ�İ����</button></div>';
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
 var v=record.get('STAFF_NAME');//Ա������
 var v2=record.get('V1');
 var v3=record.get('TYPE_NAME');
 var v4=record.get('EXEC_STAFF');
//��ȡ�м�¼��KPI_ID�ֶε�ֵ,Ȼ����ݲ�ͬ��ֵ������CSS����Ĳ�ͬ��ʽ
 if (v == 'С��'&& v2 != '�ܼ�'){
    return 'x-grid-back-yellow'	
  }  
  
  
  if (v2 == '�ܼ�' && v== 'С��'){
    return 'x-grid-back-red'	
  }  
  
  if (v3 == '�ܼ�'){
  	return 'x-grid-back-red'
  }
  
  if (v3 != '�ܼ�' && v4 == 'С��'){
  	return 'x-grid-back-yellow'	
  }
  
  if (v3 == '�ܼ�' && v4 == 'С��'){
  	return 'x-grid-back-red'
  }
  
}