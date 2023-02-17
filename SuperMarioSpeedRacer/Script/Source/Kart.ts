namespace Script {
    import ƒ = FudgeCore;

    export class Kart extends ƒ.Node {


        private lastFrameTime: number;
        private deltaTime: number;
        private rb: ƒ.ComponentRigidbody;

        private acceleration: number = 700;

        private currentSteerFactor: number = 0;
        private steeringSpeed: number = 2;
        private maxSteerAngle: number = 40; //80
        private currentSteerAngle: number = 0;

        constructor() {
            super("Kart");

            console.log("new kart instance")


            let cmpTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.translateY(0.5);
            this.addComponent(cmpTransform);

            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            let material: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2023-01-24T19:28:56.343Z|78866"];
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
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

        public update(): void {

            this.calculateDeltaTime();
            this.inputDrive();
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
                console.log("return");
                return;
            }

            if (isRearDriving) {
                xzVelocity = ƒ.Vector3.TRANSFORMATION(xzVelocity, ƒ.Matrix4x4.ROTATION_Y(180));
            }

            let lookAtVelocity: ƒ.Matrix4x4 = ƒ.Matrix4x4.LOOK_AT(ƒ.Vector3.ZERO(), xzVelocity, new ƒ.Vector3(0, 1, 0));
            this.rb.setRotation(lookAtVelocity.getEulerAngles());

            //console.log(lookAtVelocity.getEulerAngles());
        }


        private resetSteerFactor() {

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

            //vorwärts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {

                let defaultVector: ƒ.Vector3 = new ƒ.Vector3(0, 0, this.acceleration * this.deltaTime);

                //let steerRotation: ƒ.Matrix4x4 = ƒ.Matrix4x4.ROTATION_Y(this.currentSteerAngle);

                let currentKartRotation: ƒ.Vector3 = this.cmpTransform.mtxLocal.rotation;

                //let rotatedVector: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultVector, steerRotation);

                //console.log(currentKartRotation.y);

                let rotatedVector: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));

                this.rb.applyForce(rotatedVector);
            }

            //bremsen
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {

                let defaultVector: ƒ.Vector3 = new ƒ.Vector3(0, 0, -this.acceleration * this.deltaTime);

                //let steerRotation: ƒ.Matrix4x4 = ƒ.Matrix4x4.ROTATION_Y(this.currentSteerAngle);

                let currentKartRotation: ƒ.Vector3 = this.cmpTransform.mtxLocal.rotation;

                //let rotatedVector: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultVector, steerRotation);

                //console.log(currentKartRotation.y);

                let rotatedVector: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultVector, ƒ.Matrix4x4.ROTATION_Y(currentKartRotation.y));

                this.rb.applyForce(rotatedVector);
            }

            let defaultForward: ƒ.Vector3 = new ƒ.Vector3(0, 0, 1);
            let kartForward: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(defaultForward, ƒ.Matrix4x4.ROTATION_Y(this.cmpTransform.mtxLocal.rotation.y));
            let dotKartForwardVelocity: number = ƒ.Vector3.DOT(kartForward, this.rb.getVelocity());
            let isRearDriving: boolean = dotKartForwardVelocity < 0 ? true : false;

            let isSteeringInput: boolean;

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
            } else {
                this.resetSteerFactor();
            }

            this.currentSteerAngle = this.currentSteerFactor * this.maxSteerAngle;

            //rotate rb velocity according to steerangle
            let rotatedVelocity: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(this.rb.getVelocity(), ƒ.Matrix4x4.ROTATION_Y( this.currentSteerAngle * (isRearDriving ? -1 : 1) * this.deltaTime));
            this.rb.setVelocity(rotatedVelocity);
        }
    }
}