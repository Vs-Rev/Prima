namespace Script {
    import ƒ = FudgeCore;


    export class Kart extends ƒ.Node {


        private lastFrameTime: number;
        private deltaTime: number;
        private rb: ƒ.ComponentRigidbody;

        private acceleration: number = 1500;
        private maxSpeed: number = 50;

        private currentSteerFactor: number = 0;
        private steeringSpeed: number = 7;
        private maxSteerAngle: number = 65; //80
        private currentSteerAngle: number = 0;

        constructor(maxSpeed: number, acceleration: number, maxSteerAngle: number, steeringSpeed: number, mass: number, friction: number) {

            super("Kart");
            this.maxSpeed = maxSpeed;

            this.acceleration = acceleration;
            this.maxSteerAngle = maxSteerAngle;
            this.steeringSpeed = steeringSpeed;


            let cmpTransform = new ƒ.ComponentTransform();

            cmpTransform.mtxLocal.translateY(1.5);

            this.addComponent(cmpTransform);
            //"MeshObj|2023-02-18T15:18:36.388Z|78878"
            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            //let mesh: ƒ.MeshCube = <ƒ.MeshObj>ƒ.Project.resources["MeshObj|2023-02-18T15:27:32.374Z|13904"];
            let material: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2023-02-17T06:10:18.236Z|44182"];
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = new ƒ.Color(0.5, 1, 1, 1);



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

        public update(): void {

            this.calculateDeltaTime();
            this.inputDrive();
            if (this.rb.getPosition().y < -20){
                this.rb.setPosition(new ƒ.Vector3(0,0,0))
                this.rb.setVelocity(new ƒ.Vector3(0,0,1))
                };
        }


        private calculateDeltaTime() {

            let currentTime = new Date().getTime();
            this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
            this.lastFrameTime = currentTime;
        }

        private rotateKart(isRearDriving: boolean) {

            let currentVelocity: ƒ.Vector3 = this.rb.getVelocity();

            let xzVelocity: ƒ.Vector3 = new ƒ.Vector3(currentVelocity.x, 0, currentVelocity.z);

            if (xzVelocity.magnitude <= 0.01) {
                return;
            }

            if (isRearDriving) {
                xzVelocity = ƒ.Vector3.TRANSFORMATION(xzVelocity, ƒ.Matrix4x4.ROTATION_Y(180));
            }

            let lookAtVelocity: ƒ.Matrix4x4 = ƒ.Matrix4x4.LOOK_AT(ƒ.Vector3.ZERO(), xzVelocity, new ƒ.Vector3(0, 1, 0));
            this.rb.setRotation(lookAtVelocity.getEulerAngles());
        }


        private slowResetSteerFactor() {

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
        private decrementSteerFactor() {

            this.currentSteerFactor -= this.steeringSpeed * this.deltaTime;

            if (this.currentSteerFactor < -1) {
                this.currentSteerFactor = -1;
            }
        }

        private incrementSteerFactor() {

            this.currentSteerFactor += this.steeringSpeed * this.deltaTime;

            if (this.currentSteerFactor > 1) {
                this.currentSteerFactor = 1;
            }
        }

        private inputDrive(): void {

            if (this.rb.collisions.length == 0) {
                return;
            }


            let defaultForward: ƒ.Vector3 = new ƒ.Vector3(0, 0, 1);
            let kartForward: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultForward, ƒ.Matrix4x4.ROTATION_Y(this.cmpTransform.mtxLocal.rotation.y));
            let dotKartForwardVelocity: number = ƒ.Vector3.DOT(kartForward, this.rb.getVelocity());
            let isRearDriving: boolean = dotKartForwardVelocity < 0 ? true : false;

            //vorwärts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) || touchSideVertical == TouchSideVertical.up) {

                let defaultVector: ƒ.Vector3 = new ƒ.Vector3(0, 0, this.acceleration * this.deltaTime);

                //anlassen:
                let currentKartRotation: ƒ.Vector3 = this.cmpTransform.mtxLocal.rotation;

                let rotatedVector: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));

                if (this.rb.getVelocity().magnitude < this.maxSpeed) {
                    this.rb.applyForce(rotatedVector);
                }
            }

            //bremsen
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])  || touchSideVertical == TouchSideVertical.down) {

                let defaultVector: ƒ.Vector3 = new ƒ.Vector3(0, 0, (isRearDriving ? 2 : 1) * -this.acceleration * this.deltaTime);

                let currentKartRotation: ƒ.Vector3 = this.cmpTransform.mtxLocal.rotation;

                let rotatedVector: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));

                if (this.rb.getVelocity().magnitude < this.maxSpeed) {
                    this.rb.applyForce(rotatedVector);
                }
            }

            let isSteerInput: boolean;

            //rechts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])  || touchSideHorizontal == TouchSideHorizontal.right) {

                this.decrementSteerFactor();

                isSteerInput = true;
            }
            //links
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]) || touchSideHorizontal == TouchSideHorizontal.left) {

                this.incrementSteerFactor();

                isSteerInput = true;
            }


            let isSteering: boolean = this.currentSteerAngle != 0;

            if (isSteering) {
                this.rotateKart(isRearDriving);
            }

            if (!isSteerInput) {
                this.slowResetSteerFactor();
            }

            this.currentSteerAngle = this.currentSteerFactor * this.maxSteerAngle;



            //rotate rb velocity according to steerangle
            let rotatedVelocity: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(this.rb.getVelocity(), ƒ.Matrix4x4.ROTATION_Y(this.currentSteerAngle * (isRearDriving ? -1 : 1) * this.deltaTime));
            this.rb.setVelocity(rotatedVelocity);
        }
    }
}