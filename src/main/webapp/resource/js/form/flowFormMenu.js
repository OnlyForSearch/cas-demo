var _UrlParam = getURLSearch(true);
var isSuperControl = false
if (_UrlParam.action) {
	var _Action = _UrlParam.action;
	isSuperControl = (_Action == 'superControl') ? true : false;
}

if ("undefined" != typeof(ItmLang) && ItmLang.flow) {
	flowFormMenuLang = ItmLang.flow;
} else {
	flowFormMenuLang = {
		invain_form_element : "无效的表单元素",// flowFormMenu.js引用
		tache_name : "环节名称", // flowFormMenu.js引用
		curr_tache : "当前环节",
		receive_success : "接收成功",
		tache_cc : "环节传阅",
		submitting_wait : "正在提交中,请稍候",
		submit_succ : "提交成功",
		please_input_review : "请填写{0}的审阅意见！",
		review_size_exceed_4000 : "{0}的审阅意见不能超过4000个字节！",
		send_staff : "发送人",
		transaction_staff : "办理人",
		after_reading : "阅毕",
		call_method_err : "调用{0}方法出错",
		task_submit_succ : "任务提交成功",
		opt_fail : "操作失败",
		get_back_succ : "取回成功",
		get_back_fail : "取回失败",
		del_flow_confirm : "删除流程会使流程中正在处理的事务无法继续进行，是否确认删除该流程？",
		cancel_flow_confirm : "删除流程会使流程中正在处理的事务无法继续进行，是否确认删除该流程？",
		del_succ : "删除成功",
		flow_exist_data : "该单子存在子单数据，无法删除！",
		find_next_tch : "找不到后续环节不能继续流转！",
		turn_up_tache : "流转到上面{0}个环节",
		turn_more_tache : "流转到更多环节",
		not_found_tache : "找不到对应的环节",
		submit_info_confirm : "确认要提交信息？",
		if_need : "是否要{0}？", // "是否要"+oService.context.getEndTaskTitle()+"？",
		signature_type : "会签方式",
		parallel : "并行",
		serial : "串行",
		window : "窗口",
		background_err_code : "后台程序出现异常![错误代码:{0}]",
		xml_doc_err : "xml文档格式错误!",
		processing_confirm_close : "系统正在处理中，关闭或刷新窗口可能导致提交失败，确定要关闭窗口吗？",
		go_forward : "前进",
		go_back : "退回",
		be_completed : "竣工",
		turn_over : "转交",
		tch_process : "环节处理cn",
		please_input_opinion : "请填写您的意见!",
		opinion_size_exceed_4000 : "意见不能超过4000个字节!",
		please_select_next_tch : "请选择下一环节!",
		attach_uploading_wait : "有{0}个附件正在上传中，请稍候!",
		please_select_tch_staff : "请选择\"{0}\"环节的执行人!",
		not_found_next_tch : "找不到下一环节！",
		sms : '短信',
		email : '邮件',
		admin_set_tch_send_notify : "管理员已设定此环节发{0}给执行人,无法在执行时更改",
		send_notify_to_staff : "发送{0}给执行人",
		not_send_notify_to_staff : "不发送{0}给执行人",
		common_opinion_size_exceed_250 : "常用意见不能超过250个字节！",
		flow_cancel_succ : "流程撤销成功！",
		flow_cancel_fail : "流程撤销失败！",
		add_focus_succ : "添加关注成功！",
		cancel_attention_succ : "取消关注成功!",
		rele_succ : "释放成功!",
		sms_and_email : "短信及邮件",
		curr_staff_inconformity_hurry : "当前办理人不符合催办条件，不能发送催办！",
		if_send_hurry : "是否要向{0}发送{1}催办？",
		hurry_succ : "催办成功",
		hurry_fail : "催办失败",
		ajax_call_fail : "异步调用失败！",
		sla_date : "截止时间",
		prev_tache_name : "上一环节",
		aduit_option_fill : "您还未填写审阅意见",
		is_show_message_aduit : "是否要一起处理其他相关的阅办?",
		recommended_common_user : '推荐常用人',
		search_page_num : "第 {0}/{1} 页",
		search_help_info : "输入员工姓名、登入名、电话、邮箱、地区、组织进行查询，中间用空格隔开，如：张三 北京",
		select_other_user : "选择其他人员"
	};
}

var oStatusXML = null;
var oURLXMLDoc = null;
function doFlowOnLayer() // 适用于表单元素在层上面填写。
{
	flow.Service.dispatch({
				type : flow.constant.operType.directFlow,
				actionType : flow.constant.actionType.all,
				eleOnLayer : true
			});
}

function doForward() {
	flow.Service.dispatch({
				type : flow.constant.operType.directFlow,
				actionType : flow.constant.actionType.all
			});
}

function doBack() {
	flow.Service.dispatch({
				type : flow.constant.operType.directFlow,
				actionType : flow.constant.actionType.back
			});
}
function doEnd() {
	flow.Service.dispatch({
				type : flow.constant.operType.directFlow,
				actionType : flow.constant.actionType.end
			});
}
function doTransfer() {
	flow.Service.dispatch({
				type : flow.constant.operType.directFlow,
				actionType : flow.constant.actionType.transfer
			});
}

function isTchEnd() {
	return (formContext.FLOW.TCH_STATUS == 'F' || formContext.FLOW.FLOW_STATUS == 'F');
}

function isFlowBegin() {
	return (formContext.FLOW.TCH_ID == "0" || formContext.FLOW.TCH_ID == "-1");
}

function isFlowInit() {
	return (formContext.FLOW.TCH_ID == "0");
}

function isTacheActive() {
	return (formContext.FLOW.TCH_STATUS == 'A')
}

function getCurTchText() {
	var sFormName = formContext.getFormName();
	if (formContext.getWin().form.getDynamicFormName) {
		sFormName = formContext.getWin().form.getDynamicFormName();
	}
	var sTchName = formContext.FLOW.TCH_NAME;
	var slaDate = formContext.FLOW.SLA_DATE;
	var tchHtml = '<span style="color:#125899;font-weight:bold;font-size:18px;height:100%;padding-top:2px">' + sFormName + '</span>' + '<span style="color:#8e969d;font-weight:bold;font-size:12px;height:100%;padding-top:0px">' + flowFormMenuLang.curr_tache + ':' + sTchName;
	if (slaDate)
		tchHtml += '<span style="color:red;font-weight:bold;">(' + flowFormMenuLang.sla_date + '：' + slaDate + ')</span>';
	tchHtml += '<span>';
	return tchHtml;
}
// 上下模式流程名称模块取值 add by tangft 2014.12.3
function getCurTchTextWhite() {
	var sFormName = formContext.getFormName();
	if (formContext.getWin().form.getDynamicFormName) {
		sFormName = formContext.getWin().form.getDynamicFormName();
	}
	var sTchName = formContext.FLOW.TCH_NAME;
	var slaDate = formContext.FLOW.SLA_DATE;
	var tchHtml = '<span style="color:#ffffff;font-weight:bold;font-size:24px;height:100%;padding-top:10px">' + sFormName + '</span>' + '<span style="color:#ffffff;font-weight:bold;font-size:16px;height:100%;padding-top:10px">(' + flowFormMenuLang.curr_tache + ':' + sTchName + ")";
	if (slaDate)
		tchHtml += '<span style="color:red;font-weight:bold;">(' + flowFormMenuLang.sla_date + '：' + slaDate + ')</span>';
	tchHtml += '<span>';
	return tchHtml;
}

function isRemoteFlow() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", '../../servlet/FlowRemoteAction.do?method=getRemoteFlowMod&flowModel=' + formContext.FLOW.FLOW_MOD, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		var remoteFlowMod = oXMLHTTP.responseXML.selectSingleNode("/root/REMOTE_FLOW_MOD").text;
		if (remoteFlowMod != "-1")
			return false;
		else
			return true;
	} else
		return true;

}

function isReceiver() {
	var staffId = formContext.GLOBAL_VAR.STAFF_ID;
	var sTchReceiver = formContext.FLOW.TCH_RECEIVER;
	return staffId.isInArray(sTchReceiver.split(",")) || staffId == 123456;
}

function isEnableReceiveButton() {
	var isExcuting = (formContext.FLOW.TCH_EXECUTER != null && formContext.FLOW.TCH_EXECUTER != "");

	return (!isTchEnd() && !isExcuting && isReceiver());
}

function isEnableForword() {

	var staffId = formContext.GLOBAL_VAR.STAFF_ID;
	var sTchExcuter = formContext.FLOW.TCH_EXECUTER;
	var isNotExecuter = (sTchExcuter && !(staffId.isInArray(sTchExcuter.split(",")) || staffId == 123456));
	return (isTchEnd() || isView() || (!isReceiver() && !isFlowBegin()) || (!isFlowBegin() && isNotExecuter));
}

function isEnableSave() {

	var staffId = formContext.GLOBAL_VAR.STAFF_ID;
	var sTchExcuter = formContext.FLOW.TCH_EXECUTER;
	var isNotExecuter = (sTchExcuter && !(staffId.isInArray(sTchExcuter.split(",")) || staffId == 123456));
	return ((isTchEnd() && staffId != 123456) || isView() || (!isReceiver() && !isFlowBegin()) || (!isFlowBegin() && isNotExecuter));
}

function doReceive() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var iTchId = formContext.FLOW.TCH_ID;
	oXMLHTTP.open("POST", '../../servlet/flowOper?OperType=12&tchId=' + iTchId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		MMsg(flowFormMenuLang.receive_success + "!");
		toolbarMenuUtil.setReceiveDisabled(true).setCancelReceiveDisabled(false).setDoFlowDisabled(false);
	}
}

var toolbarMenuUtil = {
	setItemDisabled : function(name, disabled) {
		formContext.menuObject.setItemDisabledByName(name, disabled)
	},
	// 设置接收按钮状态
	setReceiveDisabled : function(disabled) {
		this.setItemDisabled('doReceiveBtn', disabled);
		return this;
	},
	// 释放按钮
	setCancelReceiveDisabled : function(disabled) {
		this.setItemDisabled('cancelReceiveBtn', disabled);
		return this;
	},
	// 处理按钮
	setDoFlowDisabled : function(disabled) {
		this.setItemDisabled('doFlowOnLayerBtn', disabled);
		return this;
	}
}

function candoApprove()// 阅办按钮置灰
{
	var iFlowId = formContext.FLOW.FLOW_ID;
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", '../../servlet/flowOper?OperType=9&flowId=' + iFlowId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		oXMLDoc = oXMLHTTP.responseXML;
		var oRowSet = oXMLDoc.selectNodes("//rowSet");
		var iLen = oRowSet.length;
		if (iLen == 0)
			return true;
		else
			return false;
	} else {
		return false;
	}
}

function doSaveFlowForm(noValidate, noCloseAfterSave) {
	if (formContext.save(noValidate)) {
		doCallback();
		if (noCloseAfterSave) {
			formContext.doAfterSave();
		} else {
			formContext.closeWin();
		}
	}

}
function isView() {
	return (formContext.request("type") == "view");
}

function isPool() {
	return formContext.FLOW.IS_POOL == '0BT';
}
function isSingleReceiver() {
	var sReceiver = formContext.FLOW.TCH_RECEIVER + "";
	return (sReceiver.indexOf(',') == -1);
}

function hasRefURL() {
	return (oURLXMLDoc.selectNodes("//rowSet").length != 0);
}

function getNextCntByAction(sAction) {
	if (!oStatusXML)
		loadTchStatus(formContext.FLOW.TCH_ID);
	var actionCnt = oStatusXML.selectSingleNode("/root/TACHE_STATUS/" + sAction + "").text;
	return actionCnt;
}

function loadTchStatus(iTchId) {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", '../../servlet/flowOper?OperType=4&tchId=' + iTchId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		oStatusXML = oXMLHTTP.responseXML;
	}
}

function getRefURLXML(iTchMod) {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", '../../servlet/flowOper?OperType=11&tchMod=' + iTchMod, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		oURLXMLDoc = oXMLHTTP.responseXML;
	}
}

function viewFlowProc() {
	var iTopFlowId = formContext.FLOW.TOP_FLOW_ID;
	var iFlowId = formContext.FLOW.FLOW_ID;
	var iTchId = formContext.FLOW.TCH_ID;
	var sFlow_name = encodeURIComponent(formContext.FLOW.FLOW_NAME);
	var sHref = "flowProc.jsp?topFlowId=" + iTopFlowId + "&flowId=" + iFlowId + "&tchId=" + iTchId;
	var sFeatures = new Array();
	sFeatures.push("width=" + (screen.availWidth - 20));
	sFeatures.push("height=" + (screen.availHeight - 20));
	sFeatures.push("location=" + 0);
	sFeatures.push("left=" + 0);
	sFeatures.push("top=" + 0);
	sFeatures.push("menubar=" + 0);
	sFeatures.push("resizable=" + 1);
	sFeatures.push("scrollbars=" + 1);
	sFeatures.push("status=" + 0);
	sFeatures.push("titlebar=" + 0);
	sFeatures.push("toolbar=" + 0);
	window.open(sHref, iTopFlowId + "", sFeatures.join(","));
}

function viewFlowModel() {
	var sHref = "../../FlowModShow?system_code=G&flow_mod=" + formContext.FLOW.FLOW_MOD;
	var sFeatures = new Array();
	sFeatures.push("width=" + 780);
	sFeatures.push("height=" + 580);
	sFeatures.push("location=" + 0);
	sFeatures.push("menubar=" + 0);
	sFeatures.push("resizable=" + 1);
	sFeatures.push("scrollbars=" + 1);
	sFeatures.push("status=" + 0);
	sFeatures.push("titlebar=" + 0);
	sFeatures.push("toolbar=" + 0);
	window.open(sHref, "flowMod", sFeatures.join(","));
}

function flowReview() {
	var sHref = "flowReview/flowReview.jsp?flow_id=" + formContext.FLOW.FLOW_ID + "&flow_mod=" + formContext.FLOW.FLOW_MOD;
	var sFeatures = new Array();
	sFeatures.push("width=" + 780);
	sFeatures.push("height=" + 580);
	sFeatures.push("location=" + 0);
	sFeatures.push("menubar=" + 0);
	sFeatures.push("resizable=" + 1);
	sFeatures.push("scrollbars=" + 1);
	sFeatures.push("status=" + 0);
	sFeatures.push("titlebar=" + 0);
	sFeatures.push("toolbar=" + 0);
	window.open(sHref, "review", sFeatures.join(","));
}

// 传阅意见新版 upd zhangye 2015-5-15
function doApprove(batchFlag) {
	var oFeatures, layer;
	openNtyLayer();
	function openNtyLayer() {
		var vWidth = document.body.clientWidth * 0.55;
		var vHeight = 300;
		oFeatures = {
			width : vWidth,
			height : vHeight
		};
		oFeatures.winId = "FL_NTY_WIN_NEW";
		oFeatures.title = flowFormMenuLang.tache_cc;
		oFeatures.html = {};
		oFeatures.html.body = oTemplate.XMLDocument.selectSingleNode("/root/notify_template_new").text;
		oFeatures.html.bottom = oTemplate.XMLDocument.selectSingleNode("/root/notify_bottom_template_new").text;
		layer = Layer.instances[oFeatures.winId];
		layer = (layer) ? layer.show() : Layer.open(oFeatures);
		var oMap = parseXML();
		var opinionMenuDoc = flow.Service.getOpinionMenuDoc();
		render(opinionMenuDoc, oMap.cur, oMap.prev);
		showOftenOp(opinionMenuDoc);
		layer.$("FL_EXT_NTY_RETURN_NEW").onclick = function() {
			layer.close()
		}
		layer.$("FL_EXT_NTY_SUBMIT_NEW").onclick = function() {
			saveOpinion(oMap,batchFlag)
		};

		layer.$("new_deal_option_but").onclick = function() {
			saveOftenOpinion()
		};
	}

	function saveOftenOpinion() {
		var oOpinionValue = layer.$("new_deal_option").value;
		if (oOpinionValue == "")
			return;

		setOftenOpinion(oOpinionValue);

		function reSetOftenOpinion() {
			var opinionMenuDoc = flow.Service.getOpinionMenuDoc();
			showOftenOp(opinionMenuDoc);
		}
		function setOftenOpinion(sOpinion) {
			if (sOpinion.Tlength() > 250) {
				Message.fail(flowFormMenuLang.common_opinion_size_exceed_250, layer.getDomEle());
				return;
			}
			var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
			var sendXML = '<?xml version="1.0" encoding="GBK"?>' + '<root><FLOW_MOD/><TCH_MOD/><OPINION_TYPE>STAFF</OPINION_TYPE>' + '<ADD><record OPINION_CONTENT="' + xmlEncode(sOpinion) + '" /></ADD>' + '<DEL/><EDIT/></root>';
			XMLDoc.loadXML(sendXML);
			var saveURL = "/servlet/FormTurnServlet?tag=17";
			formContext.App.ajaxRequest(saveURL, {
						async : true,
						xml : XMLDoc,
						onStateChange : function(oXMLHttp) {
							stateChange(oXMLHttp)
						}
					});
			function stateChange(oXMLHttp) {
				Message.xmlHttpLoading(oXMLHttp, {
							wait : flowFormMenuLang.submitting_wait + "......",
							succeed : flowFormMenuLang.submit_succ
						}, layer.getDomEle(), {
							onSucceed : function() {
								reSetOftenOpinion();
							}
						})
			}
		}
	}
	function saveOpinion(oMap,batchFlag) {
		var oLayer = Layer.instances["FL_NTY_WIN_NEW"].getDomEle();
		if(!batchFlag){
			if (!doCheck())
				return;
		}
		var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
		var sendXML = '<?xml version="1.0" encoding="GBK"?>' + '<root>';

		// 当前环节
		sendXML += '<NOTIFY>' + '<TCH_ID>' + formContext.FLOW.TCH_ID + "</TCH_ID>" + '<OPINION>' + xmlEncode(layer.$("new_deal_option").value) + "</OPINION>" + '</NOTIFY>';

		//父子流程环节
		var fsMap = getFatherAndSonPro();
		for(var i=0;i<fsMap.length;i++){
			sendXML += '<NOTIFY>' + '<TCH_ID>' + fsMap[i] + "</TCH_ID>" + '<OPINION>' + xmlEncode(layer.$("new_deal_option").value) + "</OPINION>" + '</NOTIFY>';
		}
		for (var key in oMap.prev) { // 其他阅办未处理的 不保存
			if (oMap.prev[key].tchId != formContext.FLOW.TCH_ID) {
				sendXML += '<NOTIFY>' + '<TCH_ID>' + oMap.prev[key].tchId + "</TCH_ID>" + '<OPINION>' + xmlEncode(layer.$("new_deal_option").value) + "</OPINION>" + '</NOTIFY>';
			}
		}

		sendXML += '</root>';
		XMLDoc.loadXML(sendXML);
		var saveURL = "";
		if(batchFlag){
			saveURL = "/servlet/flowOper?OperType=62";
		}else{
			saveURL = "/servlet/flowOper?OperType=10";
		}
		formContext.App.ajaxRequest(saveURL, {
					async : true,
					xml : XMLDoc,
					onStateChange : function(oXMLHttp) {
						stateChange(oXMLHttp)
					}
				});
		function stateChange(oXMLHttp) {
			Message.xmlHttpLoading(oXMLHttp, {
						wait : flowFormMenuLang.submitting_wait + "......",
						succeed : flowFormMenuLang.submit_succ
					}, oLayer, {
						onSucceed : function() {
							window.setTimeout(function() {
										formContext.closeWin();
										formContext.callback();
									}, 1000);
						},
						onClick : function() {
							formContext.closeWin();
							formContext.callback();
						}
					})
		}
		function doCheck() {
			var tempFlag = false;
			var oInput;

			var sOpinion = layer.$("new_deal_option").value;
			var sTchName = formContext.FLOW.TCH_NAME;
			if (sOpinion == "") {
				var langMsg = formatResource(flowFormMenuLang.please_input_review, sTchName);
				Message.fail(langMsg, oLayer);
				return false;
			}

			for (var key in oMap.prev) {
				if (oMap.prev[key].tchId != formContext.FLOW.TCH_ID) {
					oInput = layer.$(oMap.prev[key].tchId + "_option_input");
					sOpinion = oInput.value;
					sTchName = oMap.prev[key].tchName;
					oMap.prev[key].option = sOpinion;// 存入对象中
					if (sOpinion == "") {
						var langMsg = formatResource(flowFormMenuLang.please_input_review, sTchName);
						Message.fail(langMsg, oLayer);
						return false;
					}
					if (sOpinion.Tlength > 4000) {
						var langMsg = formatResource(flowFormMenuLang.review_size_exceed_4000, sTchName);
						Message.fail(langMsg, oLayer);
						return false;
					}
				}
			}
			// 提示是否一起处理其他相关阅办
			if (batchFlag) {
				if (window.confirm(flowFormMenuLang.is_show_message_aduit)) {
					oInput.focus();
					return false;
				}
			}
			return true;
		}
	}

	function parseXML() {
		var tchMap = {};
		var prevTchMap = {};
		var oXMLDoc = getNotifyTachesDoc();
		var oNodes = oXMLDoc.selectNodes("/root/rowSet");
		var iLen = oNodes.length;
		for (var i = 0; i < iLen; i++) {
			var oNode = oNodes[i];
			var sTchId = oNode.selectSingleNode("TCH_ID").text;
			var sTchName = oNode.selectSingleNode("TCH_NAME").text;
			var sStaffName = oNode.selectSingleNode("STAFF_NAME").text;
			var sPrevTchId = oNode.selectSingleNode("PREV_TCH_ID").text;
			var sPrevTchName = oNode.selectSingleNode("PREV_TCH_NAME").text;
			var sPrevStaffName = oNode.selectSingleNode("PREV_STAFF_NAME").text;
			tchMap[sTchId] = {
				tchId : sTchId,
				prevTchId : sPrevTchId
			};
			if (prevTchMap[sPrevTchId]) {
				prevTchMap[sPrevTchId].staffName = prevTchMap[sPrevTchId].staffName + "," + sStaffName;
			} else {
				prevTchMap[sPrevTchId] = {
					staffName : sStaffName,
					tchName : sTchName,
					tchId : sTchId,
					prevTchName : sPrevTchName,
					prevStaffName : sPrevStaffName,
					opinion : ""
				};
			}
		}
		return {
			cur : tchMap,
			prev : prevTchMap
		};
		function getNotifyTachesDoc() {
			return formContext.App.syncAjaxRequest('../../servlet/flowOper?OperType=9&flowId=' + formContext.FLOW.TOP_FLOW_ID);
		}
	}

	function render(opinionMenuDoc, tchMap, prevTchMap) {
		for (var key in tchMap) {
			var perTch = tchMap[key].prevTchId;
			createTacheName(prevTchMap[perTch], perTch);
		}

		// 创建其他阅办
		var tempPrev = "";
		for (var key in prevTchMap) {
			if (prevTchMap[key].tchId != formContext.FLOW.TCH_ID) {// 当前环节不显示在其他阅办
				tempPrev += createPrev(prevTchMap[key], prevTchMap[key].tchId);
			}
		}
		layer.$("prev_option_div").innerHTML = tempPrev;

		function createTacheName(oTch) {
			layer.$("new_cur_tache_name").innerHTML = oTch.tchName;
			layer.$("new_cur_tache_staff_name").innerHTML = oTch.staffName;
			layer.$("new_cur_tache_name_label").innerHTML = flowFormMenuLang.curr_tache;
			layer.$("new_cur_tache_staff_name_label").innerHTML = flowFormMenuLang.transaction_staff;

			layer.$("new_pront_tache_name").innerHTML = oTch.prevTchName;
			layer.$("new_pront_tache_staff_name").innerHTML = oTch.prevStaffName;
			layer.$("new_pront_tache_name_label").innerHTML = flowFormMenuLang.prev_tache_name;
			layer.$("new_pront_tache_staff_name_label").innerHTML = flowFormMenuLang.transaction_staff;
		}

		function createPrev(oTch, key) {
			var temp = '<div style="width: 100%; height: 70px; font-family: \'Microsoft YaHei\'; font-size: 14px; color: #666;float:left; line-height: 25px;">' + '	<div style="width: 100%;">' + '		<label style="width: 13px; height: 13px; float: left; margin: 5px 10px 0px 0px; background: url(/resource/image/flowRead/hostory-icon-no.png) no-repeat;"></label>' + '		<span style="float: left; width: 18px; height: 18px; cursor: pointer; margin: 1px 10px 0px 0px; background: url(/resource/image/flowRead/sq05.png) no-repeat;" ' + 'onclick="var objParent = this.parentElement; objParent.childNodes[2].childNodes[0].readOnly=false; objParent.childNodes[2].childNodes[0].value=\'\'; objParent.childNodes[2].childNodes[0].focus(); this.style.display = \'none\'; ">' + '</span>' + '		<span style="float: left; width:90%;">' + '			<input type="text" style="width: 100%; height: 25px; line-height: 25px; font-family: \'Microsoft YaHei\'; color: #666; border:0px; background-color:#F8F8F8" ' + ' value="'
					+ flowFormMenuLang.aduit_option_fill + '" readOnly=true;  onFocus="if(!this.readOnly && this.value ==\'' + flowFormMenuLang.aduit_option_fill + '\') this.value=\'\';" id="' + key + '_option_input">' + '		</span>	' + '	</div>' + '	<div style="clear:both;"></div>' + '	<div style="font-size: 12px; color: #999; margin-left: 23px; height :25px; line-height: 25px; overflow: hidden; white-space: noWrap; text-overflow: ellipsis;">' + '		<span>' + flowFormMenuLang.curr_tache + '：</span>' + '		<span style="color:#ff6500">' + oTch.tchName + '</span>' + '		<span style="color:#666">[' + flowFormMenuLang.transaction_staff + ':' + oTch.staffName + ']</span><br>' + '	</div>' + '	<div style="font-size: 12px; color: #999;  margin-left: 23px; height :25px; line-height: 25px; overflow: hidden; white-space: noWrap; text-overflow: ellipsis;">' + '		<span>' + flowFormMenuLang.prev_tache_name + '：</span>' + '		<span style="color:#ff6500">' + oTch.prevTchName + '</span>'
					+ '		<span style="color:#666">[' + flowFormMenuLang.transaction_staff + ':' + oTch.prevStaffName + ']</span><br>' + '	</div>' + '</div>';
			return temp;
		}
	}

	function showOftenOp(opinionMenuDoc) {
		var curPage = 1, pageSize = 3;
		showOftenOpinion(curPage, pageSize);

		layer.$("open_opinion_but_new").onclick = function() {
			var sHref = "flowOpinion.html"
			var sPara = 'dialogwidth:500px;dialogheight:420px;dialogLeft:200px;status:no;help:no;resizable:no;scroll=1';
			var oDialogWin = window.showModalDialog(sHref, formContext, sPara);

			showOftenOp(flow.Service.getOpinionMenuDoc());
		}

		// 上一页 下一页
		layer.$("pront_open_opinion_but").onclick = function() {
			if (curPage <= 1) {
				return;
			}
			curPage = curPage - 1;
			showOftenOpinion(curPage, pageSize);
		}

		layer.$("next_open_opinion_but").onclick = function() {
			var opinionRows = opinionMenuDoc.selectNodes("/root/rowSet");
			if (opinionRows != null) {
				var length = opinionRows.length;
				var maxPage = 0;
				if (length % pageSize == 0) {
					maxPage = length / pageSize;
				} else {
					maxPage = Math.ceil(length / pageSize);
				}

				if (curPage >= maxPage)
					return;

				curPage = curPage + 1;
				showOftenOpinion(curPage, pageSize);
			}
		}

		// 展示常用意见
		function showOftenOpinion(oCurPage, oPageSize) {
			var oAction = {
				onclick : function(obj) {
					layer.$('new_deal_option').value = obj.childNodes[1].innerHTML;

					var objParent = obj.parentElement;
					for (var i = 0; i < objParent.childNodes.length; i++) {
						objParent.childNodes[i].childNodes[0].style.background = "url(/resource/image/flowRead/radio.png) no-repeat";
						objParent.childNodes[i].childNodes[1].style.color = "#666";
					}
					obj.childNodes[0].style.background = "url(/resource/image/flowRead/radio-check.png) no-repeat";
				}
			}
			var oMouseOver = {
				onclick : function(obj) {
					obj.childNodes[1].style.color = "#008de4";
				}
			}
			var oMouseOut = {
				onclick : function(obj) {
					obj.childNodes[1].style.color = "#666";
				}
			}

			var temp = '    <label style="width: 12px; height: 12px; cursor: pointer; float: left; margin: 8px 10px 0px 0px; ; background: url(/resource/image/flowRead/radio.png) no-repeat;"></label>' + '	  <label style="width: 90%; font-size: 14px; color: #666; height: 30px; line-height: 30px; float: left; font-family :\'Microsoft YaHei\'; overflow: hidden; white-space: noWrap; text-overflow: ellipsis;">$TITLE</label>';

			layer.$('openOpinionNewDivId').innerHTML = "";
			var resultObj = tache.opinionMenu.setMenuListNew(opinionMenuDoc, temp, oCurPage, oPageSize, oAction, oMouseOver, oMouseOut);
			layer.$('openOpinionNewDivId').appendChild(resultObj);
		}
	}
}

