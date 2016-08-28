//���attachEvent������this��ָ��
var Event = {};
Event.addEvent = function(target,eventType,handle){
    if(document.addEventListener){
        target.addEventListener(eventType,handle,false);
    }else if(document.attachEvent){
        target.attachEvent('on'+eventType,function(){
            //����ı�this��ָ��
            handle.apply(target,arguments);
        });
    }else{
        target['on'+eventType] = handle;
    }
};


//�ж����������������ʵλ��(ʹ��deleteɾ��)
Array.prototype.indexOfReal = function(index){
	var j = 0 ;
	for(var i = 0 ; i < this.length ;i ++){
		if(this[i]){
			if(this[i] == this[index]){
				break;
			}
			j++;
		}
	}
	return j;
}


/**
 * �ֶ�����:
  elementType:{
	  text:'1',textarea:'2',select:'3',hidden:'5',span:'16',
	  addBtn:'22',saveBtn:'23',delBtn:'24'
  }
  
  ����Դ����:
  dataSourceType:{
		codeList: '1', tpTreeType:'2', format:'8',custom:'9'
   }
 * 
 * option = {
		RENDER_TO : '', //������һ��id,Ҳ������һ��element����(������)
		callback:functon(field){},  //�ص�����,�ᴫ��һ��field����,��������������ø��ֶε���Ϊ
		AUTOSAVE:false, //�Ƿ��Զ�����,Ĭ��false
		TABLE_DATA : {
			TABLE_NAME : "",  //�洢���ݵ�������(������)
			TABLE_FIELDS : {
				ACCESSOREIS_ID : {  //����������,�����Զ���(������)
					PRIMARY_KEY : true,   //������ʶ(������)
					HIDDEN : true,
					SEQ_NAME : ""   //������������һ��SEQ(������)
				},
				GOODS : {
					FIELD_TEXT : "",  //��ʾ������
					WIDTH : "20%",    
					IS_EMPTY : "F",   //���ֶ��Ƿ����
					ELEMENT_TYPE : '3',   //�ֶ�����(Ĭ����hidden),���elementType����,���Լ���չ
					DATA_SOURCE : {  //���������ʱ������������Դ
						SOURCE_TYPE : '1',  //����Դ����,���dataSourceType����,���Լ���չ
						DATA_VALUE : "",
						PARENT_DATA: "",
						FOREIGN:{
        					KEY:'REASON',
        					RELATION:'PRIMARY'/'FRIEND'
        				}   
					}
				},
				REASON : {
					FIELD_TEXT : "����",
					IS_EMPTY : "F",
					ELEMENT_TYPE : '1',
					REGEX:/^[1-9]+$/     //����У��,��������
				},
				FLOW_ID : {  //������һ��flag��ʶ,�ֶ����Զ���(������)
					FLAG : true,  //��ʶ���ֶ���flag��ʶ�ֶ�
					HIDDEN : true
				}
			}
		}
	}
 */
/**
 * 2014/8/6
 * by chenzw
 * V0.1
 */
