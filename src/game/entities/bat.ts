import { Entity, WORLD_WIDTH, isColliding } from "../aux/aux";
import { Collider } from "../collider/collider";
import { Game } from "../scenes/Game";
import { destroyBall } from "./ball";
import { hitJett } from "./jett";

const BREAK_ACCELERATION = 20000;
const JUMP_COUNTER_MAX = 50;
const MAX_ENDIABRADO = 20;
const DEVIL = "devil";
const MAX_VEL = 1000;
export type Bat = {
    jump: boolean;
    jumpCounter: number;
    w: boolean;
    info: Entity;
    food: number;
    endiabrado: number;
    invisible: boolean;
    dead: boolean;
    collideGround?: Collider;
    direction: "left" | "right";
    miauCoolDown: boolean;
    miau: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    miauActive: boolean;
};

const MIAU = "miau";

export const preloadBat = (game: Game) => {
    game.load.spritesheet("cat", "cat.png", {
        frameHeight: 128,
        frameWidth: 128,
    });
    game.load.spritesheet(DEVIL, "devil.png", {
        frameWidth: 128,
        frameHeight: 128,
    });

    game.load.spritesheet(MIAU, "miau.png", {
        frameWidth: 128,
        frameHeight: 128,
    });
    game.bat = {
        invisible: false,
        jump: false,
        jumpCounter: 0,
        w: false,
        info: {} as Entity,
        food: 0,
        endiabrado: 0,
        dead: false,
        direction: "right",
        miauCoolDown: false,
        miau: {} as Phaser.Types.Physics.Arcade.SpriteWithStaticBody,
        miauActive: false,
    };
};

export const createBatMap = (game: Game, x: number, y: number) => {
    game.bat.info = game.physics.add
        .sprite(x, y, "cat")
        .setMaxVelocity(MAX_VEL);
    game.bat.miau = game.physics.add.staticSprite(x + 128, y, MIAU);
    game.bat.info.setDepth(1);
};

const LEFT = "left";
const RIGHT = "right";
const TURN = "turn";

const DEVIL_LEFT = "left_devil";
const DEVIL_RIGHT = "right_devil";
const DEVIL_TURN = "turn_devil";

function turn(bat: Bat) {
    animated(bat, TURN, DEVIL_TURN);
}

const breakAcceleration = (game: Game) => {
    const acceleration = game.bat.info.body.acceleration.x;
    const sign = Math.sign(acceleration);
    const acc = Math.abs(acceleration);

    if (acc === BREAK_ACCELERATION) {
        const velocity = game.bat.info.body.velocity.x;
        if ((sign > 0 && velocity > 0) || (sign < 0 && velocity < 0)) {
            game.bat.info.setVelocityX(0);
            game.bat.info.setAccelerationX(0);
        }
    } else {
        if (sign < 0) game.bat.info.setAccelerationX(+BREAK_ACCELERATION);
        if (sign > 0) game.bat.info.setAccelerationX(-BREAK_ACCELERATION);
    }

    if (acc === BREAK_ACCELERATION) turn(game.bat);
};

const jump = (game: Game) => {
    const { W, J } = game.control;
    const { bat } = game;
    const mt = J.isDown ? 2 : 1;
    if (J.isDown) game.bat.info.setMaxVelocity(MAX_VEL);
    if (J.isUp) game.bat.info.setMaxVelocity(MAX_VEL);

    if (W.isUp) bat.w = true;
    if (W.isDown && game.bat.info.body.touching.down && bat.w) {
        game.bat.info.setVelocityY(-10000 * mt);
        game.bat.info.setAccelerationX(0);
        bat.jump = true;
        bat.jumpCounter = 0;
        bat.w = false;
    }
    if (bat.jump && W.isDown && bat.jumpCounter < JUMP_COUNTER_MAX) {
        bat.jumpCounter++;
    } else if (bat.jump) {
        const newVelocity =
            game.bat.info.body.velocity.y < 0
                ? 0
                : game.bat.info.body.velocity.y;
        game.bat.info.setVelocityY(newVelocity);
        bat.jump = false;
    }
};

function left(bat: Bat) {
    animated(bat, LEFT, DEVIL_LEFT);
}

function right(bat: Bat) {
    animated(bat, RIGHT, DEVIL_RIGHT);
}

function followPlayer(game: Game) {
    if (game.jett.start) return;
    const { x } = game.bat.info;
    const halfWorld = WORLD_WIDTH / 2;

    if (x > halfWorld && x < game.physics.world.bounds.width - halfWorld)
        game.cameras.main.scrollX = x - halfWorld;
    else if (x <= halfWorld) game.cameras.main.scrollX = 0;
    else if (x >= game.physics.world.bounds.width - WORLD_WIDTH) {
        game.cameras.main.scrollX =
            game.physics.world.bounds.width - WORLD_WIDTH;
        game.physics.world.bounds.x =
            game.physics.world.bounds.width - WORLD_WIDTH;
        game.physics.world.bounds.width = WORLD_WIDTH;
        game.jett.start = true;
    }
}

