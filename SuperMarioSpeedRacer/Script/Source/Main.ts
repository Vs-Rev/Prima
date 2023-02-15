namespace Script {
  import ƒ = FudgeCore;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let root: ƒ.Node;
  let kart: Kart;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;


    root = viewport.getBranch();

    root.getChildrenByName("")

    kart = new Kart();
    root.addChild(kart);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();

    kart.update();

    ƒ.AudioManager.default.update();
  }
}