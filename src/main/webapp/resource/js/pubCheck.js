
//判断是否是空值
function isEmpty(input){
    if ((input==null)||(input.length==0))  {
		return true;
	} else {
		return(false);
	}
 }

//除去字符串头和尾的空格
String.prototype.Trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

//全选
function CheckAll(form)
{
   tt = form.elements.length;
   for(i= 0;i<tt;i++)
   {
     form.elements[i].checked = true;
   }
}
//table全选
function CheckTableAll(checkName)
{
   var tt = document.getElementsByName(checkName).length;
   var tableCheck=document.getElementsByName(checkName);
   for(i=0;i<tt;i++)
   {
     tableCheck[i].checked = true;
   }
   
}

//不选
function CheckNone(form)
{
   tt = form.elements.length;
   for(i= 0;i<tt;i++)
   {
     form.elements[i].checked = false;
   }
}

//table不选
function CheckTableNone(checkName)
{
   var tt = document.getElementsByName(checkName).length;
   var tableCheck=document.getElementsByName(checkName);
   for(i=0;i<tt;i++)
   {
     tableCheck[i].checked = false;
   }
}


//不能不选且只能选一
function checkOnlyOne(form)
{
   tt = form.elements.length;
   hh = 0;
   for(i= 0;i<tt;i++)
   {
     if(form.elements[i].type == "checkbox" || form.elements[i].type == "radio")
     {
      if(form.elements[i].checked)
      {
      	hh++;
      }
     }
   }
   if(hh == 0){
   	alert("请您选择一行！");
   	return false;
   }else if(hh >1){
   	alert("对不起，只能选择一行！");
        return false;
   }else{
        return true;
   }
}

//可以多选，但不能不选
function checkMulti(form)
{
   tt = form.elements.length;
   hh = 0;
   for(i= 0;i<tt;i++)
   {
     if(form.elements[i].type == "checkbox" ||form.elements[i].type == "radio")
     {
      if(form.elements[i].checked)
      {
      	hh++;
      }
     }
   }
   if(hh == 0){
   	alert("请您先选择！");
   	return false;
   }else{
        return true;
   }
}


//删除前的确认
function alertConfirm(alertMsg) {

  if (alertMsg==null || alertMsg=="") {
    alertMsg = "您确定要删除吗？" ;
  }
  if (!confirm(alertMsg)) {
    return false ;
  }
  else {
    return true ;
  }
}


//判断输入的日期是否合法,
function isValidDate(sDate){

  if (sDate!=null && sDate.length!=0) {


  var iaMonthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  var iaDate = new Array(3);
  var year, month, day;


  var iaDate = sDate.toString().split("-");

  if (iaDate.length != 3) {
	alert("输入日期不合法！") ;
	return false
  }
  if (iaDate[0].length!=4 || iaDate[1].length!=2 || iaDate[2].length!=2) {
	alert("输入日期不合法！") ;
	return false
  }

  year = parseFloat(iaDate[0])
  month = parseFloat(iaDate[1])
  day=parseFloat(iaDate[2])

  if (year <= 1900 || year > 2100){
	alert("输入年份不合法！") ;
	return false
  }


  if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29;

  if (month < 1 || month > 12) {
	alert("输入月份不合法！") ;
	return false
  }


  if (day < 1 || day > iaMonthDays[month - 1]) {
	alert("输入的天不合法！") ;
	return false
  }
  }
  return true
}



//限制小数点不得大于1位
//传入参数为目标文本域
//只有在有值的情况下才进行判断，为空则通过
function checkbig1(field) {
	if(isEmpty(field.value)) {
		return true;
	} else if (!isNubmer(field))   {
		return false ;

	} else {
		yy = field.value.indexOf("\.");
		if(yy>0)  {
			var re =/^(\+|-)?\d+\.\d$/g;
			var ii = field.value.match(re);
			if(ii==null||ii=="") {
				alert("输入的数值小数点后只能有一位数字！");
				field.focus();
				return false;
			}
		}
		return true;
	}
}

