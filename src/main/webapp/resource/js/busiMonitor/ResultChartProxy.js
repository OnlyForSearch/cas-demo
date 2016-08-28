Ext.data.ResultChartProxy = function(config)
{
	Ext.data.ResultChartProxy.superclass.constructor.call(this);
	if (config.chart)
	{
		this.chart = config.chart;
	}
	else
	{
		this.chart = new Chart(config);
	}
}

Ext.extend(Ext.data.ResultChartProxy, Ext.data.DataProxy, {
			load		: function(params, reader, callback, scope, arg)
			{
				if (this.fireEvent("beforeload", this, params) !== false)
				{
					this.chart.onLoad = this.loadResult.createDelegate(this, [
									reader, callback, scope, arg], true);
					this.chart.send(arg.getType, params, arg);
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
					o = reader.readRecords(oXml);
				}
				callback.call(scope, o, arg, o.success);
			}
		});