# Guía de Ejercicios — Estructuras de Datos Probabilísticas

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este capítulo cierra el repositorio conectando los fundamentos matemáticos
> de Cap.13 (bits) y Cap.14 (hashing, teoría de números) con los sistemas
> de producción de Cap.17.

---

## El trade-off que define este capítulo

Las estructuras de datos de los Cap.01–10 son **exactas**: siempre dan la respuesta correcta.
El costo es que escalan mal cuando el conjunto de datos es masivo.

```
Pregunta: ¿Esta URL ya fue visitada?
Conjunto: 10^10 URLs (40 bytes cada una = 400 GB)

HashMap exacto:   400 GB de memoria → inviable en un solo nodo
Bloom Filter:     ~10 GB (factor 40x menos) → respuesta en nanosegundos
                  con tasa de falsos positivos del 1% configurable

¿Vale la pena equivocarse el 1% de las veces?
En un web crawler: sí — visitar una URL dos veces es aceptable.
En un banco: no — nunca.
```

**La pregunta correcta no es "¿exacto o aproximado?"**
**Es "¿qué tipo de error es tolerable en este contexto?"**

```
Tres estructuras, tres garantías distintas:

Bloom Filter:      Nunca falso negativo  — si dice "no está", no está.
                   Posibles falsos positivos — si dice "sí está", puede mentir.

HyperLogLog:       Cuenta elementos únicos con error ±2%.
                   Usa O(log log n) bits — literalmente "logaritmo del logaritmo".

Count-Min Sketch:  Cuenta frecuencias con sobreestimación acotada.
                   Nunca subestima — si dice "100 veces", fueron ≥ 100.
```

---

## Tabla de contenidos