//限制小数点不得大于2位
//传入参数为目标文本域
//只有在有值的情况下才进行判断，为空则通过
function checkbig2(field) {
	if(isEmpty(field.value)) {
		return true;
	} else if (!isNubmer(field))   {
		return false ;

	} else {
		yy = field.value.indexOf("\.");
		if(yy>0)  {
			var re =/^(\+|-)?\d+\.\d{1,2}$/g;
			var ii = field.value.match(re);
			if(ii==null||ii=="") {
				alert("输入的数值小数点后只能有两位数字！");
				field.focus();
				return false;
			}
		}
		return true;
	}
}

//限制小数点不得大于3位
//传入参数为目标文本域
//只有在有值的情况下才进行判断，为空则通过
function checkbig3(field) {
	if(isEmpty(field.value)) {
		return true;
	} else if (!isNubmer(field))   {
		return false ;

	} else {
		yy = field.value.indexOf("\.");
		if(yy>0)  {
			var re =/^(\+|-)?\d+\.\d{1,3}$/g;
			var ii = field.value.match(re);
			if(ii==null||ii=="") {
				alert("输入的数值小数点后只能有三位数字！");
				field.focus();
				return false;
			}
		}
		return true;
	}
}


//限制小数点不得大于4位
//传入参数为目标文本域
//只有在有值的情况下才进行判断，为空则通过
function checkbig4(field) {
	if(isEmpty(field.value)) {
		return true;
	} else if (!isNubmer(field))   {
		return false ;

	} else {
		yy = field.value.indexOf("\.");
		if(yy>0)  {
			var re =/^(\+|-)?\d+\.\d{1,4}$/g;
			var ii = field.value.match(re);
			if(ii==null||ii=="") {
				alert("输入的数值小数点后只能有四位数字！");
				field.focus();
				return false;
			}
		}
		return true;
	}
}


//限制小数点不得大于5位
//传入参数为目标文本域
//只有在有值的情况下才进行判断，为空则通过
function checkbig5(field) {
	if(isEmpty(field.value)) {
		return true;
	} else if (!isNubmer(field))   {
		return false ;

	} else {
		yy = field.value.indexOf("\.");
		if(yy>0)  {
			var re =/^(\+|-)?\d+\.\d{1,5}$/g;
			var ii = field.value.match(re);
			if(ii==null||ii=="") {
				alert("输入的数值小数点后只能有五位数字！");
				field.focus();
				return false;
			}
		}
		return true;
	}
}



//判断输入的是否为整数，若不是，报错，并返回false。若是，返回true
//传入参数为目标文本域
function isInteger(field){
	var re1=/^(\+|-)?\d+$/g;
	var ii1=field.value.match(re1);

	if(ii1==null||ii1=="")	{
		alert("输入的数据必须是整数！");
		field.focus();
		return false;
	}
	return true;

}

//判断输入的是否为数值，包括浮点数，若不是，报错，并返回false。若是，返回true
//传入参数为目标文本域
function isNubmer(field){
   if(isNaN(field.value))
    {
      alert("只能输入数值");
      field.focus();
      return false;
    }
 return true;

}

//判断输入的是否为邮编。需要满足6位整数的才可能是邮编
//传入的参数为目标文本域
function isYzbm(field) {
	var re1=/^\d+$/g;
	var ii1=field.value.match(re1);

	if(ii1==null||ii1=="")
	{
		alert("邮编只能是数字") ;
		field.focus();
		return false;
	} else if (field.value.length!=6)
	{
		alert("邮编位数不对") ;
		field.focus();
		return false;
	}
	return true  ;
}

//按邮政编码规则进行过滤
function filterYzbm(){
	if((event.keyCode>=48)&&(event.keyCode<=57)){
		event.returnValue=true;
	}else{
		event.returnValue=false;
	}

}

//只允许整数数值输入，在键盘输入时过滤掉不允许的数值
  function  filterInteger(){
  var code=event.keyCode;
  if((code>=48)&&(code<=57)||(code==43)||(code==45)){
    event.returnValue=true;
  }else{
    event.returnValue=false;
  }
}

//只允许浮点数值输入，
function  filterFloat(){
  var code=event.keyCode;

  if(((code>=48)&&(code<=57))||(code==46)||(code==43)||(code==45)){
    event.returnValue=true;
  }else{
     event.returnValue=false;
  }
}


