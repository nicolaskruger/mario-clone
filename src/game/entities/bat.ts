import { Entity } from "../aux/aux";
import { Game } from "../scenes/Game";

const BREAK_ACCELERATION = 20000;
const JUMP_COUNTER_MAX = 50;
const MAX_ENDIABRADO = 20;
export type Bat = {
    jump: boolean;
    jumpCounter: number;
    w: boolean;
    info: Entity;
    food: number;
    endiabrado: number;
};

export const preloadBat = (game: Game) => {
    game.load.spritesheet("cat", "cat.png", {
        frameHeight: 128,
        frameWidth: 128,
    });
    game.bat = {
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

    if (acc === BREAK_ACCELERATION) game.bat.info.anims.play(TURN, true);
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

        game.bat.info.anims.play(LEFT, true);
    } else if (D.isDown) {
        const vel = game.bat.info.body.velocity.x;
        if (vel <= 0) {
            game.bat.info.setAccelerationX(+20000);
        } else {
            if (game.bat.info.body.touching.down)
                game.bat.info.setAccelerationX(ACC);
            else game.bat.info.setAccelerationX(100);
        }
        game.bat.info.anims.play(RIGHT, true);
    } else {
        if (game.bat.info.body.touching.down) breakAcceleration(game);
    }

    jump(game);
};

export const createBatAnime = (game: Game) => {
    game.anims.create({
        key: "left",
        frames: game.anims.generateFrameNumbers("cat", {
            start: 5,
            end: 6,
        }),
        repeat: -1,
        frameRate: 4,
    });

    game.anims.create({
        key: "turn",
        frames: game.anims.generateFrameNumbers("cat", {
            start: 0,
            end: 2,
        }),

        frameRate: 3,
        repeat: -1,
    });

    game.anims.create({
        key: "right",
        frames: game.anims.generateFrameNumbers("cat", {
            start: 3,
            end: 4,
        }),
        frameRate: 4,
        repeat: -1,
    });
};

export const eat = (bat: Bat) => {
    bat.food++;
    bat.endiabrado += bat.endiabrado >= MAX_ENDIABRADO ? 0 : 1;
};

