import { Entity } from "../aux/aux";
import { Collider, ColliderBundle } from "../collider/collider";
import { tileSize } from "../map/map";
import { Game } from "../scenes/Game";
import { Bat } from "./bat";

const SPRITE = "ball";

export const RIGHT_BALL = "b_right";
export const LEFT_BALL = "b_left";
export const DIE_BALL = "b_die";

export type Ball = {
    id: number;
    dead: boolean;
    info: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    colliders: ColliderBundle[];
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
        colliders: [],
    };
    game.balls.push(ball);
};

const killBall = (ball: Ball) => {
    ball.info.anims.play(DIE_BALL);
    ball.dead = true;
    ball.info.setVelocity(0);
    ball.colliders
        .filter(({ active }) => active)
        .forEach((c) => {
            c.active = false;
            c.collider.destroy();
        });
};

const colideBallPlayer = (game: Game) => {
    game.balls.forEach((ball) => {
        game.physics.add.collider(game.platform, ball.info);
        const collider = game.physics.add.overlap(
            game.bat.info,
            ball.info,
            (bat, sBall) => {
                const _bat = bat as Entity;
                const _ball = sBall as Entity;

                const destroyBall = () => {
                    game.physics.world.removeCollider(collider);
                    killBall(ball);
                };

                if (_bat.y < _ball.y - tileSize / 2) {
                    destroyBall();
                    _bat.setVelocityY(-700);
                } else {
                    _bat.destroy(true);
                }
            }
        );
    });
};

const collideBallBall = (game: Game) => {
    const balls = game.balls;
    for (let i = 0; i < balls.length; i++)
        for (let j = i + 1; j < balls.length; j++) {
            const collider = game.physics.add.collider(
                balls[i].info,
                balls[j].info
            );
            const bundle: ColliderBundle = {
                collider,
                active: true,
            };
            balls[i].colliders.push(bundle);
            balls[j].colliders.push(bundle);
        }
};

export const collideBall = (game: Game) => {
    colideBallPlayer(game);
    collideBallBall(game);
};

export const createBall = (game: Game) => {
    game.anims.create({
        key: RIGHT_BALL,
        frames: game.anims.generateFrameNumbers(SPRITE, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: 12,
    });
    game.anims.create({
        key: LEFT_BALL,
        frames: game.anims.generateFrameNumbers(SPRITE, {
            start: 0,
            end: 3,
        }),
        repeat: -1,
        frameRate: 12,
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

const VELOCITY = 200;

const goRight = (ball: Ball) => {
    const { info } = ball;
    info.setVelocityX(VELOCITY);
    info.setFlipX(false);
    info.anims.play(RIGHT_BALL);
};

const goLeft = (ball: Ball) => {
    const { info } = ball;
    info.setVelocityX(-VELOCITY);
    info.setFlipX(true);
    info.anims.play(LEFT_BALL);
};

const tickBall = (ball: Ball) => {
    const { info, dead } = ball;
    if (dead) return;
    if (info.body.velocity.x === 0) goLeft(ball);
    if (info.body.touching.left) goRight(ball);
    if (info.body.touching.right) goLeft(ball);
};

export const updateBall = (game: Game) => {
    game.balls.forEach(tickBall);
};

