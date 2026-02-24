# Guía de Ejercicios — Efectos, Pipelines Reales y Arquitectura de Sistemas

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este capítulo responde la pregunta: ¿cómo los algoritmos de los capítulos
> anteriores se convierten en piezas de un sistema real con múltiples fuentes
> de datos, errores, asincronía y flujos concurrentes?

---

## El mapa completo del repositorio

```
Capa 1 — Algoritmos puros         Cap.01–15   → correctos, eficientes, en memoria
Capa 2 — Composición funcional    Cap.16      → cómo encadenarlos sin estado
Capa 3 — Manejo de efectos        Cap.17 §1–3 → errores, nulos, asincronía
Capa 4 — Orquestación de flujo    Cap.17 §4–6 → múltiples fuentes, backpressure
Capa 5 — Arquitectura             Cap.17 §7   → todo junto en un sistema real
```

**La brecha crítica entre capas 2 y 3:**

Los algoritmos de los Cap.01–16 asumen un mundo ideal:
- Los datos están en memoria, son correctos y completos
- Las funciones nunca fallan
- No hay concurrencia ni latencia

El mundo real tiene exactamente lo opuesto. Este capítulo cubre esa brecha.

```python
# Lo que los cap.01-16 asumen:
def procesar(datos):
    return sorted(datos, key=lambda x: x.valor)  # siempre funciona

# Lo que el mundo real requiere:
async def procesar_real(fuente_datos):
    try:
        datos = await fuente_datos.leer()        # puede tardar, puede fallar
        if not datos:
            return Error("fuente vacía")
        validados = validar(datos)               # puede retornar parcialmente válidos
        return Ok(sorted(validados, key=...))
    except TimeoutError:
        return Error("timeout después de 5s")
    except ConexionError as e:
        return Error(f"BD no disponible: {e}")
```

---

## Tabla de contenidos

