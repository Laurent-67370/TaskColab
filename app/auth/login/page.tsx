
import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Connexion - TaskCollab',
  description: 'Connectez-vous à votre compte TaskCollab'
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
