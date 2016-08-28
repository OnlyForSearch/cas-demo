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
		MMsg("该值班线没有配置记录字段！");
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
	// 上次值班记录面板
	var upTabs = new Ext.TabPanel({	
				bodyStyle : 'background:#DFE8F7',
				xtype : 'tabpanel',
				region : 'north',
				minTabWidth : 135,
				tabWidth : 135,
				collapseMode : 'mini',
				split : true,
				border : false,
				// resizeTabs:true,宽度能自动变化,但是影响标题的显示
				activeTab : 0,
				height : 300,
				autoScroll : true,
				enableTabScroll : true,// 挤的时候能够滚动收缩
				width : 200,
				frame : true
			});
	// 这次值班面板
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
				title : '这次值班记录',
				width : 600,
				autoHeight : true,
				height : heightY
			})
	// 包含上次值班和这次值班记录的容器	
	var viewPanel = new Ext.Window({
				title : '上一次值班记录',
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
							text : dutyFlag=='off'?'保存并签退':'保存',
							disabled : flag,
							handler : saveCust
						}, {
							text : '打印',
							disabled : flag,
							handler : doPrint
						}, {
							text : '转故障流程',
							disabled : flag,
							hidden : isexist,
							handler : function(){
								window.open($getSysVar('LN_FLOW_FAILTURE'),'',
								'toobar=no,location=no,directories=no,status=0,menubar=0,resizable=yes,scrollbars=yes');
							}
						}, {
							text : '重置',
							disabled : flag,
							handler : resetForm
						}, {
							text : '关闭',
							handler : function() {
								if (dutyFlag == 'off') {
									if (nosave == true) {
										window.alert("您当前还未填写值班信息");
										return;
									}
								}
								window.close();
							}
						}]
			});
	// 初始化上次值班记录数据和这次这次值班记录表单元素个数
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
					var htmlContent = "<div style='background:#DFE8F7; width:100%; height:100%'><table width=100% ><tr><td colspan='2'>&nbsp;&nbsp;&nbsp;员工姓名："
							+ upList[u].STAFFNAME
							+ " &nbsp;&nbsp;&nbsp;&nbsp;联系电话："
							+ upList[u].CONTACT
							+ "</td></tr><tr><td colspan='2'>&nbsp;&nbsp;&nbsp;————————————————————————————————————————————————————</td></tr>";
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
								title : "值班员" + (u + 1),
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
						textArea.blankText = '【' + nowList[n].COLNAME + '】不能为空';
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
							title : '错误提示',
							msg : '加载出错',
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
				MMsg("已经签到完毕!");	
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
					waitMsg : '提交数据请稍后……',
					waitTitle : '提示',
					params : {
						nowArrangementID : nowArrangementID
					},
					xmlData : sendXml,
					callback : function(options, success, response){
						var responseMove = Ext.util.JSON .decode(response.responseText);
						if(responseMove.success==true){
							Ext.Msg.show({
								title : '成功提示',
								msg : '数据已经保存!',
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
									title : '验证提示',
									msg : '内容没有填写完整',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.INFO
								});
						}
					}
				}
			);
		}else{
			Ext.Msg.show({
					title : '验证提示',
					msg : '内容没有填写完整',
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
