class Node {
  constructor(value = null) {
    this.children = new Map();
    this.endOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new Node();
  }

  insert(word) {
    let current = this.root;
    for (const ch of word) {
      if (!current.children.has(ch)) {
        current.children.set(ch, new Node(ch));
      }
      current = current.children.get(ch);
    }
    current.endOfWord = true;
  }

  has(word) {
    let current = this.root;

    for (const ch of word) {
      if (!current.children.has(ch)) {
        return false;
      }
      current = current.children.get(ch);
    }

    return current.endOfWord;
  }

  delete(word) {
    const deleteHelper = (node, word, index) => {
      if (!node) return null;

      if (index === word.length) {
        // Case when word to be deleted is prefix of another word
        if (node.children.size > 0) {
          node.endOfWord = false;
          return node;
        }
        // Case when this is the whole word, no characters after it
        return null;
      }

      const char = word[index];
      const childResult = deleteHelper(
        node.children.get(char),
        word,
        index + 1,
      );

      if (childResult === null) {
        node.children.delete(char);
      } 
    
      if (!node.endOfWord && node.children.size === 0) {
        return null;
      }
      return node;
    };

    this.root = deleteHelper(this.root, word, 0) ?? new Node();
  }
}

module.exports = Trie;
