//��ȥ�ַ���ͷ��β�Ŀո�
String.prototype.Trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}


 //  �ж�һ���ַ����Ƿ��Ǳ�׼�����ڸ�ʽ ("YYYY-MM-DD HH:MM:SS")
String.prototype.isValidDatetime=function()
{
var result=this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
if(result==null) return false;
var d= new Date(result[1], result[3]-1, result[4], result[5], result[6], result[7]);
return (d.getFullYear()==result[1]&&(d.getMonth()+1)==result[3]&&d.getDate()==result[4]&&d.getHours()==result[5]&&d.getMinutes()==result[6]&&d.getSeconds()==result[7]);
}
//  �������Ĳ�ѯ������ʼ�ͽ���ʱ���Ƿ��Ǳ�׼�����ڸ�ʽ("YYYY-MM-DD HH:MM:SS")
function checkConditions(frm){
    var startTime = document.all.startTime.value;
    if(startTime.length>0){  // �������ѯʱ��
        var noSpaceStartTime = startTime.replace(/(^\s*)|(\s*$)/g, "");  // ��ȥʱ��Ŀ�ʼ�ͽ����ո�
        startTime =noSpaceStartTime + "2004-10-04 22:11:24".substring(noSpaceStartTime.length,19);
        if(startTime.isValidDatetime()== false){
            alert("��ʼʱ��ĸ�ʽ����ȷ! ����������.");
            return false;
        }else{
            document.all.startTime.value = noSpaceStartTime;
        }
    }
    var endTime = document.all.endTime.value;
    if(endTime.length>0){  // �������ѯʱ��
        var noSpaceEndTime = endTime.replace(/(^\s*)|(\s*$)/g, "");  // ��ȥʱ��Ŀ�ʼ�ͽ����ո�
        endTime =noSpaceEndTime + "2004-10-04 22:11:24".substring(noSpaceEndTime.length,19);
        if(endTime.isValidDatetime()== false){
            alert("����ʱ��ĸ�ʽ����ȷ! ����������.");
            return false;
        }else{
            document.all.endTime.value = noSpaceEndTime;
        }
    }
    frm.submit();
    return true;
}

var newid ;
function OpenWindow(name,url,x,y,w,h,yn)
{
 var query;

  tools = 'toobar=no,location=no,directories=no,status=0,scrollbars='+yn+',menubar=0,resizable=yes,copyhistory=no,width='+w+',height='+h+',left='+x+',top='+y;
  if(newid)
  {
     if(!newid.closed){
          // newid.focus();
	  //}else{
	  newid.close();
     }
     newid=window.open(url,name,'toobar=no,'+tools);
			//newid.moveTo(300,200);
  }else{

    //query=window.formz.elements[ftext].value
    newid=window.open(url,name,'toobar=no,'+tools);
  }
}
//�����´����м�λ��
function popcenter(url,w,h){
        x=w;
        y=h;
        l=(screen.width/2)-(x/2);
        t=(screen.height/2)-(y/2);
        s="scrollbars=no,toolbar=no,location=no,status=no,menubar=no,resizable=yes";
        s+=" width=" + x + ", height=" + y + ", left=" + l + ", top=" + t;
        MRV=window.open(url,"",s);
}

//�����´�������λ��Ϊ���������
function openwinevt(evt,w,h,jspfile)
{
   var left  = evt.screenX;
   var top   = evt.screenY;
   var wlen  = parseInt(left)+parseInt(w);
   var hlen  = parseInt(top)+parseInt(h);
   if(wlen > screen.width){
       left  = screen.width-w-10;
   }
   if(hlen > screen.height){
       top   = screen.height-h-55;
   }
   OpenWindow("selwin",jspfile,left,top,w,h,"no");
}
//�����´����䴰��λ�þ���Ļ�Ķ���Ϊ0���ұ�Ϊ 10
function openwin1(name,urll,w,h,yn)
{      //l = screen.width-w-10;
        l = (screen.width-w)/2;
        if(l<0)
           {
             l = 10;
             w = screen.width-10;
           }
        t = (screen.height - h)/2-10;
        if(t < 0)
          {
            t = 0;
            h = screen.height-10;
          }
	OpenWindow(name,urll,l,t,w,h,yn);
}
//�����´����������ύ��submit�� �Ķ������䴰��λ�þ���Ļ�Ķ���Ϊ0���ұ�Ϊ 10
function openwinsub(name,urll,w,h,yn)
{
	x=w;
        y=h;
	l=(screen.width/2)-(x/2);
        t=(screen.height/2)-(y/2);
	OpenWindow(name,"blank.htm",l,t,w,h,yn);
	subtarget(urll,name);
}
function openwinsub_center(name,urll,w,h,yn)
{
    l = (screen.width-w)/2;
    if(l<0)
     {
       	 l = 5;
         w = screen.width-10
      }

    t = (screen.height-h)/2-10;
    if(t<0)
     {
         t = 5;
         h = screen.height - 10;
     }
     OpenWindow(name,"",l,t,w,h,yn);
     subtarget(urll,name);
}

