"""Benchmark the lab QuickSort implementations against Python's sorted()."""

from pathlib import Path
import random
import statistics
import sys
import time
from collections.abc import Callable

# Allow this file to be run directly from the ai1 project directory.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.quicksort import quicksort, quicksort_iterative


InputAlgorithm = Callable[[list[int]], list[int]]

SIZES = (100, 1_000, 5_000, 10_000)
REPEATS = 5


def builtin_sorted(values: list[int]) -> list[int]:
    """Return a sorted copy using Python's built-in implementation."""
    return sorted(values)


def is_sorted(values: list[int]) -> bool:
    """Return whether values are in nondecreasing order."""
    return all(values[index] <= values[index + 1] for index in range(len(values) - 1))


def benchmark_algorithm(
    algorithm: InputAlgorithm,
    input_values: list[int],
    repeats: int = REPEATS,
) -> float:
    """Return the median runtime in milliseconds for one algorithm and input."""
    samples = []

    for _ in range(repeats):
        values = input_values.copy()
        start = time.perf_counter()
        result = algorithm(values)
        elapsed = time.perf_counter() - start

        if not is_sorted(result):
            raise AssertionError(f"{algorithm.__name__} returned unsorted data")
        samples.append(elapsed * 1_000)

    return statistics.median(samples)


def build_input_cases() -> list[tuple[str, int, list[int]]]:
    """Create deterministic random, sorted, and reverse-sorted input data."""
    generator = random.Random(42)
    cases = []

    for size in SIZES:
        random_values = [
            generator.randint(-size * 10, size * 10) for _ in range(size)
        ]
        cases.extend(
            [
                ("random", size, random_values),
                ("sorted", size, list(range(size))),
                ("reverse-sorted", size, list(range(size, 0, -1))),
            ]
        )

    return cases


def print_header() -> None:
    print(f"QuickSort benchmark (median of {REPEATS} runs, milliseconds)")
    print("Input data is copied before every timed run.")
    print()
    print(f"{'Algorithm':<22} {'Input type':<16} {'Size':>8} {'Median (ms)':>14}")
    print("-" * 64)


def run_benchmarks() -> None:
    algorithms: list[tuple[str, InputAlgorithm]] = [
        ("Recursive QuickSort", quicksort),
        ("Iterative QuickSort", quicksort_iterative),
        ("Python sorted()", builtin_sorted),
    ]

    print_header()

    for input_type, size, input_values in build_input_cases():
        original_values = input_values.copy()

        for algorithm_name, algorithm in algorithms:
            try:
                median_ms = benchmark_algorithm(algorithm, input_values)
                result_text = f"{median_ms:>11.3f} ms"
            except RecursionError:
                result_text = f"{'RecursionError':>14}"

            print(f"{algorithm_name:<22} {input_type:<16} {size:>8} {result_text}")

        if input_values != original_values:
            raise AssertionError(f"Benchmark input was modified: {input_type}, {size}")


if __name__ == "__main__":
    run_benchmarks()
