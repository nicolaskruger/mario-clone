import { Entity } from "../aux/aux";
import { Game } from "../scenes/Game";
import { Ball, createBallM, createNewBall, preloadBall } from "./ball";
import { Bat } from "./bat";

type Anime = Phaser.Animations.AnimationState;

const mockObjectToType = <T>(keys: string[]) => {
    return jest.mocked(
        keys.reduce((acc, curr) => {
            return { ...acc, [curr]: jest.fn() } as T;
        }, {} as T)
    );
};

const animeKeys: (keyof Anime)[] = ["play"];

const entityKeys: (keyof Entity)[] = [
    "setDepth",
    "setVelocity",
    "setVelocityX",
    "setFlipX",
];

describe("ball", () => {
    let game: Game;
    let setDepth = jest.fn((d: number) => {});
    let anims = mockObjectToType<Anime>(animeKeys);
    let entity = mockObjectToType<Entity>(entityKeys);
    entity.anims = anims;
    let sprite = jest.fn((x: number, y: number, sprite: string) => ({
        ...entity,
    }));
    let collider = jest.fn((a: any, b: any) => {});
    let overlap = jest.fn((a: any, b: any, fn: () => void) => {});
    let spritesheet = jest.fn(
        (sprite: string, filePath: string, data: any) => {}
    );

    beforeEach(() => {
        game = {
            bat: { info: {} } as Bat,
            balls: [] as Ball[],
            physics: {
                add: {
                    sprite,
                    collider,
                    overlap,
                },
            } as unknown,
            load: {
                spritesheet,
            } as unknown,
        } as Game;
    });
    test("create ball m", () => {
        createBallM(game, 0, 1);
        expect(sprite).toHaveBeenCalled();
        expect(game.balls.length).toBe(1);
        expect(entity.setDepth.mock.calls[0][0]).toBe(2);
        const [ball] = game.balls;
        expect(ball).toBeTruthy();
    });

    test("preload ball", () => {
        preloadBall(game);
    });

    test("create new Ball", () => {
        createNewBall(game, 0, 1, 2);
        createNewBall(game, 0, 1, 2);
        expect(sprite).toHaveBeenCalled();
        expect(game.balls.length).toBe(2);
        expect(entity.setDepth.mock.calls[0][0]).toBe(2);
        expect(entity.setVelocity.mock.calls[0][0]).toBe(-2);
        expect(collider).toHaveBeenCalled();
        expect(overlap).toHaveBeenCalled();
        const [ballA, ballB] = game.balls;
        expect(ballA).toBeTruthy();
        expect(ballB).toBeTruthy();

        expect(ballA.colliders.length).toBe(1);
        expect(ballB.colliders.length).toBe(1);
    });
});

