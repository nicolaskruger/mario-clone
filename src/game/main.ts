import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    fullscreenTarget: "game-container",
    parent: "game-container",
    backgroundColor: "#028af8",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 2000,
                x: 0,
            },
            debug: false,
        },
    },
    scene: [MainGame],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

