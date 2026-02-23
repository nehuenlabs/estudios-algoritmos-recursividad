# Guía de Ejercicios — Teoría de Números

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `13_bit_manipulation.md`.

---

## ¿Por qué teoría de números en algoritmos?

La teoría de números aparece constantemente en problemas de competición y entrevistas:
- **MCD/MCM** → simplificación de fracciones, sincronización de ciclos
- **Primalidad** → criptografía, hashing, problemas de divisibilidad
- **Aritmética modular** → evitar overflow, contar combinaciones grandes
- **Criba de Eratóstenes** → encontrar todos los primos hasta `n` en `O(n log log n)`

```python
# El algoritmo más antiguo y elegante: Euclides (300 a.C.)
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# ¿Por qué funciona?
# gcd(a, b) = gcd(b, a mod b)
# Ejemplo: gcd(48, 18)
#   → gcd(18, 48 mod 18) = gcd(18, 12)
#   → gcd(12, 18 mod 12) = gcd(12, 6)
#   → gcd(6,  12 mod 6)  = gcd(6, 0)
#   → 6

# Complejidad: O(log min(a, b)) — el número de pasos
# está acotado por los dígitos de Fibonacci
```

---

## Tabla de contenidos

- [Sección 14.1 — MCD, MCM y Algoritmo de Euclides](#sección-141--mcd-mcm-y-algoritmo-de-euclides)
- [Sección 14.2 — Números Primos y Factorización](#sección-142--números-primos-y-factorización)
- [Sección 14.3 — Criba de Eratóstenes y variantes](#sección-143--criba-de-eratóstenes-y-variantes)
- [Sección 14.4 — Aritmética Modular](#sección-144--aritmética-modular)
- [Sección 14.5 — Aplicaciones en problemas combinatorios](#sección-145--aplicaciones-en-problemas-combinatorios)

---

## Sección 14.1 — MCD, MCM y Algoritmo de Euclides

**Complejidad:** `O(log min(a, b))` para `gcd`

**Relación fundamental:**

```
mcm(a, b) = a * b / mcd(a, b)

Ejemplo: a=12, b=18
  mcd(12, 18) = 6
  mcm(12, 18) = 12 * 18 / 6 = 36

¡Precaución con overflow!
  En vez de: a * b / gcd(a, b)
  Usa:       a / gcd(a, b) * b     ← divide primero para reducir
```

**Euclides extendido:**

```python
def extended_gcd(a, b):
    """
    Retorna (g, x, y) tal que a*x + b*y = g = mcd(a, b)
    Útil para encontrar inversos modulares.
    """
    if b == 0:
        return a, 1, 0
    g, x, y = extended_gcd(b, a % b)
    return g, y, x - (a // b) * y

# Ejemplo: extended_gcd(35, 15)
# gcd(35,15) = 5
# Resultado: (5, 1, -2) → 35*1 + 15*(-2) = 35 - 30 = 5 ✓
```

---

### Ejercicio 14.1.1 — MCD iterativo y recursivo

**Enunciado:** Implementa el MCD de dos formas: recursiva (Euclides clásico) y iterativa. Verifica que producen el mismo resultado para 1000 pares aleatorios y mide si hay diferencia de rendimiento.

**Restricciones:** `1 <= a, b <= 10^12`.

**Pista:** La versión iterativa evita el overhead de llamadas recursivas. Para `a, b` grandes, la recursión puede ser profunda (aunque en la práctica `O(log n)` es muy pequeño).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.1.2 — MCM sin overflow

**Enunciado:** Implementa `lcm(a, b)` evitando overflow. Para `a = b = 10^9` en lenguajes de 32 bits, `a * b` desborda.

**Restricciones:** `1 <= a, b <= 10^9`. Resultado puede ser hasta `10^18`.

**Pista:** Usa `a // gcd(a, b) * b` (divide primero). En Java/C# usa `long`. En Rust usa `u64` o `i128`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.1.3 — MCD de un arreglo

**Enunciado:** Dado un arreglo de `n` enteros, calcula el MCD de todos ellos. Luego responde: ¿cuál es el MCD de todos los números de `1` a `n`?

**Restricciones:** `1 <= n <= 10^5`, `1 <= arr[i] <= 10^9`.

**Pista:** `gcd(a1, a2, ..., an) = gcd(a1, gcd(a2, ..., an))`. Aplica iterativamente. Para la segunda pregunta: `gcd(1..n) = 1` para `n >= 2`. ¿Por qué?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.1.4 — Euclides extendido e inverso modular

**Enunciado:** Usando el algoritmo de Euclides extendido, encuentra el inverso modular de `a` módulo `m` (un número `x` tal que `a*x ≡ 1 (mod m)`). El inverso existe si y solo si `gcd(a, m) = 1`.

**Restricciones:** `1 <= a, m <= 10^9`, `gcd(a, m) = 1`.

**Pista:** `extended_gcd(a, m)` retorna `(1, x, y)`. El inverso es `x mod m` (puede ser negativo, añade `m` si hace falta).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.1.5 — Fracciones simplificadas en rango

**Enunciado:** Cuenta cuántas fracciones `p/q` con `1 <= p <= q <= n` están en forma reducida (es decir, `gcd(p, q) = 1`).

**Restricciones:** `1 <= n <= 10^3`.

**Pista:** Itera sobre todos los pares `(p, q)` y verifica `gcd(p, q) == 1`. Para un enfoque más eficiente, usa la función totiente de Euler: la respuesta es `1 + sum(phi(k) for k in 2..n)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 14.2 — Números Primos y Factorización

**Verificación de primalidad:**

```python
def es_primo(n):
    """O(sqrt(n)) — solo verifica divisores hasta la raíz cuadrada."""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    i = 3
    while i * i <= n:        # hasta sqrt(n)
        if n % i == 0:
            return False
        i += 2               # solo impares
    return True

# ¿Por qué sqrt(n)? Si n = a * b y a <= b,
# entonces a <= sqrt(n). Si no encontramos factor hasta sqrt(n),
# el único factor es n mismo (es primo).

def factorizacion(n):
    """Factorización prima en O(sqrt(n))."""
    factores = {}
    d = 2
    while d * d <= n:
        while n % d == 0:
            factores[d] = factores.get(d, 0) + 1
            n //= d
        d += 1
    if n > 1:
        factores[n] = factores.get(n, 0) + 1   # factor primo restante
    return factores

# factorizacion(360) → {2:3, 3:2, 5:1}  (2³ × 3² × 5 = 360)
```

---

### Ejercicio 14.2.1 — Test de primalidad eficiente

**Enunciado:** Implementa un verificador de primalidad `O(sqrt(n))`. Luego verifica todos los números de `1` a `10^6` y cuenta cuántos son primos. Compara con el resultado de la Criba de Eratóstenes.

**Restricciones:** `1 <= n <= 10^12` para el test individual.

**Pista:** Para verificación individual hasta `10^12`, `O(sqrt(n)) = O(10^6)` es aceptable. Para encontrar todos los primos hasta `n`, la criba es más eficiente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.2.2 — Factorización prima completa

**Enunciado:** Dado un número `n`, retorna su factorización prima como un diccionario `{primo: exponente}`. Luego implementa funciones para contar el número de divisores y la suma de divisores usando la factorización.

**Restricciones:** `1 <= n <= 10^12`.

**Pista:** Si `n = p1^a1 * p2^a2 * ...`, entonces `num_divisores = (a1+1)(a2+1)...` y `suma_divisores = (p1^(a1+1)-1)/(p1-1) * ...`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.2.3 — Máximo factor primo

**Enunciado:** Dado un número `n`, encuentra su mayor factor primo. Para `n = 600851475143`, la respuesta es `6857` (problema clásico de Project Euler).

**Restricciones:** `1 <= n <= 10^15`.

**Pista:** Factoriza `n` dividiendo por los primos encontrados. El último factor que queda (si es > 1) es el mayor primo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.2.4 — Números con exactamente k divisores

**Enunciado:** Dado `k` y un límite `n`, encuentra todos los números de `1` a `n` que tienen exactamente `k` divisores.

**Restricciones:** `1 <= n <= 10^6`, `1 <= k <= 100`.

**Pista:** Usa la criba para precalcular el número de divisores de cada número hasta `n`. Alternativamente, factoriza cada número individualmente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.2.5 — Números libres de cuadrados

**Enunciado:** Un número es "libre de cuadrados" si ningún primo al cuadrado lo divide (ej: `6 = 2×3` sí, `12 = 4×3` no). Cuenta cuántos hay de `1` a `n`.

**Restricciones:** `1 <= n <= 10^6`.

**Pista:** En la factorización, verifica que ningún exponente sea `>= 2`. Para hacerlo eficientemente, usa una variante de la criba: para cada primo `p`, marca como no-libre-de-cuadrados todos los múltiplos de `p²`.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 14.3 — Criba de Eratóstenes y variantes

**Criba clásica `O(n log log n)`:**

```python
def criba(n):
    """Encuentra todos los primos <= n."""
    es_primo = [True] * (n + 1)
    es_primo[0] = es_primo[1] = False

    p = 2
    while p * p <= n:          # solo hasta sqrt(n)
        if es_primo[p]:
            # Marcar todos los múltiplos de p como compuestos
            # Empezar desde p² (los menores ya fueron marcados)
            for multiple in range(p * p, n + 1, p):
                es_primo[multiple] = False
        p += 1

    return [i for i in range(2, n + 1) if es_primo[i]]

# Eficiencia: la suma 1/2 + 1/3 + 1/5 + 1/7 + ... ≈ log log n
# (Mertens' theorem), de ahí O(n log log n)

# Para n = 10^6: ~78498 primos
# Para n = 10^7: ~664579 primos
```

**Criba lineal `O(n)` — cada número se marca exactamente una vez:**

```python
def criba_lineal(n):
    primos = []
    min_factor = [0] * (n + 1)   # min_factor[i] = menor primo que divide a i

    for i in range(2, n + 1):
        if min_factor[i] == 0:    # i es primo
            min_factor[i] = i
            primos.append(i)
        for p in primos:
            if p > min_factor[i] or i * p > n:
                break
            min_factor[i * p] = p

    return primos, min_factor
```

---

### Ejercicio 14.3.1 — Criba clásica con conteo

**Enunciado:** Implementa la criba de Eratóstenes para `n = 10^6`. Cuenta: (a) total de primos, (b) primos gemelos `(p, p+2)`, (c) primos de Mersenne (`2^k - 1`) hasta `n`.

**Restricciones:** `n <= 10^7`.

**Pista:** Para primos gemelos, itera los primos encontrados y verifica si `p+2` también es primo. Para Mersenne: `2^2-1=3`, `2^3-1=7`, `2^5-1=31`, `2^7-1=127`, `2^13-1=8191`...

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.3.2 — Criba segmentada

**Enunciado:** La criba clásica requiere `O(n)` memoria. Implementa la criba segmentada que usa `O(sqrt(n))` memoria para encontrar todos los primos hasta `n`.

**Restricciones:** `n <= 10^9` (imposible con criba clásica por memoria).

**Pista:** Primero encuentra los primos hasta `sqrt(n)` con la criba clásica. Luego procesa el rango en bloques de tamaño `sqrt(n)`, usando los primos pequeños para marcar compuestos en cada bloque.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.3.3 — Criba para calcular la función totiente de Euler

**Enunciado:** La función totiente `φ(n)` cuenta cuántos números de `1` a `n` son coprimos con `n`. Calcula `φ(n)` para todos los `n` de `1` a `10^6` usando una criba.

**Restricciones:** `1 <= n <= 10^6`.

**Pista:** Inicializa `phi[i] = i`. Para cada primo `p` encontrado por la criba, actualiza `phi[multiplo] -= phi[multiplo] / p` para todos los múltiplos. La fórmula es `φ(n) = n * ∏(1 - 1/p)` para cada primo `p` que divide `n`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.3.4 — Primos en rango [L, R]

**Enunciado:** Dados `L` y `R`, encuentra todos los primos en ese rango. `R - L <= 10^6` pero `R` puede ser hasta `10^{12}`.

**Restricciones:** `1 <= L <= R <= 10^{12}`, `R - L <= 10^6`.

**Pista:** Criba segmentada: los primos pequeños (hasta `sqrt(R) ≈ 10^6`) son suficientes para marcar todos los compuestos en `[L, R]`. Genera los primos pequeños con criba clásica, luego marca múltiplos en `[L, R]`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.3.5 — Primo más cercano

**Enunciado:** Dado `n`, encuentra el primo más cercano (puede ser menor o mayor que `n`). Para `n = 10^9`, ¿qué tan lejos está el primo más cercano?

**Restricciones:** `1 <= n <= 10^9`.

**Pista:** Busca hacia arriba y hacia abajo desde `n` usando el test de primalidad `O(sqrt(n))`. Por el Teorema de Bertrand, siempre hay un primo entre `n` y `2n`, así que la búsqueda termina rápido.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 14.4 — Aritmética Modular

La aritmética modular es esencial para evitar overflow y para calcular combinaciones grandes.

**Propiedades clave:**

```python
MOD = 10**9 + 7   # primo grande estándar en competición

# Las operaciones básicas preservan el módulo:
(a + b) % m == ((a % m) + (b % m)) % m
(a * b) % m == ((a % m) * (b % m)) % m
(a - b) % m == ((a % m) - (b % m) + m) % m  # +m para evitar negativo

# La DIVISIÓN no es directa: a/b mod m ≠ (a mod m)/(b mod m)
# Usa el inverso modular: a/b mod m = a * inv(b) mod m
# inv(b) existe si gcd(b, m) = 1 (siempre que m sea primo y b ≠ 0)

def inv_mod(b, m):
    """Inverso modular usando pequeño teorema de Fermat: b^(m-2) mod m."""
    return pow(b, m - 2, m)   # pow rápido de Python: O(log m)

# pow(b, e, m) en Python ya es potenciación modular eficiente
```

**Potenciación modular `O(log e)`:**

```python
def pot_mod(base, exp, mod):
    """base^exp mod mod en O(log exp) — divide y vencerás."""
    resultado = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:       # bit menos significativo = 1
            resultado = resultado * base % mod
        base = base * base % mod
        exp //= 2
    return resultado

# Traza: 2^10 mod 1000
# exp=10 (1010 en binario)
# bit1=0: base=4,  exp=5
# bit1=1: res=4,   base=16, exp=2
# bit1=0: base=256, exp=1
# bit1=1: res=4*256=1024%1000=24
# Resultado: 24 ✓ (2^10=1024)
```

---

### Ejercicio 14.4.1 — Potenciación modular desde cero

**Enunciado:** Implementa `pow_mod(base, exp, mod)` sin usar la función nativa. Verifica para `2^1000000 mod (10^9+7)`. Compara con Python `pow(2, 1000000, 10**9+7)`.

**Restricciones:** `0 <= base, exp <= 10^{18}`, `2 <= mod <= 10^9`.

**Pista:** El algoritmo de exponenciación rápida (square-and-multiply) reduce `O(exp)` a `O(log exp)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.4.2 — Inverso modular (tres métodos)

**Enunciado:** Calcula el inverso modular de `a` módulo primo `p` usando: (1) Pequeño teorema de Fermat `a^(p-2)`, (2) Algoritmo extendido de Euclides, (3) Tabla de inversos para `1..n` con la recurrencia `inv[i] = -(p/i) * inv[p%i] % p`.

**Restricciones:** `1 <= a < p`, `p` primo <= `10^9`.

**Pista:** El método 3 (`O(n)` para todos los inversos de `1..n`) es más eficiente que llamar a Fermat `n` veces cuando necesitas muchos inversos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.4.3 — Suma de fracciones módulo primo

**Enunciado:** Dadas `n` fracciones `p_i/q_i`, calcula su suma modular: `(p1*inv(q1) + p2*inv(q2) + ...) mod (10^9+7)`. Esto aparece al calcular probabilidades exactas o combinaciones.

**Restricciones:** `1 <= n <= 10^5`, `0 <= p_i < q_i <= 10^9`, `gcd(q_i, 10^9+7) = 1`.

**Pista:** Para cada fracción, calcula `p_i * inv_mod(q_i, MOD) % MOD` y suma. El truco es que `inv_mod` es `O(log MOD)` y con `n=10^5` llamadas es perfectamente eficiente.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.4.4 — Último dígito de una potencia grande

**Enunciado:** Calcula el último dígito de `a^b` para `a, b` muy grandes (hasta `10^{18}`). Luego generaliza: últimos `k` dígitos de `a^b`.

**Restricciones:** `0 <= a, b <= 10^{18}`, `1 <= k <= 9`.

**Pista:** Últimos `k` dígitos = `a^b mod 10^k`. Usa `pow_mod(a, b, 10**k)`. Para el último dígito (`k=1`): el patrón se repite con periodo <= 4 (por ejemplo, `2^n` cicla en `2,4,8,6,2,4,...`).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.4.5 — Teorema Chino del Resto (CRT)

**Enunciado:** Dado un sistema de congruencias `x ≡ r1 (mod m1)`, `x ≡ r2 (mod m2)`, ..., encuentra la solución única `x` módulo `lcm(m1, m2, ...)` si los módulos son coprimos entre sí.

**Restricciones:** Hasta 5 congruencias, `1 <= mi <= 10^9`, `gcd(mi, mj) = 1` para `i ≠ j`.

**Pista:** Solución iterativa: empieza con `(x, m) = (r1, m1)`. Para cada nueva congruencia `x ≡ ri (mod mi)`, combina usando el inverso modular para obtener la nueva `x` y `m = lcm(m, mi)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 14.5 — Aplicaciones en Problemas Combinatorios

Combinatoria modular: calcular `C(n, k) mod p` de forma eficiente.

```python
MOD = 10**9 + 7

def precompute_factorials(n, mod):
    """Precalcula factoriales e inversos de factoriales en O(n)."""
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i-1] * i % mod

    inv_fact = [1] * (n + 1)
    inv_fact[n] = pow(fact[n], mod - 2, mod)   # inv_fact[n] = (n!)^-1
    for i in range(n - 1, -1, -1):
        inv_fact[i] = inv_fact[i+1] * (i+1) % mod

    return fact, inv_fact

def comb(n, k, fact, inv_fact, mod):
    """C(n, k) mod p en O(1) una vez precalculados los factoriales."""
    if k < 0 or k > n:
        return 0
    return fact[n] * inv_fact[k] % mod * inv_fact[n-k] % mod

# Ejemplo: C(1000000, 500000) mod (10^9+7)
# Sin precálculo: imposible
# Con precálculo: O(1) por consulta, O(n) precálculo
```

---

### Ejercicio 14.5.1 — Coeficientes binomiales modulares

**Enunciado:** Precalcula factoriales e inversos de factoriales para `n <= 10^6`. Responde `q` consultas `C(n, k) mod (10^9+7)` en `O(1)` cada una.

**Restricciones:** `n <= 10^6`, `q <= 10^5`.

**Pista:** El precálculo es `O(n)` y cada consulta `O(1)`. Compara con el triángulo de Pascal `O(n²)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.5.2 — Número de caminos en cuadrícula modular

**Enunciado:** En una cuadrícula `m x n`, ¿de cuántas formas puedes ir de `(0,0)` a `(m-1,n-1)` moviéndote solo abajo o a la derecha? La respuesta es `C(m+n-2, m-1)`. Calcula esto módulo `10^9+7` para `m, n` hasta `10^6`.

**Restricciones:** `1 <= m, n <= 10^6`.

**Pista:** La respuesta directa es `C(m+n-2, m-1)`. Usa la precalculación de factoriales del ejercicio anterior.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.5.3 — Stirling numbers y Bell numbers

**Enunciado:** El número de Stirling de segunda especie `S(n, k)` cuenta las formas de partir `n` elementos en `k` subconjuntos no vacíos. El número de Bell `B(n) = sum S(n,k)` cuenta todas las particiones. Calcula `B(n) mod prime` para `n <= 1000`.

**Restricciones:** `1 <= n <= 1000`, resultado módulo `10^9+7`.

**Pista:** Recurrencia: `S(n, k) = k*S(n-1, k) + S(n-1, k-1)`. Llena la tabla con DP en `O(n²)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.5.4 — Probabilidad de ganar al lanzar dados

**Enunciado:** Lanzas `d` dados de `f` caras. ¿Cuál es la probabilidad de que la suma sea exactamente `s`? Expresa como fracción simplificada y como valor modular `p/q mod (10^9+7)`.

**Restricciones:** `1 <= d <= 30`, `1 <= f <= 30`, `d <= s <= d*f`.

**Pista:** DP: `dp[i][j]` = número de formas de obtener suma `j` con `i` dados. Respuesta = `dp[d][s] / f^d`. Para la fracción modular: `dp[d][s] * inv_mod(f^d, MOD)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 14.5.5 — Contar árboles etiquetados (Cayley's formula)

**Enunciado:** La fórmula de Cayley dice que hay `n^(n-2)` árboles etiquetados distintos con `n` vértices. Verifica esto para `n = 2..6` enumerando los árboles directamente, y calcula `n^(n-2) mod (10^9+7)` para `n` hasta `10^6`.

**Restricciones:** `2 <= n <= 10^6`.

**Pista:** Para `n` pequeño, usa backtracking para contar árboles (un árbol con `n` vértices tiene `n-1` aristas sin ciclos). Para `n` grande, usa `pow_mod(n, n-2, MOD)`.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Teoría de Números

| Algoritmo | Complejidad | Aplicación principal |
|---|---|---|
| MCD (Euclides) | `O(log min(a,b))` | Simplificar fracciones, LCM |
| MCD extendido | `O(log min(a,b))` | Inverso modular, CRT |
| Test de primalidad | `O(sqrt(n))` | Verificar un número |
| Factorización prima | `O(sqrt(n))` | Divisores, phi(n) |
| Criba de Eratóstenes | `O(n log log n)` | Todos los primos hasta n |
| Criba segmentada | `O(n log log n)`, `O(sqrt(n))` memoria | Primos en rango grande |
| Criba de phi(n) | `O(n log log n)` | Totiente de todos los n |
| Potenciación modular | `O(log e)` | `a^e mod m` |
| Inverso modular (Fermat) | `O(log p)` | `a^-1 mod p` (p primo) |
| Inverso modular (Euclides) | `O(log m)` | `a^-1 mod m` (cualquier m) |
| Tabla de inversos | `O(n)` | Inversos de 1..n simultáneos |
| Coeficientes binomiales | `O(n)` precálculo, `O(1)` consulta | `C(n,k) mod p` |
| Teorema Chino del Resto | `O(n log m)` | Sistema de congruencias |

> **Constante de oro: `MOD = 10^9 + 7`** — primo de Mersenne seguro, cabe en `int` de 32 bits (el producto de dos valores módulo cabe en 64 bits).
