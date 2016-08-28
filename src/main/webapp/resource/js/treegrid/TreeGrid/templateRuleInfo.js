var Global = {
	topBar		: undefined,
	tree		: undefined,
	rule		: undefined,
	defaultTab	: undefined,
	mainPanel	: undefined,
	PerfMainPanel 	: undefined,
	ruleGrid		: undefined,
	perfRuleGrid	: undefined,
	ruleGridByNe	: undefined,
	ruleGridByType	: undefined,
	perfRuleGridByNe	: undefined,
	perfRuleGridByType	: undefined,
	gridPanel	: undefined,
	rulePanel	: undefined,
	urlParam	: undefined,
	isVariableConfig	: undefined,
	rootNodeJson : undefined,//树根节点
	myMask 		: undefined,//界面加载等待提示
	rulePanelMask 	: undefined,//规则详细信息对象加载等待提示
	isPage		: undefined,//表格分页
	data        : undefined
}
Ext.LoadMask.prototype.msg = "数据载入中...";
var marginCss = 'margin:-2,0,0,0';
if(Ext.isIE8){
	marginCss = 'margin:0,0,0,0';
}
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var alarmRuleUrl = "/servlet/AlarmRuleAction.do?";
var alarmRuleCtrlUrl = "/servlet/alarmRuleCtrl.do?method=";
var dsUrl = "/servlet/netElementManage?";
var actionFlag = ["get","add","edit","del","enable","disable","upgrade","degrade"];
var ruleType = ["alarmShieldRule","alarmTitleRule","alarmRepeatRule","alarmUpgradeRule","alarmDispatchRule","alarmNotifyRule","alarmSendRule","alarmRelevanceShieldRule","prefThresholdRule","alarmRootCauseRule","alarmTriggerRule"];
var msg = ["数据添加成功!","数据添加失败!","数据修改成功!","数据修改失败!","数据删除成功!","数据删除失败!"];
var xmlHead = '<?xml version="1.0" encoding="gb2312"?>';

var commonGlobal = {
		ruleInfo 		: new Object(),
		RuleInfoWin 	: undefined,
		baseOn			: "alarmRuleBaseOnNe",
		isHideTabCondition	: false,
		idFlag			: "MAIN"//标识界面元素名称(主界面MAIN和添加弹出界面EDIT)
	}
function iniPage(){
	Global.data = window.dialogArguments;
	var sys = $getSysVar("ALARM_RULE_URL_PARAM_CONFIG");
	Global.isVariableConfig = $getSysVar("ALARM_RULE_IS_VARIABLE_CONFIG");
	if(!sys){
		Ext.Msg.alert('系统提示', "对不起，您没有配置告警规则URL参数！");
		return false;
	}
	var params = sys.split(",");
	var map = {};
	for (var i = 0; i < params.length; i++) {
		var param = params[i].split("=");
		map[param[0]] = param[1];
	}
	commonGlobal.ruleInfo.ruleResult = commonGlobal.ruleInfo.result = map.result;
	commonGlobal.ruleInfo.dispatchResult = map.dispatchResult;
	commonGlobal.ruleInfo.notifyResult = map.notifyResult;
	commonGlobal.ruleInfo.perfThresholdResult = map.result;
	commonGlobal.ruleInfo.resultHistory = map.resultHistory;
	commonGlobal.ruleInfo.CLASS_NAME = Global.data.CLASS_NAME;
	commonGlobal.ruleInfo.ruleType = ruleType[parseInt(Global.data.ruleTypeId)-3];
	commonGlobal.ruleInfo.RULE_TITLE = Global.data.RULE_TITLE;
	var tabPanel = new Ext.Panel({
		border 			: false,
		width           : 900,
		height          : 550,
		layout	        : "fit",
	    applyTo         : Ext.getBody()
	});
	Global.rulePanelMask = new Ext.LoadMask(Ext.getBody(), {msg:"界面加载中..."});
	Global.rulePanelMask.show();//显示加载等待提示
	Global.ruleCtrl = factoryCtrl.newRuleCtrl(commonGlobal.ruleInfo.CLASS_NAME);
	Global.rulePanel = Global.ruleCtrl.show();
	tabPanel.add(Global.rulePanel);
	tabPanel.doLayout();
	(function(){
		Global.ruleCtrl.loadData();
		if(commonGlobal.ruleInfo.ruleType=='10' ||parseInt(Global.data.ruleTypeId)=='1'){//关联规则与性能阀值不显示条件页
			Global.rulePanel.hideTabStripItem(1);
			Global.rulePanel.setActiveTab(GlobalTabPanel.defaultTab);//激活页初始化为默认页
		    commonGlobal.isHideTabCondition = true;//条件设置隐藏标记
		}else{
			Global.rulePanel.unhideTabStripItem(1);
		    commonGlobal.isHideTabCondition = false;//条件设置隐藏标记
		}
		Global.rulePanelMask.hide();//屏蔽加载等待提示
	}).defer(1500);
}

//创建告警详细信息窗体
function createRuelInfoPanel(){
	if(!Global.rulePanel){
		Global.rulePanelMask = new Ext.LoadMask(Ext.getBody(), {msg:"界面加载中..."});
		Global.rulePanelMask.show();//显示加载等待提示
		createRuelInfoPanelMask.defer(1);
	}
}
function createRuelInfoPanelMask(){
	createRuelInfoPanelObject();
	Global.rulePanelMask.hide();//屏蔽加载等待提示
}
function createRuelInfoPanelObject(){
	Global.ruleCtrl = factoryCtrl.newRuleCtrl(commonGlobal.ruleInfo.CLASS_NAME);
	if(!Global.rulePanel){
		Global.rulePanel = Global.ruleCtrl.show();
		Global.mainPanel.getComponent(1).getComponent(1).add(Global.rulePanel);
		Global.mainPanel.getComponent(1).getComponent(1).doLayout();
	}
	if(commonGlobal.ruleInfo.ruleType=='10' ||commonGlobal.ruleInfo.ruleType=='1'){//关联规则与性能阀值不显示条件页
		Global.rulePanel.hideTabStripItem(1);
		Global.rulePanel.setActiveTab(GlobalTabPanel.defaultTab);//激活页初始化为默认页
	    commonGlobal.isHideTabCondition = true;//条件设置隐藏标记
	}else{
		Global.rulePanel.unhideTabStripItem(1);
	    commonGlobal.isHideTabCondition = false;//条件设置隐藏标记
	}
}

//规则工厂定义
var factoryCtrl = function(){
	var name = {};
	return {
		regObject : function(id,value){
			name[id] = value;
		},
		newObject : function(id, o){
			return new name[id](o);
		},
		newRuleCtrl : function(id){
			var ruleCtrl = new RuleCtrl();
			var rule = new Rule();
			var tabPanelCtrl = factorySetPanel.newObject(id);
			ruleCtrl.setRule(rule);
			ruleCtrl.setTabPanelCtrl(tabPanelCtrl);
			return ruleCtrl;
		}
	}
}();

var LogicalCondition = function(){
	this.key;
	this.value;
	this.operate;
	this.valueType;
}

var createLogicalCondition = function(key, value, operate, valueType){
	var logical = new LogicalCondition();
	logical.key=key;
	logical.value=value
	logical.operate=operate;
	logical.valueType = valueType;
	return logical;
}
var Rule = function(){
	this.id = "";
	this.name = "";
	this.neId = "";
	this.neTypeId = "";
	this.templateId = "";
	this.neFlag = "";
	this.sortId = "";;
	this.state = "0SA";
	this.isAdvanced = "0";
	this.createStaffName = "";
	this.remark = "";
	this.effectiveTime = {};
	this.condition = {};
	this.actions = {};
	this.nodeid = "";
};

var RuleCtrl = function(){
	this.tabPanelCtrl;
	this.rule;
};

RuleCtrl.prototype = {
	show : function(){
		return this.tabPanelCtrl.build();
	},
	showCustom : function(){
		return this.tabPanelCtrl.buildRuleCustomPanel();
	},
	loadData : function(ruleId){
		this.rule = new Rule();
		this.rule.id = ruleId;
		this.doActionXmlHttp(actionFlag[0]);
	},
	doActionXmlHttp : function(name, o)
	{
		if(name){
			this.tabPanelCtrl.setRule(this.rule);
			var action = factoryCtrl.newObject(name, o);
			action.setRuleCtrl(this);
			action.send();
		}
	},
	setRule : function(rule){
		this.rule = rule;
	},
	setTabPanelCtrl : function(tabPanelCtrl){
		this.tabPanelCtrl = tabPanelCtrl;
	},
	getTabPanelCtrl : function(){
		return this.tabPanelCtrl;
	}
}


var Command = function(){
	this.ruleCtrl;
};
Command.prototype = {
	setRuleCtrl : function(ruleCtrl){
		this.ruleCtrl = ruleCtrl;
	},
	getSendUrl : Ext.emptyFn,
	isSendBefore : Ext.emptyFn,
	getSendXml : Ext.emptyFn,
	sendAfter : Ext.emptyFn,
	send : function(){
		if(this.isSendBefore()){
			xmlhttp.open("post", this.getSendUrl(), false);
			xmlhttp.send(this.getSendXml());
			//alert(this.getSendUrl());
			//alert("xmlhttp="+xmlhttp.responseXML.xml);
			this.sendAfter(xmlhttp);
		}
	}
};

var AlarmCommand = Ext.extend(Command, {
	xmlToRule : function(rsXMLHTTP){
		//解析XML
		//alert("数据库获取的XML格式："+rsXMLHTTP.responseXML.xml)
		//var ruleXml = rsXMLHTTP.responseXML.selectSingleNode("//RULE");
		var responseText = filterRule(rsXMLHTTP.responseText);
		var doc = new ActiveXObject("Microsoft.XMLDOM");
		doc.loadXML(responseText);
		var ruleXml = doc.selectSingleNode("//RULE");	
		if(ruleXml){
			this.ruleCtrl.rule.id = ruleXml.selectSingleNode("//RULE_ID").text;
			this.ruleCtrl.rule.neId = ruleXml.selectSingleNode("//NE_ID").text;
			this.ruleCtrl.rule.neTypeId = ruleXml.selectSingleNode("//NE_TYPE_ID").text;
			this.ruleCtrl.rule.templateId = ruleXml.selectSingleNode("//TEMPLATE_ID").text;
			this.ruleCtrl.rule.neFlag = ruleXml.selectSingleNode("//NE_FLAG").text;
			//this.ruleCtrl.rule.neFlag = 6;
			this.ruleCtrl.rule.name = ruleXml.selectSingleNode("//RULE_NAME").text;
			this.ruleCtrl.rule.createStaffName = ruleXml.selectSingleNode("//CREATE_STAFF_NAME").text;
			this.ruleCtrl.rule.state = ruleXml.selectSingleNode("//STATE").text;
			this.ruleCtrl.rule.sortId = ruleXml.selectSingleNode("//SORT_ID").text;
			this.ruleCtrl.rule.isAdvanced = ruleXml.selectSingleNode("//IS_ADVANCED").text;
			this.ruleCtrl.rule.remark = ruleXml.selectSingleNode("//REMARK").text;
			var effective_time = ruleXml.selectSingleNode("//EFFECTIVE_TIME");
			if(effective_time){
				var t = effective_time.selectNodes("T");
				for (var i = 0; i<t.length; i++) {
					var oEffectiveTime = {};
					var logicals = t[i].selectNodes("C");
					for (var j = 0; j < logicals.length; j++) {
						//oEffectiveTime[logicals[j].getAttribute("key")] = createLogicalCondition(logicals[j].getAttribute("key"), logicals[j].getAttribute("value"), logicals[j].getAttribute("operate"), typeof(logicals[j].getAttribute("value_type")));
						oEffectiveTime[logicals[j].getAttribute("key")] = logicals[j].getAttribute("value");
					}
					this.ruleCtrl.rule.effectiveTime[i] = oEffectiveTime;
				}
			}
			var condition = ruleXml.selectSingleNode("//CONDITION");
			if(condition){
				var logicals = condition.selectNodes("C");
				for (var j = 0; j < logicals.length; j++) {
					this.ruleCtrl.rule.condition[logicals[j].getAttribute("key")] = createLogicalCondition(logicals[j].getAttribute("key"), logicals[j].getAttribute("value"), logicals[j].getAttribute("operate"), typeof(logicals[j].getAttribute("value_type")));
				}
			}
			var actions = ruleXml.selectSingleNode("//ACTIONS");
			if(actions){
				var logicals = actions.selectNodes("C");
				this.ruleCtrl.rule.actions = logicals[0];
			}
		}
	},
	ruleToXml:function(rules)
	{
		var XML = '';
		if(rules){
			XML = '<rules type="' + commonGlobal.ruleInfo.CLASS_NAME + '" baseOn="'+ commonGlobal.baseOn +'">';
			for (var i = 0; i < rules.length; i++) {
				var rule = rules[i];
				XML += '<rule>';
				XML += '<id>' + rule.id + '</id>';
				XML += '<neId>' + rule.neId + '</neId>';
				XML += '<sortId>' + rule.sortId + '</sortId>';
				XML += '<use>1</use>';
				XML += '<templateId>' + rule.templateId + '</templateId>';
				XML += '<name>' + filter(rule.name) + '</name>';
				XML += '<state>' + rule.state + '</state>';
				XML += '<isAdvanced>' + rule.isAdvanced + '</isAdvanced>';
				XML += '<remark>' + filter(rule.remark) + '</remark>';
				XML += '<ruletype>' + commonGlobal.ruleInfo.ruleType + '</ruletype>';
				XML += '<effective_time>';
				if(rule.effectiveTime){
					for(var j in rule.effectiveTime){
						XML += '<t>';
						var logicals = rule.effectiveTime[j];
						for(var z in logicals){
							var logical = logicals[z];
							if(logical.value)
								XML += '<c key="' + logical.key + '" value="' + logical.value + '" operate="' + logical.operate + '" value_type="' + logical.valueType + '"></c>';
						}
						XML += '</t>';
					}
				}
				XML += '</effective_time>';
				XML += '<condition>';
				if(rule.condition){
					for(var j in rule.condition){
						var logical = rule.condition[j];
						if(logical.value || logical.value==0)
							XML += '<c key="' + logical.key + '" value="' + logical.value + '" operate="' + logical.operate + '" value_type="' + logical.valueType + '"></c>';
					}
				}
				XML += '</condition>';
				XML += '<actions>';
				if(rule.actions){
					if(rule.actions.group && rule.actions.group.length > 0){
						for(var j=0; j<rule.actions.group.length; j++){
							XML += '<group>';
							for(var k in rule.actions.group[j]){
								var logical = rule.actions.group[j][k];
								if(logical.value || logical.value==0){
									XML += '<c key="' + logical.key + '" value="' + logical.value + '" operate="' + logical.operate + '" value_type="' + logical.valueType + '"></c>';
								}
							}
							XML += '</group>';
						}
					}else{
						if(commonGlobal.ruleInfo.ruleType == '12'){
							XML += '<c><![CDATA[';
							XML += rule.actions['action'].value;
							XML += ']]></c>';
						}else{
							XML += '<c';
							for(var j in rule.actions){
								var logical = rule.actions[j];
								if(logical.value || logical.value==0){
									XML += ' '+ logical.key +'="' + logical.value + '"';
								}
							}
							XML += '></c>';
						}
					}
				}
				XML += '</actions>';
				XML += '</rule>';
			}
			XML += '</rules>';
			//alert("界面组装的XML格式："+XML);
		}
		//var frm = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm();
		//frm.findField('REMARK').setValue(XML);
		//this.ruleCtrl.rule.remark = XML;
		//XML = '<rules type="alarmShieldRule" action="addAlarmRule"><rule><id></id><neId>10000</neId><sortId></sortId><name>规则名称1</name><state></state><isAdvanced>0</isAdvanced><remark>无</remark><effective_time><t><c key="os.beginDate" value="2010-07-01" operate="=" value_type="string"></c><c key="os.endDate" value="2010-07-31" operate="=" value_type="string"></c><c key="os.beginDay" value="1" operate="=" value_type="number"></c><c key="os.endDay" value="3" operate="=" value_type="number"></c><c key="os.beginTime" value="11:22:00" operate="=" value_type="string"></c><c key="os.endTime" value="33:44:00" operate="=" value_type="string"></c><c key="os.weekValue" value="1,2,5" operate="in" value_type="string"></c></t><t><c key="os.beginTime" value="10:20:00" operate="=" value_type="string"></c><c key="os.endTime" value="30:40:00" operate="=" value_type="string"></c><c key="os.weekValue" value="1,2" operate="in" value_type="string"></c></t></effective_time><condition><c key="config_ne_id" value="10003,10005" operate="in" value_type="string"></c><c key="busi_module" value="1,2" operate="in" value_type="string"></c><c key="busi_class" value="1" operate="in" value_type="string"></c><c key="data_type" value="2" operate="in" value_type="string"></c><c key="alarm_region_origin" value="59,10" operate="notIn" value_type="string"></c><c key="region_id_group" value="1" operate="in" value_type="string"></c><c key="alarm_level" value="1" operate="in" value_type="string"></c><c key="kpi_id" value="4010010502014" operate="in" value_type="string"></c><c key="dr_id" value="0" operate="in" value_type="string"></c></condition><actions><c key="action" value="clear" operate="=" value_type="string"></c><c key="titlePattern" value="{$neId}{$neName}" operate="=" value_type="string"></c><c key="applyTo" value="1,2" operate="in" value_type="string"></c><c key="upgradeType" value="freq" operate="" value_type="string"></c><c key="time" value="11" operate="" value_type="string"></c><c key="count" value="22" operate="" value_type="string"></c><c key="dispatchType" value="staff" operate="" value_type="string"></c><c key="staff" value="1" operate="in" value_type="string"></c><c key="notifyMode" value="sms,voice" operate="" value_type="string"></c><c key="beginTime" value="22:11:00" operate="" value_type="string"></c><c key="endTime" value="33:44:00" operate="" value_type="string"></c><c key="isResend" value="true" operate="" value_type="string"></c></actions></rule></rules>';
		return XML;
	},
	getSendUrl : function(){
		//return alarmRuleUrl+"method=execute";//测试方法
		return alarmRuleCtrlUrl+this.getUrlParams();//正式方法
	},
	getSendXml : function(){
		var rules = this.getRules();
		return this.ruleToXml(rules);
	},
	getUrlParams : Ext.emptyFn,
	getRules : Ext.emptyFn,
	sendAfter : Ext.emptyFn
});



var GetCommand = Ext.extend(AlarmCommand, {
	getUrlParams : function(){
		return  actionFlag[0] +"&id="+Global.data.rule_id; //+this.ruleCtrl.rule.id;//正式方法
	},
	isSendBefore : function(){return true;},
	sendAfter : function(rsXMLHTTP){
		this.ruleCtrl.tabPanelCtrl.getDataFromPanel();
		commonGlobal.ruleInfo.ACTION = actionFlag[2];
   		this.ruleCtrl.rule = new Rule();
		this.ruleCtrl.tabPanelCtrl.initPanel(true);
		this.xmlToRule(rsXMLHTTP);
		var map = privilegeControl(this.ruleCtrl.rule.neFlag);//权限控制
		this.ruleCtrl.tabPanelCtrl.setControlState(map);//调用界面控制
   		this.ruleCtrl.tabPanelCtrl.setRule(this.ruleCtrl.rule);
		this.ruleCtrl.tabPanelCtrl.setDataToPanel();
	}
});
factoryCtrl.regObject(actionFlag[0],GetCommand);













