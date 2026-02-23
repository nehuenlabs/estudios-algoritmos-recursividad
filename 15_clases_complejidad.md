# Guía de Ejercicios — Clases de Complejidad: P, NP y NP-completo

> Este archivo combina **teoría** con **ejercicios prácticos** de algoritmos de aproximación y reducción.
>
> Contexto final del repositorio: `15_clases_complejidad.md`.

---

## ¿Por qué importa esto para un programador?

Saber que un problema es NP-completo te libera: en lugar de buscar un algoritmo eficiente exacto (que probablemente no existe), puedes enfocarte en:
1. **Aproximaciones** — soluciones subóptimas pero rápidas con garantía de error acotado
2. **Casos especiales** — el problema es NP-completo en general pero polinomial para tu instancia específica
3. **Heurísticas** — sin garantías formales pero útiles en práctica

---

## Definiciones fundamentales

```
P   = Problemas decidibles en tiempo POLINOMIAL
      → Rápido de resolver
      Ejemplo: ¿Hay un camino de A a B? (BFS/DFS en O(V+E))

NP  = Problemas verificables en tiempo polinomial
      → Lento de resolver (quizás), rápido de verificar
      Ejemplo: ¿Hay un camino hamiltoniano? Si alguien te dice el camino,
               verificarlo es O(n). Encontrarlo es aparentemente O(n!)

NP-completo = Los problemas "más difíciles" de NP
      → Cualquier problema en NP se reduce a él en tiempo polinomial
      → Si uno de ellos tiene solución polinomial, todos en NP también

NP-duro = Al menos tan difícil como NP-completo
      → No necesariamente en NP (puede no ser verificable eficientemente)

Pregunta abierta más famosa: ¿P = NP?
  Si P = NP: la criptografía moderna colapsa
  Si P ≠ NP: los problemas NP-completos nunca tendrán solución eficiente exacta
  Consenso académico: casi certeza de que P ≠ NP, pero sin prueba
```

**Diagrama de inclusión (asumiendo P ≠ NP):**

```
┌─────────────────────────────────────────┐
│  NP-duro                                │
│  ┌───────────────────────────────────┐  │
│  │  NP                               │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  NP-completo                │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │  P                    │  │  │  │
│  │  │  │  (= NP ∩ NP-completo  │  │  │  │
│  │  │  │   si P=NP)            │  │  │  │
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Tabla de contenidos

- [Sección 15.1 — Problemas en P](#sección-151--problemas-en-p)
- [Sección 15.2 — Problemas NP y verificación](#sección-152--problemas-np-y-verificación)
- [Sección 15.3 — Reduciones y NP-completitud](#sección-153--reducciones-y-np-completitud)
- [Sección 15.4 — Algoritmos de Aproximación](#sección-154--algoritmos-de-aproximación)
- [Sección 15.5 — Casos tratables: FPT y casos especiales](#sección-155--casos-tratables-fpt-y-casos-especiales)

---

## Sección 15.1 — Problemas en P

Los problemas en P tienen algoritmos polinomiales conocidos. El objetivo aquí es **reconocer** qué problemas son fáciles y **por qué**.

```
Problemas canónicos en P:
  - Ordenamiento:          O(n log n)
  - Camino más corto:      O((V+E) log V) — Dijkstra
  - MST:                   O(E log V) — Kruskal/Prim
  - Matching bipartito:    O(V * E) — Hopcroft-Karp
  - Flujo máximo:          O(V * E²) — Ford-Fulkerson
  - Programación lineal:   O(n^3.5) — Ellipsoid / Interior-point
  - Primalidad:            O(n^6) — AKS (2002), O(sqrt(n)) práctico

Nota: P no significa "rápido en la práctica".
  Un algoritmo O(n^100) está en P pero es inutilizable.
  La clave es que el exponente es una constante fija.
