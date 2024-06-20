import { Game } from "../scenes/Game";

const SPRITE = "ball";

export const RIGHT_BALL = "b_right";
export const LEFT_BALL = "b_left";
export const DIE_BALL = "b_die";

export type Ball = {
    id: number;
    dead: boolean;
    info: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
};

export const preloadBall = (game: Game) => {
    game.load.spritesheet(SPRITE, "ball.png", {
        frameHeight: 128,
        frameWidth: 128,
    });
};

export const createBallM = (game: Game, x: number, y: number) => {
    const ball: Ball = {
        id: Math.random(),
        dead: false,
        info: game.physics.add.sprite(x, y, SPRITE),
    };
    game.balls.push(ball);
};

export const createBall = (game: Game) => {
    game.anims.create({
        key: RIGHT_BALL,
        frames: game.anims.generateFrameNumbers(SPRITE, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: 4,
    });
    game.anims.create({
        key: LEFT_BALL,
        frames: game.anims.generateFrameNumbers(SPRITE, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: 4,
    });
    game.anims.create({
        key: DIE_BALL,
        frames: game.anims.generateFrameNumbers(SPRITE, {
            start: 4,
            end: 8,
        }),
        frameRate: 10,
    });
};

