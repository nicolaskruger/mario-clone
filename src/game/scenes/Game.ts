import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Control, createControl } from "../controll/control";
import { createMap, preloadMap } from "../map/map";
import { Bat, createBatAnime, preloadBat, updateBat } from "../entities/bat";
import { Ball, createBall, preloadBall, updateBall } from "../entities/ball";
import { iterateMap } from "../aux/aux";
import { Food, createFood, preloadFood } from "../entities/food";
import { Nip, createNip, preloadNip } from "../entities/nip";

export class Game extends Scene {
    control: Control;
    balls: Ball[];
    foods: Food[];
    nips: Nip[];
    bat: Bat;
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor() {
        super("Game");
    }

    preload() {
        this.balls = [];
        this.load.setPath("assets");
        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
        iterateMap(
            this,
            preloadMap,
            preloadBat,
            preloadBall,
            preloadFood,
            preloadNip
        );
    }
    update(time: number, delta: number): void {
        iterateMap(this, updateBat, updateBall);
    }

    create() {
        this.control = createControl(this);

        this.add.image(512, 384, "background").setDepth(-2);

        iterateMap(
            this,
            createBatAnime,
            createBall,
            createFood,
            createNip,
            createMap
        );

        EventBus.emit("current-scene-ready", this);
    }
}

