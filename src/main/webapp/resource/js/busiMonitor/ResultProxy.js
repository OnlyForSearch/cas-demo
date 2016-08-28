var busiMonitorResultProxyJSDefaultLang = {
	dataLoding : '数据载入中...'
};
//获取语言资源
function getBusiMonitorResultProxyJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('busiMonitorResultProxyJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.busiMonitorResultProxyJS.' + code);
	}
}

Ext.LoadMask.prototype.msg = getBusiMonitorResultProxyJSLan('dataLoding');

Ext.data.ResultProxy = function(config)
{
	Ext.data.ResultProxy.superclass.constructor.call(this);
	this.result = ResultFactory.newResult(config.result, config.resultArgs);
	this.isPage = config.isPage;
	this.result.method = (this.isPage)
			? "getPageResultXml"
			: "getEncodeResultXml";
}

Ext.extend(Ext.data.ResultProxy, Ext.data.DataProxy, {
			load		: function(params, reader, callback, scope, arg)
			{
				if (this.fireEvent("beforeload", this, params) !== false)
				{
					this.result.onLoad = this.loadResult.createDelegate(this, [
									reader, callback, scope, arg], true);
					this.result.send(arg.getType, params, arg);
				}
				else
				{
					callback.call(scope || this, null, arg, false);
				}
			},
			loadResult	: function(oXml, reader, callback, scope, arg)
			{
				var o;
				if (reader)
				{
					if (this.isPage)
					{
						reader.meta.totalRecords = "totalCount";
					}
					o = reader.readRecords(oXml);
				}
				callback.call(scope, o, arg, o.success);
			}
		});