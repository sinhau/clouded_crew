#!/usr/bin/env python3

import json
import os
from web3 import Web3

MAX_NFT_SUPPLY = 3333
IMAGE_BASE_URI = "https://gateway.pinata.cloud/ipfs/QmWR5jsgbknAJtwNWaxapSNiKBZR5PpEmgkaSBfp117Smn"
METADATA_PATH = f"{os.getenv('HOME')}/Desktop/metadata"
METADATA_HASH_LIST = list()

idx = 1
while idx <= MAX_NFT_SUPPLY:
    data = {
        "name": f"Lofty Cloud #{idx}",
        "description": f"Lofty Cloud #{idx}",
        "image": f"{IMAGE_BASE_URI}/1.png",
        "attributes": [
            {"trait_type": "Base", "value": "Starfish"},
            {"trait_type": "Eyes", "value": "Big"},
        ],
    }

    with open(f"{METADATA_PATH}/{idx}.json", "w") as f:
        json.dump(data, f)
    METADATA_HASH_LIST.append(Web3.solidityKeccak(["string"], [json.dumps(data)]).hex())

    idx += 1

contract_data = {
    "name": "LoftyClouds",
    "description": "LoftyClouds are awesome!",
    "image": f"{IMAGE_BASE_URI}/1.png",
    "external_link": "https://www.loftyclouds.com",
}
with open(f"{METADATA_PATH}/contractMetadata.json", "w") as f:
    json.dump(contract_data, f)
METADATA_HASH_LIST.append(Web3.solidityKeccak(["string"], [json.dumps(contract_data)]).hex())

METADATA_PROVENANCE_HASH = Web3.solidityKeccak(["string"]*len(METADATA_HASH_LIST), METADATA_HASH_LIST).hex()
print(f"METADATA_PROVENANCE_HASH: {METADATA_PROVENANCE_HASH}")
