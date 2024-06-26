import { iterateMap } from "../aux/aux";
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

const line00 = "_______J_________";
const line01 = "_______G_________";
const line02 = "_________________";
const line03 = "__G___FN_________";
const line04 = "_MN______________";
const line05 = "GGGGGGGGGGGGGGGGG";

const map = [line00, line01, line02, line03, line04, line05];

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

    iterateMap(game, collideBall, collideAllFood, collideAllNip, collideJett);
};

