import { iterateMap } from "../aux/aux";
import { DIE_BALL, collideBall, createBallM } from "../entities/ball";
import { createBatMap } from "../entities/bat";
import { collideAllFood, createFoodMap } from "../entities/food";
import { collideAllNip, createNipMap } from "../entities/nip";
import { Game } from "../scenes/Game";
export const tileSize = 128;

const img = "groung";

export const preloadMap = (game: Game) => {
    game.load.image(img, "ground.png");
};

const line00 = "G________________";
const line01 = "_G_______________";
const line02 = "_________________";
const line03 = "______FN_________";
const line04 = "FMFGBFBGF________";
const line05 = "GGGGGGGGGGGGGGGGG";

const map = [line00, line01, line02, line03, line04, line05];

type ObjNickName = "M" | "G" | "_" | "B" | "F" | "N";

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
};

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
    game.physics.add.collider(game.bat.info, game.platform);

    iterateMap(game, collideBall, collideAllFood, collideAllNip);
};

