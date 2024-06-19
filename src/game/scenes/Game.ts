import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Control, createControl } from "../controll/control";
import { createMap, preloadMap } from "../map/map";
import { Bat, createBatAnime, preloadBat, updateBat } from "../entities/bat";

export type Player = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export class Game extends Scene {
    control: Control;
    bat: Player;
    batInfo: Bat;
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor() {
        super("Game");
        this.batInfo = {
            jump: false,
            jumpCounter: 0,
        };
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
        preloadMap(this);
        preloadBat(this);
    }
    update(time: number, delta: number): void {
        updateBat(this);
    }

    create() {
        this.control = createControl(this);

        this.add.image(512, 384, "background");

        this.platform = this.physics.add.staticGroup();

        createBatAnime(this);
        createMap(this);
        this.physics.add.collider(this.bat, this.platform);

        EventBus.emit("current-scene-ready", this);
    }
}

