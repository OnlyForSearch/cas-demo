  function page(url){
  var pageCount=1;
  var currentPage=1;
  var pageSize=10;
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
  showText+='            <a href="javascript:pageSubmit(\''+url+'&goPage=first\',1)" title=��һҳ>';
  showText+='              <img src='+getRealPath('../../image/pageImages/previous.gif','page.js')+' height=17 border=0 class="pageControlerPicPosition"> ';
  showText+='            </a>';
  showText+='          </td>';
  var pageId=1;
  showText+='          <td width=20 height=19 valign=top> ' ;
  showText+='            <a href="javascript:pageSubmit(\''+url+'&goPage=pre\',1)" title=��һҳ >';
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
      last = currentPage + pageIndexSize ;
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
  showText+='<span style="'+numClass+'" onclick="pageSubmit(\''+url+'&pSize='+k+'\',2)" title=������'+k+'ҳ>'+k+'</span>';
  showText+='          </td>';
  }
  //ѭ������
  showText+='          <td width=20 valign=top> ';
  showText+='             <a  href="javascript:pageSubmit(\''+url+'&goPage=next\',1)" title=��һҳ> ';
  showText+='               <img src='+getRealPath('../../image/pageImages/last.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"> ';
  showText+='             </a> ' ;
  showText+='          </td>';
  showText+='          <td width=20 valign=top> ';
  showText+='            <a href="javascript:pageSubmit(\''+url+'&goPage=last\',1)" title=���һҳ>';
  showText+='               <img src='+getRealPath('../../image/pageImages/next.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"> ';
  showText+='            </a>';
  showText+='          </td>';
  showText+='          <td width=10>&nbsp;</td>';
  showText+='          <td width=90 height=19 valign=top>';
  showText+='             <font style="'+page_text_2+'">����<input type="text" name="pageIndex" maxlength="2" size="2"  class="pageControlerInput" height=10 border=0 value='+ currentPage +' />ҳ</font> ';
  showText+='               <a href="javascript:pageSubmit(\''+url+'&goPage=jump\',1)"'+' title="����ָ��ҳ"><img src='+getRealPath('../../image/pageImages/jump.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"/></a>';
  showText+='          </td>';
  showText+='          <td width=5>&nbsp;</td>';
  showText+='          <td width=90 height=19 valign=top>';
  showText+='            <font style="'+page_text_2+'">ÿҳ<input type="text" name="pSize" maxlength="2" size="2"  class="pageControlerInput" height=10 border=0 value='+ pageSize +' />��</font> ';
  showText+='              <a href="javascript:pageSubmit(\''+url+'&goPage=setPageSize\',1)"'+' title="����"><img src='+getRealPath('../../image/pageImages/count.gif','page.js')+' height=17 border=0  class="pageControlerPicPosition"/></a>';
  showText+='          </td>';
  showText+='        </tr>';
  showText+='      </table>' ;
  showText+='    </td>' ;
  showText+='  </tr>' ;
  showText+='</table>' ;
  showText+='<script type="text/javascript">function pageSubmit(url,subType){pageSubmit1(subType,url);}</script>';
//  showText+='<script type="text/javascript">function pagesubmit(url){pageSubmit2('+pageCount+','+currentPage+',url,'+pageSize+');}</script>';
  var pageTd = document.getElementById("pageTd");
  pageTd.innerHTML=showText;
  //document.write(showText);
  pageSubmit(1,url+'&goPage=first');

  }


