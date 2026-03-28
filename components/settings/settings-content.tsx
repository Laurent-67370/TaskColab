
'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Trash2
} from 'lucide-react'

export function SettingsContent() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez votre compte et vos préférences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profil utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profil utilisateur</span>
            </CardTitle>
            <CardDescription>
              Gérez vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl">
                  {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Changer l'avatar
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, GIF ou PNG. 1MB maximum.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  defaultValue={session?.user?.firstName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  defaultValue={session?.user?.lastName}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={session?.user?.email}
              />
            </div>
            
            <Button>
              Sauvegarder les modifications
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Choisissez comment vous souhaitez être notifié
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nouvelles tâches assignées</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir une notification quand une tâche vous est assignée
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Échéances proches</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications pour les tâches avec échéance dans 24h
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Invitations aux projets</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications lors d'invitations à de nouveaux projets
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tâches terminées</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications quand des tâches de vos projets sont terminées
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Apparence</span>
            </CardTitle>
            <CardDescription>
              Personnalisez l'interface de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Clair
                </Button>
                <Button variant="outline" size="sm">
                  Sombre
                </Button>
                <Button variant="outline" size="sm">
                  Automatique
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Langue</Label>
              <div className="flex space-x-2">
                <Button variant="default" size="sm">
                  Français
                </Button>
                <Button variant="outline" size="sm">
                  English
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Sécurité</span>
            </CardTitle>
            <CardDescription>
              Gérez la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>
            
            <Button>
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* Zone de danger */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              <span>Zone de danger</span>
            </CardTitle>
            <CardDescription>
              Actions irréversibles concernant votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-lg">
              <h4 className="font-medium text-destructive mb-2">
                Supprimer le compte
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Une fois supprimé, votre compte ne peut pas être récupéré. Toutes vos données seront définitivement supprimées.
              </p>
              <Button variant="destructive" size="sm">
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
