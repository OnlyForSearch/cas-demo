function WinElement()
{
	this.oResult;
	this.oState;
	this.onLoadValue;
	this.onLoadState;
	this.oParam = {};
}

WinElement.GET_VALUE = 1;
WinElement.GET_STATE = 2;

WinElement.prototype.setParam = function(name, value)
{
	this.oParam[name] = value;
}

WinElement.prototype.setCfgXml = function(oXml)
{
	var cfgXml = new ActiveXObject("Microsoft.XMLDOM");
	cfgXml.async = false;
	cfgXml.loadXML(oXml);
	var oResultNode = cfgXml.selectSingleNode('/element/value_cfg');
	if (oResultNode && this.onLoadValue)
	{
		// 配置取值方式
		var args = {
			onLoad	: this.onLoadValue
		};
		this.oResult = ResultFactory.newResult(oResultNode, args, this.oParam);
	}
	var oStateNode = cfgXml.selectSingleNode('/element/state');
	if (oStateNode && this.onLoadState)
	{
		// 配置取状态
		this.oState = new State();
		this.oState.onLoad = this.onLoadState;
		this.oState.oParam = this.oParam;
		this.oState.setCfgXml(oStateNode);
	}
}

WinElement.prototype.send = function(getType, action)
{
	if (this.oResult && (!action || action == WinElement.GET_VALUE))
	{
		this.oResult.send(getType);
	}
	if (this.oState && (!action || action == WinElement.GET_STATE))
	{
		this.oState.send(getType);
	}
}

function State()
{
	this.cfgXml;
	this.stateCfgRoot;
	this.oResult;
	this.onLoad;
	this.oParam;
}

State.prototype.setCfgXml = function(oXml)
{
	this.cfgXml = oXml;
	var onBuildSendXml = (function(oState)
	{
		return function(sendXml)
		{
			var root = sendXml.documentElement;
			var cfgRoot = oState.stateCfgRoot.cloneNode(true);
			var paramList = cfgRoot.selectNodes('cfg/result/param');
			for (var i = 0, paramNode; paramNode = paramList[i]; i++)
			{
				paramNode.text = eval(paramNode.text);
			}
			root.appendChild(cfgRoot);
		}
	})(this);
	var args = {
		method			: "getStateXml",
		onLoad			: this.onLoad,
		onBuildSendXml	: onBuildSendXml
	};
	this.oResult = ResultFactory.newResult(this.cfgXml
			.selectSingleNode('value_cfg'), args, this.oParam);
	this.buildStateCfg();
}

State.prototype.buildStateCfg = function()
{
	var dom = new ActiveXObject("Microsoft.XMLDOM");
	this.stateCfgRoot = dom.createElement("cfgs");
	var cfgList = this.cfgXml.selectNodes('cfgs/cfg');
	for (var i = 0, cfgNode; cfgNode = cfgList[i]; i++)
	{
		var newCfgNode = dom.createElement("cfg");
		newCfgNode.setAttribute("value", cfgNode.getAttribute("value"));
		var oResult = ResultFactory.newResult(cfgNode
				.selectSingleNode('value_cfg'));
		if (oResult)
		{
			newCfgNode.appendChild(oResult.dom);
		}
		newCfgNode.appendChild(cfgNode.selectSingleNode('js_func'));
		this.stateCfgRoot.appendChild(newCfgNode);
	}
}

State.prototype.send = function(getType)
{
	this.oResult.send(getType);
}