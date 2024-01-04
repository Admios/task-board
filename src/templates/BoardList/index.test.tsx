import { render, screen, within } from "@testing-library/react";
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
    owner: "owner@test.com",
  },
  {
    id: "2",
    name: "Another Board",
    owner: "owner@test.com",
  },
];

describe("BoardList", () => {
  it("renders the navbar with the user's name", () => {
    const { container } = render(
      <BoardList user={mockUser} boards={mockBoards} />,
    );
    expect(container).toMatchSnapshot("Normal Layout");
  });

  it("renders the board links", () => {
    render(<BoardList user={mockUser} boards={mockBoards} />);
    const boardLinks = within(screen.getByTitle("boards-list")).getAllByRole(
      "link",
      { name: /board/i },
    );
    expect(boardLinks).toHaveLength(mockBoards.length);
  });

  it("renders an empty layout when there are no boards", () => {
    const { container } = render(<BoardList user={mockUser} boards={[]} />);
    expect(container).toMatchSnapshot("Empty Layout");
  });
});
