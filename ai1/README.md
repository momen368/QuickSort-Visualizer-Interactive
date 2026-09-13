# Implement QuickSort with GitHub Copilot Assistance

## 1. Project Overview

This university lab investigates the implementation and evaluation of QuickSort in Python. The project contains both recursive and iterative in-place implementations, a pytest test suite, a benchmarking script, and a small browser-based demonstration implemented with plain HTML, CSS, and JavaScript.

GitHub Copilot was used as an assistance tool during development. Its suggestions were treated as proposals: the generated code was reviewed, modified where necessary, tested, and debugged by the developer.

## 2. Objectives

- Implement recursive QuickSort using divide and conquer.
- Implement an iterative QuickSort using an explicit stack.
- Use an in-place partitioning strategy.
- Handle empty inputs, duplicates, negative values, and different input orderings.
- Validate the implementations with automated pytest tests.
- Compare the implementations with Python's built-in sorting function.
- Present the algorithm through a simple web interface.
- Reflect on algorithmic complexity, pivot selection, testing, and benchmarking.

## 3. Technologies Used

- **Python:** QuickSort implementations and benchmark code.
- **pytest:** Automated unit testing.
- **HTML:** Web interface structure.
- **CSS:** Responsive presentation and layout.
- **JavaScript:** Browser-side QuickSort demonstration and input validation.
- **GitHub Copilot:** Code suggestions, explanation support, and development assistance under human review.

## 4. Project Structure