//����ͬ openwinsub() ��֮ͬ��Ϊ���������Ѷ��� "blank.htm" ���ҳ��
function openwinLoading(loadname,name,urll,w,h,yn)
{
	l = screen.width-w-10;
        t = 0;
	OpenWindow(name,loadname,l,t,w,h,yn);
	subtarget(urll,name);
}

//�����´�����û���ύ�Ķ�����
function openwin(name,urll,left,top,w,h,yn)
{
	OpenWindow(name,urll,left,top,w,h,yn);
}
//�����´����������ύ��submit�� �Ķ�����
function openwin2(name,urll,left,top,w,h,yn)
{

	OpenWindow(name,"blank.htm",left,top,w,h,yn);
	subtarget(urll,name);
}
//��ҳ��ť���ύ
function sub(pbtn,name)
{
        document.forms[0].pbtn.value = pbtn;
        subnative(name);
}

//���� button ��ť�ύʱ�� form ���� ��Ϊ��ҳ��
function subnative(filename)
{
    document.forms[0].action = filename;
	document.forms[0].method = "post";
	document.forms[0].target = "_self";
	document.forms[0].submit();
}

//����ָ����ҳ���ύָ���ı������ύ��ԭ����λ��
function subNative(url,formName)
{
    formName.action = url;
	formName.method = "post";
	formName.target = "_self";
	formName.submit();
}


//���� button ��ť�ύʱ�� form ����,action Ϊҳ�����裨Ϊ��ҳ��
function subself()
{
	document.forms[0].method = "post";
	document.forms[0].target = "_self";
	document.forms[0].submit();
}

//���� button ��ť�ύʱ�� form ���� ���ɸ��ݲ��� targetvalue ���ã�
function subtarget(filename,targetvalue)
{

    document.forms[0].action = filename;
	document.forms[0].method = "post";
	document.forms[0].target = targetvalue;
	document.forms[0].submit();
}

function subopener(filepage)
{
	document.forms[0].action = filepage;
	document.forms[0].method = "post";
	document.forms[0].target = self.opener.name;
	document.forms[0].submit();
}
//--------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------//
//--------------------�Ǻ����漸������һһ��Ӧ�����������ύ��FormĿ��------------//


//��ҳ��ť���ύ
function subForm(formIndex,pbtn,name)
{
        document.forms[formIndex].pbtn.value = pbtn;
        subnativeForm(formIndex,name);
}

//���� button ��ť�ύʱ�� form ���� ��Ϊ��ҳ��
function subnativeForm(formIndex,filename)
{
      	document.forms[formIndex].action = filename;
	document.forms[formIndex].method = "post";
	document.forms[formIndex].target = "_self";
	document.forms[formIndex].submit();
}

//���� button ��ť�ύʱ�� form ����,action Ϊҳ�����裨Ϊ��ҳ��
function subselfForm(formIndex)
{
	document.forms[formIndex].method = "post";
	document.forms[formIndex].target = "_self";
	document.forms[formIndex].submit();
}

//���� button ��ť�ύʱ�� form ���� ���ɸ��ݲ��� targetvalue ���ã�
function subtargetForm(formIndex,filename,targetvalue)
{

      	document.forms[formIndex].action = filename;
	document.forms[formIndex].method = "post";
	document.forms[formIndex].target = targetvalue;
	document.forms[formIndex].submit();
}

