namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  //initialize Viewport
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    hndLoad(_event);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }
  let walkAnimation: ƒAid.SpriteSheetAnimation;

  function loadAnimations(coat: ƒ.CoatTextured) {
    walkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    walkAnimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
  }

  //Load Sprite
  let player: ƒAid.NodeSprite;
  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Ressources/Sprites/MischaWRight.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    loadAnimations(coat);

    player = new ƒAid.NodeSprite("Sprite");
    player.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    player.setAnimation(walkAnimation);
    player.setFrameDirection(1);
    player.framerate = 20;

    player.mtxLocal.translateY(-.3);
    player.mtxLocal.translateX(-1);
    player.mtxLocal.translateZ(1.001);

    let branch: ƒ.Node = viewport.getBranch();
    let mischa: ƒ.Node = branch.getChildrenByName("Mischa")[0];
    mischa.addChild(player);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
  }

  let leftDirection: boolean = false;
  let lastLeftDirection: boolean = false;
  let speed: number = .8;
  let prevSprint: boolean = false;

  function update(_event: Event): void {
    speed = .9;
    if (leftDirection) {
      speed = -.9
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
      speed = 2;
      if (leftDirection) {
        speed = -2;
      }
    }
  }

  function originalupdate(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
  
}