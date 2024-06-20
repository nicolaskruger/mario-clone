import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Control, createControl } from "../controll/control";
import { createMap, preloadMap } from "../map/map";
import { Bat, createBatAnime, preloadBat, updateBat } from "../entities/bat";
import { createBall, preloadBall } from "../entities/ball";
import { iterateMap } from "../aux/aux";

export type Player = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
export type Ball = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export class Game extends Scene {
    control: Control;
    bat: Player;
    balls: Ball[];
    batInfo: Bat;
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor() {
        super("Game");
    }

    preload() {
        this.batInfo = {
            jump: false,
            jumpCounter: 0,
            w: false,
        };
        this.balls = [];
        this.load.setPath("assets");
        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
        iterateMap(this, preloadMap, preloadBat, preloadBall);
    }
    update(time: number, delta: number): void {
        updateBat(this);
    }

    create() {
        this.control = createControl(this);

        this.add.image(512, 384, "background");

        iterateMap(this, createBatAnime, createBall, createMap);

        EventBus.emit("current-scene-ready", this);
    }
}

