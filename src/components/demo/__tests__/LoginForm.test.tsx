import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/demo/LoginForm'

const push = jest.fn()
const replace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    window.localStorage.clear()
    push.mockClear()
    replace.mockClear()
  })

  test('shows error on invalid credentials', async () => {
    const user = userEvent.setup()

    render(
      <LoginForm
        lang="en"
        labels={{
          title: 'Sign in',
          username: 'Username',
          password: 'Password',
          signIn: 'Sign in',
          invalidCreds: 'Invalid username or password.',
        }}
      />
    )

    await user.type(screen.getByLabelText('Username'), 'nope')
    await user.type(screen.getByLabelText('Password'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Invalid username or password.')).toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
  })

  test('stores token and navigates on success', async () => {
    const user = userEvent.setup()

    render(
      <LoginForm
        lang="en"
        labels={{
          title: 'Sign in',
          username: 'Username',
          password: 'Password',
          signIn: 'Sign in',
          invalidCreds: 'Invalid username or password.',
        }}
      />
    )

    await user.type(screen.getByLabelText('Username'), 'carmy')
    await user.type(screen.getByLabelText('Password'), 'carmylovesfood')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(window.localStorage.getItem('demoAuth')).toContain('carmy')
    expect(push).toHaveBeenCalledWith('/en/demo/dashboard')
  })
})
