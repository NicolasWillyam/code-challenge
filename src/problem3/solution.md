## Issues & Anti-Patterns

### 1. Missing or Incorrect Type Safety

- `getPriority(blockchain: any)` uses `any`.
- `WalletBalance` interface lacks a `blockchain` property.

**Fix:**

```ts
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
```

---

### 2. Misuse of `useMemo`

- `prices` is included in dependency array but unused.
- `useMemo` used for lightweight operations → unnecessary.

**Fix:**

```ts
const sortedBalances = useMemo(() => sortBalances(balances), [balances]);
```

---

### 3. Logical Bug in Filter Callback

```ts
if (lhsPriority > -99) { ... }
```

`lhsPriority` is undefined.

**Fix:**

```ts
if (balancePriority > -99 && balance.amount > 0) return true;
```

---

### 4. Inefficient Filter + Sort Logic

- Incorrect filtering of zero balances.
- Sorting inline reduces readability.

**Fix:**

```ts
const filterBalances = (balances: WalletBalance[]) =>
  balances.filter((b) => b.amount > 0 && getPriority(b.blockchain) > -99);

const sortBalances = (balances: WalletBalance[]) =>
  [...balances].sort(
    (a, b) => getPriority(b.blockchain) - getPriority(a.blockchain)
  );
```

---

### 5. `.toFixed()` Without Arguments

Defaults to 0 decimals unintentionally.

**Fix:**

```ts
formatted: balance.amount.toFixed(2);
```

---

### 6. Unused Computed Variable

`formattedBalances` computed but never used.

## **Fix:** Use it in `rows` or remove entirely.

### 7. Using `index` as React Key

Unstable key breaks reconciliation.

**Fix:**

```tsx
key={balance.currency}
```

---

### 8. Missing Memoization for Rows

Heavy recomputation on each render.

**Fix:**

```ts
const rows = useMemo(() => formattedBalances.map(...), [formattedBalances, prices]);
```

---

### 9. Inline Logic in Render

Decreases readability and maintainability.

**Fix:** Move logic to helper functions or hooks.

---

### 10. Potential Performance Issue for Large Lists

Render lag with many balances.

**Fix:** Use `React.memo(WalletRow)` or list virtualization.

---

## Refactored Version

```tsx
import React, { useMemo } from "react";
import { BoxProps } from "@mui/material";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { usePrices } from "@/hooks/usePrices";
import WalletRow from "./WalletRow";
import classes from "./WalletPage.module.css";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const filterBalances = (balances: WalletBalance[]) =>
  balances.filter((b) => b.amount > 0 && getPriority(b.blockchain) > -99);

const sortBalances = (balances: WalletBalance[]) =>
  [...balances].sort(
    (a, b) => getPriority(b.blockchain) - getPriority(a.blockchain)
  );

const WalletPage: React.FC<Props> = ({ ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    const filtered = filterBalances(balances);
    const sorted = sortBalances(filtered);
    return sorted.map((b) => ({
      ...b,
      formatted: b.amount.toFixed(2),
    }));
  }, [balances]);

  const rows = useMemo(
    () =>
      formattedBalances.map((balance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      }),
    [formattedBalances, prices]
  );

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
```
