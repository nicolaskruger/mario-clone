import { EDictionary } from "../map/map";

export type Collider = Phaser.Physics.Arcade.Collider;

type DCollider = EDictionary<string, Collider[]>;

export const insertDCollider = (
    dict: DCollider,
    key: string,
    collider: Collider
) => {
    if (!dict[key]) dict[key] = [];
    dict[key].push(collider);
};

export const getDCollider = (dict: DCollider, key: string): Collider[] =>
    dict[key] || [];

export type ColliderBundle = {
    collider: Collider;
    active: boolean;
};

