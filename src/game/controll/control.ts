import { Scene } from "phaser";

export type Control = {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    J: Phaser.Input.Keyboard.Key;
    K: Phaser.Input.Keyboard.Key;
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

