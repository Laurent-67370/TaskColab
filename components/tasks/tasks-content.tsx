
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  AlertTriangle
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  createdAt: string
  project: {
    name: string
    color: string
  }
  createdBy: {
    firstName: string
    lastName: string
  }
}

export function TasksContent() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/my-tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO':
        return <Circle className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <PlayCircle className="h-4 w-4" />
      case 'DONE':
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
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

  const formatPriority = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'Basse'
      case 'MEDIUM':
        return 'Moyenne'
      case 'HIGH':
        return 'Haute'
      default:
        return priority
    }
  }

  const filterTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center space-x-2">
              {getStatusIcon(task.status)}
              <span>{task.title}</span>
            </CardTitle>
            {task.description && (
              <CardDescription className="line-clamp-2">
                {task.description}
              </CardDescription>
            )}
          </div>
          {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE' && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: task.project.color }}
            ></div>
            <span className="text-sm text-muted-foreground">{task.project.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getStatusColor(task.status)}>
                {formatStatus(task.status)}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {formatPriority(task.priority)}
              </Badge>
            </div>
            {task.dueDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes tâches</h1>
          <p className="text-muted-foreground">
            Toutes vos tâches assignées dans tous les projets
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="flex space-x-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const todoTasks = filterTasksByStatus('TODO')
  const inProgressTasks = filterTasksByStatus('IN_PROGRESS')
  const doneTasks = filterTasksByStatus('DONE')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes tâches</h1>
        <p className="text-muted-foreground">
          Toutes vos tâches assignées dans tous les projets
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À faire</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Toutes ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="todo">
            À faire ({todoTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            En cours ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="done">
            Terminées ({doneTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="todo" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in_progress" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="done" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-sm">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Aucune tâche</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Vous n'avez pas encore de tâches assignées. Les tâches apparaîtront ici une fois qu'elles vous seront assignées.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
