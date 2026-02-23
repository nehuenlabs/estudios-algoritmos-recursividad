# Guía de Ejercicios — Union-Find (Disjoint Set Union)

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `08_sorting_completo.md`.

---

## Concepto fundamental

Union-Find (también llamado Disjoint Set Union o DSU) es una estructura de datos que mantiene una colección de conjuntos disjuntos y soporta dos operaciones:

- **`find(x)`** → retorna el representante (raíz) del conjunto al que pertenece `x`
- **`union(x, y)`** → une los conjuntos que contienen `x` e `y`

**Pregunta que responde en `O(α(n)) ≈ O(1)` práctico:** ¿Están `x` e `y` en el mismo componente conectado?

```
Caso de uso típico: grafo de amistades
¿Están Alice y Bob conectados (directa o indirectamente)?

Sin Union-Find: BFS/DFS → O(V + E) por consulta
Con Union-Find: O(α(n)) por consulta, O(α(n)) por unión

α(n) es la función inversa de Ackermann.
Para todos los valores prácticos de n, α(n) <= 4.
En la práctica, α(n) = O(1).
```

---

## Implementación con optimizaciones

```python
class UnionFind:
    def __init__(self, n):
        self.padre = list(range(n))   # cada elemento es su propio padre
        self.rango = [0] * n          # altura aproximada del árbol
        self.num_componentes = n      # número de componentes inicialmente

    def find(self, x):
        # Path compression: aplana el árbol hacia la raíz
        if self.padre[x] != x:
            self.padre[x] = self.find(self.padre[x])   # recursivo
        return self.padre[x]

    def union(self, x, y):
        raiz_x = self.find(x)
        raiz_y = self.find(y)

        if raiz_x == raiz_y:
            return False              # ya están en el mismo conjunto

        # Union by rank: el árbol más pequeño cuelga del más grande
        if self.rango[raiz_x] < self.rango[raiz_y]:
            raiz_x, raiz_y = raiz_y, raiz_x
        self.padre[raiz_y] = raiz_x   # raiz_y cuelga de raiz_x

        if self.rango[raiz_x] == self.rango[raiz_y]:
            self.rango[raiz_x] += 1   # solo crece si los rangos eran iguales

        self.num_componentes -= 1
        return True                   # unión exitosa

    def conectados(self, x, y):
        return self.find(x) == self.find(y)

# Sin optimizaciones: O(n) por operación en el peor caso
# Con path compression + union by rank: O(α(n)) amortizado
```

**¿Por qué funciona path compression?**

```
Antes de find(6):        Después de find(6):
    1                        1
    |                      / | \
    2                     2  4  6
    |                     |
    4                     3
    |
    6                 → Todos los nodos en el camino
    |                   apuntan directamente a la raíz
    3
```

---

## Tabla de contenidos

