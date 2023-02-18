namespace Script {

  import ƒ = FudgeCore;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let root: ƒ.Node;
  let kart: Kart;

  let rbRoundTrigger: ƒ.ComponentRigidbody;

  let lapCount: number = 0;
  let maxLapCount: number = 2;
  let lapDisplay: HTMLParagraphElement;

  let coinCount: number = 0;
  let coinDisplay: HTMLParagraphElement;

  let timer: ƒ.Timer;
  let millisecondsSinceStart: number = 0;
  let timeDisplay: HTMLParagraphElement;

  let isKartInRoundTrigger: boolean;

  let items: ƒ.Node;

  let coinsContainer: ƒ.Node;
  let coinsList: ƒ.ComponentRigidbody[] = [];

  let gameWon: boolean;


  ///////////////////////////////////////////////////////
  //Start/Init
  ///////////////////////////////////////////////////////

  function start(_event: CustomEvent): void {

    viewport = _event.detail;
    root = viewport.getBranch();

    adjustCamera();

    buildKart();

    querySelectDisplays();

    initTrigger();

    items = root.getChildrenByName("Items")[0];

    initCoins();

    initStartTimer();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function initStartTimer() {
    let time: ƒ.Time = new ƒ.Time();
    timer = new ƒ.Timer(time, 100, 99999, onTimerTick);
    timer.active = true;
  }

  function initCoins() {
    coinsContainer = items.getChildrenByName("Coins")[0];
    let coins: ƒ.Node[] = coinsContainer.getChildrenByName("PRF_Coin");
    coins.forEach(coin => coinsList.push(coin.getComponent(ƒ.ComponentRigidbody)));
  }

  function initTrigger() {
    rbRoundTrigger = root.getChildrenByName("RoundTrigger")[0].getComponent(ƒ.ComponentRigidbody);
    rbRoundTrigger.collisionMask = ƒ.COLLISION_GROUP.GROUP_5;
  }

  function querySelectDisplays() {
    lapDisplay = <HTMLParagraphElement>document.querySelector("#lapDisplay");
    coinDisplay = <HTMLParagraphElement>document.querySelector("#coinDisplay");
    timeDisplay = <HTMLParagraphElement>document.querySelector("#timeDisplay");
  }

  function buildKart() {
    kart = new Kart();
    kart.addChild(viewport.camera.node);
    root.addChild(kart);
  }

  function adjustCamera() {
    viewport.camera.mtxPivot.translateY(4);
    viewport.camera.mtxPivot.translateZ(22);
    viewport.camera.mtxPivot.rotateY(180);
    viewport.camera.mtxPivot.rotateX(4);
  }

  ///////////////////////////////////////////////////////
  //Main update cycle
  ///////////////////////////////////////////////////////

  function update(_event: Event): void {


    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.BACKSPACE])) {

      lapCount++;

      increaseLapCount();

    }

    if (gameWon) {
      timer.active = false;
      return;
    }

    kart.update();

    ƒ.Physics.simulate();  // if physics is included and used


    checkRoundDriveThrough();

    updateCoins();

    viewport.draw();

    ƒ.AudioManager.default.update();
  }

  ///////////////////////////////////////////////////////
  //Timer
  ///////////////////////////////////////////////////////

  function onTimerTick(): void {

    millisecondsSinceStart += 100;

    updateTimerDisplay();
  }

  ///////////////////////////////////////////////////////
  //RoundLapse Management
  ///////////////////////////////////////////////////////

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

    lapCount++;

    if (lapCount > maxLapCount) {
      gameWinEnd();
    }

    updateLapDisplay();
  }

  function gameWinEnd() {

    kart.getComponent(ƒ.ComponentRigidbody).typeBody = ƒ.BODY_TYPE.STATIC;

    gameWon = true;

    let saveData: Data = new Data(coinCount, millisecondsSinceStart);

    saveData.serialize();
  }


  ///////////////////////////////////////////////////////
  //display updates
  ///////////////////////////////////////////////////////

  function updateLapDisplay(): void {
    lapDisplay.innerHTML = "Lap Count: " + lapCount;
  }

  function updateTimerDisplay(): void {

    let tempSeconds = millisecondsSinceStart / 1000;

    let milliseconds: number = millisecondsSinceStart % 1000;
    let seconds: number = Math.floor(tempSeconds) % 60;
    let minutes: number = tempSeconds / 60;

    timeDisplay.innerHTML = "Time: " + Math.floor(minutes) + ":" + seconds + ":" + milliseconds;
  }

  function updateCoinDisplay() {
    coinDisplay.innerHTML = "Coin Count: " + coinCount;
  }

  ///////////////////////////////////////////////////////
  //coins
  ///////////////////////////////////////////////////////

  function updateCoins() {
    coinsList.forEach(coin => checkTriggering(coin));
  }

  function checkTriggering(coin: ƒ.ComponentRigidbody) {

    if (coin.triggerings.length > 0) {

      collectCoin(coin);
    }
  }

  function collectCoin(coin: ƒ.ComponentRigidbody) {

    coinsContainer.removeChild(coin.node);

    coinCount++;

    updateCoinDisplay();
  }
}




