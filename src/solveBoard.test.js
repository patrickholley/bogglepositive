import solveBoard from "./solveBoard";

describe("solveBoard", () => {
  it("should find valid words on a given board", () => {
    const board = [
      ["t", "h", "i", "s"],
      ["w", "a", "t", "s"],
      ["o", "a", "h", "g"],
      ["f", "g", "d", "t"],
    ];
    const words = ["this", "what", "two", "hat", "two"];
    const result = solveBoard(board, words);

    expect(result.sort()).toEqual(["this", "what", "two", "hat"].sort());
  });

  it("should handle an empty words array", () => {
    const board = [
      ["t", "h", "i", "s"],
      ["w", "a", "t", "s"],
      ["o", "a", "h", "g"],
      ["f", "g", "d", "t"],
    ];
    const words = [];
    const result = solveBoard(board, words);

    expect(result).toEqual([]);
  });
});
