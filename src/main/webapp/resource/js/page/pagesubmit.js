//����XML�ĵ��ຯ��
function XMLBuilder(setQuery,goPage,pageCount,currentPage,pageSize,pageIndex,pSize)
{
  this.pageXML = new ActiveXObject("Microsoft.XMLDOM");
  this.root = this.pageXML.createElement("root");
  //��ҳXML��Ϣ����װ
  this.pageInfoElement = this.pageXML.createElement("PageInfo");
  this.pageInfoElement.setAttribute("pageCount",pageCount);
  this.pageInfoElement.setAttribute("currentPage",currentPage);
  this.pageInfoElement.setAttribute("pageSize",pSize);
  this.pageInfoElement.setAttribute("setQuery",setQuery);
  this.pageInfoElement.setAttribute("goPage",goPage);
  this.pageInfoElement.setAttribute("pageIndex",pageIndex);
  this.root.appendChild(this.pageInfoElement);
}
//�ع�XMLBuilder����
XMLBuilder.prototype.xml = function ()
{
  return this.pageXML;
}
XMLBuilder.prototype.xmlroot = function ()
{
  return this.root;
}
////����XMLQUERY
//function XMLQUERYBuilder(pageXML,root)
//{
//  //��ѯ����XML��Ϣ����װ
//  this.queryInfoElement = pageXML.createElement("QueryInfo");
//  this.vaccname=document.all("vacc.vaccname").value;
//  this.queryInfoElement.setAttribute("vaccname",this.vaccname);
//  root.appendChild(this.queryInfoElement);
//  pageXML.appendChild(root);
//}
//����XMLHTTP
function XMLHTTPBuilder(url,xml)
{
  this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  this.pageURL = url;//"vaccAction.do?postAction=shwVaccLst";
  xml.async = false;
  this.xmlhttp.Open("POST",this.pageURL,false);
  this.xmlhttp.send(xml);
  this.page = new ActiveXObject("Microsoft.XMLDOM");
  this.page.load(this.xmlhttp.responseXML);
}
//�ع�XMLHTTPBuilder����
XMLHTTPBuilder.prototype.pagexml = function ()
{
  return this.page;
}
//����XML�ĵ��ຯ������
//ÿ��ҳ���ύ���õĺ���
function pageSubmit(subType,url)
{
  var pageCount=1;
  var currentPage=1;
  var pageSize=10;
  var arrResult = url.split("?");
  var arrTmp = arrResult[1].split("&");
  var setQuery=arrTmp[1].split("=")[1];
  var goPage="";
  var pageIndex="";
  var pSize=document.all("pSize").value;
  if(subType==1){
    goPage=arrTmp[2].split("=")[1];
    pageIndex=document.all("pageIndex").value;
    url=url.substr(0,url.indexOf("&goPage"));
  }else if(subType==2){
    goPage="jump";
    pageIndex=arrTmp[2].split("=")[1];
    url=url.substr(0,url.indexOf("&pSize"));
  }

  var xmlBuilder = new XMLBuilder(setQuery,goPage,pageCount,currentPage,pageSize,pageIndex,pSize);
  var xmlqueryBuilder = new XMLQUERYBuilder(xmlBuilder.xml(),xmlBuilder.xmlroot());
  var xmlhttpBuilder = new XMLHTTPBuilder(url,xmlBuilder.xml());

    var page = xmlhttpBuilder.pagexml();
//      alert(page.xml);
    var PageInfo = page.selectSingleNode("/root/PageInfo");
    var pageCount=new Number(PageInfo.getAttribute("pageCount"));
    var currentPage=PageInfo.getAttribute("currentPage");
    var pageSize=PageInfo.getAttribute("pageSize");
//�����齨Page1���
   var page1 = document.getElementById("page1");
   for(var i=0;i<page1.rows.length;i++)
   {
       page1.deleteRow(i);
   }
   var trNode=page1.insertRow();
   var tdNode=trNode.insertCell();
   tdNode.align="right";
  //��ʽ�ĳ�ʼ��
  var bgpic_no_repeat ='background-repeat:no-repeat;';
  var page_text='font-size:12px;color:#000000;text-decoration: none;text-align: center;cursor: hand;vertical-align: top;';
  var page_text_2='font-size:12px;color:#000000;text-decoration: none;text-align: right;vertical-align: top;';
  var page_num ='font-size: 10px;color: #999999;text-decoration: none;cursor:hand;vertical-align: top;';
  var page_num_cur ='font-size: 10px;color: #ff0000;text-decoration: none;text-align: center; vertical-align: top;cursor:hand;';
  //body����
  var  first,last,numClass,pageId;
  var showText ="";
  showText+='<table id=page1 width=100% border=0 cellpadding=0 cellspacing=0>';
  showText+='  <tr>' ;
  //showText+='    <td width=70>&nbsp;</td>' ;
  showText+='    <td align=right>' ;
  showText+='      <table width=100% border=0 align=center cellpadding=0 cellspacing=0>';
  showText+='		 <tr> ';
  showText+='          <td align=right vlign=top><font style="'+page_text_2+'">�ܹ���<span style="'+page_num_cur+'">'+pageCount+'</span>&nbsp;ҳ</font></td>';
  showText+='          <td width=20 valign=top>&nbsp;</td> ';
  showText+='          <td width=20 valign=top> ';
  showText+='            <a href="javascript:pageSubmit(1,\''+url+'&goPage=first\')" title=��һҳ>';
  showText+='              <img src='+getRealPath('../../image/pageImages/previous.gif','page.js')+' height=17 border=0 class="pageControlerPicPosition"> ';
  showText+='            </a>';
  showText+='          </td>';
  var pageId=1;
  showText+='          <td width=20 height=19 valign=top> ' ;
  showText+='            <a href="javascript:pageSubmit(1,\''+url+'&goPage=pre\')" title=��һҳ >';
  showText+='              <img src='+getRealPath('../../image/pageImages/previous.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"> ';
  showText+='            </a> ' ;
  showText+='          </td>';
  //����Ĭ�Ϸ�ҳ��������
  var pageIndexSize = 5 ;
  if (pageCount>pageIndexSize){
    //�����ҳ��>��ҳ��������
    //��ǰҳ��ʾ�ڵ�һλ
    first = currentPage ;
    if ((pageCount-currentPage+1)<pageIndexSize) {
      //���ʣ��ҳ��С�ڷ�ҳ���������������һ������������ҳ��+1
      last = pageCount + 1 ;
    } else {
      //���ʣ��ҳ��>=��ҳ���������������һ������=��ǰҳ+��������
      last = parseInt(currentPage) + parseInt(pageIndexSize) ;
    }
	if ((last-pageIndexSize)>0)
	{
		first = (last-pageIndexSize) ;
	}
  } else {
    //�����ҳ��<=��ҳ���������������һ������=��ҳ��+1
    first = 1 ;
    last = pageCount + 1 ;
  }
  for(var k=first;k<last;k++){
  showText+='          <td width="20" align="center" valign="top" style='+bgpic_no_repeat+'> ';
  //�뵱ǰҳ��ƥ������ʽ��ʾΪ�����Ĭ��
  if(k==currentPage){
   numClass = page_num_cur;
  }else{
   numClass = page_num;
  }
  showText+='<span style="'+numClass+'" onclick="pageSubmit(2,\''+url+'&pSize='+k+'\')" title=������'+k+'ҳ>'+k+'</span>';
  showText+='          </td>';
  }
  //ѭ������
  showText+='          <td width=20 valign=top> ';
  showText+='             <a  href="javascript:pageSubmit(1,\''+url+'&goPage=next\')" title=��һҳ> ';
  showText+='               <img src='+getRealPath('../../image/pageImages/last.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"> ';
  showText+='             </a> ' ;
  showText+='          </td>';
  showText+='          <td width=20 valign=top> ';
  showText+='            <a href="javascript:pageSubmit(1,\''+url+'&goPage=last\')" title=���һҳ>';
  showText+='               <img src='+getRealPath('../../image/pageImages/next.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"> ';
  showText+='            </a>';
  showText+='          </td>';
  showText+='          <td width=10>&nbsp;</td>';
  showText+='          <td width=90 height=19 valign=top>';
  showText+='             <font style="'+page_text_2+'">����<input type="text" name="pageIndex" maxlength="2" size="2"  class="pageControlerInput" height=10 border=0 value='+ currentPage +' />ҳ</font> ';
  showText+='               <a href="javascript:pageSubmit(1,\''+url+'&goPage=jump\')"'+' title="����ָ��ҳ"><img src='+getRealPath('../../image/pageImages/jump.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"/></a>';
  showText+='          </td>';
  showText+='          <td width=5>&nbsp;</td>';
  showText+='          <td width=90 height=19 valign=top>';
  showText+='            <font style="'+page_text_2+'">ÿҳ<input type="text" name="pSize" maxlength="2" size="2"  class="pageControlerInput" height=10 border=0 value='+ pageSize +' />��</font> ';
  showText+='              <a href="javascript:pageSubmit(1,\''+url+'&goPage=setPageSize\')"'+' title="����"><img src='+getRealPath('../../image/pageImages/count.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"/></a>';
  showText+='          </td>';
  showText+='        </tr>';
  showText+='      </table>' ;  tdNode.innerHTML=showText;
//�����齨Page1������
   //�б���Ĵ�������
//   alert(window.listTable.outerHTML);
   var listTable = document.getElementById("listTable");
//   listTable.deleteTHead();
   for(var i=listTable.rows.length-1;i>0;i--)
   {
       listTable.deleteRow(i);
   }
   var numTd=listTable.rows(0).cells.length;
   var oRows=page.selectSingleNode("/root/RowSet").childNodes;

   for(var i=0;i<oRows.length;i++)
   {
//       alert(oRows[i].xml);
       var listTrNode=listTable.insertRow();
       listTrNode.align="center";
       listTrNode.bgColor="#FFFFFF";
	   //���б�ÿ������һ����ѡ��
	   //alert(oRows[i].attributes[0].value);
       var listCheckTdNode=listTrNode.insertCell();
       listCheckTdNode.innerHTML='<input type="checkbox" name="listCheckId" value="'+oRows[i].attributes[0].value+'"/>';

       for(var j=1;j<numTd;j++)
       {
//        alert(oRows[i].attributes[j].value);
        var listTdNode=listTrNode.insertCell();
        if(oRows[i].attributes[j].value=="" || oRows[i].attributes[j].value==null || oRows[i].attributes[j].value=="null"){
          listTdNode.innerHTML="";
        }else{
          listTdNode.innerHTML=oRows[i].attributes[j].value;//oRows[i].Attributes[j].value;
        }
       }
   }
   //�б���Ĵ����������
}



