
import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'
import { TasksContent } from '@/components/tasks/tasks-content'

export const metadata: Metadata = {
  title: 'Mes tâches - TaskCollab',
  description: 'Gérez toutes vos tâches assignées'
}

export default function TasksPage() {
  return (
    <AppLayout>
      <TasksContent />
    </AppLayout>
  )
}
