namespace Script {

    import ƒ = FudgeCore;

    export class Data implements ƒ.Serializable {

        private coinCount: number;
        private millisecondsSinceStart: number;

        constructor(coinCount: number, millisecondsSinceStart: number) {

            this.coinCount = coinCount;
            this.millisecondsSinceStart = millisecondsSinceStart;
        }

        serialize(): ƒ.Serialization {

            let jsonString: string = ƒ.Serializer.stringify(this);
            //console.log(ƒ.Serializer.stringify(this));
            console.log(jsonString);

            //fs.writeFile("SavedData.json", jsonString, this.nooperation);
            return null;
        }
        
        nooperation = () => {};

        deserialize(_serialization: ƒ.Serialization): Promise<ƒ.Serializable> {
            
            //fs.readFileSync('foo.txt', 'utf8');
            
            throw new Error("Method not implemented.");
        }
    }
}