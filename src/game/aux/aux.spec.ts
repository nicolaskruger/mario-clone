import { Game } from "../scenes/Game";
import { iterateMap } from "./aux";

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
});

