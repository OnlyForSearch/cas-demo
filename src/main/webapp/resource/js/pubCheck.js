
//�ж��Ƿ��ǿ�ֵ
function isEmpty(input){
    if ((input==null)||(input.length==0))  {
		return true;
	} else {
		return(false);
	}
 }

//��ȥ�ַ���ͷ��β�Ŀո�
String.prototype.Trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

//ȫѡ
function CheckAll(form)
{
   tt = form.elements.length;
   for(i= 0;i<tt;i++)
   {
     form.elements[i].checked = true;
   }
}
//tableȫѡ
function CheckTableAll(checkName)
{
   var tt = document.getElementsByName(checkName).length;
   var tableCheck=document.getElementsByName(checkName);
   for(i=0;i<tt;i++)
   {
     tableCheck[i].checked = true;
   }
   
}

//��ѡ
function CheckNone(form)
{
   tt = form.elements.length;
   for(i= 0;i<tt;i++)
   {
     form.elements[i].checked = false;
   }
}

//table��ѡ
function CheckTableNone(checkName)
{
   var tt = document.getElementsByName(checkName).length;
   var tableCheck=document.getElementsByName(checkName);
   for(i=0;i<tt;i++)
   {
     tableCheck[i].checked = false;
   }
}


//���ܲ�ѡ��ֻ��ѡһ
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
   	alert("����ѡ��һ�У�");
   	return false;
   }else if(hh >1){
   	alert("�Բ���ֻ��ѡ��һ�У�");
        return false;
   }else{
        return true;
   }
}

//���Զ�ѡ�������ܲ�ѡ
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
   	alert("������ѡ��");
   	return false;
   }else{
        return true;
   }
}


//ɾ��ǰ��ȷ��
function alertConfirm(alertMsg) {

  if (alertMsg==null || alertMsg=="") {
    alertMsg = "��ȷ��Ҫɾ����" ;
  }
  if (!confirm(alertMsg)) {
    return false ;
  }
  else {
    return true ;
  }
}


//�ж�����������Ƿ�Ϸ�,
function isValidDate(sDate){

  if (sDate!=null && sDate.length!=0) {


  var iaMonthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  var iaDate = new Array(3);
  var year, month, day;


  var iaDate = sDate.toString().split("-");

  if (iaDate.length != 3) {
	alert("�������ڲ��Ϸ���") ;
	return false
  }
  if (iaDate[0].length!=4 || iaDate[1].length!=2 || iaDate[2].length!=2) {
	alert("�������ڲ��Ϸ���") ;
	return false
  }

  year = parseFloat(iaDate[0])
  month = parseFloat(iaDate[1])
  day=parseFloat(iaDate[2])

  if (year <= 1900 || year > 2100){
	alert("������ݲ��Ϸ���") ;
	return false
  }


  if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29;

  if (month < 1 || month > 12) {
	alert("�����·ݲ��Ϸ���") ;
	return false
  }


  if (day < 1 || day > iaMonthDays[month - 1]) {
	alert("������첻�Ϸ���") ;
	return false
  }
  }
  return true
}



//����С���㲻�ô���1λ
//�������ΪĿ���ı���
//ֻ������ֵ������²Ž����жϣ�Ϊ����ͨ��
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
				alert("�������ֵС�����ֻ����һλ���֣�");
				field.focus();
				return false;
			}
		}
		return true;
	}
}

//����С���㲻�ô���2λ
//�������ΪĿ���ı���
//ֻ������ֵ������²Ž����жϣ�Ϊ����ͨ��
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
				alert("�������ֵС�����ֻ������λ���֣�");
				field.focus();
				return false;
			}
		}
		return true;
	}
}

//����С���㲻�ô���3λ
//�������ΪĿ���ı���
//ֻ������ֵ������²Ž����жϣ�Ϊ����ͨ��
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
				alert("�������ֵС�����ֻ������λ���֣�");
				field.focus();
				return false;
			}
		}
		return true;
	}
}


//����С���㲻�ô���4λ
//�������ΪĿ���ı���
//ֻ������ֵ������²Ž����жϣ�Ϊ����ͨ��
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
				alert("�������ֵС�����ֻ������λ���֣�");
				field.focus();
				return false;
			}
		}
		return true;
	}
}


//����С���㲻�ô���5λ
//�������ΪĿ���ı���
//ֻ������ֵ������²Ž����жϣ�Ϊ����ͨ��
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
				alert("�������ֵС�����ֻ������λ���֣�");
				field.focus();
				return false;
			}
		}
		return true;
	}
}



//�ж�������Ƿ�Ϊ�����������ǣ�����������false�����ǣ�����true
//�������ΪĿ���ı���
function isInteger(field){
	var re1=/^(\+|-)?\d+$/g;
	var ii1=field.value.match(re1);

	if(ii1==null||ii1=="")	{
		alert("��������ݱ�����������");
		field.focus();
		return false;
	}
	return true;

}

