"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Coin extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(Coin);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "Coin added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            console.log("constructor coin");
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            //this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            //this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
        }
        onTriggerEnter(event) {
            this.node.dispatchEvent(new CustomEvent("CoinTrigger", {
                bubbles: true,
                detail: this.node
            }));
            this.node.removeComponent(this);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    this.node.getComponent(ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_ENTER */, this.onTriggerEnter);
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.Coin = Coin;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Data {
        coinCount;
        millisecondsSinceStart;
        constructor(coinCount, millisecondsSinceStart) {
            this.coinCount = coinCount;
            this.millisecondsSinceStart = millisecondsSinceStart;
        }
        serialize() {
            let jsonString = ƒ.Serializer.stringify(this);
            //console.log(ƒ.Serializer.stringify(this));
            console.log(jsonString);
            //fs.writeFile("SavedData.json", jsonString, this.nooperation);
            return null;
        }
        nooperation = () => { };
        deserialize(_serialization) {
            //fs.readFileSync('foo.txt', 'utf8');
            throw new Error("Method not implemented.");
        }
    }
    Script.Data = Data;
})(Script || (Script = {}));
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
        steeringSpeed = 7;
        maxSteerAngle = 65; //80
        currentSteerAngle = 0;
        //spritess
        sprite;
        constructor(maxSpeed, acceleration, maxSteerAngle, steeringSpeed, mass, friction) {
            super("Kart");
            this.maxSpeed = maxSpeed;
            this.acceleration = acceleration;
            this.maxSteerAngle = maxSteerAngle;
            this.steeringSpeed = steeringSpeed;
            let cmpTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.translateY(1.5);
            this.addComponent(cmpTransform);
            //"MeshObj|2023-02-18T15:18:36.388Z|78878"
            let mesh = new ƒ.MeshCube();
            //let mesh: ƒ.MeshCube = <ƒ.MeshObj>ƒ.Project.resources["MeshObj|2023-02-18T15:27:32.374Z|13904"];
            let material = ƒ.Project.resources["Material|2023-02-17T06:10:18.236Z|44182"];
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = new ƒ.Color(0.5, 1, 1, 1);
            this.spriteSetup();
            this.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);
            this.rb = new ƒ.ComponentRigidbody();
            this.rb.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            this.rb.mass = mass;
            this.rb.friction = friction;
            this.rb.effectGravity = 2;
            this.rb.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rb.restitution = 0;
            //this.rb.friction = 0;
            this.addComponent(this.rb);
            this.lastFrameTime = new Date().getTime();
        }
        async spriteSetup() {
            this.sprite = await Script.setupSprite("Kart", [0, 0, 30, 30], 5, 32);
            this.sprite.mtxLocal.scale(new ƒ.Vector3(2, 2, 1));
            this.addChild(this.sprite);
        }
        update() {
            this.calculateDeltaTime();
            this.inputDrive();
            if (this.rb.getPosition().y < -20) {
                this.rb.setPosition(new ƒ.Vector3(0, 0, 0));
                this.rb.setVelocity(new ƒ.Vector3(0, 0, 1));
            }
            ;
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
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || Script.touchSideVertical == Script.TouchSideVertical.up) {
                let defaultVector = new ƒ.Vector3(0, 0, this.acceleration * this.deltaTime);
                //anlassen:
                let currentKartRotation = this.cmpTransform.mtxLocal.rotation;
                let rotatedVector = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));
                if (this.rb.getVelocity().magnitude < this.maxSpeed) {
                    this.rb.applyForce(rotatedVector);
                }
            }
            //bremsen
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]) || Script.touchSideVertical == Script.TouchSideVertical.down) {
                let defaultVector = new ƒ.Vector3(0, 0, (isRearDriving ? 2 : 1) * -this.acceleration * this.deltaTime);
                let currentKartRotation = this.cmpTransform.mtxLocal.rotation;
                let rotatedVector = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));
                if (this.rb.getVelocity().magnitude < this.maxSpeed) {
                    this.rb.applyForce(rotatedVector);
                }
            }
            let isSteerInput;
            //rechts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) || Script.touchSideHorizontal == Script.TouchSideHorizontal.right) {
                this.decrementSteerFactor();
                isSteerInput = true;
            }
            //links
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]) || Script.touchSideHorizontal == Script.TouchSideHorizontal.left) {
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
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    let root;
    let kart;
    let TouchSideVertical;
    (function (TouchSideVertical) {
        TouchSideVertical[TouchSideVertical["none"] = 0] = "none";
        TouchSideVertical[TouchSideVertical["up"] = 1] = "up";
        TouchSideVertical[TouchSideVertical["down"] = 2] = "down";
    })(TouchSideVertical = Script.TouchSideVertical || (Script.TouchSideVertical = {}));
    let TouchSideHorizontal;
    (function (TouchSideHorizontal) {
        TouchSideHorizontal[TouchSideHorizontal["none"] = 0] = "none";
        TouchSideHorizontal[TouchSideHorizontal["left"] = 1] = "left";
        TouchSideHorizontal[TouchSideHorizontal["right"] = 2] = "right";
    })(TouchSideHorizontal = Script.TouchSideHorizontal || (Script.TouchSideHorizontal = {}));
    Script.touchSideVertical = TouchSideVertical.none;
    Script.touchSideHorizontal = TouchSideHorizontal.none;
    let rbRoundTrigger;
    let maxLapCount = 2;
    let timer;
    let millisecondsSinceStart = 0;
    let isKartInRoundTrigger;
    let items;
    let coinsContainer;
    let gameWon;
    let externalData;
    let statistics;
    let soundsContainer;
    let soundCollect;
    let soundMusic;
    //-----------------------------------------------//
    //Start/Init
    //-----------------------------------------------//
    async function start(_event) {
        await getExternalData();
        viewport = _event.detail;
        root = viewport.getBranch();
        statistics = new Script.Statistics();
        adjustCamera();
        buildKart();
        initTrigger();
        items = root.getChildrenByName("Items")[0];
        initSounds();
        initCoins();
        initStartTimer();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    async function getExternalData() {
        let response = await fetch("externalData.json");
        console.log(response);
        externalData = await response.json();
    }
    function initSounds() {
        soundsContainer = root.getChildrenByName("Sounds")[0];
        soundCollect = soundsContainer.getChildrenByName("Collect")[0].getComponent(ƒ.ComponentAudio);
        soundMusic = soundsContainer.getChildrenByName("Music")[0].getComponent(ƒ.ComponentAudio);
        viewport.camera.node.addChild(soundCollect.node);
        viewport.camera.node.addChild(soundMusic.node);
        soundMusic.play(true);
    }
    function initStartTimer() {
        let time = new ƒ.Time();
        timer = new ƒ.Timer(time, 100, 99999, onTimerTick);
        timer.active = true;
    }
    function initCoins() {
        root.addEventListener("CoinTrigger", onCoinEnter);
        coinsContainer = items.getChildrenByName("Coins")[0];
    }
    function onCoinEnter(event) {
        statistics.coinCount = Number.parseInt(statistics.coinCount) + 1 + "";
        soundCollect.play(true);
        coinsContainer.removeChild(event.detail);
    }
    function initTrigger() {
        rbRoundTrigger = root.getChildrenByName("RoundTrigger")[0].getComponent(ƒ.ComponentRigidbody);
        rbRoundTrigger.collisionMask = ƒ.COLLISION_GROUP.GROUP_5;
    }
    function buildKart() {
        kart = new Script.Kart(externalData["maxSpeed"], externalData["acceleration"], externalData["maxSteerAngle"], externalData["steeringSpeed"], externalData["mass"], externalData["friction"]);
        kart.addChild(viewport.camera.node);
        root.addChild(kart);
    }
    function adjustCamera() {
        viewport.camera.mtxPivot.translateY(4);
        viewport.camera.mtxPivot.translateZ(22);
        viewport.camera.mtxPivot.rotateY(180);
        viewport.camera.mtxPivot.rotateX(4);
    }
    function onTouchMove(event) {
        Script.touchPos = new ƒ.Vector2(event.touches[0].clientX, event.touches[0].clientY);
        if (Script.touchPos.x < viewport.canvas.width / 2) {
            Script.touchSideHorizontal = TouchSideHorizontal.left;
        }
        if (Script.touchPos.x > viewport.canvas.width / 2) {
            Script.touchSideHorizontal = TouchSideHorizontal.right;
        }
        if (Script.touchPos.y < viewport.canvas.height / 2) {
            Script.touchSideVertical = TouchSideVertical.down;
        }
        if (Script.touchPos.y > viewport.canvas.height / 2) {
            Script.touchSideVertical = TouchSideVertical.up;
        }
    }
    function onTouchEnd(event) {
        Script.touchSideVertical = TouchSideVertical.none;
        Script.touchSideHorizontal = TouchSideHorizontal.none;
    }
    //-----------------------------------------------//
    //Main update cycle
    //-----------------------------------------------//
    function update(_event) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.BACKSPACE])) {
            increaseLapCount();
        }
        if (gameWon) {
            timer.active = false;
            return;
        }
        kart.update();
        try {
            ƒ.Physics.simulate(); // if physics is included and used
        }
        catch (Error) {
            console.warn(Error);
        }
        checkRoundDriveThrough();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    //-----------------------------------------------//
    //Timer
    //-----------------------------------------------//
    function onTimerTick() {
        millisecondsSinceStart += 100;
        updateTimerDisplay();
    }
    //-----------------------------------------------//
    //RoundLapse Management
    //-----------------------------------------------//
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
        statistics.lapCount = Number.parseInt(statistics.lapCount) + 1 + "";
        if (Number.parseInt(statistics.lapCount) > maxLapCount) {
            gameWinEnd();
        }
        //updateLapDisplay();
    }
    function gameWinEnd() {
        kart.getComponent(ƒ.ComponentRigidbody).typeBody = ƒ.BODY_TYPE.STATIC;
        gameWon = true;
        statistics.gameWonDisplay();
        //let saveData: Data = new Data(coinCount, millisecondsSinceStart);
        //saveData.serialize();
    }
    //-----------------------------------------------//
    //display updates
    //-----------------------------------------------//
    /*
    function updateLapDisplay(): void {
      lapDisplay.innerHTML = "Lap Count: " + lapCount;
    }
  */
    function updateTimerDisplay() {
        let tempSeconds = millisecondsSinceStart / 1000;
        let milliseconds = millisecondsSinceStart % 1000;
        let seconds = Math.floor(tempSeconds) % 60;
        let minutes = tempSeconds / 60;
        /*
           timeDisplay.innerHTML = "Time: " + Math.floor(minutes) + ":" + seconds + ":" + milliseconds;
         */
        statistics.time = "Time: " + Math.floor(minutes) + ":" + seconds + ":" + milliseconds;
    }
    /*
      function updateCoinDisplay() {
        coinDisplay.innerHTML = "Coin Count: " + coinCount;
      }
      */
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    async function setupSprite(_name, _position, _frames, _offset) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Sprites/sprites.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation(_name, coat);
        animation.generateByGrid(ƒ.Rectangle.GET(_position[0], _position[1], _position[2], _position[3]), _frames, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(_offset));
        let sprite = new ƒAid.NodeSprite("Sprite");
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = 6;
        let cmpTransfrom = new ƒ.ComponentTransform();
        sprite.addComponent(cmpTransfrom);
        return sprite;
    }
    Script.setupSprite = setupSprite;
    async function changeImage() {
        //change Sprite Image
    }
    Script.changeImage = changeImage;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUI = FudgeUserInterface;
    class Statistics extends ƒ.Mutable {
        lapCount = "0";
        time = "";
        coinCount = "0";
        controller;
        constructor(_timer) {
            super();
            let vuiHTML = document.querySelector("#vui");
            vuiHTML.setAttribute("style", "font-size: 20px");
            let customElement = ƒUI.Generator.createInterfaceFromMutable(this);
            vuiHTML.appendChild(customElement);
            this.controller = new ƒUI.Controller(this, customElement);
            this.controller.startRefresh();
            this.controller.updateUserInterface();
        }
        async gameWonDisplay() {
            await ƒUI.Dialog.prompt(this, true, "CONGRATULATIONS - Your stats:", "?");
        }
        updateMutator(_mutator) {
            console.log("updateMutator");
            super.updateMutator(_mutator);
        }
        reduceMutator(_mutator) {
        }
    }
    Script.Statistics = Statistics;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map