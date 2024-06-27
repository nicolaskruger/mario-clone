import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { Game } from "./game/scenes/Game";
import { EDictionary } from "./game/map/map";
import { Intro } from "./components/intro";

type GameScreen = "intro" | "in_game" | "game_hover" | "finish_game";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const [food, setFood] = useState(0);
    const [endiabrado, setEndiabrado] = useState(0);

    const [gameScreen, setGameScreen] = useState<GameScreen>("intro");

    const dictionary: EDictionary<GameScreen, () => JSX.Element> = {
        intro: () => <Intro start={() => setGameScreen("in_game")} />,
        in_game: () => <PhaserGame ref={phaserRef} />,
        game_hover: () => <div></div>,
        finish_game: () => <div></div>,
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

    return <div id="app">{dictionary[gameScreen]()}</div>;
}

export default App;

