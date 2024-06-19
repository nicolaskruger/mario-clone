import { Game } from "../scenes/Game";

export const preloadBat = (game: Game) => {
    game.load.spritesheet("cat", "cat.png", {
        frameHeight: 128,
        frameWidth: 128,
    });
};

export const createBatMap = (game: Game, x: number, y: number) => {
    game.bat = game.physics.add.sprite(x, y, "cat");
    game.bat.setCollideWorldBounds(true);
};

const LEFT = "left";
const RIGHT = "right";
const TURN = "turn";

export const updateBat = (game: Game) => {
    const { A, D, W } = game.control;

    if (A.isDown) {
        game.bat.setVelocityX(-160);
        game.bat.anims.play(LEFT, true);
    } else if (D.isDown) {
        game.bat.setVelocityX(160);
        game.bat.anims.play(RIGHT, true);
    } else {
        game.bat.setVelocityX(0);
        game.bat.anims.play(TURN, true);
    }

    if (W.isDown && game.bat.body.touching.down) {
        game.bat.setVelocityY(-330);
    }
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

