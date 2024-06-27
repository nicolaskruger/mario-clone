import { use, useEffect, useState } from "react";
import styles from "./intro.module.css";

export function GameOver({ restart }: { restart: () => void }) {
    const [timer, setTimer] = useState(10);

    useEffect(() => {
        if (timer <= 0) restart();
    }, [timer]);

    useEffect(() => {
        const fn = setInterval(() => {
            setTimer((t) => --t);
        }, 1000);
        return () => clearInterval(fn);
    }, []);

    return (
        <div className={styles.div}>
            <h1>GAME OVER</h1>
            <p>
                Jett ficou com toda a comida, suas bolas de pelos dominaram todo
                o quarto, Princesa foi deixada trancada no banheiro. Mas havia
                uma esperança...
            </p>
            <p>{timer}</p>
            <button className={styles.button} onClick={restart}>
                Salvar a Princesa !!!
            </button>
        </div>
    );
}

