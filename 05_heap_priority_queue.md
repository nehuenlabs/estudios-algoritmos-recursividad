# Guía de Ejercicios — Heap y Cola de Prioridad

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `04_grafos.md`.

---

## Conceptos previos

Un **heap binario** es un árbol binario completo que satisface la propiedad heap:
- **Min-heap:** el padre siempre es **menor o igual** que sus hijos → la raíz es el mínimo
- **Max-heap:** el padre siempre es **mayor o igual** que sus hijos → la raíz es el máximo

```
Min-heap:          Max-heap:
      1                  9
    /   \              /   \
   3     2            7     8
  / \   / \          / \   /
 7   4 5   6        3   4 5
```

**Representación en arreglo** (propiedad clave):

```python
# Un heap se almacena eficientemente en un arreglo:
# Raíz en índice 0
# Para nodo en índice i:
#   Hijo izquierdo: 2*i + 1
#   Hijo derecho:   2*i + 2
#   Padre:          (i - 1) // 2

heap = [1, 3, 2, 7, 4, 5, 6]
#       0  1  2  3  4  5  6

# heap[0] = 1 (raíz / mínimo)
# Hijos de heap[1]=3: heap[3]=7, heap[4]=4
# Padre de heap[3]=7: heap[(3-1)//2] = heap[1] = 3 ✓
```

**Operaciones y complejidades:**

| Operación | Complejidad | Descripción |
|---|---|---|
| `heappush(x)` | `O(log n)` | Inserta x y reordena hacia arriba (sift up) |
| `heappop()` | `O(log n)` | Extrae la raíz y reordena hacia abajo (sift down) |
| `heappeek()` | `O(1)` | Ver la raíz sin extraer |
| `heapify(arr)` | `O(n)` | Convertir arreglo en heap |
| `heapreplace(x)` | `O(log n)` | Pop + push en una operación |

---

## Tabla de contenidos

