var remarktitle;

/**
 * ��ȡ��Ԫ����
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
	// ���������,�������ʾ
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
 * Ĭ�ϵ��Զ�����ʾ�ű�,����fileds�е��ֶ�������,�ٸ��ݱ���������ʾ
 * 
 * @param {}
 *            oXml �Զ����ѯ�ص����ص�XML
 * @param {}
 *            repeatNum �ظ�����
 * @param {}
 *            arrColor �Զ�����ʾ��ɫ ��:
 *            [{name:'��',color:'red'},{name:'��',color:'blue'}]
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
		for (var k = 0; k < repeatNum; k++) // �ظ�����
		{
			if(k > rowSets.length-1) break; //��������,����Ҫ����,���Ŷ���
			strTable += "<td></td><td class='title'>��Ԫ����</td>";

			for (var i = 0; i < nodes.length; i++) {
				strTable += "<td  class='title'>"
						+ nodes[i].getAttribute("LABEL") + "</td>";
			}
		}
		strTable += "</tr>";
		for (var i = 0; i < rowSets.length; i++) {
			if (((i + 1) % repeatNum) == 1) // �ж��ظ���
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
			if (((i + 1) % repeatNum) == 0) // �ж��ظ���
			{
				strTable += "</tr>";
			}
		}
		strTable += "</table></div>";
		neAttPage.innerHTML += strTable;
	} else {
		EMsg("δ���ñ�ͷ����,��������!");
	}
	closeSearchpanelWin();
}

/**
 * ������ɫ�����ı���ɫ
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