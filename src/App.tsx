import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { Game } from "./game/scenes/Game";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const [food, setFood] = useState(0);
    const [endiabrado, setEndiabrado] = useState(0);

    const addSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene;

            if (scene) {
                // Add a new sprite to the current scene at a random position
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);

                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                scene.add.sprite(x, y, "star");
            }
        }
    };

    useEffect(() => {
        const func = setInterval(() => {
            const game = phaserRef.current?.scene;
            if (game instanceof Game) {
                setFood(game.bat.food);
                setEndiabrado(game.bat.endiabrado);
            }
        }, 200);
        return () => clearInterval(func);
    }, []);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div>
                <div>
                    <button className="button">{food}</button>
                    <button className="button">{endiabrado}</button>
                </div>
            </div>
        </div>
    );
}

export default App;

