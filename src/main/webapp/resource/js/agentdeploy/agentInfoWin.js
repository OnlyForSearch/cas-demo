Global = {
	url : '../../servlet/AgentAttrServlet?',
	attrUrl : '../../servlet/AgentAttrServlet?',
	inputMode : 'new',
	agentInfoId : undefined,
	agentForm : undefined,
	paramForm : undefined,
	tabPanel : undefined,
	comp_id : {
		textfield : 1,
		select : 2
	},
	treeFieldValue:{
		region :'',
		dir:'',
		proxy1:'',
		proxy2:''
	},
	localIp : '',
	natIp : '',
	agentInfoWin : undefined,
	fromRec : null,
	attrField : ['ATTR_ID', 'GROUP_ID', 'ATTR_EN', 'ATTR_CN', 'COMP_ID','COMP_DS',
				'COMP_VAL', 'ATTR_ORDER', 'IS_NEED_TEXT', 'IS_NEED','REAL_VALUE','REMARK'],
	attrColumn : [new Ext.grid.RowNumberer(),{
				header		: "Ӣ������",
				width		: 110,
				dataIndex	: 'ATTR_EN'
			},{
				header		: "�Ƿ����",
				width		: 50,
				dataIndex	: 'IS_NEED_TEXT'
			},{
				header		: "ȱʡֵ",
				dataIndex	: 'COMP_VAL',
				renderer:function(v,metadata,rec)
				{
					var t = renderer(v,metadata,rec);
					//rec.set('COMP_VAL_TEXT',t);
					return '<textarea readonly=true style="border:0px;width:100%;height:16px;overflow:hidden;background:transparent">'+t+'</textarea>';
				}
			},{
				header		: "ʵ��ֵ",
				dataIndex	: 'REAL_VALUE',
				renderer:function(v,metadata,rec)
				{
					var t = renderer(v,metadata,rec);
					return '<textarea readonly=true style="border:0px;width:100%;height:16px;overflow:hidden;background:transparent">'+t+'</textarea>';
				}
			}]
}


function renderer(v,metadata,rec)
{
	var text = v;
	if(rec.get('COMP_ID') == Global.comp_id.select)
	{
		//���Ԫ��������������Ļ�,������������ݻ�����rec������selectDate
		if(!rec.selectDate)
			rec.selectDate = getSelectDate(rec.get('COMP_DS'));
		
		for(var i=0;i<rec.selectDate.length;i++)
		{
			if(rec.selectDate[i][0] == v)
			{
				text = rec.selectDate[i][1];
				break;
			}
		}		
	}
	return text;
}

function getSelectDate(comp_ds)
{
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","../../servlet/AgentAttrServlet?action=12&sql="+encodeURIComponent(comp_ds),false);
	xmlhttp.send();
	var list = []
	if (isSuccess(xmlhttp))
	{
		var oRows=xmlhttp.responseXML.selectNodes("//root/rowSet");
		for(var i=0;i<oRows.length;i++)
		{
			list[i] = [oRows[i].attributes[0].value, oRows[i].childNodes[0].text];
		}				
	}
	return list;
}

