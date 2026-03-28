
import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export const metadata: Metadata = {
  title: 'Dashboard - TaskCollab',
  description: 'Vue d\'ensemble de vos projets et tâches'
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  )
}
