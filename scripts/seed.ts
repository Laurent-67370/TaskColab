
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // Nettoyer les données existantes
  await prisma.notification.deleteMany()
  await prisma.task.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Données existantes supprimées')

  // Créer le compte test (obligatoire et caché de l'utilisateur)
  const hashedTestPassword = await bcrypt.hash('johndoe123', 12)
  const testUser = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe', 
      email: 'john@doe.com',
      password: hashedTestPassword
    }
  })

  // Créer des utilisateurs exemple
  const hashedPassword1 = await bcrypt.hash('password123', 12)
  const hashedPassword2 = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Martin',
      email: 'alice@exemple.fr',
      password: hashedPassword1
    }
  })

  const user2 = await prisma.user.create({
    data: {
      firstName: 'Bob',
      lastName: 'Dupont',
      email: 'bob@exemple.fr',
      password: hashedPassword2
    }
  })

  console.log('👥 Utilisateurs créés')

  // Créer des projets exemples
  const projet1 = await prisma.project.create({
    data: {
      name: 'Site Web Entreprise',
      description: 'Refonte complète du site web de l\'entreprise',
      color: '#3B82F6',
      ownerId: testUser.id
    }
  })

  const projet2 = await prisma.project.create({
    data: {
      name: 'Application Mobile',
      description: 'Développement d\'une application mobile iOS et Android',
      color: '#10B981',
      ownerId: user1.id
    }
  })

  const projet3 = await prisma.project.create({
    data: {
      name: 'API Backend',
      description: 'Construction de l\'API REST pour les applications clients',
      color: '#F59E0B',
      ownerId: user2.id
    }
  })

  console.log('📁 Projets créés')

  // Ajouter des membres aux projets
  await prisma.projectMember.createMany({
    data: [
      { userId: user1.id, projectId: projet1.id, role: 'MEMBER' as const },
      { userId: user2.id, projectId: projet1.id, role: 'MEMBER' as const },
      { userId: testUser.id, projectId: projet2.id, role: 'MEMBER' as const },
      { userId: user2.id, projectId: projet2.id, role: 'MEMBER' as const },
      { userId: testUser.id, projectId: projet3.id, role: 'MEMBER' as const },
      { userId: user1.id, projectId: projet3.id, role: 'MEMBER' as const }
    ]
  })

  console.log('👥 Membres ajoutés aux projets')

  // Créer des tâches d'exemple
  const tasks = [
    // Projet 1 - Site Web
    {
      title: 'Conception de la maquette',
      description: 'Créer les maquettes des principales pages du site',
      status: 'DONE' as const,
      priority: 'HIGH' as const,
      projectId: projet1.id,
      createdById: testUser.id,
      assigneeId: user1.id,
      dueDate: new Date('2025-01-15')
    },
    {
      title: 'Développement Frontend',
      description: 'Intégrer les maquettes en HTML/CSS/JS',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      projectId: projet1.id,
      createdById: testUser.id,
      assigneeId: user2.id,
      dueDate: new Date('2025-02-01')
    },
    {
      title: 'Configuration du CMS',
      description: 'Configurer et personnaliser le système de gestion de contenu',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      projectId: projet1.id,
      createdById: testUser.id,
      assigneeId: null,
      dueDate: new Date('2025-02-15')
    },
    
    // Projet 2 - App Mobile
    {
      title: 'Architecture de l\'app',
      description: 'Définir l\'architecture technique et les choix technologiques',
      status: 'DONE' as const,
      priority: 'HIGH' as const,
      projectId: projet2.id,
      createdById: user1.id,
      assigneeId: testUser.id
    },
    {
      title: 'Interface utilisateur',
      description: 'Concevoir l\'interface et l\'expérience utilisateur',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      projectId: projet2.id,
      createdById: user1.id,
      assigneeId: user2.id,
      dueDate: new Date('2025-01-30')
    },
    
    // Projet 3 - API Backend
    {
      title: 'Modélisation de la base de données',
      description: 'Concevoir le schéma de base de données',
      status: 'DONE' as const,
      priority: 'HIGH' as const,
      projectId: projet3.id,
      createdById: user2.id,
      assigneeId: testUser.id
    },
    {
      title: 'Authentification',
      description: 'Implémenter le système d\'authentification JWT',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      projectId: projet3.id,
      createdById: user2.id,
      assigneeId: user1.id,
      dueDate: new Date('2025-01-25')
    },
    {
      title: 'API CRUD utilisateurs',
      description: 'Développer les endpoints CRUD pour les utilisateurs',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      projectId: projet3.id,
      createdById: user2.id,
      assigneeId: null,
      dueDate: new Date('2025-02-05')
    }
  ]

  await prisma.task.createMany({
    data: tasks
  })

  console.log('✅ Tâches créées')

  // Créer quelques notifications d'exemple
  await prisma.notification.createMany({
    data: [
      {
        type: 'TASK_ASSIGNED' as const,
        title: 'Nouvelle tâche assignée',
        message: 'Vous avez été assigné à "Développement Frontend"',
        userId: user2.id,
        isRead: false
      },
      {
        type: 'TASK_DUE_SOON' as const,
        title: 'Échéance proche',
        message: 'La tâche "Interface utilisateur" est due dans 2 jours',
        userId: user2.id,
        isRead: false
      },
      {
        type: 'TASK_COMPLETED' as const,
        title: 'Tâche terminée',
        message: 'Alice Martin a terminé "Conception de la maquette"',
        userId: testUser.id,
        isRead: true
      }
    ]
  })

  console.log('🔔 Notifications créées')
  console.log('🎉 Seed terminé avec succès!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
