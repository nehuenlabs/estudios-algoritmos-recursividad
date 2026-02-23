# Guía de Ejercicios — Trie (Árbol de Prefijos)

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `09_union_find.md`.

---

## Concepto fundamental

Un **Trie** (pronunciado "try", de *retrieval*) es un árbol donde cada nodo representa un carácter y cada camino desde la raíz hasta un nodo marcado como "final" representa una palabra.

```
Trie con las palabras: "cat", "car", "card", "care", "bat"

         raíz
        /    \
       c      b
       |      |
       a      a
      / \     |
     t   r    t*
    *   / \
       d*  e*
```

**Ventaja sobre otras estructuras:**

| Operación | HashMap | Trie |
|---|---|---|
| Buscar palabra exacta | `O(k)` | `O(k)` |
| Buscar prefijo | `O(n·k)` | `O(k)` |
| Listar palabras con prefijo | `O(n·k)` | `O(k + resultados)` |
| Autocompletado | `O(n·k)` | `O(k + resultados)` |
| Insertar palabra | `O(k)` | `O(k)` |

donde `k` = longitud de la palabra, `n` = número de palabras.

El Trie es óptimo cuando **el prefijo importa**. Si solo necesitas búsqueda exacta, un `HashSet` es suficiente.

---

## Implementación base

```python
class NodoTrie:
    def __init__(self):
        self.hijos = {}        # carácter → NodoTrie
        self.es_fin = False    # ¿termina aquí una palabra?
        # Opcional: self.valor = None   (para Trie de clave-valor)
        # Opcional: self.conteo = 0     (cuántas palabras pasan por aquí)

class Trie:
    def __init__(self):
        self.raiz = NodoTrie()

    def insertar(self, palabra):
        nodo = self.raiz
        for char in palabra:
            if char not in nodo.hijos:
                nodo.hijos[char] = NodoTrie()
            nodo = nodo.hijos[char]
        nodo.es_fin = True

    def buscar(self, palabra):
        """Retorna True si la palabra exacta está en el Trie."""
        nodo = self.raiz
        for char in palabra:
            if char not in nodo.hijos:
                return False
            nodo = nodo.hijos[char]
        return nodo.es_fin

    def empieza_con(self, prefijo):
        """Retorna True si existe alguna palabra con este prefijo."""
        nodo = self.raiz
        for char in prefijo:
            if char not in nodo.hijos:
                return False
            nodo = nodo.hijos[char]
        return True          # llegamos al final del prefijo → existe

    def palabras_con_prefijo(self, prefijo):
        """Retorna todas las palabras que empiezan con prefijo."""
        nodo = self.raiz
        for char in prefijo:
            if char not in nodo.hijos:
                return []
            nodo = nodo.hijos[char]

        # DFS desde el nodo del prefijo
        resultado = []
        self._dfs(nodo, prefijo, resultado)
        return resultado

    def _dfs(self, nodo, prefijo_actual, resultado):
        if nodo.es_fin:
            resultado.append(prefijo_actual)
        for char, hijo in nodo.hijos.items():
            self._dfs(hijo, prefijo_actual + char, resultado)

# Alternativa: Trie con arreglo (más eficiente para alfabeto fijo)
class NodoTrieArray:
    def __init__(self):
        self.hijos = [None] * 26       # solo letras minúsculas a-z
        self.es_fin = False

    def indice(self, char):
        return ord(char) - ord('a')
```

---

## Tabla de contenidos

