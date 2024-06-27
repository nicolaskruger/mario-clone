import { use, useEffect, useRef, useState } from "react";
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

    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <form className={styles.div} onSubmit={restart}>
            <h1>GAME OVER</h1>
            <p>
                Jett ficou com toda a comida, suas bolas de pelos dominaram todo
                o quarto, Princesa foi deixada trancada no banheiro. Mas havia
                uma esperança...
            </p>
            <p>{timer}</p>
            <button ref={ref} className={styles.button}>
                Salvar a Princesa !!!
            </button>
        </form>
    );
}