var SelectDialog = (function()
		{
			var Action = getRealPath("../../../servlet/util?OperType=1","ResultGrid.js");
			var getName = function(o, v)
			{
				var name = "";
				if(o.name && v){
					if(o.name == 'config_ne_id' || o.name == 'configItem'){//配置项
						//name = "配置项";
						var text="";
						var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
						var httpUrl = "/servlet/perManagerServlet?";
						xmlhttp.open("POST",httpUrl+"tag=39&id="+v,false);
						xmlhttp.send();
						if(isSuccess(xmlhttp))
						{
							var doc = new ActiveXObject("Microsoft.XMLDOM");
							doc.load(xmlhttp.responseXML);
							var nodeList = doc.selectNodes("/root/rowSet");
							for (var i = 0; i < nodeList.length; i++) {
								//text += nodeList[i].getAttribute("value") + ",";
								var configName = nodeList[i].getAttribute("value");
								text += configName.substring(configName.indexOf(".")+1) + ",";	
							}
						}
						name = text.substring(0,text.length-1);
						/*
						sendXml.loadXML('<root><table>net_element</table>'
								+ '<keyColumn>ne_id</keyColumn>'
								+ '<valueColumn>ne_name</valueColumn>'
								+ '<valuesSplit>,</valuesSplit>'
								+ '<keys>' + v + '</keys>'
								+ '</root>');
						*/
					}
					else{
						var frm = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm();
						var neTypeId = frm.findField('NE_ID').neTypeId;
						var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
						var sendXml = new ActiveXObject("Microsoft.XMLDOM");
						sendXml.async = false;
						if(o.name == 'kpi_id'  || o.name == 'propertyKPI'){//kpi_id
							//name = "kpi_id";
							sendXml.loadXML('<root><table>kpi_code_list</table>'
									+ '<keyColumn>kpi_id</keyColumn>'
									+ '<valueColumn>kpi_name</valueColumn>'
									+ '<valuesSplit>,</valuesSplit>'
									+ '<keys>' + v + '</keys>'
									+ '</root>');
						}
						else if(o.name == 'alarm_region_origin'){//数据源
							//name = "数据源";
							if(neTypeId=="3007"){//国际结算
								sendXml.loadXML('<root><table>tp_domain_listvalues</table>'
										+ '<keyColumn>list_value</keyColumn>'
										+ '<valueColumn>list_label</valueColumn>'
										+ '<valuesSplit>,</valuesSplit>'
										+ '<keys>' + v + '</keys>'
										+ '<whereCon>domain_code = \'DOMAIN_CTIBC_AREA_CODE\'</whereCon>'
										+ '</root>');
							}else{
								sendXml.loadXML('<root><table>MANAGE_REGION</table>'
										+ '<keyColumn>REGION_ID</keyColumn>'
										+ '<valueColumn>REGION_NAME</valueColumn>'
										+ '<valuesSplit>,</valuesSplit>'
										+ '<keys>' + v + '</keys>'
										+ '</root>');
							}
						}
						else if(o.name == 'busi_module'){//模块
							//name = "模块";
							if(neTypeId=="3007"){//国际结算
								sendXml.loadXML('<root><table>tp_domain_listvalues</table>'
										+ '<keyColumn>list_value</keyColumn>'
										+ '<valueColumn>list_label</valueColumn>'
										+ '<valuesSplit>,</valuesSplit>'
										+ '<keys>' + v + '</keys>'
										+ '<whereCon>domain_code = \'DOMAIN_CTIBC_MODULE_CODE\'</whereCon>'
										+ '</root>');
							}else if(neTypeId=="3003"){//集团综合结算
								sendXml.loadXML('<root><table>CTNBC_MODULE_HQ_MAPP</table>'
										+ '<keyColumn>Mapped_module_code</keyColumn>'
										+ '<valueColumn>Module_name</valueColumn>'
										+ '<valuesSplit>,</valuesSplit>'
										+ '<keys>' + v + '</keys>'
										+ '</root>');
							}else{
								sendXml.loadXML('<root><table>ALL_MODULE_TAB</table>'
										+ '<keyColumn>module_code</keyColumn>'
										+ '<valueColumn>module_name</valueColumn>'
										+ '<valuesSplit>,</valuesSplit>'
										+ '<keys>' + v + '</keys>'
										+ '<whereCon>ne_type_id = \''+ neTypeId +'\'</whereCon>'
										+ '</root>');
							}
						}
						else if(o.name == 'busi_class'){//业务大类
							//name = "业务大类";
							if(neTypeId=="3003"){//集团综合结算
								sendXml.loadXML('<root><table>CTNBC_BUSI_CLASS_HQ</table>'
										+ '<keyColumn>busi_class</keyColumn>'
										+ '<valueColumn>BUSI_CLASS_NAME</valueColumn>'
										+ '<valuesSplit>,</valuesSplit>'
										+ '<keys>' + v + '</keys>'
										+ '</root>');
							}else{
								sendXml.loadXML('<root><table>all_busi_class_tab</table>'
										+ '<keyColumn>busi_class</keyColumn>'
										+ '<valueColumn>BUSI_CLASS_NAME</valueColumn>'
										+ '<valuesSplit>,</valuesSplit>'
										+ '<keys>' + v + '</keys>'
										+ '<whereCon>ne_type_id = \''+ neTypeId +'\'</whereCon>'
										+ '</root>');
							}
						}
						else if(o.name == 'data_type'){//数据类型
							//name = "数据类型";
							sendXml.loadXML('<root><table>all_data_type_tab</table>'
									+ '<keyColumn>data_type</keyColumn>'
									+ '<valueColumn>data_type_name</valueColumn>'
									+ '<valuesSplit>,</valuesSplit>'
									+ '<keys>' + v + '</keys>'
									+ '<whereCon>ne_type_id = \''+ neTypeId +'\'</whereCon>'
									+ '</root>');
						}
						else{//选择员工
							//name = "admin";
							sendXml.loadXML('<root><table>staff</table>'
									+ '<keyColumn>staff_id</keyColumn>'
									+ '<valueColumn>staff_name</valueColumn>'
									+ '<valuesSplit>,</valuesSplit>'
									+ '<keys>' + v + '</keys>'
									+ '</root>');
						}
						sendRequest.open('post', Action, false);
						sendRequest.send(sendXml)
						if (isSuccess(sendRequest))
						{
							var node = sendRequest.responseXML
									.selectSingleNode('/root/values');
							if (node)
							{
								name = node.text
							}
						}
						sendRequest = null;
					}
				}
				return name;
			}
			var Field = Ext.extend(Ext.form.TriggerField, {
				readOnly	: true,
				onRender	: function(ct, position)
				{
					Field.superclass.onRender.call(this, ct, position);
					this.trigger.dom.style.backgroundImage = 'url(/resource/image/find-trigger.gif)';
					this.wrap.dom.style.cursor = 'pointer'
					this.hiddenField = this.el.insertSibling({
								tag		: 'input',
								type	: 'hidden',
								name	: this.hiddenName || this.name,
								id		: this.id || this.name,
								value	: this.value || ""
							}, 'before', true);
				},
				getValue	: function()
				{
					return this.hiddenField.value;
				},
				onTriggerClick	: function()
				{
					if(this.name == 'config_ne_id')//配置项
						setNeConfigId(this, this.hiddenField); 
					else if(this.name == 'configItem')//性能超阀值的配置项
						setConfigItem(this, this.hiddenField);
					else if(this.name == 'alarm_region_origin')//数据源
						selectSubmit('REGION_ID'); 
					else if(this.name == 'kpi_id')//kpi_id
						selectsubmitKPI('','',this, this.hiddenField); 
					else if(this.name == 'propertyKPI')//性能超阀值的性能KPI
						setPropertyKPI('',40,this, this.hiddenField);
					else if(this.name == 'busi_module')//模块
						selectSubmit('MODULE_CODE'); 
					else if(this.name == 'busi_class')//业务大类
						selectSubmit('BUSI_CLASS'); 
					else if(this.name == 'data_type')//数据类型
						selectSubmit('DATA_TYPE'); 
					else//选择员工
						choiceStaffToElement(this.el.dom, this.hiddenField, true); 
				},
				setValue		: function(v)
				{
					Field.superclass.setValue.call(this, v);
					this.el.dom.value = getName(this, v);
				}
			});
			Ext.reg('selectDialog', Field);
			return Field;
		})();

		//下拉选择树
		var SelectTree = (function() {
			var Field = Ext.extend(Ext.form.TriggerField, {
				deferMillis : 50,
				emptyValue : -1,
				emptyText : "",
				sendParams : "",
				defaultAutoCreate : {
					tag : "input",
					type : "text",
					size : "16",
					autocomplete : "off",
					readonly : 'true',
					style : "cursor:pointer;color:black"
				},
				onRender : function(ct, position) {
					Field.superclass.onRender.call(this, ct, position);
					this.hiddenField = this.el.insertSibling({
								tag : 'input',
								type : 'hidden',
								name : this.hiddenName || this.name,
								id : this.id || this.name
							}, 'before', true);
					this.el.dom.removeAttribute('name');
					this.el.on('mousedown', this.onTriggerClick, this);
					this.treeHtc = ct.createChild({
								tag : "IE:tree",
								style : "display:none",
								treeHeight : this.treeHeight || 200
							}).dom;
					Field.prototype.initTreeHtcValue.defer(this.deferMillis, this);
				},
				setUrl : function(url) {
					this.treeHtc.xmlUrl = url;
				},
				initTreeHtcValue : function() {
					if (this.treeHtc.readyState == "complete") {
						if (this.xmlDom) {
							this.treeHtc.xmlDom = this.xmlDom;
						} else {
							if (this.sql) {
								var EXEC_SQL_URL = getRealPath(
										"../../../servlet/@Deprecated/ExecServlet?",
										"alarmRuleTabPanel.js");
								this.xmlUrl = EXEC_SQL_URL + "action=" + this.action;
								this.sendParams = "paramValue=" +getAESEncode(encodeURIComponent(this.sql));
							}
							this.treeHtc.sendParams = this.sendParams || "";
							this.treeHtc.xmlUrl = this.xmlUrl || "";
						}
						this.treeHtc.value = this.value;
						this.el.dom.value = this.treeHtc.text || this.emptyText;
						this.treeHtc.attachEvent("onResultChange",
								Field.prototype.loadTreeHtcValue.createDelegate(this));
					} else {
						Field.prototype.initTreeHtcValue.defer(this.deferMillis, this);
					}
				},
				loadTreeHtcValue : function() {
					this.el.dom.value = event.selectedText || this.emptyText;
					this.value = event.selectedValue;
					this.hiddenField.value = this.value;
				},
				initValue : Ext.emptyFn,
				onTriggerClick : function() {
					this.treeHtc.showTree(null, this.wrap.dom)
				},
				setValue : function(v) {
					if (this.treeHtc) {
						this.treeHtc.value = v;
					} else {
						this.value = v;
						this.hiddenField.value = this.value;
					}
				},
				getValue : function() {
					var v = this.value;
					return (v == this.emptyValue) ? "" : v;
				}
			})
			return Field;
		})();
			
		// 添加配置项
		function setNeConfigId(obj,hiddField){
			var dom = obj.el.dom;
			var frm = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm();
			var neId = frm.findField('NE_ID').getValue();
			if(neId == ""){
				Ext.Msg.show({
				   title:'系统提示',
				   msg: '请先选择网元,再进行配置项配置',
				   buttons: Ext.MessageBox.OK,
				   icon: Ext.MessageBox.ERROR
				});
				return;
			}
			if(dom.value==null || dom.value=="")
				hiddField.value="";
			var params = new Object();
			params.neConfigName = dom.value;
			params.neConfigId = hiddField.value;
			params.neId = neId;

			//var returnValue=window.showModalDialog("/resource/js/Dialog/choiceNeId.html",params,"dialogWidth=530px;dialogHeight=493px;help=0;scroll=0;status=0;");
			var returnValue=window.showModalDialog("/resource/js/Dialog/choiceConfigNeId.html",params,"dialogWidth=730px;dialogHeight=580px;help=0;scroll=0;status=0;");
			if(returnValue!=null){
				//var frm = Ext.getCmp('WHERE_SET_FORM' + commonGlobal.idFlag).getForm();
				//frm.findField('config_ne_id').setValue(returnValue.neConfigId);
				hiddField.value=returnValue.neConfigId;
				obj.setValue(returnValue.neConfigId);
				//dom.value=returnValue.neConfigName;
				//window.name.title=window.name.value;
			}
		}

		//kpi_id
		function selectsubmitKPI(if_appsys,ne_msg_type,obj,hiddField){
			var frm = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm();
			var neId = frm.findField('NE_ID').getValue();
			if(ne_msg_type==null){
		    	ne_msg_type = "20";
		    }
		    if(if_appsys==null){
		    	if_appsys = "";
		    }
		    var kpiselectobj = new KPISelectObj();
			kpiselectobj.ifGetKpiValue = true;
			kpiselectobj.if_appsys = if_appsys;
			kpiselectobj.ne_msg_type = ne_msg_type;
			if(commonGlobal.ruleInfo.ruleType == '12'){
				kpiselectobj.selectOneOnly = 1; //单选
			}
			var neidobj = new NeIdObj();
			try{
				if(neId && neId.indexOf(",")>0) {
					//如果要传入KPI选择页面的网元有多个，则取第一个，这个有个前提：网元的网元类型是相同的
					neidobj.value = (neId.split(","))[0];
					//neidobj.text = (NE_NAME.value.split(","))[0];
				} else {
					neidobj.value = neId;
					//neidobj.text = NE_NAME.value;
				}
			}catch(e){
				neidobj.value = "-1";
				neidobj.text  = "网元";
			}
			kpiselectobj.neidObj = neidobj;
			var kpiset = new Array();
			for(var i=0;i<GlobalTabPanel.KPI_LIST.length;i++){
				var kpiobj = new KpiObj();
				kpiobj.kpi_id = GlobalTabPanel.KPI_LIST[i].value;
				kpiobj.kpi_name = GlobalTabPanel.KPI_LIST[i].text;
				kpiobj.kpi_value = GlobalTabPanel.KPI_LIST[i].kpi_value;
				kpiobj.key = GlobalTabPanel.KPI_LIST[i].key;
				kpiset.push(kpiobj);
			}
			kpiselectobj.kpiSet = kpiset;
			
			var params = new Array();
		    params.push(window);
			params.push(if_appsys);
			params.push(ne_msg_type);
			params.push(kpiselectobj);
		    var returnObj = window.showModalDialog("../alarm/KPISelect.html",params,"resizable=yes;dialogWidth=600px;dialogHeight=550px;help=0;scroll=1;status=0;");
			if(returnObj!=null){
			  //var frm = Ext.getCmp('WHERE_SET_FORM' + commonGlobal.idFlag).getForm();
			  //frm.findField('kpi_id').setValue(returnObj.value);
			  obj.setValue(returnObj.value);
			  hiddField.value =  returnObj.kpi_value;
		      var kpi_name = returnObj.name;
		      var kpi_id = returnObj.value;
		      var kpi_value = returnObj.kpi_value;
		      var keys = returnObj.key;

		      GlobalTabPanel.KPI_LIST = [];
		      if(kpi_id!="" && kpi_id !=null){
		          var valuearr = kpi_value.split(",");
		          var textarr = kpi_name.split(",");
		          var idarr = kpi_id.split(",");
		          var keyarr = keys.split(",");
		          for(i=0;i<idarr.length;i++){
		            var kpiobj = new Object();
		            kpiobj.value = idarr[i];
		            kpiobj.text = textarr[i];
		            kpiobj.kpi_value = valuearr[i];
		            kpiobj.key = keyarr[i];
		            GlobalTabPanel.KPI_LIST[i] = kpiobj;
		          }		          
		      }
		    }
		}
		//数据源
		function selectSubmit(type)
		{
		    var params = new Array();
		    var resultArr;
		    var checkValueArray = new Array();
		    var checkTextArray = new Array();
		    var frm = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm();		
		    var neTypeId=frm.findField('NE_ID').neTypeId;
		    var temValue="";
		    var temText="";

		    params.push(neTypeId);
		    params.push(type);
			//传递已选中值给弹出界面
		    var modulCodeArray=new Array();
		    var busiClassArray=new Array();
		    var regionIdArray=new Array();
		    var dataTypeArray=new Array();
		    
			var frm = Ext.getCmp('WHERE_SET_FORM' + commonGlobal.idFlag).getForm();
			var moduleCode = frm.findField('busi_module') ? frm.findField('busi_module').value : "";
			if(moduleCode)	modulCodeArray = moduleCode.split(',');
			
			var busiClass = frm.findField('busi_class') ? frm.findField('busi_class').value : "";
		    if(busiClass) busiClassArray = busiClass.split(',');
		    
			var regionId = frm.findField('alarm_region_origin') ? frm.findField('alarm_region_origin').value : "";
		    if(regionId) regionIdArray = regionId.split(',');
		    
			var dataType = frm.findField('data_type') ? frm.findField('data_type').value : "";
		    if(dataType) dataTypeArray = dataType.split(',');
		    
		    params.push(modulCodeArray);
		    params.push(busiClassArray);
		    params.push(regionIdArray);
			params.push(0);
		    params.push(dataTypeArray);

		    var resultArr = window.showModalDialog("../alarm/addSelectCheck.jsp",params,"resizable=yes;dialogWidth=350px;dialogHeight=400px;help=0;scroll=1;status=0;");

			if(resultArr!=null){		
				for(var h=0;h<resultArr[0].length;h++){
					if(h==resultArr[0].length-1){
						temValue+=(resultArr[0][h]);
						temText+=(resultArr[1][h]);
					}else{
						temValue+=(resultArr[0][h]+",");
						temText+=(resultArr[1][h]+",");
					}
				}
				if(type=="MODULE_CODE"){
					frm.findField('busi_module').setValue(temValue);
				}else if(type=="BUSI_CLASS"){
					frm.findField('busi_class').setValue(temValue);
				}else if(type=="REGION_ID"){
					frm.findField('alarm_region_origin').setValue(temValue);
				}else if(type=="DATA_TYPE"){
					frm.findField('data_type').setValue(temValue);
				}
			}
		}

		var exXmlReader = Ext.extend(Ext.data.XmlReader, {
					extractValues : function(data, items, len) {
						var values = exXmlReader.superclass.extractValues.call(this,data, items, len);
						values['VALUE'] = data.getAttribute("id");
						return values;
					}
				});
		// 数据源组
		var dsRegionGroup = new Ext.data.Store({
			autoLoad	: true,
			url			: dsUrl + "action=101&paramValue=" +getAESEncode(encodeURIComponent(
					"select VALUE, TEXT from (select null VALUE ,'-"+encodeURIComponent('无')+"-' TEXT from dual union " +
					"select REGION_GROUP_CFG_ID VALUE,REGION_GROUP_NAME TEXT from REGION_GROUP_CFG" +
					") order by TEXT")),
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});
		//双中心
		var dsDrId = new Ext.data.Store({
			autoLoad	: true,
			url			: dsUrl + "action=101&paramValue=" +getAESEncode(encodeURIComponent(
					"select VALUE, TEXT from (select '' VALUE ,'-"+encodeURIComponent('无')+"-' TEXT, 0 sort_id from dual union " +
					"select list_value VALUE,list_label TEXT,sort_id from TP_DOMAIN_LISTVALUES where domain_code='DOMAIN_DR_ID_FLAG'" +
					") order by sort_id")),
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});
		//告警级别
		var dsAlarmLevel = new Ext.data.Store({
			autoLoad	: true,
			url			: dsUrl + "action=101&paramValue=" +getAESEncode(encodeURIComponent(
					"select VALUE, TEXT from (select '' VALUE ,'-"+encodeURIComponent('无')+"-' TEXT, 0 sort_id from dual union " +
					"select list_value VALUE,list_label TEXT,sort_id from tp_domain_listvalues where domain_code='DOMAIN_NE_ALARM_LEVEL'" +
					") order by sort_id")),
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		}); 
		//全局变量(关联屏蔽规则)
		var dsGlobalVariableNameForRele = new Ext.data.Store({
			//autoLoad	: true,
			url			: dsUrl + "action=101",
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});			
		var dsGlobalVariableNameTemp = "select d.variable_name from RULE_INFO B,RULE_INFO_REVISION C,ALARM_RELATION_RULE_INFO D " +
				"where b.head_revision=c.rule_revision_id and b.head_revision=d.rule_revision_id and c.state='0SA'";
		var dsGlobalVariableNameSqlForRele = "select VALUE, TEXT from (select '' VALUE ,'-无-' TEXT, 0 sort_id from dual union " +
		      		"select VARIABLE_NAME VALUE,VARIABLE_NAME TEXT,sort_id from RULE_GLOBAL_VARIABLE A where A.STATE='0SA' and" +
		      		" a.variable_name not in ("+ dsGlobalVariableNameTemp +")" +
					") order by sort_id";

		//全局变量(条件)
		var dsGlobalVariableNameForWhere = new Ext.data.Store({
			//autoLoad	: true,
			url			: dsUrl + "action=101",
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});
		var dsGlobalVariableNameSqlForWhere = "select VALUE, TEXT from (select '' VALUE ,'-无-' TEXT, 0 sort_id from dual union " +
		      		"select VARIABLE_NAME VALUE,decode((select count(*) from RULE_INFO B,RULE_INFO_REVISION C,ALARM_RELATION_RULE_INFO D where b.head_revision=c.rule_revision_id and b.head_revision=d.rule_revision_id and c.state='0SA' and d.variable_name=a.variable_name),0,A.VARIABLE_NAME,'*'||A.VARIABLE_NAME) TEXT," +
		      		" sort_id from RULE_GLOBAL_VARIABLE A where A.STATE='0SA'" +
					") order by sort_id";
					
		//全局变量值
		var dsGlobalVariableValue = new Ext.data.Store({
			//autoLoad	: true,
			url			: dsUrl + "action=101",
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});
		var dsGlobalVariableValueSql = "select ENUM_NAME VALUE,ENUM_NAME TEXT from RULE_GLOBAL_VARIABLE_ENUM where STATE='0SA'";
		//dsGlobalVariableValue.load({params : {"sql":dsGlobalVariableValueSql}});

		//标题列表
		var dsTitleList = new Ext.data.Store({
			autoLoad	: true,
			url			: dsUrl + "action=101&paramValue="+getAESEncode(encodeURIComponent("select name,config_show_name||'-{$'||name||'}' TEXT from alarm_rule_fields where is_config_show=1 order by sort_id")),
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});
		//值班线
		var dsDuty = new Ext.data.Store({
			autoLoad	: true,
			url			: dsUrl + "action=101&paramValue=" +getAESEncode(encodeURIComponent(
					"select VALUE, TEXT from (select null VALUE ,'-"+encodeURIComponent('无')+"-' TEXT from dual union " +
					"select duty_id VALUE,duty_name TEXT from duty_info t where state='0SA'" +
					") order by TEXT")),
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});
		//目标系统
		var dsTargetOs = new Ext.data.Store({
			autoLoad	: true,
			url			: dsUrl + "action=101&paramValue="+getAESEncode(encodeURIComponent("select list_value VALUE,list_label TEXT,sort_id from tp_domain_listvalues where domain_code='DOMAIN_TRANS_RULE_TYPE' order by sort_id")),
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});
		//重定义类型
		var dsTargetType = new Ext.data.Store({
			autoLoad	: true,
			url			: dsUrl + "action=101&paramValue=" +getAESEncode(encodeURIComponent(
					"select VALUE, TEXT from (select '' VALUE ,'-"+encodeURIComponent('无')+"-' TEXT, 0 sort_id from dual union " +
					"select list_value VALUE,list_label TEXT,sort_id from tp_domain_listvalues where domain_code='DOMAIN_NE_ALARM_TYPE'" +
					") order by sort_id")),
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});
		//采集代理
		var dsAgentList = new Ext.data.Store({
			autoLoad	: true,
			url			: "../../../servlet/taskConfigServlet?tag=1",
			reader		: new Ext.data.XmlReader({
								record	: 'rowSet'
						}, ["NE_ID", "NE_NAME","NE_IP"])
		});
		//时间单位
		var dsTimeunit = new Ext.data.Store({
			autoLoad	: true,
			url			: dsUrl + "action=101&paramValue="+getAESEncode(encodeURIComponent("select list_value VALUE,list_label TEXT,sort_id from tp_domain_listvalues where domain_code='DOMAIN_TIME_UNIT' order by sort_id")),
			reader		: new exXmlReader({
								record	: 'rowSet'
						}, ["TEXT"])
		});

		//初始化数据对象
		function initData(){
			//时效已配置列表初始化
			var configList = Ext.getCmp('configList'+commonGlobal.idFlag);
			configList.store.removeAll();
			configList.enable();
			configList.addSelection = true;
			clearTimeLimit();
			GlobalTabPanel.timeFilterArr = new Array();//时效配置数据对象初始化
			GlobalTabPanel.KPI_LIST = [];//条件设置KPI
		}

		//重置时效配置
		function clearTimeLimit(){
			Ext.getCmp('beginDate'+commonGlobal.idFlag).reset();
			Ext.getCmp('endDate'+commonGlobal.idFlag).reset();
			Ext.getCmp('beginDay'+commonGlobal.idFlag).reset();
			Ext.getCmp('endDay'+commonGlobal.idFlag).reset();
			for(var i=0;i<7;i++)
				Ext.getCmp('week'+i+commonGlobal.idFlag).reset();
			Ext.getCmp('beginHour'+commonGlobal.idFlag).reset();
			Ext.getCmp('beginMinute'+commonGlobal.idFlag).reset();
			Ext.getCmp('endHour'+commonGlobal.idFlag).reset();
			Ext.getCmp('endMinute'+commonGlobal.idFlag).reset();
		}

		//保存时效配置
		function saveTimeLimit(){
			var frm = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm();
			if(!frm.isValid()) return false;
			var configList = Ext.getCmp('configList'+commonGlobal.idFlag);
			var sc = configList.view.getSelectionCount();
			if(sc == 0){
				Ext.Msg.alert('提示','请先点击"增加"按钮，或是在时效列表选择某个配置项！');
				return false;
			}
			var timeFilter = new Object();
		    var dateStr = "";
		    var dayStr = "";
		    var weekStr = "";
		    var timeStr = "";
		    var weekValue = "";
			//判断日期
			var beginDate = Ext.getCmp('beginDate'+commonGlobal.idFlag).value;
			var endDate = Ext.getCmp('endDate'+commonGlobal.idFlag).value;
			if(beginDate || endDate){
				if(beginDate && endDate){
					if(beginDate > endDate){
						Ext.Msg.alert('提示','对不起，\"开始日期\"不能大于\"结束日期\"！');
						return false;
					}
					dateStr = beginDate+"至"+endDate+" ";
				}else if(beginDate)//只有"开始日期"
		        {
		            dateStr = "从"+beginDate+"开始 ";
		        }else if(endDate)//只有"结束日期"
		        {
		            dateStr = "至"+endDate+"结束 ";
		        }
			}
			//timeFilter.beginDate = parseDate(beginDate);
		    //timeFilter.endDate = parseDate(endDate);
			timeFilter['os.beginDate'] = beginDate;
		    timeFilter['os.endDate']= endDate;
			//判断每月
			var beginDay = Ext.getCmp('beginDay'+commonGlobal.idFlag).getValue();
			var endDay = Ext.getCmp('endDay'+commonGlobal.idFlag).getValue();
			if(!beginDay && endDay){
				
				Ext.Msg.alert('提示','对不起，请选择每月开始号数！');
				return false;
			}
			if(beginDay && !endDay){
				Ext.Msg.alert('提示','对不起，请选择每月结束号数！');
				return false;
			}
			if(beginDay && endDay){
				if(parseInt(beginDay) > parseInt(endDay)){
					Ext.Msg.alert('提示','对不起，\"每月开始\"不能大于\"每月结束\"！');
					return false;
				}
				dayStr = "每月"+beginDay+"号至"+endDay+"号";
			}
			timeFilter['os.beginDay'] = beginDay;
		    timeFilter['os.endDay'] = endDay;
		    //判断星期weekStr
		    for(var i=0;i<7;i++){
				if(Ext.getCmp('week'+i+commonGlobal.idFlag).getValue()){
					weekStr += GlobalTabPanel.weekArray[i][1]+',';
					weekValue += GlobalTabPanel.weekArray[i][0]+',';
				}
		    }
		    if(weekStr!=""){
		    	weekStr = weekStr.substring(0,weekStr.length - 1);
		    	weekValue = weekValue.substring(0,weekValue.length - 1);
		    }
		    timeFilter.weekStr = weekStr;
		    timeFilter['os.weekValue'] = weekValue;
			//判断时间
			var beginHour = Ext.getCmp('beginHour'+commonGlobal.idFlag).getValue();
			var endHour = Ext.getCmp('endHour'+commonGlobal.idFlag).getValue();	
			var beginMinute = Ext.getCmp('beginMinute'+commonGlobal.idFlag).getValue();
			var endMinute = Ext.getCmp('endMinute'+commonGlobal.idFlag).getValue();
			if(!checkTime(beginHour, "您输入开始时间\"时\"",23))
				return false;
			if(!checkTime(endHour, "您输入结束时间\"时\"",24))
				return false;
			if(endHour==24){
				if(endMinute>0){
		    		Ext.Msg.alert('提示',"结束时间不能超过24时00分！");
					return false;
				}
			}
			if(!checkTime(beginMinute, "您输入开始时间\"分\"",59))
				return false;
			if(!checkTime(endMinute, "您输入结束时间\"分\"",59))
				return false;
			timeFilter['os.beginTime'] = composeTime(beginHour,beginMinute,'');
			timeFilter['os.endTime'] = composeTime(endHour,endMinute,'');
			if(!isTime(timeFilter['os.beginTime'], timeFilter['os.endTime']))
		    {
		        return false;
		    }
		    if(timeFilter['os.beginTime'] && timeFilter['os.endTime'])
		    	timeStr = timeFilter['os.beginTime'] + "至"+ timeFilter['os.endTime'];
		    var returnValue = composeTimeLimit(dateStr,dayStr, weekStr, timeStr);
		    if(returnValue=="")
		    {
		        MMsg("对不起，时效配置不能全部为空！");
		        return false;
		    }else
		    {
		    	var nodeIndex = configList.view.getSelectedIndexes()[0];
				configList.store.getAt(nodeIndex).set('text',returnValue);
				GlobalTabPanel.timeFilterArr[nodeIndex] = timeFilter;
		    }
		    clearTimeLimit();
		    configList.enable();
		    configList.addSelection = true;
		}

		function isTime(beginTime, endTime){
			if(beginTime.length>0 || endTime.length>0)
		    {
		        if(beginTime.length==0) {Ext.Msg.alert('提示',"请填入开始时间！");return false;}
		        if(endTime.length==0) {Ext.Msg.alert('提示',"请填入结束时间！");return false;}
		        if(beginTime>=endTime) {Ext.Msg.alert('提示',"对不起，\"开始时间\"必须小于\"结束时间\"！");return false;}
		    }
		    return true;
		}

