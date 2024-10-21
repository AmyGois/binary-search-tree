/* Tests */
import Tree from "./bst.mjs";

/* Create test array with random number of random values */
function createRandonNumsArray() {
  const newArray = [];
  const numOfEntries = Math.floor(Math.random() * 30);

  for (let i = 0; i <= numOfEntries; i++) {
    let newNum = Math.floor(Math.random() * 100);
    newArray.push(newNum);
  }

  return newArray;
}

const testArray = createRandonNumsArray();

/* Print graphic representation of tree */
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function log(node) {
  console.log(node.data);
}

const test = new Tree(testArray);

prettyPrint(test.root);

/* Check tree is balanced */
console.log("Is the tree balanced? :");
console.log(test.isBalanced());

/* Breadth first & depth first traversals */
console.log("Level order traversal:");
try {
  test.levelOrder(log);
} catch (err) {
  console.error(err);
}
console.log("Inorder traversal:");
try {
  test.inOrder(log);
} catch (err) {
  console.error(err);
}
console.log("Preorder traversal:");
try {
  test.preOrder(log);
} catch (err) {
  console.error(err);
}
console.log("Postorder traversal:");
try {
  test.postOrder(log);
} catch (err) {
  console.error(err);
}

/* Add values & rebalance tree automatically (isBalanced()
 & rebalance() called within insert() & delete()) */
test.insert(200);
test.insert(154);
test.insert(167);
test.insert(125);
test.insert(183);
prettyPrint(test.root);
console.log("Is the tree balanced? :");
console.log(test.isBalanced());
