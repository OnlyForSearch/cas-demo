function custJTToWord(aPrintParam)

{



	 //alert(formContext.getFormId());

   if(formContext.getFormId()=="91")//�ɷ�����������

   {

	   formContext.loadPrint("doc",formContext,oWordForm,aPrintParam,'doTestOne()');

	   /*

	   oWordForm.content.value=formContext.getPrintHTML({withoutFlowProc:'T'});

	   oWordForm.submit();*/

   }else if(formContext.getFormId()=="62")//81Ӧ�øĳ��ɷ����ı�ID

   {

   	 formContext.loadPrint("doc",formContext,oWordForm,aPrintParam,'doTestTwo()');

   }

   else

   {

       toWord();

   }

}


function getJFCurTchText()
{
    var sFormName=formContext.getFormName();
    if(formContext.getWin().form.getDynamicFormName)
    {
         sFormName=formContext.getWin().form.getDynamicFormName();
    }
    var sTchName=formContext.FLOW.TCH_NAME;
    var tchHtml='<span style="color:white;font-weight:bold;font-size:16px;height:100%;padding-top:2px">'+sFormName+'</span>';
       //+ '<span style="color:#eeeeee;font-weight:bold;font-size:12px;height:100%;padding-top:0px">��ǰ����:'+sTchName+'<span>';
    return tchHtml;
}



function doTestOne(){

	 var codestr=formContext.TABLE.TF_DISPATCH_REMOTE.DISPATCH_SERIAL.DEFAULT_VALUE;

   	 var elementid="oTest1";



	   oWordForm.fileName.value=(formContext.getFormName().indexOf(".doc")>=0)?'ȫ������ҵ��ָ�ӵ��ȵ�'+codestr+'��'+formContext.TABLE.TF_DISPATCH_REMOTE.DISPATCH_TITLE.DEFAULT_VALUE+'��':('ȫ������ҵ��ָ�ӵ��ȵ�'+formContext.TABLE.TF_DISPATCH_REMOTE.DISPATCH_SERIAL.DEFAULT_VALUE+'��'+formContext.TABLE.TF_DISPATCH_REMOTE.DISPATCH_TITLE.DEFAULT_VALUE+'��'+ ".doc"); //ȡ�����ֶο��������� formContext.TABLE.SOME_TABLE.COLUMN_NAME.DEFAULT_VALUE



	   if(codestr.indexOf("(��)")>0){

	   		 elementid="oTest2";

	   }

	   if(codestr.indexOf("(��)")>0){

	   		 elementid="oTest3";

	   }

	   

	   //alert(elementid);

	   var oTable = formContext.TABLE;

	   //alert(formContext.getWin().print.document.getElementById(elementid));

	   var str=formContext.getWin().print.document.getElementById(elementid).innerHTML;

	   //alert('0.1');

	   str=str.replace("/*","");

	   str=str.replace("*/","");

			//alert('1');

	   for (tableName in oTable) 

	   {

		   for (fieldName in oTable[tableName]) 

		   {

			   var oField = oTable[tableName][fieldName];

			   if (typeof (oField) != "object") continue;

			   var sElementId = oField["ELEMENT_NAME"];

			   var sText = oField.TEXT();

			   

			   str=str.replace('%'+sElementId+'%',sText+'')

		   }

	   }

	   //alert('2');

	   var reg=/^\s+|\s+$/g;

	   str=str.replace(reg,"");

	   oWordForm.content.value=str;

	   oWordForm.submit(); 

}



function doTestTwo(){

	 var codestr=formContext.TABLE.TF_DISPATCH.DISPATCH_SERIAL.DEFAULT_VALUE;

   	 var elementid="oTest1";

   	 

	   oWordForm.fileName.value=(formContext.getFormName().indexOf(".doc")>=0)?'ȫ������ҵ��ָ�ӵ��ȵ�'+codestr+'��'+formContext.TABLE.TF_DISPATCH.DISPATCH_TITLE.DEFAULT_VALUE+'��':('ȫ������ҵ��ָ�ӵ��ȵ�'+formContext.TABLE.TF_DISPATCH.DISPATCH_SERIAL.DEFAULT_VALUE+'��'+formContext.TABLE.TF_DISPATCH.DISPATCH_TITLE.DEFAULT_VALUE+'��'+ ".doc"); //ȡ�����ֶο��������� formContext.TABLE.SOME_TABLE.COLUMN_NAME.DEFAULT_VALUE

	   

	   if(codestr.indexOf("(��)")>0){

	   		 elementid="oTest2";

	   }

	   if(codestr.indexOf("(��)")>0){

	   		 elementid="oTest3";

	   }

	   

	   

	   var oTable = formContext.TABLE;

	   var str=formContext.getWin().print.document.getElementById(elementid).innerHTML;

	   str=str.replace("/*","");

	   str=str.replace("*/","");

	   for (tableName in oTable) 

	   {

		   for (fieldName in oTable[tableName]) 

		   {

			   var oField = oTable[tableName][fieldName];

			   if (typeof (oField) != "object") continue;

			   var sElementId = oField["ELEMENT_NAME"];

			   var sText = oField.TEXT();

			   str=str.replace('%'+sElementId+'%',sText)

		   }

	   }

	   var reg=/^\s+|\s+$/g;

	   str=str.replace(reg,"");

	   oWordForm.content.value=str;

	   oWordForm.submit();

	   /*

	   oWordForm.content.value=formContext.getPrintHTML({withoutFlowProc:'T'});

	   oWordForm.submit();*/

}