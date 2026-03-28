
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

    // Obtenir les projets où l'utilisateur est impliqué
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

    // Récupérer les tâches récentes
    const recentTasks = await prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      include: {
        project: {
          select: {
            name: true,
            color: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })

    const formattedTasks = recentTasks.map(task => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString() ?? null,
      project: {
        name: task.project.name,
        color: task.project.color
      }
    }))

    return NextResponse.json(formattedTasks)
  } catch (error) {
    console.error('Erreur API tâches récentes:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
