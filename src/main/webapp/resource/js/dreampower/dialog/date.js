// Copyright  Macromedia, Inc. All rights reserved. 

var GarrDateFormats; 
var GarrDayFormats;
var GarrTimeFormats;

//form element objects
var GlistDateFormats;
var GselDayFormats;
var GselTimeFormats;
var GcbUpdate;

//global strings needed for accessor functions
var GstrFullDate;
var GstrHTMLFullDate;
var GstrDateID;

function initGlobals(DateFormats,TimeFormats,DayFormats){

	//The GarrDateFormats array controls the order the date formats are shown in the UI
	//The list of formats is in Date.htm
    GarrDateFormats = LIST_DateFormats;

	//The GarrDateFormats array controls the order the day formats are shown in the UI
	//The list of formats is in Date.htm
	GarrDayFormats  =  LIST_DayFormats;

	//The GarrTimeFormats array controls the order of the time formats.
	//The list of formats is in Date.htm
	GarrTimeFormats =  LIST_TimeFormats;


 
   //-----------------------------------------------------------------------------
   
   //initialize global form elements
   GlistDateFormats = DateFormats;
   GselDayFormats   = DayFormats;
   GselTimeFormats  = TimeFormats;
}



//function: populateUI
//description: populate the UI with date format examples

function populateUI(){
   var dateFormatsArr = GarrDateFormats;  //shorter names easier to work with
   var dayFormatsArr  = GarrDayFormats;
   var timeFormatsArr = GarrTimeFormats;
   
   var nDateFormats = dateFormatsArr.length;
   var nDayFormats  = dayFormatsArr.length;
   var nTimeFormats = timeFormatsArr.length;
   
   var dateObj = new Date();  //examples are for	Now
   var dateStr = "",timeStr="",dayStr=""; 
   
    //populate day format list in UI
   //the first line creates an array of formatted dayes
   //(the createDayStr function is overloaded to return one item
   //or an array, therefore, unfortunately the function name isn't 
   //always entirely accurate)
   dayFormatsArr = createDayStr(dateObj,dayFormatsArr,dateFormatsArr,true,true);
   var counter = 0;
   for (i in dayFormatsArr){
      if (!dayFormatsArr[i].prototype){ 
		 // Val 13-aug-99 use temporary for speedier UI loading
		 var curr = new Option(dayFormatsArr[i]);
		 curr.value = i;
		 GselDayFormats.options[ counter++ ] = curr;
	  }
   }
   
   //populate date format list in UI
   //the first line creates an array of formatted dates
   //(the createDateStr function is overloaded to return one item
   //or an array, therefore, unfortunately, the function name isn't 
   ///always entirely accurate)
   dateFormatsArr  = createDateStr(dateObj,dateFormatsArr,true);
   counter = 0;
   for (i in dateFormatsArr){
      if (!dateFormatsArr[i].prototype){
		 // Val 13-aug-99: use a temporary to make initialization faster,
		 // and only assign to the formats array once.
	  	 var currObj = new Option(dateFormatsArr[i]);
		 currObj.value = i;
		 GlistDateFormats.options[ counter++ ] = currObj;
	  }
   }
   
   //populate time format list
   for (i=0;i<nTimeFormats;i++){
      timeStr = createTimeStr(dateObj, timeFormatsArr[i], true);
	  GselTimeFormats.options[ i ] = new Option(timeStr);
	  GselTimeFormats.options[ i ].value = timeFormatsArr[i];
   }
  
   
   //select first option of each menu
   GselDayFormats.selectedIndex = 0;
   GlistDateFormats.selectedIndex = 0;
   GselTimeFormats.selectedIndex = 0;
   
   //put focus in date formats field
   GlistDateFormats.focus();
}



//function: lead
//description: given a one or two digit number,
//adds a leading 0 if a 1 digit number

function lead(num){
   if (num.toString().length == "1")
      return "0" + num;
   return ( num );
}


//function: createDateStr
//description: given a date obj and a date format or formats
//returns an array with the correctly formatted date strings
//overloaded: dateFormat can be one item or an array
//if it is one item, returns one item
//if it is an array, returns an array

