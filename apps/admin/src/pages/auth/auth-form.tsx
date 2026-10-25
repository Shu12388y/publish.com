import { useState, type FormEvent } from 'react'
import { Github } from 'lucide-react'
import heroImg from '@/assets/hero.png'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export type AuthMode = 'sign-in' | 'sign-up'

type AuthFormProps = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const isSignUp = mode === 'sign-up'
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-background shadow-xl md:grid-cols-2">
        <div className="relative hidden min-h-[680px] overflow-hidden bg-primary p-10 text-primary-foreground md:flex md:flex-col md:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.5_0.15_300),transparent_55%)]" />
          <div className="relative z-10">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground text-lg font-bold text-primary">
              P
            </div>
            <h1 className="mt-12 max-w-sm text-4xl font-semibold leading-tight tracking-tight">
              Build, publish, and grow with confidence.
            </h1>
            <p className="mt-4 max-w-sm text-primary-foreground/70">
              Manage your publishing workflow from one beautiful, focused workspace.
            </p>
          </div>
          <div className="relative z-10">
            <img
              className="mx-auto w-full max-w-sm rounded-2xl object-cover shadow-2xl"
              src={heroImg}
              alt="Publish.com workspace illustration"
            />
            <p className="mt-6 text-sm text-primary-foreground/60">
              Everything you need to bring your ideas to life.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-10">
        <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            P
          </div>
          <p className="text-sm font-medium text-muted-foreground">Publish.com Admin</p>
        </div>

        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle>{isSignUp ? 'Create an account' : 'Welcome back'}</CardTitle>
            <CardDescription>
              {isSignUp
                ? 'Enter your details to get started with Publish.com.'
                : 'Enter your credentials to access your dashboard.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" placeholder="Alex Morgan" required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp && (
                    <a className="text-xs font-medium text-primary hover:underline" href="#forgot-password">
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Your password must be at least 8 characters.
                </p>
              )}
              <Button className="w-full" type="submit">
                {isSignUp ? 'Create account' : 'Sign in'}
              </Button>
              {submitted && (
                <p className="text-center text-sm text-muted-foreground" role="status">
                  This form is ready to connect to your authentication service.
                </p>
              )}
            </form>

            <div className="my-6 flex items-center gap-3">
              <Separator />
              <span className="shrink-0 text-xs uppercase text-muted-foreground">Or continue with</span>
              <Separator />
            </div>

            <Button className="w-full" variant="outline" type="button">
              <Github className="size-4" />
              GitHub
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t px-6 py-4 text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              className="ml-1 font-medium text-primary hover:underline"
              type="button"
              onClick={() => onModeChange(isSignUp ? 'sign-in' : 'sign-up')}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
        </div>
      </div>
    </main>
  )
}

export { AuthForm }
