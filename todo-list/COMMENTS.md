1. **Estructura**:

   - El proyecto se ha estructurado en 4 ficheros:
        -src\app\todo-list\todo-list.component.html
        -src\app\todo-list\todo-list.component.ts
        -src\app\todo-list\todo-list.component.spec.ts
        -src\app\todo.service.ts

   -HTML:
      -En primer lugar, hay un div que contiene el input junto a un botón para añadir nuevas tareas mediante un evento click que llama a addTask() y le pasa el valor del input.

      -El siguiente div contiene los filtros: uno es un selector que, con el evento change, llama a selectFilter(), y el filtro en el botón llama a importantFilter().

      -La lista se muestra mediante un ngFor que recorre los elementos de filteredTodos$, actualizando la vista en todo momento conforme recibe los cambios a los que está suscrito.

      -El botón con el svg ha sido modificado: he suprimido la función toggleClass() que aplicaba la clase al pulsar sobre él, y en su lugar he sustituido por updateImportant(), que actualiza el estado de importancia. Para el estilo, he aplicado [ngClass], que aplica el estilo deseado cuando el valor es true.

      -Por último, el checkbox tiene una funcionalidad similar a la del botón, pero llama a updateComplete().

   -TS:

      -En el ngOnInit(), se hace la solicitud al servicio y se reciben los datos de la lista. Llamamos a updateCount() para actualizar el número de tareas y recibimos el último estado de las tareas.

      -addTask() añade la nueva tarea llamando al servicio y a la función addTaskToApi(), donde se le pasan los nuevos valores. Una vez terminado, muestra un mensaje en la consola y actualiza la lista de tareas. En caso de que falle, mostrará un mensaje de error.

      -updateImportant() tiene una funcionalidad similar a la de añadir, salvo que cambia el estado de la tarea y llama a updateTaskStatus().

      -updateComplete(), al igual que updateImportant(), actualiza el estado de completado. Se implementó de forma diferente debido a un bug generado por updateImportant().

      -importantFilter() filtra las tareas que tienen el valor important en true y luego las posiciona en primer lugar.

      -selectFilter() recibe el evento del selector y filtra todas las tareas completadas si el evento es 'completed', y si no, muestra la lista completa.
   
   SPEC:

      -En el beforeEach, he mockeado el servicio pasando las diversas funciones a probar.

      -He creado un mock del array con dos ejemplos de tareas.

      -should contain tasks: verifica, mediante su id #todoList, que la lista no esté vacía.

      -should add new task: verifica que se agrega una nueva tarea llamando al servicio.

      -should filter and sort tasks by importance: valida que se aplica el filtro por importancia.

   Service:
      -He creado un servicio para implementar las operaciones GET, POST y PUT, simulando una posible funcionalidad que el proyecto necesitaría en diversos componentes.


2. **Mejoras**:

      -Aplicaría la opción de añadir un tercer botón junto al de "important" y al checkbox para eliminar la tarea deseada.

      -Facilitaría mediante un input que los textos de las tareas ya mostradas pudieran modificarse.

      -Mostraría un tooltip o modal indicando el cambio de estados (por ejemplo, "Nueva tarea", "Tarea eliminada", "Tarea actualizada", etc.) para que el usuario esté informado en todo momento. (Ahora, estos cambios solo se pueden ver por medio de console.log()).

      -Implementaría una función que verifique si una tarea ya existe en la lista.

      -Añadiría un nuevo input para buscar tareas mediante texto predictivo

3. **Errores**: 

      -Durante el desarrollo, encontré clases que no estaban funcionando y las eliminé para mejorar la legibilidad del código.

      -He eliminado el test toggleClass() ya que finalmente no se ha utilizado.



      
