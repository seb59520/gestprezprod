import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  QrCode, 
  Shield, 
  Book, 
  Bell, 
  Calendar, 
  Users, 
  Building2, 
  FileText, 
  Wrench,
  HelpCircle,
  BookOpen,
  LayoutDashboard,
  Settings,
  AlertTriangle
} from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Centre d'aide</h1>
        <p className="text-gray-600 dark:text-gray-400">Guide complet d'utilisation de Gest'Prez</p>
      </div>

      {/* Guide d'utilisation */}
      <div className="space-y-8">
        {/* Utilisation des QR Codes */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <QrCode className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Utilisation des QR Codes</h2>
          </div>

          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>Chaque présentoir dispose d'un QR code unique permettant un accès rapide aux informations et à la réservation :</p>
            
            <div className="ml-4 space-y-2">
              <p>1. <strong>Scanner le QR Code</strong> : Utilisez l'appareil photo de votre smartphone ou une application de lecture de QR code.</p>
              <p>2. <strong>Accéder aux informations</strong> : Le QR code vous redirige vers la page dédiée du présentoir.</p>
              <p>3. <strong>Vérifier la disponibilité</strong> : Consultez le statut actuel et les périodes de réservation.</p>
              <p>4. <strong>Effectuer une réservation</strong> : Si disponible, réservez directement depuis votre appareil.</p>
            </div>
          </div>
        </section>

        {/* Gestion des présentoirs */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Gestion des présentoirs</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tableau de bord</h3>
              <p className="text-gray-600 dark:text-gray-400">Le tableau de bord offre une vue d'ensemble de vos présentoirs :</p>
              <ul className="ml-6 list-disc text-gray-600 dark:text-gray-400">
                <li>Statut des présentoirs (disponible/réservé)</li>
                <li>Alertes de maintenance</li>
                <li>Niveau des stocks de publications</li>
                <li>Demandes en attente</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Réservations</h3>
              <p className="text-gray-600 dark:text-gray-400">Pour gérer les réservations :</p>
              <ul className="ml-6 list-disc text-gray-600 dark:text-gray-400">
                <li>Vérifiez la disponibilité dans le calendrier</li>
                <li>Définissez la durée de réservation (max. 30 jours)</li>
                <li>Possibilité de prolonger une réservation existante</li>
                <li>Annulation possible à tout moment</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gestion des stocks */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Gestion des stocks</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Publications</h3>
              <p className="text-gray-600 dark:text-gray-400">Gérez efficacement vos stocks de publications :</p>
              <ul className="ml-6 list-disc text-gray-600 dark:text-gray-400">
                <li>Définissez des seuils minimums par publication</li>
                <li>Recevez des alertes de réapprovisionnement</li>
                <li>Suivez les statistiques de consommation</li>
                <li>Gérez les inventaires par présentoir</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prévisions</h3>
              <p className="text-gray-600 dark:text-gray-400">Optimisez votre gestion grâce aux prévisions :</p>
              <ul className="ml-6 list-disc text-gray-600 dark:text-gray-400">
                <li>Analyse des tendances de consommation</li>
                <li>Calcul automatique des points de réapprovisionnement</li>
                <li>Recommandations de stock de sécurité</li>
                <li>Alertes préventives</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Maintenance */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
              <Wrench className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Maintenance</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Types de maintenance</h3>
              <ul className="ml-6 list-disc text-gray-600 dark:text-gray-400">
                <li><strong>Préventive</strong> : Maintenance planifiée régulière</li>
                <li><strong>Curative</strong> : Intervention sur signalement</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Gestion des interventions</h3>
              <ul className="ml-6 list-disc text-gray-600 dark:text-gray-400">
                <li>Planification des maintenances préventives</li>
                <li>Suivi des demandes d'intervention</li>
                <li>Historique des interventions</li>
                <li>Gestion des pièces détachées</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Questions fréquentes</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Comment prolonger une réservation ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accédez aux détails du présentoir et cliquez sur "Prolonger". La prolongation est possible jusqu'à 30 jours maximum.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Que faire en cas de problème technique ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Utilisez le bouton "Signaler un problème" sur la page du présentoir pour créer une demande de maintenance curative.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Comment gérer les stocks de publications ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Définissez des seuils minimums dans les paramètres. Le système vous alertera automatiquement des besoins de réapprovisionnement.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Comment personnaliser l'interface ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accédez aux paramètres pour modifier le thème (clair/sombre), la vue par défaut (galerie/tableau) et les couleurs des statuts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;