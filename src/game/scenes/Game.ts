import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Control, createControl } from "../controll/control";
import { createMap, preloadMap } from "../map/map";
import { Bat, createBatAnime, preloadBat, updateBat } from "../entities/bat";
import { Ball, createBall, preloadBall, updateBall } from "../entities/ball";
import { iterateMap } from "../aux/aux";
import { Food, createFood, preloadFood } from "../entities/food";
import { Nip, createNip, preloadNip } from "../entities/nip";
import { Jett, createJett, preloadJett, updateJett } from "../entities/jett";

export class Game extends Scene {
    control: Control;
    balls: Ball[];
    foods: Food[];
    nips: Nip[];
    bat: Bat;
    jett: Jett;
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor() {
        super("Game");
    }

    preload() {
        this.balls = [];
        this.load.setPath("assets");
        this.load.image("star", "star.png");
        this.load.image("logo", "logo.png");
        iterateMap(
            this,
            preloadMap,
            preloadBat,
            preloadBall,
            preloadFood,
            preloadNip,
            preloadJett
        );
    }
    update(time: number, delta: number): void {
        iterateMap(this, updateBat, updateBall, updateJett);
    }

    create() {
        this.control = createControl(this);

        iterateMap(
            this,
            createBatAnime,
            createBall,
            createFood,
            createNip,
            createJett,
            createMap
        );

        EventBus.emit("current-scene-ready", this);
    }
}

