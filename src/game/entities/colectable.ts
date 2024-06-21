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
    eat: (bat: Bat) => void
) => {
    const preload = (game: Game) => {
        game.load.spritesheet(SPRITE, image, {
            frameHeight: 128,
            frameWidth: 128,
        });
        game.foods = [];
    };
    const FLOAT = "float" + SPRITE;

    const createMap = (game: Game, x: number, y: number) => {
        const info = game.physics.add.sprite(x, y, SPRITE).setDepth(-1);
        game.foods.push({ info, id: Math.random() });
        info.anims.play(FLOAT);
    };

    const create = (game: Game) => {
        game.anims.create({
            key: FLOAT,
            frames: game.anims.generateFrameNumbers(SPRITE, {
                start: 0,
                end: 1,
            }),
            repeat: -1,
            frameRate: 4,
        });
    };

    const collideGround = (game: Game, food: Collectable) =>
        game.physics.add.collider(food.info, game.platform);

    const collidePlayer = (game: Game, food: Collectable) => {
        const battI = game.bat.info;
        const foodI = food.info;
        game.physics.add.overlap(battI, foodI, () => {
            if (distance(battI, foodI) >= radio) return;
            game.foods = game.foods.filter((f) => f.id !== food.id);
            foodI.destroy();
            eat(game.bat);
        });
    };

    const collide = (game: Game, food: Collectable) => {
        [collideGround, collidePlayer].forEach((func) => func(game, food));
    };

    const collideAll = (game: Game) => {
        game.foods.forEach((f) => {
            collide(game, f);
        });
    };

    const createNew = (game: Game, x: number, y: number) => {
        const info = game.physics.add.sprite(x, y, SPRITE).setDepth(-1);
        const food: Collectable = { info, id: Math.random() };
        game.foods.push(food);
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

