# Guía de Ejercicios — Técnicas de Reducción de Complejidad

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `02_optimizacion_recursiva.md`.

---

## Contexto

La corrección y la eficiencia son **propiedades independientes**. Una solución puede pasar todos los tests y ser completamente correcta, pero inaceptable para `n` grande.

```
Catalan sin memo (n=20):    ~10^9 operaciones  → no viable
Catalan con memo (n=20):    ~200 operaciones   → viable

Intersección con lista:     O(n²) → TLE en n=10^5
Intersección con set:       O(n)  → pasa en milisegundos
```

**Tabla de señales y soluciones:**

| Señal en el código | Técnica a aplicar | Mejora típica |
|---|---|---|
| Bucle anidado buscando en lista | Cambiar lista por set/dict | `O(n²) → O(n)` |
| Suma de subarray recalculada N veces | Ventana deslizante o Prefix Sum | `O(n·k) → O(n)` |
| Dos elementos con condición en arr. ordenado | Dos punteros | `O(n²) → O(n)` |
| Búsqueda lineal repetida en datos fijos | Ordenar + búsqueda binaria | `O(n·m) → O((n+m)log n)` |
| Próximo mayor/menor para cada elemento | Pila monótona | `O(n²) → O(n)` |
| Múltiples consultas de rango | Prefix sum | `O(n)×m → O(1)×m` |
| Cálculo idéntico dentro del bucle | Precalcular fuera del bucle | Constante oculta |

---

## Tabla de contenidos

