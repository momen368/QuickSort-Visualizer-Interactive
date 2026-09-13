"""Recursive, in-place QuickSort implementation."""


def partition(values: list[int], low: int, high: int) -> int:
    """Partition values[low:high + 1] and return the pivot index."""
    pivot = values[high]
    smaller_index = low - 1

    # Move values smaller than or equal to the pivot to its left.
    for current_index in range(low, high):
        if values[current_index] <= pivot:
            smaller_index += 1
            values[smaller_index], values[current_index] = (
                values[current_index],
                values[smaller_index],
            )

    # Place the pivot between the two partitions.
    pivot_index = smaller_index + 1
    values[pivot_index], values[high] = values[high], values[pivot_index]
    return pivot_index


def quicksort(values: list[int], low: int = 0, high: int | None = None) -> list[int]:
    """Sort values in place with recursive QuickSort and return the same list."""
    if high is None:
        high = len(values) - 1

    # A range with zero or one element is already sorted.
    if low < high:
        pivot_index = partition(values, low, high)

        # Recursively sort the ranges on either side of the pivot.
        quicksort(values, low, pivot_index - 1)
        quicksort(values, pivot_index + 1, high)

    return values


def quicksort_iterative(values: list[int]) -> list[int]:
    """Sort values in place with iterative QuickSort and return the same list."""
    if len(values) < 2:
        return values

    # Each stack entry stores the bounds of a subarray that still needs sorting.
    pending_ranges = [(0, len(values) - 1)]

    while pending_ranges:
        low, high = pending_ranges.pop()

        # A range with zero or one element is already sorted.
        if low >= high:
            continue

        pivot_index = partition(values, low, high)

        # Store both ranges so they can be processed without recursive calls.
        pending_ranges.append((low, pivot_index - 1))
        pending_ranges.append((pivot_index + 1, high))

    return values