function createDateStr(dateObj,dateFormat,highAscii){
   var date = dateObj.getDate();
   var day = dateObj.getDay();
   var month = dateObj.getMonth();
   var year = dateObj.getYear();
   var abbrYear = (year<100)? year : year.toString().substring(year.toString().length-2);
   var fullYear = (year<100)? "19" + year : year
   
   var retVal; //return value;
   
   var abbrMonth;
   var westabbrMonth;
   var fullMonth;
   var westfullMonth;

	   westabbrMonth = ARR_WestAbbrMonths[ month ];
	   abbrMonth = ARR_AbbrMonths[ month ];
	   westfullMonth = ARR_WestFullMonths[ month ];
	   fullMonth = ARR_FullMonths[ month++ ];

   //the dateFormat argument is overloaded so that it
   //can be either a string or an array. Handle accordingly.
   if (typeof dateFormat == "string"){
        retVal = createCorrectDateFormat(dateFormat,date,day,month,abbrMonth,westabbrMonth,fullMonth,westfullMonth,
	                                   year,abbrYear,fullYear);
   } else { //dateFormat is an array
        retVal = new Array();
	    dateFormats = dateFormat; //rename
		var nFormats = dateFormats.length;

		
		for (var i=0;i<nFormats;i++){
		   retVal[dateFormats[i]] = createCorrectDateFormat(dateFormat[i],date,day,month,abbrMonth,westabbrMonth,
		                                       fullMonth,westfullMonth,year,abbrYear,fullYear);
			
		}
   }    
   
   return retVal;
}


//function: createCorrectDateFormat
//description: returns a correclty formatted date string

function createCorrectDateFormat(dateFormat,date,day,month,abbrMonth,westabbrMonth,fullMonth,westfullMonth,year,abbrYear,fullYear,time){

    var dateStr = "";
   
	switch (dateFormat){
	
	   case "American1":  // Thursday, March 7, 1974
	      dateStr += fullMonth + " " + date + ", " + fullYear;
		  break;
		  
	   case "American2":  // 3/7/74
	      dateStr += month + "/" + date + "/" + abbrYear;
		  break;
		  
	   case "American3":  // 03/07/1974
	      dateStr += lead(month) + "/" + lead(date) + "/" + fullYear;
		  break;

	   case "ISO8601":  // 1974-03-07
	      dateStr += fullYear + "-" + lead(month) + "-" + lead(date);
		  break;
		  
	   case "English1":  // 7-mar-74
	      dateStr += date + "-" + westabbrMonth + "-" + abbrYear;
		  break;
	  
	   case "English2":  // 07-Mar-1974
	      westabbrMonth = westabbrMonth.charAt(0).toUpperCase()+westabbrMonth.substring(1);
	      dateStr += lead(date) + "-" + westabbrMonth + "-" + fullYear;
		  break;
		  
	   case "Spanish1":  // 7/3/74 
	      dateStr += date + "/" + month + "/" + abbrYear;
		  break;
		  
	   case "French1":  //  7/03/74
	      dateStr += date + "/" + lead(month) + "/" + abbrYear;
		  break;
		  
	   case "Italian1":  // 7-03-1974
	      dateStr += date + "-" + lead(month) + "-" + fullYear;
		  break;
		  
	   case "Brazilian1":  // 07.03.74
	      dateStr += lead(date) + "." + lead(month) + "." + abbrYear;
		  break;
		  
	   case "German1":  // 07.03.1974
	      dateStr += lead(date) + "." + lead(month) + "." + fullYear;
		  break;
		  
	   case "Japanese1":  // 74/03/07
	      dateStr += abbrYear + "/" + lead(month) + "/" + lead(date) ;
		  break;

	   case "Japanese2":  // 1974 (yearJapanese) 3(month) 7(dayJapanese)
	      dateStr += fullYear + yearJapanese + fullMonth + date + dayJapanese;
		  break;

	   case "Japanese3":  // 1974(yearJapanese)03(month) 07(dayJapanese)
	      dateStr += fullYear + yearJapanese + lead(month) + monthJapanese + lead(date) + dayJapanese;
		  break;
		            
	   case "Swedish1":  //  7 March, 1974
	      dateStr +=  date + " " + fullMonth + ", " + fullYear;
		  break;
		  
	   case "Korean1":  //  1974(korean year) 3(korean month) 7(korean day)
	      dateStr +=  fullYear + yearKorean + fullMonth + " " + date + dayKorean;
		  break;
		  
	   case "Korean2":  //  1974.3.7
	      dateStr +=  fullYear + "." + month + "." + date;
		  break;

	   case "Korean3":  //  3.7.1974
	      dateStr +=  month + "." + date + "." + fullYear;
		  break;

       case "Korean4":  //  March 7,1974
	      dateStr += westfullMonth + " " + date + ", " + fullYear;
		  break;

	   case "Korean5":  //  74.03.07
	      dateStr += abbrYear + "." + lead(month) + "." + lead(date);
		  break;

	   case "Korean6":  // 3/7/ 1974
	      dateStr +=  abbrMonth + "/" + lead(date) + " " + fullYear;
		  break;

       case "Korean7":  //  74-03-07
	      dateStr += abbrYear + "-" + lead(month) + "-" + lead(date);
		  break;

	   case "Chinese1":  // 74/3/7
	      dateStr += abbrYear + "/" + month + "/" + date ;
		  break;

	   case "Chinese2":  // 1974 (yearChinese) 3(monthChinese) 7(dayChinese)
	      dateStr += fullYear + yearChinese + fullMonth + date + dayChinese;
		  break;

	   default:
	      break;
   }
   
   return dateStr;

}