//检验身份证是否合法
//传入参数是身份证文本域
//true-通过，false-不通过
function checkSfz(field){

     var zjhm=field.value.Trim().toUpperCase();

     if(zjhm!=null&&zjhm!=""){

    if (! (zjhm.length == 15 || zjhm.length == 18)) {
        alert("身份证长度不对,请检查！");
        field.focus();
        //zjhmObj.focus();
        return false;
      }
      zjhm1 = zjhm;
      if (zjhm.length == 18) {
        zjhm1 = zjhm.substr(0, 17);
        zjhm2 = zjhm.substr(17, 1);
      }

      re = new RegExp("[^0-9]");
      if (s = zjhm1.match(re)) {
        alert("身份证输入的值中含有非法字符'" + s + "'请检查！");
        field.focus();
        // zjhmObj.focus();
        return false;
      }
      //取出生日期
      if (zjhm.length == 15) {
        birthday = "19" + zjhm.substr(6, 6);
      }
      else {
        re = new RegExp("[^0-9A-Z]");
        if (s = zjhm2.match(re)) { //18位身份证对末位要求数字或字符
          alert("身份证输入的值中含有非法字符'" + s + "'请检查！");
          field.focus();
          //zjhmObj.focus();
          return false;
        }
        birthday = zjhm.substr(6, 8);
      }

      birthday = birthday.substr(0, 4) + "-" + birthday.substr(4, 2) + "-" +
          birthday.substr(6, 2)
          //alert("birthday"+birthday)

          if (isDateBirthday("身份证号码出生日期", birthday, field) == 0) { //检查日期的合法性
        return false;
      }

      if (zjhm.length == 18) {
        return (sfzCheck(zjhm, field)); //对18位长的身份证进行末位校验
      }
      // else{
      //  zjhmObj.value=id15to18(zjhm);
      // }
     }
     return true;
}

//-------------------------------
//  函数名：sfzCheck(hm)
//  功能介绍：对18位长的身份证进行末位校验
//  参数说明：身份证号码
//  返回值  ：1-符合,0-不符合
//-------------------------------


function sfzCheck(hm,obj)
{

      var w=new Array();
      var ll_sum;
      var ll_i;
      var ls_check;

      w[0]=7;
      w[1]=9;
      w[2]=10;
      w[3]=5;
      w[4]=8;
      w[5]=4;
      w[6]=2;
      w[7]=1;
      w[8]=6;
      w[9]=3;
      w[10]=7;
      w[11]=9;
      w[12]=10;
      w[13]=5;
      w[14]=8;
      w[15]=4;
      w[16]=2;
     ll_sum=0;

     for (ll_i=0;ll_i<=16;ll_i++)
     {   //alert("ll_i:"+ll_i+" "+hm.substr(ll_i,1)+"w[ll_i]:"+w[ll_i]+"  ll_sum:"+ll_sum);
        ll_sum=ll_sum+(hm.substr(ll_i,1)-0)*w[ll_i];

     }
     ll_sum=ll_sum % 11;


     switch (ll_sum)
      {
        case 0 :
            ls_check="1";
            break;
        case 1 :
            ls_check="0";
            break;
        case 2 :
            ls_check="X";
            break;
        case 3 :
            ls_check="9";
            break;
        case 4 :
            ls_check="8";
            break;
        case 5 :
            ls_check="7";
            break;
        case 6 :
            ls_check="6";
            break;
        case 7 :
            ls_check="5";
            break;
        case 8 :
            ls_check="4";
            break;
        case 9 :
            ls_check="3";
            break;
        case 10 :
            ls_check="2";
            break;
      }

      if (hm.substr(17,1) != ls_check)
      {
//            alert("身份证校验错误！------ 末位应该:"+ls_check+" 实际:"+hm.substr(17,1));
//            obj.parentNode.previousSibling.focus();
//           // obj.focus();
//            return 0;

            alert('身份证校验错误,请重输');
            //obj.focus();
            obj.focus();
            return false;

     }
return 1;
}


//检查邮箱地址是否合法
//传入参数为邮箱文本域
//true-通过，false-不通过
function checkemail(field)
{
  var mail=/^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/i;
  var val=field.value;
  if(!mail.test(val))
    {
      alert("邮箱地址不合法");
      field.focus();
      return false;
    }
 return true;
}

