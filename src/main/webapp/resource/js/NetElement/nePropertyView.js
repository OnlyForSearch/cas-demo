var remarktitle;

/**
 * 读取网元属性
 */
function loadNeProerty() {
	var neId = paramArray[0];
	var neFlag = paramArray[1];
	var sqlId, viewScript;
	xmlhttp.Open("POST", url + "43&neId=" + neId, false);
	xmlhttp.send();
	if (isSuccess(xmlhttp)) {
		sqlId = xmlhttp.responseXML.selectSingleNode("/root/Msg/SQL_ID");
		viewScript = xmlhttp.responseXML
				.selectSingleNode("/root/Msg/VIEW_SCRIPT");
	}
	// 如果有配置,则继续显示
	if (sqlId) {
		remarktitle = xmlhttp.responseXML
				.selectSingleNode("/root/Msg/REMARK").text;
		var result = ResultFactory.newResult(sqlId.text, {
					hasField : true
				});
		result.onLoad = function(oXml) {
			eval(viewScript.text);
		}
		if(searchValue.value!="")
		{
			//eval('var oParam = {ne_id : neId,' + searchParam.value + ': "' + searchValue.value +'"}');
			var oParam = {ne_id:neId + "," + searchValue.value};
		}
		else
		{
			var oParam = {ne_id:neId};
		}
		result.send(Result.FORCE_GET, oParam);
	}
}

/**
 * 默认的自定义显示脚本,先用fileds中的字段填充标题,再根据标题内容显示
 * 
 * @param {}
 *            oXml 自定义查询回调返回的XML
 * @param {}
 *            repeatNum 重复列数
 * @param {}
 *            arrColor 自定义显示颜色 例:
 *            [{name:'是',color:'red'},{name:'否',color:'blue'}]
 */
function defViewFunc(oXml, repeatNum, arrColor) {
	var strTable = "";
	var imgTag = "<img src='../../resource/image/arrow.gif' width='11' height='12'>";
	var groupTag = '<div style="height:26">'
			+ '<IMG src="../../resource/image/form_title_item.gif" align="baseline">'
			+ '<span style="height:100%;padding:20 0 1 6;font-weight:bold;color:#716D63">'
			+ remarktitle
			+ '</span>'
			+ ' <span onclick="openSearchpanelWin()" style="cursor:hand;"><img src="../../resource/image/ico/filter.gif"></span></div>'
			+ '<div class="neProDefault">';
	var fields = oXml.selectSingleNode("/root/Fields");
	var rowSets = oXml.selectNodes("/root/rowSet");
	if (fields) {
		var nodes = fields.childNodes;
		strTable += groupTag
				+ "<table width='97%' border=0 cellpadding=0 cellspacing=0><tr>";
		for (var k = 0; k < repeatNum; k++) // 重复次数
		{
			if(k > rowSets.length-1) break; //如果结果少,不需要多行,则不排多行
			strTable += "<td></td><td class='title'>网元名称</td>";

			for (var i = 0; i < nodes.length; i++) {
				strTable += "<td  class='title'>"
						+ nodes[i].getAttribute("LABEL") + "</td>";
			}
		}
		strTable += "</tr>";
		for (var i = 0; i < rowSets.length; i++) {
			if (((i + 1) % repeatNum) == 1) // 判断重复列
			{
				strTable += "<tr>";
			}
			strTable += "<td>" + imgTag + "</td>";
			strTable += "<td>" + rowSets[i].selectSingleNode("NE_NAME").text
					+ "</td>";
			for (var j = 0; j < nodes.length; j++) {
				strTable += "<td>"
						+ setTextColor(rowSets[i].selectSingleNode(nodes[j]
										.getAttribute("NAME")).text, arrColor)
						+ "</td>";
			}
			if (((i + 1) % repeatNum) == 0) // 判断重复列
			{
				strTable += "</tr>";
			}
		}
		strTable += "</table></div>";
		neAttPage.innerHTML += strTable;
	} else {
		EMsg("未设置表头数据,请先设置!");
	}
	closeSearchpanelWin();
}

/**
 * 根据颜色参数改变颜色
 * 
 * @param {}
 *            srcText
 * @param {}
 *            arrColor
 * @return {}
 */
function setTextColor(srcText, arrColor) {
	var resultText = srcText;
	for (var i = 0; i < arrColor.length; i++) {
		if (arrColor[i].name == srcText) {
			resultText = "<span style='color:" + arrColor[i].color + "'>"
					+ srcText + "</span>"
		}
	}
	return resultText;
}

function openSearchpanelWin() {
	searchpanel.style.display = "block";
	// searchpanel.style.left = (document.body.offsetWidth - searchpanel.offsetWidth) / 2;
	searchpanel.style.left = event.clientX + document.body.scrollLeft
			- document.body.clientLeft;
	searchpanel.style.top = event.clientY + document.body.scrollLeft
			- document.body.clientLeft;

}

function closeSearchpanelWin() {
	searchpanel.style.display = "none";
}