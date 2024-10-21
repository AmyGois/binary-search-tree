class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export default class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  #sortArray(array) {
    /* Remove duplicate numbers from initial array */
    const clearedArray = [...new Set(array)];
    const sortedArray = clearedArray.sort((a, b) => a - b);

    return sortedArray;
  }

  #buildBST(array, start, end) {
    if (start > end) {
      return null;
    } else {
      const middle = start + Math.floor((end - start) / 2);
      const root = new Node(array[middle]);

      root.left = this.#buildBST(array, start, middle - 1);
      root.right = this.#buildBST(array, middle + 1, end);

      return root;
    }
  }

  buildTree(array) {
    const sortedArray = this.#sortArray(array);

    return this.#buildBST(sortedArray, 0, sortedArray.length - 1);
  }

  insert(value) {
    let currentNode = this.root;
    let balanced;

    if (currentNode === null) {
      currentNode = new Node(value);
    } else {
      while (currentNode.data !== value) {
        if (value < currentNode.data) {
          if (currentNode.left === null) {
            currentNode.left = new Node(value);
          } else {
            currentNode = currentNode.left;
          }
        } else if (value > currentNode.data) {
          if (currentNode.right === null) {
            currentNode.right = new Node(value);
          } else {
            currentNode = currentNode.right;
          }
        }
      }
    }

    balanced = this.isBalanced();

    if (balanced === false) {
      this.rebalance();
    }
  }

  delete(value) {
    let nodeToDelete = this.root;
    let parentNode = null;
    let balanced;

    if (nodeToDelete === null) {
      return null;
    }

    while (nodeToDelete.data !== value) {
      if (value < nodeToDelete.data) {
        parentNode = nodeToDelete;
        nodeToDelete = nodeToDelete.left;
      } else if (value > nodeToDelete.data) {
        parentNode = nodeToDelete;
        nodeToDelete = nodeToDelete.right;
      }

      if (nodeToDelete === null) {
        return null;
      }
    }

    /* Delete leaf node */
    if (nodeToDelete.left === null && nodeToDelete.right === null) {
      if (parentNode === null) {
        this.root = null;
      } else if (nodeToDelete.data < parentNode.data) {
        parentNode.left = null;
      } else if (nodeToDelete.data > parentNode.data) {
        parentNode.right = null;
      }
    } /* Delete node with only one child */ else if (
      (nodeToDelete.left !== null && nodeToDelete.right === null) ||
      (nodeToDelete.left === null && nodeToDelete.right !== null)
    ) {
      if (nodeToDelete.left !== null) {
        if (parentNode === null) {
          this.root = nodeToDelete.left;
        } else {
          parentNode.left = nodeToDelete.left;
        }
      } else if (nodeToDelete.right !== null) {
        if (parentNode === null) {
          this.root = nodeToDelete.right;
        } else {
          parentNode.right = nodeToDelete.right;
        }
      }
    } /* Delete node with two chidren */ else if (
      nodeToDelete.left !== null &&
      nodeToDelete.right !== null
    ) {
      let currentNode = nodeToDelete.right;
      let currentParent = null;

      while (currentNode.left !== null) {
        currentParent = currentNode;
        currentNode = currentNode.left;
      }

      if (currentParent !== null) {
        currentParent.left = currentNode.right;
        currentNode.right = nodeToDelete.right;
      }

      currentNode.left = nodeToDelete.left;

      if (parentNode === null) {
        this.root = currentNode;
      } else if (parentNode.left === nodeToDelete) {
        parentNode.left = currentNode;
      } else if (parentNode.right === nodeToDelete) {
        parentNode.right = currentNode;
      }
    }

    balanced = this.isBalanced();

    if (balanced === false) {
      this.rebalance();
    }
  }

  find(value) {
    let currentNode = this.root;

    if (currentNode === null) {
      return null;
    }

    while (currentNode.data !== value) {
      if (value < currentNode.data) {
        currentNode = currentNode.left;
      } else if (value > currentNode.data) {
        currentNode = currentNode.right;
      }

      if (currentNode === null) {
        return null;
      }
    }

    return currentNode;
  }

  levelOrder(callback) {
    let queue = [this.root];

    if (!callback) {
      throw new Error("Must have a callback function as a parameter!");
    }

    if (this.root === null) {
      return null;
    }

    while (queue.length > 0) {
      let currentNode = queue.shift();

      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }
      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }

      callback(currentNode);
    }
  }

  inOrder(callback, currentNode = this.root) {
    if (!callback) {
      throw new Error("Must have a callback function as a parameter!");
    }

    if (currentNode === null) {
      return;
    }

    this.inOrder(callback, currentNode.left);
    callback(currentNode);
    this.inOrder(callback, currentNode.right);
  }

  preOrder(callback, currentNode = this.root) {
    if (!callback) {
      throw new Error("Must have a callback function as a parameter!");
    }

    if (currentNode === null) {
      return;
    }

    callback(currentNode);
    this.preOrder(callback, currentNode.left);
    this.preOrder(callback, currentNode.right);
  }

  postOrder(callback, currentNode = this.root) {
    if (!callback) {
      throw new Error("Must have a callback function as a parameter!");
    }

    if (currentNode === null) {
      return;
    }

    this.postOrder(callback, currentNode.left);
    this.postOrder(callback, currentNode.right);
    callback(currentNode);
  }

  /* This calculates the nº of nodes between a node and its furthest leaf.
    (Original node included.) Height (in number of edges) is the result of
    this function - 1. */
  #findHeight(node) {
    if (node === null) {
      return 0;
    }

    let leftBranch = 1 + this.#findHeight(node.left);
    let rightBranch = 1 + this.#findHeight(node.right);

    if (leftBranch > rightBranch) {
      return leftBranch;
    } else {
      return rightBranch;
    }
  }

  height(nodeValue) {
    let node = this.root;
    let height = 0;

    if (node === null) {
      return null;
    }

    while (node.data !== nodeValue) {
      if (nodeValue < node.data) {
        node = node.left;
      } else if (nodeValue > node.data) {
        node = node.right;
      }

      if (node === null) {
        return null;
      }
    }

    height = this.#findHeight(node) - 1;
    return height;
  }

  depth(nodeValue) {
    let currentNode = this.root;
    let depth = 0;

    if (currentNode === null) {
      return null;
    }

    while (currentNode.data !== nodeValue) {
      if (nodeValue < currentNode.data) {
        currentNode = currentNode.left;
        depth++;
      } else if (nodeValue > currentNode.data) {
        currentNode = currentNode.right;
        depth++;
      }

      if (currentNode === null) {
        return null;
      }
    }

    return depth;
  }

  #checkBalance(node, balance = true) {
    if (node === null) {
      return { result: 0, balance: balance };
    }

    let leftBranch = 1 + this.#checkBalance(node.left, balance).result;
    let rightBranch = 1 + this.#checkBalance(node.right, balance).result;

    if (leftBranch - rightBranch < -1 || leftBranch - rightBranch > 1) {
      balance = false;
    }

    if (leftBranch > rightBranch) {
      return { result: leftBranch, balanced: balance };
    } else {
      return { result: rightBranch, balanced: balance };
    }
  }

  isBalanced() {
    if (this.root === null) {
      return null;
    }

    let isBalanced = this.#checkBalance(this.root);

    if (isBalanced.balanced === false) {
      return false;
    } else return true;
  }

  rebalance() {
    const treeArray = [];
    const push = (node) => treeArray.push(node.data);

    this.inOrder(push);
    this.root = this.#buildBST(treeArray, 0, treeArray.length - 1);
  }
}
