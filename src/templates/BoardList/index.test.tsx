import { render, screen } from "@testing-library/react";
import { BoardList } from "./index";
import { UserDTO } from "@/model/User";
import { BoardDTO } from "@/model/Board";

const mockUser: UserDTO = {
  email: "John Doe",
};

const mockBoards: BoardDTO[] = [
  {
    id: "1",
    name: "Test Board",
    owner: "1",
  },
  {
    id: "2",
    name: "Another Board",
    owner: "1",
  },
];

describe("BoardList", () => {
  it("renders the navbar with the user's name", () => {
    const { container } = render(
      <BoardList user={mockUser} boards={mockBoards} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders the board links", () => {
    render(<BoardList user={mockUser} boards={mockBoards} />);
    const boardLinks = screen.getAllByRole("link", { name: /board/i });
    expect(boardLinks).toHaveLength(mockBoards.length);
  });
});
