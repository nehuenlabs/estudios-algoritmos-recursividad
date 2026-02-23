# Guía de Ejercicios — Algoritmos Greedy (Voraces)

> Implementar cada ejercicio en: **Python · Java · Go · C# · Rust**
>
> Este archivo es continuación de `05_heap_priority_queue.md`.

---

## Concepto fundamental

Un algoritmo **greedy** (voraz) toma en cada paso la decisión localmente óptima, esperando que la suma de decisiones locales lleve a la solución globalmente óptima.

```
Greedy: elige siempre la mejor opción AHORA, sin reconsiderar.
DP:     considera TODAS las opciones y elige la mejor combinación global.

La pregunta clave: ¿el óptimo local siempre conduce al óptimo global?
  → Si SÍ: greedy funciona y es más eficiente que DP
  → Si NO: greedy falla, necesitas DP o backtracking
```

**Cuándo funciona greedy:**

Los algoritmos greedy son correctos cuando el problema tiene:
1. **Subestructura óptima:** la solución óptima contiene soluciones óptimas de subproblemas
2. **Propiedad greedy:** una solución localmente óptima puede extenderse a una globalmente óptima

**Ejemplo clásico donde greedy FALLA:**

```python
# Problema de la mochila con objetos enteros (0/1 Knapsack):
# objetos = [(valor=10, peso=5), (valor=6, peso=4), (valor=6, peso=4)]
# capacidad = 8

# Greedy por ratio valor/peso: toma (10,5) primero, ratio=2.0
# Luego no cabe nada más → total = 10

# DP: toma los dos objetos de (6,4) → total = 12 ✓

# PERO si los objetos son fraccionables (Fractional Knapsack):
# Greedy SÍ funciona: toma (10,5), luego 3/4 de (6,4) = 4.5 → total = 14.5 ✓
```

---

## Tabla de contenidos

