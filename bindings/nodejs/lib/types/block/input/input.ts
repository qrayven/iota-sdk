// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { HexEncodedString } from '../../utils';

/**
 * All of the input types.
 */
enum InputType {
    UTXO = 0,
    Treasury = 1,
}

abstract class Input {
    private type: InputType;

    constructor(type: InputType) {
        this.type = type;
    }

    /**
     * The type of input.
     */
    getType(): InputType {
        return this.type;
    }
}

/**
 * Treasury Input.
 */
class TreasuryInput extends Input {
    /**
     * The milestone id of the input.
     */
    milestoneId: HexEncodedString;

    constructor(milestoneId: HexEncodedString) {
        super(InputType.Treasury);
        this.milestoneId = milestoneId;
    }
}

/**
 * UTXO Transaction Input.
 */
class UTXOInput extends Input {
    /**
     * The transaction Id.
     */
    transactionId: HexEncodedString;
    /**
     * The output index.
     */
    transactionOutputIndex: number;

    constructor(
        transactionId: HexEncodedString,
        transactionOutputIndex: number,
    ) {
        super(InputType.UTXO);
        this.transactionId = transactionId;
        this.transactionOutputIndex = transactionOutputIndex;
    }
}

const InputDiscriminator = {
    property: 'type',
    subTypes: [
        { value: TreasuryInput, name: InputType.Treasury as any },
        { value: UTXOInput, name: InputType.UTXO as any },
    ],
};

export { InputDiscriminator, InputType, Input, TreasuryInput, UTXOInput };
