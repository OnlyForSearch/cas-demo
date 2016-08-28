var busiMonitorResultJSDefaultLang = {
	dataLoding			: '正在获取数据,请稍候!',
	readJsonStreamError	: '读取JSON流错误!',
	otherError			: '后台程序出现异常![错误代码:'
};
// 获取语言资源
function getBusiMonitorResultJSLan(code)
{
	if (typeof(ItmLang) == 'undefined'
			|| typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('busiMonitorResultJSDefaultLang.' + code);
	}
	else
	{
		return eval('ItmLang.widgets.busiMonitorResultJS.' + code);
	}
}

ResultFactory = (function()
{
	var isNumRe = /^\d+$/;

	var GET_VALUE_CFG_URL = getRealPath("../../../servlet/busiMonitorCtrl.do?",
			"Result.js");

	var TYPE_CFG = {};

	var o = {
		reg					: function(name, o)
		{
			TYPE_CFG[name] = o;
		},
		copyXmlAtt			: function(o, x, atts)
		{
			if (o && x)
			{
				if (atts)
				{
					for (var i = 0, name; name = atts[i]; i++)
					{
						o[name] = x.getAttribute(name);
					}
				}
				else
				{
					for (var i = 0, att; att = x.attributes[i]; i++)
					{
						o[att.name] = att.value
					}
				}
			}
			return o;
		},
		copyObjAtt			: function(x, o, atts)
		{
			if (x && o)
			{
				if (atts)
				{
					for (var i = 0, name; name = atts[i]; i++)
					{
						x.setAttribute(name, o[name]);
					}
				}
				else
				{
					for (var name in o)
					{
						x.setAttribute(name, o[name]);
					}
				}
			}
			return o;
		},
		copy				: function(o, c, n, is, fn)
		{
			if (o && c)
			{
				fn = fn || new Function("s", "return s");
				if (n)
				{
					is = is !== false;
					var reg = new RegExp();
					reg.compile("^(?:" + n.join("|") + ")$", "i");
					for (var name in c)
					{
						if (reg.test(name) == is)
						{
							o[fn(name)] = c[name];
						}
					}
				}
				else
				{
					for (var name in c)
					{
						o[fn(name)] = c[name];
					}
				}
			}
			return o;
		},
		getCfgFromHtml		: function(result)
		{
			var htmlId = result + "#ResultConfig";
			return getXmlFromHtmlData(htmlId);
		},
		getValueCfgById		: function(cfgId)
		{
			var oReturn;
			var oConfigXml = this.getCfgFromHtml(cfgId);
			if (oConfigXml)
			{
				oReturn = oConfigXml.selectSingleNode("/root/value_cfg");
			}
			else
			{
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				var sendParams = ["method=getValueCfgById", "cfgId=" + cfgId];
				var sendUrl = getSendUrl(GET_VALUE_CFG_URL, sendParams);
				sendRequest.open("post", sendUrl, false);
				sendRequest.send();
				if (isSuccess(sendRequest))
				{
					oReturn = sendRequest.responseXML
							.selectSingleNode("/root/value_cfg");
				}
			}
			return oReturn;
		},
		getValueCfgByName	: function(param)
		{
			var oReturn;
			var oConfigXml = this.getCfgFromHtml(param);
			if (oConfigXml)
			{
				oReturn = oConfigXml.selectSingleNode("/root/value_cfg");
			}
			else
			{
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				var sendParams = ["method=getValueCfgByName", "param=" + param];
				var sendUrl = getSendUrl(GET_VALUE_CFG_URL, sendParams);
				sendRequest.open("post", sendUrl, false);
				sendRequest.send();
				if (isSuccess(sendRequest))
				{
					oReturn = sendRequest.responseXML
							.selectSingleNode("/root/value_cfg");
				}
			}
			return oReturn;
		},
		newResult			: function(oCfg, oArgs, oParam)
		{
			var oResult;
			if (Result.isResult(oCfg))
			{
				return oCfg;
			}
			if (typeof oCfg == "number")
			{
				oCfg = this.getValueCfgById(oCfg);
				oResult = this.newResult(oCfg, oArgs, oParam);
			}
			else if (typeof oCfg == "string")
			{
				oCfg = (isNumRe.test(oCfg)) ? this.getValueCfgById(oCfg) : this
						.getValueCfgByName(oCfg);
				oResult = this.newResult(oCfg, oArgs, oParam);
			}
			else if (oCfg)
			{
				oResult = new TYPE_CFG[oCfg.getAttribute("type")];
				this.copyXmlAtt(oResult, oCfg, ["key", "id"]);
				this.copy(oResult, oArgs, Result.keyFields, false);
				oResult.oParam = oParam;
				oResult.setCfgXml(oCfg);
			}
			return oResult;
		}
	}
	return o;
})();

