
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

    // Récupérer les projets récents avec statistiques
    const recentProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId: userId } } }
        ]
      },
      include: {
        _count: {
          select: {
            tasks: true,
            members: true
          }
        },
        tasks: {
          where: { status: 'DONE' },
          select: { id: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })

    const formattedProjects = recentProjects.map(project => ({
      id: project.id,
      name: project.name,
      color: project.color,
      tasksCount: project._count.tasks,
      completedTasks: project.tasks.length,
      membersCount: project._count.members + 1 // +1 pour le propriétaire
    }))

    return NextResponse.json(formattedProjects)
  } catch (error) {
    console.error('Erreur API projets récents:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