//		     功能：验证时间
//		     输入：(1). 时间对象, (2). 时间名称, (3). 限制值
//		     输出：用","分隔的字符串
		function checkTime(value, timeName, limit)
		{
		    if(value>limit)
		    {
		    	Ext.Msg.alert('提示',timeName+"不能大于"+limit+"！");
		    	return false
		    }
		    return true;
		}

//			       功能：组合元素
//		     输入：(1).时, (2).钟, (3).秒
//		     输出：时间(hh:mm:ss)
		function composeTime(hour, minute, second)
		{
			if(!hour && !minute && !second) return "";
		    if((hour+minute+second)=="") return "";
		    var hourStr = "00";
		    var minuteStr = "00";
		    var secondStr = "00";
		    if(hour.length==1) {hourStr = "0"+hour;}
		    else if(hour.length==2) {hourStr = hour;}
		    if(minute.length==1) {minuteStr = "0"+minute;}
		    else if(minute.length==2) {minuteStr = minute;}
		    if(second.length==1) {secondStr = "0"+second;}
		    else if(second.length==2) {secondStr = second;}
		    return hourStr + ":"+ minuteStr + ":" + secondStr;
		}
//		     功能：装换格式
//		     输入：(1).日期(yyyy-mm-dd)
//		     输出：日期(yyyymmdd)
		function parseDate(dateStr)
		{
		    if(!dateStr || dateStr.length<10) {return "";}
		    return dateStr.substring(0,4)+dateStr.substring(5,7)+dateStr.substring(8,10);
		}

//		     功能：组合元素
//		     输入：(1).日期, (2).每月, (3).星期, (4).时间 
//		     输出："日期 >> 每月 >> 星期 >> 时间 "
		function composeTimeLimit(dateStr, dayStr,weekStr, timeStr)
		{
		    var returnValue = dateStr;
		    if(returnValue.length>0 && dayStr.length>0) {returnValue += " >> ";}
		    returnValue += dayStr;
		    if(returnValue.length>0 && weekStr.length>0) {returnValue += " >> ";}
		    returnValue += weekStr;
		    if(returnValue.length>0 && timeStr.length>0) {returnValue += " >> ";};
		    returnValue += timeStr;
		    return returnValue;
		}
		//  删除"生效时间"
		function deleteTimeLimit()
		{
			var configList = Ext.getCmp('configList'+commonGlobal.idFlag);
			var sc = configList.view.getSelectionCount();
			if(sc == 0) return;
			Ext.Msg.confirm("提示", "是否删除该信息?", function(button){
				if (button == 'yes')
				{														
					configList.enable();
					var index = 0;
					configList.store.each(function(rec){
						if(configList.view.isSelected(index))
							return false;
						index++;
					});
					configList.store.removeAt(index);
					GlobalTabPanel.timeFilterArr.splice(index,1);
					clearTimeLimit();
					configList.addSelection = true;
				}
			});
		}
		//  添加"生效时间"
		function addTimeLimit(){
			clearTimeLimit();
			var configList = Ext.getCmp('configList'+commonGlobal.idFlag);
			if(!configList.addSelection)
				return false;
			var RECORD = Ext.data.Record.create([{name : 'value'}, {name : 'text'}]);
			var rec = new RECORD({value : '',text : '请在下方录入配置信息'});											
			configList.store.insert(configList.store.getCount(),rec);
			configList.view.select(configList.store.getCount()-1);
			configList.addSelection = false;
			configList.disable();
		}

		//   显示"生效时间"
		function showTimeLimitOption()
		{
			var configList = Ext.getCmp('configList'+commonGlobal.idFlag);
		    var oIndex = configList.view.getSelectedIndexes()[0];
		    var oItem = GlobalTabPanel.timeFilterArr[oIndex];
		    if(oItem==null){
		    	clearTimeLimit();
		    	return;
		    }
		    if(oItem['os.beginDate']){
		    	//Ext.getCmp('beginDate'+commonGlobal.idFlag).setValue(formatDate(oItem.beginDate));
		    	Ext.getCmp('beginDate'+commonGlobal.idFlag).setValue(oItem['os.beginDate']);
		    	//Ext.getCmp('endDate'+commonGlobal.idFlag).setValue(formatDate(oItem.endDate));
		    	Ext.getCmp('endDate'+commonGlobal.idFlag).setValue(oItem['os.endDate']);
		    }
		    if(oItem.weekStr){
		    	var weekArr = oItem.weekStr.split(',');
		    	for(var i=0;i<weekArr.length;i++){
		    		for(var j=0;j<7;j++){
		    			weekArr[i] == GlobalTabPanel.weekArray[j][1] ? Ext.getCmp('week'+j+commonGlobal.idFlag).setValue(true) : null;
		    		}
		   		}
		    }
		    if(oItem['os.beginDay'])
		    	Ext.getCmp('beginDay'+commonGlobal.idFlag).setValue(oItem['os.beginDay']);
		    if(oItem['os.endDay'])
		    	Ext.getCmp('endDay'+commonGlobal.idFlag).setValue(oItem['os.endDay']);
		    settingTime(oItem['os.beginTime'], Ext.getCmp('beginHour'+commonGlobal.idFlag), Ext.getCmp('beginMinute'+commonGlobal.idFlag), '');
		    settingTime(oItem['os.endTime'], Ext.getCmp('endHour'+commonGlobal.idFlag), Ext.getCmp('endMinute'+commonGlobal.idFlag), '');
		}
//		     功能：将"时间"分解到"时、分、秒"对象
//		     输入：(1).时间(hh:mm:ss), (2).小时对象, (3).分钟对象, (4).秒对象
//		     输出：(无)
		function settingTime(timeValue, hourObj, minuteObj, secondObj)
		{
		    if(timeValue && timeValue.length==8)
		    {
		    	if(hourObj)
		        	hourObj.setValue(timeValue.substring(0,2));
		        if(minuteObj)
		        	minuteObj.setValue(timeValue.substring(3,5));
		        if(secondObj)
		        	secondObj.setValue(timeValue.substring(6,8));
		    }else
		    {
		        if(hourObj)
		        	hourObj.setValue("");
		        if(minuteObj)
		        	minuteObj.setValue("");
		        if(secondObj)
		        	secondObj.setValue("");
		    }
		}
//		     功能：装换格式
//		     输入：(1).日期(yyyymmdd)
//		     输出：日期(yyyy-mm-dd)
		function formatDate(dateObj)
		{
		    if(!dateObj || dateObj.length<8) {return "";}
		    return dateObj.substring(0,4)+"-"+dateObj.substring(4,6)+"-"+dateObj.substring(6,8);
		}


		//权限处理，参数(neFlag:网元标识,isMultiple:是否多选网元)
		var privilegeControl = function(neFlag, isMultipleNe, isMultipleType){
			var map = new Object();
			map.config_ne_id = true;//配置项
			map.busi_module = true;//模块
			map.busi_class = true;//业务大类
			map.data_type = true;//数据类型
			map.alarm_region_origin = true;//数据源
			map.region_id_group = true;//数据源组
			map.alarm_level = true;//告警级别
			map.kpi_id = true;//kpi_id
			map.dr_id = true;//双中心
			if(neFlag==2){//平台网元不显示的条件项
				map.busi_module = false;//模块
				map.busi_class = false;//业务大类
				map.data_type = false;//数据类型
			}else if(neFlag==6){//业务系统网元不显示的条件项
				map.config_ne_id = false;//配置项
			}
			if(isMultipleNe){//跨网元不显示的条件项
				map.config_ne_id = false;//配置项
				map.busi_module = false;//模块
				map.busi_class = false;//业务大类
				map.data_type = false;//数据类型
			}
			if(isMultipleType){//跨网元类型不显示的条件项
				map.kpi_id = false;//kpi_id
			}
			return map;
		}

var GlobalTabPanel = {
	//告警规则条件设置项	[设置项标识,			设置项标题,	项类型(下拉选择和弹出),	下拉数据]
	neWhereSet		: [ ['config_ne_id',	'配置项名称',	'selectDialog',			''],//textfield
						['busi_module',		'模块',		'selectDialog',			''],
						['busi_class',		'业务大类',	'selectDialog',			''],
						['data_type',		'数据类型',	'selectDialog',			''],
						['alarm_region_origin',		'数据源',	'selectDialog',			''],
						['region_id_group',	'数据源组',	'combo',				dsRegionGroup],
						['alarm_level',		'告警级别',	'combo',				dsAlarmLevel],
						['kpi_id',			'KPI',		'selectDialog',			''],
						['dr_id',			'双中心',	'combo',				dsDrId]],
	containArray	: [['1','包含'],['2','不包含']],
	dateArray		: [['','-无-'],['1','1号'],['2','2号'],['3','3号'],['4','4号'],['5','5号'],['6','6号'],['7','7号'],['8','8号'],['9','9号'],['10','10号'],['11','11号'],['12','12号'],['13','13号'],['14','14号'],['15','15号'],['16','16号'],['17','17号'],['18','18号'],['19','19号'],['20','20号'],['21','21号'],['22','22号'],['23','23号'],['24','24号'],['25','25号'],['26','26号'],['27','27号'],['28','28号'],['29','29号'],['30','30号'],['31','31号']],
	weekArray		: [['2','星期一'],['3','星期二'],['4','星期三'],['5','星期四'],['6','星期五'],['7','星期六'],['1','星期日']],
	exceedTypeArray	: [['time','超时长'],['count','超次数'],['freq','超频率']],
	dispatchObjArray: [['staff','固定人员'],['duty','值班线'],['project','专项小组']],
	timeFilterArr	: new Array(), //时效配置
	KPI_LIST		: [],
	defaultTab		: 0//默认分页
}

var factorySetPanel = function(){
	var name = {};
	return {
		regObject : function(id,value){
			name[id] = value;
		},
		newObject : function(id){
			return new name[id];
		}
	}
}();


