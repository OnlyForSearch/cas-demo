<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="4.0" encoding="GB2312"/>
	<xsl:template match="/root">
		<html>
			<head>
				<title>
					<xsl:value-of select="@title"/>
				</title>
				<style>
					body
					{
						overflow:auto;
					}
					.head
					{
						white-space:nowrap;
						font-size:9pt;
						color:#42658D;
						padding:5 5 5 5;
					}
					.cell
					{
						border:0;
						width:100%;
						height:100%;
						overflow:hidden;
						font-size:9pt;
						margin:0;
						padding:5 5 5 5;
					}
				</style>
			</head>
			<body>
				<table width="100%" border="0" cellpadding="0" cellspacing="1" style="background:#D6D2C2">
					<tr style="background:#EBEADB">
						<xsl:for-each select="head/*">
							<td class="head">
								<xsl:value-of select="text()"/>
							</td>
						</xsl:for-each>
					</tr>
					<xsl:for-each select="row">
						<tr style="background:#FFFFFF">
							<xsl:for-each select="*">
								<td>
									<textarea readonly="true" class="cell">
										<xsl:value-of select="text()"/>
									</textarea>
								</td>
							</xsl:for-each>
						</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