var linkageComp = function(tarComp, paramValue)
{
	tarComp.setValue('');
	tarComp.el.dom.value = getBusiMonitorResultJSLan('dataLoding');
	tarComp.disable();
	var _xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	_xmlhttp.open("POST", '/servlet/commonservlet?tag=10&paramValue='
					+ paramValue + '&key=' + tarComp.linkSqlId, true);
	_xmlhttp.send();
	_xmlhttp.onreadystatechange = function()
	{
		if (_xmlhttp.readyState == 4)
		{
			tarComp.treeHtc.xmlDom = _xmlhttp.responseXML;
			tarComp.enable();
			tarComp.el.dom.value = '';
		}
	}
};

ResultCompUtils = {
	TagName			: "COMP",
	codeRe			: /^<#code:(.*?)>$/i,
	createComp		: function(node, defaultObject)
	{
		var compJson = Result.getText(node, this.TagName);
		return ResultCompUtils.createCompJson(compJson, defaultObject);
	},
	createCompJson	: function(compJson, defaultObject)
	{
		var comp = Result.loadJsonText(compJson);
		if (comp)
		{
			ResultFactory.copy(comp, defaultObject, ["value"], false);
			if (comp.config && comp.config.linkId)
			{
				if (!comp.config.listeners || !comp.config.listeners.select)
				{
					Ext.apply(comp.config, {
								listeners	: {
									'select'	: function()
									{
										var linkidArr = this.linkId.split(',');
										for (var i = 0; i < linkidArr.length; i++)
										{
											var tarComp = Ext
													.getCmp(linkidArr[i]);
											if (tarComp.linkSqlId)
											{
												var paramValue = this
														.getValue();
												linkageComp(tarComp, paramValue);
											}
										}
									}
								}
							});
				}
			}
			ResultFactory.copy(comp, comp.config);
			ResultFactory.copy(comp, comp.ds);
			comp.initCompValue = comp.value;
			if (comp.xtype == 'result_select' && comp.isMultiple == '0BT')
			{
				comp.xtype = 'multiple_result_select';
			}
			if (comp.valueCfgXml)
			{
				var cfgXml = new ActiveXObject("Microsoft.XMLDOM");
				cfgXml.async = false;
				cfgXml.loadXML(comp.valueCfgXml);
				comp.result = ResultFactory.newResult(cfgXml.documentElement);
				delete comp.valueCfgXml;
			}
		}
		return comp;
	},
	getExistCompKey	: function(compId)
	{
		return "param_item_" + compId;
	},
	setDefaultValue	: function(comp)
	{
		if (comp && this.codeRe.exec(comp.value))
		{
			var code = RegExp.$1;
			code = eval(code);
			if (Result.isFunction(code))
			{
				code = code();
			}
			comp.value = code;
		}
	}
};

