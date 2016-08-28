Ext.apply(Ext.form.VTypes, function()
		{
			var regNum = /^-?\d*$/;
			var regFloat = /^(-?\d+)(\.\d+)?$/;
			return {
				"num"		: function(v)
				{
					return regNum.test(v);
				},
				"numText"	: "���ֶ�ֻ֧������",
				"float"		: function(v)
				{
					return regFloat.test(v);
				},
				"floatText"	: "���ֶ�ֻ֧�ָ�����",
				
				"decimal"	: function(v,field)
				{
					var decimal = field.decimal;
					regDecimal = new RegExp("^[0-9]+(.[0-9]{1,"+decimal+"})?$");
					this.decimalText = "���ֶ�ֻ֧�ֲ�����"+decimal+"λС���ĸ�����";
					return regDecimal.test(v);
				}
			}
		}())