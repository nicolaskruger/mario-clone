import { Entity } from "../aux/aux";
import { Collider } from "../collider/collider";
import { Game } from "../scenes/Game";
import { createNewBall, destroyBall } from "./ball";
import { hit } from "./bat";

const JETT = "jett";

export type Jett = {
    start: boolean;
    info: Entity;
    invisible: boolean;
    life: number;
    colliderPlayer?: Collider;
    collideGround?: Collider;
    fn?: NodeJS.Timeout;
};

function initiateJett(): Jett {
    return {
        start: false,
        info: {} as Entity,
        invisible: false,
        life: 3,
    };
}

export function preloadJett(game: Game) {
    game.load.spritesheet(JETT, "jett.png", {
        frameWidth: 128,
        frameHeight: 128,
    });
    game.jett = initiateJett();
}

function isDeadJett(game: Game) {
    return game.jett.life <= 0;
}

type ControlJett = {
    firstTime: boolean;
    interval: number;
    vel: number;
};

const listControl: ControlJett[] = [
    {
        firstTime: true,
        interval: 1700,
        vel: 100,
    },
    {
        firstTime: true,
        interval: 1200,
        vel: 300,
    },
    {
        firstTime: true,
        interval: 700,
        vel: 300,
    },
];

export function startBossFight(game: Game) {
    game.jett.start = true;
}

function lifeToIndex(game: Game) {
    return -game.jett.life + 3;
}

export function updateJett(game: Game) {
    if (!game.jett.start) return;
    if (isDeadJett(game)) {
        if (game.jett.fn) clearInterval(game.jett.fn);
        delete game.jett.fn;
        return;
    }
    const control = listControl[lifeToIndex(game)];
    const { interval, vel } = control;
    const { x, y } = game.jett.info;
    if (control.firstTime) {
        clearInterval(game.jett.fn);
        control.firstTime = false;
        game.jett.fn = setInterval(() => {
            createNewBall(game, x, y, vel * Math.random() + 200);
        }, interval);
    }
}

const TURN = "turn-jett";

export function createJettMap(game: Game, x: number, y: number) {
    const { jett } = game;
    jett.info = game.physics.add.sprite(x, y, JETT);
    jett.info.setDepth(4);
    jett.info.anims.play(TURN);
}

export function createJett(game: Game) {
    game.anims.create({
        key: TURN,
        frames: game.anims.generateFrameNumbers(JETT, {
            start: 0,
            end: 2,
        }),
        frameRate: 3,
        repeat: -1,
    });
}

export function collideJett(game: Game) {
    game.jett.collideGround = game.physics.add.collider(
        game.jett.info,
        game.platform
    );
    game.jett.colliderPlayer = game.physics.add.overlap(
        game.jett.info,
        game.bat.info,
        () => hit(game)
    );
}

function damageJett(game: Game) {
    if (game.jett.invisible) return;
    game.jett.invisible = true;
    game.jett.life--;
    const tween = game.tweens.add({
        targets: game.bat.info,
        ease: "Power1",
        duration: 100000000,
        loop: 10,
        loopDelay: 100,
    });

    tween.on("start", () => {
        game.jett.info.setTintFill(0xffffff);
    });

    let toggle = true;
    tween.on("loop", () => {
        if (toggle) {
            game.jett.info.setTintFill(0xffffff);
        } else {
            game.jett.info.clearTint();
        }
        toggle = !toggle;
    });
    tween.on("complete", () => {
        game.jett.invisible = false;
    });
}

function killJett(game: Game) {
    if (game.jett.invisible || isDeadJett(game)) return;
    const jett = game.jett;
    jett.info.setVelocityY(-500);
    jett.collideGround?.destroy();
    delete jett.collideGround;
    game.balls.forEach((b) => destroyBall(game, b));
    jett.life--;
}

export function hitJett(game: Game) {
    if (game.jett.life > 1) damageJett(game);
    else killJett(game);
}

