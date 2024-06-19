import { createBatMap } from "../entities/bat";
import { Game } from "../scenes/Game";

const tileSize = 128;

const img = "groung";

export const preloadMap = (game: Game) => {
    game.load.image(img, "ground.png");
};

const line00 = "G________________";
const line01 = "_G_______________";
const line02 = "_________________";
const line03 = "_________________";
const line04 = "_M__G____________";
const line05 = "GGGGGGGGGGGGGGGGG";

const map = [line00, line01, line02, line03, line04, line05];

type ObjNickName = "M" | "G" | "_";

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
};

export const createMap = (game: Game) => {
    map.forEach((line, y) =>
        line.split("").forEach((v, x) => {
            creator[v as keyof typeof creator](
                game,
                x * tileSize + tileSize / 2,
                y * tileSize + tileSize / 2
            );
        })
    );
};

