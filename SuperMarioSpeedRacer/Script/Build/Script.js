"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Kart extends ƒ.Node {
        lastFrameTime;
        deltaTime;
        rb;
        acceleration = 1500;
        maxSpeed = 50;
        currentSteerFactor = 0;
        steeringSpeed = 3;
        maxSteerAngle = 50; //80
        currentSteerAngle = 0;
        constructor() {
            super("Kart");
            let cmpTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.translateY(0.5);
            this.addComponent(cmpTransform);
            let mesh = new ƒ.MeshCube();
            let material = ƒ.Project.resources["Material|2023-02-17T06:10:18.236Z|44182"];
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = new ƒ.Color(0.5, 1, 1, 1);
            this.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);
            this.rb = new ƒ.ComponentRigidbody();
            this.rb.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            this.rb.friction = 0.6;
            this.rb.effectGravity = 2;
            this.rb.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rb.restitution = 0;
            //this.rb.friction = 0;
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
                return;
            }
            if (isRearDriving) {
                xzVelocity = ƒ.Vector3.TRANSFORMATION(xzVelocity, ƒ.Matrix4x4.ROTATION_Y(180));
            }
            let lookAtVelocity = ƒ.Matrix4x4.LOOK_AT(ƒ.Vector3.ZERO(), xzVelocity, new ƒ.Vector3(0, 1, 0));
            this.rb.setRotation(lookAtVelocity.getEulerAngles());
        }
        slowResetSteerFactor() {
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
        //Grund für Glitch
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
            if (this.rb.collisions.length == 0) {
                return;
            }
            let defaultForward = new ƒ.Vector3(0, 0, 1);
            let kartForward = ƒ.Vector3.TRANSFORMATION(defaultForward, ƒ.Matrix4x4.ROTATION_Y(this.cmpTransform.mtxLocal.rotation.y));
            let dotKartForwardVelocity = ƒ.Vector3.DOT(kartForward, this.rb.getVelocity());
            let isRearDriving = dotKartForwardVelocity < 0 ? true : false;
            //vorwärts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
                let defaultVector = new ƒ.Vector3(0, 0, this.acceleration * this.deltaTime);
                //anlassen:
                let currentKartRotation = this.cmpTransform.mtxLocal.rotation;
                let rotatedVector = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));
                if (this.rb.getVelocity().magnitude < this.maxSpeed) {
                    this.rb.applyForce(rotatedVector);
                }
            }
            //bremsen
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
                let defaultVector = new ƒ.Vector3(0, 0, (isRearDriving ? 2 : 1) * -this.acceleration * this.deltaTime);
                let currentKartRotation = this.cmpTransform.mtxLocal.rotation;
                let rotatedVector = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));
                if (this.rb.getVelocity().magnitude < this.maxSpeed) {
                    this.rb.applyForce(rotatedVector);
                }
            }
            let isSteerInput;
            //rechts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
                this.decrementSteerFactor();
                isSteerInput = true;
            }
            //links
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                this.incrementSteerFactor();
                isSteerInput = true;
            }
            let isSteering = this.currentSteerAngle != 0;
            if (isSteering) {
                this.rotateKart(isRearDriving);
            }
            if (!isSteerInput) {
                this.slowResetSteerFactor();
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
    let rbRoundTrigger;
    let lapCount = 0;
    let maxLapCount = 2;
    let lapDisplay;
    let isKartInRoundTrigger;
    function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
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
        lapDisplay = document.querySelector("#lapDisplay");
        rbRoundTrigger = root.getChildrenByName("RoundTrigger")[0].getComponent(ƒ.ComponentRigidbody);
        rbRoundTrigger.collisionMask = ƒ.COLLISION_GROUP.GROUP_5;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        kart.update();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        checkRoundDriveThrough();
        ƒ.AudioManager.default.update();
    }
    function checkRoundDriveThrough() {
        if (rbRoundTrigger.triggerings.length > 0) {
            if (!isKartInRoundTrigger) {
                increaseLapCount();
            }
            isKartInRoundTrigger = true;
        }
        else {
            isKartInRoundTrigger = false;
        }
    }
    function increaseLapCount() {
        lapCount++;
        updateLapDisplay();
    }
    function updateLapDisplay() {
        lapDisplay.innerHTML = "Lap Count: " + lapCount;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map