function agentInfoWinInit() {
	Global.agentForm = new Ext.FormPanel({
		bodyStyle : 'padding:10px 10px 0',
		border : false,
		frame : true,
		region : 'center',
		closeAction : 'hide',
		split : true,
		items : [{
					fieldLabel : '��ԪID',
					name : 'netId',
					hiddenName : 'netId',
					xtype : 'hidden'
				}, {
					fieldLabel : 'agentId',
					name : 'agentId',
					hiddenName : 'agentId',
					xtype : 'hidden'
				}, {
			layout : 'column',
			border : false,
			items : [{
				columnWidth : .5,
				layout : 'form',
				border : false,
				items : [{
							xtype : 'textfield',
							fieldLabel : 'AGENT����:',
							labelSeparator : '',
							name : 'agentName',
							anchor : '95%',
							maxLength : 250,
							allowBlank : false
						}, {
							xtype : "treefield",
							name : "region",
							hiddenName : 'region',
							fieldLabel : "����",
							emptyText : '��ѡ��...',
							treeHeight : 260,
							xmlUrl : '../../servlet/RegionTree?action=6',
							anchor : '95%',
							listeners:{
								beforerender  : function(component){
									component.setValue(Global.treeFieldValue.region);																		
								}
							},
							allowBlank : false
						}, {
							xtype : 'textfield',
							fieldLabel : '�����û��û���:',
							labelSeparator : '',
							name : 'userName',
							anchor : '95%',
							maxLength : 20,
							allowBlank : false
						}, {
							xtype : 'combo',
							store : new Ext.data.Store({
								proxy : new Ext.data.HttpProxy({
									url : '../../servlet/DeployAgentServlet?action=7'
								}),
								reader : new Ext.data.JsonReader({
											root : 'linkType'
										}, ['code', 'mean']),
								autoLoad : true
							}),
							fieldLabel : '��������',
							displayField : 'mean',
							valueField : 'code',
							editable : false,
							mode : 'local',
							triggerAction : 'all',
							emptyText : '��ѡ��',
							name : 'linkType',
							listeners : {
								'select' : {
									fn : function(box, record, index) {
										var newValue = box.getValue();
										if (newValue == 1) {
											Global.agentForm.getForm().findField('linkPort').setValue(23);
										} else if (newValue == 2) {
											Global.agentForm.getForm().findField('linkPort').setValue(22);
										}
										Global.agentForm.getForm().findField('ftpPort').setValue(21);
									}
								}
							},
							anchor : '95%',
							allowBlank : false
						}, {
							xtype : 'numberfield',
							fieldLabel : 'FTP�˿�',
							name : 'ftpPort',
							disabled : true,
							anchor : '95%',
							maxLength : 5,
							allowBlank : false
						}, {
							xtype : 'combo',
							store : new Ext.data.Store({
								proxy : new Ext.data.HttpProxy({
									url : '../../servlet/DeployAgentServlet?action=20&type=1'
								}),
								reader : new Ext.data.XmlReader({
										record : 'rowSet'
								}, ["NE_ID", "NE_NAME"]),
								autoLoad : true,
								listeners:{
									load  : function(component){
										Global.agentForm.getForm().findField('proxy1').setValue(Global.treeFieldValue.proxy1);
									}
								}
							}),
							fieldLabel : '�ϲ�ڵ�1',
							displayField : 'NE_NAME',
							valueField : 'NE_ID',
							editable : false,
							mode : 'local',
							width : 120,
							triggerAction : 'all',
							emptyText : '��ѡ��',
							name : 'proxy1',
							anchor : '95%'
						},{
							xtype : 'textarea',
							fieldLabel : '��ע',
							name : 'remark',
							width : '130',
							anchor : '95%',
							autoHeight : true
						}]
			}, {
				columnWidth : .5,
				layout : 'form',
				border : false,
				items : [{
							xtype : 'textfield',
							fieldLabel : 'AGENT��ԪIP',
							labelSeparator : ':',
							name : 'agentIp',
							//allowBlank : false,
							disabled : true,						
							maxLength : 15,
							anchor : '95%'
						}, {
							xtype : 'combo',
							store : new Ext.data.Store({
								proxy : new Ext.data.HttpProxy({
									url : '../../servlet/DeployAgentServlet?action=5'
								}),
								reader : new Ext.data.JsonReader({
											root : 'fileName'
										}, ['code', 'mean']),
								autoLoad : true
							}),
							fieldLabel : '��װ����',
							displayField : 'mean',
							valueField : 'code',
							editable : false,
							mode : 'local',
							width : 120,
							triggerAction : 'all',
							emptyText : '��ѡ��',
							name : 'fileName',
							allowBlank : false,
							anchor : '95%'
						}, {
							xtype : 'textfield',
							fieldLabel : '����',
							inputType : 'password',
							name : 'password',
							maxLength : 20,
							allowBlank : false,
							anchor : '95%'
						}, {
							xtype : 'numberfield',
							fieldLabel : '���Ӷ˿�:',
							labelSeparator : '',
							name : 'linkPort',
							maxLength : 5,
							allowBlank : false,
							anchor : '95%'
						}, {
							xtype : "treefield",
							name : "dir",
							fieldLabel : "��������",
							emptyText : '��ѡ��...',
							treeHeight : 260,
							xmlUrl : '../../servlet/DeployAgentServlet?action=23',
							allowBlank : false,
							listeners:{
								beforerender  : function(component){
									component.setValue(Global.treeFieldValue.dir);																		
								}
							},
							anchor : '95%'
						}, {
							xtype : 'combo',
							store : new Ext.data.Store({
								proxy : new Ext.data.HttpProxy({
									url : '../../servlet/DeployAgentServlet?action=20&type=2'
								}),
								reader : new Ext.data.XmlReader({
													record : 'rowSet'
												}, ["NE_ID", "NE_NAME"]),
								autoLoad : true,
								listeners:{
									load  : function(component){
										Global.agentForm.getForm().findField('proxy2').setValue(Global.treeFieldValue.proxy2);
									}
								}
							}),
							fieldLabel : '�ϲ�ڵ�2',
							displayField : 'NE_NAME',
							valueField : 'NE_ID',
							editable : false,
							mode : 'local',
							width : 120,
							triggerAction : 'all',
							emptyText : '��ѡ��',
							name : 'proxy2',
							anchor : '95%'
						},{
							layout : 'column',
							border : false,
							items : [{
								columnWidth : .7,
								border : false,
								layout : 'form',								
								items : [{
									xtype : "combo",
									name : "proxyGroup",
									fieldLabel : "ѡ��·��",
									editable : false,
									typeAhead : true,
									triggerAction : 'all',
									valueField : 'VALUE',
									displayField : 'NAME',
									mode : 'remote',
									listeners: {
								        // delete the previous query in the beforequery event or set
								        // combo.lastQuery = null (this will reload the store the next time it expands)
								        beforequery: function(qe){
								            delete qe.combo.lastQuery;
								        }
								    },
									anchor : '95%',
									store : new Ext.data.Store({
										url : "../../servlet/commonservlet?tag=201&paramValue=" + getAESEncode(encodeURIComponent("select a.proxy_group_id VALUE, a.proxy_group_name NAME from proxy_group_info a")),
										autoLoad : true,
										listeners : {
											load : function(store){
												//Ĭ�������ѡ��
												var defaultData = {VALUE: '',NAME: '-��-'};
												var r = new store.recordType(defaultData);
												store.insert(0, r);
											}
										},
										reader : new Ext.data.XmlReader({
													record : 'rowSet'
												}, ["VALUE", "NAME"])
									})
								}]
							}, {
								columnWidth : .3,
								border : false,
								layout : 'form',
								items : [{
									xtype : 'button',
									text : '·������...',
									anchor : '95%',
									scope : this,
									handler : function() {
										var config = {
											title : '·������',
											proxygroup : Global.agentForm.getForm().findField('proxyGroup')
										}
										var routerWin = new agentdeploy.router.routerWin(config);
										routerWin.show();
									}
								}]
							}]
						}]
			}]
		}],
		tbar : [{
					text : 'ȷ��',
					iconCls : "icon-apply",
					handler : function() {
						entter();
					}
				}, {
					text : 'ȡ��',
					iconCls : "icon-exit",
					handler : function() {
						Global.agentInfoWin.hide();
					}
				}]
	})

	Global.paramForm = new Ext.FormPanel({
				id : "paramForm",
				region : 'east',
				bodyStyle : 'padding:5px 5px 0',
				labelWidth : 75,
				border : false,
				frame : true,
				split : true,
				width : 270,
				defaultType : "textfield",
				defaults : {
					anchor : '95%'				
				},
				items : [{
							fieldLabel : 'Ӣ������',
							readOnly : true,
							cls : "readOnly",
							name : "ATTR_EN"
						},{
							fieldLabel : '��������',
							readOnly : true,
							cls : "readOnly",
							name : "ATTR_CN"
						}, {
							fieldLabel : '˳���',
							readOnly : true,
							cls : "readOnly",
							name : "ATTR_ORDER"
						}, {
							fieldLabel : '�Ƿ����',
							readOnly : true,
							cls : "readOnly",
							name : "IS_NEED_TEXT"
						},{
							fieldLabel : '˵��',
							xtype : "textarea",
							readOnly : true,
							cls : "readOnly",
							name : "REMARK"
						}, {
							fieldLabel : 'ȱʡֵ',
							xtype : "textarea",
							itemId : "defaultValue-field",
							readOnly : true,
							cls : "readOnly",
							name : "COMP_VAL"
						}]
			})

	Global.tabPanel = new Ext.TabPanel({
				plain : true,
				activeTab : 0,
				region : 'center',
				enableTabScroll : true,
				split: true,
				height : 327,
				listeners :{
					/*tabchange : function(TabPanel, tab) {
					},*/
					beforetabchange : function(TabPanel,newTab,currentTab){
						if(!isValid()) return false;
						if(currentTab&&currentTab.getComponent(0).getSelectionModel().hasSelection())
							currentTab.getComponent(0).getSelectionModel().clearSelections();
					}
				
				}
			})
			
	panel = new Ext.Panel({
				plain : true,
				border : false,
				layout	: 'border',
				region : 'south',
				split: true,
				height : 327,
				items : [Global.tabPanel, Global.paramForm]
			})
	
	Global.agentInfoWin = new Ext.Window({
		id : 'attrWindow',
		title : '<b>Agent������Ϣ</b>',
		width : 800,
		height : 1000,
		resizable : false,
		autoHeight : true,
		modal : true,
		closeAction : 'hide',
		items : [Global.agentForm,panel],
		listeners : {
			'beforehide' : function() {
				Global.paramForm.remove(Global.paramForm.find('name', 'REAL_VALUE')[0], true);
				Global.agentForm.getForm().reset();
				Global.paramForm.getForm().reset();			
				Global.inputMode = 'new';
				Global.fromRec = null;
				Global.tabPanel.removeAll();
			},
			'beforeshow' : function(){
				addGroupTab();
			}
		}
	});
}

