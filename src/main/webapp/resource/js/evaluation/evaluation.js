//初始化区域
function setList(url,obj){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var selectXml = new ActiveXObject("Microsoft.XMLDOM");
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	selectXml.load(xmlhttp.responseXML);
	var oRows=selectXml.selectNodes("//root/Info");
	for(var i=0;i<oRows.length;i++)
	{
		// 建立Option对象
		var objOption = new Option(oRows[i].attributes[1].value,oRows[i].attributes[0].value);
		obj.add(objOption);
		
	}
}