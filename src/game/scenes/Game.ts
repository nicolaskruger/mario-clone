import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Control, createControl } from "../controll/control";

export type Player = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export class Game extends Scene {
    control: Control;
    player: Player;

    constructor() {
        super("Game");
    }

    update(time: number, delta: number): void {
        const { A, D, W } = this.control;

        if (A.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play("left", true);
        } else if (D.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play("turn");
        }

        if (W.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
        this.load.image("ground", "ground.png");
        this.load.spritesheet("mario", "mario.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create() {
        this.control = createControl(this);

        this.add.image(512, 384, "background");

        const platform = this.physics.add.staticGroup();

        " "
            .repeat(12)
            .split("")
            .forEach((_, i) => {
                platform.create(
                    92 / 2 + i * 92,
                    this.sys.game.canvas.height - 91 / 2,
                    "ground"
                );
            });

        this.player = this.physics.add.sprite(100, 400, "mario");

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("mario", {
                start: 0,
                end: 3,
            }),
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "mario", frame: 4 }],
            repeat: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("mario", {
                start: 5,
                end: 8,
            }),
            repeat: -1,
        });

        this.physics.add.collider(this.player, platform);

        EventBus.emit("current-scene-ready", this);
    }
}