function doRead(batchFlag) {
	var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	var sContent = flowFormMenuLang.after_reading;
	var sendXML = '<?xml version="1.0" encoding="GBK"?>' + '<root><NOTIFY>' + '<TCH_ID>' + formContext.FLOW.TCH_ID + '</TCH_ID>' + '<OPINION>' + sContent + '</OPINION>' + '</NOTIFY>' + '</root>';
	XMLDoc.loadXML(sendXML);
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var httUrl = "";
	if(batchFlag){
		httUrl = "../../servlet/flowOper?OperType=62";
	}else{
		httUrl = "../../servlet/flowOper?OperType=10";
	}
	oXMLHTTP.open("POST", httUrl, false);
	oXMLHTTP.send(XMLDoc);
	if (isSuccess(oXMLHTTP)) {
		formContext.callback();
		formContext.closeWin();
	}
}

function doBatchRead() {
	var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	var sContent = flowFormMenuLang.after_reading;
	var sendXML = '<?xml version="1.0" encoding="GBK"?>' + '<root><NOTIFY>' + '<TCH_ID>' + formContext.FLOW.TCH_ID + '</TCH_ID>' + '<OPINION>' + sContent + '</OPINION>' + '</NOTIFY>' + '</root>';
	XMLDoc.loadXML(sendXML);
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "../../servlet/flowOper?OperType=62", false);
	oXMLHTTP.send(XMLDoc);
	if (isSuccess(oXMLHTTP)) {
		formContext.callback();
		formContext.closeWin();
	}
}

function doSendMsg() {
	var sHref = "flowSendMsg.html"
	var sPara = 'dialogwidth:650px;dialogheight:380px;status:no;help:no;resizable:yes;scroll=1';
	var oDialogWin = window.showModalDialog(sHref, formContext, sPara);
}
// 添加汇报
function doReportMsg() {
	var sHref = "flowReportMsg.html"
	var sPara = 'dialogwidth:450px;dialogheight:360px;status:no;help:no;resizable:yes;scroll=1';
	var oDialogWin = window.showModalDialog(sHref, formContext, sPara);
}

function doOpinion() {
	var sHref = "flowOpinion.html"
	var sPara = 'dialogwidth:500px;dialogheight:420px;dialogLeft:200px;status:no;help:no;resizable:no;scroll=1';
	var oDialogWin = window.showModalDialog(sHref, formContext, sPara);
}

function doFavoriteForm() {
	var sName = formContext.getFormName();
	var sURL = "/workshop/form/index.jsp?flowId=" + formContext.FLOW.TOP_FLOW_ID;
	// showAddFavUrlWin(sName,sURL);
	showAddFavUrlWin(sName, sURL, formContext.FLOW.TOP_FLOW_ID, 1);
}

function doFavoriteFlow() {
	var sName = formContext.FLOW.FLOW_NAME;
	var sURL = "/FlowBrowse?flow_id=" + formContext.FLOW.TOP_FLOW_ID + "&system_code=G";
	// showAddFavUrlWin(sName,sURL);
	showAddFavUrlWin(sName, sURL, formContext.FLOW.TOP_FLOW_ID, 1);
}

function showRelationShip() {
	var sHref = "flowRelationship.html";
	var sFeatures = new Array();
	sFeatures.push("width=" + 1000);
	sFeatures.push("height=" + 680);
	sFeatures.push("location=" + 0);
	sFeatures.push("menubar=" + 0);
	sFeatures.push("resizable=" + 1);
	sFeatures.push("scrollbars=" + 1);
	sFeatures.push("status=" + 0);
	sFeatures.push("titlebar=" + 0);
	sFeatures.push("toolbar=" + 0);
	window.open(sHref, "flow", sFeatures.join(","));
}

function getURLMenus() {
	var sDynamicProc = "";
	var aURLName = [];
	var aURL = [];
	var oMenuNodes = oURLXMLDoc.selectNodes("//rowSet")
	var iMenuLen = oMenuNodes.length;
	for (var i = 0; i < iMenuLen; i++) {
		var oMenuNode = oMenuNodes[i];
		var sDynamicProc = oMenuNode.selectSingleNode("DYNAMIC_URL_PROC").text;
		if (sDynamicProc != "") {
			break;
		} else {
			aURLName[i] = oMenuNode.selectSingleNode("URL_NAME").text;
			aURL[i] = oMenuNode.selectSingleNode("URL").text;
		}
	}
	if (sDynamicProc != "") {
		aURLName = [];
		aURL = [];
		var aDynamicMenu = getDynamicMenus(sDynamicProc);
		aURLName = aDynamicMenu[0];
		aURL = aDynamicMenu[1];
	}
	return buildURLMenu(aURLName, aURL);
}

function buildURLMenu(aURLName, aURL) {
	var iLen = aURLName.length;
	var sItemXML = "";
	var itemXMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	itemXMLDoc.loadXML('<?xml version="1.0" encoding="GBK"?><root></root>');
	for (var i = 0; i < iLen; i++) {
		var oItemXML = itemXMLDoc.createElement("bar:item");
		oItemXML.setAttribute("label", aURLName[i]);
		oItemXML.setAttribute("onclick", "openURL('" + aURL[i] + "')");
		itemXMLDoc.documentElement.appendChild(oItemXML);
	}
	return itemXMLDoc.documentElement.childNodes;
}

function getDynamicMenus(sDynamicProc) {
	var aURLName = [];
	var aURL = [];
	var aReturn = [];
	var sDynamicProc = replaceVar(sDynamicProc, "");
	var iIndex = sDynamicProc.lastIndexOf(",");
	if (iIndex != -1)
		sDynamicProc = sDynamicProc.substr(0, iIndex) + ',?)';
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	var sendXML = '<?xml version="1.0" encoding="GBK"?>' + '<root><SQL_PROC></SQL_PROC></root>';
	XMLDoc.loadXML(sendXML);
	XMLDoc.selectSingleNode("/root/SQL_PROC").text = sDynamicProc;
	oXMLHTTP.open("POST", '../../servlet/util?OperType=7', false);
	oXMLHTTP.send(XMLDoc);
	if (isSuccess(oXMLHTTP)) {
		var oURLXMLDoc = oXMLHTTP.responseXML;
		var oMenuNodes = oURLXMLDoc.selectNodes("//rowSet")
		var iMenuLen = oMenuNodes.length;
		for (var i = 0; i < iMenuLen; i++) {
			var oMenuNode = oMenuNodes[i];
			aURLName[i] = oMenuNode.selectSingleNode("URL_NAME").text;
			aURL[i] = oMenuNode.selectSingleNode("URL").text;
		}
	}
	aReturn[0] = aURLName;
	aReturn[1] = aURL;
	return aReturn;
}

function openURL(sURL) {
	doWindow_open(replaceVar(sURL, encodeURIComponent));
}

function replaceVar(sURL, formatFunc) {
	try {
		var reg = /\${1}\w+\.{1}\w+(\.{1}\w+)?(\.{1}\w+)?/gi;
		var sReturnValue = sURL;
		var aVar = sURL.match(reg);
		if (aVar != null) {
			for (var i = 0; i < aVar.length; i++) {
				var sVarValue = "";
				var sVar = aVar[i].substr(1);
				var isGetValue = (sVar.lastIndexOf(".VALUE") == sVar.length - 6);
				if (isGetValue) {
					sVar = sVar + "()";
				}
				sVarValue = eval("formContext." + sVar);
				if (typeof(formatFunc) == "function") {
					sVarValue = formatFunc.call(null, sVarValue);
				}
				// sVarValue=encodeURIComponent(sVarValue);
				sReturnValue = (sReturnValue.replace(aVar[i], sVarValue));
			}
		}
	} catch (e) {
		EMsg(flowFormMenuLang.invain_form_element + "!")
	}
	return sReturnValue;
}

function doPrint() {
	formContext.doPrint();
}

function doPrintView() {
	window.open("printView.html");
}

function toWord(aPrintParam, callBack) {
	formContext.loadPrint("doc", formContext, oWordForm, aPrintParam, "T");
}

function toOutPdf(aPrintParam) {
	formContext.loadPrint("pdf", formContext, oWordForm, aPrintParam, 'T');
}

function doClose() {
	parent.window.close();
}

function doRefresh() {
	parent.document.execCommand("refresh");
}

function doCallFormMethod(callMethod) {
	var isCanOpen = true;
	try {
		isCanOpen = eval("parent.fraForm." + callMethod);
	} catch (e) {
		EMsg(formatResource(flowFormMenuLang.call_method_err, callMethod));
		isCanOpen = false;
	}
	return isCanOpen;
}

var flowTurn = function(flowMod, type, paramObj) {
	var param, callMethod, mainRequestId, model, TName, cTableName, mTableName;
	var sURL = "/workshop/form/index.jsp?turn=1";
	var maxWidth = screen.availWidth - 10;
	var maxHeight = screen.availHeight - 30;
	var oTable = formContext.TABLE;
	if (paramObj) {
		param = paramObj.param;
		callMethod = paramObj.callMethod;
		mainRequestId = paramObj.mainRequestId;
		model = paramObj.model;
		TName = paramObj.TName;
		cTableName = paramObj.cTableName;
	}
	init();
	function init() {
		mTableName = getMTableName();
	}

	function getMTableName() {
		var tableName;
		if (TName) {
			tableName = TName;
		} else {
			for (var c in oTable) {
				tableName = c;
			}
		}
		return tableName;
	}

	function getParam() {
		var sFeatures = new Array();
		var turnFlowMod = getTurnVal();
		if (turnFlowMod != "")
			sFeatures.push("&flowMod=" + turnFlowMod);
		else
			sFeatures.push("&flowMod=" + flowMod);
		sFeatures.push("&mainTacheMod=" + formContext.FLOW.TCH_MOD);
		sFeatures.push("&beforeFlowMod=" + formContext.FLOW.FLOW_MOD);
		sFeatures.push("&mainFlowId=" + formContext.FLOW.FLOW_ID);
		sFeatures.push("&mainTchId=" + formContext.FLOW.TCH_ID);
		sFeatures.push("&mainTableName=" + mTableName);
		sFeatures.push("&fieldType=" + type);
		if (model == 'showmodal') {
			sFeatures.push("&model=showmodal");
		}
		if (mainRequestId) {
			sFeatures.push("&mainRequestId=" + mainRequestId);
		} else {
			sFeatures.push("&mainRequestId=" + eval("oTable." + mTableName + ".REQUEST_ID.VALUE()"));
		}
		if (param) {
			sFeatures.push("&" + param);
		}
		return sFeatures.join("");
	}

	function getSendDoc() {
		var sendXML = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXML.createElement("root");
		var flowInfo = sendXML.createElement("FLOW");
		var flowIdObj = sendXML.createElement("FLOW_ID");
		flowIdObj.text = formContext.FLOW.FLOW_ID;
		var tableObj = sendXML.createElement("TABLE");
		var mainTable = sendXML.createElement("MAIN_TABLE");
		mainTable.text = mTableName;
		var childTable = sendXML.createElement("CHILD_TABLE");
		childTable.text = cTableName;
		flowInfo.appendChild(flowIdObj);
		tableObj.appendChild(mainTable);
		tableObj.appendChild(childTable);
		root.appendChild(tableObj);
		root.appendChild(flowInfo);
		sendXML.appendChild(root);
		return sendXML;
	}

	function getTurnVal() {
		var turnVal;
		var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.open("POST", "/servlet/FormTurnServlet?tag=48", false);
		oXMLHTTP.send(getSendDoc());
		if (isSuccess(oXMLHTTP)) {
			oXml = oXMLHTTP.responseXML;
			turnVal = oXml.selectSingleNode("root/TURN/FLOW_MOD").text;
		}
		return turnVal;
	}

	function doCallMethod() {
		var isCanOpen = true;
		if (callMethod) {
			isCanOpen = doCallFormMethod(callMethod);
		}
		return isCanOpen;
	}

	this.doTurn = function() {
		var isCanOpen = doCallMethod();
		if (isCanOpen) {
			if (model == 'showmodal') {
				window.showModalDialog(sURL + getParam(), window, 'dialogWidth=1100px;dialogHeight=600px;resizable=yes;');
			} else {
				doWindow_open(sURL + getParam(), maxWidth, maxHeight, "_blank");
			}
		}
	}
};

function doFlowTurn(flowMod, type, paramObj) {
	var flowTurnObj = new flowTurn(flowMod, type, paramObj);
	flowTurnObj.doTurn();
}

function doTurn(flowMod, type, param, callMethod, mainRequestId, model, TName, cTableName) {
	var paramObj = {};
	paramObj.param = param;
	paramObj.callMethod = callMethod;
	paramObj.mainRequestId = mainRequestId;
	paramObj.model = model;
	paramObj.TName = TName;
	paramObj.cTableName = cTableName;
	var flowTurnObj = new flowTurn(flowMod, type, paramObj);
	flowTurnObj.doTurn();
}

function doTurnMT(flowMod, type, param, callMethod, tableName, req_id) {
	var maxWidth = screen.availWidth - 10;
	var maxHeight = screen.availHeight - 30;
	var oTable = formContext.TABLE;
	var isCanOpen = true;

	var sURL = "/workshop/form/index.jsp?turn=1&mainTacheMod=" + formContext.FLOW.TCH_MOD + "&flowMod=" + flowMod + "&beforeFlowMod=" + formContext.FLOW.FLOW_MOD + "&mainTchId=" + formContext.FLOW.TCH_ID + "&mainFlowId=" + formContext.FLOW.FLOW_ID + "&mainTableName=" + tableName + "&fieldType=" + type + "&mainRequestId=" + req_id;
	// var
	// sURL="/workshop/form/index.jsp?turn=1&flowMod="+flowMod+"&beforeFlowMod="+formContext.FLOW.FLOW_MOD+"&mainTableName="+tableName+"&fieldType="+type+"&mainRequestId="+eval("oTable."+tableName+".REQUEST_ID.VALUE()");
	if (typeof(param) != 'undefined' && param != '') {
		sURL = sURL + "&" + param;
	}
	if (typeof(callMethod) != 'undefined' && callMethod != '') {
		isCanOpen = doCallFormMethod(callMethod);
	}
	if (isCanOpen) {
		doWindow_open(sURL, maxWidth, maxHeight, "_blank");
	}
}

function doTurnFlow(flowMod, turn) {
	var oTable = formContext.TABLE;
	var tableName;
	for (var c in oTable) {
		tableName = c;
	}
	var sURL = "/workshop/form/index.jsp?callback=opener.parent.fraForm.doFlowSearch()&turn=" + turn + "&flowMod=" + flowMod + "&beforeFlowMod=" + formContext.FLOW.FLOW_MOD + "&mainTableName=" + tableName + "&mainRequestId=" + eval("oTable." + tableName + ".REQUEST_ID.VALUE()");

	doWindow_open(sURL);
}

function endAddTask() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var tchId = formContext.FLOW.TCH_ID;
	var flowId = formContext.FLOW.FLOW_ID;
	oXMLHTTP.open("POST", "/servlet/FormTurnServlet?tag=8&tchId=" + tchId + "&flowId=" + flowId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		oXml = oXMLHTTP.responseXML;
		success = oXml.selectSingleNode("root/TABLE").text;
		if (success == '0') {
			MMsg(flowFormMenuLang.task_submit_succ + "!");
		} else if (success == '1') {
			MMsg(flowFormMenuLang.opt_fail + "!");
		}
	}
}

function isTurnDisabled(flowMod, tchMod) {
	var flow_mod = formContext.FLOW.FLOW_MOD;
	var tch_mod = formContext.FLOW.TCH_MOD;
	if (("," + flowMod + ",").indexOf("," + flow_mod + ",") > -1 && (tchMod == -1 || ("," + tchMod + ",").indexOf("," + tch_mod + ",") > -1)) {
		return false;
	} else {
		return true;
	}
}

function isTurnDisabledNum(flowNum, tchNum) {
	var flow_num = formContext.FLOW.FLOW_NUM;
	var tch_num = formContext.FLOW.TCH_NUM;
	if (("," + flowNum + ",").indexOf("," + flow_num + ",") > -1 && (("," + tchNum + ",").indexOf("," + tch_num + ",") > -1)) {
		return false;
	} else {
		return true;
	}
}

function isCanUseButton(funcItemId) {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var flow_mod = formContext.FLOW.FLOW_MOD;
	var tch_mod = formContext.FLOW.TCH_MOD;
	oXMLHTTP.open("POST", "/servlet/FormTurnServlet?tag=3&funcItemId=" + funcItemId + "&flowMod=" + flow_mod + "&tchMod=" + tch_mod, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		oXml = oXMLHTTP.responseXML;
		isCan = oXml.selectSingleNode("/root/IS_CAN_SPLIT_TURN").text;
		if (isCan == '1') {
			return false;
		} else {
			return true;
		}
	}
}

function revertSheet(method) {
	try {
		parent.fraForm.revertSheet(method);
	} catch (e) {
		var errMsg = formatResource(flowFormMenuLang.call_method_err, "");
		EMsg(errMsg);
	}
}

function viewRemoteFlowProc() {
	var iFlowId = formContext.FLOW.FLOW_ID;
	var iFlowMod = formContext.FLOW.FLOW_MOD;
	var sHref = "remoteFlowView.html?flow_id=" + iFlowId + "&flow_mod=" + iFlowMod;
	var sFeatures = new Array();
	sFeatures.push("width=" + 780);
	sFeatures.push("height=" + 580);
	sFeatures.push("location=" + 0);
	sFeatures.push("menubar=" + 0);
	sFeatures.push("resizable=" + 1);
	sFeatures.push("scrollbars=" + 0);
	sFeatures.push("status=" + 0);
	sFeatures.push("titlebar=" + 0);
	sFeatures.push("toolbar=" + 0);
	window.open(sHref, "flow", sFeatures.join(","));
}

var CancelPrivTchId = -1;// 可以取回的环节ID， 小于0时代表没有可以取回的环节ID

