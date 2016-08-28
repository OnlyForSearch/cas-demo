//建立XMLQUERY
function XMLQUERYBuilder(pageXML,root)
{
  //查询条件XML信息的组装
  this.queryInfoElement = pageXML.createElement("QueryInfo");
  var leader = document.getElementById("leader").value;
  var orgId = document.getElementById("orgId").value;
  var state = document.getElementById("state").value;
  //alert(leader);
  //alert(orgId);
  //alert(state);

  this.queryInfoElement.setAttribute("leader",leader);
  this.queryInfoElement.setAttribute("orgId",orgId);
  this.queryInfoElement.setAttribute("state",state);
  root.appendChild(this.queryInfoElement);
  pageXML.appendChild(root);
}
