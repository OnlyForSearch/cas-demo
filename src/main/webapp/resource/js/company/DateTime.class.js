function checkdate(min,max){
		if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=8){
			alert("只能输入数字");
                        var value1 = event.srcElement.value;
                        event.srcElement.value = value1.substring(0,value1.length-1);
			return false;
		}else{
          	      if((parseInt(event.srcElement.value)<min || parseInt(event.srcElement.value)>max) && event.keyCode!=8){
               		alert("输入的数字只能是"+min+"到"+max+"范围内！");
                        event.srcElement.value = "";
         	      }
		}
		return true;
}

function timepicker(name,dateObj,HiddenObject){
    this.name = name;
    this.dateObj = dateObj;
    this.hh = "";
    this.mm = "";
    this.ss = "";
    this.init = function(tag){
   	 if(dateObj==true){
  	  this.outputstr = '<table width="267" height="16"  border="0" cellpadding="0" cellspacing="0">'+
		  '<tr>'+
		    '<td height="16" nowrap>'+
                    '<IE:CalendarIpt class=DPFrame id="date_'+this.name+'" style="width:150" value="" sHiddenObject="'+HiddenObject+'"/>'+
                    '&nbsp;<input style="border: 1px solid #999999; " maxlength="2"  onKeyUp="return checkdate(0,23);"  id="h_'+this.name+'" type="text" size="2">&nbsp;时&nbsp;'+
 		    '<input style="border: 1px solid #999999; " maxlength="2" onKeyUp="return checkdate(0,59);" name="textfield2" id="m_'+this.name+'"  type="text" size="2">&nbsp;分&nbsp;'+
 		    '<input style="border: 1px solid #999999; " maxlength="2" onKeyUp="return checkdate(0,59);" name="textfield3" id="s_'+this.name+'"  type="text" size="2">&nbsp;秒</td>'+
 		 '</tr>'+
	   '</table>';
   	 }
         if(tag==1){
         	return this.outputstr;
         }else if(tag==2){
   		 document.write(this.outputstr);
                 return "";
         }
    }
    this.getDateTime = function(){
          var returnstr = "";
	  this.hh = document.getElementById("h_"+this.name).value==""?"00":document.getElementById("h_"+this.name).value;
	  this.mm = document.getElementById("m_"+this.name).value==""?"00":document.getElementById("m_"+this.name).value;
	  this.ss = document.getElementById("s_"+this.name).value==""?"00":document.getElementById("s_"+this.name).value;

     	 if(this.dateObj==true){
    	    returnstr = document.getElementById("date_"+this.name).GetDate();
		returnstr = returnstr + " " + this.hh;
		returnstr = returnstr + ":" + this.mm;
		returnstr = returnstr + ":" + this.ss;
   	   }else{
		returnstr = returnstr + " " + this.hh;
		returnstr = returnstr + ":" + this.mm;
		returnstr = returnstr + ":" + this.ss;
    	  }
          return returnstr;
    }
    this.checkDate=function(){
          var returnstr = "";
          if(this.hh<0 || this.hh>23 ){
            alert("小时必须在0到23之间");
            returnstr = "false";
          }
          if( this.mm<0 || this.mm>59){
            alert("分钟必须在0到59之间");
            returnstr = "false";
          }
          if(this.ss<0 || this.ss>59){
            alert("秒钟必须在0到59之间");
            returnstr = "false";
          }
          if(document.getElementById("date_"+this.name).GetDate()==""){
            alert("日期不能为空！");
            returnstr = "false";
          }
          return returnstr;
    }
	this.setShowDate= function(ifshowdate){
		this.dateObj = ifshowdate;
		if(ifshowdate){
			document.getElementById("date_"+this.name).style.display = "";
		}else{
			document.getElementById("date_"+this.name).style.display = "none";
		}
	}

	this.setDate = function(date){
		document.getElementById("date_"+this.name).value = date;
	}

	this.setTime = function(time){
		var arr = time.split(":");
                if(time==""){
                	arr = new Array(3);
                        arr[0] = "";
                        arr[1] = "";
                        arr[2] = "";
                }
		document.getElementById("h_"+this.name).value = arr[0];
		document.getElementById("m_"+this.name).value = arr[1];
		document.getElementById("s_"+this.name).value = arr[2];
	}
        this.setDateTime = function(datetime){
          var arr = datetime.split(" ");
          if(datetime==""){
            arr = new Array(2);
            arr[0]="";
            arr[1]="";
          }
          this.setDate(arr[0]);
          this.setTime(arr[1]);
        }
}
