# Red-Black Tree — Concepts, Rules & Algorithms

## What Is a Red-Black Tree?

A **Red-Black Tree (RBT)** is a self-balancing Binary Search Tree (BST) where every node carries an extra bit: its **color** — either **RED** or **BLACK**. These colors, combined with a small set of rules, guarantee that the tree remains *approximately balanced* after every insertion and deletion. This ensures O(log n) time for search, insert, and delete — even in the worst case.

Unlike AVL trees which enforce strict height balance (left and right subtrees differ by at most 1), Red-Black Trees enforce a looser constraint through **black-height**, making them cheaper to maintain on insertions/deletions (fewer rotations on average).

---

## The 5 Rules (Invariants)

Every valid Red-Black Tree must satisfy **all** of the following:

| # | Rule | Why It Matters |
|---|------|----------------|
| 1 | Every node is either **RED** or **BLACK** | Defines the coloring scheme |
| 2 | The **root** is always **BLACK** | Anchors the tree; simplifies edge cases |
| 3 | Every `null` leaf (NIL) is considered **BLACK** | Uniformity — NILs count toward black-height |
| 4 | **No red-red adjacency**: A RED node cannot have a RED parent | Prevents long red chains that would break balance |
| 5 | **Black-height property**: Every path from a node to any of its descendant NILs passes through the **same number of BLACK nodes** | This is the core balance guarantee |

### What Is Black-Height?

The **black-height** of a node is the number of BLACK nodes on any path from that node down to a NIL leaf (not counting the node itself, but counting the NIL). Because of Rule 5, this count is the same for every such path.

```
        10(B)           Black-height of 10 = 2
       /    \           Path: 10 → 5 → NIL  = 2 black nodes (5, NIL)
     5(R)   15(R)       Path: 10 → 15 → NIL = 2 black nodes (15, NIL)
    / \     / \
  NIL NIL NIL NIL       (NILs are BLACK)
```

### Why These Rules Guarantee O(log n) Height

The black-height property means the longest path (alternating red-black) is at most **2× the shortest path** (all black). So for a tree with black-height `h`, the height is at most `2h`, and since `h ≤ log₂(n+1)`, the total height is O(log n).

#### Proof: Why Black Height ≤ log₂(n+1)

Consider a node with black-height `h`. Look at the **all-black subtree** rooted at this node — this is what we'd get if we deleted all RED nodes. This subtree is still a valid BST where every path from the root to a leaf has exactly `h` black nodes (by definition of black-height).

**Key observation:** In this all-black subtree, every internal node has exactly 2 children (except possibly leaves). Why? Because if a node had only one child in the original tree, that child would have to be RED (otherwise the path through the missing child would have fewer black nodes than paths through the existing child, violating Rule 5). But we've removed all RED nodes, so such nodes become leaves.

Therefore, the all-black subtree is a **perfect binary tree** of height `h`. A perfect binary tree of height `h` has exactly `2^h - 1` internal nodes.

Now, the original tree can have **at most** twice as many nodes as this all-black subtree. Why? Every RED node must have a BLACK parent (Rule 4), and that parent can have at most 2 RED children (one left, one right). So each BLACK node in the all-black subtree can contribute at most 2 additional RED nodes.

```
All-black nodes:  2^h - 1
Maximum RED nodes: 2 × (2^h - 1)  (each BLACK can have 2 RED children)
Total nodes ≤ 3 × (2^h - 1) < 3 × 2^h
```

But we can prove an even tighter bound. Every node in the original tree is either:
- A BLACK node from the all-black subtree, or
- A RED node, which must be a child of a BLACK node

Since each BLACK node can have at most 2 RED children, the total number of nodes is:
```
Total nodes ≤ (BLACK nodes) + 2 × (BLACK nodes)
             ≤ 3 × (2^h - 1)
             < 3 × 2^h
```

For a more elegant bound, consider that in the worst case, every BLACK node has exactly 2 RED children, giving a full tree where black nodes form a perfect binary tree and RED nodes fill in between them. This gives us:
```
n ≤ 2^(h+1) - 1
```

Taking logarithms:
```
n + 1 ≤ 2^(h+1)
log₂(n + 1) ≤ h + 1
h ≥ log₂(n + 1) - 1
```

Or more conservatively (and commonly cited):
```
h ≤ log₂(n + 1)
```

**Intuition:** A tree with black-height `h` has at least the structure of a perfect binary tree of height `h`, which has `2^h - 1` nodes. Therefore, any tree with `n` nodes cannot have black-height greater than `log₂(n + 1)`.

