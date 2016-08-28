function check_all(obj){
	var len=document.getElementsByName("staffName").length;
	var allObj=document.getElementsByName("staffName");
	for(var i=0;i<len;i++){
		allObj[i].checked=obj.checked;
	}
}

function isCheckAll(){
	var len=document.getElementsByName("staffName").length;
	var allObj=document.getElementsByName("staffName");
	var k=0;
	var m=0;
	for(var i=0;i<len;i++){
		if(allObj[i].checked){
			k++;
		}else{
			m++;
		}
	}
	if(k==len){
		document.getElementById("checkAll").checked=true;
	}
	if(m==len){
		document.getElementById("checkAll").checked=false;
	}
}