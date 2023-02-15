declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Kart extends ƒ.Node {
        private lastFrameTime;
        private deltaTime;
        constructor();
        update(): void;
        calculateDeltaTime(): void;
        private move;
    }
}
declare namespace Script {
}