function addGroupTab()
{
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.open("post", Global.attrUrl+"action=9", false);
	sendRequest.send();
	if (isSuccess(sendRequest))
	{
		var rows = sendRequest.responseXML.selectNodes("/root/rowSet");		
		for (var i = 0, row; row = rows[i]; i++)
		{
			var child = row.childNodes;
			var grid = new attrGrid();
			grid.getStore().load({
						params : {
							group_id : child[0].text,
							agent_id : Global.agentInfoId
						}
					})					
			Global.tabPanel.add({
				layout	: "border",
				id:'group'+child[0].text,
				title:child[2].text,
				items:[grid]
			});			
		}
		Global.tabPanel.setActiveTab(0);
	}	
}

function isValid()
{
	if(Ext.isEmpty(Global.fromRec))
		return true;
		
	var bForm = Global.paramForm.getForm();
	if(!bForm.isValid())
	{
		Ext.MessageBox.alert('��ʾ','���Ĭ��ֵΪ�գ����ұ����ʵ��ֵ������Ϊ��')
		return false;
	}
	
	Global.fromRec.set('REAL_VALUE',bForm.findField('REAL_VALUE').getValue());
	//Global.fromRec.set('REAL_VALUE_TEXT',bForm.findField('REAL_VALUE').getValue());
	
	//ɾ������ʵ��ֵ�Ŀؼ���
	Global.paramForm.remove(Global.paramForm.find('name', 'REAL_VALUE')[0], true);
	
	bForm.reset();	
	Global.fromRec = null;
	return true;
}