```

---

### Ejercicio 15.1.1 — Reconocer problemas en P

**Enunciado:** Para cada uno de los siguientes problemas, indica si está en P o no (justifica). Luego implementa los que están en P:

1. ¿Existe un ciclo en un grafo dirigido?
2. ¿Existe un camino entre dos nodos en un grafo?
3. ¿Existe un camino hamiltoniano en un grafo? (visita todos los nodos)
4. ¿Se puede ordenar un arreglo?
5. ¿Existe un corte mínimo en un grafo con flujo?

**Restricciones:** `1 <= V <= 1000` para los grafos.

**Pista:** (1) DFS detecta ciclos en `O(V+E)`. (2) BFS/DFS en `O(V+E)`. (3) Aparentemente no está en P (es NP-completo). (4) `O(n log n)`. (5) Max-flow min-cut theorem — está en P con Ford-Fulkerson.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.1.2 — 2-SAT está en P (pero 3-SAT es NP-completo)

**Enunciado:** 2-SAT es el problema de satisfacibilidad donde cada cláusula tiene exactamente 2 literales (ej: `(x ∨ y) ∧ (¬x ∨ z)`). Implementa el algoritmo de Kosaraju/Tarjan para resolverlo en `O(V+E)`.

**Restricciones:** Hasta 1000 variables y 5000 cláusulas.

**Pista:** Cada cláusula `(a ∨ b)` equivale a `(¬a → b) ∧ (¬b → a)`. Construye el grafo de implicaciones. Si una variable `x` y su negación `¬x` están en el mismo SCC, la fórmula es insatisfacible.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.1.3 — Matching bipartito máximo

**Enunciado:** Dado un grafo bipartito (dos grupos de nodos, aristas solo entre grupos), encuentra el matching máximo (mayor conjunto de aristas sin vértices repetidos).

**Restricciones:** Hasta 500 nodos en cada lado, hasta 10000 aristas.

**Pista:** Usa el algoritmo de Hopcroft-Karp `O(E * sqrt(V))` o el más simple de augmenting paths `O(V * E)`. El matching bipartito máximo se reduce a flujo máximo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.1.4 — Flujo máximo (Ford-Fulkerson)

**Enunciado:** Dado un grafo dirigido con capacidades en las aristas, un nodo fuente `s` y un sumidero `t`, calcula el flujo máximo de `s` a `t`.

**Restricciones:** `1 <= V <= 200`, `1 <= E <= 5000`, `1 <= capacidad <= 1000`.

**Pista:** Ford-Fulkerson con BFS (Edmonds-Karp) es `O(V * E²)` y garantiza terminación. El flujo máximo = corte mínimo (teorema max-flow min-cut).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.1.5 — Coloreo de grafos bipartitos (2-coloreable)

**Enunciado:** Un grafo es 2-coloreable (bipartito) si y solo si no tiene ciclos de longitud impar. Determina si un grafo es bipartito y, si lo es, devuelve la 2-coloración.

**Restricciones:** `1 <= V <= 10^4`, `0 <= E <= 10^5`.

**Pista:** BFS con 2 colores. Si al procesar un vecino tiene el mismo color que el nodo actual, hay un ciclo impar y no es bipartito. 2-coloreo está en P, pero k-coloreo para `k >= 3` es NP-completo.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 15.2 — Problemas NP y Verificación

Un problema está en NP si, dado un "certificado" (solución candidata), puedes verificar su corrección en tiempo polinomial.

```
Problema: SUBSET SUM
  Entrada: Conjunto S = {3, 7, 1, 8, 2} y objetivo t = 11
  Pregunta: ¿Existe un subconjunto que sume exactamente t?

  Solución: {3, 8} suma 11 ✓
  Verificación: Dada {3, 8}, sumar tarda O(k) — POLINOMIAL ✓
  Encontrar: 2^n subconjuntos posibles — EXPONENCIAL

  → SUBSET SUM está en NP (verificable eficientemente)
  → También es NP-completo (uno de los primeros problemas en serlo)

Nota: DP resuelve SUBSET SUM en O(n * t) — pseudopolinomial
  Si t es pequeño, es "eficiente" en la práctica
  Pero t puede ser exponencialmente grande → sigue siendo NP-completo
```

---

### Ejercicio 15.2.1 — Verificador de SUBSET SUM

**Enunciado:** Implementa dos funciones: (1) un verificador que, dado un subconjunto, confirma si suma exactamente `t` — `O(k)`, y (2) un solucionador con backtracking — `O(2^n)`. Observa la diferencia entre verificar y resolver.

**Restricciones:** `n <= 20` para el solucionador, `t <= 10^6`.

**Pista:** El verificador es trivial. El solucionador con backtracking explora `2^n` subconjuntos. Compara con la solución DP `O(n*t)` para ver cómo la pseudopolinomialidad ayuda.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.2.2 — Verificador de ciclo hamiltoniano

**Enunciado:** Implementa un verificador que, dado un grafo y una permutación de sus nodos, confirma si forma un ciclo hamiltoniano válido — `O(n)`. Luego implementa el solucionador con backtracking — `O(n!)`.

**Restricciones:** `n <= 12` para el solucionador.

**Pista:** El verificador solo necesita comprobar que la permutación es válida (todos los nodos) y que cada par consecutivo está conectado. El solucionador puede usar bitmask DP `O(2^n * n)` para mejorar el `O(n!)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.2.3 — Problema del viajante (TSP) — Bitmask DP

