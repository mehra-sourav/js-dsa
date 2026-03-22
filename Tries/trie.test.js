const Trie = require('./index');

const buildTrie = (words = []) => {
  const trie = new Trie();
  words.forEach((w) => trie.insert(w));
  return trie;
};

describe('Trie', () => {
  test('insert + hasWord should find inserted words', () => {
    const trie = buildTrie(['cat', 'car', 'care']);

    expect(trie.hasWord('cat')).toBe(true);
    expect(trie.hasWord('car')).toBe(true);
    expect(trie.hasWord('care')).toBe(true);
    expect(trie.hasWord('cap')).toBe(false);
  });

  test('delete removes only the target word when siblings share prefix', () => {
    const trie = buildTrie(['car', 'card', 'care']);

    trie.delete('card');

    expect(trie.hasWord('card')).toBe(false);
    expect(trie.hasWord('car')).toBe(true);
    expect(trie.hasWord('care')).toBe(true);
  });

  test('deleting a prefix word keeps longer words intact', () => {
    const trie = buildTrie(['hell', 'hello']);

    trie.delete('hell');

    expect(trie.hasWord('hell')).toBe(false);
    expect(trie.hasWord('hello')).toBe(true);
  });

  test('deleting last word empties trie but keeps root intact', () => {
    const trie = buildTrie(['a']);

    trie.delete('a');

    expect(trie.hasWord('a')).toBe(false);
    expect(trie.root).toBeDefined();
    expect(trie.root.children.size).toBe(0);
    expect(trie.root.isEndOfWord).toBe(false);
  });

  test('deleting longer word preserves shorter prefix word', () => {
    const trie = buildTrie(['a', 'ab']);

    trie.delete('ab');

    expect(trie.hasWord('a')).toBe(true);
    expect(trie.hasWord('ab')).toBe(false);
  });

  test('deleting non-existent word leaves existing words unchanged', () => {
    const trie = buildTrie(['cat', 'car']);

    trie.delete('cab');

    expect(trie.hasWord('cat')).toBe(true);
    expect(trie.hasWord('car')).toBe(true);
  });

  test('insert returns the word for new entries and false for duplicates', () => {
    const trie = new Trie();

    const firstInsert = trie.insert('cat');
    const secondInsert = trie.insert('cat');

    expect(firstInsert).toBe('cat');
    expect(secondInsert).toBe(false);
  });

  test('hasPrefix returns true for existing prefixes and full words', () => {
    const trie = buildTrie(['car', 'card', 'care']);

    expect(trie.hasPrefix('c')).toBe(true);
    expect(trie.hasPrefix('car')).toBe(true);
    expect(trie.hasPrefix('care')).toBe(true);
    expect(trie.hasPrefix('cares')).toBe(false);
  });

  test('hasPrefix returns true for empty prefix', () => {
    const trie = buildTrie(['cat']);

    expect(trie.hasPrefix('')).toBe(true);
  });

  test('delete returns null when deleting a non-existent word', () => {
    const trie = buildTrie(['cat']);

    const result = trie.delete('dog');

    expect(result).toBeNull();
    expect(trie.hasWord('cat')).toBe(true);
  });

  test('delete returns undefined when deleting an existing word', () => {
    const trie = buildTrie(['cat']);

    const result = trie.delete('cat');

    expect(result).toBeUndefined();
    expect(trie.hasWord('cat')).toBe(false);
  });
});
