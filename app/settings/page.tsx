
import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'
import { SettingsContent } from '@/components/settings/settings-content'

export const metadata: Metadata = {
  title: 'Paramètres - TaskCollab',
  description: 'Configurez votre compte et vos préférences'
}

export default function SettingsPage() {
  return (
    <AppLayout>
      <SettingsContent />
    </AppLayout>
  )
}