function entter()
{	
	bForm = Global.agentForm.getForm();
	if((!bForm.isValid()) || !isValid())
		return;
	
	var xmlData = new ActiveXObject("Microsoft.XMLDOM");
	var root = xmlData.createElement("root");
	xmlData.appendChild(root);	
	var params = xmlData.createElement("params");
	root.appendChild(params);
	if(!getAttrXml(xmlData,params))
		return;	
	CreateFormXml(xmlData,root);
	
	if(Ext.isEmpty(Global.natIp) && Ext.isEmpty(Global.localIp))
	{
		Ext.Msg.alert('��ʾ','LOCAL_IP��NAT_IP����ȫ��Ϊ��');
		return;
	}
	
	//��֤IP���ϲ�ڵ��ֵ�Ƿ�Ψһ��
	if(!checkUniqueIPandProxy())
		return;
	
	
	var action = Global.inputMode == 'new' ? 3 : 13;
	connection.request({
				waitMsg : "���ݴ�����",
				params : {action:action},
				xmlData : xmlData,
				success : function(response) {
					if (isSuccess(response)) {
						Ext.Msg.alert("��ʾ", "����ɹ�");
						Global.agentInfoWin.hide();
						agentListPanel.getStore().reload();
					}
				}
			})
	
	
}

function checkUniqueIPandProxy()
{
	bForm = Global.agentForm.getForm();
	
	var isCheck = true;
	var xmlRequst = new ActiveXObject("Microsoft.XMLHTTP");
	var sendParam = new Array(4);
	sendParam[0] = "action=49";
	sendParam[1] = "attIds="+30060103;
	sendParam[2] = "neId="+(Global.inputMode == 'new' ? -1 : bForm.findField('netId').getValue());
	sendParam[3] = "value="+(Ext.isEmpty(Global.natIp) ? Global.localIp:Global.natIp);
	
	sendParam[4] = "attProxyIds="+"30060107,30060108";//�ϲ�ڵ�����
	sendParam[5] = "proxy1="+bForm.findField('proxy1').getValue();
	sendParam[6] = "proxy2="+bForm.findField('proxy2').getValue();
	
	var sendUrl = getSendUrl("../../servlet/netElementManage?",sendParam);
	xmlRequst.Open("POST",sendUrl,false);
	xmlRequst.send("");
	if(isSuccess(xmlRequst))
	{
		var list = xmlRequst.responseXML.selectNodes('/root/rowSet');
		if(list.length>0)
		{
			var msgs = new Array(list.length)
			for(var i=0;i<list.length;i++)
			{
				msgs[i] = "��Ԫ:"+list[i].selectSingleNode('NE_NAME').text;
			}
			EMsg('"AGENT��ԪIP+�ϲ�ڵ�"��ֵ��"'+msgs.join(",")+'"�ظ�')
			isCheck = false;
		}
	}
	else
	{
		isCheck = false;
	}
	return isCheck;
}

