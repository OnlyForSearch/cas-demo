<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="4.0" encoding="GB2312"/>
	<!--菜单项目高度-->
	<xsl:variable name="MenuItemHeight" select="20"/>
	<!--图标宽度-->
	<xsl:variable name="IcoWidth" select="19"/>
	<!--显示的菜单层数-->
	<xsl:variable name="showDepth" select="2"/>
	<!--图标所在路径-->
	<xsl:variable name="IcoUrl" select="'resource/image/ico/'"/>
	<!--菜单连线所在路径-->
	<xsl:variable name="LineUrl" select="'resource/image/line/'"/>
	<!--调用句柄-->
	<xsl:variable name="Handle"/>
	<!-- 过滤节点 -->
	<xsl:variable name="Filter"/>
	<!--缺省的叶节点-->
	<xsl:variable name="defaultIco" select="'folder.gif'"/>
	<!--缺省的父节点-->
	<xsl:variable name="defaultParentIco" select="'folder.gif'"/>
	<!-- 匹配根节点 -->
	<xsl:template match="/root">
		<xsl:choose>
			<xsl:when test="error_code=0">
				<xsl:apply-templates select="Menu"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="error_msg"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="Menu">
		<!--生成树形菜单-->
		<table border="0" cellpadding="0" cellspacing="0" id="treeTable" width="100%">
			<xsl:call-template name="outMenu">
				<xsl:with-param name="depth" select="1"/>
			</xsl:call-template>
		</table>
	</xsl:template>
	<!--递归的方式生成系统菜单-->
	<xsl:template name="outMenu">
		<!--用来控制需要显示的层数-->
		<xsl:param name="depth"/>
		<xsl:for-each select="node()[not($Filter) or not(@tag) or @tag!=$Filter]">
			<xsl:sort select="@SORT_ID" data-type="number"/>
			<tr>
				<td>
					<table border="0" cellpadding="0" cellspacing="0" width="100%">
						<tr valign="middle" name="menuItem">
							<xsl:if test="count(node())>0">
								<xsl:attribute name="type">
									<xsl:value-of select="'parentNode'"/>
								</xsl:attribute>
							</xsl:if>
							<!--添加菜单线-->
							<td>
								<xsl:if test="$depth=1 and position()=1 and position()=last()">
									<xsl:attribute name="style">
										<xsl:value-of select="'display:none'"/>
									</xsl:attribute>
								</xsl:if>
								<!--如果是父节点需要添加收缩事件-->
								<xsl:if test="count(node())>0">
									<xsl:attribute name="onClick">
										<xsl:value-of select="concat($Handle,'parentNodeClick(this)')"/>
									</xsl:attribute>
								</xsl:if>
								<xsl:attribute name="width">
									<xsl:value-of select="$IcoWidth"/>
								</xsl:attribute>
								<div>
									<!--控制住大小不允许自动缩小-->
									<xsl:attribute name="style">
										<xsl:value-of select="concat('width:',$IcoWidth,'px')"/>
									</xsl:attribute>
									<img width="19" height="20">
										<xsl:attribute name="src">
											<xsl:choose>
												<xsl:when test="count(node())>0">
													<xsl:choose>
														<xsl:when test="$showDepth>$depth">
															<xsl:choose>
																<!--<xsl:when test="$depth=1 and position()=1 and position()=last()">
                            <xsl:value-of select="concat($LineUrl,'dashminus.gif')"/>
                          </xsl:when>-->
																<xsl:when test="$depth=1 and position()=1">
																	<xsl:value-of select="concat($LineUrl,'rminus.gif')"/>
																</xsl:when>
																<xsl:when test="position()=last()">
																	<xsl:value-of select="concat($LineUrl,'lminus.gif')"/>
																</xsl:when>
																<xsl:otherwise>
																	<xsl:value-of select="concat($LineUrl,'tminus.gif')"/>
																</xsl:otherwise>
															</xsl:choose>
														</xsl:when>
														<xsl:otherwise>
															<xsl:choose>
																<!--<xsl:when test="$depth=1 and position()=1 and position()=last()">
                            <xsl:value-of select="concat($LineUrl,'dashplus.gif')"/>
                          </xsl:when>-->
																<xsl:when test="$depth=1 and position()=1">
																	<xsl:value-of select="concat($LineUrl,'rplus.gif')"/>
																</xsl:when>
																<xsl:when test="position()=last()">
																	<xsl:value-of select="concat($LineUrl,'lplus.gif')"/>
																</xsl:when>
																<xsl:otherwise>
																	<xsl:value-of select="concat($LineUrl,'tplus.gif')"/>
																</xsl:otherwise>
															</xsl:choose>
														</xsl:otherwise>
													</xsl:choose>
												</xsl:when>
												<xsl:otherwise>
													<xsl:choose>
														<!--<xsl:when test="$depth=1 and position()=1 and position()=last()">
                        <xsl:value-of select="concat($LineUrl,'dash.gif')"/>
                      </xsl:when>-->
														<xsl:when test="$depth=1 and position()=1">
															<xsl:value-of select="concat($LineUrl,'r.gif')"/>
														</xsl:when>
														<xsl:when test="position()=last()">
															<xsl:value-of select="concat($LineUrl,'l.gif')"/>
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="concat($LineUrl,'t.gif')"/>
														</xsl:otherwise>
													</xsl:choose>
												</xsl:otherwise>
											</xsl:choose>
										</xsl:attribute>
									</img>
								</div>
							</td>
							<!--菜单图标和菜单内容-->
							<td width="100%">
								<!--<xsl:if test="count(node())>0">
                  <xsl:attribute name="ondblclick">
                    <xsl:value-of select="concat($Handle,'parentNodeClick(this)')"/>
                  </xsl:attribute>
                </xsl:if>-->
								<table border="0" cellspacing="0" cellpadding="0" width="100%">
									<tr valign="middle">
										<xsl:attribute name="height">
											<xsl:value-of select="$MenuItemHeight"/>
										</xsl:attribute>
										<!--菜单图标-->
										<td>
											<xsl:attribute name="width">
												<xsl:value-of select="$IcoWidth"/>
											</xsl:attribute>
											<div class="icoItem">
												<xsl:attribute name="style">
													<xsl:value-of select="concat('width:',$IcoWidth,'px;')"/>
												</xsl:attribute>
												<img width="16" height="16">
													<xsl:attribute name="src">
														<xsl:choose>
															<xsl:when test="not(@ico) or string-length(@ico)=0">
																<xsl:choose>
																	<xsl:when test="count(node())=0">
																		<xsl:value-of select="concat($IcoUrl,$defaultIco)"/>
																	</xsl:when>
																	<xsl:otherwise>
																		<xsl:value-of select="concat($IcoUrl,$defaultParentIco)"/>
																	</xsl:otherwise>
																</xsl:choose>
															</xsl:when>
															<xsl:otherwise>
																<xsl:value-of select="concat($IcoUrl,@ico)"/>
															</xsl:otherwise>
														</xsl:choose>
													</xsl:attribute>
												</img>
											</div>
										</td>
										<!--菜单名称-->
										<td width="100%">
											<nobr class="MenuItem">
											<xsl:attribute name="id">
												<xsl:value-of select="@moduleID"/>
											</xsl:attribute>
											<xsl:attribute name="onMouseOver">
												<xsl:value-of select="concat($Handle,'itemOver(this)')"/>
											</xsl:attribute>
											<xsl:attribute name="onMouseOut">
												<xsl:value-of select="concat($Handle,'itemOut(this)')"/>
											</xsl:attribute>
											<xsl:attribute name="onClick">
												<xsl:value-of select="concat($Handle,'itemClick(this)')"/>
											</xsl:attribute>
											<xsl:copy-of  select="@*[name()!='moduleID' and name()!='label']"/>
											<xsl:value-of select="@label"/>
											</nobr>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<!--生成子菜单节点-->
						<xsl:if test="count(node())>0">
							<tr type="childNodes">
								<xsl:if test="$depth>=$showDepth">
									<xsl:attribute name="style">
										<xsl:value-of select="concat('display:','none')"/>
									</xsl:attribute>
								</xsl:if>
								<td>
									<xsl:if test="$depth=1 and position()=1 and position()=last()">
										<xsl:attribute name="style">
											<xsl:value-of select="'display:none'"/>
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="last()>position()">
										<xsl:attribute name="background">
											<xsl:value-of select="concat($LineUrl,'i.gif')"/>
										</xsl:attribute>
									</xsl:if>
								</td>
								<td>
									<table border="0" cellspacing="0" cellpadding="0" width="100%">
										<xsl:call-template name="outMenu">
											<xsl:with-param name="depth" select="$depth+1"/>
										</xsl:call-template>
									</table>
								</td>
							</tr>
						</xsl:if>
					</table>
				</td>
			</tr>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