var TabPanelCtrl = function(){
	this.rule;
	this.customForm;
};
TabPanelCtrl.prototype = {
	build : function(){
		var tabpanel = new Ext.TabPanel({
			border 		: false,
			title		: '规则详细信息',
			activeTab	: GlobalTabPanel.defaultTab,
			deferredRender:false,
			region			: "center",
			//applyTo     : Ext.getBody(),
			items		: [{
				iconCls : 'icon-tabs',
				title 	: '基本信息',
				layout	: 'fit',
				items	: this.buildRuleBasicInfo()
			},{
				iconCls : 'icon-tabs',
				title 	: '条件设置',
				layout	: 'fit',
				items	: this.buildRuleCommonSet()
			},
				this.buildRuleCustomPanel(),
			/*{
				iconCls : 'icon-tabs',
				layout	: 'fit',
				title	: commonGlobal.ruleInfo.RULE_TITLE,
				frame	: true,
				items	: this.buildRuleCustomSet()
			},*/{
				iconCls : 'icon-tabs',
				title 	: '修改历史',
				autoScroll 	: true,
				layout	: 'fit',
				items	: this.buildRuleModifyHistory()
			}]
		});
				
		return tabpanel;
	},
	buildRuleBasicInfo : function(){
		var basicInfoPanel = new Ext.FormPanel({
			id : 'RULE_INFO_FORM'+commonGlobal.idFlag,
			border : false,
			autoScroll : true,
			frame : true,
			labelWidth : 60,
			items : [{
						anchor : '80%',
						layout : 'column',
						width : 600,
						style : 'margin:0,0,0,10',
						items : [{
									xtype		: 'hidden',
					                name		: 'NE_ID',
					                neTypeId	: ''
								},{
									width : 350,
									layout : 'form',
									items : [{
												xtype : 'textfield',
												fieldLabel : '规则名称',
												name : 'RULE_NAME',
												width : 250,
												maxLength : 250,
												maxLengthText : '规则名称内容长度不能超过250个字符',
												allowBlank : false,
												blankText : '规则名称不能为空!',
												style 		: marginCss
											}]
								}, {
									width : 180,
									layout : 'form',
									items : [{
												xtype : 'textfield',
												fieldLabel : '创建人',
												name : 'CREATE_STAFF_NAME',
												width : 100,
												disabled : true,
												style 		: marginCss
											}]
								}]
					}, {
						xtype : 'fieldset',
						width : 600,
						title : '时效配置',
						id : 'agingConfig'+commonGlobal.idFlag,
						border : true,
						layout : 'column',
						items : [{
							layout : 'column',
							items : [{
										xtype : 'tbtext',
										text : '已配置列表:'
									}, {
										xtype : 'multiselect',
										fieldLabel : '已配置列表',
										id : 'configList'+commonGlobal.idFlag,
										width : 500,
										height : 70,
										autoScroll : true,
										singleSelect : true,
										displayField : 'text',
										style : 'background:#FFFFFF;margin-left:5',
										store : [],
										listeners : {
											'click' : function(vw, index, node, e){
												clearTimeLimit();
												showTimeLimitOption();
											}
										}
									}]
						}, {
							layout : 'column',
							buttonAlign : 'left',
							buttons : [{
										text : '增加',
										handler : addTimeLimit,
										disabled : true
									}, {
										text : '删除',
										handler : deleteTimeLimit,
										disabled : true
									}],
							style : 'margin-left:60'
						}, {
							layout : 'column',
							items : [{
										xtype : 'tbtext',
										text : '日期:',
										style : 'margin:6,0,0,30'
									}, {
										width : 120,
										id : 'beginDate'+commonGlobal.idFlag,
										xtype : 'datefield',
										format : 'Y-m-d',
										editable : false,
										style 	: marginCss
									}, {
										xtype : 'tbtext',
										text : '--',
										style : 'margin:2,10,0'
									}, {
										width : 120,
										id : 'endDate'+commonGlobal.idFlag,
										xtype : 'datefield',
										format : 'Y-m-d',
										editable : false,
										style 	: marginCss
									}]
						}, {
							layout : 'column',
							style : 'padding-top:10',
							items : [{
										xtype : 'tbtext',
										text : '每月:',
										style : 'margin:6,0,0,30'
									}, {
										width : 120,
										id : 'beginDay'+commonGlobal.idFlag,
										xtype		: 'combo',
						    			store		: new Ext.data.SimpleStore({
						    					fields	: ['value', 'descp'],
						       					data: GlobalTabPanel.dateArray
						       			}),
						   				fieldLabel	: '每月',
						   	 			loadingText	: '正在加载...',
						    			displayField: 'descp',
						    			valueField : 'value',
										mode		: 'local',
						    			triggerAction: 'all',
						    			editable	: true,
						    			selectOnFocus: true,
						   				forceSelection: true,
										style 	: marginCss
									}, {
										xtype : 'tbtext',
										text : '--',
										style : 'margin:2,10,0'
									}, {
										width : 120,
										id : 'endDay'+commonGlobal.idFlag,
										xtype		: 'combo',
						    			store		: new Ext.data.SimpleStore({
						    					fields	: ['value', 'descp'],
						       					data: GlobalTabPanel.dateArray
						       			}),
						   				fieldLabel	: '每月',
						   	 			loadingText	: '正在加载...',
						    			displayField: 'descp',
						    			valueField : 'value',
										mode		: 'local',
						    			triggerAction: 'all',
						    			editable	: true,
						    			selectOnFocus: true,
						   				forceSelection: true,
										style 	: marginCss
									}]
						}, {
							layout : 'column',
							style : 'padding-top:10',
							items : [{
										xtype : 'tbtext',
										text : '星期:',
										style : 'margin:6,0,0,30'
									}, {
										width : 70,
										xtype : 'checkbox',
										id : 'week0'+commonGlobal.idFlag,
										value : GlobalTabPanel.weekArray[0][0],
										boxLabel : GlobalTabPanel.weekArray[0][1]
									}, {
										width : 70,
										xtype : 'checkbox',
										id : 'week1'+commonGlobal.idFlag,
										value : GlobalTabPanel.weekArray[1][0],
										boxLabel : GlobalTabPanel.weekArray[1][1]
									}, {
										width : 70,
										xtype : 'checkbox',
										id : 'week2'+commonGlobal.idFlag,
										value : GlobalTabPanel.weekArray[2][0],
										boxLabel : GlobalTabPanel.weekArray[2][1]
									}, {
										width : 70,
										xtype : 'checkbox',
										id : 'week3'+commonGlobal.idFlag,
										value : GlobalTabPanel.weekArray[3][0],
										boxLabel : GlobalTabPanel.weekArray[3][1]
									}, {
										width : 70,
										xtype : 'checkbox',
										id : 'week4'+commonGlobal.idFlag,
										value : GlobalTabPanel.weekArray[4][0],
										boxLabel : GlobalTabPanel.weekArray[4][1]
									}, {
										width : 70,
										xtype : 'checkbox',
										id : 'week5'+commonGlobal.idFlag,
										value : GlobalTabPanel.weekArray[5][0],
										boxLabel : GlobalTabPanel.weekArray[5][1]
									}, {
										width : 70,
										xtype : 'checkbox',
										id : 'week6'+commonGlobal.idFlag,
										value : GlobalTabPanel.weekArray[6][0],
										boxLabel : GlobalTabPanel.weekArray[6][1]
									}]
						}, {
							layout : 'column',
							style : 'padding-top:10',
							items : [{
										xtype : 'tbtext',
										text : '时间:',
										style : 'margin:3,0,0,30'
									}, {
										width : 45,
										id : 'beginHour'+commonGlobal.idFlag,
										xtype : 'textfield',
										fieldLabel : '时间',
										regexText : '不是有效的时间格式',
										regex : /^\d+$/,
										maxLength : 2,
										maxLengthText : '时间长度不能超过两位数'
									}, {
										xtype : 'tbtext',
										text : '时',
										style : 'margin:3,10,0,0'
									}, {
										width : 43,										
										id : 'beginMinute'+commonGlobal.idFlag,
										xtype : 'textfield',
										regexText : '不是有效的时间格式',
										regex : /^\d+$/,
										maxLength : 2,
										maxLengthText : '时间长度不能超过两位数'
									}, {
										xtype : 'tbtext',
										text : '分',
										style : 'margin:3,10,0,0'
									}, {
										xtype : 'tbtext',
										text : '--',
										style : 'margin:2,10,0,0'
									}, {
										width : 43,
										id : 'endHour'+commonGlobal.idFlag,
										xtype : 'textfield',
										regexText : '不是有效的时间格式',
										regex : /^\d+$/,
										maxLength : 2,
										maxLengthText : '时间长度不能超过两位数'
									}, {
										xtype : 'tbtext',
										text : '时',
										style : 'margin:3,10,0,0'
									}, {
										width : 43,
										id : 'endMinute'+commonGlobal.idFlag,
										xtype : 'textfield',
										regexText : '不是有效的时间格式',
										regex : /^\d+$/,
										maxLength : 2,
										maxLengthText : '时间长度不能超过两位数'
									}, {
										xtype : 'tbtext',
										text : '分',
										style : 'margin:3,10,0,0'
									}]
						}, {
							layout : 'column',
							buttonAlign : 'left',
							buttons : [{
										text : '保存',
										handler : saveTimeLimit,
										disabled : true
									}, {
										text : '重置',
										handler : clearTimeLimit,
										disabled : true
									}],
							style : 'padding-left:360'
						}, {
							xtype : 'tbtext',
							text : '注: "时间"条件假如结束时间配置24时00分,实际结果是小于24时的才符合规则(不含结束时间的那个时间点)',
							style : 'margin:3,10,0,0;color:red'
						}]
					}, {
						layout : 'column',
						anchor : '90%',
						items : [{
									xtype : 'tbtext',
									text : '描述:',
									style : 'padding:0,0,0,22'
								}, {
									xtype : 'textarea',
									name : 'REMARK',
									width : 550
								}]
					}]
		});
		return basicInfoPanel;
	},
	buildRuleCommonSet : function(){
		var fieldSet = GlobalTabPanel.neWhereSet;
		var whereSetForm = new Ext.FormPanel({
			id : 'WHERE_SET_FORM' + commonGlobal.idFlag,
			labelWidth : 75,
			bodyCfg : 'padding:10,0,0,10'
		});
		for(var i=0;i<fieldSet.length;i++){
			var row = [{
					anchor : '90%',
					layout 	: 'column',
		            id		: fieldSet[i][0]+commonGlobal.idFlag,
				    items 	: [{
						width : 155,
						layout : 'form',
						items : [{
				                width 		: 70,
				               	xtype		: 'combo',
				               	fieldLabel	: fieldSet[i][1],
				               	name		: fieldSet[i][0]+'_OPERATE',
				               	hiddenName  : fieldSet[i][0]+'_OPERATE',
							    store		: new Ext.data.SimpleStore({
							    	fields	: ['value', 'descp'],
							       	data	: GlobalTabPanel.containArray
							       	}),
							    displayField: 'descp',
								mode		: 'local',
								value 		: '1',
								valueField	: 'value',
							    triggerAction: 'all',
							    editable	: false,
							    selectOnFocus : true,
								style 		: marginCss
						}]},{
						width  : 300,
						layout : 'form',
						style : 'margin:0,0,0,30',
						items : [{
								hideLabel 	: true,
				                anchor      : '80%',
				               	xtype		: fieldSet[i][2],
				               	name		: fieldSet[i][0],
				               	hiddenName  : fieldSet[i][0],
							    store		: fieldSet[i][3],
							    loadingText	: '正在加载...',
							    displayField: 'TEXT',
							    valueField	: 'VALUE',
								mode		: 'local',
							    triggerAction: 'all',
							    editable	: false,
							    selectOnFocus : true,
								style 		: marginCss
					}]
				}]
			}];
			whereSetForm.add(row);
		}
		
		var whereSetForm2 = new Ext.FormPanel({
			id : 'WHERE_SET_FORM_CUSTOM' + commonGlobal.idFlag,
			labelWidth : 55,
			bodyCfg : 'padding:10,0,0,10'
		});
		if(Global.isVariableConfig==1){
			var row2 = [{
				anchor : '90%',
				layout 	: 'column',
			    items 	: [{
					width : 235,
					layout : 'form',
					items : [{
			                width  		: 170,
			               	fieldLabel	: '全局变量',
			               	xtype		: 'combo',
			               	id			: 'GLOBAL_VARIABLE_NAME'+ commonGlobal.idFlag,
			               	name		: 'global_variable_name',
			               	hiddenName  : 'global_variable_name',
						    store		: dsGlobalVariableNameForWhere,
						    loadingText	: '正在加载...',
						    displayField: 'TEXT',
						    valueField	: 'VALUE',
							mode		: 'local',
						    triggerAction: 'all',
						    editable	: false,
						    selectOnFocus : true,
							style 		: marginCss,
							listeners : {
								select : function (obj){
									var global_variable_value_combo = Ext.getCmp('global_variable_value_form' + commonGlobal.idFlag).getComponent(0);
									global_variable_value_combo.clearValue();
									global_variable_value_combo.store.removeAll();
									dsGlobalVariableValueSql = "select A.ENUM_NAME VALUE,A.ENUM_NAME TEXT from RULE_GLOBAL_VARIABLE_ENUM A, RULE_GLOBAL_VARIABLE B " +
												"where A.VARIABLE_ID=B.VARIABLE_ID and A.STATE='0SA' and B.VARIABLE_NAME='"+obj.getValue()+"'";
									global_variable_value_combo.getStore().load({params : {"paramValue":getAESEncode(encodeURIComponent(dsGlobalVariableValueSql))}});
								}
							}
					}]},{
					width  : 160,
					layout : 'form',
					id	  : 'global_variable_value_form' + commonGlobal.idFlag,
					style : 'margin:0,0,0,10',
					items : [{
	                		anchor      : '100%',
			   				fieldLabel	: '值',
			               	xtype		: 'combo',
			               	name		: 'global_variable_value',
			               	hiddenName  : 'global_variable_value',
			               	id			: 'GLOBAL_VARIABLE_VALUE'+ commonGlobal.idFlag,
					    	store		: dsGlobalVariableValue,
						    loadingText	: '正在加载...',
						    displayField: 'TEXT',
						    valueField	: 'VALUE',
							mode		: 'local',
						    triggerAction: 'all',
						    editable	: false,
						    selectOnFocus : true,
							style 		: marginCss
						
						/*{
						width 	: 200,
						layout 	: 'column',
						items 	: [{
									width 		: 30,
									xtype 		: 'tbtext',
									text 		: '值1:'
								},{
									width 		: 80,
									xtype		: 'combo',
					    			store		: dsGlobalVariableValue,
					   	 			loadingText	: '正在加载...',
								    displayField: 'TEXT',
								    valueField	: 'VALUE',
									mode		: 'local',
					    			triggerAction: 'all',
								    editable	: false,
								    selectOnFocus : true,
									style 		: marginCss
								}
							]
						*/		
					}]
				}]
			}];
			dsGlobalVariableNameForWhere.load({params : {"paramValue":getAESEncode(encodeURIComponent(dsGlobalVariableNameSqlForWhere))}});
			whereSetForm2.add(row2);
		}
		
		var whereSetPanel = new Ext.Panel({
			anchor 	: '100%',
			frame : true,
			border : true,
			autoScroll 	: true,
			autoWidth   : true,
			items : [
				whereSetForm,
				whereSetForm2
			]
		});
		return whereSetPanel;
	},
	buildRuleModifyHistory : function(){
		if(commonGlobal.ruleInfo.ruleId==null || commonGlobal.ruleInfo.ruleId=="")
			commonGlobal.ruleInfo.ruleId = "-1";
		var modifyHistoryPanel = new Ext.FormPanel({
			id 		: 'RULE_HISTORY_FORM'+commonGlobal.idFlag,
			border 	: false,
			layout	: 'fit',
			items	: new Ext.data.ResultGrid({
				result			: commonGlobal.ruleInfo.resultHistory,
				resultParam		: commonGlobal.ruleInfo,
				//isAddParamTbar	: true,
				iconCls			: "icon-grid"
			})
		});
		return modifyHistoryPanel;
	},
	setControlState : function(map){
		var frm = Ext.getCmp('WHERE_SET_FORM' + commonGlobal.idFlag).getForm();
		for(var key in map){
			if(map[key]){
				Ext.getCmp(key + commonGlobal.idFlag).setVisible(true);
			}
			else{
				Ext.getCmp(key + commonGlobal.idFlag).setVisible(false);
			}
		}
	},
	getDataFromPanel : function(){
		//基本信息
		var frm = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm();
		this.rule.name = frm.findField('RULE_NAME').getValue();
		this.rule.createStaffName = frm.findField('CREATE_STAFF_NAME').getValue();
		this.rule.remark = frm.findField('REMARK').getValue();
		//时效配置
		this.rule.effectiveTime = {};
		for(var i=0;i<GlobalTabPanel.timeFilterArr.length;i++){
			var timeFilter = GlobalTabPanel.timeFilterArr[i];
			var o;
			var tfObj = {};
			if(timeFilter['os.beginDate'])	{
				o = createLogicalCondition("os.beginDate",timeFilter['os.beginDate'],"=","string");
				tfObj['beginDate'] = o;
			}
			if(timeFilter['os.endDate']){
				o = createLogicalCondition("os.endDate",timeFilter['os.endDate'],"=","string");
				tfObj['endDate'] = o;
			}
			if(timeFilter['os.beginDay']){
				o = createLogicalCondition("os.beginDay",timeFilter['os.beginDay'],"=","number");
				tfObj['beginDay'] = o;
			}
			if(timeFilter['os.endDay']){
				o = createLogicalCondition("os.endDay",timeFilter['os.endDay'],"=","number");
				tfObj['endDay'] = o;
			}
			if(timeFilter['os.beginTime']){
				o = createLogicalCondition("os.beginTime",timeFilter['os.beginTime'],"=","string");
				tfObj['beginTime'] = o;
			}
			if(timeFilter['os.endTime']){
				o = createLogicalCondition("os.endTime",timeFilter['os.endTime'],"=","string");
				tfObj['endTime'] = o;
			}
			if(timeFilter['os.weekValue']){
				o = createLogicalCondition("os.weekValue",timeFilter['os.weekValue'],"in","number");
				tfObj['weekValue'] = o;
			}
			this.rule.effectiveTime[i] = tfObj;
		}

		//条件设置
		var condition = new Object();
		this.rule.condition = {};
		if(commonGlobal.isHideTabCondition == false){
			var frm = Ext.getCmp('WHERE_SET_FORM' + commonGlobal.idFlag).getForm();
			frm.items.each(function(item){
				//alert("name="+item.name+"--value="+item.value+"--value2="+item.getValue())
				if(item.isVisible()){
					var v = item.value;
					if(item.name=='config_ne_id'){
						v = item.getValue();
					}
					if(v)
						condition[item.name] = v;
					else
						condition[item.name] = "";
				}
			});
			for(var key in condition){
				if(key.indexOf('OPERATE') == -1){
					var op = condition[key+'_OPERATE'] == '1' ? 'in' : 'notIn';
					var valueType;
					if(condition[key].indexOf(',') != -1){
						var tValType = condition[key].split(',');
						valueType = isNaN(tValType[0])==true ? "string" : "number";
					}else{
						valueType = isNaN(condition[key])==true ? "string" : "number";
					}
					var o = createLogicalCondition(key,condition[key],op,valueType);
					this.rule.condition[key] = o;
				}
			}
			//加载条件的个性化部分(全局变量)
			if(Global.isVariableConfig==1){
				var name = Ext.getCmp('GLOBAL_VARIABLE_NAME' + commonGlobal.idFlag).getValue();
				var value = Ext.getCmp('GLOBAL_VARIABLE_VALUE' + commonGlobal.idFlag).getValue();
				var o = createLogicalCondition(name,value,"=","string");
				this.rule.condition[condition.lenght] = o;
			}
		}
		
		
		//加载个性化数据
		this.rule.actions = {};//对象初始化
		this.getCustomDataFromPanel(this.rule.actions);
	},
	setDataToPanel : function(){
		commonGlobal.ruleInfo.ruleId = this.rule.id;//规则标识，查询修改历史自定义查询使用到
		Ext.getCmp('RULE_HISTORY_FORM'+commonGlobal.idFlag).getComponent(0).search();
		//基本信息
		var frm = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm();
		frm.findField('NE_ID').setValue(this.rule.neId);
		frm.findField('NE_ID').neTypeId = this.rule.neTypeId;
		frm.findField('RULE_NAME').setValue(this.rule.name).disable();
		frm.findField('CREATE_STAFF_NAME').setValue(this.rule.createStaffName).disable();
		frm.findField('REMARK').setValue(this.rule.remark).disable();	
		var configList = Ext.getCmp('configList'+commonGlobal.idFlag);
		var RECORD = Ext.data.Record.create([{name : 'value'}, {name : 'text'}]);
		//时效配置
		var effectiveTime = this.rule.effectiveTime;
		for(var i in effectiveTime){
			var timeFilter = effectiveTime[i];			
			var dateStr = "";
	    	var dayStr = "";
	    	var weekStr = "";
	    	var timeStr = "";
	    	if(timeFilter['os.beginDate']){
		    	//var beginDate = formatDate(timeFilter.beginDate);
				//var endDate = formatDate(timeFilter.endDate);
	    		var beginDate = timeFilter['os.beginDate'];
				var endDate = timeFilter['os.endDate'];
				if(beginDate || endDate){
					if(beginDate && endDate)
						dateStr = beginDate+"至"+endDate+" ";
					else if(beginDate)//只有"开始日期"        
		            	dateStr = "从"+beginDate+"开始 ";
		        	else if(endDate)//只有"结束日期"        
		            	dateStr = "至"+endDate+"结束 ";        
				}
	    	}
			if(timeFilter['os.beginDay']){
				dayStr = "每月"+timeFilter['os.beginDay']+"号至"+timeFilter['os.endDay']+"号";
			}
			if(timeFilter['os.weekValue']){
			var weekValue = timeFilter['os.weekValue'];
				var tmpWeekValue = weekValue.split(',');
				for(var j=0;j<tmpWeekValue.length;j++){
					for (var z = 0; z < GlobalTabPanel.weekArray.length; z++) {
						if(GlobalTabPanel.weekArray[z][0]==tmpWeekValue[j])
							weekStr += GlobalTabPanel.weekArray[z][1] + ',';
					}
				}
				if(weekStr!=""){
					weekStr = weekStr.substring(0,weekStr.length - 1);
					timeFilter.weekStr = weekStr;
				}
			}
			if(timeFilter['os.beginTime']){
				timeStr = timeFilter['os.beginTime'] + "至"+ timeFilter['os.endTime'];
			}
			GlobalTabPanel.timeFilterArr.push(timeFilter);
			var returnValue = composeTimeLimit(dateStr,dayStr, weekStr, timeStr);
			var rec = new RECORD({value : '',text : returnValue});											
			configList.store.insert(i,rec);
		}

		//条件设置
		if(commonGlobal.isHideTabCondition == false){
			var frm = Ext.getCmp('WHERE_SET_FORM' + commonGlobal.idFlag).getForm();
			for(var key in this.rule.condition){
				var o = this.rule.condition[key];
				var op = o.operate == 'in' ? '1' : '2';
				if(frm.findField(key+'_OPERATE'))
					frm.findField(key+'_OPERATE').setValue(op);
				if(frm.findField(key)){
					frm.findField(key).setValue(o.value);
					if(frm.findField(key).hiddenField)frm.findField(key).hiddenField.value = o.value;
				}
				if(key=='kpi_id'){
					var kpilistValue = o.value.split(',');
					var kpilistText = frm.findField(key).el.dom.value.split(',');
					GlobalTabPanel.KPI_LIST = [];
					for(var i=0;i<kpilistValue.length;i++){
						var kpiobj = new Object();
						kpiobj.value = kpilistValue[i];
						kpiobj.text = kpilistText[i];
						GlobalTabPanel.KPI_LIST[i] = kpiobj;
					}
				}
			}
		
			//加载条件的个性化部分(全局变量)
			if(Global.isVariableConfig==1){
				var name = Ext.getCmp('GLOBAL_VARIABLE_NAME' + commonGlobal.idFlag);
				var value = Ext.getCmp('GLOBAL_VARIABLE_VALUE' + commonGlobal.idFlag);
				name.setValue("");
				value.setValue("");
				for (var i = 0; i < name.store.getCount(); i++) {
					var item = name.store.getAt(i);
					if(item){
						var o = this.rule.condition[item.data.VALUE];
						if(o){
							var global_variable_value_combo = Ext.getCmp('global_variable_value_form' + commonGlobal.idFlag).getComponent(0);
							global_variable_value_combo.clearValue();
							global_variable_value_combo.store.removeAll();
							dsGlobalVariableValueSql = "select A.ENUM_NAME VALUE,A.ENUM_NAME TEXT from RULE_GLOBAL_VARIABLE_ENUM A, RULE_GLOBAL_VARIABLE B " +
										"where A.VARIABLE_ID=B.VARIABLE_ID and A.STATE='0SA' and B.VARIABLE_NAME='"+o.key+"'";
							global_variable_value_combo.getStore().load({params : {"paramValue":getAESEncode(encodeURIComponent(dsGlobalVariableValueSql))}});
							name.setValue(o.key);
							value.setValue(o.value);
						}
					}
				}
			}
		}
		
		
		//加载个性化数据
		this.setCustomDataToPanel(this.rule.actions);
	},
	setRule : function(rule){
		this.rule = rule;
	},
	buildRuleCustomPanel : function(){
		var customPanel = new Ext.FormPanel({
				id		: 'RULE_CUSTOM_FORM'+commonGlobal.idFlag,
				iconCls : 'icon-tabs',
				anchor : '90%',
				frame	: true,
				autoScroll : true,
				title	: commonGlobal.ruleInfo.RULE_TITLE+"设置",
				items	: this.buildRuleCustomSet()
		})
		this.customForm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		return customPanel;
	},
	addPanel			: function(pPanel,cPanel){
		if(cPanel){
			pPanel.remove(2, true);
			pPanel.insert(2,cPanel);
			pPanel.doLayout(true);
		}
	},
	initPanel			: function(isReSetCustomForm){
		initData();//初始化数据对象
		Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm().reset();//基本信息初始化
		Ext.getCmp('WHERE_SET_FORM'+commonGlobal.idFlag).getForm().reset();//条件设置初始化
		if(isReSetCustomForm)
			Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm().reset();//个性化规则设置初始化
		Ext.getCmp('RULE_HISTORY_FORM'+commonGlobal.idFlag).getComponent(0).store.removeAll();//修改历史初始化
		this.initCustomDataToPanel();
	},
	isValidateForm : function(){
		if(!Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm().isValid()){
			Ext.Msg.alert("系统提示","基本信息的数据没有通过验证，请确认输入!");
			return false;
		}
		if(!Ext.getCmp('WHERE_SET_FORM'+commonGlobal.idFlag).getForm().isValid()){
			Ext.Msg.alert("系统提示","条件设置的数据没有通过验证，请确认输入!");
			return false;
		}
		//验证条件个性化部分(全局变量)
		if(Global.isVariableConfig==1){
			if(Ext.getCmp('GLOBAL_VARIABLE_NAME' + commonGlobal.idFlag)){
				var name = Ext.getCmp('GLOBAL_VARIABLE_NAME' + commonGlobal.idFlag).getValue();
				var value = Ext.getCmp('GLOBAL_VARIABLE_VALUE' + commonGlobal.idFlag).getValue();
				if(name){
					if(!value){
						Ext.Msg.alert("系统提示","全局变量没有值，请选择全局变量值!");
						return false;
					}
				}
			}
		}
		
		//var customForm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(!this.isValidateFormCustom()){
			return false;
		}else if(!this.customForm.isValid()){
			Ext.Msg.alert("系统提示","规则设置项的数据没有通过验证，请确认输入!");
			return false;
		}
		return true;
	},
	isValidateFormCustom : function(){return true;},
	buildRuleCustomSet : Ext.emptyFn,
	initCustomDataToPanel : Ext.emptyFn,
	getCustomDataFromPanel : Ext.emptyFn,
	setCustomDataToPanel : Ext.emptyFn,
	saveAfter : Ext.emptyFn
};


