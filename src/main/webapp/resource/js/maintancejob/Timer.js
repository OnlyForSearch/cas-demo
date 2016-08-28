
/*
  AUTHOR:    林杰
  name:    　为控件名字.
  model：    等于'date'的时候，表示只有日期．等于'datetime'时候表示有时间有日期。等于'time'的时候，表示只有时间
  showpanel：表示容器名，不为空的时候，内容显示在容器名里面，为空的时候，内容直接输出。
*/
function Timer(name,model,showpanel,inivalue){
	this.name = name;
	this.model = model;
	this.showpanel = showpanel;
	this.timevalue="00:00:00";
	this.datevalue="";
	this.time = null;
	this.outHTML = "";
	this.ini = function(){
		this.outHTML = '<table  border="0" cellpadding="0" cellspacing="0"><tr>';
		var dateHTML = '<td nowrap style="width:140px;"><IE:CalendarIpt class=DPFrame id="date_'+this.name+'" style="width:130px;" value="'+this.datevalue+'"/></td>';
		var timeHTML = '<td nowrap style="width:100px;" id="time_'+this.name+'"></td>';
		if(model == "date"){
			this.outHTML = this.outHTML + dateHTML;
		}else if(model == "time"){
			this.outHTML = this.outHTML + timeHTML;
		}else if(model == "datetime"){
			this.outHTML = this.outHTML + dateHTML+timeHTML;
		}
		this.outHTML = this.outHTML + '</tr></table>';
	}

	this.show = function(){
		if(inivalue=="" || inivalue==null){
			inivalue = this.formatDate(this.addDays(0));
		}

		var arr = inivalue.split(" ");
		this.datevalue = arr[0];
		this.timevalue = arr[1];

		this.ini();
		if(showpanel=="" || showpanel==null){
			document.write(this.outHTML);
		}else{
			document.getElementById(showpanel).innerHTML = this.outHTML;
		}

		if(model=="time" || model=="datetime"){
			this.time = new timeControl('time_'+this.name,this.timevalue);
		}
	}

	this.setValue= function(value){
		var arr = value.split(" ");
		if(model=="date" || model=="datetime"){
			document.getElementById('date_'+this.name).value = arr[0];
		}
		if(model=="time" || model=="datetime"){
			if(arr.length>1){
				this.time = new timeControl('time_'+this.name,arr[1]);
			}else{
				this.time = new timeControl('time_'+this.name,"00:00:00");
			}
		}
	}

	this.getValue = function(){
          	var value = "";
		var datev = "";
		var timev = "";
		if(model=="date" || model=="datetime"){
			datev = document.getElementById('date_'+this.name).value;
		}
		if(model=="time" || model=="datetime"){
			timev = this.time.getValue();
		}
		if(datev==""){
			value = timev;
		}else if(timev==""){
			value = datev;
		}else{
			value = datev+" "+timev;
		}
                //alert(value);
                return value;
	}

	this.addDays = function(DaysToAdd) {
		var now=new Date();
		var newdate=new Date();
		var newtimems=newdate.getTime()+(DaysToAdd*24*60*60*1000);
		newdate.setTime(newtimems);
		return newdate;
	}

	this.formatDate = function(date){
		  var year,month,day,hour,minutes,seconds;
		  year = date.getYear();
		  month = date.getMonth();
		  day = date.getDate();
		  hour = date.getHours();
		  minutes = date.getMinutes();
		  seconds = date.getSeconds ();
		  return this.toDouble(year)+"-"+this.toDouble(month)+"-"+this.toDouble(day)+" "+
		         this.toDouble(hour)+":"+this.toDouble(minutes)+":"+this.toDouble(seconds);
	}

	this.toDouble  = function(str){
		var tempstr = str+"";
		tempstr = tempstr.length>1?tempstr:"0"+tempstr;
		return tempstr;
	}

	this.show();
}
