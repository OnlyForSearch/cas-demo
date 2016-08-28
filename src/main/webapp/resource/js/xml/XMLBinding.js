function XMLBinding()
{
	this.root;
}

XMLBinding.prototype.setRoot = function(oElement)
{
	this.root = oElement;
}

XMLBinding.prototype.getRoot = function()
{
	return this.root;
}

XMLBinding.prototype.toElement = function ()
{
	var oElement,oNode;
	for(var i=0;i<this.root.childNodes.length; i++)
	{
		oNode = this.root.childNodes[i];
		oElement = document.getElementById(oNode.tagName);
		if(oElement)
		{
			this.setElementVal(oElement,oNode)
		}
	}
}

XMLBinding.prototype.setElementVal = function(oElement,oNode)
{
	var tagName = oElement.tagName;
	if(tagName == "SELECT")
	{
		var isFind = false;
		var oOption;
		for(var i=0;i<oElement.options.length&&!isFind;i++)
		{
			oOption = oElement.options[i];
			if(oOption.value == oNode.text)
			{
				oOption.selected = true;
				isFind = true;
			}
		}
	}
	else
	{
		oElement.value = oNode.text;
	}
}

XMLBinding.prototype.fromElement = function ()
{
	var oElement,oNode;
	for(var i=0;i<this.root.childNodes.length; i++)
	{
		oNode = this.root.childNodes[i];
		oElement = document.getElementById(oNode.tagName);
		if(oElement)
		{
			this.setNodeVal(oElement,oNode);
		}
	}
}

XMLBinding.prototype.setNodeVal = function(oElement,oNode)
{
	var tagName = oElement.tagName;
	if(tagName == "SELECT")
	{
		var oOption = oElement.options[oElement.selectedIndex];
		oNode.text = oOption.value;
	}
	else
	{
		oNode.text = oElement.value;
	}
}
