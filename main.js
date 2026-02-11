const jugadores = (nombre, marca) => {
    return {nombre, marca}
}

const tablero = (function(){
    let posiciones = ["", "", "", "", "", "", "", "", ""];
    const marcar = (indice, marca) => {
        if (posiciones[indice] === "") {
            console.log("Acabas de escoger una posicion");
            posiciones[indice] = marca;
            return true;
        } else {
            console.log(`Jugada no valida`);
            return false;
        }
    }

    const obtenerPosicion = () =>{
        return [...posiciones];
    }
    return {
        marcar, obtenerPosicion
    };
}) ();

const controlador = (function(){
    const jugador1 = jugadores("Juan", "X");
    const jugador2 = jugadores("Alberto", "O");
    let turnoActual = jugador1;

    let juegoTerminado = false;

    const victoria = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]
    
    const verificarVictoria = () =>{
        const tableroActual = tablero.obtenerPosicion();
        const ganador = victoria.some(combinacion => {
            const a = combinacion[0];
            const b = combinacion[1];
            const c = combinacion[2];

            return (
                tableroActual[a] !== "" && 
                tableroActual[a] === tableroActual[b] &&
                tableroActual[a] === tableroActual[c] 
            );
        });
        if (ganador) {
            juegoTerminado = true;
            console.log(`¡¡Victoria!!`);
        }

        return ganador;
    }

    let cambioTurno = () =>{
        turnoActual = (turnoActual === jugador1) ? jugador2 : jugador1;
    }

    const jugarTurno = (indice) => {
        if (juegoTerminado) return;

        tablero.marcar(indice, turnoActual.marca);
        
            if (verificarVictoria()){
                console.log(`El jugador ${turnoActual.nombre} ha ganado`);
            } else {
                cambioTurno();
            }
    };
    const finished = () => {
        return juegoTerminado;
    }
    const  sacarTurnoActual = () => {
        return turnoActual
    }

    return {
        jugarTurno, sacarTurnoActual, verificarVictoria, finished
    }

}) ();

const display = (function() {
    const cells = document.querySelectorAll("button");
    const updateScreen = () => {
        const board = tablero.obtenerPosicion();
        const currentPlayer = controlador.sacarTurnoActual();
        const finalStatus = document.querySelector(`#status`);
        cells.forEach((button, i) => {
            button.textContent = board[i];
        });
        if (controlador.finished()){
        finalStatus.textContent = `¡Felicidades! El jugador ${currentPlayer.nombre} ha ganado`;
        } else {
        finalStatus.textContent = `Es el turno de ${currentPlayer.nombre}`;
    }
};

    

    cells.forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;

            controlador.jugarTurno (index);

            updateScreen();
        })
    })

    return {
        updateScreen
    }
}) ();