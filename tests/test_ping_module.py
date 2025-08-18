import subprocess

def test_ping_localhost():
    result = subprocess.run(['ping', '-c', '1', '127.0.0.1'], capture_output=True)
    assert result.returncode == 0
