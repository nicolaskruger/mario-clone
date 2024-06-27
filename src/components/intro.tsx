type IntroProps = {
    start: () => void;
};

import styles from "./intro.module.css";

export function Intro({ start }: IntroProps) {
    return (
        <div className={styles.div}>
            <h1>Lenda da Princesa WEN</h1>
            <p>
                Morceguinho(meu gato preto) que deve enfrentar a terrível vilã
                Jett(sua irmã) e seu exercito de bolas de pelos, que roubaram
                toda a ração e sequestraram a princesa WEN(também minha gata).
            </p>
            <p>
                comados <strong>w, a, s, d, j, k</strong>
            </p>
            <button className={styles.button} onClick={start}>
                Salvar a Princesa !!!
            </button>
        </div>
    );
}

