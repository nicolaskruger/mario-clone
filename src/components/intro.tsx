type IntroProps = {
    start: () => void;
};

import { useEffect, useRef } from "react";
import styles from "./intro.module.css";

export function Intro({ start }: IntroProps) {
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);
    return (
        <form className={styles.div} onSubmit={start}>
            <h1>Lenda da Princesa WEN</h1>
            <p>
                Morceguinho(meu gato preto) que deve enfrentar a terrível vilã
                Jett(sua irmã) e seu exercito de bolas de pelos, que roubaram
                toda a ração e sequestraram a princesa WEN(também minha gata).
            </p>
            <p>
                comados <strong>w, a, s, d, j, k</strong>
            </p>
            <button ref={ref} className={styles.button}>
                Salvar a Princesa !!!
            </button>
        </form>
    );
}