- [Técnica 10.1 — Cambio de Estructura de Datos](#técnica-101--cambio-de-estructura-de-datos)
- [Técnica 10.2 — Dos Punteros (Two Pointers)](#técnica-102--dos-punteros-two-pointers)
- [Técnica 10.3 — Ventana Deslizante (Sliding Window)](#técnica-103--ventana-deslizante-sliding-window)
- [Técnica 10.4 — Prefix Sums (Sumas Prefijas)](#técnica-104--prefix-sums-sumas-prefijas)
- [Técnica 10.5 — Eliminar Trabajo Redundante](#técnica-105--eliminar-trabajo-redundante)
- [Técnica 10.6 — Ordenar Primero + Búsqueda Binaria](#técnica-106--ordenar-primero--búsqueda-binaria)
- [Técnica 10.7 — Pila Monótona (Monotonic Stack)](#técnica-107--pila-monótona-monotonic-stack)

---

## Técnica 10.1 — Cambio de Estructura de Datos

**Cuándo aplicar:** Cuando una operación costosa (búsqueda `O(n)` en lista) se repite dentro de un bucle. Cambiar a `set` o `dict` reduce la búsqueda a `O(1)`.

**Mejora típica:** `O(n²) → O(n)`

**Tabla comparativa de operaciones:**

| Operación | Lista | Set / Dict | Heap | BST |
|---|---|---|---|---|
| Búsqueda | `O(n)` | `O(1)` | `O(n)` | `O(log n)` |
| Inserción al final | `O(1)` | `O(1)` | `O(log n)` | `O(log n)` |
| Inserción en pos. | `O(n)` | — | — | — |
| Eliminar elemento | `O(n)` | `O(1)` | `O(log n)` | `O(log n)` |
| Mínimo / Máximo | `O(n)` | `O(n)` | `O(1)` | `O(log n)` |

**Ejemplo en Python:**

```python
# O(n²): búsqueda lineal en lista por cada elemento de a
def intersection(a, b):
    return [x for x in a if x in b]    # O(n) por cada x → O(n²) total

# O(n): convierte b a set primero
def intersection_opt(a, b):
    b_set = set(b)                      # O(n) una sola vez
    return [x for x in a if x in b_set]  # O(1) por búsqueda → O(n) total

# Para n=100000:
# intersection:     ~10^10 operaciones → minutos
# intersection_opt: ~2*10^5 operaciones → milisegundos
```

---

### Ejercicio 10.1.1 — Intersección de arreglos

**Enunciado:** Dado dos arreglos, retorna los elementos que aparecen en ambos. Primero implementa `O(n²)` con lista, luego `O(n)` con set. Mide la diferencia para `n=10^5`.

**Restricciones:** `1 <= len(a), len(b) <= 10^5`.

**Pista:** Convierte el arreglo más pequeño a set para las búsquedas. Si `len(a) < len(b)`, convierte `a`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.1.2 — Dos sumas

**Enunciado:** Dado un arreglo y un objetivo, retorna los índices de dos elementos que sumen exactamente el objetivo. Implementa `O(n²)` y luego `O(n)` con dict.

**Restricciones:** `2 <= len(arr) <= 10^5`. Existe exactamente una solución.

**Pista:** Para cada elemento `x`, busca `(objetivo - x)` en el dict. Si está, retorna ambos índices. Si no, agrega `x` al dict con su índice.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.1.3 — Primer carácter no repetido

**Enunciado:** Dado un string, retorna el índice del primer carácter que aparece exactamente una vez. Retorna `-1` si todos se repiten.

**Restricciones:** `1 <= len(s) <= 10^5`. Solo letras minúsculas.

**Pista:** Primera pasada: cuenta frecuencias con dict. Segunda pasada: retorna el índice del primero con frecuencia `1`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.1.4 — Agrupar anagramas

**Enunciado:** Dado un arreglo de strings, agrupa los que son anagramas entre sí. Por ejemplo, `["eat","tea","tan","ate","nat","bat"]` → `[["eat","tea","ate"],["tan","nat"],["bat"]]`.

**Restricciones:** `1 <= len(arr) <= 10^4`, `1 <= len(s) <= 100`.

**Pista:** Clave del dict: string ordenado alfabéticamente. Todos los anagramas tienen la misma clave ordenada.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.1.5 — Número más frecuente en ventana

**Enunciado:** Dado un arreglo y tamaño `k`, para cada ventana de tamaño `k` retorna el elemento más frecuente en esa ventana.

**Restricciones:** `1 <= k <= len(arr) <= 10^4`.

**Pista:** Mantén un dict de conteos actualizado a medida que la ventana avanza: agrega `arr[i]` y elimina `arr[i-k]`. Para el máximo, considera usar un heap o `Counter`.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 10.2 — Dos Punteros (Two Pointers)

**Cuándo aplicar:** Cuando buscas pares o subconjuntos en arreglos **ordenados** con alguna condición. Elimina el bucle anidado `O(n²)`.

**Mejora típica:** `O(n²) → O(n)`

**Requisito:** El arreglo debe estar ordenado, o debe existir una propiedad monótona que permita decidir si mover el puntero izquierdo o el derecho.

**Ejemplo en Python:**

```python
# O(n²): doble bucle — prueba todos los pares
def par_suma(arr, objetivo):
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] + arr[j] == objetivo:
                return (arr[i], arr[j])
    return None

# O(n): dos punteros — requiere arreglo ordenado
def par_suma_opt(arr, objetivo):
    izq, der = 0, len(arr) - 1
    while izq < der:
        suma = arr[izq] + arr[der]
        if suma == objetivo:
            return (arr[izq], arr[der])
        elif suma < objetivo:
            izq += 1    # necesitamos una suma mayor → mueve izquierdo
        else:
            der -= 1    # necesitamos una suma menor → mueve derecho
    return None

# El razonamiento clave: como el arreglo está ordenado,
# si la suma es pequeña, aumentar arr[izq] aumenta la suma.
# Si es grande, disminuir arr[der] la reduce.
```

---

### Ejercicio 10.2.1 — Par con suma objetivo

**Enunciado:** Dado arreglo ordenado y objetivo, retorna el par que suma exactamente el objetivo. Implementa `O(n²)` y luego `O(n)` con dos punteros.

**Restricciones:** `2 <= len(arr) <= 10^5`. Arreglo ordenado.

**Pista:** Si `suma < objetivo`, mueve el izquierdo. Si `suma > objetivo`, mueve el derecho.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.2.2 — Tripleta con suma cero

**Enunciado:** Dado un arreglo, retorna todas las tripletas únicas que sumen `0`. Por ejemplo, `[-1,0,1,2,-1,-4]` → `[[-1,-1,2],[-1,0,1]]`.

**Restricciones:** `3 <= len(arr) <= 3000`.

**Pista:** Ordena primero. Fija el primer elemento con un bucle. Para los dos restantes usa dos punteros. Salta elementos iguales para evitar duplicados.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.2.3 — Contenedor de más agua

**Enunciado:** Dado un arreglo de alturas, encuentra dos alturas que formen el contenedor con mayor área. El área es `min(arr[i], arr[j]) * (j - i)`.

**Restricciones:** `2 <= len(arr) <= 10^5`.

**Pista:** Empieza con los punteros en los extremos. Mueve el puntero del lado **más bajo** (mover el más alto solo puede disminuir el área).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.2.4 — Palíndromo con una eliminación

**Enunciado:** ¿Es posible eliminar como máximo un carácter de `s` para que sea palíndromo? Retorna `True` o `False`.

**Restricciones:** `1 <= len(s) <= 10^5`.

**Pista:** Cuando los caracteres de los extremos difieren, prueba eliminar el izquierdo **o** el derecho, y verifica si el resultado es palíndromo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.2.5 — Subarray mínimo con suma >= objetivo

**Enunciado:** Encuentra la longitud del subarray contiguo más corto cuya suma sea `>= objetivo`. Retorna `0` si no existe.

**Restricciones:** `1 <= len(arr) <= 10^5`. Todos los elementos son positivos.

**Pista:** Ventana variable con dos punteros. Expande el derecho hasta alcanzar el objetivo. Luego contrae el izquierdo al máximo mientras se mantenga `>= objetivo`.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 10.3 — Ventana Deslizante (Sliding Window)

**Cuándo aplicar:** Cuando necesitas calcular algo sobre todos los subarreglos/substrings de tamaño `k`, o de tamaño variable con alguna condición de validez.

**Mejora típica:** `O(n·k) → O(n)`

**Principio:** En lugar de recalcular desde cero para cada posición, actualiza incrementalmente: **agrega el nuevo elemento y elimina el que sale**.

**Ejemplo en Python:**

```python
# O(n·k): recalcula la suma desde cero en cada posición
def max_suma_k(arr, k):
    max_s = 0
    for i in range(len(arr) - k + 1):
        max_s = max(max_s, sum(arr[i:i+k]))   # O(k) por posición → O(n·k)
    return max_s

# O(n): ventana deslizante — actualiza incrementalmente
def max_suma_k_opt(arr, k):
    suma = sum(arr[:k])          # calcula la primera ventana O(k) una sola vez
    max_s = suma
    for i in range(k, len(arr)):
        suma += arr[i] - arr[i - k]    # entra arr[i], sale arr[i-k]
        max_s = max(max_s, suma)
    return max_s

# Ventanas de tamaño fijo: suma, promedio, máximo
# Ventanas variables: más largo sin repetidos, mínimo que cumple condición
```

---

### Ejercicio 10.3.1 — Máxima suma de subarray de tamaño k

**Enunciado:** Implementa `O(n·k)` con `sum()` y luego `O(n)` con ventana deslizante. Mide la diferencia para `len=10^5`, `k=1000`.

**Restricciones:** `1 <= k <= len(arr) <= 10^5`.

**Pista:** La ventana agrega `arr[i]` y elimina `arr[i-k]` en cada paso. El cálculo inicial de la primera ventana es `O(k)` pero se hace solo una vez.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.3.2 — Substring más larga sin caracteres repetidos

**Enunciado:** Dado un string, retorna la longitud del substring más largo que no contenga caracteres repetidos.

**Restricciones:** `0 <= len(s) <= 5*10^4`.

**Pista:** Ventana variable. Expande el puntero derecho. Cuando encuentras un carácter repetido, contrae el izquierdo hasta eliminarlo. Usa un set o dict para rastrear los caracteres en la ventana.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.3.3 — Anagramas en string

**Enunciado:** Dado `s` y `p`, retorna todos los índices de inicio donde un anagrama de `p` empieza en `s`.

**Restricciones:** `1 <= len(s), len(p) <= 3*10^4`.

**Pista:** Ventana de tamaño `len(p)`. Compara el contador de caracteres de la ventana actual con el de `p`. Actualiza el contador al deslizar.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.3.4 — Producto máximo de subarray

**Enunciado:** Encuentra el subarray contiguo con el mayor producto. Cuidado con los negativos: dos negativos multiplicados son positivos.

**Restricciones:** `1 <= len(arr) <= 2*10^4`. Valores entre `-10` y `10`.

**Pista:** Mantén tanto el **máximo** como el **mínimo** producto hasta la posición actual. El mínimo puede volverse el máximo al multiplicarse por un negativo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.3.5 — Ventana mínima con todos los caracteres

**Enunciado:** Dado `s` y `t`, encuentra el substring mínimo de `s` que contenga todos los caracteres de `t` (incluyendo duplicados).

**Restricciones:** `1 <= len(s), len(t) <= 10^5`.

**Pista:** Expande el derecho hasta tener todos los chars de `t`. Luego contrae el izquierdo al máximo sin perder ninguno. Registra la ventana mínima encontrada.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 10.4 — Prefix Sums (Sumas Prefijas)

**Cuándo aplicar:** Cuando necesitas responder múltiples consultas de suma sobre rangos de un arreglo. Precalcular una vez permite responder en `O(1)`.

**Mejora típica:** `O(n)` por consulta → `O(1)` por consulta (tras `O(n)` de precálculo)

**Ejemplo en Python:**

```python
# O(n) por consulta: sin precálculo
def suma_rango_lenta(arr, izq, der):
    return sum(arr[izq:der+1])      # O(n) cada vez que se llama

# O(1) por consulta: con prefix sum
def construir_prefix(arr):
    prefix = [0] * (len(arr) + 1)
    for i in range(len(arr)):
        prefix[i+1] = prefix[i] + arr[i]
    return prefix
    # prefix[i] = suma de arr[0..i-1]
    # prefix[0] = 0 (arreglo vacío)
    # prefix[1] = arr[0]
    # prefix[2] = arr[0] + arr[1]
    # ...

def suma_rango(prefix, izq, der):
    return prefix[der+1] - prefix[izq]    # O(1)

# Ejemplo:
# arr    = [3, 1, 4, 1, 5, 9]
# prefix = [0, 3, 4, 8, 9, 14, 23]
# suma(1, 3) = prefix[4] - prefix[1] = 9 - 3 = 6 ✓ (1+4+1)
```

---

### Ejercicio 10.4.1 — Suma de rango con múltiples consultas

**Enunciado:** Dado un arreglo y `m` consultas `(izq, der)`, responde cada suma en `O(1)` con prefix sum. Compara con la versión sin precálculo para `m=10^4` consultas.

**Restricciones:** `1 <= len(arr) <= 10^5`, `1 <= m <= 10^4`.

**Pista:** Construye el prefix una vez. Cada consulta: `prefix[der+1] - prefix[izq]`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.4.2 — Subarray con suma igual a k

**Enunciado:** Cuenta cuántos subarreglos contiguos tienen suma exactamente `k`. Usa prefix sum con un diccionario de frecuencias.

**Restricciones:** `1 <= len(arr) <= 2*10^4`. Los elementos pueden ser negativos.

**Pista:** Si `prefix[j] - prefix[i] = k`, entonces `arr[i..j-1]` tiene suma `k`. Cuenta cuántos `prefix[i] = prefix[j] - k` existen para cada `j`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.4.3 — Prefix sum 2D

**Enunciado:** Dada una matriz, responde consultas de suma rectangular `(r1,c1,r2,c2)` en `O(1)`. La suma incluye todos los elementos en ese rectángulo.

**Restricciones:** Matriz hasta `300×300`, hasta `10^4` consultas.

**Pista:** `prefix[i][j]` = suma del rectángulo `(0,0)` a `(i-1,j-1)`. Para consultar: `prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.4.4 — Equilibrio de arreglo

**Enunciado:** Encuentra el índice `i` donde la suma de los elementos a la izquierda es igual a la suma a la derecha. Retorna `-1` si no existe.

**Restricciones:** `1 <= len(arr) <= 10^4`.

**Pista:** Usa prefix sum. Para índice `i`: izquierda = `prefix[i]`, derecha = `prefix[n] - prefix[i+1]`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.4.5 — Subarreglos con promedio >= k

**Enunciado:** Cuenta subarreglos de longitud `>= 2` cuyo promedio sea `>= k`.

**Restricciones:** `1 <= len(arr) <= 10^4`, `1 <= k <= 100`.

**Pista:** Resta `k` a todos los elementos. Ahora busca subarreglos de longitud `>= 2` con suma `>= 0`. Usa prefix sum.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 10.5 — Eliminar Trabajo Redundante

**Cuándo aplicar:** Cuando calculas lo mismo más de una vez dentro de un bucle: `len()`, hash de un string, una expresión constante, un `sort()`, un `regex.compile()`, etc.

**Mejora típica:** Reduce la constante oculta del Big O. A veces transforma `O(n·k)` en `O(n)`.

**Ejemplo en Python:**

```python
# Trabajo redundante: el slice s[i:i+k] crea un string nuevo cada vez
def buscar_patron(texto, patron):
    for i in range(len(texto)):
        if texto[i:i+len(patron)] == patron:   # len(patron) recalculado
            return i
    return -1

# Optimizado: precalcula lo que no cambia fuera del bucle
def buscar_patron_opt(texto, patron):
    n = len(texto)
    k = len(patron)       # calcula una vez
    for i in range(n - k + 1):
        if texto[i:i+k] == patron:    # k es constante
            return i
    return -1

# Otros casos comunes:
# - sorted() dentro del bucle → ordenar fuera
# - re.compile(pattern) dentro del bucle → compilar fuera
# - dict.keys() dentro del bucle → convertir a set fuera
```

---

### Ejercicio 10.5.1 — Detección de duplicados optimizada

**Enunciado:** Implementa primero `O(n²)` con doble bucle y búsqueda en lista. Luego `O(n)` con set. Mide la diferencia para `n=10^4`.

**Restricciones:** `1 <= len(arr) <= 10^5`.

**Pista:** El set permite búsqueda `O(1)`. Agrega a medida que recorres y verifica si ya existe antes de agregar.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.5.2 — Ordenar y eliminar duplicados

**Enunciado:** Dado un arreglo con posibles duplicados, retorna un arreglo ordenado sin duplicados. Implementa con `sorted()` precalculado. ¿Cuántas comparaciones ahorra?

**Restricciones:** `1 <= len(arr) <= 10^5`.

**Pista:** Una sola pasada por el arreglo ya ordenado elimina duplicados eficientemente (compara cada elemento con el anterior).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.5.3 — Búsqueda de patrón con precálculo

**Enunciado:** Dado un texto y un patrón, cuenta cuántas veces aparece el patrón. Implementa la versión naive `O(n·m)` y luego identifica y elimina el trabajo redundante.

**Restricciones:** `1 <= len(texto) <= 10^5`, `1 <= len(patron) <= 100`.

**Pista:** Precalcula `len(patron)` y el hash del patrón fuera del bucle. Para un paso más, investiga el algoritmo KMP que elimina trabajo redundante estructuralmente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.5.4 — Verificar isomorfismo de strings

**Enunciado:** Dos strings son isomorfos si los caracteres de `s` pueden reemplazarse consistentemente para obtener `t`. Implementa en `O(n)` con dos dicts.

**Restricciones:** `1 <= len(s) = len(t) <= 5*10^4`.

**Pista:** Mapea `s→t` y `t→s` simultáneamente. Si `s[i]` ya fue mapeado a algo distinto de `t[i]`, no son isomorfos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.5.5 — Tres sumas más cercana a objetivo

**Enunciado:** Dado arreglo y objetivo, encuentra la tripleta cuya suma esté más cerca del objetivo. Implementa `O(n³)` naive, luego `O(n²)` ordenando y usando dos punteros.

**Restricciones:** `3 <= len(arr) <= 1000`.

**Pista:** Ordena primero. Fija el primero con un bucle. Los dos restantes con dos punteros, actualizando la mejor suma cuando te acercas al objetivo.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 10.6 — Ordenar Primero + Búsqueda Binaria

**Cuándo aplicar:** Cuando haces múltiples búsquedas sobre un arreglo fijo. El costo de ordenar una vez se amortiza cuando hay muchas consultas.

**Mejora típica:** `O(n·m) → O(n log n + m log n)`

**Análisis de rentabilidad:**

```
Sin ordenar: O(n) por búsqueda × m consultas = O(n·m)
Con ordenar: O(n log n) + O(log n) × m = O((n+m) log n)

¿Cuándo conviene?
  O(n·m) > O((n+m) log n)
  Si m > log n → conviene casi siempre para m grande
```

**Ejemplo en Python:**

```python
import bisect

# O(n·m): búsqueda lineal para cada consulta
def buscar_todos_lento(arr, consultas):
    return [x in arr for x in consultas]    # O(n) por consulta

# O(n log n + m log n): ordenar una vez, búsqueda binaria para cada consulta
def buscar_todos_opt(arr, consultas):
    arr_ord = sorted(arr)                    # O(n log n) una sola vez
    resultados = []
    for x in consultas:                      # O(m log n) total
        pos = bisect.bisect_left(arr_ord, x)
        encontrado = pos < len(arr_ord) and arr_ord[pos] == x
        resultados.append(encontrado)
    return resultados
```

---

### Ejercicio 10.6.1 — Búsqueda múltiple optimizada

**Enunciado:** Dado un arreglo y `m` consultas de búsqueda, implementa `O(n·m)` con búsqueda lineal y luego `O(n log n + m log n)` con `bisect`.

**Restricciones:** `1 <= len(arr) <= 10^4`, `1 <= m <= 10^4`.

**Pista:** `bisect.bisect_left(arr, x)` retorna la posición donde `x` se insertaría. Verifica si el elemento en esa posición es exactamente `x`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.6.2 — Elemento más cercano

**Enunciado:** Para cada consulta `q`, encuentra el elemento del arreglo más cercano a `q` (el que minimiza `|arr[i] - q|`).

**Restricciones:** `1 <= len(arr) <= 10^4`, `1 <= m <= 10^4`.

**Pista:** Ordena una vez. Para cada consulta, `bisect_left` da el punto de inserción. El más cercano es el vecino izquierdo o derecho del punto de inserción.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.6.3 — Contar elementos en rango

**Enunciado:** Para cada consulta `(a, b)`, cuenta cuántos elementos del arreglo están en el rango `[a, b]` inclusive.

**Restricciones:** `1 <= len(arr) <= 10^5`, `1 <= m <= 10^4`.

**Pista:** `bisect.bisect_right(arr, b) - bisect.bisect_left(arr, a)` da el conteo en `O(log n)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.6.4 — k elementos más cercanos a x

**Enunciado:** Dado un arreglo ordenado y un valor `x`, retorna los `k` elementos más cercanos a `x`.

**Restricciones:** `1 <= k <= len(arr) <= 10^4`.

**Pista:** Encuentra la posición de `x` con búsqueda binaria. Luego expande con dos punteros desde esa posición hacia ambos lados, tomando el más cercano en cada paso.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.6.5 — Inserción manteniendo orden

**Enunciado:** Dado un arreglo ordenado y una secuencia de `m` inserciones, mantén el arreglo ordenado. Compara `bisect.insort` (una inserción a la vez) con re-ordenar en cada inserción.

**Restricciones:** `1 <= len(inicial) <= 10^3`, `1 <= m <= 10^4`.

**Pista:** `bisect.insort(arr, x)` inserta en `O(log n)` búsqueda + `O(n)` desplazamiento. Re-ordenar es `O(n log n)` por inserción. ¿Cuál es el costo total de `m` inserciones en cada caso?

**Implementar en:** Python · Java · Go · C# · Rust

---

## Técnica 10.7 — Pila Monótona (Monotonic Stack)

**Cuándo aplicar:** Cuando necesitas encontrar el **próximo mayor**, **próximo menor**, o similar para cada elemento del arreglo. La pila monótona reemplaza el doble bucle `O(n²)`.

**Mejora típica:** `O(n²) → O(n)`

**Principio:** Se mantiene una pila donde los elementos están siempre en orden monótono (creciente o decreciente). Cuando se rompe el orden, se procesan los elementos que salen.

**Ejemplo en Python:**

```python
# O(n²): doble bucle para cada elemento
def proximo_mayor_lento(arr):
    res = [-1] * len(arr)
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[j] > arr[i]:
                res[i] = arr[j]
                break
    return res

# O(n): pila monótona decreciente
def proximo_mayor(arr):
    res = [-1] * len(arr)
    pila = []                    # guarda índices (no valores)
    for i in range(len(arr)):
        # mientras el tope sea menor que el actual
        while pila and arr[pila[-1]] < arr[i]:
            idx = pila.pop()
            res[idx] = arr[i]    # arr[i] ES el próximo mayor de idx
        pila.append(i)
    return res
    # Nota: elementos que quedan en la pila al final no tienen próximo mayor → -1

# Clave: cada elemento entra y sale de la pila exactamente una vez → O(n) total
```

---

### Ejercicio 10.7.1 — Próximo mayor elemento

**Enunciado:** Para cada elemento del arreglo, retorna el próximo elemento mayor a su derecha. Si no existe, retorna `-1`. Implementa `O(n²)` y `O(n)` con pila monótona.

**Restricciones:** `1 <= len(arr) <= 10^5`.

**Pista:** Pila monótona decreciente. Cuando el actual es mayor que el tope, el actual es el próximo mayor del tope.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.7.2 — Temperaturas diarias

**Enunciado:** Dado un arreglo de temperaturas diarias, para cada día retorna cuántos días hay que esperar para tener una temperatura más alta. `0` si nunca ocurre.

**Restricciones:** `1 <= len(temps) <= 10^5`.

**Pista:** Versión del próximo mayor, pero guarda la diferencia de índices en lugar del valor. `resultado[idx] = i - idx`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.7.3 — Histograma: mayor rectángulo

**Enunciado:** Dado un histograma (arreglo de alturas de barras), encuentra el área del mayor rectángulo que puedes formar.

**Restricciones:** `1 <= len(alturas) <= 10^5`.

**Pista:** Pila monótona creciente. Cuando la barra actual es menor que el tope, calcula el área del rectángulo con la altura del tope y el ancho entre el nuevo tope y la posición actual.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.7.4 — Trampas de lluvia

**Enunciado:** Dado un arreglo de alturas de paredes, calcula cuánta agua puede acumularse entre las paredes después de llover.

**Restricciones:** `1 <= len(arr) <= 3*10^4`.

**Pista:** Dos enfoques igualmente válidos: (1) Pila monótona. (2) Dos punteros: el agua en posición `i` = `min(max_izq, max_der) - arr[i]`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.7.5 — String más pequeño con paréntesis balanceados

**Enunciado:** Dado un string con letras y paréntesis, elimina el mínimo número de paréntesis para que los restantes estén balanceados. Retorna el string resultante.

**Restricciones:** `1 <= len(s) <= 10^5`.

**Pista:** Usa una pila para trackear los índices de paréntesis no balanceados. Los índices que queden en la pila al final son los paréntesis a eliminar.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Técnicas de reducción de complejidad

| Técnica | Big O antes | Big O después | Requisito |
|---|---|---|---|
| Cambio de estructura | `O(n²)` | `O(n)` | Operación repetida en bucle |
| Dos punteros | `O(n²)` | `O(n)` | Arreglo ordenado o propiedad monótona |
| Ventana deslizante | `O(n·k)` | `O(n)` | Subarreglos/substrings contiguos |
| Prefix sum | `O(n)` por consulta | `O(1)` por consulta | Consultas de suma en rangos |
| Elim. trabajo redund. | `O(n·k)` | `O(n)` | Cálculo constante en bucle |
| Ordenar + bin. search | `O(n·m)` | `O((n+m)log n)` | Múltiples búsquedas en datos fijos |
| Pila monótona | `O(n²)` | `O(n)` | Próximo mayor/menor para cada elemento |

---

## Tabla resumen final — Todas las técnicas

| Categoría | Técnica | Mejora típica | Señal clave |
|---|---|---|---|
| **Tipo de recursión** | Lineal Simple | base | Una llamada recursiva |
| | Múltiples Casos Base | base | 2+ condiciones de parada |
| | Múltiples Llamadas | base | 2+ llamadas por caso → subproblemas solapados |
| | Por Paridad | `O(n) → O(log n)` | Reduce a la mitad |
| | Cola con Acumulador | `O(n) espacio → O(1)*` | Pasar resultado hacia adelante |
| **Opt. recursiva** | Memoización | `O(2^n) → O(n)` | Subproblemas que se repiten |
| | Tabulación | igual tiempo, -stack | Orden conocido |
| | Poda | `O(2^n) → O(k)` práctico | Backtracking con condiciones |
| | Stack Explícito | -overflow | Profundidad > límite |
| | Reducción Óptima | `O(n) → O(log n)` | División más inteligente |
| **Red. complejidad** | Cambio estructura | `O(n²) → O(n)` | Búsqueda en bucle |
| | Dos Punteros | `O(n²) → O(n)` | Pares en arr. ordenado |
| | Ventana Deslizante | `O(n·k) → O(n)` | Subarreglos contiguos |
| | Prefix Sum | `O(n) → O(1)` consulta | Consultas de rango |
| | Elim. Redundancia | constante menor | Cálculo repetido |
| | Ordenar + Bin. Search | `O(n·m) → O((n+m)log n)` | Muchas búsquedas |
| | Pila Monótona | `O(n²) → O(n)` | Próximo mayor/menor |

> `*` O(1) espacio solo con TCO. Python, Java, Go y C# no aplican TCO en el caso general.
