namespace Script {
    import ƒ = FudgeCore;

    export class Kart extends ƒ.Node {


        private lastFrameTime: number;
        private deltaTime: number;

        constructor() {
            super("Kart");

            console.log("new kart instance")

            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            let material: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2023-01-24T19:28:56.343Z|78866"];
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = new ƒ.Color(0.5, 1, 1, 1);

            this.addComponent(new ƒ.ComponentTransform());

            this.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);

            this.lastFrameTime = new Date().getTime();
        }

        public update(): void {
            this.calculateDeltaTime();
            this.move();
        }

        calculateDeltaTime() {

            let currentTime = new Date().getTime();
            this.deltaTime = (currentTime - this.lastFrameTime)/1000;
            this.lastFrameTime = currentTime;
        }

        private move(): void {
            //rechts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
                this.mtxLocal.rotateY(-50 * this.deltaTime);
            }
            //links
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                this.mtxLocal.rotateY(50 * this.deltaTime);
            }
            //vorwärts
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
                this.mtxLocal.translateZ(0.1);

                //console.log(this.mtxWorld);
                console.log(this.mtxLocal.translation.z);

            }
            //bremsen
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {

            }

        }
    }
}