export const updateBat = (game: Game) => {
    followPlayer(game);
    const { A, D, J, K } = game.control;

    const { bat } = game;

    if (bat.dead) return;

    const ACC = J.isDown ? 1000 : 500;

    if (bat.direction === "right") {
        bat.miau.setX(bat.info.x + 128);
        bat.miau.setY(bat.info.y);
        bat.miau.setFlipX(false);
    } else if (bat.direction === "left") {
        bat.miau.setX(bat.info.x - 128);
        bat.miau.setY(bat.info.y);
        bat.miau.setFlipX(true);
    }
    if (K.isDown && !bat.miauCoolDown && isEndiabrado(bat)) {
        bat.miauActive = true;
        bat.miauCoolDown = true;

        bat.miau.play(MIAU).on("animationcomplete", () => {
            bat.miauActive = false;
            setTimeout(() => (bat.miauCoolDown = false), 500);
        });
        return;
    }

    if (bat.miauActive) {
        game.balls
            .filter(({ info }) => isColliding(bat.miau, info))
            .forEach((ball) => {
                destroyBall(game, ball);
            });
        if (isColliding(game.jett.info, bat.miau)) {
            hitJett(game);
        }
    }

    if (A.isDown) {
        bat.direction = "left";
        const vel = game.bat.info.body.velocity.x;
        if (vel >= 0) {
            game.bat.info.setAccelerationX(-20000);
        } else {
            if (game.bat.info.body.touching.down)
                game.bat.info.setAccelerationX(-ACC);
            else game.bat.info.setAccelerationX(-100);
        }

        left(game.bat);
    } else if (D.isDown) {
        bat.direction = "right";
        const vel = game.bat.info.body.velocity.x;
        if (vel <= 0) {
            game.bat.info.setAccelerationX(+20000);
        } else {
            if (game.bat.info.body.touching.down)
                game.bat.info.setAccelerationX(ACC);
            else game.bat.info.setAccelerationX(100);
        }
        right(game.bat);
    } else {
        if (game.bat.info.body.touching.down) breakAcceleration(game);
    }

    jump(game);
};

export const createBatAnime = (game: Game) => {
    game.anims.create({
        key: LEFT,
        frames: game.anims.generateFrameNumbers("cat", {
            start: 5,
            end: 6,
        }),
        repeat: -1,
        frameRate: 4,
    });

    game.anims.create({
        key: TURN,
        frames: game.anims.generateFrameNumbers("cat", {
            start: 0,
            end: 2,
        }),

        frameRate: 3,
        repeat: -1,
    });

    game.anims.create({
        key: RIGHT,
        frames: game.anims.generateFrameNumbers("cat", {
            start: 3,
            end: 4,
        }),
        frameRate: 4,
        repeat: -1,
    });

    game.anims.create({
        key: DEVIL_LEFT,
        frames: game.anims.generateFrameNumbers(DEVIL, {
            start: 5,
            end: 6,
        }),
        repeat: -1,
        frameRate: 4,
    });

    game.anims.create({
        key: DEVIL_TURN,
        frames: game.anims.generateFrameNumbers(DEVIL, {
            start: 0,
            end: 2,
        }),

        frameRate: 3,
        repeat: -1,
    });

    game.anims.create({
        key: DEVIL_RIGHT,
        frames: game.anims.generateFrameNumbers(DEVIL, {
            start: 3,
            end: 4,
        }),
        frameRate: 4,
        repeat: -1,
    });

    game.anims.create({
        key: MIAU,
        frames: game.anims.generateFrameNumbers(MIAU),
        frameRate: 60,
    });
};

export const eatNip = (bat: Bat) => {
    bat.endiabrado = MAX_ENDIABRADO;
    bat.info.setTexture(DEVIL);
};

function isEndiabrado(bat: Bat) {
    return bat.endiabrado === MAX_ENDIABRADO;
}

function animated(bat: Bat, cat: string, devil: string) {
    bat.info.anims.play(isEndiabrado(bat) ? devil : cat, true);
}

export const eat = (bat: Bat) => {
    bat.food++;
    bat.endiabrado += bat.endiabrado >= MAX_ENDIABRADO ? 0 : 1;
};

const hitEndiabrado = (game: Game) => {
    game.bat.invisible = true;
    game.bat.endiabrado = 0;
    turn(game.bat);
    game.bat.info.setVelocityY(-3000);
    if (game.bat.info.body.touching.left) game.bat.info.setVelocityX(100);
    if (game.bat.info.body.touching.right) game.bat.info.setVelocityX(-100);
    const tween = game.tweens.add({
        targets: game.bat.info,
        ease: "Power1",
        duration: 100000000,
        loop: 10,
        loopDelay: 100,
    });

    tween.on("start", () => {
        game.bat.info.setTintFill(0xffffff);
    });

    let toggle = true;
    tween.on("loop", () => {
        if (toggle) {
            game.bat.info.setTintFill(0xffffff);
        } else {
            game.bat.info.clearTint();
        }
        toggle = !toggle;
    });
    tween.on("complete", () => {
        game.bat.invisible = false;
    });
};

const gameOver = (game: Game) => {
    const { bat } = game;
    bat.dead = true;
    bat.info.setAcceleration(0);
    bat.info.setVelocityX(0);
    bat.info.setVelocityY(-400);
    bat.info.setCollideWorldBounds(false);
    turn(bat);
    if (bat.collideGround) {
        bat.collideGround.destroy();
        delete bat.collideGround;
    }
    if (game.jett.colliderPlayer) {
        game.jett.colliderPlayer.destroy();
        delete game.jett.colliderPlayer;
    }
    game.balls.forEach((b) => b.colliderPlayer.destroy());
    setTimeout(() => (game.gameState = "over"), 1200);
};

export const hit = (game: Game) => {
    if (game.bat.invisible) return;
    if (isEndiabrado(game.bat)) hitEndiabrado(game);
    else gameOver(game);
};

