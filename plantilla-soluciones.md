# Plantillas de Diagramas — Soluciones con Mermaid

> **Cómo usar este archivo:**
> 1. Identifica el patrón de tu algoritmo en la tabla de contenidos
> 2. Copia el bloque `:::plantilla` correspondiente
> 3. Reemplaza los textos en `MAYÚSCULAS` con los valores de tu algoritmo
> 4. El ejemplo concreto debajo de cada plantilla te muestra cómo quedó llenado

---

## Tabla de contenidos

| # | Patrón | Forma visual |
|---|---|---|
| 1 | [Recursión Lineal](#1--recursión-lineal) | Cadena vertical |
| 2 | [Recursión con Múltiples Llamadas](#2--recursión-con-múltiples-llamadas) | Árbol n-ario |
| 3 | [Divide y Vencerás](#3--divide-y-vencerás) | Árbol con fase de merge |
| 4 | [DP con Memoización](#4--dp-con-memoización-top-down) | Árbol con nodos cacheados |
| 5 | [BFS por Niveles](#5--bfs-por-niveles) | Grafo por capas horizontales |
| 6 | [DFS y Backtracking](#6--dfs-y-backtracking) | Árbol con ramas podadas |
| 7 | [Algoritmo Greedy / Iterativo](#7--algoritmo-greedy--iterativo) | Flujo lineal con decisión |

---

## Convenciones de color

```
Verde  (#90EE90) → Caso base / condición de parada
Azul   (#87CEEB) → Llamada recursiva / nodo en proceso
Naranja(#FFD580) → Resultado cacheado (memo hit)
Rojo   (#FFB3B3) → Rama podada (backtracking)
Gris   (#D3D3D3) → Nodo auxiliar / combinación / merge
```

---

## 1 · Recursión Lineal

> **Cuándo usarla:** la función se llama a sí misma exactamente una vez por nivel.
> Complejidad típica: `O(n)` tiempo, `O(n)` espacio en el call stack.

### Plantilla vacía

```mermaid
flowchart TD
    A["NOMBRE_FUNCION(PARAM)"]
    B{"¿CONDICION_BASE?"}
    C["Retorna VALOR_BASE"]
    D["OPERACION_CON_PARAM"]
    E["NOMBRE_FUNCION(PARAM - 1)"]
    F["Combina: RESULTADO + LLAMADA_RECURSIVA"]

    A --> B
    B -- "Sí (caso base)" --> C
    B -- "No" --> D
    D --> E
    E --> F

    style C fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
```

### Ejemplo concreto: `factorial(n)`

```mermaid
flowchart TD
    A["factorial(4)"]
    B{"¿n == 0?"}
    C["Retorna 1"]
    D["n = 4"]
    E["factorial(3)"]
    F["4 × factorial(3) = 4 × 6 = 24"]

    G["factorial(3) → 3 × factorial(2) = 6"]
    H["factorial(2) → 2 × factorial(1) = 2"]
    I["factorial(1) → 1 × factorial(0) = 1"]
    J["factorial(0) → 1 ✓"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D --> E
    E --> F
    E --> G --> H --> I --> J

    style C fill:#90EE90
    style J fill:#90EE90
    style B fill:#87CEEB
    style E fill:#87CEEB
```

---

## 2 · Recursión con Múltiples Llamadas

> **Cuándo usarla:** la función genera 2 o más llamadas recursivas por nivel.
> Complejidad típica: `O(2^n)` sin memo, árbol de altura `n`.

### Plantilla vacía

```mermaid
flowchart TD
    A["NOMBRE_FUNCION(PARAM)"]
    B{"¿CONDICION_BASE?"}
    C["Retorna VALOR_BASE"]
    D["NOMBRE_FUNCION(PARAM - 1)"]
    E["NOMBRE_FUNCION(PARAM - 2)"]
    F["Combina: LLAMADA_1 OP LLAMADA_2"]

    A --> B
    B -- "Sí (caso base)" --> C
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

### Ejemplo concreto: `fibonacci(5)`

```mermaid
flowchart TD
    F5["fib(5)"]
    F4["fib(4)"]
    F3a["fib(3)"]
    F3b["fib(3)"]
    F2a["fib(2)"]
    F2b["fib(2)"]
    F2c["fib(2)"]
    F1a["fib(1) → 1"]
    F1b["fib(1) → 1"]
    F1c["fib(1) → 1"]
    F1d["fib(1) → 1"]
    F0a["fib(0) → 0"]
    F0b["fib(0) → 0"]
    F0c["fib(0) → 0"]

    F5 --> F4
    F5 --> F3a
    F4 --> F3b
    F4 --> F2a
    F3a --> F2b
    F3a --> F1a
    F3b --> F2c
    F3b --> F1b
    F2a --> F1c
    F2a --> F0a
    F2b --> F1d
    F2b --> F0b
    F2c --> F0c

    style F1a fill:#90EE90
    style F1b fill:#90EE90
    style F1c fill:#90EE90
    style F1d fill:#90EE90
    style F0a fill:#90EE90
    style F0b fill:#90EE90
    style F0c fill:#90EE90
```

> 💡 Observa los nodos repetidos: `fib(3)` aparece 2 veces, `fib(2)` aparece 3 veces.
> Esto motiva la memoización (Plantilla 4).

---

## 3 · Divide y Vencerás

> **Cuándo usarla:** el problema se parte en subproblemas independientes,
> se resuelven por separado y se combinan. Complejidad típica: `O(n log n)`.

### Plantilla vacía

```mermaid
flowchart TD
    A["NOMBRE_FUNCION(arr, INICIO, FIN)"]
    B{"¿INICIO == FIN?\n(caso base)"}
    C["Retorna arr[INICIO]"]
    D["MID = (INICIO + FIN) / 2"]
    E["NOMBRE_FUNCION(arr, INICIO, MID)\nMitad izquierda"]
    F["NOMBRE_FUNCION(arr, MID+1, FIN)\nMitad derecha"]
    G["COMBINAR / MERGE\nresultado_izq + resultado_der"]
    H["Retorna RESULTADO_COMBINADO"]

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

### Ejemplo concreto: `merge_sort([3, 1, 4, 1, 5])`

```mermaid
flowchart TD
    A["merge_sort([3,1,4,1,5])"]
    B["merge_sort([3,1,4])"]
    C["merge_sort([1,5])"]
    D["merge_sort([3,1])"]
    E["merge_sort([4])"]
    F["merge_sort([1])"]
    G["merge_sort([5])"]
    H["merge_sort([3])"]
    I["merge_sort([1])"]

    M1["merge([3],[1]) → [1,3]"]
    M2["merge([1,3],[4]) → [1,3,4]"]
    M3["merge([1],[5]) → [1,5]"]
    M4["merge([1,3,4],[1,5]) → [1,1,3,4,5] ✓"]

    A --> B
    A --> C
    B --> D
    B --> E
    C --> F
    C --> G
    D --> H
    D --> I
    H --> M1
    I --> M1
    M1 --> M2
    E --> M2
    M2 --> M4
    F --> M3
    G --> M3
    M3 --> M4

    style H fill:#90EE90
    style I fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style M1 fill:#D3D3D3
    style M2 fill:#D3D3D3
    style M3 fill:#D3D3D3
    style M4 fill:#D3D3D3
```

---

## 4 · DP con Memoización (Top-Down)

> **Cuándo usarla:** igual que Plantilla 2 (múltiples llamadas) pero con
> subproblemas **solapados**. Los nodos cacheados se marcan en naranja.

### Plantilla vacía

```mermaid
flowchart TD
    A["NOMBRE_FUNCION(PARAM)"]
    B{"¿PARAM en memo?"}
    C["Retorna memo[PARAM]\n(cache hit)"]
    D{"¿CONDICION_BASE?"}
    E["Retorna VALOR_BASE"]
    F["NOMBRE_FUNCION(PARAM - 1)"]
    G["NOMBRE_FUNCION(PARAM - 2)"]
    H["resultado = LLAMADA_1 OP LLAMADA_2"]
    I["memo[PARAM] = resultado"]
    J["Retorna resultado"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D -- "Sí (caso base)" --> E
    D -- "No" --> F
    D -- "No" --> G
    F --> H
    G --> H
    H --> I
    I --> J

    style C fill:#FFD580
    style E fill:#90EE90
    style B fill:#87CEEB
    style F fill:#87CEEB
    style G fill:#87CEEB
    style I fill:#D3D3D3
```

### Ejemplo concreto: `fib_memo(5)` — comparar con Plantilla 2

```mermaid
flowchart TD
    F5["fib(5)"]
    F4["fib(4)"]
    F3["fib(3)"]
    F3c["fib(3) → memo hit ⚡"]
    F2["fib(2)"]
    F2c["fib(2) → memo hit ⚡"]
    F1a["fib(1) → 1"]
    F1b["fib(1) → 1"]
    F0a["fib(0) → 0"]
    F0b["fib(0) → 0"]

    F5 --> F4
    F5 --> F3c
    F4 --> F3
    F4 --> F2c
    F3 --> F2
    F3 --> F1a
    F2 --> F1b
    F2 --> F0a
    F3c --> |"ya calculado"| F3c
    F2c --> |"ya calculado"| F2c

    style F1a fill:#90EE90
    style F1b fill:#90EE90
    style F0a fill:#90EE90
    style F0b fill:#90EE90
    style F3c fill:#FFD580
    style F2c fill:#FFD580
```

> 💡 De 13 nodos (Plantilla 2) a 7 nodos. Cada subproblema se calcula **una sola vez**.

---

## 5 · BFS por Niveles

> **Cuándo usarla:** exploración de grafos nivel por nivel, camino más corto
> en grafos no ponderados. Complejidad: `O(V + E)`.

### Plantilla vacía

```mermaid
flowchart LR
    subgraph Nivel_0["Nivel 0 — Inicio"]
        START["NODO_INICIO\ndist=0"]
    end

    subgraph Nivel_1["Nivel 1"]
        N1A["VECINO_A\ndist=1"]
        N1B["VECINO_B\ndist=1"]
    end

    subgraph Nivel_2["Nivel 2"]
        N2A["VECINO_C\ndist=2"]
        N2B["VECINO_D\ndist=2"]
        N2C["VECINO_E\ndist=2"]
    end

    subgraph Nivel_3["Nivel 3 — Destino"]
        END["NODO_DESTINO\ndist=3"]
    end

    START --> N1A
    START --> N1B
    N1A --> N2A
    N1A --> N2B
    N1B --> N2C
    N2A --> END

    style START fill:#87CEEB
    style END fill:#90EE90
    style N1A fill:#87CEEB
    style N1B fill:#87CEEB
    style N2A fill:#87CEEB
    style N2B fill:#87CEEB
    style N2C fill:#87CEEB
```

### Ejemplo concreto: BFS desde `A` hasta `F`

```mermaid
flowchart LR
    subgraph Cola_0["Cola inicial"]
        A["A · dist=0"]
    end

    subgraph Cola_1["Procesar A → encolar vecinos"]
        B["B · dist=1"]
        C["C · dist=1"]
    end

    subgraph Cola_2["Procesar B,C → encolar vecinos"]
        D["D · dist=2"]
        E["E · dist=2"]
    end

    subgraph Cola_3["Procesar D,E → encontrar F"]
        F["F · dist=3 ✓"]
    end

    A --> B
    A --> C
    B --> D
    B --> E
    C --> E
    D --> F
    E --> F

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#87CEEB
    style F fill:#90EE90
```

---

## 6 · DFS y Backtracking

> **Cuándo usarla:** exploración exhaustiva con poda. Las ramas que violan
> restricciones se cortan antes de explorar. Complejidad: `O(b^d)` en peor caso.

### Plantilla vacía

```mermaid
flowchart TD
    A["NOMBRE_FUNCION(estado, OPCIONES)"]
    B{"¿CONDICION_EXITO?"}
    C["✓ Solución encontrada\nRetornar / Guardar"]
    D{"¿CONDICION_PODA?\n(restricción violada)"}
    E["✗ Podar esta rama\nRetornar"]
    F["Para cada OPCION en OPCIONES"]
    G["Aplicar OPCION al estado"]
    H["NOMBRE_FUNCION(nuevo_estado, OPCIONES_RESTANTES)"]
    I["Deshacer OPCION\n(backtrack)"]

    A --> B
    B -- "Sí" --> C
    B -- "No" --> D
    D -- "Sí" --> E
    D -- "No" --> F
    F --> G
    G --> H
    H --> I
    I --> F

    style C fill:#90EE90
    style E fill:#FFB3B3
    style B fill:#87CEEB
    style D fill:#87CEEB
    style H fill:#87CEEB
    style I fill:#D3D3D3
```

### Ejemplo concreto: N-Reinas con `n=4`, columna 1

```mermaid
flowchart TD
    ROOT["Colocar reina en fila 1"]

    C1["Col 1 ✗\n(conflicto diagonal)"]
    C2["Col 2 ✓\nfila 1 → col 2"]
    C3["Col 3 ✓\nfila 1 → col 3"]
    C4["Col 4 ✗\n(conflicto diagonal)"]

    C2F2A["Fila 2, Col 1 ✗"]
    C2F2B["Fila 2, Col 2 ✗\n(misma col)"]
    C2F2C["Fila 2, Col 3 ✗\n(diagonal)"]
    C2F2D["Fila 2, Col 4 ✓"]

    C2F3A["Fila 3, Col 1 ✓"]
    C2F3B["Fila 3, Col 2 ✗"]
    C2F3C["Fila 3, Col 3 ✗"]
    C2F3D["Fila 3, Col 4 ✗"]

    C2F4["Fila 4 → ninguna col válida\n↩ backtrack"]

    SOL["Fila 4, Col 3 ✓\n[2,4,1,3] 🎉"]

    ROOT --> C1
    ROOT --> C2
    ROOT --> C3
    ROOT --> C4
    C2 --> C2F2A
    C2 --> C2F2B
    C2 --> C2F2C
    C2 --> C2F2D
    C2F2D --> C2F3A
    C2F2D --> C2F3B
    C2F2D --> C2F3C
    C2F2D --> C2F3D
    C2F3A --> C2F4
    C2F4 --> SOL

    style C1 fill:#FFB3B3
    style C4 fill:#FFB3B3
    style C2F2A fill:#FFB3B3
    style C2F2B fill:#FFB3B3
    style C2F2C fill:#FFB3B3
    style C2F3B fill:#FFB3B3
    style C2F3C fill:#FFB3B3
    style C2F3D fill:#FFB3B3
    style C2F4 fill:#FFB3B3
    style SOL fill:#90EE90
    style C2F2D fill:#87CEEB
    style C2F3A fill:#87CEEB
```

---

## 7 · Algoritmo Greedy / Iterativo

> **Cuándo usarla:** el algoritmo avanza paso a paso tomando la decisión localmente
> óptima sin retroceder. También sirve para algoritmos iterativos con condición de avance.

### Plantilla vacía

```mermaid
flowchart TD
    A["Inicializar: ESTADO_INICIAL"]
    B["ORDENAR / PREPARAR entrada\nsegún CRITERIO_GREEDY"]
    C{"¿Quedan elementos\npor procesar?"}
    D["Tomar el MEJOR_ELEMENTO\nsegún CRITERIO"]
    E{"¿ELEMENTO cumple\nla RESTRICCION?"}
    F["✓ Incluir ELEMENTO\nen la solución\nActualizar ESTADO"]
    G["✗ Descartar ELEMENTO"]
    H["Retorna SOLUCION_FINAL"]

    A --> B
    B --> C
    C -- "No" --> H
    C -- "Sí" --> D
    D --> E
    E -- "Sí" --> F
    E -- "No" --> G
    F --> C
    G --> C

    style A fill:#D3D3D3
    style F fill:#90EE90
    style G fill:#FFB3B3
    style H fill:#90EE90
    style E fill:#87CEEB
    style C fill:#87CEEB
```

### Ejemplo concreto: Intervalos no solapados

```mermaid
flowchart TD
    A["Intervalos: [1,3],[2,4],[3,5],[0,6]"]
    B["Ordenar por FIN:\n[1,3],[2,4],[3,5],[0,6]"]
    C{"¿Quedan intervalos?"}

    P1["[1,3]: inicio 1 >= -∞"]
    OK1["✓ Tomar [1,3]\nfin_ultimo = 3\ncount = 1"]

    P2["[2,4]: inicio 2 < 3"]
    NO2["✗ Solapamiento\nDescartar [2,4]"]

    P3["[3,5]: inicio 3 >= 3"]
    OK3["✓ Tomar [3,5]\nfin_ultimo = 5\ncount = 2"]

    P4["[0,6]: inicio 0 < 5"]
    NO4["✗ Solapamiento\nDescartar [0,6]"]

    R["Resultado: 2 intervalos máximo ✓"]

    A --> B --> C
    C --> P1 --> OK1 --> P2 --> NO2 --> P3 --> OK3 --> P4 --> NO4
    NO4 --> R

    style OK1 fill:#90EE90
    style OK3 fill:#90EE90
    style NO2 fill:#FFB3B3
    style NO4 fill:#FFB3B3
    style R fill:#90EE90
    style C fill:#87CEEB
```

---

## Guía rápida de sintaxis Mermaid

```markdown
<!-- Tipos de diagrama más útiles para algoritmos -->

flowchart TD   ← top-down (árbol de recursión)
flowchart LR   ← left-right (BFS por niveles, flujos)

<!-- Formas de nodos -->
A["texto"]         ← rectángulo (nodo normal)
B{"texto"}         ← rombo (decisión / condición)
C(["texto"])       ← estadio (inicio/fin)
D[/"texto"/]       ← paralelogramo (entrada/salida)

<!-- Tipos de flecha -->
A --> B            ← flecha normal
A -- "etiqueta" --> B   ← flecha con etiqueta
A -.-> B           ← flecha punteada

<!-- Colores (style) -->
style A fill:#90EE90    ← verde (caso base)
style A fill:#87CEEB    ← azul (recursión activa)
style A fill:#FFD580    ← naranja (cache hit)
style A fill:#FFB3B3    ← rojo (poda)
style A fill:#D3D3D3    ← gris (combinación)

<!-- Subgrafos (para BFS por niveles) -->
subgraph Nombre["Etiqueta visible"]
    A["nodo"]
end
```

---

## Cómo crear tu propia solución

1. **Identifica el patrón** usando la tabla del inicio
2. **Copia la plantilla vacía** del patrón correspondiente
3. **Rellena en este orden:**
   - Reemplaza `NOMBRE_FUNCION` con el nombre de tu función
   - Reemplaza `CONDICION_BASE` y `VALOR_BASE`
   - Reemplaza `PARAM` con el parámetro clave (n, arr, i, etc.)
   - Reemplaza `OPERACION` con la lógica de tu algoritmo
4. **Agrega el ejemplo concreto** con valores pequeños (n=3 o n=4)
5. **Verifica** que Mermaid lo renderiza sin errores

> **Tip:** Si tu algoritmo combina patrones (ej: DFS + memo = DP en grafos),
> puedes anidar o combinar dos plantillas en el mismo diagrama usando `subgraph`.
