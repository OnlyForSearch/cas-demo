// 查询业务下拉框选择项
function getSelectCommon(url, obj, blank)
{
	//window.open(url);
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", url, false);
	xmlhttp.send();

	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);
	var element = dXML.selectSingleNode("/root/rowSet");
	while (element != null)
	{
		var text = element.selectSingleNode("TEXT").text;
		var val = element.selectSingleNode("VALUE").text;
		var objOption = new Option(text, val);
		obj.add(objOption);
		element = element.nextSibling;
	}
}