//个性化处理///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var custom = {
	buildUpgradePanel : function(str){
		//超时长
		var exceedLongsPanel = new Ext.Panel({
			anchor 	: '100%',
			hidden 	: false,
			items	: [{
				layout	:'column',
				items	: [{
	                width	: 74,
	                items	: [{ xtype : 'label', text : '告警时长超过' }]
				},{
	                width	: 40,
	                items	: [{
						xtype		: 'textfield',
	                	id			: 'time'+commonGlobal.idFlag,
						regexText 	: '不是有效正整数',
						regex 		: /^\d+$/,
						maxLength 	: 3,
						maxLengthText : '时间长度不能超过三位数',
						style 		: marginCss
					}]
				},{
	                items	: [{ xtype : 'label', text : '分钟依然没有解决，'+ str }]
				}]
			}]
		});
		//超次数
		var exceedTimesPanel = new Ext.Panel({
			anchor 	: '100%',
			hidden 	: true,
			items	: [{
				layout	:'column',
				items	: [{
	                width	: 74,
	                items	: [{ xtype : 'label', text : '告警次数达到' }]
				},{
	                width	: 40,
	                items	: [{
						xtype		: 'textfield',
	                	id			: 'count'+commonGlobal.idFlag,
						regexText 	: '不是有效正整数',
						regex 		: /^\d+$/,
						maxLength 	: 3,
						maxLengthText : '时间长度不能超过三位数',
						style 		: marginCss
					}]
				},{
	                items	: [{ xtype : 'label', text : '次依然没有解决，'+ str }]
				}]
			}]
		});
		//超频率
		var exceedFrequencyPanel = new Ext.Panel({
			anchor 	: '100%',
			hidden 	: true,
			items	: [{
				layout	:'column',
				items	: [{
	                width	: 38,
	                items	: [{ xtype : 'label', text : '告警在' }]
				},{
	                width	: 40,
	                items	: [{
						xtype		: 'textfield',
	                	id			: 'freqTime'+commonGlobal.idFlag,
						regexText 	: '不是有效正整数',
						regex 		: /^\d+$/,
						maxLength 	: 3,
						maxLengthText : '时间长度不能超过三位数',
						style 		: marginCss
					}]
				},{
	                width	: 73,
	                items	: [{ xtype : 'label', text : '分钟内，出现' }]
				},{
	                width	: 40,
	                items	: [{
						xtype		: 'textfield',
	                	id			: 'freqCount'+commonGlobal.idFlag,
						regexText 	: '不是有效正整数',
						regex 		: /^\d+$/,
						maxLength 	: 3,
						maxLengthText : '时间长度不能超过三位数',
						style 		: marginCss
					}]
				},{
	                items	: [{ xtype : 'label', text : '次依然没有解决，'+ str }]
				}]
			}]
		});
		var upgradeRulePanel = new Ext.Panel({
			anchor 	: '95%',
			items	: [{
				layout	:'column',
	            items	:[{
	               	height	: 30,
	               	width	: 90,
					xtype	: 'label',
					text	: '超频率选择:',
					style 	: 'margin:2,0,0,0'
	            },{
	                width	: 130,
	                items	: [{
		                width		: 120,
	                	xtype		: 'combo',
	                	id			: 'upgradeType'+commonGlobal.idFlag,
					    store		: new Ext.data.SimpleStore({
					    	fields	: ['value', 'descp'],
					       		data: GlobalTabPanel.exceedTypeArray
					       	}),
					    loadingText	: '正在加载...',
					    displayField: 'descp',
						mode		: 'local',
					    triggerAction: 'all',
					    value		: 'time',
						valueField	: 'value',
					    editable	: false,
					    selectOnFocus: true,
					    forceSelection: true,
						style 		: marginCss,
						listeners : {
							select : function (){
								var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
								var upgradeType = frm.findField('upgradeType'+commonGlobal.idFlag).getValue();
								//根据选择类型判断显示超时长、超次数、超频率
								if (upgradeType=="time") {
									exceedLongsPanel.setVisible(true);
									exceedTimesPanel.setVisible(false);
									exceedFrequencyPanel.setVisible(false);
								}else if (upgradeType=="count") {
									exceedLongsPanel.setVisible(false);
									exceedTimesPanel.setVisible(true);
									exceedFrequencyPanel.setVisible(false);
								}else {
									exceedLongsPanel.setVisible(false);
									exceedTimesPanel.setVisible(false);
									exceedFrequencyPanel.setVisible(true);
								}
							}
						}
					}]
	            },exceedLongsPanel,exceedTimesPanel,exceedFrequencyPanel]
			}]
		});
		return upgradeRulePanel;
	},
	transactUpgradeForm : function(type, frm){
		var upgradeType = frm.findField('upgradeType'+commonGlobal.idFlag).getValue();
		//根据选择类型判断显示超时长、超次数、超频率
		if (upgradeType=="time") {
			if(type=="upgrade"){
				var time = frm.findField('time'+commonGlobal.idFlag).getValue();
				if(time==null || time=="" || time < 1){
					Ext.Msg.alert('系统提示', '超时长不能为空!，且必须大于0');
					return false;
				}
			}
		}else if (upgradeType=="count") {
			if(type=="upgrade"){
				var count = frm.findField('count'+commonGlobal.idFlag).getValue();
				if(count==null || count=="" || count < 1){
					Ext.Msg.alert('系统提示', '超次数不能为空!，且必须大于0');
					return false;
				}
			}
		}else if (upgradeType=="freq") {
			if(type=="upgrade"){
				var freqTime = frm.findField('freqTime'+commonGlobal.idFlag).getValue();
				if(freqTime==null || freqTime=="" || freqTime < 1){
					Ext.Msg.alert('系统提示', '超频率时长值不能为空!，且必须大于0');
					return false;
				}
				var freqCount = frm.findField('freqCount'+commonGlobal.idFlag).getValue();
				if(freqCount==null || freqCount=="" || freqCount < 1){
					Ext.Msg.alert('系统提示', '超频率次数值不能为空，且必须大于0!');
					return false;
				}
			}
		}
		return true;
	},
	setCustomDataToUpgradeForm : function(actions,frm){
		//加载规则个性化配置数据
		if(actions){
			var upgradeType = actions.getAttribute('upgradeType');
			frm.findField('upgradeType'+commonGlobal.idFlag).setValue(upgradeType);
			frm.findField('upgradeType'+commonGlobal.idFlag).fireEvent('select');//当下拉框值改变时，触发选择事件
			if(upgradeType== 'time'){
				frm.findField('time'+commonGlobal.idFlag).setValue(actions.getAttribute('time'));
			}else if(upgradeType== 'count'){
				frm.findField('count'+commonGlobal.idFlag).setValue(actions.getAttribute('count'));
			}else{
				frm.findField('freqTime'+commonGlobal.idFlag).setValue(actions.getAttribute('time'));
				frm.findField('freqCount'+commonGlobal.idFlag).setValue(actions.getAttribute('count'));
			}
		}
	},
	getCustomDataFromUpgradeForm : function(actions,frm){
		//根据选择类型判断显示超时长、超次数、超频率
		var upgradeType = frm.findField('upgradeType'+commonGlobal.idFlag).getValue();
		if(upgradeType== 'time'){
			var time = frm.findField('time'+commonGlobal.idFlag).getValue();
			if(time){
				actions['upgradeType'] = createLogicalCondition('upgradeType', upgradeType, "=", "string");
				actions['time'] = createLogicalCondition('time', frm.findField('time'+commonGlobal.idFlag).getValue(), "=", "number");
			}
		}else if(upgradeType== 'count'){
			var count = frm.findField('count'+commonGlobal.idFlag).getValue();
			if(count){
				actions['upgradeType'] = createLogicalCondition('upgradeType', upgradeType, "=", "string");
				actions['count'] = createLogicalCondition('count', frm.findField('count'+commonGlobal.idFlag).getValue(), "=", "number");
			}
		}else if(upgradeType== 'freq'){
			var freqTime = frm.findField('freqTime'+commonGlobal.idFlag).getValue();
			var freqCount = frm.findField('freqCount'+commonGlobal.idFlag).getValue();
			if(freqTime && freqCount){
				actions['upgradeType'] = createLogicalCondition('upgradeType', upgradeType, "=", "string");
				actions['time'] = createLogicalCondition('time', frm.findField('freqTime'+commonGlobal.idFlag).getValue(), "=", "number");
				actions['count'] = createLogicalCondition('count', frm.findField('freqCount'+commonGlobal.idFlag).getValue(), "=", "number");
			}
		}
	},
	buildDispatchPanel : function(){
		
		var fieldSet = new Ext.form.FieldSet({
			width: 350,
	        title: '工单人选择',
	        collapsible: true,
	        autoHeight:true,
	        bodyStyle:'padding:5px 5px 0;',
	        defaults: {
	            anchor: '-20' // leave room for error icon
	        },
	        items :[
				{
				   	width		: 200,
				   	xtype		: 'selectDialog',
				   	name		: 'staff',
				    id			: 'staff'+commonGlobal.idFlag,
				    store		: new Ext.data.SimpleStore({
				    	fields	: ['value', 'descp']
				    	}),
				   	fieldLabel	: '工单人',
				    loadingText	: '正在加载...',
				    displayField: 'descp',
					mode		: 'local',
				    triggerAction: 'all',
				    editable	: false,
				    selectOnFocus: true,
				    forceSelection: true,
					style 		: marginCss
				},
				{
		           	width		: 200,
		           	xtype		: 'combo',
		        	name		: 'duty',
	                id			: 'duty'+commonGlobal.idFlag,
				    store		: dsDuty,
				   	fieldLabel	: '值班线',
				    loadingText	: '正在加载...',
				    displayField: 'TEXT',
					valueField	: 'VALUE',
					mode		: 'local',
				    triggerAction: 'all',
				    editable	: false,
				    selectOnFocus: true,
				    forceSelection: true,
					style 		: marginCss
				},
				new SelectTree({
		           	width		: 200,
				    xmlUrl		: alarmRuleUrl+'method=getProjectGroup&groupType=TEAM',
		           	name		: 'PROJECT',
	                id			: 'project'+commonGlobal.idFlag,
				   	fieldLabel	: '专项小组',
				    editable	: false,
				    selectOnFocus: true,
				    forceSelection: true,
					style 		: marginCss
				})
	        ]
		});

		return fieldSet;	
	},
	transactDispatchForm : function(frm){
		//固定人员、值班线、专项小组最少要有一项有值
		var staff = frm.findField('staff'+commonGlobal.idFlag).getValue(),
		    duty = frm.findField('duty'+commonGlobal.idFlag).getValue(),
		    project = frm.findField('project'+commonGlobal.idFlag).getValue();
		if(!staff && !duty && !project){
			Ext.Msg.alert('系统提示', '工单人选择中固定人员、值班线、专项小组最少要有一项有值!');
			return false;
		}
		return true;
	},
	setCustomDataToDispatchForm : function(actions,frm){
		//加载规则个性化配置数据
		if(actions){
			if(actions.getAttribute('dispatchStaff')){
				frm.findField('staff'+commonGlobal.idFlag).setValue(actions.getAttribute('dispatchStaff'));
				frm.findField('staff'+commonGlobal.idFlag).hiddenField.value = actions.getAttribute('dispatchStaff');
			}
			if(actions.getAttribute('dispatchDuty')){
				frm.findField('duty'+commonGlobal.idFlag).setValue(actions.getAttribute('dispatchDuty'));
			}
			if(actions.getAttribute('dispatchProject')){
				frm.findField('project'+commonGlobal.idFlag).setValue(actions.getAttribute('dispatchProject'));
			}
		}
	},
	getCustomDataFromDispatchForm : function(actions,frm){
		//从界面上获取数据存放到rule对象里
		actions['dispatchStaff'] = createLogicalCondition('dispatchStaff', frm.findField('staff'+commonGlobal.idFlag).getValue(), "in", "number");
		actions['dispatchDuty'] = createLogicalCondition('dispatchDuty', frm.findField('duty'+commonGlobal.idFlag).getValue(), "in", "number");
		actions['dispatchProject'] = createLogicalCondition('dispatchProject', frm.findField('project'+commonGlobal.idFlag).getValue(), "in", "number");
	}
}

//屏蔽规则设置
var ShieldRuleSetPanel = Ext.extend(TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(actions)
			actions.getAttribute('action') == 'shield' ? frm.findField('shield'+commonGlobal.idFlag).setValue(true) : frm.findField('clear'+commonGlobal.idFlag).setValue(true);
	},
	getCustomDataFromPanel : function(actions){
		//从界面上获取数据存放到rule对象里
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		actions['action'] = createLogicalCondition('action', frm.findField('shield'+commonGlobal.idFlag).getValue() == true ? 'shield' : 'clear', "=", "string");
	},
	buildRuleCustomSet : function(){
		var customPanel = new Ext.Panel({
			anchor 	: '95%',
			defaultType:'panel',
			items	: [{
				layout	: 'column',
	            items	:[{
	               	height		: 30,
	               	width		: 80,
					xtype		: 'radio',
					name		: 'shield',
					id 			: 'shield'+commonGlobal.idFlag,
					boxLabel	: '屏蔽',
					checked		: true
				},{
	               	width		: 80,
					xtype		: 'radio',
					name		: 'shield',
					id			: 'clear'+commonGlobal.idFlag,
					boxLabel	: '清除'
				}]
			},{
				layout	: 'column',
				items 	: [{
					xtype		: 'label',
					text		: '屏蔽：不产生告警',
					style 		: 'color:red'
				}]
			},{
				layout	: 'column',
				items 	: [{
					xtype		: 'label',
					text		: '清除：将已产生的告警状态置为已清除',
					style 		: 'color:red'
				}]
			}]
		});
		return customPanel;
	}
})
factorySetPanel.regObject(ruleType[0],ShieldRuleSetPanel);



//标题规则设置
var TitleRuleSetPanel = Ext.extend(TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		if(actions)
			Ext.getCmp('titlePattern'+commonGlobal.idFlag).setValue(actions.getAttribute('titlePattern'));
		if(actions){
			var applyTo = actions.getAttribute('applyTo').split(',');
			for(var i=0;i<applyTo.length;i++){
				if(applyTo[i]==1)
					Ext.getCmp('alarmTitle'+commonGlobal.idFlag).setValue(true);
				else if(applyTo[i]==2)
					Ext.getCmp('noticeTitle'+commonGlobal.idFlag).setValue(true);
				else if(applyTo[i]==3)
					Ext.getCmp('conveyTitle'+commonGlobal.idFlag).setValue(true);
			}
		}
	},
	getCustomDataFromPanel : function(actions){
		actions['titlePattern'] = createLogicalCondition('titlePattern',Ext.getCmp('titlePattern'+commonGlobal.idFlag).getValue(),'=','string');
		var alarmTitle = Ext.getCmp('alarmTitle' + commonGlobal.idFlag);
		var noticeTitle = Ext.getCmp('noticeTitle' + commonGlobal.idFlag);
		var conveyTitle = Ext.getCmp('conveyTitle' + commonGlobal.idFlag);
		var applyTo = "";
		alarmTitle.checked == true ? (applyTo  += "1," ) : null;
		noticeTitle.checked == true ? (applyTo += "2," ) : null;
		conveyTitle.checked == true ? (applyTo += "3," ) : null;
		if(applyTo.length>0)
			applyTo = applyTo.substring(0,applyTo.length-1);
		
		actions['applyTo'] = createLogicalCondition('applyTo',applyTo, "in", "number");
	},
	isValidateFormCustom : function(){
		var titlePattern = Ext.getCmp('titlePattern'+commonGlobal.idFlag).getValue();
		if(titlePattern==null || titlePattern==""){
			Ext.Msg.alert("系统提示","生成的标题格式定义不能为空!");
			return false;
		}
		var alarmTitle = Ext.getCmp('alarmTitle' + commonGlobal.idFlag);
		var noticeTitle = Ext.getCmp('noticeTitle' + commonGlobal.idFlag);
		var conveyTitle = Ext.getCmp('conveyTitle' + commonGlobal.idFlag);
		if(alarmTitle.checked == true) return true;
		if(noticeTitle.checked == true) return true;
		if(conveyTitle.checked == true) return true;
		Ext.Msg.alert("系统提示","应用于哪种标题请选项一项!");
		return false;
	},
	buildRuleCustomSet : function(){		
		var customPanel = new Ext.Panel({
			anchor 	: '95%',
			items	: [{
				layout	:'column',
	            items	:[{
	               	width		: 10,
	               	height		: 30
	            },{
	               	width		: 80,
					xtype		: 'label',
					text		: '应用于：',
					style 		: 'margin:2,0,0,0'
	            },{
	            	id : 'alarmTitle' + commonGlobal.idFlag,
	            	xtype : 'checkbox',
	            	width		: 80,
					boxLabel	: '告警标题'
				},{
					id : 'noticeTitle' + commonGlobal.idFlag,
					xtype : 'checkbox',
					width		: 80,
					boxLabel	: '通知标题'
				},{
					id : 'conveyTitle' + commonGlobal.idFlag,
					xtype : 'checkbox',
					width		: 80,
					boxLabel	: '传送标题'
				}]
			},{
				layout	:'column',
	            items	:[{
							xtype : 'multiselect',
							id : 'titleConfigList'+commonGlobal.idFlag,
							width : 200,
							height : 160,
							autoScroll : true,
							singleSelect : true,
							displayField : 'TEXT',
							valueField : 'VALUE',
							style : 'background:#FFFFFF;margin-left:5',
							store : dsTitleList,
							listeners : {
								dblclick : function (){
									dbclickSelect();
								}
							}
							
					},{
						xtype : 'button',
						text : '>',
						width : 50,
						style : 'margin:70,20,0,20',
						handler : function(){
							dbclickSelect();
						}
					},{
						layout : 'form',
						items : [{
							xtype : 'tbtext',
							text  : '生成的标题格式'
						},{
							hideLabel : true,
							xtype : 'textarea',
							id : 'titlePattern'+commonGlobal.idFlag,
							width : 350,
							height: 145
						}]
					}]
			}]
		});
		var dbclickSelect = function(){
			var tcl = Ext.getCmp('titleConfigList'+commonGlobal.idFlag);
			if(tcl.view.getSelectionCount() == 0) return;
			var oIndex = tcl.view.getSelectedIndexes()[0];
			var node = tcl.view.store.getAt(oIndex);
			var tp = Ext.getCmp('titlePattern'+commonGlobal.idFlag);
			tp.setValue(tp.getValue()+"{$"+node.get('VALUE')+"}");
		}
		return customPanel;
	}
})
factorySetPanel.regObject(ruleType[1],TitleRuleSetPanel);



//获取排重规则设置项
var RepeatRuleSetPanel = Ext.extend(TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(actions)
			actions.getAttribute('repeat') == 'none' ? frm.findField('none'+commonGlobal.idFlag).setValue(true) : frm.findField('byRemak'+commonGlobal.idFlag).setValue(true);
	},
	getCustomDataFromPanel : function(actions){
		//从界面上获取数据存放到rule对象里
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		actions['repeat'] = createLogicalCondition('repeat', frm.findField('none'+commonGlobal.idFlag).getValue() == true ? 'none' : 'byRemak', "=", "string");
	},
	buildRuleCustomSet : function(){
		var customPanel = new Ext.Panel({
			anchor 	: '95%',
			items	: [{
				layout	:'column',
	            items	:[{
	               	width		: 80,
					xtype		: 'label',
					text		: '排重选择：',
					style 		: 'margin:2,0,0,0'
	            },{
	               	height		: 30,
	               	width		: 80,
					xtype		: 'radio',
					name		: 'repeat',
					id 			: 'none'+commonGlobal.idFlag,
					boxLabel	: '不排重'
				},{
					xtype		: 'radio',
					name		: 'repeat',
					id 			: 'byRemak'+commonGlobal.idFlag,
					boxLabel	: '增加“备注”字段排重',
					checked		: true
				}]
			}]
		});
		return customPanel;
	}
});
factorySetPanel.regObject(ruleType[2],RepeatRuleSetPanel);


//获取升级规则设置项
var UpgradeRuleSetPanel = Ext.extend(TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		custom.setCustomDataToUpgradeForm(actions,frm);
	},
	getCustomDataFromPanel : function(actions){
		//根据选择类型判断显示超时长、超次数、超频率
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		custom.getCustomDataFromUpgradeForm(actions,frm);
	},
	isValidateFormCustom : function(){
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		//升级频率判断
		var upgradeType = frm.findField('upgradeType'+commonGlobal.idFlag).getValue();
		if(upgradeType==""){
			Ext.Msg.alert('系统提示', '对不起，升级频率必须要选择一种!');
			return false;
		}
		if(!custom.transactUpgradeForm("upgrade", frm)){
			return false;
		}
		return true;
	},
	buildRuleCustomSet : function(){
		return custom.buildUpgradePanel("升级告警");
	}
});
factorySetPanel.regObject(ruleType[3],UpgradeRuleSetPanel);

