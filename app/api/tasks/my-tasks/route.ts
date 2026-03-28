
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

    // Récupérer toutes les tâches assignées à l'utilisateur
    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId
      },
      include: {
        project: {
          select: {
            name: true,
            color: true
          }
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // Trier par statut (TODO, IN_PROGRESS, DONE)
        { priority: 'desc' }, // Puis par priorité (HIGH, MEDIUM, LOW)
        { dueDate: 'asc' }, // Puis par date d'échéance
        { createdAt: 'desc' } // Enfin par date de création
      ]
    })

    // Formater les tâches pour l'interface
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString() ?? null,
      createdAt: task.createdAt.toISOString(),
      project: {
        name: task.project.name,
        color: task.project.color
      },
      createdBy: {
        firstName: task.createdBy.firstName,
        lastName: task.createdBy.lastName
      }
    }))

    return NextResponse.json(formattedTasks)
  } catch (error) {
    console.error('Erreur API mes tâches:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