- [Sección 6.1 — Selección de actividades e intervalos](#sección-61--selección-de-actividades-e-intervalos)
- [Sección 6.2 — Problemas de monedas y cambio](#sección-62--problemas-de-monedas-y-cambio)
- [Sección 6.3 — Scheduling y planificación](#sección-63--scheduling-y-planificación)
- [Sección 6.4 — Greedy en grafos](#sección-64--greedy-en-grafos)
- [Sección 6.5 — Codificación de Huffman](#sección-65--codificación-de-huffman)

---

## Sección 6.1 — Selección de actividades e intervalos

**Complejidad típica:** `O(n log n)` por el ordenamiento previo

**Patrón:** Ordenar intervalos por tiempo de fin. Siempre seleccionar el intervalo que termina más pronto y no se solapa con el anterior seleccionado.

**¿Por qué ordenar por fin y no por inicio?** Terminar antes deja más espacio para actividades futuras.

```python
def max_actividades(actividades):
    # actividades = [(inicio, fin), ...]
    actividades.sort(key=lambda x: x[1])    # ordenar por fin

    seleccionadas = [actividades[0]]
    ultimo_fin = actividades[0][1]

    for inicio, fin in actividades[1:]:
        if inicio >= ultimo_fin:             # no se solapa
            seleccionadas.append((inicio, fin))
            ultimo_fin = fin

    return seleccionadas

# Ejemplo:
# [(1,4), (3,5), (0,6), (5,7), (3,9), (5,9), (6,10), (8,11), (8,12), (2,14), (12,16)]
# Ordenado por fin: [(1,4), (3,5), (0,6), (5,7), ...]
# Selección: (1,4) → (5,7) → (8,11) → (12,16) = 4 actividades
```

---

### Ejercicio 6.1.1 — Máximo de actividades no solapadas

**Enunciado:** Dado un conjunto de actividades con tiempo de inicio y fin, selecciona el máximo número de actividades que no se solapen entre sí.

**Restricciones:** `1 <= n <= 10^5`. `0 <= inicio < fin <= 10^9`.

**Pista:** Ordena por tiempo de fin. Selecciona una actividad si su inicio es mayor o igual al fin de la última seleccionada.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.1.2 — Mínimo de intervalos para cubrir rango

**Enunciado:** Dado un rango objetivo `[a, b]` y una lista de intervalos, encuentra el mínimo número de intervalos para cubrir completamente `[a, b]`. Retorna `-1` si no es posible.

**Restricciones:** `1 <= n <= 10^5`. Los intervalos pueden solaparse.

**Pista:** Ordena por inicio. En cada paso, entre todos los intervalos que comienzan antes o en la posición actual, elige el que llega más lejos. Eso te da la próxima posición alcanzable.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.1.3 — Intervalos solapados: fusionar

**Enunciado:** Dado un arreglo de intervalos, fusiona todos los que se solapan y retorna el arreglo resultante sin solapamientos. (LeetCode 56)

**Restricciones:** `1 <= n <= 10^4`. `0 <= inicio <= fin <= 10^4`.

**Pista:** Ordena por inicio. Si el inicio del siguiente <= fin del actual, fusiónate extendiendo el fin al máximo de ambos.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.1.4 — Mínimas salas de reuniones necesarias

**Enunciado:** Dado un arreglo de reuniones `(inicio, fin)`, ¿cuántas salas se necesitan como mínimo para que todas puedan realizarse? (LeetCode 253)

**Restricciones:** `1 <= n <= 10^4`.

**Pista:** Ordena por inicio. Usa un min-heap que almacena los fines de las reuniones en curso. Si la reunión actual comienza después de que termina la más próxima a terminar, reutiliza esa sala (pop + push). Si no, abre sala nueva (push).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.1.5 — Eliminar el mínimo de intervalos para no solaparse

**Enunciado:** Dado un arreglo de intervalos, retorna el mínimo número de intervalos a eliminar para que ninguno se solape. (LeetCode 435)

**Restricciones:** `1 <= n <= 2*10^4`.

**Pista:** El mínimo a eliminar = `n - máximo de no solapados`. Usa el algoritmo de selección de actividades del ejercicio 6.1.1.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 6.2 — Problemas de monedas y cambio

**Complejidad típica:** `O(n log n)` o `O(n)`

**Advertencia:** El greedy para el problema de monedas **solo funciona con sistemas de monedas canónicos** (como el sistema de monedas estándar: 1, 5, 10, 25, 50, 100). Con denominaciones arbitrarias, necesitas DP.

```python
# Greedy FUNCIONA para monedas estándar [1, 5, 10, 25]:
def cambio_greedy(monto, monedas=[25, 10, 5, 1]):
    monedas.sort(reverse=True)
    resultado = []
    for moneda in monedas:
        while monto >= moneda:
            resultado.append(moneda)
            monto -= moneda
    return resultado

# cambio_greedy(41) → [25, 10, 5, 1] = 4 monedas ✓

# Greedy FALLA para monedas [1, 3, 4] y monto=6:
# Greedy: [4, 1, 1] = 3 monedas
# Óptimo: [3, 3]   = 2 monedas ← greedy no lo encuentra
```

---

### Ejercicio 6.2.1 — Cambio con monedas estándar

**Enunciado:** Dado un monto y denominaciones de monedas estándar `[1, 5, 10, 25, 50, 100]`, retorna las monedas usadas con el mínimo número de piezas usando greedy.

**Restricciones:** `1 <= monto <= 10^4`.

**Pista:** Ordena las denominaciones de mayor a menor. En cada paso, usa la moneda más grande posible.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.2.2 — Demostrar cuándo greedy falla para monedas

**Enunciado:** Implementa el greedy para monedas y el DP para monedas. Para las denominaciones `[1, 3, 4]`, encuentra el menor monto donde greedy da más monedas que el óptimo DP.

**Restricciones:** Prueba montos de `1` a `20`.

**Pista:** Compara sistemáticamente los resultados de ambos enfoques. El primer monto donde difieren demuestra la falla del greedy.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.2.3 — Mochila fraccionable (Fractional Knapsack)

**Enunciado:** Dado un conjunto de objetos con peso y valor, y una mochila de capacidad `W`, maximiza el valor total. Puedes tomar fracciones de objetos. Aquí greedy sí funciona.

**Restricciones:** `1 <= n <= 10^3`, `1 <= W <= 10^5`.

**Pista:** Ordena por ratio `valor/peso` descendente. Toma objetos completos mientras quepan. Si uno no cabe entero, toma la fracción que llena la capacidad restante.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.2.4 — Asignación de tareas para minimizar tiempo de espera

**Enunciado:** Hay `n` clientes en una fila y `k` servidores. Cada cliente tiene un tiempo de servicio. Asigna los clientes para minimizar el tiempo de espera total.

**Restricciones:** `1 <= n <= 10^4`, `1 <= k <= n`.

**Pista:** Ordena por tiempo de servicio ascendente. Sirve primero a los más rápidos. Esto minimiza el tiempo de espera promedio (resultado de la desigualdad de reordenamiento).

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.2.5 — Reconstruir el menor número posible

**Enunciado:** Dado un string de dígitos desordenados y un entero `k`, elimina exactamente `k` dígitos para que el número resultante sea el menor posible. (LeetCode 402)

**Restricciones:** `1 <= len(s) <= 10^5`, `0 <= k <= len(s)`.

**Pista:** Usa una pila monótona creciente. Para cada dígito, si el tope de la pila es mayor y aún puedes eliminar (`k > 0`), saca el tope y descuéntale a `k`. Al final elimina los últimos `k` si sobran.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 6.3 — Scheduling y planificación

**Complejidad típica:** `O(n log n)`

**Patrón general:** El secreto de la mayoría de los problemas de scheduling es encontrar el **criterio de ordenamiento correcto**. Una vez que tienes el orden, la asignación es greedy directa.

```python
# Ejemplo: minimizar penalización total por retrasos
# Cada trabajo tiene duración y deadline. Penalización = 1 si termina tarde.
# ¿Cómo ordenar para minimizar trabajos atrasados?

# Greedy: ordenar por deadline (más urgente primero)
def min_trabajos_atrasados(trabajos):
    # trabajos = [(duracion, deadline), ...]
    trabajos.sort(key=lambda x: x[1])   # ordenar por deadline
    tiempo = 0
    atrasados = 0
    for duracion, deadline in trabajos:
        tiempo += duracion
        if tiempo > deadline:
            atrasados += 1
    return atrasados

# Variante: ¿qué trabajos incluir para maximizar los no atrasados?
# Usa un max-heap para descartar el más largo cuando hay retraso.
```

---

### Ejercicio 6.3.1 — Minimizar latencia máxima

**Enunciado:** Hay `n` trabajos, cada uno con duración `d_i` y deadline `D_i`. Ejecutarlos en algún orden. La latencia de un trabajo es `max(0, fin - deadline)`. Minimiza la latencia máxima.

**Restricciones:** `1 <= n <= 10^5`.

**Pista:** Ordenar por deadline es la solución greedy óptima. El intercambio de cualquier par fuera de orden solo puede aumentar la latencia máxima.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.3.2 — Maximizar trabajos completados a tiempo

**Enunciado:** Dado `n` trabajos con duración y deadline, selecciona el máximo número de trabajos que puedas completar antes de su deadline.

**Restricciones:** `1 <= n <= 500`.

**Pista:** Ordena por deadline. Usa un max-heap para llevar los trabajos seleccionados. Si al agregar el trabajo actual el tiempo total supera su deadline, reemplaza el trabajo más largo del heap si ese trabajo es más corto que él.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.3.3 — Asignación óptima de procesadores

**Enunciado:** Dados `n` trabajos y `k` procesadores idénticos, asigna los trabajos para minimizar el tiempo total de finalización (makespan). Cada procesador ejecuta sus trabajos en secuencia.

**Restricciones:** `1 <= n <= 10^3`, `1 <= k <= n`.

**Pista:** Ordena los trabajos de mayor a menor. Asigna cada trabajo al procesador con menor carga actual. Usa un min-heap sobre las cargas actuales de los procesadores.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.3.4 — Jump Game (¿puedes llegar al final?)

**Enunciado:** Dado un arreglo donde `arr[i]` indica el máximo salto desde la posición `i`, determina si puedes llegar desde la posición `0` hasta la última posición. (LeetCode 55)

**Restricciones:** `1 <= len(arr) <= 3*10^4`. `0 <= arr[i] <= 10^5`.

**Pista:** Mantén el alcance máximo hasta ahora. Para cada posición `i <= alcance_max`, actualiza `alcance_max = max(alcance_max, i + arr[i])`. Si `i` supera `alcance_max`, no puedes avanzar.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.3.5 — Jump Game II (mínimo de saltos)

**Enunciado:** Mismo arreglo que el ejercicio anterior. Ahora retorna el mínimo número de saltos para llegar al final. Se garantiza que es posible. (LeetCode 45)

**Restricciones:** `1 <= len(arr) <= 10^4`.

**Pista:** Mantén el alcance del salto actual y el alcance máximo. Cuando llegas al final del alcance actual, haces un salto y el nuevo alcance es el máximo visto hasta ahora.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 6.4 — Greedy en Grafos

**Complejidad típica:** `O(E log E)` o `O((V+E) log V)`

Los algoritmos de grafos de las secciones anteriores (Dijkstra, Prim, Kruskal) son en realidad algoritmos greedy. Aquí practicamos la conexión explícita.

```
Dijkstra:  greedy que siempre expande el nodo más cercano conocido
Prim:      greedy que siempre agrega la arista más barata al MST
Kruskal:   greedy que siempre considera la arista más barata del grafo
```

**Un nuevo algoritmo greedy en grafos: coloreo de grafos**

```python
def coloreo_greedy(V, grafo):
    """Coloreo greedy: no garantiza mínimo de colores (NP-difícil),
    pero da una solución razonable."""
    colores = [-1] * V
    colores[0] = 0

    for nodo in range(1, V):
        colores_vecinos = {colores[v] for v in grafo[nodo] if colores[v] != -1}
        color = 0
        while color in colores_vecinos:
            color += 1
        colores[nodo] = color

    return colores
```

---

### Ejercicio 6.4.1 — Verificar greedy en Dijkstra

**Enunciado:** Implementa Dijkstra y muestra en cada paso el nodo greedy elegido (el de menor distancia). Para un grafo de 6 nodos, muestra por qué esta elección local es siempre segura cuando los pesos son no negativos.

**Restricciones:** `V=6`, pesos no negativos.

**Pista:** La invariante de Dijkstra es: cuando un nodo es extraído del heap, su distancia es definitiva. ¿Por qué esto no funciona con pesos negativos?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.4.2 — Coloreo greedy de grafos

**Enunciado:** Dado un grafo no dirigido, coloréalo usando el algoritmo greedy (asigna a cada nodo el menor color no usado por sus vecinos). Retorna el número de colores usados.

**Restricciones:** `1 <= V <= 10^3`, `0 <= E <= 10^4`.

**Pista:** El orden en que procesas los nodos afecta el resultado. Experimenta con distintos órdenes. ¿Qué orden tiende a dar menos colores?

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.4.3 — Red de comunicación con costo mínimo

**Enunciado:** Tienes `n` ciudades y una lista de posibles conexiones con costo. Quieres conectar todas las ciudades con costo mínimo. Implementa con Kruskal y muestra la elección greedy en cada paso.

**Restricciones:** `2 <= n <= 10^4`, `1 <= E <= 10^5`.

**Pista:** Kruskal es greedy: siempre agrega la arista más barata que no forma ciclo. La prueba de optimalidad se basa en el ciclo: si hubiera una arista más cara en el MST, podrías reemplazarla y reducir el costo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.4.4 — Problema del viajante greedy (aproximación)

**Enunciado:** Dado un grafo completo de ciudades con distancias, construye un recorrido que visite todas las ciudades y regrese al origen usando el greedy "vecino más cercano". No es óptimo, pero es una aproximación.

**Restricciones:** `3 <= n <= 100`.

**Pista:** Empieza en la ciudad 0. En cada paso, ve a la ciudad no visitada más cercana. Al final, regresa al origen. Compara el costo con el recorrido óptimo para `n` pequeño.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.4.5 — Rutas en DAG con mayor ganancia

**Enunciado:** Dado un DAG donde las aristas tienen ganancias (pueden ser negativas), encuentra el camino de `origen` a `destino` que maximiza la ganancia total usando greedy topológico.

**Restricciones:** `1 <= V <= 500`, el grafo es un DAG.

**Pista:** Ordena topológicamente. Procesa los nodos en ese orden, propagando la ganancia máxima. Similar a DP pero el orden topológico garantiza que cada nodo se procesa después de todos sus predecesores.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Sección 6.5 — Codificación de Huffman

**Complejidad:** `O(n log n)` tiempo · `O(n)` espacio

**Qué es:** Algoritmo de compresión sin pérdida que asigna códigos binarios de longitud variable. Los símbolos más frecuentes reciben códigos más cortos.

**Por qué es greedy:** Siempre combina los dos símbolos de menor frecuencia. Esta decisión local produce el árbol óptimo globalmente (teorema de Huffman).

```python
import heapq

def huffman(frecuencias):
    # frecuencias = {'a': 5, 'b': 9, 'c': 12, 'd': 13, 'e': 16, 'f': 45}
    heap = [(freq, char) for char, freq in frecuencias.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        # Greedy: combina los dos de menor frecuencia
        freq1, left = heapq.heappop(heap)
        freq2, right = heapq.heappop(heap)
        # Crea nodo interno con frecuencia combinada
        heapq.heappush(heap, (freq1 + freq2, (left, right)))

    # El último elemento es la raíz del árbol de Huffman
    arbol = heap[0][1]
    return arbol

def generar_codigos(arbol, prefijo="", codigos={}):
    if isinstance(arbol, str):      # hoja
        codigos[arbol] = prefijo
    else:
        left, right = arbol
        generar_codigos(left, prefijo + "0", codigos)
        generar_codigos(right, prefijo + "1", codigos)
    return codigos

# Resultado para {'a':5,'b':9,'c':12,'d':13,'e':16,'f':45}:
# f → 0       (1 bit,  frecuencia 45)
# c → 100     (3 bits, frecuencia 12)
# d → 101     (3 bits, frecuencia 13)
# a → 1100    (4 bits, frecuencia 5)
# b → 1101    (4 bits, frecuencia 9)
# e → 111     (3 bits, frecuencia 16)
```

---

### Ejercicio 6.5.1 — Árbol de Huffman básico

**Enunciado:** Dado un diccionario de caracteres y sus frecuencias, construye el árbol de Huffman y genera los códigos para cada carácter.

**Restricciones:** `2 <= n <= 26` caracteres distintos.

**Pista:** Usa un min-heap. En cada paso, extrae los dos nodos de menor frecuencia y crea un nodo padre con la suma. El árbol se completa cuando queda un solo nodo en el heap.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.5.2 — Comprimir y descomprimir texto

**Enunciado:** Dado un texto, construye el árbol de Huffman a partir de las frecuencias reales, codifica el texto en binario y luego decodifícalo de vuelta al texto original.

**Restricciones:** `1 <= len(texto) <= 10^4`. Solo letras minúsculas y espacios.

**Pista:** Para decodificar: recorre el árbol siguiendo los bits (0 = izquierda, 1 = derecha). Cuando llegas a una hoja, emite el carácter y vuelve a la raíz.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.5.3 — Calcular longitud mínima de codificación

**Enunciado:** Dadas las frecuencias de `n` símbolos, calcula la longitud total mínima de la codificación (suma de `frecuencia * longitud_codigo` para cada símbolo). No necesitas construir el árbol explícitamente.

**Restricciones:** `2 <= n <= 10^4`.

**Pista:** Cada vez que combinas dos nodos en el heap, el costo de esa combinación (la suma de sus frecuencias) se agrega al costo total. El costo total es la suma de todas las combinaciones.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.5.4 — Verificar optimalidad de Huffman

**Enunciado:** Dadas las frecuencias `[1, 1, 2, 3, 5, 8, 13]` (Fibonacci), construye el árbol de Huffman y verifica que su longitud total es menor o igual que cualquier otro árbol de codificación binaria prefijo para esas frecuencias.

**Restricciones:** Frecuencias dadas.

**Pista:** Genera el árbol de Huffman. Luego compara con un árbol balanceado (todos los códigos de la misma longitud) y con uno sesgado (árbol en cadena). Huffman debe dar el menor costo.

**Implementar en:** Python · Java · Go · C# · Rust

---

### Ejercicio 6.5.5 — Huffman adaptativo

**Enunciado:** En la codificación Huffman estándar, necesitas conocer las frecuencias de antemano (dos pasadas). Implementa una versión simplificada que actualiza el árbol a medida que procesa caracteres (una sola pasada).

**Restricciones:** `1 <= len(texto) <= 10^3`.

**Pista:** Mantén un dict de frecuencias y reconstruye el árbol de Huffman después de cada nuevo carácter. Aunque ineficiente, demuestra el principio del Huffman adaptativo.

**Implementar en:** Python · Java · Go · C# · Rust

---

## Tabla resumen — Algoritmos Greedy

| Problema | Criterio de ordenamiento | Complejidad | ¿Siempre óptimo? |
|---|---|---|---|
| Máx. actividades no solapadas | Por tiempo de fin ↑ | `O(n log n)` | ✅ Sí |
| Mín. intervalos para cubrir rango | Por inicio ↑ | `O(n log n)` | ✅ Sí |
| Mín. salas de reuniones | Por inicio ↑ + heap de fines | `O(n log n)` | ✅ Sí |
| Cambio de monedas (canónico) | Mayor denominación primero | `O(n log n)` | ✅ Solo sistemas canónicos |
| Mochila fraccionable | Por ratio valor/peso ↓ | `O(n log n)` | ✅ Sí (fraccionable) |
| Mochila 0/1 | — | — | ❌ Necesita DP |
| Minimizar latencia máxima | Por deadline ↑ | `O(n log n)` | ✅ Sí |
| Jump Game (¿posible?) | Alcance máximo | `O(n)` | ✅ Sí |
| Jump Game II (mín. saltos) | Alcance máximo | `O(n)` | ✅ Sí |
| Dijkstra | Menor distancia conocida | `O((V+E)log V)` | ✅ Pesos >= 0 |
| Prim / Kruskal | Menor arista disponible | `O(E log E)` | ✅ Sí |
| Huffman | Menor frecuencia primero | `O(n log n)` | ✅ Sí |
| Coloreo de grafos | — | `O(V+E)` | ❌ No garantiza mínimo |
| TSP greedy (vecino cercano) | Vecino más cercano | `O(n²)` | ❌ Aproximación |

> **Regla de oro:** Si puedes demostrar que "nunca conviene reordenar" (exchange argument), greedy es correcto. Si hay casos donde el óptimo local no conduce al global, necesitas DP.
