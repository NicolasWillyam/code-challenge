// -----------------------------
// Method 1: Using a mathematical formula (O(1))
// -----------------------------
var sum_to_n_a = function (n) {
  // If n <= 0, there’s nothing to add — return 0
  if (n <= 0) return 0;

  // Formula for the sum of the first n natural numbers:
  return (n * (n + 1)) / 2;
};

// -----------------------------
// Method 2: Using a for loop (O(n))
// -----------------------------
var sum_to_n_b = function (n) {
  // Validate n
  if (n <= 0) return 0;

  // Variable to store the accumulated sum
  let sum = 0;

  // Loop from 1 to n, adding each number to the sum
  for (let i = 1; i <= n; i++) {
    sum += i; // same as sum = sum + i
  }

  // Return the final total
  return sum;
};

// -----------------------------
// Method 3: Using recursion (elegant but risky for large n, n should < 100000)
// Warning: sum_to_n_c(100000) might cause a stack overflow (too many recursive calls)
// -----------------------------
var sum_to_n_c = function (n) {
  // Base case: if n <= 0, return 0
  if (n <= 0) return 0;

  // Another base case: if n === 1, just return 1
  if (n === 1) return 1;

  // Recursive case:
  return n + sum_to_n_c(n - 1);
};

// =======================================
// Testing the three functions
// =======================================
console.log("==== RESULTS ====");

console.log("sum_to_n_a(5) =", sum_to_n_a(5));
console.log("sum_to_n_b(5) =", sum_to_n_b(5));
console.log("sum_to_n_c(5) =", sum_to_n_c(5));

console.log("sum_to_n_a(0) =", sum_to_n_a(0));
console.log("sum_to_n_b(0) =", sum_to_n_b(0));
console.log("sum_to_n_c(0) =", sum_to_n_c(0));

console.log("sum_to_n_a(100) =", sum_to_n_a(100));
console.log("sum_to_n_b(100) =", sum_to_n_b(100));