//检查网址是否合法
//传入参数为网址文本域
//true-通过，false-不通过
function checkUrl(field)
{
	/*
  var url=/^[a-zA-z]+:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?$/i;
  var val=field.value;
  if(!url.test(val))
    {
      alert("网址不合法");
      field.focus();
      return false;
    }
	*/
 return true;
}

//将文本域的值自动转化为大写
function upperCaseValue(field){
	if(isEmpty(field.value)==false){
			   field.value=field.value.toUpperCase();
	}
}


//-------------------------------
//  函数名：isDate(i_field,thedate)
//  功能介绍：校验字符串是否为日期格式
//  参数说明：数据项，输入的字符串
//  返回值  ：1-是日期，false-不是
//-------------------------------
function isDateBirthday(i_field,thedate,obj)
{
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
    var r = thedate.match(reg);
    if (r==null)
    {
       alert("'"+i_field+"' 含非法字符！");
       obj.focus();
       //obj.focus();
       return false;

    }
    var d= new Date(r[1],r[3]-1,r[4]);
    var newStr=d.getFullYear()+r[2]+(d.getMonth()+1)+r[2]+d.getDate()
    var newDate=r[1]+r[2]+(r[3]-0)+r[2]+(r[4]-0)
    //alert("----------r:"+r+" d:"+d+" newStr:"+newStr+" newDate:"+newDate);
    if (newStr==newDate)
         {
          return true;
         }
     alert("'"+i_field+"'日期格式不对,应为YYYY-MM-DD！");
     obj.focus();
   //  obj.focus();
     return false;
}


//判断输入的是否为数字，若非，不响应键盘
/**
function checkOnlyNumber(){
  if(event.keyCode==46 || (event.keyCode >=48&&event.keyCode<=57)){
    return true;
  } else {
    return false;
  }
}
**/

//判断输入的是否为整数，若非，不响应键盘
/**
function checkOnlyInteger(){
  if(event.keyCode >=48&&event.keyCode<=57){
    return true;
  } else {
    return false;
  }
}
**/

 //只允许数字和26个英文字母输入,并将英文字母自动转化为大写，针对键盘输入。该函数主要在设置身份证时使用
 //传入参数为文本域
//function  isSfzOnKey(field){
	//field.value=field.value.replace(/[\W]/g,'').toUpperCase()
//}
//只允许数字和26个英文字母输入,并将英文字母自动转化为大写，针对复制粘贴输入.该函数主要在设置身份证时使用
//传入参数为剪贴板数据
//function  isSfzOnPaste(clipboardData){
  // clipboardData.setData('text',clipboardData.getData('text').replace(/[\W]/g,'').toUpperCase());
//}
 //使非数字键失效，只允许整数输入,针对键盘输入
  //传入参数为文本域
//function  isNumberOnKey(field){
 //  field.value=field.value.replace(/[^\d]/g,'');
//}
//使非数字键失效，只允许整数输入,针对复制粘贴输入
//传入参数为剪贴板数据
//function  isNumberOnPaste(clipboardData){
  // clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''));
//}
//使非数字键失效，只允许数字和点号。也就是浮点数输入,针对键盘输入
  //传入参数为文本域
//function  isFloatOnKey(field){
  // field.value=field.value.replace(/[^\d|.]/g,'');
//}
//使非数字键失效，只允许数字和点号也就是浮点数输入,针对复制粘贴输入
//传入参数为剪贴板数据
//function  isFloatOnPaste(clipboardData){
 //  clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d|.]/g,''));
//}

//只允许中文输入,针对键盘输入
  //传入参数为文本域
//function  isChineseOnKey(field){
  // field.value=field.value.replace(/[^\u4E00-\u9FA5|\d]/g,'');
//}
//只允许中文输入,针对复制粘贴输入
//传入参数为剪贴板数据
//function  isChineseOnPaste(clipboardData){
 //  clipboardData.setData('text',clipboardData.getData('text').replace(/[^\u4E00-\u9FA5|\d]/g,''));
//}

//只允许英文和数字输入,针对键盘输入
  //传入参数为文本域
//function  isEnglishOnKey(field){
  // field.value=field.value.replace(/[\W]/g,'');
//}
//只允许英文和数字输入,针对复制粘贴输入
//传入参数为剪贴板数据
//function  isEnglishOnPaste(clipboardData){
  // clipboardData.setData('text',clipboardData.getData('text').replace(/[\W]/g,''));
