import { Game } from "../scenes/Game";
import { Ball, createBallM } from "./ball";

describe("ball", () => {
    let game: Game;
    let setDepth = jest.fn((d: number) => {});
    let sprite = jest.fn((x: number, y: number, sprite: string) => ({
        setDepth,
    }));

    beforeEach(() => {
        game = {
            balls: [] as Ball[],
            physics: {
                add: {
                    sprite,
                },
            } as unknown,
        } as Game;
    });
    test("create ball m", () => {
        createBallM(game, 0, 1);

        expect(sprite).toHaveBeenCalled();

        expect(game.balls.length).toBe(1);

        expect(setDepth.mock.calls[0][0]).toBe(2);

        const [ball] = game.balls;

        expect(ball).toBeTruthy();
    });
});

