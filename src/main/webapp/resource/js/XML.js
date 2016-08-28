function setItemValueFromXML(oItem,oIland,attName)
{
	oItem.value = getIlandNodeVal(oIland,attName);
}

function setIlandNodeFromItem(oItem,oIland,attName)
{
	setIlandNodeVal(oIland,attName,oItem.value);
}

function getIlandNodeVal(oIland,attName)
{
	return getNodeValue(oIland.XMLDocument,'/Msg/'+attName);
}

function getNodeValue(doc,xpath)
{
	return doc.selectSingleNode(xpath).text
}

function setIlandNodeVal(oIland,attName,value)
{
	setNodeValue(oIland.XMLDocument,'/Msg/'+attName,value);
}

function iLandLoadXML(oIland,oXMLRequest)
{
	oIland.XMLDocument.loadXML(oXMLRequest.responseXML.selectSingleNode("/root/Msg").xml);
}

function setNodeValue(doc,xpath,value)
{
	doc.selectSingleNode(xpath).text = value;
}

function createNode(node,tagName)
{
	var xmlDOM = node.ownerDocument;
	var oItem = xmlDOM.createElement(tagName);
	node.appendChild(oItem);
	return oItem;
}

function removeNode(node,tagName)
{
	var oItem = node.selectSingleNode(tagName);
	if(oItem != null)
	{
		node.removeChild(oItem);
	}
}

function ctrlXMLNode(findNode,addNode,tagName,val)
{
	var attributeName = "id"
	var xpath = tagName+'[@'+attributeName+'='+val+']';
	var oItem = findNode.selectSingleNode(xpath);
	if(oItem == null)
	{
		oItem = createNode(addNode,tagName);
		oItem.setAttribute(attributeName,val);
	}
	else
	{
		findNode.removeChild(oItem);
	}
}