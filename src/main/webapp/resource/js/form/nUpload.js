function upload(oConfig)
{	
	var doc=window.document;
	var gFileUploaded={};
	var gSwfUploaderAdapter;
	var readOnly = false;
	var uId;
	var element;
	var listener={onAdd:function(oHook){},onDel:function(oHook){},onNotSupport:function(){}};
	var gFlashSetting=
	{
		flash_url : "/resource/js/swfUpload/swfupload.swf",	
		flash9_url : "/resource/js/swfUpload/swfupload_fp9.swf",
		file_size_limit : "1000 MB",	
		file_types_description : "All Files",
		file_upload_limit : "0",
		file_queue_limit : "0",
		prevent_swf_caching:true,
		button_cursor:-2
	};
	init();	
	function init()
	{
	    handleFireFox();
	    setFlashSettings();
	    setListener();
	    renderTo(oConfig.target)
	    function handleFireFox()
		{
		    if (!window.ActiveXObject)
		    {
				HTMLElement.prototype.insertAdjacentElement=function(where,parsedNode)
				{
				    switch(where)
				    { 
				        case "beforeBegin": 
				            this.parentNode.insertBefore(parsedNode,this);
				            break; 
				        case "afterBegin": 
				            this.insertBefore(parsedNode,this.firstChild); 
				            break; 
				        case "beforeEnd": 
				            this.appendChild(parsedNode); 
				            break; 
				        case "afterEnd": 
				            if(this.nextSibling) 
				                this.parentNode.insertBefore(parsedNode,this.nextSibling); 
				            else 
				                this.parentNode.appendChild(parsedNode); 
				            break; 
			        } 
			    }
		     }
		};
		function setFlashSettings()
		{
			try
			{
			   for(var key in oConfig.flashSetting)
			   {
				   gFlashSetting[key]=oConfig.flashSetting[key];
			   }
			}
			catch(e)
			{
				alert("无效的flash配置对象！");
			}
		};
		function setListener()
		{	
			if(oConfig.listener)
			{
				for (var key in oConfig.listener)
				{
				   listener[key]=oConfig.listener[key];
				}
			}
		};
	}
	
	this.setReadOnly=function(pReadOnly)
	{
	    readOnly=pReadOnly;		
		this.getUploader().style.display=(readOnly)?"none":"";
		if(gFlashSetting.button_overlay_id)
		{
		    doc.getElementById(gFlashSetting.button_overlay_id).style.display=(readOnly)?"none":"";
		}
		ctrlDel();
	    function ctrlDel()
	    {
	    	var oChilds=element.children;
	    	var iLen=oChilds.length;
	    	for(var i=0;i<iLen;i++)
	    	{
	    	    if(oChilds[i].children.length) 
	    	       oChilds[i].children.item(3).style.display=(readOnly)?"none":"";
	    	}
	    }
	}		
	this.getUploader=function()
	{
		return gSwfUploaderAdapter.getUploader().getMovieElement();
	}
	
	this.hideUploader=function()
	{
		gSwfUploaderAdapter.getUploader().setButtonDisabled(true);
		gSwfUploaderAdapter.getUploader().setButtonDimensions(1,1);
		if(gFlashSetting.button_overlay_id)
		{
		    doc.getElementById(gFlashSetting.button_overlay_id).style.display="none";
		}
	}
	this.getFileQueuedCnt=function()
	{
		var oStat=gSwfUploaderAdapter.getUploader().getStats();
		var iCnt=(oStat)?oStat.files_queued:0;
		for(var key in gFileUploaded)
		{
			if(gFileUploaded[key].updater)
			{
				var updaterStat=gFileUploaded[key].updater.getStats();
				iCnt+=(updaterStat)?updaterStat.files_queued:0;
			}
		}
	    return iCnt;
	}
	
	this.addAttach=function(file)
	{
		gSwfUploaderAdapter.custom_settings.render(file);
		gFileUploaded[file.id]={name:file.name,size:file.size};
		gSwfUploaderAdapter.showOperater(file);	
	}
	
	this.removeAll=function()
	{
		for(var key in gFileUploaded)
		{
			delete gFileUploaded[key];
		}
		initDownHTML();
	}
	
	function execHook(oFire,oHook)
	{
		oFire.call(this,oHook);
	}
	function getUploadedFile()
	{
		return gFileUploaded;
	}
	
	function copySetting(oTo,oFrom)
	{
	    for (var key in oFrom)
	    {
	    	if(oTo[key]===undefined)
	           oTo[key]=oFrom[key];
	    }
	}
	
	function renderTo(oTarget)
	{
		doDocReady(oTarget)
		gSwfUploaderAdapter=new SwfUploaderAdapter();
		initSetting();
	    var swfUploader = new SWFUpload(gSwfUploaderAdapter);	    
	    gSwfUploaderAdapter.setUploader(swfUploader); 
	    function initSetting()
	    {
	    	copySetting(gSwfUploaderAdapter,gFlashSetting);    	
	    	if(gFlashSetting.button_overlay_id)
	        {
	    		var oOverlay=doc.getElementById(gFlashSetting.button_overlay_id);
	    		var buttonWidth=oOverlay.offsetWidth;
	    		var buttonHeight=oOverlay.offsetHeight;
	    		gSwfUploaderAdapter.button_width=buttonWidth;
	    		gSwfUploaderAdapter.button_height=buttonHeight;
	    		gSwfUploaderAdapter.custom_settings.cssStyle=" class='swfupload' style='position: absolute;z-index: 1;' ";
	    		if(!gFlashSetting.button_placeholder_id)
	    		{
	            	var oSelector=doc.createElement("span");
	            	oSelector.id=uId+"_selector";
	            	oOverlay.insertAdjacentElement("beforeBegin",oSelector);
	            	gSwfUploaderAdapter.button_placeholder_id=oSelector.id;
	    		}
	        }
	    }
	    function doDocReady(oTarget)
	    {
			uId=oTarget.id;
			element=oTarget;
			oTarget.style.overflow="auto";
			initDownHTML(oTarget);
			downloadSwfJs();		
			function initDownHTML(oTarget)
			{
				oTarget.innerHTML='<iframe name="'+uId+'_download" style="display:none"></iframe>';
			}
			function downloadSwfJs()
			{
				SWFUpload.prototype.getFlashHTML = function (flashVersion)
				{
					var classId='';
					if (window.ActiveXObject)
					{
					   classId=" classid = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' ";
					}
					var sHTML= ['<object',classId,' id="', this.movieName, '" type="application/x-shockwave-flash" data="', 
					            (this.support.imageResize ? this.settings.flash_url : this.settings.flash9_url), '" width="', 
					            this.settings.button_width, '" height="', this.settings.button_height, '"',this.customSettings.cssStyle,' >',
								'<param name="wmode" value="', this.settings.button_window_mode, '" />',
								'<param name="movie" value="', (this.support.imageResize ? this.settings.flash_url : this.settings.flash9_url), '" />',
								'<param name="quality" value="high" />',
								'<param name="allowScriptAccess" value="always" />',
								'<param name="flashvars" value="' + this.getFlashVars() + '" />',
								'</object>'].join("");
				   return sHTML;
				};
			}
	    }
	}
	function getFielDiv(file)
	{
	   	return doc.getElementById(uId+"_"+file.id);
	}
	
	function SwfUploaderAdapter()
	{
		var swfUploader=null;
		this.setUploader=function(uploader)
		{
			swfUploader=uploader;
		}
		this.getUploader=function()
		{
			return swfUploader;
		}
	    this.showOperater=function(file)
		{
	    	var oDel=doc.getElementById(getFielDiv(file).id+"_oDel");
	    	oDel.style.display="";
	    	var singleSwfUploader;
	   		if(readOnly)
	   		{
				oDel.style.display="none";
				if(singleSwfUploader)
				{
		 			var oFlash=singleSwfUploader.getMovieElement();
		   			oFlash.style.display="none";
					oFlash.nextSibling.style.display="none";
				}
	   		}
	    }
	    this.swfupload_preload_handler = function() 
		{	
			if (!this.support.loading)
			{
				listener.onNotSupport.call(this);
				return false;
			}
			return true;
		};

		this.swfupload_load_failed_handler = function() 
		{			
		};
		this.file_queued_handler =function(file)
		{
			file.name=decodeURIComponent(file.name);
			this.customSettings.render(file);
		};
		this.file_queue_error_handler = function(file, errorCode, message)
		{
			file.name=decodeURIComponent(file.name);
			if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) 
			{
				  alert("最多只能同时上传"+message+"个附件");
			      return;
			}
			var aMsg={};
			aMsg[SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT]="("+file.name+")文件大小为("+formatBytes(file.size)+"),超出" 
			                                                     +this.file_size_limit+"的限制！";
			aMsg[SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE]="("+file.name+")文件大小为0，不能上传！";
			aMsg[SWFUpload.QUEUE_ERROR.INVALID_FILETYPE]="("+file.name+")非法的文件类型！";
			if(aMsg[errorCode])
			{
			     this.customSettings.queueError.push(aMsg[errorCode]);
			     return;
			}
			this.queueError.push("("+file.name+")上传失败,未知错误！");
		};
		this.file_dialog_complete_handler = function(numFilesSelected, numFilesQueued)
		{
			if(this.customSettings.queueError.length)
			{
			     alert(this.customSettings.queueError.join("\n"));
			     this.customSettings.queueError=[];
			}
			if (numFilesQueued > 0)
		   	{
		   		this.startUpload();	   		
		   	}
		};
		this.upload_start_handler = function(file)
		{	
			file.name=decodeURIComponent(file.name);
			this.customSettings.hiddenUploader();
			this.customSettings.displayProcess(file);
			return true;
		};
		this.upload_progress_handler = function(file, bytesLoaded, bytesTotal)
		{
			file.name=decodeURIComponent(file.name);
			this.customSettings.startProcess(file, bytesLoaded, bytesTotal);
		};
		this.upload_success_handler = function(file, serverData)
		{
			file.name=decodeURIComponent(file.name);
			this.customSettings.hideProcess(file, serverData);
		};
		this.upload_error_handler = function(file, errorCode, message) 
		{
			file.name=decodeURIComponent(file.name);
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
			this.customSettings.showError(file, errorCode, message,aMsg[errorCode]||'未知错误');		
		};
		this.upload_complete_handler = function(file)
		{
			file.name=decodeURIComponent(file.name);
			this.customSettings.doUploadFinish(file,this);		
		};
		this.queue_complete_handler = function(numFilesUploaded){};
		this.mouse_over_handler = function()
		{
			var oOverlay=this.getMovieElement().nextSibling;
			oOverlay.className="attach_add_button_hover";
			oOverlay.style.textDecoration="underline";
	    };
		this.mouse_out_handler = function()
	    {
			var oOverlay=this.getMovieElement().nextSibling;
			oOverlay.className="attach_add_button";
			oOverlay.style.textDecoration="none";
	    }
		this.custom_settings=
		{
		   queueError:[],
		   cssStyle:" class='swfupload' ",
		   genHTML:function(file)
		   {
				var sHTML=getFileHTMLTemplate(file);
				element.insertAdjacentHTML('beforeEnd',sHTML);	
				function getFileHTMLTemplate(file)
				{
				 	 var iSize=formatBytes(file.size);
				 	 var path=(file.path)?file.path:"#";
				 	 var title=(file.title)?file.title:"";
				 	 var sId=uId+'_'+file.id;
				     return['<div style="display:inline-block;*display: inline;height:20px;white-space:nowrap;clear:none;float:none" id="',sId,'">',
				              '<div style="display: inline-block;*display: inline;">',
				                 '<img src="/resource/image/attachment.jpg" align="absmiddle"></img>',
				                 '<span style="font-size:12px"><a id="',sId,'_oLink" href="',path,
				                 '" target="',uId,'_download" class="attach_item" style="color:blue;text-decoration:underline;cursor:hand;margin:0;padding:0" ',
					             'onmouseover="this.style.textDecoration=\'underline\';this.className=\'attach_item_hover\'" ',
					             'onmouseout="this.style.textDecoration=\'none\';this.className=\'attach_item\'" ',
				                 ' title="',title,'" >',
				                 file.name,'</a></span>',
				                 '<span style="font-size:12px;color:#8e877d;margin:0px;padding:0" class="attach_size" id="',sId,'_oSize">(',iSize,')</span>',    
				               '</div>',
				           '<div id="',sId,'_oProcessOuter" style="width:100px;height:12px;border:1px solid black;',
				                'display:none;overflow:hidden;margin:1 0 1 0;clear:none;padding:0px">',
				             '<div id="',sId,'_oProcess" STYLE="color: white; text-align: center;background-color: blue; margin: 0px; ',
				             'width: 1px; height: 100%;"></div>',
				           '</div>',
				           '<span id="',sId,'_oFail" style="color: red; margin-right: 5px;font-size:12px;',
				               'cursor: default;display:none" class="attach_upload_fail"> 上传失败</span>',
				           '<span id="',sId,'_oDel" style="margin-left:5px;color: #663a0d; margin-right: 5px;',
				               'font-size:12px;cursor:default;text-decoration:none;cursor:hand" ',
				               'onmouseover="this.style.textDecoration=\'underline\';this.className=\'attach_del_button_hover\'" ',
				               'onmouseout="this.style.textDecoration=\'none\';this.className=\'attach_del_button\'" ',
				               'class="attach_del_button">删除</span>',
				           '<span id="',sId,'_oRetry" style="color: #663a0d; margin-right: 5px;font-size:12px;cursor:hand;',
				               'display:none;text-decoration:none"',
				             ' onmouseover="this.style.textDecoration=\'underline\';this.className=\'attach_retry_button_hover\'" ',
				             ' onmouseout="this.style.textDecoration=\'none\';this.className=\'attach_retry_button\'" ',
				             ' class="attach_retry_button">重试</span>',
				        '</div>'].join("");
				}
		   },
		   render:function(file)
		   {
	            this.genHTML(file);            
				var oFileDiv=getFielDiv(file);
				var oDel=doc.getElementById(oFileDiv.id+"_oDel");
				oFileDiv.style.whiteSpace="nowrap";
				oDel.onclick=function()
				{
				   swfUploader && swfUploader.cancelUpload(file.id,false);
				   getFielDiv(file).style.display="none";
				   delete gFileUploaded[file.id];
				   if(swfUploader.settings.file_queue_limit==1)
				   {
					   swfUploader.setButtonDisabled(false);
					   swfUploader.setButtonDimensions(gSwfUploaderAdapter.button_width,gSwfUploaderAdapter.button_height);
					   if(gFlashSetting.button_overlay_id)
					   {
						   doc.getElementById(gFlashSetting.button_overlay_id).style.display="";
					   }
				   }				   
				   execHook(listener.onDel,{file:file});
				}
		   },
		   displayProcess:function(file)
		   {
		   	    if(!file) return;
		   	    var oProcessOuter=doc.getElementById(getFielDiv(file).id+"_oProcessOuter");
		   	    var isIE=(navigator.appName.indexOf("Internet Explorer") != -1);
		   	    if(isIE)  
				{  
				   var aTemp=navigator.appVersion.split("MSIE");  
				   var version=parseFloat(aTemp[1]);
				   if(version<10)
				   {
				      oProcessOuter.style.display="inline";
				      return;
				   }
				}  
		   	    oProcessOuter.style.display="inline-block";
		   },
		   startProcess:function(file, bytesLoaded, bytesTotal)
		   {
			   	if(!file) return;
			   	if(file.filestatus==window.SWFUpload.FILE_STATUS.CANCELLED 
			   			 || file.filestatus==window.SWFUpload.FILE_STATUS.ERROR)
			   		return;
			   	var oFileDiv=getFielDiv(file);
			   	var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
			   	if(!oFileDiv) return;
			    var iWidth=parseInt(doc.getElementById(oFileDiv.id+"_oProcessOuter").style.width,10);
			    doc.getElementById(oFileDiv.id+"_oProcess").style.width = (iWidth*percent/100)+ "px";	
		   },
		   createUpdater:function(file,serverData,oSetting)
		   {
		   		execHook(listener.onAdd,
		   			   {file:file,serverData:serverData,
		   			   link:doc.getElementById(getFielDiv(file).id+"_oLink")});
		   },
		   hideProcess:function(file, serverData)
		   {
			   	if(!file) return;
			   	doc.getElementById(getFielDiv(file).id+"_oProcessOuter").style.display="none";
			   	gFileUploaded[file.id]={name:file.name,size:file.size};
			   	this.createUpdater(file,serverData,this);
		   },
		   showError:function (file,errorCode,msg,msgCn)
		   {
			   	if(file.filestatus==window.SWFUpload.FILE_STATUS.CANCELLED) return;
			   	var oFileDiv=getFielDiv(file);
			   	var oFail=doc.getElementById(oFileDiv.id+"_oFail");
			   	var oRetry=doc.getElementById(oFileDiv.id+"_oRetry");
			   	var oProcessOuter=doc.getElementById(oFileDiv.id+"_oProcessOuter");
			   	oProcessOuter.style.display="none";
			   	oFail.style.display="inline";
			   	oFail.title="错误代码:"+errorCode+'\n错误描述:'+msgCn+"\n错误消息:"+msg;
			   	oRetry.style.display="";
				delete gFileUploaded[file.id];
		   },
		   doUploadFinish:function (file,uploader)
		   {
			   	var oFileDiv=getFielDiv(file);
			   	if(!oFileDiv) return;
			   	var oRetry=doc.getElementById(oFileDiv.id+"_oRetry");
			   	if(!oRetry) return;
			   	oRetry.onclick=function()
			   	{
			   		var oFail=doc.getElementById(oFileDiv.id+"_oFail");
			   		oFail.style.display="none";
			   		this.style.display="none";
			   		uploader.requeueUpload(file.id);
			   		uploader.startUpload(file.id);
			   	}	
		   },
		   hiddenUploader:function()
		   {
			   if(swfUploader.settings.file_queue_limit==1)
			   {
				   swfUploader.setButtonDisabled(true);
				   swfUploader.setButtonDimensions(1,1);
				   if(gFlashSetting.button_overlay_id)
				   {
					   doc.getElementById(gFlashSetting.button_overlay_id).style.display="none";
				   }
			   }
		   }
	    }
	};	
}