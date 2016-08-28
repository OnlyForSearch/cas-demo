Ext.data.SimpleResultReader = Ext.extend(Ext.data.DataReader, {
			readRecords : function(oXml)
			{
				var recordType = this.recordType;
				var fields = recordType.prototype.fields;
				var rowList = oXml.selectNodes("/root/rowSet");
				var records = [];
				for (var i = 0, iLen = rowList.length; i < iLen; i++)
				{
					var rowNode = rowList.item(i).childNodes;
					var values = {};
					for (var j = 0, jLen = fields.length; j < jLen; j++)
					{
						var field = fields.items[j];
						values[field.name] = rowNode.item(j).text;
					}
					var record = new recordType(values);
					records[i] = record;
				}

				return {
					success : true,
					records : records,
					totalRecords : records.length
				};
			}
		})

Ext.data.ResultStore = Ext.extend(Ext.data.Store, {
	mode : 'local',
	constructor : function(config)
	{
		var fields = config.fields
		Ext.data.ArrayStore.superclass.constructor.call(this, Ext.apply(config,
						{
							reader : new Ext.data.SimpleResultReader({}, fields)
						}));
		if (this.mode == 'local' && this.result)
		{
			this.result = ResultFactory.newResult(this.result);
			this.result.async = false;
			var self = this;
			this.result.onLoad = function(oXml)
			{
				self.loadData(oXml);
			}
			this.result.send(Result.FORCE_GET);
		}
	}
});