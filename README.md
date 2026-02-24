# Guía de Estudio — Algoritmos y Estructuras de Datos

> Preparación para certificación Java y entrevistas técnicas.
> Cada ejercicio implementado en **Python · Java · Go · C# · Rust**.

---

## Estructura del repositorio

```
algoritmos/
├── README.md                        ← Este archivo
│
├── 01_recursion_tipos.md            ← Secciones 1-8: tipos de recursión
├── 02_optimizacion_recursiva.md     ← Sección 9: optimización de recursión
├── 03_reduccion_complejidad.md      ← Sección 10: reducción de Big O
│
├── 04_grafos.md                     ← BFS, Dijkstra, Bellman-Ford, etc.
├── 05_heap_priority_queue.md        ← Heap binario, cola de prioridad
├── 06_algoritmos_greedy.md          ← Algoritmos voraces
├── 07_colecciones_java.md           ← Colecciones Java con complejidades
├── 08_sorting_completo.md           ← Todos los algoritmos de ordenamiento
├── 09_union_find.md                 ← Disjoint Set Union (DSU)
├── 10_trie.md                       ← Árbol de prefijos
├── 11_analisis_amortizado.md        ← Análisis amortizado
├── 12_kmp_rabin_karp.md             ← Búsqueda de patrones en texto
├── 13_bit_manipulation.md           ← Manipulación de bits
├── 14_teoria_numeros.md             ← MCD, primos, aritmética modular
└── 15_clases_complejidad.md         ← P, NP, NP-completo
```

---

## Progreso

| Archivo | Estado | Ejercicios |
|---|---|---|
| `01_recursion_tipos.md` | ✅ Listo | 40 ejercicios (8 secciones × 5) |
| `02_optimizacion_recursiva.md` | ✅ Listo | 25 ejercicios (5 técnicas × 5) |
| `03_reduccion_complejidad.md` | ✅ Listo | 35 ejercicios (7 técnicas × 5) |
| `04_grafos.md` | ✅ Listo | 35 ejercicios (7 secciones × 5) |
| `05_heap_priority_queue.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `06_algoritmos_greedy.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `07_colecciones_java.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `08_sorting_completo.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `09_union_find.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `10_trie.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `11_analisis_amortizado.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `12_kmp_rabin_karp.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `13_bit_manipulation.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `14_teoria_numeros.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |
| `15_clases_complejidad.md` | ✅ Listo | 25 ejercicios (5 secciones × 5) |

| `16_programacion_funcional.md` | ✅ Listo | 35 ejercicios (7 secciones × 5) |

| `17_efectos_pipelines_arquitectura.md` | ✅ Listo | 35 ejercicios (7 secciones × 5) |

| `18_estructuras_probabilisticas.md` | ✅ Listo | 35 ejercicios (7 secciones × 5) |
| `19_modelo_memoria_cache.md` | ✅ Listo | 35 ejercicios (7 secciones × 5) |

**Total: 500 ejercicios — Repositorio completo ✅**

---

## Temas por prioridad

| Prioridad | Archivo | Razón |
|---|---|---|
| 🔴 Alta | `04_grafos.md` | ✅ Listo |
| 🔴 Alta | `05_heap_priority_queue.md` | ✅ Listo |
| 🔴 Alta | `06_algoritmos_greedy.md` | ✅ Listo |
| 🔴 Alta | `07_colecciones_java.md` | ✅ Listo |
| 🟡 Media | `08_sorting_completo.md` | Completar el panorama de ordenamiento |
| 🟡 Media | `09_union_find.md` | Frecuente en entrevistas |
| 🟡 Media | `10_trie.md` | Frecuente en problemas de strings |
| 🟡 Media | `11_analisis_amortizado.md` | Justifica decisiones de diseño |
| 🟡 Media | `12_kmp_rabin_karp.md` | Cierra el tema de búsqueda en texto |
| 🟢 Baja | `13_bit_manipulation.md` | Optimizaciones puntuales |
| 🟢 Baja | `14_teoria_numeros.md` | Base matemática para criptografía |
| 🟢 Baja | `15_clases_complejidad.md` | Contexto teórico |

---

## Convención de ejercicios

Cada ejercicio tiene el siguiente formato:

```markdown
### Ejercicio N.X — Nombre

**Enunciado:** Descripción clara del problema.

**Restricciones:** Límites de entrada.

**Pista:** Guía sin revelar la solución.

**Implementar en:** Python · Java · Go · C# · Rust
```

---

## Cómo usar este repositorio

1. Lee la descripción y complejidades de la sección antes de empezar
2. Intenta el ejercicio en Python primero (más rápido de prototipear)
3. Una vez que funciona, porta a los otros 4 lenguajes
4. Reflexiona sobre las diferencias: ¿qué cambia entre lenguajes?
5. Compara tu solución con la complejidad esperada en la tabla resumen

---

## Referencia rápida de complejidades

| Notación | Nombre | Ejemplo |
|---|---|---|
| `O(1)` | Constante | Búsqueda en hash map |
| `O(log n)` | Logarítmico | Búsqueda binaria |
| `O(n)` | Lineal | Recorrer un arreglo |
| `O(n log n)` | Lineal-logarítmico | Merge Sort |
| `O(n²)` | Cuadrático | Doble bucle anidado |
| `O(2^n)` | Exponencial | Subconjuntos sin memo |
| `O(n!)` | Factorial | Permutaciones brutas |