function subopenerForm(formIndex,filepage)
{
	document.forms[formIndex].action = filepage;
	document.forms[formIndex].method = "post";
	document.forms[formIndex].target = self.opener.name;
	document.forms[formIndex].submit();
}
//----------------------------------------------------------------------



//----------------------------------------------------------

//�رձ�����,�۽�������,ˢ�¸�����,��ˢ�·�����ͬ����
//����ķ������÷�������ˢ�º󲻻ᵯ�� "����" ��ʾ��
function openerflash()
{
	if(self.opener != null)
	{

		self.close();
                self.opener.focus();
                self.opener.location.replace(self.opener.location.href);
	}
}

//�رձ�����,�۽�������,ˢ�¸�����,��ˢ�·�����ͬ����
//����ķ������÷�������ˢ�º󲻻ᵯ�� "����" ��ʾ��
function openerflash(openerPage)
{
	if(self.opener != null)
	{

		self.close();
                self.opener.focus();
                self.opener.location.replace(openerPage);
	}
}


//�رձ�����,�۽�������,ˢ�¸�����
function winclose()
{
 if(self.opener != null)
 {
   self.opener.location.reload(1);
   self.opener.focus();
 }
 self.close();
}

//�رձ�����,�۽�������,����ˢ�¸�����
function wincloseno()
{
 if(self.opener != null)
 {
   self.opener.focus();
 }
 self.close();
}


//���ζ԰�ť��˫��
function show()
{
  cover.style.visibility="visible";
}
//�޸ģ����ͣ�ɾ���ȵ���ʾ
function prompt(actionpage,alerts)
{
  if(confirm(alerts))
  {
	//openwin2('id',name,'330','240','1','1','no');
	subnative(actionpage);
	return true;
  }else{
       return false;
  }
}
//ɾ��ʱ����ʾ
function del_prompt(jspname)
{
   if(prompt(jspname,"��ȷ�����Ҫɾ����"))
   {
   	return true;
   }else{
        return false;
   }
}
//ȷ��ʱ����ʾ
function sub_prompt(jspname)
{
   if(prompt(jspname,"��ȷ�����Ҫȷ����"))
   {
   	return true;
   }else{
        return false;
   }
}
//�޸���ʾ
function modprompt()
{
   if(confirm("��ȷ�����Ҫ�޸���"))
  {
	return true;
  }else{
       return false;
  }
}

//ɾ����ʾ
function delprompt()
{
   if(confirm("��ȷ�����Ҫɾ����"))
  {
	return true;
  }else{
       return false;
  }
}





function checknumber(e)
{
   var charCode = (navigator.appName == "Netscape")?e.which:e.keyCode
   status = charCode
   if(charCode>31 && (charCode <48 || charCode>57))
   {
     alert("���������֣�");
     return false;
   }else{
     return true;
   }
}

//Ϊѡ��һѡ���ʱ�Ķ���
function subOtherPage(pbtn)
{
     document.forms[0].pbtn.value = pbtn;
     subself();
     return true;

}


//��ʱ�ر�
function closeit() {
setTimeout("self.close()",5000) //����
}
//�����ж�Ҫɾ����ϸĿ�Ƿ�Ϊ��
function CheckZero()
{
   tt = document.funform.elements.length;
   hh = 0;
   for(i= 0,j=0;i<tt;i++)
   {
     if(document.funform.elements[i].type == "checkbox" || document.funform.elements[i].type == "radio")
     {
      if(document.funform.elements[i].checked)
      {
        var textname   = "text"+j;
        var textvalue  = eval("window.document.funform." + textname+".value");

        if(textvalue == 0)
        {
          alert("����ϸĿ����Ϊ�㣡");
          return false;
        }
      }
      j++;
     }
   }
   return true;
}
//��ӡ���õĺ���
function beforeprint() {
  pagectrl.className = 'pagectrloff';
}
function afterprint() {
  pagectrl.className = 'pagectrlon';
}
//��ȡС����� len λ
function cutpoint(pointvalue,len)
{

  var getvalue = pointvalue;
  pointvalue   = ""+pointvalue;
  var modulus  = "";//���������������
  for(i=0;i<len;i++)
  {
  	 modulus = modulus+"0";
  }
  modulus = parseFloat("0."+modulus+"5");
  if(pointvalue != "")
  {
     if(pointvalue.indexOf(".") >0)
     {
       var value_arr = pointvalue.split(".");
       if(value_arr[1].length > len)
       {
          newpointvalue =""+(parseFloat(pointvalue)+modulus);
          endnum = newpointvalue.indexOf(".")+parseInt(len)+1;
          getvalue = newpointvalue.substring(0,endnum);

       }
     }
  }

  return getvalue;
}

