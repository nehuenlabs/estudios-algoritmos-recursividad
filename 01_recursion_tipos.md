# Guía de Ejercicios — Tipos de Recursión

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Regla: no uses IA para generar soluciones. El objetivo es comprensión profunda de cada patrón.

---

## Tabla de contenidos

- [Sección 1 — Recursión Lineal Simple](#sección-1--recursión-lineal-simple)
- [Sección 2 — Recursión con Múltiples Casos Base](#sección-2--recursión-con-múltiples-casos-base)
- [Sección 3 — Recursión con Múltiples Llamadas Recursivas](#sección-3--recursión-con-múltiples-llamadas-recursivas)
- [Sección 4 — Recursión por Paridad](#sección-4--recursión-por-paridad)
- [Sección 5 — Recursión de Cola con Acumulador](#sección-5--recursión-de-cola-con-acumulador)
- [Sección 6 — Programación Dinámica](#sección-6--programación-dinámica)
- [Sección 7 — Divide y Vencerás](#sección-7--divide-y-vencerás)
- [Sección 8 — Árboles y Grafos](#sección-8--árboles-y-grafos)

---

## Sección 1 — Recursión Lineal Simple

**Complejidad:** `O(n)` tiempo · `O(n)` espacio (call stack)

**Descripción:** La función se llama exactamente una vez por paso, reduciendo el problema en una unidad (o constante) hacia el caso base. Es el equivalente recursivo de un bucle `while`.

**Tip:** Identifica UN caso base y UNA llamada recursiva que reduzca el argumento. Si tienes dos llamadas recursivas, no es recursión lineal.

**Complejidades detalladas:**

| Notación | Valor | Significado |
|---|---|---|
| Big O | `O(n)` | Peor caso: n llamadas |
| Omega Ω | `Ω(1)` | Mejor caso: caso base inmediato |
| Theta Θ | `Θ(n)` | Caso promedio |
| Espacio | `O(n)` | n frames en el call stack |

---

### Ejercicio 1.1 — Suma de dígitos

**Enunciado:** Dado un entero positivo `n`, implementa una función recursiva que retorne la suma de sus dígitos. Por ejemplo, `suma_digitos(1234) = 1+2+3+4 = 10`.

**Restricciones:** `1 <= n <= 10^9`. No se permite convertir a string.

**Pista:** ¿Cómo obtener el último dígito de `n` con el operador módulo? ¿Cómo reducir `n` para la siguiente llamada?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 1.2 — Potencia entera

**Enunciado:** Implementa una función recursiva que calcule `base^exp` sin usar el operador `**`. Por ejemplo, `potencia(2, 8) = 256`.

**Restricciones:** `0 <= exp <= 30`. `base` puede ser cualquier entero.

**Pista:** ¿Cuál es el caso base cuando `exp == 0`? El caso recursivo multiplica `base` por `potencia(base, exp-1)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 1.3 — Contar ocurrencias

**Enunciado:** Dado un arreglo de enteros y un objetivo, implementa recursivamente una función que cuente cuántas veces aparece el objetivo en el arreglo.

**Restricciones:** `0 <= len(arr) <= 10^4`. Los valores pueden ser cualquier entero.

**Pista:** Procesa el primer elemento y llama recursivamente con el resto del arreglo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 1.4 — Es palíndromo

**Enunciado:** Dado un string, implementa recursivamente una función que determine si es un palíndromo. Por ejemplo, `'radar'` es palíndromo, `'python'` no lo es.

**Restricciones:** `0 <= len(s) <= 1000`. Solo caracteres ASCII.

**Pista:** Compara el primer y último carácter. Si son iguales, llama recursivamente con el string sin esos extremos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 1.5 — Máximo de una lista

**Enunciado:** Dado un arreglo de enteros no vacío, implementa recursivamente una función que retorne el valor máximo del arreglo sin usar la función `max()` nativa.

**Restricciones:** `1 <= len(arr) <= 10^4`.

**Pista:** Compara el primer elemento con el máximo del resto del arreglo.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 2 — Recursión con Múltiples Casos Base

**Complejidad:** `O(2^n)` sin memoización · Se reduce significativamente con memo

**Descripción:** Existen dos o más condiciones de parada independientes. Cada caso base representa una situación límite distinta del problema.

**Tip:** Antes de escribir el caso recursivo, identifica TODAS las condiciones donde el problema se resuelve directamente. Un error común es olvidar uno de los casos base.

**Complejidades detalladas:**

| Notación | Valor | Significado |
|---|---|---|
| Big O | `O(2^n)` | Sin memoización, árbol binario completo |
| Omega Ω | `Ω(2^n)` | Siempre exponencial sin memo |
| Theta Θ | `Θ(2^n)` | Caso promedio sin memo |
| Espacio | `O(n)` | Profundidad máxima del call stack |

---

### Ejercicio 2.1 — Fibonacci clásico

**Enunciado:** Implementa recursivamente la secuencia de Fibonacci. `F(0)=0`, `F(1)=1`, `F(n)=F(n-1)+F(n-2)` para `n>1`.

**Restricciones:** `0 <= n <= 30`.

**Pista:** ¿Cuántos casos base necesitas? ¿Por qué `F(0)` y `F(1)` son distintos y ambos son necesarios?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 2.2 — Triángulo de Pascal generalizado

**Enunciado:** Dado `n` (fila) e `i` (columna), retorna el valor en esa posición del Triángulo de Pascal. `P(n,0)=1`, `P(n,n)=1`, `P(n,i)=P(n-1,i-1)+P(n-1,i)`.

**Restricciones:** `0 <= n <= 15`, `0 <= i <= n`.

**Pista:** ¿Cuáles son los dos casos base? ¿Qué condición activa cada uno?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 2.3 — Búsqueda recursiva en lista

**Enunciado:** Dado un arreglo y un objetivo, implementa búsqueda lineal recursiva con dos casos base distintos: lista vacía y elemento encontrado.

**Restricciones:** `0 <= len(arr) <= 10^4`.

**Pista:** Caso base 1: lista vacía (retorna -1). Caso base 2: primer elemento es el objetivo (retorna 0).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 2.4 — Escalera (1 o 2 escalones)

**Enunciado:** Puedes subir una escalera de `n` escalones de a 1 o 2 pasos a la vez. Implementa recursivamente cuántas formas distintas existen de subir `n` escalones. `climb(1)=1`, `climb(2)=2`.

**Restricciones:** `1 <= n <= 20`.

**Pista:** ¿Cuántos casos base necesitas? ¿Cómo se relaciona esto con Fibonacci?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 2.5 — Diferencias entre strings

**Enunciado:** Dados dos strings `s1` y `s2`, calcula recursivamente cuántos caracteres difieren comparando posición por posición. Si tienen distinto largo, los caracteres extra cuentan como diferencias.

**Restricciones:** `0 <= len(s1), len(s2) <= 100`.

**Pista:** Caso base 1: `s1` vacío → diferencias = `len(s2)`. Caso base 2: `s2` vacío → diferencias = `len(s1)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 3 — Recursión con Múltiples Llamadas Recursivas

**Complejidad:** `O(2^n)` a `O(4^n/n^1.5)` según el problema

**Descripción:** El caso recursivo genera dos o más llamadas independientes. El árbol de llamadas crece exponencialmente. Es el tipo más costoso y el que más se beneficia de memoización.

**Tip:** Siempre pregúntate: ¿se repiten subproblemas? Si la respuesta es sí, añade memoización. La diferencia entre pasar y no pasar una entrevista técnica muchas veces está aquí.

**Complejidades detalladas:**

| Notación | Valor | Significado |
|---|---|---|
| Big O | `O(4^n/n^1.5)` | Catalan sin memo (peor) |
| Omega Ω | `Ω(2^n)` | Fibonacci sin memo (mejor de este grupo) |
| Espacio | `O(n)` | Profundidad del árbol de llamadas |

---

### Ejercicio 3.1 — Números de Catalan

**Enunciado:** Implementa recursivamente los números de Catalan. `C(0)=1`, `C(n+1) = suma de C(i)*C(n-i) para i=0..n`. Luego implementa la versión con memoización y compara los tiempos de ejecución.

**Restricciones:** `0 <= n <= 10`.

**Pista:** Necesitas un bucle `for` dentro del caso recursivo para hacer la sumatoria. El caso base es `n==0`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 3.2 — Torres de Hanoi con contador

**Enunciado:** Implementa Torres de Hanoi que retorne el número mínimo de movimientos necesarios para mover `n` discos. Verifica que para `n` discos siempre sea `2^n - 1`.

**Restricciones:** `1 <= n <= 20`.

**Pista:** Cada llamada genera exactamente dos llamadas recursivas. ¿Cuántos movimientos suma cada nivel del árbol?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 3.3 — Subconjuntos de un arreglo

**Enunciado:** Dado un arreglo de enteros, genera recursivamente todos sus subconjuntos (incluyendo el vacío). Por ejemplo, `[1,2]` genera `[], [1], [2], [1,2]`.

**Restricciones:** `0 <= len(arr) <= 10`.

**Pista:** Para cada elemento tienes dos opciones: incluirlo o no. Eso genera exactamente dos llamadas recursivas.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 3.4 — Números de Motzkin

**Enunciado:** Implementa recursivamente los números de Motzkin. `M(0)=1`, `M(1)=1`, `M(n) = M(n-1) + suma de M(i)*M(n-2-i) para i=0..n-2`.

**Restricciones:** `0 <= n <= 12`.

**Pista:** Similar a Catalan pero con un término adicional `M(n-1)`. Agrega memoización para valores mayores a 8.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 3.5 — Permutaciones de un string

**Enunciado:** Dado un string, genera recursivamente todas sus permutaciones. Por ejemplo, `'abc'` genera `'abc', 'acb', 'bac', 'bca', 'cab', 'cba'`.

**Restricciones:** `1 <= len(s) <= 8`. Solo letras minúsculas.

**Pista:** Para cada posición, elige un carácter y genera todas las permutaciones del resto del string.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 4 — Recursión por Paridad

**Complejidad:** `O(log n)` tiempo · `O(log n)` espacio

**Descripción:** El argumento se reduce aproximadamente a la mitad en cada llamada, según si es par o impar. Produce árboles de llamadas muy poco profundos, eficiente incluso para `n` muy grandes.

**Tip:** Verifica siempre que **ambos** caminos (par e impar) reduzcan el argumento. El error más común es usar `n` en lugar de `n//2` en el caso impar.

**Complejidades detalladas:**

| Notación | Valor | Significado |
|---|---|---|
| Big O | `O(log n)` | Reducción a la mitad en cada paso |
| Omega Ω | `Ω(log n)` | Siempre logarítmico |
| Theta Θ | `Θ(log n)` | Caso promedio igual |
| Espacio | `O(log n)` | Profundidad del call stack |

---

### Ejercicio 4.1 — Secuencia Diatómica de Stern

**Enunciado:** Implementa la secuencia de Stern: `S(0)=0`, `S(1)=1`, `S(2n)=S(n)`, `S(2n+1)=S(n)+S(n+1)`. Calcula `S(n)` para `n` dado.

**Restricciones:** `0 <= n <= 10^5`.

**Pista:** ¿Cómo determinar si `n` es de la forma `2n` o `2n+1`? Usa el operador módulo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.2 — Potencia rápida (fast exponentiation)

**Enunciado:** Calcula `base^exp` usando recursión por paridad. Si `exp` es par: `base^exp = (base^(exp/2))^2`. Si es impar: `base^exp = base * base^(exp-1)`.

**Restricciones:** `0 <= exp <= 10^9`. `base` puede ser cualquier entero.

**Pista:** ¿Por qué es crítico guardar el resultado de la llamada recursiva en una variable antes de multiplicar? ¿Qué pasa si no lo haces?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.3 — Contar bits en 1

**Enunciado:** Dado un entero no negativo `n`, cuenta recursivamente cuántos bits en `1` tiene su representación binaria usando la paridad de `n`.

**Restricciones:** `0 <= n <= 10^9`.

**Pista:** Si `n` es par, el último bit es `0`. Si es impar, el último bit es `1`. Reduce con `n//2` en cada llamada.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.4 — Suma de dígitos en base 2

**Enunciado:** Dado `n`, calcula recursivamente la suma de sus dígitos en representación binaria (equivalente al número de `1`s). Usa la estructura de recursión por paridad.

**Restricciones:** `0 <= n <= 10^6`.

**Pista:** ¿Cuál es el dígito menos significativo de `n` en binario? ¿Cómo obtenerlo con `% 2`?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 4.5 — Búsqueda binaria recursiva

**Enunciado:** Dado un arreglo ordenado y un objetivo, implementa búsqueda binaria recursiva que divida el arreglo a la mitad en cada paso. Retorna el índice o `-1`.

**Restricciones:** `0 <= len(arr) <= 10^6`. El arreglo está ordenado de menor a mayor.

**Pista:** Tres casos: objetivo en el medio (caso base encontrado), objetivo menor (busca izquierda), objetivo mayor (busca derecha).

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 5 — Recursión de Cola con Acumulador

**Complejidad:** `O(n)` tiempo · `O(1)` espacio con TCO / `O(n)` sin TCO

**Descripción:** Transforma la recursión normal pasando el resultado parcial como parámetro adicional. Las operaciones se realizan ANTES de la llamada recursiva, no durante el retorno.

**Tip:** Pregúntate: ¿qué información necesito LLEVAR hacia adelante en lugar de esperar al retorno? Python **no** aplica TCO, por lo que el espacio sigue siendo `O(n)`. Java tampoco. Go, C# y Rust tampoco en el caso general.

**Complejidades detalladas:**

| Notación | Valor | Significado |
|---|---|---|
| Big O | `O(n)` | n llamadas recursivas |
| Omega Ω | `Ω(n)` | Siempre n llamadas |
| Theta Θ | `Θ(n)` | Caso único |
| Espacio | `O(1)` con TCO / `O(n)` sin TCO | Depende del runtime |

---

### Ejercicio 5.1 — Factorial con acumulador

**Enunciado:** Implementa factorial con recursión de cola. La firma debe ser `factorial(n, acumulador=1)`. Compara el call stack con la versión sin acumulador.

**Restricciones:** `0 <= n <= 20`.

**Pista:** El acumulador empieza en `1` (neutro de la multiplicación). Multiplica `n` al acumulador **antes** de la llamada recursiva.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.2 — Suma de lista con acumulador

**Enunciado:** Implementa una función que sume todos los elementos de una lista usando recursión de cola. Firma: `suma(lista, acumulador=0)`.

**Restricciones:** `0 <= len(lista) <= 10^4`.

**Pista:** El acumulador empieza en `0` (neutro de la suma). Suma el primer elemento al acumulador antes de llamar recursivamente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.3 — Fibonacci con acumulador doble

**Enunciado:** Implementa Fibonacci usando recursión de cola con dos acumuladores: `fibonacci(n, a=0, b=1)`. Esta versión es `O(n)` en tiempo y `O(1)` en espacio con TCO.

**Restricciones:** `0 <= n <= 50`.

**Pista:** ¿Cómo avanzar la secuencia de Fibonacci pasando los dos valores anteriores como acumuladores? En cada llamada: `fibonacci(n-1, b, a+b)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.4 — Collatz con acumulador

**Enunciado:** Reescribe la función Collatz usando recursión de cola, pasando la lista construida como acumulador. Firma: `collatz(n, acumulador=[])`.

**Restricciones:** `1 <= n <= 10^6`.

**Pista:** En lugar de `[n] + collatz(...)` (costoso), agrega `n` al acumulador antes de la llamada recursiva.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 5.5 — Invertir lista con acumulador

**Enunciado:** Implementa una función que invierta una lista usando recursión de cola. Firma: `invertir(lista, acumulador=[])`. No uses slicing ni `reverse()` nativo.

**Restricciones:** `0 <= len(lista) <= 10^4`.

**Pista:** ¿Cómo construir la lista invertida añadiendo elementos al frente del acumulador?

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 6 — Programación Dinámica

**Complejidad:** `O(n)` a `O(n²)` según el problema

**Descripción:** Optimiza la recursión almacenando resultados de subproblemas ya calculados. Existen dos enfoques: **memoización** (top-down: recursión + caché) y **tabulación** (bottom-up: bucle iterativo).

**Tip:** Señal de que necesitas DP: si el árbol de llamadas tiene subproblemas que se repiten, aplica memoización. Para identificarlo, dibuja el árbol de llamadas para `n=5` y busca llamadas duplicadas.

```
# Árbol de llamadas de fib(4) SIN memo — nótese fib(2) aparece 2 veces:
#
#           fib(4)
#          /      \
#       fib(3)   fib(2) ← duplicado
#       /    \    /   \
#    fib(2) fib(1) fib(1) fib(0)
#    /    \
# fib(1) fib(0)
```

---

### Ejercicio 6.1 — Fibonacci con memoización

**Enunciado:** Implementa Fibonacci con memoización usando un diccionario. Mide el tiempo para `n=40` con y sin memoización. Usa un contador de llamadas para mostrar la diferencia.

**Restricciones:** `0 <= n <= 50`.

**Pista:** Antes de calcular, verifica si `n` ya está en el memo. Si sí, retórnalo directamente sin hacer llamadas recursivas.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.2 — Problema de la mochila 0/1

**Enunciado:** Dados `n` objetos con pesos y valores, y una mochila con capacidad `W`, encuentra el máximo valor que puedes llevar. Cada objeto se puede incluir o no (no fraccionar). Implementa con memoización recursiva.

**Restricciones:** `1 <= n <= 100`, `1 <= W <= 1000`.

**Pista:** El estado es `(índice_actual, capacidad_restante)`. Memoriza por ese par de valores.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.3 — Catalan con memoización

**Enunciado:** Reescribe la función Catalan con memoización. Compara el número de llamadas para `n=10` con y sin memoización. ¿De cuántas llamadas a cuántas se reduce?

**Restricciones:** `0 <= n <= 20`.

**Pista:** El estado a memorizar es simplemente `n`. Usa un diccionario global o pásalo como parámetro.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.4 — Número mínimo de monedas

**Enunciado:** Dado un arreglo de denominaciones de monedas y un monto objetivo, encuentra el número mínimo de monedas necesarias para alcanzar exactamente el monto. Retorna `-1` si no es posible.

**Restricciones:** `1 <= len(monedas) <= 12`, `1 <= monto <= 10^4`.

**Pista:** El estado es el monto restante. Para cada moneda, prueba usarla y memoriza el resultado óptimo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.5 — Longest Common Subsequence (LCS)

**Enunciado:** Dados dos strings `s1` y `s2`, encuentra la longitud de la subsecuencia común más larga. Por ejemplo, `LCS('ABCBDAB', 'BDCAB') = 4` (la subsecuencia es `'BCAB'`).

**Restricciones:** `0 <= len(s1), len(s2) <= 100`.

**Pista:** El estado es `(i, j)` donde `i` y `j` son índices en `s1` y `s2`. Si `s1[i]==s2[j]`, suma `1` y avanza ambos índices.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 7 — Divide y Vencerás

**Complejidad:** `O(n log n)` típico · `O(log n)` para búsqueda binaria

**Descripción:** Divide el problema en subproblemas **independientes** (no solapados), los resuelve por separado y combina los resultados. El patrón es siempre: **dividir → resolver → combinar**.

**Tip:** La clave es que los subproblemas sean **independientes**. Si se solapan, usa programación dinámica. Si son independientes, usa divide y vencerás.

```
# Diferencia crítica:
#
# Fibonacci: fib(4) necesita fib(3) Y fib(2)
#            fib(3) necesita fib(2) Y fib(1)  ← fib(2) se repite → DP
#
# Merge Sort: [1,4,2,3] → [1,4] y [2,3] son independientes → D&C
```

---

### Ejercicio 7.1 — Merge Sort

**Enunciado:** Implementa el algoritmo Merge Sort para ordenar un arreglo de enteros. Divide el arreglo en dos mitades, ordena cada mitad recursivamente, y fusiona las mitades ordenadas.

**Restricciones:** `0 <= len(arr) <= 10^5`.

**Pista:** La parte más difícil es la fusión (`merge`). ¿Cómo combinar dos arreglos ordenados en uno ordenado usando dos punteros?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 7.2 — Búsqueda binaria con contador

**Enunciado:** Implementa búsqueda binaria recursiva completa que retorne el índice del elemento o `-1`. Añade un contador de llamadas para mostrar cuántas comparaciones se realizaron.

**Restricciones:** `1 <= len(arr) <= 10^6`. Arreglo ordenado.

**Pista:** Tres casos: encontrado (elemento en el medio), buscar izquierda (menor que el medio), buscar derecha (mayor que el medio).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 7.3 — Par más cercano

**Enunciado:** Dado un arreglo de números, encuentra el par de elementos cuya diferencia absoluta sea mínima usando divide y vencerás.

**Restricciones:** `2 <= len(arr) <= 10^4`.

**Pista:** ¿Cuál es el caso base para 2 elementos? ¿Cómo manejas el caso donde el par más cercano cruza la división?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 7.4 — Máximo y mínimo simultáneo

**Enunciado:** Dado un arreglo, encuentra el máximo y mínimo usando divide y vencerás con máximo `3n/2 - 2` comparaciones, más eficiente que buscarlos por separado (`2n - 2` comparaciones).

**Restricciones:** `1 <= len(arr) <= 10^5`.

**Pista:** Divide en dos mitades, obtén `(max1, min1)` y `(max2, min2)`, y combina con solo 2 comparaciones.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 7.5 — Multiplicación de Karatsuba

**Enunciado:** Implementa la multiplicación de enteros grandes usando el algoritmo de Karatsuba, que realiza 3 multiplicaciones en lugar de 4.

**Restricciones:** Los números pueden tener hasta 20 dígitos.

**Pista:** Si `x = a*10^m + b` y `y = c*10^m + d`, entonces `x*y = ac*10^2m + ((a+b)(c+d) - ac - bd)*10^m + bd`.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 8 — Árboles y Grafos

**Complejidad:** `O(n)` para recorridos · `O(h)` espacio donde `h` es la altura del árbol

**Descripción:** La recursión es la forma más natural de recorrer estructuras jerárquicas. Cada nodo puede verse como la raíz de un subárbol. Para grafos con ciclos se necesita un conjunto de visitados.

**Tip:** Para árboles: el caso base casi siempre es `nodo == None`. Para grafos: **siempre** verifica si el nodo ya fue visitado antes de explorar sus vecinos, o entrarás en bucle infinito.

```python
# Estructura de nodo de árbol (referencia)
class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izquierdo = None
        self.derecho = None

# Estructura de grafo (referencia)
grafo = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A'],
    'D': ['B']
}
```

---

### Ejercicio 8.1 — Altura de un árbol binario

**Enunciado:** Dado un árbol binario, calcula recursivamente su altura (número máximo de nodos en el camino de la raíz a una hoja). Un árbol vacío tiene altura `0`.

**Restricciones:** El árbol puede tener hasta `10^4` nodos.

**Pista:** La altura de un nodo es `1 + max(altura_izquierda, altura_derecha)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.2 — Suma de todos los nodos

**Enunciado:** Dado un árbol binario donde cada nodo contiene un entero, calcula recursivamente la suma de todos los valores del árbol.

**Restricciones:** El árbol puede tener hasta `10^4` nodos. Los valores pueden ser negativos.

**Pista:** `suma(nodo) = nodo.valor + suma(nodo.izquierdo) + suma(nodo.derecho)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.3 — DFS en grafo (profundidad)

**Enunciado:** Dado un grafo representado como diccionario de adyacencia, implementa DFS recursivo que retorne la lista de nodos visitados en orden de visita.

**Restricciones:** El grafo puede tener hasta `10^3` nodos y `10^4` aristas.

**Pista:** Usa un conjunto de visitados para evitar ciclos. Agrega el nodo actual al conjunto **antes** de visitar sus vecinos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.4 — Verificar árbol binario de búsqueda (BST)

**Enunciado:** Dado un árbol binario, determina recursivamente si es un árbol binario de búsqueda (BST) válido. En un BST, todos los nodos del subárbol izquierdo son menores y todos los del derecho son mayores.

**Restricciones:** El árbol puede tener hasta `10^4` nodos.

**Pista:** Pasa los límites mínimo y máximo permitidos en cada llamada recursiva. No basta comparar con el padre inmediato.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 8.5 — Caminos en un grafo

**Enunciado:** Dado un grafo y dos nodos origen y destino, genera recursivamente todos los caminos posibles entre ellos sin repetir nodos.

**Restricciones:** El grafo puede tener hasta `10` nodos.

**Pista:** Marca el nodo actual como visitado, explora sus vecinos recursivamente, y **desmarca al retroceder** (backtracking). Esto es lo que permite encontrar todos los caminos.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Tipos de recursión

| Tipo | Big O | Omega Ω | Theta Θ | Espacio | Señal clave |
|---|---|---|---|---|---|
| Lineal Simple | `O(n)` | `Ω(1)` | `Θ(n)` | `O(n)` | Una sola llamada recursiva |
| Múltiples Casos Base | `O(2^n)` | `Ω(2^n)` | `Θ(2^n)` | `O(n)` | 2+ condiciones de parada |
| Múltiples Llamadas | `O(4^n/n^1.5)` | `Ω(2^n)` | `Θ(4^n)` | `O(n)` | 2+ llamadas por caso |
| Por Paridad | `O(log n)` | `Ω(log n)` | `Θ(log n)` | `O(log n)` | Divide argumento a la mitad |
| Cola con Acumulador | `O(n)` | `Ω(n)` | `Θ(n)` | `O(1)*` | Acumulador como parámetro |
| Programación Dinámica | `O(n)–O(n²)` | `Ω(n)` | `Θ(n²)` | `O(n)` | Subproblemas solapados |
| Divide y Vencerás | `O(n log n)` | `Ω(n log n)` | `Θ(n log n)` | `O(log n)` | Subproblemas independientes |
| Árboles y Grafos | `O(n)` | `Ω(n)` | `Θ(n)` | `O(h)` | Nodo como subproblema |

> `*` O(1) espacio solo con TCO (Tail Call Optimization). Python, Java, Go y C# **no** aplican TCO.
> `h` = altura del árbol.
