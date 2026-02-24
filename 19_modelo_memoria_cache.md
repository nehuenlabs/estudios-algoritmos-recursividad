# Guía de Ejercicios — Modelo de Memoria y Localidad de Caché

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este capítulo cierra el repositorio explicando retroactivamente por qué
> ciertas implementaciones de Cap.01–18 son más rápidas en la práctica,
> aunque la complejidad teórica sea idéntica.

---

## La brecha que este capítulo cierra

A lo largo del repositorio medimos complejidad en **operaciones abstractas**.
Esa métrica asume que todas las operaciones cuestan lo mismo.

Es mentira.

```
Acceder a un dato que está en...      Tiempo real     Equivalente humano
──────────────────────────────────    ───────────     ──────────────────
Registro del procesador               0.3 ns          1 segundo
Caché L1 (32–64 KB por núcleo)        1 ns            3 segundos
Caché L2 (256 KB – 1 MB)             4 ns             12 segundos
Caché L3 (8–64 MB compartida)        20 ns            1 minuto
RAM (DRAM)                           100 ns           5 minutos
SSD NVMe                          100,000 ns          ~4 días
HDD                            10,000,000 ns          ~1 año

Fuente: "Latency Numbers Every Programmer Should Know" — Jeff Dean, 2012
(actualizadas aproximadamente cada año — el orden de magnitud es estable)
```

**La consecuencia directa para los algoritmos del repositorio:**

```
Dos algoritmos con la misma complejidad O(n log n):
  Merge Sort:   accede a memoria de forma secuencial → cache-friendly
  Heap Sort:    salta por el arreglo según la estructura del heap → cache-hostile

En un arreglo de 10^7 elementos:
  Merge Sort:  ~0.8 segundos
  Heap Sort:   ~2.1 segundos    ← 2.6x más lento, misma complejidad

¿Por qué? Heap Sort genera cache misses en cada sift-down.
El procesador pide datos que no están en caché, espera 100ns,
y eso se acumula a lo largo de n log n operaciones.
```

---

## Tabla de contenidos

