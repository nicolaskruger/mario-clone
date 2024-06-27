import { WORLD_HEIGHT, WORLD_WIDTH, iterateMap } from "../aux/aux";
import { collideBall, createBallM } from "../entities/ball";
import { createBatMap } from "../entities/bat";
import { collideAllFood, createFoodMap } from "../entities/food";
import { collideJett, createJettMap } from "../entities/jett";
import { collideAllNip, createNipMap } from "../entities/nip";
import { Game } from "../scenes/Game";
export const tileSize = 128;

const img = "groung";

export const preloadMap = (game: Game) => {
    game.load.image(img, "ground.png");
};

const map = [
    "______________________________________FFFFF__________________________________J",
    "_____________________________________GGGGGG__________________________________G",
    "____________________________________G_________________________________________",
    "______F_F_F_F_F____________________G__GGG_______________________________G_____",
    "_M___GGGGGGGGGGG_________B__B__B__GN_GGGGG__________G_BBB_G_________________FN",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
];

type ObjNickName = "M" | "G" | "_" | "B" | "F" | "N" | "J";

export type EDictionary<T extends string | symbol | number, U> = {
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
    F: createFoodMap,
    N: createNipMap,
    J: createJettMap,
};

export const createMap = (game: Game) => {
    game.platform = game.physics.add.staticGroup().setDepth(-1000000);

    map.forEach((line, y) =>
        line.split("").forEach((v, x) => {
            creator[v as keyof typeof creator](
                game,
                x * tileSize + tileSize / 2,
                y * tileSize + tileSize / 2
            );
        })
    );
    game.bat.collideGround = game.physics.add.collider(
        game.bat.info,
        game.platform
    );
    game.bat.info.setCollideWorldBounds(true);
    game.physics.world.setBounds(0, 0, tileSize * map[0].length, WORLD_HEIGHT);

    iterateMap(game, collideBall, collideAllFood, collideAllNip, collideJett);
};

