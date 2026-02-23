# Guía de Ejercicios — Algoritmos de Ordenamiento Completo

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `07_colecciones_java.md`.

---

## Mapa mental de los algoritmos

```
Ordenamiento
├── Por comparación        → límite teórico O(n log n)
│   ├── Simples O(n²)
│   │   ├── Bubble Sort    → didáctico, nunca en producción
│   │   ├── Selection Sort → mínimas escrituras, inestable
│   │   └── Insertion Sort → excelente para n pequeño o casi ordenado
│   └── Eficientes O(n log n)
│       ├── Merge Sort     → estable, predecible, O(n) espacio
│       ├── Quick Sort     → mejor constante en práctica, O(log n) espacio
│       └── Heap Sort      → O(1) espacio, inestable, peor en caché
└── Sin comparación        → rompen el límite O(n log n)
    ├── Counting Sort      → O(n + k), solo enteros en rango conocido
    ├── Radix Sort         → O(d·n), dígito por dígito
    └── Bucket Sort        → O(n) promedio, datos uniformes
```

**Tabla comparativa rápida:**

| Algoritmo | Mejor | Promedio | Peor | Espacio | Estable |
|---|---|---|---|---|---|
| Bubble Sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | ✅ |
| Selection Sort | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` | ❌ |
| Insertion Sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | ✅ |
| Merge Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` | ✅ |
| Quick Sort | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` | ❌ |
| Heap Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` | ❌ |
| Counting Sort | `O(n+k)` | `O(n+k)` | `O(n+k)` | `O(k)` | ✅ |
| Radix Sort | `O(d·n)` | `O(d·n)` | `O(d·n)` | `O(n+k)` | ✅ |
| Bucket Sort | `O(n)` | `O(n)` | `O(n²)` | `O(n)` | ✅* |

> `*` Bucket Sort es estable si el algoritmo interno también lo es.

---

## Tabla de contenidos

