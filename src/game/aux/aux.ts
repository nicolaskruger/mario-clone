import { Game } from "../scenes/Game";

export const iterateMap = (game: Game, ...f: ((game: Game) => void)[]) =>
    f.forEach((f) => f(game));

export const distance = (entity0: Entity, entity1: Entity) =>
    Math.sqrt(
        Math.pow(entity0.x - entity1.x, 2) + Math.pow(entity0.y - entity1.y, 2)
    );

export type Entity = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

