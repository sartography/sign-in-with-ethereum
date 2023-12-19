from siwe import SiweMessage
import uuid
from datetime import datetime

message_dict = {
    "domain": "localhost",
    # ethereum test network - goerli
    "address": '0x53e4983d6cEe48a4ff2c330c724c3Bf7F1F9B883',
    "statement": 'Sign in with Ethereum to the app.',
    "uri": "http://localhost:7000",
    "version": '1',
    "chain_id": "5",
    "nonce": str(uuid.uuid4()),
    "issued_at": datetime.now().isoformat()
}
print(f"message_dict: {message_dict}")
# message: SiweMessage = SiweMessage(message=eip_4361_string)
message: SiweMessage = SiweMessage(message=message_dict)
# print(f"message: {message}")

# message.verify(signature=message_dict['address'])
print(message.prepare_message())