//ɾ��ǰ���ж�
function checkDel(selValue)
{
  if(selValue == "")
  {
    alert("��ѡ��Ҫɾ�����");
    return false;
  }else{
    if(!confirm('ȷ��Ҫɾ����'))
    return false;
  }
  return true;
}

var last_button = "";
function clickButton(obj, href) {
   obj.blur();
   if(obj==last_button)    {
        gnglwin.location = href;
        return;
   }
   obj.style.color = "#9999CC";


   if(last_button)
   {
      last_button.style.color = "#000000";

   }
   last_button = obj;
}

//�鿴ͼƬ�ĺ����������ж��Ƿ񵯳�����
function lookImageOpenWin(ext,imagename,vendorID,proregID,page)
{
  if(ext.Trim()!="")
  {
     popcenter(page+"?ext="+ext+"&image="+imagename+"&vendorID="+vendorID+"&proregID="+proregID,400,400);
  }
}

//ͨ����ext���жϣ��Ƿ�Ҫ��ʾmess
function outPrint(ext,mess)
{
  if(ext.Trim()!="")
  {
  	document.write(mess);
  }
}

//add by Bruce 2005.04.01
//�����´��ڣ�ͬʱ��ԭҳ������������ύ���´���
function openWinsubCenterWithForm(name,url,formName,winWidth,winHeight,allowScroll)
{
    winLeft = (screen.width-winWidth)/2;
    winTop = (screen.height-winHeight)/2-10;
    if(winLeft<0)
      {
        winLeft = 5;
        //winWidth = screen.width-10
      }

    if(winTop<0)
       {
         winTop = 5;
         //winHeight = screen.height - 10;
       }


     OpenWindow(name,"blank.htm",winLeft,winTop,winWidth,winHeight,allowScroll);
     subTargetWithForm(url,formName,name);
}


//add by Bruce 2005.03.21
//���������ύ ���ɸ��ݲ���formName���ñ������ƣ� �ɸ��ݲ���targetvalue �����ύλ�ã�
function subTargetWithForm(url,formName,targetValue)
{
    formName.action = url;
	formName.method = "post";
	formName.target = targetValue;
	formName.submit();
}

//add by Bruce 2005.03.26
//�����´����м�λ��
function openWinCenter(name,url,winWidth,winHeight,allowScroll) {

	//winLeft = (screen.width/2)-(winWidth/2);
	//winTop = (screen.height/2)-(winHeight/2);

    winLeft = (screen.width-winWidth)/2;
    winTop = (screen.height-winHeight)/2-10;
    if(winLeft<0)
      {
        winLeft = 5;
        //winWidth = screen.width-10
      }

    if(winTop<0)
       {
         winTop = 5;
         //winHeight = screen.height - 10;
       }

	par = "toolbar=no,location=no,status=no,menubar=no,resizable=yes,";
	par += " width=" + winWidth + ", height=" + winHeight + ", left=" + winLeft + ", top=" + winTop + ",";
	par += " scrollbars= " + allowScroll ;

	//MRV = window.open(url,name,par);
	OpenWindow(name,url,winLeft,winTop,winWidth,winHeight,allowScroll);
}

function OpenWindow(name,url,winLeft,winTop,winWidth,winHeight,allowScroll) {
	var query;

  	par = 'toobar=no,location=no,directories=no,status=0,' ;
  	par += 'scrollbars=' + allowScroll + ',menubar=0,resizable=yes,copyhistory=no,' ;
  	par += 'width=' + winWidth + ',height=' + winHeight + ',left=' + winLeft + ',top=' + winTop ;

  	if(newid) {

    	if(!newid.closed){
        	// newid.focus();
	  		//}else{
	  		newid.close();
     	}

     	newid = window.open(url,name,par);
		//newid.moveTo(300,200);
  	} else {

    	//query=window.formz.elements[ftext].value
    	newid = window.open(url,name,par);
  	}
}








