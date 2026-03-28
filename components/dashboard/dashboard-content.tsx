
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  FolderPlus, 
  CheckCircle, 
  Clock, 
  Users, 
  Plus,
  Calendar,
  TrendingUp
} from 'lucide-react'

interface DashboardStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  upcomingDeadlines: number
}

interface RecentProject {
  id: string
  name: string
  color: string
  tasksCount: number
  completedTasks: number
  membersCount: number
}

interface RecentTask {
  id: string
  title: string
  status: string
  priority: string
  project: {
    name: string
    color: string
  }
  dueDate?: string
}

export function DashboardContent() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    upcomingDeadlines: 0
  })
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes, tasksRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/recent-projects'),
        fetch('/api/dashboard/recent-tasks')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setRecentProjects(projectsData)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setRecentTasks(tasksData)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'DONE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'À faire'
      case 'IN_PROGRESS':
        return 'En cours'
      case 'DONE':
        return 'Terminé'
      default:
        return status
    }
  }

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de vos projets et tâches
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bonjour {session?.user?.firstName}, voici un aperçu de votre activité
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projets actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Sur {stats.totalTasks} tâches
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tâches à traiter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Projets récents */}
        <Card>
          <CardHeader>
            <CardTitle>Projets Récents</CardTitle>
            <CardDescription>
              Vos projets les plus actifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{project.completedTasks}/{project.tasksCount} tâches</span>
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          <span>{project.membersCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={project.tasksCount > 0 ? (project.completedTasks / project.tasksCount) * 100 : 0} 
                    className="w-20" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tâches récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Tâches Récentes</CardTitle>
            <CardDescription>
              Dernières tâches créées ou modifiées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: task.project.color }}
                    ></div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getStatusColor(task.status)}>
                          {formatStatus(task.status)}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