function getAttrXml(doc, root)
{
	var attrs = ["ATTR_ID", "REAL_VALUE"];	
	var count = Global.tabPanel.items.getCount(),recs;
	var paramEl, attrEl;
	for(var i = 0;i<count;i++)
	{
		recs = Global.tabPanel.get(i).getComponent(0).getStore().data.items;
		for(var j = 0,rec;rec = recs[j]; j++)
		{
			if(checkIsNeed(rec) && Ext.isEmpty(rec.get('REAL_VALUE'),false))
			{
				Ext.Msg.alert('��ʾ','���Ĭ��ֵΪ�գ����ұ����ʵ��ֵ������Ϊ��');
				Global.tabPanel.setActiveTab(i);
				Global.tabPanel.get(i).getComponent(0).getSelectionModel().selectRow(j);
				return false;
			}
			
			if(rec.get("ATTR_EN")=='LOCAL_IP')
				Global.localIp = rec.get("REAL_VALUE")||rec.get("COMP_VAL");
			else if(rec.get("ATTR_EN")=='NAT_IP')
				Global.natIp = rec.get("REAL_VALUE")||rec.get("COMP_VAL");
			
			paramEl = doc.createElement("param");
			for (var k = 0, attr; attr = attrs[k]; k++)
			{
				attrEl = doc.createElement(attr);
				attrEl.text = rec.get(attr);
				paramEl.appendChild(attrEl);
			}
			root.appendChild(paramEl);
		}
	}
	return true;
}