- [Sección 17.1 — Result y Option: el fin de las excepciones silenciosas](#sección-171--result-y-option-el-fin-de-las-excepciones-silenciosas)
- [Sección 17.2 — Railway-Oriented Programming](#sección-172--railway-oriented-programming)
- [Sección 17.3 — Asincronía y efectos IO](#sección-173--asincronía-y-efectos-io)
- [Sección 17.4 — Streams reactivos y backpressure](#sección-174--streams-reactivos-y-backpressure)
- [Sección 17.5 — Combinando múltiples fuentes de datos](#sección-175--combinando-múltiples-fuentes-de-datos)
- [Sección 17.6 — Los algoritmos del repositorio en pipelines reales](#sección-176--los-algoritmos-del-repositorio-en-pipelines-reales)
- [Sección 17.7 — Arquitectura: todo junto](#sección-177--arquitectura-todo-junto)

---

## Sección 17.1 — Result y Option: el fin de las excepciones silenciosas

El primer problema del mundo real: **las funciones pueden fallar**.
Las excepciones resuelven esto pero con un costo: el tipo de retorno miente.
`int buscar(lista, elemento)` dice que retorna `int` pero puede lanzar
`ElementoNoEncontrado` en cualquier momento — un efecto invisible en el tipo.

**La solución funcional:** hacer el fallo explícito en el tipo de retorno.

```python
from dataclasses import dataclass
from typing import TypeVar, Generic, Callable

T = TypeVar('T')
E = TypeVar('E')

@dataclass
class Ok(Generic[T]):
    value: T
    def is_ok(self): return True
    def is_err(self): return False

@dataclass
class Err(Generic[E]):
    error: E
    def is_ok(self): return False
    def is_err(self): return True

Result = Ok[T] | Err[E]

# Ahora el tipo dice la verdad:
def buscar(lista: list, elemento) -> Result[int, str]:
    try:
        return Ok(lista.index(elemento))
    except ValueError:
        return Err(f"'{elemento}' no encontrado en la lista")

# El llamador DEBE manejar ambos casos — no puede ignorar el error
resultado = buscar([1, 2, 3], 5)
match resultado:
    case Ok(idx):  print(f"Encontrado en índice {idx}")
    case Err(msg): print(f"Error: {msg}")
```

**Option / Maybe — para valores que pueden no existir:**

```python
# En lugar de retornar None (que se olvida de verificar)
# se retorna Some(valor) o Nothing

@dataclass
class Some(Generic[T]):
    value: T

class Nothing:
    pass

Option = Some[T] | Nothing

def primer_elemento(lista) -> Option:
    return Some(lista[0]) if lista else Nothing()

# El tipo obliga a manejar el caso vacío
match primer_elemento([]):
    case Some(x): print(f"Primer elemento: {x}")
    case Nothing(): print("Lista vacía")
```

**Cómo se conecta con el repositorio:**

```
Cap.04 Dijkstra:    retorna distancias — pero ¿qué si no hay camino?
                    Result[Dict[Nodo, int], str]  vs  Dict[Nodo, float]
                    (con inf para indicar "no alcanzable" — ¡un hack!)

Cap.10 Trie:        search() retorna bool — ¿o debería retornar Option[Nodo]?
Cap.09 Union-Find:  find() asume que el nodo existe — ¿qué si no?
Cap.12 KMP:         retorna índice o -1 — el -1 es un "null disfrazado"
```

---

### Ejercicio 17.1.1 — Implementar Result y Option desde cero

**Enunciado:** Implementa los tipos `Result[T, E]` y `Option[T]` con las operaciones fundamentales:
- `map(f)` — aplica `f` al valor si es Ok/Some, propaga el error si no
- `flat_map(f)` — como `map` pero `f` retorna otro `Result`/`Option`
- `unwrap_or(default)` — retorna el valor o un default si es error
- `ok_or(error)` — convierte `Option` en `Result`

**Restricciones:** Las operaciones no deben lanzar excepciones — toda la lógica de error vive en el tipo.

**Pista:** `map` y `flat_map` (también llamado `bind` o `>>=` en Haskell) son las operaciones que convierten `Result` en una mónada. Con ellas se puede encadenar operaciones falibles sin anidar `if error: return error`.

**Implementar en:** Python · Java (Optional ya existe) · Go · C# · Rust (Result/Option nativo)

---

### Ejercicio 17.1.2 — Refactorizar KMP con Result

**Enunciado:** Refactoriza la búsqueda KMP del Cap.12 para que:
- `construir_lps(patron)` retorne `Result[List[int], str]` — falla si el patrón está vacío
- `buscar(texto, patron)` retorne `Result[List[int], str]` — lista de posiciones o error
- `primer_match(texto, patron)` retorne `Option[int]` — la primera posición o nada

**Restricciones:** Sin excepciones. Sin retornar -1 o None como señal de error.

**Pista:** El tipo `Option[int]` es más honesto que retornar `-1` — obliga al llamador a manejar el caso "no encontrado" en lugar de olvidarse de verificar `if resultado == -1`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.1.3 — Refactorizar Dijkstra con Result

**Enunciado:** Refactoriza Dijkstra (Cap.04 §3) para que:
- `camino_minimo(grafo, origen, destino)` retorne `Result[List[Nodo], str]`
- Si el destino no es alcanzable, retorne `Err("nodo no alcanzable")`
- Si algún peso es negativo, retorne `Err("pesos negativos detectados — usar Bellman-Ford")`
- Si origen o destino no existen, retorne `Err("nodo no existe en el grafo")`

**Restricciones:** La función principal no lanza excepciones — devuelve Result en todos los casos.

**Pista:** Los múltiples tipos de error sugieren un tipo enumerado: `type DijkstraError = NodoInexistente | NoAlcanzable | PesoNegativo`. Esto es más expresivo que un simple `str`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.1.4 — Validación con Result acumulativo

**Enunciado:** Implementa una función `validar_grafo(datos_json)` que valide:
1. El JSON tiene la estructura correcta
2. Todos los nodos son enteros no negativos
3. Todos los pesos son positivos
4. El grafo no tiene auto-ciclos
5. La lista de adyacencia es consistente (si A→B existe, B debe ser un nodo declarado)

La función debe **acumular todos los errores** (no parar al primero) y retornar `Result[Grafo, List[str]]`.

**Restricciones:** Si hay múltiples errores, el usuario debe verlos todos de una vez, no uno por iteración.

**Pista:** Este patrón se llama `Validation` (o `Applicative`) — diferente de `Result` que cortocircuita al primer error. Para acumular errores, usa una lista y combina los resultados al final.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.1.5 — Option en búsqueda sobre Trie

**Enunciado:** Refactoriza el Trie del Cap.10 para que todas las operaciones que "pueden no encontrar" retornen `Option`:
- `buscar(palabra)` → `Option[NodoTrie]`
- `prefijo_mas_largo(texto)` → `Option[str]`
- `sugerencia_autocompletado(prefijo)` → `Option[List[str]]`

Implementa además `Option.map` y `Option.flat_map` para encadenar las búsquedas sin verificar `None` en cada paso.

**Restricciones:** Sin comparaciones con `None`. El tipo `Option` hace el chequeo estructuralmente.

**Pista:** `trie.buscar("ca").flat_map(lambda n: n.hijos.get('t')).map(lambda n: n.es_fin)` es más limpio que `if (n := trie.buscar("ca")) and (m := n.hijos.get('t')): return m.es_fin`.

**Implementar en:** Python · Java · Rust

---

## Sección 17.2 — Railway-Oriented Programming

**Railway-Oriented Programming (ROP)** es la metáfora más útil para entender
cómo encadenar funciones falibles. Imagina dos rieles paralelos:

```
Riel feliz:  →→→ validar() →→→ transformar() →→→ guardar() →→→ Ok(resultado)
                    |                |                |
Riel error:  ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←  Err(motivo)
```

Una vez que el tren cae al riel de error, **pasa por todas las etapas siguientes
sin ejecutarlas** — se propaga automáticamente hasta el final.

```python
# SIN ROP — pirámide de la muerte
def procesar_pedido(pedido_raw):
    pedido = parsear(pedido_raw)
    if pedido is None:
        return None
    cliente = buscar_cliente(pedido.cliente_id)
    if cliente is None:
        return None
    stock = verificar_stock(pedido.items)
    if not stock.disponible:
        return None
    resultado = cobrar(cliente, stock.precio_total)
    if resultado.fallo:
        return None
    return confirmar_pedido(pedido, cliente)

# CON ROP — flujo lineal
def procesar_pedido(pedido_raw):
    return (parsear(pedido_raw)
            .flat_map(lambda p: buscar_cliente(p.cliente_id)
                      .map(lambda c: (p, c)))
            .flat_map(lambda pc: verificar_stock(pc[0].items)
                      .map(lambda s: (*pc, s)))
            .flat_map(lambda pcs: cobrar(pcs[1], pcs[2].precio_total))
            .flat_map(lambda r: confirmar_pedido(r.pedido, r.cliente)))

# Versión más limpia con pipe() helper:
def procesar_pedido(pedido_raw):
    return pipe(
        parsear(pedido_raw),
        flat_map(lambda p: buscar_cliente(p.cliente_id)),
        flat_map(lambda c: verificar_stock(c.pedido.items)),
        flat_map(lambda s: cobrar(s.cliente, s.precio_total)),
        flat_map(confirmar_pedido)
    )
```

**Cómo los algoritmos del repositorio encajan en ROP:**

```
Cada algoritmo puro se convierte en una etapa del pipeline:

parsear_input()           → Result[DatosGrafo, ErrorParseo]
    |
    └→ construir_grafo()  → Result[Grafo, ErrorGrafo]       # Cap.04
          |
          └→ dijkstra()   → Result[Camino, NodoInalcanzable] # Cap.04 §3
                |
                └→ formatear_respuesta()  → Result[JSON, ErrorFormato]
```

---

### Ejercicio 17.2.1 — Implementar pipe() y compose() para Result

**Enunciado:** Implementa las funciones:
- `pipe(valor, *funciones)` — aplica funciones en secuencia, cortocircuita en el primer error
- `compose_result(*funciones)` — crea una función que es la composición de todas
- `tap(f)` — ejecuta `f` para efectos secundarios (logging) sin alterar el valor

**Restricciones:** `pipe` y `compose_result` deben funcionar con cualquier función `T → Result[U, E]`.

**Pista:** `pipe(Ok(5), flat_map(doblar), flat_map(validar_par))` debe retornar `Ok(10)` si `10` es par. Si alguna función falla, las siguientes no se ejecutan.

**Implementar en:** Python · Java · C# · Rust

---

### Ejercicio 17.2.2 — Pipeline de validación de datos de entrada

**Enunciado:** Construye un pipeline ROP completo para validar y procesar datos de un grafo leídos desde JSON:

```
raw_string
    → parsear_json()           Result[dict, "JSON inválido"]
    → extraer_estructura()     Result[DatosGrafo, "campos faltantes"]
    → validar_tipos()          Result[DatosGrafo, "tipos incorrectos"]
    → validar_semantica()      Result[DatosGrafo, "grafo inválido"]
    → construir_grafo()        Result[Grafo, "error de construcción"]
```

**Restricciones:** Cada etapa es una función pura. El pipeline no usa `try/except`. El tipo de error es descriptivo.

**Pista:** El JSON de prueba debe incluir casos que fallen en cada etapa — para verificar que el cortocircuito funciona correctamente y el error reportado identifica exactamente dónde falló.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.2.3 — ROP con algoritmos del Cap.03

**Enunciado:** Construye un pipeline que procese un arreglo de enteros con ROP:

```
entrada_raw
    → parsear_enteros()        Result[List[int], "entrada no numérica"]
    → validar_no_vacio()       Result[List[int], "lista vacía"]
    → validar_rango()          Result[List[int], "valores fuera de rango [0, 10^6]"]
    → calcular_prefix_sums()   Result[List[int], str]    ← Cap.03
    → responder_consultas()    Result[List[int], str]
```

**Restricciones:** Sin excepciones. Sin valores centinela (-1, None, inf).

**Pista:** La validación de rango puede reportar exactamente qué valores y en qué posiciones fallaron — información que una excepción genérica no da.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.2.4 — Dead-end branches: when to give up vs retry

**Enunciado:** No todos los errores son definitivos. Implementa un pipeline que distingue entre:
- `ErrorRecuperable` — vale la pena reintentar (timeout, conexión caída)
- `ErrorDefinitivo` — no tiene sentido reintentar (datos corruptos, autorización denegada)

Usa este criterio en un pipeline de búsqueda sobre un Trie remoto (simula la llamada remota con una función que falla aleatoriamente).

**Restricciones:** El tipo `Result` tiene dos variantes de error: `Err(Recuperable(motivo))` y `Err(Definitivo(motivo))`. El retry solo ocurre con `Recuperable`.

**Pista:** Esto es el origen del patrón `Retry` y `Circuit Breaker`. La lógica de retry es limpia en PF porque el estado del pipeline está encapsulado en el tipo — no hay variables globales que corromper al reintentar.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.2.5 — Logging sin romper la pureza

**Enunciado:** Los pipelines reales necesitan logs. Implementa logging en un pipeline ROP sin romper la pureza de las funciones — usando la función `tap` del Ejercicio 17.2.1.

El log debe registrar: etapa, duración, resultado (Ok/Err), y datos relevantes.

**Restricciones:** Las funciones del pipeline no deben saber que están siendo logueadas — el logging es un concern externo.

**Pista:** `tap(lambda r: logger.info(f"después de validar: {r}"))` ejecuta el log como efecto secundario sin alterar `r`. Esto es la separación de concerns aplicada: la lógica de negocio y el logging son ortogonales.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 17.3 — Asincronía y Efectos IO

Cuando los algoritmos del repositorio necesitan datos que no están en memoria
— una base de datos, una API, un archivo — aparece la asincronía.

```python
# SÍNCRONO — el hilo espera mientras la BD responde
def obtener_grafo(id_grafo):
    return bd.query(f"SELECT * FROM grafos WHERE id = {id_grafo}")
    # El hilo está bloqueado aquí, sin hacer nada útil

# ASÍNCRONO — el hilo puede hacer otras cosas mientras espera
async def obtener_grafo(id_grafo):
    return await bd.async_query(f"SELECT * FROM grafos WHERE id = {id_grafo}")
    # El hilo se libera y puede procesar otras solicitudes
```

**La complejidad oculta: async contagia**

```python
# Si obtener_grafo() es async, TODO lo que la llame debe ser async también
async def procesar_solicitud(id_grafo):           # async por obtener_grafo
    grafo = await obtener_grafo(id_grafo)         # await necesario
    return dijkstra(grafo, origen, destino)       # esto sí puede ser síncrono

async def manejar_request(request):              # async por procesar_solicitud
    resultado = await procesar_solicitud(request.grafo_id)
    return respuesta(resultado)
```

**async + Result — la combinación real:**

```python
async def pipeline_completo(request) -> Result[Respuesta, str]:
    # Cada await puede fallar → cada uno retorna Result
    grafo_result = await obtener_grafo(request.grafo_id)
    if grafo_result.is_err():
        return grafo_result

    grafo = grafo_result.value
    camino = dijkstra(grafo, request.origen, request.destino)  # síncrono puro
    return await guardar_resultado(camino)

# Versión más limpia con async_flat_map:
async def pipeline_completo(request):
    return await (
        (await obtener_grafo(request.grafo_id))
        .map(lambda g: dijkstra(g, request.origen, request.destino))
        .async_flat_map(guardar_resultado)
    )
```

---

### Ejercicio 17.3.1 — async/await + Result

**Enunciado:** Implementa un pipeline asíncrono que:
1. Obtiene datos de un grafo desde una "API" simulada (función async que puede fallar)
2. Construye el grafo en memoria (síncrono puro — Cap.04)
3. Ejecuta Dijkstra (síncrono puro — Cap.04 §3)
4. Guarda el resultado en una "BD" simulada (función async que puede fallar)

**Restricciones:** Cada paso retorna `Result`. El pipeline maneja `async + Result` de forma limpia sin anidar `try/except`.

**Pista:** Implementa `async_flat_map` que aplana un `Result[Awaitable[Result]]` — el equivalente async de `flat_map`.

**Implementar en:** Python (asyncio) · Java (CompletableFuture) · C# (Task) · Rust (tokio)

---

### Ejercicio 17.3.2 — Timeout y cancelación

**Enunciado:** Envuelve cualquier operación async con:
- `con_timeout(operacion, segundos)` → `Result[T, "timeout"]`
- `con_reintento(operacion, intentos, delay)` → `Result[T, "máx intentos agotados"]`
- `con_fallback(operacion, fallback)` → ejecuta `fallback` si `operacion` falla

Úsalas en el pipeline del ejercicio anterior.

**Restricciones:** Las tres funciones son genéricas — funcionan con cualquier operación async.

**Pista:** El timeout en Python se implementa con `asyncio.wait_for`. El reintento debe tener backoff exponencial: espera 1s, luego 2s, luego 4s... para no saturar el servicio que falló.

**Implementar en:** Python · Java · C# · Go · Rust

---

### Ejercicio 17.3.3 — Paralelismo controlado con gather

**Enunciado:** Dado un conjunto de IDs de grafos, ejecuta Dijkstra en todos ellos en paralelo con un límite máximo de `k` operaciones concurrentes (semáforo).

**Restricciones:** No más de `k=5` operaciones concurrentes al mismo tiempo. Si alguna falla, continúa con las demás y reporta los errores al final.

**Pista:** En Python, `asyncio.gather(*tareas, return_exceptions=True)` ejecuta todas en paralelo. El semáforo `asyncio.Semaphore(k)` limita la concurrencia. Este patrón aparece en cualquier sistema que llama a una API con rate limiting.

**Implementar en:** Python · Java · C# · Go · Rust

---

### Ejercicio 17.3.4 — Fire-and-forget vs await — cuándo usar cada uno

**Enunciado:** Implementa dos versiones de un pipeline:
1. **Síncrono crítico:** calcular el camino más corto (Dijkstra) y retornar al usuario
2. **Asíncrono no crítico:** después de retornar, guardar el resultado en caché, enviar métricas y actualizar logs — sin que el usuario espere

**Restricciones:** El usuario recibe la respuesta en cuanto Dijkstra termina. Las tareas secundarias se ejecutan en paralelo, en background.

**Pista:** En Python, `asyncio.create_task(tarea_secundaria())` inicia la tarea sin esperar. En Java, `CompletableFuture.runAsync(...)`. Este patrón es omnipresente en APIs REST de alta performance.

**Implementar en:** Python · Java · C# · Go · Rust

---

### Ejercicio 17.3.5 — Efecto IO explícito (Haskell y Rust)

**Enunciado:** En Haskell, todo efecto IO vive en el tipo `IO`. Implementa el pipeline completo del Ejercicio 17.3.1 en Haskell, donde el tipo de retorno `IO (Either String Respuesta)` hace explícito que: (a) hay efectos IO, (b) puede fallar.

En Rust, replica esto con `Result<Respuesta, AppError>` dentro de una función `async`.

**Restricciones:** El compilador debe garantizar que las funciones puras (Dijkstra, construcción del grafo) no pueden tener efectos IO — el tipo lo impide.

**Pista:** En Haskell, `runExceptT :: ExceptT e IO a → IO (Either e a)` combina la mónada de error con la mónada IO. En Rust, `async fn` + `Result` logra lo mismo con menos ceremonial.

**Implementar en:** Haskell · Rust

---

## Sección 17.4 — Streams Reactivos y Backpressure

Cuando los datos llegan continuamente (eventos, logs, transacciones), los algoritmos
del repositorio se convierten en **operadores de un pipeline de streaming**.

```
Fuente de datos        Pipeline de transformación        Destino
┌─────────────┐        ┌──────────────────────────┐     ┌─────────┐
│ Kafka topic  │──────→│ filter → map → aggregate │────→│ Base de │
│ API REST     │        │                          │     │  datos  │
│ WebSocket    │        │  (algoritmos del repo)   │     │ o cache │
└─────────────┘        └──────────────────────────┘     └─────────┘
```

**El problema central: velocidades desiguales**

```
Productor genera: 10,000 eventos/segundo
Consumidor procesa: 3,000 eventos/segundo

Sin backpressure: el buffer se llena → crash o pérdida de datos
Con backpressure: el consumidor le dice al productor "espera" cuando no puede más
```

**Los algoritmos del repositorio como operadores:**

```python
# Kafka Streams / RxPY / cualquier framework reactivo

stream_de_eventos
    .filter(lambda e: e.tipo == "compra")          # Cap.03 filter
    .map(lambda e: calcular_descuento(e))          # Cap.06 greedy
    .window(TumblingWindow(segundos=60))           # Cap.03 ventana deslizante
    .aggregate(lambda ventana: sum(v.monto for v in ventana))  # Cap.03 fold
    .filter(lambda total: total > umbral_alerta)   # Cap.03 filter
    .sink(alertas_db)
```

---

### Ejercicio 17.4.1 — Implementar un stream procesador simple

**Enunciado:** Implementa un procesador de stream que aplique una secuencia de operadores (`filter`, `map`, `reduce_by_window`) sobre una secuencia de eventos que llegan de forma asíncrona.

El stream de eventos simula transacciones financieras. El pipeline debe:
1. Filtrar transacciones válidas (montos positivos, usuario existe)
2. Clasificar por tipo (Cap.06 greedy — prioridad de procesamiento)
3. Agregar por ventana de 1 minuto (Cap.03 ventana deslizante)
4. Detectar anomalías (suma de ventana > umbral)

**Restricciones:** El procesador no sabe cuándo llega el próximo evento — es reactivo.

**Pista:** Usar `asyncio.Queue` en Python para simular el stream. El procesador consume de la cola y aplica los operadores — patrón producer/consumer.

**Implementar en:** Python · Java (Stream/Flow) · C# (IAsyncEnumerable)

---

### Ejercicio 17.4.2 — Backpressure explícito

**Enunciado:** Implementa un pipeline productor/consumidor donde el consumidor puede señalizar al productor que reduzca la velocidad. El productor genera números y el consumidor los procesa con `es_primo` (Cap.14) — que es más lento que generarlos.

**Restricciones:** Si el buffer supera `max_size=100`, el productor debe esperar. Si el buffer baja de `min_size=10`, el productor puede continuar.

**Pista:** En Python, `asyncio.Queue(maxsize=100)` implementa backpressure automático: `put()` bloquea si la cola está llena. En sistemas de producción, Kafka y RxJava tienen backpressure integrado.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 17.4.3 — Ventana deslizante sobre stream

**Enunciado:** Implementa el algoritmo de ventana deslizante del Cap.03 §3 sobre un stream infinito de datos. La ventana tiene tamaño `k` en tiempo (no en cantidad de elementos). Calcula el promedio móvil y detecta picos.

**Restricciones:** La ventana debe manejar eventos fuera de orden (llegaron tarde) — descártalos si están más de 5 segundos fuera de la ventana actual.

**Pista:** El estado de la ventana es `(timestamp_inicio, timestamp_fin, elementos)`. Los eventos fuera de orden son comunes en sistemas distribuidos (retraso de red). La decisión de descartar vs reordenar es un trade-off entre latencia y exactitud.

**Implementar en:** Python · Java · C#

---

### Ejercicio 17.4.4 — Merge de múltiples streams ordenados

**Enunciado:** Tienes `k` streams de eventos, cada uno ordenado por timestamp. Merges todos en un único stream ordenado globalmente. Usa el heap del Cap.05 para el merge eficiente.

**Restricciones:** Los streams pueden tener velocidades distintas. El merge no debe bloquear si un stream está temporalmente vacío — espera con timeout.

**Pista:** Este es exactamente el problema del Ejercicio 5.2.4 del Cap.05, pero ahora los datos llegan de forma asíncrona. El heap mantiene el "frente" de cada stream. Con `k=10` streams y `n` eventos totales, la complejidad es `O(n log k)`.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 17.4.5 — Circuit Breaker como operador de stream

**Enunciado:** Implementa el patrón Circuit Breaker como un operador del pipeline. El Circuit Breaker tiene tres estados: `Cerrado` (funcionando), `Abierto` (fallando — rechaza solicitudes sin intentarlas), `Semiabierto` (probando si se recuperó).

Úsalo para proteger el paso de "guardar en BD" del pipeline.

**Restricciones:** El Circuit Breaker se abre después de `n` fallos consecutivos y se prueba después de `t` segundos.

**Pista:** El Circuit Breaker es el patrón de resiliencia más importante en microservicios. En términos funcionales es un operador que transforma `Result → Result` — intercepta los errores y decide si propagar o cortocircuitar según el historial.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 17.5 — Combinando Múltiples Fuentes de Datos

El caso más complejo: cuando el resultado depende de **múltiples fuentes**
que se consultan en paralelo y cuyos resultados se combinan.

```python
# Patrón: fan-out / fan-in
# Fan-out: distribuir el trabajo a múltiples fuentes en paralelo
# Fan-in:  combinar los resultados cuando todos terminaron

async def enriquecer_pedido(pedido_id):
    # Fan-out: 3 consultas en paralelo
    datos_pedido, perfil_cliente, disponibilidad_stock = await asyncio.gather(
        obtener_pedido(pedido_id),           # BD de pedidos
        obtener_cliente(pedido_id.cliente),  # BD de clientes
        verificar_stock(pedido_id.items)     # API de inventario
    )

    # Fan-in: combinar
    if any(r.is_err() for r in [datos_pedido, perfil_cliente, disponibilidad_stock]):
        errores = [r.error for r in [...] if r.is_err()]
        return Err(f"Fallos al obtener datos: {errores}")

    return Ok(combinar(datos_pedido.value, perfil_cliente.value, disponibilidad_stock.value))
```

**Cuándo el orden importa:**

```
Fan-out independiente:    A ──┐
                         B ──┼──→ combinar(A, B, C)   todos en paralelo
                         C ──┘

Fan-out dependiente:      A ──→ B(resultado_A) ──→ C(resultado_B)
                          (waterfall — no se puede paralelizar)

Fan-out mixto:            A ──┐
                         B(A) ──┼──→ combinar(A, B, C)
                         C ──┘
                         (A y C en paralelo, B espera A)
```

---

### Ejercicio 17.5.1 — Fan-out / fan-in con gather

**Enunciado:** Dado un nodo en un grafo distribuido (datos en múltiples servicios), construye el grafo completo consultando en paralelo:
- Servicio A: nodos y sus atributos
- Servicio B: aristas y sus pesos
- Servicio C: metadatos del grafo (nombre, fecha de creación)

Combina los tres resultados en un `Grafo` completo, manejando fallos parciales.

**Restricciones:** Los tres servicios se consultan en paralelo. Si el Servicio B falla, el grafo se construye sin aristas (grafo vacío de aristas) — no es un error fatal.

**Pista:** La diferencia entre fallo fatal y degradación elegante es una decisión de negocio, no técnica. El pipeline funcional lo hace explícito: decides qué errores son recuperables y cómo degradar.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.5.2 — Join funcional de dos fuentes

**Enunciado:** Tienes dos streams: uno de "usuarios" y otro de "transacciones". Implementa un join por `user_id` — cada transacción debe enriquecerse con los datos del usuario correspondiente. Usa un HashMap (Cap.07) como caché de usuarios.

**Restricciones:** Los streams llegan en orden diferente. Si llega una transacción cuyo usuario no está en caché, consulta el servicio de usuarios (async) y cachea el resultado.

**Pista:** El join de streams es la operación más costosa en sistemas distribuidos. La caché reduce las llamadas repetidas — aplica el LRU Cache del Cap.07 §3.3 para limitar el tamaño de la caché.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.5.3 — Scatter-gather con timeout parcial

**Enunciado:** Tienes `n` réplicas de un servicio de búsqueda (cada una con un índice diferente). Lanza la misma consulta a todas en paralelo y retorna el primer resultado que llegue. Si después de 2 segundos no llega ninguno, retorna error.

**Variante:** Espera a tener al menos `k` respuestas (quorum) antes de retornar.

**Restricciones:** Cancela las solicitudes pendientes cuando ya tienes suficientes respuestas.

**Pista:** `asyncio.wait(..., return_when=FIRST_COMPLETED)` retorna la primera tarea completada. Este es el patrón "hedged requests" de Google — si una réplica es lenta, la otra ya respondió.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 17.5.4 — Saga pattern para operaciones distribuidas

**Enunciado:** Una operación de "crear pedido" involucra pasos en múltiples servicios:
1. Reservar stock (Servicio Inventario)
2. Cobrar al cliente (Servicio Pagos)
3. Asignar repartidor (Servicio Logística)
4. Notificar al cliente (Servicio Notificaciones)

Si el paso 3 falla, deben deshacerse los pasos 1 y 2 (compensación). Implementa este flujo.

**Restricciones:** Cada paso tiene una operación compensadora. Si el paso N falla, se ejecutan las compensaciones de N-1 hasta 1 en orden inverso.

**Pista:** Esto es el patrón Saga. En términos funcionales: cada paso retorna `(resultado, compensacion)`. El orquestador mantiene la lista de compensaciones ejecutadas y las invierte en caso de fallo. Es exactamente la estructura del backtracking del Cap.02 §3 — pero distribuido.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.5.5 — Materializar una vista con múltiples fuentes

**Enunciado:** Construye una "vista materializada" de un grafo de usuarios y sus conexiones, combinando:
- BD relacional: usuarios (id, nombre, email)
- BD de grafos: conexiones entre usuarios
- API externa: puntuación de reputación de cada usuario

El resultado es un grafo enriquecido donde cada nodo tiene atributos de las 3 fuentes.

Implementa actualización incremental: cuando cambia un usuario en la BD, actualiza solo ese nodo en la vista sin reconstruirla completa.

**Restricciones:** La construcción inicial puede ser O(n) pero la actualización incremental debe ser O(1) amortizado por usuario.

**Pista:** Usa el Union-Find del Cap.09 para mantener las componentes conectadas actualizadas incrementalmente — es la estructura exacta para este caso de uso.

**Implementar en:** Python · Java · Go · Rust

---

## Sección 17.6 — Los Algoritmos del Repositorio en Pipelines Reales

Esta sección mapea cada capítulo del repositorio a su uso natural
en un sistema de producción. No es teoría — es el destino real de los ejercicios.

```
La pregunta que responde esta sección:
"Aprendí Dijkstra / KMP / Union-Find... ¿dónde lo uso de verdad?"
```

**Mapa completo:**

```
Cap.01-02 Recursión/DP
    → Motor de recomendaciones (DP para scoring)
    → Compiladores y parsers (recursión descendente)
    → Sistemas de caché con eviction policy (DP)

Cap.03 Reducción de complejidad
    → Dos punteros: deduplicar registros en pipelines ETL
    → Ventana deslizante: métricas en tiempo real (p99 latencia)
    → Prefix sums: consultas de rango en analytics

Cap.04 Grafos
    → Dijkstra: routing de paquetes de red, GPS, microservicios mesh
    → BFS: búsqueda en redes sociales, web crawling
    → Topológico: sistema de build (Makefile, Gradle)

Cap.05 Heap
    → Task scheduler (sistema operativo, Kubernetes)
    → Top-K usuarios más activos en tiempo real
    → Merge de logs ordenados de múltiples servidores

Cap.06 Greedy
    → Scheduling de jobs en servidores (minimizar makespan)
    → Compresión de datos (Huffman — Cap.06 §5)
    → Rate limiting (token bucket)

Cap.09 Union-Find
    → Detección de ciclos en pipelines de CI/CD
    → Clustering de usuarios (misma IP, misma sesión)
    → Network partitioning detection

Cap.10 Trie
    → Autocompletado en buscadores
    → Routing de URLs (Express.js, FastAPI usan Radix Tree = Trie comprimido)
    → Filtros de contenido (lista de palabras prohibidas)

Cap.12 KMP
    → Búsqueda en logs de servidor
    → Detección de patrones en tráfico de red (IDS/IPS)
    → Grep distribuido

Cap.13 Bit manipulation
    → Feature flags (un int de 64 bits = 64 flags)
    → Bloom filters (presencia/ausencia sin false negatives)
    → Permisos en sistemas Unix/Linux

Cap.14 Teoría de números
    → Hashing (tablas hash con módulo primo)
    → Criptografía (RSA usa todo el Cap.14)
    → IDs únicos distribuidos (Snowflake ID usa aritmética modular)
```

---

### Ejercicio 17.6.1 — Dijkstra como servicio de routing

**Enunciado:** Implementa un microservicio REST que expone un endpoint `POST /ruta` que recibe `{origen, destino, grafo_id}` y retorna el camino más corto. El grafo se carga desde una "BD" (simulada) y se cachea en memoria.

**Restricciones:** El servicio debe manejar múltiples solicitudes concurrentes. Si el grafo no está en caché, lo carga (async). Límite de 5s por solicitud (timeout).

**Pista:** El caché de grafos es exactamente el LRU Cache del Cap.07 §3.3. Cuando el caché está lleno, evicta el grafo menos recientemente usado. El servicio completo usa: Dijkstra (Cap.04) + LRU Cache (Cap.07) + async/await (Cap.17 §3) + Result (Cap.17 §1).

**Implementar en:** Python (FastAPI) · Java (Spring Boot) · Go (net/http) · Rust (Axum)

---

### Ejercicio 17.6.2 — KMP para búsqueda en logs distribuidos

**Enunciado:** Tienes `n` archivos de log (uno por servidor). Busca todas las ocurrencias de un patrón en todos los logs en paralelo. Retorna las líneas que contienen el patrón, con el nombre del archivo y el número de línea.

**Restricciones:** Los archivos se procesan en paralelo (un thread/coroutine por archivo). El límite de concurrencia es `k=4`. El resultado se ordena por timestamp (en el log).

**Pista:** Cada archivo usa KMP (Cap.12) independientemente. El merge final de resultados ordenados usa el heap del Cap.05 (merge de k listas ordenadas). Este es exactamente cómo funciona `grep -r` paralelo.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 17.6.3 — Top-K elementos en tiempo real

**Enunciado:** Implementa un contador de "top-K URLs más visitadas" en tiempo real, procesando un stream de eventos de acceso. El resultado debe actualizarse con cada evento y ser consultable en cualquier momento.

**Restricciones:** `K=10`. El stream puede tener millones de eventos. Usar el heap del Cap.05 §4 para mantener el top-K eficientemente.

**Pista:** El patrón es: HashMap para conteos + Min-Heap de tamaño K para el top-K. Cuando un URL supera al mínimo del heap, lo reemplaza. Este es el algoritmo de `k elementos más frecuentes` del Cap.05 §4, ahora sobre un stream.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 17.6.4 — Sistema de build con topological sort

**Enunciado:** Implementa un mini sistema de build que dado un grafo de dependencias entre tareas:
1. Detecta ciclos (no se puede compilar con dependencias circulares)
2. Calcula el orden de compilación (topológico — Cap.04 §7)
3. Paraleliza tareas independientes (misma capa del orden topológico)
4. Reporta el camino crítico (la secuencia más larga que determina el tiempo total)

**Restricciones:** Las tareas del mismo nivel del ordenamiento topológico se ejecutan en paralelo. El camino crítico se calcula con el longest path en DAG (Cap.04 §7).

**Pista:** El longest path en un DAG es exactamente Dijkstra con pesos negativados, o DP sobre el orden topológico. Gradle y Maven hacen exactamente esto para decidir qué módulos compilar en paralelo.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 17.6.5 — Autocompletado con Trie + ranking

**Enunciado:** Implementa un servicio de autocompletado que:
1. Mantiene un Trie (Cap.10) de términos de búsqueda
2. Para cada prefijo, retorna las top-5 sugerencias por frecuencia (Cap.05 heap)
3. Actualiza las frecuencias en tiempo real cuando el usuario selecciona una sugerencia
4. Expira términos no usados en los últimos 30 días

**Restricciones:** Las consultas deben ser `O(m + k log k)` donde `m` = longitud del prefijo y `k` = candidatos. La actualización de frecuencias es `O(m)`.

**Pista:** Este es el sistema exacto que usan Google y Bing para autocompletado. Combina: Trie para el índice de prefijos (Cap.10) + Min-Heap para top-K (Cap.05) + LRU con timestamp para la expiración (Cap.07).

**Implementar en:** Python · Java · Go · Rust

---

## Sección 17.7 — Arquitectura: Todo Junto

Esta sección sintetiza los 17 capítulos en una arquitectura completa.
El sistema es un **motor de análisis de grafos** que recibe datos de múltiples
fuentes, los procesa y expone resultados vía API.

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA COMPLETO                          │
│                                                             │
│  Fuentes          Ingesta           Procesamiento           │
│  ────────         ──────────        ──────────────          │
│  REST API  ──────→ Validación  ──→  Construcción           │
│  Websocket ──────→ (Result/ROP)     del grafo               │
│  Archivos  ──────→              ──→  Algoritmos            │
│  BD        ──────→                  (Cap.01-15)             │
│                                 ──→  Caché LRU              │
│                                                             │
│  Salida           Orquestación      Efectos                 │
│  ──────           ──────────────    ──────────              │
│  API REST  ←──── Fan-in/out    ←──  async/await            │
│  Eventos   ←──── Saga pattern  ←──  Circuit Breaker        │
│  Métricas  ←──── Streams       ←──  Retry/Timeout          │
└─────────────────────────────────────────────────────────────┘
```

**Las capas de la arquitectura y su origen en el repositorio:**

```python
# Capa 1: Algoritmos puros (Cap.01-15) — sin efectos
def dijkstra(grafo, origen, destino): ...      # puro
def construir_grafo(nodos, aristas): ...       # puro
def detectar_ciclos(grafo): ...                # puro

# Capa 2: Composición funcional (Cap.16)
pipeline_analisis = compose(
    construir_grafo,
    detectar_ciclos,
    lambda g: dijkstra(g, origen, destino)
)

# Capa 3: Efectos y manejo de errores (Cap.17 §1-3)
async def analizar_con_efectos(grafo_id) -> Result[Analisis, str]:
    return await (
        obtener_grafo(grafo_id)            # async, puede fallar
        .flat_map(validar_grafo)           # ROP, puede fallar
        .map(pipeline_analisis)            # puro, no falla
        .async_flat_map(guardar_resultado) # async, puede fallar
    )

# Capa 4: Orquestación (Cap.17 §4-6)
async def procesar_batch(grafo_ids):
    return await asyncio.gather(*[
        con_timeout(
            con_reintento(analizar_con_efectos(id), intentos=3),
            segundos=10
        )
        for id in grafo_ids
    ], return_exceptions=True)
```

---

### Ejercicio 17.7.1 — Diseñar el modelo de datos y tipos

**Enunciado:** Diseña el modelo de tipos completo del sistema:
- `GrafoId`, `Nodo`, `Arista`, `Grafo` — tipos de dominio
- `GrafoRaw`, `GrafoDTO` — tipos de transferencia
- `AppError` — tipo de error enumerado con todas las variantes
- `Result[T]` — alias de `Result[T, AppError]`
- Las funciones de conversión entre capas: `GrafoRaw → Result[Grafo, AppError]`

**Restricciones:** Los tipos deben hacer imposibles los estados inválidos. Por ejemplo: un `Nodo` sin `GrafoId` no debe poder existir en el tipo.

**Pista:** "Make illegal states unrepresentable" es el principio de diseño de tipos en PF. Si el tipo es correcto, los errores de lógica se detectan en compilación, no en runtime.

**Implementar en:** Python (dataclasses + typing) · Java (records + sealed classes) · Rust (enums) · Haskell (ADTs)

---

### Ejercicio 17.7.2 — Implementar el núcleo de procesamiento

**Enunciado:** Implementa la capa de procesamiento puro (sin efectos):
```
GrafoBruto → validar → construir → analizar → GrafoAnalizado
```
Donde `analizar` incluye: detección de ciclos (Cap.04), componentes conectadas (Cap.09), caminos mínimos desde todos los nodos (Dijkstra múltiple origen, Cap.04), y centralidad básica (grado de cada nodo).

**Restricciones:** Todas las funciones son puras. El resultado es un `Result` — ninguna lanza excepción.

**Pista:** Este núcleo es testeable de forma trivial — sin mocks, sin setup de BD, sin servicios externos. Esa es la ventaja de separar los algoritmos puros de los efectos.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 17.7.3 — Implementar la capa de efectos

**Enunciado:** Envuelve el núcleo del ejercicio anterior con la capa de efectos:
- Leer el grafo desde una BD simulada (async, puede fallar)
- Cachear el resultado (LRU Cache del Cap.07, in-memory)
- Guardar el análisis en una BD simulada (async, puede fallar)
- Circuit Breaker sobre la BD de escritura

**Restricciones:** El núcleo puro no cambia — solo se añade la capa de efectos alrededor.

**Pista:** Esta separación (núcleo puro + capa de efectos) es la arquitectura hexagonal / ports & adapters. El núcleo nunca importa la BD — la BD importa el núcleo. Esto invierte las dependencias y hace el sistema testeable.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 17.7.4 — Implementar el API y la orquestación

**Enunciado:** Expone el sistema como una API REST con los endpoints:
- `POST /grafos` — ingesta un grafo nuevo (valida, construye, cachea)
- `GET /grafos/{id}/camino?origen=X&destino=Y` — camino mínimo
- `GET /grafos/{id}/ciclos` — detección de ciclos
- `POST /grafos/batch` — procesa múltiples grafos en paralelo (fan-out/fan-in)

**Restricciones:** El endpoint batch acepta hasta 20 grafos. Máximo 5 análisis en paralelo (semáforo). Timeout de 10s por análisis.

**Pista:** El API es la capa más fina del sistema — solo traduce HTTP a llamadas al núcleo y respuestas a JSON. No tiene lógica de negocio propia.

**Implementar en:** Python (FastAPI) · Java (Spring Boot) · Go (net/http) · Rust (Axum)

---

### Ejercicio 17.7.5 — Testing funcional del sistema completo

**Enunciado:** Escribe tests para el sistema completo usando las propiedades de la arquitectura funcional:

1. **Tests unitarios del núcleo** — sin mocks, sin BD, sin red
2. **Property-based testing** — genera grafos aleatorios y verifica invariantes (Dijkstra ≥ 0, sin ciclos si es DAG, etc.)
3. **Tests de integración con fakes** — reemplaza BD y servicios con implementaciones en memoria
4. **Tests de resiliencia** — simula fallos del Circuit Breaker, timeouts, backpressure

**Restricciones:** Los tests del núcleo puro no deben tener `async`, ni `mock`, ni `patch`. Si necesitan alguno de estos, el diseño está mal — el núcleo no es realmente puro.

**Pista:** La capacidad de testear el núcleo sin mocks es el beneficio más tangible de la arquitectura funcional. Un test de Dijkstra es `assert dijkstra(grafo, 'A', 'D') == Ok(['A', 'C', 'D'])` — nada más. Eso solo es posible porque `dijkstra` es una función pura.

**Implementar en:** Python (pytest + hypothesis) · Java (JUnit + QuickCheck) · Rust (proptest)

---

## Tabla resumen — Las 4 capas del sistema

| Capa | Capítulos | Herramientas | Testeable con |
|---|---|---|---|
| **Algoritmos puros** | Cap.01–15 | Recursión, DP, Grafos, etc. | `assert f(input) == output` |
| **Composición** | Cap.16 | map/filter/fold/compose | Property-based testing |
| **Efectos** | Cap.17 §1–3 | Result, async/await, IO | Fakes, tipos de error |
| **Orquestación** | Cap.17 §4–6 | Streams, gather, Saga | Tests de integración |

## El principio central

> **Empuja los efectos hacia los bordes.**
>
> El centro del sistema son funciones puras (Cap.01–16) que son fáciles
> de razonar, testear y reutilizar. Los efectos (BD, red, tiempo, aleatoriedad)
> viven solo en la capa más externa.
>
> Cuanto más delgada es la capa de efectos, más robusto es el sistema.
>
> Los 16 capítulos anteriores construyen el centro.
> Este capítulo construye el borde.

---

## Guía de lectura complementaria

| Tema | Libro / recurso |
|---|---|
| Railway-Oriented Programming | "Domain Modeling Made Functional" — Scott Wlaschin |
| Arquitectura funcional | "Functional Design and Architecture" — Alexander Granin |
| Efectos y mónadas | "Haskell Programming from First Principles" — Allen & Moronuki |
| Streams reactivos | "Reactive Design Patterns" — Roland Kuhn |
| Testing funcional | "Property-Based Testing with PropEr, Erlang, and Elixir" — Fred Hébert |
| Todo junto | "Structure and Interpretation of Computer Programs" — Abelson & Sussman |
