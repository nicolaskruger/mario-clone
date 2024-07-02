import { Game } from "../scenes/Game";
import { Entity, distance, iterateMap } from "./aux";

describe("aux", () => {
    let game: Game;

    beforeEach(() => {
        game = { jett: { life: 0 } } as Game;
    });

    test("iterate Game Map", () => {
        const mutateGame = (game: Game) => {
            game.jett.life++;
        };

        const { life } = game.jett;

        iterateMap(game, mutateGame, mutateGame);

        expect(game.jett.life).toBe(life + 2);
    });

    test("distance", () => {
        const e1: Entity = { x: 0, y: 0 } as Entity;
        const e2: Entity = { x: 3, y: 4 } as Entity;
        expect(distance(e1, e2)).toBe(5);
    });
});