//获取派单规则设置项
var DispatchRuleSetPanel = Ext.extend(TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(actions){
			if(actions.getAttribute('circulationStaff')){
				frm.findField('circulationStaff'+commonGlobal.idFlag).setValue(actions.getAttribute('circulationStaff'));
				frm.findField('circulationStaff'+commonGlobal.idFlag).hiddenField.value = actions.getAttribute('circulationStaff');
			}
			if(actions.getAttribute('circulationDuty')){
				frm.findField('circulationDuty'+commonGlobal.idFlag).setValue(actions.getAttribute('circulationDuty'));
			}
			if(actions.getAttribute('circulationProject')){
				frm.findField('circulationProject'+commonGlobal.idFlag).setValue(actions.getAttribute('circulationProject'));
			}
		}
		custom.setCustomDataToDispatchForm(actions,frm);
	},
	getCustomDataFromPanel : function(actions){
		//从界面上获取数据存放到rule对象里
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		actions['circulationStaff'] = createLogicalCondition('circulationStaff', frm.findField('circulationStaff'+commonGlobal.idFlag).getValue(), "in", "number");
		actions['circulationDuty'] = createLogicalCondition('circulationDuty', frm.findField('circulationDuty'+commonGlobal.idFlag).getValue(), "in", "number");
		actions['circulationProject'] = createLogicalCondition('circulationProject', frm.findField('circulationProject'+commonGlobal.idFlag).getValue(), "in", "number");		
		custom.getCustomDataFromDispatchForm(actions,frm);
	},
	isValidateFormCustom : function(){
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(!custom.transactDispatchForm(frm)){
			return false;
		}
		return true;
	},
	buildRuleCustomSet : function(){
		
		var addNotifyRule = {};
		if(commonGlobal.idFlag=="INFO"){//添加派单规则时可同时添加通知规则
			addNotifyRule ={
				xtype : 'button',
				text : '同步添加通知规则',
				handler : function(){
					Ext.Msg.confirm("提示", "是否要先保存当前派单规则?", function(btns){
						if (btns == 'yes') {
							commonGlobal.ruleInfo.isCreateNotifyRule = true;//标识是否创建通知规则对象
							GlobalInfo.ruleCtrl.save();
						}
					});
				}
			};
		}
		//添加传阅人面板
		
		var circulation = new Ext.form.FieldSet({
	        width: 350,
	        anchor 	: '95%',
	        title: '传阅人选择',
	        collapsible: true,
	        autoHeight:true,
	        bodyStyle:'padding:5px 5px 0;',
	        defaults: {
	            anchor: '-20' // leave room for error icon
	        },
	        items :[
				{
				   	width		: 200,
				   	xtype		: 'selectDialog',
				   	name		: 'circulationStaff',
				    id			: 'circulationStaff'+commonGlobal.idFlag,
				    store		: new Ext.data.SimpleStore({
				    	fields	: ['value', 'descp']
				    	}),
				   	fieldLabel	: '工单人',
				    loadingText	: '正在加载...',
				    displayField: 'descp',
					mode		: 'local',
				    triggerAction: 'all',
				    editable	: false,
				    selectOnFocus: true,
				    forceSelection: true,
					style 		: marginCss
				},
				{
		           	width		: 200,
		           	xtype		: 'combo',
		           	name		: 'circulationDuty',
	                id			: 'circulationDuty'+commonGlobal.idFlag,
				    store		: dsDuty,
				   	fieldLabel	: '值班线',
				    loadingText	: '正在加载...',
				    displayField: 'TEXT',
					valueField	: 'VALUE',
					mode		: 'local',
				    triggerAction: 'all',
				    editable	: false,
				    selectOnFocus: true,
				    forceSelection: true,
					style 		: marginCss
				},
				new SelectTree({
		           	width		: 200,
				    xmlUrl		: alarmRuleUrl+'method=getProjectGroup&groupType=TEAM',
		           	name		: 'CIRCULATIOINPROJECT',
	                id			: 'circulationProject'+commonGlobal.idFlag,
				   	fieldLabel	: '专项小组',
				    editable	: false,
				    selectOnFocus: true,
				    forceSelection: true,
					style 		: marginCss
				})
	        ]
		});
		
		
		
		var dispatchRulePanel = new Ext.Panel({
			anchor 	: '95%',
			items	: [
				custom.buildDispatchPanel(),
				circulation,
				addNotifyRule
			]
		});
		return dispatchRulePanel;
	},
	createNotifyRule : function(){//保存完派单规则时回调创建通知规则个性化动作页
		commonGlobal.ruleInfo.isCreateNotifyRule = false;
		commonGlobal.ruleInfo.CLASS_NAME = ruleType[5];
		commonGlobal.ruleInfo.ruleType = 8;
		commonGlobal.ruleInfo.RULE_TITLE = "告警通知规则";
		commonGlobal.ruleInfo.ACTION = actionFlag[1];
		
		GlobalInfo.ruleCtrl = factoryCtrl.newRuleCtrl(commonGlobal.ruleInfo.CLASS_NAME);
		var customSetPanel = GlobalInfo.ruleCtrl.showCustom();
		GlobalInfo.ruleCtrl.tabPanelCtrl.addPanel(GlobalInfo.rulePanel,customSetPanel);
		GlobalInfo.rulePanel.hideTabStripItem(3);
		GlobalInfo.rulePanel.setActiveTab(2);
		if(Global.ruleCtrl.rule.actions.xml){
			GlobalInfo.ruleCtrl.tabPanelCtrl.setCustomDataToPanel(Global.ruleCtrl.rule.actions);
		}
	}
});
factorySetPanel.regObject(ruleType[4],DispatchRuleSetPanel);

//获取通知规则设置项
var NotifyRuleSetPanel = function(){
    this.notifyStartTime="";
    this.notifyEndTime="";
}
Ext.extend(NotifyRuleSetPanel, TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		//固定人员、值班线、专项小组
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		custom.setCustomDataToDispatchForm(actions,frm);
		
		//超时长、超次数、超频率
		custom.setCustomDataToUpgradeForm(actions,frm);
		
		if(actions){
			var notifyModes = actions.getAttribute('notifyMode');
			//notifyModes = 'sms,voice';
			var o = {};
			var notifyMode = notifyModes.split(',');
			for (var i = 0; i < notifyMode.length; i++) {
				o[notifyMode[i]] = true;
				frm.findField('notifyMode'+commonGlobal.idFlag).setValue(o);
			}
		}
		//通知接收时间
		if(actions){
			this.notifyStartTime = actions.getAttribute('notifyStartTime');
			this.notifyEndTime = actions.getAttribute('notifyEndTime');
			if(this.notifyStartTime){
				frm.findField('startHH'+commonGlobal.idFlag).setValue(this.notifyStartTime.split(':')[0]);
				frm.findField('startMI'+commonGlobal.idFlag).setValue(this.notifyStartTime.split(':')[1]);
			}
			if(this.notifyEndTime){
				frm.findField('endHH'+commonGlobal.idFlag).setValue(this.notifyEndTime.split(':')[0]);
				frm.findField('endMI'+commonGlobal.idFlag).setValue(this.notifyEndTime.split(':')[1]);
			}
		}
		//是否补发通知
		if(actions){
			o['isResend'] = actions.getAttribute('isResend') == 1 ? true : false;
			frm.findField('isResend'+commonGlobal.idFlag).setValue(o);
		}
	},
	getCustomDataFromPanel : function(actions){
		//从界面上获取数据存放到rule对象里
		//固定人员、值班线、专项小组
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		custom.getCustomDataFromDispatchForm(actions,frm);
		
		//超时长、超次数、超频率
		custom.getCustomDataFromUpgradeForm(actions,frm);
		
		//通知方式
		var notifyMode = frm.findField('notifyMode'+commonGlobal.idFlag).getValue();
		var notifyModes = "";
		for (var i = 0; i < notifyMode.length; i++) {
			notifyModes = notifyModes + notifyMode[i].name+",";
		}
		
		actions['notifyMode'] = createLogicalCondition('notifyMode', notifyModes.substring(0,notifyModes.length-1), "=", "string");
		//通知接收时间
		actions['notifyStartTime'] = createLogicalCondition('notifyStartTime', this.notifyStartTime, "=", "string");
		actions['notifyEndTime'] = createLogicalCondition('notifyEndTime', this.notifyEndTime, "=", "string");
		//是否补发通知
		var vIsResend = frm.findField('isResend'+commonGlobal.idFlag).getValue().length > 0 ? 1 : 0;
		actions['isResend'] = createLogicalCondition('isResend', vIsResend, "=", "number");
	},
	isValidateFormCustom : function(){
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(!custom.transactDispatchForm(frm)){
			return false;
		}
		if(!custom.transactUpgradeForm("notify", frm)){
			return false;
		}
		
		//通知方式判断
		var notifyMode = frm.findField('notifyMode'+commonGlobal.idFlag).getValue();
		if(notifyMode.length==0){
			Ext.Msg.alert('系统提示', '对不起，通知方式必须选择一种方式!');
			return false;
		}
		
		//通知接收时间判断
		var startHH = frm.findField('startHH'+commonGlobal.idFlag).getValue();
		var startMI  = frm.findField('startMI'+commonGlobal.idFlag).getValue();
		var endHH = frm.findField('endHH'+commonGlobal.idFlag).getValue();
		var endMI = frm.findField('endMI'+commonGlobal.idFlag).getValue();
		if(!checkTime(startHH, "您输入通知接收开始时间\"时\"",23))
			return false;
		if(!checkTime(endHH, "您输入通知接收结束时间\"时\"",24))
			return false;
		if(endHH==24){
			if(endMI>0){
	    		Ext.Msg.alert('提示',"通知接收结束时间不能超过24时00分！");
				return false;
			}
		}
		if(!checkTime(startMI, "您输入通知接收开始时间\"分\"",59))
			return false;
		if(!checkTime(endMI, "您输入通知接收结束时间\"分\"",59))
			return false;
			
		this.notifyStartTime = composeTime(startHH,startMI,'');
		this.notifyEndTime = composeTime(endHH,endMI,'');
	    if(!isTime(this.notifyStartTime, this.notifyEndTime)){;
			return false;
	    }
	    //是否补发通知
		var isResend = frm.findField('isResend'+commonGlobal.idFlag).getValue();
		if(isResend.length > 0){
			if(!startHH && !startMI){
				Ext.Msg.alert('系统提示', '请正确输入补发通知接收时间!');
				return false;
			}
			if(!endHH && !endMI){
				Ext.Msg.alert('系统提示', '请正确输入补发通知接收时间!');
				return false;
			}
		}
	    return true;
	},
	buildRuleCustomSet : function(){
		//获取codelist中通知方式配置信息	
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.open("POST","../../servlet/commonservlet?tag=3&code_type=ITSM_ALARMNOTIFYRULE_MODE",false);
		xmlhttp.send();
		var nodeList = xmlhttp.responseXML.selectNodes("/root/rowSet");
		var items = [],modeWidth=0;
		for (var i = 0; i < nodeList.length; i++) {
			var TEXT = nodeList[i].selectSingleNode("TEXT").text
			var VALUE = nodeList[i].selectSingleNode("VALUE").text;
			modeWidth += 75;
			items.push({
	        	boxLabel: TEXT,
	        	name	: VALUE,
	        	id		: VALUE+commonGlobal.idFlag
	        });
		}
		
		var repeatRulePanel = new Ext.Panel({
			anchor 	: '95%',
			items	: [{
				layout	:'column',
	            items	:[{
	               	height	: 30,
	               	width	: 90,
					xtype	: 'label',
					text	: '通知方式:',
					style 	: 'margin:2,0,0,0'
	            },{
	            	width	: modeWidth,
	            	id      : 'notifyMode'+commonGlobal.idFlag,
	            	xtype	: 'checkboxgroup',
	            	items   : items
	            }
	            ]
			}]
		});
		
		
		//补发通知
		var reissueNotifyPanel = new Ext.Panel({
			anchor 	: '100%',
			items	: [{
				layout	:'column',
				items	: [{
	               	height	: 30,
	                width	: 90,
	                items	: [{ xtype : 'label', text : '通知接收时间:' }]
				},{
	                width	: 40,
	                items	: [{
						xtype		: 'textfield',
						id			: 'startHH'+commonGlobal.idFlag,
						regexText 	: '不是有效正整数',
						regex 		: /^\d+$/,
						maxLength 	: 2,
						maxLengthText : '时间长度不能超过两位数',
						style 		: marginCss
					}]
				},{
	                width	: 20,
	                items	: [{ xtype : 'label', text : '时' }]
				},{
	                width	: 40,
	                items	: [{
						xtype		: 'textfield',
						id			: 'startMI'+commonGlobal.idFlag,
						regexText 	: '不是有效正整数',
						regex 		: /^\d+$/,
						maxLength 	: 2,
						maxLengthText : '时间长度不能超过两位数',
						style 		: marginCss
					}]
				},{
	                width	: 30,
	                items	: [{ xtype : 'label', text : '分 --' }]
				},{
	                width	: 40,
	                items	: [{
						xtype		: 'textfield',
						id			: 'endHH'+commonGlobal.idFlag,
						regexText 	: '不是有效正整数',
						regex 		: /^\d+$/,
						maxLength 	: 2,
						maxLengthText : '时间长度不能超过两位数',
						style 		: marginCss
					}]
				},{
	                width	: 20,
	                items	: [{ xtype : 'label', text : '时' }]
				},{
	                width	: 40,
	                items	: [{
						xtype		: 'textfield',
						id			: 'endMI'+commonGlobal.idFlag,
						regexText 	: '不是有效正整数',
						regex 		: /^\d+$/,
						maxLength 	: 2,
						maxLengthText : '时间长度不能超过两位数',
						style 		: marginCss
					}]
				},{
	                width	: 40,
	                items	: [{ xtype : 'label', text : '分' }]
				},{
	                width	: 80,
	                items	: [{
		               	width	: 300,
			    		id		: 'isResend'+commonGlobal.idFlag,
					    xtype	: 'checkboxgroup',
					    items	: [{
							boxLabel	: '补发通知',
							name		: 'isResend'
				        }]
	                }]
				}]
			}]
		});
		var dispatchPanel = custom.buildDispatchPanel();
		dispatchPanel.title = "通知人选择";
		dispatchPanel.items.items[0].fieldLabel = "固定人员";
		var notifyRulePanel = new Ext.Panel({
			anchor 	: '95%',
			items	: [
				dispatchPanel,
				custom.buildUpgradePanel("重新发送通知"),
				repeatRulePanel,
				reissueNotifyPanel
			]
		});
		return notifyRulePanel;
	}
})
factorySetPanel.regObject(ruleType[5],NotifyRuleSetPanel);

//获取传送规则设置项
var SendRuleSetPanel = Ext.extend(TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(actions)
			frm.findField('targetOs'+commonGlobal.idFlag).setValue(actions.getAttribute('targetOs'));
		if(actions)
			frm.findField('targetUser'+commonGlobal.idFlag).setValue(actions.getAttribute('targetUser'));
		if(actions)
			frm.findField('againLevel'+commonGlobal.idFlag).setValue(actions.getAttribute('againLevel'));
		if(actions)
			frm.findField('againType'+commonGlobal.idFlag).setValue(actions.getAttribute('againType'));
	},
	getCustomDataFromPanel : function(actions){
		//从界面上获取数据存放到rule对象里
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		actions['targetOs'] = createLogicalCondition('targetOs', frm.findField('targetOs'+commonGlobal.idFlag).getValue(), "=", "number");
		actions['targetUser'] = createLogicalCondition('targetUser', frm.findField('targetUser'+commonGlobal.idFlag).getValue(), "=", "string");
		actions['againLevel'] = createLogicalCondition('againLevel', frm.findField('againLevel'+commonGlobal.idFlag).getValue(), "=", "number");
		actions['againType'] = createLogicalCondition('againType', frm.findField('againType'+commonGlobal.idFlag).getValue(), "=", "number");
	},
	isValidateFormCustom : function(){
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		//通知方式判断
		var targetOs = frm.findField('targetOs'+commonGlobal.idFlag).getValue();
		if(targetOs.length==0){
			Ext.Msg.alert('系统提示', '对不起，目标系统必须选择一种!');
			return false;
		}
	    return true;
	},
	buildRuleCustomSet : function(){
		var notifyRulePanel = new Ext.Panel({
		anchor 	: '95%',
		items	: [{
            layout		: 'form',
            items		: [{
				height		: 30,
	           	width		: 200,
	           	xtype		: 'combo',
                id			: 'targetOs'+commonGlobal.idFlag,
			    store		: dsTargetOs,
			   	fieldLabel	: '目标系统',
			    loadingText	: '正在加载...',
			    displayField: 'TEXT',
				valueField	: 'VALUE',
				mode		: 'local',
			    triggerAction: 'all',
			    editable	: false,
			    selectOnFocus: true,
			    forceSelection: true,
				style 		: marginCss
			},{
				width		: 200,
				xtype		: 'textfield',
				fieldLabel	: '目标用户',
				id			: 'targetUser'+commonGlobal.idFlag,
				maxLength 	: 200,
				maxLengthText : '目标用户长度最大不能超过200',
				style 		: marginCss
			},{
	            width		: 200,
	            xtype		: 'combo',
	            id			: 'againLevel'+commonGlobal.idFlag,
			    store		: dsAlarmLevel,
			   	fieldLabel	: '重定义级别',
			    loadingText	: '正在加载...',
			    displayField: 'TEXT',
				valueField	: 'VALUE',
				mode		: 'local',
			    triggerAction: 'all',
			    editable	: false,
			    selectOnFocus: true,
			    forceSelection: true,
				style 		: marginCss
			},{
	            width		: 200,
	            xtype		: 'combo',
	            id			: 'againType'+commonGlobal.idFlag,
			    store		: dsTargetType,
			   	fieldLabel	: '重定义类型',
			    loadingText	: '正在加载...',
			    displayField: 'TEXT',
				valueField	: 'VALUE',
				mode		: 'local',
			    triggerAction: 'all',
			    editable	: false,
			    selectOnFocus: true,
			    forceSelection: true,
				style 		: marginCss
			}]
		}]
	});
	return notifyRulePanel;
	}
})
factorySetPanel.regObject(ruleType[6],SendRuleSetPanel);

//获取关联规则设置项
var RelevanceShieldRuleSetPanel = Ext.extend(TabPanelCtrl, {
	kpiId : Ext.emptyFn,
	variableName : Ext.emptyFn,
	initCustomDataToPanel : function(){
		if(commonGlobal.ruleInfo.ACTION == actionFlag[1]){
			dsGlobalVariableNameSqlForRele = "select VALUE, TEXT from (select '' VALUE ,'-无-' TEXT, 0 sort_id from dual union " +
	      		"select VARIABLE_NAME VALUE,VARIABLE_NAME TEXT,sort_id from RULE_GLOBAL_VARIABLE A where A.STATE='0SA' and" +
	      		" a.variable_name not in ("+ dsGlobalVariableNameTemp +")" +
				") order by sort_id";
		}else{
			dsGlobalVariableNameSqlForRele = "select VALUE, TEXT from (select '' VALUE ,'-无-' TEXT, 0 sort_id from dual union " +
	      		"select VARIABLE_NAME VALUE,VARIABLE_NAME TEXT,sort_id from RULE_GLOBAL_VARIABLE A where A.STATE='0SA' and" +
	      		" a.variable_name not in ("+ dsGlobalVariableNameTemp + " and b.rule_id<>"+ commonGlobal.ruleInfo.ruleId +")" +
				") order by sort_id";
		}
		dsGlobalVariableNameForRele.load({params : {"paramValue":getAESEncode(encodeURIComponent(dsGlobalVariableNameSqlForRele))}});
	},
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(actions){
			var kpiId = actions.getAttribute('kpiId');
			var variableName = actions.getAttribute('variableName');
			frm.findField('kpi_id').setValue(kpiId);
			frm.findField('global_variable'+commonGlobal.idFlag).setValue(variableName);
			this.kpiId = kpiId;
			this.variableName = variableName;
		}
		this.initCustomDataToPanel();
	},
	getCustomDataFromPanel : function(actions){
		//从界面上获取数据存放到rule对象里
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		var kpiId = frm.findField('kpi_id').value;
		var variableName = frm.findField('global_variable'+commonGlobal.idFlag).getValue();
		var value = kpiId+"|"+variableName;
		actions['relevanceShield'] = createLogicalCondition('relevanceShield', value, "=", "string");
		actions['kpiId'] = createLogicalCondition('kpiId', kpiId, "=", "string");
		actions['variableName'] = createLogicalCondition('variableName', variableName, "=", "string");
	},
	isValidateFormCustom : function(){
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		//kpi判断
		var kpiId = frm.findField('kpi_id').value;
		if(!kpiId){
			Ext.Msg.alert('系统提示', '对不起，KPI必须选择一个，且只能选择一个!');
			return false;
		}
		if(kpiId.split(",").length>1){
			Ext.Msg.alert('系统提示', '对不起，KPI只能选择一个!');
			return false;
		}
		//全局变量判断
		var variableName = frm.findField('global_variable'+commonGlobal.idFlag).getValue();
		if(variableName.length==0){
			Ext.Msg.alert('系统提示', '对不起，全局变量必须选择一个，且只能选择一个!');
			return false;
		}
	    return true;
	},
	buildRuleCustomSet : function(){
		var notifyRulePanel = new Ext.Panel({
		anchor 	: '95%',
		items	: [{
			anchor : '100%',
			layout : 'form',
			labelWidth : 60,
			items : [{
				anchor : '100%',
				layout 	: 'column',
			    items 	: [{
					width  : 350,
					layout : 'form',
					items : [{
		                width  		: 200,
		               	fieldLabel	: 'KPI',
		               	xtype		: 'selectDialog',
		               	name		: 'kpi_id',
		               	id			: 'kpi_id_rele_shield'+commonGlobal.idFlag,
					    store		: '',
					    loadingText	: '正在加载...',
					    displayField: 'TEXT',
					    valueField	: 'VALUE',
						mode		: 'local',
					    triggerAction: 'all',
					    selectOnFocus : true,
						style 		: marginCss
					}]
				}]
			},{
				anchor : '100%',
				layout 	: 'column',
				items : [{
					width  : 270,
					layout : 'form',
					items : [{
		                width  		: 200,
		               	fieldLabel	: '全局变量',
		               	xtype		: 'combo',
		               	id			: 'global_variable'+commonGlobal.idFlag,
					    store		: dsGlobalVariableNameForRele,
					    loadingText	: '正在加载...',
					    displayField: 'TEXT',
					    valueField	: 'VALUE',
						mode		: 'local',
					    triggerAction: 'all',
					    editable	: false,
					    selectOnFocus : true,
						style 		: marginCss
					}]
				},{
					xtype 	: 'button',
					text 	: '全局变量配置',
					width 	: 80,
					handler : function(){
						window.showModalDialog("alarmRuleVarConfig.html",null,"dialogWidth=900px;dialogHeight=550px;help=0;scroll=1;status=0;");
						dsGlobalVariableNameForRele.load({params : {"paramValue":getAESEncode(encodeURIComponent(dsGlobalVariableNameSqlForRele))}});
						dsGlobalVariableNameForWhere.load({params : {"paramValue":getAESEncode(encodeURIComponent(dsGlobalVariableNameSqlForWhere))}});
					}
				}]
			}]
		}]
	});
	return notifyRulePanel;
	}
})
factorySetPanel.regObject(ruleType[7],RelevanceShieldRuleSetPanel);


