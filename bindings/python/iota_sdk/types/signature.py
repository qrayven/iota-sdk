# Copyright 2023 IOTA Stiftung
# SPDX-License-Identifier: Apache-2.0

from dataclasses import dataclass
from iota_sdk.types.common import HexStr, CoinType


@dataclass
class Ed25519Signature():
    """An Ed25519 signature.

    Attributes:
        publicKey: The Ed25519 public key.
        signature: The Ed25519 signature of some message.
        type: The Ed25519 signature type.
    """
    publicKey: HexStr
    signature: HexStr
    type: int = 0


@dataclass
class Bip44():
    """A BIP44 chain.

    Attributes:
        coinType: The coin type segment.
        account: The account segment.
        change: The change segment.
        addressIndex: The address index segment.
    """
    coinType: int = CoinType.IOTA
    account: int = 0
    change: int = 0
    addressIndex: int = 0
