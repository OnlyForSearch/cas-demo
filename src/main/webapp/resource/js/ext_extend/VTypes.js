Ext.apply(Ext.form.VTypes, function()
		{
			var regNum = /^-?\d*$/;
			var regFloat = /^(-?\d+)(\.\d+)?$/;
			return {
				"num"		: function(v)
				{
					return regNum.test(v);
				},
				"numText"	: "该字段只支持数字",
				"float"		: function(v)
				{
					return regFloat.test(v);
				},
				"floatText"	: "该字段只支持浮点型",
				
				"decimal"	: function(v,field)
				{
					var decimal = field.decimal;
					regDecimal = new RegExp("^[0-9]+(.[0-9]{1,"+decimal+"})?$");
					this.decimalText = "该字段只支持不超过"+decimal+"位小数的浮点型";
					return regDecimal.test(v);
				}
			}
		}())