//}






/*
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
*/

/*
function checkNumber(e)
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
*/

/**
function checkNum(field)
  {
    	if(field.value==null||field.value=="")
      	{
          return true;
        }
        else
        {
           var re1=/^(\+|-)?\d+$/g;
      	   var ii1=field.value.match(re1);

      	   if(ii1==null||ii1=="")
      	   {
      	     alert("输入的数据必须为数字！");
             field.focus();
      	     return false;
      	   }
           return true;
        }
  }
**/



//使非数字键失效，只允许数字输入
/**
function  isNumber(){
  var code=event.keyCode;
  if((code>=48)&&(code<=57)){
    event.returnValue=true;
  }else{
    event.returnValue=false;
  }
}
**/

//使非数字键失效，只允许数字和点号输入
/**
function  isMoney(){
  var code=event.keyCode;

  if(((code>=48)&&(code<=57))||(code==46)){
    event.returnValue=true;
  }else{
    event.returnValue=false;
  }
}
**/





/*
function checkbig1(field){
	if(isEmpty(field.value)) {
		return true;
	} else {
		yy = field.value.indexOf("\.");
		if(yy>0) {
			var re =/^(\+|-)?\d+\.\d$/g;
			var ii = field.value.match(re);
			if(ii==null||ii=="") {
				alert("输入的数值小数点后只能有一位数字！");
				field.focus();
				return false;
			}
		} else {

			var re1=/^(\+|-)?\d+$/g;
			var ii1=field.value.match(re1);

			if(ii1==null||ii1=="") {
				alert("输入的数据必须为数字！");
				field.focus();
				return false;
			}
		}
		return true;
	}
}
*/


/*
  function checkbig2(field)
  {
      	if(isEmpty(field.value))
      	{
          return true;
        }
        else
        {
      	  yy = field.value.indexOf("\.");
      	  if(yy>0)
          {
      	    var re =/^(\+|-)?\d+\.\d{1,2}$/g;
      	    var ii = field.value.match(re);
      	    if(ii==null||ii=="")
      	    {
      	      alert("输入的数值小数点后只能有二位数字！");
                    field.focus();
      	      return false;
      	    }
        }
        else
        {
           var re1=/^(\+|-)?\d+$/g;
      	   var ii1=field.value.match(re1);

      	   if(ii1==null||ii1=="")
      	     {
      	     alert("输入的数据必须为数字！");
                   field.focus();
      	     return false;
      	     }
      	}
              return true;
     }
  }
*/

/*
  function checkbig3(field)
  {
      	if(field.value==null||field.value=="")
      	{
          return true;
        }
        else
        {
      	  yy = field.value.indexOf("\.");
      	  if(yy>0)
          {
      	    var re =/^(\+|-)?\d+\.\d{1,3}$/g;
      	    var ii = field.value.match(re);
      	    if(ii==null||ii=="")
      	    {
      	      alert("输入的数值小数点后只能有三位数字！");
                    field.focus();
      	      return false;
      	    }
        }
        else
        {

           var re1=/^(\+|-)?\d+$/g;
      	   var ii1=field.value.match(re1);

      	   if(ii1==null||ii1=="")
      	     {
      	     alert("输入的数据必须为数字！");
                   field.focus();
      	     return false;
      	     }
      	}
              return true;
     }
  }
*/


  /*
  function checkbig5(field)
  {
      	if(field.value==null||field.value=="")
      	{
          return true;
        }
        else
        {
      	  yy = field.value.indexOf("\.");
      	  if(yy>0)
          {
      	    var re =/^(\+|-)?\d+\.\d{1,5}$/g;
      	    var ii = field.value.match(re);
      	    if(ii==null||ii=="")
      	    {
      	      alert("输入的数值小数点后只能有五位数字！");
                    field.focus();
      	      return false;
      	    }
        }
        else
        {

           var re1=/^(\+|-)?\d+$/g;
      	   var ii1=field.value.match(re1);

      	   if(ii1==null||ii1=="")
      	     {
      	     alert("输入的数据必须为数字！");
                   field.focus();
      	     return false;
      	     }
      	}
              return true;
     }
  }
*/
