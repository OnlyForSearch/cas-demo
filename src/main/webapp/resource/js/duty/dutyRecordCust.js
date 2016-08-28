Ext.ns('duty.record.cust');
Ext.onReady(startCust);
var nosave = true;
var o = {}; 
var fieldList = new Array();
var isexist = false;
function startCust() {
	var LN = $getSysVar('LN_FLOW_FAILTURE');
	if(LN==null||LN==''){
		isexist = true;
	}
	var arrangementId = $request("arrangementId");

	var arrangementMsg = getArrangemengMsg(arrangementId);
	if (arrangementMsg.recordInstNum == "0") {
		MMsg("��ֵ����û�����ü�¼�ֶΣ�");
		window.close();
	}

	var readOnly = $request("readOnly");
	if (readOnly && readOnly == "true") {
		new duty.record.cust.custWin(arrangementMsg.dutyId,
				arrangementMsg.arrangementId, arrangementId, true);
				
	} else {
		new duty.record.cust.custWin(arrangementMsg.dutyId,
				arrangementMsg.arrangementId, arrangementId, false);
	}
	
	o.dutyId = arrangementMsg.dutyId;
	o.id = arrangementId;
}

function getArrangemengMsg(id) {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST", "../../servlet/DutyAction?action=36&id=" + id, false);
	xmlhttp.send();

	var arrangementMsg = {};
	if (isSuccess(xmlhttp)) {
		arrangementMsg.dutyId = xmlhttp.responseXML
				.selectSingleNode("//DUTY_ID").text;
		arrangementMsg.arrangementId = xmlhttp.responseXML
				.selectSingleNode("//ARRANGEMENT_ID").text
		arrangementMsg.recordInstNum = xmlhttp.responseXML
				.selectSingleNode("//RECORD_INST_NUM").text;
	}

	return arrangementMsg;
}
duty.record.cust.custWin = function(dutyID, upArrangementID, nowArrangementID,
		flag) {
	var dutyFlag = $request("dutyFlag");
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';
	//var fieldList = new Array();
	var heightY = 200;
	// �ϴ�ֵ���¼���
	var upTabs = new Ext.TabPanel({	
				bodyStyle : 'background:#DFE8F7',
				xtype : 'tabpanel',
				region : 'north',
				minTabWidth : 135,
				tabWidth : 135,
				collapseMode : 'mini',
				split : true,
				border : false,
				// resizeTabs:true,������Զ��仯,����Ӱ��������ʾ
				activeTab : 0,
				height : 300,
				autoScroll : true,
				enableTabScroll : true,// ����ʱ���ܹ���������
				width : 200,
				frame : true
			});
	// ���ֵ�����
	var nowForm = new Ext.FormPanel({
				labelWidth : 60,
				frame : true,
				width : 700,
				border : false,
				autoScroll : true,
				height : heightY,
				region : 'center'
			});
	var fileSet = new Ext.form.FieldSet({
				title : '���ֵ���¼',
				width : 600,
				autoHeight : true,
				height : heightY
			})
	// �����ϴ�ֵ������ֵ���¼������	
	var viewPanel = new Ext.Window({
				title : '��һ��ֵ���¼',
				width : 700,
				height : 650,
				autoScroll : true,
				y : 0,
				enableTabScroll : true,
				closable : false,
				buttonAlign : 'center',
				layout : 'border',
				items : [upTabs],
				draggable : false,
				buttons : [{
							text : dutyFlag=='off'?'���沢ǩ��':'����',
							disabled : flag,
							handler : saveCust
						}, {
							text : '��ӡ',
							disabled : flag,
							handler : doPrint
						}, {
							text : 'ת��������',
							disabled : flag,
							hidden : isexist,
							handler : function(){
								window.open($getSysVar('LN_FLOW_FAILTURE'),'',
								'toobar=no,location=no,directories=no,status=0,menubar=0,resizable=yes,scrollbars=yes');
							}
						}, {
							text : '����',
							disabled : flag,
							handler : resetForm
						}, {
							text : '�ر�',
							handler : function() {
								if (dutyFlag == 'off') {
									if (nosave == true) {
										window.alert("����ǰ��δ��дֵ����Ϣ");
										return;
									}
								}
								window.close();
							}
						}]
			});
	// ��ʼ���ϴ�ֵ���¼���ݺ�������ֵ���¼��Ԫ�ظ���
	Ext.Ajax.request({
		url : '/servlet/dutyRecordConfig.do?method=showDutys',
		params : {
			dutyID : dutyID,
			upArrangementID : upArrangementID,
			nowArrangementID : nowArrangementID
		},
		callback : function(options, success, response) {
			var duty = Ext.util.JSON.decode(response.responseText);
			if (duty.success == true) {
				var upList = eval(duty.dutyUp);
				for (var u = 0; u < upList.length; u++) {
					var htmlContent = "<div style='background:#DFE8F7; width:100%; height:100%'><table width=100% ><tr><td colspan='2'>&nbsp;&nbsp;&nbsp;Ա��������"
							+ upList[u].STAFFNAME
							+ " &nbsp;&nbsp;&nbsp;&nbsp;��ϵ�绰��"
							+ upList[u].CONTACT
							+ "</td></tr><tr><td colspan='2'>&nbsp;&nbsp;&nbsp;��������������������������������������������������������������������������������������������������������</td></tr>";
					var custList = eval(upList[u].custJson);
					for (var c = 0; c < custList.length; c++) {
						htmlContent += "<tr><td width=65>&nbsp;&nbsp;&nbsp;"
								+ custList[c].COLNAME
								+ ":</td><td align='left'><textarea readOnly='readOnly' style='color:#808080;width=500' rows='3'>"
								+ custList[c].COLVALUE
								+ "</textarea></td></tr>";
					}
					htmlContent += "</table></div>";
					upTabs.add({
								title : "ֵ��Ա" + (u + 1),
								id : upList[u].STAFFID,
								html : htmlContent,
								autoScroll : true,
								iconCls : 'stafftop'
							});
					upTabs.setActiveTab(upList[0].STAFFID);
				}
				var nowList = eval(duty.dutyNow);
				for (var n = 0; n < nowList.length; n++) {
					var filedBean = {};
					filedBean.COLNAME = nowList[n].COLNAME;
					filedBean.COLNAMEID = "COLNAME" + n;
					filedBean.INSTID = nowList[n].INSTID;
					filedBean.CUSTID = nowList[n].CUSTID;
					filedBean.COLVALUE = nowList[n].COLVALUE;
					filedBean.DESCRIP = nowList[n].DESCRIP;
					filedBean.ISREQUEST = nowList[n].ISREQUEST;					
					fieldList.push(filedBean);
					t = fieldList;
					var testHidden = new Ext.form.Hidden({
								name : "HID" + n,
								id : "HID" + n,
								value : nowList[n].COLNAME
							});
					var textArea = new Ext.form.TextField({
								width : 250,
								name : "COLNAME" + n,
								id : "COLNAME" + n,
								value : nowList[n].COLVALUE
							});
					var textDescrp = new Ext.form.Label({
								width : 250,
								name : "DESNAME" + n,
								id : "DESNAME" + n,
								value : nowList[n].DESCRIP,
								readOnly:true
							});
					if (nowList[n].ISREQUEST == '0BT') {
						textArea.allowBlank = false;
						textArea.blankText = '��' + nowList[n].COLNAME + '������Ϊ��';
					}
					var textPanel = new Ext.Panel({
						id: 'textPanel'+n,
						name: 'textPanel'+n,
						layout				: 'table',		
						border				: true,
						isFormField :true,
						fieldLabel : nowList[n].COLNAME,
						items		:[textArea,textDescrp,testHidden]
					});
					fileSet.add(textPanel);
				}
				nowForm.add(fileSet);
				viewPanel.add(nowForm);
				viewPanel.show();
			} else {
				Ext.Msg.show({
							title : '������ʾ',
							msg : '���س���',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
			}
		}
	});

	function saveCust(){		
		if(dutyFlag =='on'){
			var id = $request("arrangementId");
			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			var sendURL = "../../servlet/DutyAction?";
			var params;
			params = new Array();
			params.push("action=19");
			params.push("id="+id);
			xmlhttp.Open("POST",sendURL+params.join("&"),false);
			xmlhttp.send();
			if(isSuccess(xmlhttp)){
				MMsg("�Ѿ�ǩ�����!");	
			}		
		}
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement('FORM');
		var isVolid = true;
		sendXml.appendChild(root);
//		if(dutyFlag!='off' || nowForm.form.isValid()){
		for (i = 0; i < fieldList.length; i++) {
			var FormField = sendXml.createElement('FormFields');
			var INSTID = sendXml.createElement('INSTID');
			INSTID.text = fieldList[i].INSTID;
			FormField.appendChild(INSTID);
			var COLNAME = sendXml.createElement('COLNAME');
			COLNAME.text = fieldList[i].COLNAME;
			FormField.appendChild(COLNAME);
			var CUSTID = sendXml.createElement('CUSTID');
			CUSTID.text = fieldList[i].CUSTID;
			FormField.appendChild(CUSTID);
			var COLVALUE = sendXml.createElement('COLVALUE');
			COLVALUE.text = Ext.getCmp(fieldList[i].COLNAMEID).getValue();
			if (fieldList[i].ISREQUEST == '0BT') {
				if(COLVALUE.text==null||COLVALUE.text==''){
					isVolid = false;	
					break;				
				}
			}
			FormField.appendChild(COLVALUE);
			root.appendChild(FormField);
		}
		if(isVolid){
			Ext.Ajax.request(
				{
					url : '/servlet/dutyRecordConfig.do?method=addNowDuty',
					waitMsg : '�ύ�������Ժ󡭡�',
					waitTitle : '��ʾ',
					params : {
						nowArrangementID : nowArrangementID
					},
					xmlData : sendXml,
					callback : function(options, success, response){
						var responseMove = Ext.util.JSON .decode(response.responseText);
						if(responseMove.success==true){
							Ext.Msg.show({
								title : '�ɹ���ʾ',
								msg : '�����Ѿ�����!',
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.INFO,
								fn : (dutyFlag == "off") ? function() {
									nosave = false;
									var ctrlPageURL = 'offDutyInfo.html';
									var ctrlPageFeatures = 'dialogWidth=400px;dialogHeight=230px;help=0;scroll=0;status=0;';
									var rsType = window.showModalDialog(ctrlPageURL, o,ctrlPageFeatures);
									if (rsType == 1) {
										window.close();
									}
								}: function() {}
							});
						}else{
							Ext.Msg.show({
									title : '��֤��ʾ',
									msg : '����û����д����',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.INFO
								});
						}
					}
				}
			);
		}else{
			Ext.Msg.show({
					title : '��֤��ʾ',
					msg : '����û����д����',
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.INFO
				});

		}
	}
	
	function resetForm() {
		for (i = 0; i < fieldList.length; i++) {
			Ext.getCmp(fieldList[i].COLNAMEID).setValue("");
		}
	}
	
	function doPrint() {		
		window.open('dutyPrint.html?lenth='+fieldList.length,'','toobar=no,location=no,directories=no,status=0,menubar=0,resizable=yes,scrollbars=yes');
	}
}
