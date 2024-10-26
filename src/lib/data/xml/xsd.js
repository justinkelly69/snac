const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"
	targetNamespace="http://SubstitutionGroups"
	xmlns:tns="http://SubstitutionGroups">
	
	<!-- ELEMENT DECLARATIONS -->
	
	<xsd:element name="Name" type="xsd:string" />
	<xsd:element name="StoreName" substitutionGroup="tns:Name" type="tns:MyString" />
	
	<xsd:element name="Publication" type="tns:PublicationType" />
  	<xsd:element name="Book" substitutionGroup="tns:Publication" type="tns:BookType" />
  	<xsd:element name="Magazine" substitutionGroup="tns:Publication" type="tns:MagazineType" />
		
  		<xsd:element name="BookStore">
		<xsd:complexType>
			<xsd:sequence>
				<xsd:element ref="tns:Name" />
				<xsd:element ref="tns:Publication" maxOccurs="unbounded" />
			</xsd:sequence>
		</xsd:complexType>
	</xsd:element>
	
	<xsd:element name="LiteratureStore" substitutionGroup="tns:BookStore" />
	
	

	<!--  TYPE DEFINITIONS -->
	
	<xsd:simpleType name="MyString">
		<xsd:restriction base="xsd:string">
			<xsd:minLength value="3"></xsd:minLength>
			<xsd:maxLength value="10"></xsd:maxLength>
		</xsd:restriction>
	</xsd:simpleType>
	
	<xsd:complexType name="PublicationType">
		<xsd:sequence>
			<xsd:element name="Title" type="xsd:string" />
			<xsd:element name="Author" type="xsd:string" minOccurs="0"
				maxOccurs="unbounded" />
			<xsd:element name="Date" type="xsd:gYear" />
		</xsd:sequence>
	</xsd:complexType>
	
	<xsd:complexType name="BookType">
		<xsd:complexContent>
			<xsd:extension base="tns:PublicationType">
				<xsd:sequence>
					<xsd:element name="ISBN" type="xsd:string" />
					<xsd:element name="Publisher" type="xsd:string" />
				</xsd:sequence>
			</xsd:extension>
		</xsd:complexContent>
	</xsd:complexType>
	
	<xsd:complexType name="MagazineType">
		<xsd:complexContent>
			<xsd:restriction base="tns:PublicationType">
				<xsd:sequence>
					<xsd:element name="Title" type="xsd:string" />
					<xsd:element name="Date" type="xsd:gYear" />
				</xsd:sequence>
			</xsd:restriction>
		</xsd:complexContent>
	</xsd:complexType>

</xsd:schema>
`

export default xml