- [Sección 10.1 — Operaciones básicas](#sección-101--operaciones-básicas)
- [Sección 10.2 — Autocompletado y búsqueda de prefijos](#sección-102--autocompletado-y-búsqueda-de-prefijos)
- [Sección 10.3 — Trie con comodines y patrones](#sección-103--trie-con-comodines-y-patrones)
- [Sección 10.4 — Trie en problemas de bits (XOR Trie)](#sección-104--trie-en-problemas-de-bits-xor-trie)
- [Sección 10.5 — Trie en problemas clásicos de entrevistas](#sección-105--trie-en-problemas-clásicos-de-entrevistas)

---

## Sección 10.1 — Operaciones básicas

---

### Ejercicio 10.1.1 — Implementar Trie completo

**Enunciado:** Implementa un Trie con las operaciones: `insertar(palabra)`, `buscar(palabra)`, `empieza_con(prefijo)` y `eliminar(palabra)`. Para `eliminar`, borra los nodos huérfanos (sin otros hijos y sin ser fin de palabra). (LeetCode 208 + eliminación)

**Restricciones:** Hasta `3*10^4` operaciones. Solo letras minúsculas.

**Pista:** `eliminar` es la operación más compleja. Usa recursión: al retornar de la llamada recursiva, decide si el nodo actual puede eliminarse (no tiene hijos y no es fin de otra palabra).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.1.2 — Trie con conteo de palabras y prefijos

**Enunciado:** Extiende el Trie para que cada nodo guarde: (a) cuántas palabras terminan exactamente aquí, (b) cuántas palabras pasan por aquí (tienen este prefijo). Responde: `contar_palabras(prefijo)` y `contar_con_prefijo(prefijo)`.

**Restricciones:** Hasta `10^4` palabras, `10^4` consultas.

**Pista:** Incrementa `conteo_paso` en cada nodo al insertar. Incrementa `conteo_fin` solo en el último nodo. Al eliminar, decrementa los conteos correspondientes.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.1.3 — Trie con arreglo vs Trie con diccionario

**Enunciado:** Implementa el Trie de dos formas: con `hijos = [None]*26` (arreglo) y con `hijos = {}` (diccionario). Compara: uso de memoria, tiempo de inserción y búsqueda para `n=10^4` palabras del diccionario español.

**Restricciones:** Usa un archivo de palabras reales o genera `n=10^4` palabras aleatorias.

**Pista:** El arreglo usa `O(26 * nodos)` espacio pero acceso `O(1)`. El diccionario usa `O(hijos_reales * nodos)` espacio pero con overhead de hash. Para alfabeto de 26 letras, el arreglo suele ser más rápido en la práctica.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.1.4 — Serializar y deserializar un Trie

**Enunciado:** Implementa `serializar(trie) → string` y `deserializar(string) → trie` de forma que el Trie reconstruido sea idéntico al original.

**Restricciones:** El Trie puede tener hasta `10^4` palabras.

**Pista:** Una forma simple: serializa como lista de palabras separadas por `\n` (DFS pre-order). Una forma más eficiente: representa el árbol como `(char, es_fin, num_hijos, [hijos...])` de forma recursiva.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.1.5 — Trie vs HashSet: benchmark

**Enunciado:** Dado un diccionario de `n=10^5` palabras, compara el tiempo de: (a) insertar todas, (b) buscar `10^4` palabras exactas, (c) buscar `10^4` prefijos, (d) obtener todas las palabras con un prefijo dado, usando Trie y HashSet.

**Restricciones:** `n=10^5` palabras.

**Pista:** Para (a) y (b), HashSet es comparable o más rápido. Para (c) y (d), el Trie es significativamente más rápido porque no necesita iterar por todas las palabras.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 10.2 — Autocompletado y búsqueda de prefijos

El autocompletado es la aplicación más directa del Trie. Dado un prefijo, retorna las `k` palabras más relevantes que empiezan con ese prefijo.

```python
import heapq

class TrieAutocompletado:
    def __init__(self):
        self.raiz = NodoTrie()

    def insertar(self, palabra, popularidad):
        nodo = self.raiz
        for char in palabra:
            if char not in nodo.hijos:
                nodo.hijos[char] = NodoTrie()
            nodo = nodo.hijos[char]
        nodo.es_fin = True
        nodo.popularidad = popularidad

    def top_k(self, prefijo, k=3):
        """Retorna las k palabras más populares con el prefijo dado."""
        nodo = self.raiz
        for char in prefijo:
            if char not in nodo.hijos:
                return []
            nodo = nodo.hijos[char]

        # BFS o DFS desde el nodo del prefijo, recolectando las k mejores
        candidatos = []
        self._dfs_popularidad(nodo, prefijo, candidatos)
        candidatos.sort(key=lambda x: -x[0])
        return [palabra for _, palabra in candidatos[:k]]

    def _dfs_popularidad(self, nodo, actual, resultado):
        if nodo.es_fin:
            resultado.append((nodo.popularidad, actual))
        for char, hijo in nodo.hijos.items():
            self._dfs_popularidad(hijo, actual + char, resultado)
```

---

### Ejercicio 10.2.1 — Autocompletado básico

**Enunciado:** Implementa un sistema de autocompletado: dado un prefijo, retorna todas las palabras del diccionario que empiezan con ese prefijo, ordenadas alfabéticamente. (LeetCode 720 relacionado)

**Restricciones:** Diccionario de hasta `10^4` palabras. Prefijo de hasta `20` caracteres.

**Pista:** Navega el Trie hasta el nodo del prefijo. Desde ahí, DFS para recolectar todas las palabras. El DFS ya produce orden alfabético si iteras `hijos` en orden.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.2.2 — Top-k palabras más populares con prefijo

**Enunciado:** Extiende el autocompletado para retornar las `k` palabras más populares (por frecuencia de búsqueda) que empiezan con el prefijo dado. (LeetCode 1268)

**Restricciones:** `1 <= k <= 3`. Diccionario de hasta `10^3` palabras.

**Pista:** Guarda `popularidad` en cada nodo final. En el DFS, recolecta todos los candidatos y ordena por popularidad (y por orden alfabético como desempate).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.2.3 — Búsqueda de productos (e-commerce)

**Enunciado:** Dado un catálogo de `n` productos y una búsqueda carácter por carácter, después de escribir cada carácter retorna los 3 productos que más coinciden con el prefijo escrito hasta ahora (orden lexicográfico). (LeetCode 1268)

**Restricciones:** `1 <= n <= 1000`. Todas las strings en minúsculas.

**Pista:** Inserta todos los productos en el Trie. Para cada prefijo (i=1..len(búsqueda)), llama a `top_3(prefijo[:i])`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.2.4 — Prefijo común más largo

**Enunciado:** Dado un arreglo de strings, encuentra el prefijo común más largo entre todas ellas. Por ejemplo, `["flower","flow","flight"]` → `"fl"`. (LeetCode 14)

**Restricciones:** `1 <= len(strings) <= 200`. Solo letras minúsculas.

**Pista:** Inserta todas las palabras en el Trie. Navega desde la raíz mientras cada nodo tenga exactamente un hijo y no sea fin de una palabra corta. El camino recorrido es el prefijo común.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.2.5 — Suma de longitudes de prefijos únicos

**Enunciado:** Dado un arreglo de strings, para cada string calcula la longitud de su prefijo único mínimo (el prefijo más corto que no es prefijo de ninguna otra palabra del arreglo). Retorna la suma de todas estas longitudes.

**Restricciones:** `1 <= len(strings) <= 10^3`. Strings distintas.

**Pista:** Inserta todas las palabras con contador de paso. El prefijo único mínimo de una palabra es el primer nodo donde su contador de paso es 1 (solo esa palabra pasa por aquí).

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 10.3 — Trie con comodines y patrones

Un Trie puede extenderse para soportar búsquedas con comodines, lo que lo convierte en una herramienta para matching de patrones.

```python
class TrieConComodin:
    def __init__(self):
        self.raiz = NodoTrie()

    def buscar_con_punto(self, patron):
        """'.' coincide con cualquier carácter."""
        return self._buscar(self.raiz, patron, 0)

    def _buscar(self, nodo, patron, idx):
        if idx == len(patron):
            return nodo.es_fin

        char = patron[idx]
        if char == '.':
            # Prueba todos los hijos posibles
            for hijo in nodo.hijos.values():
                if self._buscar(hijo, patron, idx + 1):
                    return True
            return False
        else:
            if char not in nodo.hijos:
                return False
            return self._buscar(nodo.hijos[char], patron, idx + 1)
```

---

### Ejercicio 10.3.1 — Diseño de buscador de palabras con comodines

**Enunciado:** Implementa una estructura que soporte `insertar(palabra)` y `buscar(patron)` donde el patrón puede contener `.` (coincide con cualquier carácter). (LeetCode 211)

**Restricciones:** Hasta `10^4` operaciones. Solo letras minúsculas y `.`.

**Pista:** La búsqueda con `.` requiere explorar todos los hijos del nodo actual. Esto puede ser costoso en el peor caso, pero es razonable para alfabeto de 26 caracteres.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.3.2 — Buscar palabras en cuadrícula de letras

**Enunciado:** Dada una cuadrícula de letras y un diccionario de palabras, encuentra todas las palabras del diccionario que pueden formarse en la cuadrícula moviéndote horizontalmente o verticalmente sin reusar celdas. (LeetCode 212)

**Restricciones:** `1 <= m, n <= 12`. Diccionario de hasta `3*10^4` palabras.

**Pista:** Inserta todas las palabras del diccionario en un Trie. Luego, DFS desde cada celda de la cuadrícula, navegando el Trie simultáneamente. Si el nodo Trie actual no tiene el carácter siguiente, poda esa rama del DFS.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.3.3 — Palabras que pueden formarse con sustituciones

**Enunciado:** Dado un diccionario y una lista de consultas donde cada consulta tiene exactamente un carácter desconocido (`?`), determina para cada consulta cuántas palabras del diccionario coinciden.

**Restricciones:** Diccionario de hasta `10^3` palabras. Hasta `10^3` consultas.

**Pista:** Para cada consulta `s` con un `?`, busca en el Trie con la función de comodín. El `?` equivale al `.` del ejercicio anterior.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.3.4 — Reemplazos de palabras

**Enunciado:** Dado un diccionario de raíces y una oración, reemplaza cada palabra de la oración por su raíz más corta del diccionario. Si una palabra tiene múltiples raíces, usa la más corta. (LeetCode 648)

**Restricciones:** Diccionario de hasta `1000` raíces. Oración de hasta `10^6` caracteres.

**Pista:** Inserta todas las raíces en el Trie. Para cada palabra de la oración, navega el Trie: si llegas a un nodo `es_fin = True`, esa es la raíz más corta. Si terminas la palabra sin encontrar raíz, mantén la palabra original.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.3.5 — Concatenar palabras

**Enunciado:** Dado un arreglo de strings, encuentra todas las palabras que son una concatenación de al menos dos palabras del mismo arreglo. (LeetCode 472)

**Restricciones:** `1 <= len(strings) <= 10^4`. Strings de hasta `30` caracteres.

**Pista:** Inserta todas las palabras en un Trie. Para cada palabra, verifica si puede formarse como concatenación: en cada posición donde llegas a un `es_fin`, intenta reconstruir el resto desde la raíz del Trie.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 10.4 — Trie en problemas de bits (XOR Trie)

El Trie puede usarse con representaciones binarias de enteros. Cada nivel representa un bit, y se puede maximizar o minimizar el XOR de dos números eficientemente.

```python
class XORTrie:
    """Trie de bits para maximizar XOR."""
    def __init__(self):
        self.raiz = {}

    def insertar(self, num, bits=32):
        nodo = self.raiz
        for i in range(bits - 1, -1, -1):    # de bit más significativo a menos
            bit = (num >> i) & 1
            if bit not in nodo:
                nodo[bit] = {}
            nodo = nodo[bit]

    def max_xor_con(self, num, bits=32):
        """Retorna el valor en el Trie que maximiza XOR con num."""
        nodo = self.raiz
        resultado = 0
        for i in range(bits - 1, -1, -1):
            bit = (num >> i) & 1
            # Para maximizar XOR, preferimos el bit opuesto
            opuesto = 1 - bit
            if opuesto in nodo:
                resultado |= (1 << i)         # bit i del resultado es 1
                nodo = nodo[opuesto]
            else:
                nodo = nodo[bit]              # no hay opuesto, toma el mismo
        return resultado

# Uso: máximo XOR de par en un arreglo en O(n * bits)
def max_xor_par(arr):
    xt = XORTrie()
    for num in arr:
        xt.insertar(num)
    return max(xt.max_xor_con(num) for num in arr)
```

---

### Ejercicio 10.4.1 — Máximo XOR de dos números

**Enunciado:** Dado un arreglo de enteros no negativos, encuentra el máximo XOR entre cualquier par de números. (LeetCode 421)

**Restricciones:** `1 <= len(arr) <= 2*10^5`. Valores entre `0` y `2^31`.

**Pista:** Para cada número `num`, busca en el XOR Trie el número que maximiza `num XOR x`. Inserta los números uno a uno y consulta antes de insertar (o inserta todos y consulta después).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.4.2 — XOR máximo de subarray

**Enunciado:** Dado un arreglo de enteros, encuentra el subarray con el máximo XOR de todos sus elementos. (LeetCode 421 variante)

**Restricciones:** `1 <= len(arr) <= 50000`. Valores en `[0, 10^9]`.

**Pista:** Usa prefix XOR: `xor(i..j) = prefix[j+1] XOR prefix[i]`. Inserta los prefix XOR en el XOR Trie. Para cada `prefix[j+1]`, busca el `prefix[i]` que maximiza el XOR.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.4.3 — Mínimo XOR con un número

**Enunciado:** Dado un conjunto de números y consultas, para cada consulta `q` encuentra el número del conjunto con el menor XOR con `q`.

**Restricciones:** `1 <= len(conjunto) <= 10^5`. `1 <= len(consultas) <= 10^5`.

**Pista:** Inserta todos los números del conjunto en el XOR Trie. Para cada consulta, en lugar de elegir el bit opuesto (que maximiza), elige el mismo bit (que minimiza) cuando esté disponible.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.4.4 — Conteo de pares con XOR en rango

**Enunciado:** Dado un arreglo y un rango `[lo, hi]`, cuenta cuántos pares `(i, j)` con `i < j` tienen `arr[i] XOR arr[j]` en el rango `[lo, hi]`.

**Restricciones:** `1 <= len(arr) <= 5*10^4`. `0 <= lo <= hi <= 10^9`.

**Pista:** `count(XOR <= hi) - count(XOR <= lo - 1)`. Para contar pares con XOR `<= k`, inserta los números en el XOR Trie y, para cada número, cuenta cuántos valores previos dan XOR `<= k` usando el Trie.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.4.5 — Asignación de valores para maximizar XOR total

**Enunciado:** Tienes `n` variables y debes asignar los valores `1` a `n` (cada uno una vez) para maximizar `x1 XOR x2 XOR ... XOR xn`. Implementa con XOR Trie para entender el problema.

**Restricciones:** `1 <= n <= 12`.

**Pista:** El XOR de todos los valores `1..n` es fijo (no depende de la asignación). Pero si las variables tienen roles distintos (e.g., están en expresiones distintas), sí importa. Analiza este caso límite.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 10.5 — Trie en problemas clásicos de entrevistas

---

### Ejercicio 10.5.1 — Validar si una palabra puede formarse con letras de otra

**Enunciado:** Dado un stream de palabras que llegan una por una y una lista de patrones, determina para cada nueva palabra cuántos patrones son substrings de ella. Usa un Trie de patrones para eficiencia.

**Restricciones:** `1 <= len(patrones) <= 500`. `1 <= len(palabra) <= 1000`.

**Pista:** Inserta todos los patrones en el Trie. Para cada nueva palabra, intenta hacer match de cada sufijo de la palabra con el Trie. Un patrón "matchea" si al navegar el Trie con el sufijo llegas a un nodo `es_fin`.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.5.2 — Mapa de prefijos para índice invertido

**Enunciado:** Dado un corpus de `n` documentos, construye un índice que permita buscar todos los documentos que contienen alguna palabra que empieza con un prefijo dado. Usa un Trie donde cada nodo final guarda la lista de IDs de documentos.

**Restricciones:** `1 <= n <= 1000` documentos. Vocabulario de hasta `10^4` palabras.

**Pista:** Al insertar, guarda en el nodo final el ID del documento. Para una búsqueda por prefijo, navega hasta el nodo del prefijo y recolecta todos los IDs de documentos en el subárbol.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.5.3 — Palíndromos con pares de palabras

**Enunciado:** Dado un arreglo de strings, encuentra todos los pares `(i, j)` donde `palabras[i] + palabras[j]` forma un palíndromo. (LeetCode 336)

**Restricciones:** `1 <= len(palabras) <= 5000`. Strings de hasta `300` caracteres.

**Pista:** Inserta todas las palabras en un Trie. Para cada palabra `w`, verifica si existe en el Trie una palabra que sea el reverso de algún sufijo de `w`. Usa el Trie de las palabras reversadas.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.5.4 — Trie para compresión de rutas

**Enunciado:** Dado un sistema de archivos representado como lista de rutas absolutas (`/home/user/docs/file.txt`), construye un Trie donde cada nodo representa un directorio o archivo. Implementa: `listar(directorio)` y `buscar_por_extensión(ext)`.

**Restricciones:** Hasta `10^3` rutas. Profundidad máxima de `10`.

**Pista:** Divide cada ruta por `/`. Cada componente es un nodo del Trie. Los nodos hoja son archivos; los intermedios son directorios. Para `buscar_por_extensión`, DFS sobre todo el Trie.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 10.5.5 — Trie comprimido (Radix Tree / Patricia Tree)

**Enunciado:** Un Trie comprimido fusiona las cadenas de nodos con un solo hijo en un único nodo que guarda el string completo. Implementa un Radix Tree básico con `insertar`, `buscar` y `eliminar`. Muestra cuántos nodos usa vs el Trie normal para el mismo conjunto de palabras.

**Restricciones:** Hasta `10^3` palabras.

**Pista:** Cada nodo guarda una etiqueta (string). Al insertar, si la etiqueta del nodo y el string a insertar comparten un prefijo, divide el nodo en ese punto.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Trie

| Operación | Complejidad | Notas |
|---|---|---|
| Insertar palabra de longitud k | `O(k)` | Un nodo por carácter |
| Buscar palabra exacta | `O(k)` | — |
| Buscar prefijo | `O(k)` | Solo navega, no recolecta |
| Listar palabras con prefijo | `O(k + resultados)` | DFS desde nodo del prefijo |
| Eliminar palabra | `O(k)` | + limpieza de nodos huérfanos |
| Espacio | `O(n · k · Σ)` | n=palabras, k=longitud, Σ=alfabeto |

**Cuándo usar Trie:**

| Necesito... | Usar | Alternativa |
|---|---|---|
| Búsqueda exacta rápida | `HashSet` | Trie es overkill |
| Autocompletado por prefijo | `Trie` | Sort + binary search |
| Todas las palabras con prefijo | `Trie` | Sort + scan lineal |
| Matching con comodines | `Trie con DFS` | Regex |
| Máximo XOR de pares | `XOR Trie` | `O(n²)` bruto |
| Compresión de strings comunes | `Radix Tree` | — |
| Diccionario con actualizaciones | `Trie` | HashMap si no hay prefijos |