//function: createDayStr
//description: see createDateStr notes. Except of course this function
//returns a correctly formatted day (or days) instead of a date

function createDayStr(dateObj,dayFormat,dateFormat,bPreview,highAscii){
   var	day = dateObj.getDay();
   var	WestFullDay = ARR_WestFullDays[day];
   var	WestAbbrDay = ARR_WestAbbrDays[day];
   var	fullDay;
   var	abbrDay;

     fullDay = ARR_FullDays[day];
     abbrDay = ARR_AbbrDays[day];

   if (typeof dayFormat == "string"){
	  retVal = createCorrectDayFormat(dayFormat,fullDay,abbrDay,WestFullDay,WestAbbrDay,bPreview);
   } else { //dayFormat is an array
        retVal = new Array();
	    dayFormats = dayFormat; //rename for clarity
		var nFormats = dayFormats.length;

		for (var i=0;i<nFormats;i++){
		   retVal[dayFormats[i]] = createCorrectDayFormat(dayFormat[i],fullDay,abbrDay,WestFullDay,WestAbbrDay,bPreview);
		}
   }    
   return retVal;
}


function createCorrectDayFormat(dayFormat,fullDay,abbrDay,WestFullDay,WestAbbrDay,bPreview){

   var dayStr = "";
   switch (dayFormat){
   
      case "NoDay":
	     if (bPreview)
		    dayStr = "[" + OPTION_NoDay + "]";
	     break;
		  
	  case "FullDayComma":
	     dayStr = CHAR_PreDay + fullDay + CHAR_PostDay;
		 break;
		 
	  case "FullDay":
	     dayStr = fullDay + " ";
		 break;
		 
	  case "AbbrDayComma":
	     dayStr = CHAR_PreDay + abbrDay + CHAR_PostDay;
		 break;
		 
	  case "AbbrDay":
	     dayStr = abbrDay + " ";
		 break;
		 
	  case "LowAbbrDayComma":
	     dayStr = abbrDay.toLowerCase() + ", ";
		 break;
		 
	  case "LowAbbrDay":
	     dayStr = abbrDay.toLowerCase() + " ";
		 break;

	  case "WestFullDayComma":
		 dayStr = WestFullDay + westSeparator;
		 break;
	
	  case "WestAbbrDayComma":
	     dayStr = WestAbbrDay + westSeparator; 
        break;

	  default:
	     break;
   
   }

   return dayStr;

}

function createTimeStr(dateObj,timeFormat,bPreview){
   var hours = dateObj.getHours();
   var minutes = lead(dateObj.getMinutes());
   var timeStr = "";  //return value
   
   switch (timeFormat){
      case "NoTime":
	     if (bPreview)
		    timeStr = "[" + OPTION_NoTime + "]";
		 break;
		 
	   case "AMPMTime":
			 timeStr += (hours>=12) ? ((hours-12==0)?hours:hours-12) + ":" + minutes + " " + PM :
                  hours + ":" + minutes + " " + AM;
		   timeStr = " " + timeStr;
		   break;
		  
	  case "MilitaryTime":
	     timeStr += " " + hours + ":" + minutes;
		   timeStr = " " + timeStr;
		   break;
		 
	  default:
	     break;
   }
	     
   return timeStr;
}
