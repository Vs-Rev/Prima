"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Kart extends ƒ.Node {
        lastFrameTime;
        deltaTime;
        rb;
        acceleration = 500;
        currentSteerFactor = 0;
        steeringSpeed = 5;
        maxSteerAngle = 80;
        currentSteerAngle = 0;
        constructor() {
            super("Kart");
            console.log("new kart instance");
            let cmpTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.translateY(0.5);
            this.addComponent(cmpTransform);
            let mesh = new ƒ.MeshCube();
            let material = ƒ.Project.resources["Material|2023-01-24T19:28:56.343Z|78866"];
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = new ƒ.Color(0.5, 1, 1, 1);
            this.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);
            this.rb = new ƒ.ComponentRigidbody();
            this.rb.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            this.rb.friction = 0.98;
            this.addComponent(this.rb);
            this.lastFrameTime = new Date().getTime();
        }
        update() {
            this.calculateDeltaTime();
            this.inputDrive();
        }
        calculateDeltaTime() {
            let currentTime = new Date().getTime();
            this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
            this.lastFrameTime = currentTime;
        }
        rotateKart(isRearDriving) {
            let currentVelocity = this.rb.getVelocity();
            let xzVelocity = new ƒ.Vector3(currentVelocity.x, 0, currentVelocity.z);
            if (xzVelocity.magnitude <= 0.01) {
                console.log("return");
                return;
            }
            if (isRearDriving) {
                xzVelocity = ƒ.Vector3.TRANSFORMATION(xzVelocity, ƒ.Matrix4x4.ROTATION_Y(180));
            }
            let lookAtVelocity = ƒ.Matrix4x4.LOOK_AT(ƒ.Vector3.ZERO(), xzVelocity, new ƒ.Vector3(0, 1, 0));
            this.rb.setRotation(lookAtVelocity.getEulerAngles());
            //console.log(lookAtVelocity.getEulerAngles());
        }
        resetSteerFactor() {
            if (this.currentSteerFactor < 0) {
                this.currentSteerFactor += this.steeringSpeed / 2 * this.deltaTime;
                //conditional if
                this.currentSteerFactor = this.currentSteerFactor > 0 ? 0 : this.currentSteerFactor;
            }
            if (this.currentSteerFactor > 0) {
                this.currentSteerFactor -= this.steeringSpeed / 2 * this.deltaTime;
                //conditional if
                this.currentSteerFactor = this.currentSteerFactor < 0 ? 0 : this.currentSteerFactor;
            }
        }
        decrementSteerFactor() {
            this.currentSteerFactor -= this.steeringSpeed * this.deltaTime;
            if (this.currentSteerFactor < -1) {
                this.currentSteerFactor = -1;
            }
        }
        incrementSteerFactor() {
            this.currentSteerFactor += this.steeringSpeed * this.deltaTime;
            if (this.currentSteerFactor > 1) {
                this.currentSteerFactor = 1;
            }
        }
        inputDrive() {
            //vorwärts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
                let defaultVector = new ƒ.Vector3(0, 0, this.acceleration * this.deltaTime);
                //let steerRotation: ƒ.Matrix4x4 = ƒ.Matrix4x4.ROTATION_Y(this.currentSteerAngle);
                let currentKartRotation = this.cmpTransform.mtxLocal.rotation;
                //let rotatedVector: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultVector, steerRotation);
                //console.log(currentKartRotation.y);
                let rotatedVector = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));
                this.rb.applyForce(rotatedVector);
            }
            //bremsen
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                let defaultVector = new ƒ.Vector3(0, 0, -this.acceleration * this.deltaTime);
                //let steerRotation: ƒ.Matrix4x4 = ƒ.Matrix4x4.ROTATION_Y(this.currentSteerAngle);
                let currentKartRotation = this.cmpTransform.mtxLocal.rotation;
                //let rotatedVector: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultVector, steerRotation);
                //console.log(currentKartRotation.y);
                let rotatedVector = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));
                this.rb.applyForce(rotatedVector);
            }
            let defaultForward = new ƒ.Vector3(0, 0, 1);
            let kartForward = ƒ.Vector3.TRANSFORMATION(defaultForward, ƒ.Matrix4x4.ROTATION_Y(this.cmpTransform.mtxLocal.rotation.y));
            let dotKartForwardVelocity = ƒ.Vector3.DOT(kartForward, this.rb.getVelocity());
            let isRearDriving = dotKartForwardVelocity < 0 ? true : false;
            let isSteeringInput;
            //rechts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
                this.decrementSteerFactor();
                isSteeringInput = true;
            }
            //links
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                this.incrementSteerFactor();
                isSteeringInput = true;
            }
            if (isSteeringInput) {
                this.rotateKart(isRearDriving);
            }
            else {
                this.resetSteerFactor();
            }
            this.currentSteerAngle = this.currentSteerFactor * this.maxSteerAngle;
            //rotate rb velocity according to steerangle
            let rotatedVelocity = ƒ.Vector3.TRANSFORMATION(this.rb.getVelocity(), ƒ.Matrix4x4.ROTATION_Y(this.currentSteerAngle * (isRearDriving ? -1 : 1) * this.deltaTime));
            this.rb.setVelocity(rotatedVelocity);
        }
    }
    Script.Kart = Kart;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let root;
    let kart;
    function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
        root.getChildrenByName("");
        kart = new Script.Kart();
        //viewport.camera.mtxPivot.translateY(3.5);
        viewport.camera.mtxPivot.translateY(4);
        //viewport.camera.mtxPivot.translateZ(15);
        viewport.camera.mtxPivot.translateZ(22);
        viewport.camera.mtxPivot.rotateY(180);
        //viewport.camera.mtxPivot.rotateX(15);
        viewport.camera.mtxPivot.rotateX(4);
        kart.addChild(viewport.camera.node);
        root.addChild(kart);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        kart.update();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map