- [Sección 9.1 — Implementación base y optimizaciones](#sección-91--implementación-base-y-optimizaciones)
- [Sección 9.2 — Componentes conectados en grafos](#sección-92--componentes-conectados-en-grafos)
- [Sección 9.3 — Kruskal con Union-Find](#sección-93--kruskal-con-union-find)
- [Sección 9.4 — Problemas de conectividad dinámica](#sección-94--problemas-de-conectividad-dinámica)
- [Sección 9.5 — Union-Find con información adicional](#sección-95--union-find-con-información-adicional)

---

## Sección 9.1 — Implementación base y optimizaciones

**Las dos optimizaciones críticas:**

1. **Path Compression:** Cuando haces `find(x)`, haz que todos los nodos en el camino a la raíz apunten directamente a la raíz.
2. **Union by Rank (o by Size):** Siempre une el árbol más pequeño al más grande.

Juntas logran la complejidad amortizada `O(α(n))`.

---

### Ejercicio 9.1.1 — Implementar Union-Find desde cero

**Enunciado:** Implementa Union-Find con las tres versiones: (a) sin optimizaciones (naive), (b) solo path compression, (c) solo union by rank, (d) ambas optimizaciones. Para cada versión, mide cuántos pasos (asignaciones) realiza para `n=1000` uniones aleatorias seguidas de `n=1000` consultas `find`.

**Restricciones:** `n=1000`.

**Pista:** La versión sin optimizaciones puede degenerar en una lista enlazada: `find` tarda `O(n)`. Con ambas optimizaciones, cada operación es prácticamente `O(1)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.1.2 — Union by Size vs Union by Rank

**Enunciado:** Implementa Union-Find con "union by size" (el árbol con más nodos absorbe al más pequeño) en lugar de "union by rank". Compara la profundidad máxima del árbol resultante con "union by rank" después de `n=10000` uniones.

**Restricciones:** `n=10000`.

**Pista:** Ambas variantes logran `O(log n)` altura. "Union by size" es más intuitivo de mantener; "union by rank" es ligeramente más común en la literatura. Con path compression, la diferencia práctica es insignificante.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.1.3 — Path compression iterativo

**Enunciado:** Implementa `find` de forma iterativa (sin recursión) usando path compression. Existen dos variantes: "path compression completa" (todos apuntan a la raíz) y "path splitting" (cada nodo apunta a su abuelo). Implementa ambas.

**Restricciones:** `n=10^5`.

**Pista:** Path splitting iterativo: `while padre[x] != x: padre[x], x = padre[padre[x]], padre[x]`. Más simple y evita el stack overflow de la versión recursiva para cadenas muy largas.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.1.4 — Deshacer uniones (Rollback)

**Enunciado:** Implementa Union-Find que soporte deshacer la última unión. Esta variante es útil en algoritmos offline. Nota: path compression no es compatible con rollback; usa solo union by rank.

**Restricciones:** `n=10^3`, hasta `10^3` operaciones.

**Pista:** Guarda una pila con los cambios realizados: `(nodo, padre_anterior, rango_anterior)`. Para deshacer, restaura desde la pila. Sin path compression porque las compresiones crean demasiados cambios para revertir.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.1.5 — Benchmark de complejidad

**Enunciado:** Mide empíricamente la complejidad de `n` operaciones `union`+`find` para `n = 10^3, 10^4, 10^5, 10^6`. Grafica (o muestra en tabla) el tiempo por operación. ¿Confirma que es prácticamente `O(1)`?

**Restricciones:** Usa la implementación con ambas optimizaciones.

**Pista:** El tiempo total debería crecer aproximadamente linealmente con `n` (no `n log n` ni `n²`), lo que implica tiempo por operación constante.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 9.2 — Componentes conectados en grafos

Union-Find es la herramienta natural para problemas de conectividad en grafos donde las aristas se agregan dinámicamente.

```python
def componentes_conectados(n, aristas):
    uf = UnionFind(n)
    for u, v in aristas:
        uf.union(u, v)
    return uf.num_componentes

# Pregunta: ¿están u y v en el mismo componente?
# Respuesta: uf.conectados(u, v)

# Comparación con BFS:
# BFS: O(V + E) por consulta de conectividad
# Union-Find: O(α(n)) por consulta, O(α(n)) por agregar arista
# Union-Find gana cuando hay muchas consultas o aristas se agregan dinámicamente
```

---

### Ejercicio 9.2.1 — Número de componentes en grafo dinámico

**Enunciado:** Dado `n` nodos y una secuencia de aristas que se agregan una por una, después de cada adición reporta el número actual de componentes conectados.

**Restricciones:** `1 <= n <= 10^5`, `1 <= aristas <= 10^5`.

**Pista:** `union` retorna `True` si unió dos componentes distintos (el número de componentes decrece en 1). Retorna `False` si ya estaban conectados.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.2.2 — Detectar ciclo en grafo no dirigido

**Enunciado:** Dado un grafo no dirigido con aristas que se agregan una por una, detecta el momento exacto en que se forma el primer ciclo (la primera arista que conecta dos nodos ya en el mismo componente).

**Restricciones:** `1 <= n <= 10^5`, `1 <= aristas <= 10^5`.

**Pista:** Al intentar unir `u` y `v`, si `find(u) == find(v)`, agregar esta arista formaría un ciclo. Es la misma lógica que usa Kruskal para evitar ciclos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.2.3 — Número de islas (variante Union-Find)

**Enunciado:** Dada una cuadrícula binaria donde `1` es tierra y `0` es agua, cuenta el número de islas (grupos de `1`s conectados horizontal o verticalmente). Implementa con Union-Find en lugar de DFS/BFS.

**Restricciones:** `1 <= m, n <= 300`.

**Pista:** Trata cada celda `1` como un nodo. Numera las celdas con `i*columnas + j`. Une cada celda `1` con sus vecinos `1`. El número de islas es el número de componentes.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.2.4 — Cuentas bancarias conectadas

**Enunciado:** Dadas `n` cuentas bancarias y transacciones entre ellas, determina: (a) cuántos grupos de cuentas conectadas existen, (b) el tamaño del grupo más grande, (c) si dos cuentas específicas están en el mismo grupo.

**Restricciones:** `1 <= n <= 10^4`, `1 <= transacciones <= 10^5`.

**Pista:** Usa Union by Size para rastrear el tamaño de cada componente. Cuando unes dos componentes, el tamaño del nuevo es la suma de ambos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.2.5 — Ecuaciones de igualdad y desigualdad

**Enunciado:** Dado un arreglo de strings como `["a==b", "b==c", "a!=d"]`, determina si todas las ecuaciones son satisfacibles simultáneamente. (LeetCode 990)

**Restricciones:** `1 <= len(ecuaciones) <= 500`.

**Pista:** Primera pasada: une con `union` todos los pares de la forma `x==y`. Segunda pasada: para cada `x!=y`, verifica que `find(x) != find(y)`. Si alguno falla, no es satisfacible.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 9.3 — Kruskal con Union-Find

Kruskal es quizás el uso más emblemático de Union-Find. La lógica es elegante: ordena aristas por peso, agrega las que no forman ciclo.

```python
def kruskal(n, aristas):
    # aristas = [(peso, u, v)]
    aristas.sort()                      # O(E log E)
    uf = UnionFind(n)
    mst = []
    costo = 0

    for peso, u, v in aristas:          # O(E · α(n))
        if uf.union(u, v):              # no forma ciclo
            mst.append((u, v, peso))
            costo += peso
            if len(mst) == n - 1:       # MST completo: n-1 aristas
                break

    return mst, costo

# ¿Por qué funciona?
# Teorema del corte: la arista más barata que cruza cualquier corte
# del grafo siempre pertenece a algún MST.
# Kruskal aplica esto greedy: siempre toma la arista más barata
# que no forme un ciclo.
```

---

### Ejercicio 9.3.1 — Kruskal básico

**Enunciado:** Dado un grafo no dirigido ponderado, implementa Kruskal con Union-Find para encontrar el MST. Retorna las aristas del MST y el costo total.

**Restricciones:** `1 <= n <= 10^4`, `1 <= aristas <= 10^5`, pesos no negativos.

**Pista:** Si al final `len(mst) < n-1`, el grafo no es conexo y no existe MST.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.3.2 — Verificar si agregar una arista crea un ciclo

**Enunciado:** Dado un grafo que se construye arista por arista, responde para cada nueva arista si su adición crearía un ciclo. Luego construye el spanning tree máximo (en lugar de mínimo).

**Restricciones:** `1 <= n <= 10^3`, `1 <= aristas <= 10^4`.

**Pista:** Para el spanning tree máximo, ordena las aristas por peso descendente. La lógica de Union-Find es idéntica.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.3.3 — Conectar ciudades con costo mínimo

**Enunciado:** Tienes `n` ciudades y puedes construir carreteras entre ellas. Algunas ciudades ya están conectadas por trenes. Encuentra el costo mínimo para conectar todas las ciudades considerando que las conexiones de tren son gratuitas. (LeetCode 1135 variante)

**Restricciones:** `1 <= n <= 10^4`, `0 <= conexiones_gratuitas <= n`.

**Pista:** Primero aplica `union` para todas las conexiones gratuitas. Luego corre Kruskal sobre las aristas de pago, ignorando las que conectan ciudades ya unidas.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.3.4 — MST con restricción de k aristas obligatorias

**Enunciado:** Dado un grafo y `k` aristas que deben estar en el MST (aristas obligatorias), encuentra el MST de menor costo que las incluya.

**Restricciones:** `1 <= n <= 10^3`, `0 <= k <= n-1`.

**Pista:** Primero une los extremos de las aristas obligatorias con `union`. Si alguna obligatoria crea un ciclo, no hay solución. Luego corre Kruskal normal sobre las aristas restantes.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.3.5 — Aristas redundantes

**Enunciado:** Dado un grafo que tiene exactamente `n` aristas y `n` nodos (un ciclo exactamente), encuentra la arista que, si se elimina, deja el grafo como un árbol. Si hay varias, retorna la que aparece última en el input. (LeetCode 684)

**Restricciones:** `1 <= n <= 1000`.

**Pista:** Procesa las aristas en orden. La primera que intentes agregar a un Union-Find y que `find(u) == find(v)` (ya están conectados) es la arista redundante.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 9.4 — Problemas de conectividad dinámica

Union-Find brilla en problemas donde las conexiones se agregan dinámicamente y necesitas responder preguntas de conectividad en tiempo real.

```python
# Patrón: procesar queries offline cuando hay borrados
# "Conectividad dinámica offline": si hay tanto adiciones como eliminaciones,
# procesa los eventos al revés (eliminaciones → adiciones) para usar solo Union-Find.

# Ejemplo: "¿Están u y v conectados en el tiempo t?"
# Si las conexiones tienen timestamps de inicio y fin,
# usa una técnica de divide y vencerás + Union-Find con rollback.
```

---

### Ejercicio 9.4.1 — Consultas de conectividad en tiempo real

**Enunciado:** Dado un sistema que recibe en tiempo real: `UNION x y` (conecta los nodos x e y) y `QUERY x y` (¿están x e y conectados?), procesa todas las operaciones con `O(α(n))` por operación.

**Restricciones:** `1 <= n <= 10^5`, `1 <= operaciones <= 10^5`.

**Pista:** Union-Find estándar. Lee operaciones de un arreglo o stdin y responde `QUERY` en el momento.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.4.2 — Número mínimo de operaciones para conectar todos

**Enunciado:** Dado un grafo con `n` nodos y aristas existentes, encuentra el número mínimo de aristas que debes agregar para que el grafo sea completamente conexo.

**Restricciones:** `1 <= n <= 10^5`, `0 <= aristas <= 10^5`.

**Pista:** El número mínimo de aristas a agregar es `num_componentes - 1`. Usa Union-Find para contar los componentes actuales.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.4.3 — Amistad transitiva

**Enunciado:** En una red social, "ser amigo de amigo" es transitivo. Dado un historial de amistades nuevas, responde: después de la k-ésima amistad, ¿son Alice y Bob amigos (directa o indirectamente)?

**Restricciones:** Hasta `10^4` amistades, hasta `10^4` consultas.

**Pista:** Mapea nombres a índices. Une con `union` en cada amistad nueva. Responde cada consulta con `conectados`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.4.4 — Componentes en cuadrícula con desbloqueos

**Enunciado:** Dada una cuadrícula bloqueada (todas las celdas son `0`), las celdas se "desbloquean" (`1`) una por una en un orden dado. Después de cada desbloqueo, reporta el número de componentes conectados de celdas desbloqueadas.

**Restricciones:** `1 <= m, n <= 50`, `m*n` desbloqueos.

**Pista:** Cuando desbloqueas celda `(i,j)`, crea el nodo y une con sus vecinos ya desbloqueados. Usa el contador `num_componentes` del UnionFind.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.4.5 — Detección de comunidades

**Enunciado:** Dada una red de usuarios y una secuencia de `n` conexiones que se agregan en orden, encuentra el momento exacto (número de conexión) en que se forma por primera vez un componente con al menos `k` usuarios.

**Restricciones:** `1 <= n <= 10^5`, `1 <= k <= n`.

**Pista:** Usa Union by Size. En cada `union`, si el nuevo componente tiene tamaño `>= k`, retorna el número de conexión actual.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 9.5 — Union-Find con información adicional

La estructura básica guarda solo el representante. Puedes extenderla para guardar más información por componente.

```python
class UnionFindPeso:
    """Union-Find que detecta si hay contradicción de pesos."""
    def __init__(self, n):
        self.padre = list(range(n))
        self.peso = [0.0] * n    # peso relativo: peso[x] = w(x) / w(raiz(x))

    def find(self, x):
        if self.padre[x] == x:
            return x, 1.0
        raiz, peso_a_raiz = self.find(self.padre[x])
        self.padre[x] = raiz
        self.peso[x] *= peso_a_raiz    # actualiza peso relativo
        return raiz, self.peso[x]

    def union(self, x, y, ratio):
        # w(x) / w(y) = ratio
        raiz_x, peso_x = self.find(x)
        raiz_y, peso_y = self.find(y)
        if raiz_x == raiz_y:
            return                     # ya conectados
        self.padre[raiz_x] = raiz_y
        self.peso[raiz_x] = ratio * peso_y / peso_x
```

---

### Ejercicio 9.5.1 — Union-Find con tamaño de componente

**Enunciado:** Extiende Union-Find para responder en `O(1)`: ¿cuántos elementos tiene el componente de `x`? Mantén el tamaño actualizado en cada `union`.

**Restricciones:** `1 <= n <= 10^5`.

**Pista:** Guarda `tamaño[raiz] = n` para cada raíz. Al unir, suma los tamaños y guarda en la nueva raíz.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.5.2 — Divide de peso (Evaluate Division)

**Enunciado:** Dados pares `(a, b, valor)` que significan `a/b = valor`, responde consultas `(c, d)` retornando `c/d`. Si no hay suficiente información, retorna `-1.0`. (LeetCode 399)

**Restricciones:** `1 <= len(ecuaciones) <= 20`.

**Pista:** Usa Union-Find con pesos. `peso[x]` = `x / raiz(x)`. Para `union(a, b, valor)`: conecta las raíces con el peso adecuado. Para `query(c, d)`: si misma raíz, `peso[c] / peso[d]`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.5.3 — Detectar contradicción de paridad

**Enunciado:** Dado un grafo bipartito donde cada arista tiene etiqueta `0` (misma parte) o `1` (partes distintas), detecta si hay una contradicción (ciclo impar).

**Restricciones:** `1 <= n <= 10^4`, `1 <= aristas <= 10^5`.

**Pista:** Guarda `paridad[x]` = paridad relativa a la raíz. Al unir `(u, v, etiqueta)`, verifica si la paridad esperada es consistente con la que ya tienes. Una contradicción implica ciclo impar.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.5.4 — Componente más frecuente

**Enunciado:** Dado un Union-Find con `n` nodos donde cada nodo tiene un color, responde en `O(1)` cuál es el color más frecuente en el componente de `x`, después de cada `union`.

**Restricciones:** `1 <= n <= 10^4`, colores entre `0` y `9`.

**Pista:** Para cada raíz, guarda un `Counter` de colores. Al unir, fusiona los contadores (el componente más pequeño se fusiona al más grande para eficiencia).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.5.5 — Union-Find persistente (básico)

**Enunciado:** Implementa una versión simplificada de Union-Find persistente que permita "tomar una foto" del estado actual y consultar si dos nodos estaban conectados en una foto anterior.

**Restricciones:** Hasta `10^3` nodos, `10^3` operaciones, `10^3` fotos.

**Pista:** La versión más simple: guarda una copia completa del arreglo `padre` en cada foto. No es eficiente (`O(n)` por foto) pero demuestra el concepto. La versión eficiente usa árboles persistentes.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Union-Find

| Operación | Sin optimiz. | Solo rank | Solo path compr. | Ambas |
|---|---|---|---|---|
| `find` peor caso | `O(n)` | `O(log n)` | `O(log n)` | `O(α(n))` |
| `union` peor caso | `O(n)` | `O(log n)` | `O(log n)` | `O(α(n))` |
| `find` amortizado | `O(n)` | `O(log n)` | `O(log n)` | `O(α(n))` |
| Espacio | `O(n)` | `O(n)` | `O(n)` | `O(n)` |

**Cuándo usar Union-Find:**

| Situación | Union-Find | Alternativa |
|---|---|---|
| Conectividad dinámica (solo uniones) | ✅ Ideal | BFS/DFS |
| Detectar ciclos al construir grafo | ✅ Ideal | DFS |
| MST (Kruskal) | ✅ Ideal | Prim |
| Componentes conectados estáticos | ⚠️ Funciona | BFS/DFS más simple |
| Conectividad con borrados | ❌ No soporta nativamente | Técnicas offline |
| Camino más corto | ❌ No aplica | Dijkstra |

> `α(n)` es la función inversa de Ackermann. Para `n = 2^65536`, `α(n) = 5`. En la práctica se comporta como `O(1)`.