**Enunciado:** Dado un grafo completo ponderado de `n` ciudades, encuentra el recorrido más corto que visita todas las ciudades exactamente una vez y regresa al inicio.

**Restricciones:** `n <= 20`.

**Pista:** Bitmask DP: `dp[mask][i]` = mínima distancia para visitar las ciudades del `mask` terminando en `i`. `O(2^n * n²)`. Mucho mejor que `O(n!)` pero aún exponencial — el problema es NP-duro.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.2.4 — 3-SAT verificador e instancias

**Enunciado:** Implementa un verificador para 3-SAT: dado una fórmula en FNC con cláusulas de 3 literales y una asignación de valores a variables, verifica en `O(n)` si la asignación satisface la fórmula. Genera instancias aleatorias y observa la dificultad.

**Restricciones:** Hasta 100 variables y 500 cláusulas.

**Pista:** Para la "fase de transición": con ratio cláusulas/variables ≈ 4.27, las instancias aleatorias de 3-SAT son las más difíciles (cerca del umbral de satisfacibilidad).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.2.5 — El problema de la mochila como NP

**Enunciado:** (a) Implementa el solucionador DP `O(n*W)` para la mochila 0/1. (b) Genera instancias con `W = 10^9` donde el DP no es eficiente. (c) Explica por qué el DP es "pseudopolinomial" y no polinomial verdadero.

**Restricciones:** `n <= 30`, `W <= 10^9` para demostrar el límite.

**Pista:** La complejidad `O(n*W)` depende del **valor** de W, no del número de bits para representarlo. Un número de `b` bits puede valer hasta `2^b`, haciendo que `O(n*W) = O(n*2^b)` — exponencial en el tamaño de la entrada.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 15.3 — Reducciones y NP-completitud

Una **reducción polinomial** `A ≤_p B` significa: si puedo resolver `B` eficientemente, también puedo resolver `A`.

```
Cadena de reducciones de Cook-Levin (1971-1972):

CIRCUITO SAT  →  3-SAT  →  CLIQUE  →  VERTEX COVER  →  SUBSET SUM
                              ↓              ↓
                         INDEPENDENT   HAM. CYCLE → TSP
                            SET

Cada flecha es una reducción polinomial.
Si resuelves CUALQUIERA de estos en tiempo polinomial,
TODOS quedan resueltos → P = NP.

¿Cómo mostrar que X es NP-completo?
  1. Mostrar X ∈ NP (existe verificador polinomial)
  2. Mostrar que algún Y NP-completo se reduce a X: Y ≤_p X
```

---

### Ejercicio 15.3.1 — Reducción: Vertex Cover a Independent Set

**Enunciado:** Demuestra que `VERTEX COVER ≤_p INDEPENDENT SET`: un conjunto `S` es un vertex cover si y solo si `V - S` es un independent set. Implementa la reducción y verifica con ejemplos.

**Restricciones:** Grafos de hasta 20 nodos.

**Pista:** La reducción es trivial: son complementarios. Si `S` cubre todas las aristas (vertex cover), entonces entre los nodos de `V - S` no hay aristas (independent set).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.3.2 — Clique máximo (NP-duro)

**Enunciado:** Un clique es un subgrafo completo. Encuentra el clique máximo de un grafo. Implementa tanto el backtracking `O(2^n)` como la versión con branch-and-bound.

**Restricciones:** `n <= 30` para backtracking.

**Pista:** Backtracking con poda: si el número de nodos restantes más el tamaño del clique actual es menor que el mejor clique encontrado, descarta. `Clique ≤_p Independent Set ≤_p Vertex Cover`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.3.3 — Coloreo de grafos (Graph Coloring)

**Enunciado:** Dado un grafo y `k` colores, ¿puede colorearse con `k` colores tal que ningún par adyacente tenga el mismo color? k=2 está en P (bipartito), k≥3 es NP-completo. Implementa backtracking para k=3.

**Restricciones:** `n <= 20`.

**Pista:** Backtracking: para cada nodo sin color, prueba los `k` colores. Poda: si la asignación actual viola la restricción de adyacencia, retrocede. El número cromático de un grafo es el mínimo `k` necesario.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.3.4 — Bin Packing (NP-duro)