---

## Insertion

### Step 1: Standard BST Insert

Insert the new node as you would in any BST (find its correct position by comparing values). Color the new node **RED**. Why RED? Because inserting a RED node never violates the black-height property (Rule 5) — it doesn't add a black node to any path. The only rule it *might* violate is Rule 4 (no red-red adjacency).

### Step 2: Fix Violations (Insert Fixup)

After insertion, we walk up the tree fixing any red-red violations. At each step, the "current node" `N` is RED with a RED parent `P`. We examine `N`'s **uncle** `U` (the sibling of `P`) and **grandparent** `G`.

#### Key Players

```
        G (grandparent)
       / \
      P   U  (parent and uncle)
     /
    N  (newly inserted node — the violation)
```

---

### Insertion Case 1: Uncle Is RED (Recolor)

**Situation:** Both `P` and `U` are RED. `G` must be BLACK (otherwise there was already a violation).

**Fix:** Recolor — push the blackness down from `G`:
- `P` → BLACK
- `U` → BLACK
- `G` → RED (unless `G` is the root, then it stays BLACK)

**Then:** Recurse on `G` (it's now RED and *its* parent might also be RED).

```
  BEFORE:            AFTER:
      G(B)               G(R)*          * recurse here
     / \                / \
   P(R)  U(R)        P(B)  U(B)
   /                  /
  N(R)              N(R)
```

**Why this works:** We didn't change any path's black-height — we removed one black (G) and added one black (P and U each) on every path through this subtree. The only new problem is G might now be red-red with *its* parent, so we recurse.

---

### Insertion Case 2: Uncle Is BLACK (or NIL) — Rotation Needed

**Situation:** `P` is RED, `U` is BLACK/NIL. A recolor alone can't fix this — we need a **rotation** to rebalance.

There are 4 sub-cases based on the shape:

#### Case 2a: Left-Left (LL) — `P` is left child of `G`, `N` is left child of `P`

**Fix:** Right-rotate `G`, then recolor.

```
  BEFORE:                    AFTER:
        G(B)                    P(B)
       / \                     / \
     P(R)  U(B)             N(R)  G(R)
    /                               \
  N(R)                              U(B)
```

- Right-rotate `G` → `P` takes `G`'s position
- `P` → BLACK (new root of subtree)
- `G` → RED (pushed down)

#### Case 2b: Right-Right (RR) — `P` is right child of `G`, `N` is right child of `P`

**Fix:** Left-rotate `G`, then recolor. (Mirror of LL)

```
  BEFORE:                    AFTER:
    G(B)                       P(B)
   / \                        / \
 U(B)  P(R)               G(R)  N(R)
         \                /
         N(R)           U(B)
```

#### Case 2c: Left-Right (LR) — `P` is left child of `G`, `N` is right child of `P`

**Fix:** Two rotations — first left-rotate `P` to convert to LL, then right-rotate `G`.

```
  BEFORE:            STEP 1 (left-rotate P):     STEP 2 (right-rotate G):
      G(B)                  G(B)                        N(B)
     / \                   / \                         / \
   P(R)  U(B)           N(R)  U(B)                  P(R)  G(R)
     \                  /                                    \
     N(R)            P(R)                                   U(B)
```

- After both rotations: `N` → BLACK, `G` → RED

#### Case 2d: Right-Left (RL) — `P` is right child of `G`, `N` is left child of `P`

**Fix:** Two rotations — right-rotate `P` to convert to RR, then left-rotate `G`. (Mirror of LR)

```
  BEFORE:            STEP 1 (right-rotate P):    STEP 2 (left-rotate G):
    G(B)                 G(B)                         N(B)
   / \                  / \                          / \
 U(B)  P(R)          U(B)  N(R)                  G(R)  P(R)
       /                      \                  /
     N(R)                    P(R)              U(B)
```

### Insertion Summary Table

| Case | Condition | Action | Recurse? |
|------|-----------|--------|----------|
| **1** | Uncle is RED | Recolor P, U → BLACK; G → RED | Yes, on G |
| **2a (LL)** | Uncle BLACK, P is left, N is left | Right-rotate G; P→B, G→R | No |
| **2b (RR)** | Uncle BLACK, P is right, N is right | Left-rotate G; P→B, G→R | No |
| **2c (LR)** | Uncle BLACK, P is left, N is right | Left-rotate P, then right-rotate G; N→B, G→R | No |
| **2d (RL)** | Uncle BLACK, P is right, N is left | Right-rotate P, then left-rotate G; N→B, G→R | No |

After all fixups, **always force the root to BLACK** (Rule 2).

---

## Deletion

Deletion is more complex than insertion. It involves two phases:
1. **BST Deletion** — Remove the node using standard BST logic.
2. **Fixup** — Restore Red-Black properties if they were violated.

### Step 1: Standard BST Delete

Three scenarios for the node being deleted (`D`):

| Scenario | Action |
|----------|--------|
| **Leaf node** | Simply remove it |
| **One child** | Replace `D` with its child |
| **Two children** | Find the **in-order successor** (smallest node in right subtree), copy its value to `D`, then delete the successor (which has at most one child) |

After this step, the actual node being physically removed always has **at most one child**.

### When Is Fixup Needed?

| Deleted Node Color | Replacement Color | Fixup? | Why |
|--------------------|-------------------|--------|-----|
| RED | Any/NIL | **No** | Removing a RED node doesn't change any black-height |
| BLACK | RED child | **No** | The RED child replaces and is recolored BLACK — black-height preserved |
| BLACK | NIL (no child) | **Yes** | We removed a BLACK node from a path — black-height decreased by 1 on that side |

### The "Double-Black" Concept

When we delete a BLACK node with no child (or a BLACK child), the position where the deleted node was becomes a **"double-black"**. Think of it as: that position owes one extra BLACK to every path passing through it, to make up for the removed black node.

The fixup process resolves this double-black by either:
- **Absorbing** it (a nearby RED node turns BLACK)
- **Rotating** to redistribute black-height
- **Propagating** it upward (if no local fix is possible)

```
        P                   P
       / \                 / \
     D(B)  S       →    [DB]  S        DB = "double-black" position
                                        (the void left by deleting D)
```

---

### Fixup Key Players

When fixing up after deleting a BLACK node, we track:
- **DB** — the double-black position (may be NIL)
- **P** — parent of the deleted node
- **S** — sibling of the deleted node (the other child of P)
- **Near nephew (CN)** — S's child that is closer to DB
- **Far nephew (FN)** — S's child that is farther from DB

```
  If DB is left child:          If DB is right child:
        P                              P
       / \                            / \
    [DB]   S                        S   [DB]
          / \                      / \
        CN   FN                  FN   CN
   (near) (far)              (far) (near)
```

---

### Deletion Case 1: Sibling Is RED

**Situation:** `S` is RED (which means `P` must be BLACK, and `S`'s children must be BLACK).

**Fix:** Rotate `P` toward DB, swap colors of `P` and `S`.

```
  BEFORE (DB is left):           AFTER (left-rotate P):
        P(B)                           S(B)
       / \                            / \
    [DB]   S(R)                    P(R)   FN(B)
          / \                     / \
        CN(B) FN(B)            [DB]  CN(B)
```

- `S` → BLACK, `P` → RED
- **This doesn't resolve the double-black!** But it transforms the situation: DB now has a new BLACK sibling (`CN`), and its parent is RED. This sets up for Case 2, 3, or 4 to finish the job.
- **Must recurse** with the same DB position but updated sibling/parent.

---

### Deletion Case 2: Sibling Is BLACK, Both Nephews Are BLACK (or NIL)

**Situation:** `S` is BLACK, both `CN` and `FN` are BLACK/NIL. No RED nephew to steal from.

**Fix:** Recolor `S` → RED. This removes one black from S's side, balancing it with DB's deficit.

```
  BEFORE:                    AFTER:
        P(?)                      P(?)
       / \                       / \
    [DB]   S(B)              [resolved]  S(R)
          / \                           / \
        CN(B) FN(B)                  CN(B) FN(B)
```

But now `P`'s subtree as a whole is one black short! What happens next depends on `P`'s color:

| P's Color | Action | Why |
|-----------|--------|-----|
| **RED** | `P` → BLACK. **Done.** | P absorbs the extra black. All paths restored. |
| **BLACK** | `P` becomes the new double-black. **Propagate upward.** | We can't fix locally; push the problem to P's parent. |

**Propagation** means we recurse: now `P` is the double-black node, with `P`'s parent as the new parent, and `P`'s sibling as the new sibling. This can propagate all the way to the root, where the double-black is simply absorbed (the root just loses one from every path, which is fine since it affects all paths equally).

---

### Deletion Case 3: Sibling Is BLACK, Far Nephew Is RED

**Situation:** `S` is BLACK, `FN` is RED. (CN can be anything.)

This is the **terminal case** — one rotation fixes everything.

**Fix:** Rotate `P` toward DB. Recolor:
- `S` inherits `P`'s original color
- `P` → BLACK
- `FN` → BLACK

```
  BEFORE (DB is left, RR):          AFTER (left-rotate P):
        P(?)                              S(P's color)
       / \                               / \
    [DB]   S(B)                        P(B)   FN(B)
          / \                         / \
        CN(?) FN(R)               [DB]  CN(?)
```

**Why this works:**
- The path through DB gained one black (`P` is now BLACK above DB)
- The path through `FN` lost one potential black (`S` took `P`'s color, `FN` → BLACK compensates)
- Net effect: all paths are balanced. **Done. No recursion.**

#### Sub-cases by direction:

| DB position | Sibling position | Far nephew | Rotation | Name |
|-------------|-----------------|------------|----------|------|
| Left | Right | Right child of S | Left-rotate P | **RR** |
| Right | Left | Left child of S | Right-rotate P | **LL** |

---

### Deletion Case 4: Sibling Is BLACK, Near Nephew Is RED, Far Nephew Is BLACK

**Situation:** `S` is BLACK, `CN` (near nephew) is RED, `FN` (far nephew) is BLACK/NIL.

We can't directly rotate `P` because the RED nephew is on the wrong side. We first rotate `S` to move the RED to the far side, then fall through to Case 3.

**Fix:** Two rotations (double rotation):
1. Rotate `S` **away** from DB (this moves `CN` up and `S` down)
2. Now `CN` is the new sibling with `S` as its far child — this looks like Case 3
3. Rotate `P` toward DB

```
  BEFORE (DB left, near=left):    STEP 1 (right-rotate S):    STEP 2 (left-rotate P):
        P(?)                            P(?)                        CN(P's color)
       / \                             / \                          / \
    [DB]   S(B)                     [DB]  CN(R)                  P(B)   S(B)
          / \                               \                   /
        CN(R) FN(B)                        S(B)             [DB]
                                             \
                                            FN(B)
```

Recolor:
- `CN` (new root of subtree) inherits `P`'s original color
- `P` → BLACK
- `S` → BLACK

**Done. No recursion.**

#### Sub-cases by direction:

| DB position | Near nephew | Rotations | Name |
|-------------|------------|-----------|------|
| Left | Left child of S (near) | Right-rotate S, then left-rotate P | **RL** |
| Right | Right child of S (near) | Left-rotate S, then right-rotate P | **LR** |

---

### Deletion Summary Table

| Case | Sibling | Near Nephew | Far Nephew | Action | Resolves? |
|------|---------|-------------|------------|--------|-----------|
| **1** | RED | — | — | Rotate P toward DB; swap P↔S colors | No — recurse (transforms to Case 2/3/4) |
| **2** | BLACK | BLACK | BLACK | S → RED; if P was RED → P→BLACK (done); if P was BLACK → propagate DB upward | Maybe (depends on P's color) |
| **3** | BLACK | Any | **RED** | Rotate P toward DB; S inherits P's color; P→B, FN→B | **Yes — done** |
| **4** | BLACK | **RED** | BLACK | Rotate S away from DB (converts to Case 3), then rotate P toward DB | **Yes — done** |

---

## Rotations Reference

Rotations are the fundamental rebalancing operations. They preserve BST ordering.

### Left Rotation (around node X)

```
  BEFORE:               AFTER:
      X                    Y
     / \                  / \
    a   Y       →       X   c
       / \             / \
      b   c           a   b
```

- `Y` was X's right child, becomes the new root of this subtree
- `b` (Y's left child) becomes X's right child
- X becomes Y's left child

### Right Rotation (around node X)

```
  BEFORE:               AFTER:
      X                    Y
     / \                  / \
    Y   c       →       a   X
   / \                      / \
  a   b                    b   c
```

- `Y` was X's left child, becomes the new root of this subtree
- `b` (Y's right child) becomes X's left child
- X becomes Y's right child

---

## API Reference (Implementation Contract)

```
Class: RBNode
  constructor(value, left, right, parent, color)

Class: RBT
  constructor(...items)       — Build tree from values
  insert(value)               — Insert a value
  delete(value)               — Delete a value, returns boolean
  search(value, startNode, returnBoolean) — Find a value
  height(startNode)           — Tree height
  size()                      — Node count
  isEmpty()                   — Is tree empty?
  findMin()                   — Minimum value
  findMax()                   — Maximum value
  isTreeValid()               — Validates RB properties
```
