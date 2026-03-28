
import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'
import { TeamContent } from '@/components/team/team-content'

export const metadata: Metadata = {
  title: 'Équipe - TaskCollab',
  description: 'Gérez votre équipe et les collaborateurs'
}

export default function TeamPage() {
  return (
    <AppLayout>
      <TeamContent />
    </AppLayout>
  )
}
