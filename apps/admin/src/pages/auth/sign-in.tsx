import { AuthForm } from './auth-form'

type SignInProps = {
  onModeChange: (mode: 'sign-in' | 'sign-up') => void
}

function SignIn({ onModeChange }: SignInProps) {
  return <AuthForm mode="sign-in" onModeChange={onModeChange} />
}

export default SignIn
