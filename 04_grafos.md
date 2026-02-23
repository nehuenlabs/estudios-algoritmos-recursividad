# Guía de Ejercicios — Algoritmos de Grafos

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `03_reduccion_complejidad.md`.

---

## Conceptos previos

Un **grafo** es un conjunto de nodos (vértices) conectados por aristas (edges). Existen dos representaciones principales:

```python
# Representación 1: Lista de adyacencia (más común, eficiente en espacio)
grafo = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# Representación 2: Matriz de adyacencia (útil cuando n es pequeño)
# grafo[i][j] = 1 si hay arista entre i y j, 0 si no
n = 4
grafo_matriz = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
]

# Grafo con pesos (lista de adyacencia)
grafo_pesos = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('D', 5)],
    'C': [('A', 2), ('D', 1)],
    'D': [('B', 5), ('C', 1)]
}
```

**Tipos de grafos:**

| Tipo | Descripción | Algoritmo típico |
|---|---|---|
| No dirigido | Las aristas no tienen dirección | DFS, BFS |
| Dirigido (DAG) | Aristas con dirección, sin ciclos | Ordenamiento topológico |
| Ponderado | Aristas con peso/costo | Dijkstra, Bellman-Ford |
| No ponderado | Todas las aristas con peso 1 | BFS para camino mínimo |

---

## Tabla de contenidos

