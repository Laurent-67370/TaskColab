
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserPlus,
  Crown,
  Mail
} from 'lucide-react'

interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'OWNER' | 'MEMBER'
  projectsCount: number
  tasksCount: number
  completedTasks: number
  project?: {
    name: string
    color: string
  }
}

export function TeamContent() {
  const { data: session } = useSession()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team/members')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'équipe:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Équipe</h1>
            <p className="text-muted-foreground">
              Gérez votre équipe et les collaborateurs
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Équipe</h1>
          <p className="text-muted-foreground">
            Tous les membres de vos projets collaboratifs
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter un membre
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => {
          const completionRate = member.tasksCount > 0 
            ? (member.completedTasks / member.tasksCount) * 100 
            : 0

          return (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.firstName[0]}{member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {member.firstName} {member.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={member.role === 'OWNER' ? 'default' : 'secondary'} className="flex items-center space-x-1">
                      {member.role === 'OWNER' && <Crown className="h-3 w-3" />}
                      <span>{member.role === 'OWNER' ? 'Propriétaire' : 'Membre'}</span>
                    </Badge>
                    {member.project && (
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: member.project.color }}
                        ></div>
                        <span className="text-xs text-muted-foreground">{member.project.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Projets</p>
                      <p className="font-semibold">{member.projectsCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tâches</p>
                      <p className="font-semibold">{member.completedTasks}/{member.tasksCount}</p>
                    </div>
                  </div>
                  
                  {member.tasksCount > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{Math.round(completionRate)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-sm">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Aucun membre d'équipe</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Commencez par créer des projets et inviter des collaborateurs pour constituer votre équipe.
            </p>
            <Button className="mt-4">
              <UserPlus className="mr-2 h-4 w-4" />
              Inviter un membre
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
