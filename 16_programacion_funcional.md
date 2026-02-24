# Guía de Ejercicios — Programación Funcional Aplicada a Algoritmos

> Implementar cada ejercicio en: **Python · Java · Haskell · Scala · Rust**
>
> Este capítulo es transversal: no agrega algoritmos nuevos sino una nueva lente
> para ver los 15 capítulos anteriores.

---

## Principios que gobiernan este capítulo

```
Programación Funcional (PF) no es un lenguaje sino un estilo:

  1. Funciones puras        → mismo input, mismo output, sin efectos
  2. Inmutabilidad          → no mutar datos, crear versiones nuevas
  3. Funciones de orden superior → funciones que reciben/retornan funciones
  4. Composición            → construir lo complejo combinando lo simple
  5. Evaluación lazy        → calcular solo cuando se necesita
  6. Recursión sobre loops  → el estado viaja como parámetro, no como variable

La pregunta de este capítulo:
  ¿Cómo cambia cada algoritmo de los 15 capítulos
   cuando se expresa con estos principios?
```

**Tensión honesta:**

| Aspecto | PF pura gana | PF pura pierde |
|---|---|---|
| Legibilidad de recursión | ✅ pattern matching, sin boilerplate | ❌ DP tabulado es más claro imperativo |
| Correctitud | ✅ inmutabilidad elimina bugs de estado | ❌ Union-Find, Heap in-place son verbosos |
| Composición | ✅ encadenar transformaciones es natural | ❌ grafos con estado mutable son engorrosos |
| Espacio | ❌ estructuras persistentes usan O(log n) extra | ✅ imperativo hace O(1) in-place |
| Paralelismo | ✅ sin estado compartido → sin race conditions | — |

---

## Tabla de contenidos

