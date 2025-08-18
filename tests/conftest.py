import pytest

@pytest.fixture
def mock_snmp_response():
    return "SNMPv2-MIB::sysUpTime.0 = Timeticks: (123456) 14:45:56.78"
