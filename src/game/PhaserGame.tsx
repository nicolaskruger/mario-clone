import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";
import styles from "./phaser.module.css";
import { Game } from "./scenes/Game";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const game = useRef<Phaser.Game | null>(null!);

        const [food, setFood] = useState(0);
        const [endiabrado, setEndiabrado] = useState(0);

        useEffect(() => {
            const func = setInterval(() => {
                if (typeof ref === "object") {
                    const _game = ref?.current?.scene;
                    if (_game instanceof Game) {
                        setFood(_game.bat.food);
                        setEndiabrado(_game.bat.endiabrado);
                    }
                }
            }, 200);
            return () => clearInterval(func);
        }, []);

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    if (game.current !== null) {
                        game.current = null;
                    }
                }
            };
        }, [ref]);

        useEffect(() => {
            EventBus.on(
                "current-scene-ready",
                (scene_instance: Phaser.Scene) => {
                    if (
                        currentActiveScene &&
                        typeof currentActiveScene === "function"
                    ) {
                        currentActiveScene(scene_instance);
                    }

                    if (typeof ref === "function") {
                        ref({ game: game.current, scene: scene_instance });
                    } else if (ref) {
                        ref.current = {
                            game: game.current,
                            scene: scene_instance,
                        };
                    }
                }
            );
            return () => {
                EventBus.removeListener("current-scene-ready");
            };
        }, [currentActiveScene, ref]);

        return (
            <div id="game-container" className={styles.div}>
                <div className={styles.div_div}>
                    <span className={styles.span}>
                        <strong>food:</strong> {food}
                    </span>
                    <span
                        className={`${styles.span} ${
                            endiabrado === 20 && styles.endiabrado
                        }`}
                    >
                        <strong>endiabrado:</strong> {endiabrado}/20
                    </span>
                </div>
            </div>
        );
    }
);

