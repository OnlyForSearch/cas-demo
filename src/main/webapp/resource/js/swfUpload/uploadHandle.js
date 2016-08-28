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
		alert("����flash�ϴ��ؼ�ʧ�ܣ�");
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
			  alert("���ֻ��ͬʱ�ϴ�"+message+"������");
		      return;
		}
		var aMsg={};
		aMsg[SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT]="("+file.name+")�ļ���СΪ("+formatBytes(file.size)+"),����" 
		                                                     +oSettings.file_size_limit+"�����ƣ�";
		aMsg[SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE]="("+file.name+")�ļ���СΪ0�������ϴ���";
		aMsg[SWFUpload.QUEUE_ERROR.INVALID_FILETYPE]="("+file.name+")�Ƿ����ļ����ͣ�";
		if(aMsg[errorCode])
		{
		     aQueueError.push(aMsg[errorCode]);
		     return;
		}
		aQueueError.push("("+file.name+")�ϴ�ʧ��,δ֪����");
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
		aMsg[SWFUpload.UPLOAD_ERROR.HTTP_ERROR]="�����ϴ�������������������û�з���200״̬��";
		aMsg[SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL]="û�������ϴ���ַ";
		aMsg[SWFUpload.UPLOAD_ERROR.IO_ERROR]="����ȡ�ͷ����ļ�ʱ������IO����";
		aMsg[SWFUpload.UPLOAD_ERROR.SECURITY_ERROR]="��ȫ�����ϴ�Υ���˰�ȫԼ��"; 
		aMsg[SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED]="�û������ϴ���Ԥ��������ļ�"; 
		aMsg[SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED]="���Գ�ʼ���ϴ�ʱ�����˴���"; 
		aMsg[SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND]="�ļ���ʼ�ϴ�����û���ҵ�����ļ�"; 
		aMsg[SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED]="���ϴ�(uploadStart event)��ʼʱ������ĳ����"; 
		aMsg[SWFUpload.UPLOAD_ERROR.FILE_CANCELLED]="ȡ�����ϴ���������cancelUpload������"; 
		aMsg[SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED]="��ͣ���ϴ���������stopUpload������";
		aMsg[SWFUpload.UPLOAD_ERROR.RESIZE]="������ͼ���Сʱ������ĳ����";
		oContainer.showError(file, errorCode, message,aMsg[errorCode]||'δ֪����')
	
	};
	oSettings.upload_complete_handler =function(file){oContainer.doUploadFinish(file)};
	oSettings.queue_complete_handler = function(numFilesUploaded){};
	oSettings.mouse_over_handler =function(){this.setButtonTextStyle(".button{font-weight:normal}")}
    var upload = new SWFUpload(oSettings);
    oContainer.flashUploader=upload;
}