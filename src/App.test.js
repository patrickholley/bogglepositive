import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { act } from "react-dom/test-utils";

const errorMessage =
  "Input must be a valid 4x4 matrix of single letters (check square brackets, no periods, etc).";
const solveButtonText = "Solve Board";
const textAreaPlaceholder =
  '[["b","q","m","p"],["t","i","g","o"],["i","j","z","l"],["o","g","k","c"]]';

describe("App Component", () => {
  it("renders the App component correctly", async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText("Boggle Solver")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(textAreaPlaceholder),
    ).toBeInTheDocument();
    expect(screen.getByText("Solve Board")).toBeInTheDocument();
  });

  it("enables the solve button for valid input matrix", async () => {
    await act(async () => {
      render(<App />);
    });

    const textarea = screen.getByPlaceholderText(textAreaPlaceholder);
    const solveButton = screen.getByText(solveButtonText);

    fireEvent.change(textarea, {
      target: {
        value:
          '[["a","b","c","d"],["e","f","g","h"],["i","j","k","l"],["m","n","o","p"]]',
      },
    });

    expect(solveButton).not.toBeDisabled();
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("disables the solve button when input is invalid", async () => {
    await act(async () => {
      render(<App />);
    });

    const textarea = screen.getByPlaceholderText(
      '[["b","q","m","p"],["t","i","g","o"],["i","j","z","l"],["o","g","k","c"]]',
    );
    const solveButton = screen.getByText("Solve Board");

    fireEvent.change(textarea, {
      target: { value: '[["a","b","c","INVALID"]]' },
    });

    expect(solveButton).toBeDisabled();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