- [Sección 18.1 — Hashing universal: la base de todo](#sección-181--hashing-universal-la-base-de-todo)
- [Sección 18.2 — Bloom Filter](#sección-182--bloom-filter)
- [Sección 18.3 — Bloom Filter variantes](#sección-183--bloom-filter-variantes)
- [Sección 18.4 — HyperLogLog](#sección-184--hyperloglog)
- [Sección 18.5 — Count-Min Sketch](#sección-185--count-min-sketch)
- [Sección 18.6 — MinHash y similitud de conjuntos](#sección-186--minhash-y-similitud-de-conjuntos)
- [Sección 18.7 — Aplicaciones en sistemas reales](#sección-187--aplicaciones-en-sistemas-reales)

---

## Sección 18.1 — Hashing Universal: la base de todo

Todas las estructuras de este capítulo descansan sobre una misma base:
funciones de hash que distribuyen los elementos de forma uniforme e independiente.

**¿Qué hace a una función de hash "buena" para estructuras probabilísticas?**

```python
# HASH MALO para estructuras probabilísticas
def hash_malo(s):
    return sum(ord(c) for c in s)
# "abc" y "cba" dan el mismo hash — colisiones predecibles

# HASH BUENO: propiedades que necesitamos
# 1. Uniforme: los valores se distribuyen uniformemente en [0, 2^k]
# 2. Independiente: hash(x) no revela nada sobre hash(y) para x ≠ y
# 3. Determinista: mismo input → mismo output siempre
# 4. Avalanche: un bit diferente en el input → ~50% bits diferentes en output

# MurmurHash3 — rápido y bien distribuido (no criptográfico)
import struct

def murmurhash3_32(key: bytes, seed: int = 0) -> int:
    """MurmurHash3 para strings — O(n) donde n = longitud del key."""
    h = seed
    c1, c2 = 0xcc9e2d51, 0x1b873593

    length = len(key)
    remainder = length & 3
    blocks = length >> 2

    for block_start in range(0, blocks * 4, 4):
        k1 = struct.unpack_from("<I", key, block_start)[0]
        k1 = (k1 * c1) & 0xFFFFFFFF
        k1 = ((k1 << 15) | (k1 >> 17)) & 0xFFFFFFFF
        k1 = (k1 * c2) & 0xFFFFFFFF
        h ^= k1
        h = ((h << 13) | (h >> 19)) & 0xFFFFFFFF
        h = (h * 5 + 0xe6546b64) & 0xFFFFFFFF

    tail = key[blocks * 4:]
    k1 = 0
    if remainder >= 3: k1 ^= tail[2] << 16
    if remainder >= 2: k1 ^= tail[1] << 8
    if remainder >= 1:
        k1 ^= tail[0]
        k1 = (k1 * c1) & 0xFFFFFFFF
        k1 = ((k1 << 15) | (k1 >> 17)) & 0xFFFFFFFF
        k1 = (k1 * c2) & 0xFFFFFFFF
        h ^= k1

    h ^= length
    h ^= h >> 16
    h = (h * 0x85ebca6b) & 0xFFFFFFFF
    h ^= h >> 13
    h = (h * 0xc2b2ae35) & 0xFFFFFFFF
    h ^= h >> 16
    return h

# Para obtener k funciones de hash independientes desde una sola:
# Truco estándar: hash_i(x) = (hash_a(x) + i * hash_b(x)) mod m
# Solo necesitas 2 hashes buenos para simular k independientes
def k_hashes(item: bytes, k: int, m: int) -> list[int]:
    """Genera k posiciones de hash en [0, m) usando doble hashing."""
    h1 = murmurhash3_32(item, seed=0)
    h2 = murmurhash3_32(item, seed=h1)
    return [(h1 + i * h2) % m for i in range(k)]
```

**Relación con Cap.14:**

```
Cap.14 §4.4 usa hashing polinomial (Rabin-Karp) para búsqueda de patrones.
Cap.18 usa hashing universal para estructuras de datos aproximadas.

La diferencia: Rabin-Karp necesita detectar colisiones (son falsas coincidencias).
Las estructuras de Cap.18 abrazan las colisiones — las usan intencionalmente.
```

---

### Ejercicio 18.1.1 — Implementar y evaluar funciones de hash

**Enunciado:** Implementa tres funciones de hash: (1) hash polinomial simple (Cap.14 §3.3), (2) FNV-1a (Fowler–Noll–Vo), (3) MurmurHash3 simplificado. Para cada una, mide la distribución de 10^6 strings aleatorios en 1000 buckets — calcula la desviación estándar del conteo por bucket (menor = mejor distribución).

**Restricciones:** `n = 10^6` strings, `m = 1000` buckets. El test de bondad es `χ² < 1100` para 1000 grados de libertad (umbral del 5%).

**Pista:** Una distribución perfectamente uniforme tendría `1000` elementos por bucket. La desviación estándar esperada de una distribución binomial es `sqrt(n/m * (1 - 1/m)) ≈ sqrt(999)`. Si tu hash es bueno, la desviación medida debe estar cerca de este valor teórico.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.1.2 — Doble hashing para k funciones independientes

**Enunciado:** Implementa la técnica de doble hashing que genera `k` funciones independientes a partir de solo dos. Verifica que las `k` funciones tienen baja correlación entre sí: para el mismo input, `hash_i(x)` y `hash_j(x)` no deben estar correlacionados.

**Restricciones:** `k` hasta 20. Mide la correlación de Pearson entre cada par de funciones — debe ser `< 0.01`.

**Pista:** `hash_i(x) = (h1(x) + i * h2(x)) mod m`. Esta propiedad se llama "pairwise independence" y es suficiente para las garantías de Bloom Filter y Count-Min Sketch. No necesita independencia total (más fuerte) que sería más costosa de lograr.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.1.3 — Avalanche effect y calidad del hash

**Enunciado:** Verifica la propiedad "avalanche": cambiar 1 bit en el input debe cambiar aproximadamente el 50% de los bits del output. Para 10^5 pares de inputs que difieren en exactamente 1 bit, mide el promedio de bits diferentes en el output.

**Restricciones:** El promedio debe estar en `[45%, 55%]` para un hash bueno. Prueba con: hash polinomial simple, FNV-1a, MurmurHash3.

**Pista:** El hash polinomial simple fallará este test — los bits de orden bajo están sobre-representados. FNV-1a y MurmurHash3 deben pasar. Esto explica por qué `str.__hash__` de Python no es adecuado para estructuras probabilísticas.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.1.4 — Hashing consistente (Consistent Hashing)

**Enunciado:** El hashing consistente resuelve el problema de redistribuir datos cuando se añaden o eliminan nodos en un sistema distribuido. Implementa un anillo de hashing consistente donde: agregar un nodo mueve solo `n/k` elementos (no todos), y eliminar un nodo redistribuye solo sus elementos.

**Restricciones:** `k` nodos en el anillo, `n` elementos. Verifica que al agregar un nodo, se mueven exactamente `n/(k+1)` elementos en promedio.

**Pista:** El anillo hash es un círculo de `2^32` posiciones. Cada nodo ocupa una posición. Cada elemento va al nodo más cercano en sentido horario. Con "nodos virtuales" (cada nodo físico tiene `v` posiciones en el anillo), la distribución es más uniforme.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.1.5 — Benchmark: hash maps exactos vs aproximados

**Enunciado:** Para el problema "¿este elemento ya fue visto?", compara el uso de memoria y tiempo de consulta entre: (1) `set` de Python (exacto), (2) bitmap simple (exacto, solo para enteros pequeños), (3) Bloom Filter (aproximado, §18.2). Usa `n = 10^6` elementos de tipo string.

**Restricciones:** Mide: memoria usada (MB), tiempo de inserción, tiempo de consulta, tasa de falsos positivos (para Bloom).

**Pista:** Un `set` de Python con 10^6 strings de 20 bytes usa ~80 MB. Un Bloom Filter con 1% de falsos positivos usa ~10 MB — factor 8x menos. La pregunta es si ese 1% de error es aceptable para tu caso de uso.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 18.2 — Bloom Filter

El Bloom Filter responde "¿este elemento está en el conjunto?" con estas garantías:

```
Si retorna NO  → el elemento definitivamente NO está (0% falsos negativos)
Si retorna SÍ  → el elemento PROBABLEMENTE está (p% falsos positivos)

Estructura: un arreglo de m bits, inicialmente todos en 0
Inserción:  aplica k funciones de hash, pone los k bits en 1
Consulta:   aplica k funciones de hash, verifica si los k bits son 1

m bits
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│0│1│0│1│0│0│1│0│1│0│
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘
     ↑       ↑   ↑
  hash1(x) hash2(x) hash3(x)
  Los 3 bits en 1 → "x probablemente está"
```

**El análisis matemático (sin magia):**

```python
import math

def bloom_parametros(n: int, p: float) -> tuple[int, int]:
    """
    Calcula los parámetros óptimos del Bloom Filter.

    n: número esperado de elementos a insertar
    p: tasa de falsos positivos deseada (ej: 0.01 = 1%)

    Retorna: (m, k)
      m = tamaño del arreglo en bits
      k = número de funciones de hash
    """
    # Derivación:
    # P(falso positivo) ≈ (1 - e^(-kn/m))^k
    # Minimizar respecto a k: k_opt = (m/n) * ln(2)
    # Sustituyendo: m_opt = -n * ln(p) / (ln(2))^2

    m = math.ceil(-n * math.log(p) / (math.log(2) ** 2))
    k = round((m / n) * math.log(2))
    return m, k

# Ejemplos:
# n=1_000_000, p=0.01  → m=9,585,059 bits (~1.2 MB), k=7
# n=1_000_000, p=0.001 → m=14,377,588 bits (~1.7 MB), k=10
# n=1_000_000, p=1e-6  → m=28,755,176 bits (~3.4 MB), k=20
```

**Implementación completa:**

```python
class BloomFilter:
    def __init__(self, n: int, p: float = 0.01):
        """
        n: número esperado de elementos
        p: tasa máxima de falsos positivos
        """
        self.m, self.k = bloom_parametros(n, p)
        self.bits = bytearray(math.ceil(self.m / 8))
        self.n_insertados = 0

    def _get_bit(self, i: int) -> bool:
        return bool(self.bits[i // 8] & (1 << (i % 8)))

    def _set_bit(self, i: int) -> None:
        self.bits[i // 8] |= (1 << (i % 8))

    def add(self, item: str) -> None:
        for pos in k_hashes(item.encode(), self.k, self.m):
            self._set_bit(pos)
        self.n_insertados += 1

    def __contains__(self, item: str) -> bool:
        return all(
            self._get_bit(pos)
            for pos in k_hashes(item.encode(), self.k, self.m)
        )

    @property
    def tasa_falsos_positivos_estimada(self) -> float:
        """Tasa real basada en cuántos elementos se insertaron."""
        return (1 - math.exp(-self.k * self.n_insertados / self.m)) ** self.k

    def __sizeof__(self) -> int:
        return len(self.bits)  # bytes

# Uso:
bf = BloomFilter(n=1_000_000, p=0.01)
bf.add("usuario@ejemplo.com")
bf.add("otro@ejemplo.com")

print("usuario@ejemplo.com" in bf)  # True (sin duda)
print("desconocido@test.com" in bf)  # False (con 99% de certeza)
print(f"Memoria: {bf.__sizeof__()} bytes")  # ~1.2 MB vs ~80 MB de un set
```

---

### Ejercicio 18.2.1 — Implementar Bloom Filter desde cero

**Enunciado:** Implementa un Bloom Filter completo con: cálculo automático de parámetros `(m, k)` dado `(n, p)`, operaciones `add` y `contains`, y medición de la tasa real de falsos positivos empírica.

Verifica: inserta `n = 100_000` strings, luego consulta `100_000` strings distintos que **no** fueron insertados. La tasa de falsos positivos debe ser `≤ p` configurado.

**Restricciones:** La implementación usa un `bytearray` (no un `set`). El uso de memoria debe ser `≤ 2 * m / 8` bytes.

**Pista:** La tasa empírica puede ser ligeramente mayor que `p` si se insertaron más de `n` elementos. Esto es esperado — `p` es una garantía para exactamente `n` inserciones.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.2.2 — Unión e intersección de Bloom Filters

**Enunciado:** Dado que dos Bloom Filters tienen los mismos parámetros `(m, k)`:
- `union(bf1, bf2)` → OR bit a bit — contiene todos los elementos de ambos
- `interseccion(bf1, bf2)` → AND bit a bit — aproxima la intersección

Implementa ambas operaciones. Verifica que la unión es exacta (sin falsos negativos añadidos). Explica por qué la intersección solo es una aproximación.

**Restricciones:** Los dos Bloom Filters deben tener exactamente el mismo `m` y `k`. Mide la tasa de falsos positivos de la intersección — es mayor que la de los originales.

**Pista:** La unión es exacta porque OR preserva los bits en 1. La intersección **no** es exacta: si un bit es 1 en ambos, puede ser por elementos distintos — no necesariamente por el mismo elemento. La intersección sobreestima.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.2.3 — Estimar el tamaño del conjunto insertado

**Enunciado:** Sin llevar un contador externo, estima cuántos elementos únicos han sido insertados en un Bloom Filter contando los bits en 1.

La fórmula es: `n_estimado = -m/k * ln(1 - bits_en_1/m)`

Verifica la precisión para `n = {1000, 10000, 100000}` elementos.

**Restricciones:** La estimación debe tener error `< 5%` para cualquier `n ≤ n_max` (el `n` para el que se dimensionó el filtro).

**Pista:** Esta fórmula se deriva invirtiendo la probabilidad de que un bit esté en 0 después de `n` inserciones: `P(bit=0) = (1 - 1/m)^(kn) ≈ e^(-kn/m)`. Despejando `n` se obtiene la estimación.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.2.4 — Bloom Filter en un pipeline de Cap.17

**Enunciado:** Integra un Bloom Filter en el pipeline de streaming del Cap.17 §4 como filtro de deduplicación: los eventos ya procesados se descartan antes de entrar al pipeline costoso.

El stream tiene `10^6` eventos de los cuales el 30% son duplicados. Compara el rendimiento con y sin Bloom Filter.

**Restricciones:** El Bloom Filter se dimensiona para `n = 10^6` con `p = 0.001`. Un falso positivo (evento descartado por error) es aceptable — un falso negativo (duplicado que pasa) también es aceptable en este contexto.

**Pista:** Este es el uso más común de Bloom Filter en producción: pre-filtro barato antes de una consulta costosa a BD. La BD solo se consulta cuando el Bloom Filter dice "no está" (que es siempre correcto) o cuando quieres verificar el "sí está" que puede ser falso.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.2.5 — Calcular el punto de saturación

**Enunciado:** Un Bloom Filter se "satura" cuando se han insertado tantos elementos que la tasa de falsos positivos supera el umbral `p` original. Implementa una función que: (1) monitorea la tasa de falsos positivos estimada en tiempo real, (2) emite una advertencia cuando supera `2p`, (3) recomienda los nuevos parámetros `(m, k)` para el volumen actual.

**Restricciones:** La tasa estimada debe calcularse en O(1) sin escanear todos los bits.

**Pista:** La tasa estimada en tiempo real es `(1 - e^(-k*n_insertados/m))^k` — solo necesitas `n_insertados` que incrementas con cada `add()`. Cuando supera `2p`, el filtro debe reconstruirse con `n_nuevo = n_insertados * 2` para el doble de capacidad.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 18.3 — Bloom Filter Variantes

El Bloom Filter clásico tiene una limitación: **no soporta eliminación**.
Poner un bit en 1 es irreversible — no sabes si ese bit pertenece a un
elemento o a la superposición de varios.

```
Insertar A: bits {2, 5, 7} → 1
Insertar B: bits {5, 8, 3} → 1
Eliminar A: bits {2, 5, 7} → 0?
  ¡No! El bit 5 lo comparten A y B.
  Si lo ponemos en 0, B daría falso negativo.
```

---

### Ejercicio 18.3.1 — Counting Bloom Filter

**Enunciado:** En lugar de bits, usa **contadores** de 4 bits por posición. La inserción incrementa los contadores, la eliminación los decrementa. Si todos los contadores de un elemento son > 0, está en el conjunto.

**Restricciones:** Contadores de 4 bits (0–15). Si un contador llega a 15 (overflow), no decrementar — emitir advertencia. El uso de memoria es 4x el Bloom Filter clásico.

**Pista:** El Counting Bloom Filter soporta eliminación correcta si cada elemento se insertó exactamente una vez. Insertar el mismo elemento dos veces y eliminarlo una hace que parezca no estar — cuidado con duplicados.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.3.2 — Cuckoo Filter

**Enunciado:** El Cuckoo Filter mejora el Bloom Filter en dos aspectos: soporta eliminación y tiene mejor uso de espacio. Almacena "huellas digitales" (fingerprints) de los elementos en una tabla de hash cuckoo.

Implementa las operaciones `insert`, `lookup` y `delete`. Verifica que la tasa de falsos positivos es comparable al Bloom Filter para el mismo uso de memoria.

**Restricciones:** Tabla con `2` buckets por posición, `4` slots por bucket, fingerprint de 8 bits. La ocupación máxima antes de fallo es ~95%.

**Pista:** El hash cuckoo (Cap.07 si se cubriera) trabaja con dos posiciones posibles para cada elemento. Cuando un slot está ocupado, el elemento existente se "expulsa" a su posición alternativa. Si la cadena de expulsiones es muy larga (>500 pasos), la tabla está llena.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.3.3 — Bloom Filter escalable (Scalable Bloom Filter)

**Enunciado:** Cuando se desconoce `n` de antemano, un solo Bloom Filter puede saturarse. El Bloom Filter escalable usa una **cadena de filtros**: cuando el primero se satura, crea uno nuevo más grande. La tasa total de falsos positivos es la suma geométrica de las individuales.

**Restricciones:** El factor de crecimiento es 2x. La tasa de cada filtro nuevo es `p * r^i` donde `r = 0.5` y `i` es el índice del filtro. La tasa total converge a `p / (1 - r) = 2p`.

**Pista:** Para consultar, basta con que **cualquier** filtro de la cadena diga "sí está" — un falso positivo en un filtro antiguo implica un falso positivo global. Por eso la tasa se acumula — hay que mantenerla pequeña en cada filtro.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.3.4 — Bloom Filter en disco (para grandes volúmenes)

**Enunciado:** Para `n = 10^9` elementos, el Bloom Filter en memoria requiere ~1.2 GB. Implementa un Bloom Filter que vive en disco (archivo mapeado en memoria) con acceso a las posiciones de hash usando `mmap`.

**Restricciones:** El archivo ocupa exactamente `ceil(m/8)` bytes. Las lecturas y escrituras deben ser `O(k)` operaciones de disco — no cargar el filtro completo.

**Pista:** `mmap` mapea un archivo al espacio de direcciones del proceso — el SO carga en memoria solo las páginas que se acceden. Con `k=7` hashes, cada operación toca a lo sumo 7 páginas de 4KB. Esto es eficiente si los hashes están distribuidos.

**Implementar en:** Python · Go · Rust

---

### Ejercicio 18.3.5 — Medir el impacto real en un sistema del Cap.17

**Enunciado:** Integra un Bloom Filter escalable en el sistema de análisis de grafos del Cap.17 §7 para:
1. Deduplicar solicitudes repetidas antes de procesarlas
2. Pre-filtrar IDs de grafos que definitivamente no existen en BD (evitando la consulta)
3. Cachear negativos: si Dijkstra reportó "no hay camino" ayer, probablemente sigue igual

Mide el porcentaje de consultas a BD evitadas y el impacto en latencia.

**Pista:** El uso 2 (pre-filtrar IDs inexistentes) es el más impactante en producción — las consultas a BD de "no existe" son costosas y frecuentes. Un Bloom Filter que tiene todos los IDs existentes permite rechazar el 100% de los "no existe" sin consultar BD (con posibles falsos positivos que sí van a BD).

**Implementar en:** Python · Java · Go · Rust

---

## Sección 18.4 — HyperLogLog

HyperLogLog responde "¿cuántos elementos únicos hay?" usando espacio `O(log log n)`.
Es la estructura de datos con el nombre más apropiado de la computación.

**La idea central — intuición antes que fórmulas:**

```
Observación: si tiras una moneda hasta obtener cara, la longitud
de la racha de sellos más larga que observas indica cuántas tiradas hiciste.

- Racha de 1 sello antes de cara → ~2 tiradas (2^1)
- Racha de 3 sellos antes de cara → ~8 tiradas (2^3)
- Racha de 10 sellos antes de cara → ~1024 tiradas (2^10)

HyperLogLog hace exactamente esto con bits del hash:
- hash(elemento) → secuencia de bits
- Cuenta los ceros iniciales en el hash (como la racha de sellos)
- El máximo de ceros iniciales observado → estima log2(n_únicos)
```

```python
def hyperloglog_naive(stream, m_buckets=64):
    """
    Versión ingenua para entender la idea.
    m_buckets debe ser potencia de 2.
    """
    import math

    # Dividir en m_buckets substreams para reducir varianza
    registros = [0] * m_buckets
    b = int(math.log2(m_buckets))

    for elemento in stream:
        h = murmurhash3_32(str(elemento).encode())
        # Los primeros b bits determinan el bucket
        bucket_idx = h >> (32 - b)
        # Los bits restantes: cuenta los ceros iniciales + 1
        resto = h & ((1 << (32 - b)) - 1)
        ceros_iniciales = (32 - b) - resto.bit_length() + 1
        registros[bucket_idx] = max(registros[bucket_idx], ceros_iniciales)

    # Estimación usando media armónica
    alpha = 0.7213 / (1 + 1.079 / m_buckets)  # constante de corrección
    Z = sum(2 ** (-r) for r in registros)
    estimacion = alpha * m_buckets ** 2 / Z

    return int(estimacion)

# Con m=64 buckets (64 * 6 bits = 48 bytes de registro):
# Error estándar ≈ 1.04 / sqrt(64) ≈ 13%
# Con m=1024 buckets (1024 * 6 bits = 768 bytes):
# Error estándar ≈ 1.04 / sqrt(1024) ≈ 3.25%
# Con m=16384 buckets (~12 KB):
# Error estándar ≈ 1.04 / sqrt(16384) ≈ 0.81%
```

**La paradoja del espacio:**

```
Contar exactamente 10^9 elementos únicos:
  HashSet: ~40 GB (guarda cada elemento)
  Bitmap:  ~125 MB (un bit por posible ID)
  HyperLogLog: ~12 KB (!!!!) con error ±1%

12 KB vs 40 GB: factor de 3,000,000x menos memoria.
Este es el motivo por el que Redis incluye HyperLogLog nativo (PFADD / PFCOUNT).
```

---

### Ejercicio 18.4.1 — Implementar HyperLogLog completo

**Enunciado:** Implementa HyperLogLog con las correcciones de sesgo estándar (pequeños y grandes rangos). Verifica la precisión para `n = {10^3, 10^4, 10^5, 10^6, 10^7}` elementos únicos con `m = 1024` buckets.

**Restricciones:** El error debe ser `< 5%` para todos los rangos. Implementa las correcciones: para `n < 2.5m` usar Linear Counting, para `n > 2^32/30` usar corrección de gran cardinalidad.

**Pista:** Sin correcciones, HyperLogLog sobreestima para valores pequeños y tiene problemas de redondeo para valores muy grandes. Linear Counting (contar buckets vacíos) es más preciso cuando pocos buckets están llenos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.4.2 — Merge de HyperLogLogs

**Enunciado:** Una de las propiedades más valiosas de HyperLogLog es que dos instancias con el mismo `m` se pueden mergear tomando el máximo de cada registro. Implementa el merge y verifica que `HLL(A ∪ B)` es igual a mergear `HLL(A)` con `HLL(B)`.

**Restricciones:** Los dos HLL deben tener el mismo `m`. El merge es `O(m)` — no `O(n)`.

**Pista:** Esta propiedad hace HyperLogLog ideal para sistemas distribuidos: cada nodo cuenta sus elementos y envía `m` registros. El coordinador hace merge con máximos. Así se cuenta el total de usuarios únicos en un sistema distribuido sin mover todos los datos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.4.3 — HyperLogLog en streaming de eventos

**Enunciado:** Implementa un contador de "usuarios únicos por hora" usando HyperLogLog. El stream tiene `10^7` eventos por hora, cada uno con un `user_id`. Reporta el conteo de únicos cada 60 segundos sin releer los datos históricos.

**Restricciones:** Usa una ventana deslizante de 1 hora (Cap.03 §3). El HLL de cada ventana de 60 segundos se crea independientemente y se mergea al HLL de la hora.

**Pista:** Al final de cada minuto, mergea el HLL del minuto al HLL de la hora. Para mantener la ventana deslizante, necesitas guardar los últimos 60 HLLs de minutos y reconstruir el de la hora mergeando los 60. Esto es `O(60 * m)` por actualización.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.4.4 — Comparar con conteo exacto

**Enunciado:** Para `n = 10^5` elementos con distribución Zipf (algunos muy frecuentes, mayoría raros — distribución realista de tráfico web), compara:
1. `set` exacto: memoria y tiempo
2. HyperLogLog `m=256`: memoria, tiempo y error
3. HyperLogLog `m=4096`: memoria, tiempo y error

**Restricciones:** Distribución Zipf con `s=1.07` (típica en web). Reporta el percentil 95 y 99 del error sobre 1000 experimentos.

**Pista:** La distribución Zipf hace que algunos elementos aparezcan millones de veces y la mayoría solo una. HyperLogLog ignora las repeticiones (solo cuenta únicos) — el número de inserciones no afecta la precisión, solo el número de únicos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.4.5 — Implementar PFADD / PFCOUNT de Redis en Python

**Enunciado:** Redis implementa HyperLogLog con los comandos `PFADD` (insertar) y `PFCOUNT` (contar). Implementa una clase `RedisHLL` que replica este comportamiento incluyendo la serialización compacta de Redis (12 KB por HLL).

**Restricciones:** Serialización compatible: `m=16384` registros de 6 bits cada uno = `16384 * 6 / 8 = 12288` bytes. Implementa la representación "sparse" para HLLs con pocos elementos.

**Pista:** Redis usa representación sparse cuando `n` es pequeño (pocos buckets con valor > 0) y representación dense cuando hay muchos. La transición ocurre en `n ≈ 80`. Esto reduce el espacio de KBs a bytes para HLLs pequeños.

**Implementar en:** Python · Java · Go · Rust

---

## Sección 18.5 — Count-Min Sketch

Count-Min Sketch responde "¿cuántas veces apareció este elemento?" con garantía de
**sobreestimación acotada** — nunca subestima, y la sobreestimación tiene cota.

```
Estructura: una matriz de d filas × w columnas de contadores

Inserción de elemento x:
  Para cada fila i: incrementa CMS[i][hash_i(x) % w]

Consulta de elemento x:
  Para cada fila i: lee CMS[i][hash_i(x) % w]
  Retorna el MÍNIMO de los d valores leídos

¿Por qué el mínimo?
  El contador puede estar inflado por colisiones con otros elementos.
  El mínimo de d filas independientes da la mejor estimación — si un
  contador está inflado, es poco probable que TODOS d estén inflados.
```

**Garantías formales:**

```python
def cms_parametros(epsilon: float, delta: float) -> tuple[int, int]:
    """
    epsilon: error máximo como fracción de la suma total
             count_estimado <= count_real + epsilon * N
             donde N = suma de todos los conteos

    delta:   probabilidad de exceder el error epsilon
             P(error > epsilon * N) < delta

    Retorna (w, d):
      w = ceil(e / epsilon)    ← ancho de la matriz
      d = ceil(ln(1 / delta))  ← número de filas (funciones de hash)
    """
    import math
    w = math.ceil(math.e / epsilon)
    d = math.ceil(math.log(1 / delta))
    return w, d

# Ejemplos:
# epsilon=0.01, delta=0.01 → w=272, d=5
# → Matriz de 5 × 272 = 1360 contadores
# → Garantía: con 99% de probabilidad, el error es < 1% de N

# Si N = 10^9 eventos totales:
# Error máximo ≈ 0.01 * 10^9 = 10^7
# Para eventos raros (count=100), el error relativo puede ser enorme
# Para eventos frecuentes (count=10^6), el error es < 1%
```

---

### Ejercicio 18.5.1 — Implementar Count-Min Sketch

**Enunciado:** Implementa Count-Min Sketch con las operaciones `add(elemento, count=1)` y `query(elemento)`. Verifica las garantías: para 10^6 eventos con distribución Zipf, compara los conteos estimados con los exactos.

**Restricciones:** `epsilon=0.01`, `delta=0.01`. El error debe satisfacer `estimado <= exacto + 0.01 * N` con probabilidad ≥ 99%.

**Pista:** La implementación más simple usa `d` arrays de tamaño `w` con contadores enteros. Cada fila usa una función de hash diferente. El espacio es `O(d*w)` independiente de cuántos elementos distintos hay.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.5.2 — Top-K con Count-Min Sketch (Heavy Hitters)

**Enunciado:** Combina Count-Min Sketch con un Min-Heap (Cap.05) para mantener los `k` elementos más frecuentes en un stream. El heap tiene tamaño `k` y usa los conteos estimados del CMS.

**Restricciones:** `k=10`, `n=10^7` eventos, distribución Zipf. Compara el top-10 obtenido con el exacto — deben coincidir en al menos 8 de 10.

**Pista:** Este algoritmo — CMS + heap — es exactamente cómo Twitter identifica los trending topics y cómo los routers de red detectan "elephant flows" (flujos de datos muy grandes). El heap se actualiza cuando un elemento supera el mínimo actual.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.5.3 — Count-Min Sketch con decaimiento temporal

**Enunciado:** Para detectar trending topics en tiempo real, los conteos antiguos deben pesar menos que los recientes. Implementa un CMS con **decaimiento exponencial**: cada segundo, multiplica todos los contadores por `0.9` (decaimiento 10% por segundo).

**Restricciones:** El decaimiento es lazy — en lugar de multiplicar todos los contadores en cada segundo (caro), aplica el factor de decaimiento acumulado cuando se hace una consulta.

**Pista:** Guarda el timestamp del último update. Al consultar, calcula `factor = 0.9^(segundos_transcurridos)` y multiplica el valor leído. Al insertar, si pasó más de 1 segundo, aplica el decaimiento antes de incrementar.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.5.4 — Comparar CMS con soluciones exactas

**Enunciado:** Para el problema "frecuencia de cada elemento", compara memoria y tiempo entre: (1) `Counter` exacto (Python), (2) Count-Min Sketch `epsilon=0.01`, (3) Count-Min Sketch `epsilon=0.001`.

Para `n = 10^7` eventos de un vocabulario de `10^5` palabras únicas.

**Restricciones:** Mide: memoria (MB), tiempo de inserción total, tiempo de consulta, error máximo, error promedio.

**Pista:** El `Counter` exacto usa memoria proporcional al número de elementos únicos (hasta `O(V)` donde `V` es el vocabulario). El CMS usa `O(d*w)` independiente de `V`. Para `V` grande, CMS gana enormemente en memoria aunque tenga error.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.5.5 — CMS en el pipeline del Cap.17

**Enunciado:** Integra Count-Min Sketch en el pipeline de streaming del Cap.17 §4 para detectar anomalías de frecuencia: URLs visitadas más de `umbral` veces en la última hora (posible DDoS o scraping).

El sistema debe: contar visitas por URL en tiempo real, alertar cuando un URL supera el umbral, y resetear los contadores cada hora.

**Restricciones:** `epsilon=0.001`, `delta=0.01`. El reset cada hora evita que los contadores crezcan indefinidamente — crea un nuevo CMS cada hora y descarta el anterior.

**Pista:** El CMS es la estructura que usan los CDNs (Cloudflare, Akamai) para detectar ataques DDoS a nivel de URL sin mantener un contador por cada URL posible (que serían millones). La garantía de no-subestimación es clave: nunca pierde un ataque real.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 18.6 — MinHash y Similitud de Conjuntos

MinHash estima la **similitud de Jaccard** entre dos conjuntos sin compararlos
elemento por elemento. Fundamental para deduplicación de documentos y
sistemas de recomendación.

```
Similitud de Jaccard:
  J(A, B) = |A ∩ B| / |A ∪ B|

  A = {perro, gato, ave}
  B = {perro, pez, ave}
  J(A, B) = |{perro,ave}| / |{perro,gato,ave,pez}| = 2/4 = 0.5

Calcularla exactamente requiere conocer A y B completos.
MinHash la estima con error ±O(1/sqrt(k)) usando k funciones de hash.

La magia: P(min_hash(A) == min_hash(B)) = J(A, B)
Si el mínimo del hash de A coincide con el mínimo del hash de B,
es precisamente la probabilidad de que ese elemento esté en la intersección.
```

---

### Ejercicio 18.6.1 — Implementar MinHash

**Enunciado:** Implementa MinHash con `k` funciones de hash. Para dos conjuntos de texto (documentos tokenizados en shingles de 3 palabras), estima la similitud de Jaccard y compara con el valor exacto.

**Restricciones:** `k=128` funciones de hash. El error esperado es `1/sqrt(128) ≈ 8.8%`. Verifica sobre 100 pares de documentos con similitudes conocidas.

**Pista:** Un "shingle" de 3 palabras del texto "el perro grande come" es `{"el perro grande", "perro grande come"}`. Esto convierte el documento en un conjunto — similar a cómo funciona la detección de plagio.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.6.2 — Locality-Sensitive Hashing (LSH)

**Enunciado:** MinHash permite encontrar los documentos similares a uno dado en `O(1)` amortizado en lugar de `O(n)` (comparar contra todos). Implementa LSH con bandas: divide los `k` hashes en `b` bandas de `r` hashes cada una. Dos documentos son candidatos si coinciden en alguna banda completa.

**Restricciones:** `k=128`, `b=16`, `r=8`. Ajusta `b` y `r` para balancear entre falsos positivos y falsos negativos en el umbral de similitud `t=0.7`.

**Pista:** La probabilidad de que dos documentos con similitud `s` sean detectados como similares es `1 - (1 - s^r)^b`. Grafica esta función para diferentes valores de `b` y `r` — forma una curva en S que se puede ajustar al umbral deseado.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 18.6.3 — Deduplicar un corpus de documentos

**Enunciado:** Dado un corpus de `10^5` documentos, encuentra todos los pares con similitud de Jaccard `≥ 0.8` usando MinHash + LSH. Sin LSH la búsqueda exhaustiva es `O(n²) = 10^{10}` comparaciones — inviable.

**Restricciones:** Con LSH, el número de pares candidatos debe ser `< 1%` del total `n²`. Verifica que no se pierden pares con similitud real `≥ 0.9` (falsos negativos aceptables para `0.8 ≤ s < 0.9`).

**Pista:** Este es exactamente el algoritmo que usa Google para detectar páginas web duplicadas. El corpus de 10^5 documentos es pequeño — en producción son 10^{12} páginas.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 18.6.4 — MinHash para sistema de recomendación

**Enunciado:** Modela las preferencias de usuarios como conjuntos de ítems vistos. Usa MinHash para recomendar: "usuarios con gustos similares también vieron X". Implementa el pipeline completo: perfiles de usuario → MinHash → LSH → candidatos → ranking.

**Restricciones:** `10^4` usuarios, `10^5` ítems, media de `100` ítems por usuario. El tiempo de consulta para un usuario nuevo debe ser `< 100ms`.

**Pista:** La similitud de Jaccard entre usuarios es exactamente lo que MinHash estima. Dos usuarios con `J(A,B) = 0.7` comparten el 70% de sus gustos — buenos candidatos para recomendación colaborativa.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 18.6.5 — Comparar Bloom Filter vs MinHash para deduplicación

**Enunciado:** Para el problema "¿este documento ya está en la colección?", compara dos aproximaciones:
1. **Bloom Filter** del hash del documento completo → O(1) consulta, sin similitud
2. **MinHash** → detecta documentos casi-duplicados (similitud ≥ umbral)

Usa un corpus donde el 20% de los documentos son "casi duplicados" (similitud 0.85–0.95) y el 5% son duplicados exactos.

**Restricciones:** Mide: falsos positivos, falsos negativos, memoria, tiempo de consulta, tiempo de inserción para cada approach.

**Pista:** Bloom Filter es binario (exacto o no-exacto). MinHash detecta el espectro de similitud. Para documentos web donde hay "versiones ligeramente modificadas", MinHash es necesario. Para emails idénticos, Bloom Filter es suficiente y más eficiente.

**Implementar en:** Python · Java · Go · Rust

---

## Sección 18.7 — Aplicaciones en Sistemas Reales

Esta sección mapea cada estructura probabilística a su uso de producción,
conectando el Cap.18 con el mapa del Cap.17 §6.

```
Sistema          Estructura      Propósito
────────────     ──────────      ─────────────────────────────────────
Google Bigtable  Bloom Filter    Evitar lecturas en disco para claves inexistentes
Redis            HyperLogLog     PFADD/PFCOUNT — usuarios únicos en O(1)
Cassandra        Bloom Filter    Saber en qué SSTables puede estar una clave
Apache Spark     Count-Min       Estadísticas aproximadas de DataFrames grandes
Akamai CDN       Count-Min       Detección de DDoS y hot spots
Google Search    MinHash+LSH     Deduplicación de páginas web
Spotify          MinHash         Recomendaciones de canciones similares
Bitcoin          Bloom Filter    Wallets ligeros que filtran transacciones relevantes
Chrome           Bloom Filter    Safe Browsing — URLs maliciosas
PostgreSQL       HyperLogLog     Estadísticas de cardinalidad para el query planner
```

---

### Ejercicio 18.7.1 — Safe Browsing con Bloom Filter (estilo Chrome)

**Enunciado:** Chrome descarga una lista de URLs maliciosas como Bloom Filter. Implementa el sistema completo: el servidor genera el filtro con `10^6` URLs maliciosas, el cliente lo descarga (`< 2 MB`), y consulta localmente si una URL está en la lista antes de navegar.

**Restricciones:** `p = 0.001` (1 en 1000 falsos positivos — una URL legítima bloqueada). El tamaño del filtro debe caber en `< 2 MB`. Las actualizaciones son incrementales (no descargar todo de nuevo).

**Pista:** Un falso positivo bloquea una URL legítima — molesto pero seguro. Un falso negativo (URL maliciosa no detectada) es el error inaceptable. Bloom Filter garantiza que los falsos negativos son imposibles — esto lo hace perfecto para seguridad.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.7.2 — Query planner con HyperLogLog (estilo PostgreSQL)

**Enunciado:** PostgreSQL usa HyperLogLog para estimar la cardinalidad de columnas y elegir el plan de ejecución óptimo para JOIN. Implementa un mini query planner que, dado `SELECT * FROM A JOIN B ON A.id = B.id`, use HLL para estimar qué tabla es más pequeña y usarla como tabla exterior del nested loop join.

**Restricciones:** Las tablas tienen entre `10^3` y `10^7` filas. La estimación de cardinalidad debe ser correcta con error `< 10%` para elegir el plan óptimo.

**Pista:** El join nested loop tiene costo `O(|exterior| * |interior|)` si el interior está indexado. Elegir la tabla más pequeña como exterior reduce el costo. Con HLL se estima el tamaño en `O(1)` sin escanear toda la tabla.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.7.3 — Rate limiting con Count-Min Sketch

**Enunciado:** Implementa un rate limiter que limita a `1000 requests/minuto por usuario` usando Count-Min Sketch. El sistema tiene `10^6` usuarios activos — un contador exacto por usuario usaría demasiada memoria.

**Restricciones:** `epsilon=0.0001`, `delta=0.001`. La sobreestimación hace que algunos usuarios sean limitados antes de llegar a 1000 — esto es aceptable (conservador). La subestimación sería inaceptable (permitiría pasar el límite).

**Pista:** La garantía de no-subestimación del CMS es exactamente lo que necesita un rate limiter: nunca reporta menos requests de los que hubo realmente. Los contadores se resetean cada minuto.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 18.7.4 — Deduplicación en Cassandra (estilo SSTable)

**Enunciado:** Cassandra usa Bloom Filters para cada SSTable (archivo de datos en disco). Al buscar una clave, primero consulta el Bloom Filter de cada SSTable — solo accede a disco si el filtro dice "puede estar aquí".

Implementa un motor de almacenamiento simplificado con múltiples SSTables, cada una con su Bloom Filter, y mide el porcentaje de accesos a disco evitados.

**Restricciones:** `5` SSTables, `10^5` claves por tabla, `p=0.01`. Para una clave que no existe en ninguna tabla, todos los Bloom Filters deben decir "no" (con 99% de probabilidad).

**Pista:** La probabilidad de que una clave inexistente pase el filtro de **todas** las SSTables es `p^k` donde `k` es el número de tablas. Con `k=5` y `p=0.01`: `0.01^5 = 10^{-10}` — prácticamente imposible.

**Implementar en:** Python · Java · Go · Rust

---

### Ejercicio 18.7.5 — Sistema completo: Bloom + HLL + CMS integrados

**Enunciado:** Construye un sistema de análisis de tráfico web que use las tres estructuras juntas:
1. **Bloom Filter**: deduplicar sesiones — ¿esta sesión ya fue procesada?
2. **HyperLogLog**: contar usuarios únicos por hora — ¿cuántos visitantes únicos?
3. **Count-Min Sketch**: top URLs más visitadas — ¿qué páginas son trending?

El sistema procesa un stream de `10^6` eventos/hora con `10^5` usuarios únicos y `10^3` URLs distintas.

**Restricciones:** Memoria total `< 10 MB` para las tres estructuras juntas. Actualiza las métricas cada 10 segundos. El sistema usa los patrones del Cap.17 (async, Result, pipeline).

**Pista:** Este es el sistema exacto que usan herramientas como Mixpanel, Amplitude o Google Analytics internamente — con variantes más sofisticadas. Las tres estructuras son complementarias: Bloom para unicidad, HLL para cardinalidad, CMS para frecuencia.

**Implementar en:** Python · Java · Go · Rust

---

## Tabla resumen — Estructuras probabilísticas

| Estructura | Pregunta | Garantía | Espacio | Origen en el repo |
|---|---|---|---|---|
| **Bloom Filter** | ¿Está en el conjunto? | Sin falsos negativos | `O(n)` bits | Cap.13 bits + Cap.14 hash |
| **Counting BF** | ¿Está? + soporta delete | Sin falsos negativos | `O(4n)` bits | Cap.13 bits |
| **Cuckoo Filter** | ¿Está? + delete eficiente | Sin falsos negativos | `O(n)` bits | Cap.14 hash |
| **HyperLogLog** | ¿Cuántos únicos? | Error ±`1.04/√m` | `O(log log n)` | Cap.14 aritmética |
| **Count-Min** | ¿Cuántas veces? | Nunca subestima | `O(ε⁻¹ log δ⁻¹)` | Cap.14 hash + Cap.13 |
| **MinHash** | ¿Qué tan similares? | Error ±`1/√k` | `O(k)` por conjunto | Cap.14 hash |

## Cuándo usar cada una

```
¿Necesitas saber si un elemento está en un conjunto muy grande?
    → Bloom Filter (o Cuckoo si necesitas delete)

¿Necesitas contar elementos únicos en un stream masivo?
    → HyperLogLog

¿Necesitas saber con qué frecuencia aparece cada elemento?
    → Count-Min Sketch

¿Necesitas encontrar elementos similares en un corpus grande?
    → MinHash + LSH

¿Necesitas respuestas exactas y la memoria no es un problema?
    → Usa las estructuras de Cap.01–10 (este capítulo no aplica)
```

> **El principio de este capítulo:**
> La exactitud es un lujo. A escala de internet, pagar `O(n)` de memoria por
> cada elemento es imposible. Las estructuras probabilísticas intercambian
> un error controlado y cuantificable por una reducción de órdenes de magnitud
> en memoria y tiempo. Saber cuándo hacer ese intercambio es lo que distingue
> al ingeniero de sistemas del programador que solo conoce las estructuras exactas.
