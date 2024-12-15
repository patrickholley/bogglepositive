function getMoves(currRow, currCol) {
  return [
    [currRow - 1, currCol - 1],
    [currRow - 1, currCol],
    [currRow - 1, currCol + 1],
    [currRow, currCol - 1],
    [currRow, currCol],
    [currRow, currCol + 1],
    [currRow + 1, currCol - 1],
    [currRow + 1, currCol],
    [currRow + 1, currCol + 1],
  ];
}

function findWords(currRow, currCol, trieNode, board, wordsOnBoard) {
  const currChar = board[currRow]?.[currCol];
  const currTrieNode = trieNode.children[currChar];

  if (currChar && currTrieNode) {
    board[currRow][currCol] = null;

    if (currTrieNode.word) {
      wordsOnBoard.add(currTrieNode.word);
      currTrieNode.word = null;
    }

    getMoves(currRow, currCol).forEach(([nextRow, nextCol]) => {
      findWords(nextRow, nextCol, currTrieNode, board, wordsOnBoard);
    });

    board[currRow][currCol] = currChar;
  }
}

export default function solveBoard(board, words) {
  const wordTrie = { children: {} };
  const wordsOnBoard = new Set();

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let trieNode = wordTrie;

    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      if (!trieNode.children[char]) trieNode.children[char] = { children: {} };
      trieNode = trieNode.children[char];
    }

    trieNode.word = word;
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      findWords(i, j, wordTrie, board, wordsOnBoard);
    }
  }

  return Array.from(wordsOnBoard);
}
