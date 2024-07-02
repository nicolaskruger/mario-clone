import { Input, Scene } from "phaser";
import { createControl } from "./control";
import Phaser from "phaser";

jest.mock("phaser", () => ({
    Input: {
        Keyboard: {
            KeyCodes: {
                W: 0,
                A: 1,
                S: 2,
                D: 3,
                J: 4,
                K: 5,
            },
        },
    },
}));

describe("control", () => {
    let scene: Scene;
    let addKey: jest.Mock<number, [code: number], any>;
    beforeEach(() => {
        addKey = jest.fn((code: number) => code);
        scene = {
            input: { keyboard: { addKey } },
        } as unknown as Scene;
    });
    test("create control", () => {
        createControl(scene);

        "WASDJK"
            .split("")
            .map((key) => key as keyof typeof Phaser.Input.Keyboard.KeyCodes)
            .map((key) => Phaser.Input.Keyboard.KeyCodes[key])
            .forEach((code, i) => {
                expect(addKey.mock.calls[i][0]).toBe(code);
            });
    });
});

