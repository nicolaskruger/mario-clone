import { Game } from "../scenes/Game";

export const WORLD_WIDTH = 1024;
export const WORLD_HEIGHT = 768;

export const iterateMap = (game: Game, ...f: ((game: Game) => void)[]) =>
    f.forEach((f) => f(game));

export const distance = (entity0: Entity, entity1: Entity) =>
    Math.sqrt(
        Math.pow(entity0.x - entity1.x, 2) + Math.pow(entity0.y - entity1.y, 2)
    );

export type Entity = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export type Body = { x: number; y: number; width: number; height: number };

const generateBody = ({ x, y, width, height }: Body): Body => ({
    width,
    height,
    x: x - width / 2,
    y: y - height / 2,
});

const intersectPoints = (...num: number[]): boolean => {
    const [a, b, c, d] = num;

    num.sort((a, b) => a - b);

    return !(
        JSON.stringify([a, b, c, d]) === JSON.stringify(num) ||
        JSON.stringify([c, d, a, b]) === JSON.stringify(num)
    );
};

export const isColliding = (a: Body, b: Body) => {
    const bodyA = generateBody(a);
    const bodyB = generateBody(b);
    return (
        intersectPoints(
            bodyA.x,
            bodyA.x + bodyA.width,
            bodyB.x,
            bodyB.x + bodyB.width
        ) &&
        intersectPoints(
            bodyA.y,
            bodyA.y + bodyA.height,
            bodyB.y,
            bodyB.y + bodyB.height
        )
    );
};

export function isOnScreen(game: Game, body: Body) {
    return game.cameras.main.scrollX + WORLD_WIDTH > body.x;
}

