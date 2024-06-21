import { eat } from "./bat";
import { Collectable, collectableFactory } from "./colectable";

export type Food = Collectable;

const { collideAll, create, createMap, createNew, preload } =
    collectableFactory(
        "food.png",
        "food",
        100,
        2,
        4,
        ({ foods }) => foods,
        (game, list) => (game.foods = list),
        eat
    );

export const preloadFood = preload;

export const createFoodMap = createMap;

export const createFood = create;

export const collideAllFood = collideAll;

export const createNewFood = createNew;

