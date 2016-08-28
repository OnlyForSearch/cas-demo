function listView(oParams)
{
   var aItems=[];
   var oContainer=oParams.target;
   var iSelectedIndex=null;
   var defaultImg="/resource/image/ico/folder.gif";
   this.appendItem=function(oChild)
   {
      var iChildLen=aItems.length;
      var imgSrc=oChild.img||defaultImg;
      var sHTML="<div style='margin:3px;cursor:default;white-space:nowrap'>"+
                  "<img src='"+imgSrc+"' align='absmiddle'/>"+
                  "&nbsp;<span style='margin:3 2 3 2' onselectstart='return false'>"+oChild.text+"</span>"+
                "</div>";
      oContainer.insertAdjacentHTML("beforeEnd",sHTML);
      var oItemHTML=oContainer.getElementsByTagName("div")[iChildLen];
      var oItem=new listView.item(iChildLen,this,{oHtml:oItemHTML,event:oChild.event,attr:oChild.attr});      
      aItems.push(oItem);      
      return oItem;
   };
   
   this.getItem=function(iIndex)
   {
       return aItems[iIndex];
   };
   
   this.selectItem=function(iIndex)
   {
      if(iSelectedIndex!=undefined)
      {
          aItems[iSelectedIndex].unselect();
      }
      aItems[iIndex].select();
      iSelectedIndex=iIndex;
   };
   
   this.getSelectedItem=function()
   {
       if(iSelectedIndex==null) return null;
       return aItems[iSelectedIndex];
   };
   
   
   this.removeItem=function(iIndex)
   {
       var oDiv=oContainer.getElementsByTagName("div")[iIndex];
       oContainer.removeChild(oDiv);
       aItems.splice(iIndex,1);
       resetItemsIndex(iIndex);
   };
   
   this.removeSelectItem=function()
   {
       if(iSelectedIndex!=null)
       {
          this.removeItem(iSelectedIndex);
          iSelectedIndex=null;
       }
   };
   
   this.swapNode=function(iFrom,iTo)
   {
       var oFromDiv=oContainer.getElementsByTagName("div")[iFrom];
       var oToDiv=oContainer.getElementsByTagName("div")[iTo];
       var selectedIndex;
       if(oFromDiv && oToDiv)
       {
           oFromDiv.swapNode(oToDiv);
           var oFormItem=aItems.splice(iFrom,1,aItems[iTo])[0];
           aItems.splice(iTo,1,oFormItem);
           if(iSelectedIndex==iFrom)
           {
               selectedIndex=iTo;
           }
           if(iSelectedIndex==iTo)
           {
               selectedIndex=iFrom;
           }
           iSelectedIndex=selectedIndex;
           resetItemsIndex(iFrom,iFrom);
           resetItemsIndex(iTo,iTo);
       }
   };
   
   this.getItemByAttr=function(attrName,attrValue)
   {      
       var oItems=[];
       visitItems(pushItem);
       function pushItem(oItem)
       {
          if(oItem.item.getAttr(attrName)==attrValue)
          {
               oItems.push(oItem.item);
          }
       }      
       return oItems;
   }
   
   this.hasChildAttr=function(attrName,attrValue)
   {
      if(!visitItems(isHasAttr)) return false;
      return true;
      function isHasAttr(oItem)
      {
          return (oItem.item.getAttr(attrName)==attrValue)
      }
   }
   
   this.appendItemByXML=function(xmlNodes,oParams)
   {
       var iLen=xmlNodes.length;
       var textTag=oParams.textTag||"ITEM_NAME";
       for(var j=0;j<iLen;j++)
       {
          var oItem=xmlNodes[j];
          var oChilds=oItem.childNodes;
          var iChildLen=oChilds.length;
          var attr={};
          for(var k=0;k<iChildLen;k++)
          {
             var oChild=oChilds[k];
             attr[oChild.tagName]=oChild.text;
          }
          this.appendItem({
                            img:oParams.img||defaultImg,
                            text:attr[textTag]||"ÐÂ½¨Ïî",
                            event:oParams.event||{},
                            attr:attr
                          })
       }
   }
   
   this.getItemsXML=function()
   {
      var sXML="";
      visitItems(getXML);
      function getXML(oItem)
      {
         var oItemAttrs=oItem.item.getAttrs();
         sXML+="<ITEM"
         for(var attrName in oItemAttrs)
         {
            sXML+=" "+attrName+"='"+xmlEncode(oItemAttrs[attrName])+"'";
         }
         sXML+="></ITME>"
      }
      return sXML;
   }
   
   this.getItemAttrSplitStr=function(sDelimiter)
   {
      var aAttr={};
      var delimiter=sDelimiter||',';
      visitItems(getSplitAttr);
      function getSplitAttr(oItem)
      {
          var oItemAttrs=oItem.item.getAttrs();
          for(var attrName in oItemAttrs)
          {
              if(!aAttr[attrName]) aAttr[attrName]="";
              aAttr[attrName]+=oItemAttrs[attrName]
              if(oItem.step!=oItem.total)
              {
                 aAttr[attrName]+=delimiter;
              }
          }
      }
      return aAttr;
   }
   
   function visitItems(visitor)
   {
      var iLen=aItems.length;
      for(var j=0;j<iLen;j++)
      {
         var oItem=aItems[j];
         var bReturn=visitor.call(this,{item:oItem,step:j,total:iLen-1});
         if(bReturn===true)
		 {
		     return true;
		 }
      }
   }
   function resetItemsIndex(iStart,iEnd)
   {
      var start=iStart||0;
      var end=iEnd||aItems.length-1;
      for(var j=start;j<=end;j++)
      {
         aItems[j].setItemIndex(j);
      }
   };

   function listView.item(iItemIndex,oParent,oParams)
   {
       var NORMAL_COLOR="black";
       var NORMAL_BCOLOR="white";
       var SELECTED_COLOR="white";
       var SELECTED_BCOLOR="#808080";
       var SELECTED_BORDER="1px solid black";
       var oText=oParams.oHtml.getElementsByTagName("span")[0];
       var itemIndex=iItemIndex; 
            
       this.getItemIndex=function()
       {
            return itemIndex;
       };
       
       this.setItemIndex=function(iItemIndex)
       {
           itemIndex=iItemIndex;
       };
       
       this.getText=function()
       {
           return oText.innerText;
       };
       
       this.moveUp=function()
       {
           oParent.swapNode(itemIndex,itemIndex-1);
       };
       
       this.moveDown=function()
       {
           oParent.swapNode(itemIndex,itemIndex+1);
       };
       
       this.getAttr=function(attrName)
       {
           return oParams.attr[attrName];
       };
       
       this.getAttrs=function()
       {
           return oParams.attr;
       };
       
       this.select=function()
       {    
            oText.style.color=SELECTED_COLOR
            oText.style.backgroundColor=SELECTED_BCOLOR;
            oText.style.border=SELECTED_BORDER;
       };
        
       this.unselect=function()
       {
            oText.style.color=NORMAL_COLOR;
            oText.style.backgroundColor=NORMAL_BCOLOR;
            oText.style.border="";
       };
       
       var onclick=function(oItem)
       {
            return function(oItem)
            {
                oParent.selectItem(itemIndex);
                oParams.event.onclick && oParams.event.onclick(oItem);
            }
       }
       var ondblclick=function(oItem)
       {
            return function(oItem)
            {
                oParams.event.ondblclick && oParams.event.ondblclick(oItem);
            }
       }
       
       function attachEvent()
       {
	       oParams.oHtml.onclick=onclick(this);
	       oParams.oHtml.ondblclick=ondblclick(this);
       };
       attachEvent();               
   }
}