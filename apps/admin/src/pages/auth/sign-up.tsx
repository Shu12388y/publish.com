import { AuthForm } from './auth-form'

type SignUpProps = {
  onModeChange: (mode: 'sign-in' | 'sign-up') => void
}

function SignUp({ onModeChange }: SignUpProps) {
  return <AuthForm mode="sign-up" onModeChange={onModeChange} />
}

export default SignUp
