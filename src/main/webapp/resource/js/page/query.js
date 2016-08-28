//建立XMLQUERY
function XMLQUERYBuilder(pageXML,root)
{
  //查询条件XML信息的组装
  this.queryInfoElement = pageXML.createElement("QueryInfo");
//  this.vaccname=document.all("vacc.vaccname").value;
//  this.queryInfoElement.setAttribute("vaccname",this.vaccname);
  root.appendChild(this.queryInfoElement);
  pageXML.appendChild(root);
}
