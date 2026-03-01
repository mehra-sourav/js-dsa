class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Inserts a new word into the trie.
   * !Time Complexity: O(N) where N is the length of the word
   * !Space Complexity: O(N) in the worst case when no prefix is shared
   * @param {string} word - The word to insert.
   * @returns {string|false} The word if it was newly inserted; false if it already existed.
   */
  insert(word) {
    // Returning false if word already exists
    if (this.hasWord(word)) return false;

    let currentNode = this.root;

    for (let char of word) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }

      currentNode = currentNode.children.get(char);
    }

    currentNode.isEndOfWord = true;

    return word;
  }

  /**
   * Checks if a complete word exists in the trie.
   * !Time Complexity: O(N) where N is the length of the word
   * !Space Complexity: O(1)
   * @param {string} word - The word to search for.
   * @returns {boolean} True if the word exists; false otherwise.
   */
  hasWord(word) {
    let currentNode = this.root;

    for (let char of word) {
      if (!currentNode.children.has(char)) {
        return false;
      }

      currentNode = currentNode.children.get(char);
    }

    return currentNode.isEndOfWord;
  }

  /**
   * Checks if there is any word in the trie that starts with the given prefix.
   * !Time Complexity: O(N) where N is the length of the prefix
   * !Space Complexity: O(1)
   * @param {string} prefix - The prefix to search for.
   * @returns {boolean} True if at least one word with the given prefix exists; false otherwise.
   */
  hasPrefix(prefix) {
    let currentNode = this.root;

    for (let char of prefix) {
      if (!currentNode.children.has(char)) {
        return false;
      }

      currentNode = currentNode.children.get(char);
    }

    return true;
  }

  /**
   * Deletes a word from the trie if it exists.
   * !Time Complexity: O(N) where N is the length of the word
   * !Space Complexity: O(N) due to the recursion stack
   * @param {string} word - The word to delete.
   * @returns {null|void} Returns null if the word does not exist; otherwise undefined.
   */
  delete(word) {
    // If the word is not present in the trie, there is nothing to delete.
    // Return null so callers can distinguish this case.
    if (!this.hasWord(word)) return null;

    // Recursively traverses the trie to remove the word starting at `index`.
    // Returns true if the current node can be pruned from its parent.
    const deleteHelper = (node, word, index) => {
      // Base case: we've processed all characters in `word`.
      if (word.length === index) {
        // This node no longer represents the end of a word.
        node.isEndOfWord = false;

        // If this node has no children, it is safe to remove it.
        // Signal to the caller that this node can be pruned.
        return node.children.size === 0;
      }

      const childNode = node.children.get(word[index]);

      // If there is no child for the current character, the word is not present
      // along this path. Nothing to delete, so stop recursion.
      if (!childNode) return false;

      const shouldPruneChild = deleteHelper(childNode, word, index + 1);

      // If the child subtree is now empty (no children and not end of a word),
      // remove the reference to that child from the current node.
      if (shouldPruneChild) {
        node.children.delete(word[index]);
      }

      // This node can be pruned if:
      //  - it is not the end of another word, and
      //  - it no longer has any children.
      return !node.isEndOfWord && node.children.size === 0;
    };

    // Kick off the recursive deletion from the root at index 0.
    deleteHelper(this.root, word, 0);
  }
}

module.exports = Trie;