//�ж�������Ƿ�Ϊ��ֵ�������������������ǣ�����������false�����ǣ�����true
//�������ΪĿ���ı���
function isNubmer(field){
   if(isNaN(field.value))
    {
      alert("ֻ��������ֵ");
      field.focus();
      return false;
    }
 return true;

}

//�ж�������Ƿ�Ϊ�ʱࡣ��Ҫ����6λ�����Ĳſ������ʱ�
//����Ĳ���ΪĿ���ı���
function isYzbm(field) {
	var re1=/^\d+$/g;
	var ii1=field.value.match(re1);

	if(ii1==null||ii1=="")
	{
		alert("�ʱ�ֻ��������") ;
		field.focus();
		return false;
	} else if (field.value.length!=6)
	{
		alert("�ʱ�λ������") ;
		field.focus();
		return false;
	}
	return true  ;
}

//���������������й���
function filterYzbm(){
	if((event.keyCode>=48)&&(event.keyCode<=57)){
		event.returnValue=true;
	}else{
		event.returnValue=false;
	}

}

//ֻ����������ֵ���룬�ڼ�������ʱ���˵����������ֵ
  function  filterInteger(){
  var code=event.keyCode;
  if((code>=48)&&(code<=57)||(code==43)||(code==45)){
    event.returnValue=true;
  }else{
    event.returnValue=false;
  }
}

//ֻ��������ֵ���룬
function  filterFloat(){
  var code=event.keyCode;

  if(((code>=48)&&(code<=57))||(code==46)||(code==43)||(code==45)){
    event.returnValue=true;
  }else{
     event.returnValue=false;
  }
}


//�������֤�Ƿ�Ϸ�
//������������֤�ı���
//true-ͨ����false-��ͨ��
function checkSfz(field){

     var zjhm=field.value.Trim().toUpperCase();

     if(zjhm!=null&&zjhm!=""){

    if (! (zjhm.length == 15 || zjhm.length == 18)) {
        alert("���֤���Ȳ���,���飡");
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
        alert("���֤�����ֵ�к��зǷ��ַ�'" + s + "'���飡");
        field.focus();
        // zjhmObj.focus();
        return false;
      }
      //ȡ��������
      if (zjhm.length == 15) {
        birthday = "19" + zjhm.substr(6, 6);
      }
      else {
        re = new RegExp("[^0-9A-Z]");
        if (s = zjhm2.match(re)) { //18λ���֤��ĩλҪ�����ֻ��ַ�
          alert("���֤�����ֵ�к��зǷ��ַ�'" + s + "'���飡");
          field.focus();
          //zjhmObj.focus();
          return false;
        }
        birthday = zjhm.substr(6, 8);
      }

      birthday = birthday.substr(0, 4) + "-" + birthday.substr(4, 2) + "-" +
          birthday.substr(6, 2)
          //alert("birthday"+birthday)

          if (isDateBirthday("���֤�����������", birthday, field) == 0) { //������ڵĺϷ���
        return false;
      }

      if (zjhm.length == 18) {
        return (sfzCheck(zjhm, field)); //��18λ�������֤����ĩλУ��
      }
      // else{
      //  zjhmObj.value=id15to18(zjhm);
      // }
     }
     return true;
}

//-------------------------------
//  ��������sfzCheck(hm)
//  ���ܽ��ܣ���18λ�������֤����ĩλУ��
//  ����˵�������֤����
//  ����ֵ  ��1-����,0-������
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
//            alert("���֤У�����------ ĩλӦ��:"+ls_check+" ʵ��:"+hm.substr(17,1));
//            obj.parentNode.previousSibling.focus();
//           // obj.focus();
//            return 0;

            alert('���֤У�����,������');
            //obj.focus();
            obj.focus();
            return false;

     }
return 1;
}


//��������ַ�Ƿ�Ϸ�
//�������Ϊ�����ı���
//true-ͨ����false-��ͨ��
function checkemail(field)
{
  var mail=/^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/i;
  var val=field.value;
  if(!mail.test(val))
    {
      alert("�����ַ���Ϸ�");
      field.focus();
      return false;
    }
 return true;
}

//�����ַ�Ƿ�Ϸ�
//�������Ϊ��ַ�ı���
//true-ͨ����false-��ͨ��
function checkUrl(field)
{
	/*
  var url=/^[a-zA-z]+:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?$/i;
  var val=field.value;
  if(!url.test(val))
    {
      alert("��ַ���Ϸ�");
      field.focus();
      return false;
    }
	*/
 return true;
}

//���ı����ֵ�Զ�ת��Ϊ��д
function upperCaseValue(field){
	if(isEmpty(field.value)==false){
			   field.value=field.value.toUpperCase();
	}
}


