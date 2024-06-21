import { Tweens } from "phaser";
import { Entity } from "../aux/aux";
import { Game } from "../scenes/Game";

const BREAK_ACCELERATION = 20000;
const JUMP_COUNTER_MAX = 50;
const MAX_ENDIABRADO = 20;
const DEVIL = "devil";
export type Bat = {
    jump: boolean;
    jumpCounter: number;
    w: boolean;
    info: Entity;
    food: number;
    endiabrado: number;
    invisible: boolean;
};

export const preloadBat = (game: Game) => {
    game.load.spritesheet("cat", "cat.png", {
        frameHeight: 128,
        frameWidth: 128,
    });
    game.load.spritesheet(DEVIL, "devil.png", {
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
    };
};

export const createBatMap = (game: Game, x: number, y: number) => {
    game.bat.info = game.physics.add.sprite(x, y, "cat").setMaxVelocity(700);
    game.bat.info.setCollideWorldBounds(true);
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
    if (J.isDown) game.bat.info.setMaxVelocity(800);
    if (J.isUp) game.bat.info.setMaxVelocity(700);

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

export const updateBat = (game: Game) => {
    const { A, D, W, J } = game.control;

    const { bat } = game;

    const ACC = J.isDown ? 1000 : 500;

    if (A.isDown) {
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

export const hit = (game: Game) => {
    if (game.bat.invisible) return;
    if (isEndiabrado(game.bat)) {
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
    } else {
    }
};

