declare namespace Script {
    import ƒ = FudgeCore;
    class Coin extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        private onTriggerEnter;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Data implements ƒ.Serializable {
        private coinCount;
        private millisecondsSinceStart;
        constructor(coinCount: number, millisecondsSinceStart: number);
        serialize(): ƒ.Serialization;
        nooperation: () => void;
        deserialize(_serialization: ƒ.Serialization): Promise<ƒ.Serializable>;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Kart extends ƒ.Node {
        private lastFrameTime;
        private deltaTime;
        private rb;
        private acceleration;
        private maxSpeed;
        private currentSteerFactor;
        private steeringSpeed;
        private maxSteerAngle;
        private currentSteerAngle;
        constructor(maxSpeed: number, acceleration: number, maxSteerAngle: number, steeringSpeed: number, mass: number, friction: number);
        update(): void;
        private calculateDeltaTime;
        private rotateKart;
        private slowResetSteerFactor;
        private decrementSteerFactor;
        private incrementSteerFactor;
        private inputDrive;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    enum TouchSideVertical {
        none = 0,
        up = 1,
        down = 2
    }
    enum TouchSideHorizontal {
        none = 0,
        left = 1,
        right = 2
    }
    let touchPos: ƒ.Vector2;
    let touchSideVertical: TouchSideVertical;
    let touchSideHorizontal: TouchSideHorizontal;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Statistics extends ƒ.Mutable {
        lapCount: string;
        time: string;
        coinCount: string;
        private controller;
        constructor(_timer?: number);
        gameWonDisplay(): Promise<void>;
        updateMutator(_mutator: ƒ.Mutator): void;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
