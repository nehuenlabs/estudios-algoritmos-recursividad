# Guía de Ejercicios — Colecciones Java con Complejidades

> Implementar cada ejercicio principalmente en **Java**, con comparativos en Python · Go · C# · Rust cuando corresponda.
>
> Este archivo es continuación de `06_algoritmos_greedy.md`.

---

## Por qué importan las complejidades de colecciones

Elegir la colección equivocada puede transformar una solución `O(n log n)` en `O(n²)` sin que el código parezca diferente:

```java
// Estas dos líneas parecen equivalentes, pero NO lo son:
List<Integer> lista = new ArrayList<>();
lista.contains(x);        // O(n) — búsqueda lineal

Set<Integer> conjunto = new HashSet<>();
conjunto.contains(x);     // O(1) — búsqueda por hash

// En un bucle de n iteraciones:
// lista.contains()   → O(n²) total
// conjunto.contains()→ O(n)  total
```

---

## Tabla maestra de complejidades

| Colección | `get/contains` | `add/put` | `remove` | `min/max` | Ordenado | Notas |
|---|---|---|---|---|---|---|
| `ArrayList` | `O(1)` índice / `O(n)` valor | `O(1)` amort. | `O(n)` | `O(n)` | ❌ | Arreglo dinámico |
| `LinkedList` | `O(n)` | `O(1)` extremos | `O(1)` con iter. | `O(n)` | ❌ | Doble enlazada |
| `ArrayDeque` | `O(1)` extremos | `O(1)` amort. | `O(1)` extremos | `O(n)` | ❌ | Stack y Queue eficiente |
| `HashSet` | `O(1)` | `O(1)` | `O(1)` | `O(n)` | ❌ | Sin orden garantizado |
| `LinkedHashSet` | `O(1)` | `O(1)` | `O(1)` | `O(n)` | Inserción | Mantiene orden de inserción |
| `TreeSet` | `O(log n)` | `O(log n)` | `O(log n)` | `O(log n)` | ✅ Natural | BST (Red-Black) |
| `HashMap` | `O(1)` | `O(1)` | `O(1)` | `O(n)` | ❌ | Par clave-valor |
| `LinkedHashMap` | `O(1)` | `O(1)` | `O(1)` | `O(n)` | Inserción | Útil para LRU Cache |
| `TreeMap` | `O(log n)` | `O(log n)` | `O(log n)` | `O(log n)` | ✅ Natural | BST, rango de claves |
| `PriorityQueue` | `O(n)` valor / `O(1)` min | `O(log n)` | `O(log n)` | `O(1)` | ❌ heap | Min-heap por defecto |
| `Stack` | `O(n)` valor | `O(1)` | `O(1)` | `O(n)` | ❌ | Usar `ArrayDeque` |
| `ArrayBlockingQueue` | `O(n)` | `O(1)` | `O(1)` | `O(n)` | ❌ | Thread-safe, capacidad fija |

> **Nota:** `O(1)` amortizado significa que ocasionalmente es `O(n)` (al redimensionar), pero el costo promedio por operación es constante.

---

## Tabla de contenidos

