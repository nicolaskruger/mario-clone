import { eat } from "./bat";
import { Collectable, collectableFactory } from "./colectable";

export type Nip = Collectable;

const { collideAll, create, createMap, createNew, preload } =
    collectableFactory(
        "nip.png",
        "nip",
        40,
        7,
        13,
        ({ nips }) => nips,
        (game, list) => (game.nips = list),
        eat
    );

export const preloadNip = preload;

export const createNipMap = createMap;

export const createNip = create;

export const collideAllNip = collideAll;

export const createNewNip = createNew;

