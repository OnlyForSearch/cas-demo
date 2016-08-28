<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:variable name="attributeIndex" select="/root/Attribute/index"/>
	<xsl:variable name="metricIndex" select="/root/Metric/index"/>
	<xsl:variable name="baseIndex" select="/root/Base/index"/>
	<xsl:template match="/root">
		<xsl:element name="root">
			<xsl:for-each-group select="rowSet" group-by="child::*[position()=$attributeIndex[1]]">
				<xsl:for-each-group select="current-group()" group-by="child::*[position()=$attributeIndex[2]]">
					<xsl:variable name="rowSet" select="child::*"/>
					<xsl:for-each select="$metricIndex">
						<xsl:element name="rowSet">
							<xsl:variable name="index" select="text()"/>
							<xsl:copy-of select="if($attributeIndex[1]=$attributeIndex[2]) then /root/Fields/Field[position()=$index] else $rowSet[position()=$attributeIndex[2]]"/>
							<xsl:copy-of select="$rowSet[position()=$attributeIndex[1]]"/>
							<xsl:element name="METRIC">
								<xsl:value-of select="sum(current-group()/child::*[position()=$index])"/>
							</xsl:element>
						</xsl:element>
					</xsl:for-each>
					<xsl:for-each select="$baseIndex">
						<xsl:element name="rowSet">
						    <xsl:attribute name="type" select="'base'"/>
							<xsl:variable name="index" select="text()"/>
							<xsl:copy-of select="/root/Fields/Field[position()=$index]"/>
							<xsl:copy-of select="$rowSet[position()=$attributeIndex[1]]"/>
							<xsl:element name="METRIC">
								<xsl:value-of select="sum(current-group()/child::*[position()=$index])"/>
							</xsl:element>
						</xsl:element>
					</xsl:for-each>
				</xsl:for-each-group>
			</xsl:for-each-group>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>