attrGrid = Ext.extend(Ext.grid.GridPanel, {
	url : '',
	region : 'center',
	viewConfig : {
		forceFit : true
	},
	constructor : function() {
		this.loadMask = {
			msg : '���ݼ�����...'
		}, this.store = new Ext.data.XmlStore({
					proxy : new Ext.data.HttpProxy(new Ext.data.Connection({
								url : Global.attrUrl + 'action=10',
								method : 'POST'
							})),
					record : 'rowSet',
					fields : Global.attrField
				}), this.sm = new Ext.grid.RowSelectionModel({
					singleSelect : true,
					listeners : {
						rowselect : function(sm, row, rec) {
							Global.fromRec = rec;
							var field;						
							// ���Ĭ��ֵΪ�գ����ұ��������Ϊ��
							var allowBlank = !checkIsNeed(rec);
							
							if (rec.get('COMP_ID') == Global.comp_id.textfield) {
								field = new Ext.form.TextArea({
									fieldLabel : 'ʵ��ֵ',
									name : "REAL_VALUE",
									readOnly : false,
									maxLength : 150,
									allowBlank : allowBlank
									});						
							} else {
								field = new Ext.form.ComboBox({
											fieldLabel : "ʵ��ֵ",
											hiddenName : "REAL_VALUE",
											name : "REAL_VALUE",
											typeAhead : true,
											triggerAction : 'all',
											mode : 'local',
											editable : false,
											allowBlank : allowBlank,
											store : new Ext.data.SimpleStore({
														fields : ['VALUE','TEXT'],
														data : rec.selectDate
													}),
											valueField : 'VALUE',
											displayField : 'TEXT',
											listEmptyText : '',
											emptyText : '��ѡ��...'
										});
							}
							Global.paramForm.add(field);
							Global.paramForm.getForm().loadRecord(rec);
							Global.paramForm.doLayout();
							Global.paramForm.initFields();
						},
						beforerowselect : function(sel, index) {
							return isValid();
						}
					}
				}), this.cm = new Ext.grid.ColumnModel({
					defaultSortable : true,
					columns : Global.attrColumn
				})
		attrGrid.superclass.constructor.call(this);
	}
})

/**
 * ���Ĭ��ֵΪ�գ����ұ��������Ϊ��
 * @param {} rec
 * @return ���� true
 */
function checkIsNeed(rec) 
{
	return rec.get('IS_NEED') == '0SA' && Ext.isEmpty(rec.get('COMP_VAL'),false);
}

connection = function()
{
	function hideWait()
	{
		Ext.MessageBox.updateProgress(1);
		Ext.MessageBox.hide();
	}

	return new Ext.data.Connection({
				url			: '../../servlet/DeployAgentServlet',
				autoAbort	: false,
				method		: 'POST',
				listeners	: {
					beforerequest		: function(c, o)
					{
						if (o.waitMsg)
						{
							Ext.MessageBox.wait(o.waitMsg, '���Ե�...');
						}
					},
					requestcomplete		: function(c, r, o)
					{
						if (o.waitMsg)
						{
							hideWait();
						}
					},
					requestexception	: function(c, r, o)
					{
						if (o.waitMsg)
						{
							hideWait();
						}
						Ext.MessageBox.alert("����", "���ӷ���������!");
					}
				}
			})
}()

