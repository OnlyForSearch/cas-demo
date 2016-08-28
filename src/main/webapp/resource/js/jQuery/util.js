/**
* ���ߣ��±�
* �޸����ڣ�2008-11-18
* ���ܣ����ù���
*/

/**
 * Date��String����ת��
 * yyyy mm dd hh24 mi ss (���Դ�Сд)
 */
function to_date(str, format) {
	//index
	var indexYYYY = format.indexOf("YYYY") != -1 ? format.indexOf("YYYY") : format.indexOf("yyyy");
	var indexMM = format.indexOf("MM") != -1 ? format.indexOf("MM") : format.indexOf("mm");
	var indexDD = format.indexOf("DD") != -1 ? format.indexOf("DD") : format.indexOf("dd");
	var indexHH24 = format.indexOf("HH24") != -1 ? format.indexOf("HH24") : format.indexOf("hh24");
	var indexMI = format.indexOf("MI") != -1 ? format.indexOf("MI") : format.indexOf("mi");
	var indexSS = format.indexOf("SS") != -1 ? format.indexOf("SS") : format.indexOf("ss");
	//value
	var yyyy;
	var mm;
	var dd;
	var hh24;
	var mi;
	var ss;
	yyyy = str.substring(indexYYYY, indexYYYY + 4);
	mm = str.substring(indexMM, indexMM + 2);
	dd = str.substring(indexDD, indexDD + 2);
	if (indexHH24 != -1) {
		hh24 = str.substring(indexHH24, indexHH24 + 2);
		if (indexMI != -1) {
			mi = str.substring(indexMI, indexMI + 2);
			if (indexSS != -1) {
				ss = str.substring(indexSS, indexSS + 2);
			}
		}
	}
	//return Date Object
	if (indexSS != -1) {
		return new Date(yyyy, mm, dd, hh24, mi, ss);
	} else if (indexMI != -1) {
		return new Date(yyyy, mm, dd, hh24, mi);
	} else if (indexHH24 != -1) {
		return new Date(yyyy, mm, dd, hh24);
	} else {
		return new Date(yyyy, mm, dd);
	}
}
function to_char(date, format) {
	var yyyy = date.getFullYear();
	var mm = date.getMonth()+1;
	var dd = date.getDate();
	var hh24 = date.getHours();
	var mi = date.getMinutes();
	var ss = date.getSeconds();
	var s1 = format.replace(/yyyy|YYYY/g, yyyy);
	var s2 = s1.replace(/mm|MM/g,mm<10 ? "0" + mm : mm);
	var s3 = s2.replace(/dd|DD/g,dd<10 ? "0" + dd : dd);
	var s4 = s3.replace(/hh24|HH24/g,hh24<10 ? "0" + hh24 : hh24);
	var s5 = s4.replace(/mi|MI/g,mi<10 ? "0" + mi : mi);
	var s6 = s5.replace(/ss|SS/g,ss<10 ? "0" + ss : ss);
	return s6;
}
/**
 * return -1 : date1<date2
 * return  0 : date1=date2
 * return  1 : date1>date2
 */
function compareDate(date1, date2) {
	if (date1.getTimes() < date2.getTimes()) {
		return -1;
	} else if(date1.getTimes() > date2.getTimes()) {
		return 1;
	} else {
		return 0;
	}
}

/**
 * 功能：比较日期大小
 * 描述：date1开始日期，date2结束日期，时间格式为2009-2-26 11:30，并且不能为空
 *      true表示正确，false表示错误
 */
function dateBigSmallEqual(date1,date2) {
	var v_s = date1;
	var v_e = date2;
	var v_startdate;
	var v_enddate;

	if(v_s.length > 0 && v_e.length > 0) {
		v_startdate = v_s.replace("-","");
		v_startdate = v_startdate.replace("-","");
		v_startdate = v_startdate.replace(" ","");
		v_startdate = v_startdate.replace(":","");
		v_startdate = v_startdate.replace(":","");

		v_enddate = v_e.replace("-","");
		v_enddate = v_enddate.replace("-","");
		v_enddate = v_enddate.replace(" ","");
		v_enddate = v_enddate.replace(":","");
		v_enddate = v_enddate.replace(":","");

		if(v_startdate >= v_enddate) {
			return false;
		} else {
			return true;
		}
	}
	return true;
}