**Enunciado:** Dados objetos de tamaños `s_1, ..., s_n` y contenedores de capacidad `C`, empaca todos los objetos usando el mínimo número de contenedores. Implementa la solución exacta por backtracking y la heurística "First Fit Decreasing".

**Restricciones:** `n <= 20` para exacta, `n <= 10^4` para heurística.

**Pista:** La solución exacta es exponencial. FFD: ordena objetos de mayor a menor; para cada objeto, colócalo en el primer contenedor donde quepa. FFD garantiza a lo sumo `11/9 * OPT + 6/9` contenedores.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.3.5 — Reconocer la clase de un problema nuevo

**Enunciado:** Para cada uno de estos problemas, determina si está en P, NP-completo o si no sabes. Justifica y, donde corresponda, muestra la reducción desde un problema conocido:

1. ¿Tiene un grafo un camino de longitud exactamente `k`?
2. ¿Tiene un grafo un ciclo de longitud exactamente `k`?
3. ¿Puede un grafo colorearse con `log n` colores?
4. ¿Puede un tablero de ajedrez `n×n` ser recorrido por un caballo visitando cada casilla exactamente una vez? (Problema del caballo)
5. ¿Tiene una fórmula booleana con solo cláusulas de 2 literales una asignación satisfactoria?

**Pista:** (1) DFS/BFS en P. (2) Para `k` pequeño puede ser P, para `k=n` es hamiltoniano = NP-completo. (3) NP-completo (coloreo sigue siendo NP-duro). (4) NP-completo (reducción desde hamiltoniano). (5) 2-SAT — en P.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 15.4 — Algoritmos de Aproximación

Cuando un problema es NP-duro, la alternativa práctica es un **algoritmo de aproximación**: una solución subóptima con garantía formal del error.

```
Ratio de aproximación α:
  α = max(ALG(I) / OPT(I))  sobre todas las instancias I

  α = 1.0  → solución exacta (solo si P = NP para NP-duros)
  α = 1.5  → nunca más de 50% peor que el óptimo
  α = 2.0  → nunca más del doble que el óptimo

Problemas célebres:
  Vertex Cover:   2-aproximación (greedy o matching)
  TSP (métrico):  1.5-aproximación (Christofides 1976, mejorado 2020)
  Bin Packing:    1.5-aproximación con Next Fit Decreasing
  Set Cover:      ln(n)-aproximación (óptima, a menos que P=NP)
  Clique:         No existe aproximación constante (a menos que P=NP)
```

**Ejemplo: 2-aproximación para Vertex Cover:**

```python
def vertex_cover_2aprox(grafo):
    """
    Elige iterativamente una arista no cubierta,
    agrega AMBOS extremos al cover y elimina todas las aristas adyacentes.
    Garantía: |cover| <= 2 * |OPT|
    """
    cubierto = set()
    aristas_usadas = set()

    for u in grafo:
        for v in grafo[u]:
            if u not in cubierto and v not in cubierto:
                cubierto.add(u)
                cubierto.add(v)

    return cubierto

# ¿Por qué es 2-aproximación?
# Las aristas seleccionadas forman un matching M (sin vértices comunes).
# OPT necesita al menos un vértice por arista de M → |OPT| >= |M|
# Nuestro cover usa exactamente 2*|M| vértices
# → |cover| = 2*|M| <= 2*|OPT|
```

---

### Ejercicio 15.4.1 — 2-aproximación para Vertex Cover

**Enunciado:** Implementa la 2-aproximación para Vertex Cover basada en matching. Verifica empíricamente en 100 grafos aleatorios que el ratio de aproximación nunca supera 2 (compara con la solución exacta por backtracking para `n <= 15`).

**Restricciones:** `n <= 1000` para la aproximación, `n <= 15` para la exacta.

**Pista:** El matching maximal (greedy) da la 2-aproximación directamente. Recuerda que un matching maximal ≠ matching máximo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.4.2 — Greedy ln(n)-aproximación para Set Cover

**Enunciado:** Dados un universo `U` y una colección de conjuntos `S_1, ..., S_m`, encuentra el mínimo número de conjuntos que cubre todo `U`. Implementa la aproximación greedy: siempre elige el conjunto que cubre más elementos no cubiertos.

**Restricciones:** `|U| <= 1000`, `m <= 500`.

**Pista:** En cada paso, el greedy cubre al menos `1/k` de los elementos restantes (donde `k` es el OPT). Esto lleva a `O(ln n)` iteraciones. Esta aproximación es óptima (no existe aproximación `(1-ε) ln n` a menos que P=NP).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.4.3 — TSP con vecino más cercano y 2-OPT

