Ext.LoadMask.prototype.msg = "数据载入中...";

Ext.data.XmlHttpProxy = function(config)
{
	Ext.data.XmlHttpProxy.superclass.constructor.call(this);
	Ext.apply(this, config);
}

Ext.extend(Ext.data.XmlHttpProxy, Ext.data.DataProxy, {
			load	: function(params, reader, callback, scope, arg)
			{
				if (this.fireEvent("beforeload", this, params) !== false)
				{
					params = params || {};
					var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequest.open("post", this.url, false);
					sendRequest.setRequestHeader("Content-Type",
							"application/x-www-form-urlencoded");
					sendRequest.send(Ext.urlEncode(params));
					if (isSuccess(sendRequest))
					{
						o = reader.readRecords(sendRequest.responseXML);
						callback.call(scope, o, arg, o.success);
					}
				}
				else
				{
					callback.call(scope || this, null, arg, false);
				}
			}
		});