<?xml version="1.0" encoding="UTF-8"?>
<!--2007.9.20 增加显示知识库订阅图标功能 By Jerry.Chan-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="4.0" encoding="GB2312"/>
  <!--生成该树形对象的唯一标识-->
  <xsl:variable name="TreeObjId"/>
  <!--图标所在路径-->
  <xsl:variable name="IcoUrl"/>
  <!--菜单连线所在路径-->
  <xsl:variable name="LineUrl"/>
  <!--菜单连线图片名称-->
  <xsl:variable name="topLine0"/>
  <xsl:variable name="topLine1"/>
  <xsl:variable name="topLine2"/>
  <xsl:variable name="bottomLine0"/>
  <xsl:variable name="bottomLine1"/>
  <xsl:variable name="bottomLine2"/>
  <xsl:variable name="otherLine0"/>
  <xsl:variable name="otherLine1"/>
  <xsl:variable name="otherLine2"/>
  <xsl:variable name="backgroundLine"/>
  <!--是第一次初始化菜单还是载入的转化-->
  <xsl:variable name="transformType" select="1"/>
  <!--父节点是否为最后一个节点(仅在transformType=2时有效)-->
  <xsl:variable name="isParentLast" select="false()"/>
  <!--父节点是否为第一层的唯一节点(仅在transformType=2时有效)-->
  <xsl:variable name="isParentOnlyNode" select="false()"/>
  <!--第一层的只有一节点时候是否显示连线-->
  <xsl:variable name="isShowLineInOnlyNode" select="false()"/>
  <!--是否是动态取下一级子树-->
  <xsl:variable name="isDynamicLoad" select="false()"/>
  <!--显示的菜单层数-->
  <xsl:variable name="showDepth" select="2"/>
  <!-- 是否转化没有显示的菜单层 -->
  <xsl:variable name="isShowUnDisplay" select="true()"/>
  <!--菜单项目高度-->
  <xsl:variable name="MenuItemHeight" select="20"/>
  <!--图标宽度-->
  <xsl:variable name="IcoWidth" select="19"/>
  <!--缺省的叶节点-->
  <xsl:variable name="defaultIco" select="'folder.gif'"/>
  <!--缺省的父节点-->
  <xsl:variable name="defaultParentIco" select="'folder.gif'"/>
  <!--是否有字节点的属性-->
  <xsl:variable name="hasChildAttName" select="'CHILD_COUNT'"/>
  <!--排序字段-->
  <xsl:variable name="sortAtt" select="'SORT_ID'"/>
  <!-- 菜单前显示的格式 -->
  <xsl:variable name="showType" select="'ico'"/>
  <!-- 菜单前显示的格式 -->
  <xsl:variable name="isShowDesc" select="false()"/>
  <!--父节点收缩事件的方法名称-->
  <xsl:variable name="parentNodeClickEvent" select="concat('parentNodeClick(',$TreeObjId,')')"/>
  <!--节点划过事件的方法名称-->
  <xsl:variable name="itemOverEvent" select="concat('itemOver(',$TreeObjId,')')"/>
  <!--节点划出事件的方法名称-->
  <xsl:variable name="itemOutEvent" select="concat('itemOut(',$TreeObjId,')')"/>
  <!--节点单击事件的方法名称-->
  <xsl:variable name="itemClickEvent" select="concat('itemClick(',$TreeObjId,')')"/>
  <!--节点双击事件的方法名称-->
  <xsl:variable name="itemDblClickEvent" select="concat('itemDblClick(',$TreeObjId,')')"/>
  <!--节点拖拽事件的开始方法名称-->
  <xsl:variable name="startDragEvent" select="concat('startDrag(',$TreeObjId,')')"/>
  <!--节点拖拽事件的方法名称-->
  <xsl:variable name="dragEvent" select="concat('drag(',$TreeObjId,')')"/>
  <!--节点拖拽事件的方法名称-->
  <xsl:variable name="endDragEvent" select="concat('endDragEvent(',$TreeObjId,')')"/>
  <!--节点右键事件的方法名称-->
  <xsl:variable name="rightClickEvent" select="concat('rightClickEvent(',$TreeObjId,')')"/>
  <!--checkbox单击事件的方法名称-->
  <xsl:variable name="checkBoxClickEvent" select="concat('checkBoxClickEvent(',$TreeObjId,')')"/>
  <!-- 匹配根节点 -->
  <xsl:template match="/root">
    <xsl:if test="error_code=0">
      <xsl:apply-templates select="Menu"/>
    </xsl:if>
  </xsl:template>
  <xsl:template match="Menu">
    <xsl:choose>
      <!--树的初始化-->
      <xsl:when test="$transformType=1">
        <xsl:call-template name="outMenu">
          <xsl:with-param name="depth" select="1"/>
        </xsl:call-template>
      </xsl:when>
      <!--动态载入的解析-->
      <xsl:when test="$transformType=2">
        <xsl:if test="count(node())>0">
          <xsl:call-template name="outChildDiv">
            <xsl:with-param name="isDisplay" select="true()"/>
            <xsl:with-param name="isLast" select="$isParentLast"/>
            <xsl:with-param name="isOnlyNode" select="$isParentOnlyNode"/>
            <xsl:with-param name="depth" select="0"/>
          </xsl:call-template>
        </xsl:if>
      </xsl:when>
      <!--单纯添加子结点区域-->
      <xsl:when test="$transformType=3">
        <xsl:call-template name="outChildDiv">
          <xsl:with-param name="isDisplay" select="true()"/>
          <xsl:with-param name="isLast" select="$isParentLast"/>
          <xsl:with-param name="isOnlyNode" select="$isParentOnlyNode"/>
          <xsl:with-param name="depth" select="0"/>
        </xsl:call-template>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
  <!--递归的方式生成系统菜单-->
  <xsl:template name="outMenu">
    <!--用来控制需要显示的层数-->
    <xsl:param name="depth"/>
    <xsl:for-each select="node()">
      <xsl:sort select="@*[name()=$sortAtt]" data-type="number"/>
      <xsl:call-template name="outEveryMenu">
        <xsl:with-param name="depth" select="$depth"/>
        <!--是否为父节点-->
        <xsl:with-param name="isParentNode" select="count(node())>0"/>
        <!--是否为动态载入节点-->
        <xsl:with-param name="isDynamicLoadNode" select="not(@*[name()=$hasChildAttName]) or @*[name()=$hasChildAttName]>0"/>
        <!--是否显示子节点-->
        <xsl:with-param name="isDisplay" select="$showDepth>$depth"/>
        <!--目前的节点是否是最后一个节点-->
        <xsl:with-param name="isLast" select="position()=last()"/>
        <!--第一层是否只有一个节点并且要在初始化中才有效-->
        <xsl:with-param name="isOnlyNode" select="not($isShowLineInOnlyNode) and $depth=1 and position()=1 and position()=last()"/>
      </xsl:call-template>
    </xsl:for-each>
  </xsl:template>
  <xsl:template name="outEveryMenu">
    <xsl:param name="depth"/>
    <!--是否为父节点-->
    <xsl:param name="isParentNode"/>
    <!--是否为动态载入节点-->
    <xsl:param name="isDynamicLoadNode"/>
    <!--是否显示子节点-->
    <xsl:param name="isDisplay"/>
    <!--目前的节点是否是最后一个节点-->
    <xsl:param name="isLast"/>
    <!--第一层是否只有一个节点-->
    <xsl:param name="isOnlyNode"/>
    <div>
      <!--自身节点区域-->
      <div>
        <xsl:attribute name="style">
          <xsl:value-of select="concat('white-space:nowrap;height:',$MenuItemHeight)"/>
        </xsl:attribute>
        <!--设置目前节点是否为最后一个节点-->
        <xsl:attribute name="isLast">
          <xsl:value-of select="$isLast"/>
        </xsl:attribute>
        <xsl:attribute name="isOnlyNode">
          <xsl:value-of select="$isOnlyNode"/>
        </xsl:attribute>
        <!--目前节点是否为父节点-->
        <xsl:attribute name="type">
          <xsl:choose>
            <xsl:when test="$isParentNode">
              <xsl:value-of select="'parentNode'"/>
            </xsl:when>
            <xsl:when test="$isDynamicLoad and $isDynamicLoadNode">
              <xsl:value-of select="'dynamicLoadNode'"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="'singleNode'"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:attribute>
       
        <!--添加菜单线-->
        <xsl:choose>
          <!--第一层的第一个节点-->
          <xsl:when test="$depth=1 and position()=1 and not($isShowLineInOnlyNode)">
            <xsl:call-template name="outLineImg">
              <xsl:with-param name="isOnlyNode" select="$isOnlyNode"/>
              <xsl:with-param name="isParentNode" select="$isParentNode"/>
              <xsl:with-param name="isDynamicLoadNode" select="$isDynamicLoadNode"/>
              <xsl:with-param name="isDisplay" select="$isDisplay"/>
              <xsl:with-param name="img1" select="$topLine0"/>
              <xsl:with-param name="img2" select="$topLine1"/>
              <xsl:with-param name="img3" select="$topLine2"/>
              <xsl:with-param name="lineType" select="'topLine'"/>
            </xsl:call-template>
          </xsl:when>
          <!--该层的最后一个父节点-->
          <xsl:when test="$isLast">
            <xsl:call-template name="outLineImg">
              <xsl:with-param name="isOnlyNode" select="$isOnlyNode"/>
              <xsl:with-param name="isParentNode" select="$isParentNode"/>
              <xsl:with-param name="isDynamicLoadNode" select="$isDynamicLoadNode"/>
              <xsl:with-param name="isDisplay" select="$isDisplay"/>
              <xsl:with-param name="img1" select="$bottomLine0"/>
              <xsl:with-param name="img2" select="$bottomLine1"/>
              <xsl:with-param name="img3" select="$bottomLine2"/>
              <xsl:with-param name="lineType" select="'bottomLine'"/>
            </xsl:call-template>
          </xsl:when>
          <!--其他的节点-->
          <xsl:otherwise>
            <xsl:call-template name="outLineImg">
              <xsl:with-param name="isOnlyNode" select="$isOnlyNode"/>
              <xsl:with-param name="isParentNode" select="$isParentNode"/>
              <xsl:with-param name="isDynamicLoadNode" select="$isDynamicLoadNode"/>
              <xsl:with-param name="isDisplay" select="$isDisplay"/>
              <xsl:with-param name="img1" select="$otherLine0"/>
              <xsl:with-param name="img2" select="$otherLine1"/>
              <xsl:with-param name="img3" select="$otherLine2"/>
              <xsl:with-param name="lineType" select="'otherLine'"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
        <!--菜单显示样式-->
        <xsl:choose>
          <xsl:when test="$showType='ico'">
            <!--菜单图标-->
            <img width="16" height="16" align="absmiddle" onclick="event.srcElement.nextSibling.click();">
              <xsl:attribute name="src">
                <xsl:choose>
                  <!--没有给出图标的节点显示默认的图片-->
                  <xsl:when test="not(@ico or @ICO)">
                    <xsl:choose>
                      <!--默认的父节点图片-->
                      <xsl:when test="($isParentNode or ($isDynamicLoad and $isDynamicLoadNode))">
                        <xsl:value-of select="concat($IcoUrl,$defaultParentIco)"/>
                      </xsl:when> 
                      <!--默认的子节点图片-->                     
                      <xsl:otherwise>
                        <xsl:value-of select="concat($IcoUrl,$defaultIco)"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                  <!--显示指定的图标-->
                  <xsl:otherwise>
                    <xsl:value-of select="concat($IcoUrl,@*[name()='ico' or name()='ICO'])"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:attribute>
            </img>
          </xsl:when>
          <xsl:when test="$showType='checkbox'">
            <INPUT type="checkbox" name="MYCHK">
              <xsl:attribute name="onClick">
                <xsl:value-of select="$checkBoxClickEvent"/>
              </xsl:attribute>
              <xsl:if test="@DISABLED">
		          <xsl:attribute name="disabled">
		            <xsl:value-of select="@DISABLED"/>
		          </xsl:attribute>
	          </xsl:if>
            </INPUT>
          </xsl:when>
        </xsl:choose>
        
        <!--菜单名称-->
        <nobr>
          
          <xsl:attribute name="name">
            <xsl:value-of select="'MYNOBR'"/>
          </xsl:attribute>
          <xsl:attribute name="style">
	            <xsl:value-of select="concat('height:100%;CURSOR:default;COLOR: #000000;font-size: 9pt;font-weight: normal;font-style: normal;text-decoration: none;font-family: 宋体;margin-left:2px;padding:4px 2px 0px 2px;',@style)"/>
	          </xsl:attribute>
          <xsl:if test="@DISABLED">
	          <xsl:attribute name="style">
	            <xsl:value-of select="concat('height:100%;CURSOR:default;COLOR: #ACA899;font-size: 9pt;font-weight: normal;font-style: normal;text-decoration: none;font-family: 宋体;margin-left:2px;padding:4px 2px 0px 2px;',@style)"/>
	          </xsl:attribute>
          </xsl:if>
          <xsl:attribute name="onMouseOver">
            <xsl:value-of select="$itemOverEvent"/>
          </xsl:attribute>
          <xsl:attribute name="onMouseOut">
            <xsl:value-of select="$itemOutEvent"/>
          </xsl:attribute>
          <xsl:if test="not(@no_click_event) or @no_click_event!='true'">
            <xsl:attribute name="onClick">
              <xsl:value-of select="$itemClickEvent"/>
            </xsl:attribute>
          </xsl:if>
          <xsl:if test="not(@no_dblclick_event) or @no_dblclick_event!='true'">
            <xsl:attribute name="ondblclick">
              <xsl:value-of select="$itemDblClickEvent"/>
            </xsl:attribute>
          </xsl:if>
          <xsl:attribute name="onMouseDown">
            <xsl:value-of select="$startDragEvent"/>
          </xsl:attribute>
          <xsl:attribute name="onMouseUp">
            <xsl:value-of select="$endDragEvent"/>
          </xsl:attribute>
          <xsl:attribute name="onMouseMove">
            <xsl:value-of select="$dragEvent"/>
          </xsl:attribute>
          <xsl:attribute name="oncontextmenu">
            <xsl:value-of select="$rightClickEvent"/>
          </xsl:attribute>
          <xsl:copy-of select="@*[name()!='style' and name()!='label']"/>
          <xsl:value-of select="@label"/>
          
        </nobr>
        <xsl:if test="$isShowDesc">
   		<nobr>
   		  <xsl:attribute name="style">
            <xsl:value-of select="concat('height:100%;CURSOR:default;COLOR: #000000;font-size: 9pt;font-weight: normal;font-style: normal;text-decoration: none;font-family: 宋体;margin-left:2px;padding:4px 2px 0px 2px;',@style)"/>
          </xsl:attribute>
   		  <xsl:value-of select="@FUNC_DESC" disable-output-escaping="yes"/>
   		</nobr>
        </xsl:if>
      </div>
       
      <!--生成子菜单区域-->
      <xsl:if test="$isParentNode">
        <xsl:call-template name="outChildDiv">
		  <!--当且只有一个父节点且显示深度为1时，默认也要展开子节点，否则子节点将无法显示-->
          <xsl:with-param name="isDisplay" select="$isDisplay or ($isOnlyNode and $showDepth=1)"/>
          <xsl:with-param name="isLast" select="$isLast"/>
          <xsl:with-param name="isOnlyNode" select="$isOnlyNode"/>
          <xsl:with-param name="depth" select="$depth"/>
        </xsl:call-template>
      </xsl:if>
     
    </div>
    
  </xsl:template>
  <!--生成子菜单区域-->
  <xsl:template name="outChildDiv">
    <!--该区域是否显示-->
    <xsl:param name="isDisplay"/>
    <!--父节点是否是最后一个节点-->
    <xsl:param name="isLast"/>
    <!--父节点是不是第一层唯一的一个节点-->
    <xsl:param name="isOnlyNode"/>
    <!--当前显示的层数-->
    <xsl:param name="depth"/>
    <xsl:if test="($isShowUnDisplay or $isDisplay)">
      <div type="childNodes">
        <!--判断该节点是否展开显示-->
        <xsl:if test="not($isDisplay)">
          <xsl:attribute name="style">
            <xsl:value-of select="'display:none'"/>
          </xsl:attribute>
        </xsl:if>
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <!--连线扩展区域-->
            <td>
              <!--是否显示连线-->
              <xsl:if test="$isOnlyNode">
                <xsl:attribute name="style">
                  <xsl:value-of select="'display:none'"/>
                </xsl:attribute>
              </xsl:if>
              <!--如果不是最后一个节点添加连线-->
              <xsl:if test="not($isLast)">
                <xsl:attribute name="background">
                  <xsl:value-of select="concat($LineUrl,$backgroundLine)"/>
                </xsl:attribute>
              </xsl:if>
              <!--强制设定大小防止缩小-->
              <div>
                <xsl:attribute name="style">
                  <xsl:value-of select="concat('width:',$IcoWidth)"/>
                </xsl:attribute>
              </div>
            </td>
            <!--递归调用生成子节点-->
            <td>
              <xsl:call-template name="outMenu">
                <xsl:with-param name="depth" select="$depth+1"/>
              </xsl:call-template>
            </td>
          </tr>
        </table>
      </div>
    </xsl:if>
  </xsl:template>
  <xsl:template name="outLineImg">
    <xsl:param name="isOnlyNode"/>
    <xsl:param name="isParentNode"/>
    <xsl:param name="isDynamicLoadNode"/>
    <xsl:param name="isDisplay"/>
    <xsl:param name="img1"/>
    <xsl:param name="img2"/>
    <xsl:param name="img3"/>
    <xsl:param name="lineType"/>
    <img width="19" height="20" align="absmiddle">
      <xsl:attribute name="lineType">
        <xsl:value-of select="$lineType"/>
      </xsl:attribute>
      <xsl:attribute name="onClick">
        <xsl:value-of select="$parentNodeClickEvent"/>
      </xsl:attribute>
      <!--如果第一层只有一个节点那么不显示菜单线-->
      <xsl:if test="$isOnlyNode">
        <xsl:attribute name="style">
          <xsl:value-of select="'display:none'"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="src0">
        <xsl:value-of select="concat($LineUrl,$img1)"/>
      </xsl:attribute>
      <xsl:attribute name="src1">
        <xsl:value-of select="concat($LineUrl,$img2)"/>
      </xsl:attribute>
      <xsl:attribute name="src2">
        <xsl:value-of select="concat($LineUrl,$img3)"/>
      </xsl:attribute>
      <xsl:choose>
        <!--父节点的菜单线-->
        <xsl:when test="$isParentNode">
          <xsl:attribute name="isShow">
            <xsl:value-of select="($isShowUnDisplay or $isDisplay)"/>
          </xsl:attribute>
          <xsl:choose>
            <!--该节点的子节点打开时候-->
            <xsl:when test="$isDisplay">
              <xsl:attribute name="src">
                <xsl:value-of select="concat($LineUrl,$img1)"/>
              </xsl:attribute>
              <xsl:attribute name="imgType">
                <xsl:value-of select="0"/>
              </xsl:attribute>
            </xsl:when>
            <!--该节点的子节点收起的时候-->
            <xsl:otherwise>
              <xsl:attribute name="src">
                <xsl:value-of select="concat($LineUrl,$img2)"/>
              </xsl:attribute>
              <xsl:attribute name="imgType">
                <xsl:value-of select="1"/>
              </xsl:attribute>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <!--动态载入的节点-->
        <xsl:when test="$isDynamicLoad and $isDynamicLoadNode">
          <xsl:attribute name="src">
            <xsl:value-of select="concat($LineUrl,$img2)"/>
          </xsl:attribute>
          <xsl:attribute name="imgType">
            <xsl:value-of select="1"/>
          </xsl:attribute>
        </xsl:when>
        <!--静态载入-->
        <xsl:otherwise>
          <xsl:attribute name="src">
            <xsl:value-of select="concat($LineUrl,$img3)"/>
          </xsl:attribute>
          <xsl:attribute name="imgType">
            <xsl:value-of select="2"/>
          </xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
    </img>
  </xsl:template>
</xsl:stylesheet>