```text
ai1/
├── benchmarks/
│   └── benchmark_quicksort.py
├── src/
│   └── quicksort.py
├── tests/
│   └── test_quicksort.py
├── web/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

- `src/quicksort.py` contains the shared `partition` function, recursive `quicksort`, and iterative `quicksort_iterative` functions.
- `tests/test_quicksort.py` contains pytest tests for both implementations.
- `benchmarks/benchmark_quicksort.py` measures the two lab implementations and Python's `sorted()` function.
- `web/` contains the standalone browser interface.
- `README.md` documents the design, evaluation, and usage of the project.

## 5. QuickSort Explanation

QuickSort is a divide-and-conquer sorting algorithm. It selects a pivot, partitions the current range around that pivot, and then sorts the smaller ranges on either side of the pivot.

The partition operation places values less than or equal to the pivot on its left and larger values on its right. Once the pivot is placed between those groups, it is in its final sorted position. The process is then repeated for the left and right ranges.

## 6. Recursive Implementation

The recursive function is named `quicksort` in this project. It uses the last element of the current range as the pivot through the separate `partition` function. After partitioning, it calls itself for the ranges before and after the pivot:

```python
quicksort(values, low, pivot_index - 1)
quicksort(values, pivot_index + 1, high)
```

The function modifies the original list in place and returns that same list. A range with zero or one element is already sorted, so the function stops when `low` is no longer less than `high`.

## 7. Iterative Implementation

`quicksort_iterative` uses the same partitioning logic but does not call itself recursively. It stores unfinished ranges as `(low, high)` pairs in an explicit list called `pending_ranges`.

For each stored range, the function:

1. Removes a range from the stack.
2. Partitions the range.
3. Adds the ranges on either side of the pivot to the stack.
4. Continues until no ranges remain.

The explicit stack replaces the work that Python would normally keep in the recursive call stack. This avoids Python recursion-depth limits, although poor pivot choices can still cause $O(n^2)$ running time.

## 8. Optimization and Pivot Selection

The current implementations choose the last element in each range as the pivot. This is simple and makes the partition function easy to understand, but it is sensitive to input order.

For already sorted or reverse-sorted input, the last element can repeatedly be the smallest or largest value. This creates highly unbalanced partitions and can result in $O(n^2)$ time. The recursive implementation may also reach Python's recursion limit for sufficiently large pathological inputs.

Possible improvements include:

- Choosing the middle element as the pivot.
- Choosing a random pivot.
- Using a median-of-three choice from the first, middle, and last elements.
- Recursing first on the smaller partition and processing the larger partition iteratively to reduce stack usage.

For this lab, the simple last-element strategy is retained so that the partition and the effects of pivot selection remain clear. Any optimization should be measured rather than assumed to be faster for every input.

## 9. Algorithm Complexity

For QuickSort, $n$ is the number of values being processed.

| Case | Time complexity | Explanation |
|---|---:|---|
| Best case | $O(n \log n)$ | The pivot divides the range into reasonably balanced parts. |
| Average case | $O(n \log n)$ | Expected when pivot choices produce generally balanced partitions. |
| Worst case | $O(n^2)$ | Repeatedly unbalanced partitions cause almost the whole remaining range to be processed at each level. |

The partition operation uses $O(1)$ auxiliary space. Recursive QuickSort uses $O(\log n)$ call-stack space on average and up to $O(n)$ in the worst case. Iterative QuickSort uses an explicit stack with the same typical $O(\log n)$ and worst-case $O(n)$ bounds for this straightforward implementation.

## 10. Comparison with MergeSort, HeapSort, and Python's Built-in Sort

| Algorithm | Best case | Average case | Worst case | Auxiliary space | Stable? | In-place? | Practical considerations |
|---|---:|---:|---:|---:|---|---|---|
| QuickSort | $O(n \log n)$ | $O(n \log n)$ with suitable pivots | $O(n^2)$ | $O(\log n)$ average stack space; $O(n)$ worst case | Usually no | Yes, apart from stack space | Often has good cache behavior, but performance depends on pivot selection. |
| MergeSort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ for a typical array implementation | Yes | Usually no | Predictable running time and stable ordering, at the cost of additional memory. |
| HeapSort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | No | Yes | Provides a worst-case guarantee and low extra memory use, but may have less favorable cache behavior. |
| Python `sorted()` | $O(n)$ on favorable partially ordered data | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ worst case | Yes | No; returns a new list | Uses optimized, stable Timsort and can exploit existing ordered runs. |

No algorithm is always the fastest. Results depend on input order, data size, stability requirements, memory constraints, implementation language, and library optimizations. The benchmark in this project provides measurements for the selected environment rather than a universal ranking.

## 11. Unit Testing

The pytest suite runs the same behavioral tests against both `quicksort` and `quicksort_iterative`. It covers:

- Empty, single-element, and two-element lists.
- Already sorted and reverse-sorted lists.
- Random unsorted values.
- Duplicate values and all-equal values.
- Negative values and mixed positive and negative values.
- A large deterministic dataset.
- Correct nondecreasing order.
- In-place behavior by checking that the returned object is the original list.
- Preservation of the original elements using `Counter`.

The tests use explicit expected outputs for small examples. The large-data test verifies ordering and element preservation independently instead of using `sorted()` as its only expected result.

## 12. Web Interface

The `web/` folder contains a framework-free QuickSort demonstration. Users can enter comma-separated numbers, select **Sort numbers**, and view both the original input and the sorted result. The interface validates empty input, missing values between commas, and non-numeric values. The JavaScript implementation performs QuickSort directly and does not use `Array.sort()` for the sorting operation.

## 13. Debugging Process

The implementation was reviewed by tracing the partition boundaries and recursive or iterative range updates. Important checks included:

- Confirming that the pivot is excluded from subsequent ranges because it is already positioned correctly.
- Confirming that zero- and one-element ranges stop processing.
- Checking that duplicate values are retained and placed in nondecreasing order.
- Comparing recursive and iterative behavior on the same categories of input.
- Separating correctness problems from performance limitations caused by poor pivot choices.

No correctness defect was found in the final Python implementation. The main known limitation is the possible $O(n^2)$ behavior and recursion-depth failure on unfavorable inputs.

## 14. Benchmarking Methodology

`benchmarks/benchmark_quicksort.py` uses `time.perf_counter()` and reports the median of five runs. It compares:

- Recursive QuickSort.
- Iterative QuickSort.
- Python's built-in `sorted()`.

Each algorithm is tested with a copy of the same source data, so one algorithm's in-place modification cannot affect another measurement. The benchmark uses deterministic random data plus sorted and reverse-sorted arrays at sizes of 100, 1,000, 5,000, and 10,000 elements. Input copying and result validation occur outside the timed region.

If recursive QuickSort exceeds Python's recursion limit, the output reports `RecursionError` rather than presenting a misleading timing value. This is a limitation result, not a benchmark time.

## 15. Actual Performance Results

Run the benchmark before completing this section and paste its output below. Do not estimate or copy timing values from another computer, because results depend on hardware, Python version, system load, and operating system.

**Environment:**

- Python version: `[insert version]`
- Operating system: `[insert operating system]`
- Processor: `[insert processor]`
- Date tested: `[insert date]`

**Measured results:**

```text
[Paste the output of: python benchmarks/benchmark_quicksort.py]
```

**Observations:**

- Random input: `[insert observation]`
- Already sorted input: `[insert observation]`
- Reverse-sorted input: `[insert observation]`
- Recursive versus iterative behavior: `[insert observation]`
- Comparison with `sorted()`: `[insert observation]`

## 16. Key Learnings

- QuickSort performance depends strongly on pivot selection.
- In-place partitioning reduces auxiliary data structures but does not remove stack usage.
- An explicit stack can replace recursion and avoid recursion-depth limits.
- Correctness tests should cover duplicates, negative values, boundary cases, and input preservation.
- Benchmarks must use equivalent copied inputs and clearly separate measured results from interpretation.
- Python's optimized built-in sort is a useful practical comparison, but algorithm choice depends on the requirements of the task.
- Copilot suggestions still require human review, testing, and debugging.

## 17. How to Run the Project

From the `ai1` directory, install pytest:

```powershell
python -m pip install pytest
```

Run the tests:

```powershell
python -m pytest tests/test_quicksort.py -q
```

Run the benchmark:

```powershell
python benchmarks/benchmark_quicksort.py
```

Open `web/index.html` directly in a browser to use the web interface. It does not require a server, framework, or external library.

## 18. How GitHub Copilot Assisted in the Development

GitHub Copilot assisted by suggesting implementation patterns, test cases, explanations, documentation wording, and frontend structure. The developer remained responsible for deciding which suggestions were appropriate for the assignment.

The generated code was not accepted without review. It was inspected against the requirements, modified to match the project's actual function names and in-place behavior, checked with editor diagnostics, and evaluated through unit-test and benchmark design. Cases involving duplicates, negative values, recursion depth, input preservation, and invalid web input were considered explicitly. Benchmark values are intentionally not included until the script is run in the target environment.
