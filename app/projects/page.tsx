
import { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'
import { ProjectsContent } from '@/components/projects/projects-content'

export const metadata: Metadata = {
  title: 'Projets - TaskCollab',
  description: 'Gérez vos projets collaboratifs'
}

export default function ProjectsPage() {
  return (
    <AppLayout>
      <ProjectsContent />
    </AppLayout>
  )
}