var tableApp = function(option){
	this.url = "/servlet/ColumnConfigServlet?";
	this.commonStr = "/servlet/commonservlet?";
	this.FLAG = {};
	this.PRIMARY_KEY = "";
	this.SEQ_NAME = "";
	this.TABLE_NAME = option.TABLE_DATA.TABLE_NAME;
	this.TABLE = (typeof option.RENDER_TO == "object") ? option.RENDER_TO
			: document.getElementById(option.RENDER_TO);
	this.EDITABLE = false;
	this.AUTOSAVE = option.AUTOSAVE;
	this.TABLE_DATA = [];
	
    
	
	//��ȡ�ֶι���
	this.elementFactory = (function($this){
		  function selElement(obj){
			  var selectElem = document.createElement("select");
			  selectElem.style.width = '100%';
			  selectElem.sIndex = obj.sIndex;

			  selectElem.setListValue = function(obj){
				  if(obj.isEmpty && obj.isEmpty == "T"){
		  			  selectElem.add(new Option("",""));
				  }
				  if(obj.listXml){
					  var rows = obj.listXml.selectNodes("/root/rowSet");
			  		  for(var i = 0 ;i < rows.length; i++){
			  			  var code = rows[i].firstChild.text;
			  			  var mean = rows[i].lastChild.text;
			  			  var option = new Option(mean,code);
			  			  selectElem.add(option);
			  			  if(obj.sValue && obj.sValue == code){
			  				  option.selected=true;
			  			  }
			  		  }
				  }
			  }
			  
			  selectElem.setListValue(obj);
			  
			  if($this.AUTOSAVE){
		    	  Event.addEvent(selectElem,'change',$this.saveRow);
		      }
		      
		      Event.addEvent(selectElem,'change',$this.showSaveBtn);
			  return selectElem;
		  }
		  
		  
		  //��Ӱ�ť
		  function addBtnElement(){
			  var imgElem = new Image();
			  imgElem.src="../../../resource/image/inputplus.gif";
			  imgElem.style.behavior= "url(/resource/htc/imgButton.htc)";
			  imgElem.style.cursor="hand";
			  if($this.EDITABLE){
				  imgElem.attachEvent("onclick",$this.addRow);
			  }else{
				  imgElem.style.display = "none"; 
			  }
			  return imgElem;
		  }
		  
		   //���水ť
		  function saveBtnElement(obj){
			  var imgElem = new Image();
			  imgElem.src="../../../resource/image/save.gif";
			  imgElem._name="saveImg";
			  imgElem.name="saveImg";
			  imgElem.style.behavior= "url(/resource/htc/imgButton.htc)";
			  imgElem.style.marginRight = "6";
			  imgElem.style.cursor="hand";
			  imgElem.sIndex = obj.sIndex;
			  if($this.EDITABLE){
				  if(obj.hidden){
					  imgElem.style.display="none"; 
				  }
				  Event.addEvent(imgElem,'click',$this.saveRow);
			  }
			  
			  return imgElem;
		  } 
		   
		  //ɾ����ť
		  function delBtnElement(obj){
			  var imgElem = new Image();
			  imgElem.src="../../../resource/image/inputminus.gif";
			  imgElem.style.behavior= "url(/resource/htc/imgButton.htc)";
			  imgElem.style.cursor="hand";
			  imgElem.sIndex = obj.sIndex;
			  if($this.EDITABLE){
				  Event.addEvent(imgElem,'click',$this.delRow);
			  }
			  
			  return imgElem;
		  }

		  function inputElement(obj){
			  var inputElem = document.createElement("input");
			  inputElem.type="text";
			  inputElem.style.width = '100%';
			  inputElem.sIndex = obj.sIndex;
			  if(obj.sValue){
				 inputElem.value = obj.sValue;
			  }
			  
			  if($this.AUTOSAVE){
		    	  Event.addEvent(inputElem,'change',$this.saveRow);
		      }
			  Event.addEvent(inputElem,'change', $this.showSaveBtn);

			  return inputElem; 
		  }
		  
		  function hiddenElement(obj){
			  var inputElem = document.createElement("input");
			  inputElem.type="hidden";
			  if(obj.sValue){
				 inputElem.value = obj.sValue;
			  }
			  return inputElem;
		  }
		  
		  function spanElement(obj){
			  var spanElem = document.createElement("span");
			  spanElem.style.width = "100%";
			  if(obj.sValue){
				  spanElem.innerHTML = obj.sValue;
			  }
			  return spanElem;
		  }
		  
		  function textAreaElement(obj){
			  var textAreaElem = document.createElement("textarea");
			  textAreaElem.style.width = "100%";
			  textAreaElem.rows = "1";
			  if(obj.sValue){
				  textAreaElem.value = obj.sValue;
			  }
			  
			  if($this.AUTOSAVE){
		    	  Event.addEvent(textAreaElem,'change',$this.saveRow);
		      }
			  Event.addEvent(textAreaElem,'change', $this.showSaveBtn);
			  return textAreaElem;
		  }
		  
		  var Factory = {
				  elementType:{
					  text:'1',textarea:'2',select:'3',hidden:'5',span:'16',
					  addBtn:'22',saveBtn:'23',delBtn:'24'
				  },
		    	  getElement:function(obj){
		    		  switch(obj.sType){
		    			  case this.elementType.select:
		    				  return new selElement(obj);
		    			  case this.elementType.textarea:
		    				  return new textAreaElement(obj);
		    			  case this.elementType.text:
		    				  return new inputElement(obj);
		    			  case this.elementType.hidden:
		    				  return new hiddenElement(obj);
		    			  case this.elementType.span:
		    				  return new spanElement(obj);
		    			  case this.elementType.addBtn:
		    				  return new addBtnElement();
		    			  case this.elementType.saveBtn:
		    				  return new saveBtnElement(obj); 
		    			  case this.elementType.delBtn:
		    				  return new delBtnElement(obj);  	  
		    		  }
		    	  }
		  };
		  return Factory;
	})(this);
	
	//����Դ����
	this.dataFactory = (function($this){
		function loadByCodeList(obj) {
			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.Open("POST", $this.commonStr + "tag=3&code_type=" + obj.sValue,	false);
			xmlhttp.send();
			if (isSuccess(xmlhttp)) {
				return xmlhttp.responseXML;
			}
		}
		
		function loadByTpTreeType(obj){
			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			var url;
			if(obj.parentValue){
				 url = "SELECT TYPE_CODE,TYPE_NAME FROM TP_TREE_TYPE WHERE DOMAIN_TYPE= '"+ obj.sValue+"' AND PARENT_TYPE_CODE ='"+obj.parentValue+"' ORDER BY SORT_ID";
			}else{
				 url = "SELECT TYPE_CODE,TYPE_NAME FROM TP_TREE_TYPE WHERE DOMAIN_TYPE= '"+obj.sValue+"' ORDER BY SORT_ID";
			}
			xmlhttp.Open("POST", $this.commonStr + url,false);
			xmlhttp.send();
			if (isSuccess(xmlhttp)) {
				return xmlhttp.responseXML;
			}
		}

		function format(obj) {
			  switch (obj.pType) { // field����
				case $this.elementFactory.elementType.select:
					if (obj.listXml) {
						var rows = obj.listXml.selectNodes("/root/rowSet");
						for ( var i = 0; i < rows.length; i++) {
							var code = rows[i].firstChild.text;
							if (obj.sValue && obj.sValue == code) {
								return rows[i].lastChild.text;
							}
						}
					}
					return obj.sValue;
				default:
					return obj.sValue;
			 }
	    }
		var Factory = {
				dataSourceType:{
					codeList: '1', tpTreeType:'2', format:'8',custom:'9'
				},
				getData:function(obj){
					switch(obj.sType){
						case this.dataSourceType.codeList:  //codelist
							return new loadByCodeList(obj);
						case this.dataSourceType.format:  
							return format(obj);
					}
				}	
		}
		return Factory;
	})(this);
	
	this.initHead = function(){
		var tr = this.TABLE.insertRow();
		for (var fieldName in option.TABLE_DATA.TABLE_FIELDS) {
			var field = option.TABLE_DATA.TABLE_FIELDS[fieldName];
			var td = tr.insertCell();
			td.innerHTML = field.FIELD_TEXT;
			td.className = "th";
			if(field.WIDTH){td.width = field.WIDTH;}
			if (field.HIDDEN) {
				td.style.display = "none";
			}
			if (field.FLAG) { // ��ȡ��ʶ�ֶ�
				this.FLAG.NAME = fieldName;
			}
			if (field.PRIMARY_KEY) { // ��ȡ������ʶ
				this.PRIMARY_KEY = fieldName;
				this.SEQ_NAME = field.SEQ_NAME;
			}

			if (field.DATA_SOURCE) {
				field.LIST_XML = this.dataFactory.getData({
					sType : field.DATA_SOURCE.SOURCE_TYPE,
					sValue : field.DATA_SOURCE.DATA_VALUE
				});
			}

		}
		if (this.EDITABLE) {
			var td = tr.insertCell();
			td.width = "55";
			td.className = "th";
			td.appendChild(this.elementFactory.getElement({
				sType : this.elementFactory.elementType.addBtn
			}));
		}
	}
	

	this.initData = function(){
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.open("post", this.url + "tag=4&tableName="
				+ this.TABLE_NAME + "&fieldName=" + this.FLAG.NAME
				+ "&fieldValue=" + this.FLAG.VALUE, false);
		xmlhttp.send();
		if (isSuccess(xmlhttp)) {
			var dXML = new ActiveXObject("Microsoft.XMLDOM");
			dXML.load(xmlhttp.responseXML);
			var elements = dXML.selectNodes("/root/rowSet");

			for ( var i = 0; i < elements.length; i++) {
				var tr = this.TABLE.insertRow();
				var item = new Object();
				for ( var fieldName in option.TABLE_DATA.TABLE_FIELDS) {
					var field = option.TABLE_DATA.TABLE_FIELDS[fieldName];
					var td = tr.insertCell();
					if(field.WIDTH){td.width = field.WIDTH;}
					if (this.EDITABLE) {
						field.ELEMENT_TYPE = field.ELEMENT_TYPE ? field.ELEMENT_TYPE
								: this.elementFactory.elementType.hidden;
						item[fieldName] = this.elementFactory
								.getElement({
									sType : field.ELEMENT_TYPE,
									sValue : elements[i]
											.selectSingleNode(fieldName).text,
									sIndex : this.TABLE_DATA.length,
									listXml : field.LIST_XML,
									isEmpty : field.IS_EMPTY
								});
						td.appendChild(item[fieldName]);
					} else {
						td.innerHTML = item[fieldName] = this.dataFactory.getData({
							sType: this.dataFactory.dataSourceType.format,
							pType: field.ELEMENT_TYPE,
							listXml: field.LIST_XML,
							sValue: elements[i].selectSingleNode(fieldName).text
						});
					}
					if (field.HIDDEN) {
						td.style.display = "none";
					}
					
				}
				this.TABLE_DATA.push(item);
				if(option.callback){option.callback(item);}
				if (this.EDITABLE) {
					var td = tr.insertCell();
					td.width = "55";
					td.appendChild(this.elementFactory.getElement({
						sType : this.elementFactory.elementType.saveBtn,
						sIndex : this.TABLE_DATA.length - 1,
						hidden : true
					}));
					td.appendChild(this.elementFactory.getElement({
						sType : this.elementFactory.elementType.delBtn,
						sIndex : this.TABLE_DATA.length - 1
					}));
				}
			}
		}
	}
	
	this.addRow =(function($this){
		function add() {
			var tr = $this.TABLE.insertRow();
			var item = new Object();
			for ( var fieldName in option.TABLE_DATA.TABLE_FIELDS) {
				var field = option.TABLE_DATA.TABLE_FIELDS[fieldName];
				var td = tr.insertCell();
				field.ELEMENT_TYPE = field.ELEMENT_TYPE ? field.ELEMENT_TYPE
						: $this.elementFactory.elementType.hidden;
				
				item[fieldName] = $this.elementFactory.getElement({
					sType : field.ELEMENT_TYPE,
					sIndex : $this.TABLE_DATA.length,
					listXml : field.LIST_XML,
					isEmpty : field.IS_EMPTY
				});
				td.appendChild(item[fieldName]);

				if (field.HIDDEN) {
					td.style.display = "none";
				}
			}
			item[$this.FLAG.NAME].value = $this.FLAG.VALUE; 
			
			$this.TABLE_DATA.push(item);
			if(option.callback){option.callback(item);}
			if ($this.EDITABLE) {
				var td = tr.insertCell();
				td.width = "55";
				td.appendChild($this.elementFactory.getElement({
					sType : $this.elementFactory.elementType.saveBtn,
					sIndex : $this.TABLE_DATA.length - 1
				}));
				td.appendChild($this.elementFactory.getElement({
					sType : $this.elementFactory.elementType.delBtn,
					sIndex : $this.TABLE_DATA.length - 1
				}));
			}
		}
		return add;
	})(this);
	

	this.delRow = (function($this){
		function del() {
			var rowIndex = $this.TABLE_DATA.indexOfReal(this.sIndex) + 1;
			var primaryKey = $this.TABLE_DATA[this.sIndex][$this.PRIMARY_KEY];
			if (primaryKey.value) {
				var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				xmlhttp.open("post", $this.url + "tag=6&tableName="
						+ $this.TABLE_NAME + "&fieldName=" + $this.PRIMARY_KEY
						+ "&fieldValue=" + primaryKey.value, false);
				xmlhttp.send();
				if (isSuccess(xmlhttp)) {
					$this.TABLE.deleteRow(rowIndex);
					delete $this.TABLE_DATA[this.sIndex];
				}
			} else {
				$this.TABLE.deleteRow(rowIndex);
				delete $this.TABLE_DATA[this.sIndex];
			}
		}
		return del;
	})(this);
		

	this.saveRow = (function($this){
		function save(){
			var items = $this.TABLE_DATA[this.sIndex];
      		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
            var root = sendXml.createElement("root");
            root.setAttribute("tableName", $this.TABLE_NAME);
            root.setAttribute("primaryKey", $this.PRIMARY_KEY);
            root.setAttribute("keyValue", items[$this.PRIMARY_KEY].value);
            root.setAttribute("seqName", $this.SEQ_NAME);
            sendXml.appendChild(root);
            for(var fieldName in items){
            	var fieldSet = option.TABLE_DATA.TABLE_FIELDS[fieldName];
            	var field = items[fieldName];
            	if(typeof(fieldSet.IS_EMPTY)=='object'){
            		/*for(var i = 0  ;i < fieldSet.IS_EMPTY.length ; i++){
            			if(oFormContext.FLOW.TCH_NUM==fieldSet.IS_EMPTY[i].TCH_NUM && fieldSet.IS_EMPTY[i].IS_EMPTY=='F' && field.value == ''){
            				EMsg("�ֶ�:"+field.ELEMENT_TEXT+"������Ϊ��!");
            				field.focus();
                			return ;
            			}
            		}*/
            	}else{
            		if(fieldSet.IS_EMPTY=='F' && field.value == ''){
            			if(!$this.AUTOSAVE || this.name =='saveImg'){  //�Զ�����ʱ,�����зǿ��ֶ�δ��ʱ,������
            				EMsg("�ֶ�'"+fieldSet.FIELD_TEXT+"'������Ϊ��!");
                			field.focus();
            			}
            			return ;
            		}
            		
            		if(fieldSet.REGEX){ //������������֤
            			if(!new RegExp(fieldSet.REGEX).test(field.value)){  
            				EMsg("�ֶ�'"+fieldSet.FIELD_TEXT+"'�ĸ�ʽ����ȷ!");
            	            field.focus();
            	            return;
            	        }    
            		}
            	}

            	 var ele  = sendXml.createElement(fieldName);
                 ele.text = field.value ? field.value : field.innerHTML;
                 root.appendChild(ele);
            } 
            var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
            sendRequest.open("post", $this.url+'tag=5',false);
            sendRequest.send(sendXml);
            if(isSuccess(sendRequest)){
            	if(!items[$this.PRIMARY_KEY].value){
					items[$this.PRIMARY_KEY].value = sendRequest.responseXML
							.selectSingleNode("/root/ID").text;
            	}
            	$this.hideSaveBtn.call(this);
            }
		}
		return save;
	})(this);	
	
	
	this.showSaveBtn = (function($this){
		 function showBtn() {
			var rowIndex = $this.TABLE_DATA.indexOfReal(this.sIndex) + 1;
			var imgs = $this.TABLE.rows[rowIndex].getElementsByTagName("img");
			for ( var i = 0; i < imgs.length; i++) {
				if (imgs[i]._name == "saveImg") {
					imgs[i].style.display = "";
				}
			}
		}
		return showBtn;
	})(this);
	
	this.hideSaveBtn = (function($this){
		function hideBtn(){
			var rowIndex = $this.TABLE_DATA.indexOfReal(this.sIndex) + 1;
			var imgs = $this.TABLE.rows[rowIndex].getElementsByTagName("img");
			for ( var i = 0; i < imgs.length; i++) {
				if (imgs[i]._name == "saveImg") {
					imgs[i].style.display = "none";
				}
			}
		}
		return hideBtn;
	})(this);
	
	this.setFlagValue = function(value){
		this.FLAG.VALUE = value;
	}
	
	this.setEditable = function(editable){
		this.EDITABLE = editable;
	}
	
	this.init = function(obj){
		if(obj.flagValue){
			this.setFlagValue(obj.flagValue);
		}
		if(obj.editable){
			this.setEditable(obj.editable);
		}
		this.initHead();
		this.initData();
	}
	
	//��֤�޸������Ƿ��ѱ���
	this.validate = function(){
		var imgs = this.TABLE.getElementsByTagName("img");
		for ( var i = 0; i < imgs.length; i++) {
			if (imgs[i]._name == "saveImg" && imgs[i].style.display == "") {
				return false;
			}
		}
		return true;
	}
	
	//��ȡ������
	this.getTableData = function(){
		var arr = new Array();
		for(var i = 0 ;i < this.TABLE_DATA.length ; i++){
			if(this.TABLE_DATA[i]){
				arr.push(this.TABLE_DATA[i]);
			}
		}
		return arr;
	}
	
	//����ĳ�ֶ��Ƿ�Ϊ��(���ڵ���ĳЩ�������ֶβ�Ϊ��,����ĳЩ�������ֶο�Ϊ��)
	this.setFileldEmpty = function(fieldName,isEmpty){
		option.TABLE_DATA.TABLE_FIELDS[fieldName].IS_EMPTY = isEmpty;
	}
	
	
}

