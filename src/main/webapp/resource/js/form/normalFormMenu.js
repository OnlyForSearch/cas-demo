
function doSave(noCloseAfterSave)
{    
    if(formContext.save())
    {
       doCallback();
       if(noCloseAfterSave){
       		formContext.doAfterSave();
       }else{
       		top.window.close();
       }
		return true;
    }else return false;
    }

function doDisable()
{
   if(QMsg("È·ÈÏÉ¾³ý£¿")==MSG_YES)
   {
      if(formContext.disable())
      {
	      doCallback();
	      top.window.close();
	  }
   }
}

function doCallback()
{
   var callback=formContext.request("callback");
   if(!callback) return;
   try
   {
       eval("parent."+callback);
   }
   catch(e)
   {}
}