function CreateFormXml(sendXml, root) {

	bForm = Global.agentForm.getForm();

	var agentIp = sendXml.createElement("AGENTIP");
	agentIp.text = bForm.findField('agentIp').getValue();
	root.appendChild(agentIp);
	var password = sendXml.createElement("PASSWORD");
	password.text = bForm.findField('password').getValue();
	root.appendChild(password);

	var userName = sendXml.createElement("USERNAME");
	userName.text = bForm.findField('userName').getValue();
	root.appendChild(userName);

	var neId = sendXml.createElement("NEID");
	neId.text = bForm.findField('netId').getValue();;
	root.appendChild(neId);

	var agentInfoId = sendXml.createElement("AGENTINFOID");
	agentInfoId.text = bForm.findField('agentId').getValue();;
	root.appendChild(agentInfoId);

	var agentName = sendXml.createElement("AGENTNAME");
	agentName.text = bForm.findField('agentName').getValue();
	root.appendChild(agentName);

	var fileName = sendXml.createElement("FILENAME");
	fileName.text = bForm.findField('fileName').getValue();
	root.appendChild(fileName);

	var region = sendXml.createElement("REGION");
	region.text = bForm.findField('region').getValue();
	root.appendChild(region);

	var linkType = sendXml.createElement("LINKTYPE");
	linkType.text = bForm.findField('linkType').getValue();
	root.appendChild(linkType);

	var linkPort = sendXml.createElement("LINKPORT");
	linkPort.text = bForm.findField('linkPort').getValue();
	root.appendChild(linkPort);

	var ftpPort = sendXml.createElement("FTPPORT");
	ftpPort.text = bForm.findField('ftpPort').getValue();
	root.appendChild(ftpPort);

	var proxyGroup = sendXml.createElement("PROXYGROUP");
	proxyGroup.text = bForm.findField('proxyGroup').getValue();
	root.appendChild(proxyGroup);

	/*
	 * var localIp = sendXml.createElement("LOCALIP"); localIp.text =
	 * this.updateAgentPanel.getForm().findField('localIp') .getValue();
	 * root.appendChild(localIp);
	 * 
	 * var natIp = sendXml.createElement("NATIP"); natIp.text =
	 * this.updateAgentPanel.getForm().findField('natIp').getValue();
	 * root.appendChild(natIp);
	 */

	// ���ӱ�ע�ֶ�
	var remark = sendXml.createElement("REMARK");
	remark.text = bForm.findField('remark').getValue();
	root.appendChild(remark);

	var dir = sendXml.createElement("DIR");
	dir.text = bForm.findField('dir').getValue();
	root.appendChild(dir);
	
	var localIp = sendXml.createElement("LOCALIP");
	localIp.text = Global.localIp;
	root.appendChild(localIp);
	
	var natId = sendXml.createElement("NATIP");
	natId.text = Global.natIp;
	root.appendChild(natId);
	
	var proxy1 = sendXml.createElement("PROXY1");
	proxy1.text = bForm.findField('proxy1').getValue();
	root.appendChild(proxy1);
	
	var proxy2 = sendXml.createElement("PROXY2");
	proxy2.text = bForm.findField('proxy2').getValue();
	root.appendChild(proxy2);

	/** *******************************agentProxy�б�************************ */
	/*
	 * var proxy1Id = this.updateAgentPanel.getForm().findField('proxy1Id')
	 * .getValue(); if (proxy1Id && proxy1Id != '') { var proxy1 =
	 * sendXml.createElement("AGENTPROXY"); proxy1.setAttribute('id', proxy1Id);
	 * proxy1.setAttribute('sort', 1); proxy1.setAttribute('neName',
	 * this.updateAgentPanel.getForm() .findField('proxy1Id').getRawValue());
	 * proxy1.setAttribute('dataPort', this.updateAgentPanel.getForm()
	 * .findField('proxy1DataPort').getValue()); proxy1.setAttribute('filePort',
	 * this.updateAgentPanel.getForm() .findField('proxy1FilePort').getValue());
	 * proxy1.setAttribute('ip', this.updateAgentPanel.getForm()
	 * .findField('proxy1Ip').getValue()); root.appendChild(proxy1); } var
	 * proxy2Id = this.updateAgentPanel.getForm().findField('proxy2Id')
	 * .getValue(); if (proxy2Id && proxy2Id != '') { var proxy2 =
	 * sendXml.createElement("AGENTPROXY"); proxy2.setAttribute('id', proxy2Id);
	 * proxy2.setAttribute('neName', this.updateAgentPanel.getForm()
	 * .findField('proxy2Id').getRawValue()); proxy2.setAttribute('sort', 2);
	 * proxy2.setAttribute('dataPort', this.updateAgentPanel.getForm()
	 * .findField('proxy2DataPort').getValue()); proxy2.setAttribute('filePort',
	 * this.updateAgentPanel.getForm() .findField('proxy2FilePort').getValue());
	 * proxy2.setAttribute('ip', this.updateAgentPanel.getForm()
	 * .findField('proxy2Ip').getValue()); root.appendChild(proxy2); }
	 */
}
