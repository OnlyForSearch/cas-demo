//定义默认语言资源
var xmlTreeNodeJSDefaultLang = {
	loadErrorMsg : '载入错误'
};
//获取语言资源
function getItmLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('xmlTreeNodeJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.xmlTreeNodeJS.' + code);
	}
}

Ext.tree.XmlTreeNode = function(config)
{
	this.baseAttrs = config.baseAttrs;
	if (config.dataUrl)
	{
		var request = new ActiveXObject("Microsoft.XMLHTTP");
		request.open("post", config.dataUrl, false)
		request.send();
		if (isSuccess(request))
		{
			this.loaded = false;
			var xmlDom = request.responseXML;
			var n = xmlDom.selectSingleNode(config.rootPath||'/root/Menu/MenuItem');
			config = this.createAttrFromXml(n);
		}
		else
		{
			config = {
				text	: getItmLan('loadErrorMsg'),
				leaf	: true
			};
		}
	}
	Ext.tree.XmlTreeNode.superclass.constructor.call(this, config);
}

Ext.extend(Ext.tree.XmlTreeNode, Ext.tree.TreeNode, {
			createAttrFromXml	: function(oXml)
			{
				var attr = ResultFactory.copyXmlAtt({}, oXml);
				Ext.apply(attr, {
							text		: attr.label,
							xmlDom		: oXml,
							leaf		: oXml.selectNodes('MenuItem').length == 0,
							baseAttrs	: this.baseAttrs
						}, this.baseAttrs);
				return attr;
			},
			expand				: function(deep, anim, callback)
			{
				if (this.attributes.xmlDom)
				{
					var children = this.attributes.xmlDom
							.selectNodes('MenuItem');
					for (var i = 0, cn; cn = children[i]; i++)
					{
						this.appendChild(new Ext.tree.XmlTreeNode(this
								.createAttrFromXml(cn)));
					}
				}
				this.expand = Ext.tree.XmlTreeNode.superclass.expand
						.createDelegate(this);
				this.expand.apply(this, arguments);
			},
			hasChildNodes		: function()
			{
				return !this.isLeaf();
			}
		});