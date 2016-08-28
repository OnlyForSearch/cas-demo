function $createUpload(oContainer,oFlashSetting)
{
    var oSettings=oFlashSetting;
    var aQueueError=[];
    oSettings.swfupload_preload_handler = function() 
	{			
		if (!this.support.loading) 
		{
			return false;
		}
	};
	oSettings.swfupload_load_failed_handler =function()
	{
		alert("加载flash上传控件失败！");
	};
	oSettings.file_queued_handler =function(file)
	{
		var divTemplate=oContainer.getFileHTMLTemplate();
		var iSize=formatBytes(file.size);
		var sHTML=divTemplate.replace("%FILE_ID%",file.id);
		var sHTML=sHTML.replace("%FILE_SIZE%",iSize);
		var sHTML=sHTML.replace("%FILE_NAME%",file.name);
		oContainer.insertHTML(sHTML,file);
	}
	oSettings.file_queue_error_handler =function(file, errorCode, message)
	{
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) 
		{
			  alert("最多只能同时上传"+message+"个附件");
		      return;
		}
		var aMsg={};
		aMsg[SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT]="("+file.name+")文件大小为("+formatBytes(file.size)+"),超出" 
		                                                     +oSettings.file_size_limit+"的限制！";
		aMsg[SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE]="("+file.name+")文件大小为0，不能上传！";
		aMsg[SWFUpload.QUEUE_ERROR.INVALID_FILETYPE]="("+file.name+")非法的文件类型！";
		if(aMsg[errorCode])
		{
		     aQueueError.push(aMsg[errorCode]);
		     return;
		}
		aQueueError.push("("+file.name+")上传失败,未知错误！");
	};
	oSettings.file_dialog_complete_handler=function(numFilesSelected, numFilesQueued)
	{
		if(aQueueError.length)
		{
		     alert(aQueueError.join("\n"));
		     aQueueError=[];
		}
		if (numFilesQueued > 0)
	   	{
	   		this.startUpload();	  
	   	}
	};
	oSettings.upload_start_handler=function(file)
	{
		oContainer.displayProcess(file);
		return true;
	};
	oSettings.upload_progress_handler =function(file, bytesLoaded, bytesTotal)
	{
        oContainer.startProcess(file, bytesLoaded, bytesTotal);
	};
	oSettings.upload_success_handler = function(file, serverData)
	{
		oContainer.hideProcess(file, serverData);
	};
	oSettings.upload_error_handler= function(file, errorCode, message) 
	{
		var aMsg={};
		aMsg[SWFUpload.UPLOAD_ERROR.HTTP_ERROR]="尝试上传给服务器，但服务器没有返回200状态码";
		aMsg[SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL]="没有设置上传地址";
		aMsg[SWFUpload.UPLOAD_ERROR.IO_ERROR]="当读取和发送文件时出现了IO错误";
		aMsg[SWFUpload.UPLOAD_ERROR.SECURITY_ERROR]="安全错误，上传违反了安全约束"; 
		aMsg[SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED]="用户尝试上传比预设数多的文件"; 
		aMsg[SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED]="尝试初始化上传时出现了错误"; 
		aMsg[SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND]="文件开始上传，但没有找到这个文件"; 
		aMsg[SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED]="当上传(uploadStart event)开始时传回了某错误"; 
		aMsg[SWFUpload.UPLOAD_ERROR.FILE_CANCELLED]="取消了上传（调用了cancelUpload函数）"; 
		aMsg[SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED]="暂停了上传（调用了stopUpload函数）";
		aMsg[SWFUpload.UPLOAD_ERROR.RESIZE]="当调整图像大小时出现了某错误";
		oContainer.showError(file, errorCode, message,aMsg[errorCode]||'未知错误')
	
	};
	oSettings.upload_complete_handler =function(file){oContainer.doUploadFinish(file)};
	oSettings.queue_complete_handler = function(numFilesUploaded){};
	oSettings.mouse_over_handler =function(){this.setButtonTextStyle(".button{font-weight:normal}")}
    var upload = new SWFUpload(oSettings);
    oContainer.flashUploader=upload;
}