import { render } from '@testing-library/react'
import { Home } from "."

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

jest.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{ isDragging: false }, jest.fn()]
}));


it('should render', () => {
  expect(true).toBe(true)
  const { container } = render(<Home />)
  expect(container).toMatchSnapshot()
})