- [Sección 19.1 — La jerarquía de memoria: números que importan](#sección-191--la-jerarquía-de-memoria-números-que-importan)
- [Sección 19.2 — Cache-friendly vs cache-hostile: los algoritmos del repo](#sección-192--cache-friendly-vs-cache-hostile-los-algoritmos-del-repo)
- [Sección 19.3 — Localidad espacial y temporal](#sección-193--localidad-espacial-y-temporal)
- [Sección 19.4 — Estructuras de datos y su huella de caché](#sección-194--estructuras-de-datos-y-su-huella-de-caché)
- [Sección 19.5 — Optimizaciones concretas: blocking, prefetching, layout](#sección-195--optimizaciones-concretas-blocking-prefetching-layout)
- [Sección 19.6 — El modelo externo: cuando los datos no caben en RAM](#sección-196--el-modelo-externo-cuando-los-datos-no-caben-en-ram)
- [Sección 19.7 — Medir antes de optimizar](#sección-197--medir-antes-de-optimizar)

---

## Sección 19.1 — La Jerarquía de Memoria: Números que Importan

El procesador no accede directamente a la RAM. Hay múltiples niveles de caché
entre el procesador y la memoria, cada uno más grande y más lento.

```
                ┌─────────────────────────────┐
                │   Procesador (núcleo)        │
                │  ┌─────────────────────┐    │
                │  │ Registros  (~3 ns)  │    │
                │  └────────┬────────────┘    │
                │  ┌────────┴────────────┐    │
                │  │  L1 cache  (~1 ns)  │    │  32–64 KB
                │  │  (instrucciones+datos)   │
                │  └────────┬────────────┘    │
                │  ┌────────┴────────────┐    │
                │  │  L2 cache  (~4 ns)  │    │  256 KB – 1 MB
                │  └────────┬────────────┘    │
                └───────────┼─────────────────┘
                ┌───────────┴─────────────────┐
                │  L3 cache  (~20 ns)          │  8–64 MB (compartida)
                └───────────┬─────────────────┘
                ┌───────────┴─────────────────┐
                │  RAM (DRAM)  (~100 ns)       │  GB
                └─────────────────────────────┘
```

**La línea de caché — la unidad real de transferencia:**

```python
# El procesador NO trae un byte de RAM al caché.
# Trae una LÍNEA DE CACHÉ completa: 64 bytes en x86_64 moderno.

# Si lees arr[0], el procesador trae arr[0..15] (16 ints de 4 bytes = 64 bytes)
# Si luego lees arr[1], ya está en caché → ~1 ns
# Si lees arr[1000], no está en caché → cache miss → ~100 ns

import ctypes

CACHE_LINE_SIZE = 64  # bytes en x86_64

# ¿Cuántos ints de 4 bytes caben en una línea de caché?
ints_por_linea = CACHE_LINE_SIZE // ctypes.sizeof(ctypes.c_int)  # = 16

# ¿Cuántos doubles de 8 bytes?
doubles_por_linea = CACHE_LINE_SIZE // ctypes.sizeof(ctypes.c_double)  # = 8
```

**Cache miss vs cache hit — medirlo en Python:**

```python
import time
import random

def medir_acceso_secuencial(n=10_000_000):
    """Acceso secuencial — cache-friendly."""
    arr = list(range(n))
    inicio = time.perf_counter()
    total = sum(arr)  # accede a arr[0], arr[1], arr[2]... en orden
    return time.perf_counter() - inicio, total

def medir_acceso_aleatorio(n=10_000_000):
    """Acceso aleatorio — genera cache misses."""
    arr = list(range(n))
    indices = list(range(n))
    random.shuffle(indices)  # orden completamente aleatorio
    inicio = time.perf_counter()
    total = sum(arr[i] for i in indices)  # salta por el arreglo
    return time.perf_counter() - inicio, total

# En un arreglo de 10^7 enteros (~80 MB):
# Secuencial: ~0.3s
# Aleatorio:  ~1.5s  ← 5x más lento, misma cantidad de accesos
```

---

### Ejercicio 19.1.1 — Medir la jerarquía de caché empíricamente

**Enunciado:** Diseña un experimento que mida indirectamente el tamaño de L1, L2 y L3 en tu máquina. El principio: acceder a un arreglo más grande que el caché L1 es más lento que uno que cabe en L1.

Para arreglos de tamaño `{1KB, 2KB, 4KB, ..., 256MB}`, mide el tiempo de `10^7` accesos secuenciales. Grafica tiempo/acceso vs tamaño — deberían aparecer "escalones" en los tamaños de L1, L2 y L3.

**Restricciones:** Cada tamaño debe iterarse el suficiente tiempo como para que el resultado sea estable. Controla que el compilador no optimice el loop (usa el resultado de la suma).

**Pista:** Los escalones pueden no ser nítidos en Python por el overhead del intérprete. En C, Go o Rust el patrón es muy claro. En Python, usa `array.array` (arreglo contiguo en memoria) en lugar de `list` (array de punteros).

**Implementar en:** Python (array.array) · Java · Go · C# · Rust

---

### Ejercicio 19.1.2 — Cache miss por stride

**Enunciado:** Mide el tiempo de acceder a un arreglo con diferentes "strides" (saltos entre accesos): stride=1 (secuencial), stride=2, stride=4, ..., stride=64, stride=128.

Un stride mayor que la línea de caché (64 bytes / 4 bytes por int = 16) significa que cada acceso genera un cache miss.

**Restricciones:** Arreglo de `10^7` enteros. Cada stride accede a `n/stride` elementos. Normaliza por número de accesos para comparar justamente.

**Pista:** El tiempo debe ser aproximadamente constante para stride ≤ 16, luego crecer abruptamente para stride > 16. Esto confirma que la línea de caché es 64 bytes.

**Implementar en:** Go · C# · Rust (en Python el efecto es menos visible)

---

### Ejercicio 19.1.3 — False sharing en estructuras contiguas

**Enunciado:** El "false sharing" ocurre cuando dos variables independientes comparten una línea de caché. Si dos hilos modifican esas variables en paralelo, cada modificación invalida la línea de caché del otro hilo — aunque no compartan datos lógicamente.

Demuestra false sharing: dos contadores en posiciones contiguas de un arreglo son más lentos de incrementar en paralelo que dos contadores separados por 64 bytes.

**Restricciones:** Usa dos hilos reales. Mide la diferencia entre `arr[0]` y `arr[1]` (false sharing) vs `arr[0]` y `arr[16]` (sin false sharing en ints de 4 bytes).

**Pista:** Alinear estructuras a 64 bytes (el tamaño de la línea de caché) es la solución estándar. En Go: `type Contador struct { v int64; _ [56]byte }`. El padding evita que dos Contadores compartan línea de caché.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.1.4 — Prefetcher del procesador

**Enunciado:** Los procesadores modernos tienen un "prefetcher" que detecta patrones de acceso y pre-carga datos antes de que se necesiten. Diseña accesos que el prefetcher puede predecir (secuencial, stride fijo) vs accesos que no puede (aleatorio, dependiente de datos).

Mide la diferencia de rendimiento entre:
1. Acceso secuencial → prefetcher activo
2. Acceso con stride fijo de 8 → prefetcher puede detectarlo
3. Acceso siguiendo una lista enlazada → pointer chasing, el prefetcher no puede predecir
4. Acceso aleatorio → ni el prefetcher ni la caché ayudan

**Restricciones:** Todos los accesos leen la misma cantidad de datos. El pointer chasing usa un arreglo donde `arr[i]` contiene el índice del siguiente elemento (lista enlazada en un arreglo).

**Pista:** El pointer chasing es la razón por la que las listas enlazadas son lentas en práctica aunque sean O(1) para inserción. El prefetcher no puede predecir el siguiente nodo hasta leer el actual.

**Implementar en:** Go · C# · Rust

---

### Ejercicio 19.1.5 — Modelo de costo real para los algoritmos del repo

**Enunciado:** Construye una tabla de "costo real" para los algoritmos del repositorio, considerando cache misses. Para cada algoritmo, estima el número de cache misses por operación y el tiempo real esperado.

Verifica empíricamente para:
1. Búsqueda binaria en arreglo de `10^6` enteros ordenados
2. Búsqueda en árbol BST con `10^6` nodos
3. Acceso a HashMap con `10^6` elementos
4. Merge Sort vs Quick Sort vs Heap Sort en `10^6` enteros

**Restricciones:** Usa `time.perf_counter()` con 100 repeticiones para promediar. Desactiva la caché entre mediciones borrando el arreglo y reconstruyendo (o usa tamaños grandes que excedan L3).

**Pista:** La búsqueda binaria en un arreglo tiene `O(log n)` comparaciones pero los últimos niveles del árbol implícito son cache-misses garantizados — los elementos distantes en el arreglo. El árbol BST con punteros es peor aún: cada nodo puede estar en cualquier parte de la memoria.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 19.2 — Cache-friendly vs Cache-hostile: los Algoritmos del Repo

Con el modelo de memoria claro, revisamos los algoritmos de Cap.01–15
bajo esta nueva lente. Algunos encajan naturalmente; otros son sorprendentemente malos.

```
CLASIFICACIÓN REVISADA de los algoritmos del repositorio:

Cache-FRIENDLY (accesos locales y predecibles):
  ✅ Merge Sort         → procesa subarreglos contiguos
  ✅ Prefix Sums        → barrido lineal izquierda-derecha
  ✅ DP tabulación 1D   → llena la tabla de izquierda a derecha
  ✅ KMP               → barrido lineal del texto
  ✅ Dos punteros       → acceso convergente pero siempre local
  ✅ Ventana deslizante → ventana contigua

Cache-HOSTILE (saltos impredecibles en memoria):
  ⚠️  Heap Sort          → sift-down salta por el arreglo
  ⚠️  Quick Sort (naive) → partition accede a posiciones lejanas
  ⚠️  Árbol BST         → cada nodo es un puntero a posición aleatoria
  ⚠️  Dijkstra con lista → lista de adyacencia = punteros dispersos
  ⚠️  DFS en grafo      → saltos entre nodos en memoria dispersa
  ❌  Lista enlazada    → pointer chasing puro

Depende de la implementación:
  🔄 Hash Map           → bueno si carga baja, malo con muchas colisiones
  🔄 DP tabulación 2D  → cache-friendly si se llena por filas (row-major)
                          cache-hostile si se llena por columnas (column-major)
  🔄 Union-Find         → con path compression, los accesos se vuelven locales
```

**El caso paradigmático — DP 2D row-major vs column-major:**

```python
import time

N = 2000

def dp_row_major():
    """Llena la tabla fila por fila — acceso secuencial en memoria."""
    dp = [[0] * N for _ in range(N)]
    for i in range(1, N):
        for j in range(1, N):         # j varía rápido → acceso a dp[i][j], dp[i][j-1]
            dp[i][j] = dp[i-1][j] + dp[i][j-1]  # datos contiguos en memoria
    return dp[N-1][N-1]

def dp_column_major():
    """Llena la tabla columna por columna — salta N posiciones en memoria."""
    dp = [[0] * N for _ in range(N)]
    for j in range(1, N):
        for i in range(1, N):         # i varía rápido → acceso a dp[i][j], dp[i-1][j]
            dp[i][j] = dp[i-1][j] + dp[i][j-1]  # dp[i-1][j] está N posiciones atrás
    return dp[N-1][N-1]

# dp_row_major:    ~0.8s
# dp_column_major: ~2.1s  ← 2.6x más lento, misma lógica
# (en Python, el efecto es menos dramático que en C — pero existe)
```

---

### Ejercicio 19.2.1 — Medir la diferencia Merge Sort vs Heap Sort

**Enunciado:** Implementa Merge Sort y Heap Sort (los del Cap.08) e instala `perf` o usa `time.perf_counter` para medir el tiempo real en arreglos de `{10^4, 10^5, 10^6, 10^7}` elementos. Grafica tiempo vs n para ambos.

**Restricciones:** Misma implementación que en Cap.08 — no optimizar para este ejercicio. El objetivo es medir la diferencia, no eliminarla.

**Pista:** Para `n = 10^6`, Merge Sort debería ser ~2x más rápido que Heap Sort en implementaciones naive de lenguaje compilado. En Python, el overhead del intérprete reduce la diferencia — usa Java, Go o Rust para ver el efecto completo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 19.2.2 — DP 2D: el impacto del orden de iteración

**Enunciado:** Para el algoritmo de LCS (Longest Common Subsequence, Cap.03 §6 o Cap.16 §3.4), implementa dos versiones que llenan la tabla DP de formas distintas y mide la diferencia de tiempo:
1. Row-major: el índice interno varía la columna `j`
2. Column-major: el índice interno varía la fila `i`

**Restricciones:** Strings de longitud 3000 × 3000 (tabla de 9 × 10^6 celdas). Mide con 5 repeticiones y toma la mediana.

**Pista:** En C/C++/Java/Go, los arreglos 2D se almacenan en row-major por defecto (`arr[i][j]` y `arr[i][j+1]` son contiguos). Acceder `arr[i][j]` y `arr[i+1][j]` implica saltar N posiciones — un cache miss para N grande.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.2.3 — Búsqueda binaria vs árbol BST: el costo de los punteros

**Enunciado:** Para `n = 10^6` búsquedas en un conjunto de `10^6` elementos, compara:
1. Búsqueda binaria en arreglo ordenado → `O(log n)` cache misses
2. Árbol BST balanceado (AVL o Red-Black) → `O(log n)` cache misses pero en memoria dispersa
3. Árbol B (B-tree con `t=32`) → `O(log_32 n)` niveles, cada nodo llena una línea de caché

**Restricciones:** Los tres tienen `O(log n)` comparaciones. La diferencia debe ser solo por localidad de caché.

**Pista:** El árbol B es la respuesta de las bases de datos al problema de caché. En lugar de 1 elemento por nodo (BST), tiene hasta 2t-1 elementos por nodo, empaquetados en un bloque de disco o línea de caché. PostgreSQL, MySQL, SQLite usan B-trees para todos sus índices.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.2.4 — Grafos: lista de adyacencia vs matriz

**Enunciado:** Para BFS (Cap.04 §1) en un grafo de `10^4` nodos y `10^5` aristas, compara:
1. Lista de adyacencia (la representación estándar del Cap.04)
2. Matriz de adyacencia comprimida (CSR — Compressed Sparse Row)
3. Matriz densa (solo factible para grafos pequeños)

**Restricciones:** El grafo es denso para la comparación 3 (`n=1000` para que quepa en RAM). Para `n=10^4`, compara solo 1 y 2.

**Pista:** CSR empaqueta las listas de adyacencia en dos arreglos contiguos: `offsets[i]` indica dónde empiezan los vecinos del nodo `i` en el arreglo `vecinos`. El acceso es secuencial — todos los vecinos de un nodo son contiguos en memoria.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.2.5 — Profiling real: encontrar el cuello de botella

**Enunciado:** Usa un profiler real (`perf` en Linux, `Instruments` en Mac, `VTune` en Windows, o `py-spy` en Python) para analizar cuál de estos algoritmos tiene más cache misses:
1. Dijkstra con lista de adyacencia en grafo de `10^5` nodos
2. Quick Sort en arreglo de `10^6` elementos
3. Trie insert/search en `10^5` palabras

Reporta: L1 cache miss rate, L2 cache miss rate, instrucciones por ciclo (IPC).

**Restricciones:** Usa herramientas reales de profiling — no solo `time.perf_counter`. El objetivo es leer e interpretar el output del profiler.

**Pista:** Un IPC bajo (< 1) indica que el procesador pasa mucho tiempo esperando memoria. Un IPC alto (> 3) indica que el código es compute-bound. Dijkstra debería tener IPC más bajo que Quick Sort por la naturaleza de sus accesos.

**Implementar en:** C (para resultados más claros) · Java · Rust

---

## Sección 19.3 — Localidad Espacial y Temporal

Dos principios que el procesador explota agresivamente:

```
Localidad ESPACIAL: si accediste a la dirección X, probablemente
                    accederás pronto a X+1, X+2, X+3...
                    → el prefetcher carga la línea de caché completa

Localidad TEMPORAL: si accediste a X hace poco, probablemente
                    lo accederás de nuevo pronto
                    → X sigue en caché (no ha sido evictado)
```

**Cómo los algoritmos del repo usan (o violan) estos principios:**

```python
# BUENA localidad espacial: Merge Sort
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:   # left[i] y left[i+1] son contiguos ✅
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    return result + left[i:] + right[j:]

# MALA localidad espacial: Heap Sort sift-down
def sift_down(arr, n, i):
    largest = i
    left = 2 * i + 1    # salta al doble del índice actual
    right = 2 * i + 2   # otro salto
    # Para i=0: accede a 0, 1, 2     → razonablemente local
    # Para i=n/4: accede a n/4, n/2, n/2+1 → saltos de n/4 posiciones
    # Para i=1: accede a 1, 3, 4     → salta 2 posiciones
    # Patrón de acceso impredecible para el prefetcher ⚠️
```

---

### Ejercicio 19.3.1 — Reordenar un arreglo para mejorar localidad

**Enunciado:** Dado un arreglo de structs `{id, valor, categoria}` donde se accede frecuentemente a `valor` y `categoria` juntos pero raramente a `id`, compara dos layouts de memoria:
1. **AoS (Array of Structs)**: `[{id,val,cat}, {id,val,cat}, ...]`
2. **SoA (Struct of Arrays)**: `{ids:[...], valores:[...], categorias:[...]}`

Para una operación que procesa `valor` y `categoria` de todos los elementos, mide la diferencia.

**Restricciones:** `n = 10^6` structs. La operación es `sum(val * cat for val, cat in zip(valores, categorias))`.

**Pista:** AoS tiene mala localidad para accesos parciales: si solo necesitas `val` y `cat`, cargas también `id` en la línea de caché — espacio desperdiciado. SoA tiene excelente localidad para accesos por campo — los valores están contiguos.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.3.2 — Union-Find: por qué path compression mejora la localidad

**Enunciado:** Compara la localidad de caché de Union-Find con y sin path compression (Cap.09). Mide el número de accesos a memoria no locales para `10^5` operaciones `find` en un Union-Find de `10^5` elementos.

**Restricciones:** Define "acceso no local" como acceder a `padre[i]` donde `|i - prev_i| > 16` (cruza una línea de caché). Cuenta estos accesos con y sin path compression.

**Pista:** Sin path compression, un `find` en un árbol degenerado recorre `O(n)` nodos — todos potencialmente no locales. Con path compression, después de la primera llamada, el árbol es plano: todos los nodos apuntan directamente a la raíz — acceso local en futuras llamadas.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 19.3.3 — Trie vs HashMap para prefijos: localidad en práctica

**Enunciado:** Para buscar todos los strings que empiezan con un prefijo dado, compara Trie (Cap.10) vs HashMap de strings filtrado. Más allá de la complejidad, mide el número de cache misses en cada operación.

**Restricciones:** Vocabulario de `10^5` palabras, prefijo de longitud 3. La búsqueda en Trie es `O(m)` donde `m=3`; la búsqueda en HashMap es `O(V)`. La diferencia de complejidad es obvia — el objetivo es ver el perfil de memoria del Trie.

**Pista:** El Trie tiene mala localidad: cada nodo es un objeto con punteros a hijos en posiciones aleatorias de la memoria. Para vocabularios grandes, el Trie genera muchos cache misses aunque sea asintóticamente óptimo. El Array Mapped Trie (HAMT) resuelve esto empaquetando los hijos contiguamente.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.3.4 — Reutilización de caché en DP: orden de resolución

**Enunciado:** Para la mochila 0/1 (Cap.02 §2) con `n=1000` ítems y capacidad `W=10000`, compara tres órdenes de resolución:
1. DP estándar: `dp[i][w]` llenado por filas (item exterior, capacidad interior)
2. DP invertido: `dp[i][w]` llenado por columnas (capacidad exterior, item interior)
3. DP con una sola fila (optimización de espacio Cap.02): `dp[w]` actualizado in-place

**Restricciones:** Mide tiempo y número estimado de cache misses para los tres. La versión 3 usa `O(W)` espacio en lugar de `O(n*W)` — ¿es más rápida además de usar menos memoria?

**Pista:** La versión 3 (DP con una fila) tiene mejor localidad temporal: reutiliza la misma fila en cada iteración → los datos permanecen en L1/L2 caché. La tabla completa de `n*W` puede no caber en L3 para n y W grandes.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.3.5 — Bloom Filter y localidad (Cap.18 revisitado)

**Enunciado:** Un Bloom Filter de 10 MB tiene `k=7` posiciones de hash distribuidas uniformemente en `m` bits. Para `10^6` consultas, mide los cache misses del Bloom Filter vs un `set` de Python.

**Restricciones:** El Bloom Filter de 10 MB no cabe en L3 (asume L3 de 8 MB). Para un Bloom Filter que cabe en L2 (256 KB), la situación es diferente. Mide ambos tamaños.

**Pista:** Cuando el Bloom Filter cabe en L3, las `k=7` posiciones aleatorias suelen estar en caché → rendimiento excelente. Cuando no cabe, cada consulta puede generar hasta `k` cache misses → peor que un `set` pequeño. Hay una escala crítica donde el Bloom Filter "deja de ser barato".

**Implementar en:** Python · Java · Go · Rust

---

## Sección 19.4 — Estructuras de Datos y su Huella de Caché

Cada estructura de datos del repositorio tiene un "perfil de caché" distinto.
Esta sección los analiza uno por uno.

```
Estructura          Localidad espacial    Localidad temporal    Notas
──────────────      ─────────────────     ──────────────────    ──────
Arreglo             ✅ Excelente          ✅ Buena              Base de todo
Lista enlazada      ❌ Pésima             ⚠️ Depende            Pointer chasing
Stack (arreglo)     ✅ Excelente          ✅ Excelente          Top siempre en caché
Queue (arreglo)     ✅ Buena              ✅ Buena              head/tail en caché
Deque (arreglo)     ✅ Buena              ✅ Buena              Python collections.deque
HashMap (open addr) ✅ Buena (sin colisión) ✅ Buena           Robin Hood hashing
HashMap (chaining)  ⚠️ Moderada           ⚠️ Moderada          Las listas de colisión son dispersas
Heap binario        ⚠️ Moderada           ⚠️ Moderada          Hijos a 2i+1, 2i+2 — no local para i grande
Árbol BST           ❌ Mala               ⚠️ Solo si el árbol cabe en caché
Trie                ❌ Mala               ⚠️ Solo para prefijos frecuentes
Union-Find (sin PC) ⚠️ Moderada           ❌ Mala              Caminos largos
Union-Find (con PC) ✅ Buena (después PC)  ✅ Buena             Árboles planos
Bloom Filter (pequeño) ✅ Excelente        ✅ Excelente         Todo en caché
Bloom Filter (grande)  ❌ Mala            ⚠️ Solo posiciones populares
```

---

### Ejercicio 19.4.1 — HashMap: open addressing vs chaining

**Enunciado:** Implementa dos versiones de HashMap:
1. **Chaining**: cada bucket es una lista enlazada
2. **Open addressing** (linear probing): las colisiones se resuelven buscando el siguiente slot libre en el arreglo

Para `n = 10^6` operaciones mix de insert/get, mide la diferencia de rendimiento. Explica por qué open addressing es más cache-friendly.

**Restricciones:** Factor de carga máximo 0.75 para ambos. La implementación de open addressing debe usar `bytearray` o `array.array` — no listas de Python.

**Pista:** Open addressing tiene excelente localidad: si hay colisión, el siguiente slot está a 1-2 posiciones en el arreglo (misma línea de caché para linear probing). Chaining requiere un puntero a un nodo en memoria arbitraria.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 19.4.2 — Heap binario vs d-ary heap

**Enunciado:** En un heap binario, los hijos del nodo `i` están en `2i+1` y `2i+2`. Para `i` grande, estos índices están lejos en memoria. Un **d-ary heap** (con `d` hijos por nodo) tiene menos niveles (`log_d n` vs `log_2 n`) pero más comparaciones por nivel.

Implementa un 4-ary heap (4 hijos por nodo) y compara con el binario para `10^6` operaciones push/pop.

**Restricciones:** El 4-ary heap tiene `O((4/3) * log_4 n)` comparaciones por operación vs `O(log_2 n)` del binario. Pero el 4-ary tiene mejor localidad porque los 4 hijos están en posiciones más cercanas al padre.

**Pista:** Los 4 hijos del nodo `i` están en `{4i+1, 4i+2, 4i+3, 4i+4}` — más cerca entre sí que los hijos binarios. Para `i` pequeño, los cuatro caben en pocas líneas de caché. Dijkstra con un 4-heap es ~15% más rápido que con heap binario en benchmarks reales.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.4.3 — Árbol B como alternativa cache-friendly al BST

**Enunciado:** Implementa un árbol B de orden `t=32` (hasta 63 elementos por nodo) y compara con un árbol BST balanceado para `10^6` búsquedas en `10^6` elementos.

**Restricciones:** Cada nodo del árbol B debe ocupar exactamente 512 bytes (8 líneas de caché). Con `t=32`: 63 claves de 4 bytes + 64 punteros de 4 bytes ≈ 508 bytes → casi exacto.

**Pista:** Los 63 elementos de un nodo del árbol B se cargan en 8 líneas de caché — una vez que el nodo está en caché, las 63 comparaciones son gratis. El BST carga 1 elemento por cache miss. Con `10^6` elementos, el árbol B tiene profundidad `log_64(10^6) ≈ 3.3` — solo 4 cache misses por búsqueda vs `log_2(10^6) ≈ 20` para el BST.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.4.4 — Lista enlazada vs arreglo dinámico: el caso real

**Enunciado:** La lista enlazada tiene ventaja teórica en inserción y eliminación: `O(1)` vs `O(n)` para arreglo dinámico. Pero en práctica, para `n < 10^4` elementos, el arreglo dinámico suele ser más rápido incluso para operaciones que favorecen a la lista.

Verifica esto midiendo: inserción al inicio, eliminación del medio, recorrido completo, para `n = {100, 1000, 10000, 100000}`.

**Restricciones:** Usa implementaciones reales — no usar `list.insert(0, x)` de Python que internamente desplaza el arreglo en C. Implementa la lista enlazada con nodos explícitos.

**Pista:** Para `n < 10^4`, el desplazamiento de memoria `memmove` para insertar en un arreglo es tan rápido (una instrucción SIMD) que supera la penalidad de cache miss de seguir punteros de la lista enlazada.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.4.5 — Van Emde Boas layout para búsqueda binaria

**Enunciado:** El layout Van Emde Boas reorganiza un arreglo ordenado de forma que los nodos frecuentemente accedidos en búsqueda binaria queden cerca en memoria. El nodo raíz (índice n/2) y sus hijos inmediatos están en la primera línea de caché.

Implementa el layout VEB y compara con la búsqueda binaria estándar para `10^6` búsquedas en un arreglo de `10^6` elementos.

**Restricciones:** El layout VEB reordena el arreglo en `O(n log n)` — el costo de preprocesamiento se amortiza sobre muchas búsquedas.

**Pista:** En el layout estándar, los primeros niveles del árbol implícito de búsqueda binaria están dispersos por el arreglo. En VEB, los nodos de los primeros `log(L/B)` niveles (donde `L` es el tamaño de caché y `B` el de línea) están contiguos. Esto reduce cache misses en los niveles superiores que se acceden en todas las búsquedas.

**Implementar en:** C++ · Rust · Go

---

## Sección 19.5 — Optimizaciones Concretas: Blocking, Prefetching, Layout

Esta sección presenta las tres técnicas más impactantes para mejorar
la localidad de caché en los algoritmos del repositorio.

**Técnica 1 — Cache Blocking (Tiling):**

```python
# Multiplicación de matrices NAIVE — mala localidad en columnas de B
def matmul_naive(A, B, n):
    C = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]  # B[k][j]: salta n posiciones ⚠️
    return C

# Multiplicación con BLOCKING — procesa bloques que caben en caché
BLOCK = 64  # elementos por bloque

def matmul_blocked(A, B, n):
    C = [[0] * n for _ in range(n)]
    for ii in range(0, n, BLOCK):
        for jj in range(0, n, BLOCK):
            for kk in range(0, n, BLOCK):
                # Bloque actual: cabe en caché L2
                for i in range(ii, min(ii+BLOCK, n)):
                    for j in range(jj, min(jj+BLOCK, n)):
                        for k in range(kk, min(kk+BLOCK, n)):
                            C[i][j] += A[i][k] * B[k][j]
    return C
# Para n=1000: naive ~10s, blocked ~2s (en C/Rust, la diferencia es mayor)
```

**Técnica 2 — Software Prefetching:**

```c
// C/Rust: solicitar al procesador que pre-cargue datos
// antes de necesitarlos

for (int i = 0; i < n; i++) {
    __builtin_prefetch(&arr[i + 16], 0, 3);  // precargar 16 posiciones adelante
    procesar(arr[i]);
}
```

**Técnica 3 — Estructura de datos cache-oblivious:**

```
Un algoritmo "cache-oblivious" es eficiente para CUALQUIER tamaño de caché
sin necesidad de conocer el tamaño de L1/L2/L3 en tiempo de compilación.

Merge Sort es naturalmente cache-oblivious:
- Los subarreglos pequeños caben en L1
- Los medianos en L2
- Los grandes en L3
- La recursión los maneja automáticamente
```

---

### Ejercicio 19.5.1 — Cache blocking en multiplicación de matrices

**Enunciado:** Implementa las tres versiones de multiplicación de matrices: naive, bloqueada (con BLOCK=64), y transpuesta-luego-naive (transponer B para mejorar localidad de columnas). Mide para `n = {256, 512, 1024}`.

**Restricciones:** Usa arreglos contiguos en memoria — no listas de listas de Python. En Go, usa `[]float64` con índice manual `A[i*n+j]`. En Rust, usa `Vec<f64>`.

**Pista:** La versión transpuesta-naive es sorprendentemente efectiva: transponer B cuesta `O(n²)` pero convierte los accesos a columnas en accesos a filas — el costo se amortiza en la multiplicación. Para `n=512`, transponer + multiplicar puede ser 3x más rápido que naive.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.5.2 — Prefetching explícito en búsqueda lineal

**Enunciado:** En Go y Rust, implementa una búsqueda lineal con prefetching explícito: antes de acceder a `arr[i]`, solicita la pre-carga de `arr[i+16]`. Compara con la búsqueda lineal estándar para un arreglo de `10^7` elementos donde la búsqueda no encuentra el elemento (peor caso).

**Restricciones:** El prefetching solo ayuda cuando el procesador no puede predecir el patrón solo. Para acceso secuencial, el prefetcher hardware ya lo hace — el software prefetch puede no ayudar. Verifica si ayuda o no.

**Pista:** El hardware prefetcher ya detecta el patrón secuencial. El software prefetch puede incluso ser contraproducente si interfiere con el prefetcher hardware. Este ejercicio muestra cuándo NO optimizar manualmente.

**Implementar en:** Go · Rust

---

### Ejercicio 19.5.3 — Reordenar el grafo para localidad en BFS

**Enunciado:** En BFS (Cap.04 §1), los nodos se visitan por niveles. Si el grafo tiene localidad en el ID de los nodos (nodos con IDs cercanos tienden a estar conectados — como páginas web del mismo dominio), el BFS puede reorganizarse para mejorar la localidad.

Implementa BFS con **reordenamiento por BFS** (Cuthill-McKee o simplemente renombrar nodos por orden de visita) y mide la mejora.

**Restricciones:** El grafo tiene `10^4` nodos y `10^5` aristas. El reordenamiento es un preprocesamiento `O(V+E)` que se amortiza sobre múltiples BFS.

**Pista:** El reordenamiento por BFS numera los nodos en orden de visita del BFS. Así, los nodos del mismo nivel tienen IDs consecutivos → se acceden secuencialmente en el arreglo → mejor localidad.

**Implementar en:** Java · Go · C# · Rust

---

### Ejercicio 19.5.4 — String interning para localidad en Trie

**Enunciado:** El Trie (Cap.10) tiene mala localidad por sus punteros dispersos. Una alternativa es **string interning**: almacenar todas las strings en un arreglo contiguo y el Trie almacena solo offsets (enteros) en lugar de punteros.

Implementa un Trie con string interning y compara la localidad con el Trie estándar.

**Restricciones:** El pool de strings es un `bytearray` continuo. Los nodos del Trie almacenan `(offset_inicio, longitud)` en lugar de punteros. La búsqueda requiere comparar slices del pool.

**Pista:** Esta técnica se usa en compiladores (tabla de símbolos) y en motores de búsqueda. Los strings del mismo prefijo quedan contiguos en el pool → el prefetcher puede pre-cargarlos.

**Implementar en:** Go · C# · Rust

---

### Ejercicio 19.5.5 — Medir el impacto acumulado en el sistema del Cap.17

**Enunciado:** Toma el sistema completo del Cap.17 §7 y aplica las optimizaciones de caché más relevantes:
1. Cambiar lista de adyacencia a CSR para Dijkstra (Ejercicio 19.2.4)
2. Usar open addressing para el HashMap de caché (Ejercicio 19.4.1)
3. Usar un 4-heap en lugar de heap binario en Dijkstra (Ejercicio 19.4.2)
4. Usar DP con una sola fila donde corresponda (Ejercicio 19.3.4)

Mide la mejora total de extremo a extremo.

**Restricciones:** Cada optimización debe medirse de forma aislada primero, luego todas juntas. La mejora combinada puede ser sublineal (las optimizaciones interactúan).

**Pista:** En sistemas reales, las optimizaciones de caché son donde más ganancia queda después de elegir el algoritmo correcto. Si Dijkstra ya es `O((V+E) log V)`, la siguiente mejora más grande no viene de cambiar el algoritmo sino de mejorar su localidad de acceso.

**Implementar en:** Java · Go · C# · Rust

---

## Sección 19.6 — El Modelo Externo: Cuando los Datos no Caben en RAM

Cuando el dataset supera la RAM, los "cache misses" se convierten en
accesos a disco — 5 órdenes de magnitud más lentos.

```
Algoritmo diseñado para RAM:     O(n log n) comparaciones
Algoritmo diseñado para disco:   O(n/B * log_{M/B}(n/B)) transferencias de bloque

Donde:
  B = tamaño del bloque de disco (4KB típico)
  M = tamaño de la memoria RAM disponible
  n = tamaño del dataset

Para n = 10^9 registros, B = 4KB, M = 8GB:
  Merge Sort en RAM:    ~30 * 10^9 operaciones
  External Merge Sort:  ~3 * 10^6 lecturas de bloque
  Diferencia:           10^4 x (debido a los 10^5 ns de acceso a disco vs 100 ns RAM)
```

---

### Ejercicio 19.6.1 — External Merge Sort

**Enunciado:** Implementa External Merge Sort para ordenar un archivo de `10^8` enteros (400 MB) usando solo `64 MB` de RAM disponible. El algoritmo crea "runs" de 64 MB ordenados en memoria, los escribe en disco, y luego hace k-way merge.

**Restricciones:** El archivo de entrada no cabe en RAM. Las lecturas/escrituras deben hacerse en bloques de `4 KB` (tamaño de página de disco). Mide el número de lecturas/escrituras de disco.

**Pista:** Este es el algoritmo que usan las bases de datos para ORDER BY en consultas que no caben en memoria. La fase de merge usa el heap del Cap.05 (k-way merge) — exactamente el Ejercicio 5.2.4 del Cap.05.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 19.6.2 — B-tree para índices en disco

**Enunciado:** Extiende el árbol B del Ejercicio 19.4.3 para que persista en disco: cada nodo es una página de 4 KB en un archivo. Implementa insert, search y range scan. Mide el número de páginas leídas por operación.

**Restricciones:** Cada acceso a un nodo del árbol B requiere una lectura de 4 KB del archivo. El árbol B tiene `t=100` (hasta 199 elementos por nodo → hasta `log_100(n)` niveles).

**Pista:** Para `n = 10^8` registros: profundidad = `log_100(10^8) ≈ 4` → solo 4 lecturas de disco por búsqueda. Comparado con un BST con punteros en disco: `log_2(10^8) ≈ 27` lecturas. El árbol B es la estructura de disco por excelencia.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 19.6.3 — LSM Tree (Log-Structured Merge Tree)

**Enunciado:** El LSM Tree es la alternativa al B-tree para cargas de escritura intensiva (como RocksDB, Cassandra). Las escrituras siempre van a un buffer en memoria (MemTable) que se vuelca al disco como un archivo inmutable (SSTable) cuando está lleno.

Implementa un LSM Tree simplificado con: MemTable (TreeMap en memoria), SSTables en disco, y compaction (merger de SSTables pequeñas en una grande).

**Restricciones:** MemTable de 1 MB. Cuando se llena, vuelca a disco como SSTable. Con 5 SSTables, haz compaction. Usa el Bloom Filter del Cap.18 en cada SSTable.

**Pista:** El LSM Tree convierte escrituras aleatorias (lentas en disco) en escrituras secuenciales (rápidas). Las lecturas son más costosas porque hay que buscar en múltiples SSTables — el Bloom Filter del Cap.18 evita leer SSTables que definitivamente no tienen la clave.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 19.6.4 — Memory-mapped files para grafos grandes

**Enunciado:** Para un grafo con `10^7` nodos y `10^8` aristas (no cabe en RAM en una máquina modesta), usa `mmap` para acceder a la lista de adyacencia en CSR almacenada en disco. Implementa BFS y Dijkstra sobre el grafo mapeado.

**Restricciones:** El grafo se almacena en disco en formato CSR binario. El acceso vía `mmap` hace que el SO maneje la paginación automáticamente.

**Pista:** `mmap` es la abstracción que borra la línea entre RAM y disco. El SO carga en RAM solo las páginas del grafo que realmente se acceden. Para BFS, si el grafo tiene localidad (nodos conectados tienen IDs cercanos), pocas páginas se cargan.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 19.6.5 — Comparar modelos: RAM vs disco vs red

**Enunciado:** Para el mismo algoritmo (Dijkstra en un grafo de `10^6` nodos), compara tres escenarios de dónde viven los datos:
1. **Grafo en RAM**: tiempo esperado `~50ms`
2. **Grafo en SSD** (via mmap): tiempo esperado `~5s`
3. **Grafo en servidor remoto** (via API REST): tiempo esperado `~50s`

Mide los tres y calcula los factores de multiplicación reales.

**Restricciones:** El grafo en SSD usa la implementación del Ejercicio 19.6.4. El grafo remoto usa el microservicio del Cap.17 §6 Ejercicio 1.

**Pista:** Los órdenes de magnitud son: RAM es `10^8` ops/s, SSD es `10^5` ops/s aleatorias (`10^9` secuenciales), red local es `10^4` ops/s (con latencia de 1ms por roundtrip). Dijkstra hace `O((V+E) log V)` accesos — la mayoría aleatorios.

**Implementar en:** Python · Java · Go · Rust

---

## Sección 19.7 — Medir Antes de Optimizar

La regla de oro de la optimización de rendimiento:

```
"Premature optimization is the root of all evil." — Donald Knuth

Pero también:
"We should forget about small efficiencies, say about 97% of the time:
 premature optimization is the root of all evil. Yet we should not pass
 up our opportunities in that critical 3%." — Donald Knuth (la cita completa)

La diferencia entre el 97% y el 3% se descubre MIDIENDO, no especulando.
```

**La metodología correcta:**

```
1. Hacer funcionar el código correctamente (tests del Cap.17 §7.5)
2. Medir con carga realista (no n=100, sino n=10^6)
3. Identificar el cuello de botella real (profiler)
4. Optimizar SOLO el cuello de botella
5. Medir de nuevo para verificar la mejora
6. Repetir desde 2 si hay más trabajo que hacer
```

---

### Ejercicio 19.7.1 — Establecer una baseline medible

**Enunciado:** Toma uno de los algoritmos del repositorio que más uses y establece una baseline de rendimiento:
1. Define el caso de uso realista (n, distribución de inputs, operaciones más frecuentes)
2. Implementa un benchmark reproducible (misma seed aleatoria, misma máquina)
3. Registra: tiempo de pared, tiempo de CPU, cache misses (si el profiler lo da), memoria

**Restricciones:** El benchmark debe ser reproducible en otra máquina — documenta la CPU, RAM disponible, y sistema operativo.

**Pista:** Un benchmark sin baseline es inútil — no sabes si mejoraste. Un benchmark que varía en ±20% entre ejecuciones es ruidoso — promediar 100 ejecuciones y reportar mediana ± desviación estándar.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 19.7.2 — Profiling con flame graphs

**Enunciado:** Usa un profiler que genere flame graphs (py-spy en Python, async-profiler en Java, pprof en Go) para el sistema del Cap.17 §7 bajo carga. Identifica las tres funciones con más tiempo de CPU.

**Restricciones:** La carga debe ser realista — `1000 solicitudes/segundo` con grafos de `10^3` nodos. El flame graph debe mostrar dónde gasta el tiempo realmente.

**Pista:** Frecuentemente, el cuello de botella no está donde se espera. En sistemas web, suele ser serialización/deserialización de JSON, no el algoritmo principal. Medir evita optimizar lo que no importa.

**Implementar en:** Python (py-spy) · Java (async-profiler) · Go (pprof)

---

### Ejercicio 19.7.3 — Microbenchmarks que mienten

**Enunciado:** Diseña tres microbenchmarks que dan resultados engañosos y explica por qué:
1. Benchmark de un HashSet que siempre hace hit (datos en caché L1)
2. Benchmark de sorting con arreglo ya ordenado
3. Benchmark de función pura que el compilador optimiza completamente (dead code elimination)

**Restricciones:** Para cada uno, muestra el resultado engañoso y el resultado correcto una vez que se corrige el benchmark.

**Pista:** El JIT de Java y el optimizador de Rust son agresivos: si el resultado de una función no se usa, la función puede no ejecutarse. Siempre usa el resultado del benchmark (`blackbox` en Rust, `Blackhole` en JMH de Java).

**Implementar en:** Java (JMH) · Go (testing.B) · Rust (criterion)

---

### Ejercicio 19.7.4 — Regresión de rendimiento como test automatizado

**Enunciado:** Implementa un test de rendimiento que falla si el tiempo de `dijkstra(grafo, origen, destino)` excede un umbral. Integra este test en el pipeline de CI/CD del sistema del Cap.17.

**Restricciones:** El umbral es `100ms` para un grafo de `10^4` nodos y `10^5` aristas. El test debe ser reproducible — misma máquina o máquina de referencia definida.

**Pista:** Los tests de rendimiento son frágiles en CI/CD porque las máquinas virtuales tienen ruido de rendimiento. Usa percentiles (p99 debe ser `< 100ms`) en lugar de absolutos, y promedia sobre 100 ejecuciones para reducir varianza.

**Implementar en:** Python (pytest-benchmark) · Java (JMH) · Go (testing.B) · Rust (criterion)

---

### Ejercicio 19.7.5 — El mapa completo: dónde están los cuellos de botella reales

**Enunciado:** Para el sistema completo del repositorio (algoritmos Cap.01–18 + efectos Cap.17 + arquitectura), construye una tabla de qué porcentaje del tiempo real pasa en cada capa, medido empíricamente bajo carga:

```
Capa                          Tiempo típico  Porcentaje
──────────────────────────    ─────────────  ──────────
Algoritmos puros (Cap.01-18)  ?              ?
Serialización/Deserialización ?              ?
Acceso a BD/caché             ?              ?
Red (HTTP roundtrip)          ?              ?
Gestión de memoria/GC         ?              ?
```

**Restricciones:** Mide con `1000 solicitudes` al sistema del Cap.17 §7. Usa el profiler del Ejercicio 19.7.2. Anota si el resultado confirma o refuta tus expectativas previas.

**Pista:** En la mayoría de los sistemas web, los algoritmos puros representan < 5% del tiempo total. La mayor parte del tiempo se va en I/O (BD, red) y serialización. Esto valida por qué Cap.17 es tan importante — los algoritmos son rápidos, el sistema puede no serlo.

**Implementar en:** Python · Java · Go · Rust

---

## Tabla resumen — Localidad de caché por capítulo

| Capítulo | Algoritmo/Estructura | Cache-friendly? | Por qué |
|---|---|---|---|
| Cap.01 | Recursión con stack | ⚠️ Moderado | Stack crece hacia RAM |
| Cap.02 | DP tabulación 1D | ✅ Sí | Acceso lineal |
| Cap.02 | DP tabulación 2D | ✅/❌ Depende | Row-major vs column-major |
| Cap.03 | Dos punteros | ✅ Sí | Convergente, siempre local |
| Cap.03 | Ventana deslizante | ✅ Sí | Ventana contigua |
| Cap.03 | Prefix sums | ✅ Sí | Barrido lineal |
| Cap.04 | BFS / DFS | ⚠️ Moderado | Depende de la representación del grafo |
| Cap.04 | Dijkstra | ⚠️ Moderado | Lista de adyacencia dispersa |
| Cap.05 | Heap binario | ⚠️ Moderado | Hijos a 2i+1 — locales para i pequeño |
| Cap.06 | Greedy | ✅ Sí | Suele requerir solo un barrido |
| Cap.08 | Merge Sort | ✅ Sí | Procesa subarreglos contiguos |
| Cap.08 | Quick Sort | ⚠️ Moderado | Partition accede a posiciones lejanas |
| Cap.08 | Heap Sort | ❌ No | sift-down genera saltos impredecibles |
| Cap.09 | Union-Find sin PC | ❌ No | Caminos largos, no locales |
| Cap.09 | Union-Find con PC | ✅ Sí (post-PC) | Árboles planos después de la compresión |
| Cap.10 | Trie | ❌ No | Pointer chasing por los nodos |
| Cap.12 | KMP | ✅ Sí | Barrido lineal del texto |
| Cap.13 | Bit manipulation | ✅ Sí | Opera sobre palabras de máquina |
| Cap.14 | Criba Eratóstenes | ✅ Sí | Barrido lineal con saltos regulares |
| Cap.18 | Bloom Filter pequeño | ✅ Sí | Cabe en caché |
| Cap.18 | Bloom Filter grande | ❌ No | k posiciones aleatorias en 10+ MB |

## El principio de cierre

> La complejidad algorítmica dice cuántas **operaciones** hace un algoritmo.
> La arquitectura de memoria dice cuánto **tiempo** cuesta cada operación.
>
> Un algoritmo `O(n log n)` con buena localidad puede superar a uno `O(n)`
> con mala localidad para los valores de `n` que importan en producción.
>
> Los 18 capítulos anteriores construyeron la intuición algorítmica.
> Este capítulo dice cuándo esa intuición necesita un ajuste por la realidad del hardware.
>
> El programador completo conoce ambos niveles — y sabe cuándo cada uno domina.
