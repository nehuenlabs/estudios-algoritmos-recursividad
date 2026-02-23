# Guía de Ejercicios — Optimización de Algoritmos Recursivos

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `01_recursion_tipos.md`.

---

## Tabla de contenidos

- [Técnica 9.1 — Memoización (Top-Down DP)](#técnica-91--memoización-top-down-dp)
- [Técnica 9.2 — Tabulación (Bottom-Up DP)](#técnica-92--tabulación-bottom-up-dp)
- [Técnica 9.3 — Poda (Pruning / Backtracking)](#técnica-93--poda-pruning--backtracking)
- [Técnica 9.4 — Desenrollado con Stack Explícito](#técnica-94--desenrollado-con-stack-explícito)
- [Técnica 9.5 — Reducción Óptima (D&C mejorado)](#técnica-95--reducción-óptima-dc-mejorado)

---

## Técnica 9.1 — Memoización (Top-Down DP)

**Cuándo aplicar:** Cuando el árbol de llamadas tiene subproblemas que se repiten. Señal clara: el mismo argumento se calcula más de una vez.

**Mejora típica:** `O(2^n) → O(n)` en Fibonacci · `O(4^n) → O(n²)` en Catalan

**Complejidad:**

| Aspecto | Sin memo | Con memo |
|---|---|---|
| Fibonacci(40) | ~2^40 llamadas | 40 llamadas |
| Catalan(10) | millones | ~55 llamadas |
| Tiempo | exponencial | polinomial |
| Espacio | `O(n)` stack | `O(n)` stack + `O(n)` memo |

**Ejemplo en Python:**

```python
def fibonacci(n, memo={}):
    if n <= 1:
        return n
    if n in memo:           # si ya calculé esto, retorno directo
        return memo[n]
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

# Sin memo: fibonacci(40) ≈ 2^40 llamadas (~1 billón)
# Con memo: fibonacci(40) = exactamente 40 llamadas

# Alternativa con @lru_cache (Python 3.2+)
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_cache(n):
    if n <= 1:
        return n
    return fibonacci_cache(n - 1) + fibonacci_cache(n - 2)
```

---

### Ejercicio 9.1.1 — Fibonacci con contador de llamadas

**Enunciado:** Implementa ambas versiones de Fibonacci (con y sin memo) con un contador de llamadas. Compara el número exacto de llamadas para `n=35`.

**Restricciones:** `0 <= n <= 40`.

**Pista:** Usa una variable global o una lista mutable `[0]` como contador. ¿Cuántas veces se calcula `fib(2)` sin memo para `fib(10)`?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.1.2 — Catalan con memoización y contador

**Enunciado:** Implementa Catalan con memoización. Muestra el número de llamadas para `n=10` con y sin memo. Explica la diferencia.

**Restricciones:** `0 <= n <= 15`.

**Pista:** El estado a memorizar es simplemente `n`. Sin memo para `n=10`: más de 10 millones de llamadas. Con memo: exactamente 55.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.1.3 — Escalera de 3 pasos

**Enunciado:** Puedes subir `1`, `2` o `3` escalones a la vez. Dado `n`, ¿cuántas formas distintas hay de subir `n` escalones? Implementa con memoización.

**Restricciones:** `1 <= n <= 40`.

**Pista:** `f(n) = f(n-1) + f(n-2) + f(n-3)`. Tres casos base: `f(1)=1`, `f(2)=2`, `f(3)=4`. ¿Por qué `f(3)=4`?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.1.4 — Cuadrícula con obstáculos

**Enunciado:** Dada una cuadrícula `m x n` con obstáculos (marcados como `0`), cuenta cuántos caminos existen desde `(0,0)` hasta `(m-1,n-1)` moviéndote solo abajo o a la derecha.

**Restricciones:** `1 <= m, n <= 100`.

**Pista:** El estado es `(fila, columna)`. Si la celda es un obstáculo, retorna `0`. Memoriza el resultado para cada `(fila, columna)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.1.5 — Partición de conjunto

**Enunciado:** Dado un arreglo de enteros, determina si puede dividirse en dos subconjuntos de igual suma. Implementa con memoización.

**Restricciones:** `1 <= len(arr) <= 20`, `1 <= arr[i] <= 100`.

**Pista:** El estado es `(índice, suma_restante)`. Si `suma_total` es impar, retorna `False` inmediatamente.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 9.2 — Tabulación (Bottom-Up DP)

**Cuándo aplicar:** Cuando conoces el orden en que se necesitan los subproblemas y quieres eliminar completamente el call stack.

**Mejora típica:** Mismo tiempo que memoización, pero sin call stack. Puede optimizarse a `O(1)` espacio.

**Diferencia clave con memoización:**

```
Memoización (top-down):   fib(5) → fib(4) → fib(3) → ... → fib(0)
                          Resuelve lo que necesita, descarta el resto.

Tabulación (bottom-up):   fib(0) → fib(1) → fib(2) → ... → fib(5)
                          Resuelve todo en orden desde los casos base.
```

**Ejemplo en Python:**

```python
# Con tabla completa: O(n) espacio
def fibonacci(n):
    if n <= 1:
        return n
    tabla = [0] * (n + 1)
    tabla[0] = 0
    tabla[1] = 1
    for i in range(2, n + 1):
        tabla[i] = tabla[i-1] + tabla[i-2]
    return tabla[n]

# Optimizado a O(1) espacio (solo necesitamos los 2 anteriores):
def fibonacci_opt(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b

# La tabulación elimina el call stack completamente.
# No hay riesgo de RecursionError ni stack overflow.
```

---

### Ejercicio 9.2.1 — Fibonacci tabulado y optimizado

**Enunciado:** Implementa Fibonacci con tabla completa `O(n)`, luego optimiza a `O(1)` espacio guardando solo los dos últimos valores. Verifica que ambas versiones producen el mismo resultado.

**Restricciones:** `0 <= n <= 50`.

**Pista:** ¿Cuántos valores anteriores usa cada paso? Solo dos. ¿Necesitas guardar toda la tabla?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.2.2 — Monedas mínimas (tabulado)

**Enunciado:** Construye la tabla desde `monto=0` hasta `monto=objetivo`. `tabla[0]=0`. Para cada monto `i`, prueba cada moneda y toma el mínimo.

**Restricciones:** `1 <= len(monedas) <= 12`, `1 <= monto <= 10^4`.

**Pista:** `tabla[i] = min(tabla[i - moneda] + 1)` para cada moneda donde `moneda <= i`. Inicializa con infinito.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.2.3 — LCS tabulado

**Enunciado:** Implementa LCS con una matriz `(n+1) x (m+1)`. Si `s1[i]==s2[j]`: `tabla[i][j] = tabla[i-1][j-1] + 1`. Si no: `max(tabla[i-1][j], tabla[i][j-1])`.

**Restricciones:** `0 <= len(s1), len(s2) <= 100`.

**Pista:** Construye fila por fila. La fila y columna 0 se inicializan en `0` (strings vacíos).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.2.4 — Mochila tabulada

**Enunciado:** Matriz `(n+1) x (W+1)`. Para cada objeto decide incluir o no comparando el valor obtenido con y sin él.

**Restricciones:** `1 <= n <= 100`, `1 <= W <= 1000`.

**Pista:** `tabla[i][j] = max(tabla[i-1][j], valor[i] + tabla[i-1][j-peso[i]])` si `peso[i] <= j`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.2.5 — Catalan tabulado

**Enunciado:** Construye `C(0)` hasta `C(n)` usando la fórmula de sumatoria con los valores ya calculados en la tabla.

**Restricciones:** `0 <= n <= 15`.

**Pista:** Para cada `C(k)`: suma `C(i)*C(k-1-i)` para `i=0..k-1`, usando la tabla ya construida. Esto es tabulación pura.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 9.3 — Poda (Pruning / Backtracking)

**Cuándo aplicar:** Cuando el árbol de búsqueda explora caminos que claramente no llevarán a una solución válida.

**Mejora típica:** `O(2^n)` peor caso → `O(k)` práctico donde `k << 2^n`

**Principio:** La poda no mejora el peor caso teórico, pero en la práctica puede eliminar el 99% del árbol de búsqueda.

**Ejemplo en Python:**

```python
def subconjuntos_suma(arr, objetivo, actual=0, idx=0):
    if actual == objetivo:
        return True
    if actual > objetivo:        # PODA: ya superamos el objetivo
        return False             # no tiene sentido seguir sumando
    if idx == len(arr):
        return False

    # incluir arr[idx]
    if subconjuntos_suma(arr, objetivo, actual + arr[idx], idx + 1):
        return True
    # no incluir arr[idx]
    return subconjuntos_suma(arr, objetivo, actual, idx + 1)

# Sin poda: siempre explora 2^n ramas
# Con poda (arreglo ordenado): elimina ramas donde la suma ya excede el objetivo
```

---

### Ejercicio 9.3.1 — N-Reinas

**Enunciado:** Coloca `N` reinas en un tablero `NxN` de forma que ninguna se ataque. Retorna todas las soluciones válidas. Implementa con backtracking y poda.

**Restricciones:** `1 <= N <= 12`.

**Pista:** Coloca una reina por fila. Antes de colocar, verifica que la columna y ambas diagonales estén libres. Una columna atacada es poda inmediata.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.3.2 — Sudoku Solver

**Enunciado:** Dado un tablero de Sudoku parcialmente lleno, resuelve el puzzle. Los `0`s representan celdas vacías.

**Restricciones:** Tablero `9x9` estándar.

**Pista:** Para cada celda vacía, prueba los números `1-9`. Poda: si el número ya aparece en la misma fila, columna o bloque `3x3`, no lo intentes.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.3.3 — Subconjunto con suma objetivo

**Enunciado:** Dado un arreglo de enteros positivos ordenados y un objetivo, determina si existe un subconjunto cuya suma sea exactamente el objetivo. Implementa con poda.

**Restricciones:** `1 <= len(arr) <= 20`, `1 <= objetivo <= 1000`.

**Pista:** Si el arreglo está ordenado, cuando la suma parcial supere el objetivo puedes podar toda esa rama. ¿Por qué ordenar mejora la poda?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.3.4 — Combinaciones acotadas

**Enunciado:** Genera todas las combinaciones de `k` elementos de un arreglo de `n` elementos. Implementa poda para no explorar ramas que no pueden completar `k` elementos.

**Restricciones:** `1 <= k <= n <= 15`.

**Pista:** Si `(n - índice_actual) < (k - tamaño_actual)`, no hay suficientes elementos restantes para completar la combinación. Poda esa rama.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.3.5 — Coloreo de grafos

**Enunciado:** Dado un grafo y `m` colores, determina si es posible colorear todos los nodos de forma que ningún par de nodos adyacentes tenga el mismo color.

**Restricciones:** `1 <= nodos <= 10`, `1 <= m <= 4`.

**Pista:** Para cada nodo, prueba cada color. Poda: si el color ya fue asignado a algún vecino del nodo actual, no lo intentes.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 9.4 — Desenrollado con Stack Explícito

**Cuándo aplicar:** Cuando la profundidad de recursión puede causar stack overflow, o cuando necesitas control preciso sobre el orden de procesamiento.

**Mejora típica:** Misma complejidad `O(n)`, pero convierte el espacio implícito del call stack en espacio explícito controlado.

**Ejemplo en Python:**

```python
# Versión recursiva: puede causar RecursionError para n > ~1000
def collatz_rec(n):
    if n == 1:
        return [1]
    if n % 2 == 0:
        return [n] + collatz_rec(n // 2)
    return [n] + collatz_rec(n * 3 + 1)

# Versión con stack explícito: sin límite de profundidad
def collatz_iter(n):
    resultado = []
    while n != 1:              # el while simula el caso recursivo
        resultado.append(n)
        n = n // 2 if n % 2 == 0 else n * 3 + 1
    resultado.append(1)        # el append final simula el caso base
    return resultado

# Python tiene un límite de ~1000 llamadas recursivas por defecto.
# Puedes cambiarlo con sys.setrecursionlimit(n), pero no es recomendable.
```

---

### Ejercicio 9.4.1 — Collatz iterativo

**Enunciado:** Convierte la función Collatz recursiva en iterativa usando un bucle `while`. Verifica que ambas versiones producen el mismo resultado para `n=1` hasta `n=100`.

**Restricciones:** `1 <= n <= 10^6`.

**Pista:** El bucle `while` reemplaza la recursión. La condición de parada del `while` es el caso base de la recursión.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.4.2 — DFS iterativo con pila

**Enunciado:** Implementa DFS en un grafo usando una pila explícita en lugar de recursión. Compara el orden de visita con la versión recursiva.

**Restricciones:** `1 <= nodos <= 10^3`.

**Pista:** Empuja el nodo inicial a la pila. En cada iteración: saca el nodo del tope, márcalo como visitado y empuja sus vecinos no visitados.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.4.3 — Recorrido in-order iterativo

**Enunciado:** Implementa el recorrido in-order de un árbol binario (izquierda → raíz → derecha) de forma iterativa usando una pila explícita.

**Restricciones:** El árbol puede tener hasta `10^4` nodos.

**Pista:** Baja por la izquierda empujando nodos a la pila. Cuando no puedas bajar más, saca el tope, visítalo, y ve a la derecha.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.4.4 — Factorial con traza de pila

**Enunciado:** Simula el call stack del factorial con una pila explícita, mostrando cada push y pop en la consola.

**Restricciones:** `0 <= n <= 10`.

**Pista:** Push equivale a cada llamada recursiva. Pop equivale a cada retorno. Muestra el estado de la pila en cada paso para hacer visible lo que normalmente está oculto.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.4.5 — Torres de Hanoi iterativo

**Enunciado:** Implementa Torres de Hanoi de forma iterativa. Para `n` par, los movimientos cíclicos son `A→B`, `A→C`, `B→C`. Para `n` impar: `A→C`, `A→B`, `C→B`.

**Restricciones:** `1 <= n <= 15`.

**Pista:** El algoritmo iterativo alterna entre dos tipos de movimiento: mover el disco más pequeño siguiendo el patrón cíclico, y hacer el único movimiento válido restante.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 9.5 — Reducción Óptima (D&C mejorado)

**Cuándo aplicar:** Cuando puedes elegir cómo dividir el problema y una división más inteligente reduce la complejidad total.

**Mejora típica:** `O(n) → O(log n)` · `O(n²) → O(n^1.585)` con Karatsuba

**Principio:** No todas las divisiones son iguales. Dividir por 2 en lugar de restar 1 puede transformar un algoritmo `O(n)` en `O(log n)`.

**Ejemplo en Python:**

```python
# Potencia lenta: O(n) llamadas — resta 1 en cada paso
def potencia_lenta(base, n):
    if n == 0:
        return 1
    return base * potencia_lenta(base, n - 1)

# Potencia rápida: O(log n) llamadas — divide a la mitad
def potencia_rapida(base, n):
    if n == 0:
        return 1
    if n % 2 == 0:
        mitad = potencia_rapida(base, n // 2)
        return mitad * mitad          # CRÍTICO: no llamar dos veces
    return base * potencia_rapida(base, n - 1)

# potencia_lenta(2, 1000000) → 1,000,000 llamadas
# potencia_rapida(2, 1000000) → 20 llamadas (log2(1000000) ≈ 20)
```

---

### Ejercicio 9.5.1 — Potencia rápida con exponentes negativos

**Enunciado:** Extiende `potencia_rapida` para manejar exponentes negativos. `potencia(2, -3)` debe retornar `0.125`.

**Restricciones:** `-30 <= exp <= 30`.

**Pista:** Para `exp` negativo: retorna `1.0 / potencia_rapida(base, -exp)`. ¿Qué pasa si `base == 0` y `exp < 0`?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.5.2 — Multiplicación de Karatsuba

**Enunciado:** Implementa la multiplicación de Karatsuba. Dado `x = a*10^m + b` y `y = c*10^m + d`: `x*y = ac*10^2m + ((a+b)(c+d) - ac - bd)*10^m + bd`.

**Restricciones:** Los números pueden tener hasta `20` dígitos.

**Pista:** `m = max(len(str(x)), len(str(y))) // 2`. Calcula `ac`, `bd` y `(a+b)(c+d)` recursivamente. El término central es `(a+b)(c+d) - ac - bd`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.5.3 — Merge Sort vs Insertion Sort

**Enunciado:** Implementa ambos algoritmos y compara sus tiempos para arreglos aleatorios de tamaño `100`, `1000` y `10000`. ¿En qué punto Merge Sort supera a Insertion Sort?

**Restricciones:** Genera arreglos aleatorios con números entre `1` y `10000`.

**Pista:** Insertion Sort es `O(n²)` pero con menor overhead (constante oculta pequeña). Merge Sort es `O(n log n)` pero con mayor overhead. ¿Cuál es el punto de cruce?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.5.4 — Quick Select

**Enunciado:** Dado un arreglo y `k`, encuentra el `k`-ésimo elemento más pequeño en `O(n)` promedio usando partición.

**Restricciones:** `1 <= k <= len(arr) <= 10^5`.

**Pista:** Elige un pivote y particiona. Si la posición del pivote es `k-1`, retórnalo. Si es mayor, busca en la izquierda. Si es menor, busca en la derecha.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 9.5.5 — Inversiones en un arreglo

**Enunciado:** Cuenta cuántos pares `(i,j)` existen donde `i<j` pero `arr[i]>arr[j]`. Usa Merge Sort modificado para hacerlo en `O(n log n)`.

**Restricciones:** `1 <= len(arr) <= 10^5`.

**Pista:** Durante la fusión del Merge Sort, cuando tomas un elemento del subarreglo derecho, cuenta cuántos elementos del izquierdo quedan (todos son mayores que él).

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Técnicas de optimización recursiva

| Técnica | Mejora tiempo | Mejora espacio | Cuándo usarla |
|---|---|---|---|
| Memoización | `O(2^n) → O(n)` | igual | Subproblemas que se repiten |
| Tabulación | igual que memo | `O(n) → O(1)*` | Orden conocido de subproblemas |
| Poda | `O(2^n) → O(k)`** | igual | Backtracking con condiciones |
| Stack Explícito | igual | sin overflow | Profundidad > límite del runtime |
| Reducción Óptima | `O(n) → O(log n)` | igual | División más inteligente |

> `*` Con optimización rolling array (guardar solo el paso anterior).
>
> `**` La poda no mejora el peor caso teórico, pero en la práctica puede ser órdenes de magnitud mejor.
