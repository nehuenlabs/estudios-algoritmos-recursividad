# Plantillas de Diagramas — Soluciones con Mermaid

> **Cómo usar este archivo:**
> 1. Identifica el patrón de tu algoritmo en la tabla de contenidos
> 2. Copia el bloque de la plantilla correspondiente
> 3. Reemplaza los textos en `MAYÚSCULAS` con los valores de tu algoritmo
> 4. El ejemplo concreto debajo de cada plantilla muestra cómo queda llenado

---

## Convenciones de color (consistentes en todas las plantillas)

| Color | Hex | Significado |
|---|---|---|
| 🟢 Verde | `#90EE90` | Caso base · Solución encontrada · Resultado final |
| 🔵 Azul | `#87CEEB` | Llamada activa · Nodo en proceso · Decisión |
| 🟠 Naranja | `#FFD580` | Cache hit · Memo · Valor ya calculado |
| 🔴 Rojo | `#FFB3B3` | Rama podada · Descartado · Inválido |
| ⬜ Gris | `#D3D3D3` | Combinación · Merge · Auxiliar |
| 🟣 Violeta | `#DDA0DD` | Estado visitado (grafos) |
| 🟡 Amarillo | `#FFFACD` | Nodo en cola / pendiente |

---

## Tabla de contenidos

