const Trie = require('./index');

const buildTrie = (words = []) => {
  const trie = new Trie();
  words.forEach((w) => trie.insert(w));
  return trie;
};

describe('Trie', () => {
  test('insert + has should find inserted words', () => {
    const trie = buildTrie(['cat', 'car', 'care']);

    expect(trie.has('cat')).toBe(true);
    expect(trie.has('car')).toBe(true);
    expect(trie.has('care')).toBe(true);
    expect(trie.has('cap')).toBe(false);
  });

  test('delete removes only the target word when siblings share prefix', () => {
    const trie = buildTrie(['car', 'card', 'care']);

    trie.delete('card');

    expect(trie.has('card')).toBe(false);
    expect(trie.has('car')).toBe(true);
    expect(trie.has('care')).toBe(true);
  });

  test('deleting a prefix word keeps longer words intact', () => {
    const trie = buildTrie(['hell', 'hello']);

    trie.delete('hell');

    expect(trie.has('hell')).toBe(false);
    expect(trie.has('hello')).toBe(true);
  });

  test('deleting last word empties trie but keeps root intact', () => {
    const trie = buildTrie(['a']);

    trie.delete('a');

    expect(trie.has('a')).toBe(false);
    expect(trie.root).toBeDefined();
    expect(trie.root.children.size).toBe(0);
    expect(trie.root.endOfWord).toBe(false);
  });

  test('deleting longer word preserves shorter prefix word', () => {
    const trie = buildTrie(['a', 'ab']);

    trie.delete('ab');

    expect(trie.has('a')).toBe(true);
    expect(trie.has('ab')).toBe(false);
  });

  test('deleting non-existent word leaves existing words unchanged', () => {
    const trie = buildTrie(['cat', 'car']);

    trie.delete('cab');

    expect(trie.has('cat')).toBe(true);
    expect(trie.has('car')).toBe(true);
  });
});