- [Sección 7.1 — List: ArrayList vs LinkedList](#sección-71--list-arraylist-vs-linkedlist)
- [Sección 7.2 — Set: HashSet, LinkedHashSet, TreeSet](#sección-72--set-hashset-linkedhashset-treeset)
- [Sección 7.3 — Map: HashMap, LinkedHashMap, TreeMap](#sección-73--map-hashmap-linkedhashmap-treemap)
- [Sección 7.4 — Queue y Deque: ArrayDeque, PriorityQueue](#sección-74--queue-y-deque-arraydeque-priorityqueue)
- [Sección 7.5 — Colecciones thread-safe y utilidades](#sección-75--colecciones-thread-safe-y-utilidades)

---

## Sección 7.1 — List: ArrayList vs LinkedList

**ArrayList:** Arreglo dinámico. Acceso `O(1)` por índice. Inserción/eliminación en el medio `O(n)`.  
**LinkedList:** Lista doblemente enlazada. Inserción/eliminación en extremos `O(1)`. Acceso por índice `O(n)`.

```java
// ArrayList: mejor para acceso aleatorio y cuando se agrega al final
List<Integer> arr = new ArrayList<>();
arr.add(1);          // O(1) amortizado — al final
arr.add(0, 1);       // O(n) — inserta al principio, desplaza todo
arr.get(5);          // O(1) — acceso por índice
arr.remove(Integer.valueOf(3));  // O(n) — busca y elimina por valor
arr.remove(3);       // O(n) — elimina por índice, desplaza elementos

// LinkedList: mejor como Deque (cola doble) y cuando insertas en extremos
LinkedList<Integer> ll = new LinkedList<>();
ll.addFirst(1);      // O(1) — inserta al principio
ll.addLast(2);       // O(1) — inserta al final
ll.removeFirst();    // O(1)
ll.get(5);           // O(n) — recorre desde el inicio

// Regla práctica:
// ¿Acceso por índice frecuente?       → ArrayList
// ¿Inserción/eliminación en extremos? → LinkedList o ArrayDeque
// ¿Cola (FIFO) o Pila (LIFO)?         → ArrayDeque (más eficiente que LinkedList)
```

---

### Ejercicio 7.1.1 — Medir diferencia ArrayList vs LinkedList

**Enunciado:** Realiza `10^5` operaciones de inserción al inicio en `ArrayList` y en `LinkedList`. Mide y compara los tiempos. Luego haz lo mismo con inserciones al final.

**Restricciones:** `n = 10^5` operaciones.

**Pista:** `add(0, elemento)` en ArrayList es `O(n)` porque desplaza todos los elementos. En LinkedList es `O(1)`. El contraste debe ser dramático para inserciones al inicio.

**Implementar en:** Java (primario) · Python (comparativo con `list` vs `deque`)

---

### Ejercicio 7.1.2 — Implementar una lista circular

**Enunciado:** Usando `ArrayList`, implementa una lista circular que permita acceder al elemento siguiente y anterior con wrapping automático (índice `n-1` → siguiente es `0`).

**Restricciones:** `1 <= n <= 10^3`. Soporte `get(i)`, `next(i)`, `prev(i)`.

**Pista:** `next(i) = (i + 1) % size`, `prev(i) = (i - 1 + size) % size`.

**Implementar en:** Java · Python · Go · C# · Rust

---

### Ejercicio 7.1.3 — Eliminar duplicados manteniendo orden

**Enunciado:** Dado un `ArrayList` con posibles duplicados, retorna una nueva lista sin duplicados manteniendo el orden de primera aparición. Compara tres enfoques: (a) `O(n²)` con `contains`, (b) `O(n)` con `HashSet` auxiliar, (c) `LinkedHashSet`.

**Restricciones:** `1 <= n <= 10^5`.

**Pista:** `LinkedHashSet` ya hace exactamente esto: no permite duplicados y mantiene orden de inserción. Una sola línea: `new ArrayList<>(new LinkedHashSet<>(lista))`.

**Implementar en:** Java · Python · Go · C# · Rust

---

### Ejercicio 7.1.4 — Rotar una lista k posiciones

**Enunciado:** Dado un `ArrayList`, rótalo `k` posiciones a la derecha. Por ejemplo, `[1,2,3,4,5]` rotado `2` es `[4,5,1,2,3]`.

**Restricciones:** `1 <= n <= 10^4`, `0 <= k <= n`.

**Pista:** Tres inversiones: invierte todo, invierte los primeros `k`, invierte los últimos `n-k`. Esto evita crear una nueva lista.

**Implementar en:** Java · Python · Go · C# · Rust

---

### Ejercicio 7.1.5 — Implementar LRU Cache con LinkedList

**Enunciado:** Implementa una caché LRU (Least Recently Used) de capacidad `k` usando `LinkedList` + `HashMap`. `get(key)` mueve el elemento al frente. `put(key, val)` agrega al frente y elimina el último si se supera la capacidad.

**Restricciones:** `1 <= capacidad <= 10^3`, hasta `10^4` operaciones.

**Pista:** El `HashMap` da acceso `O(1)` al nodo. La `LinkedList` da `O(1)` para mover al frente y eliminar el último. En Java, `LinkedHashMap` con `accessOrder=true` y `removeEldestEntry` implementa LRU con menos código.

**Implementar en:** Java · Python · Go · C# · Rust

---

## Sección 7.2 — Set: HashSet, LinkedHashSet, TreeSet

**HashSet:** Sin orden. Operaciones `O(1)`. Usa `hashCode()` y `equals()`.  
**LinkedHashSet:** Mantiene orden de inserción. Operaciones `O(1)`.  
**TreeSet:** Ordenado naturalmente. Operaciones `O(log n)`. Implementa `NavigableSet`.

```java
// HashSet: cuando solo importa si el elemento existe
Set<String> hash = new HashSet<>();
hash.add("banana");
hash.contains("banana");  // O(1)

// LinkedHashSet: cuando importa el orden de inserción
Set<String> linked = new LinkedHashSet<>();
// iteración en orden de inserción garantizado

// TreeSet: cuando necesitas el conjunto ordenado
TreeSet<Integer> tree = new TreeSet<>();
tree.add(5); tree.add(2); tree.add(8); tree.add(1);
tree.first();            // 1  — O(log n)
tree.last();             // 8  — O(log n)
tree.floor(6);           // 5  — mayor elemento <= 6, O(log n)
tree.ceiling(6);         // 8  — menor elemento >= 6, O(log n)
tree.headSet(5);         // {1, 2} — elementos < 5
tree.tailSet(5);         // {5, 8} — elementos >= 5
tree.subSet(2, 7);       // {2, 5} — elementos en [2, 7)

// CRÍTICO: los objetos en TreeSet deben ser Comparable
// o debes pasar un Comparator al constructor
```

---

### Ejercicio 7.2.1 — Diferencia de rendimiento HashSet vs TreeSet

**Enunciado:** Realiza `10^6` operaciones de `add` y `contains` en `HashSet` y `TreeSet`. Mide y compara los tiempos. ¿Cuándo justifica el `O(log n)` de `TreeSet`?

**Restricciones:** `n = 10^6` operaciones.

**Pista:** `TreeSet` es más lento en operaciones básicas pero permite consultas de rango y encontrar vecinos. `HashSet` es más rápido pero no tiene esas capacidades.

**Implementar en:** Java

---

### Ejercicio 7.2.2 — Rango de valores con TreeSet

**Enunciado:** Dado un flujo de enteros que llegan uno por uno, después de cada inserción responde: ¿cuál es el mayor elemento menor que `x`? ¿cuál es el menor elemento mayor que `x`?

**Restricciones:** Hasta `10^4` consultas. Los valores son enteros entre `-10^6` y `10^6`.

**Pista:** `tree.lower(x)` retorna el mayor elemento estrictamente menor que `x`. `tree.higher(x)` retorna el menor elemento estrictamente mayor que `x`. Ambos son `O(log n)`.

**Implementar en:** Java · Python (`SortedList` de `sortedcontainers`) · C# (`SortedSet`)

---

### Ejercicio 7.2.3 — Conjunto de intervalos sin solapamiento

**Enunciado:** Mantén un conjunto de intervalos no solapados. Implementa `agregar(inicio, fin)` que fusiona el nuevo intervalo con los existentes si se solapan.

**Restricciones:** Hasta `10^3` operaciones. Los valores son enteros.

**Pista:** Usa `TreeMap<inicio, fin>`. Para agregar un intervalo, encuentra todos los intervalos que se solapan con el nuevo usando `floorKey` y `ceilingKey`, fusiónales y agrégalos como uno solo.

**Implementar en:** Java · Python · C#

---

### Ejercicio 7.2.4 — Contar elementos en rango con TreeSet

**Enunciado:** Dado un arreglo de enteros, responde `m` consultas del tipo "¿cuántos elementos están en el rango [a, b]?". Implementa con `TreeSet` y con prefix sum. Compara.

**Restricciones:** `1 <= n <= 10^4`, `1 <= m <= 10^4`.

**Pista:** `tree.subSet(a, true, b, true).size()` da el conteo pero es `O(k)` donde `k` es el tamaño del rango. Para `O(log n)` usa `TreeMap` con rangos o prefix sum con búsqueda binaria.

**Implementar en:** Java · Python · C#

---

### Ejercicio 7.2.5 — Implementar `contains`, `add`, `remove` con invariante de orden

**Enunciado:** Implementa un `TreeSet` simplificado usando un árbol binario de búsqueda (BST) manual con las operaciones `add`, `contains` y `remove`. No necesita ser autobalanceado.

**Restricciones:** Hasta `10^3` operaciones.

**Pista:** Un BST simple tiene `O(log n)` en promedio pero `O(n)` en el peor caso (arreglo ordenado). `TreeSet` usa un árbol Red-Black para garantizar `O(log n)` siempre.

**Implementar en:** Java · Python · Go · C# · Rust

---

## Sección 7.3 — Map: HashMap, LinkedHashMap, TreeMap

**HashMap:** Sin orden. Operaciones `O(1)`. La base de casi todo.  
**LinkedHashMap:** Mantiene orden de inserción (o de acceso). `O(1)`.  
**TreeMap:** Ordenado por clave. `O(log n)`. Implementa `NavigableMap`.

```java
// HashMap: operaciones básicas
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.get("a");                        // 1 — O(1)
map.getOrDefault("b", 0);           // 0 — O(1), evita NullPointerException
map.containsKey("a");                // true — O(1)
map.putIfAbsent("a", 99);            // no sobreescribe si ya existe
map.merge("a", 1, Integer::sum);     // suma 1 al valor existente — idiomático

// Iterar
for (Map.Entry<String, Integer> e : map.entrySet()) {
    System.out.println(e.getKey() + " → " + e.getValue());
}

// TreeMap: operaciones de rango
TreeMap<Integer, String> tree = new TreeMap<>();
tree.put(5, "cinco");
tree.put(2, "dos");
tree.put(8, "ocho");
tree.firstKey();           // 2  — O(log n)
tree.lastKey();            // 8  — O(log n)
tree.floorKey(6);          // 5  — mayor clave <= 6
tree.ceilingKey(6);        // 8  — menor clave >= 6
tree.headMap(6);           // {2→"dos", 5→"cinco"}
tree.tailMap(5);           // {5→"cinco", 8→"ocho"}

// LinkedHashMap para LRU Cache
Map<Integer, Integer> lru = new LinkedHashMap<>(16, 0.75f, true) {
    protected boolean removeEldestEntry(Map.Entry e) {
        return size() > CAPACITY;
    }
};
```

---

### Ejercicio 7.3.1 — Contador de frecuencias idiomático

**Enunciado:** Dado un arreglo de strings, construye un mapa de frecuencias (string → conteo). Implementa con `getOrDefault`, `merge` y `compute`. Las tres formas deben producir el mismo resultado.

**Restricciones:** `1 <= n <= 10^5`.

**Pista:**
- `getOrDefault`: `map.put(s, map.getOrDefault(s, 0) + 1)`
- `merge`: `map.merge(s, 1, Integer::sum)`
- `compute`: `map.compute(s, (k, v) -> v == null ? 1 : v + 1)`

**Implementar en:** Java · Python (`Counter`) · Go · C# · Rust

---

### Ejercicio 7.3.2 — Mapa de grupos (groupingBy)

**Enunciado:** Dado un arreglo de strings, agrúpalos por su longitud. El resultado es un `Map<Integer, List<String>>`. Implementa con bucle explícito y con Streams.

**Restricciones:** `1 <= n <= 10^4`.

**Pista con Streams:**
```java
Map<Integer, List<String>> grupos = Arrays.stream(palabras)
    .collect(Collectors.groupingBy(String::length));
```

**Implementar en:** Java · Python (`defaultdict`) · Go · C# · Rust

---

### Ejercicio 7.3.3 — LRU Cache con LinkedHashMap

**Enunciado:** Implementa un LRU Cache de capacidad `k` usando `LinkedHashMap` con `accessOrder=true`. Compara con la implementación manual del ejercicio 7.1.5.

**Restricciones:** `1 <= k <= 10^3`, hasta `10^4` operaciones `get` y `put`.

**Pista:** Con `LinkedHashMap(capacity, loadFactor, accessOrder=true)` y sobreescribiendo `removeEldestEntry`, el LRU se implementa en ~5 líneas.

**Implementar en:** Java

---

### Ejercicio 7.3.4 — Consultas de rango con TreeMap

**Enunciado:** Dado un mapa de temperaturas por fecha (`TreeMap<LocalDate, Double>`), responde consultas: (a) temperatura en una fecha exacta, (b) temperatura más reciente antes de una fecha, (c) temperatura más antigua después de una fecha, (d) promedio de temperaturas en un rango de fechas.

**Restricciones:** Hasta `10^3` registros y `10^3` consultas.

**Pista:** `floorEntry(fecha)` para (b), `ceilingEntry(fecha)` para (c), `subMap(inicio, fin).values()` para (d).

**Implementar en:** Java · Python (con `SortedDict` de `sortedcontainers`)

---

### Ejercicio 7.3.5 — Índice invertido con HashMap

**Enunciado:** Dado un arreglo de documentos (strings), construye un índice invertido: para cada palabra, almacena la lista de índices de documentos que la contienen. Luego responde consultas de búsqueda: retorna los documentos que contienen TODAS las palabras de la consulta.

**Restricciones:** Hasta `10^3` documentos de hasta `100` palabras cada uno.

**Pista:** El índice es `Map<String, Set<Integer>>`. Para una consulta con múltiples palabras, calcula la intersección de los conjuntos de documentos de cada palabra.

**Implementar en:** Java · Python · Go · C# · Rust

---

## Sección 7.4 — Queue y Deque: ArrayDeque, PriorityQueue

**ArrayDeque:** Arreglo circular dinámico. `O(1)` en extremos. La mejor opción para Stack y Queue.  
**PriorityQueue:** Min-heap. `O(log n)` para insertar y extraer. `O(1)` para ver el mínimo.

```java
// ArrayDeque como Stack (LIFO) — más eficiente que Stack (heredada de Vector)
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);          // addFirst — O(1)
stack.push(2);
stack.pop();            // removeFirst — O(1), retorna 2
stack.peek();           // peekFirst — O(1), retorna 1

// ArrayDeque como Queue (FIFO) — más eficiente que LinkedList
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(1);         // addLast — O(1)
queue.offer(2);
queue.poll();           // removeFirst — O(1), retorna 1
queue.peek();           // peekFirst — O(1), retorna 2

// ArrayDeque como Deque (ambos extremos)
Deque<Integer> deque = new ArrayDeque<>();
deque.addFirst(1);
deque.addLast(2);
deque.peekFirst();      // 1
deque.peekLast();       // 2

// PriorityQueue: min-heap por defecto
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
// Max-heap: pasar comparador inverso
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
// Con objetos: definir comparador por campo
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
```

---

### Ejercicio 7.4.1 — Stack vs ArrayDeque: rendimiento

**Enunciado:** Realiza `10^6` operaciones `push` y `pop` en `Stack` y en `ArrayDeque`. Mide y compara. ¿Por qué `Stack` es más lento?

**Restricciones:** `n = 10^6` operaciones.

**Pista:** `Stack` hereda de `Vector`, que sincroniza todas las operaciones (thread-safe). `ArrayDeque` no sincroniza nada. En un contexto de un solo hilo, la sincronización es overhead puro.

**Implementar en:** Java

---

### Ejercicio 7.4.2 — Validar paréntesis con Stack

**Enunciado:** Dado un string con `(`, `)`, `[`, `]`, `{`, `}`, determina si los paréntesis están correctamente balanceados. (LeetCode 20)

**Restricciones:** `1 <= len(s) <= 10^4`.

**Pista:** Usa `ArrayDeque` como stack. Al encontrar un abridor, apílalo. Al encontrar un cerrador, verifica que el tope del stack sea el correspondiente abridor.

**Implementar en:** Java · Python · Go · C# · Rust

---

### Ejercicio 7.4.3 — BFS con Queue para árbol por niveles

**Enunciado:** Dado un árbol binario, retorna la suma de los valores de cada nivel usando BFS con `ArrayDeque`. La respuesta es una lista de sumas, una por nivel.

**Restricciones:** El árbol puede tener hasta `10^4` nodos.

**Pista:** Al inicio de cada nivel, el tamaño de la cola es exactamente el número de nodos en ese nivel. Procesa esa cantidad de nodos y agrega sus hijos para el siguiente nivel.

**Implementar en:** Java · Python · Go · C# · Rust

---

### Ejercicio 7.4.4 — Ventana deslizante máxima con Deque

**Enunciado:** Dado un arreglo y un tamaño de ventana `k`, retorna el máximo de cada ventana deslizante. (LeetCode 239)

**Restricciones:** `1 <= k <= len(arr) <= 10^5`.

**Pista:** Usa `ArrayDeque` como pila monótona decreciente de **índices**. Mantén el invariante: los elementos en el deque están en orden decreciente. El frente del deque siempre es el máximo de la ventana actual.

**Implementar en:** Java · Python · Go · C# · Rust

---

### Ejercicio 7.4.5 — PriorityQueue con objetos y comparador múltiple

**Enunciado:** Implementa un sistema de atención de pacientes en urgencias. Cada paciente tiene `(nombre, gravedad, hora_llegada)`. Primero se atiende el de mayor gravedad; en empate, el que llegó antes. Simula la atención de 10 pacientes.

**Restricciones:** `gravedad` entre 1 (leve) y 5 (crítico). `hora_llegada` es un entero incremental.

**Pista:** El comparador debe ordenar primero por gravedad descendente, luego por hora de llegada ascendente:
```java
(a, b) -> a.gravedad != b.gravedad
    ? b.gravedad - a.gravedad
    : a.horaLlegada - b.horaLlegada
```

**Implementar en:** Java · Python · Go · C# · Rust

---

## Sección 7.5 — Colecciones thread-safe y utilidades

**Cuándo importan las colecciones thread-safe:** En aplicaciones concurrentes donde múltiples hilos acceden a la misma colección. En código de un solo hilo son overhead innecesario.

```java
// Colecciones thread-safe principales:
// ConcurrentHashMap:     HashMap thread-safe de alta concurrencia
// CopyOnWriteArrayList:  ArrayList thread-safe, ideal para pocas escrituras
// BlockingQueue:         Queue con operaciones de bloqueo (productor-consumidor)
// Collections.synchronized*: Wrappers sincronizados (menos eficientes)

// ConcurrentHashMap vs Collections.synchronizedMap:
ConcurrentHashMap<String, Integer> concurrent = new ConcurrentHashMap<>();
Map<String, Integer> synced = Collections.synchronizedMap(new HashMap<>());
// ConcurrentHashMap: bloqueos parciales (por segmento), más concurrente
// synchronizedMap: bloqueo total en cada operación, cuello de botella

// Utilidades de Collections:
List<Integer> lista = Arrays.asList(3, 1, 4, 1, 5, 9);
Collections.sort(lista);                     // O(n log n)
Collections.binarySearch(lista, 4);          // O(log n) — requiere lista ordenada
Collections.reverse(lista);                  // O(n)
Collections.shuffle(lista);                  // O(n)
Collections.frequency(lista, 1);             // O(n) — cuenta ocurrencias
Collections.min(lista);                      // O(n)
Collections.max(lista);                      // O(n)
Collections.nCopies(5, "hola");              // ["hola","hola","hola","hola","hola"]
Collections.unmodifiableList(lista);         // vista inmutable
Collections.singletonList(42);               // lista inmutable de un elemento
```

---

### Ejercicio 7.5.1 — ConcurrentHashMap vs HashMap bajo concurrencia

**Enunciado:** Crea 4 hilos que simultáneamente insertan `10^4` elementos cada uno en (a) `HashMap` y (b) `ConcurrentHashMap`. Observa y documenta qué ocurre con `HashMap` (posibles excepciones, datos corruptos). Verifica que `ConcurrentHashMap` siempre mantiene la consistencia.

**Restricciones:** 4 hilos, `4*10^4` inserciones totales.

**Pista:** `HashMap` puede lanzar `ConcurrentModificationException` o entrar en bucle infinito durante el rehashing. `ConcurrentHashMap` garantiza atomicidad en operaciones individuales.

**Implementar en:** Java

---

### Ejercicio 7.5.2 — Productor-Consumidor con BlockingQueue

**Enunciado:** Implementa el patrón productor-consumidor: un hilo produce números del 1 al 20 y los pone en una `LinkedBlockingQueue`. Dos hilos consumidores los extraen y calculan su cuadrado. Usa `BlockingQueue.put()` y `take()` para sincronización automática.

**Restricciones:** 1 productor, 2 consumidores, 20 elementos.

**Pista:** `put()` bloquea si la cola está llena. `take()` bloquea si está vacía. Usa un elemento "veneno" (sentinel) para señalizar que el productor terminó.

**Implementar en:** Java

---

### Ejercicio 7.5.3 — Utilidades de Collections

**Enunciado:** Para un `ArrayList<Integer>` de 20 elementos aleatorios, demuestra el uso correcto de: `sort`, `binarySearch`, `reverse`, `shuffle`, `min`, `max`, `frequency`, `disjoint`, `unmodifiableList`.

**Restricciones:** Lista de 20 enteros entre 1 y 100.

**Pista:** `binarySearch` solo funciona correctamente si la lista está ordenada. Si no está ordenada, el resultado es indefinido (no lanza excepción).

**Implementar en:** Java

---

### Ejercicio 7.5.4 — Streams con colecciones

**Enunciado:** Dado un `List<String>` de nombres, usa Streams para: (a) filtrar los que tienen más de 5 letras, (b) convertirlos a mayúsculas, (c) ordenarlos, (d) contar los únicos, (e) agruparlos por longitud, (f) encontrar el más largo.

**Restricciones:** Lista de 15 nombres.

**Pista:**
```java
// Ejemplo: filtrar y transformar
lista.stream()
     .filter(s -> s.length() > 5)
     .map(String::toUpperCase)
     .sorted()
     .collect(Collectors.toList());

// groupingBy
lista.stream().collect(Collectors.groupingBy(String::length));
```

**Implementar en:** Java

---

### Ejercicio 7.5.5 — Elegir la colección correcta

**Enunciado:** Para cada escenario, elige y justifica la colección más adecuada. Luego implementa cada uno:

(a) Registro de visitantes únicos a un sitio web (solo importa si visitó, no cuántas veces).  
(b) Historial de búsquedas recientes (las últimas 10, sin duplicados, en orden de más a menos reciente).  
(c) Cola de impresión donde los documentos urgentes tienen prioridad.  
(d) Mapa de precios de productos que deben listarse en orden alfabético.  
(e) Caché con expiración por tiempo que elimina los menos accedidos recientemente.

**Restricciones:** Justifica la complejidad de las operaciones clave para cada caso.

**Pista:**
- (a) `HashSet` — `O(1)` add y contains
- (b) `LinkedHashSet` + lógica de límite — mantiene orden de inserción
- (c) `PriorityQueue` — `O(log n)` inserción, `O(1)` peek del más urgente
- (d) `TreeMap` — iteración en orden natural de claves
- (e) `LinkedHashMap` con `accessOrder=true` — LRU nativo

**Implementar en:** Java

---

## Tabla resumen — Cuándo usar cada colección

**Para List (secuencias):**

| Necesito... | Usar | Por qué |
|---|---|---|
| Acceso por índice frecuente | `ArrayList` | `O(1)` get |
| Insertar/eliminar al inicio o medio frecuente | `LinkedList` | `O(1)` en extremos |
| Stack (LIFO) | `ArrayDeque` | Más eficiente que `Stack` |
| Queue (FIFO) | `ArrayDeque` | Más eficiente que `LinkedList` |
| Ambos extremos | `ArrayDeque` | Deque eficiente |

**Para Set (sin duplicados):**

| Necesito... | Usar | Por qué |
|---|---|---|
| Máxima velocidad, sin orden | `HashSet` | `O(1)` operaciones |
| Sin duplicados, en orden de inserción | `LinkedHashSet` | `O(1)` + orden |
| Ordenado, rango de valores | `TreeSet` | `O(log n)` + `floor`, `ceiling`, `headSet` |

**Para Map (clave → valor):**

| Necesito... | Usar | Por qué |
|---|---|---|
| Máxima velocidad | `HashMap` | `O(1)` operaciones |
| Iteración en orden de inserción | `LinkedHashMap` | `O(1)` + orden |
| LRU Cache | `LinkedHashMap` (accessOrder=true) | LRU nativo |
| Claves ordenadas, consultas de rango | `TreeMap` | `O(log n)` + `floorKey`, `headMap`, `tailMap` |

**Para colas con prioridad:**

| Necesito... | Usar | Por qué |
|---|---|---|
| Siempre procesar el mínimo/máximo | `PriorityQueue` | `O(1)` peek, `O(log n)` poll |
| Concurrencia + prioridad | `PriorityBlockingQueue` | Thread-safe |

**Para concurrencia:**

| Necesito... | Usar | Por qué |
|---|---|---|
| Map compartido entre hilos | `ConcurrentHashMap` | Sin bloqueo total |
| Queue productor-consumidor | `LinkedBlockingQueue` | Bloqueo en vacío/lleno |
| Lista con pocas escrituras | `CopyOnWriteArrayList` | Lecturas sin lock |