//性能超阀值点击弹框
var PrefThresholdRule = Ext.extend(TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		//加载规则个性化配置数据
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		if(actions){
			frm.findField('configItem'+commonGlobal.idFlag).setValue(actions.getAttribute('configItem'));
			frm.findField('configItem'+commonGlobal.idFlag).hiddenField.value = actions.getAttribute('configItem');
			frm.findField('propertyKPI'+commonGlobal.idFlag).setValue(actions.getAttribute('propertyKPI'));
			frm.findField('propertyKPIOld'+commonGlobal.idFlag).setValue(actions.getAttribute('propertyKPI'));
			var kpiobj = new Object();
			kpiobj.text = frm.findField('propertyKPI'+commonGlobal.idFlag).el.dom.value;
			kpiobj.value = actions.getAttribute('propertyKPI');
			GlobalTabPanel.KPI_LIST[0] = kpiobj;			
			var radioObj = document.getElementsByName("computeType" +commonGlobal.idFlag);
			var isUp = actions.getAttribute('thresholdSet');
			for(var i = 0; i < radioObj.length; i++){
				radioObj[i].checked = false;
				 if(radioObj[i].value == isUp) {      
				 	radioObj[i].checked = true;
				 }
			}
			var overNum = actions.getAttribute('overNum');
			if(overNum && overNum!='0' && overNum!='null'){
				commonGlobal.isMore = false;
				frm.findField('overNum'+commonGlobal.idFlag).setValue(overNum);
				Ext.getCmp('overNumPanel'+commonGlobal.idFlag).show();
				Ext.getCmp('morePanel'+commonGlobal.idFlag).hide();	
			}else{
				commonGlobal.isMore = true;
				frm.findField('timespan'+commonGlobal.idFlag).setValue(actions.getAttribute('timespan'));
				frm.findField('lowRatio'+commonGlobal.idFlag).setValue(actions.getAttribute('lowRatio')*100);
				Ext.getCmp('overNumPanel'+commonGlobal.idFlag).hide();
				Ext.getCmp('morePanel'+commonGlobal.idFlag).show();	
			}	
			changeType();//显示对应的DIV
			var thresholdSet = actions.getAttribute("thresholdSet");
			var obj1,obj2,obj3,obj4,obj5,obj6,obj7,obj8,obj9,obj10,obj11,obj12;//存放控件DIV中的文本框对象
			if(thresholdSet == '1'){
				//清空所有DIV的值和图
				clearVal("threshold"+commonGlobal.idFlag);
				//在正比DIV添加对应值
				obj1 = document.getElementById('serious_1'+commonGlobal.idFlag);
				obj1.value = actions.getAttribute('seriousValue');
				obj2 = document.getElementById('important_1'+commonGlobal.idFlag);
				obj2.value = actions.getAttribute('importantValue');
				obj3 = document.getElementById('normal_1'+commonGlobal.idFlag);
				obj3.value = actions.getAttribute('normalValue');
				
			}else if(thresholdSet == '2'){
				clearVal("threshold"+commonGlobal.idFlag);
				obj1 = document.getElementById('serious_2'+commonGlobal.idFlag);
				obj1.value = actions.getAttribute('seriousValue');
				obj2 = document.getElementById('important_2'+commonGlobal.idFlag);
				obj2.value = actions.getAttribute('importantValue');
				obj3 = document.getElementById('normal_2'+commonGlobal.idFlag);
				obj3.value = actions.getAttribute('normalValue');
			}else if(thresholdSet == '3'){
				clearVal("threshold"+commonGlobal.idFlag);
				obj1 = document.getElementById('serious_3'+commonGlobal.idFlag);
				obj1.value = actions.getAttribute('seriousValue1');
				obj2 = document.getElementById('important_3'+commonGlobal.idFlag);
				obj2.value = actions.getAttribute('importantValue1');
				obj3 = document.getElementById('normal_3'+commonGlobal.idFlag);
				obj3.value = actions.getAttribute('normalValue1');
				obj4 = document.getElementById('serious_4'+commonGlobal.idFlag);
				obj4.value = actions.getAttribute('seriousValue2');
				obj5 = document.getElementById('important_4'+commonGlobal.idFlag);
				obj5.value = actions.getAttribute('importantValue2');
				obj6 = document.getElementById('normal_4'+commonGlobal.idFlag);
				obj6.value = actions.getAttribute('noramlValue2');
			}
			blurFun(obj1);
			blurFun(obj2);
			blurFun(obj3);
			if(thresholdSet == '3'){
				blurFun(obj4);
				blurFun(obj5);
				blurFun(obj6);
			}
	        if(typeof(kpiobj.value) != "undefined" && kpiobj.value!=''){
            var neId = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm().findField('NE_ID').getValue();
            displayAgentList(kpiobj.value, neId);              
		    }
		}
	},
	saveAfter : function() {
	   var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
	   var neId = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm().findField('NE_ID').getValue();
	   var kpiId = frm.findField('propertyKPI').getValue();
	   displayAgentList(kpiId, neId);
	},
	getCustomDataFromPanel : function(actions){
		//从界面上获取数据存放到rule对象里
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
	    if ((trim(frm.findField('configItem'+commonGlobal.idFlag).value)).toUpperCase() == 'NULL') {
		   frm.findField('configItem'+commonGlobal.idFlag).setValue("");
	    }
		actions['configItem'] = createLogicalCondition('configItem', frm.findField('configItem'+commonGlobal.idFlag).value, "=", "string");
		actions['propertyKPI'] = createLogicalCondition('propertyKPI', frm.findField('propertyKPI'+commonGlobal.idFlag).value, "=", "string");
		actions['timespan'] = createLogicalCondition('timespan', frm.findField('timespan'+commonGlobal.idFlag).getValue(), "=", "number");
		actions['lowRatio'] = createLogicalCondition('lowRatio', frm.findField('lowRatio'+commonGlobal.idFlag).getValue(), "=", "number");
      actions['propertyKPIOld'] = createLogicalCondition('propertyKPIOld', frm.findField('propertyKPIOld'+commonGlobal.idFlag).value, "=", "string");

		if(!Ext.getCmp('agent'+commonGlobal.idFlag).hidden) {
		   actions['agentid'] = createLogicalCondition('agentid', frm.findField('agentid'+commonGlobal.idFlag).getValue(), "=", "number");
		   actions['sampleIntervalNum'] = createLogicalCondition('sampleIntervalNum', frm.findField('sampleIntervalNum'+commonGlobal.idFlag).getValue(), "=", "number");
		   actions['sampleIntervalUnit'] = createLogicalCondition('sampleIntervalUnit', frm.findField('sampleIntervalUnit'+commonGlobal.idFlag).getValue(), "=", "number");
		}		
		if(commonGlobal.isMore){
			actions['overNum'] = createLogicalCondition('overNum', '0', "=", "number");
		}else{
			actions['overNum'] = createLogicalCondition('overNum', frm.findField('overNum'+commonGlobal.idFlag).getValue(), "=", "number");
		}
		var radioObj = document.getElementsByName("computeType"+commonGlobal.idFlag);
		var isUp;
		for(var i = 0; i < radioObj.length; i++){
			if(radioObj[i].checked){
				isUp = radioObj[i].value;
			}
		}
		actions['isLevelUp'] = createLogicalCondition('isLevelUp', isUp, "=", "string");
		if(isUp == '1'){
			actions['serious_1'] = createLogicalCondition('serious_1', document.getElementById("serious_1"+commonGlobal.idFlag).value, "=", "number");
			actions['important_1'] = createLogicalCondition('important_1', document.getElementById("important_1"+commonGlobal.idFlag).value, "=", "number");
			actions['normal_1'] = createLogicalCondition('normal_1', document.getElementById("normal_1"+commonGlobal.idFlag).value, "=", "number");
		} 
		 else if(isUp == '2'){
			actions['serious_2'] = createLogicalCondition('serious_2', document.getElementById("serious_2"+commonGlobal.idFlag).value, "=", "number");
			actions['important_2'] = createLogicalCondition('important_2', document.getElementById("important_2"+commonGlobal.idFlag).value, "=", "number");
			actions['normal_2'] = createLogicalCondition('normal_2', document.getElementById("normal_2"+commonGlobal.idFlag).value, "=", "number");
		} else if(isUp == '3'){
			actions['serious_3'] = createLogicalCondition('serious_3', document.getElementById("serious_3"+commonGlobal.idFlag).value, "=", "number");
			actions['important_3'] = createLogicalCondition('important_3', document.getElementById("important_3"+commonGlobal.idFlag).value, "=", "number");
			actions['normal_3'] = createLogicalCondition('normal_3', document.getElementById("normal_3"+commonGlobal.idFlag).value, "=", "number");
			actions['serious_4'] = createLogicalCondition('serious_4', document.getElementById("serious_4"+commonGlobal.idFlag).value, "=", "number");
			actions['important_4'] = createLogicalCondition('important_4', document.getElementById("important_4"+commonGlobal.idFlag).value, "=", "number");
			actions['normal_4'] = createLogicalCondition('normal_4', document.getElementById("normal_4"+commonGlobal.idFlag).value, "=", "number");
		}
	},
	isValidateFormCustom : function(){
		var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		var timespan = frm.findField('timespan'+commonGlobal.idFlag).getValue();
		if(timespan.length==0 && commonGlobal.isMore){
			Ext.Msg.alert('系统提示', '监控时长不能为空!');
			return false;
		}
		var lowRatio = frm.findField('lowRatio'+commonGlobal.idFlag).getValue();
		if(lowRatio.length==0 && commonGlobal.isMore){
			Ext.Msg.alert('系统提示', '超阀值占比不能为空!');
			return false;
		}
		var overNum = frm.findField('overNum'+commonGlobal.idFlag).getValue();
		if(overNum.length==0 && !commonGlobal.isMore){
			Ext.Msg.alert('系统提示', '连续超阀值次数不能为空!');
			return false;
		}
		if(frm.findField('propertyKPI'+commonGlobal.idFlag).value==''){
			Ext.Msg.alert('系统提示', '性能KPI不能为空!');
			return false;
		}
		if(!Ext.getCmp('agent'+commonGlobal.idFlag).hidden) {
		   if(frm.findField('agentid'+commonGlobal.idFlag).getValue()==''){
			  Ext.Msg.alert('系统提示', '性能采集代理不能为空!');
			  return false;
		   }
		   if(frm.findField('sampleIntervalNum'+commonGlobal.idFlag).getValue()=='' || frm.findField('sampleIntervalUnit'+commonGlobal.idFlag).getValue()=='') {
			  Ext.Msg.alert('系统提示', '性能采集周期不能为空!');
			  return false;
		   }
		}
		var agentStore = Ext.getCmp('agentCmb'+commonGlobal.idFlag).getStore();	
		var agentValue = frm.findField('agentid'+commonGlobal.idFlag).getValue();
		if(agentStore.find("NE_ID",agentValue)==-1){
			Ext.Msg.alert('系统提示', '请录入或选择正确的性能采集代理!');
			return false;
		}		
		if(!Ext.getCmp('agent'+commonGlobal.idFlag).hidden) {
			var timeLens = [1, 60, 60*60, 60*60*24, 60*60*24*31];
			var intervalNum = frm.findField('sampleIntervalNum'+commonGlobal.idFlag).getValue();
			var timeUnit = frm.findField('sampleIntervalUnit'+commonGlobal.idFlag).getValue();
			if(commonGlobal.isMore){
				if(timespan < intervalNum*timeLens[timeUnit-1]) {
					  Ext.Msg.alert('系统提示', '监控时长必须大于性能采集周期!');
					  return false;				
				}
			}else{
				//没有进行高级配置时 监控时长 = 采集周期*连续超阀值次数/100%
				frm.findField('lowRatio'+commonGlobal.idFlag).setValue(100);
				frm.findField('timespan'+commonGlobal.idFlag).setValue(intervalNum*timeLens[timeUnit-1]*overNum);				
			}
		}
		var ruleId = commonGlobal.ruleInfo.ruleId;
		var neId = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm().findField('NE_ID').getValue();
	    var configItemVal = frm.findField('configItem'+commonGlobal.idFlag).value;
	    var propertyKPIVal = frm.findField('propertyKPI'+commonGlobal.idFlag).value;
 	    var submitURL = '../../servlet/ruleServlet?tag=38&kpi=' + propertyKPIVal+'&neId=' + neId + '&configItem=' + configItemVal + '&ruleId=' + ruleId;
	    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    xmlhttp.Open("POST", submitURL, false);
		xmlhttp.send();
		var row = xmlhttp.responseXML.selectSingleNode("/root/Msg/Result");
		
		
		var computeType = document.getElementsByName('computeType'+commonGlobal.idFlag);
		var thresholdSet=1;
		var flag = true;
		if( computeType[0].checked )thresholdSet = 1;
		else if( computeType[1].checked )thresholdSet = 2;
		else if( computeType[2].checked )thresholdSet = 3;	
			var obj1,obj2,obj3,obj4,obj5,obj6,obj7,obj8,obj9,obj10,obj11,obj12;//存放控件DIV中的文本框对象
			if(thresholdSet == '1'){
				obj1 = document.getElementById('serious_1'+commonGlobal.idFlag);
				obj2 = document.getElementById('important_1'+commonGlobal.idFlag);
				obj3 = document.getElementById('normal_1'+commonGlobal.idFlag);
			}else if(thresholdSet == '2'){
				obj1 = document.getElementById('serious_2'+commonGlobal.idFlag);
				obj2 = document.getElementById('important_2'+commonGlobal.idFlag);
				obj3 = document.getElementById('normal_2'+commonGlobal.idFlag);
			}else if(thresholdSet == '3'){
				obj1 = document.getElementById('serious_3'+commonGlobal.idFlag);
				obj2 = document.getElementById('important_3'+commonGlobal.idFlag);
				obj3 = document.getElementById('normal_3'+commonGlobal.idFlag);
				obj4 = document.getElementById('serious_4'+commonGlobal.idFlag);
				obj5 = document.getElementById('important_4'+commonGlobal.idFlag);
				obj6 = document.getElementById('normal_4'+commonGlobal.idFlag);
			}
			
			flag = checkNull(obj1) && checkNull(obj2) && checkNull(obj3);
			if(thresholdSet == '3'){
				flag = flag && checkNull(obj4) && checkNull(obj5) && checkNull(obj6);
			}
		  if(!flag)return false;
		
		
		
		if(row.text == "TRUE"){
		    return confirm('已存在相同KPI配置的性能超阀值规则,确定是否保存?');
		}else {		
	        return true;
	    }
	},
	buildRuleCustomSet : function(){
		commonGlobal.isMore = false;
		var prefThresholdPanel = new Ext.Panel({
		anchor 	: '95%',
		items	: [{
          layout		: 'form',
          labelWidth  : 120,
          items		: [{
				xtype		: 'hidden',
				value       : '1',
				name		: 'propertyKPIOld'+commonGlobal.idFlag            
          },{
				width		: 500,
				xtype		: 'selectDialog',
				fieldLabel	: '性能KPI',
				name		: 'propertyKPI',
				hiddenName	: 'propertyKPI',
				id			: 'propertyKPI'+commonGlobal.idFlag,
				maxLength 	: 200,
				maxLengthText : '性能KPI长度最大不能超过200',
				style 		: marginCss
			},{
				width		: 500,
				xtype		: 'selectDialog',
				fieldLabel	: '配置项',
				name		: 'configItem',
				hiddenName	: 'configItem',
				id			: 'configItem'+commonGlobal.idFlag,
				maxLength 	: 400,
				maxLengthText : '配置项长度最大不能超过400',
				style 		: marginCss
			},{
				id			: 'agent'+commonGlobal.idFlag,
				layout      : 'form',
				hidden      : false,
				items       : [{
				    width		: 500,
					fieldLabel	: '性能采集代理',
					xtype		: 'combo',
					id          : 'agentCmb'+commonGlobal.idFlag,
					hiddenName  : 'agentid'+commonGlobal.idFlag,
				    store		: dsAgentList,
					loadingText	: '正在加载...',
					displayField: 'NE_NAME',
					valueField	: 'NE_ID',
					mode		: 'local',
					triggerAction: 'all',
					typeAhead   : true,
					//typeAheadDelay:100,
					disabled    : false,//true,
					//editable	: false,
					//selectOnFocus : true,
					minChars    :  1,
					style 		: marginCss,
					listeners  :{
					   "beforequery":function(e){
					         var combo = e.combo;  
							 var value = e.query;  
							 if(!e.forceAll){  
					             combo.store.filterBy(function(record,id){  
					                 if(record.data.NE_IP.indexOf(value)==0 || record.data.NE_NAME.indexOf(value)==0){
					                    return true;
					                 }else{
					                	return false;
					                 }
					            });  
							 }
				            combo.expand();
				            return false;
						}
					}
				}]
			}, 
			{
			    width       : 780,
				id		    : 'sampleInterval'+commonGlobal.idFlag,
				hidden      : false,
				layout      : 'column',
				items 	    : [{
								layout : 'form',
								items : [{
						               	xtype		: 'textfield',
						               	width       : 400,
						               	fieldLabel	: '采集周期',
						               	id          : 'sampleIntervalNum'+commonGlobal.idFlag,
										regexText   : '不是有效的整数格式',
										regex       : /^\d+$/,
									    allowBlank  : false,
									    value       : 60,
									    //disabled    : true,
										blankText   : '采集周期不能为空!',										
										maxLength   : 3,
										maxLengthText : '长度不能超过三位数'
								}]}, {
								style 		: 'margin:-26,0,0,540',
								items : [{
								        width       : 88,
                                      xtype		: 'combo',
                                      id          : 'sampleIntervalUnitCmb'+commonGlobal.idFlag,
						               	hiddenName  : 'sampleIntervalUnit'+commonGlobal.idFlag,
									    store		: dsTimeunit,
									    loadingText	: '正在加载...',
									    displayField: 'TEXT',
									    valueField	: 'VALUE',
										mode		: 'local',
										value       : 1,
									    triggerAction: 'all',
									    //disabled    : true,
									    editable	: false,
									    selectOnFocus : true
								}]}]
			  },
			  {
				    width       : 780,
				    id		    : 'overNumPanel'+commonGlobal.idFlag,
				    hidden      : false,
				    layout      : 'column',
				    items       : [{
				    	layout : 'form',
						items : [{
							width		: 400,
							xtype		: 'textfield',							
							fieldLabel	: '连续超阀值次数',
							id			: 'overNum'+commonGlobal.idFlag,
							regexText 	: '不是有效正整数',
							regex 		: /^\d+$/,							
							maxLength 	: 8,
							maxLengthText : '超阀值次数不能超过八位',
							style 		: marginCss
						}]
				    },
				    {
						style 		: 'margin:-26,0,0,540',
						items : [{
								width       : 88,
								xtype       : 'checkbox',								
								boxLabel    : '高级配置',
								inputValue  : 1,
								listeners   :{
									'check':function(me, checked){
										if(checked){
											Ext.getCmp('overNumPanel'+commonGlobal.idFlag).hide();
											Ext.getCmp('morePanel'+commonGlobal.idFlag).show();	
											me.setValue(false);
											commonGlobal.isMore = true;
										}
									}
								}
						}]}				    
				    ]
			  },
			{
			    width       : 780,
			    id		    : 'morePanel'+commonGlobal.idFlag,
			    hidden      : true,
			    layout      : 'column',
			    items       : [{
			    	layout : 'form',
					items : [
			         {
			        	 width		: 500,
							xtype		: 'numberfield',
							fieldLabel	: '超阀值占比(%)',
							id			: 'lowRatio'+commonGlobal.idFlag,
							minValue	: 0,
							value       : 100,
							minText 	: '超阀值占比值范围从0-100',
			        		maxValue	: 100,
			        		maxText 	: '超阀值占比值范围从0-100',
							maxLength 	: 3,
							maxLengthText : '超阀值占比值范围从0-100',
							allowDecimals:false,
							style 		: marginCss
			         },        
					 {
						width		: 400,
						xtype		: 'numberfield',
						fieldLabel	: '监控时长(秒)',
						id			: 'timespan'+commonGlobal.idFlag,
						allowDecimals:false,
						style 		: marginCss
					}]
			    },
			    {
					style 		: 'margin:-26,0,0,540',
					items : [{
							width       : 88,
							xtype       : 'checkbox',								
							boxLabel    : '高级配置',
							inputValue  : 1,
							checked     : true,
							listeners   :{
								'check':function(me, checked){
									if(!checked){
										Ext.getCmp('overNumPanel'+commonGlobal.idFlag).show();
										Ext.getCmp('morePanel'+commonGlobal.idFlag).hide();
										me.setValue(true);
										commonGlobal.isMore = false;
									}
								}
							}
					}]}
			    	/*,{
						layout	: 'column',
						items 	: [{
							 xtype  : 'label',
							 width  : 600,
							 text  : '"注":进行高级配置则连续超阀值次数将由系统自动计算(监控时长/采集周期*超阀值占比),次数向上取整',
							 style  : 'color:red'
						}]							 
					 }
					 */
			    ]
		  },
			
			
			{
				html : '<table>' 
			+'<tr>'
				+'<td>阀值设置:</td>'
				+'<td style="padding-left: 95px"><lable><input type="radio" checked="ture" value="1" name="computeType' +commonGlobal.idFlag+ '" onclick="changeType();" />正比</lable></td>'
				+'<td><lable><input type="radio" value="2" name="computeType' +commonGlobal.idFlag+ '" onclick="changeType();" />反比</lable></td>'
				+'<td><lable><input type="radio" value="3" name="computeType' +commonGlobal.idFlag+ '" onclick="changeType();" />区间</lable></td>'
			+'</tr>'
		+'</table>'	
		+'<!-- 正比 -->'
		+'<div id="divGraph1' +commonGlobal.idFlag+ '" style="display: ">'
			+'<div id="arrowId_1' +commonGlobal.idFlag+ '" style="background: url(\'../../resource/image/arrow_up.jpg\') no-repeat;height: 246px;width: 400px;float: left" >'
			+'<div id="wrapId_1' +commonGlobal.idFlag+ '" style="height: 185px;width: 52px;position: absolute;left:28px;top: 60px">'
				+'<div class="colorClass" id="color1_1' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: red;margin:0px">&nbsp;</div>'
				+'<div class="colorClass" id="color2_1' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: #EF7E00;margin-top: -1px;">&nbsp;</div>'
				+'<div class="colorClass" id="color3_1' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: yellow;margin:0px;margin-top:-1px">&nbsp;</div>'			
			+'</div>'
			+'<div class="colorClass" id="color4_1' +commonGlobal.idFlag+ '" style="top:229px;left:28px;height: 16px;width: 52px;font-size: 0px;line-height: 0px;background: green;margin-top: -1px;position: absolute;">&nbsp;</div>'
					
			+'<div id="textId_1' +commonGlobal.idFlag+ '" style="height: 150px;width: 150px;position: absolute;left: 200px;top: 100px;padding-left: 10px">'
				+'<table>'
					+'<tr><td align="center"><div style="background:red;height:5px;width:20px"></div></td><td>严重：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="serious_1' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
					+'<tr><td align="center"><div style="background:#EF7E00;height:5px;width:20px"></div></td><td>重要：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="important_1' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
					+'<tr><td align="center"><div style="background:yellow;height:5px;width:20px"></div></td><td>一般：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="normal_1' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
				+'</table>'
			+'</div>'
			+'</div>'
		+'</div>'
		+'<!-- 反比 -->'
		+'<div id="divGraph2' +commonGlobal.idFlag+ '" style="display: none">'
			+'<div id="arrowId_2' +commonGlobal.idFlag+ '" style="background: url(\'../../resource/image/arrow_down.jpg\') no-repeat;height: 246px;width: 400px;float: left" >'
			+'<div class="colorClass" id="color4_2' +commonGlobal.idFlag+ '" style="top:40px;left:28px;height: 16px;width: 52px;font-size: 0px;line-height: 0px;background: green;margin-top: -1px;position: absolute">&nbsp;</div>'		
			+'<div id="wrapId_2' +commonGlobal.idFlag+ '" style="height: 185px;width: 52px;position: absolute;left:28px;top: 60px">'
				+'<div class="colorClass" id="color3_2' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: yellow;margin:0px;margin-bottom:-1px">&nbsp;</div>'
				+'<div class="colorClass" id="color2_2' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: #EF7E00;margin-bottom: -1px;">&nbsp;</div>'
				+'<div class="colorClass" id="color1_2' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: red;margin:0px;margin-bottom:-1px">&nbsp;</div>'
			+'</div>'			
			+'<div id="textId_2' +commonGlobal.idFlag+ '" style="left: 200px;top: 75px;height: 150px;width: 150px;position: relative;padding-left: 10px">'
				+'<table>'
					+'<tr><td align="center"><div style="background:yellow;height:5px;width:20px"></div></td><td>一般：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="normal_2' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
					+'<tr><td align="center"><div style="background:#EF7E00;height:5px;width:20px"></div></td><td>重要：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="important_2' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
					+'<tr><td align="center"><div style="background:red;height:5px;width:20px"></div></td><td>严重：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="serious_2' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
				+'</table>'
			+'</div>'
			+'</div>'
		+'</div>'
		+'<!-- 区间 -->'
		+'<div id="divGraph3' +commonGlobal.idFlag+ '" style="display: none">'
			+'<div id="arrowId_3' +commonGlobal.idFlag+ '" style="background: url(\'../../resource/image/arrow_up_down.jpg\') no-repeat;height: 335px;width: 400px;float: left" >'
			+'<div class="colorClass" id="color4_up' +commonGlobal.idFlag+ '" style="height: 16px;width: 52px;font-size: 0px;line-height: 0px;background: green;position: absolute;float: left;">&nbsp;</div>'			
			+'<div id="wrapId_3' +commonGlobal.idFlag+ '" style="height: 185px;width: 52px;position: absolute;">'
				+'<div class="colorClass" id="color1_3' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: red;margin:0px;margin-top:-1">&nbsp;</div>'
				+'<div class="colorClass" id="color2_3' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: #EF7E00;margin-top: -1px;">&nbsp;</div>'
				+'<div class="colorClass" id="color3_3' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: yellow;margin:0px;margin-top:-1px">&nbsp;</div>'				
			+'</div>'
			+'<div id="wrapId_4' +commonGlobal.idFlag+ '" style="height: 185px;width: 52px;position: absolute;">'
				+'<div class="colorClass" id="color3_4' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: yellow;margin:0px">&nbsp;</div>'
				+'<div class="colorClass" id="color2_4' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: #EF7E00;margin-top: -1px;">&nbsp;</div>'
				+'<div class="colorClass" id="color1_4' +commonGlobal.idFlag+ '" style="height: 0px;font-size: 0px;line-height: 0px;background: red;margin:0px;margin-top:-1">&nbsp;</div>'							
			+'</div>'
			+'<div class="colorClass" id="color4_down' +commonGlobal.idFlag+ '" style="height: 16px;width: 52px;font-size: 0px;line-height: 0px;background: green;position: absolute;float: left;">&nbsp;</div>'					
			+'<div id="textId_3' +commonGlobal.idFlag+ '" style="height: 150px;width: 150px;position: relative;padding-left: 10px;left:200px;top:40px">'
				+'<table>'
					+'<tr><td align="center"><div style="background:red;height:5px;width:20px"></div></td><td>严重：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="serious_3' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
					+'<tr><td align="center"><div style="background:#EF7E00;height:5px;width:20px"></div></td><td>重要：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="important_3' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
					+'<tr><td align="center"><div style="background:yellow;height:5px;width:20px"></div></td><td>一般：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="normal_3' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
				+'</table>'
			+'</div>'				
			+'<div id="textId_4' +commonGlobal.idFlag+ '" style="height: 150px;width: 150px;position: relative;padding-left: 10px;left:200px;top:60px">'
				+'<table>'
					+'<tr><td align="center"><div style="background:yellow;height:5px;width:20px"></div></td><td>一般：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="normal_4' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
					+'<tr><td align="center"><div style="background:#EF7E00;height:5px;width:20px"></div></td><td>重要：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="important_4' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
					+'<tr><td align="center"><div style="background:red;height:5px;width:20px"></div></td><td>严重：</td><td><input name="threshold' +commonGlobal.idFlag+ '" class="textClass" type="text" id="serious_4' +commonGlobal.idFlag+ '" value="" style="width: 35px" onblur="blurFun(this);" /></td></tr>'
				+'</table>'
			+'</div>'
			+'</div>'			
		+'</div>'
			 }]
		   }]
	    });
	    return prefThresholdPanel;
	}
});
factorySetPanel.regObject(ruleType[8],PrefThresholdRule);