**Enunciado:** Para el TSP métrico, implementa: (1) heurística del vecino más cercano `O(n²)`, (2) mejora local 2-OPT `O(n²)` por iteración. Compara las rutas obtenidas con la solución exacta (bitmask DP) para `n = 15`.

**Restricciones:** `n <= 15` para exacta, `n <= 1000` para heurísticas.

**Pista:** 2-OPT: para cada par de aristas `(i,i+1)` y `(j,j+1)`, considera si invertir el segmento entre ellas mejora la distancia total. Repite hasta que no haya mejora.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.4.4 — PTAS para Knapsack

**Enunciado:** Implementa el esquema de aproximación en tiempo polinomial (PTAS) para la mochila: para cualquier `ε > 0`, el algoritmo garantiza solución con valor >= `(1-ε) * OPT` en tiempo `O(n^(1/ε))`.

**Restricciones:** `n <= 100`, `ε = 0.1` (10% del óptimo).

**Pista:** PTAS: escala y redondea los valores a múltiplos de `ε * max_valor / n`. Esto reduce el rango de valores y hace el DP eficiente. El error de redondeo está acotado por `ε * OPT`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.4.5 — Comparar exact vs aproximación en práctica

**Enunciado:** Para Vertex Cover, compara en 1000 instancias aleatorias de tamaño `n = 50`: (a) solución exacta con branch-and-bound, (b) 2-aproximación greedy, (c) solución LP-rounding. Mide: tiempo de ejecución, ratio de aproximación promedio y peor caso.

**Restricciones:** `n = 50`, grafos Erdős–Rényi con probabilidad de arista `0.3`.

**Pista:** En la práctica, el ratio de aproximación suele ser mucho menor que 2. El peor caso es teórico. LP-rounding: resuelve la relajación LP y redondea variables > 0.5 a 1.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 15.5 — Casos Tratables: FPT y Casos Especiales

Que un problema sea NP-completo no significa que siempre sea difícil. Hay casos especiales con soluciones eficientes.

```
FPT (Fixed-Parameter Tractable):
  Un problema parametrizado por k es FPT si tiene solución en O(f(k) * n^c)
  donde f(k) es cualquier función y c es constante.

  → Si k es pequeño, el algoritmo es eficiente aunque f(k) sea exponencial.

Ejemplo: Vertex Cover parametrizado por |cover| = k
  ¿Hay un vertex cover de tamaño <= k?
  Algoritmo FPT: O(2^k * n) — exponencial en k, lineal en n
  Si k <= 30, 2^30 * n ≈ 10^9 * n → manejable para n razonable

Estructuras especiales que hacen NP-completos polinomiales:
  - Grafos planares: coloreo en O(n) (4-coloración)
  - Grafos perfectos: coloreo polinomial (teorema de Chudnovsky 2006)
  - Árboles: muchos problemas NP-duros son polinomiales en árboles
  - Treewidth acotado: DP sobre descomposición en árbol
```

---

### Ejercicio 15.5.1 — FPT para Vertex Cover

**Enunciado:** Implementa el algoritmo FPT para Vertex Cover: ¿existe un cover de tamaño `<= k`? El algoritmo es `O(2^k * (n + E))`: para cada arista no cubierta, incluye uno de sus extremos en el cover y recurre con `k-1`.

**Restricciones:** `n <= 1000`, `k <= 20`.

**Pista:** En cada llamada recursiva, elige una arista `(u, v)` no cubierta. Hay dos opciones: incluir `u` o incluir `v`. Esto da un árbol de recursión de profundidad `k` y factor de ramificación 2 → `O(2^k)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.5.2 — Problemas NP-duros en árboles → P

**Enunciado:** El Independent Set es NP-duro en general pero polinomial en árboles. Implementa la solución DP para Maximum Independent Set en un árbol en `O(n)`. Verifica que la misma solución no funciona en grafos generales.

**Restricciones:** `n <= 10^5` para el árbol.

**Pista:** DP en árbol: `dp[nodo][0]` = max independent set del subárbol sin incluir `nodo`. `dp[nodo][1]` = incluyendo `nodo`. La transición es simple: si incluyes `nodo`, no puedes incluir sus hijos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.5.3 — DP sobre descomposición en árbol (Tree DP)

**Enunciado:** El Dominating Set (conjunto `S` tal que todo nodo está en `S` o tiene vecino en `S`) es NP-duro en general. Implementa la solución DP para el mínimo dominating set en un árbol en `O(n)`.

**Restricciones:** `n <= 10^5`.

**Pista:** Define 3 estados: `dp[v][0]` = nodo `v` cubierto por un hijo, `dp[v][1]` = `v` está en el dominating set, `dp[v][2]` = `v` no está pero será cubierto por su padre. La recursión en árbol es `O(n)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.5.4 — Reconocer la estructura del problema