- [Sección 5.1 — Heap Binario desde Cero](#sección-51--heap-binario-desde-cero)
- [Sección 5.2 — Heap en los Lenguajes (API nativa)](#sección-52--heap-en-los-lenguajes-api-nativa)
- [Sección-5.3 — Heap Sort](#sección-53--heap-sort)
- [Sección 5.4 — Problemas de K elementos](#sección-54--problemas-de-k-elementos)
- [Sección 5.5 — Heap en algoritmos de grafos](#sección-55--heap-en-algoritmos-de-grafos)

---

## Sección 5.1 — Heap Binario desde Cero

**Objetivo:** Entender la estructura interna antes de usar la API nativa.

**Las dos operaciones fundamentales:**

```python
class MinHeap:
    def __init__(self):
        self.data = []

    def push(self, val):
        self.data.append(val)
        self._sift_up(len(self.data) - 1)

    def pop(self):
        if len(self.data) == 1:
            return self.data.pop()
        raiz = self.data[0]
        self.data[0] = self.data.pop()    # mueve el último a la raíz
        self._sift_down(0)
        return raiz

    def peek(self):
        return self.data[0]

    def _sift_up(self, i):
        """Sube el elemento en posición i hasta su lugar correcto."""
        while i > 0:
            padre = (i - 1) // 2
            if self.data[padre] <= self.data[i]:
                break                             # ya está en orden
            self.data[padre], self.data[i] = self.data[i], self.data[padre]
            i = padre

    def _sift_down(self, i):
        """Baja el elemento en posición i hasta su lugar correcto."""
        n = len(self.data)
        while True:
            menor = i
            izq = 2 * i + 1
            der = 2 * i + 2
            if izq < n and self.data[izq] < self.data[menor]:
                menor = izq
            if der < n and self.data[der] < self.data[menor]:
                menor = der
            if menor == i:
                break                             # ya está en su lugar
            self.data[i], self.data[menor] = self.data[menor], self.data[i]
            i = menor

    def heapify(self, arr):
        """Convierte arr en heap in-place en O(n)."""
        self.data = arr[:]
        # Empezar desde el último nodo interno hacia la raíz
        for i in range(len(self.data) // 2 - 1, -1, -1):
            self._sift_down(i)
```

---

### Ejercicio 5.1.1 — Implementar MinHeap completo

**Enunciado:** Implementa un MinHeap desde cero con las operaciones `push`, `pop`, `peek`, `heapify` y `size`. Verifica que `heapify` funciona en `O(n)` y no `O(n log n)`.

**Restricciones:** El heap debe soportar hasta `10^5` elementos.

**Pista:** `heapify` aplica `sift_down` desde el último nodo interno `(n//2 - 1)` hacia la raíz. ¿Por qué esto es `O(n)` y no `O(n log n)`? (Pista: la mayoría de los nodos están en los niveles bajos donde el `sift_down` es corto.)

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.1.2 — Implementar MaxHeap

**Enunciado:** Implementa un MaxHeap desde cero. La raíz debe ser siempre el elemento máximo.

**Restricciones:** El heap debe soportar hasta `10^5` elementos.

**Pista:** Solo cambia las comparaciones en `sift_up` y `sift_down`: en lugar de `<`, usa `>`. O bien invierte el signo de los valores al insertarlos (truco común en lenguajes que solo tienen min-heap).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.1.3 — Heap con objetos personalizados

**Enunciado:** Implementa un min-heap donde los elementos son pares `(prioridad, tarea)`. El heap debe ordenar por prioridad y, en caso de empate, por orden de llegada.

**Restricciones:** Hasta `10^3` tareas.

**Pista:** En Python, `heapq` compara tuplas lexicográficamente, por lo que `(prioridad, índice_llegada, tarea)` funciona. En Java, implementa `Comparable` o usa un `Comparator`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.1.4 — Verificar si un arreglo es un heap válido

**Enunciado:** Dado un arreglo de enteros, determina si representa un min-heap válido.

**Restricciones:** `1 <= len(arr) <= 10^5`.

**Pista:** Para cada nodo `i`, verifica que `arr[i] <= arr[2*i+1]` y `arr[i] <= arr[2*i+2]` (cuando existan). Esto es `O(n)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.1.5 — Heap con operación decrease-key

**Enunciado:** Implementa un heap que soporte la operación `decrease_key(i, nuevo_valor)`: reduce el valor del elemento en el índice `i` del arreglo interno y reordena el heap.

**Restricciones:** Hasta `10^3` elementos.

**Pista:** Después de reducir el valor en posición `i`, aplica `sift_up(i)` porque el elemento puede haber violado la propiedad heap hacia arriba. Esta operación es necesaria en la implementación eficiente de Dijkstra.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 5.2 — Heap en los Lenguajes (API nativa)

**Python: `heapq` (solo min-heap)**

```python
import heapq

# Min-heap
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 4)
print(heap[0])          # 1 (peek)
print(heapq.heappop(heap))  # 1

# Max-heap: negando los valores
max_heap = []
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -1)
print(-max_heap[0])     # 3 (máximo)
print(-heapq.heappop(max_heap))  # 3

# Convertir lista a heap en O(n)
arr = [3, 1, 4, 1, 5, 9, 2, 6]
heapq.heapify(arr)
print(arr[0])           # 1

# nlargest y nsmallest
print(heapq.nlargest(3, arr))   # [9, 6, 5]
print(heapq.nsmallest(3, arr))  # [1, 1, 2]
```

**Java: `PriorityQueue`**

```java
// Min-heap (orden natural)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(3);
minHeap.offer(1);
System.out.println(minHeap.peek());  // 1
System.out.println(minHeap.poll());  // 1

// Max-heap (orden inverso)
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

// Con comparador personalizado (por longitud de string)
PriorityQueue<String> pq = new PriorityQueue<>(
    (a, b) -> a.length() - b.length()
);
```

**Go: `container/heap`**

```go
import "container/heap"

// Debe implementar la interfaz heap.Interface:
// Len() int, Less(i,j int) bool, Swap(i,j int),
// Push(x interface{}), Pop() interface{}
type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() interface{} {
    n := len(*h); x := (*h)[n-1]; *h = (*h)[:n-1]; return x
}
```

---

### Ejercicio 5.2.1 — API de heap en todos los lenguajes

**Enunciado:** Implementa las mismas operaciones básicas (`push`, `pop`, `peek`, `heapify`, `nlargest`, `nsmallest`) en los 5 lenguajes usando la API nativa de cada uno. Verifica que producen los mismos resultados.

**Restricciones:** Usa el arreglo `[5, 2, 8, 1, 9, 3, 7, 4, 6]` como entrada.

**Pista:** Java usa `PriorityQueue`, Python usa `heapq`, Go usa `container/heap`, C# usa `SortedSet` o implementa con `List`, Rust usa `BinaryHeap` (es max-heap por defecto).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.2.2 — Max-heap en lenguajes que solo tienen min-heap

**Enunciado:** Implementa un max-heap en Python (que solo tiene min-heap nativo) usando el truco de negar los valores. Luego implementa lo mismo en Go y C# que tampoco tienen max-heap nativo directo.

**Restricciones:** El heap debe soportar enteros y funcionar correctamente con negativos.

**Pista:** Para enteros: negar el valor. Para objetos: invertir el comparador. En Rust, `BinaryHeap` ya es max-heap; para min-heap usa `Reverse`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.2.3 — Cola de prioridad con actualización

**Enunciado:** Implementa una cola de prioridad donde puedas actualizar la prioridad de un elemento existente. Esta operación no está en la API estándar de la mayoría de los lenguajes.

**Restricciones:** Hasta `10^3` elementos.

**Pista:** El truco estándar es el "lazy deletion": al actualizar, agrega la nueva entrada al heap y marca la antigua como inválida. Al extraer, descarta las entradas inválidas.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.2.4 — Merge de k listas ordenadas

**Enunciado:** Dados `k` arreglos ordenados, fúsionalos en un único arreglo ordenado usando un heap. (LeetCode 23 adaptado)

**Restricciones:** `k` arreglos de longitud total `n <= 10^5`.

**Pista:** Inserta el primer elemento de cada lista en el heap junto con su índice de lista e índice de posición: `(valor, lista_idx, pos_idx)`. Al sacar del heap, inserta el siguiente elemento de esa lista.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.2.5 — Simulación de cola de tareas con prioridad

**Enunciado:** Implementa un sistema de gestión de tareas donde: (1) cada tarea tiene prioridad (1=alta, 5=baja) y tiempo estimado, (2) siempre se ejecuta la tarea de mayor prioridad, (3) en empate, la de menor tiempo estimado. Simula la ejecución de 20 tareas.

**Restricciones:** `1 <= prioridad <= 5`, `1 <= tiempo <= 100`.

**Pista:** Usa `(prioridad, tiempo_estimado, id_tarea)` como clave del heap. Menor número = mayor prioridad.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 5.3 — Heap Sort

**Complejidad:** `O(n log n)` tiempo · `O(1)` espacio extra (in-place)

**Ventaja sobre Merge Sort:** No requiere espacio auxiliar `O(n)`.
**Desventaja sobre Quick Sort:** Peor en la práctica por caché misses (acceso no secuencial a memoria).

```python
def heap_sort(arr):
    n = len(arr)

    # Paso 1: Construir max-heap en O(n)
    # (Empezar desde el último nodo interno)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, n, i)

    # Paso 2: Extraer elementos del heap uno por uno en O(n log n)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]   # mover raíz (máximo) al final
        sift_down(arr, i, 0)              # restaurar heap en el rango [0..i-1]

def sift_down(arr, n, i):
    """sift_down para max-heap sobre arr[0..n-1] con raíz en i"""
    mayor = i
    izq = 2 * i + 1
    der = 2 * i + 2

    if izq < n and arr[izq] > arr[mayor]:
        mayor = izq
    if der < n and arr[der] > arr[mayor]:
        mayor = der

    if mayor != i:
        arr[i], arr[mayor] = arr[mayor], arr[i]
        sift_down(arr, n, mayor)

# Traza para [3,1,4,1,5]:
# Heapify: [5,1,4,1,3]      (max-heap)
# i=4: swap(0,4) → [3,1,4,1,5], sift_down → [4,1,3,1,5]
# i=3: swap(0,3) → [1,1,3,4,5], sift_down → [3,1,1,4,5]
# i=2: swap(0,2) → [1,1,3,4,5], sift_down → [1,1,3,4,5]
# i=1: swap(0,1) → [1,1,3,4,5]
# Resultado: [1,1,3,4,5] ✓
```

---

### Ejercicio 5.3.1 — Heap Sort básico

**Enunciado:** Implementa Heap Sort completo: primero construye un max-heap con `heapify`, luego extrae los elementos ordenadamente. Verifica en arreglos de distintos tamaños.

**Restricciones:** `1 <= len(arr) <= 10^5`.

**Pista:** El `heapify` inicial es `O(n)`, no `O(n log n)`. La extracción es `O(n log n)`. El total es `O(n log n)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.3.2 — Comparar Heap Sort, Merge Sort y Quick Sort

**Enunciado:** Implementa los tres algoritmos y mide sus tiempos para: (a) arreglo aleatorio, (b) arreglo ya ordenado, (c) arreglo inversamente ordenado. Tamaños: `1000`, `10000`, `100000`.

**Restricciones:** Genera los arreglos de prueba con semilla fija para reproducibilidad.

**Pista:** Quick Sort es mejor en promedio pero `O(n²)` en el peor caso. Merge Sort es siempre `O(n log n)` pero requiere `O(n)` extra. Heap Sort es `O(n log n)` y `O(1)` extra pero tiene peores constantes.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.3.3 — K-ésimo elemento más grande durante inserción

**Enunciado:** Dado un flujo de números que llegan uno por uno, mantén siempre el k-ésimo elemento más grande. Retorna el k-ésimo mayor después de cada inserción. (LeetCode 703)

**Restricciones:** `1 <= k <= 10^4`, hasta `10^4` números.

**Pista:** Mantén un min-heap de tamaño `k`. La raíz del min-heap (el mínimo) es el k-ésimo mayor. Si el heap supera tamaño `k`, haz pop.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.3.4 — Ordenar una lista casi ordenada

**Enunciado:** Dado un arreglo donde cada elemento está a lo sumo `k` posiciones de su posición final, ordénalo en `O(n log k)`.

**Restricciones:** `1 <= len(arr) <= 10^5`, `1 <= k <= 100`.

**Pista:** Usa un min-heap de tamaño `k+1`. En cada paso: extrae el mínimo (que ya está en su posición final) e inserta el siguiente elemento del arreglo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.3.5 — Heap Sort estable

**Enunciado:** Heap Sort no es estable por defecto (elementos iguales pueden reordenarse). Implementa una versión estable agregando el índice original como criterio de desempate.

**Restricciones:** `1 <= len(arr) <= 10^4`.

**Pista:** En lugar de ordenar `arr[i]`, ordena pares `(arr[i], i)`. El índice garantiza estabilidad al ser el desempate.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 5.4 — Problemas de K elementos

Esta es la familia de problemas más frecuente en entrevistas que involucra heaps. El patrón es siempre el mismo: **usar un heap de tamaño k para mantener los k mejores elementos**.

```
Problema: "k elementos más grandes"
Solución: min-heap de tamaño k
  → La raíz es el k-ésimo mayor
  → Si el nuevo elemento > raíz: pop + push
  → Al final, el heap contiene los k mayores

Problema: "k elementos más pequeños"
Solución: max-heap de tamaño k
  → La raíz es el k-ésimo menor
  → Si el nuevo elemento < raíz: pop + push
```

---

### Ejercicio 5.4.1 — K elementos más frecuentes

**Enunciado:** Dado un arreglo de enteros y `k`, retorna los `k` elementos que aparecen con mayor frecuencia. (LeetCode 347)

**Restricciones:** `1 <= k <= len(arr) <= 10^5`. La respuesta es única.

**Pista:** Primero cuenta frecuencias con un dict. Luego usa un min-heap de tamaño `k` sobre las frecuencias. La raíz es la frecuencia mínima entre los top-k.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.4.2 — Suma máxima de k elementos con restricción

**Enunciado:** Dado un arreglo, retorna la suma de los `k` elementos más grandes. No puedes ordenar el arreglo (como si fuera un flujo de datos).

**Restricciones:** `1 <= k <= len(arr) <= 10^5`.

**Pista:** Usa un min-heap de tamaño `k`. Recorre el arreglo: si el elemento actual > raíz del heap, haz pop + push. Al final, la suma del heap es la respuesta.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.4.3 — K pares con menor suma

**Enunciado:** Dados dos arreglos ordenados, retorna los `k` pares `(u, v)` con menor suma `u+v`. (LeetCode 373)

**Restricciones:** `1 <= k <= 10^4`, `1 <= len(arr) <= 10^4`.

**Pista:** Inserta en el heap los pares `(arr1[i] + arr2[0], i, 0)` para `i=0..k-1`. Al extraer `(suma, i, j)`, inserta `(arr1[i] + arr2[j+1], i, j+1)` si existe.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.4.4 — Mediana de un flujo de datos

**Enunciado:** Diseña una estructura que soporte agregar números uno por uno y consultar la mediana en cualquier momento. (LeetCode 295)

**Restricciones:** Hasta `5*10^4` operaciones.

**Pista:** Mantén dos heaps: un max-heap para la mitad inferior y un min-heap para la mitad superior. Balancea sus tamaños (diferencia <= 1). La mediana es la raíz del heap más grande o el promedio de ambas raíces.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.4.5 — Tarea de CPU con cooldown

**Enunciado:** Dado un arreglo de tareas (letras) y un cooldown `n`, el CPU debe esperar `n` intervalos antes de ejecutar la misma tarea de nuevo. Calcula el mínimo tiempo para ejecutar todas las tareas. (LeetCode 621)

**Restricciones:** `1 <= len(tareas) <= 10^4`, `0 <= n <= 100`.

**Pista:** Usa un max-heap de frecuencias. En cada ciclo de `n+1` slots: extrae las `n+1` tareas más frecuentes, ejecútalas y reagrega las que aún tienen frecuencia > 0.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 5.5 — Heap en Algoritmos de Grafos

El heap es la estructura que hace eficientes a Dijkstra, Prim y otros algoritmos de grafos. Aquí practicamos la integración.

```python
# Patrón general: Dijkstra usa un min-heap de (distancia, nodo)
import heapq

def dijkstra_con_heap(grafo, inicio, fin):
    heap = [(0, inicio)]          # (costo_acumulado, nodo)
    visitados = set()

    while heap:
        costo, nodo = heapq.heappop(heap)

        if nodo in visitados:
            continue              # entrada obsoleta en el heap
        visitados.add(nodo)

        if nodo == fin:
            return costo

        for vecino, peso in grafo[nodo]:
            if vecino not in visitados:
                heapq.heappush(heap, (costo + peso, vecino))

    return float('inf')           # no alcanzable

# El heap garantiza que siempre procesamos primero
# el nodo con menor distancia acumulada → greedy correcto
```

---

### Ejercicio 5.5.1 — Dijkstra con heap explícito

**Enunciado:** Implementa Dijkstra explícitamente usando `heapq` (Python) o `PriorityQueue` (Java), sin usar funciones de alto nivel. Traza el estado del heap en cada paso para `n=5` nodos.

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`.

**Pista:** El heap puede contener entradas obsoletas (cuando actualizas la distancia de un nodo). El chequeo `if dist > distancias[nodo]: continue` las descarta eficientemente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.5.2 — Prim con heap explícito

**Enunciado:** Implementa el algoritmo de Prim para encontrar el MST usando un heap explícito. Traza el estado del heap durante la construcción.

**Restricciones:** `1 <= V <= 10^4`, `1 <= E <= 10^5`.

**Pista:** El heap contiene `(peso_arista, nodo_destino)`. Siempre expandes hacia el vecino más barato del MST en construcción.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.5.3 — Camino más corto en cuadrícula ponderada

**Enunciado:** Dada una cuadrícula donde cada celda tiene un costo, encuentra el camino de menor costo total de `(0,0)` a `(m-1,n-1)` moviéndote en las 4 direcciones.

**Restricciones:** `1 <= m, n <= 100`, `1 <= costo <= 1000`.

**Pista:** Dijkstra sobre la cuadrícula. El estado es `(costo_acumulado, fila, columna)`. No uses BFS (los pesos no son uniformes).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.5.4 — Esfuerzo mínimo (Minimum Effort Path)

**Enunciado:** Dada una cuadrícula de alturas, el esfuerzo de un camino es la máxima diferencia absoluta de alturas entre celdas adyacentes. Encuentra el camino de mínimo esfuerzo de `(0,0)` a `(m-1,n-1)`. (LeetCode 1631)

**Restricciones:** `1 <= m, n <= 100`, `1 <= altura <= 10^6`.

**Pista:** Dijkstra modificado donde el "costo" de llegar a una celda es el máximo esfuerzo visto hasta ahora, no la suma. El heap contiene `(esfuerzo_max, fila, col)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.5.5 — Ruta más barata con k paradas (heap)

**Enunciado:** Implementa la solución al problema de vuelos más baratos con `k` paradas máximo (del ejercicio 4.3.3) usando un heap con estado `(costo, nodo, paradas_usadas)`.

**Restricciones:** `1 <= V <= 100`, `0 <= k <= 100`.

**Pista:** El estado del heap es `(costo_acumulado, nodo_actual, paradas_restantes)`. Solo expandes si `paradas_restantes > 0`. Usa un dict `(nodo, paradas_restantes) → costo` para evitar revisitar estados costosos.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Heap y Cola de Prioridad

| Operación | Min-Heap | Max-Heap | Notas |
|---|---|---|---|
| Insertar | `O(log n)` | `O(log n)` | sift_up |
| Extraer mínimo/máximo | `O(log n)` | `O(log n)` | sift_down |
| Ver mínimo/máximo | `O(1)` | `O(1)` | solo leer raíz |
| Construir desde arreglo | `O(n)` | `O(n)` | heapify |
| Decrease-key | `O(log n)` | `O(log n)` | sift_up |
| Buscar elemento | `O(n)` | `O(n)` | no es una operación del heap |

**API nativa por lenguaje:**

| Lenguaje | Tipo | Clase/Módulo | Notas |
|---|---|---|---|
| Python | Min-heap | `heapq` | Para max-heap: negar valores |
| Java | Min-heap | `PriorityQueue` | Max-heap: `Collections.reverseOrder()` |
| Go | Manual | `container/heap` | Implementar interfaz `heap.Interface` |
| C# | Min-heap | `PriorityQueue<T,P>` (.NET 6+) | O usar `SortedSet` |
| Rust | Max-heap | `BinaryHeap` | Para min-heap: usar `Reverse<T>` |

**Cuándo usar cada estructura:**

| Necesito... | Usar... | Complejidad |
|---|---|---|
| El mínimo/máximo siempre disponible | Heap | `O(1)` peek, `O(log n)` pop |
| Los k mayores/menores de un flujo | Heap de tamaño k | `O(n log k)` |
| Procesar eventos por prioridad | Cola de prioridad | `O(log n)` por evento |
| Camino más corto con pesos | Min-heap + Dijkstra | `O((V+E) log V)` |
| Ordenar en O(1) espacio extra | Heap Sort | `O(n log n)` |
| Mediana en flujo de datos | Dos heaps | `O(log n)` por inserción, `O(1)` mediana |