- [Sección 16.1 — Fundamentos: map, filter, fold y composición](#sección-161--fundamentos-map-filter-fold-y-composición)
- [Sección 16.2 — Recursión funcional y tail call](#sección-162--recursión-funcional-y-tail-call)
- [Sección 16.3 — DP funcional: memo lazy y fold](#sección-163--dp-funcional-memo-lazy-y-fold)
- [Sección 16.4 — Estructuras persistentes e inmutables](#sección-164--estructuras-persistentes-e-inmutables)
- [Sección 16.5 — Grafos y estado: mónadas y passing explícito](#sección-165--grafos-y-estado-mónadas-y-passing-explícito)
- [Sección 16.6 — Lazy evaluation y streams infinitos](#sección-166--lazy-evaluation-y-streams-infinitos)
- [Sección 16.7 — PF en lenguajes multiparadigma](#sección-167--pf-en-lenguajes-multiparadigma)

---

## Sección 16.1 — Fundamentos: map, filter, fold y composición

Las tres operaciones fundamentales de PF son el equivalente funcional
de los bucles imperativos. Todo lo que se puede hacer con un `for` se puede
expresar con combinaciones de estas tres.

```python
# Imperativo vs Funcional — el mismo resultado, distinto modelo mental

nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# IMPERATIVO: describe CÓMO hacerlo
resultado_imp = []
for n in nums:
    if n % 2 == 0:
        resultado_imp.append(n ** 2)
total_imp = 0
for x in resultado_imp:
    total_imp += x

# FUNCIONAL: describe QUÉ obtener
from functools import reduce
total_fun = reduce(
    lambda acc, x: acc + x,          # fold (reduce)
    map(lambda n: n ** 2,             # map
        filter(lambda n: n % 2 == 0,  # filter
               nums)),
    0
)

# Python idiomático (list comprehension = PF disfrazada)
total_py = sum(n**2 for n in nums if n % 2 == 0)

# Los tres producen 220.
# La versión funcional pura es más componible:
# puedes reemplazar cualquier función sin tocar las demás.
```

**Correspondencias con los capítulos anteriores:**

```
map    → transformar cada elemento (Cap. 03: prefix sums, ventana)
filter → seleccionar elementos (Cap. 14: criba de Eratóstenes)
fold   → acumular un resultado (Cap. 01: recursión de cola con acc)
compose→ encadenar algoritmos (Cap. 02: optimización por etapas)
```

**Composición de funciones:**

```python
from functools import reduce

def compose(*fns):
    """Combina funciones de derecha a izquierda: compose(f,g,h)(x) = f(g(h(x)))"""
    return reduce(lambda f, g: lambda x: f(g(x)), fns)

# Ejemplo: pipeline de transformación
es_primo    = lambda n: n > 1 and all(n % i != 0 for i in range(2, int(n**0.5)+1))
doblar      = lambda n: n * 2
sumar_uno   = lambda n: n + 1

pipeline = compose(es_primo, doblar, sumar_uno)  # es_primo(doblar(sumar_uno(x)))
# pipeline(4) → sumar_uno(4)=5 → doblar(5)=10 → es_primo(10)=False
# pipeline(3) → sumar_uno(3)=4 → doblar(4)=8  → es_primo(8)=False
# pipeline(5) → sumar_uno(5)=6 → doblar(6)=12 → es_primo(12)=False
# pipeline(10)→ sumar_uno(10)=11→ doblar(11)=22→ es_primo(22)=False
```

---

### Ejercicio 16.1.1 — map, filter, fold desde cero

**Enunciado:** Implementa `my_map`, `my_filter` y `my_fold` sin usar las funciones nativas. Cada una debe ser recursiva (no usar `for`). Verifica que producen el mismo resultado que las nativas.

**Restricciones:** Implementar con recursión pura, sin variables mutables ni bucles.

**Pista:** `my_map(f, [x, *xs]) = [f(x)] + my_map(f, xs)`. El caso base es la lista vacía. En Python usa `match`/`if` para el pattern matching.

**Implementar en:** Python · Java (streams) · Haskell · Scala · Rust

---

### Ejercicio 16.1.2 — Reducir los algoritmos de Cap.03 a map/filter/fold

**Enunciado:** Reescribe en estilo funcional puro (sin bucles, sin mutación):
1. Suma de todos los pares de un arreglo → `fold` sobre `filter`
2. Cuadrado de cada elemento → `map`
3. Máximo de un arreglo → `fold` con `max`
4. Contar elementos que cumplen una condición → `fold` sobre `filter`
5. Encontrar el primer elemento que satisface un predicado → `fold` con early-exit

**Restricciones:** Ninguna función puede tener efectos secundarios ni variables mutables.

**Pista:** El punto 5 es el más interesante: `fold` recorre todo el arreglo aunque ya encontraste el resultado. La solución funcional usa `takeWhile` o evaluación lazy.

**Implementar en:** Python · Java · Haskell · Scala · Rust

---

### Ejercicio 16.1.3 — Composición de algoritmos de búsqueda

**Enunciado:** Construye un pipeline funcional que: (1) genere los primeros `n` números de Fibonacci, (2) filtre los que son primos, (3) mapee cada uno a su posición en la secuencia de Fibonacci, (4) retorne los primeros `k` resultados.

**Restricciones:** El pipeline debe ser composable: cada etapa es una función independiente.

**Pista:** En Haskell esto se expresa con `take k . map posicion . filter esPrimo . fibs $ n`. En Python usa `itertools` para la evaluación lazy. Los "Primos de Fibonacci" (1, 2, 3, 5, 13, 89...) tienen una secuencia conocida (OEIS A005478).

**Implementar en:** Python · Java · Haskell · Scala · Rust

---

### Ejercicio 16.1.4 — Criba de Eratóstenes funcional

**Enunciado:** Implementa la criba de Eratóstenes como una composición de `filter` y recursión, sin arreglo mutable. Compara la complejidad con la versión imperativa del Cap.14.

**Restricciones:** No usar arreglos mutables. Usa listas o streams.

**Pista:**
```python
def criba(nums):
    if not nums:
        return []
    p = nums[0]
    return [p] + criba([x for x in nums[1:] if x % p != 0])

primos = criba(range(2, 100))
```
Esta versión es `O(n²/ln n)` en tiempo — peor que la imperativa `O(n log log n)`. ¿Por qué? ¿Cómo se puede mejorar?

**Implementar en:** Python · Haskell · Scala · Rust

---

### Ejercicio 16.1.5 — Función de orden superior para algoritmos de grafos

**Enunciado:** Implementa una función `recorrer(grafo, inicio, estrategia)` donde `estrategia` es una función que determina el orden de exploración. Pasando `deque.popleft` obtienes BFS; pasando `list.pop` obtienes DFS. Agrega una tercera estrategia: exploración por prioridad (Dijkstra).

**Restricciones:** La función `recorrer` no debe saber nada sobre el algoritmo específico — toda la lógica está en `estrategia`.

**Pista:** Esta es la esencia de las funciones de orden superior aplicadas al Cap.04. La misma función `recorrer` implementa BFS, DFS y Dijkstra cambiando únicamente la estructura de datos que se pasa como argumento.

**Implementar en:** Python · Java · Haskell · Scala · Rust

---

## Sección 16.2 — Recursión Funcional y Tail Call

En PF, la recursión **es** el bucle. La recursión de cola (Plantilla 5 del Cap.01)
es especialmente importante: permite al compilador optimizarla a un bucle
sin crecer el stack (TCO — Tail Call Optimization).

```python
# RECURSIÓN NORMAL — crece el stack O(n)
def suma(n):
    if n == 0:
        return 0
    return n + suma(n - 1)   # n + ... espera el resultado → no es tail call

# RECURSIÓN DE COLA — el resultado viaja en el acumulador
def suma_tail(n, acc=0):
    if n == 0:
        return acc            # retorna directamente, sin operación pendiente
    return suma_tail(n - 1, acc + n)  # ÚLTIMA instrucción → tail call

# En Python, TCO NO está implementado (por decisión de Guido van Rossum).
# En Haskell, Scala (con @tailrec), Rust (iterativamente), Erlang: SÍ.

# Trampoline — simular TCO en Python
def trampoline(f):
    result = f
    while callable(result):
        result = result()
    return result

def suma_trampoline(n, acc=0):
    if n == 0:
        return acc
    return lambda: suma_trampoline(n - 1, acc + n)  # retorna thunk

# trampoline(suma_trampoline(10000))  → funciona sin stack overflow
```

**Haskell — TCO nativo y pattern matching:**

```haskell
-- Recursión de cola con pattern matching
sumaLista :: [Int] -> Int -> Int
sumaLista []     acc = acc
sumaLista (x:xs) acc = sumaLista xs (acc + x)

-- El compilador detecta que es tail recursive y genera código iterativo
-- La notación (x:xs) deconstruye la lista: x = cabeza, xs = cola

-- Merge Sort en Haskell — expresión directa de la idea
mergeSort :: Ord a => [a] -> [a]
mergeSort []  = []
mergeSort [x] = [x]
mergeSort xs  = merge (mergeSort izq) (mergeSort der)
  where
    (izq, der) = splitAt (length xs `div` 2) xs
    merge [] ys = ys
    merge xs [] = xs
    merge (x:xs) (y:ys)
      | x <= y    = x : merge xs (y:ys)
      | otherwise = y : merge (x:xs) ys
```

---

### Ejercicio 16.2.1 — Convertir recursión normal a tail recursion

**Enunciado:** Convierte estas funciones a recursión de cola añadiendo un acumulador:
1. `suma_lista(arr)` → suma todos los elementos
2. `max_lista(arr)` → máximo elemento
3. `revertir(arr)` → lista invertida
4. `aplanar(lista_de_listas)` → lista plana
5. `longitud(arr)` → cantidad de elementos

**Restricciones:** Ninguna función puede tener operaciones pendientes al hacer la llamada recursiva.

**Pista:** El truco general es agregar `acc` como parámetro. Para `revertir`: en lugar de `[ultimo] + revertir(resto)`, usa `revertir(resto, acc=[ultimo] + acc)`.

**Implementar en:** Python · Haskell · Scala · Rust

---

### Ejercicio 16.2.2 — Trampoline para Python

**Enunciado:** Implementa la función `trampoline` que permite simular TCO en Python. Úsala para ejecutar `factorial(100000)` y `fibonacci_tail(50)` sin stack overflow.

**Restricciones:** La función trampolineada debe retornar un `lambda` (thunk) en lugar de llamarse a sí misma directamente.

**Pista:** El trampoline ejecuta el thunk repetidamente hasta obtener un valor no-callable. Esto convierte la recursión en un bucle `while` sin cambiar la lógica del algoritmo.

**Implementar en:** Python · Java · Scala

---

### Ejercicio 16.2.3 — Merge Sort funcional puro

**Enunciado:** Implementa Merge Sort sin ninguna mutación: sin slicing que modifique el original, sin `arr[i] = x`. Cada llamada crea y retorna listas nuevas.

**Restricciones:** El tipo de retorno es siempre una lista nueva. El input nunca se modifica.

**Pista:** En Haskell es la forma natural. En Python, `arr[:mid]` ya crea una copia — úsalo. La complejidad es la misma `O(n log n)` pero el uso de memoria es `O(n log n)` en lugar de `O(n)` por el extra de las copias.

**Implementar en:** Python · Java (streams) · Haskell · Scala · Rust

---

### Ejercicio 16.2.4 — Quick Sort funcional: el ejemplo clásico de Haskell

**Enunciado:** Implementa Quick Sort funcional en el estilo clásico de Haskell:
```
qsort [] = []
qsort (x:xs) = qsort menores ++ [x] ++ qsort mayores
  where menores = filter (<= x) xs
        mayores = filter (> x) xs
```
Impleméntalo en los 5 lenguajes. Luego analiza por qué esta versión, aunque elegante, usa `O(n²)` espacio extra en el peor caso (comparar con Quick Sort imperativo in-place).

**Restricciones:** La versión funcional debe ser de una expresión (o muy pocas líneas).

**Pista:** La elegancia tiene un costo: `++` en Haskell para listas es `O(n)`, y se llama `n` veces → `O(n²)` total en tiempo de concatenación. Las versiones modernas usan `Data.Sequence` o arreglos mutables dentro de `ST monad`.

**Implementar en:** Python · Java · Haskell · Scala · Rust

---

### Ejercicio 16.2.5 — DFS recursivo con estado explícito

**Enunciado:** Implementa DFS (Cap.01 §8 y Cap.04 §2) en estilo funcional puro: sin conjunto `visitados` mutable. El conjunto de visitados viaja como parámetro de la función.

**Restricciones:** La función `dfs(grafo, nodo, visitados)` retorna `(resultado, nuevos_visitados)`. No usa variables globales ni mutación.

**Pista:** Este patrón — retornar el estado actualizado junto con el resultado — es la raíz de la Mónada de Estado en Haskell. En Python se puede simular retornando tuplas.

**Implementar en:** Python · Haskell · Scala · Rust

---

## Sección 16.3 — DP Funcional: Memo Lazy y Fold

La programación dinámica tiene dos versiones funcionales:

1. **Memoización con lazy evaluation** (top-down natural en Haskell)
2. **`scanl` / `foldl`** para DP 1D (bottom-up funcional)

```haskell
-- HASKELL: Fibonacci con lazy memoización automática
-- La lista fibs se define en términos de sí misma (self-referential)
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
-- fibs = [0, 1, 1, 2, 3, 5, 8, 13, 21, ...]
-- fibs !! 100 es O(n) la primera vez, O(1) las siguientes (GHC memo automático)

-- PYTHON: DP 1D como scanl (fold que guarda intermedios)
from itertools import accumulate
import operator

# Suma acumulada (prefix sums) — scanl con suma
prefix = list(accumulate([2, 4, 1, 3, 5]))  # [2, 6, 7, 10, 15]

# Fibonacci bottom-up como fold
def fib_fold(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

# Versión funcional con reduce (fold que solo guarda el último estado):
from functools import reduce
fib_fun = lambda n: reduce(lambda ab, _: (ab[1], ab[0]+ab[1]),
                            range(n), (0, 1))[0]
# fib_fun(10) → 55
```

**DP 2D como fold de filas:**

```python
# Mochila 0/1 — cada fila del DP es una transformación de la anterior
def mochila_funcional(pesos, valores, W):
    def actualizar_fila(fila_anterior, item):
        peso, valor = item
        return [
            max(fila_anterior[w],
                fila_anterior[w - peso] + valor if w >= peso else 0)
            for w in range(W + 1)
        ]

    fila_inicial = [0] * (W + 1)
    return reduce(actualizar_fila, zip(pesos, valores), fila_inicial)[W]

# Cada item transforma la fila anterior en una nueva — sin mutación
```

---

### Ejercicio 16.3.1 — Fibonacci con las tres formas funcionales

**Enunciado:** Implementa Fibonacci de tres formas funcionales distintas:
1. **Recursiva con memo** (dict como cache, decorador `@lru_cache`)
2. **Como fold** usando `reduce` con tupla de estado `(a, b)`
3. **Como stream infinito** (generador en Python, lista lazy en Haskell)

Mide el tiempo de `fib(40)` con las tres formas y con la recursión naive.

**Restricciones:** Las versiones 2 y 3 no pueden usar recursión explícita.

**Pista:** La versión con `reduce` acumula `(fib(i), fib(i+1))` en cada paso — el fold transforma el estado sin recursión. El stream en Python usa `yield` y `send` o simplemente un generador.

**Implementar en:** Python · Haskell · Scala · Rust

---

### Ejercicio 16.3.2 — Prefix sums como scanl

**Enunciado:** El `scanl` (scan left) de Haskell es como `foldl` pero guarda todos los valores intermedios. Implementa `scanl` desde cero y úsalo para generar la tabla de prefix sums del Cap.03 §4.

**Restricciones:** `my_scanl(f, inicio, lista)` debe retornar una lista con todos los acumulados, incluyendo el valor inicial.

**Pista:** `scanl (+) 0 [2,4,1,3,5] = [0, 2, 6, 7, 10, 15]`. Este es exactamente el arreglo de prefix sums. La consulta de rango `suma(L,R) = prefix[R+1] - prefix[L]` sigue siendo `O(1)`.

**Implementar en:** Python · Java · Haskell · Scala · Rust

---

### Ejercicio 16.3.3 — Mochila 0/1 como fold de filas

**Enunciado:** Implementa la mochila 0/1 (Cap.02 §2) en estilo funcional: cada ítem transforma la fila anterior del DP en una nueva fila, usando `reduce` sobre los ítems. Sin ninguna mutación.

**Restricciones:** La función `mochila(items, capacidad)` usa `reduce` donde cada paso genera una nueva lista — sin modificar la anterior.

**Pista:** Ver el ejemplo en el código de esta sección. La clave es que `fila_anterior` es inmutable y la nueva fila se construye con una list comprehension.

**Implementar en:** Python · Java · Haskell · Scala · Rust

---

### Ejercicio 16.3.4 — LCS funcional con memoización

**Enunciado:** Implementa la Longest Common Subsequence (LCS) en estilo funcional top-down con `@lru_cache`. Compara el código con la versión DP bottom-up de la tabla 2D.

**Restricciones:** La función `lcs(s1, s2)` debe ser pura — mismo input siempre retorna el mismo output.

**Pista:**
```python
from functools import lru_cache

def lcs(s1, s2):
    @lru_cache(maxsize=None)
    def dp(i, j):
        if i == len(s1) or j == len(s2):
            return 0
        if s1[i] == s2[j]:
            return 1 + dp(i+1, j+1)
        return max(dp(i+1, j), dp(i, j+1))
    return dp(0, 0)
```
Este código es casi idéntico a la definición matemática de LCS. ¿Cuánto más legible es que la tabla 2D?

**Implementar en:** Python · Java · Haskell · Scala · Rust

---

### Ejercicio 16.3.5 — Haskell lazy memo: fibs y la lista de primos

**Enunciado:** En Haskell, define las dos listas infinitas más famosas de la PF:
```haskell
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
primes = criba [2..]
  where criba (p:xs) = p : criba (filter (\x -> x `mod` p /= 0) xs)
```
Luego: (a) toma los primeros 20 de cada lista, (b) encuentra los Fibonacci primos, (c) calcula `sum (takeWhile (<1000) fibs)`.

**Restricciones:** Sin ningún bucle. Solo funciones de lista de Haskell.

**Pista:** La magia de Haskell es que `fibs` se define en términos de sí misma — funciona gracias a la evaluación lazy. `fibs !! 1000` se evalúa solo hasta donde necesita.

**Implementar en:** Haskell · Scala (LazyList) · Python (generadores)

---

## Sección 16.4 — Estructuras Persistentes e Inmutables

Una **estructura persistente** es aquella que al "modificarse" retorna una nueva versión sin destruir la anterior. Son el corazón de la PF pura.

```
Estructura mutable (imperativa):
  arr = [1, 2, 3, 4, 5]
  arr[2] = 99        # O(1) — modifica in-place
  # arr es ahora [1, 2, 99, 4, 5]
  # la versión anterior [1,2,3,4,5] ya no existe

Estructura persistente (funcional):
  arr1 = [1, 2, 3, 4, 5]
  arr2 = set(arr1, 2, 99)   # O(log n) — retorna versión nueva
  # arr1 sigue siendo [1, 2, 3, 4, 5]
  # arr2 es [1, 2, 99, 4, 5]
  # ambas versiones coexisten (útil para undo, versioning, concurrencia)
```

**Árbol persistente — la base de todo:**

```
Estructura de árbol balanceado persistente:
Modificar el nodo X requiere actualizar solo el camino desde X hasta la raíz.
O(log n) nodos nuevos por operación, O(log n) compartidos con la versión anterior.

      raiz_v1                raiz_v2 (nueva)
         |                      |
    ┌────┴────┐            ┌────┴────┐
    A         B            A'        B      ← solo A' es nuevo, B es compartido
   / \       / \          / \
  C   D     E   F        C'  D      ← solo C' es nuevo
```

---

### Ejercicio 16.4.1 — Lista persistente (lista enlazada funcional)

**Enunciado:** Implementa una lista enlazada persistente donde `cons(elemento, lista)` crea una nueva lista que comparte la cola con la original. Las operaciones `head`, `tail`, `isEmpty` deben ser `O(1)`. La operación `append` debe ser `O(n)` — ¿por qué no puede ser mejor?

**Restricciones:** La lista original nunca se modifica. Cada versión debe ser accesible.

**Pista:** Una lista funcional es simplemente nodos `(cabeza, cola)` donde `cola` es otro nodo o vacío. `cons(99, [1,2,3])` crea `(99, → [1,2,3])` en O(1).

**Implementar en:** Python · Haskell · Scala · Rust

---

### Ejercicio 16.4.2 — Árbol BST persistente

**Enunciado:** Implementa un árbol BST persistente donde `insert(arbol, valor)` retorna un nuevo árbol sin modificar el original. El nuevo árbol comparte todos los nodos que no cambian.

**Restricciones:** `insert` es `O(log n)` y crea exactamente `O(log n)` nodos nuevos. El árbol original permanece accesible.

**Pista:** Al insertar, recrea solo los nodos en el camino desde la raíz hasta el punto de inserción. Todos los subárboles no afectados se comparten entre versiones.

**Implementar en:** Python · Haskell · Scala · Rust

---

### Ejercicio 16.4.3 — Heap persistente (Leftist Heap)

**Enunciado:** El Heap clásico (Cap.05) es mutable. El **Leftist Heap** es un heap persistente basado en árboles. Implementa `merge`, `insert` y `extractMin` — todas son `O(log n)` y retornan nuevas versiones del heap.

**Restricciones:** Ninguna operación modifica el heap existente.

**Pista:** El Leftist Heap se basa en que el camino más derecho es el más corto (propiedad leftist). `merge` de dos leftist heaps es `O(log n)` y es la operación base de todas las demás.

**Implementar en:** Haskell · Scala · Python

---

### Ejercicio 16.4.4 — Trie persistente

**Enunciado:** Implementa el Trie del Cap.10 de forma persistente: `insert(trie, palabra)` retorna un nuevo Trie sin modificar el original. Verifica que `search(trie_v1, palabra)` sigue funcionando después de crear `trie_v2`.

**Restricciones:** Cada `insert` comparte todos los nodos no modificados con la versión anterior.

**Pista:** Solo el camino desde la raíz hasta el último carácter de la nueva palabra necesita nodos nuevos — todos los demás ramos se comparten.

**Implementar en:** Python · Haskell · Scala · Rust

---

### Ejercicio 16.4.5 — Union-Find persistente vs mutable — el trade-off real

**Enunciado:** Implementa Union-Find en dos versiones:
1. **Mutable** (Cap.09): `O(α(n))` amortizado
2. **Persistente** (funcional): usando un árbol persistente para el arreglo `padre[]`

Mide el tiempo para `10^4` operaciones con ambas versiones. Cuantifica el costo de la persistencia.

**Restricciones:** La versión persistente debe retornar una nueva versión del DSU en cada `union`.

**Pista:** La versión persistente usa un arreglo persistente (segment tree o árbol de búsqueda binaria) para representar `padre[]`. Cada `union` crea `O(log n)` nodos nuevos → total `O(n log n)` vs `O(nα(n))` mutable. El factor puede ser 10-100x en práctica.

**Implementar en:** Python · Haskell · Scala

---

## Sección 16.5 — Grafos y Estado: Mónadas y Passing Explícito

Los grafos son el área de mayor tensión entre PF y programación imperativa.
El problema central: los algoritmos de grafos necesitan estado mutable
(conjunto de visitados, distancias, padres).

**Dos estrategias en PF:**

```
Estrategia 1: State passing explícito
  dfs(grafo, nodo, visitados) → (resultado, nuevos_visitados)
  El estado se pasa y retorna explícitamente en cada llamada.
  Verboso pero transparente.

Estrategia 2: Mónada de Estado (Haskell)
  dfs :: Grafo -> Nodo -> State (Set Nodo) [Nodo]
  El estado se oculta dentro de la mónada — el código parece imperativo
  pero es funcionalmente puro.
```

**State passing en Python:**

```python
def dfs_funcional(grafo, nodo, visitados=frozenset()):
    """
    Retorna (lista_orden, nuevos_visitados).
    frozenset garantiza inmutabilidad — nunca se modifica.
    """
    if nodo in visitados:
        return [], visitados

    nuevos_visitados = visitados | {nodo}   # operación de unión — retorna nuevo frozenset
    orden = [nodo]

    for vecino in sorted(grafo.get(nodo, [])):   # sorted para determinismo
        sub_orden, nuevos_visitados = dfs_funcional(grafo, vecino, nuevos_visitados)
        orden.extend(sub_orden)

    return orden, nuevos_visitados

grafo = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}
orden, _ = dfs_funcional(grafo, 'A')
# orden = ['A', 'B', 'D', 'C']

# Nota: frozenset es un set inmutable en Python.
# La unión | retorna un frozenset nuevo sin modificar el original.
```

---

### Ejercicio 16.5.1 — BFS funcional con cola persistente

**Enunciado:** Implementa BFS (Cap.04 §1) en estilo funcional: la cola es inmutable, el conjunto de visitados viaja como parámetro. La función `bfs_paso(cola, visitados)` retorna `(nueva_cola, nuevos_visitados, nodo_procesado)`.

**Restricciones:** Sin mutación. Usar `frozenset` para visitados y listas como colas (inmutables conceptualmente — crear nuevas en cada paso).

**Pista:** El BFS funcional es naturalmente menos eficiente que el imperativo por la creación de nuevas estructuras en cada paso. Para `n` nodos: `O(n²)` operaciones de copia vs `O(n)` mutable. Esto ilustra el trade-off real.

**Implementar en:** Python · Haskell · Scala

---

### Ejercicio 16.5.2 — Dijkstra funcional con fold

**Enunciado:** Implementa Dijkstra (Cap.04 §3) como un `fold` sobre los pasos de expansión. El estado es `(distancias, heap, visitados)` y cada paso retorna un nuevo estado.

**Restricciones:** El estado es inmutable entre pasos — cada iteración crea un nuevo estado.

**Pista:** Dijkstra funcional: `reduce(paso_dijkstra, range(V), estado_inicial)`. Cada `paso_dijkstra` extrae el mínimo del heap y actualiza distancias, retornando el nuevo estado completo.

**Implementar en:** Python · Haskell · Scala

---

### Ejercicio 16.5.3 — Floyd-Warshall como fold sobre nodos intermedios

**Enunciado:** Floyd-Warshall (Cap.04 §5) tiene exactamente la estructura de un `fold`: itera sobre los nodos intermedios `k` y transforma la matriz de distancias. Impleméntalo como `reduce(actualizar_matriz, range(V), matriz_inicial)`.

**Restricciones:** Cada iteración crea una nueva matriz — sin modificar la anterior.

**Pista:**
```python
def actualizar_matriz(dist, k):
    n = len(dist)
    return [[min(dist[i][j], dist[i][k] + dist[k][j])
             for j in range(n)]
            for i in range(n)]

resultado = reduce(actualizar_matriz, range(n), distancias_iniciales)
```
Esta versión usa `O(V³)` en espacio (una copia por iteración). La imperativa usa `O(V²)`.

**Implementar en:** Python · Haskell · Scala · Rust

---

### Ejercicio 16.5.4 — Ordenamiento topológico como unfold

**Enunciado:** El `unfold` (o `anamorfismo`) es el dual del `fold`: en lugar de reducir una estructura, la genera. Implementa el ordenamiento topológico de Kahn (Cap.04 §7) como un `unfold` que genera el orden nodo por nodo.

**Restricciones:** `toposort_unfold(grafo)` debe generar la secuencia de nodos sin bucles explícitos.

**Pista:** El estado del unfold es `(cola_actual, grados_entrada)`. Cada paso extrae un nodo de la cola y actualiza los grados — retornando `(nodo, nuevo_estado)` hasta que la cola esté vacía.

**Implementar en:** Python · Haskell · Scala

---

### Ejercicio 16.5.5 — Mónada de Estado en Haskell para DFS complejo

**Enunciado:** Implementa DFS con timestamps (Cap.04 §2) usando la mónada `State` de Haskell. El estado contiene `(tiempo_actual, tiempos_entrada, tiempos_salida, visitados)`.

**Restricciones:** El código debe verse casi imperativo gracias a la notación `do`, pero ser funcionalmente puro.

**Pista:**
```haskell
import Control.Monad.State

type DFSState = (Int, Map Node Int, Map Node Int, Set Node)

dfs :: Grafo -> Nodo -> State DFSState ()
dfs grafo nodo = do
  (t, entrada, salida, visitados) <- get
  unless (member nodo visitados) $ do
    put (t+1, insert nodo t entrada, salida, insert nodo visitados)
    mapM_ (dfs grafo) (vecinos grafo nodo)
    (t', entrada', salida', vis') <- get
    put (t'+1, entrada', insert nodo t' salida', vis')
```

**Implementar en:** Haskell

---

## Sección 16.6 — Lazy Evaluation y Streams Infinitos

La evaluación lazy permite trabajar con **estructuras infinitas** — se calculan
solo los elementos que realmente se necesitan.

```python
# Python: generadores como streams lazy

def naturales():
    n = 0
    while True:
        yield n
        n += 1

def filtrar(pred, stream):
    for x in stream:
        if pred(x):
            yield x

def mapear(f, stream):
    for x in stream:
        yield f(x)

def tomar(n, stream):
    for _, x in zip(range(n), stream):
        yield x

# Pipeline lazy — nada se evalúa hasta que se consume
primos_dobles = tomar(10,
    filtrar(lambda x: x > 2,
        mapear(lambda x: x * 2,
            filtrar(es_primo,
                naturales()))))

list(primos_dobles)  # Solo aquí se evalúa — [6, 10, 14, 22, 26, 34, 38, 46, 58, 62]
```

**Haskell — lazy por defecto:**

```haskell
-- Todo en Haskell es lazy — las listas infinitas son naturales
naturales :: [Integer]
naturales = [0..]

primosInfinitos :: [Integer]
primosInfinitos = criba [2..]
  where criba (p:xs) = p : criba (filter (\x -> x `mod` p /= 0) xs)

-- Usar take para consumir solo lo que necesitamos
primeros10Primos = take 10 primosInfinitos   -- [2,3,5,7,11,13,17,19,23,29]
```

---

### Ejercicio 16.6.1 — Stream infinito de Fibonacci

**Enunciado:** Implementa un generador/stream infinito de números de Fibonacci. Úsalo para: (a) tomar los primeros 20, (b) encontrar el primer Fibonacci mayor que 10^6, (c) contar cuántos Fibonacci hay menores que 10^9.

**Restricciones:** El stream no se materializa completo — cada elemento se genera bajo demanda.

**Pista:** En Python usa `yield`. En Haskell la definición `fibs = 0:1:zipWith (+) fibs (tail fibs)` es el ejemplo canónico de lazy list auto-referencial.

**Implementar en:** Python · Haskell · Scala (LazyList) · Rust

---

### Ejercicio 16.6.2 — Criba de Eratóstenes infinita

**Enunciado:** Implementa una criba que genere **todos** los primos (sin límite superior conocido de antemano). El usuario puede pedir el primo número 1000 o el primer primo mayor que un millón.

**Restricciones:** El stream es verdaderamente infinito — no pre-calcula ningún límite.

**Pista:** La criba funcional lazy tiene un problema de rendimiento conocido: la criba de O'Neill (2009) es la versión eficiente. Para este ejercicio, la versión simple es aceptable — analiza su complejidad vs la criba del Cap.14.

**Implementar en:** Python · Haskell · Scala

---

### Ejercicio 16.6.3 — BFS lazy por niveles

**Enunciado:** Implementa BFS que genere los nodos **nivel por nivel** como un stream lazy: el nivel 0, luego el nivel 1, etc. El usuario puede pedir "los primeros 3 niveles" sin explorar el resto del grafo.

**Restricciones:** Los niveles se generan bajo demanda. Un grafo grande no se explora completo si el usuario solo pide los primeros niveles.

**Pista:** BFS por niveles es naturalmente un unfold: el estado es la frontera actual, y cada paso genera un nuevo nivel + nueva frontera.

**Implementar en:** Python · Haskell · Scala

---

### Ejercicio 16.6.4 — Algoritmo de Sieve de O'Neill

**Enunciado:** La criba de Eratóstenes funcional ingenua (Ejercicio 16.1.4) es `O(n²/ln n)`. El algoritmo de O'Neill la mejora a `O(n log log n)` usando una tabla de prioridad (heap) de múltiplos pendientes. Impleméntala.

**Restricciones:** El stream de primos debe ser más eficiente que la criba recursiva simple.

**Pista:** En lugar de filtrar por cada primo, mantén un min-heap de `(próximo_múltiplo, primo_generador)`. Cuando el número actual es menor que el mínimo del heap, es primo. Si es igual, avanza el heap.

**Implementar en:** Python · Haskell

---

### Ejercicio 16.6.5 — Merge de streams ordenados infinitos

**Enunciado:** Dados `k` streams ordenados infinitos (como las `k` listas del ejercicio 5.2.4), genera un stream merged también ordenado e infinito. Impleméntalo con un heap de `k` elementos.

**Restricciones:** Los streams son infinitos — no se pueden materializar. Se consumen elemento a elemento.

**Pista:** Mantén en el heap el elemento actual de cada stream junto con el generador. Cuando extraes el mínimo, avanzas ese generador y reinserta el siguiente elemento. Esto es `O(log k)` por elemento.

**Implementar en:** Python · Haskell · Scala

---

## Sección 16.7 — PF en Lenguajes Multiparadigma

Los lenguajes del repositorio (Python, Java, Go, C#, Rust) no son funcionales puros,
pero todos incorporan características de PF que mejoran la expresividad.

```
Python:  list comprehensions, generators, functools, @lru_cache
Java:    Stream API, Optional, lambdas, records (inmutabilidad)
Go:      Sin closures complejos, pero funciones son valores de primera clase
C#:      LINQ (= SQL funcional), async/await, records, pattern matching
Rust:    Iteradores lazy, closures, Option/Result como mónadas light,
         inmutabilidad por defecto (mut explícito)
```

**Rust — el más cercano a PF entre los imperativos:**

```rust
// Rust: inmutabilidad por defecto, iteradores lazy, sin null
let nums = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let resultado: i32 = nums.iter()
    .filter(|&&n| n % 2 == 0)   // solo pares
    .map(|&n| n * n)             // cuadrado
    .sum();                       // reducir

// Nada se evalúa hasta .sum() — los iteradores son lazy en Rust
// resultado = 220

// Rust garantiza en tiempo de compilación que no hay mutación accidental
```

**Java Stream API:**

```java
// Java — streams con evaluación lazy
List<Integer> nums = List.of(1,2,3,4,5,6,7,8,9,10);

int resultado = nums.stream()
    .filter(n -> n % 2 == 0)
    .mapToInt(n -> n * n)
    .sum();  // 220

// Las operaciones intermedias (filter, map) son lazy
// Solo la operación terminal (sum) fuerza la evaluación
```

---

### Ejercicio 16.7.1 — Stream API de Java para algoritmos del Cap.03

**Enunciado:** Reimplementa en Java usando Stream API (sin bucles `for`):
1. Dos punteros → `IntStream.range` con `reduce`
2. Ventana deslizante → stream personalizado con `zip`
3. Prefix sums → `IntStream.iterate` o `Stream.generate`
4. Pila monótona → no se puede expresar directamente con streams (explica por qué)

**Restricciones:** Sin `for`, `while`, ni variables mutables en el método principal.

**Pista:** El punto 4 es intencionalmente difícil — la pila monótona necesita estado mutable compartido entre iteraciones, lo cual choca con el modelo de streams de Java. La solución requiere `reduce` con estado complejo o reconocer que no todo se mapea bien a streams.

**Implementar en:** Java

---

### Ejercicio 16.7.2 — LINQ en C# para consultas sobre grafos

**Enunciado:** Dado un grafo como lista de aristas, usa LINQ para:
1. Encontrar todos los nodos con grado > 3
2. Agrupar nodos por componente (requiere Union-Find + LINQ)
3. Ordenar aristas por peso para Kruskal
4. Encontrar el nodo con mayor centralidad (más vecinos)

**Restricciones:** Cada consulta debe ser una expresión LINQ de una sola línea (query syntax o method syntax).

**Pista:** LINQ es SQL funcional sobre colecciones. `from n in nodos where grado(n) > 3 select n` es equivalente a `nodos.Where(n => grado(n) > 3)`.

**Implementar en:** C#

---

### Ejercicio 16.7.3 — Rust iterators para algoritmos de búsqueda

**Enunciado:** En Rust, implementa usando solo iteradores (sin `for` explícito):
1. Búsqueda binaria → `partition_point`
2. Máximo de arreglo → `max()`
3. Encontrar primero que cumple → `find()`
4. Merge Sort → `chain`, `zip`, iteradores personalizados
5. Prefix sums → `scan`

**Restricciones:** Sin `for` loops. Solo métodos de `Iterator`.

**Pista:** Rust tiene `scan` que es exactamente `scanl` de Haskell — acumula un estado y emite todos los intermedios. Para Merge Sort, los iteradores no son suficientes — necesitas recursión con `Vec` nuevos.

**Implementar en:** Rust

---

### Ejercicio 16.7.4 — @lru_cache y @cache de Python como memoización automática

**Enunciado:** Usa `@functools.lru_cache` para convertir automáticamente estas funciones recursivas del Cap.01 en versiones memoizadas:
1. `fibonacci(n)`
2. `catalan(n)`
3. `lcs(s1, s2)` — ¡pero `lru_cache` necesita argumentos hashables!
4. `mochila(items, capacidad)` — mismo problema
5. `caminos(m, n)` — número de caminos en cuadrícula

**Restricciones:** No modificar la lógica de la función — solo agregar el decorador (y adaptaciones de tipos si es necesario).

**Pista:** `lru_cache` no funciona con listas (no son hashables). Convierte las listas a tuplas antes de llamar. Para la mochila: `items` debe ser una tupla de tuplas.

**Implementar en:** Python

---

### Ejercicio 16.7.5 — Go sin PF nativa — el caso de estudio

**Enunciado:** Go es deliberadamente minimalista: no tiene generics completos (hasta 1.18), no tiene `map`/`filter` nativos, y no tiene TCO garantizado. Implementa en Go:
1. Una función `Map[T, U](slice []T, f func(T) U) []U` genérica
2. Una función `Filter[T](slice []T, pred func(T) bool) []T`
3. Una función `Reduce[T, U](slice []T, f func(U, T) U, init U) U`
4. Úsalas para reimplementar los algoritmos de los ejercicios anteriores

Reflexiona: ¿por qué Go resistió la PF durante tanto tiempo?

**Restricciones:** Usar Go 1.18+ con generics.

**Pista:** Go valora la legibilidad y la explicitez sobre la abstracción. La respuesta de los creadores de Go a "¿por qué no hay map/filter?" fue siempre "escribe el bucle — es más claro". Los generics de Go 1.18 cambiaron parcialmente esto.

**Implementar en:** Go

---

## Tabla resumen — PF aplicada a los 15 capítulos

| Capítulo | Encaja natural | Tensión | Herramienta PF clave |
|---|---|---|---|
| Cap.01 Recursión | ✅ Perfecto | — | Pattern matching, TCO |
| Cap.02 Optimización | ✅ Memo top-down | ⚠️ Tabulación menos obvia | `@lru_cache`, `scanl` |
| Cap.03 Reducción complejidad | ✅ map/filter/fold | ⚠️ Pila monótona con estado | Streams, comprehensions |
| Cap.04 Grafos | ⚠️ State passing | ❌ Union-Find persistente costoso | Mónada State, frozenset |
| Cap.05 Heap | ⚠️ Leftist heap | ❌ sift-down in-place no existe | Heap persistente |
| Cap.06 Greedy | ✅ fold con decisión | ⚠️ Estado de "mejor hasta ahora" | `reduce` con estado |
| Cap.07 Colecciones Java | ✅ Stream API | ⚠️ No todo se mapea a streams | LINQ, Stream, collect |
| Cap.08 Sorting | ✅ Merge Sort, Quick Sort | ❌ Heap Sort in-place imposible | Recursión pura |
| Cap.09 Union-Find | ❌ Persistente es 10-100x más lento | ❌ Mayor fricción del repositorio | Union-Find persistente |
| Cap.10 Trie | ✅ Árbol natural en PF | ⚠️ Trie mutable más eficiente | Trie persistente |
| Cap.11 Análisis amortizado | ⚠️ Harder to reason about | ❌ Persistente cambia el análisis | Cola con dos pilas funcional |
| Cap.12 KMP / Rabin-Karp | ✅ Tabla de fallos como fold | ⚠️ Rolling hash necesita estado | `scanl`, `foldl` |
| Cap.13 Bit manipulation | ✅ Operaciones puras por naturaleza | — | `foldl` con XOR, bitmask |
| Cap.14 Teoría de números | ✅ Funciones matemáticas puras | — | Criba lazy, `gcd` recursivo |
| Cap.15 Complejidad | ✅ Verificadores son funciones puras | ⚠️ Aproximaciones con estado | Reduciones como funciones |

> **Regla práctica:** si el algoritmo es una **transformación de datos sin estado persistente**,
> PF lo mejora. Si el algoritmo **muta estado para eficiencia**, PF añade complejidad.
> La PF es una herramienta, no una religión.
