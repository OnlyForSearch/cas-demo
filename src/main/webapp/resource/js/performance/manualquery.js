//����XMLQUERY
function XMLQUERYBuilder(pageXML,root)
{
  //��ѯ����XML��Ϣ����װ
  this.queryInfoElement = pageXML.createElement("QueryInfo");
  var staffId = document.getElementById("staffId").value;
  var kpiId = document.getElementById("kpiId").value;
  var gradeStaff = document.getElementById("gradeStaff").value;
  var gradeDate = document.getElementById("gradeDate").value;

  this.queryInfoElement.setAttribute("staffId",staffId);
  this.queryInfoElement.setAttribute("kpiId",kpiId);
  this.queryInfoElement.setAttribute("gradeStaff",gradeStaff);
  this.queryInfoElement.setAttribute("gradeDate",gradeDate);

  root.appendChild(this.queryInfoElement);
  pageXML.appendChild(root);
}
