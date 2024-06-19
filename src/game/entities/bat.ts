import { Game } from "../scenes/Game";

const BREAK_ACCELERATION = 20000;
const JUMP_COUNTER_MAX = 50;
export type Bat = {
    jump: boolean;
    jumpCounter: number;
};

export const preloadBat = (game: Game) => {
    game.load.spritesheet("cat", "cat.png", {
        frameHeight: 128,
        frameWidth: 128,
    });
};

export const createBatMap = (game: Game, x: number, y: number) => {
    game.bat = game.physics.add.sprite(x, y, "cat").setMaxVelocity(700);
    game.bat.setCollideWorldBounds(true);
};

const LEFT = "left";
const RIGHT = "right";
const TURN = "turn";

const breakAcceleration = (game: Game) => {
    const acceleration = game.bat.body.acceleration.x;
    const sign = Math.sign(acceleration);
    const acc = Math.abs(acceleration);

    if (acc === BREAK_ACCELERATION) {
        const velocity = game.bat.body.velocity.x;
        if ((sign > 0 && velocity > 0) || (sign < 0 && velocity < 0)) {
            game.bat.setVelocityX(0);
            game.bat.setAccelerationX(0);
        }
    } else {
        if (sign < 0) game.bat.setAccelerationX(+BREAK_ACCELERATION);
        if (sign > 0) game.bat.setAccelerationX(-BREAK_ACCELERATION);
    }

    if (acc === BREAK_ACCELERATION) game.bat.anims.play(TURN, true);
};

const jump = (game: Game) => {
    const { A, D, W } = game.control;
    const { batInfo } = game;
    if (W.isDown && game.bat.body.touching.down) {
        game.bat.setVelocityY(-650);
        game.bat.setAccelerationX(0);
        batInfo.jump = true;
        batInfo.jumpCounter = 0;
    }
    if (batInfo.jump && W.isDown && batInfo.jumpCounter < JUMP_COUNTER_MAX) {
        batInfo.jumpCounter++;
    } else if (batInfo.jump) {
        const newVelocity =
            game.bat.body.velocity.y < 0 ? 0 : game.bat.body.velocity.y;
        game.bat.setVelocityY(newVelocity);
        batInfo.jump = false;
    }
};

export const updateBat = (game: Game) => {
    const { A, D, W, J } = game.control;

    const { batInfo } = game;

    const ACC = J.isDown ? 1000 : 500;

    if (A.isDown) {
        const vel = game.bat.body.velocity.x;
        if (vel >= 0) {
            game.bat.setAccelerationX(-20000);
        } else {
            if (game.bat.body.touching.down) game.bat.setAccelerationX(-ACC);
            else game.bat.setAccelerationX(-100);
        }

        game.bat.anims.play(LEFT, true);
    } else if (D.isDown) {
        const vel = game.bat.body.velocity.x;
        if (vel <= 0) {
            game.bat.setAccelerationX(+20000);
        } else {
            if (game.bat.body.touching.down) game.bat.setAccelerationX(ACC);
            else game.bat.setAccelerationX(100);
        }
        game.bat.anims.play(RIGHT, true);
    } else {
        if (game.bat.body.touching.down) breakAcceleration(game);
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

