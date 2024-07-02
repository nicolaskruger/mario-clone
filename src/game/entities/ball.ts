import { isOnScreen } from "../aux/aux";
import { Collider, ColliderBundle } from "../collider/collider";
import { tileSize } from "../map/map";
import { Game } from "../scenes/Game";
import { hit } from "./bat";
import { createNewFood } from "./food";
import { createNewNip } from "./nip";

const SPRITE = "ball";

export const RIGHT_BALL = "b_right";
export const LEFT_BALL = "b_left";
export const DIE_BALL = "b_die";

export type Ball = {
    id: number;
    dead: boolean;
    start: boolean;
    info: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    colliderPlayer: Collider;
    colliders: ColliderBundle[];
    jettBall?: boolean;
};

export const preloadBall = (game: Game) => {
    game.load.spritesheet(SPRITE, "ball.png", {
        frameHeight: 128,
        frameWidth: 128,
    });
};

export function createBallM(game: Game, x: number, y: number) {
    const ball: Ball = {
        start: false,
        id: Math.random(),
        dead: false,
        info: game.physics.add.sprite(x, y, SPRITE),
        colliders: [],
        colliderPlayer: {} as Collider,
    };
    ball.info.setDepth(2);
    game.balls.push(ball);
}

function collideNewBall(ball: Ball, game: Game) {
    game.balls
        .filter(({ dead }) => !dead)
        .forEach((bBall) => {
            const collider = game.physics.add.collider(ball.info, bBall.info);
            const bundle: ColliderBundle = {
                collider,
                active: true,
            };
            ball.colliders.push(bundle);
            bBall.colliders.push(bundle);
        });
}

export function createNewBall(game: Game, x: number, y: number, vel: number) {
    const ball: Ball = {
        start: false,
        id: Math.random(),
        dead: false,
        info: game.physics.add.sprite(x, y, SPRITE),
        colliders: [],
        colliderPlayer: {} as Collider,
        jettBall: true,
    };
    ball.info.setDepth(2);
    colideBallPlayer(ball, game);
    collideNewBall(ball, game);
    goLeft(ball);
    ball.info.setVelocity(-vel);
    game.balls.push(ball);
}

export const killBall = (ball: Ball) => {
    ball.info.anims.play(DIE_BALL);
    ball.info.setVelocity(0);
    ball.colliders
        .filter(({ active }) => active)
        .forEach((c) => {
            c.active = false;
            c.collider.destroy();
        });
};

export const destroyBall = (game: Game, ball: Ball) => {
    game.physics.world.removeCollider(ball.colliderPlayer);
    if (ball.dead) return;
    killBall(ball);
    if (Math.random() > 0.75) createNewNip(game, ball.info.x, ball.info.y);
    else createNewFood(game, ball.info.x, ball.info.y);
    ball.dead = true;
};

function colideBallPlayer(ball: Ball, game: Game) {
    game.physics.add.collider(game.platform, ball.info);

    ball.colliderPlayer = game.physics.add.overlap(
        game.bat.info,
        ball.info,
        () => {
            const bat = game.bat.info;

            if (bat.y < ball.info.y - tileSize / 2) {
                destroyBall(game, ball);
                bat.setVelocityY(-700);
            } else {
                hit(game);
            }
        }
    );
}

const colideAllBallPlayer = (game: Game) => {
    game.balls.forEach((ball) => {
        colideBallPlayer(ball, game);
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
    colideAllBallPlayer(game);
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

function destroyJettBall(ball: Ball, game: Game) {
    const {
        info: { x },
    } = ball;
    const {
        cameras: {
            main: { scrollX },
        },
    } = game;

    if (x + tileSize / 2 < scrollX) destroyBall(game, ball);
}

const tickBall = (ball: Ball, game: Game) => {
    if (!ball.start) {
        ball.start = isOnScreen(game, ball.info);
        return;
    }
    const { info, dead } = ball;
    if (dead) return;
    if (info.body.velocity.x === 0) goLeft(ball);
    if (info.body.touching.left) goRight(ball);
    if (info.body.touching.right) goLeft(ball);
    if (ball.jettBall) destroyJettBall(ball, game);
};

export const updateBall = (game: Game) => {
    game.balls.forEach((ball) => tickBall(ball, game));
};

