import { Game } from "../scenes/Game";

export const createBatMap = (game: Game, x: number, y: number) => {
    game.bat = game.physics.add.sprite(x, y, "cat");
    game.bat.setCollideWorldBounds(true);
};

