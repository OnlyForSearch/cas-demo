//除去字符串头和尾的空格
String.prototype.Trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}


 //  判断一个字符串是否是标准的日期格式 ("YYYY-MM-DD HH:MM:SS")
String.prototype.isValidDatetime=function()
{
var result=this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
if(result==null) return false;
var d= new Date(result[1], result[3]-1, result[4], result[5], result[6], result[7]);
return (d.getFullYear()==result[1]&&(d.getMonth()+1)==result[3]&&d.getDate()==result[4]&&d.getHours()==result[5]&&d.getMinutes()==result[6]&&d.getSeconds()==result[7]);
}
//  检查输入的查询条件开始和结束时间是否是标准的日期格式("YYYY-MM-DD HH:MM:SS")
function checkConditions(frm){
    var startTime = document.all.startTime.value;
    if(startTime.length>0){  // 有输入查询时间
        var noSpaceStartTime = startTime.replace(/(^\s*)|(\s*$)/g, "");  // 除去时间的开始和结束空格
        startTime =noSpaceStartTime + "2004-10-04 22:11:24".substring(noSpaceStartTime.length,19);
        if(startTime.isValidDatetime()== false){
            alert("开始时间的格式不正确! 请重新输入.");
            return false;
        }else{
            document.all.startTime.value = noSpaceStartTime;
        }
    }
    var endTime = document.all.endTime.value;
    if(endTime.length>0){  // 有输入查询时间
        var noSpaceEndTime = endTime.replace(/(^\s*)|(\s*$)/g, "");  // 除去时间的开始和结束空格
        endTime =noSpaceEndTime + "2004-10-04 22:11:24".substring(noSpaceEndTime.length,19);
        if(endTime.isValidDatetime()== false){
            alert("结束时间的格式不正确! 请重新输入.");
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
//弹出新窗在中间位置
function popcenter(url,w,h){
        x=w;
        y=h;
        l=(screen.width/2)-(x/2);
        t=(screen.height/2)-(y/2);
        s="scrollbars=no,toolbar=no,location=no,status=no,menubar=no,resizable=yes";
        s+=" width=" + x + ", height=" + y + ", left=" + l + ", top=" + t;
        MRV=window.open(url,"",s);
}

//弹出新窗，窗口位置为鼠标点击处。
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
//弹出新窗，其窗口位置距屏幕的顶端为0，右边为 10
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
//弹出新窗，但附带提交（submit） 的动作。其窗口位置距屏幕的顶端为0，右边为 10
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

//功能同 openwinsub() 不同之处为：可以自已定义 "blank.htm" 这个页面
function openwinLoading(loadname,name,urll,w,h,yn)
{
	l = screen.width-w-10;
        t = 0;
	OpenWindow(name,loadname,l,t,w,h,yn);
	subtarget(urll,name);
}

//弹出新窗，但没有提交的动作。
function openwin(name,urll,left,top,w,h,yn)
{
	OpenWindow(name,urll,left,top,w,h,yn);
}
//弹出新窗，但附带提交（submit） 的动作。
function openwin2(name,urll,left,top,w,h,yn)
{

	OpenWindow(name,"blank.htm",left,top,w,h,yn);
	subtarget(urll,name);
}
//分页按钮的提交
function sub(pbtn,name)
{
        document.forms[0].pbtn.value = pbtn;
        subnative(name);
}

//设置 button 按钮提交时的 form 参数 （为本页）
function subnative(filename)
{
    document.forms[0].action = filename;
	document.forms[0].method = "post";
	document.forms[0].target = "_self";
	document.forms[0].submit();
}

//按照指定的页面提交指定的表单，提交到原来的位置
function subNative(url,formName)
{
    formName.action = url;
	formName.method = "post";
	formName.target = "_self";
	formName.submit();
}


//设置 button 按钮提交时的 form 参数,action 为页面所设（为本页）
function subself()
{
	document.forms[0].method = "post";
	document.forms[0].target = "_self";
	document.forms[0].submit();
}

//设置 button 按钮提交时的 form 参数 （可根据参数 targetvalue 设置）
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
//--------------------是和上面几个方法一一对应，可以设置提交的Form目标------------//


//分页按钮的提交
function subForm(formIndex,pbtn,name)
{
        document.forms[formIndex].pbtn.value = pbtn;
        subnativeForm(formIndex,name);
}

//设置 button 按钮提交时的 form 参数 （为本页）
function subnativeForm(formIndex,filename)
{
      	document.forms[formIndex].action = filename;
	document.forms[formIndex].method = "post";
	document.forms[formIndex].target = "_self";
	document.forms[formIndex].submit();
}

//设置 button 按钮提交时的 form 参数,action 为页面所设（为本页）
function subselfForm(formIndex)
{
	document.forms[formIndex].method = "post";
	document.forms[formIndex].target = "_self";
	document.forms[formIndex].submit();
}

//设置 button 按钮提交时的 form 参数 （可根据参数 targetvalue 设置）
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

//关闭本窗口,聚焦父窗口,刷新父窗口,此刷新方法不同于下
//下面的方法，该方法可以刷新后不会弹出 "重试" 提示框
function openerflash()
{
	if(self.opener != null)
	{

		self.close();
                self.opener.focus();
                self.opener.location.replace(self.opener.location.href);
	}
}

//关闭本窗口,聚焦父窗口,刷新父窗口,此刷新方法不同于下
//下面的方法，该方法可以刷新后不会弹出 "重试" 提示框
function openerflash(openerPage)
{
	if(self.opener != null)
	{

		self.close();
                self.opener.focus();
                self.opener.location.replace(openerPage);
	}
}


//关闭本窗口,聚焦父窗口,刷新父窗口
function winclose()
{
 if(self.opener != null)
 {
   self.opener.location.reload(1);
   self.opener.focus();
 }
 self.close();
}

//关闭本窗口,聚焦父窗口,但不刷新父窗口
function wincloseno()
{
 if(self.opener != null)
 {
   self.opener.focus();
 }
 self.close();
}


//屏蔽对按钮的双击
function show()
{
  cover.style.visibility="visible";
}
//修改，报送，删除等的提示
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
//删除时的提示
function del_prompt(jspname)
{
   if(prompt(jspname,"您确定真的要删除吗？"))
   {
   	return true;
   }else{
        return false;
   }
}
//确认时的提示
function sub_prompt(jspname)
{
   if(prompt(jspname,"您确定真的要确认吗？"))
   {
   	return true;
   }else{
        return false;
   }
}
//修改提示
function modprompt()
{
   if(confirm("您确认真的要修改吗？"))
  {
	return true;
  }else{
       return false;
  }
}

//删除提示
function delprompt()
{
   if(confirm("您确认真的要删除吗？"))
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
     alert("请输入数字！");
     return false;
   }else{
     return true;
   }
}

//为选择一选择框时的动作
function subOtherPage(pbtn)
{
     document.forms[0].pbtn.value = pbtn;
     subself();
     return true;

}


//定时关闭
function closeit() {
setTimeout("self.close()",5000) //毫秒
}
//用于判断要删除的细目是否为零
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
          alert("物资细目不能为零！");
          return false;
        }
      }
      j++;
     }
   }
   return true;
}
//打印所用的函数
function beforeprint() {
  pagectrl.className = 'pagectrloff';
}
function afterprint() {
  pagectrl.className = 'pagectrlon';
}
//截取小数点后 len 位
function cutpoint(pointvalue,len)
{

  var getvalue = pointvalue;
  pointvalue   = ""+pointvalue;
  var modulus  = "";//用于四舍五入的数
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

//删除前的判断
function checkDel(selValue)
{
  if(selValue == "")
  {
    alert("请选择要删除的项！");
    return false;
  }else{
    if(!confirm('确定要删除吗？'))
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

//查看图片的函数，用于判断是否弹出窗口
function lookImageOpenWin(ext,imagename,vendorID,proregID,page)
{
  if(ext.Trim()!="")
  {
     popcenter(page+"?ext="+ext+"&image="+imagename+"&vendorID="+vendorID+"&proregID="+proregID,400,400);
  }
}

//通过对ext的判断，是否要显示mess
function outPrint(ext,mess)
{
  if(ext.Trim()!="")
  {
  	document.write(mess);
  }
}

//add by Bruce 2005.04.01
//弹出新窗口，同时将原页面表单的内容提交到新窗口
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
//表单内容提交 （可根据参数formName设置表单名称； 可根据参数targetvalue 设置提交位置）
function subTargetWithForm(url,formName,targetValue)
{
    formName.action = url;
	formName.method = "post";
	formName.target = targetValue;
	formName.submit();
}

//add by Bruce 2005.03.26
//弹出新窗在中间位置
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