**Enunciado:** Para cada uno de los siguientes problemas de la vida real, identifica: (a) a qué problema NP-conocido se reduce, (b) si hay estructura especial que lo hace tratable, (c) qué aproximación usarías:

1. Asignar 500 empleados a 20 proyectos minimizando conflictos de horario
2. Encontrar el mínimo número de antenas para cubrir todas las ciudades
3. Optimizar el orden de compilación de 1000 módulos con dependencias
4. Colorear un mapa de 50 países con mínimos colores
5. Encontrar la ruta más corta para un camión que reparte en 30 clientes

**Pista:** (1) Graph coloring / scheduling NP-duro → heurísticas. (2) Set cover NP-duro → greedy ln(n). (3) Topological sort — en P. (4) Graph coloring — en P para grafos planares (4 colores). (5) TSP NP-duro → 2-OPT heurística.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 15.5.5 — Demostrar límites mediante reducción

**Enunciado:** Muestra una reducción de 3-SAT a SUBSET SUM: dado una fórmula 3-SAT con `n` variables y `m` cláusulas, construye una instancia de SUBSET SUM en tiempo polinomial tal que la fórmula es satisfacible si y solo si existe el subconjunto deseado.

**Restricciones:** `n <= 5` variables, `m <= 10` cláusulas (para poder verificar).

**Pista:** La reducción clásica codifica cada variable y cláusula como un número decimal. Cada variable `x_i` genera dos números (para `x_i = true` y `x_i = false`). El objetivo es un número que codifica "todas las cláusulas satisfechas".

**Implementar en:** Python (la reducción es lo importante, no la ejecución)

---

## Tabla resumen — Clases de Complejidad

| Clase | Definición informal | Ejemplos |
|---|---|---|
| P | Resolvible en tiempo polinomial | Ordenamiento, BFS, Dijkstra, 2-SAT, flujo máximo |
| NP | Verificable en tiempo polinomial | SAT, Clique, TSP, Subset Sum, coloreo k≥3 |
| NP-completo | NP y NP-duro | 3-SAT, Clique, Vertex Cover, Subset Sum, TSP |
| NP-duro | Al menos tan difícil como NP-completo | TSP optimización, Halting problem, Bin Packing |
| co-NP | Complemento verificable en tiempo polinomial | "¿NO hay solución?" para problemas NP |

**Los 21 problemas NP-completos de Karp (1972):**

Clique, Independent Set, Vertex Cover, Set Cover, Exact Cover, 3-SAT, Chromatic Number, Directed Hamiltonian Cycle, Undirected Hamiltonian Cycle, 3-dimensional Matching, Knapsack, Job Sequencing, Partition, Max-Cut, y otros.

---

## Estrategias ante un problema NP-duro

```
1. ¿Hay estructura especial?
   - ¿Es un árbol? → muchos NP-duros son P en árboles
   - ¿Es bipartito? → coloreo, matching, etc. son más fáciles
   - ¿Tiene treewidth acotada? → DP sobre árbol de descomposición

2. ¿El parámetro clave es pequeño?
   - FPT: solución exponencial en k pero polinomial en n
   - Si k <= 20-30, puede ser manejable

3. ¿Necesitas la solución exacta o una aproximación?
   - Si aproximación: busca PTAS o algoritmo con ratio garantizado
   - Si exacta: branch-and-bound, bitmask DP para n pequeño

4. ¿Las instancias reales son difíciles o fáciles?
   - Instancias "reales" suelen ser mucho más fáciles que el peor caso
   - Heurísticas + tiempo límite puede ser suficiente en competición

5. ¿Hay formulación como PL entera?
   - ILP solvers (Gurobi, CPLEX) resuelven instancias grandes en práctica
   - Sin garantías de tiempo pero muy eficientes en la práctica
```

> **Mensaje final:** La teoría de complejidad no es un obstáculo — es un mapa. Te dice dónde buscar algoritmos eficientes y dónde aceptar que no existen. El programador que entiende estas clases puede distinguir entre "buscar más" y "cambiar de enfoque".
