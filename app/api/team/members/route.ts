
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id

    // Récupérer les projets où l'utilisateur est propriétaire ou membre
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId: userId } } }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Créer un Set pour éviter les doublons
    const uniqueMembers = new Map<string, any>()

    // Traiter chaque projet
    for (const project of userProjects) {
      // Ajouter le propriétaire
      const ownerId = project.owner.id
      if (!uniqueMembers.has(ownerId)) {
        uniqueMembers.set(ownerId, {
          id: project.owner.id,
          firstName: project.owner.firstName,
          lastName: project.owner.lastName,
          email: project.owner.email,
          role: 'OWNER',
          projects: new Set([project.id]),
          project: {
            name: project.name,
            color: project.color
          }
        })
      } else {
        uniqueMembers.get(ownerId)?.projects.add(project.id)
      }

      // Ajouter les membres
      for (const member of project.members) {
        const memberId = member.user.id
        if (!uniqueMembers.has(memberId)) {
          uniqueMembers.set(memberId, {
            id: member.user.id,
            firstName: member.user.firstName,
            lastName: member.user.lastName,
            email: member.user.email,
            role: 'MEMBER',
            projects: new Set([project.id]),
            project: {
              name: project.name,
              color: project.color
            }
          })
        } else {
          uniqueMembers.get(memberId)?.projects.add(project.id)
        }
      }
    }

    // Récupérer les statistiques de tâches pour chaque membre
    const membersWithStats = await Promise.all(
      Array.from(uniqueMembers.values()).map(async (member) => {
        const projectIds = Array.from(member.projects as Set<string>)
        
        const [totalTasks, completedTasks] = await Promise.all([
          prisma.task.count({
            where: {
              assigneeId: member.id,
              projectId: { in: projectIds }
            }
          }),
          prisma.task.count({
            where: {
              assigneeId: member.id,
              projectId: { in: projectIds },
              status: 'DONE'
            }
          })
        ])

        return {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          role: member.role,
          projectsCount: projectIds.length,
          tasksCount: totalTasks,
          completedTasks: completedTasks,
          project: member.project
        }
      })
    )

    // Trier par nombre de projets puis par nom
    const sortedMembers = membersWithStats.sort((a, b) => {
      if (a.role === 'OWNER' && b.role === 'MEMBER') return -1
      if (a.role === 'MEMBER' && b.role === 'OWNER') return 1
      if (a.projectsCount !== b.projectsCount) return b.projectsCount - a.projectsCount
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
    })

    return NextResponse.json(sortedMembers)
  } catch (error) {
    console.error('Erreur API membres équipe:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
