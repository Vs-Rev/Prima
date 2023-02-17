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

    //viewport.camera.mtxPivot.translateY(3.5);
    viewport.camera.mtxPivot.translateY(4);
    //viewport.camera.mtxPivot.translateZ(15);
    viewport.camera.mtxPivot.translateZ(22);
    viewport.camera.mtxPivot.rotateY(180);
    //viewport.camera.mtxPivot.rotateX(15);
    viewport.camera.mtxPivot.rotateX(4);





    kart.addChild(viewport.camera.node);
    

    root.addChild(kart);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    kart.update();

    ƒ.Physics.simulate();  // if physics is included and used

    viewport.draw();

    
    ƒ.AudioManager.default.update();
  }
}