function getTchCancelPriv() {
	var tch_mod = formContext.FLOW.TCH_MOD;
	var tchMod;
	if (isFlowBegin())
		return true;
	if (arguments[0]) {
		tchMod = arguments[0];
		if (("," + tchMod + ",").indexOf("," + tch_mod + ",") > -1) {
			return true;
		}
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var url = "/servlet/FormTurnServlet?tag=14&system_code=D&flowId=" + formContext.FLOW.FLOW_ID + "&tachId=" + formContext.FLOW.TCH_ID;
	xmlhttp.open("POST", url, false);
	xmlhttp.send();
	CancelPrivTchId = xmlhttp.responseXML.selectSingleNode("/root/TCH_ID").text
	return !(CancelPrivTchId > 0);
}

function flowCancelNextTch() {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var url = "../../FlowDataIntf?action=FlowCancelNextTch&system_code=D&tch_id=" + CancelPrivTchId;
	xmlhttp.open("POST", url, false);
	xmlhttp.send();
	if (xmlhttp.responseText == '1')
		MMsg(flowFormMenuLang.get_back_succ + "!");
	else
		MMsg(flowFormMenuLang.get_back_fail + "!");

	formContext.callback();
	formContext.getWin().self.close();
}

// 新增函数（浙江）
function delFlow() {
	// 验证是否符合删除条件，判断函数在各表单页面里
	if (parent.fraForm.isDelFlow != undefined) {
		if (parent.fraForm.isDelFlow() == false) {
			return;
		}
	}
	var tableName = "";
	for (attrubute in formContext.TABLE) {
		tableName = attrubute;
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var dataXML = new ActiveXObject("Microsoft.XMLDOM");
	xmlhttp.Open("POST", "/servlet/flowActionZJ.do?method=getSonForm&TABLE_NAME=" + tableName + "&FLOW_ID=" + formContext.FLOW.FLOW_ID, false);
	xmlhttp.send();
	var dataXML = new ActiveXObject("Microsoft.XMLDOM");
	dataXML.load(xmlhttp.responseXML);
	var oMsgList = dataXML.selectNodes("/root/rowSet");
	if (oMsgList.length > 0) {
		if (oMsgList[0].selectSingleNode('COUNT').text == 0) {
			if (!confirm(flowFormMenuLang.del_flow_confirm)) {
				return;
			}
			var url = "/servlet/flowActionZJ.do?method=deleteFlow&TABLE_NAME=" + tableName + "&FLOW_ID=" + formContext.FLOW.FLOW_ID;
			// var
			// url="/FlowQry?system_code=D&op_type=flow_delete&flow_id="+formContext.FLOW.FLOW_ID;

			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.open("post", url, false);
			xmlhttp.send();
			alert(xmlhttp.responseXML.xml);

			if (isSuccess(xmlhttp)) {
				alert(flowFormMenuLang.del_succ + '！');
				formContext.closeWin();
				return true;
			}
		} else {
			alert(flowFormMenuLang.flow_exist_data);
		}
	}
}

function isTurnAble(flowMod, tchMod) {
	var flow_mod = formContext.FLOW.FLOW_MOD;
	var tch_mod = formContext.FLOW.TCH_MOD;
	if (parent.fraForm.isTurnAbleZJ != undefined) {
		// 若表单页面有判断流转条件函数，则执行(浙江)
		if (parent.fraForm.isTurnAbleZJ(tch_mod) == true) {
			return true;
		}
	}
	if (("," + flowMod + ",").indexOf("," + flow_mod + ",") > -1 && (("," + tchMod + ",").indexOf("," + tch_mod + ",") > -1)) {
		return true;
	} else {
		return false;
	}
}

flow.selectBox = function(oBox) {
	var checked = false;
	var oRenderTo;
	var self = this;
	var listener = {};
	var disabled = false;
	init();
	function init() {
		oRenderTo = oBox.renderTo;
		checked = oBox.isChecked || false;
		oRenderTo.style.background = 'url("/resource/image/flowHandle.png")';
		oRenderTo.style.backgroundPosition = getBackgroundPos(oBox.type);
		oRenderTo.onclick = function() {
			if (disabled)
				return;
			if (!checked) {
				self.setChecked(true);
				execListen("onAfterClick");
				return;
			}
			if (oBox.type == tache.constant.selType.radio)
				return;
			self.setChecked(false);
			execListen("onAfterClick");
		}
	}

	this.setDisabled = function(pDisabled) {
		disabled = pDisabled;
	}

	this.click = function() {
		oRenderTo.click();
	}

	this.addListener = function(eventName, oListener) {
		listener[eventName] = oListener;
	}

	this.setChecked = function(pIsChecked) {
		checked = pIsChecked;
		oRenderTo.style.backgroundPosition = getBackgroundPos(oBox.type);
	}

	this.isChecked = function() {
		return checked;
	}

	function execListen(eventName) {
		listener[eventName].call(this);
	}

	function getBackgroundPos(sType) {
		var oRadioImagePos = {
			normal : '0px -160px',
			selected : '-40px -160px'
		};
		var oCheckImagePos = {
			normal : '0px -200px',
			selected : '-40px -200px'
		};
		var oImagePos = (sType == tache.constant.selType.radio) ? oRadioImagePos : oCheckImagePos;
		var imagePos = (checked) ? oImagePos.selected : oImagePos.normal;
		return imagePos;
	}
}

flow.Service = {
	tchIterator : null,
	context : null,
	init : function() {
		var xmlDoc = this.getXmlDoc(flow.constant.actionType.all);
		return this.initByXML(xmlDoc);
	},
	initByXML : function(xmlDoc) {
		if (!xmlDoc)
			return false;
		var oNextTchXML = xmlDoc.selectSingleNode("/root/NEXT_TCH_MODS");
		this.setContext(oNextTchXML);
		this.setTchIterator(oNextTchXML);
		return true;
	},
	loadMenu : function(isNotUseOnly) {
		if (!this.init())
			return;
		var itemXMLDoc = new ActiveXObject("Microsoft.XMLDOM");
		itemXMLDoc.loadXML('<?xml version="1.0" encoding="GBK"?><root></root>');
		var menuItems = new Array();
		for (var i = 0; i < this.tchIterator.getTchs().length; i++) {
			var oTch = this.tchIterator.getTchs()[i];
			var oItemXML = itemXMLDoc.createElement("bar:item");
			menuItems.push({
						isDisabled : this.context.isDisabled(),
						label : oTch.getShowName(),
						ico : flow.constant.actionImg[oTch.getAction()],
						onclick : "flow.Service.dispatch({type:'" + flow.constant.operType.single + "'," + "tchModId:'" + oTch.getModelId() + "'})"
					});
		}
		buildExtentMenu(this.tchIterator, this.context, menuItems);
		for (var i = 0; i < menuItems.length; i++) {
			buildMenuItem(menuItems[i], itemXMLDoc);
		}
		if (menuItems.length == 0) {
			EMsg(flowFormMenuLang.find_next_tch);
			return;
		}
		if (menuItems.length == 1 && isNotUseOnly != true) {
			eval(menuItems[0].onclick);
			return;
		}
		return itemXMLDoc.documentElement.childNodes;
		function buildExtentMenu(tchIterator, context, menuItems) {
			var menuLen = tchIterator.getTchs().length;
			var isSingleSelect = tchIterator.isSingleSelect();
			if (context.isDisabled() || context.hasUnClosedConnTch() || (!context.isDisabled() && !isSingleSelect)) {
				if (menuLen > 1) {
					var oLineXML = itemXMLDoc.createElement("bar:line");
					itemXMLDoc.documentElement.appendChild(oLineXML);
				}
				if (context.hasUnClosedConnTch()) {
					menuItems.push({
								isDisabled : false,
								label : context.getEndTaskTitle(),
								ico : "",
								onclick : "flow.Service.dispatch({type:'" + flow.constant.operType.endTask + "'})"
							});
				}
				if (context.isDisabled()) {
					var msg = formatResource(flowFormMenuLang.turn_up_tache, menuLen);
					menuItems.push({
								isDisabled : false,
								label : msg,
								ico : "",
								onclick : "flow.Service.dispatch({type:'" + flow.constant.operType.more + "'})"
							});
				}
				if (context.isNextTchAuto())
					return;
				if ((!context.isDisabled() && !isSingleSelect)) {
					menuItems.push({
								isDisabled : false,
								label : flowFormMenuLang.turn_more_tache,
								ico : "",
								onclick : "flow.Service.dispatch({type:'" + flow.constant.operType.more + "'})"
							});
				}
			}
		}
		function buildMenuItem(aMenuItem, itemXMLDoc) {
			var oItemXML = itemXMLDoc.createElement("bar:item");
			if (aMenuItem.isDisabled) {
				oItemXML.setAttribute("disabled", "true");
			}
			oItemXML.setAttribute("label", aMenuItem.label);
			oItemXML.setAttribute("ico", aMenuItem.ico);
			oItemXML.setAttribute("onclick", aMenuItem.onclick);
			itemXMLDoc.documentElement.appendChild(oItemXML);
		}
	},
	setContext : function(oNextTchXML) {
		this.context = flow.Context.createInst(oNextTchXML)
		return this.context;
	},
	setTchIterator : function(oNextTchXML) {
		this.tchIterator = flow.TchIterator.createInst(oNextTchXML.childNodes, this.context);
		return this.tchIterator;
	},
	getXmlDoc : function(actionType) {
		var returnXML = this.reGetXmlDoc(actionType);
		if (returnXML) {
			this.getXmlDoc = function(actionType) {
				return returnXML;
			}
			return this.getXmlDoc(actionType);
		}
		return null;
	},
	reGetXmlDoc : function(actionType) {
		return formContext.App.syncAjaxRequest('../../servlet/flowOper?OperType=1&flowType=' + actionType + '&flowMod=' + formContext.FLOW.FLOW_MOD + "&tchId=" + formContext.FLOW.TCH_ID);
	},
	flowTo : function(aParam) {
		if (!this.init())
			return;
		var eleOnLayer = (aParam.eleOnLayer == undefined) ? false : aParam.eleOnLayer;
		this.dispatch({
					type : flow.constant.operType.single,
					tchModId : aParam.tchModId,
					tchModNum : aParam.tchModNum,
					eleOnLayer : eleOnLayer
				})
	},
	flowToNext : function(aParam) {
		if (!this.init())
			return;
		var isPrompt = (aParam.isPrompt == undefined) ? true : aParam.isPrompt;
		var eleOnLayer = (aParam.eleOnLayer == undefined) ? false : aParam.eleOnLayer;
		this.dispatch({
					type : flow.constant.operType.single,
					eleOnLayer : eleOnLayer,
					isAuto : true,
					tchModId : aParam.tchModId,
					tchModNum : aParam.tchModNum,
					isPrompt : isPrompt
				})
	},
	flowToDefault : function(aParam) {
		if (!this.init())
			return;
		var isPrompt = (aParam.isPrompt == undefined) ? true : aParam.isPrompt;
		var eleOnLayer = (aParam.eleOnLayer == undefined) ? false : aParam.eleOnLayer;
		var aTch = this.tchIterator.getTchs();
		if (aTch.length) {
			var oSelTch = this.tchIterator.getSelectedTch();
			if (oSelTch) {
				this.dispatch({
							type : flow.constant.operType.single,
							eleOnLayer : eleOnLayer,
							isAuto : true,
							isPrompt : isPrompt,
							tchModId : oSelTch.getModelId()
						})
			} else {
				this.dispatch({
							type : flow.constant.operType.directFlow,
							actionType : flow.constant.actionType.all,
							eleOnLayer : eleOnLayer
						});
			}
			return;
		}
		if (this.context.hasUnClosedConnTch()) {
			this.dispatch({
						type : flow.constant.operType.endTask,
						eleOnLayer : eleOnLayer,
						isAuto : true,
						isPrompt : isPrompt
					})
		}
	},
	isFormValidate : function(action, oValidateMod) {
		if (!oValidateMod)
			return (formContext.validate());
		if (!oValidateMod[action])
			return true;
		return (formContext.validate());
	},
	dispatch : function(aParam) {
		var aDispatcher = {};
		aDispatcher[flow.constant.operType.single] = function() {
			singelSelect(this, aParam);
		};
		aDispatcher[flow.constant.operType.more] = function() {
			moreSelect(this, aParam);
		};
		aDispatcher[flow.constant.operType.endTask] = function() {
			endTask(this, aParam)
		};
		aDispatcher[flow.constant.operType.directFlow] = function() {
			directFlow(this, aParam)
		};
		aDispatcher[aParam.type].call(this);
		function getSelectTch(oService, aParam) {
			if (aParam.tchModId)
				return oService.tchIterator.getTchById(aParam.tchModId);
			if (aParam.tchModNum)
				return oService.tchIterator.getTchByNum(aParam.tchModNum);
			return null;
		}
		function singelSelect(oService, aParam) {
			var oTch = getSelectTch(oService, aParam);
			if (!oTch) {
				EMsg(flowFormMenuLang.not_found_tache + "!");
				return;
			}
			if (aParam.isAuto)
				oTch.setAuto(true);
			if (!isOnClickBeforeEvent(oTch))
				return;
			if (!aParam.eleOnLayer || isFlowBegin()) {
				if (!oService.isFormValidate(oTch.getAction(), oService.context.getValidateMod()))
					return;
			}
			if (oTch.hasDefaultStaff())
				oTch.setExcuteStaffIds(oTch.getDefaultStaff().getId());
			if (!oService.context.onBeforeFinish(oTch))
				return;
			if (!oTch.onBeforeCreate())
				return;
			if (!oTch.canAutoFinish()) {
				oService.tchIterator.popOther(oTch);
				openWin(oService, aParam);
				return;
			}
			if (oTch.hasDefaultNotifyStaff())
				oTch.setNotifyStaffIds(oTch.getDefaultNotifyStaff().getId());
			oService.context.setDefault();
			if (!oService.onBeforeSubmit())
				return;
			var oSendXML = oService.getSendXML(oTch);
			var isPrompt = (aParam.isPrompt == undefined) ? true : aParam.isPrompt;
			if (isPrompt && QMsg(flowFormMenuLang.submit_info_confirm) != MSG_YES)
				return;
			if (oService.save(oSendXML, oTch)) {
				MMsg(getAutoMsg() || flowFormMenuLang.submit_succ + "！");
				formContext.closeWin();
				formContext.callback();
			}
		}
		function getAutoMsg() {
			var returnXML = formContext.App.syncAjaxRequest("../../servlet/flowOper?OperType=13&tchId=" + formContext.FLOW.TCH_ID + "&flowId=" + formContext.FLOW.FLOW_ID);
			sValue = (returnXML) ? returnXML.selectSingleNode("/root/MSG").text : "";
			return sValue;
		}
		function moreSelect(oService, aParam) {
			if (!isOnClickBeforeEvent())
				return;
			if (!oService.isFormValidate(flow.constant.actionType.run, oService.context.getValidateMod()))
				return;
			oService.tchIterator.setDefault();
			if (!oService.context.onBeforeFinish(null, oService.tchIterator))
				return;
			openWin(oService, aParam);
		}
		function endTask(oService, aParam) {
			if (!isOnClickBeforeEvent())
				return;
			if (!aParam.eleOnLayer || isFlowBegin()) {
				if (!oService.isFormValidate("endTask", oService.context.getValidateMod()))
					return;
			}
			if (!oService.context.onBeforeFinish(null, null))
				return;
			if (aParam.isAuto)
				oService.context.setEndTaskAuto(true);
			if (oService.context.isEndTaskAuto()) {
				oService.context.setDefault();
				if (!oService.onBeforeSubmit())
					return;
				var oSendXML = oService.getSendXML();
				var isPrompt = (aParam.isPrompt == undefined) ? true : aParam.isPrompt;
				var msg = formatResource(flowFormMenuLang.if_need, oService.context.getEndTaskTitle());
				if (isPrompt && QMsg(msg) != MSG_YES)
					return;
				if (oService.save(oSendXML)) {
					MMsg(flowFormMenuLang.submit_succ + "！");
					formContext.closeWin();
					formContext.callback();
				}
				return;
			}
			openWin(oService, aParam);
		}
		function directFlow(oService, aParam) {
			var xmlDoc = oService.reGetXmlDoc(aParam.actionType);

			if (!oService.initByXML(xmlDoc))
				return;
			if (!isOnClickBeforeEvent())
				return;
			if (!aParam.eleOnLayer || isFlowBegin()) {
				if (!oService.isFormValidate(aParam.actionType, oService.context.getValidateMod()))
					return;
			}
			openWin(oService, aParam);
		}
		function openWin(oService, aParam) {
			var param = {
				win : window,
				context : oService.context,
				tchIterator : oService.tchIterator,
				type : aParam.type,
				actionType : aParam.actionType,
				eleOnLayer : aParam.eleOnLayer
			};
			var openModel = oService.context.getWinCfg().model;
			if (openModel == "win") {
				var sHref = "tacheContent.html";
				var sPara = 'dialogwidth:650px;dialogheight:480px;status:no;help:no;resizable:yes;scroll=1';
				var isOK = window.showModalDialog(sHref, param, sPara);
				if (isOK == 1) {
					formContext.callback();
					formContext.closeWin();
				}
			}
			if (openModel == "layer")
				showLayer(param);
		}
		function isOnClickBeforeEvent(oTch) {
			if (!formContext.onClickBeforeEvent({nextTch: oTch})) {
				return false;
			} else {
				return true;
			}
		}
	},
	getSendXML : function(oTch, oTchIterator) {
		var flowXMLDoc = new ActiveXObject("Microsoft.XMLDOM");
		var oFormXML = formContext.getSendXML();
		var sTchXML = "";
		if (oTch)
			sTchXML = oTch.asXML()
		else if (oTchIterator)
			sTchXML = oTchIterator.getSelectedTchXML();
		var sendXML = '<?xml version="1.0" encoding="GBK"?>';
		sendXML += '<FLOW FLOW_ID="' + formContext.FLOW.FLOW_ID + '" toDir="flow"' + ' FLOW_NAME="' + xmlEncode(this.context.getFlowName()) + '">';
		sendXML += '<FLOW_MOD>' + formContext.FLOW.FLOW_MOD + '</FLOW_MOD>';
		sendXML += '<STAFF_ID>' + formContext.GLOBAL_VAR.STAFF_ID + '</STAFF_ID>';
		sendXML += '<IS_SUPER_CONTROL>'+((isSuperControl)?'1':'0')+'</IS_SUPER_CONTROL>';
		sendXML += '<CUR_TCH_ID>' + formContext.FLOW.TCH_ID + '</CUR_TCH_ID>';
		sendXML += '<CUR_TCH_CONTENT>' + xmlEncode(this.context.getOpinion().getValue()) + '</CUR_TCH_CONTENT>';
		sendXML += this.context.getOnAfterFinishExpr().getExecXML(oTch, this.tchIterator) + sTchXML;
		sendXML += '<ATACHES/>';
		sendXML += '</FLOW>';

		flowXMLDoc.loadXML(sendXML);
		var flowNode = flowXMLDoc.selectSingleNode("/FLOW");
		var formFlowNode = oFormXML.selectSingleNode("/root/FLOW");
		if (null != formFlowNode) {
			formFlowNode.selectNodes("/root/FLOW").removeAll();
		}
		oFormXML.selectSingleNode("/root").appendChild(flowNode);
		return oFormXML;
	},
	onBeforeSubmit : function(oTch, oTchIterator) {
		function getSelectedTchs(){
			if(oTchIterator && typeof oTchIterator.getSelectedTchsInfoAsJson === "function"){
				return oTchIterator.getSelectedTchsInfoAsJson();
			}
			return {};
		}
		if (!this.context.onFinish(oTch, oTchIterator))
			return false;
		if (oTchIterator && !oTchIterator.onCreate())
			return false;
		if (!formContext.flowSubmit({selectedTchsInfo: getSelectedTchs()}))
			return false;
		return true;
	},
	save : function(XMLDoc, oTch, oTchIterator, async) {
		var isAsync = async || false;
		var saveURL = '../../servlet/flowOper?OperType=2&formId=' + formContext.getFormId() + '&formHistoryId=' + formContext.GLOBAL_VAR["FORM_HISTORY_ID"]
		var self = this;
		if (!isAsync) {
			var isOK = formContext.App.syncAjaxRequest(saveURL, XMLDoc);
			if (isOK) {
				onAfterSave();
			}
			return isOK;
		}
		formContext.App.ajaxRequest(saveURL, {
					async : true,
					xml : XMLDoc,
					onStateChange : function(oXMLHttp) {
						stateChange(oXMLHttp)
					}
				});
		function stateChange(oXMLHttp) {
			var oLayer = Layer.instances["FL_EGN_WIN"].getDomEle();
			Message.xmlHttpLoading(oXMLHttp, {
						wait : flowFormMenuLang.submitting_wait + "......",
						succeed : flowFormMenuLang.submit_succ
					}, oLayer, {
						onSucceed : function() {
							onAfterSave();
							window.setTimeout(function() {
										if(!isSuperControl)
										{
											formContext.closeWin();	
											formContext.callback();
										}
										else
										{
											doFlowMgrAction();
										}
										
										
									}, 1000);
						},
						onClick : function() {
							if(!isSuperControl)
							{
								formContext.closeWin();
								formContext.callback();
							}
							else
							{
								doFlowMgrAction();
							}
							
						}
					})
		}
		function onAfterSave() {
			self.context.onAfterFinish(oTch, oTchIterator);
			if (oTchIterator)
				oTchIterator.onAfterCreate(oTch);
		}
	},
	getOpinionMenuDoc : function() {
		return formContext.App.syncAjaxRequest('../../servlet/flowOper?OperType=14&' + '&flowMod=' + formContext.FLOW.FLOW_MOD + '&tchMod=' + formContext.FLOW.TCH_MOD+"&staffId="+formContext.GLOBAL_VAR.STAFF_ID);
	}
};
flow.Context = function() {
	var xmlNode;
	var nextTchAuto = false;// 下一环节是否被流程引擎自动创建
	var defaultTch;
	var nextTchCount = 0;
	var existUnClosedConnTch = false;
	var isSetDefaultTch = false;
	var tacheEditable = true;
	var endTaskAuto = false;
	var endTaskTitle;
	var validateMode = {
		run : true,
		end : true,
		"return" : true,
		transfer : true,
		endTask : true
	};
	var winCfg = {
		model : "win",
		showSaveSucceed : false,
		showFlowName : true,
		showAttach : true
	};
	var layerStyle = {
		fullScreen : "0",
		width : "650px",
		height : "480px"
	};
	var opinion = {};
	var defaultFlowName = {};
	var flowName = "";
	var onFinishExpr = {};
	var onBeforeFinishExpr = {};
	var onAfterFinishExpr = {};
	var execDesc;
	var serialState = flow.constant.serialState.none;
	var globalDefStaffCfg;
	this.getFlowName = function() {
		return flowName
	};
	this.setFlowName = function(pFlowName) {
		return flowName = pFlowName
	};
	this.getEndTaskTitle = function() {
		return endTaskTitle
	};
	this.setEndTaskTitle = function(pEndTaskTitle) {
		endTaskTitle = pEndTaskTitle
	};
	this.isEndTaskAuto = function() {
		return endTaskAuto
	};
	this.setEndTaskAuto = function(pEndTaskAuto) {
		endTaskAuto = pEndTaskAuto
	};
	this.getValidateMod = function() {
		return validateMode
	};
	this.getExecDesc = function() {
		return execDesc
	};
	this.setExecDesc = function(pExecDesc) {
		execDesc = pExecDesc
	};
	this.getWinCfg = function() {
		return winCfg
	};
	this.setWinCfg = function(pWinCfg) {
		winCfg = pWinCfg
	};
	this.getLayerStyle = function() {
		return layerStyle
	};
	this.setLayerStyle = function(pLayerStyle) {
		layerStyle = pLayerStyle
	};
	this.getSerialState = function() {
		return serialState
	};
	this.setSerialState = function(pSerialState) {
		serialState = pSerialState
	};
	this.setGlobalDefStaffCfg = function(pStaffCfg) {
		globalDefStaffCfg = pStaffCfg
	};
	this.getGlobalDefStaffCfg = function() {
		return globalDefStaffCfg
	};
	this.setValidateMod = function(pValidateMod) {
		if (pValidateMod) {
			for (var key in pValidateMod)
				validateMode[key] = pValidateMod[key];
		}
	};
	this.setNextTchAuto = function(pAuto) {
		nextTchAuto = (pAuto == "0") ? false : true;
	};
	this.isNextTchAuto = function() {
		return nextTchAuto
	};
	this.isTacheEditale = function() {
		return tacheEditable
	};
	this.setTacheEditale = function(pEditable) {
		tacheEditable = pEditable
	};
	this.setDefaultTch = function(aDefaultTch) {
		if (!aDefaultTch.ids)
			return;
		isSetDefaultTch = true;
		defaultTch = {
			ids : "",
			selectedTchIds : "",
			canChange : true,
			selected : false,
			hiddenOther : false,
			count : 0
		};
		defaultTch.ids = aDefaultTch.ids + "";
		defaultTch.selectedTchIds = (aDefaultTch.selected == flow.constant.aBoolean.True) ? aDefaultTch.ids : aDefaultTch.selectedTchIds + "";
		defaultTch.canChange = (aDefaultTch.canChange == flow.constant.aBoolean.True) ? true : false;
		defaultTch.selected = (aDefaultTch.selected == flow.constant.aBoolean.True) ? true : false;
		defaultTch.hiddenOther = (aDefaultTch.hiddenOther == flow.constant.aBoolean.True) ? true : false;
		if (defaultTch.selected && !defaultTch.canChange) {
			defaultTch.hiddenOther = true;
		}
		defaultTch.count = aDefaultTch.count;
	};
	this.getDefaultTch = function() {
		return defaultTch
	};
	this.setNextTchCount = function(pNextTchCnt) {
		nextTchCount = pNextTchCnt
	};
	this.getNextTchCount = function() {
		return nextTchCount
	};
	this.hasDefaultTch = function() {
		return isSetDefaultTch
	};
	this.isDisabled = function() {
		if (nextTchAuto)
			return (nextTchCount > 1) ? true : false;
		if (isSetDefaultTch && defaultTch.count > 1 && !defaultTch.canChange)
			return true;
		return false;
	}
	this.hasUnClosedConnTch = function() {
		return existUnClosedConnTch
	};
	this.setHasUnClosedConnTch = function(pHasUnClosedConnTch) {
		existUnClosedConnTch = pHasUnClosedConnTch
	};
	this.getOpinion = function() {
		return opinion;
	}
	this.setOpinion = function(sType, sDefaultValueExpr, sDefaultValueType, sValue) {
		var value = "";
		opinion.type = sType;
		opinion.setValue = function(pValue) {
			value = pValue
		};
		opinion.getValue = function() {
			return value
		};
		opinion.getDefaultValue = function() {
			if (sValue != "")
				return sValue;
			if (sDefaultValueType == "")
				sDefaultValueType = "form";
			if (sDefaultValueExpr != "")
				return flow.Expr.parse(sDefaultValueType, sDefaultValueExpr, {});
			if (formContext.QuickOpinion)
				return formContext.QuickOpinion.value;// todo 可以重构后去掉，需要改调用方
			return "";
		}
	}
	this.getDefaultFlowName = function() {
		return defaultFlowName;
	};
	this.setDefaultFlowName = function(aDefaultFlowName) {
		defaultFlowName.get = function() {
			if (aDefaultFlowName.exprType && aDefaultFlowName.nameExpr)
				return flow.Expr.parse(aDefaultFlowName.exprType, aDefaultFlowName.nameExpr, {});
			return formContext.FLOW.FLOW_NAME;
		}
	};
	this.getOnAfterFinishExpr = function() {
		return onAfterFinishExpr
	};
	this.setOnAfterFinishExpr = function(aOnAfterFinishExpr) {
		onAfterFinishExpr = flow.Expr.copyObj(aOnAfterFinishExpr);
		onAfterFinishExpr.getExecXML = function(oTch, oTchIterator) {
			var aParam = getEventParam(oTch, oTchIterator);
			return flow.Expr.getExecXML(onAfterFinishExpr.type, "ON_AFTER_FINISH", onAfterFinishExpr.value, {
						action : aParam.action,
						selTch : aParam.modelId,
						selStaff : aParam.staffId,
						selTchNum : aParam.modelNum,
						funcType : onAfterFinishExpr.type
					});
		}
	};
	this.onAfterFinish = function(oTch, oTchIterator) {
		if (!onAfterFinishExpr.type || !onAfterFinishExpr.value || onAfterFinishExpr.type != flow.constant.scriptType.js)
			return;
		var aParam = getEventParam(oTch, oTchIterator);
		flow.Expr.exec(onAfterFinishExpr.value, {
					action : aParam.action,
					selTch : aParam.modelId,
					selStaff : aParam.staffId,
					selTchNum : aParam.modelNum,
					funcType : flow.constant.scriptType.js
				});
	};
	this.setOnBeforeFinishExpr = function(aOnBeforeFinishExpr) {
		onBeforeFinishExpr = flow.Expr.copyObj(aOnBeforeFinishExpr);
	};
	this.onBeforeFinish = function(oTch, oTchIterator) {
		if (!onBeforeFinishExpr.type || !onBeforeFinishExpr.value)
			return true;
		var aParam = getEventParam(oTch, oTchIterator);
		return flow.Expr.exec(onBeforeFinishExpr.value, {
					action : aParam.action,
					selTch : aParam.modelId,
					selStaff : aParam.staffId,
					selTchNum : aParam.modelNum,
					funcType : onBeforeFinishExpr.type
				});
	};
	this.setOnFinishExpr = function(aOnFinishExpr) {
		onFinishExpr = flow.Expr.copyObj(aOnFinishExpr)
	};
	this.onFinish = function(oTch, oTchIterator) {
		if (!onFinishExpr.type || !onFinishExpr.value)
			return true;
		var aParam = getEventParam(oTch, oTchIterator);
		return flow.Expr.exec(onFinishExpr.value, {
					action : aParam.action,
					selTch : aParam.modelId,
					selStaff : aParam.staffId,
					selTchNum : aParam.modelNum,
					funcType : onFinishExpr.type
				});
	};
	this.setDefault = function() {
		this.setFlowName(defaultFlowName.get());
		this.getOpinion().setValue(opinion.getDefaultValue());
	};
	this.setXMLNode = function(oXMLNode) {
		this.xmlNode = oXMLNode;
	};
	this.getXMLNode = function() {
		return this.xmlNode;
	}
	this.hasNextTchHook = function() {
		return (this.xmlNode.getAttribute("NEXT_TCHS_TYPE") != "" && this.xmlNode.getAttribute("NEXT_TCHS_VALUE") != "");
	}
	this.resetByHook = function() {
		var oTchXMLnodes = this.xmlNode.childNodes;
		var nextTchCnt = oTchXMLnodes.length;
		var defaultNextTchCnt = 0;
		var oNextTchs = getNextTch(this.xmlNode)
		var nextTchIds = oNextTchs.nextTchIds;
		var selectedTchIds = oNextTchs.selectedTchIds;
		for (var i = 0; i < oTchXMLnodes.length; i++) {
			var oTchXMLnode = oTchXMLnodes[i];
			var sTchMod = oTchXMLnode.selectSingleNode("TCH_MOD").text;
			var sConnTchClosed = oTchXMLnode.selectSingleNode("CON_TCH_CLOSED").text;
			if (sConnTchClosed == "1") {
				if (sTchMod.isInArray(nextTchIds.split(",")))
					defaultNextTchCnt++;
			} else
				nextTchCnt--;
		}
		this.setNextTchCount(nextTchCnt);
		this.setHasUnClosedConnTch(nextTchCnt < oTchXMLnodes.length);
		formContext.setParalleling(nextTchCnt < oTchXMLnodes.length);
		this.setDefaultTch({
					ids : nextTchIds,
					selectedTchIds : selectedTchIds,
					canChange : this.xmlNode.getAttribute("NEXT_TCHS_CAN_CHANGE"),
					selected : this.xmlNode.getAttribute("NEXT_TCHS_IS_SELECTED"),
					hiddenOther : this.xmlNode.getAttribute("NEXT_TCHS_IS_HIDDEN_OTHER"),
					count : defaultNextTchCnt
				});
		function getNextTch(xmlNode) {
			var oNextTch = flow.Expr.parse(xmlNode.getAttribute("NEXT_TCHS_TYPE"), xmlNode.getAttribute("NEXT_TCHS_VALUE"), {}) + "";
			var nextTchIds = "", selectedTchIds = "";
			if (oNextTch.indexOf(":") == -1) {
				nextTchIds = oNextTch;
			} else {
				var aNextTch = oNextTch.split(":")
				nextTchIds = aNextTch[0] || "";
				selectedTchIds = aNextTch[1] || "";
			}
			return {
				nextTchIds : nextTchIds,
				selectedTchIds : selectedTchIds
			};
		}
	};
	var getEventParam = function(oTch, oTchIterator) {
		var aParam = {
			action : "",
			modelId : "",
			staffId : "",
			modelNum : ""
		};
		if (oTch) {
			aParam.action = oTch.getAction();
			aParam.modelId = oTch.getModelId();
			aParam.staffId = oTch.getExcuteStaffIds();
			aParam.modelNum = oTch.getTchNum();
		} else if (oTchIterator) {
			var oSelTchs = oTchIterator.getSelectedTchsInfo();
			aParam = flow.Expr.copyObj(oSelTchs);
		}
		return aParam;
	}
};

flow.Context.createInst = function(xmlNode) {
	var oContext = new flow.Context();
	oContext.setXMLNode(xmlNode);
	formContext.setSerialing(xmlNode.getAttribute("SERIAL_STATE") == flow.constant.serialState.inProgress);
	oContext.resetByHook();
	var oCommands = [{
				command : "setNextTchAuto",
				param : xmlNode.getAttribute("IS_AUTO")
			}, {
				command : "setTacheEditale",
				param : (xmlNode.getAttribute("IS_TACHE_EDITABLE") == flow.constant.aBoolean.True)
			}, {
				command : "setEndTaskTitle",
				param : xmlNode.getAttribute("END_TASK_TITLE")
			}, {
				command : "setEndTaskAuto",
				param : (xmlNode.getAttribute("IS_END_TASK_AUTO") == flow.constant.aBoolean.True)
			}, {
				command : "setValidateMod",
				param : flow.Expr.parseJson(xmlNode.getAttribute("FLOW_VALIDATE_MODE"))
			}, {
				command : "setLayerStyle",
				param : flow.Expr.parseJson(xmlNode.getAttribute("LAYER_STYLE"))
			}, {
				command : "setExecDesc",
				param : xmlNode.getAttribute("EXEC_DESC")
			}, {
				command : "setSerialState",
				param : xmlNode.getAttribute("SERIAL_STATE")
			}, {
				command : "setDefaultFlowName",
				param : {
					exprType : xmlNode.getAttribute("DEFAULT_FLOW_NAME_TYPE"),
					nameExpr : xmlNode.getAttribute("DEFAULT_FLOW_NAME_VALUE")
				}
			}, {
				command : "setOnBeforeFinishExpr",
				param : {
					type : xmlNode.getAttribute("ON_BEFORE_FINISH_TYPE"),
					value : xmlNode.getAttribute("ON_BEFORE_FINISH")
				}
			}, {
				command : "setOnFinishExpr",
				param : {
					type : xmlNode.getAttribute("ON_FINISH_TYPE"),
					value : xmlNode.getAttribute("ON_FINISH")
				}
			}, {
				command : "setOnAfterFinishExpr",
				param : {
					type : xmlNode.getAttribute("ON_AFTER_FINISH_TYPE"),
					value : xmlNode.getAttribute("ON_AFTER_FINISH")
				}
			}, {
				command : "setGlobalDefStaffCfg",
				param : flow.Expr.parseJson(xmlNode.getAttribute("GLOBAL_DEFAULT_STAFF_CFG"))
			}];
	var iLen = oCommands.length;
	for (var i = 0; i < iLen; i++) {
		var oCommand = oCommands[i];
		oContext[oCommand.command](oCommand.param);
	}
	setOpinion(oContext, xmlNode);
	setWinCfg(oContext, xmlNode);
	return oContext;
	function setOpinion(oContext, xmlNode) {
		oContext.setOpinion(xmlNode.getAttribute("OPINION_TYPE"), xmlNode.getAttribute("DEFAULT_OPINION_VALUE"), xmlNode.getAttribute("DEFAULT_OPINION_TYPE"), xmlNode.getAttribute("OPINION"))
	}
	function setWinCfg(oContext, xmlNode) {
		var oWinCfg = flow.Expr.parseJson(xmlNode.getAttribute("FLOW_WIN_CFG"));
		var oSysWinCfg = flow.Expr.parseJson(xmlNode.getAttribute("SYS_FLOW_WIN_CFG"));
		for (var key in oSysWinCfg) {
			if (oWinCfg && oWinCfg[key] != undefined) {
				oSysWinCfg[key] = oWinCfg[key];
			}
		}
		oContext.setWinCfg(oSysWinCfg);
	}
}
flow.NextTch = function(xmlNode) {
	var modelId;
	var name;
	var desc = "";
	var action;
	var showed = true;
	var selected = false;
	var excuteStaffIds = "";
	var excuteGroupIds = "";
	var notifyStaffIds = "";
	var excludeTch = [];
	var ownerPanel;
	var defaultStaff;
	var defaultNotifyStaff;
	var defaultOrg;
	var notifyDefaultOrg;
	var staffCreateType;
	var notifyStaffCreateType;
	var auto = false;
	var disabled = false;
	var actionRunTitle;
	var actionBackTitle;
	var actionTransferTitle;
	var filterStaffWhere;
	var sms = {
		display : false,
		selected : false,
		changed : false
	};
	var mail = {
		display : false,
		selected : false,
		changed : false
	};
	var notifyCfg = {
		sms : {
			display : false,
			selected : false,
			canChange : true
		},
		mail : {
			display : false,
			selected : false,
			canChange : true
		}
	};
	var onBeforeCreateExpr = {};
	var onAfterCreateExpr = {};
	var onCreateExpr = {};
	var remark;
	var tchNum;
	this.counterSignCfg = {
		text : flowFormMenuLang.signature_type + ':',
		display : false,
		canParallel : false,
		canSerial : false,
		parallel : {
			checked : false,
			text : flowFormMenuLang.parallel,
			display : false
		},
		serial : {
			checked : false,
			text : flowFormMenuLang.serial,
			display : false
		}
	}
	this.setModelId = function(pModelId) {
		modelId = pModelId
	};
	this.getModelId = function() {
		return modelId
	};
	this.setName = function(pName) {
		name = pName
	};
	this.getName = function() {
		return name
	};
	this.setRemark = function(pRemark) {
		remark = pRemark
	};
	this.getRemark = function() {
		return remark
	};
	this.setDesc = function(pDesc) {
		desc = pDesc
	};
	this.getDesc = function() {
		return (desc) ? desc : name
	};
	this.setAuto = function(pAuto) {
		auto = pAuto
	};
	this.isAuto = function() {
		return auto
	};
	this.setDisabled = function(pDisabled) {
		return disabled = pDisabled
	};
	this.isDisabled = function() {
		return disabled
	};
	this.setActionRunTitle = function(pActionRunTitle) {
		return actionRunTitle = pActionRunTitle
	};
	this.getActionRunTitle = function() {
		return actionRunTitle
	};
	this.setActionBackTitle = function(pActionBackTitle) {
		return actionBackTitle = pActionBackTitle
	};
	this.getActionBackTitle = function() {
		return actionBackTitle
	};
	this.setActionTransferTitle = function(pActionTransferTitle) {
		return actionTransferTitle = pActionTransferTitle
	};
	this.getActionTransferTitle = function() {
		return actionTransferTitle
	};
	this.setFilterStaffWhere = function(pFilterStaffWhere) {
		return filterStaffWhere = pFilterStaffWhere
	};
	this.getFilterStaffWhere = function() {
		return filterStaffWhere
	};
	this.setExcuteStaffIds = function(pExcuteStaffIds) {
		excuteStaffIds = pExcuteStaffIds
	};
	this.getExcuteStaffIds = function() {
		return excuteStaffIds
	};
	this.setExcuteGroupIds = function(pExcuteGroupIds) {
		excuteGroupIds = pExcuteGroupIds
	};
	this.getExcuteGroupIds = function() {
		return excuteGroupIds
	};
	this.setNotifyStaffIds = function(pNotifyStaffIds) {
		notifyStaffIds = pNotifyStaffIds
	};
	this.getNotifyStaffIds = function() {
		return notifyStaffIds
	};
	this.getStaffCreateType = function() {
		return staffCreateType
	};
	this.setStaffCreateType = function(pStaffCreateType) {
		staffCreateType = pStaffCreateType
	};
	this.getNotifyStaffCreateType = function() {
		return notifyStaffCreateType
	};
	this.setNotifyStaffCreateType = function(pNotifyStaffCreateType) {
		notifyStaffCreateType = pNotifyStaffCreateType
	};
	this.setAction = function(pAction) {
		action = pAction
	};
	this.getAction = function() {
		return action
	};
	this.setMail = function(pMail) {
		mail = flow.Expr.copyObj(pMail)
	};
	this.getMail = function() {
		return mail;
	};
	this.getSms = function() {
		return sms;
	};
	this.setSms = function(pSms) {
		sms = flow.Expr.copyObj(pSms)
	};
	this.setNotifyCfg = function(pNotifyCfg) {
		notifyCfg = flow.Expr.parseJson(pNotifyCfg)
	};
	this.getNotifyCfg = function() {
		return notifyCfg
	};
	this.isShowed = function() {
		return showed
	};
	this.setShowed = function(pShowed) {
		showed = pShowed
	};
	this.setOwnerPanel = function(pOwnerPanel) {
		ownerPanel = pOwnerPanel
	};
	this.getOwnerPanel = function() {
		return ownerPanel
	};
	this.pushExcludeTch = function(oTch) {
		excludeTch.push(oTch);
	};
	this.getExcludeTchs = function() {
		return excludeTch;
	};
	this.setExcludeTchs = function(aTch) {
		excludeTch = aTch;
	};
	this.setTchNum = function(pTchNum) {
		tchNum = pTchNum
	};
	this.getTchNum = function() {
		return tchNum
	};
	this.getShowName = function() {
		var aReturn = {};
		aReturn[flow.constant.actionType.run] = this.getActionRunTitle().replace('%TCH_NAME%', this.getName());
		aReturn[flow.constant.actionType.back] = this.getActionBackTitle().replace('%TCH_NAME%', this.getName());
		aReturn[flow.constant.actionType.transfer] = this.getActionTransferTitle().replace('%TCH_NAME%', this.getName());
		aReturn[flow.constant.actionType.end] = this.getName();
		return aReturn[this.getAction()];
	}
	this.clearExcludeTch = function() {
		var iLen = excludeTch.length;
		for (var i = 0; i < iLen; i++)
			excludeTch.pop();
	};
	this.popExcludeTch = function(otherTch) {
		for (var i = 0; i < excludeTch.length; i++) {
			if (excludeTch[i] == otherTch) {
				excludeTch.splice(i, 1);
				return;
			}
		}
	}
	this.isExclude = function(otherTch) {
		var iLen = otherTch.getExcludeTchs().length;
		for (var i = 0; i < iLen; i++) {
			if (otherTch.getExcludeTchs()[i] == this)
				return true;
		}
		return false;
	}
	this.hasDefaultStaff = function() {
		return (defaultStaff) ? true : false;
	};
	this.getDefaultStaff = function() {
		return defaultStaff;
	};
	this.setDefaultStaff = function(aDefaultStaff) {
		defaultStaff = setStaff(aDefaultStaff);
	}
	this.getDefaultNotifyStaff = function() {
		return defaultNotifyStaff;
	};
	this.hasDefaultNotifyStaff = function() {
		return (defaultNotifyStaff) ? true : false;
	};
	this.setDefaultNotifyStaff = function(aNotifyStaff) {
		defaultNotifyStaff = setStaff(aNotifyStaff);
	}
	this.hasDefaultOrg = function() {
		return (defaultOrg) ? true : false;
	};
	this.getDefaultOrg = function() {
		return defaultOrg
	};
	this.setDefaultOrg = function(aDefaultOrg) {
		defaultOrg = flow.Expr.copyObj(aDefaultOrg);
		defaultOrg.getId = function() {
			return flow.Expr.parse(defaultOrg.exprType, defaultOrg.expr, {
						selTch : modelId,
						action : action,
						selTchNum : tchNum
					});
		}
	}
	this.setNotifyDefaultOrg = function(aNotifyDefaultOrg) {
		notifyDefaultOrg = flow.Expr.copyObj(aNotifyDefaultOrg);
		notifyDefaultOrg = flow.Expr.copyObj(aNotifyDefaultOrg);
		notifyDefaultOrg.getId = function() {
			return flow.Expr.parse(notifyDefaultOrg.exprType, notifyDefaultOrg.expr, {
						selTch : modelId,
						action : action,
						selTchNum : tchNum
					});
		}
	}
	this.hasNotifyDefaultOrg = function() {
		return (notifyDefaultOrg) ? true : false;
	};
	this.getNotifyDefaultOrg = function() {
		return notifyDefaultOrg
	};
	var setStaff = function(aStaff) {
		var oStaff = flow.Expr.copyObj(aStaff);
		oStaff.getId = function() {
			return flow.Expr.parse(aStaff.exprType, aStaff.valueExpr, {
						selTch : modelId,
						action : action,
						selTchNum : tchNum
					});
		}
		oStaff.getName = function() {
			return flow.Expr.parse(aStaff.exprType, aStaff.nameExpr, {
						selTch : modelId,
						action : action,
						selTchNum : tchNum
					});
		}
		return oStaff;
	}
	this.isSelected = function() {
		return selected
	};
	this.setSelected = function(pSelected) {
		selected = pSelected
	};
	this.select = function() {
		selected = true;
		for (var i = 0; i < excludeTch.length; i++) {
			var oExcludeTch = excludeTch[i];
			oExcludeTch.unSelect();
			if (oExcludeTch.getOwnerPanel()) {
				oExcludeTch.getOwnerPanel().unSelect();
			}
		}
	};
	this.unSelect = function() {
		selected = false;
	};
	this.isEnd = function() {
		return (action == flow.constant.actionType.end)
	}
	this.canChangeNotifyStaff = function() {
		if (this.hasDefaultNotifyStaff() && !defaultNotifyStaff.canChange)
			return false;
		return true;
	}
	this.canChangeStaff = function() {
		if (this.isEnd())
			return false;
		if (this.hasDefaultStaff() && !defaultStaff.canChange)
			return false;
		return (staffCreateType == flow.constant.staffCreateType.deptTree || staffCreateType == flow.constant.staffCreateType.dutyTree || staffCreateType == flow.constant.staffCreateType.groupTree);
	}
	this.canWithoutExecuter = function() {
		if (this.isEnd())
			return true;
		if (staffCreateType == flow.constant.staffCreateType.func)
			return true;
		return false;
	}
	this.canAutoFinish = function() {
		if (!this.isAuto())
			return false;
		if (this.isAuto()) {
			if (this.canWithoutExecuter())
				return true;
			if (this.getExcuteStaffIds())
				return true;
		}
		return false;
	}
	this.setOnCreateExpr = function(aOnCreateExpr) {
		onCreateExpr = flow.Expr.copyObj(aOnCreateExpr)
	};
	this.getOnCreateExpr = function() {
		return onCreateExpr
	};
	this.onCreate = function() {
		if (!onCreateExpr.type || !onCreateExpr.value)
			return true;
		return flow.Expr.exec(onCreateExpr.value, {
					action : action,
					selTch : modelId,
					selStaff : excuteStaffIds,
					selTchNum : tchNum,
					funcType : onCreateExpr.type
				});
	};
	this.setOnBeforeCreateExpr = function(aOnBeforeCreateExpr) {
		onBeforeCreateExpr = flow.Expr.copyObj(aOnBeforeCreateExpr)
	};
	this.onBeforeCreate = function() {
		if (!onBeforeCreateExpr.type || !onBeforeCreateExpr.value)
			return true;
		return flow.Expr.exec(onBeforeCreateExpr.value, {
					action : action,
					selTch : modelId,
					selStaff : excuteStaffIds,
					selTchNum : tchNum,
					funcType : onBeforeCreateExpr.type
				});
	};
	this.getOnAfterCreateExpr = function() {
		return onAfterCreateExpr
	};
	this.setOnAfterCreateExpr = function(aOnAfterCreateExpr) {
		onAfterCreateExpr = flow.Expr.copyObj(aOnAfterCreateExpr);

		onAfterCreateExpr.getExecXML = function() {
			return flow.Expr.getExecXML(onAfterCreateExpr.type, "ON_AFTER_CREATE", onAfterCreateExpr.value, {
						action : action,
						selTch : modelId,
						selStaff : excuteStaffIds,
						funcType : onAfterCreateExpr.type,
						selTchNum : tchNum
					});
		}
	};
	this.onAfterCreate = function() {
		if (!onAfterCreateExpr.type || !onAfterCreateExpr.value || onAfterCreateExpr.type != flow.constant.scriptType.js)
			return;
		flow.Expr.exec(onAfterCreateExpr.value, {
					action : action,
					selTch : modelId,
					selStaff : excuteStaffIds,
					selTchNum : tchNum,
					funcType : flow.constant.scriptType.js
				});
	};
	var getGroupId = function(pGroupIds) {
		var groupIds = "";
		if (pGroupIds != null && pGroupIds != '')
			groupIds = pGroupIds.match(/(\b\d+\b)(?!.*,\1(,|$))/ig);
		if (groupIds == null)
			groupIds = "";
		return groupIds;
	};
	this.asXML = function() {
		var aExecuteStaff = excuteStaffIds.split(",");
		if (this.counterSignCfg.parallel.checked) {
			if (excuteGroupIds != null) {
				var aExecuteGroup = excuteGroupIds.split(",");
			}
			var aXML = [];
			var groupId = "";
			for (var i = 0; i < aExecuteStaff.length; i++) {
				if (excuteGroupIds != null)
					groupId = excuteGroupIds[i];
				aXML[i] = getXML(this, aExecuteStaff[i], groupId, "");
			}
			return aXML.join("");
		}
		if (this.counterSignCfg.serial.checked) {
			return getXML(this, aExecuteStaff[0], excuteGroupIds, excuteStaffIds);
		}
		return getXML(this, excuteStaffIds, excuteGroupIds, "");
		function getXML(oTch, sStaffid, sGroupId, sSerialStaffid) {
			var sXML = '<NEXT_TCH_MOD>' + '<TCH_DESC>' + xmlEncode(oTch.getDesc()) + '</TCH_DESC>' + '<TCH_MOD>' + oTch.getModelId() + '</TCH_MOD>' + '<NEXT_STAFF>' + sStaffid + '</NEXT_STAFF>' + '<SERIAL_STAFF>' + sSerialStaffid + '</SERIAL_STAFF>' + '<NEXT_GROUP>' + getGroupId(sGroupId) + '</NEXT_GROUP>' + '<NOTIFY_STAFFS>' + oTch.getNotifyStaffIds() + '</NOTIFY_STAFFS>' + oTch.getOnAfterCreateExpr().getExecXML() + '<IS_SEND_SMS>' + ((oTch.getSms().selected) ? 1 : 0) + '</IS_SEND_SMS>' + '<IS_SEND_MAIL>' + ((oTch.getMail().selected) ? 1 : 0) + '</IS_SEND_MAIL>' + '<IS_SEND_N_SMS>' + ((oTch.getNotifyCfg().sms.selected) ? 1 : 0) + '</IS_SEND_N_SMS>' + '<IS_SEND_N_MAIL>' + ((oTch.getNotifyCfg().mail.selected) ? 1 : 0) + '</IS_SEND_N_MAIL>' + '</NEXT_TCH_MOD>';
			return sXML;
		}
	}
	this.clone = function() {
		var oClone = new flow.NextTch();
		oClone.setModelId(this.getModelId());
		oClone.setName(this.getName());
		oClone.setStaffCreateType(this.getStaffCreateType());
		oClone.setAction(this.getAction());
		oClone.setSelected(this.isSelected());
		oClone.setShowed(this.isShowed());
		oClone.setOnCreateExpr(this.getOnCreateExpr());
		oClone.setOnAfterCreateExpr(this.getOnAfterCreateExpr());
		if (this.hasDefaultOrg()) {
			oClone.setDefaultOrg(this.getDefaultOrg());
		}
		if (this.hasDefaultNotifyStaff()) {
			oClone.setDefaultNotifyStaff(this.getDefaultNotifyStaff());
		}
		oClone.setExcludeTchs(this.getExcludeTchs());
		oClone.setSms(this.getSms());
		oClone.setMail(this.getMail());
		oClone.setRemark(this.getRemark());
		appendToExclude(oClone);
		return oClone;
		function appendToExclude(oClone) {
			for (var i = 0; i < oClone.getExcludeTchs().length; i++) {
				oClone.getExcludeTchs()[i].pushExcludeTch(oClone);
			}
		}
	}
};
flow.NextTch.createInst = function(xmlNode, context) {
	var modelId = xmlNode.selectSingleNode("TCH_MOD").text;
	var isDefault = getDefault(context, modelId);
	var oCommands = [{
				command : "setModelId",
				param : modelId
			}, {
				command : "setName",
				param : xmlNode.selectSingleNode("TCH_NAME").text
			}, {
				command : "setTchNum",
				param : xmlNode.selectSingleNode("TCH_NUM").text
			}, {
				command : "setRemark",
				param : xmlNode.selectSingleNode("REMARK").text
			}, {
				command : "setAction",
				param : xmlNode.selectSingleNode("TACHE_ACTION").text
			}, {
				command : "setAuto",
				param : (xmlNode.selectSingleNode("IS_AUTO").text == flow.constant.aBoolean.True)
			}, {
				command : "setStaffCreateType",
				param : xmlNode.selectSingleNode("STAFF_CREATE_TYPE").text
			}, {
				command : "setNotifyStaffCreateType",
				param : xmlNode.selectSingleNode("NOTIFY_STAFF_CREATE_TYPE").text
			}, {
				command : "setSelected",
				param : getSelected(isDefault, modelId)
			}, {
				command : "setDisabled",
				param : getDisabled(isDefault, modelId)
			}, {
				command : "setActionRunTitle",
				param : xmlNode.selectSingleNode("ACTION_RUN_TITLE").text
			}, {
				command : "setActionBackTitle",
				param : xmlNode.selectSingleNode("ACTION_BACK_TITLE").text
			}, {
				command : "setActionTransferTitle",
				param : xmlNode.selectSingleNode("ACTION_TRANSFER_TITLE").text
			}, {
				command : "setFilterStaffWhere",
				param : xmlNode.selectSingleNode("FILTER_STAFF_WHERE").text
			}, {
				command : "setSms",
				param : getNotify(xmlNode.selectSingleNode("SMS_JSON").text)
			}, {
				command : "setMail",
				param : getNotify(xmlNode.selectSingleNode("MAIL_JSON").text)
			}, {
				command : "setNotifyCfg",
				param : xmlNode.selectSingleNode("NOTIFY_CFG").text
			}, {
				command : "setShowed",
				param : getShowed(xmlNode, isDefault)
			}, {
				command : "setOnCreateExpr",
				param : {
					type : xmlNode.selectSingleNode("ON_CREATE_TYPE").text,
					value : xmlNode.selectSingleNode("ON_CREATE").text
				}
			}, {
				command : "setOnAfterCreateExpr",
				param : {
					type : xmlNode.selectSingleNode("ON_AFTER_CREATE_TYPE").text,
					value : xmlNode.selectSingleNode("ON_AFTER_CREATE").text
				}
			}, {
				command : "setOnBeforeCreateExpr",
				param : {
					type : xmlNode.selectSingleNode("ON_BEFORE_CREATE_TYPE").text,
					value : xmlNode.selectSingleNode("ON_BEFORE_CREATE").text
				}
			}];
	var iLen = oCommands.length;
	var oNextTch = new flow.NextTch();
	for (var i = 0; i < iLen; i++) {
		var oCommand = oCommands[i];
		oNextTch[oCommand.command](oCommand.param);
	}
	setDefaultStaff(oNextTch, xmlNode, context);
	setDefaultNotifyStaff(oNextTch, xmlNode);
	setDefaultOrg(oNextTch, xmlNode);
	setNotifyDefaultOrg(oNextTch, xmlNode);
	setCounterSignCfg(oNextTch, xmlNode, context)
	return oNextTch;
	function setCounterSignCfg(oNextTch, xmlNode, context) {
		var oCounterSignCfg = flow.Expr.parseJson(xmlNode.selectSingleNode("COUNTERSIGN_CFG").text);
		var serialState = context.getSerialState();
		var canParallel = (xmlNode.selectSingleNode("MULTI_INST").text == "1") ? true : false;
		var canSerial = (xmlNode.selectSingleNode("CAN_SERIAL").text == flow.constant.aBoolean.True) ? true : false;
		// canSerial=(canSerial &&
		// serialState!=flow.constant.serialState.inProgress)?true:false;
		canSerial = getCanSerial(canSerial);
		canParallel = (canParallel && serialState != flow.constant.serialState.inProgress) ? true : false;
		oNextTch.counterSignCfg.canParallel = canParallel;
		oNextTch.counterSignCfg.canSerial = canSerial;
		oNextTch.counterSignCfg.text = oCounterSignCfg.text;
		oNextTch.counterSignCfg.display = (canSerial || canParallel) ? oCounterSignCfg.display : false;
		oNextTch.counterSignCfg.parallel.text = oCounterSignCfg.parallel.text;
		oNextTch.counterSignCfg.parallel.display = (canParallel) ? oCounterSignCfg.parallel.display : false;
		oNextTch.counterSignCfg.parallel.checked = (canParallel) ? oCounterSignCfg.parallel.checked : false;
		oNextTch.counterSignCfg.serial.text = oCounterSignCfg.serial.text;
		oNextTch.counterSignCfg.serial.display = (canSerial) ? oCounterSignCfg.serial.display : false;
		oNextTch.counterSignCfg.serial.checked = (canSerial) ? oCounterSignCfg.serial.checked : false;
		if (!oNextTch.counterSignCfg.serial.display && !oNextTch.counterSignCfg.parallel.display)
			oNextTch.counterSignCfg.display = false;
		function getCanSerial(canSerial) {
			var sAction = oNextTch.getAction();
			var isTransfer = (oNextTch.getAction() == flow.constant.actionType.transfer)
			if (canSerial) {
				if (!isTransfer)
					return true;
				if (serialState != flow.constant.serialState.inProgress)
					return true;
				return false;
			}
			return false;
		}
	}
	function setDefaultNotifyStaff(oNextTch, xmlNode) {
		var value = xmlNode.selectSingleNode("NOTIFY_STAFF_VALUE").text;
		var type = xmlNode.selectSingleNode("NOTIFY_STAFF_TYPE").text;
		if (type && value) {
			var defaultNotifyStaff = {};
			var disabled = xmlNode.selectSingleNode("NOTIFY_STAFF_DISABLED").text;
			var selected = xmlNode.selectSingleNode("NOTIFY_STAFF_SELECTED").text;
			var canChange = xmlNode.selectSingleNode("NOTIFY_STAFF_CAN_CHANGE").text;
			defaultNotifyStaff.canChange = (canChange == flow.constant.aBoolean.True) ? true : false;
			defaultNotifyStaff.exprType = type;
			defaultNotifyStaff.valueExpr = value;
			defaultNotifyStaff.nameExpr = "";
			defaultNotifyStaff.disabled = (disabled == flow.constant.aBoolean.True) ? true : false;
			defaultNotifyStaff.selected = (selected == flow.constant.aBoolean.True) ? true : false;
			oNextTch.setDefaultNotifyStaff(defaultNotifyStaff);
		}
	}
	function setDefaultStaff(oNextTch, xmlNode, context) {
		var value = xmlNode.selectSingleNode("DEFAULT_STAFF_VALUE").text;
		var type = xmlNode.selectSingleNode("DEFAULT_STAFF_TYPE").text;
		var defaultStaff = {};
		if (type && value) {
			var name = xmlNode.selectSingleNode("DEFAULT_STAFF_NAME_VALUE").text;
			var canChange = xmlNode.selectSingleNode("DEFAULT_STAFF_CAN_CHANGE").text;
			var disabled = xmlNode.selectSingleNode("DEFAULT_STAFF_DISABLED").text;
			var selected = xmlNode.selectSingleNode("DEFAULT_STAFF_SELECTED").text;
			defaultStaff.canChange = (canChange == flow.constant.aBoolean.True) ? true : false;
			defaultStaff.nameExpr = name;
			defaultStaff.exprType = type;
			defaultStaff.valueExpr = value;
			defaultStaff.disabled = (disabled == flow.constant.aBoolean.True) ? true : false;
			defaultStaff.selected = (selected == flow.constant.aBoolean.True) ? true : false;
			oNextTch.setDefaultStaff(defaultStaff);
		} else {
			var globalDefStaffCfg = context.getGlobalDefStaffCfg();
			if (globalDefStaffCfg) {
				value = globalDefStaffCfg.valueExpr;
				type = globalDefStaffCfg.exprType;
				var name = globalDefStaffCfg.nameExpr;
				var canChange = globalDefStaffCfg.canChange;
				var disabled = globalDefStaffCfg.disabled;
				var selected = globalDefStaffCfg.selected;
				defaultStaff.canChange = (canChange == flow.constant.aBoolean.True) ? true : false;
				defaultStaff.nameExpr = name ? name : "";
				defaultStaff.exprType = type ? type : flow.constant.scriptType.js;
				defaultStaff.valueExpr = value;
				defaultStaff.disabled = (disabled == flow.constant.aBoolean.True) ? true : false;
				defaultStaff.selected = (selected == flow.constant.aBoolean.True) ? true : false;
				oNextTch.setDefaultStaff(defaultStaff);
			}
		}
	}
	function setDefaultOrg(oNextTch, xmlNode) {
		var value = xmlNode.selectSingleNode("ROOT_ORG_VALUE").text;
		var type = xmlNode.selectSingleNode("ROOT_ORG_TYPE").text;
		if (type && value) {
			var canChange = xmlNode.selectSingleNode("ROOT_ORG_CAN_CHANGE").text;
			var param = xmlNode.selectSingleNode("ROOT_ORG_PARAM").text;
			var defaultOrg = {};
			defaultOrg.otherParam = (param) ? flow.Expr.parseJson(param) : null;
			defaultOrg.canChange = (canChange == flow.constant.aBoolean.True) ? true : false;
			defaultOrg.exprType = type;
			defaultOrg.expr = value;
			oNextTch.setDefaultOrg(defaultOrg);
		}
	}
	function setNotifyDefaultOrg(oNextTch, xmlNode) {
		var value = xmlNode.selectSingleNode("NOTIFY_ROOT_ORG_VALUE").text;
		var type = xmlNode.selectSingleNode("NOTIFY_ROOT_ORG_TYPE").text;
		if (type && value) {
			var canChange = xmlNode.selectSingleNode("NOTIFY_ROOT_ORG_CAN_CHANGE").text;
			var defaultOrg = {};
			defaultOrg.otherParam = null;
			defaultOrg.canChange = (canChange == flow.constant.aBoolean.True) ? true : false;
			defaultOrg.exprType = type;
			defaultOrg.expr = value;
			oNextTch.setNotifyDefaultOrg(defaultOrg);
		}
	}
	function getNotify(jsonData) {
		var oJson = flow.Expr.parseJson(jsonData);
		var oNotify = {};
		oNotify.display = (oJson.display == flow.constant.aBoolean.True) ? true : false;
		oNotify.selected = (oJson.selected == flow.constant.aBoolean.True) ? true : false;
		oNotify.canChange = (oJson.canChange == flow.constant.aBoolean.True) ? true : false;
		return oNotify;
	}
	function getShowed(xmlNode, isDefault) {
		var relateTchClosed = (xmlNode.selectSingleNode("CON_TCH_CLOSED").text == "1") ? true : false;
		if (!relateTchClosed)
			return false;
		if (context.isNextTchAuto())
			return true;
		if (!isDefault && context.hasDefaultTch() && context.getDefaultTch().hiddenOther)
			return false;
		return true;
	}
	function getSelected(isDefault, modelId) {
		if (context.isNextTchAuto())
			return true;
		if (isDefault && modelId.isInArray(context.getDefaultTch().selectedTchIds.split(",")))
			return true;
		if (!context.hasDefaultTch() && modelId == formContext.FLOW.TCH_MOD && context.getSerialState() == flow.constant.serialState.inProgress)
			return true;
		return false;
	}
	function getDisabled(isDefault, modelId) {
		if (context.isNextTchAuto())
			return true;
		if (isDefault && context.getDefaultTch().selected && !context.getDefaultTch().canChange)
			return true;
		return false;
	}
	function getDefault(context, modelId) {
		if (!context.hasDefaultTch())
			return false;
		return modelId.isInArray(context.getDefaultTch().ids.split(","))
	}
};
flow.TchIterator = function() {
	var tchs;
	this.setTchs = function(aTch) {
		tchs = aTch
	};
	this.getTchs = function() {
		return tchs
	};
	this.push = function(tch) {
		tchs.push(tch)
	};
	this.getTchById = function(tchId) {
		for (var i = 0; i < tchs.length; i++) {
			var oTch = tchs[i];
			if (oTch.getModelId() == tchId) {
				return oTch;
			}
		}
		return null;
	}

	this.getTchByNum = function(tchNum) {
		for (var i = 0; i < tchs.length; i++) {
			var oTch = tchs[i];
			if (oTch.getTchNum() == tchNum) {
				return oTch;
			}
		}
		return null;
	}
	this.hasSelectedTch = function() {
		for (var i = 0; i < tchs.length; i++) {
			if (tchs[i].isSelected())
				return true;
		}
		return false;
	}
	this.getSelectedTch = function() {
		for (var i = 0; i < tchs.length; i++) {
			if (tchs[i].isSelected())
				return tchs[i];
		}
		return null;
	}
	this.pop = function(oTch) {
		for (var i = 0; i < oTch.getExcludeTchs().length; i++) {
			oTch.getExcludeTchs()[i].popExcludeTch(oTch);
		}
		for (var i = 0; i < tchs.length; i++) {
			if (tchs[i] == oTch) {
				tchs.splice(i, 1);
				return;
			}
		}
	}
	this.popOther = function(oTch) {
		var iLen = tchs.length;
		for (var i = 0; i < iLen; i++) {
			tchs.pop();
		}
		oTch.clearExcludeTch();
		oTch.setSelected(true);
		tchs.push(oTch);
	}
	this.isSingleSelect = function() {
		for (var i = 0; i < tchs.length; i++) {
			for (var j = i + 1; j < tchs.length; j++) {
				if (!tchs[i].isExclude(tchs[j]))
					return false;
			}
		}
		return true;
	}
	this.onCreate = function() {
		for (var i = 0; i < tchs.length; i++) {
			var oTch = tchs[i];
			if (oTch.isSelected() && !oTch.onCreate())
				return false;
		}
		return true;
	}
	this.setDefault = function() {
		for (var i = 0; i < tchs.length; i++) {
			var oTch = tchs[i];
       	   if(oTch.isSelected()){
			  if(oTch.hasDefaultStaff() && oTch.getDefaultStaff().selected)
		         oTch.setExcuteStaffIds(oTch.getDefaultStaff().getId());
		      if(oTch.hasDefaultNotifyStaff() &&  oTch.getDefaultNotifyStaff().selected)
		         oTch.setNotifyStaffIds(oTch.getDefaultNotifyStaff().getId());
		   }
		}
	}
	this.getSelectedTchsInfo = function() {
		var tchInfo = {
			action : "",
			staffId : "",
			modelId : "",
			modelNum : ""
		};
		for (var i = 0; i < tchs.length; i++) {
			var oTch = tchs[i];
			if (oTch.isSelected()) {
				tchInfo.action += oTch.getAction() + ",";
				tchInfo.staffId += oTch.getExcuteStaffIds() + "|";
				tchInfo.modelId += oTch.getModelId() + ",";
				tchInfo.modelNum += oTch.getTchNum() + ",";
			}
		}
		tchInfo.action = tchInfo.action.slice(0, -1);
		tchInfo.staffId = tchInfo.staffId.slice(0, -1);
		tchInfo.modelId = tchInfo.modelId.slice(0, -1);
		tchInfo.modelNum = tchInfo.modelNum.slice(0, -1);
		return tchInfo;
	},
	// add by chenzw 2016-5-31 flowSubmit方法中增加选中的下一环节信息
	this.getSelectedTchsInfoAsJson = function() {
		var tchsInfoArray = [];
		for (var i = 0; i < tchs.length; i++) {
			var oTch = tchs[i];
			if (oTch.isSelected()) {
				tchsInfoArray.push({
					ACTION : oTch.getAction(),
					EXCUTE_STAFF_IDS : oTch.getExcuteStaffIds(),
					TCH_MOD : oTch.getModelId(),
					TCH_NUM : oTch.getTchNum()
				})
			}
		}
		return tchsInfoArray;
	},
	this.onAfterCreate = function(oTch) {
		if (oTch) {
			oTch.onAfterCreate();
			return;
		}
		for (var i = 0; i < tchs.length; i++) {
			var oTch = tchs[i];
			if (oTch.isSelected())
				oTch.onAfterCreate();
		}
	}
	this.getSelectedTchXML = function() {
		var aTchXML = [];
		for (var i = 0; i < tchs.length; i++) {
			var oTch = tchs[i];
			if (oTch.isSelected())
				aTchXML[i] = oTch.asXML();
		}
		return aTchXML.join("");
	}
}
flow.TchIterator.createInst = function(xmlNodes, context) {
	var iLen = xmlNodes.length;
	var tchInterator = new flow.TchIterator();
	var aTch = [];
	var aExcludeTch = [];
	for (var i = 0; i < iLen; i++) {
		var oNextTch = flow.NextTch.createInst(xmlNodes[i], context);
		if (oNextTch.isShowed()) {
			var excludeModelIds = xmlNodes[i].selectSingleNode("EXCLUDE_PATH").text;
			aTch.push(oNextTch);
			aExcludeTch.push(excludeModelIds);
		}
	}
	tchInterator.setTchs(aTch);
	if (context.isNextTchAuto())
		return tchInterator;
	if (context.hasDefaultTch() && context.getDefaultTch().selected && !context.getDefaultTch().canChange)
		return tchInterator;
	iLen = aTch.length;
	for (var i = 0; i < iLen; i++) {
		var oTch = aTch[i];
		for (var j = i + 1; j < iLen; j++) {
			var oOtherTch = aTch[j];
			var isExclude = (oTch.getAction() != oOtherTch.getAction() || oTch.getModelId().isInArray(aExcludeTch[j].split(";")))
			if (isExclude) {
				oTch.pushExcludeTch(oOtherTch);
				oOtherTch.pushExcludeTch(oTch);
			}
		}
	}
	tchInterator.setTchs(aTch);
	return tchInterator;
}

function showLayer(oParam) {
	tache.Service.init(oParam);
}

Layer = function(oFeatures) {
	this.show = function() {
		oLayer = oFormDoc.getElementById(winId);
		if (oLayer) {
			createWinMask();
			oLayer.style.display = "block";
			setAreaAndPos();
		}
		return this;
	}
	this.$ = function(elementId) {
		return oLayer.all(elementId);
	}
	this.close = function() {
		var e = oFormWin.event;
		// e && (e.cancelBubble = true);
		var oWin = oFormDoc.getElementById(winId);
		oWin.style.display = "none";
		oFormDoc.body.style.overflow = "auto";
		oToobarDoc.getElementById("FL_EGN_MASK").style.display = "none";
		oFormDoc.getElementById("FL_EGN_MASK").style.display = "none";
		onClose && onClose();
	}
	this.getDomEle = function() {
		return oLayer;
	}
	this.getRealHeight = function() {
		var iCurHeight = oLayer.all("FL_EGN_BODY").style.posHeight;
		oLayer.all("FL_EGN_BODY").style.posHeight = 0;
		var iHeight = oLayer.all("FL_EGN_BODY").scrollHeight;
		oLayer.all("FL_EGN_BODY").posHeight = iCurHeight;
		return iHeight + iBottomHeight + titleBarHeight;
	}
	this.reSetAreaAndPos = function() {
		height = parseInt(oFeatures.height, 10);
		setAreaAndPos();
	}
	function init() {
		var sWinTemplate = oTemplate.XMLDocument.selectSingleNode("/root/win_template").text;
		sWinTemplate = sWinTemplate.replace("%WIN_ID%", winId);
		sWinTemplate = sWinTemplate.replace("%TITLE%", title);
		oFormDoc.body.insertAdjacentHTML("afterBegin", sWinTemplate);
		oLayer = oFormDoc.getElementById(winId);
		oLayer.all("FL_EGN_BODY").innerHTML = bodyHTML;
		oLayer.all("FL_EGN_BOTTOM").innerHTML = bottomHTML;
		oLayer.all("FL_EGN_WIN_CLOSE").onclick = function() {
			self.close();
		}
		oLayer.all("FL_EGN_TITLE_BAR").onmousedown = function() {
			drag(oLayer);
		};
		Layer.instances[winId] = self;
		setAreaAndPos();
	}
	function setAreaAndPos() {
		var iClientHeight = oBody.offsetHeight;
		var iClientWidth = oBody.offsetWidth;
		var iScrollTop = oBody.scrollTop;
		var iScrollLeft = oBody.scrollLeft;
		self.$("FL_EGN_BOTTOM").style.posHeight = iBottomHeight;
		self.$("FL_EGN_TITLE_BAR").style.posHeight = titleBarHeight;
		if (fullScreen) {
			oLayer.style.posHeight = iClientHeight;
			oLayer.style.posWidth = iClientWidth;
			oLayer.style.posTop = iScrollTop;
			oLayer.style.posLeft = iScrollLeft;
			self.$("FL_EGN_BODY").style.posHeight = iClientHeight - titleBarHeight - iBottomHeight;
		} else {
			var iHeight = (height > iClientHeight) ? iClientHeight : height;
			var iWidth = (width > iClientWidth) ? iClientWidth : width;
			var iTop = ((iClientHeight - iHeight) / 2) + iScrollTop - (formContext.getToolbar().height / 2);
			var iLeft = iScrollLeft + ((iClientWidth - iWidth) / 2);
			oLayer.style.posHeight = iHeight;
			oLayer.style.posWidth = iWidth;
			oLayer.style.posTop = (iTop < iScrollTop) ? iScrollTop : iTop;
			oLayer.style.posLeft = (iLeft < iScrollLeft) ? iScrollLeft : iLeft;
			self.$("FL_EGN_BODY").style.posHeight = (iHeight - titleBarHeight - iBottomHeight);
		}
	}
	function createWinMask() {
		createMask(oToobarDoc);
		createMask(oFormDoc);
		function createMask(oDoc) {
			var oMask = oDoc.getElementById("FL_EGN_MASK");
			oDoc.body.style.overflow = "hidden";
			if (oMask) {
				oMask.style.display = "block";
				return;
			}
			var ua = navigator.userAgent.toLowerCase();
			var ieVersion = ua.match(/msie ([\d.]+)/)[1];
			var sElement = (ieVersion > 6) ? "div" : "iframe";
			var oIframe = oDoc.createElement(sElement);
			oIframe.id = "FL_EGN_MASK";
			oIframe.style.width = oDoc.body.clientWidth + oDoc.body.scrollWidth + "px";
			oIframe.style.height = oDoc.body.clientHeight + oDoc.body.scrollHeight + "px";
			oIframe.style.position = "absolute";
			oIframe.style.top = "0px";
			oIframe.style.left = "0px";
			oIframe.style.backgroundColor = "rgb(255, 255, 255)";
			oIframe.style.filter = "alpha(opacity=50)";
			oIframe.style.opacity = "0.5";
			oIframe.style.zIndex = "999";
			oIframe.frameBorder = '0';
			oIframe.scrolling = "no";
			oDoc.body.insertAdjacentElement("beforeEnd", oIframe);
		}
	}
	function drag(oWin) {
		var e = oFormWin.event;
		var oBody = oFormDoc.body
		var x = e.clientX + oBody.scrollLeft - oWin.style.pixelLeft
		var y = e.clientY + oBody.scrollTop - oWin.style.pixelTop
		var move = function() {
			if (e.button == 1) {
				oWin.style.pixelLeft = e.clientX + oBody.scrollLeft - x
				oWin.style.pixelTop = e.clientY + oBody.scrollTop - y
			} else
				oFormDoc.detachEvent("onmousemove", move)

		}
		oFormDoc.attachEvent("onmousemove", move);
		e.cancelBubble = true;
	}
	var iBottomHeight = 30;
	var titleBarHeight = 40;
	var fullScreen = parseInt(oFeatures.fullScreen || "0");
	var winId = oFeatures.winId;
	var height = parseInt(oFeatures.height || "480", 10);
	var width = parseInt(oFeatures.width || "650", 10);
	var title = oFeatures.title || flowFormMenuLang.window;
	var bodyHTML = oFeatures.html.body;
	var bottomHTML = oFeatures.html.bottom;
	var onClose = oFeatures.onclose;
	var oFormWin = formContext.getWin().form;
	var oFormDoc = oFormWin.document;
	var oToobarDoc = formContext.getWin().toolbar.document;
	var oBody = oFormDoc.body;
	var oLayer;
	var self = this;
	createWinMask();
	init();
}
Layer.open = function(oFeatures) {
	var oLayer = new Layer(oFeatures);
	return oLayer.show();
}
Layer.instances = {};
Message = {
	prompt : function(sPromptText, layer, oAction) {
		this.init();
		this.hiddenAll();
		var oPrompt = this.dom.prompt;
		oPrompt.style.display = "block";
		oPrompt.all("FL_EGN_PROMPT_TEXT").innerText = sPromptText;
		this.position(oPrompt, layer);
		this.dettachTopWinClose(this);
		oPrompt.onclick = function() {
			oPrompt.style.display = "none";
			if (oAction && oAction.onClick)
				oAction.onClick();
		}
		window.setTimeout(function() {
					oPrompt.style.display = "none"
				}, 1000);
	},
	loading : function(sWaitText, layer) {
		if (this.isloading)
			return;
		this.init();
		this.hiddenAll();
		this.mask(layer);
		var oWait = this.dom.wait;
		oWait.style.display = "block";
		oWait.all("FL_EGN_WAIT_TEXT").innerText = sWaitText;
		this.position(oWait, layer);
		this.attachTopWinClose(this);
		this.isloading = true;
	},
	xmlHttpLoading : function(oXMLHttp, oText, layer, oAction) {
		if (oXMLHttp.readyState != 4) {
			this.loading(oText.wait, layer);
			return;
		}
		if (oXMLHttp.readyState == 4) {
			if (oXMLHttp.status != 200) {
				var msg = formatResource(flowFormMenuLang.background_err_code, oXMLHttp.status);
				this.fail(msg, layer);
				return;
			}
			var errElement = getErrorCode(oXMLHttp);
			if (!errElement) {
				this.fail(flowFormMenuLang.xml_doc_err, layer);
				return;
			}
			if (errElement.text == "0") {
				this.prompt(oText.succeed, layer, oAction);
				if (oAction && oAction.onSucceed)
					oAction.onSucceed();
				return;
			}
			this.fail(errElement.nextSibling.text, layer);
		}
	},
	fail : function(errMsg, oLayer) {
		this.init();
		this.hiddenAll();
		var oFail = this.dom.fail;
		oFail.innerText = errMsg;
		this.position(oFail, oLayer);
		this.dettachTopWinClose(this);
		window.setTimeout(function() {
					oFail.style.display = "none"
				}, 2000);
	},
	dom : null,
	isloading : false,
	init : function() {
		var sMsgTemplate = oTemplate.XMLDocument.selectSingleNode("/root/msg_template").text;
		var oFormDoc = formContext.getWin().form.document;
		oFormDoc.body.insertAdjacentHTML("beforeEnd", sMsgTemplate);
		this.dom = {};
		this.dom.waitMask = oFormDoc.getElementById("FL_EGN_WAIT_MASK");
		this.dom.wait = oFormDoc.getElementById("FL_EGN_WAIT");
		this.dom.prompt = oFormDoc.getElementById("FL_EGN_PROMPT");
		this.dom.fail = oFormDoc.getElementById("FL_EGN_FAIL");
		this.init = function() {
		}
		return this.init();
	},
	hiddenAll : function() {
		this.dom.wait.style.display = "none";
		this.dom.waitMask.style.display = "none";
		this.dom.fail.style.display = "none";
		this.dom.prompt.style.display = "none";
		this.isloading = false;
	},
	position : function(oMsg, oLayer) {
		oMsg.style.display = "block";
		oMsg.style.width = "0px";
		var iWidth = (oMsg.scrollWidth > 500) ? 500 : oMsg.scrollWidth;
		oMsg.style.posWidth = iWidth;
		var oPos = this.getLayerPos(oLayer);
		oMsg.style.posTop = oPos.top + (oPos.height / 2);
		oMsg.style.posLeft = oPos.left + ((oPos.width - iWidth) / 2);
	},
	mask : function(oLayer) {
		var oWaitMask = this.dom.waitMask;
		var oPos = this.getLayerPos(oLayer)
		oWaitMask.style.display = "block";
		oWaitMask.style.posWidth = oPos.width;
		oWaitMask.style.posHeight = oPos.height;
		oWaitMask.style.posTop = oPos.top;
		oWaitMask.style.posLeft = oPos.left;
	},
	getLayerPos : function(oLayer) {
		var oFormBody = formContext.getWin().form.document.body;
		var oRect = oLayer.getBoundingClientRect();
		var iWidth = oRect.right - oRect.left;
		var iHeight = oRect.bottom - oRect.top;
		var iLeft = oRect.left + oFormBody.scrollLeft
		var iTop = oRect.top + oFormBody.scrollTop;
		return {
			top : iTop,
			left : iLeft,
			width : iWidth,
			height : iHeight
		};
	},
	confirmClose : function() {
		top.window.event.returnValue = flowFormMenuLang.processing_confirm_close;
	},
	attachTopWinClose : function(self) {
		top.window.attachEvent("onbeforeunload", self.confirmClose);
	},
	dettachTopWinClose : function(self) {
		top.window.detachEvent("onbeforeunload", self.confirmClose);
	}
}
flow.util = {
	autoWidth : function(oElement) {
		var iWidth = 0;
		getChildWidth(oElement);
		oElement.style.width = (iWidth == 0) ? '0px' : (iWidth + 1) + 'px';
		function getChildWidth(oElement) {
			var oChilds = oElement.children;
			for (var i = 0; i < oChilds.length; i++) {
				var oChild = oChilds(i);
				var margin = getMargin(oChild);
				var oRect = oChild.getBoundingClientRect();
				var childWidth = oRect.right - oRect.left;
				if (oChild.children.length) {
					iWidth += (childWidth) ? margin.left + margin.right : 0;
					getChildWidth(oChild);
				} else {
					if (oChild.style.clear)
						continue;
					var realWidth = (childWidth) ? childWidth + margin.left + margin.right : 0;
					iWidth += realWidth;
				}
			}
		}
		function getMargin(oElement) {
			var mLeft = (oElement.style.marginLeft) ? parseInt(oElement.style.marginLeft) : 0;
			var mRight = (oElement.style.marginRight) ? parseInt(oElement.style.marginRight) : 0;
			return {
				left : mLeft,
				right : mRight
			}
		}
	}
}
tache = {}
tache.constant = {
	actionImage : {
		run : ["forwardTache.gif", "forwardTacheCopy.gif", "forwardTacheDel.gif", flowFormMenuLang.go_forward],
		"return" : ["backTache.gif", "backTacheCopy.gif", "backTacheDel.gif", flowFormMenuLang.go_back],
		end : ["forwardTache.gif", "forwardTacheCopy.gif", "forwardTacheDel.gif", flowFormMenuLang.be_completed],
		transfer : ["tranTache.gif", "tranTacheCopy.gif", "tranTacheDel.gif", flowFormMenuLang.turn_over]
	},
	opinionType : {
		hidden : "H",
		option : "SO",
		require : "SR"
	},
	selType : {
		radio : "radio",
		checkbox : "checkbox"
	},
	handleType : {
		execute : '1',
		notify : '2'
	}
}
tache.Service = {
	isShowFlowSuccess : true,
	context : null,
	tchIterator : null,
	param : null,
	isLayerShow : false,
	layer : null,
	formDoc : null,
	isSingleSelect : true,
	isShowEndtask : false,
	init : function(aParam) {
		var oToobarDoc = formContext.getWin().toolbar.document;
		var oFormDoc = formContext.getWin().form.document;
		this.formDoc = oFormDoc;
		this.param = aParam;
		var aDispatcher = {};
		aDispatcher[flow.constant.operType.single] = function() {
			copyContextAndTchs(aParam, this);
			this.isShowEndtask = false
		};
		aDispatcher[flow.constant.operType.more] = function() {
			copyContextAndTchs(aParam, this);
			this.isSingleSelect = false;
			this.isShowEndtask = true;
		};
		aDispatcher[flow.constant.operType.endTask] = function() {
			copyContext(aParam, this);
			this.tchIterator = null;
			this.isShowEndtask = true;
		};
		aDispatcher[flow.constant.operType.directFlow] = function() {
			rebuildContextAndTchs(aParam, this);
			this.isSingleSelect = this.tchIterator.isSingleSelect();
			this.isShowEndtask = true;
		};
		aDispatcher[aParam.type].call(this);
		initLayer(this);
		function copyContextAndTchs(aParam, oService) {
			oService.tchIterator = aParam.tchIterator;
			oService.context = aParam.context;
		}
		function copyContext(aParam, oService) {
			oService.context = aParam.context;
		}
		function rebuildContextAndTchs(aParam, oService) {
			copyContextAndTchs(aParam, oService);
		}
		function initLayer(oService) {
			showLayer(oService);
			oService.isLayerShow = true;
			function showLayer(oService) {
				var oFeatures = flow.Expr.copyObj(oService.context.getLayerStyle());
				oFeatures.winId = "FL_EGN_WIN";
				oFeatures.title = flowFormMenuLang.tch_process;
				oFeatures.html = {};
				oFeatures.html.body = oTemplate.XMLDocument.selectSingleNode("/root/flow_template").text;
				oFeatures.html.bottom = oTemplate.XMLDocument.selectSingleNode("/root/flow_bottom_template").text;
				oFeatures.onClose = function() {
					oService.isLayerShow = false
				};
				var layer = Layer.instances[oFeatures.winId];
				if (layer) {
					layer.show();
				} else {
					layer = Layer.open(oFeatures);
					appendDiv(formContext.apendElement);
					onAppend(formContext);
					layer.$("FL_EGN_RETURN").onclick = function() {
						oService.closeLayer();
					}
					layer.$("FL_EGN_SUBMIT").onclick = function() {
						oService.save();
					}
				}
				oService.layer = layer;
				oService.setFlowName();
				oService.setExecDesc();
				if (!oService.showTacheList()) {
					layer.close();
				}
				tache.opinionCtrl.init(oService.context, layer);
				tache.attachCtrl.init(oService, layer);
				function onAppend(formContext) {
					if (formContext.getWin().form.onAppend) {
						formContext.getWin().form.onAppend();
					}
				}
				function appendDiv(aDiv) {
					var oAppendDivContainer = layer.$("FL_EGN_APPEND_DIV");
					if (aDiv.length == 0) {
						oAppendDivContainer.style.display = "none";
						return;
					}
					for (var i = 0; i < aDiv.length; i++) {
						oAppendDivContainer.insertAdjacentElement("beforeEnd", aDiv[i]);
						aDiv[i].style.display = '';
						aDiv[i].style.visibility = '';
						aDiv[i].style.border = '1px solid #436c80';
						aDiv[i].style.width = '100%';
						setCustCss(aDiv[i]);
					}
					function setCustCss(oDiv) {
						if (oDiv.styleAtPopup)
							oDiv.style.cssText += ";" + oDiv.getAttribute("atPopupStyle");
						var iLen = oDiv.all.length;
						for (var i = 0; i < iLen; i++) {
							var oChild = oDiv.all(i);
							if (oChild.getAttribute("atPopupStyle"))
								oChild.style.cssText = oChild.getAttribute("atPopupStyle");
						}
					}
				}
			}
		}
	},
	closeLayer : function() {
		if (!this.isLayerShow)
			return;
		this.layer.close();
	},
	showTacheList : function() {
		var self = this;
		var oTchsDiv = this.layer.$("FL_ENG_TCHS");
		var sTchTemplate = oTemplate.XMLDocument.selectSingleNode("/root/tch_template").text;
		var sEndTaskTemplate = oTemplate.XMLDocument.selectSingleNode("/root/end_task_template").text;
		var sMulityTchTemplate = oTemplate.XMLDocument.selectSingleNode("/root/mulity_tch_template").text;
		var sUserTemplate = oTemplate.XMLDocument.selectSingleNode("/root/user_template").text;
		var sFloat = this.isSingleSelect ? "left" : "none"
		sTchTemplate = sTchTemplate.replace('%TCH_FLOAT_STYLE%', sFloat);
		sEndTaskTemplate = sEndTaskTemplate.replace('%TCH_FLOAT_STYLE%', sFloat);
		var template = {
			normal : sTchTemplate,
			endTask : sEndTaskTemplate,
			mulityTch : sMulityTchTemplate,
			user : sUserTemplate
		};
		var panelManager = tache.PanelManager.createInst(this, template);
		if (!panelManager)
			return null;
		(this.isSingleSelect) ? appendSingleTchPanels() : appendMutilyTchPanel();
		function appendSingleTchPanels() {
			oTchsDiv.innerHTML = sMulityTchTemplate;
			var oContainer = oTchsDiv.all('FL_EGN_TCHS_ROW');
			oContainer.innerHTML = panelManager.getSingeleTchsHTML();
			self.layer.$("FL_EGN_USER_ROW").style.display = "none";
			self.layer.$("FL_EGN_TCH_USERS").innerHTML = "";
			panelManager.setPanelsEvent(oContainer);
		}

		function appendMutilyTchPanel() {
			oTchsDiv.innerHTML = panelManager.getMulityTchsHTML();
			var oUserRows = oTchsDiv.all('FL_EGN_USER_ROW');
			var oUsers = oTchsDiv.all('FL_EGN_TCH_USERS');
			var iLen = oUserRows.length;
			for (var i = 0; i < iLen; i++) {
				oUserRows[i].style.display = "none";
				oUsers[i].innerHTML = "";
			}
			panelManager.setPanelsEvent(oTchsDiv);
		}
		return panelManager;
	},
	rebuildAll : function() {
		if (!this.isLayerShow)
			return;
		this.setFlowName();
		if (this.param.type != flow.constant.operType.endTask) {
			this.rebuildTchs();
			this.rebuildStaff();
		}
		this.rebuildOpinion();
	},
	rebuildTchs : function() {
		if (!this.isLayerShow)
			return;
		if (!this.context.hasNextTchHook())
			return;
		if (this.context.isNextTchAuto())
			return;
		var defaultIds = this.context.getDefaultTch() ? this.context.getDefaultTch().ids : "";
		var prevContext = {
			selectedIds : this.tchIterator.getSelectedTchsInfo().modelId,
			defaultIds : defaultIds
		};
		this.context.resetByHook();
		if (isUnchange(prevContext, this.context))
			return;
		var aDispatcher = {}
		aDispatcher[flow.constant.operType.single] = function() {
			singleModel(prevContext, this.context, this);
		};
		aDispatcher[flow.constant.operType.more] = function() {
			reSetTchIterator(prevContext, this.context, this);
		};
		aDispatcher[flow.constant.operType.directFlow] = function() {
			reSetTchIterator(prevContext, this.context, this);
		};
		aDispatcher[this.param.type].call(this);
		function singleModel(prevContext, curContext, oService) {
			var sCurTchIds = prevContext.selectedIds;
			sCurTchIds = sCurTchIds.split(",")[0];// 多实例环节拷贝时只取单个环节Id
			if (sCurTchIds.isInArray(curContext.getDefaultTch().ids))
				return;
			oService.tchIterator = flow.Service.setTchIterator(curContext.getXMLNode());
			oService.isSingleSelect = true;
			oService.showTacheList();
		}
		function reSetTchIterator(prevContext, curContext, oService) {
			oService.tchIterator = flow.Service.setTchIterator(curContext.getXMLNode());
			if (oService.tchIterator.getTchs().length == 1 && !oService.context.hasUnClosedConnTch()) {
				oService.tchIterator.getTchs()[0].setSelected(true);
			}
			oService.isSingleSelect = oService.tchIterator.isSingleSelect();
			oService.showTacheList();
		}
		function isUnchange(prevContext, curContext) {
			var sPrevDefaultTchIds = prevContext.defaultIds;
			var scurDefaultTchIds = curContext.getDefaultTch().ids;
			var sPrev = sPrevDefaultTchIds.split(",").sort().join(",");
			var sCur = scurDefaultTchIds.split(",").sort().join(",");
			return (sPrev == sCur);
		}
	},
	rebuildStaff : function() {
		this.tchIterator.setDefault();
		var oTchs = this.tchIterator.getTchs();
		for (var i = 0; i < oTchs.length; i++) {
			var oTch = oTchs[i];
			if (oTch.isSelected()) {
				oTch.getOwnerPanel().setDefaultByHook();
			} else {
				if (oTch.getOwnerPanel().isUserLoaded()) {
					if (oTch.hasDefaultStaff())
						oTch.setExcuteStaffIds(oTch.getDefaultStaff().getId());
					if (oTch.hasDefaultNotifyStaff())
						oTch.setNotifyStaffIds(oTch.getDefaultNotifyStaff().getId());
					oTch.getOwnerPanel().setDefaultByHook();
				}
			}
		}
	},
	rebuildOpinion : function() {
		var oOpinionInput = this.layer.$("FL_EGN_OPINION_INPUT");
		var sDefaultValue = this.context.getOpinion().getDefaultValue();
		if (sDefaultValue != '')
			oOpinionInput.value = sDefaultValue;
	},
	setFlowName : function() {
		var oFlowRow = this.layer.$("FL_EGN_FLOW_NAME_ROW");
		var oFlowName = this.layer.$("FL_EGN_FLOW_NAME_VALUE");
		var context = this.context;
		if (!context.getWinCfg().showFlowName) {
			oFlowRow.style.display = "none";
		}
		if (!isFlowBegin()) {
			oFlowRow.style.display = "none";
			return;
		}
		oFlowName.innerText = context.getDefaultFlowName().get();
		context.setFlowName(oFlowName.innerText);
		oFlowName.onblur = function() {
			context.setFlowName(this.innerText);
		};
	},
	setExecDesc : function() {
		if (this.context.getExecDesc() != "") {
			var oExecDescRow = this.layer.$("FL_EGN_EXEC_DESC_ROW");
			oExecDescRow.style.display = "";
			oExecDescRow.all("FL_EGN_EXEC_DESC_VALUE").innerHTML = this.context.getExecDesc();
		}
	},
	save : function() {
		var self = this;
		if (!validate(this.context, this.tchIterator))
			return;
		if (!flow.Service.onBeforeSubmit(null, this.tchIterator))
			return;
		var oSendXML = flow.Service.getSendXML(null, this.tchIterator);
		if (oSendXML.selectSingleNode("/root/FLOW/ATACHES").childNodes.length == 0)
			tache.attachCtrl.appendXML(oSendXML);
		flow.Service.save(oSendXML, null, this.tchIterator, true);
		function validate(context, tchIterator) {
			var sOpinion = context.getOpinion().getValue();
			if (tache.opinionCtrl.isInvalid(context)) {
				return showErr(flowFormMenuLang.please_input_opinion);
			}
			if (sOpinion.Tlength() > 4000) {
				return showErr(flowFormMenuLang.opinion_size_exceed_4000);
			}
			if (!context.hasUnClosedConnTch() && tchIterator && !tchIterator.hasSelectedTch()) {
				return showErr(flowFormMenuLang.please_select_next_tch);
			}
			if (tache.attachCtrl.getFilesQueuedNum() > 0) {
				var msg = formatResource(flowFormMenuLang.attach_uploading_wait, tache.attachCtrl.getFilesQueuedNum());
				return showErr(msg);
			}
			var isEndTask = (self.isShowEndtask && (!tchIterator || !tchIterator.hasSelectedTch()));
			if (isEndTask) {
				if (self.param.eleOnLayer && !flow.Service.isFormValidate("endTask", context.getValidateMod()))
					return false;
				return true;
			}
			for (var i = 0; i < tchIterator.getTchs().length; i++) {
				var oTch = tchIterator.getTchs()[i];
				if (oTch.isSelected()) {
					if (self.param.eleOnLayer && !isFlowBegin()) {
						if (!flow.Service.isFormValidate(oTch.getAction(), context.getValidateMod()))
							return false;
					}
					if (!oTch.getExcuteStaffIds() && !oTch.canWithoutExecuter()) {
						var msg = formatResource(flowFormMenuLang.please_select_tch_staff, oTch.getName());
						return showErr(msg);
					}
				}
			}
			return true;
		}
		function showErr(sErrMsg) {
			Message.fail(sErrMsg, self.layer.getDomEle());
			return false;
		}
	}
}

tache.PanelManager = function(oTacheService, oTemplate) {
	var tchPanels;
	var endTaskPanel;
	var isSingleSelect = oTacheService.isSingleSelect;
	this.tchService = oTacheService;
	this.setTchPanels = function(aTchPanels) {
		tchPanels = aTchPanels
	};
	this.getEndTaskPanel = function() {
		return endTaskPanel
	};
	this.getSingeleTchsHTML = function() {
		var aHTML = [];
		for (var i = 0; i < tchPanels.length; i++) {
			aHTML[i] = tchPanels[i].getInnerHTML(oTemplate.normal);
		}
		if (endTaskPanel) {
			aHTML[aHTML.length] = endTaskPanel.getInnerHTML(oTacheService, oTemplate.endTask);
		}
		return aHTML.join("");
	}

	this.getMulityTchsHTML = function() {
		var aHTML = [];
		var sMulityTchTemplate = oTemplate.mulityTch;
		for (var i = 0; i < tchPanels.length; i++) {

			aHTML[i] = sMulityTchTemplate.replace('%TCH_TEMPLATE%', tchPanels[i].getInnerHTML(oTemplate.normal));
		}
		if (endTaskPanel) {
			aHTML[aHTML.length] = sMulityTchTemplate.replace('%TCH_TEMPLATE%', endTaskPanel.getInnerHTML(oTacheService, oTemplate.endTask));
		}
		return aHTML.join("");
	}

	this.setEndTaskPanel = function(oEndTaskPanel) {
		endTaskPanel = oEndTaskPanel;
	}
	this.unSelectAllTchs = function() {
		for (var i = 0; i < tchPanels.length; i++) {
			tchPanels[i].unSelect();
		}
	}
	this.setPanelsEvent = function(oContainer) {
		var i;
		buildTchPanelsEvent();
		buildEndtaskPanelsEvent();
		if (tchPanels.length == 1 && !endTaskPanel) {
			tchPanels[0].select();
		}
		if (tchPanels.length == 0 && endTaskPanel) {
			endTaskPanel.select();
		}
		function buildTchPanelsEvent() {
			for (i = 0; i < tchPanels.length; i++) {
				var oTchContainer = (isSingleSelect) ? oContainer.childNodes[i] : oContainer.childNodes[i].all('FL_EGN_TCHS_ROW').childNodes[0];
				var oTchDiv = oTchContainer.childNodes[0];
				tchPanels[i].setEvent(oTchContainer, oTacheService, oTemplate.user);
				var oTch = tchPanels[i].getTch();
			}
		}
		function buildEndtaskPanelsEvent() {
			if (!endTaskPanel)
				return;
			var oEndTaskContainer = (isSingleSelect) ? oContainer.childNodes[i] : oContainer.childNodes[i].all('FL_EGN_TCHS_ROW').childNodes[0];
			var oEndtaskDiv = oEndTaskContainer.childNodes[0];
			endTaskPanel.setEvent(oEndTaskContainer, oTacheService);
		}
	}
}

tache.PanelManager.createInst = function(oTacheService, oTemplate) {
	var tchPanelManager = new tache.PanelManager(oTacheService, oTemplate);
	var aTchPanel = [];
	var iLen = 0;
	var oTchs;
	if (oTacheService.tchIterator) {
		oTchs = oTacheService.tchIterator.getTchs();
		iLen = oTchs.length;
	}
	if (iLen == 0 && !oTacheService.context.hasUnClosedConnTch()) {
		EMsg(flowFormMenuLang.not_found_next_tch);
		return null;
	}
	for (var i = 0; i < iLen; i++) {
		var oTch = oTchs[i];
		var oTachePanel = tache.Panel.createInst(oTch, tchPanelManager);
		aTchPanel.push(oTachePanel);
	}
	tchPanelManager.setTchPanels(aTchPanel);
	if (oTacheService.context.hasUnClosedConnTch() && oTacheService.isShowEndtask) {
		var oEndTaskPanel = new tache.EndTaskPanel(tchPanelManager);
		tchPanelManager.setEndTaskPanel(oEndTaskPanel);
	}
	return tchPanelManager;
}

tache.EndTaskPanel = function(tchPanelManager) {
	var isSelected = false;
	var endTaskContainer;
	var oTchSelect;
	this.getInnerHTML = function(oTacheService, sTemplate) {
		var sTemp = sTemplate;
		sTemp = sTemp.replace("%END_TASK_TITLE%", oTacheService.context.getEndTaskTitle());
		return sTemp;
	}
	this.isSelected = function() {
		return isSelected;
	}
	this.setEvent = function(oEndTaskContainer, oTacheService) {
		endTaskContainer = oEndTaskContainer;
		var selType = (oTacheService.isSingleSelect) ? tache.constant.selType.radio : tache.constant.selType.checkbox;
		oTchSelect = new flow.selectBox({
					renderTo : oEndTaskContainer.all("FL_EGN_TCH_SELECT"),
					type : selType
				});
		setSelectBoxEvent(oEndTaskContainer.all("FL_EGN_END_TASK"), oTchSelect, this);
		flow.util.autoWidth(endTaskContainer);
		function setSelectBoxEvent(endTaskDiv, oSelectTch, oPanel) {
			endTaskDiv.onclick = function() {
				oSelectTch.click()
			};
			oSelectTch.addListener("onAfterClick", function() {
						oSelectTch.isChecked() ? oPanel.select() : oPanel.unSelect();
					});
		}
	}
	this.select = function() {
		var getFormEle = tchPanelManager.tchService.layer.$;
		showAllUserRow('none')
		tchPanelManager.unSelectAllTchs();
		oTchSelect.setChecked(true);
		isSelected = true;
	}
	this.unSelect = function() {
		if (!endTaskContainer)
			return;
		showAllUserRow('');
		oTchSelect.setChecked(false);
		isSelected = false;
	}
	function showAllUserRow(isShow) {
		var getFormEle = tchPanelManager.tchService.layer.$;
		var oUserRows = getFormEle("FL_EGN_USERS_DIV");
		if (!oUserRows)
			return;
		var iLen = oUserRows.length;
		for (var i = 0; i < iLen; i++) {
			oUserRows[i].style.display = isShow;
		}
	}
}

tache.Panel = function() {
	var tch;
	var tchContainer;
	var context;
	var userTemplate;
	var tchIterator;
	var tchService;
	var userLoaded = false;
	var userContainer;
	var tchPanelManager;
	var oTchSelect;
	var oSelectElement;
	this.setTch = function(pTch, oTchPanelManager) {
		tch = pTch;
		tchPanelManager = oTchPanelManager;
		tch.setOwnerPanel(this);
	};
	this.getTch = function() {
		return tch
	};
	this.setEvent = function(oPanelContainer, oTacheService, sUserTemplate) {
		tchService = oTacheService;
		tchContainer = oPanelContainer;
		context = oTacheService.context;
		tchIterator = oTacheService.tchIterator;
		userTemplate = sUserTemplate;
		var selType = (tchService.isSingleSelect) ? tache.constant.selType.radio : tache.constant.selType.checkbox;
		oTchSelect = new flow.selectBox({
					renderTo : tchContainer.all("FL_EGN_TCH_SELECT"),
					type : selType
				});
		setTchDesc(tchContainer.all("FL_EGN_TCH_NAME"), tchContainer.all("FL_EGN_TCH_REMARK"));
		setSelectBoxEvent(tchContainer.all("FL_EGN_TCH"), this);
		if (tch.isSelected())
			this.select();
		if (tch.isDisabled())
			this.hiddenSelect();
		flow.util.autoWidth(oPanelContainer);
	};
	this.isUserLoaded = function() {
		return userLoaded;
	}
	this.getInnerHTML = function(sTemplate) {
		var aStr = [["TCH_NAME", tch.getShowName()], ['TCH_REMARK', tch.getRemark()]];
		var iLen = aStr.length;
		var sTemp = sTemplate;
		for (var i = 0; i < iLen; i++) {
			var sReplaceVar = '%' + aStr[i][0] + '%';
			var sReplace = aStr[i][1];
			sTemp = sTemp.replace(sReplaceVar, sReplace);
		}
		return sTemp;
	}
	this.select = function() {
		if (!userContainer)
			userContainer = appendUserHTML();
		var oStaffPanel = this.setDefaultByHook();
		var oNotifySelect = setCountersignAndNotify(userContainer);
		setStaffPanelListener(oStaffPanel, oNotifySelect);
		oSelectElement = setSelectElement(oStaffPanel);
		this.select = function() {
			setContainerStyle({
						userTabDisplay : "",
						bg : "rgb(251,251,251)",
						boxChecked : true,
						tchBg : '#4D9CD4',
						tchBorder : '1px solid black'
					});
			if (tchPanelManager.getEndTaskPanel())
				tchPanelManager.getEndTaskPanel().unSelect();
			tch.select();
		}
		userLoaded = true;
		return this.select();
	}
	this.setDefaultByHook = function() {
		var oStaffRow = userContainer.all("FL_EGN_STAFF_ROW");
		var oNotifyStaffRow = userContainer.all("FL_EGN_NOTIFY_STAFF_ROW");
		var oStaffPanel = setDefaultStaff(oStaffRow);
		var oNotifyStaffPanel = setDefaultNotifyStaff(oNotifyStaffRow);
		setSelectStaff(oStaffRow.all("FL_EGN_SELECT_STAFF"), oStaffPanel);
		setSelectNotifyStaff(oNotifyStaffRow.all("FL_EGN_SELECT_STAFF"), oNotifyStaffPanel);
		return {
			staffPanel : oStaffPanel,
			notifyStaffPanel : oNotifyStaffPanel
		};
	}
	this.unSelect = function() {
		if (tch.isDisabled())
			return;
		setContainerStyle({
					userTabDisplay : "none",
					bg : "",
					boxChecked : false,
					tchBg : '',
					tchBorder : '1px solid white'
				});
		tch.unSelect();
	}
	this.hiddenSelect = function() {
		tchContainer.all("FL_EGN_TCH_SELECT").style.display = "none";
	}
	var setSelectElement = function(oStaffPanel) {
		var oStaffRow = userContainer.all("FL_EGN_STAFF_ROW");
		var oNotifyStaffRow = userContainer.all("FL_EGN_NOTIFY_STAFF_ROW");
		var oSelect = setSelectElementAndEvent(oStaffPanel.staffPanel, tch.canChangeStaff(), oStaffRow.all("FL_EGN_SELECT_STAFF"));
		var oNotifySelect = setSelectElementAndEvent(oStaffPanel.notifyStaffPanel, tch.canChangeNotifyStaff(), oNotifyStaffRow.all("FL_EGN_SELECT_STAFF"));
		function setSelectElementAndEvent(oStaffPanel, canChangeStaff, oSelect) {
			var oSelectElement = oStaffPanel.insertSelectElement();
			oSelectElement.style.display = (canChangeStaff ? '' : 'none');
			oSelectElement.children(0).onclick = oSelect.onclick;
			return oSelectElement;
		}
		return {
			excute : oSelect,
			notify : oNotifySelect
		};
	}
	var setStaffPanelListener = function(pStaffPanel, pSelect) {
		setStaffPanelEvent(pStaffPanel.staffPanel, pSelect.staff.mail, pSelect.staff.sms, tch.hasDefaultStaff(), tch.setExcuteStaffIds, false);
		setStaffPanelEvent(pStaffPanel.notifyStaffPanel, pSelect.notifyStaff.mail, pSelect.notifyStaff.sms, tch.hasDefaultNotifyStaff(), tch.setNotifyStaffIds, true);
		function setStaffPanelEvent(oStaffPanel, oMailSel, oSmsSel, hasDefaultStaff, tchFunc, isNotify) {
			if (!hasDefaultStaff)
				selectStaffCallback.call(tch, '', oMailSel, oSmsSel, tchFunc, isNotify);
			oStaffPanel.addListener('onSelectChange', function() {
						selectStaffCallback.call(tch, oStaffPanel.getUserIds(), oMailSel, oSmsSel, tchFunc, isNotify);
						oStaffPanel.setToUserCnt();
					});
		}
	}
	var setTchDesc = function(oTchDesc, oTchRemark) {
		oTchDesc.title = tch.getRemark();
		tch.setDesc(tch.getName());
	}
	var appendUserHTML = function() {
		var userContainer = tchContainer.parentElement.parentElement.parentElement.nextSibling;
		var parentContainer = userContainer.all("FL_EGN_TCH_USERS");
		userContainer.style.display = "";
		var oUserDiv = tchService.formDoc.createElement("div");
		oUserDiv.innerHTML = userTemplate;
		parentContainer.insertAdjacentElement('BeforeEnd', oUserDiv);
		return oUserDiv;
	}

	var getOftenStaff = function(tch) {
		var oXMLHttp = formContext.App.ajaxRequest('/servlet/flowOper?OperType=39&tchMod=' + tch.getModelId());
		var oXML = oXMLHttp.responseXML;
		var oRows = oXML.selectNodes("/root/rowSet");
		var oftenStaffs = {
			execute : {},
			notify : {}
		};
		if (oRows && oRows.length) {
			var aExecuteIds = [], aExectueNames = [];
			var aNotifyIds = [], aNotifyNames = [];
			for (var i = 0; i < oRows.length; i++) {
				var oRow = oRows[i];
				var sId = oRow.selectSingleNode("OFTEN_STAFF_ID").text;
				var sName = oRow.selectSingleNode("OFTEN_STAFF_NAME").text;
				var sType = oRow.selectSingleNode("OFTEN_TYPE").text;
				if (sType == tache.constant.handleType.execute) {
					aExecuteIds.push(sId);
					aExectueNames.push(sName);
				} else {
					aNotifyIds.push(sId);
					aNotifyNames.push(sName);
				}
			}
			oftenStaffs.execute = {
				id : aExecuteIds.join(','),
				name : aExectueNames.join(',')
			};
			oftenStaffs.notify = {
				id : aNotifyIds.join(','),
				name : aNotifyNames.join(',')
			}
		}
		getOftenStaff = function(tch) {
			return oftenStaffs;
		}
		return getOftenStaff(tch);
	}
	var setDefaultStaff = function(oStaffRow) {
		var oStaffPanel = tache.Panel.staff.createInst(oStaffRow, tache.constant.handleType.execute, tchService, tch);
		if (tch.hasDefaultStaff()) {
			var oDefaultStaff = tch.getDefaultStaff();
			var sId = (tch.getExcuteStaffIds()) ? tch.getExcuteStaffIds() : oDefaultStaff.getId();
			var sName = oDefaultStaff.getName();
			var isAlias = getAlias(sName, sId)
			var isSingleStaff = (sId) && sId.indexOf(",") == -1
			var isSelected = isAlias ? true : (isSingleStaff) ? true : oDefaultStaff.selected;
			var isDisableSel = isAlias ? true : oDefaultStaff.disabled;
			var aStaff = {
				id : sId,
				name : sName,
				disableSel : isDisableSel,
				isSelected : isSelected,
				isAlias : isAlias
			};
			oStaffPanel.addToUsers(aStaff);
			oStaffPanel.addFromUsers(aStaff);
			if (aStaff.isSelected) {
				tch.setExcuteStaffIds(sId);
				oStaffPanel.setToUserCnt();
			}
		} else {
			oStaffPanel.addOftenUsers(getOftenStaff(tch));
		}
		if (tch.isEnd()) {
			userContainer.all("FL_EGN_STAFF_ROW").style.display = "none";
		}
		function getAlias(sName, sId) {
			if (sName == '')
				return false;
			var aName = sName.split(',');
			var aId = sId.split(',');
			return (aName.length != aId.length);
		}
		return oStaffPanel;
	}
	var setDefaultNotifyStaff = function(oStaffNotifyRow) {
		var oNotifyStaffPanel = tache.Panel.staff.createInst(oStaffNotifyRow, tache.constant.handleType.notify, tchService, tch);
		if (tch.hasDefaultNotifyStaff()) {
			var oDefaultNotifyStaff = tch.getDefaultNotifyStaff();
			var sId = (tch.getNotifyStaffIds()) ? tch.getNotifyStaffIds() : oDefaultNotifyStaff.getId();
			var aStaff = {
				id : sId,
				name : "",
				disableSel : oDefaultNotifyStaff.disabled,
				isSelected : oDefaultNotifyStaff.selected
			};
			oNotifyStaffPanel.addToUsers(aStaff);
			oNotifyStaffPanel.addFromUsers(aStaff);
			if (aStaff.isSelected) {
				tch.setNotifyStaffIds(sId);
				oNotifyStaffPanel.setToUserCnt();
			}
		} else {
			oNotifyStaffPanel.addOftenUsers(getOftenStaff(tch));
		}
		return oNotifyStaffPanel;
	}
	var setSelectBoxEvent = function(tchDiv, oPanel) {
		tchDiv.onclick = function() {
			oTchSelect.click()
		};
		oTchSelect.addListener("onAfterClick", function() {
					oTchSelect.isChecked() ? oPanel.select() : oPanel.unSelect();
				});
	}
	var setSms = function(oSmsSpan, oSmsSel, smsCfg, sNotifyCN, isNNotify) {
		setNotifyEvent(oSmsSpan, oSmsSel, smsCfg, sNotifyCN, isNNotify)
	};
	var setMail = function(oMailSpan, oMailSel, mailCfg, sNotifyCN, isNNotify) {
		setNotifyEvent(oMailSpan, oMailSel, mailCfg, sNotifyCN, isNNotify)
	};
	var setNotifyEvent = function(oNotifySpan, oNotifySel, oNotifyCfg, sNotifyCN, isNNotify) {
		oNotifySpan.style.display = ((tch.isEnd() && !isNNotify) || !oNotifyCfg.display) ? "none" : "";
		oNotifySpan.title = getTitle(oNotifyCfg, sNotifyCN);
		oNotifySel.setChecked((oNotifyCfg.selected));
		if (!oNotifyCfg.canChange) {
			oNotifySel.setDisabled(true);
		}
		function getTitle(oNotifyCfg, sNotifyCN) {
			if (!oNotifyCfg.canChange)
				return formatResource(flowFormMenuLang.admin_set_tch_send_notify, sNotifyCN);
			if (oNotifyCfg.selected)
				return formatResource(flowFormMenuLang.send_notify_to_staff, sNotifyCN);
			else
				return formatResource(flowFormMenuLang.not_send_notify_to_staff, sNotifyCN);
		}
		oNotifySel.addListener("onAfterClick", function() {
					if (!oNotifyCfg.canChange)
						return;
					oNotifyCfg.selected = oNotifySel.isChecked();
					oNotifySpan.title = getTitle(oNotifyCfg, sNotifyCN);
				});
	}
	var setCountersignAndNotify = function(userContainer) {
		var sNotifyCountersignTemplate = oTemplate.XMLDocument.selectSingleNode("/root/notify_countersign_template").text;
		var sCountersignTemplate = oTemplate.XMLDocument.selectSingleNode("/root/countersign_template").text;
		var oStaffRow = userContainer.all('FL_EGN_STAFF_ROW');
		var oNotityStaffRow = userContainer.all('FL_EGN_NOTIFY_STAFF_ROW');
		appendNotifyCounterSignHTML(oStaffRow, sCountersignTemplate);
		appendNotifyCounterSignHTML(oNotityStaffRow, '');
		setCounterSign();
		var oStaffSelect = setNotify(oStaffRow, tch.getSms(), tch.getMail(), false);
		var oNotifyStaffSelect = setNotify(oNotityStaffRow, tch.getNotifyCfg().sms, tch.getNotifyCfg().mail, true);
		return {
			staff : oStaffSelect,
			notifyStaff : oNotifyStaffSelect
		};
		function setNotify(oStaffRow, smsCfg, mailCfg, isNNotify) {
			var oSmsSpan = oStaffRow.all("FL_EGN_SMS_SPAN");
			var oMailSpan = oStaffRow.all("FL_EGN_MAIL_SPAN");
			var oSmsSelect = new flow.selectBox({
						renderTo : oSmsSpan.all('FL_EGN_SMS_SELECT'),
						type : tache.constant.selType.checkbox
					});
			var oMailSelect = new flow.selectBox({
						renderTo : oMailSpan.all('FL_EGN_MAIL_SELECT'),
						type : tache.constant.selType.checkbox
					});
			setSms(oSmsSpan, oSmsSelect, smsCfg, flowFormMenuLang.sms, isNNotify);
			setMail(oMailSpan, oMailSelect, mailCfg, flowFormMenuLang.email, isNNotify);
			if (!smsCfg.display && !mailCfg.display)
				oStaffRow.all('FL_EGN_NMODE_ROW').style.display = 'none';
			flow.util.autoWidth(oStaffRow.all('FLN_ENG_NOTIFY_COUNTERSIGN'));
			return {
				sms : oSmsSelect,
				mail : oMailSelect
			};
		}
		function appendNotifyCounterSignHTML(oStaffRow, sReplace) {
			var oNotifyCounterSignRow = oStaffRow.all('FLN_ENG_NOTIFY_COUNTERSIGN');
			var sTemplate = sNotifyCountersignTemplate.replace('%COUNTERSIGN_TEMPLATE%', sReplace)
			if (!oNotifyCounterSignRow) {
				oStaffRow.all('FLN_ENG_STAFF_FROM').lastChild.insertAdjacentHTML('BeforeBegin', sTemplate);
			}
		}
		function setCounterSign() {
			var oDom = oStaffRow.all;
			var counterSignCfg = tch.counterSignCfg;
			oDom("FL_EGN_COUNTERSIGN_ROW").style.display = (counterSignCfg.display) ? "" : "none";
			oDom("FL_EGN_COUNTERSIGN_TEXT").innerHTML = counterSignCfg.text;
			oDom("FL_EGN_PARALLEL_SPAN").style.display = (counterSignCfg.parallel.display) ? "" : "none";
			oDom("FL_EGN_PARALLEL_TEXT").innerHTML = counterSignCfg.parallel.text;
			oDom("FL_EGN_SERIAL_SPAN").style.display = (counterSignCfg.serial.display) ? "" : "none";
			oDom("FL_EGN_SERIAL_TEXT").innerHTML = counterSignCfg.serial.text;
			var oParallelSel = new flow.selectBox({
						renderTo : oDom("FL_EGN_PARALLEL_SELECT"),
						type : tache.constant.selType.checkbox
					});;
			var oSerialSel = new flow.selectBox({
						renderTo : oDom("FL_EGN_SERIAL_SELECT"),
						type : tache.constant.selType.checkbox
					});;
			oParallelSel.setChecked(counterSignCfg.parallel.checked);
			oSerialSel.setChecked(counterSignCfg.serial.checked);
			oParallelSel.addListener("onAfterClick", function() {
						tch.counterSignCfg.parallel.checked = (oParallelSel.isChecked());
						if (tch.counterSignCfg.parallel.checked)
							oSerialSel.setChecked(false);
					});
			oSerialSel.addListener("onAfterClick", function() {
						tch.counterSignCfg.serial.checked = (oParallelSel.isChecked());
						if (tch.counterSignCfg.serial.checked)
							oParallelSel.setChecked(false);
					});
		}
	}

	var selectStaffCallback = function(value, oMailSel, oSmsSel, tchFunc, isNotify) {
		tchFunc.call(tch, value);
		if (value) {
			var smsCfg = (isNotify) ? tch.getNotifyCfg().sms : tch.getSms();
			var mailCfg = (isNotify) ? tch.getNotifyCfg().mail : tch.getMail();
			oSmsSel.setChecked(smsCfg.selected);
			oMailSel.setChecked(mailCfg.selected);
			return;
		}
		oSmsSel.setChecked(false);
		oMailSel.setChecked(false);
	}

	var setSelectStaff = function(oSelectStaff, oStaffPanel) {
		var orgId = "";
		var orgCanChange = true;
		var orgParam = null;
		oSelectStaff.disabled = (tch.canChangeStaff() ? false : true);
		if (tch.hasDefaultOrg()) {
			orgId = tch.getDefaultOrg().getId();
			orgCanChange = tch.getDefaultOrg().canChange;
			orgParam = tch.getDefaultOrg().otherParam;
		}
		oStaffPanel.setStaffInputEvent({
					disabled : oSelectStaff.disabled,
					orgType : tch.getStaffCreateType(),
					orgCanChange : orgCanChange,
					orgId : orgId,
					filter : tch.getFilterStaffWhere()
				});
		oSelectStaff.onclick = function() {
			if (this.disabled)
				return;
			selectStaff(oStaffPanel, orgId, tch.getStaffCreateType(), !orgCanChange, orgParam, tch.setExcuteGroupIds, tch.getFilterStaffWhere());
		}
		if (oSelectElement) {
			oStaffPanel.insertSelectElement();
			oSelectElement.excute.children(0).onclick = oSelectStaff.onclick;
		}
	}
	var setSelectNotifyStaff = function(oSelectNotifyStaff, oNotifyStaffPanel) {
		var orgId = "";
		var orgCanChange = true;
		var orgParam = null;
		oSelectNotifyStaff.disabled = (tch.canChangeNotifyStaff() ? false : true);
		if (tch.hasNotifyDefaultOrg()) {
			orgId = tch.getNotifyDefaultOrg().getId();
			orgCanChange = tch.getNotifyDefaultOrg().canChange;
		}
		oNotifyStaffPanel.setStaffInputEvent({
					disabled : oSelectNotifyStaff.disabled,
					orgType : tch.getNotifyStaffCreateType(),
					orgCanChange : orgCanChange,
					orgId : orgId,
					filter : ''
				});
		oSelectNotifyStaff.onclick = function() {
			if (this.disabled)
				return;
			selectStaff(oNotifyStaffPanel, orgId, tch.getNotifyStaffCreateType(), !orgCanChange, orgParam, null, null);
		}
		if (oSelectElement) {
			oNotifyStaffPanel.insertSelectElement();
			oSelectElement.notify.children(0).onclick = oSelectNotifyStaff.onclick;
		}
	}

	var selectStaff = function(oStaffPanel, sDefaultOrgId, sStaffCreateType, isSetRoot, aRootOrgParam, groupCallFunc, filterStaffWhere) {
		var returnStaff = null;
		var text = oStaffPanel.getUserNames();
		var value = oStaffPanel.getUserIds();
		var group = oStaffPanel.getGroupId();
		if (sStaffCreateType == flow.constant.staffCreateType.deptTree)
			returnStaff = choiceStaff(true, sDefaultOrgId, null, false, null, text, value, isSetRoot, null, filterStaffWhere);
		else if (sStaffCreateType == flow.constant.staffCreateType.groupTree)
			returnStaff = choiceStaffByProject(true, sDefaultOrgId, null, false, null, text, value, isSetRoot, aRootOrgParam, group, filterStaffWhere);
		else if (sStaffCreateType == flow.constant.staffCreateType.dutyTree)
			returnStaff = choiceStaffByDuty(true, sDefaultOrgId, null, false, null, text, value, isSetRoot, null, filterStaffWhere);
		if (!returnStaff)
			return;
		returnStaff.isSelected = true;
		returnStaff.disableSel = false;
		oStaffPanel.setGroupId(returnStaff.group);
		oStaffPanel.addToUsers(returnStaff);
		if (groupCallFunc)
			groupCallFunc.call(tch, returnStaff.group);
		// setStaff(returnStaff,oStaffContainer,callFunc,groupCallFunc);
	}

	var setContainerStyle = function(aStyle) {
		if (!userContainer || !userContainer.all("FL_EGN_USERS_DIV"))
			return;
		userContainer.all("FL_EGN_USERS_DIV").style.display = aStyle.userTabDisplay;
		oTchSelect.setChecked(aStyle.boxChecked);
	}
}

tache.Panel.createInst = function(oTch, tchPanelManager) {
	var oPanel = new tache.Panel();
	oPanel.setTch(oTch, tchPanelManager);
	return oPanel;
}

tache.Panel.staff = function(oTarget, sType, tchService, tch) {
	var oUserToContainer = oTarget.all('FL_EGN_STAFF');
	var iUserToWidth = oUserToContainer.parentElement.clientWidth;
	var oUserFromContainer = oTarget.all('FLN_ENG_STAFF_FROM');
	var oStaffInput = oUserToContainer.all('FL_EGN_STAFF_INPUT');
	var oStaffInputContainer = oStaffInput.parentElement;
	var oSearchHelp = oUserToContainer.all('FL_ENG_SEARCH_HELP_INFO');
	var sUserTemplate = oTemplate.XMLDocument.selectSingleNode("/root/single_user_template").text;
	var sSerachTemplate = oTemplate.XMLDocument.selectSingleNode("/root/search_panel_template").text;
	var sSearchUserTemplate = oTemplate.XMLDocument.selectSingleNode("/root/search_user_template").text;
	var sOftenUserEditTemplate = oTemplate.XMLDocument.selectSingleNode("/root/often_user_edit_template").text;
	var sUserTitleTemplate = oTemplate.XMLDocument.selectSingleNode("/root/search_user_title").text;
	var sSelectOtherUserTemplate = oTemplate.XMLDocument.selectSingleNode("/root/select_other_user_template").text;
	var e = formContext.getWin().form.event;
	var doc = formContext.getWin().form.document;
	var oSelectElement;
	var self = this;
	var aToUser = [];
	var isToUserAlias = false;
	var aFromUser = [];
	var groupId = '';
	var listener = {};
	this.getGroupId = function() {
		return groupId;
	};
	this.setGroupId = function(pGroupId) {
		groupId = pGroupId;
	};
	this.setStaffInputEvent = function(oParam) {
		if (oParam.disabled || isToUserAlias) {
			oStaffInput.style.display = 'none';
			return;
		}
		bulidStaffInputEvent(oParam);
	}
	this.getUserIds = function() {
		return getUsers().id;
	}

	this.getUserNames = function() {
		return getUsers().name;
	}

	this.insertSelectElement = function() {
		var oNotifyCounterSign = oUserFromContainer.all('FLN_ENG_NOTIFY_COUNTERSIGN');
		var iWidth = oUserFromContainer.offsetWidth - oNotifyCounterSign.offsetWidth - oUserFromContainer.firstChild.offsetWidth - 20;
		if (oSelectElement) {
			oUserFromContainer.lastChild.insertAdjacentElement("beforeBegin", oSelectElement);
			return;
		}
		if (iWidth < 0)
			iWidth = 0;// 竣工时处理人隐藏
		oUserFromContainer.lastChild.insertAdjacentHTML("beforeBegin", sSelectOtherUserTemplate);
		oSelectElement = oUserFromContainer.lastChild.previousSibling;
		oSelectElement.children(0).innerText = flowFormMenuLang.select_other_user;
		oSelectElement.style.width = iWidth + 'px';
		return oSelectElement;
	}

	this.setToUserCnt = function() {
		var oUserCnt = oTarget.all('FL_EGN_STAFF_CNT');
		if (aToUser.length) {
			oUserCnt.innerText = '[' + aToUser.length + ']';
			return;
		}
		oUserCnt.innerText = '';
	}
	this.addListener = function(eventName, oListener) {
		listener[eventName] = oListener;
	}

	function execListen(eventName, isExec) {
		if (!listener[eventName])
			return;
		if (!isExec)
			return;
		listener[eventName].call(this);
	}

	function getUsers() {
		var iLen = aToUser.length;
		var sId = '';
		var sName = '';
		for (var i = 0; i < iLen; i++) {
			sId = sId + aToUser[i].id + ',';
			sName = sName + aToUser[i].id + ',';
		}
		return {
			id : sId.slice(0, -1),
			name : sName.slice(0, -1)
		};
	}

	this.addToUsers = function(oStaff) {
		isToUserAlias = oStaff.isAlias;
		removeAllUsers(true);
		if (!oStaff.id || !oStaff.isSelected)
			return;
		addUsers(oStaff, function(oParams) {
					addToUser(oParams.staff, oParams.user, true)
				});
		execListen("onSelectChange", true);
	}

	this.addFromUsers = function(oStaff) {
		if (!oStaff.id || oStaff.disableSel) {
			oUserFromContainer.firstChild.innerText = '';
			return;
		}
		removeAllFromUsers()
		addUsers(oStaff, function(oParams) {
					addFromUser(oParams.staff, oParams.user)
				});
	}

	this.addOftenUsers = function(oOftenStaff) {
		var isNotify = (sType == tache.constant.handleType.notify);
		var handleType = (isNotify) ? "notify" : "execute";
		var oStaff = oOftenStaff[handleType];
		if (!oStaff.id || (!isNotify && !tch.canChangeStaff())) {
			oUserFromContainer.firstChild.style.display = 'none';
			return;
		}
		if (aFromUser.length)
			return;
		addUsers(oStaff, function(oParams) {
					addFromUser(oParams.staff, oParams.user)
				});
		var oPreDiv = getPreDiv();
		oPreDiv.insertAdjacentHTML("beforeBegin", sOftenUserEditTemplate);
		oUserFromContainer.firstChild.innerText = flowFormMenuLang.recommended_common_user;
		var oEditUserDiv = oPreDiv.previousSibling;
		var oEdit = oEditUserDiv.children(0);
		var oSave = oEditUserDiv.children(1);
		var oCancel = oEditUserDiv.children(2);
		oEdit.onclick = function() {
			oSave.style.display = "";
			oCancel.style.display = "";
			showFromUserDel({
						del : '',
						edit : "none",
						delState : false,
						userDiv : '',
						editState : true
					});
		}
		oCancel.onclick = function() {
			oSave.style.display = "none";
			oCancel.style.display = "none";
			showFromUserDel({
						del : 'none',
						edit : "",
						delState : false,
						userDiv : '',
						editState : false
					});
		}
		oSave.onclick = function() {
			var iLen = aFromUser.length;
			var aId = [];
			var tmpFromUser = [];
			for (var i = 0; i < iLen; i++) {
				var oFromUser = aFromUser[i];
				(oFromUser.delState) ? aId.push(oFromUser.id) : tmpFromUser.push(oFromUser);
			}
			if (!aId.length) {
				oCancel.click();
				return;
			}
			var saveURL = "/servlet/flowOper?OperType=40&oftenStaffIds=" + aId.join(",") + "&tchMod=" + tch.getModelId() + "&oftenType=" + sType;
			formContext.App.ajaxRequest(saveURL, {
						async : true,
						onStateChange : function(oXMLHttp) {
							stateChange(oXMLHttp)
						}
					});
			function stateChange(oXMLHttp) {
				Message.xmlHttpLoading(oXMLHttp, {
							wait : flowFormMenuLang.submitting_wait + "......",
							succeed : flowFormMenuLang.submit_succ
						}, tchService.layer.getDomEle(), {
							onSucceed : function() {
								resetFromUser();
							}
						})
			}

			function resetFromUser() {
				for (var i = 0; i < iLen; i++) {
					var oFromUser = aFromUser[i];
					if (oFromUser.delState) {
						oFromUser.targetDiv.parentElement.removeChild(oFromUser.targetDiv);
					}
				}
				aFromUser = tmpFromUser;
				oCancel.click();
			}

		}
		function showFromUserDel(oDisplay) {
			var iLen = aFromUser.length;
			oEdit.style.display = oDisplay.edit;
			for (var i = 0; i < iLen; i++) {
				var oFromUser = aFromUser[i];
				var userId = oFromUser.id;
				var oDel = oFromUser.targetDiv.children(1);
				oFromUser.targetDiv.style.display = oDisplay.userDiv;
				oDel.style.display = oDisplay.del;
				oFromUser.delState = oDisplay.delState;
				oFromUser.editState = oDisplay.editState;
				(oDisplay.editState || !oFromUser.isSelected) ? setFromUserUnSelectedStyle(oFromUser) : setFromUserSelectedStyle(oFromUser)
				if (!oDel.onclick) {
					oDel.onclick = (function(_userId) {
						return function() {
							formContext.getWin().form.event.cancelBubble = true;
							var oFromUser = getUserById(aFromUser, _userId);
							oFromUser.user.targetDiv.style.display = 'none';
							oFromUser.user.delState = true;
						}
					})(userId)
				}
			}
		}
	}

	function getPreDiv() {
		var oNotifyCounterSign = oUserFromContainer.all('FLN_ENG_NOTIFY_COUNTERSIGN');
		if (oNotifyCounterSign)
			return oNotifyCounterSign;
		return oUserFromContainer.lastChild;
	}

	function handleAliasDiv(oStaff, oUserDiv, oUser) {

		if (!oStaff.isAlias)
			return;
		if (oUser.name == '')
			return;
		if (oUserDiv.clientWidth > iUserToWidth - 55) {
			oUserDiv.style.whiteSpace = 'normal';
			oUserDiv.style.wordBreak = 'break-all';
			oUserDiv.style.width = iUserToWidth - 55;
			oUserDiv.style.textAlign = 'left';
		}
	}
	function addToUser(oStaff, oUser, disabledListen) {
		var sUserHTML = getUserHTML(oUser.name);
		var isExecListen = (disabledListen) ? false : true;
		var iLen = oUserToContainer.childNodes.length;
		oUserToContainer.lastChild.previousSibling.insertAdjacentHTML("beforeBegin", sUserHTML);
		var oUserDiv = oUserToContainer.childNodes[iLen - 2];
		handleAliasDiv(oStaff, oUserDiv, oUser);
		if (oUser.name == '')
			oUserDiv.style.display = 'none';
		var oDelUser = oUserDiv.children(1);
		aToUser.push({
					id : oUser.id,
					name : oUser.name,
					targetDiv : oUserDiv
				});
		execListen("onSelectChange", isExecListen);
		if (oStaff.disableSel)
			return;
		setFromUserSelected(oUser.id, true);
		oUserDiv.onmouseover = function() {
			oDelUser.style.display = ""
		};
		oUserDiv.onmouseout = function() {
			oDelUser.style.display = "none"
		};
		oSearchHelp.innerText = '';
		oDelUser.onclick = function() {
			removeToUser(oUser.id);
			setFromUserSelected(oUser.id, false);
		}
	}

	function addFromUser(oStaff, oUser) {
		var sUserHTML = getUserHTML(oUser.name);
		var oPreDiv = getPreDiv();
		oPreDiv.insertAdjacentHTML("beforeBegin", sUserHTML);
		var oUserDiv = oUserFromContainer.childNodes[aFromUser.length + 1];
		var oFromUser = {
			id : oUser.id,
			name : oUser.name,
			targetDiv : oUserDiv,
			isSelected : oStaff.isSelected
		}
		aFromUser.push(oFromUser);
		(oStaff.isSelected) ? setFromUserSelectedStyle(oFromUser) : setFromUserUnSelectedStyle(oFromUser);
		oUserDiv.onclick = function() {
			var oFromUser = getUserById(aFromUser, oUser.id).user;
			if (oFromUser.editState)
				return;
			var isSelected = !(oFromUser.isSelected);
			setFromUserSelected(oUser.id, isSelected);
			(isSelected) ? addToUser({}, {
						id : oUser.id,
						name : oUser.name
					}) : removeToUser(oUser.id);
		}

	}

	function setFromUserSelected(sUserId, isSelected) {
		var oFromUser = getUserById(aFromUser, sUserId);
		if (!oFromUser)
			return;
		oFromUser.user.isSelected = isSelected;
		if (oFromUser.user.isSelected && !oFromUser.editState) {
			setFromUserSelectedStyle(oFromUser.user);
			return;
		}
		setFromUserUnSelectedStyle(oFromUser.user);
	}

	function setFromUserSelectedStyle(oUser) {
		oUser.targetDiv.style.background = '#007ABF';
		oUser.targetDiv.style.color = 'white';
	}

	function setFromUserUnSelectedStyle(oUser) {
		oUser.targetDiv.style.background = '#F2F2F2';
		oUser.targetDiv.style.color = 'black';
	}

	function removeAllFromUsers() {
		var iLen = aFromUser.length;
		for (var i = 0; i < iLen; i++) {
			oUserFromContainer.removeChild(aFromUser[i].targetDiv);
		}
		aFromUser = [];
	}

	function addUsers(oStaff, visitor) {
		var aId = oStaff.id.split(',');
		var iLen = aId.length;
		var sName = (oStaff.name) ? oStaff.name : getNameByIds(oStaff.id);
		oStaff.name = sName;
		var aName = sName.split(',');
		for (var i = 0; i < iLen; i++) {
			var tmpName = (!oStaff.isAlias) ? aName[i] : (i == 0) ? sName : '';
			visitor.call(this, {
						staff : oStaff,
						user : {
							id : aId[i],
							name : tmpName
						}
					})
		}
	}

	function removeAllUsers(disabledListen) {
		var isExecListen = (disabledListen) ? false : true;
		var iLen = aToUser.length;
		for (var i = iLen - 1; i >= 0; i--) {
			removeToUser(aToUser[i].id, isExecListen);
		}
		execListen("onSelectChange", isExecListen);
	}

	function getUserHTML(sName) {
		return sUserTemplate.replace('%STAFF_NAME%', sName);
	};
	function removeToUser(sId, disabledListen) {
		var oUser = getUserById(aToUser, sId);
		var isExecListen = (disabledListen) ? false : true;
		if (oUser) {
			oUserToContainer.removeChild(oUser.user.targetDiv);
			aToUser.splice(oUser.index, 1);
			setFromUserSelected(sId, false);
			execListen("onSelectChange", isExecListen);
		}
	}

	function removeLastToUser() {
		var iLen = aToUser.length;
		if (!iLen)
			return;
		removeToUser(aToUser[iLen - 1].id, false);
	}

	function getUserById(arrayUser, sId) {
		var iLen = arrayUser.length;
		for (var i = 0; i < iLen; i++) {
			var oUser = arrayUser[i];
			if (oUser.id == sId)
				return {
					user : oUser,
					index : i
				}
		}
		return null;
	}
	function bulidStaffInputEvent(oParam) {
		var execSeq = 0;
		var iCurrIndex = -1;
		var oSearchPanel = getSearchDom();
		var oTitlePanel = getTitleDom();
		var isPanelShow = false;
		doc.attachEvent('onclick', function() {
					hideSearch()
				});
		initSearchHelp();
		function initSearchHelp() {
			if (!aToUser.length)
				oSearchHelp.innerText = flowFormMenuLang.search_help_info;
		}
		oUserToContainer.parentElement.onclick = function() {
			oStaffInputContainer.style.marginLeft = '0px';
			oStaffInput.focus();
			oSearchHelp.innerText = '';
			oStaffInput.value = oStaffInput.value;
			moveCursorToEnd(oStaffInput);
		}
		oStaffInput.onpropertychange = function() {
			var oHideDiv = oStaffInputContainer.lastChild;
			if (formContext.getWin().form.event.propertyName == 'value') {
				oHideDiv.innerText = oStaffInput.value + 'WW';
				var iWidth = parseInt(oHideDiv.scrollWidth, 10);
				var iUserToContainerWidth = oUserToContainer.offsetWidth;
				iWidth = (iWidth >= 86) ? iWidth + 9 : iWidth
				oStaffInputContainer.style.width = iWidth + 'px';
				execSeq += 1;
				getSolrInfo(1, oStaffInput.value, null, execSeq);
			}
		}

		oStaffInput.onkeydown = function() {
			var oKey = {
				enter : '13',
				downKey : '40',
				upKey : '38',
				backKey : '8'
			};
			var oEvent = {};
			var sKey = formContext.getWin().form.event.keyCode + '';
			oEvent[oKey.enter] = doAddUser;
			oEvent[oKey.downKey] = moveDown;
			oEvent[oKey.upKey] = moveUp;
			oEvent[oKey.backKey] = doRemoveToUser
			if (!oEvent[sKey])
				return;
			oEvent[sKey].call(this);
			function doRemoveToUser() {
				if (oStaffInput.value == '')
					removeLastToUser();
			}
			function moveDown() {
				if (!isPanelShow)
					return;
				var iIndex = iCurrIndex + 1;
				var iLen = oSearchPanel.user.childNodes.length;
				if (iIndex >= iLen)
					iIndex = 0;
				setCurrItem(iIndex)
			}
			function moveUp() {
				if (!isPanelShow)
					return;
				var iIndex = iCurrIndex - 1;
				var iLen = oSearchPanel.user.childNodes.length;
				if (iIndex < 0)
					iIndex = iLen - 1;
				setCurrItem(iIndex);
			}
			function doAddUser() {
				if (!isPanelShow)
					return;
				oSearchPanel.user.childNodes[iCurrIndex].click();
			}
		}
		function moveCursorToEnd(oText) {
			var iLength = oText.value.length;
			var range = oText.createTextRange();
			range.collapse(true);
			range.moveEnd('character', iLength);
			range.moveStart('character', iLength);
			range.select();
		}

		function setCurrItem(iIndex) {
			var tmpIndex = iCurrIndex;
			if (iIndex == iCurrIndex)
				return;
			var oItem = oSearchPanel.user.childNodes[iIndex];
			oItem.style.background = '#FBEFC1';
			doTitle(oItem);
			iCurrIndex = iIndex;
			if (tmpIndex == -1)
				return;
			var oPrevItem = oSearchPanel.user.childNodes[tmpIndex];
			oPrevItem.style.background = '';
		}

		function getSearchDom() {
			if (!doc.getElementById('FL_EGN_STAFF_SEARCH'))
				doc.body.insertAdjacentHTML('beforeEnd', sSerachTemplate);
			var oSearchPanel = doc.getElementById('FL_EGN_STAFF_SEARCH');
			var oSearchUserDiv = oSearchPanel.firstChild;
			var oSearchPagePanel = oSearchPanel.lastChild;
			var oSearchPageDiv = oSearchPagePanel.childNodes[1];
			var oSerachPageNum = oSearchPagePanel.childNodes[0];
			oSearchPanel.onclick = function() {
				formContext.getWin().form.event.cancelBubble = true;
			};
			return {
				self : oSearchPanel,
				user : oSearchUserDiv,
				page : oSearchPagePanel,
				pageAction : oSearchPageDiv,
				num : oSerachPageNum
			};
		}

		function getTitleDom() {
			if (!doc.getElementById('FL_EGN_STAFF_TITLE'))
				doc.body.insertAdjacentHTML('beforeEnd', sUserTitleTemplate);
			var oTitlePanel = doc.getElementById('FL_EGN_STAFF_TITLE');
			var oName = oTitlePanel.all('FL_EGN_STAFF_TITLE_NAME');
			var oTel = oTitlePanel.all('FL_EGN_STAFF_TITLE_TEL');
			var oRegion = oTitlePanel.all('FL_EGN_STAFF_TITLE_REGION');
			var oFullOrg = oTitlePanel.all('FL_EGN_STAFF_TITLE_FULL_ORG');
			var oMail = oTitlePanel.all('FL_EGN_STAFF_TITLE_MAIL');
			return {
				self : oTitlePanel,
				name : oName,
				tel : oTel,
				region : oRegion,
				fullOrg : oFullOrg,
				mail : oMail
			};
		}

		function doTitle(oSearchItem) {
			oTitlePanel.self.style.display = '';
			oTitlePanel.name.innerHTML = oSearchItem.search.name;
			oTitlePanel.tel.innerHTML = (oSearchItem.search.tel) ? '(' + oSearchItem.search.tel + ')' : '';
			oTitlePanel.region.innerHTML = oSearchItem.search.selfRegionName;
			oTitlePanel.fullOrg.innerHTML = oSearchItem.search.fullOrgName;
			oTitlePanel.mail.innerHTML = oSearchItem.search.mail;
			var oRect = oSearchItem.getBoundingClientRect();
			var iLeft = oRect.right + doc.body.scrollLeft - 50;
			var iTop = oRect.top + doc.body.scrollTop - oTitlePanel.self.offsetHeight + 22;
			if (iTop < doc.body.scrollTop)
				iTop = doc.body.scrollTop;
			oTitlePanel.self.style.left = iLeft + 'px';
			oTitlePanel.self.style.top = iTop + 'px';
		}

		function hideSearch() {
			isPanelShow = false;
			oSearchPanel.self.style.display = 'none';
			oTitlePanel.self.style.display = 'none';
			iCurrIndex = -1;
		}

		var oXMLHTTP;
		function getSolrInfo(iPage, sInput, oHook, iSeq) {
			if (sInput == '' && !oParam.orgId) {
				hideSearch();
				return;
			}
			var sXML = ["<?xml version='1.0' encoding='gbk'?>", "<root>", "<searchStaffName>", xmlEncode(sInput), "</searchStaffName>", "<currentPage>", iPage, "</currentPage>", "<additionSearch>", getAddition(oParam), "</additionSearch>", "</root>"].join("");
			oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
			var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
			XMLDoc.loadXML(sXML);
			oXMLHTTP.onreadystatechange = function() {
				showSearch(oXMLHTTP, iPage, sInput, oHook, iSeq);
			};
			oXMLHTTP.open("get", '/servlet/staff_manage?tag=78', true);
			oXMLHTTP.send(XMLDoc);
			function getAddition(oParam) {
				var aHasOrg = {}, aOrgId = {}, sHasOrg = '';
				aHasOrg[flow.constant.staffCreateType.deptTree] = '';
				aHasOrg[flow.constant.staffCreateType.groupTree] = 'is_project';
				aHasOrg[flow.constant.staffCreateType.dutyTree] = 'is_duty';
				aOrgId[flow.constant.staffCreateType.deptTree] = 'org_id';
				aOrgId[flow.constant.staffCreateType.groupTree] = 'project_id';
				aOrgId[flow.constant.staffCreateType.dutyTree] = 'duty_id';
				var sFilter = (oParam.filter) ? ' AND ' + oParam.filter : '';
				var sHasOrgAndFilter = (aHasOrg[oParam.orgType]) ? aHasOrg[oParam.orgType] + ':1' + sFilter : oParam.filter;
				if (sInput == '' || !oParam.orgCanChange) {
					return getOrgIdParam() + sFilter;
				}
				return sHasOrgAndFilter;
				function getOrgIdParam() {
					if (oParam.orgId == '' || oParam.orgId == null) {
						return "";
					}
					var aOrgIds = oParam.orgId.split(',');
					var sOrgParam = '(';
					for (var i = 0; i < aOrgIds.length; i++) {
						sOrgParam += aOrgId[oParam.orgType] + ':' + aOrgIds[i];
						if (i != aOrgIds.length - 1)
							sOrgParam += ' or ';
					}
					return sOrgParam + ')';
				}
			}
		}

		function showSearch(oXMLHttp, iPage, sInput, oHook, iSeq) {
			var oXML = getXML(oXMLHttp);
			if (!oXML)
				return;
			var oPage;
			var aSearch = getSearchResult(oXML);
			isPanelShow = aSearch.length;
			if (!isPanelShow) {
				hideSearch();
				return;
			}
			iCurrIndex = -1;
			if (execPage())
				return;
			setPageInfo(oXML);
			addItems(aSearch);
			buildPageAndPos()
			setCurrItem(0);
			function getXML(oXMLHttp) {
				if (iSeq < execSeq) {
					return false;
				}
				if (oXMLHttp.readyState != 4)
					return false;
				if (isErrorRequest(oXMLHttp))
					return false;
				var oXML = oXMLHttp.responseXML;
				oXMLHttp = null;
				function isErrorRequest(oXMLHttp) {
					if (oXMLHttp.status != 200)
						return true;
					var errElement = getErrorCode(oXMLHttp);
					if (!errElement)
						return true;
					if (errElement.text != "0")
						return true;
					return false;
				}
				return oXML;
			}
			function getSearchResult(oXML) {
				var aSearch = [];
				var oRows = oXML.selectNodes("/root/rowset/row");
				for (var i = 0; i < oRows.length; i++) {
					var oRow = oRows[i];
					var sId = oRow.getAttribute("id");
					var sName = oRow.getAttribute("staff_name");
					aSearch.push({
								id : oRow.getAttribute("id"),
								name : oRow.getAttribute("staff_name"),
								hName : oRow.getAttribute("highlighting_staff_name"),
								hSelfRegionName : oRow.getAttribute("highlighting_self_region_name"),
								selfRegionName : oRow.getAttribute("self_region_name"),
								hSelfOrgName : oRow.getAttribute("highlighting_self_org_name"),
								hTel : oRow.getAttribute("highlighting_mobile"),
								tel : oRow.getAttribute("mobile"),
								hMail : oRow.getAttribute("highlighting_email"),
								mail : oRow.getAttribute("email"),
								hFullOrgName : oRow.getAttribute("highlighting_org_name"),
								fullOrgName : oRow.getAttribute("org_name")
							});
				}
				return aSearch;
			}

			function setPageInfo(oXML) {
				var iTotal = parseInt(oXML.selectSingleNode("/root/totalNum").text, 10);
				oPage = {
					currIndex : 1,
					total : iTotal,
					size : 10
				};
			}

			function execPage() {
				if (oHook) {
					oHook.call(this, aSearch);
					return true;
				}
				return false;
			}

			function buildPageAndPos() {
				buildPage();
				setPos();
			}

			function setPos() {
				oSearchPanel.user.style.height = 'auto';
				var oRect = oUserToContainer.getBoundingClientRect();
				var iLeft = oRect.left + doc.body.scrollLeft;
				var isExceedScreen = (oRect.bottom + oSearchPanel.self.offsetHeight) > doc.body.offsetHeight;
				var iUpper = oRect.top - oSearchPanel.self.offsetHeight + doc.body.scrollTop;
				var iDown = oRect.bottom + doc.body.scrollTop;
				var iTop = isExceedScreen ? iUpper : iDown;
				// if(iTop<doc.body.scrollTop) iTop=iDown;
				oSearchPanel.self.style.left = iLeft + 'px';
				oSearchPanel.self.style.top = iTop + 'px';
			}
			function addItems(aSearch) {
				var iLen = aSearch.length;
				if (iLen) {
					oSearchPanel.self.style.display = '';
					oSearchPanel.user.innerHTML = '';
					for (var i = 0; i < iLen; i++) {
						var search = aSearch[i]
						var sHTML = sSearchUserTemplate.replace('%RESULT%', getHTML(search));
						oSearchPanel.user.insertAdjacentHTML('beforeEnd', sHTML);
						var oItem = oSearchPanel.user.childNodes[i];
						setItemEvent(oItem, {
									search : search,
									index : i
								});
					}
				}
				function getHTML(search) {
					return [replaceStyle('cn', search.hName), '&nbsp;(', replaceStyle('cn', search.hSelfRegionName), '-', replaceStyle('cn', search.hSelfOrgName), '&nbsp;', replaceStyle('en', search.hTel), '&nbsp;', replaceStyle('en', search.hMail), ')'].join('');
					function replaceStyle(fontType, hText) {
						var fontFamily = (fontType == 'cn') ? "'Microsoft YaHei'" : "'Times New Roman'";
						var sText = ['font-size:13px;font-weight:bold;', 'font-family:', fontFamily, ';color:#93BEFF'].join('');
						return hText.replace(/\{\$STYLE\}/g, sText);
					}
				}
			}

			function buildPage() {
				var pageCnt = Math.ceil(oPage.total / oPage.size)
				oSearchPanel.page.style.display = (pageCnt == 1) ? 'none' : '';
				if (pageCnt == 1)
					return;
				oSearchPanel.num.innerText = formatResource(flowFormMenuLang.search_page_num, "1", pageCnt);
				var oFirstPage = oSearchPanel.pageAction.children(0);
				var oPrevPage = oSearchPanel.pageAction.children(1);
				var oNextPage = oSearchPanel.pageAction.children(2);
				var oLastPage = oSearchPanel.pageAction.children(3);
				oFirstPage.onclick = function() {
					doPage(1)
				};
				oPrevPage.onclick = function() {
					doPage(oPage.currIndex - 1)
				};
				oNextPage.onclick = function() {
					doPage(oPage.currIndex + 1)
				};
				oLastPage.onclick = function() {
					doPage(pageCnt)
				};
				disablePage();
				function doPage(iIndex) {

					if (iIndex < 1 || iIndex > pageCnt)
						return;
					getSolrInfo(iIndex, sInput, page, execSeq);
					function page(aSearch) {
						iCurrIndex = -1;
						var iHeight = oSearchPanel.user.offsetHeight;
						oSearchPanel.user.style.height = iHeight + 'px';
						addItems(aSearch);
						setCurrItem(0);
						oPage.currIndex = iIndex;
						oSearchPanel.num.innerText = formatResource(flowFormMenuLang.search_page_num, iIndex, pageCnt);;
						oFirstPage.disabled = oPrevPage.disabled = (oPage.currIndex == 1) ? true : false;
						oLastPage.disabled = oNextPage.disabled = (oPage.currIndex == pageCnt) ? true : false;
						oStaffInput.focus();
						moveCursorToEnd(oStaffInput);
					}
				}
				function disablePage() {
					oFirstPage.disabled = oPrevPage.disabled = (oPage.currIndex == 1) ? true : false;
					oLastPage.disabled = oNextPage.disabled = (oPage.currIndex == pageCnt) ? true : false;
				}
			}

			function setItemEvent(oItem, aUser) {
				oItem.search = aUser.search;
				oItem.onmouseover = function() {
					setCurrItem(aUser.index);
				}
				oItem.onclick = function() {
					removeToUser(aUser.search.id);
					addToUser({}, {
								id : aUser.search.id,
								name : aUser.search.name
							});
					oStaffInput.focus();
					if (oStaffInput.value != '')
						oStaffInput.value = '';
				}
			}
		}
	}
	function getNameByIds(sId) {
		var sXML = ["<?xml version='1.0' encoding='gbk'?>", "<root>", "<table>staff</table>", "<keyColumn>staff_id</keyColumn>", "<valueColumn>staff_name</valueColumn>", "<valuesSplit>,</valuesSplit><orderCon/><whereCon/>", "<keys>", sId, "</keys>", "</root>"].join("");
		var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
		XMLDoc.loadXML(sXML);
		var returnXML = formContext.App.syncAjaxRequest('/servlet/util?OperType=1', XMLDoc);
		return returnXML.selectSingleNode("/root/values").text;
	}
}
tache.Panel.staff.createInst = function(oTarget, sType, tchService, tch) {
	var aStaffPanels = {};
	tache.Panel.staff.createInst = function(oTarget, sType, tchService, tch) {
		if (aStaffPanels[oTarget.uniqueID])
			return aStaffPanels[oTarget.uniqueID];
		var oStaffPanel = new tache.Panel.staff(oTarget, sType, tchService, tch);
		aStaffPanels[oTarget.uniqueID] = oStaffPanel;
		return oStaffPanel;
	}
	return tache.Panel.staff.createInst(oTarget, sType, tchService, tch);
}
tache.opinionCtrl = {
	isShow : true,
	type : tache.constant.opinionType.option,
	timer : null,
	getType : function() {
		return this.type;
	},
	setRequire : function(oOpinionRequire) {
		oOpinionRequire.style.display = "";
	},
	hidden : function(oOpinionContainer) {
		this.isShow = false;
		oOpinionContainer.style.display = "none";
	},
	show : function(oOpinionContainer) {
		this.isShow = true;
		oOpinionContainer.style.display = "block";
	},
	dynamicShow : function() {
		this.isShow ? this.hidden() : this.show();
	},
	setType : function(sOpinionType, oOpinionContainer, oOpinionRequire) {
		this.type = sOpinionType;
		var aOpinionCtrl = {};
		aOpinionCtrl[tache.constant.opinionType.hidden] = function() {
			this.hidden(oOpinionContainer);
		};
		aOpinionCtrl[tache.constant.opinionType.option] = function() {
			this.show(oOpinionContainer);
		};
		aOpinionCtrl[tache.constant.opinionType.require] = function() {
			this.show(oOpinionContainer);
			this.setRequire(oOpinionRequire)
		};
		aOpinionCtrl[sOpinionType].call(this);
	},
	init : function(context, layer) {
		var oOpinionInput = layer.$("FL_EGN_OPINION_INPUT");
		var oOpinionRequire = layer.$("FL_EGN_OPINION_REQUIRE");
		this.setType(context.getOpinion().type, layer.$("FL_EGN_OPINION_ROW"), oOpinionRequire);
		var aDefaultValue = context.getOpinion().getDefaultValue();
		if (aDefaultValue != '')
			oOpinionInput.value = aDefaultValue; // IE存在BUG，如果在将值赋空时，第一次无法触发onpropertychange事件
		var oOpinionCtrl = this;
		initOpinionMenu();
		oOpinionInput.onpropertychange = function() {
			context.getOpinion().setValue(this.value);
		}
		function initOpinionMenu() {
			var oOpinionOften = layer.$("FL_EGN_OFTEN_OPINION_DIV");
			var oOpinionEditor = layer.$("FL_EGN_OPINION_EDIT_BUTTON");
			var oOftenOpinionSeter = layer.$("FL_EGN_OFTEN_OPINION_SET_BUTTON");
			var oAction = {
				onclick : function(oMenuItem) {
					layer.$("FL_EGN_OPINION_INPUT").value = oMenuItem.innerText;
				}
			};
			reSetOftenOpinion();
			oOpinionEditor.onclick = function() {
				doOpinion();
				reSetOftenOpinion();
			}
			oOftenOpinionSeter.onclick = function() {
				if (oOpinionInput.value == "")
					return;
				setOftenOpinion(oOpinionInput.value)
			}
			function reSetOftenOpinion() {
				var opinionMenuDoc = flow.Service.getOpinionMenuDoc();
				var iMenuLength = tache.opinionMenu.setMenuList(opinionMenuDoc, oOpinionOften, oAction);
				if (iMenuLength)
					layer.$("FL_EGN_OPINION_CNT").innerText = '[共' + iMenuLength + '条]';
				else
					layer.$("FL_EGN_OPINION_CNT").innerText = '';
			}
			function setOftenOpinion(sOpinion) {
				if (sOpinion.Tlength() > 250) {
					Message.fail(flowFormMenuLang.common_opinion_size_exceed_250, layer.getDomEle());
					return;
				}
				var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
				var sendXML = '<?xml version="1.0" encoding="GBK"?>' + '<root><FLOW_MOD/><TCH_MOD/><OPINION_TYPE>STAFF</OPINION_TYPE>' + '<ADD><record OPINION_CONTENT="' + xmlEncode(sOpinion) + '" /></ADD>' + '<DEL/><EDIT/></root>';
				XMLDoc.loadXML(sendXML);
				var saveURL = "/servlet/FormTurnServlet?tag=17";
				formContext.App.ajaxRequest(saveURL, {
							async : true,
							xml : XMLDoc,
							onStateChange : function(oXMLHttp) {
								stateChange(oXMLHttp)
							}
						});
				function stateChange(oXMLHttp) {
					Message.xmlHttpLoading(oXMLHttp, {
								wait : flowFormMenuLang.submitting_wait + "......",
								succeed : flowFormMenuLang.submit_succ
							}, layer.getDomEle(), {
								onSucceed : function() {
									reSetOftenOpinion();
								}
							})
				}
			}
		}
	},
	isInvalid : function(context) {
		return (this.type == tache.constant.opinionType.require && !context.getOpinion().getValue());
	}
}
tache.attachCtrl = {
	oService : null,
	uploader : null,
	files : {},
	init : function(oService, oWin) {
		this.oService = oService;
		this.uploader = oWin.$("FL_EGN_UPLOADER");
		var self = this;
		if (this.uploader.readyState == "complete") {
			initUploader(this.uploader);
		} else {
			this.uploader.onreadystatechange = function() {
				if (this.readyState == "complete") {
					initUploader(this);
				}
			}
		}
		if (!oService.context.getWinCfg().showAttach) {
			oWin.$("FL_EGN_UPLOADER_ROW").style.display = "none";
		}
		function initUploader(oUploader) {
			oUploader.init();
			oUploader.onFileAdd = function() {
				self.addFile();
			}
			oUploader.onFileDel = function() {
				self.delFile();
			}
		}
	},
	addFile : function() {
		var e = formContext.getWin().form.event;
		var file = e.hook.file;
		var oXMLDoc = new ActiveXObject("Microsoft.XMLDOM");
		oXMLDoc.loadXML(e.hook.serverData);
		var xmlNode = oXMLDoc.selectSingleNode("/root/rowSet");
		var sServerRelativePath = decodeURIComponent(xmlNode.getAttribute("relativeName"));
		var sHref = xmlNode.selectSingleNode("/root/rowSet/name/a").getAttribute("href")
		this.files[file.id] = {
			name : file.name,
			size : file.size,
			serverRelativePath : sServerRelativePath
		};
		e.hook.link.href = sHref;
	},
	delFile : function() {
		var e = formContext.getWin().form.event;
		var file = e.hook.file;
		var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		var sRelativePath = encodeURIComponent(this.files[file.id].serverRelativePath);
		oXMLHTTP.Open("POST", "/servlet/flowAttach?relativeName=" + sRelativePath + "&OperType=2", false);
		oXMLHTTP.send();
		delete this.files[file.id];
	},
	getFilesQueuedNum : function() {
		if (!this.oService.context.getWinCfg().showAttach)
			return 0;
		if (!this.uploader.getFileQueuedCnt())
			return 0;
		return this.uploader.getFileQueuedCnt();
	},
	appendXML : function(XMLDoc) {
		var oXML = new ActiveXObject("Microsoft.XMLDOM");
		var oFiles = this.files;
		var sXML = '<?xml version="1.0" encoding="GBK"?>' + '<root><FLOW_MOD/><TCH_MOD/>';
		for (var key in oFiles) {
			sXML += '<rowSet relativeName="' + oFiles[key].serverRelativePath
			sXML += '" size="' + oFiles[key].size + '" staffId="' + formContext.globalVar.STAFF_ID + '">';
			sXML += '<name>' + xmlEncode(oFiles[key].name) + '</name>';
			sXML += '</rowSet>';
		}
		sXML += '</root>';
		oXML.loadXML(sXML);
		var oFilesXML = oXML.selectNodes("/root/rowSet");
		var iLen = oFilesXML.length;
		for (var i = 0; i < iLen; i++) {
			var oNewNode = oFilesXML[i].cloneNode(true);
			XMLDoc.selectSingleNode("/root/FLOW/ATACHES").appendChild(oNewNode);
		}
	}
}

tache.opinionMenu = {
	setMenuList : function(opinionMenuDoc, oOpinionOften, oAction) {
		oOpinionOften.innerHTML = "";
		var sOpinionOftenTemplate = oTemplate.XMLDocument.selectSingleNode("/root/opinion_often_template").text;
		var opinionRows = opinionMenuDoc.selectNodes("/root/rowSet");
		var oFormDoc = formContext.getWin().form.document;
		if (opinionRows != null) {
			if (opinionRows.length > 0) {
				for (var i = 0; i < opinionRows.length; i++) {
					oOpinionOften.insertAdjacentHTML("beforeEnd", sOpinionOftenTemplate);
					var sText = opinionRows[i].selectSingleNode("OPINION_CONTENT").text;
					var oDiv = oOpinionOften.childNodes[i];
					oDiv.innerText = sText;
					oDiv.onclick = function() {
						oAction && oAction.onclick(this)
					};
					oDiv.onmouseover = function() {
						this.style.background = "#3470CC";
						this.style.color = "white";
					}
					oDiv.onmouseout = function() {
						this.style.background = "";
						this.style.color = "#666666"
					}
					oOpinionOften.appendChild(oDiv);
					oDiv.title = sText;
				}
			}
		}
		return (opinionRows) ? opinionRows.length : 0;
	},

	// 新 展示常用意见
	setMenuListNew : function(opinionMenuDoc, oOpinionOftenHtml, curPage, pageSize, oAction, oMouseOver, oMouseOut) {
		var temp = "";
		var oFormDoc = formContext.getWin().form.document;
		var opinionRows = opinionMenuDoc.selectNodes("/root/rowSet");
		if (opinionRows != null) {
			curPage = curPage < 1 ? 1 : curPage;
			pageSize = pageSize ? pageSize : 3;
			var length = opinionRows.length;
			var startRow = (curPage - 1) * pageSize;
			var endRow = curPage * pageSize;
			var oDiv = oFormDoc.createElement("div");
			if (opinionRows.length > 0) {
				for (var i = startRow; i < length && i < endRow; i++) {
					var oSpan = oFormDoc.createElement("span");
					oSpan.style.cssText = "width:100%;cursor: pointer;";
					var sText = opinionRows[i].selectSingleNode("OPINION_CONTENT").text;
					oSpan.innerHTML = oOpinionOftenHtml.replace('$TITLE', sText);

					oSpan.onclick = function() {
						oAction && oAction.onclick(this)
					};
					oSpan.onmouseover = function() {
						oMouseOver && oMouseOver.onclick(this)
					}
					oSpan.onmouseout = function() {
						oMouseOut && oMouseOut.onclick(this)
					}

					oDiv.appendChild(oSpan);
				}
			}
		}
		return oDiv;
	}
}

function doCancelFlow() {
	if (!confirm(flowFormMenuLang.cancel_flow_confirm)) {
		return;
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var url = "/FlowBrowse?system_code=D&op_type=cancel_flow&flow_id=" + formContext.FLOW.FLOW_ID;
	oXMLHTTP.Open("POST", url, false);
	oXMLHTTP.send();
	var dataXML = new ActiveXObject("Microsoft.XMLDOM");
	dataXML.load(oXMLHTTP.responseXML);
	oResult = dataXML.selectNodes("/FLOW/RESULT");
	var ret, msg;
	if (oResult != null && oResult.length > 0) {
		ret = oResult[0].getAttribute("ret");
		if (ret == 0) {
			alert(flowFormMenuLang.flow_cancel_succ);
			formContext.callback();
			formContext.getWin().self.close();
			return true;
		} else {
			msg = flowFormMenuLang.flow_cancel_fail + oResult[0].text;
			alert(msg);
			return false;
		}
	} else {
		alert(flowFormMenuLang.flow_cancel_fail);
		return false;
	}
}

function isCancelBtnDisabled() {
	if (formContext.FLOW.TCH_ID != 0) {
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST", "/servlet/JSRealtyServlet?tag=33&flowId=" + formContext.FLOW.FLOW_ID, false);
		xmlhttp.send();
		if (isSuccess(xmlhttp)) {
			oXml = xmlhttp.responseXML;
			var returnCode = oXml.selectSingleNode("/root/resultCode").text;
			if (returnCode == 0) {
				return false;
			} else {
				return true;
			}
		}
		return true;
	} else {
		return true;
	}
}

// 添加流程关注
function addFlowAttention(timer) {
	var returnValue;
	if (timer && timer == 1) {
		returnValue = window.showModalDialog("/workshop/form/flowFormTimer.jsp?callback=window.dialogArguments.callbackFn()", window, "dialogWidth:650px;dialogHeight:350px;center:no;help:no;resizable:no;status:no");
	}

	if (!timer || (returnValue && returnValue.state == 'ok')) {
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST", "/servlet/flowOper?OperType=15&flowId=" + formContext.FLOW.FLOW_ID, false);
		if (returnValue && returnValue.dataXml) {
			xmlhttp.send('<root>' + returnValue.dataXml + '</root>');
		} else {
			xmlhttp.send();
		}
		if (isSuccess(xmlhttp)) {
			MMsg(flowFormMenuLang.add_focus_succ);
			formContext.menuObject.executeRule();
		}

	}
}

// 取消流程关注
function delFlowAttention(timer) {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", "/servlet/flowOper?OperType=16&flowIds=" + formContext.FLOW.FLOW_ID + "&timer=" + timer, false);
	xmlhttp.send();
	if (isSuccess(xmlhttp)) {
		MMsg(flowFormMenuLang.cancel_attention_succ);
		formContext.menuObject.executeRule();
	}
}

// 是否已添加关注
function isAddedFlowAttention() {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", "/servlet/flowOper?OperType=17&flowId=" + formContext.FLOW.FLOW_ID, false);
	xmlhttp.send();
	if (isSuccess(xmlhttp)) {
		var xmlData = xmlhttp.responseXML;
		var returnCode = xmlData.selectSingleNode("/root/resultCode").text;
		if (returnCode == 1) {// 已添加关注
			return true;
		}
	}
	return false;
}

// 判断流程是否是首环节或者已竣工
function isFlowCanAttention() {
	var flag = isFlowBegin() || (formContext.FLOW.FLOW_STATUS == 'F');
	return flag;
}

function isDisabledAddFlowAttention() {
	var flag = isFlowBegin() || (formContext.FLOW.FLOW_STATUS == 'F') || isAddedFlowAttention();
	return flag;
}

// 取消接收，将单子退回工单池
function cancelReceive() {
	if (!formContext.onCancelReceiveBeforeEvent())
		return false;

	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var iTchId = formContext.FLOW.TCH_ID;
	oXMLHTTP.open("POST", '../../servlet/flowOper?OperType=19&tchId=' + iTchId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		MMsg(flowFormMenuLang.rele_succ);
		toolbarMenuUtil.setReceiveDisabled(false).setCancelReceiveDisabled(true).setDoFlowDisabled(true);
	}
	
	if (!formContext.onCancelReceiveAfterEvent())
		return false;	
}

// 当前员工是否为流程发起人 add by tangft 2013.10.20
function getSubmitStaff(oForm) {
	flowId = oForm.FLOW.TOP_FLOW_ID;
	var currentStaffId = oForm.GLOBAL_VAR.STAFF_ID;
	var staffId;
	var sql;
	sql = "select T.STAFF_ID from flow T WHERE T.FLOW_ID = " + flowId;
	var sqlResult = queryAllData(sql);
	if (sqlResult != "" && sqlResult != null) {
		staffId = sqlResult[0].STAFF_ID;
		return (currentStaffId != staffId);
	} else {
		return true;
	}
}

// 发送短信邮件催办 add by tangft 2013.10.20
function hurryBySmsEmail(notifyType, oForm) {
	var flowId = oForm.FLOW.TOP_FLOW_ID;
	var msg = flowFormMenuLang.sms_and_email;
	if (notifyType == 1) {
		msg = flowFormMenuLang.sms;
	} else if (notifyType == 2) {
		msg = flowFormMenuLang.email;
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	try {
		var staffs = getHurryStaffsInfo(flowId);
		if (!staffs || staffs == "" || staffs == null || staffs == "null") {
			alert(flowFormMenuLang.curr_staff_inconformity_hurry);
			return;
		}
		var msg = formatResource(if_send_hurry, staffs, msg);
		if (confirm(msg)) {
			oXMLHTTP.Open("POST", "/servlet/flowOper?OperType=21&notifyType=" + notifyType + "&flowId=" + flowId, false);
			oXMLHTTP.send();
			if (isSuccess(oXMLHTTP)) {
				alert(flowFormMenuLang.hurry_succ);
			} else {
				alert(flowFormMenuLang.hurry_fail);
			}
		}
	} catch (e) {
		alert(flowFormMenuLang.ajax_call_fail);
	}
}

// 获取催办员工信息 区域-姓名 add by tangft 2013.10.20
function getHurryStaffsInfo(flowId) {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "/servlet/flowOper?OperType=20&flowId=" + flowId, false);
	oXMLHTTP.send();
	if (isSuccess(oXMLHTTP)) {
		if (oXMLHTTP.responseXML.selectSingleNode("/root/STAFF_NAMES").text != "") {
			return oXMLHTTP.responseXML.selectSingleNode("/root/STAFF_NAMES").text;
		}
	}
	return '';
}

// 催办按钮权限控制
function hurryButtonHidden(oForm) {
	var staffId, currentStaffId, flag = 0;
	flowId = oForm.FLOW.TOP_FLOW_ID;
	currentStaffId = oForm.GLOBAL_VAR.STAFF_ID;
	var sqlCurr = "select T.STAFF_ID from flow T WHERE T.FLOW_ID = " + flowId;
	var sqlResultCurr = queryAllData(sqlCurr);

	if (sqlResultCurr != "" && sqlResultCurr != null) { // 判断当前人是不是发起人
		staffId = sqlResultCurr[0].STAFF_ID;
		if (currentStaffId == staffId) {
			return false;
		} else {
			flag = 1;
		}
	}
	// 不是发起人就判断是不是配置在codelist特定有权限的人
	if (flag == 1) {
		var sqlCode = "select count(t.code) TEXT from codelist t where t.code_type='REQUIRE_MANAGE_HURRY_STAFFID' and t.code= " + currentStaffId;
		var sqlResultCode = queryAllData(sqlCode);
		if (sqlResultCode[0].TEXT == 1) { // 是特定的人
			return false;
		} else {
			return true;
		}
	}

}

function hurryBySmsOrEmail(notifyType, oForm) {
	var flowId = oForm.FLOW.TOP_FLOW_ID;
	var msg = flowFormMenuLang.sms_and_email;
	if (notifyType == 1) {
		msg = flowFormMenuLang.sms;
	} else if (notifyType == 2) {
		msg = flowFormMenuLang.email;
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	try {
		var staffs = getHurryStaffsInfo(flowId);
		if (!staffs || staffs == "" || staffs == null || staffs == "null") {
			alert(flowFormMenuLang.curr_staff_inconformity_hurry);
			return;
		}
		var msg = formatResource(flowFormMenuLang.if_send_hurry, staffs, msg);
		if (confirm(msg)) {
			oXMLHTTP.Open("POST", "/servlet/flowOper?OperType=21&notifyType=" + notifyType + "&flowId=" + flowId, false);
			oXMLHTTP.send();
			if (isSuccess(oXMLHTTP)) {
				alert(flowFormMenuLang.hurry_succ);
			} else {
				alert(flowFormMenuLang.hurry_fail);
			}
		}
	} catch (e) {
		alert(flowFormMenuLang.ajax_call_fail);
	}
}
// 当前员工是否是指定环节的接收人
function isTchPersonDisabled(tchMod, oForm) {
	flowId = oForm.FLOW.TOP_FLOW_ID;
	var currentStaffId = oForm.GLOBAL_VAR.STAFF_ID;
	var staffId;
	var sql;
	sql = "SELECT t.PERSON FROM v_tache t where t.FLOW_ID= " + flowId + "and tch_mod =" + tchMod + " and rownum =1";
	var sqlResult = queryAllData(sql);
	if (sqlResult != "" && sqlResult != null) {
		staffIds = sqlResult[0].PERSON.split(',');
		for (var i = 0; i < staffIds.length; i++) {
			if (currentStaffId == staffIds[i])
				return false;
		}
		return true;
	} else {
		return true;
	}
}

// 当前员工是否是指定环节的接收人
function isTchPersonDisabledByNum(tchNum, oForm) {
	flowId = oForm.FLOW.TOP_FLOW_ID;
	var currentStaffId = oForm.GLOBAL_VAR.STAFF_ID;

	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", "/servlet/flowOper?OperType=36&flowId=" + flowId + "&tchNum=" + tchNum, false);
	xmlhttp.send();
	if (isSuccess(xmlhttp)) {
		var person = xmlhttp.responseXML.selectSingleNode("/root/PERSON").text;
		var staffIds = person.split(',');
		for (var i = 0; i < staffIds.length; i++) {
			if (currentStaffId == staffIds[i])
				return false;
		}
		return true;
	}
	return true;
}

// 流程阅毕
function flowAutoRead(batchFlag) {
	var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	var sendXML = '<?xml version="1.0" encoding="GBK"?>' + '<root>';
	var fsMap = getFatherAndSonPro();
    for(var i=0;i<fsMap.length;i++){
      sendXML += '<NOTIFY>' + '<TCH_ID>' + fsMap[i] + "</TCH_ID>" + '<OPINION>已阅</OPINION>' + '</NOTIFY>';
    }
	sendXML += '<NOTIFY>' + '<TCH_ID>' + parent.$request("tchId") + "</TCH_ID>" + '<OPINION>已阅</OPINION>' + '</NOTIFY>';
	sendXML += '</root>';

	var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLDoc.loadXML(sendXML);
	var saveURL = "";
	if(batchFlag){
		saveURL = "/servlet/flowOper?OperType=62";
	}else{
		saveURL = "/servlet/flowOper?OperType=10";
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", saveURL, false);
	oXMLHTTP.send(XMLDoc);

	if (isSuccess(oXMLHTTP)) {
		formContext.closeWin();
		formContext.callback();
	}
}

// 判断当前员工是否为流程管理员
function isFlowModelFlowManager() {
	var result = false;
	var url = "/servlet/flowOper?OperType=41&flowId=" + formContext.FLOW.FLOW_ID + "&staffId=" + formContext.GLOBAL_VAR.STAFF_ID;
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", url, false);
	oXMLHTTP.send();

	if (isSuccess(oXMLHTTP)) {
		var resultCode = parseInt(oXMLHTTP.responseXML.selectSingleNode("/root/resultCode").text);
		result = (resultCode == 1) ? true : false;
	}

	return result;
}

// 获取模拟操作员工列表
function getSimulateOperslist() {
	var sfs = getStaffInfo(formContext.FLOW.TCH_RECEIVER, "", "3");
	var sfsNodes = sfs.selectNodes("/root/rowSet");
	var itemXMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	itemXMLDoc.loadXML('<?xml version="1.0" encoding="GBK"?><root></root>');
	for (var i = 0; i < sfsNodes.length; i++) {
		var sname = sfsNodes[i].selectSingleNode("STAFF_NAME").text;
		var sid = sfsNodes[i].selectSingleNode("STAFF_ID").text;
		var oItemXML = itemXMLDoc.createElement("bar:item");
		oItemXML.setAttribute("label", sname);
		oItemXML.setAttribute("onclick", "doFlowSimulateOper('" + sid + "')");
		itemXMLDoc.documentElement.appendChild(oItemXML);
	}
	return itemXMLDoc.documentElement.childNodes;
}

function isDisableSuperControl() {
	var disable = false;
	var isFlowManager = isFlowModelFlowManager();
	var _Url = window.parent.getUrlParam();
	var isSuperControl = isUndefined(_Url.action) ? false : ((_Url.action == 'superControl') ? true : false);

	disable = !(isFlowManager && isSuperControl);

	return disable;
}

function doFlowSimulateOper(_TchExcerID) {
	formContext.GLOBAL_VAR.STAFF_ID = _TchExcerID;
	doFlowOnLayer();
}

function doTacheCancelBackTo() {
	var flowId = formContext.FLOW.FLOW_ID;
	var url = "/FlowBrowse?flow_id=" + flowId + "&system_code=G&action=superControl";
	openURL(url);
}

function isDisplayCancelBackTo() {
	var result = false;
	var procName = $getSysVar('CONTROL_FLOW_TACHE_CANCEL_PROC');
	if(procName){
		var resXmlDoc = null;
		var url = "/FlowDataIntf?action=controlFlowTchCancel&flowId="+formContext.FLOW.FLOW_ID+"&procName="+procName;
		var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");		
		xmlHttp.open("POST", url, false);
		xmlHttp.send()
		
		resXmlDoc = xmlHttp.responseXML;
		var excCode = resXmlDoc.selectSingleNode("/ROOT/EXC_RS/EXC_CODE/text()").nodeValue;
		result = (parseInt(excCode) == 1);
	}
	
	return result;
}


function getFlowNextTchID(){
	var tchId = "";
	var url = "/FlowDataIntf?action=getFlowNextTchID&flowId="+formContext.FLOW.FLOW_ID;
	var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");		
	xmlHttp.open("POST", url, false);
	xmlHttp.send()
	if(isSuccess(xmlHttp)){
		var resXmlDoc = xmlHttp.responseXML;
		var _TchNode =  resXmlDoc.selectSingleNode("/root/TACHE/TCH_ID/text()");
		if(_TchNode){
			tchId = _TchNode.nodeValue;
		}
	}
	
	return tchId;
}

function doFlowMgrAction(){
	var tchId = getFlowNextTchID();
	if(tchId.length>0)
	{
		window.parent.location.href = "/workshop/form/index.jsp?tchId="+tchId+"&callback=opener.document.execCommand('refresh')&fullscreen=yes&action=superControl";
	}
	else
	{
		window.parent.location.href = "/workshop/form/index.jsp?fullscreen=yes&action=superControl&flowId="+formContext.FLOW.FLOW_ID;
	}
}

function isTurnMaxTchDisabled(pTchMod,oForm){
	var flowId = oForm.FLOW.TOP_FLOW_ID;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");	
	xmlhttp.Open("POST","/servlet/flowOper?OperType=60&flowId="+flowId,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)){
		var maxTchMod = xmlhttp.responseXML.selectSingleNode("/root/TCH_MOD").text;
		if((','+pTchMod+',').indexOf(','+maxTchMod+',') > -1){
			return false;
		}
	}
	return true;
}
/**
 * 显示图片
 * @param self this
 * @param id 图片id
 * @param imgSrc 图片地址址
 * @param pWidth 图片宽度
 * @param pHeight 图片高度
 */
function showImg(self,id,imgSrc,pWidth,pHeight){
	var dom = parent.fraForm.document.getElementById(id);
	if(!dom || dom==null){
		if(self.tagName == 'DIV'){
			var W = self.offsetWidth;
			var vLeft = self.offsetLeft;
		}else{
			var W = self.parentNode.parentNode.offsetWidth;
			var vLeft = self.parentNode.parentNode.offsetLeft;
		}
		dom = document.createElement("div");
		dom.id = id;
		dom.style.width = pWidth;
		dom.style.height = pHeight;
		dom.style.position = 'absolute';
		dom.style.left = vLeft-((pWidth-W)/2);
		dom.style.top = parent.fraForm.document.body.scrollTop;
		dom.innerHTML = "<img src='"+imgSrc+"' style='width:100%;height:100%'>";
		parent.fraForm.document.body.appendChild(dom);
		self.onmouseout = function(){
			parent.fraForm.document.getElementById(id).style.display='none';
		}
	}else{
		dom.style.top = parent.fraForm.document.body.scrollTop;
		parent.fraForm.document.getElementById(id).style.display='block';
	}
}
function getFatherAndSonPro(){
	var oXMLDoc = formContext.App.syncAjaxRequest('../../servlet/flowOper?OperType=63&tch_id=' + formContext.FLOW.TCH_ID);
	var oNodes = oXMLDoc.selectNodes("/root/rowSet");
	var iLen = oNodes.length;
	var map = [];
	for (var i = 0; i < iLen; i++) {
		var oNode = oNodes[i];
		var tchId = oNode.selectSingleNode("TCH_ID").text;
		map.push(tchId);
	}
	return map;
}