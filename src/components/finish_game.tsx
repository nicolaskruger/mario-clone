import styles from "./intro.module.css";

import _ from "./finish_game.module.css";

export function FinishGame() {
    return (
        <div className={styles.div}>
            <div className={_.div_img}>
                <h1>Princesa WEN</h1>
                <p>
                    Morceguinho resgatou a princesa WEN e distribuiu igualmente
                    a ração entre todos os gatos.
                </p>
                <img className={_.img} src="/assets/end-game.jpg" alt="" />
            </div>
        </div>
    );
}

