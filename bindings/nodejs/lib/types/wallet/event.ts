// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import type { OutputData } from './output';
import { InclusionState } from './transaction';
import { InputSigningData, Remainder } from '../client';
import { TransactionEssence, TransactionPayload } from '../block';
import { OutputResponse } from '../models';

export type TransactionId = string;

class Event {
    private accountIndex: number;
    private event: WalletEvent;

    constructor(accountIndex: number, event: WalletEvent) {
        this.accountIndex = accountIndex;
        this.event = event;
    }

    /**
     * The account index for which the event was emitted.
     */
    getAccountIndex(): number {
        return this.accountIndex;
    }

    /**
     * The wallet event.
     */
    getEvent(): WalletEvent {
        return this.event;
    }
}

/**
 * All of the wallet event types.
 */
enum WalletEventType {
    ConsolidationRequired = 0,
    LedgerAddressGeneration = 1,
    NewOutput = 2,
    SpentOutput = 3,
    TransactionInclusion = 4,
    TransactionProgress = 5,
}

abstract class WalletEvent {
    private type: WalletEventType;

    constructor(type: WalletEventType) {
        this.type = type;
    }

    /**
     * The type of the wallet event.
     */
    getType(): WalletEventType {
        return this.type;
    }
}

class ConsolidationRequiredWalletEvent extends WalletEvent {
    constructor() {
        super(WalletEventType.ConsolidationRequired);
    }
}

class LedgerAddressGenerationWalletEvent extends WalletEvent {
    private address: string;

    constructor(address: string) {
        super(WalletEventType.LedgerAddressGeneration);
        this.address = address;
    }

    /**
     * The address.
     */
    getAddress(): string {
        return this.address;
    }
}

class NewOutputWalletEvent extends WalletEvent {
    private output: OutputData;
    private transaction?: TransactionPayload;
    private transactionInputs?: OutputResponse[];

    constructor(
        output: OutputData,
        transaction?: TransactionPayload,
        transactionInputs?: OutputResponse[],
    ) {
        super(WalletEventType.NewOutput);
        this.output = output;
        this.transaction = transaction;
        this.transactionInputs = transactionInputs;
    }

    /**
     * The output.
     */
    getOutput(): OutputData {
        return this.output;
    }

    /**
     * The transaction.
     */
    getTransaction(): TransactionPayload | undefined {
        return this.transaction;
    }

    /**
     * The transaction inputs.
     */
    getTransactionInputs(): OutputResponse[] | undefined {
        return this.transactionInputs;
    }
}

class SpentOutputWalletEvent extends WalletEvent {
    private output: OutputData;

    constructor(output: OutputData) {
        super(WalletEventType.SpentOutput);
        this.output = output;
    }

    /**
     * The output.
     */
    getOutput(): OutputData {
        return this.output;
    }
}

class TransactionInclusionWalletEvent extends WalletEvent {
    private transactionId: TransactionId;
    private inclusionState: InclusionState;

    constructor(transactionId: TransactionId, inclusionState: InclusionState) {
        super(WalletEventType.TransactionInclusion);
        this.transactionId = transactionId;
        this.inclusionState = inclusionState;
    }

    /**
     * The transaction ID.
     */
    getTransactionId(): TransactionId {
        return this.transactionId;
    }

    /**
     * The transaction inclusion state
     */
    getInclusionState(): InclusionState {
        return this.inclusionState;
    }
}

/**
 * All of the transaction progress types.
 */
enum TransactionProgressType {
    SelectingInputs = 0,
    GeneratingRemainderDepositAddress = 1,
    PreparedTransaction = 2,
    PreparedTransactionEssenceHash = 3,
    SigningTransaction = 4,
    PerformingPow = 5,
    Broadcasting = 6,
}

class TransactionProgressWalletEvent extends WalletEvent {
    private progress: TransactionProgress;

    constructor(progress: TransactionProgress) {
        super(WalletEventType.TransactionProgress);
        this.progress = progress;
    }

    /**
     * Returns the progress.
     */
    getProgress(): TransactionProgress {
        return this.progress;
    }
}

abstract class TransactionProgress {
    private type: TransactionProgressType;

    constructor(type: TransactionProgressType) {
        this.type = type;
    }

    /**
     * The type of the transaction progress.
     */
    getProgressType(): TransactionProgressType {
        return this.type;
    }
}

class SelectingInputsProgress extends TransactionProgress {
    constructor() {
        super(TransactionProgressType.SelectingInputs);
    }
}

class GeneratingRemainderDepositAddressProgress extends TransactionProgress {
    private address: string;

    constructor(address: string) {
        super(TransactionProgressType.GeneratingRemainderDepositAddress);
        this.address = address;
    }

    /**
     * The address.
     */
    getAddress(): string {
        return this.address;
    }
}

class PreparedTransactionProgress extends TransactionProgress {
    essence: TransactionEssence;
    inputsData: InputSigningData[];
    remainder?: Remainder;

    constructor(
        essence: TransactionEssence,
        inputsData: InputSigningData[],
        remainder?: Remainder,
    ) {
        super(TransactionProgressType.PreparedTransaction);
        this.essence = essence;
        this.inputsData = inputsData;
        this.remainder = remainder;
    }
}

class PreparedTransactionEssenceHashProgress extends TransactionProgress {
    private hash: string;

    constructor(hash: string) {
        super(TransactionProgressType.PreparedTransactionEssenceHash);
        this.hash = hash;
    }

    /**
     * The address.
     */
    getHash(): string {
        return this.hash;
    }
}

class SigningTransactionProgress extends TransactionProgress {
    constructor() {
        super(TransactionProgressType.SigningTransaction);
    }
}

class PerformingPowProgress extends TransactionProgress {
    constructor() {
        super(TransactionProgressType.PerformingPow);
    }
}

class BroadcastingProgress extends TransactionProgress {
    constructor() {
        super(TransactionProgressType.Broadcasting);
    }
}

export {
    Event,
    WalletEventType,
    WalletEvent,
    ConsolidationRequiredWalletEvent,
    LedgerAddressGenerationWalletEvent,
    NewOutputWalletEvent,
    SpentOutputWalletEvent,
    TransactionInclusionWalletEvent,
    TransactionProgressWalletEvent,
    TransactionProgress,
    SelectingInputsProgress,
    GeneratingRemainderDepositAddressProgress,
    PreparedTransactionProgress,
    PreparedTransactionEssenceHashProgress,
    SigningTransactionProgress,
    PerformingPowProgress,
    BroadcastingProgress,
    TransactionProgressType,
};
