
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

    // Récupérer les projets où l'utilisateur est propriétaire
    const ownedProjects = await prisma.project.findMany({
      where: { ownerId: userId },
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
      orderBy: { updatedAt: 'desc' }
    })

    // Récupérer les projets où l'utilisateur est membre
    const memberProjects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId: userId }
        }
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
      orderBy: { updatedAt: 'desc' }
    })

    // Formater les projets avec le rôle de l'utilisateur
    const formattedOwnedProjects = ownedProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      role: 'OWNER' as const,
      tasksCount: project._count.tasks,
      completedTasks: project.tasks.length,
      membersCount: project._count.members + 1, // +1 pour le propriétaire
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    }))

    const formattedMemberProjects = memberProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      role: 'MEMBER' as const,
      tasksCount: project._count.tasks,
      completedTasks: project.tasks.length,
      membersCount: project._count.members + 1, // +1 pour le propriétaire
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    }))

    // Combiner et trier par date de mise à jour
    const allProjects = [...formattedOwnedProjects, ...formattedMemberProjects]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return NextResponse.json(allProjects)
  } catch (error) {
    console.error('Erreur API projets:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
