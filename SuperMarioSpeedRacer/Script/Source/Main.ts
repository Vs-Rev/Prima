namespace Script {

  import ƒ = FudgeCore;


  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  window.addEventListener("touchmove", onTouchMove);
  window.addEventListener("touchend", onTouchEnd);


  let root: ƒ.Node;
  let kart: Kart;

  export enum TouchSideVertical {
    none, up, down
  }

  export enum TouchSideHorizontal {
    none, left, right
  }

  export let touchPos: ƒ.Vector2;
  export let touchSideVertical: TouchSideVertical = TouchSideVertical.none;
  export let touchSideHorizontal: TouchSideHorizontal = TouchSideHorizontal.none;

  let rbRoundTrigger: ƒ.ComponentRigidbody;

  let maxLapCount: number = 2;


  let timer: ƒ.Timer;
  let millisecondsSinceStart: number = 0;

  let isKartInRoundTrigger: boolean;

  let items: ƒ.Node;

  let coinsContainer: ƒ.Node;

  let gameWon: boolean;

  let externalData: ExternalData;
  interface ExternalData {
    [name: string]: number;
  }

  let statistics: Statistics;

  let soundsContainer: ƒ.Node;

  let soundCollect: ƒ.ComponentAudio;
  let soundMusic: ƒ.ComponentAudio;

//-----------------------------------------------//
  //Start/Init

//-----------------------------------------------//

  async function start(_event: CustomEvent): Promise<void> {

    await getExternalData();

    viewport = _event.detail;
    root = viewport.getBranch();

    statistics = new Statistics();
    
    adjustCamera();

    buildKart();

    initTrigger();

    items = root.getChildrenByName("Items")[0];

    initSounds();

    initCoins();

    initStartTimer();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }


  async function getExternalData(): Promise<void> {

    let response: Response = await fetch("externalData.json");
    console.log(response);
    externalData = await response.json();
  }


  function initSounds() {

    soundsContainer = root.getChildrenByName("Sounds")[0];

    soundCollect = soundsContainer.getChildrenByName("Collect")[0].getComponent(ƒ.ComponentAudio);
    soundMusic = soundsContainer.getChildrenByName("Music")[0].getComponent(ƒ.ComponentAudio);

    viewport.camera.node.addChild(soundCollect.node);
    viewport.camera.node.addChild(soundMusic.node);

    soundMusic.play(true);
  }



  function initStartTimer() {

    let time: ƒ.Time = new ƒ.Time();
    timer = new ƒ.Timer(time, 100, 99999, onTimerTick);
    timer.active = true;
  }

  function initCoins() {

    root.addEventListener("CoinTrigger", onCoinEnter);
    coinsContainer = items.getChildrenByName("Coins")[0];
  }

  function onCoinEnter(event: CustomEvent) {

    statistics.coinCount = Number.parseInt(statistics.coinCount) + 1 + "";

    soundCollect.play(true);

    coinsContainer.removeChild(event.detail);
  }

  function initTrigger() {

    rbRoundTrigger = root.getChildrenByName("RoundTrigger")[0].getComponent(ƒ.ComponentRigidbody);
    rbRoundTrigger.collisionMask = ƒ.COLLISION_GROUP.GROUP_5;
  }

  function buildKart() {

    kart = new Kart(externalData["maxSpeed"], externalData["acceleration"], externalData["maxSteerAngle"], externalData["steeringSpeed"], externalData["mass"], externalData["friction"]);
    kart.addChild(viewport.camera.node);
    root.addChild(kart);
  }

  function adjustCamera() {

    viewport.camera.mtxPivot.translateY(4);
    viewport.camera.mtxPivot.translateZ(22);
    viewport.camera.mtxPivot.rotateY(180);
    viewport.camera.mtxPivot.rotateX(4);
  }

  function onTouchMove(event: TouchEvent): void {

    touchPos = new ƒ.Vector2(event.touches[0].clientX, event.touches[0].clientY);


    if (touchPos.x < viewport.canvas.width / 2) {
      touchSideHorizontal = TouchSideHorizontal.left;
    }

    if (touchPos.x > viewport.canvas.width / 2) {
      touchSideHorizontal = TouchSideHorizontal.right;
    }

    if (touchPos.y < viewport.canvas.height / 2) {
      touchSideVertical = TouchSideVertical.down;
    }

    if (touchPos.y > viewport.canvas.height / 2) {
      touchSideVertical = TouchSideVertical.up;
    }

  }

  function onTouchEnd(event: TouchEvent): void {

    touchSideVertical = TouchSideVertical.none;
    touchSideHorizontal = TouchSideHorizontal.none;
  }

//-----------------------------------------------//
  //Main update cycle

//-----------------------------------------------//

  function update(_event: Event): void {

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.BACKSPACE])) {
      increaseLapCount();
    }

    if (gameWon) {
      timer.active = false;
      return;
    }

    kart.update();

    try {
      ƒ.Physics.simulate();  // if physics is included and used
    } catch (Error) {
      console.warn(Error);
    }

    checkRoundDriveThrough();

    viewport.draw();

    ƒ.AudioManager.default.update();
  }


//-----------------------------------------------//
  //Timer

//-----------------------------------------------//

  function onTimerTick(): void {

    millisecondsSinceStart += 100;

    updateTimerDisplay();
  }


//-----------------------------------------------//
  //RoundLapse Management

//-----------------------------------------------//

  function checkRoundDriveThrough() {

    if (rbRoundTrigger.triggerings.length > 0) {

      if (!isKartInRoundTrigger) {

        increaseLapCount();
      }

      isKartInRoundTrigger = true;

    } else {
      isKartInRoundTrigger = false;
    }
  }

  function increaseLapCount() {

    statistics.lapCount = Number.parseInt(statistics.lapCount) + 1 + "";

    if (Number.parseInt(statistics.lapCount) > maxLapCount) {
      gameWinEnd();
    }

    //updateLapDisplay();
  }

  function gameWinEnd() {

    kart.getComponent(ƒ.ComponentRigidbody).typeBody = ƒ.BODY_TYPE.STATIC;

    gameWon = true;

    statistics.gameWonDisplay();
    //let saveData: Data = new Data(coinCount, millisecondsSinceStart);
    //saveData.serialize();
  }



//-----------------------------------------------//
  //display updates

//-----------------------------------------------//

  /*
  function updateLapDisplay(): void {
    lapDisplay.innerHTML = "Lap Count: " + lapCount;
  }
*/

  function updateTimerDisplay(): void {

    let tempSeconds = millisecondsSinceStart / 1000;

    let milliseconds: number = millisecondsSinceStart % 1000;
    let seconds: number = Math.floor(tempSeconds) % 60;
    let minutes: number = tempSeconds / 60;
    /*
       timeDisplay.innerHTML = "Time: " + Math.floor(minutes) + ":" + seconds + ":" + milliseconds;
     */

    statistics.time = "Time: " + Math.floor(minutes) + ":" + seconds + ":" + milliseconds;
  }
  /*
    function updateCoinDisplay() {
      coinDisplay.innerHTML = "Coin Count: " + coinCount;
    }
    */
}