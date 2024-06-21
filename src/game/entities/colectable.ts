import { Entity, distance } from "../aux/aux";
import { Game } from "../scenes/Game";
import { Bat } from "./bat";

export type Collectable = {
    id: number;
    info: Entity;
};

export const collectableFactory = (
    image: string,
    SPRITE: string,
    radio: number,
    frames: number,
    frameRate: number,
    get: (game: Game) => Collectable[],
    set: (Game: Game, coll: Collectable[]) => void,
    eat: (bat: Bat) => void
) => {
    const preload = (game: Game) => {
        game.load.spritesheet(SPRITE, image, {
            frameHeight: 128,
            frameWidth: 128,
        });
        set(game, []);
    };
    const FLOAT = "float" + SPRITE;

    const createMap = (game: Game, x: number, y: number) => {
        const info = game.physics.add.sprite(x, y, SPRITE).setDepth(-1);
        get(game).push({ info, id: Math.random() });
        info.anims.play(FLOAT);
    };

    const create = (game: Game) => {
        game.anims.create({
            key: FLOAT,
            frames: game.anims.generateFrameNumbers(SPRITE, {
                start: 0,
                end: frames - 1,
            }),
            repeat: -1,
            frameRate,
        });
    };

    const collideGround = (game: Game, collectable: Collectable) =>
        game.physics.add.collider(collectable.info, game.platform);

    const collidePlayer = (game: Game, collectable: Collectable) => {
        const battI = game.bat.info;
        const foodI = collectable.info;
        game.physics.add.overlap(battI, foodI, () => {
            if (distance(battI, foodI) >= radio) return;
            set(
                game,
                get(game).filter((f) => f.id !== collectable.id)
            );
            foodI.destroy();
            eat(game.bat);
        });
    };

    const collide = (game: Game, food: Collectable) => {
        [collideGround, collidePlayer].forEach((func) => func(game, food));
    };

    const collideAll = (game: Game) => {
        get(game).forEach((f) => {
            collide(game, f);
        });
    };

    const createNew = (game: Game, x: number, y: number) => {
        const info = game.physics.add.sprite(x, y, SPRITE).setDepth(-1);
        const food: Collectable = { info, id: Math.random() };
        get(game).push(food);
        info.anims.play(FLOAT);
        collide(game, food);
    };

    return {
        create,
        preload,
        createMap,
        collideAll,
        createNew,
    };
};

