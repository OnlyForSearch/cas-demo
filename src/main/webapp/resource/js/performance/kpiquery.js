//����XMLQUERY
function XMLQUERYBuilder(pageXML,root)
{
  //��ѯ����XML��Ϣ����װ
  this.queryInfoElement = pageXML.createElement("QueryInfo");
  var kpiName = document.getElementById("kpiName").value;
  var kpiType = document.getElementById("kpiType").value;
  var cycleType = document.getElementById("cycleType").value;
  //alert(kpiName);
  //alert(kpiType);
  //alert(cycleType);

  this.queryInfoElement.setAttribute("kpiName",kpiName);
  this.queryInfoElement.setAttribute("kpiType",kpiType);
  this.queryInfoElement.setAttribute("cycleType",cycleType);
  root.appendChild(this.queryInfoElement);
  pageXML.appendChild(root);
}
