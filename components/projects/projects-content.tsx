
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Users, 
  Calendar,
  MoreHorizontal,
  Settings
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description?: string
  color: string
  role: 'OWNER' | 'MEMBER'
  tasksCount: number
  completedTasks: number
  membersCount: number
  createdAt: string
  updatedAt: string
}

export function ProjectsContent() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
            <p className="text-muted-foreground">
              Gérez tous vos projets collaboratifs
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">
            Gérez tous vos projets collaboratifs
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const completionRate = project.tasksCount > 0 
            ? (project.completedTasks / project.tasksCount) * 100 
            : 0

          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  {project.description && (
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span>{Math.round(completionRate)}%</span>
                    </div>
                    <Progress value={completionRate} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{project.completedTasks}/{project.tasksCount} tâches</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={project.role === 'OWNER' ? 'default' : 'secondary'}>
                        {project.role === 'OWNER' ? 'Propriétaire' : 'Membre'}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{project.membersCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-sm">
            <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Aucun projet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Vous n'avez pas encore de projets. Créez votre premier projet pour commencer.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Créer un projet
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
