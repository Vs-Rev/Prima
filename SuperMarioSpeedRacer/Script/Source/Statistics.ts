namespace Script {

  import ƒ = FudgeCore;
  import ƒUI = FudgeUserInterface;

  export class Statistics extends ƒ.Mutable {
    
    public lapCount: string = "0";
    public time: string = "";
    public coinCount: string = "0";

    private controller: ƒUI.Controller;

    public constructor(_timer?: number) {

      super();

      let vuiHTML: HTMLParagraphElement = document.querySelector("#vui");

      let customElement: HTMLDivElement=  ƒUI.Generator.createInterfaceFromMutable(this);
      vuiHTML.appendChild(customElement);
      this.controller = new ƒUI.Controller(this, customElement);

      this.controller.startRefresh();
      this.controller.updateUserInterface();
    }

    public async gameWonDisplay(): Promise<void> {
      await ƒUI.Dialog.prompt(this, true, "You won the game!!! Here are your stats:", "Play again?");
    }


    override updateMutator(_mutator: ƒ.Mutator): void {
      console.log("updateMutator");
      super.updateMutator(_mutator);

    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {// 
    }
  }
}