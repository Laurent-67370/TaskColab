
import { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Créer un compte - TaskCollab',
  description: 'Créez votre compte TaskCollab'
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