//-------------------------------
//  ��������isDate(i_field,thedate)
//  ���ܽ��ܣ�У���ַ����Ƿ�Ϊ���ڸ�ʽ
//  ����˵���������������ַ���
//  ����ֵ  ��1-�����ڣ�false-����
//-------------------------------
function isDateBirthday(i_field,thedate,obj)
{
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
    var r = thedate.match(reg);
    if (r==null)
    {
       alert("'"+i_field+"' ���Ƿ��ַ���");
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
     alert("'"+i_field+"'���ڸ�ʽ����,ӦΪYYYY-MM-DD��");
     obj.focus();
   //  obj.focus();
     return false;
}


//�ж�������Ƿ�Ϊ���֣����ǣ�����Ӧ����
/**
function checkOnlyNumber(){
  if(event.keyCode==46 || (event.keyCode >=48&&event.keyCode<=57)){
    return true;
  } else {
    return false;
  }
}
**/

//�ж�������Ƿ�Ϊ���������ǣ�����Ӧ����
/**
function checkOnlyInteger(){
  if(event.keyCode >=48&&event.keyCode<=57){
    return true;
  } else {
    return false;
  }
}
**/

 //ֻ�������ֺ�26��Ӣ����ĸ����,����Ӣ����ĸ�Զ�ת��Ϊ��д����Լ������롣�ú�����Ҫ���������֤ʱʹ��
 //�������Ϊ�ı���
//function  isSfzOnKey(field){
	//field.value=field.value.replace(/[\W]/g,'').toUpperCase()
//}
//ֻ�������ֺ�26��Ӣ����ĸ����,����Ӣ����ĸ�Զ�ת��Ϊ��д����Ը���ճ������.�ú�����Ҫ���������֤ʱʹ��
//�������Ϊ����������
//function  isSfzOnPaste(clipboardData){
  // clipboardData.setData('text',clipboardData.getData('text').replace(/[\W]/g,'').toUpperCase());
//}
 //ʹ�����ּ�ʧЧ��ֻ������������,��Լ�������
  //�������Ϊ�ı���
//function  isNumberOnKey(field){
 //  field.value=field.value.replace(/[^\d]/g,'');
//}
//ʹ�����ּ�ʧЧ��ֻ������������,��Ը���ճ������
//�������Ϊ����������
//function  isNumberOnPaste(clipboardData){
  // clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''));
//}
//ʹ�����ּ�ʧЧ��ֻ�������ֺ͵�š�Ҳ���Ǹ���������,��Լ�������
  //�������Ϊ�ı���
//function  isFloatOnKey(field){
  // field.value=field.value.replace(/[^\d|.]/g,'');
//}
//ʹ�����ּ�ʧЧ��ֻ�������ֺ͵��Ҳ���Ǹ���������,��Ը���ճ������
//�������Ϊ����������
//function  isFloatOnPaste(clipboardData){
 //  clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d|.]/g,''));
//}

//ֻ������������,��Լ�������
  //�������Ϊ�ı���
//function  isChineseOnKey(field){
  // field.value=field.value.replace(/[^\u4E00-\u9FA5|\d]/g,'');
//}
//ֻ������������,��Ը���ճ������
//�������Ϊ����������
//function  isChineseOnPaste(clipboardData){
 //  clipboardData.setData('text',clipboardData.getData('text').replace(/[^\u4E00-\u9FA5|\d]/g,''));
//}

//ֻ����Ӣ�ĺ���������,��Լ�������
  //�������Ϊ�ı���
//function  isEnglishOnKey(field){
  // field.value=field.value.replace(/[\W]/g,'');
//}
//ֻ����Ӣ�ĺ���������,��Ը���ճ������
//�������Ϊ����������
//function  isEnglishOnPaste(clipboardData){
  // clipboardData.setData('text',clipboardData.getData('text').replace(/[\W]/g,''));
//}






/*
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
*/

/*
function checkNumber(e)
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
      	     alert("��������ݱ���Ϊ���֣�");
             field.focus();
      	     return false;
      	   }
           return true;
        }
  }
**/



//ʹ�����ּ�ʧЧ��ֻ������������
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

//ʹ�����ּ�ʧЧ��ֻ�������ֺ͵������
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
				alert("�������ֵС�����ֻ����һλ���֣�");
				field.focus();
				return false;
			}
		} else {

			var re1=/^(\+|-)?\d+$/g;
			var ii1=field.value.match(re1);

			if(ii1==null||ii1=="") {
				alert("��������ݱ���Ϊ���֣�");
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
      	      alert("�������ֵС�����ֻ���ж�λ���֣�");
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
      	     alert("��������ݱ���Ϊ���֣�");
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
      	      alert("�������ֵС�����ֻ������λ���֣�");
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
      	     alert("��������ݱ���Ϊ���֣�");
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
      	      alert("�������ֵС�����ֻ������λ���֣�");
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
      	     alert("��������ݱ���Ϊ���֣�");
                   field.focus();
      	     return false;
      	     }
      	}
              return true;
     }
  }
*/
