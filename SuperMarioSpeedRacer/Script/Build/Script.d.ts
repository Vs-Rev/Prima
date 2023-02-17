declare namespace Script {
    import ƒ = FudgeCore;
    class Kart extends ƒ.Node {
        private lastFrameTime;
        private deltaTime;
        private rb;
        private acceleration;
        private currentSteerFactor;
        private steeringSpeed;
        private maxSteerAngle;
        private currentSteerAngle;
        constructor();
        update(): void;
        private calculateDeltaTime;
        private rotateKart;
        private resetSteerFactor;
        private decrementSteerFactor;
        private incrementSteerFactor;
        private inputDrive;
    }
}
declare namespace Script {
}
