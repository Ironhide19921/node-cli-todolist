// const { mostrarMenu, pausa } = require('./helpers/mensajes');
require('colors');
const inquirer = require('inquirer');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu,
        pausa,
        leerInput, 
        listadoTareasBorrar, 
        confirmar,
        mostrarListadoCheckList } = require('./helpers/inquirer');
// const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');


const main = async () => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if( tareasDB ){
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea(desc);
                break;

            case '2':
                // console.log(tareas.listadoArr);
                tareas.listadoCompleto();
                break;

            case '3':
                tareas.listarPendientesCompletadas(true);
                break;
            
            case '4':
                tareas.listarPendientesCompletadas(false);
                break;
            
            case '5':
                const ids = await mostrarListadoCheckList( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
                break;

            case '6': //Borrar
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0') {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                break;
        }

        guardarDB( tareas.listadoArr);

        // const tarea = new Tarea('Comprar comida');
        // const tareas = new Tareas();
        // tareas._listado[tarea.id] = tarea;
        // console.log(tareas);

        await pausa();
        // if ( opt !== '0' ) await pausa();
        
    } while ( opt !== '0' );

};

main();