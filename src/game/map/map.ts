import { DIE_BALL, createBallM } from "../entities/ball";
import { createBatMap } from "../entities/bat";
import { Game } from "../scenes/Game";
import type { Player } from "../scenes/Game";
const tileSize = 128;

const img = "groung";

export const preloadMap = (game: Game) => {
    game.load.image(img, "ground.png");
};

const line00 = "G________________";
const line01 = "_G_______________";
const line02 = "_________________";
const line03 = "_________________";
const line04 = "_M__GB___________";
const line05 = "GGGGGGGGGGGGGGGGG";

const map = [line00, line01, line02, line03, line04, line05];

type ObjNickName = "M" | "G" | "_" | "B";

type EDictionary<T extends string | symbol | number, U> = {
    [K in T]: U;
};

const creator: EDictionary<
    ObjNickName,
    (game: Game, x: number, y: number) => void
> = {
    G: (game, x, y) => {
        game.platform.create(x, y, img);
    },
    _: () => {},
    M: createBatMap,
    B: createBallM,
};

type Entity = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export const createMap = (game: Game) => {
    game.platform = game.physics.add.staticGroup();

    map.forEach((line, y) =>
        line.split("").forEach((v, x) => {
            creator[v as keyof typeof creator](
                game,
                x * tileSize + tileSize / 2,
                y * tileSize + tileSize / 2
            );
        })
    );
    game.physics.add.collider(game.bat, game.platform);
    game.balls.forEach((ball) => {
        game.physics.add.collider(game.platform, ball.info);
        const collider = game.physics.add.overlap(
            game.bat,
            ball.info,
            (bat, ball) => {
                const _bat = bat as Entity;
                const _ball = ball as Entity;

                const destroyBall = () => {
                    game.balls = game.balls.filter((b) => b.info === _ball);
                    game.physics.world.removeCollider(collider);
                    _ball.anims.play(DIE_BALL);
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

