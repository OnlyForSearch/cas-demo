var Hint = (function()
{
	var ACTION_URL = getRealPath("../../../servlet/busiMonitorCtrl.do?",
			"Hint.js");

	var CACHE_TIME = 60;

	function obj(hintId)
	{
		this.hintId = hintId;
		this.oResult;
		this.oNode;
		this.initHint(hintId);
	}

	obj.getElementText = function(oElement, name)
	{
		var oChildElement = oElement.selectSingleNode(name);
		return (oChildElement) ? oChildElement.text : "";
	}

	obj.prototype.initHint = function()
	{
		if (this.hintId)
		{
			var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			var sendParams = ["method=getHint", "hintId=" + this.hintId];
			var sendUrl = getSendUrl(ACTION_URL, sendParams);
			sendRequest.open("post", sendUrl, false);
			sendRequest.send();
			if (isSuccess(sendRequest))
			{
				this.loadCfgXml(sendRequest.responseXML);
			}
		}
	}

	obj.prototype.loadCfgXml = function(oXml)
	{
		var oHintXml = oXml.selectSingleNode("/root/hint");
		if (oHintXml)
		{
			this.oResult = ResultFactory.newResult(oHintXml
					.selectSingleNode("value_cfg"));
			this.oNode = window.document.createElement("IE:hint");
			this.oNode.cacheTime = CACHE_TIME;
			var iWidth = obj.getElementText(oHintXml, "width");
			var iHeight = obj.getElementText(oHintXml, "height");
			if (iWidth)
			{
				this.oNode.width = iWidth;
			}
			if (iHeight)
			{
				this.oNode.height = iHeight
			}
			var oType = eval(obj.getElementText(oHintXml, "Hint_Type"));
			if (typeof oType == "object")
			{
				if (typeof oType.init == "function")
				{
					oType.init(this);
				}
				if (typeof oType.show == "function")
				{
					this.oNode.onCreate = (function(oHint)
					{
						return function()
						{
							oType.show(oHint);
						}
					})(this);
				}
			}
			window.document.body.appendChild(this.oNode);
		}
	}

	obj.prototype.show = function()
	{
		if (this.oNode)
		{
			this.oNode.show();
		}
	}

	obj.prototype.hide = function()
	{
		if (this.oNode)
		{
			this.oNode.hide();
		}
	}

	return obj;
})();

Hint.ListSingleCol = {
	show	: function(oHint)
	{
		var oResult = oHint.oResult;
		oResult.oHintNode = oHint.oNode;
		oResult.onLoad = function(oXml)
		{
			var sHtml = '<div style="overflow:auto;width:100%;height:100%;">';
			var rowList = oXml.selectNodes("/root/rowSet");
			for(var i=0,row;row=rowList[i];i++)
			{
				sHtml += '<div style="height:17;padding:3 5 0 5;white-space:nowrap;">'+Hint.getElementText(row, "node()[0]")+'</div>';
			}
			sHtml += '</div>'
			this.oHintNode.loadHtml(sHtml);
		}
		oResult.send();
	}
}

Hint.ListMultiCol = {
	show	: function(oHint)
	{
		var oResult = oHint.oResult;
		oResult.oHintNode = oHint.oNode;
		oResult.onLoad = function(oXml)
		{
			var sHtml = '<div>';
			var rowList = oXml.selectNodes("/root/rowSet");
			var name;
			var value;
			var alarm;
			var alarmText;
			var alarmFlag;
			var sAlarmStyle
			for (var i = 0, row; row = rowList[i]; i++)
			{
				name = Hint.getElementText(row, "node()[0]");
				value = Hint.getElementText(row, "node()[1]");
				alarm = Hint.getElementText(row, "node()[2]");
				alarmText = Hint.getElementText(row, "node()[3]");
				alarmFlag = Hint.getElementText(row, "node()[4]");
				sAlarmStyle = "height:100%;padding:3 5 3 25;white-space:nowrap;"
				if (alarmFlag == "1")
				{
					sAlarmStyle += "color:red;"
				}
				sHtml += '<div style="width:100%;overflow:hidden;white-space:nowrap;">'
						+ '<span style="height:100%;padding:3 0 3 5">'
						+ name
						+ ':</span>'
						+ '<span style="height:100%;padding:3 0 3 5">'
						+ value
						+ '</span>'
						+ '<span style="'
						+ sAlarmStyle
						+ '">'
						+ '<span style="height:100%">'
						+ alarm
						+ '</span>'
						+ '<span style="height:100%;padding-left:5">'
						+ alarmText + '</span>' + '</span>' + '</div>'
			}
			sHtml += '</div>'
			this.oHintNode.loadHtml(sHtml);
		};
		oResult.send();
	}
}

Hint.TreeGridHint = {
	treeGridId	: "TreeGrid",
	treeGridUrl	: getRealPath("../../htc/treeGrid.htc", "Hint.js"),
	init		: function(oHint)
	{
		var oHintNode = oHint.oNode;
		var oResult = oHint.oResult;
		var iWidth = oHintNode.width - 4;
		var iHeight = oHintNode.height - 4;
		oHintNode.innerHTML = '<IE:treeGrid id="'
				+ this.treeGridId
				+ '" style="width:'
				+ iWidth
				+ 'px;height:'
				+ iHeight
				+ 'px" onExpandNode="parent.Hint.TreeGridHint.expandNode(event)"></IE:treeGrid>';
		oHintNode.addNamespace("IE", this.treeGridUrl);
		oResult.onLoad = function(oXml)
		{
			this.oGrid.hideDelay();
			this.oGrid.initXML = oXml;
		};
	},
	show		: function(oHint)
	{
		var oHintNode = oHint.oNode;
		var oResult = oHint.oResult;
		oResult.oGrid = oHintNode.getElementById(this.treeGridId);
		oResult.oGrid.showDelay();
		oResult.param = 10;
		oResult.send();
	},
	expandNode	: function(event)
	{
		var oRow = event.srcRow;
		var oResult = oRow.oResult;
		if (!oResult)
		{
			oResult = ResultFactory.newResult(3);
			oResult.onLoad = function(oXml)
			{
				this.oGrid.loadChild(this.oRow, oXml);
			}
			oRow.oResult = oResult;
		}
		oResult.param = 5;
		oResult.oGrid = event.srcElement;
		oResult.oRow = oRow;
		oResult.send();
	}
};