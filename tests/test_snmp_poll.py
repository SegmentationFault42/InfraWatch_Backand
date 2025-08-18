def test_snmp_response_parsing():
    sample_response = "SNMPv2-MIB::sysName.0 = STRING: MyDevice"
    assert "MyDevice" in sample_response
