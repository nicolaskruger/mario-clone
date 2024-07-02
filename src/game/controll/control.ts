import { Scene } from "phaser";
import Phaser from "phaser";

type Key = Phaser.Input.Keyboard.Key;

export type Control = {
    W: Key;
    A: Key;
    S: Key;
    D: Key;
    J: Key;
    K: Key;
};

const keyGen = (
    scene: Scene,
    keys: keyof typeof Phaser.Input.Keyboard.KeyCodes
) => scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes[keys]);

export const createControl = (scene: Scene): Control => {
    return "WASDJK".split("").reduce((acc, curr) => {
        return {
            ...acc,
            [curr]: keyGen(
                scene,
                curr as keyof typeof Phaser.Input.Keyboard.KeyCodes
            ),
        };
    }, {} as Control);
};

