import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Control, createControl } from "../controll/control";
import { createMap, preloadMap } from "../map/map";

export type Player = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export class Game extends Scene {
    control: Control;
    bat: Player;
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
        preloadMap(this);
        this.load.spritesheet("cat", "cat.png", {
            frameHeight: 128,
            frameWidth: 128,
        });
        this.load.spritesheet("mario", "mario.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }
    update(time: number, delta: number): void {
        const { A, D, W } = this.control;

        if (A.isDown) {
            this.bat.setVelocityX(-160);

            this.bat.anims.play("left", true);
        } else if (D.isDown) {
            this.bat.setVelocityX(160);

            this.bat.anims.play("right", true);
        } else {
            this.bat.setVelocityX(0);

            this.bat.anims.play("turn", true);
        }

        if (W.isDown && this.bat.body.touching.down) {
            this.bat.setVelocityY(-330);
        }
    }

    create() {
        this.control = createControl(this);

        this.add.image(512, 384, "background");

        this.platform = this.physics.add.staticGroup();

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("cat", {
                start: 5,
                end: 6,
            }),
            repeat: -1,
            frameRate: 4,
        });

        this.anims.create({
            key: "turn",
            frames: this.anims.generateFrameNumbers("cat", {
                start: 0,
                end: 2,
            }),

            frameRate: 3,
            repeat: -1,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("cat", {
                start: 3,
                end: 4,
            }),
            frameRate: 4,
            repeat: -1,
        });

        createMap(this);
        this.physics.add.collider(this.bat, this.platform);

        EventBus.emit("current-scene-ready", this);
    }
}

