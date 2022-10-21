namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  let mischa: ƒ.Node;
  let graph: ƒ.Node;
  let walkspeed: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    mischa = graph.getChildrenByName("Mischa")[0];
    loadsprite();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }
  async function loadsprite(): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("Ressources/Sprites/MischaWRight.png");

    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(
      "mischa",
      coat
    );
    animation.generateByGrid(
      ƒ.Rectangle.GET(0, 0, 20, 20),
      0,
      70,
      ƒ.ORIGIN2D.CENTER,
      ƒ.Vector2.X(0)
    );
    let sprite: ƒAid.NodeSprite = new ƒAid.NodeSprite("MischaWalk");
    sprite.setAnimation(animation);
    sprite.setFrameDirection(1);
    sprite.framerate = 6;

    let cmpTransfrom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
    sprite.addComponent(cmpTransfrom);
    mischa.addChild(sprite);
  }

  function update(_event: Event): void {
    if (
      ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])
    ) {
      walkspeed.set(1 / 30, 0, 0);
    } else if (
      ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])
    ) {
      walkspeed.set(-1 / 30, 0, 0);
    } else {
      walkspeed.set(0, 0, 0);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      walkspeed.set(0, 1 / 10, 0);
    }
    //Verschiebt den Mischa nach Walkspeed
    mischa.mtxLocal.translate(walkspeed);

    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}