- [Sección 4.1 — BFS (Búsqueda en Anchura)](#sección-41--bfs-búsqueda-en-anchura)
- [Sección 4.2 — DFS Avanzado](#sección-42--dfs-avanzado)
- [Sección 4.3 — Dijkstra (Camino más corto con pesos >= 0)](#sección-43--dijkstra-camino-más-corto-con-pesos--0)
- [Sección 4.4 — Bellman-Ford (Pesos negativos)](#sección-44--bellman-ford-pesos-negativos)
- [Sección 4.5 — Floyd-Warshall (Todos contra todos)](#sección-45--floyd-warshall-todos-contra-todos)
- [Sección 4.6 — Kruskal y Prim (Árbol de Expansión Mínima)](#sección-46--kruskal-y-prim-árbol-de-expansión-mínima)
- [Sección 4.7 — Ordenamiento Topológico](#sección-47--ordenamiento-topológico)

---

## Sección 4.1 — BFS (Búsqueda en Anchura)

**Complejidad:** `O(V + E)` tiempo · `O(V)` espacio  
donde `V` = vértices, `E` = aristas

**Cuándo usar BFS:**
- Camino más corto en grafos **no ponderados** (o todos con peso 1)
- Explorar nivel por nivel
- Verificar si un grafo es bipartito
- Encontrar todos los nodos a distancia `k`

**Diferencia clave con DFS:**

```
BFS usa una COLA (FIFO) → explora nivel por nivel (anchura)
DFS usa una PILA (LIFO) → explora profundidad antes de volver

Grafo:  A - B - D
        |       |
        C - - - E

BFS desde A: A → B → C → D → E   (nivel por nivel)
DFS desde A: A → B → D → E → C   (profundidad primero)
```

**Ejemplo en Python:**

```python
from collections import deque

def bfs(grafo, inicio):
    visitados = set()
    cola = deque([inicio])
    visitados.add(inicio)
    orden = []

    while cola:
        nodo = cola.popleft()          # FIFO: sale el más antiguo
        orden.append(nodo)
        for vecino in grafo[nodo]:
            if vecino not in visitados:
                visitados.add(vecino)  # marcar ANTES de encolar
                cola.append(vecino)   # no al salir, al entrar

    return orden

# BFS para distancias mínimas (grafo no ponderado)
def bfs_distancias(grafo, inicio):
    distancias = {inicio: 0}
    cola = deque([inicio])

    while cola:
        nodo = cola.popleft()
        for vecino in grafo[nodo]:
            if vecino not in distancias:
                distancias[vecino] = distancias[nodo] + 1
                cola.append(vecino)

    return distancias
```

---

### Ejercicio 4.1.1 — BFS básico con orden de visita

**Enunciado:** Dado un grafo no dirigido y un nodo de inicio, implementa BFS y retorna la lista de nodos en orden de visita. Usa una cola (`deque`).

**Restricciones:** `1 <= V <= 10^3`, `0 <= E <= 10^4`.

**Pista:** Marca el nodo como visitado **cuando lo encolas**, no cuando lo procesas. De lo contrario puedes encolar el mismo nodo múltiples veces.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.1.2 — Camino más corto no ponderado

**Enunciado:** Dado un grafo no ponderado y dos nodos `origen` y `destino`, retorna la longitud del camino más corto entre ellos. Retorna `-1` si no existe camino.

**Restricciones:** `1 <= V <= 10^3`, `0 <= E <= 10^4`.

**Pista:** BFS garantiza que el primer camino encontrado hasta `destino` es el más corto. Lleva un dict de distancias desde `origen`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.1.3 — Componentes conectados

**Enunciado:** Dado un grafo no dirigido, cuenta cuántos componentes conectados tiene (grupos de nodos que están conectados entre sí).

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`.

**Pista:** Inicia BFS desde cada nodo no visitado. Cada BFS nuevo descubre un componente nuevo. Cuenta cuántas veces inicias un BFS.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.1.4 — Grafo bipartito

**Enunciado:** Determina si un grafo no dirigido es bipartito (sus nodos pueden colorearse con 2 colores de forma que ningún par de nodos adyacentes tenga el mismo color).

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`.

**Pista:** Usa BFS para colorear. Si algún vecino ya tiene el mismo color que el nodo actual, el grafo no es bipartito.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.1.5 — Nivel de nodos en árbol BFS

**Enunciado:** Dado un árbol binario, retorna una lista de listas donde cada sublista contiene los nodos de un nivel (recorrido por niveles / level-order traversal).

**Restricciones:** El árbol puede tener hasta `10^4` nodos.

**Pista:** Usa BFS. En cada iteración del bucle externo, procesa exactamente `len(cola)` nodos (los del nivel actual).

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 4.2 — DFS Avanzado

**Complejidad:** `O(V + E)` tiempo · `O(V)` espacio (call stack o stack explícito)

**Cuándo usar DFS:**
- Detectar ciclos en grafos
- Ordenamiento topológico
- Encontrar componentes fuertemente conectados
- Resolver laberintos y puzzles (backtracking)

**DFS con timestamps (tiempos de entrada y salida):**

```python
def dfs_con_timestamps(grafo, inicio):
    visitados = set()
    entrada = {}
    salida = {}
    tiempo = [0]   # lista para mutabilidad en closure

    def dfs(nodo):
        visitados.add(nodo)
        entrada[nodo] = tiempo[0]
        tiempo[0] += 1

        for vecino in grafo[nodo]:
            if vecino not in visitados:
                dfs(vecino)

        salida[nodo] = tiempo[0]
        tiempo[0] += 1

    dfs(inicio)
    return entrada, salida

# Los timestamps revelan relaciones de ancestro:
# nodo u es ancestro de v si entrada[u] < entrada[v] y salida[v] < salida[u]
```

---

### Ejercicio 4.2.1 — Detectar ciclo en grafo no dirigido

**Enunciado:** Dado un grafo no dirigido, determina si contiene al menos un ciclo.

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`.

**Pista:** Durante DFS, si llegas a un nodo ya visitado que no es el padre del nodo actual, hay un ciclo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.2.2 — Detectar ciclo en grafo dirigido

**Enunciado:** Dado un grafo dirigido, determina si contiene al menos un ciclo.

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`.

**Pista:** Usa tres estados: `no visitado`, `en progreso` (en el call stack actual), `finalizado`. Un ciclo existe si llegas a un nodo `en progreso`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.2.3 — DFS con timestamps

**Enunciado:** Implementa DFS que registre el tiempo de entrada y salida de cada nodo. Dado dos nodos `u` y `v`, determina si `u` es ancestro de `v`.

**Restricciones:** `1 <= V <= 10^3`.

**Pista:** `u` es ancestro de `v` si y solo si `entrada[u] < entrada[v]` y `salida[v] < salida[u]`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.2.4 — Puentes en un grafo (Bridges)

**Enunciado:** Una arista es un **puente** si su eliminación desconecta el grafo. Encuentra todas las aristas puente usando DFS.

**Restricciones:** `1 <= V <= 10^3`, `1 <= E <= 10^4`.

**Pista:** Usa el algoritmo de Tarjan. Para cada nodo lleva `disc` (tiempo de descubrimiento) y `low` (el nodo más temprano alcanzable desde su subárbol). Si `low[v] > disc[u]`, la arista `(u, v)` es puente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.2.5 — Componentes fuertemente conectados (Kosaraju)

**Enunciado:** Un componente fuertemente conectado (SCC) es un subgrafo donde todos los nodos son alcanzables entre sí. Encuentra todos los SCCs usando el algoritmo de Kosaraju.

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`.

**Pista:** Kosaraju usa dos pasadas DFS: primero en el grafo original (guardando orden de finalización), luego en el grafo transpuesto siguiendo ese orden.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 4.3 — Dijkstra (Camino más corto con pesos >= 0)

**Complejidad:** `O((V + E) log V)` con heap · `O(V²)` sin heap

**Restricción crítica:** Solo funciona con pesos **no negativos**. Si hay pesos negativos, usa Bellman-Ford.

**Principio:** Greedy. Siempre procesa el nodo no visitado con la menor distancia conocida acumulada.

```python
import heapq

def dijkstra(grafo, inicio):
    # grafo[u] = [(peso, vecino), ...]
    distancias = {nodo: float('inf') for nodo in grafo}
    distancias[inicio] = 0
    heap = [(0, inicio)]   # (distancia, nodo)

    while heap:
        dist_actual, nodo = heapq.heappop(heap)

        # Optimización: si ya procesamos este nodo con menor distancia, skip
        if dist_actual > distancias[nodo]:
            continue

        for peso, vecino in grafo[nodo]:
            nueva_dist = distancias[nodo] + peso
            if nueva_dist < distancias[vecino]:
                distancias[vecino] = nueva_dist
                heapq.heappush(heap, (nueva_dist, vecino))

    return distancias

# Traza para grafo A->B(4), A->C(2), C->B(1), B->D(5):
# heap = [(0,A)]
# pop (0,A) → dist[B]=4, dist[C]=2 → heap=[(2,C),(4,B)]
# pop (2,C) → dist[B]=min(4,3)=3   → heap=[(3,B),(4,B)]
# pop (3,B) → dist[D]=8             → heap=[(4,B),(8,D)]
# pop (4,B) → 4 > dist[B]=3, skip
# pop (8,D) → finalizado
# Resultado: {A:0, B:3, C:2, D:8}
```

---

### Ejercicio 4.3.1 — Dijkstra básico

**Enunciado:** Dado un grafo dirigido ponderado (pesos >= 0) y un nodo origen, retorna la distancia mínima desde el origen a todos los demás nodos.

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`, `0 <= peso <= 10^3`.

**Pista:** Usa un min-heap. Cuando sacas un nodo del heap, verifica si su distancia es la actual (puede haber entradas antiguas en el heap).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.3.2 — Dijkstra con reconstrucción de camino

**Enunciado:** Extiende Dijkstra para que además de las distancias, retorne el camino más corto entre `origen` y `destino`.

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`.

**Pista:** Lleva un dict `predecesor`. Cuando actualizas la distancia de `vecino`, registra `predecesor[vecino] = nodo`. Al final, reconstruye el camino desde `destino` hacia `origen` siguiendo los predecesores.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.3.3 — Camino más barato con k paradas máximo

**Enunciado:** Dado un grafo de vuelos con precios y dos ciudades `origen` y `destino`, encuentra el vuelo más barato usando como máximo `k` paradas intermedias. (LeetCode 787)

**Restricciones:** `1 <= V <= 100`, `0 <= k <= 100`.

**Pista:** Dijkstra modificado donde el estado es `(costo, nodo, paradas_restantes)`. O usa Bellman-Ford con `k+1` relajaciones.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.3.4 — Red de retardo mínimo (Network Delay Time)

**Enunciado:** Dado un grafo dirigido con tiempos de transmisión, un nodo origen envía una señal. ¿Cuánto tiempo tarda en llegar a **todos** los nodos? Retorna `-1` si algún nodo es inalcanzable.

**Restricciones:** `1 <= V <= 100`, `1 <= E <= 6000`.

**Pista:** Aplica Dijkstra desde el origen. La respuesta es el máximo de todas las distancias mínimas. Si alguna es infinita, retorna `-1`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.3.5 — Camino más corto en cuadrícula con obstáculos

**Enunciado:** Dada una cuadrícula `m x n` con celdas libres (`0`) y bloqueadas (`1`), encuentra el camino más corto de `(0,0)` a `(m-1,n-1)` moviéndote en las 4 direcciones.

**Restricciones:** `1 <= m, n <= 40`.

**Pista:** BFS es suficiente aquí (todos los pesos son 1). Pero si se permiten `k` eliminaciones de obstáculos, el estado se convierte en `(fila, columna, eliminaciones_restantes)` → usa BFS con estado extendido.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 4.4 — Bellman-Ford (Pesos negativos)

**Complejidad:** `O(V · E)` tiempo · `O(V)` espacio

**Cuándo usar sobre Dijkstra:**
- El grafo tiene aristas con **pesos negativos**
- Necesitas detectar **ciclos negativos** (ciclos cuya suma de pesos es negativa)

**Principio:** Relaja todas las aristas `V-1` veces. Cada iteración garantiza encontrar los caminos más cortos que usan hasta `i` aristas.

```python
def bellman_ford(V, aristas, origen):
    # aristas = [(u, v, peso), ...]
    distancias = [float('inf')] * V
    distancias[origen] = 0

    # Relajar V-1 veces
    for _ in range(V - 1):
        for u, v, peso in aristas:
            if distancias[u] != float('inf') and \
               distancias[u] + peso < distancias[v]:
                distancias[v] = distancias[u] + peso

    # Verificar ciclos negativos: si en la V-ésima iteración
    # aún se puede relajar, hay un ciclo negativo
    for u, v, peso in aristas:
        if distancias[u] != float('inf') and \
           distancias[u] + peso < distancias[v]:
            return None  # ciclo negativo detectado

    return distancias

# ¿Por qué V-1 iteraciones?
# El camino más corto sin ciclos tiene como máximo V-1 aristas.
# Después de i iteraciones, conocemos todos los caminos de longitud <= i.
```

---

### Ejercicio 4.4.1 — Bellman-Ford básico

**Enunciado:** Dado un grafo dirigido con posibles pesos negativos y un nodo origen, retorna la distancia mínima a todos los nodos. Retorna `None` si hay un ciclo negativo.

**Restricciones:** `1 <= V <= 10^3`, `0 <= E <= 10^4`. Los pesos pueden ser negativos.

**Pista:** Itera exactamente `V-1` veces. En la iteración `V`, si aún se puede relajar, hay ciclo negativo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.4.2 — Detectar ciclo negativo

**Enunciado:** Dado un grafo dirigido ponderado, determina si contiene algún ciclo cuya suma de pesos sea negativa.

**Restricciones:** `1 <= V <= 10^3`, `0 <= E <= 10^4`.

**Pista:** Ejecuta Bellman-Ford. Si en la iteración `V` (la extra) aún se puede relajar alguna arista, hay un ciclo negativo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.4.3 — Comparar Dijkstra vs Bellman-Ford

**Enunciado:** Dado un grafo con pesos no negativos, implementa ambos algoritmos y verifica que producen el mismo resultado. Mide y compara sus tiempos para `V=500, E=5000`.

**Restricciones:** `V=500`, `E=5000`, pesos no negativos.

**Pista:** Dijkstra debería ser significativamente más rápido (`O((V+E)log V)` vs `O(V·E)`). ¿Por cuánto?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.4.4 — Ruta con presupuesto máximo de tiempo

**Enunciado:** Dado un grafo de ciudades donde algunas aristas tienen "bonificación" (peso negativo que reduce el tiempo), encuentra la ruta más rápida desde `origen` a `destino` considerando que puede haber bonificaciones.

**Restricciones:** `1 <= V <= 200`, `1 <= E <= 500`.

**Pista:** Como hay pesos negativos, no puedes usar Dijkstra. Usa Bellman-Ford y detecta si hay ciclos negativos en el camino.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.4.5 — Arbitraje de divisas

**Enunciado:** Dado un grafo donde los nodos son divisas y las aristas son tasas de cambio (multiplicativas), detecta si existe un ciclo de cambio que genere ganancia (arbitraje). Por ejemplo: USD → EUR → GBP → USD con ganancia.

**Restricciones:** `2 <= V <= 30`.

**Pista:** Transforma el problema: aplica `log` a los pesos. Maximizar el producto de tasas equivale a minimizar la suma de `-log(tasa)`. Usa Bellman-Ford para detectar ciclos negativos en ese grafo transformado.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 4.5 — Floyd-Warshall (Todos contra todos)

**Complejidad:** `O(V³)` tiempo · `O(V²)` espacio

**Cuándo usar:**
- Necesitas las distancias mínimas entre **todos** los pares de nodos
- El grafo es denso (muchas aristas)
- `V` es pequeño (hasta ~500)

**Principio:** Programación dinámica. `dist[i][j][k]` = distancia mínima de `i` a `j` usando solo nodos intermedios `{0..k}`.

```python
def floyd_warshall(V, aristas):
    # Inicializar matriz de distancias
    dist = [[float('inf')] * V for _ in range(V)]
    for i in range(V):
        dist[i][i] = 0
    for u, v, peso in aristas:
        dist[u][v] = peso

    # Programación dinámica: considerar cada nodo k como intermedio
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    # Verificar ciclos negativos: si dist[i][i] < 0, hay ciclo negativo
    for i in range(V):
        if dist[i][i] < 0:
            return None  # ciclo negativo

    return dist

# ¿Por qué funciona?
# Después de considerar k como nodo intermedio,
# dist[i][j] = camino más corto de i a j pasando solo por {0..k}
```

---

### Ejercicio 4.5.1 — Floyd-Warshall básico

**Enunciado:** Dado un grafo dirigido ponderado, calcula la distancia mínima entre todos los pares de nodos. Retorna la matriz de distancias.

**Restricciones:** `1 <= V <= 200`, puede haber pesos negativos pero no ciclos negativos.

**Pista:** Inicializa la diagonal en `0` y las aristas directas con su peso. Todo lo demás en `inf`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.5.2 — Reconstruir camino con Floyd-Warshall

**Enunciado:** Extiende Floyd-Warshall para reconstruir el camino más corto entre cualquier par `(i, j)`.

**Restricciones:** `1 <= V <= 200`.

**Pista:** Lleva una matriz `next[i][j]` que guarda el siguiente nodo en el camino más corto de `i` a `j`. Actualízala cada vez que encuentres un camino mejor.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.5.3 — Ciudad con menor distancia máxima

**Enunciado:** Dado un grafo de ciudades y distancias, encuentra la ciudad que, considerando solo ciudades a distancia <= `umbral`, tenga la menor cantidad de ciudades alcanzables (para minimizar interferencia). (LeetCode 1334)

**Restricciones:** `2 <= V <= 100`, `1 <= umbral <= 10^4`.

**Pista:** Aplica Floyd-Warshall. Para cada ciudad, cuenta cuántas otras ciudades están a distancia `<= umbral`. Retorna la de menor conteo (en caso de empate, la de mayor índice).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.5.4 — Grado de separación

**Enunciado:** En una red social, el "grado de separación" entre dos personas es la longitud del camino más corto entre ellas. Dado el grafo de la red, calcula el diámetro (máxima distancia entre cualquier par).

**Restricciones:** `1 <= V <= 300`.

**Pista:** Aplica Floyd-Warshall. El diámetro es el máximo de `dist[i][j]` para todos los pares donde `dist[i][j] < inf`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.5.5 — Dijkstra vs Floyd-Warshall

**Enunciado:** Para un grafo de `V=100` nodos, implementa: (a) `V` ejecuciones de Dijkstra (una por nodo origen) y (b) Floyd-Warshall. Verifica que dan el mismo resultado y compara los tiempos.

**Restricciones:** `V=100`, `E=2000`, pesos no negativos.

**Pista:** V × Dijkstra: `O(V·(V+E)log V)`. Floyd-Warshall: `O(V³)`. ¿Cuál es más rápido para este caso?

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 4.6 — Kruskal y Prim (Árbol de Expansión Mínima)

**Complejidad Kruskal:** `O(E log E)` tiempo · `O(V)` espacio  
**Complejidad Prim:** `O((V + E) log V)` con heap

**Árbol de Expansión Mínima (MST):** Subgrafo que conecta todos los nodos con el mínimo costo total, sin ciclos.

**Kruskal vs Prim:**

| Aspecto | Kruskal | Prim |
|---|---|---|
| Estrategia | Ordena aristas por peso, agrega si no forma ciclo | Expande desde un nodo, siempre agrega la arista más barata |
| Estructura | Union-Find | Min-heap |
| Mejor para | Grafos dispersos (pocas aristas) | Grafos densos (muchas aristas) |

```python
# Kruskal con Union-Find
def kruskal(V, aristas):
    # aristas = [(peso, u, v)]
    aristas.sort()                  # ordenar por peso
    padre = list(range(V))

    def find(x):
        if padre[x] != x:
            padre[x] = find(padre[x])  # path compression
        return padre[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False            # mismo componente → ciclo
        padre[px] = py
        return True

    mst = []
    costo_total = 0
    for peso, u, v in aristas:
        if union(u, v):
            mst.append((u, v, peso))
            costo_total += peso

    return mst, costo_total
```

---

### Ejercicio 4.6.1 — Kruskal básico

**Enunciado:** Dado un grafo no dirigido ponderado, encuentra el Árbol de Expansión Mínima usando el algoritmo de Kruskal. Retorna las aristas del MST y su costo total.

**Restricciones:** `1 <= V <= 10^4`, `1 <= E <= 10^5`, pesos no negativos.

**Pista:** Ordena las aristas por peso. Agrega cada arista al MST si no forma un ciclo (verifica con Union-Find).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.6.2 — Prim básico

**Enunciado:** Dado un grafo no dirigido ponderado, encuentra el MST usando el algoritmo de Prim. Empieza desde el nodo `0`.

**Restricciones:** `1 <= V <= 10^4`, `1 <= E <= 10^5`.

**Pista:** Usa un min-heap con `(peso, nodo)`. Empieza con el nodo `0`. En cada paso, agrega el nodo más barato no visitado y actualiza los pesos de sus vecinos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.6.3 — Conectar puntos con costo mínimo

**Enunciado:** Dado un arreglo de puntos en un plano 2D, conecta todos los puntos con el mínimo costo total. El costo de conectar `(x1,y1)` y `(x2,y2)` es `|x1-x2| + |y1-y2|` (distancia Manhattan). (LeetCode 1584)

**Restricciones:** `1 <= len(puntos) <= 10^3`.

**Pista:** Construye el grafo completo con todas las distancias Manhattan. Aplica Prim o Kruskal. Para Prim, considera la variante que no construye el grafo explícitamente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.6.4 — MST con restricciones de capacidad

**Enunciado:** Dado un grafo de redes donde las aristas tienen peso (costo) y capacidad, encuentra el árbol de expansión mínima que conecte todos los nodos, priorizando las aristas de mayor capacidad en caso de empate en costo.

**Restricciones:** `1 <= V <= 500`, `1 <= E <= 5000`.

**Pista:** Modifica el comparador de Kruskal para ordenar primero por costo y luego por capacidad descendente en caso de empate.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.6.5 — Verificar si un árbol es MST

**Enunciado:** Dado un grafo y un subgrafo árbol propuesto, verifica si ese árbol es efectivamente el MST del grafo original.

**Restricciones:** `1 <= V <= 10^3`, `1 <= E <= 10^4`.

**Pista:** Calcula el MST real con Kruskal. Compara el costo total con el del árbol propuesto. También verifica que el árbol propuesto sea un árbol válido (V-1 aristas, sin ciclos, conectado).

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 4.7 — Ordenamiento Topológico

**Complejidad:** `O(V + E)` tiempo · `O(V)` espacio

**Aplicable a:** Solo grafos **dirigidos acíclicos** (DAG).

**Qué es:** Una ordenación lineal de los nodos tal que para toda arista `(u, v)`, `u` aparece antes que `v`. Representa "qué debe hacerse primero".

**Dos algoritmos principales:**

```python
from collections import deque

# Algoritmo de Kahn (BFS): más intuitivo
def toposort_kahn(V, grafo):
    # Calcular grado de entrada de cada nodo
    in_degree = [0] * V
    for u in range(V):
        for v in grafo[u]:
            in_degree[v] += 1

    # Empezar con nodos sin dependencias
    cola = deque([i for i in range(V) if in_degree[i] == 0])
    orden = []

    while cola:
        nodo = cola.popleft()
        orden.append(nodo)
        for vecino in grafo[nodo]:
            in_degree[vecino] -= 1
            if in_degree[vecino] == 0:
                cola.append(vecino)

    # Si no procesamos todos los nodos, hay un ciclo
    return orden if len(orden) == V else []

# DFS post-order: el orden inverso de los tiempos de finalización
def toposort_dfs(V, grafo):
    visitados = set()
    pila = []

    def dfs(nodo):
        visitados.add(nodo)
        for vecino in grafo[nodo]:
            if vecino not in visitados:
                dfs(vecino)
        pila.append(nodo)   # agrega al finalizar (post-order)

    for nodo in range(V):
        if nodo not in visitados:
            dfs(nodo)

    return pila[::-1]   # invertir para obtener el orden topológico
```

---

### Ejercicio 4.7.1 — Orden de cursos (Course Schedule)

**Enunciado:** Dado `n` cursos y una lista de prerequisitos `[a, b]` (b debe completarse antes que a), determina si es posible completar todos los cursos. (LeetCode 207)

**Restricciones:** `1 <= n <= 2000`, `0 <= len(prerequisitos) <= 5000`.

**Pista:** El problema se reduce a detectar un ciclo en un grafo dirigido. Si hay ciclo, no es posible. Usa Kahn: si al final no procesaste todos los nodos, hay ciclo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.7.2 — Orden de cursos con resultado

**Enunciado:** Misma configuración que el ejercicio anterior, pero retorna un orden válido para completar todos los cursos. Si hay ciclo, retorna lista vacía. (LeetCode 210)

**Restricciones:** `1 <= n <= 2000`, `0 <= len(prerequisitos) <= 5000`.

**Pista:** El resultado del algoritmo de Kahn es directamente un orden válido.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.7.3 — Orden de compilación de módulos

**Enunciado:** Dado un proyecto con módulos y dependencias (un módulo puede depender de otros), encuentra el orden en que deben compilarse los módulos. Si hay dependencia circular, retorna error.

**Restricciones:** `1 <= módulos <= 500`, `0 <= dependencias <= 2000`.

**Pista:** Modela como un DAG. Usa ordenamiento topológico. Los módulos sin dependencias se compilan primero.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.7.4 — Menor cadena de diccionario (Alien Dictionary)

**Enunciado:** Dado un diccionario alienígena con palabras en orden lexicográfico, deduce el orden del alfabeto. Por ejemplo `["wrt","wrf","er","ett","rftt"]` implica `t<f`, `w<e`, `r<t`, `e<r`.

**Restricciones:** `1 <= len(palabras) <= 100`, `1 <= len(palabra) <= 100`.

**Pista:** Compara palabras adyacentes letra por letra. La primera diferencia da una relación de orden. Construye el grafo y aplica ordenamiento topológico.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.7.5 — Tareas con plazos y dependencias

**Enunciado:** Dadas `n` tareas con duración, plazos y dependencias, calcula el tiempo mínimo de inicio de cada tarea respetando las dependencias. Detecta si hay dependencias circulares.

**Restricciones:** `1 <= n <= 500`.

**Pista:** Usa ordenamiento topológico. El tiempo de inicio de una tarea es el máximo de los tiempos de finalización de todas sus dependencias.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Algoritmos de grafos

| Algoritmo | Complejidad | Pesos negativos | Todos los pares | Cuándo usar |
|---|---|---|---|---|
| BFS | `O(V+E)` | No (solo peso=1) | No | Camino más corto no ponderado |
| DFS | `O(V+E)` | — | No | Ciclos, componentes, topológico |
| Dijkstra | `O((V+E)log V)` | ❌ No | No | Camino mínimo, pesos >= 0 |
| Bellman-Ford | `O(V·E)` | ✅ Sí | No | Pesos negativos, detectar ciclo negativo |
| Floyd-Warshall | `O(V³)` | ✅ Sí | ✅ Sí | Todos los pares, V pequeño |
| Kruskal | `O(E log E)` | — | — | MST, grafos dispersos |
| Prim | `O((V+E)log V)` | — | — | MST, grafos densos |
| Toposort Kahn | `O(V+E)` | — | — | Ordenar DAG, detectar ciclo dirigido |

> **Regla de oro:** No ponderado → BFS. Ponderado sin negativos → Dijkstra. Con negativos → Bellman-Ford. Todos los pares → Floyd-Warshall. Conectar con mínimo costo → Kruskal/Prim.
