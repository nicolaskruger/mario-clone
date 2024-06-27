import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { Game } from "./game/scenes/Game";
import { EDictionary } from "./game/map/map";
import { Intro } from "./components/intro";
import { GameOver } from "./components/game.over";
import { FinishGame } from "./components/finish_game";

type GameScreen = "intro" | "in_game" | "game_hover" | "finish_game";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const [gameState, setGameState] = useState<"over" | "finish" | "playing">(
        "playing"
    );

    const [gameScreen, setGameScreen] = useState<GameScreen>("intro");

    const dictionary: EDictionary<GameScreen, () => JSX.Element> = {
        intro: () => <Intro start={() => setGameScreen("in_game")} />,
        in_game: () => <PhaserGame ref={phaserRef} />,
        game_hover: () => <GameOver restart={() => setGameScreen("in_game")} />,
        finish_game: () => <FinishGame />,
    };

    useEffect(() => {
        if (gameState === "over") setGameScreen("game_hover");
        if (gameState === "finish") setGameScreen("finish_game");
    }, [gameState]);

    useEffect(() => {
        const func = setInterval(() => {
            const game = phaserRef.current?.scene;
            if (game instanceof Game) {
                setGameState(game.gameState);
            }
        }, 200);
        return () => clearInterval(func);
    }, []);

    return <div id="app">{dictionary[gameScreen]()}</div>;
}

export default App;

