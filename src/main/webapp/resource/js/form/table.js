//解决attachEvent方法中this的指向
var Event = {};
Event.addEvent = function(target,eventType,handle){
    if(document.addEventListener){
        target.addEventListener(eventType,handle,false);
    }else if(document.attachEvent){
        target.attachEvent('on'+eventType,function(){
            //这里改变this的指向
            handle.apply(target,arguments);
        });
    }else{
        target['on'+eventType] = handle;
    }
};


//判断索引所在数组的真实位置(使用delete删除)
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
 * 字段类型:
  elementType:{
	  text:'1',textarea:'2',select:'3',hidden:'5',span:'16',
	  addBtn:'22',saveBtn:'23',delBtn:'24'
  }
  
  数据源类型:
  dataSourceType:{
		codeList: '1', tpTreeType:'2', format:'8',custom:'9'
   }
 * 
 * option = {
		RENDER_TO : '', //可以是一个id,也可以是一个element对象(必须项)
		callback:functon(field){},  //回调函数,会传入一个field变量,可在里面灵活设置各字段的行为
		AUTOSAVE:false, //是否自动保存,默认false
		TABLE_DATA : {
			TABLE_NAME : "",  //存储数据的主表名(必须项)
			TABLE_FIELDS : {
				ACCESSOREIS_ID : {  //必须有主键,名称自定义(必须项)
					PRIMARY_KEY : true,   //主键标识(必须项)
					HIDDEN : true,
					SEQ_NAME : ""   //该主键必须有一个SEQ(必须项)
				},
				GOODS : {
					FIELD_TEXT : "",  //显示的列名
					WIDTH : "20%",    
					IS_EMPTY : "F",   //该字段是否必填
					ELEMENT_TYPE : '3',   //字段类型(默认是hidden),详见elementType对象,可自己扩展
					DATA_SOURCE : {  //在下拉项等时可以配置数据源
						SOURCE_TYPE : '1',  //数据源类型,详见dataSourceType对象,可自己扩展
						DATA_VALUE : "",
						PARENT_DATA: "",
						FOREIGN:{
        					KEY:'REASON',
        					RELATION:'PRIMARY'/'FRIEND'
        				}   
					}
				},
				REASON : {
					FIELD_TEXT : "理由",
					IS_EMPTY : "F",
					ELEMENT_TYPE : '1',
					REGEX:/^[1-9]+$/     //正则校验,不加引号
				},
				FLOW_ID : {  //必须有一个flag标识,字段名自定义(必须项)
					FLAG : true,  //标识该字段是flag标识字段
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
	
    
	
	//获取字段工厂
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
		  
		  
		  //添加按钮
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
		  
		   //保存按钮
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
		   
		  //删除按钮
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
	
	//数据源工厂
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
			  switch (obj.pType) { // field类型
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
			if (field.FLAG) { // 获取标识字段
				this.FLAG.NAME = fieldName;
			}
			if (field.PRIMARY_KEY) { // 获取主键标识
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
            				EMsg("字段:"+field.ELEMENT_TEXT+"不允许为空!");
            				field.focus();
                			return ;
            			}
            		}*/
            	}else{
            		if(fieldSet.IS_EMPTY=='F' && field.value == ''){
            			if(!$this.AUTOSAVE || this.name =='saveImg'){  //自动保存时,对于有非空字段未填时,不提醒
            				EMsg("字段'"+fieldSet.FIELD_TEXT+"'不允许为空!");
                			field.focus();
            			}
            			return ;
            		}
            		
            		if(fieldSet.REGEX){ //有配置正则验证
            			if(!new RegExp(fieldSet.REGEX).test(field.value)){  
            				EMsg("字段'"+fieldSet.FIELD_TEXT+"'的格式不正确!");
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
	
	//验证修改数据是否都已保存
	this.validate = function(){
		var imgs = this.TABLE.getElementsByTagName("img");
		for ( var i = 0; i < imgs.length; i++) {
			if (imgs[i]._name == "saveImg" && imgs[i].style.display == "") {
				return false;
			}
		}
		return true;
	}
	
	//获取表数据
	this.getTableData = function(){
		var arr = new Array();
		for(var i = 0 ;i < this.TABLE_DATA.length ; i++){
			if(this.TABLE_DATA[i]){
				arr.push(this.TABLE_DATA[i]);
			}
		}
		return arr;
	}
	
	//重设某字段是否为空(用于当在某些条件下字段不为空,而在某些条件下字段可为空)
	this.setFileldEmpty = function(fieldName,isEmpty){
		option.TABLE_DATA.TABLE_FIELDS[fieldName].IS_EMPTY = isEmpty;
	}
	
	
}