function setConfigItem(obj, hiddField){
	var dom = obj.el.dom;
	var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
	var neId = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm().findField('NE_ID').getValue();
	//var neId = frm.findField('NE_ID').neTypeId;
	if(dom.value==null || dom.value=="") hiddField.value="";
	var params = new Object();
	params.neConfigName = dom.value;
	params.neConfigId = hiddField.value;
	
	params.neId = neId;
	params.type = 'threshold';//配置项树上标识已被配置过的配置项，同时选定后提示重复
	//var returnValue=window.showModalDialog("/resource/js/Dialog/choiceNeId.html",params,"dialogWidth=530px;dialogHeight=493px;help=0;scroll=0;status=0;");
	var returnValue=window.showModalDialog("/resource/js/Dialog/choiceConfigNeId.html",params,"dialogWidth=730px;dialogHeight=580px;help=0;scroll=0;status=0;");
	if(returnValue!=null){
		frm.findField('configItem').setValue(returnValue.neConfigId);
		hiddField.value=returnValue.neConfigId;
		dom.value=returnValue.neConfigName;
	}
}

//性能KPI for 性能超阀值分页
function setPropertyKPI(if_appsys,ne_msg_type,obj,hiddField){
	var dom = obj.el.dom;
	var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
	var neId = Ext.getCmp('RULE_INFO_FORM'+commonGlobal.idFlag).getForm().findField('NE_ID').getValue();
	if(ne_msg_type==null){
  	ne_msg_type = "40";
  }
  if(if_appsys==null){
  	if_appsys = "";
  }
  var kpiselectobj = new KPISelectObj();
	kpiselectobj.ifGetKpiValue = true;
	kpiselectobj.if_appsys = if_appsys;
	kpiselectobj.ne_msg_type = ne_msg_type;
	
	var neidobj = new NeIdObj();
	try{
		if(neId && neId.indexOf(",")>0) {
			neidobj.value = (neId.split(","))[0];
		} else {
			neidobj.value = neId;
		}
	}catch(e){
		neidobj.value = "-1";
		neidobj.text  = "网元";
	}
	kpiselectobj.neidObj = neidobj;
	var kpiset = new Array();
	for(var i=0;i<GlobalTabPanel.KPI_LIST.length;i++){
		var kpiobj = new KpiObj();
		kpiobj.kpi_id = GlobalTabPanel.KPI_LIST[i].value;
		kpiobj.kpi_name = GlobalTabPanel.KPI_LIST[i].text;
		kpiobj.kpi_value = GlobalTabPanel.KPI_LIST[i].kpi_value;
		kpiobj.key = GlobalTabPanel.KPI_LIST[i].key;
		kpiset.push(kpiobj);
	}
	kpiselectobj.kpiSet = kpiset;
	
	var params = new Array();
  params.push(window);
	params.push(if_appsys);
	params.push(ne_msg_type);
	params.push(kpiselectobj);
  var returnObj = window.showModalDialog("../alarm/KPISelect.html",params,"resizable=yes;dialogWidth=600px;dialogHeight=550px;help=0;scroll=1;status=0;");
	if(returnObj!=null){
	  var frm = Ext.getCmp('RULE_CUSTOM_FORM' + commonGlobal.idFlag).getForm();
	  var kpi_name = returnObj.name;
    var kpi_id = returnObj.value;
    var kpi_value = returnObj.kpi_value;
    var keys = returnObj.key;
    GlobalTabPanel.KPI_LIST = [];
    if(kpi_id!="" && kpi_id !=null){
        var valuearr = kpi_value.split(",");
        var textarr = kpi_name.split(",");
        var idarr = kpi_id.split(",");
        var keyarr = keys.split(",");
		  if(idarr.length > 1){
            kpi_name = textarr[0];
            kpi_id = idarr[0];
            kpi_value = valuearr[0];
            keys = keyarr[0];
            //Ext.Msg.alert('系统提示','对不起,只能选择一项性能KPI.');
		  }
    }
    var kpiobj = new Object();
    if(typeof(idarr) != "undefined"){
    	kpiobj.value = idarr[0];
    	kpiobj.text = textarr[0];
    	kpiobj.kpi_value = valuearr[0];
    	kpiobj.key = keyarr[0];
    	GlobalTabPanel.KPI_LIST[0] = kpiobj;
    }
    
//	  frm.findField('propertyKPI').setValue(kpi_id);
    obj.setValue(kpi_id);
	  hiddField.value =  kpi_value;
	  //性能KPI不为空时，判断是否已配置采集任务
	  if(typeof(kpiobj.value) != "undefined"){
	     displayAgentList(kpiobj.value, neId);
	  }
  }
}

function clearVal(objName){
		var obj = document.getElementsByName(objName);
		var colorNum = 3;	//	颜色数3：红 橙 黄
		var colorType = 4;	//颜色类型：正比，反比，区间正比，区间反比
		for(var i = 1;i<=colorNum;i++){	
			for(var j = 1;j<=colorType;j++){
				var colorObj = document.getElementById("color" + i + "_" + j + commonGlobal.idFlag);
				colorObj.style.height = 0;
			}
		}
		for(var i = 0; i < obj.length;i++){
			var clearObj = obj[i];
			clearObj.value = "";
			blurFun(clearObj);
		}
}

function displayAgentList(kpi, neId) {
	  var submitURL = '../../servlet/ruleServlet?tag=37&kpi=' + kpi +'&neId=' + neId;
	  var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	  xmlhttp.Open("POST", submitURL, false);
	  xmlhttp.send();
	  var task_config_id = xmlhttp.responseXML.selectSingleNode("//TASK_CONFIG").text;
	  Ext.getCmp('agent'+commonGlobal.idFlag).show();
	  Ext.getCmp('agentCmb'+commonGlobal.idFlag).enable();
	  //Ext.getCmp('sampleInterval'+commonGlobal.idFlag).show();//周期先隐藏
	  Ext.getCmp('sampleIntervalNum'+commonGlobal.idFlag).enable();
	  Ext.getCmp('sampleIntervalUnitCmb'+commonGlobal.idFlag).enable();
	  if(task_config_id && task_config_id!='-1') {
		   var frm = Ext.getCmp('RULE_CUSTOM_FORM'+commonGlobal.idFlag).getForm();
		   frm.findField('agentid'+commonGlobal.idFlag).setValue(xmlhttp.responseXML.selectSingleNode("//AGENT_ID").text);
		   frm.findField('sampleIntervalNum'+commonGlobal.idFlag).setValue(xmlhttp.responseXML.selectSingleNode("//SAMPLING_INTERVAL_NUM").text);
		   frm.findField('sampleIntervalUnit'+commonGlobal.idFlag).setValue(xmlhttp.responseXML.selectSingleNode("//TIME_UNIT").text);
	  }
}

//验证是否全为空
function checkNull(obj) {
	if ((trim(obj.value)).toUpperCase() == 'NULL') {
		obj.value = "";
	}
	computeType = document.getElementsByName("computeType"
			+ commonGlobal.idFlag);
	var str = obj.value;
	if (trim(str) == "") {
		str = "0";
	}
	var checkRes = false;
	if (isNumber(str, obj)) {
		if (computeType[0].checked) {// 正比
			checkRes = checkNullLogic(obj,0);
		} else if (computeType[1].checked) {// 反比
			checkRes = checkNullLogic(obj,1);
		} else if (computeType[2].checked) {// 区间
			checkRes = sectionCheckNullLogic(obj);
		}
		return checkRes;
	}
	return false;
}
function checkNullLogic(obj,num){
	var flag = false;
	var arr = [[3,1],[4,2]];
	if (obj.id.indexOf("_"+arr[num][0]) > -1) {// 区间
		flag = true;
		var val_1 = trim(document.getElementById("serious_"+arr[num][0]
				+ commonGlobal.idFlag).value);
		var val_2 = trim(document.getElementById("important_"+arr[num][0]
				+ commonGlobal.idFlag).value);
		var val_3 = trim(document.getElementById("normal_"+arr[num][0]
				+ commonGlobal.idFlag).value);

		var color1IntVal = getIntVal(val_1);
		var color2IntVal = getIntVal(val_2);
		var color3IntVal = getIntVal(val_3);

	} else {
		var val_1 = trim(document.getElementById("serious_"+arr[num][1]
				+ commonGlobal.idFlag).value);
		var val_2 = trim(document.getElementById("important_"+arr[num][1]
				+ commonGlobal.idFlag).value);
		var val_3 = trim(document.getElementById("normal_"+arr[num][1]
				+ commonGlobal.idFlag).value);

		var color1IntVal = getIntVal(val_1);
		var color2IntVal = getIntVal(val_2);
		var color3IntVal = getIntVal(val_3);
	}
	val_1 = isNaN(val_1)?"":val_1;
	val_2 = isNaN(val_2)?"":val_2;
	val_3 = isNaN(val_3)?"":val_3;
	if( val_1=="" && val_2=="" && val_3=="" ){
		if(flag){
			Ext.Msg.show({
			   title:'系统提示',
			   msg: '请最少填写一对区间阀值',
			   buttons: Ext.MessageBox.OK,
			   icon: Ext.MessageBox.ERROR
			});
		}else{
			Ext.Msg.show({
			   title:'系统提示',
			   msg: '请最少填写一项阀值',
			   buttons: Ext.MessageBox.OK,
			   icon: Ext.MessageBox.ERROR
			});
		}
		return false;	
	}
	return true;
}
function sectionCheckNullLogic(obj) {
	var checkRes = false;
	if (obj.id.indexOf("_3") > -1) {// 区间中的正比
		checkRes = checkNullLogic(obj,0);
		// 1.25 edit
		if (checkRes) {
			checkSectionMax(obj, 1);
		}
	} else {
		checkRes = checkNullLogic(obj,1);
		if (checkRes) {
			checkSectionMax(obj, 2);
		}
	}

	return checkRes;
}

//告警规则需过滤的字段
function filterRule(ruleXml){
	ruleXml = filterXml(ruleXml,"<RULE_NAME>","</RULE_NAME>");
	ruleXml = filterXml(ruleXml,"<REMARK>","</REMARK>");
	ruleXml = filterXml(ruleXml,"titlePattern='","' applyTo=");//标题格式过滤
	return ruleXml;
}

//解析xml时过滤其中的特殊符号
function filterXml(str,beginStr,endStr){
	if(str.indexOf(beginStr)!=-1){
		var beginNum = str.indexOf(beginStr)+beginStr.length;
		var endNum = str.indexOf(endStr);
		var filterStr = str.substring(beginNum,endNum);	
		filterStr = filter(filterStr);
		return str.substring(0,beginNum)+filterStr+str.substring(endNum);
	}else{
		return str;
	}
}
//过滤函数
function filter(str,flag){
	if(str=="" || str==undefined || str==null)return str;
	if(flag){
		str = str.replace(/&amp;/g,"&");
		str = str.replace(/&gt;/g,">");
		str = str.replace(/&lt;/g,"<");
		str = str.replace(/&quot;/g,'"');
		str = str.replace(/&apos;/g,"'");
	}else{
		str = str.replace(/&/g,"&amp;");
		str = str.replace(/>/g,"&gt;");
		str = str.replace(/</g,"&lt;");
		str = str.replace(/"/g,"&quot;");
		str = str.replace(/'/g,"&apos;");
	}
	return str;
}




//告警影响事件传递规则
function replaceAll( str, sptr, sptr1 ){
	if(!str)return;
	while (str.indexOf(sptr) >= 0){
	   str = str.replace(sptr, sptr1);
	}
	return str?str:'';
}
var alarmTriggerRule = Ext.extend(TabPanelCtrl, {
	setCustomDataToPanel : function(actions){
		// 加载规则个性化配置数据
		if(actions){			 		 			
			 Ext.getCmp('execContent'+commonGlobal.idFlag).setValue(replaceAll(actions.getAttribute('action'),"&#039","'"));
		}
	},
	getCustomDataFromPanel : function(actions){				
		actions['action'] = createLogicalCondition('action',Ext.getCmp('execContent'+commonGlobal.idFlag).getValue(),'=','number');		
		//actions['execScriptId'] = createLogicalCondition('execScriptId',filter(Ext.getCmp('execScriptId'+commonGlobal.idFlag).value),'=','string');
	},
	isValidateFormCustom : function(){
		var form = Ext.getCmp('WHERE_SET_FORM' + commonGlobal.idFlag).getForm();
		var kpi = form.findField("kpi_id").value;	
		var execContent = Ext.getCmp('execContent'+commonGlobal.idFlag).getValue();		
		if(kpi==null || kpi==""){
			Ext.Msg.alert("系统提示","请选择条件设置的KPI!");
			return false;
		}
		if(execContent==null || execContent==""){
			Ext.Msg.alert("系统提示","请录入执行脚本!");
			return false;
		}
		return true;
	},
	buildRuleCustomSet : function(){			
		var customPanel = new Ext.Panel({
			anchor 	: '95%',
			items	: [{
						layout : 'form',
						items : [{
							xtype : 'tbtext',
							text  : '执行脚本'
						},{
							hideLabel : true,
							xtype : 'textarea',							
							id : 'execContent'+commonGlobal.idFlag,
							width : 600,
							height: 300
						}]
					
			}]
		});
		return customPanel;
	}
});
factorySetPanel.regObject(ruleType[10],alarmTriggerRule);
