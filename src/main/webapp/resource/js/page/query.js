//����XMLQUERY
function XMLQUERYBuilder(pageXML,root)
{
  //��ѯ����XML��Ϣ����װ
  this.queryInfoElement = pageXML.createElement("QueryInfo");
//  this.vaccname=document.all("vacc.vaccname").value;
//  this.queryInfoElement.setAttribute("vaccname",this.vaccname);
  root.appendChild(this.queryInfoElement);
  pageXML.appendChild(root);
}
