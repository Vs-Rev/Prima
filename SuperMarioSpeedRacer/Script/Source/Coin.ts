namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class Coin extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(Coin);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "Coin added to ";


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;


      console.log("constructor coin");

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);

      //this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      //this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);


    }

    private onTriggerEnter(event: ƒ.EventPhysics): void {

      this.node.dispatchEvent(new CustomEvent("CoinTrigger", {
        bubbles: true,
        detail: this.node
      }))

      this.node.removeComponent(this);
    }

    // Activate the functions of this component as response to events

    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:

          this.node.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);

          ƒ.Debug.log(this.message, this.node);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}