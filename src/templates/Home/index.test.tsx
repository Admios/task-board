import { render } from '@testing-library/react'
import { Home } from "."

it('should render', () => {
  expect(true).toBe(true)
  const { container } = render(<Home />)
  expect(container).toMatchSnapshot()
})