| # | Patrón | Capítulo | Forma visual |
|---|---|---|---|
| 1 | [Recursión Lineal](#1--recursión-lineal) | Cap.01 §1 | Cadena vertical |
| 2 | [Múltiples Casos Base](#2--múltiples-casos-base) | Cap.01 §2 | Diamante inicial |
| 3 | [Múltiples Llamadas Recursivas](#3--múltiples-llamadas-recursivas) | Cap.01 §3 | Árbol binario |
| 4 | [Recursión por Paridad O(log n)](#4--recursión-por-paridad-olog-n) | Cap.01 §4 | Cadena logarítmica |
| 5 | [Recursión de Cola con Acumulador](#5--recursión-de-cola-con-acumulador) | Cap.01 §5 | Cadena plana |
| 6 | [DP Memoización Top-Down](#6--dp-memoización-top-down) | Cap.01 §6 | Árbol con nodos cacheados |
| 7 | [Divide y Vencerás](#7--divide-y-vencerás) | Cap.01 §7 | Árbol con fase merge |
| 8 | [DFS en Árbol o Grafo](#8--dfs-en-árbol-o-grafo) | Cap.01 §8 | Pre/In/Post-order |
| 9 | [DP Tabulación Bottom-Up](#9--dp-tabulación-bottom-up) | Cap.02 §2 | Tabla llenada de izq a der |
| 10 | [Backtracking con Poda](#10--backtracking-con-poda) | Cap.02 §3 | Árbol con ramas cortadas |
| 11 | [Stack Explícito sin recursión](#11--stack-explícito-sin-recursión) | Cap.02 §4 | Flujo con pila |
| 12 | [Dos Punteros](#12--dos-punteros) | Cap.03 §2 | Arreglo con punteros |
| 13 | [Ventana Deslizante](#13--ventana-deslizante) | Cap.03 §3 | Arreglo con ventana |
| 14 | [Prefix Sums](#14--prefix-sums) | Cap.03 §4 | Tabla acumulada |
| 15 | [Pila Monótona](#15--pila-monótona) | Cap.03 §7 | Arreglo con pila |
| 16 | [BFS por Niveles](#16--bfs-por-niveles) | Cap.04 §1 | Capas horizontales |
| 17 | [DFS con Timestamps](#17--dfs-con-timestamps) | Cap.04 §2 | DFS numerado |
| 18 | [Dijkstra](#18--dijkstra) | Cap.04 §3 | Grafo con distancias |
| 19 | [Bellman-Ford](#19--bellman-ford) | Cap.04 §4 | Relajación iterativa |
| 20 | [Floyd-Warshall](#20--floyd-warshall) | Cap.04 §5 | Matriz todos-contra-todos |
| 21 | [Kruskal y Prim MST](#21--kruskal-y-prim-mst) | Cap.04 §6 | Grafo con MST |
| 22 | [Ordenamiento Topológico Kahn](#22--ordenamiento-topológico-kahn) | Cap.04 §7 | DAG con grados |
| 23 | [Heap sift-up y sift-down](#23--heap-sift-up-y-sift-down) | Cap.05 | Árbol heap |
| 24 | [Greedy Genérico](#24--greedy-genérico) | Cap.06 | Flujo con decisión |
| 25 | [Union-Find con Compresión](#25--union-find-con-compresión) | Cap.09 | Árbol de componentes |
| 26 | [Trie Insertar y Buscar](#26--trie-insertar-y-buscar) | Cap.10 | Árbol de prefijos |
| 27 | [KMP Tabla de Fallos y Búsqueda](#27--kmp-tabla-de-fallos-y-búsqueda) | Cap.12 | Flujo de comparación |
| 28 | [Bitmask DP](#28--bitmask-dp) | Cap.13 §4 | Estados como máscaras |

---

## 1 · Recursión Lineal

> Una sola llamada recursiva por nivel. Avanza hacia el caso base de a un paso.
> **Complejidad:** `O(n)` tiempo · `O(n)` stack

### Plantilla

```mermaid
flowchart TD
    A["FUNCION(PARAM)"]
    B{"CONDICION_BASE?"}
    C["Retorna VALOR_BASE"]
    D["Trabajo: OPERACION(PARAM)"]
    E["FUNCION(PARAM - 1)"]
    F["Retorna RESULTADO"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D --> E --> F

    style C fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
```

### Ejemplo: factorial(4)

```mermaid
flowchart TD
    A["factorial(4)"]
    B{"n == 0?"}
    C["Retorna 1"]
    D["factorial(3)"]
    E["factorial(2)"]
    F["factorial(1)"]
    G["factorial(0) → 1"]
    H["1×1=1 → 2×1=2 → 3×2=6 → 4×6=24"]

    A --> B
    B -- "No" --> D --> E --> F --> G --> H
    B -- "Sí" --> C

    style C fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style B fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#87CEEB
    style F fill:#87CEEB
```

---

## 2 · Múltiples Casos Base

> Más de una condición de parada. Común en Fibonacci, búsqueda binaria, palíndromos.
> **Complejidad:** `O(n)` o `O(2^n)` según la lógica

### Plantilla

```mermaid
flowchart TD
    A["FUNCION(PARAM)"]
    B{"CASO_BASE_1?"}
    C["Retorna VALOR_1"]
    D{"CASO_BASE_2?"}
    E["Retorna VALOR_2"]
    F["FUNCION(reducir PARAM)"]
    G["Retorna resultado"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D -- "Sí" --> E
    D -- "No" --> F --> G

    style C fill:#90EE90
    style E fill:#90EE90
    style B fill:#87CEEB
    style D fill:#87CEEB
    style F fill:#87CEEB
```

### Ejemplo: fibonacci con n=0 y n=1

```mermaid
flowchart TD
    A["fib(4)"]
    B{"n == 0?"}
    C["Retorna 0"]
    D{"n == 1?"}
    E["Retorna 1"]
    F["fib(3) + fib(2) = 3"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D -- "Sí" --> E
    D -- "No" --> F

    style C fill:#90EE90
    style E fill:#90EE90
    style B fill:#87CEEB
    style D fill:#87CEEB
    style F fill:#87CEEB
```

---

## 3 · Múltiples Llamadas Recursivas

> Cada invocación genera 2+ llamadas. Produce un árbol de llamadas exponencial.
> **Complejidad:** `O(2^n)` sin memo — motiva la Plantilla 6

### Plantilla

```mermaid
flowchart TD
    A["FUNCION(N)"]
    B{"CASO_BASE?"}
    C["Retorna VALOR_BASE"]
    D["FUNCION(N-1)"]
    E["FUNCION(N-2)"]
    F["Combina: IZQ OP DER"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    B -- "No" --> E
    D --> F
    E --> F

    style C fill:#90EE90
    style B fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#87CEEB
    style F fill:#D3D3D3
```

### Ejemplo: árbol de llamadas fib(4) — nodos en rojo = trabajo repetido

```mermaid
flowchart TD
    F4["fib(4)"]
    F3a["fib(3)"]
    F2a["fib(2)"]
    F3b["fib(3) dup"]
    F2b["fib(2) dup"]
    F1a["fib(1)=1"]
    F1b["fib(1)=1"]
    F1c["fib(1)=1"]
    F0a["fib(0)=0"]
    F0b["fib(0)=0"]

    F4 --> F3a
    F4 --> F2a
    F3a --> F3b
    F3a --> F2b
    F3b --> F1a
    F3b --> F0a
    F2b --> F1b
    F2b --> F0b
    F2a --> F1c

    style F1a fill:#90EE90
    style F1b fill:#90EE90
    style F1c fill:#90EE90
    style F0a fill:#90EE90
    style F0b fill:#90EE90
    style F3b fill:#FFB3B3
    style F2b fill:#FFB3B3
```

---

## 4 · Recursión por Paridad O(log n)

> El parámetro se divide entre 2 según sea par o impar.
> **Complejidad:** `O(log n)` — altura del árbol logarítmica

### Plantilla

```mermaid
flowchart TD
    A["FUNCION(N)"]
    B{"N == CASO_BASE?"}
    C["Retorna VALOR_BASE"]
    D{"N es par?"}
    E["mitad = FUNCION(N/2)"]
    F["Retorna mitad OP mitad"]
    G["mitad = FUNCION(N/2)"]
    H["Retorna mitad OP mitad OP BASE"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D -- "Par" --> E --> F
    D -- "Impar" --> G --> H

    style C fill:#90EE90
    style B fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#87CEEB
    style G fill:#87CEEB
    style F fill:#D3D3D3
    style H fill:#D3D3D3
```

### Ejemplo: pow(2, 10) — potencia rápida

```mermaid
flowchart TD
    A["pow(2,10) — par"]
    B["pow(2,5) — impar"]
    C["pow(2,2) — par"]
    D["pow(2,1) — impar"]
    E["pow(2,0) = 1"]

    R1["1×1×2 = 2"]
    R2["2×2 = 4"]
    R3["4×4×2 = 32"]
    R4["32×32 = 1024"]

    A --> B --> C --> D --> E --> R1 --> R2 --> R3 --> R4

    style E fill:#90EE90
    style R4 fill:#90EE90
    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
```

---

## 5 · Recursión de Cola con Acumulador

> El resultado parcial viaja como parámetro `acc`. No hay trabajo al subir.
> Con TCO usa `O(1)` espacio de stack.

### Plantilla

```mermaid
flowchart TD
    A["FUNCION(PARAM, acc=INICIO)"]
    B{"CASO_BASE?"}
    C["Retorna acc"]
    D["nuevo_acc = COMBINA(acc, PARAM)"]
    E["FUNCION(PARAM-1, nuevo_acc)"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D --> E

    style C fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
    style D fill:#D3D3D3
```

### Ejemplo: factorial_tail(4, acc=1)

```mermaid
flowchart LR
    A["fact(4, acc=1)"]
    B["fact(3, acc=4)"]
    C["fact(2, acc=12)"]
    D["fact(1, acc=24)"]
    E["fact(0, acc=24)"]
    F["n=0 → Retorna 24 ✓"]

    A -- "acc=1×4=4" --> B
    B -- "acc=4×3=12" --> C
    C -- "acc=12×2=24" --> D
    D -- "acc=24×1=24" --> E
    E --> F

    style F fill:#90EE90
    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#87CEEB
```

---

## 6 · DP Memoización Top-Down

> Recursión + caché. Los subproblemas ya calculados se retornan en O(1).
> **Complejidad:** `O(n)` tiempo y espacio con `n` subproblemas únicos

### Plantilla

```mermaid
flowchart TD
    A["FUNCION(PARAM)"]
    B{"PARAM en memo?"}
    C["Retorna memo[PARAM]"]
    D{"CASO_BASE?"}
    E["Retorna VALOR_BASE"]
    F["FUNCION(PARAM-1)"]
    G["FUNCION(PARAM-2)"]
    H["res = COMBINA(F,G)"]
    I["memo[PARAM] = res"]
    J["Retorna res"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D -- "Sí" --> E
    D -- "No" --> F
    D -- "No" --> G
    F --> H
    G --> H
    H --> I --> J

    style C fill:#FFD580
    style E fill:#90EE90
    style B fill:#87CEEB
    style D fill:#87CEEB
    style F fill:#87CEEB
    style G fill:#87CEEB
    style I fill:#D3D3D3
```

### Ejemplo: fib_memo(5) — solo 7 nodos vs 13 sin memo

```mermaid
flowchart TD
    F5["fib(5)"]
    F4["fib(4)"]
    F3["fib(3)"]
    F3h["fib(3) memo hit"]
    F2["fib(2)"]
    F2h["fib(2) memo hit"]
    F1a["fib(1)=1"]
    F1b["fib(1)=1"]
    F0["fib(0)=0"]

    F5 --> F4
    F5 --> F3h
    F4 --> F3
    F4 --> F2h
    F3 --> F2
    F3 --> F1a
    F2 --> F1b
    F2 --> F0

    style F1a fill:#90EE90
    style F1b fill:#90EE90
    style F0 fill:#90EE90
    style F3h fill:#FFD580
    style F2h fill:#FFD580
```

---

## 7 · Divide y Vencerás

> Divide en partes independientes, resuelve recursivamente y combina al subir.
> **Complejidad:** `O(n log n)` — Teorema Maestro T(n)=2T(n/2)+O(n)

### Plantilla

```mermaid
flowchart TD
    A["FUNCION(arr, ini, fin)"]
    B{"ini == fin?"}
    C["Retorna arr[ini]"]
    D["mid = (ini+fin)/2"]
    E["FUNCION(arr, ini, mid)"]
    F["FUNCION(arr, mid+1, fin)"]
    G["COMBINAR izq + der"]
    H["Retorna resultado"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D --> E
    D --> F
    E --> G
    F --> G
    G --> H

    style C fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
    style F fill:#87CEEB
    style G fill:#D3D3D3
```

### Ejemplo: merge_sort([3,1,4,2])

```mermaid
flowchart TD
    A["[3,1,4,2]"]
    B["[3,1]"]
    C["[4,2]"]
    D["[3]"]
    E["[1]"]
    F["[4]"]
    G["[2]"]
    M1["merge [1,3]"]
    M2["merge [2,4]"]
    M3["[1,2,3,4] ✓"]

    A --> B --> D
    B --> E
    A --> C --> F
    C --> G
    D --> M1
    E --> M1
    F --> M2
    G --> M2
    M1 --> M3
    M2 --> M3

    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style M3 fill:#90EE90
    style M1 fill:#D3D3D3
    style M2 fill:#D3D3D3
```

---

## 8 · DFS en Árbol o Grafo

> Exploración en profundidad. El trabajo puede ser pre/in/post-order.
> **Complejidad:** `O(V+E)` grafos · `O(n)` árboles

### Plantilla

```mermaid
flowchart TD
    A["DFS(nodo)"]
    B{"nodo nulo\no visitado?"}
    C["Retorna"]
    D["Marcar visitado"]
    E["TRABAJO PRE-ORDER"]
    F["DFS(hijo izquierdo)"]
    G["TRABAJO IN-ORDER"]
    H["DFS(hijo derecho)"]
    I["TRABAJO POST-ORDER"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D --> E --> F --> G --> H --> I

    style C fill:#90EE90
    style B fill:#87CEEB
    style F fill:#87CEEB
    style H fill:#87CEEB
    style E fill:#D3D3D3
    style G fill:#D3D3D3
    style I fill:#D3D3D3
```

### Ejemplo: altura de árbol (post-order) con raíz=1

```mermaid
flowchart TD
    N1["altura(1)"]
    N2["altura(2)"]
    N3["altura(3)"]
    N4["altura(4)"]
    N5["altura(5)"]
    NULL1["null→0"]
    NULL2["null→0"]
    NULL3["null→0"]
    NULL4["null→0"]
    R1["max(0,0)+1=1"]
    R2["max(0,0)+1=1"]
    R3["max(1,1)+1=2"]
    RESP["max(2,1)+1=3 ✓"]

    N1 --> N2
    N1 --> N3
    N2 --> N4
    N2 --> N5
    N4 --> NULL1
    N4 --> NULL2
    N5 --> NULL3
    N5 --> NULL4
    NULL1 --> R1
    NULL2 --> R1
    NULL3 --> R2
    NULL4 --> R2
    R1 --> R3
    R2 --> R3
    N3 --> RESP
    R3 --> RESP

    style NULL1 fill:#90EE90
    style NULL2 fill:#90EE90
    style NULL3 fill:#90EE90
    style NULL4 fill:#90EE90
    style RESP fill:#90EE90
    style R1 fill:#D3D3D3
    style R2 fill:#D3D3D3
    style R3 fill:#D3D3D3
```

---

## 9 · DP Tabulación Bottom-Up

> Llena una tabla iterativamente desde los casos base. Sin recursión.
> **Complejidad:** `O(n)` o `O(n²)` según la dimensión

### Plantilla 1D

```mermaid
flowchart LR
    subgraph Tabla["dp[0 .. N]"]
        T0["dp[0]\ncaso base"]
        T1["dp[1]"]
        T2["dp[2]"]
        T3["dp[3]"]
        TN["dp[N]\nrespuesta"]
    end

    T0 -- "F(dp[0])" --> T1
    T1 -- "F(dp[1],dp[0])" --> T2
    T2 -- "F(dp[2],dp[1])" --> T3
    T3 -- "..." --> TN

    style T0 fill:#90EE90
    style TN fill:#90EE90
    style T1 fill:#87CEEB
    style T2 fill:#87CEEB
    style T3 fill:#87CEEB
```

### Ejemplo: fib bottom-up hasta fib(6)=8

```mermaid
flowchart LR
    T0["dp[0]=0"]
    T1["dp[1]=1"]
    T2["dp[2]=1"]
    T3["dp[3]=2"]
    T4["dp[4]=3"]
    T5["dp[5]=5"]
    T6["dp[6]=8 ✓"]

    T0 --> T2
    T1 --> T2
    T1 --> T3
    T2 --> T3
    T2 --> T4
    T3 --> T4
    T3 --> T5
    T4 --> T5
    T4 --> T6
    T5 --> T6

    style T0 fill:#90EE90
    style T1 fill:#90EE90
    style T6 fill:#90EE90
    style T2 fill:#87CEEB
    style T3 fill:#87CEEB
    style T4 fill:#87CEEB
    style T5 fill:#87CEEB
```

---

## 10 · Backtracking con Poda

> Exploración exhaustiva con corte temprano al violar restricciones.
> **Complejidad:** `O(b^d)` peor caso, drásticamente reducido por la poda

### Plantilla

```mermaid
flowchart TD
    A["BACKTRACK(estado, nivel)"]
    B{"Solucion completa?"}
    C["Guardar solucion"]
    D{"Restriccion violada?"}
    E["Podar y retornar"]
    F["Para cada OPCION disponible"]
    G["Aplicar OPCION"]
    H["BACKTRACK(nuevo_estado, nivel+1)"]
    I["Deshacer OPCION"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D -- "Sí" --> E
    D -- "No" --> F --> G --> H --> I --> F

    style C fill:#90EE90
    style E fill:#FFB3B3
    style B fill:#87CEEB
    style D fill:#87CEEB
    style H fill:#87CEEB
    style I fill:#D3D3D3
```

### Ejemplo: N-Reinas n=4, fila 1

```mermaid
flowchart TD
    ROOT["Fila 1"]
    C1["Col 1"]
    C2["Col 2"]
    C3["Col 3"]
    C4["Col 4"]
    F2A["F2 Col1 misma col"]
    F2B["F2 Col2 diagonal"]
    F2C["F2 Col3 valida"]
    F2D["F2 Col4 valida"]
    F3X["F3 sin opciones"]
    F3OK["F3 Col2 valida"]
    SOL["F4 Col1 - solucion 1,3,?"]

    ROOT --> C1 & C2 & C3 & C4
    C1 --> F2A & F2B & F2C & F2D
    F2C --> F3X
    F2D --> F3OK
    F3OK --> SOL

    style F2A fill:#FFB3B3
    style F2B fill:#FFB3B3
    style F3X fill:#FFB3B3
    style C1 fill:#87CEEB
    style F2C fill:#87CEEB
    style F2D fill:#87CEEB
    style F3OK fill:#87CEEB
    style SOL fill:#90EE90
```

---

## 11 · Stack Explícito sin Recursión

> Simula DFS con pila propia. Evita stack overflow en entradas grandes.
> **Complejidad:** igual que la versión recursiva

### Plantilla

```mermaid
flowchart TD
    A["pila = [INICIO]"]
    B{"pila vacia?"}
    C["Retorna resultado"]
    D["Pop NODO de pila"]
    E{"NODO visitado?"}
    F["Skip"]
    G["Marcar NODO visitado"]
    H["Procesar NODO"]
    I["Push vecinos no visitados"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D --> E
    E -- "Sí" --> F --> B
    E -- "No" --> G --> H --> I --> B

    style C fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
    style H fill:#D3D3D3
    style F fill:#FFB3B3
```

### Ejemplo: DFS iterativo en grafo A-B-C-D

```mermaid
flowchart LR
    S0["Pila:[A]"]
    S1["Pop A, push B C\nPila:[B,C]"]
    S2["Pop C, push D\nPila:[B,D]"]
    S3["Pop D\nPila:[B]"]
    S4["Pop B\nPila:[]"]
    S5["Orden: A C D B"]

    S0 --> S1 --> S2 --> S3 --> S4 --> S5

    style S0 fill:#87CEEB
    style S5 fill:#90EE90
```

---

## 12 · Dos Punteros

> Dos índices sobre el mismo arreglo (ordenado). Convierte O(n²) en O(n).
> **Complejidad:** `O(n)` tiempo · `O(1)` espacio

### Plantilla

```mermaid
flowchart TD
    A["izq=0, der=len-1"]
    B{"izq < der?"}
    C["Retorna resultado"]
    D["valor = COMBINA(arr[izq], arr[der])"]
    E{"valor == objetivo?"}
    F["Guardar solucion"]
    G{"valor < objetivo?"}
    H["izq++"]
    I["der--"]

    A --> B
    B -- "No" --> C
    B -- "Sí" --> D --> E
    E -- "Sí" --> F --> B
    E -- "No" --> G
    G -- "Sí" --> H --> B
    G -- "No" --> I --> B

    style C fill:#90EE90
    style F fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
    style G fill:#87CEEB
```

### Ejemplo: par suma 9 en [1,2,4,5,7,8]

```mermaid
flowchart LR
    subgraph P1["izq=0 der=5"]
        A1["[1  2  4  5  7  8]\n ^                ^"]
        R1["1+8=9 ✓ par encontrado"]
    end
    subgraph P2["Si objetivo=11: izq=0 der=5"]
        A2["1+8=9 menor → izq++"]
    end
    subgraph P3["izq=1 der=5"]
        A3["2+8=10 menor → izq++"]
    end
    subgraph P4["izq=2 der=5"]
        A4["4+8=12 mayor → der--"]
    end
    subgraph P5["izq=2 der=4"]
        A5["4+7=11 ✓"]
    end

    P1 --> P2 --> P3 --> P4 --> P5

    style R1 fill:#90EE90
    style A5 fill:#90EE90
    style A4 fill:#FFD580
```

---

## 13 · Ventana Deslizante

> Ventana de tamaño variable que se mueve sobre el arreglo.
> Cada elemento entra y sale exactamente una vez.
> **Complejidad:** `O(n)` tiempo · `O(k)` espacio (tamaño ventana)

### Plantilla

```mermaid
flowchart TD
    A["izq=0, der=0, inicializar ventana"]
    B{"der < len(arr)?"}
    C["Retorna mejor resultado"]
    D["Agregar arr[der] a ventana"]
    E{"Ventana invalida?"}
    F["Eliminar arr[izq]\nizq++"]
    G["Actualizar mejor resultado"]
    H["der++"]

    A --> B
    B -- "No" --> C
    B -- "Sí" --> D --> E
    E -- "Sí" --> F --> E
    E -- "No" --> G --> H --> B

    style C fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
    style F fill:#FFB3B3
    style G fill:#D3D3D3
```

### Ejemplo: substring sin repetidos en "abcba"

```mermaid
flowchart LR
    subgraph V1["der=0"]
        W1["[a]  max=1"]
    end
    subgraph V2["der=1"]
        W2["[ab]  max=2"]
    end
    subgraph V3["der=2"]
        W3["[abc]  max=3"]
    end
    subgraph V4["der=3: b repetido"]
        W4["eliminar a → [bc]  max=3"]
    end
    subgraph V5["der=4"]
        W5["[bca]  max=3 ✓"]
    end

    V1 --> V2 --> V3 --> V4 --> V5

    style W3 fill:#90EE90
    style W5 fill:#90EE90
    style W4 fill:#FFB3B3
```

---

## 14 · Prefix Sums

> Precalcula sumas acumuladas. Consulta de rango en O(1) tras O(n) de precálculo.

### Plantilla

```mermaid
flowchart LR
    subgraph Pre["Precalculo O(n)"]
        P0["prefix[0]=0"]
        P1["prefix[1]=arr[0]"]
        P2["prefix[2]=arr[0]+arr[1]"]
        PN["prefix[n]=suma total"]
        P0 --> P1 --> P2 --> PN
    end

    subgraph Q["Consulta O(1)"]
        QF["suma(L,R) =\nprefix[R+1] - prefix[L]"]
    end

    Pre --> Q

    style P0 fill:#90EE90
    style QF fill:#90EE90
    style P1 fill:#87CEEB
    style P2 fill:#87CEEB
```

### Ejemplo: arr=[2,4,1,3,5], consulta suma(1,3)=8

```mermaid
flowchart LR
    subgraph ARR["arr"]
        A0["2"]
        A1["4"]
        A2["1"]
        A3["3"]
        A4["5"]
    end
    subgraph PFX["prefix"]
        PF0["0"]
        PF1["2"]
        PF2["6"]
        PF3["7"]
        PF4["10"]
        PF5["15"]
    end
    subgraph RES["suma(1,3)"]
        RES1["prefix[4]-prefix[1]"]
        RES2["10 - 2 = 8 ✓"]
        RES1 --> RES2
    end

    ARR --> PFX --> RES

    style PF0 fill:#90EE90
    style RES2 fill:#90EE90
    style PF4 fill:#FFD580
    style PF1 fill:#FFD580
```

---

## 15 · Pila Monótona

> Pila siempre ordenada (creciente o decreciente).
> Al agregar un elemento se expulsan los que rompen el orden.
> **Complejidad:** `O(n)` — cada elemento entra y sale exactamente una vez

### Plantilla

```mermaid
flowchart TD
    A["pila=[], i=0"]
    B{"i < len(arr)?"}
    C["Retorna resultado"]
    D{"pila no vacia Y\narr[i] rompe orden?"}
    E["Pop tope\nProcesar(tope, i)"]
    F["Push i\ni++"]

    A --> B
    B -- "No" --> C
    B -- "Sí" --> D
    D -- "Sí" --> E --> D
    D -- "No" --> F --> B

    style C fill:#90EE90
    style B fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#FFB3B3
    style F fill:#D3D3D3
```

### Ejemplo: siguiente mayor en [2,1,5,3,4]

```mermaid
flowchart LR
    subgraph I0["i=0: push 2"]
        S0["pila=[2]"]
    end
    subgraph I1["i=1: 1<2 push"]
        S1["pila=[2,1]"]
    end
    subgraph I2["i=2: 5>1 pop→nge[1]=5\n5>2 pop→nge[0]=5\npush 5"]
        S2["pila=[5]"]
    end
    subgraph I3["i=3: 3<5 push"]
        S3["pila=[5,3]"]
    end
    subgraph I4["i=4: 4>3 pop→nge[3]=4\n4<5 push"]
        S4["pila=[5,4]"]
    end
    subgraph FIN["nge=[5,5,-1,4,-1] ✓"]
        SF["restantes → -1"]
    end

    I0 --> I1 --> I2 --> I3 --> I4 --> FIN

    style SF fill:#90EE90
    style S2 fill:#D3D3D3
    style S4 fill:#D3D3D3
```

---

## 16 · BFS por Niveles

> Exploración nivel a nivel con cola FIFO.
> Garantiza el camino más corto en grafos no ponderados.
> **Complejidad:** `O(V+E)`

### Plantilla

```mermaid
flowchart LR
    subgraph N0["Nivel 0"]
        S["INICIO dist=0"]
    end
    subgraph N1["Nivel 1"]
        NA["VECINO_A dist=1"]
        NB["VECINO_B dist=1"]
    end
    subgraph N2["Nivel 2"]
        NC["VECINO_C dist=2"]
        ND["VECINO_D dist=2"]
    end
    subgraph N3["Nivel 3"]
        NE["DESTINO dist=3"]
    end

    S --> NA & NB
    NA --> NC
    NB --> NC & ND
    NC --> NE

    style S fill:#87CEEB
    style NE fill:#90EE90
    style NA fill:#FFFACD
    style NB fill:#FFFACD
    style NC fill:#FFFACD
    style ND fill:#FFFACD
```

### Ejemplo: BFS de A a F

```mermaid
flowchart LR
    subgraph C0["Cola: A"]
        CA["A dist=0"]
    end
    subgraph C1["Cola: B C"]
        CB["B dist=1"]
        CC["C dist=1"]
    end
    subgraph C2["Cola: D E"]
        CD["D dist=2"]
        CE["E dist=2"]
    end
    subgraph C3["Cola: F"]
        CF["F dist=3 ✓"]
    end

    CA --> CB & CC
    CB --> CD & CE
    CC --> CE
    CD --> CF
    CE --> CF

    style CA fill:#87CEEB
    style CB fill:#FFFACD
    style CC fill:#FFFACD
    style CD fill:#FFFACD
    style CE fill:#FFFACD
    style CF fill:#90EE90
```

---

## 17 · DFS con Timestamps

> DFS que registra tiempo de entrada y salida.
> Permite detectar ciclos, SCCs y relaciones de ancestro.
> **Complejidad:** `O(V+E)`

### Plantilla

```mermaid
flowchart TD
    A["DFS(nodo, t)"]
    B["entrada[nodo] = t++"]
    C["Estado: EN_PROGRESO"]
    D{"Para cada VECINO"}
    E{"VECINO no visitado?"}
    F["DFS(VECINO, t)"]
    G{"VECINO EN_PROGRESO?"}
    H["CICLO detectado"]
    I["salida[nodo] = t++"]
    J["Estado: FINALIZADO"]

    A --> B --> C --> D
    D --> E
    E -- "Sí" --> F --> D
    E -- "No" --> G
    G -- "Sí" --> H --> D
    G -- "No" --> D
    D -- "fin vecinos" --> I --> J

    style H fill:#FFB3B3
    style J fill:#90EE90
    style B fill:#87CEEB
    style C fill:#87CEEB
    style E fill:#87CEEB
    style G fill:#87CEEB
```

### Ejemplo: grafo A→B→D, A→C→D con timestamps

```mermaid
flowchart TD
    A["A  entra=0  sale=9"]
    B["B  entra=1  sale=6"]
    C["C  entra=7  sale=8"]
    D["D  entra=2  sale=5"]
    E["E  entra=3  sale=4"]

    A --> B
    A --> C
    B --> D
    D --> E
    C --> D

    style A fill:#87CEEB
    style E fill:#90EE90
    style B fill:#DDA0DD
    style C fill:#DDA0DD
    style D fill:#DDA0DD
```

---

## 18 · Dijkstra

> Greedy: siempre expande el nodo con menor distancia acumulada.
> Solo pesos no negativos.
> **Complejidad:** `O((V+E) log V)` con heap

### Plantilla

```mermaid
flowchart TD
    A["dist[ORIGEN]=0\ndist[resto]=inf\nheap=[(0,ORIGEN)]"]
    B{"heap vacio?"}
    C["Retorna dist[]"]
    D["Pop (d, nodo)"]
    E{"d > dist[nodo]?"}
    F["Skip (obsoleto)"]
    G["Para cada (VECINO, PESO)"]
    H["nueva = dist[nodo]+PESO"]
    I{"nueva < dist[VECINO]?"}
    J["dist[VECINO]=nueva\nPush (nueva, VECINO)"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D --> E
    E -- "Sí" --> F --> B
    E -- "No" --> G --> H --> I
    I -- "Sí" --> J --> G
    I -- "No" --> G

    style C fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
    style I fill:#87CEEB
    style F fill:#FFB3B3
    style J fill:#D3D3D3
```

### Ejemplo: A→B(4), A→C(2), C→B(1), B→D(5)

```mermaid
flowchart LR
    A["A  dist=0"]
    C["C  dist=2"]
    B["B  dist=3\nvia A→C→B"]
    D["D  dist=8"]

    A -- "2" --> C
    A -- "4" --> B
    C -- "1" --> B
    B -- "5" --> D

    NOTE["Ruta optima: A→C→B→D = 8\nno A→B→D = 9"]

    style A fill:#90EE90
    style D fill:#90EE90
    style C fill:#87CEEB
    style B fill:#87CEEB
```

---

## 19 · Bellman-Ford

> Relaja todas las aristas V-1 veces. Detecta ciclos negativos.
> **Complejidad:** `O(V·E)`

### Plantilla

```mermaid
flowchart TD
    A["dist[ORIGEN]=0, resto=inf"]
    B["i=1"]
    C{"i <= V-1?"}
    D["Para cada arista (u,v,w)"]
    E{"dist[u]+w < dist[v]?"}
    F["dist[v] = dist[u]+w"]
    G["i++"]
    H["Iteracion extra V"]
    I{"Alguna arista\nse relaja aun?"}
    J["CICLO NEGATIVO"]
    K["Retorna dist[]"]

    A --> B --> C
    C -- "Sí" --> D --> E
    E -- "Sí" --> F --> D
    E -- "No" --> D
    D -- "fin aristas" --> G --> C
    C -- "No" --> H --> I
    I -- "Sí" --> J
    I -- "No" --> K

    style K fill:#90EE90
    style J fill:#FFB3B3
    style C fill:#87CEEB
    style E fill:#87CEEB
    style I fill:#87CEEB
    style F fill:#D3D3D3
```

### Ejemplo: 3 nodos A→B(3), A→C(5), B→C(1)

```mermaid
flowchart LR
    I0["Inicio: A=0 B=inf C=inf"]
    I1["Iter 1: A→B: B=3\nA→C: C=5\nB→C: C=min(5,4)=4"]
    I2["Iter 2: sin cambios"]
    IF["dist: A=0 B=3 C=4 ✓"]

    I0 --> I1 --> I2 --> IF

    style I0 fill:#87CEEB
    style IF fill:#90EE90
    style I1 fill:#D3D3D3
```

---

## 20 · Floyd-Warshall

> DP en 3D: considera cada nodo k como intermediario.
> Todos los pares de distancias.
> **Complejidad:** `O(V³)` tiempo · `O(V²)` espacio

### Plantilla

```mermaid
flowchart TD
    A["Inicializar dist[i][j]\ncon pesos directos e inf"]
    B["dist[i][i]=0 para todo i"]
    C["Para k=0..V-1"]
    D["Para i=0..V-1"]
    E["Para j=0..V-1"]
    F{"dist[i][k]+dist[k][j]\n< dist[i][j]?"}
    G["dist[i][j]=dist[i][k]+dist[k][j]"]
    H{"dist[i][i]<0\npara algun i?"}
    I["CICLO NEGATIVO"]
    J["Retorna dist[][]"]

    A --> B --> C --> D --> E --> F
    F -- "Sí" --> G --> E
    F -- "No" --> E
    E -- "fin j" --> D
    D -- "fin i" --> C
    C -- "fin k" --> H
    H -- "Sí" --> I
    H -- "No" --> J

    style J fill:#90EE90
    style I fill:#FFB3B3
    style C fill:#87CEEB
    style F fill:#87CEEB
    style G fill:#D3D3D3
```

---

## 21 · Kruskal y Prim MST

> **Kruskal:** ordena aristas, agrega si no forma ciclo (Union-Find).
> **Prim:** expande desde un nodo, siempre la arista más barata.
> **Complejidad:** `O(E log E)` Kruskal · `O((V+E) log V)` Prim

### Plantilla Kruskal

```mermaid
flowchart TD
    A["Ordenar aristas por peso ASC"]
    B["Union-Find: cada nodo es raiz"]
    C["Para cada arista (u,v,w)"]
    D{"find(u) != find(v)?"}
    E["Agregar al MST\nunion(u,v)"]
    F["Descartar (ciclo)"]
    G{"MST tiene V-1 aristas?"}
    H["Retorna MST ✓"]

    A --> B --> C --> D
    D -- "Sí" --> E --> G
    D -- "No" --> F --> C
    G -- "Sí" --> H
    G -- "No" --> C

    style H fill:#90EE90
    style D fill:#87CEEB
    style G fill:#87CEEB
    style E fill:#D3D3D3
    style F fill:#FFB3B3
```

### Ejemplo Kruskal: 4 nodos

```mermaid
flowchart TD
    subgraph ARS["Aristas ordenadas"]
        E1["B-C peso=1 → MST"]
        E2["A-C peso=2 → MST"]
        E3["A-B peso=4 → ciclo A-B-C"]
        E4["B-D peso=5 → MST"]
    end
    subgraph MST["MST costo=8"]
        MA["A"]
        MB["B"]
        MC["C"]
        MD["D"]
        MA -- "2" --> MC
        MC -- "1" --> MB
        MB -- "5" --> MD
    end

    ARS --> MST

    style E1 fill:#90EE90
    style E2 fill:#90EE90
    style E4 fill:#90EE90
    style E3 fill:#FFB3B3
```

---

## 22 · Ordenamiento Topológico Kahn

> BFS sobre DAG comenzando por nodos sin dependencias (in-degree=0).
> **Complejidad:** `O(V+E)`

### Plantilla

```mermaid
flowchart TD
    A["Calcular in_degree[v]"]
    B["Cola = nodos con in_degree=0"]
    C{"Cola vacia?"}
    D{"procesados==V?"}
    E["CICLO - no es DAG"]
    F["Retorna orden topologico"]
    G["Pop nodo, agregar a orden"]
    H["Para cada VECINO: in_degree[VECINO]--"]
    I{"in_degree[VECINO]==0?"}
    J["Encolar VECINO"]

    A --> B --> C
    C -- "Sí" --> D
    D -- "No" --> E
    D -- "Sí" --> F
    C -- "No" --> G --> H --> I
    I -- "Sí" --> J --> C
    I -- "No" --> H

    style F fill:#90EE90
    style E fill:#FFB3B3
    style C fill:#87CEEB
    style D fill:#87CEEB
    style I fill:#87CEEB
    style G fill:#D3D3D3
```

### Ejemplo: 5 módulos con dependencias

```mermaid
flowchart LR
    subgraph DAG["Dependencias"]
        A["A"]
        B["B"]
        C["C"]
        D["D"]
        E["E"]
        A --> C
        B --> C
        C --> D
        B --> E
        D --> E
    end
    subgraph ORD["Orden Kahn"]
        O1["1. A in=0"]
        O2["2. B in=0"]
        O3["3. C in=2→0"]
        O4["4. D in=1→0"]
        O5["5. E in=2→0"]
    end

    DAG --> ORD

    style O1 fill:#90EE90
    style O2 fill:#90EE90
    style O5 fill:#90EE90
    style O3 fill:#87CEEB
    style O4 fill:#87CEEB
```

---

## 23 · Heap sift-up y sift-down

> El heap mantiene la propiedad restaurándola hacia arriba (inserción)
> o hacia abajo (extracción). Ambas operaciones son `O(log n)`.

### Plantilla sift-up (inserción)

```mermaid
flowchart TD
    A["Insertar VALOR al final\ni = len-1"]
    B{"i>0 Y\narr[padre(i)] > arr[i]?"}
    C["Heap restaurado"]
    D["Swap arr[padre] y arr[i]"]
    E["i = padre(i)"]

    A --> B
    B -- "No" --> C
    B -- "Sí" --> D --> E --> B

    style C fill:#90EE90
    style B fill:#87CEEB
    style D fill:#D3D3D3
```

### Plantilla sift-down (extracción)

```mermaid
flowchart TD
    A["Mover ultimo elemento a raiz\ni=0"]
    B{"Algun hijo menor\nque arr[i]?"}
    C["Heap restaurado"]
    D["menor = hijo mas pequeño"]
    E["Swap arr[i] y arr[menor]"]
    F["i = menor"]

    A --> B
    B -- "No" --> C
    B -- "Sí" --> D --> E --> F --> B

    style C fill:#90EE90
    style B fill:#87CEEB
    style D fill:#D3D3D3
    style E fill:#D3D3D3
```

### Ejemplo: insertar 2 en heap [1,3,5,7,4]

```mermaid
flowchart LR
    subgraph ANTES["Heap [1,3,5,7,4]"]
        R["1"]
        L["3"]
        RR["5"]
        LL["7"]
        LR["4"]
        R --> L & RR
        L --> LL & LR
    end
    subgraph PASO["Insertar 2 al final"]
        P1["[1,3,5,7,4,2]  i=5"]
        P2["padre(5)=2 → arr[2]=5>2 swap"]
        P3["[1,3,2,7,4,5]  i=2"]
        P4["padre(2)=0 → arr[0]=1<2 STOP"]
        P1 --> P2 --> P3 --> P4
    end
    subgraph DESPUES["Resultado [1,3,2,7,4,5]"]
        R2["1"]
        L2["3"]
        RR2["2"]
        LL2["7"]
        LR2["4"]
        RL2["5"]
        R2 --> L2 & RR2
        L2 --> LL2 & LR2
        RR2 --> RL2
    end

    ANTES --> PASO --> DESPUES

    style P4 fill:#90EE90
    style P2 fill:#D3D3D3
```

---

## 24 · Greedy Genérico

> En cada paso se toma la decisión localmente óptima sin reconsiderar.
> Funciona cuando se puede demostrar el "exchange argument".
> **Complejidad:** `O(n log n)` por el ordenamiento

### Plantilla

```mermaid
flowchart TD
    A["Ordenar por CRITERIO_GREEDY"]
    B["Inicializar solucion vacia"]
    C{"Quedan elementos?"}
    D["Retorna solucion"]
    E["Tomar MEJOR_ELEMENTO"]
    F{"Es valido?"}
    G["Agregar a solucion\nActualizar estado"]
    H["Descartar"]

    A --> B --> C
    C -- "No" --> D
    C -- "Sí" --> E --> F
    F -- "Sí" --> G --> C
    F -- "No" --> H --> C

    style D fill:#90EE90
    style G fill:#90EE90
    style F fill:#87CEEB
    style C fill:#87CEEB
    style H fill:#FFB3B3
```

### Ejemplo: actividades no solapadas

```mermaid
flowchart TD
    SORT["Ordenar por fin:\n[1,3],[2,4],[3,5],[0,6]"]
    T1["[1,3]: 1>=−inf → tomar\nfin=3 count=1"]
    T2["[2,4]: 2<3 → descartar"]
    T3["[3,5]: 3>=3 → tomar\nfin=5 count=2"]
    T4["[0,6]: 0<5 → descartar"]
    RES["Resultado: 2 actividades ✓"]

    SORT --> T1 --> T2 --> T3 --> T4 --> RES

    style T1 fill:#90EE90
    style T3 fill:#90EE90
    style T2 fill:#FFB3B3
    style T4 fill:#FFB3B3
    style RES fill:#90EE90
```

---

## 25 · Union-Find con Compresión

> Gestiona componentes conectados dinámicamente.
> Path compression + union by rank → `O(α(n)) ≈ O(1)` amortizado.

### Plantilla find (con path compression)

```mermaid
flowchart TD
    FA["find(x)"]
    FB{"padre[x] == x?"}
    FC["Retorna x (es raiz)"]
    FD["padre[x] = find(padre[x])"]
    FE["Retorna padre[x]"]

    FA --> FB
    FB -- "Sí" --> FC
    FB -- "No" --> FD --> FE

    style FC fill:#90EE90
    style FB fill:#87CEEB
    style FD fill:#D3D3D3
```

### Plantilla union (por rango)

```mermaid
flowchart TD
    UA["rx=find(x)  ry=find(y)"]
    UB{"rx == ry?"}
    UC["Ya unidos - ignorar"]
    UD{"rank[rx] > rank[ry]?"}
    UE["padre[ry] = rx"]
    UF["padre[rx] = ry\nsi igual rank: rank[ry]++"]

    UA --> UB
    UB -- "Sí" --> UC
    UB -- "No" --> UD
    UD -- "Sí" --> UE
    UD -- "No" --> UF

    style UC fill:#FFD580
    style UE fill:#D3D3D3
    style UF fill:#D3D3D3
    style UB fill:#87CEEB
    style UD fill:#87CEEB
```

### Ejemplo: union-find 5 nodos, find(3) con compresión

```mermaid
flowchart LR
    subgraph E0["Inicial"]
        N0["0"] 
        N1["1"] 
        N2["2"] 
        N3["3"] 
        N4["4"]
    end
    subgraph E1["union(0,1)\nunion(2,3)"]
        G1["0→1\n2→3"]
    end
    subgraph E2["union(0,2)"]
        G2["0\n├1\n└2\n  └3"]
    end
    subgraph E3["find(3) con compresión"]
        G3["0\n├1\n├2\n└3 (comprimido)"]
    end

    E0 --> E1 --> E2 --> E3

    style G3 fill:#90EE90
    style G2 fill:#87CEEB
```

---

## 26 · Trie Insertar y Buscar

> Árbol donde cada nodo es un carácter. Comparte prefijos.
> **Complejidad:** `O(m)` por operación, m = longitud de la palabra

### Plantilla insert

```mermaid
flowchart TD
    IA["nodo = raiz"]
    IB{"Quedan chars?"}
    IC["nodo.es_fin = True"]
    ID["c = siguiente char"]
    IE{"c en nodo.hijos?"}
    IF["Crear nodo.hijos[c]"]
    IG["nodo = nodo.hijos[c]\navanzar"]

    IA --> IB
    IB -- "No" --> IC
    IB -- "Sí" --> ID --> IE
    IE -- "No" --> IF --> IG --> IB
    IE -- "Sí" --> IG

    style IC fill:#90EE90
    style IB fill:#87CEEB
    style IE fill:#87CEEB
    style IF fill:#D3D3D3
```

### Plantilla search

```mermaid
flowchart TD
    SA["nodo = raiz"]
    SB{"Quedan chars?"}
    SC{"nodo.es_fin?"}
    SD["Retorna True"]
    SE["Retorna False"]
    SF["c = siguiente char"]
    SG{"c en nodo.hijos?"}
    SH["Retorna False"]
    SI["nodo = nodo.hijos[c]"]

    SA --> SB
    SB -- "No" --> SC
    SC -- "Sí" --> SD
    SC -- "No" --> SE
    SB -- "Sí" --> SF --> SG
    SG -- "No" --> SH
    SG -- "Sí" --> SI --> SB

    style SD fill:#90EE90
    style SE fill:#FFB3B3
    style SH fill:#FFB3B3
    style SB fill:#87CEEB
    style SG fill:#87CEEB
```

### Ejemplo: Trie con "can", "cat", "car"

```mermaid
flowchart TD
    ROOT["raiz"]
    C["c"]
    A["a"]
    N["n  is_end=True  can"]
    T["t  is_end=True  cat"]
    R["r  is_end=True  car"]

    ROOT --> C --> A
    A --> N & T & R

    style N fill:#90EE90
    style T fill:#90EE90
    style R fill:#90EE90
    style ROOT fill:#87CEEB
    style C fill:#FFFACD
    style A fill:#FFFACD
```

---

## 27 · KMP Tabla de Fallos y Búsqueda

> Precalcula `lps[]` (longest proper prefix = suffix) para no retroceder en texto.
> **Complejidad:** `O(n+m)` — n=texto, m=patrón

### Plantilla: construir lps

```mermaid
flowchart TD
    A["lps=[0]*len(p)\ni=1, len=0"]
    B{"i < len(p)?"}
    C["Retorna lps[]"]
    D{"p[i]==p[len]?"}
    E["len++\nlps[i]=len\ni++"]
    F{"len > 0?"}
    G["len=lps[len-1]"]
    H["lps[i]=0\ni++"]

    A --> B
    B -- "No" --> C
    B -- "Sí" --> D
    D -- "Sí" --> E --> B
    D -- "No" --> F
    F -- "Sí" --> G --> D
    F -- "No" --> H --> B

    style C fill:#90EE90
    style B fill:#87CEEB
    style D fill:#87CEEB
    style F fill:#87CEEB
    style E fill:#D3D3D3
    style G fill:#FFD580
```

### Ejemplo: lps para "AABAAB" → [0,1,0,1,2,3]

```mermaid
flowchart LR
    subgraph PAT["Patrón"]
        P0["A lps=0"]
        P1["A lps=1"]
        P2["B lps=0"]
        P3["A lps=1"]
        P4["A lps=2"]
        P5["B lps=3"]
        P0 --> P1 --> P2 --> P3 --> P4 --> P5
    end
    subgraph SIG["lps[5]=3 significa"]
        M["Prefijo 'AAB' = Sufijo 'AAB'\nno retroceder en texto al fallar aqui"]
    end
    PAT --> SIG

    style P5 fill:#90EE90
    style P1 fill:#FFD580
    style P4 fill:#FFD580
    style M fill:#D3D3D3
```

---

## 28 · Bitmask DP

> El estado incluye una máscara de bits representando un subconjunto visitado.
> `O(2^n · n)` en lugar de `O(n!)`.
> **Uso:** TSP, asignación óptima, cobertura con n ≤ 20

### Plantilla

```mermaid
flowchart TD
    A["dp[mask][i] = costo de llegar\nal estado mask terminando en i"]
    B["dp[1<<inicio][inicio] = 0\nresto = inf"]
    C["Para mask = 0 a 2^N - 1"]
    D["Para cada i con bit i en mask"]
    E{"dp[mask][i] != inf?"}
    F["Para cada j no en mask"]
    G["nuevo = mask OR 1<<j"]
    H["dp[nuevo][j] = min(dp[nuevo][j],\ndp[mask][i] + costo[i][j])"]
    I["Respuesta: min sobre i de\ndp[FULL][i] + costo[i][inicio]"]

    A --> B --> C --> D --> E
    E -- "Sí" --> F --> G --> H --> F
    E -- "No" --> D
    D -- "fin" --> C
    C -- "fin" --> I

    style B fill:#90EE90
    style I fill:#90EE90
    style C fill:#87CEEB
    style E fill:#87CEEB
    style H fill:#D3D3D3
```

### Ejemplo: TSP 4 ciudades — evolución de máscaras

```mermaid
flowchart LR
    subgraph MASKS["Desde ciudad 0 (mask=0001)"]
        M1["0001 → solo ciudad 0\ndp=0"]
        M2["0011 → ciudades 0,1\ndp=dist(0,1)"]
        M3["0101 → ciudades 0,2\ndp=dist(0,2)"]
        M4["0111 → ciudades 0,1,2\ndp=min(...)"]
        M5["1111 → todas\nregresar a 0"]
    end

    M1 --> M2 & M3
    M2 --> M4
    M3 --> M4
    M4 --> M5

    style M1 fill:#90EE90
    style M5 fill:#90EE90
    style M4 fill:#87CEEB
```

---

## Guía rápida de sintaxis Mermaid

```text
Tipos de diagrama:
  flowchart TD   → top-down (recursión, DFS)
  flowchart LR   → left-right (BFS, tablas, flujos)

Formas de nodos:
  A["texto"]     → rectángulo  (nodo normal)
  B{"texto"}     → rombo       (condición / decisión)
  C(["texto"])   → estadio     (inicio / fin)

Tipos de flecha:
  A --> B                 → normal
  A -- "etiqueta" --> B   → con etiqueta
  A -.-> B                → punteada

Colores:
  style A fill:#90EE90    → verde   (caso base / éxito)
  style A fill:#87CEEB    → azul    (activo / decisión)
  style A fill:#FFD580    → naranja (memo / cache hit)
  style A fill:#FFB3B3    → rojo    (podado / inválido)
  style A fill:#D3D3D3    → gris    (combinación / merge)
  style A fill:#DDA0DD    → violeta (visitado en grafo)
  style A fill:#FFFACD    → amarillo (en cola / pendiente)

Subgrafos:
  subgraph Nombre["Etiqueta"]
      A["nodo"]
  end
```

---

## Índice por capítulo

| Capítulo | Plantillas |
|---|---|
| Cap. 01 — Tipos de recursión | 1, 2, 3, 4, 5, 6, 7, 8 |
| Cap. 02 — Optimización recursiva | 6, 9, 10, 11 |
| Cap. 03 — Reducción de complejidad | 12, 13, 14, 15 |
| Cap. 04 — Grafos | 16, 17, 18, 19, 20, 21, 22 |
| Cap. 05 — Heap y Cola de Prioridad | 23 |
| Cap. 06 — Greedy | 24 |
| Cap. 09 — Union-Find | 25 |
| Cap. 10 — Trie | 26 |
| Cap. 12 — KMP / Rabin-Karp | 27 |
| Cap. 13 — Bit Manipulation | 28 |
| Cap. 16 — Programación Funcional | 29, 30, 31, 32, 33, 34, 35 |

---
---

## Plantillas de Programación Funcional — Cap. 16

> Estos patrones complementan las plantillas 1–28.
> Muestran cómo los mismos algoritmos se ven bajo la lente funcional.

---

## 29 · Pipeline map / filter / fold

> **Patrón:** transformar datos como una cadena de operaciones puras.
> Cada función toma un valor y retorna uno nuevo — sin efectos secundarios.
> **Equivalente imperativo:** bucles `for` anidados

### Plantilla

```mermaid
flowchart LR
    INPUT["Colección\noriginal"]

    subgraph PIPE["Pipeline funcional"]
        F["filter\nPRED(x) → bool"]
        M["map\nf(x) → y"]
        R["fold/reduce\nacc + x → acc"]
    end

    OUTPUT["Resultado\nfinal"]

    INPUT --> F --> M --> R --> OUTPUT

    style INPUT fill:#87CEEB
    style F fill:#FFFACD
    style M fill:#FFFACD
    style R fill:#D3D3D3
    style OUTPUT fill:#90EE90
```

### Ejemplo: suma de cuadrados de pares en [1..10]

```mermaid
flowchart LR
    A["[1,2,3,4,5\n6,7,8,9,10]"]
    B["filter par\n[2,4,6,8,10]"]
    C["map cuadrado\n[4,16,36,64,100]"]
    D["fold suma\n220"]

    A --> B --> C --> D

    style A fill:#87CEEB
    style B fill:#FFFACD
    style C fill:#FFFACD
    style D fill:#90EE90
```

---

## 30 · Recursión de Cola — Acumulador explícito

> **Patrón:** el estado viaja como parámetro `acc` hacia abajo.
> No hay operación pendiente al hacer la llamada → `O(1)` stack con TCO.
> **Diferencia con Plantilla 5:** aquí el acumulador puede ser complejo (lista, mapa, árbol)

### Plantilla

```mermaid
flowchart LR
    A["FUNCION(entrada, acc=INICIO)"]
    B{"entrada\nvacia?"}
    C["Retorna acc\n(resultado final)"]
    D["nuevo_acc =\nCOMBINA(acc, cabeza)"]
    E["FUNCION(cola, nuevo_acc)"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D --> E

    style C fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
    style D fill:#D3D3D3
```

### Ejemplo: revertir lista [1,2,3,4] con acumulador

```mermaid
flowchart LR
    S1["rev([1,2,3,4], [])"]
    S2["rev([2,3,4], [1])"]
    S3["rev([3,4], [2,1])"]
    S4["rev([4], [3,2,1])"]
    S5["rev([], [4,3,2,1])"]
    S6["Retorna [4,3,2,1] ✓"]

    S1 --> S2 --> S3 --> S4 --> S5 --> S6

    style S1 fill:#87CEEB
    style S2 fill:#87CEEB
    style S3 fill:#87CEEB
    style S4 fill:#87CEEB
    style S5 fill:#87CEEB
    style S6 fill:#90EE90
```

---

## 31 · DP como scanl — Bottom-Up funcional

> **Patrón:** `scanl` acumula estado y guarda todos los intermedios.
> Es el equivalente funcional de llenar la tabla DP de izquierda a derecha.
> **Resultado:** una lista de todos los estados intermedios, no solo el final

### Plantilla

```mermaid
flowchart LR
    subgraph SCAN["scanl f inicio lista"]
        ACC0["acc₀\n(inicio)"]
        ACC1["acc₁\n= f(acc₀, x₁)"]
        ACC2["acc₂\n= f(acc₁, x₂)"]
        ACCN["accₙ\n= f(accₙ₋₁, xₙ)"]
        ACC0 --> ACC1 --> ACC2 --> ACCN
    end

    OUT["[acc₀, acc₁, acc₂, ..., accₙ]\nTodos los estados DP"]
    SCAN --> Out

    style ACC0 fill:#90EE90
    style ACCN fill:#90EE90
    style ACC1 fill:#87CEEB
    style ACC2 fill:#87CEEB
```

### Ejemplo: prefix sums de [2,4,1,3,5] con scanl

```mermaid
flowchart LR
    S0["0\n(inicio)"]
    S1["0+2=2"]
    S2["2+4=6"]
    S3["6+1=7"]
    S4["7+3=10"]
    S5["10+5=15"]

    OUT["[0,2,6,7,10,15]\nTabla prefix sums ✓"]

    S0 --> S1 --> S2 --> S3 --> S4 --> S5 --> OUT

    style S0 fill:#90EE90
    style OUT fill:#90EE90
    style S1 fill:#87CEEB
    style S2 fill:#87CEEB
    style S3 fill:#87CEEB
    style S4 fill:#87CEEB
    style S5 fill:#87CEEB
```

---

## 32 · Memoización Lazy — @lru_cache

> **Patrón:** función recursiva + caché automático.
> La función no sabe que está siendo cacheada — es pura desde adentro.
> **Diferencia con Plantilla 6:** aquí el caché es externo (decorador), no explícito

### Plantilla

```mermaid
flowchart TD
    CALL["FUNCION(PARAM)"]
    CACHE{"PARAM\nen caché?"}
    HIT["Retorna cache[PARAM]\n⚡ O(1)"]
    BASE{"CASO_BASE?"}
    BVAL["Retorna VALOR_BASE"]
    REC["Llamadas recursivas\nFUNCION(sub-params)"]
    COMBINE["Combina resultados"]
    STORE["cache[PARAM] = resultado"]
    RET["Retorna resultado"]

    CALL --> CACHE
    CACHE -- "Sí" --> HIT
    CACHE -- "No" --> BASE
    BASE -- "Sí" --> BVAL
    BASE -- "No" --> REC --> COMBINE --> STORE --> RET

    style HIT fill:#FFD580
    style BVAL fill:#90EE90
    style CACHE fill:#87CEEB
    style BASE fill:#87CEEB
    style STORE fill:#D3D3D3
```

### Ejemplo: LCS("ABCB", "BDCAB") con @lru_cache

```mermaid
flowchart TD
    ROOT["lcs(0,0)"]
    A["lcs(1,1)"]
    B["lcs(1,2)"]
    C["lcs(2,2)"]
    D["lcs(2,3)"]
    HIT1["lcs(2,2) memo hit ⚡"]
    HIT2["lcs(1,2) memo hit ⚡"]
    BASE["lcs(4,x) o lcs(x,5) → 0"]

    ROOT --> A & B
    A --> C & D
    B --> HIT1
    C --> BASE
    D --> HIT2

    style BASE fill:#90EE90
    style HIT1 fill:#FFD580
    style HIT2 fill:#FFD580
    style ROOT fill:#87CEEB
    style A fill:#87CEEB
    style B fill:#87CEEB
```

---

## 33 · State Passing — Estado explícito en grafos

> **Patrón:** el estado mutable (visitados, distancias) se pasa y retorna
> explícitamente en lugar de modificarse in-place.
> **Trade-off:** más verboso pero completamente puro — sin efectos ocultos

### Plantilla

```mermaid
flowchart TD
    A["ALGO(grafo, nodo, ESTADO)"]
    B{"nodo en\nESTADO?"}
    C["Retorna\n(resultado_vacio, ESTADO)"]
    D["ESTADO2 = ESTADO + nodo"]
    E["procesar nodo"]
    F["Para cada VECINO"]
    G["ALGO(grafo, VECINO, ESTADO_actual)"]
    H["acumular resultado\nactualizar ESTADO_actual"]
    I["Retorna (resultado, ESTADO_final)"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D --> E --> F --> G --> H --> F
    F -- "fin vecinos" --> I

    style C fill:#90EE90
    style I fill:#90EE90
    style B fill:#87CEEB
    style G fill:#87CEEB
    style D fill:#D3D3D3
```

### Ejemplo: DFS funcional en grafo A-B-C-D

```mermaid
flowchart TD
    S1["dfs(A, visitados={})"]
    S2["dfs(B, visitados={A})"]
    S3["dfs(D, visitados={A,B})"]
    S4["dfs(D, visitados={A,B,D})\nD ya visitado → retorna"]
    S5["dfs(C, visitados={A,B,D})"]
    R1["([D], {A,B,D})"]
    R2["([B,D], {A,B,D})"]
    R3["([C], {A,B,C,D})"]
    FINAL["([A,B,D,C], {A,B,C,D}) ✓"]

    S1 --> S2 --> S3 --> R1 --> R2
    S2 --> S4
    S1 --> S5 --> R3
    R2 --> FINAL
    R3 --> FINAL

    style S4 fill:#FFB3B3
    style FINAL fill:#90EE90
    style R1 fill:#D3D3D3
    style R2 fill:#D3D3D3
    style R3 fill:#D3D3D3
```

---

## 34 · Estructura Persistente — Árbol compartido

> **Patrón:** al "modificar" una estructura, se crea una nueva versión
> que comparte los nodos no afectados con la versión anterior.
> **Costo:** `O(log n)` nodos nuevos por operación vs `O(1)` mutable

### Plantilla

```mermaid
flowchart TD
    subgraph V1["Versión 1 (original)"]
        R1["raíz_v1"]
        A1["A"]
        B1["B"]
        C1["C (modificar este)"]
        D1["D"]
        R1 --> A1 & B1
        A1 --> C1 & D1
    end

    subgraph V2["Versión 2 (nueva)"]
        R2["raíz_v2 (nuevo)"]
        A2["A' (nuevo)"]
        C2["C' (nuevo)"]
    end

    subgraph SHARED["Nodos compartidos"]
        B1
        D1
    end

    R2 --> A2 & B1
    A2 --> C2 & D1

    style R2 fill:#87CEEB
    style A2 fill:#87CEEB
    style C2 fill:#87CEEB
    style R1 fill:#DDA0DD
    style A1 fill:#DDA0DD
    style C1 fill:#DDA0DD
    style B1 fill:#90EE90
    style D1 fill:#90EE90
```

> Verde = nodos compartidos entre v1 y v2. Solo el camino raíz→C se recrea.

### Ejemplo: insertar 7 en BST persistente [5,3,8]

```mermaid
flowchart LR
    subgraph BST1["BST v1"]
        R1b["5"]
        L1["3"]
        RR1["8"]
        R1b --> L1 & RR1
    end

    subgraph BST2["BST v2 — insertar 7"]
        R2b["5' (nuevo)"]
        RR2["8' (nuevo)"]
        L7["7 (nuevo)"]
        R2b --> L1
        R2b --> RR2
        RR2 --> L7
    end

    NOTE["3 nodos compartidos: nodo 3\n3 nodos nuevos: 5' 8' 7"]

    BST1 --> BST2
    BST2 --> NOTE

    style R2b fill:#87CEEB
    style RR2 fill:#87CEEB
    style L7 fill:#87CEEB
    style L1 fill:#90EE90
    style NOTE fill:#D3D3D3
```

---

## 35 · Stream Lazy Infinito

> **Patrón:** secuencia que genera elementos bajo demanda, sin límite predefinido.
> Solo se calcula lo que el consumidor realmente pide.
> **Contraste:** un arreglo materializa todo de antemano

### Plantilla

```mermaid
flowchart TD
    GEN["GENERADOR\nestado_inicial"]
    REQ{"¿Consumidor\npide elemento?"}
    DONE["Fin del consumo"]
    CALC["Calcular siguiente\ndesde estado_actual"]
    EMIT["Emitir elemento\nal consumidor"]
    UPD["Actualizar\nestado_interno"]

    GEN --> REQ
    REQ -- "No" --> DONE
    REQ -- "Sí" --> CALC --> EMIT --> UPD --> REQ

    style DONE fill:#90EE90
    style GEN fill:#87CEEB
    style REQ fill:#87CEEB
    style EMIT fill:#D3D3D3
```

### Ejemplo: stream de Fibonacci — consumir solo los necesarios

```mermaid
flowchart LR
    subgraph GEN2["Generador fib(a=0, b=1)"]
        G1["yield 0\na=1,b=1"]
        G2["yield 1\na=1,b=2"]
        G3["yield 1\na=2,b=3"]
        G4["yield 2\na=3,b=5"]
        G5["yield 3\na=5,b=8"]
        GN["...infinito"]
        G1 --> G2 --> G3 --> G4 --> G5 --> GN
    end

    subgraph CONSUMER["Consumidor: tomar hasta >10"]
        C1["recibe 0 ✓"]
        C2["recibe 1 ✓"]
        C3["recibe 1 ✓"]
        C4["recibe 2 ✓"]
        C5["recibe 3 ✓"]
        C6["recibe 5 ✓"]
        C7["recibe 8 ✓"]
        C8["recibe 13 > 10\nSTOP"]
    end

    G1 --> C1
    G2 --> C2
    G3 --> C3
    G4 --> C4
    G5 --> C5
    GN --> C6 --> C7 --> C8

    style C8 fill:#90EE90
    style GN fill:#87CEEB
```

---

## Guía de elección: ¿PF o imperativo?

```mermaid
flowchart TD
    START["¿Qué tipo de algoritmo es?"]
    A{"¿Transforma\ndatos sin estado\npersistente?"}
    B["✅ PF natural\nmap/filter/fold/compose"]
    C{"¿Necesita mutar\nestructuras para\neficiencia O(1)?"}
    D["⚠️ PF posible\npero con trade-off\nde espacio O(log n)"]
    E["❌ Imperativo mejor\nUnion-Find, Heap,\nSorting in-place"]
    F{"¿El estado es\npequeño y puro?"}
    G["✅ State passing\nretornar nuevo estado"]
    H["⚠️ Mónada State\nHaskell / Scala"]

    START --> A
    A -- "Sí" --> B
    A -- "No" --> C
    C -- "No" --> D
    C -- "Sí" --> E
    D --> F
    F -- "Sí" --> G
    F -- "No" --> H

    style B fill:#90EE90
    style E fill:#FFB3B3
    style D fill:#FFD580
    style G fill:#90EE90
    style H fill:#FFD580
```

| Cap. 17 — Efectos, Pipelines y Arquitectura | 36, 37, 38, 39, 40 |

---
---

## Plantillas de Efectos y Pipelines — Cap. 17

---

## 36 · Result / Option — tipo que no miente

> **Patrón:** el éxito y el fallo son valores del tipo, no excepciones ocultas.
> El llamador no puede ignorar el error — el compilador o el tipo lo obliga.

### Plantilla Result

```mermaid
flowchart TD
    F["FUNCION(input)"]
    B{"¿Operación\nexitosa?"}
    OK["Retorna Ok(valor)"]
    ERR["Retorna Err(motivo)"]
    CALLER["Llamador hace\npattern matching"]
    HANDLE_OK["Usa valor"]
    HANDLE_ERR["Maneja error"]

    F --> B
    B -- "Sí" --> OK --> CALLER
    B -- "No" --> ERR --> CALLER
    CALLER --> HANDLE_OK
    CALLER --> HANDLE_ERR

    style OK fill:#90EE90
    style ERR fill:#FFB3B3
    style B fill:#87CEEB
    style CALLER fill:#D3D3D3
```

### Ejemplo: buscar() sin -1 ni None

```mermaid
flowchart LR
    A["buscar([1,2,3], 5)"]
    B{"5 en lista?"}
    OK["Ok(índice=1)"]
    ERR["Err('5 no encontrado')"]
    MATCH["match resultado:"]
    USE["print(f'en índice')"]
    FIX["print('no existe')"]

    A --> B
    B -- "Sí" --> OK --> MATCH
    B -- "No" --> ERR --> MATCH
    MATCH --> USE
    MATCH --> FIX

    style OK fill:#90EE90
    style ERR fill:#FFB3B3
    style MATCH fill:#D3D3D3
```

---

## 37 · Railway-Oriented Programming

> **Patrón:** funciones falibles encadenadas en dos rieles.
> El primer error cortocircuita el resto sin `if error: return error` repetido.

### Plantilla

```mermaid
flowchart LR
    IN["Input"]

    subgraph HAPPY["Riel feliz (Ok)"]
        F1["ETAPA_1\nOk → Ok"]
        F2["ETAPA_2\nOk → Ok"]
        F3["ETAPA_3\nOk → Ok"]
        OUT["Ok(resultado) ✓"]
        F1 --> F2 --> F3 --> OUT
    end

    subgraph ERROR["Riel error (Err)"]
        E1["Err se propaga\nsin ejecutar etapas"]
        EOUT["Err(motivo) ✗"]
        E1 --> EOUT
    end

    IN --> F1
    F1 -- "si falla" --> E1
    F2 -- "si falla" --> E1
    F3 -- "si falla" --> E1

    style OUT fill:#90EE90
    style EOUT fill:#FFB3B3
    style E1 fill:#FFB3B3
    style F1 fill:#FFFACD
    style F2 fill:#FFFACD
    style F3 fill:#FFFACD
```

### Ejemplo: pipeline validar → calcular → guardar

```mermaid
flowchart LR
    RAW["JSON crudo"]
    P["parsear()\nOk o Err"]
    V["validar()\nOk o Err"]
    C["calcular()\nOk o Err"]
    G["guardar()\nOk o Err"]
    OK["Ok(guardado) ✓"]
    ERR_P["Err('JSON inválido')"]
    ERR_V["Err('campos faltantes')"]
    ERR_G["Err('BD no disponible')"]

    RAW --> P
    P -- "Ok" --> V
    P -- "Err" --> ERR_P
    V -- "Ok" --> C
    V -- "Err" --> ERR_V
    C -- "Ok" --> G
    G -- "Ok" --> OK
    G -- "Err" --> ERR_G

    style OK fill:#90EE90
    style ERR_P fill:#FFB3B3
    style ERR_V fill:#FFB3B3
    style ERR_G fill:#FFB3B3
    style P fill:#FFFACD
    style V fill:#FFFACD
    style C fill:#FFFACD
    style G fill:#FFFACD
```

---

## 38 · async + Result — efectos asíncronos con manejo de errores

> **Patrón:** combina la asincronía (`await`) con el manejo explícito de errores (`Result`).
> Las operaciones lentas (BD, APIs) son async; el procesamiento puro es síncrono.

### Plantilla

```mermaid
flowchart TD
    START["async pipeline(input)"]
    FETCH["await FUENTE_DATOS()\nResult async"]
    CHECK1{"Ok?"}
    ERR1["Retorna Err\n(fallo fetch)"]
    PURE["ALGORITMO_PURO(datos)\nSíncrono — Cap.01-15"]
    SAVE["await GUARDAR(resultado)\nResult async"]
    CHECK2{"Ok?"}
    ERR2["Retorna Err\n(fallo guardar)"]
    DONE["Retorna Ok(resultado) ✓"]

    START --> FETCH --> CHECK1
    CHECK1 -- "No" --> ERR1
    CHECK1 -- "Sí" --> PURE --> SAVE --> CHECK2
    CHECK2 -- "No" --> ERR2
    CHECK2 -- "Sí" --> DONE

    style DONE fill:#90EE90
    style ERR1 fill:#FFB3B3
    style ERR2 fill:#FFB3B3
    style CHECK1 fill:#87CEEB
    style CHECK2 fill:#87CEEB
    style PURE fill:#D3D3D3
```

### Ejemplo: Dijkstra como servicio async

```mermaid
flowchart LR
    REQ["POST /ruta\n{grafo_id, origen, destino}"]
    CACHE{"En caché LRU?"}
    LOAD["await cargar_grafo(id)\n2-50ms"]
    DIJKSTRA["dijkstra(grafo, origen, destino)\nO((V+E)log V) — síncrono puro"]
    RESP["Ok({camino, costo}) ✓"]
    MISS["cache miss — cargar"]
    TIMEOUT["Err('timeout 5s')"]
    NPATH["Err('no hay camino')"]

    REQ --> CACHE
    CACHE -- "Sí" --> DIJKSTRA
    CACHE -- "No" --> MISS --> LOAD
    LOAD -- "timeout" --> TIMEOUT
    LOAD -- "Ok" --> DIJKSTRA
    DIJKSTRA -- "alcanzable" --> RESP
    DIJKSTRA -- "inalcanzable" --> NPATH

    style RESP fill:#90EE90
    style TIMEOUT fill:#FFB3B3
    style NPATH fill:#FFB3B3
    style CACHE fill:#FFD580
    style DIJKSTRA fill:#D3D3D3
```

---

## 39 · Fan-out / Fan-in — múltiples fuentes en paralelo

> **Patrón:** distribuir trabajo a `n` fuentes simultáneamente y combinar
> los resultados cuando llegan. Reduce latencia de O(suma) a O(máximo).

### Plantilla

```mermaid
flowchart TD
    INPUT["Input / Request"]

    subgraph FANOUT["Fan-out (paralelo)"]
        F1["await FUENTE_1()"]
        F2["await FUENTE_2()"]
        F3["await FUENTE_3()"]
    end

    GATHER["await gather(F1, F2, F3)"]

    subgraph FANIN["Fan-in (combinar)"]
        CHECK{"¿Todos Ok?"}
        COMBINE["combinar(r1, r2, r3)"]
        PARTIAL["degradar con\nresultados parciales"]
    end

    OUTPUT["Resultado final"]

    INPUT --> F1 & F2 & F3
    F1 & F2 & F3 --> GATHER --> CHECK
    CHECK -- "Sí" --> COMBINE --> OUTPUT
    CHECK -- "No (parcial)" --> PARTIAL --> OUTPUT

    style OUTPUT fill:#90EE90
    style COMBINE fill:#D3D3D3
    style PARTIAL fill:#FFD580
    style CHECK fill:#87CEEB
    style F1 fill:#FFFACD
    style F2 fill:#FFFACD
    style F3 fill:#FFFACD
```

### Ejemplo: grafo distribuido en 3 servicios

```mermaid
flowchart LR
    REQ["grafo_id=42"]

    subgraph PAR["Paralelo — ~50ms total"]
        SVC_A["await get_nodos(42)\nServicio A — 40ms"]
        SVC_B["await get_aristas(42)\nServicio B — 50ms"]
        SVC_C["await get_meta(42)\nServicio C — 20ms"]
    end

    MERGE["combinar(nodos, aristas, meta)"]
    GRAFO["Grafo completo ✓"]
    DEGRADED["Grafo sin aristas\n(B falló) ⚠️"]

    REQ --> SVC_A & SVC_B & SVC_C
    SVC_A --> MERGE
    SVC_B -- "Ok" --> MERGE
    SVC_B -- "Err" --> DEGRADED
    SVC_C --> MERGE
    MERGE --> GRAFO

    style GRAFO fill:#90EE90
    style DEGRADED fill:#FFD580
    style MERGE fill:#D3D3D3
```

---

## 40 · Arquitectura en capas — el mapa del sistema

> **Patrón:** separa los algoritmos puros de los efectos.
> El centro es testeable sin BD ni mocks. Los efectos viven solo en el borde.

### Plantilla

```mermaid
flowchart TD
    subgraph BORDE["Borde — Efectos (Cap.17)"]
        API["API / Entrada"]
        DB["BD / Servicios"]
        CACHE["Caché LRU"]
    end

    subgraph ORQUESTA["Orquestación (Cap.17 §4-6)"]
        ASYNC["async/await\nResult/ROP"]
        FANOUT["Fan-out/Fan-in\nCircuit Breaker"]
    end

    subgraph NUCLEO["Núcleo puro (Cap.01-16)"]
        ALG1["Algoritmos de grafos\nCap.04"]
        ALG2["Estructuras de datos\nCap.05,09,10"]
        ALG3["DP, Greedy\nCap.02,06"]
    end

    API --> ASYNC
    ASYNC --> FANOUT
    FANOUT --> ALG1 & ALG2 & ALG3
    ALG1 & ALG2 & ALG3 --> FANOUT
    FANOUT --> DB & CACHE

    style NUCLEO fill:#90EE90
    style ORQUESTA fill:#FFFACD
    style BORDE fill:#87CEEB
```

### Ejemplo: solicitud completa de análisis de grafo

```mermaid
flowchart TD
    HTTP["POST /analizar\n{grafo_id: 42}"]

    subgraph EFF["Efectos"]
        FETCH["await cargar_grafo(42)"]
        CACHEQ{"En caché?"}
        SAVE["await guardar(resultado)"]
    end

    subgraph PURE["Núcleo puro"]
        BUILD["construir_grafo(datos)"]
        CYCLES["detectar_ciclos(grafo)"]
        DIJK["dijkstra(grafo, todos)"]
        RANK["calcular_centralidad()"]
    end

    RESULT["Ok(Analisis completo) ✓"]

    HTTP --> CACHEQ
    CACHEQ -- "No" --> FETCH --> BUILD
    CACHEQ -- "Sí" --> RESULT
    BUILD --> CYCLES --> DIJK --> RANK
    RANK --> SAVE --> RESULT

    style RESULT fill:#90EE90
    style PURE fill:#D3D3D3
    style CACHEQ fill:#FFD580
```

| Cap. 18 — Estructuras Probabilísticas | 41, 42, 43 |
| Cap. 19 — Modelo de Memoria y Caché | 44, 45, 46 |

---
---

## Plantillas de Estructuras Probabilísticas — Cap. 18

---

## 41 · Bloom Filter — insertar y consultar

> **Patrón:** `k` funciones de hash mapean cada elemento a `k` bits.
> Insertar = poner bits en 1. Consultar = verificar si los `k` bits son 1.
> Sin falsos negativos. Posibles falsos positivos controlados por `p`.

### Plantilla

```mermaid
flowchart TD
    subgraph ADD["add(elemento)"]
        A1["Calcular k posiciones\nhash_1..k(elemento) mod m"]
        A2["Poner bit en 1\npara cada posición"]
        A1 --> A2
    end

    subgraph QUERY["contains(elemento)"]
        Q1["Calcular k posiciones\nhash_1..k(elemento) mod m"]
        Q2{"¿Todos los\nk bits son 1?"}
        Q3["Retorna False\n(definitivamente no está)"]
        Q4["Retorna True\n(probablemente está)"]
        Q1 --> Q2
        Q2 -- "No" --> Q3
        Q2 -- "Sí" --> Q4
    end

    style Q3 fill:#90EE90
    style Q4 fill:#FFD580
    style Q2 fill:#87CEEB
    style A2 fill:#D3D3D3
```

### Ejemplo: Bloom Filter m=10 bits, k=3

```mermaid
flowchart LR
    subgraph BITS["Arreglo de 10 bits"]
        B0["0"]
        B1["1"]
        B2["0"]
        B3["1"]
        B4["0"]
        B5["0"]
        B6["1"]
        B7["0"]
        B8["0"]
        B9["0"]
    end

    subgraph OP["add('hola'): hash1=1, hash2=3, hash3=6"]
        H["Bits 1,3,6 → 1"]
    end

    subgraph CHK["contains('mundo'): hash1=1, hash2=5, hash3=6"]
        C["Bit 5 = 0 → False ✓ (no está)"]
    end

    OP --> BITS
    BITS --> CHK

    style B1 fill:#87CEEB
    style B3 fill:#87CEEB
    style B6 fill:#87CEEB
    style C fill:#90EE90
    style H fill:#D3D3D3
```

---

## 42 · HyperLogLog — contar únicos

> **Patrón:** el máximo de ceros iniciales en el hash de los elementos
> estima `log2(n_únicos)`. `m` buckets reducen la varianza.

### Plantilla

```mermaid
flowchart TD
    subgraph ADD2["add(elemento)"]
        H1["h = hash(elemento)"]
        H2["bucket = primeros b bits de h"]
        H3["ceros = ceros iniciales del resto"]
        H4["registros[bucket] = max(registros[bucket], ceros)"]
        H1 --> H2 --> H3 --> H4
    end

    subgraph COUNT["count()"]
        C1["Z = Σ 2^(-registros[i])"]
        C2["estimacion = α * m² / Z"]
        C3["Aplicar correcciones\npequeño/grande rango"]
        C4["Retorna estimacion ±2%"]
        C1 --> C2 --> C3 --> C4
    end

    style C4 fill:#90EE90
    style H4 fill:#D3D3D3
    style C2 fill:#87CEEB
```

### Ejemplo: estimación con m=4 buckets

```mermaid
flowchart LR
    subgraph REGS["Registros tras insertar 1000 elementos"]
        R0["bucket 0\nmax_ceros = 8"]
        R1["bucket 1\nmax_ceros = 7"]
        R2["bucket 2\nmax_ceros = 9"]
        R3["bucket 3\nmax_ceros = 8"]
    end

    subgraph CALC["Cálculo"]
        Z["Z = 2^-8 + 2^-7 + 2^-9 + 2^-8"]
        EST["estimacion = 0.697 * 16 / Z ≈ 980"]
        ERR["Error: 2% — dentro del ±1.04/√4 = ±52%\n(m=4 es solo ilustrativo — en práctica m≥64)"]
        Z --> EST --> ERR
    end

    REGS --> CALC

    style EST fill:#90EE90
    style ERR fill:#FFD580
```

---

## 43 · Count-Min Sketch — contar frecuencias

> **Patrón:** matriz `d × w` de contadores. Insertar incrementa
> `d` posiciones. Consultar retorna el **mínimo** de las `d` posiciones.
> Nunca subestima. Sobreestimación acotada por `ε * N`.

### Plantilla

```mermaid
flowchart TD
    subgraph ADD3["add(elemento, count=1)"]
        A3["Para cada fila i de 0..d-1:"]
        A4["CMS[i][hash_i(elem) % w] += count"]
        A3 --> A4
    end

    subgraph QUERY3["query(elemento)"]
        Q5["Para cada fila i de 0..d-1:"]
        Q6["Lee CMS[i][hash_i(elem) % w]"]
        Q7["Retorna min de los d valores\n(mínimo = mejor estimación)"]
        Q5 --> Q6 --> Q7
    end

    style Q7 fill:#90EE90
    style A4 fill:#D3D3D3
    style Q6 fill:#87CEEB
```

### Ejemplo: CMS d=3 filas, w=5 columnas

```mermaid
flowchart LR
    subgraph MATRIX["Matriz CMS (tras insertar 'gato' x3, 'perro' x5)"]
        F0["Fila 0: [0, 3, 5, 0, 0]"]
        F1["Fila 1: [5, 0, 0, 3, 0]"]
        F2["Fila 2: [0, 0, 3, 5, 0]"]
    end

    subgraph Q8["query('gato') — hash posiciones: 1, 3, 2"]
        V1["Fila 0 pos 1: 3"]
        V2["Fila 1 pos 3: 3"]
        V3["Fila 2 pos 2: 3"]
        MINV["min(3,3,3) = 3 ✓"]
        V1 & V2 & V3 --> MINV
    end

    MATRIX --> Q8

    style MINV fill:#90EE90
    style F0 fill:#FFFACD
    style F1 fill:#FFFACD
    style F2 fill:#FFFACD
```

---

## Plantillas de Caché y Memoria — Cap. 19

---

## 44 · Jerarquía de memoria — costo real de accesos

> **Patrón:** no todos los accesos cuestan igual.
> El costo determina si un algoritmo es rápido o lento en práctica.

### Plantilla de decisión

```mermaid
flowchart TD
    ACCESS["Acceder a dato X"]
    L1{"¿X en L1\ncaché?"}
    L2{"¿X en L2\ncaché?"}
    L3{"¿X en L3\ncaché?"}
    RAM{"¿X en RAM?"}
    DISK["Acceso a disco\n~100,000 ns"]
    HIT_L1["~1 ns ✅"]
    HIT_L2["~4 ns ✅"]
    HIT_L3["~20 ns ⚠️"]
    HIT_RAM["~100 ns ⚠️"]

    ACCESS --> L1
    L1 -- "Sí" --> HIT_L1
    L1 -- "No" --> L2
    L2 -- "Sí" --> HIT_L2
    L2 -- "No" --> L3
    L3 -- "Sí" --> HIT_L3
    L3 -- "No" --> RAM
    RAM -- "Sí" --> HIT_RAM
    RAM -- "No" --> DISK

    style HIT_L1 fill:#90EE90
    style HIT_L2 fill:#90EE90
    style HIT_L3 fill:#FFD580
    style HIT_RAM fill:#FFD580
    style DISK fill:#FFB3B3
```

---

## 45 · Cache-friendly vs Cache-hostile

> **Patrón:** accesos secuenciales → prefetcher puede predecir → rápido.
> Accesos aleatorios (punteros) → cache miss en cada acceso → lento.

### Plantilla comparativa

```mermaid
flowchart LR
    subgraph FRIENDLY["Cache-FRIENDLY"]
        CF1["Arreglo\nsecuencial"]
        CF2["Prefetcher\ncarga adelante"]
        CF3["~1 ns\npor acceso"]
        CF1 --> CF2 --> CF3
    end

    subgraph HOSTILE["Cache-HOSTILE"]
        CH1["Punteros\ndispersos"]
        CH2["Cache miss\ncada salto"]
        CH3["~100 ns\npor acceso"]
        CH1 --> CH2 --> CH3
    end

    style CF3 fill:#90EE90
    style CH3 fill:#FFB3B3
    style CF2 fill:#D3D3D3
    style CH2 fill:#FFD580
```

### Ejemplo: Merge Sort vs Heap Sort

```mermaid
flowchart TD
    subgraph MS["Merge Sort — cache friendly"]
        MS1["Subarreglos contiguos"]
        MS2["Acceso secuencial L→R"]
        MS3["Prefetcher activo"]
        MS4["~0.8s para n=10^7"]
        MS1 --> MS2 --> MS3 --> MS4
    end

    subgraph HS["Heap Sort — cache hostile"]
        HS1["sift-down salta\na posición 2i+1"]
        HS2["Para i grande:\nsalto de n/2"]
        HS3["Cache miss frecuente"]
        HS4["~2.1s para n=10^7"]
        HS1 --> HS2 --> HS3 --> HS4
    end

    style MS4 fill:#90EE90
    style HS4 fill:#FFB3B3
    style MS3 fill:#D3D3D3
    style HS3 fill:#FFD580
```

---

## 46 · Medir antes de optimizar — metodología

> **Patrón:** baseline → profiler → cuello de botella → optimizar → medir.
> Sin baseline no sabes si mejoraste. Sin profiler optimizas lo que no importa.

### Plantilla

```mermaid
flowchart TD
    A["1. Código correcto\n(tests pasan)"]
    B["2. Baseline medible\n(tiempo, memoria)"]
    C["3. Profiler bajo carga real\n(n realista, no n=100)"]
    D["Cuello de botella identificado"]
    E{"¿Es el algoritmo\no la localidad?"}
    F["Cambiar algoritmo\n(Cap.01-18)"]
    G["Mejorar localidad\n(Cap.19)"]
    H["Medir de nuevo"]
    I{"¿Mejora\nsuficiente?"}
    J["Listo ✓"]

    A --> B --> C --> D --> E
    E -- "Algoritmo" --> F --> H
    E -- "Localidad" --> G --> H
    H --> I
    I -- "No" --> C
    I -- "Sí" --> J

    style J fill:#90EE90
    style D fill:#87CEEB
    style E fill:#87CEEB
    style I fill:#87CEEB
    style F fill:#FFFACD
    style G fill:#FFFACD
```