- [Sección 8.1 — Algoritmos Simples O(n²)](#sección-81--algoritmos-simples-on²)
- [Sección 8.2 — Merge Sort](#sección-82--merge-sort)
- [Sección 8.3 — Quick Sort](#sección-83--quick-sort)
- [Sección 8.4 — Algoritmos sin comparación](#sección-84--algoritmos-sin-comparación)
- [Sección 8.5 — Ordenamiento en la práctica](#sección-85--ordenamiento-en-la-práctica)

---

## Sección 8.1 — Algoritmos Simples O(n²)

**Cuándo usarlos:** Solo cuando `n` es muy pequeño (< 20-50 elementos) o los datos están casi ordenados. En cualquier otro caso, usa los algoritmos `O(n log n)`.

**Insertion Sort es la excepción:** En la práctica, muchos algoritmos híbridos (como Timsort, el algoritmo usado por Python y Java) usan Insertion Sort para subproblemas pequeños porque su constante oculta es muy pequeña.

```python
# Bubble Sort: compara e intercambia pares adyacentes
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        intercambiado = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                intercambiado = True
        if not intercambiado:          # optimización: ya ordenado
            break
    return arr

# Selection Sort: en cada pasada busca el mínimo del resto
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Insertion Sort: inserta cada elemento en su posición correcta
def insertion_sort(arr):
    for i in range(1, len(arr)):
        clave = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > clave:
            arr[j+1] = arr[j]          # desplaza hacia la derecha
            j -= 1
        arr[j+1] = clave               # inserta en la posición correcta
    return arr
```

---

### Ejercicio 8.1.1 — Bubble Sort con contador de comparaciones e intercambios

**Enunciado:** Implementa Bubble Sort que cuente el número total de comparaciones y de intercambios. Ejecuta sobre: (a) arreglo aleatorio de 100 elementos, (b) arreglo ya ordenado, (c) arreglo inversamente ordenado. Muestra los contadores en cada caso.

**Restricciones:** `1 <= n <= 500`.

**Pista:** El mejor caso de Bubble Sort (con la optimización de `intercambiado`) es `O(n)` comparaciones y `0` intercambios sobre un arreglo ya ordenado. ¿Coincide con tu contador?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.1.2 — Selection Sort vs Bubble Sort: escrituras en memoria

**Enunciado:** Implementa ambos con un contador de escrituras (asignaciones `arr[i] = x`). Para `n=1000` aleatorio, ¿cuál hace más escrituras? ¿Por qué Selection Sort a veces es preferible a pesar de ser más lento?

**Restricciones:** `1 <= n <= 10^3`.

**Pista:** Selection Sort hace exactamente `n` intercambios (a lo sumo `2n` escrituras). Bubble Sort puede hacer hasta `n²/2` intercambios (`n²` escrituras). Esto importa cuando escribir en memoria es costoso (e.g., memoria flash).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.1.3 — Insertion Sort para arreglo casi ordenado

**Enunciado:** Genera un arreglo de `n=10000` elementos casi ordenado (cada elemento está a lo sumo `k=5` posiciones de su posición final). Mide el tiempo de Insertion Sort, Merge Sort y Quick Sort. ¿Cuál gana?

**Restricciones:** `n=10000`, `k=5`.

**Pista:** Para arreglos con inversiones limitadas, Insertion Sort es `O(n·k) = O(5n) = O(n)`. Merge Sort sigue siendo `O(n log n)`. Insertion Sort debería ganar claramente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.1.4 — Shell Sort (mejora de Insertion Sort)

**Enunciado:** Implementa Shell Sort: una generalización de Insertion Sort que compara elementos separados por un "gap" que se va reduciendo. Usa la secuencia de gaps de Knuth: `1, 4, 13, 40, 121, ...` (gap = gap*3 + 1).

**Restricciones:** `1 <= n <= 10^5`.

**Pista:** Para cada gap, aplica Insertion Sort considerando solo los elementos a distancia `gap`. Cuando gap=1, es Insertion Sort normal. La complejidad con gaps de Knuth es aproximadamente `O(n^1.5)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.1.5 — Ordenar strings por múltiples criterios

**Enunciado:** Dado un arreglo de personas con `{nombre, edad, ciudad}`, ordena usando Insertion Sort primero por ciudad (alfabético), luego por edad (ascendente), luego por nombre (alfabético) en caso de empate.

**Restricciones:** `1 <= n <= 200`.

**Pista:** Define una función de comparación que evalúe los tres criterios en orden. La estabilidad de Insertion Sort garantiza que los ordenamientos anteriores se preservan.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 8.2 — Merge Sort

**Complejidad:** `O(n log n)` tiempo en todos los casos · `O(n)` espacio

Merge Sort es el algoritmo de referencia cuando necesitas garantías de `O(n log n)` y estabilidad. Python y Java usan variantes de Merge Sort (Timsort) en sus implementaciones nativas.

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    izq = merge_sort(arr[:mid])
    der = merge_sort(arr[mid:])
    return merge(izq, der)

def merge(izq, der):
    resultado = []
    i = j = 0
    while i < len(izq) and j < len(der):
        if izq[i] <= der[j]:      # <= para estabilidad (no <)
            resultado.append(izq[i])
            i += 1
        else:
            resultado.append(der[j])
            j += 1
    resultado.extend(izq[i:])
    resultado.extend(der[j:])
    return resultado

# Variante in-place (más compleja, misma complejidad):
def merge_sort_inplace(arr, izq=0, der=None):
    if der is None:
        der = len(arr) - 1
    if izq < der:
        mid = (izq + der) // 2
        merge_sort_inplace(arr, izq, mid)
        merge_sort_inplace(arr, mid+1, der)
        merge_inplace(arr, izq, mid, der)
```

---

### Ejercicio 8.2.1 — Merge Sort iterativo (bottom-up)

**Enunciado:** Implementa Merge Sort de forma iterativa (bottom-up): empieza fusionando subarreglos de tamaño 1, luego 2, luego 4, etc. Evita el call stack de la versión recursiva.

**Restricciones:** `1 <= n <= 10^5`.

**Pista:** El tamaño de subarreglo empieza en 1 y se dobla en cada iteración. Para cada iteración, fusiona pares de subarreglos adyacentes.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.2.2 — Contar inversiones con Merge Sort

**Enunciado:** Una inversión es un par `(i, j)` donde `i < j` pero `arr[i] > arr[j]`. Cuenta todas las inversiones del arreglo usando Merge Sort modificado en `O(n log n)`.

**Restricciones:** `1 <= n <= 10^5`. Valores entre `0` y `10^9`.

**Pista:** Durante la fusión, cuando tomas un elemento del subarreglo derecho antes de agotar el izquierdo, eso representa `len(izq) - i` inversiones (todos los restantes del izquierdo son mayores).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.2.3 — Merge Sort externo (External Sort)

**Enunciado:** Simula ordenar un archivo de 1 millón de enteros que no caben en memoria. Divide en chunks de 1000 elementos, ordena cada chunk (en "disco"), y luego fusiónalo todo con un heap de k punteros.

**Restricciones:** Simula con arrays en memoria. Chunks de 1000, total 10^5 elementos.

**Pista:** Fase 1: ordena y "guarda" chunks de tamaño fijo. Fase 2: merge de todos los chunks usando un min-heap que siempre extrae el mínimo actual de todos los chunks activos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.2.4 — Timsort simplificado

**Enunciado:** Timsort (Python/Java nativo) combina Insertion Sort para runs pequeños con Merge Sort para fusionarlos. Implementa una versión simplificada: detecta runs naturales (ya ordenados), ordena con Insertion Sort si son pequeños, y fusiona todo.

**Restricciones:** `1 <= n <= 10^4`. Tamaño mínimo de run: 32.

**Pista:** Un "run" es una secuencia ya ordenada (ascendente o descendente). Si es descendente, inviértela. Si el run es menor que 32 elementos, extiéndelo con Insertion Sort. Luego fusiona todos los runs.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.2.5 — Merge Sort paralelo (simulado)

**Enunciado:** Simula un Merge Sort paralelo usando threads o corutinas: divide el arreglo en 4 partes, ordénalas "en paralelo" (simulado), y fusiona los 4 resultados. Mide si hay mejora de tiempo.

**Restricciones:** `n = 10^5`.

**Pista:** En Python usa `threading` o `multiprocessing`. En Java usa `ForkJoinPool`. El speedup real depende del overhead de creación de threads vs el trabajo realizado.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 8.3 — Quick Sort

**Complejidad:** `O(n log n)` promedio · `O(n²)` peor caso · `O(log n)` espacio

Quick Sort es en la práctica el más rápido de los algoritmos `O(n log n)` para datos en memoria, gracias a su excelente comportamiento de caché (acceso secuencial). Su peor caso `O(n²)` se evita con selección aleatoria del pivote.

```python
import random

def quick_sort(arr, izq=0, der=None):
    if der is None:
        der = len(arr) - 1
    if izq < der:
        pivote_idx = particionar(arr, izq, der)
        quick_sort(arr, izq, pivote_idx - 1)
        quick_sort(arr, pivote_idx + 1, der)

def particionar(arr, izq, der):
    # Pivote aleatorio: evita el peor caso O(n²) en arreglos ordenados
    idx_pivote = random.randint(izq, der)
    arr[idx_pivote], arr[der] = arr[der], arr[idx_pivote]

    pivote = arr[der]
    i = izq - 1                         # frontera de elementos menores

    for j in range(izq, der):
        if arr[j] <= pivote:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i+1], arr[der] = arr[der], arr[i+1]
    return i + 1

# Variante 3-way partition (Dutch National Flag) para duplicados:
def particionar_3way(arr, izq, der):
    pivote = arr[izq]
    lt = izq        # arr[izq..lt-1] < pivote
    gt = der        # arr[gt+1..der] > pivote
    i = izq + 1     # arr[lt..i-1] = pivote

    while i <= gt:
        if arr[i] < pivote:
            arr[lt], arr[i] = arr[i], arr[lt]
            lt += 1; i += 1
        elif arr[i] > pivote:
            arr[i], arr[gt] = arr[gt], arr[i]
            gt -= 1
        else:
            i += 1
    return lt, gt
```

---

### Ejercicio 8.3.1 — Quick Sort con distintas estrategias de pivote

**Enunciado:** Implementa Quick Sort con 4 estrategias de pivote: (a) primer elemento, (b) último elemento, (c) elemento del medio, (d) pivote aleatorio. Compara el número de comparaciones para arreglo aleatorio, ordenado e inversamente ordenado con `n=1000`.

**Restricciones:** `n=1000`.

**Pista:** Para arreglo ya ordenado, (a) y (b) producen `O(n²)` comparaciones. ¿Cuánto producen (c) y (d)?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.3.2 — Quick Sort con 3-way partition (Dutch National Flag)

**Enunciado:** Implementa Quick Sort con partición en 3 partes: menores, iguales al pivote, mayores. Compara el rendimiento con Quick Sort normal en un arreglo con muchos duplicados (e.g., valores del 1 al 5 repetidos 2000 veces).

**Restricciones:** `n=10000` con valores entre 1 y 5.

**Pista:** Con muchos duplicados, la partición normal es `O(n²)` porque el pivote puede ser siempre igual a muchos elementos. La partición 3-way reduce esto a `O(n)` en el caso de todos iguales.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.3.3 — Quick Select: k-ésimo elemento en O(n) promedio

**Enunciado:** Dado un arreglo desordenado, encuentra el k-ésimo elemento más pequeño usando el algoritmo de Quick Select (particionado de Quick Sort pero sin ordenar ambos lados).

**Restricciones:** `1 <= k <= n <= 10^5`.

**Pista:** Después de particionar, compara la posición del pivote con `k-1`. Si coincide, encontraste el elemento. Si no, recursa solo en el lado relevante.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.3.4 — Quick Sort iterativo

**Enunciado:** Implementa Quick Sort de forma iterativa usando una pila explícita para evitar el stack overflow en peor caso de recursión profunda.

**Restricciones:** `1 <= n <= 10^5`.

**Pista:** La pila guarda pares `(izq, der)`. En cada iteración: saca un par, particiona, empuja los dos subproblemas. Para reducir el espacio de la pila, siempre empuja el subproblema más grande primero.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.3.5 — Introsort (Quick Sort + Heap Sort híbrido)

**Enunciado:** Introsort (C++ STL) es un híbrido que empieza con Quick Sort pero cambia a Heap Sort cuando la profundidad supera `2·log₂(n)`, y usa Insertion Sort para subproblemas pequeños. Implementa esta versión híbrida.

**Restricciones:** `1 <= n <= 10^5`.

**Pista:** Lleva un contador de profundidad. Si supera `2*int(log2(n))`, llama a Heap Sort sobre ese subarreglo. Si `n < 16`, usa Insertion Sort.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 8.4 — Algoritmos sin comparación

Estos algoritmos rompen el límite teórico `O(n log n)` para ordenamiento, pero solo funcionan bajo condiciones específicas sobre los datos.

```python
# Counting Sort: O(n + k) donde k = rango de valores
def counting_sort(arr, k=None):
    if not arr:
        return arr
    if k is None:
        k = max(arr)

    conteo = [0] * (k + 1)
    for x in arr:
        conteo[x] += 1

    # Acumular (para estabilidad)
    for i in range(1, k + 1):
        conteo[i] += conteo[i-1]

    resultado = [0] * len(arr)
    for x in reversed(arr):           # reversed para estabilidad
        resultado[conteo[x] - 1] = x
        conteo[x] -= 1

    return resultado

# Radix Sort: O(d * n) donde d = número de dígitos
def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_por_digito(arr, exp)
        exp *= 10

def counting_sort_por_digito(arr, exp):
    n = len(arr)
    output = [0] * n
    conteo = [0] * 10

    for x in arr:
        digito = (x // exp) % 10
        conteo[digito] += 1

    for i in range(1, 10):
        conteo[i] += conteo[i-1]

    for x in reversed(arr):
        digito = (x // exp) % 10
        output[conteo[digito] - 1] = x
        conteo[digito] -= 1

    arr[:] = output
```

---

### Ejercicio 8.4.1 — Counting Sort básico y verificación de estabilidad

**Enunciado:** Implementa Counting Sort. Verifica su estabilidad: ordena pares `(valor, índice_original)` por valor. Los pares con igual valor deben mantener el orden relativo de sus índices originales.

**Restricciones:** `1 <= n <= 10^5`, `0 <= valores <= 1000`.

**Pista:** La versión estable usa la acumulación del conteo y recorre el arreglo original de derecha a izquierda. ¿Por qué el orden inverso garantiza la estabilidad?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.4.2 — Counting Sort para calificaciones

**Enunciado:** Dado un arreglo de calificaciones de `0` a `100` de `n` estudiantes, ordénalos por calificación en `O(n)`. Luego calcula la mediana, el percentil 90 y muestra cuántos estudiantes hay en cada decil.

**Restricciones:** `1 <= n <= 10^5`, `0 <= calificación <= 100`.

**Pista:** El arreglo de conteo ya te da toda la información para los estadísticos. No necesitas el arreglo ordenado completo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.4.3 — Radix Sort LSD vs MSD

**Enunciado:** Implementa Radix Sort en dos variantes: LSD (dígito menos significativo primero, iterativo) y MSD (dígito más significativo primero, recursivo). Verifica que ambas producen el mismo resultado. ¿En qué difieren sus comportamientos intermedios?

**Restricciones:** `1 <= n <= 10^5`, valores entre `0` y `10^6`.

**Pista:** LSD procesa todos los elementos juntos dígito por dígito. MSD divide en buckets por el primer dígito y recursa. LSD es más simple; MSD puede detenerse antes si los dígitos significativos ya diferencian.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.4.4 — Bucket Sort para floats uniformes

**Enunciado:** Dado un arreglo de `n` números flotantes en `[0, 1)` distribuidos uniformemente, ordénalos con Bucket Sort en `O(n)` promedio.

**Restricciones:** `1 <= n <= 10^5`. Valores en `[0.0, 1.0)`.

**Pista:** Crea `n` buckets. Asigna cada elemento al bucket `int(x * n)`. Ordena cada bucket (con Insertion Sort, porque cada bucket tiene pocos elementos). Concatena.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.4.5 — ¿Cuándo usar cada algoritmo sin comparación?

**Enunciado:** Implementa los tres algoritmos (Counting, Radix, Bucket) y determina empíricamente cuál es más rápido para: (a) enteros entre 0 y 10, (b) enteros entre 0 y 10^6, (c) floats en [0,1), (d) strings de 5 caracteres, (e) n=10^6 con valores en [0, n].

**Restricciones:** `n = 10^5` para todos los casos.

**Pista:** Counting Sort es ideal cuando `k << n`. Radix Sort escala bien con valores grandes. Bucket Sort es ideal para datos uniformes. Para strings, Radix Sort MSD es natural.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 8.5 — Ordenamiento en la práctica

Esta sección conecta la teoría con los algoritmos reales usados en producción y en los lenguajes que estudias.

**¿Qué usan Python y Java?**

```
Python: Timsort
  - Detecta "runs" naturales (secuencias ya ordenadas)
  - Insertion Sort para runs < 64 elementos
  - Merge Sort para fusionar runs
  - Estable, O(n log n) peor caso, O(n) para datos casi ordenados

Java: Dual-Pivot Quicksort (para primitivos) + Timsort (para objetos)
  - Arrays.sort(int[]) → Dual-Pivot Quicksort → más rápido en práctica
  - Arrays.sort(Object[]) → Timsort → estable (necesario para objetos)
  - Collections.sort() → Timsort

Go: pdqsort (Pattern-Defeating Quicksort)
  - Híbrido: Quick Sort + Heap Sort + Insertion Sort
  - Detecta patrones adversariales y los maneja

Rust: pdqsort también
  - Estable con slice::sort(), inestable con slice::sort_unstable()
```

---

### Ejercicio 8.5.1 — API de sorting en los 5 lenguajes

**Enunciado:** Ordena en los 5 lenguajes: (a) arreglo de enteros, (b) arreglo de strings, (c) arreglo de objetos por un campo numérico, (d) ordenamiento descendente, (e) ordenamiento por múltiples criterios. Documenta la API usada en cada lenguaje.

**Restricciones:** Usa `n=1000` para cada caso.

**Pista:** Python: `sorted()` y `list.sort()` con `key=`. Java: `Arrays.sort()` y `Collections.sort()` con `Comparator`. Go: `sort.Slice()`. C#: `Array.Sort()` con `IComparer`. Rust: `.sort_by()` con closure.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.5.2 — Ordenamiento estable vs inestable

**Enunciado:** Crea un escenario donde la estabilidad importa: ordena estudiantes por nota y verifica que los de igual nota mantienen su orden relativo original. Luego muestra qué pasa con un algoritmo inestable (Selection Sort).

**Restricciones:** `n=20` estudiantes con notas entre 1 y 5.

**Pista:** La estabilidad importa cuando: haces múltiples ordenamientos por distintos criterios en secuencia, o cuando el orden original tiene significado (e.g., orden de llegada).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.5.3 — Benchmark completo de algoritmos

**Enunciado:** Implementa un benchmark que compare todos los algoritmos de este archivo para cuatro tipos de arreglos: aleatorio, ordenado, inversamente ordenado y con muchos duplicados. Tamaños: `100`, `1000`, `10000`.

**Restricciones:** Usa la misma semilla aleatoria para reproducibilidad.

**Pista:** Mide tiempo real con `time.time()` o equivalente. Crea copias del arreglo original antes de cada ordenamiento (no ordenes el mismo arreglo dos veces).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.5.4 — Ordenar objetos complejos

**Enunciado:** Dado un arreglo de transacciones con `{id, monto, fecha, estado}`, ordénalas de la forma más eficiente primero por estado (pendiente < procesando < completado), luego por fecha descendente, y dentro de la misma fecha por monto descendente.

**Restricciones:** `1 <= n <= 10^5`.

**Pista:** Define un comparador compuesto. En Python usa tupla como `key`. En Java usa `Comparator.comparing().thenComparing()`. El orden de los criterios importa: el más importante primero.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.5.5 — Ordenamiento parcial: top-k sin ordenar todo

**Enunciado:** Dado un arreglo de `n=10^6` elementos, obtén los `k=100` más grandes sin ordenar el arreglo completo. Compara el tiempo de: (a) sort completo + tomar k, (b) heap de tamaño k, (c) Quick Select + sort de k elementos.

**Restricciones:** `n=10^6`, `k=100`.

**Pista:** (a) `O(n log n)`. (b) `O(n log k)`. (c) `O(n)` promedio para Quick Select + `O(k log k)` para ordenar los k. Para `k << n`, (b) y (c) son significativamente más rápidos.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen final

| Algoritmo | Cuándo usar | Nunca usar cuando |
|---|---|---|
| Insertion Sort | `n < 50` o datos casi ordenados | `n` grande y desordenado |
| Bubble Sort | Solo didáctico | Producción (siempre) |
| Selection Sort | Escrituras en memoria son costosas | Por velocidad |
| Merge Sort | Necesitas estabilidad garantizada | Memoria es crítica |
| Quick Sort | Máxima velocidad en práctica | Necesitas estabilidad |
| Heap Sort | `O(1)` espacio y `O(n log n)` garantizado | Rendimiento en caché importa |
| Counting Sort | Enteros con rango pequeño conocido | Floats o rango enorme |
| Radix Sort | Enteros o strings de longitud fija | Comparaciones complejas |
| Bucket Sort | Datos flotantes uniformes | Datos no uniformes |
| Timsort (nativo) | Uso general | Rara vez hay razón para no usarlo |
