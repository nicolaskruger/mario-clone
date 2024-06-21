import { Entity, distance } from "../aux/aux";
import { Game } from "../scenes/Game";
import { eat } from "./bat";

export type Food = {
    id: number;
    info: Entity;
};

const SPRITE = "food";

export const preloadFood = (game: Game) => {
    game.load.spritesheet(SPRITE, "food.png", {
        frameHeight: 128,
        frameWidth: 128,
    });
    game.foods = [];
};
const FLOAT = "float";

export const createFoodMap = (game: Game, x: number, y: number) => {
    const info = game.physics.add.sprite(x, y, SPRITE).setDepth(-1);
    game.foods.push({ info, id: Math.random() });
    info.anims.play(FLOAT);
};

export const createFood = (game: Game) => {
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

const collideFoodGround = (game: Game, food: Food) =>
    game.physics.add.collider(food.info, game.platform);

const collideFoodPlayer = (game: Game, food: Food) => {
    const battI = game.bat.info;
    const foodI = food.info;
    game.physics.add.overlap(battI, foodI, () => {
        if (distance(battI, foodI) >= 100) return;
        game.foods = game.foods.filter((f) => f.id !== food.id);
        foodI.destroy();
        eat(game.bat);
    });
};

const collideFood = (game: Game, food: Food) => {
    [collideFoodGround, collideFoodPlayer].forEach((func) => func(game, food));
};

export const collideAllFood = (game: Game) => {
    game.foods.forEach((f) => {
        collideFood(game, f);
    });
};