Result = (function()
{
	var RESULT_CTRL_URL = getRealPath("../../../servlet/result.do?",
			"Result.js");

	var importJsRe = /,importJs:"(.*?)"/;

	var isDate = function(v)
	{
		return v && typeof v.getFullYear == 'function';
	}

	var formatDate = function(d)
	{
		return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	}

	var Class = function()
	{
		this.key;
		this.id;
		this.ref;
		this.async = true;
		this.method = "getResultXml";
		this.hasField = false;
		this.paramList = [];
		this.transformParam = {};
		this.getParamXpath = '';
		this.renderCfg = null;
		this.oParam = {};
		this.resultXml;
		this.onBeforeSend;
		this.onLoad;
		this.onBuildSendXml;
		this.allowReloadRenderCfg = false;
		this.sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		this.isSending = false;
		this.sendQueue = [];
	}

	Class.methods({
				isResult		: function(o)
				{
					return o && (typeof o == 'object')
							&& (o.ClassName === Class.prototype.ClassName);
				},
				FORCE_GET		: "FORCE",
				keyFields		: ["key", "id", "ref", "async"],
				isFunction		: function(fn)
				{
					return fn && typeof fn == "function";
				},
				getText			: function(oElement, path, defaultValue)
				{
					var o = oElement.selectSingleNode(path);
					return (o) ? o.text : defaultValue;
				},
				getNumber		: function(oElement, path, defaultValue)
				{
					v = this.getText(oElement, path, defaultValue);
					return parseInt(v, 10);
				},
				loadJsonText	: function(s)
				{
					var o;
					if (s)
					{
						s = s.replace(/\r\n/g, " ").replace(/\n/g, " ");
						o = eval("(" + s + ")");
					}
					return o;
				},
				readJson		: function(response)
				{
					if (response.status == 200)
					{
						var json = response.responseText;
						var o = this.loadJsonText(json);
						if (o)
						{
							var sv = o.success;
							if (sv === false || sv === 'false')
							{
								EMsg(o.error_msg);
							}
							else
							{
								return o;
							}
						}
						else
						{
							EMsg(getBusiMonitorResultJSLan('readJsonStreamError'));
						}
					}
					else
					{
						EMsg(getBusiMonitorResultJSLan('otherError')
								+ response.status + "]");
					}
				}
			}, true);

	Class.prototype = {
		ClassName			: "[Result]",
		setCfgXml			: function(oXml)
		{
			this.paramList = [];
			var params = oXml.selectNodes(this.getParamXpath);
			for (var i = 0, np; np = params[i]; i++)
			{
				var send = {}
				for (var prop in this.transformParam)
				{
					send[prop] = Class.getText(np, this.transformParam[prop],
							"");
				}
				var comp = ResultCompUtils.createComp(np, send);
				if (comp && !comp.value)
				{
					comp.value = this[comp.name]
							|| (this.oParam && this.oParam[comp.name]);
				}
				var op = {
					send	: send,
					comp	: comp
				};
				this.paramList[i] = op;
			}
		},
		// createComp : function(items)
		// {
		// var index = 0;
		// for (var i = 0, p; p = this.paramList[i]; i++)
		// {
		// var c = p.comp;
		// if (c)
		// {
		// c.item = items[index];
		// index++;
		// }
		// }
		// },
		// createToolbarComp : function(items)
		// {
		// var index = -2;
		// for (var i = 0, p; p = this.paramList[i]; i++)
		// {
		// var c = p.comp;
		// if (c)
		// {
		// index += 3;
		// c.item = items.itemAt(index);
		// }
		// }
		// },
		clearComp			: function()
		{
			for (var i = 0, p; p = this.paramList[i]; i++)
			{
				if (p.comp)
				{
					delete p.comp.item;
				}
			}
		},
		getParamValue		: function(js, p, name, existCompMap)
		{
			var v = "";
			if (js)
			{
				v = eval(js)
			}
			else if (p.comp)
			{
				if (p.comp.item)
				{
					v = p.comp.item.getValue();
				}
				else if (p.comp.param_comp_id && existCompMap
						&& typeof existCompMap == 'object')
				{
					var item = existCompMap[ResultCompUtils
							.getExistCompKey(p.comp.param_comp_id)];
					v = item.getValue();
				}
				else
				{
					v = p.comp.value
				}
				v = isDate(v) ? formatDate(v) : v;
				this[name] = v;
			}
			if (!v)
			{
				v = this[name];
				if (Class.isFunction(v))
				{
					v = v.call(this);
				}
			}
			return v;
		},
		loadRenderCfg		: function()
		{
			var sendRequest;
			var renderConfig = getHtmlData(this.key + "#ResultRender")
			if (!renderConfig)
			{
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				sendRequest.open("post", RESULT_CTRL_URL, false);
				sendRequest.setRequestHeader("Content-Type",
						"application/x-www-form-urlencoded");
				var sendParams = ["method=getRenderCfg", "ref=" + this.ref,
						"key=" + this.key];
				sendRequest.send(sendParams.join('&'));
				renderConfig = sendRequest.responseText;
			}
			if (importJsRe.exec(renderConfig))
			{
				var js = RegExp.$1;
				$import(js);
			}
			this.renderCfg = (sendRequest)
					? Class.readJson(sendRequest)
					: Result.loadJsonText(renderConfig);
			if (this.renderCfg && typeof FuncMenu != "undefined")
			{
				FuncMenu.loadCss(this.renderCfg.show.importCss);
			}
			if (this.renderCfg && this.allowReloadRenderCfg !== true)
			{
				this.loadRenderCfg = function()
				{
				};
			}
			for (var i = 0, op; op = this.paramList[i]; i++)
			{
				ResultCompUtils.setDefaultValue(op.comp);
			}
		},
		buildSendXml		: function(params, options)
		{
			params = params || {};
			options = options || {};
			ResultFactory.copy(this, this.oParam, Result.keyFields, false);
			var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendXml.createElement("root");
			var result = sendXml.createElement("result");
			var np;
			for (var i = 0, op; op = this.paramList[i]; i++)
			{
				np = sendXml.createElement("param");
				var send = op.send;
				var name = send.name;
				delete params[name];
				for (var c in send)
				{
					if (c == "value")
					{
						np.text = this.getParamValue(send[c], op, name,
								options.comp);
					}
					else
					{
						np.setAttribute(c, send[c]);
					}
				}
				result.appendChild(np);
			}
			for (var c in params)
			{
				var name = c;
				var type = "STRING";
				var isMultiple = "0BF";
				var param = params[c];
				if (typeof param == "object")
				{
					type = param.type;
					isMultiple = param.isMultiple;
					param = param.value;
				}
				np = sendXml.createElement("param");
				np.setAttribute("name", name);
				np.setAttribute("type", type);
				np.setAttribute("isMultiple", isMultiple);
				np.text = param;
				result.appendChild(np);
			}

			ResultFactory.copyObjAtt(result, this, ["id", "key", "ref",
							"hasField"])
				
			result.setAttribute('filedsearch', this.filedsearch || "");
			//result.setAttribute('title', this.title || "");
			
			if(this.renderCfg && this.renderCfg.show){
				result.setAttribute('excelTitle', this.renderCfg.show.excelTitle || "");
			}
			
			
			root.appendChild(result);
			sendXml.appendChild(root);
			if (Class.isFunction(this.onBuildSendXml))
			{
				this.onBuildSendXml(sendXml);
			}
			// alert(sendXml.xml);
			return sendXml;
		},
		buildParamsObj		: function(options)
		{
			options = options || {};
			var o = {};
			for (var i = 0, op; op = this.paramList[i]; i++)
			{
				var send = op.send;
				for (var c in send)
				{
					if (c == "value")
					{
						o[send.name] = this.getParamValue(send[c], op,
								send.name, options.comp);
					}
				}
			}
			return o;
		},
		send				: function(getType, params, options)
		{
			if (!this.isSending)
			{
				var oResult = this;
				this.isSending = true;
				if (Class.isFunction(this.onBeforeSend))
				{
					this.onBeforeSend();
				}
				var sendParams = ["method=" + this.method, "getType=" + getType];
				var sendUrl = getSendUrl(RESULT_CTRL_URL, sendParams);
				this.sendRequest.open("post", sendUrl, this.async);
				this.sendRequest.onreadystatechange = function()
				{
					oResult.readyStateChange();
				}
				this.sendRequest.send(this.buildSendXml(params, options));
			}
			else
			{
				this.sendQueue.push(arguments);
			}
		},
		readyStateChange	: function()
		{
			if (this.sendRequest.readyState == 4)
			{
				// 都执行好就设置为空，方便onreadystatechange的方法回收
				this.sendRequest.onreadystatechange = new Function();
				if (isSuccess(this.sendRequest))
				{
					this.resultXml = new ActiveXObject("Microsoft.XMLDOM");
					this.resultXml.async = false;
					this.resultXml.load(this.sendRequest.responseXML);
					if (Class.isFunction(this.onLoad))
					{
						this.onLoad(this.resultXml);
					}
				}
				this.isSending = false;
				var sendArg = this.sendQueue.shift();
				if (sendArg)
				{
					Class.prototype.send.apply(this, sendArg);
				}
			}
		}
	}

	return Class;
})();

SQLResult = (function()
{
	function Class()
	{
		this.Super();
		this.ref = "sqlResult";
		this.transformParam = {
			name		: "PARAM_NAME",
			type		: "DATA_TYPE",
			isMultiple	: "IS_MULTIPLE",
			value		: "PARAM_VALUE"
		};
		this.getParamXpath = 'param[PARAM_TYPE="IN"]';
	}
	Class.extend(Result);
	ResultFactory.reg("SQL", Class);
	return Class;
})();