
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

    // Obtenir les projets où l'utilisateur est propriétaire ou membre
    const userProjectIds = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId: userId } } }
        ]
      },
      select: { id: true }
    })

    const projectIds = userProjectIds.map(p => p.id)

    // Statistiques parallèles
    const [
      totalProjects,
      totalTasks,
      completedTasks,
      upcomingDeadlines
    ] = await Promise.all([
      prisma.project.count({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId: userId } } }
          ]
        }
      }),
      prisma.task.count({
        where: { projectId: { in: projectIds } }
      }),
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
          status: 'DONE'
        }
      }),
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
          status: { not: 'DONE' },
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
          }
        }
      })
    ])

    const pendingTasks = totalTasks - completedTasks

    return NextResponse.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      upcomingDeadlines
    })
  } catch (error) {
    console.error('Erreur API stats dashboard:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
