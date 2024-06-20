import { Game } from "../scenes/Game";

export const iterateMap = (game: Game, ...f: ((game: Game) => void)[]) =>
    f.forEach((f) => f(game));

export type Entity = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

