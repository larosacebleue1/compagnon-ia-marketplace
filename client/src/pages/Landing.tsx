import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import {
  Sparkles,
  Brain,
  Shield,
  TrendingUp,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Si l'utilisateur est connecté, rediriger vers l'app
    window.location.href = "/app";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt={APP_TITLE} className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {APP_TITLE}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <a href="#features">Fonctionnalités</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#pricing">Tarifs</a>
            </Button>
            <Button asChild>
              <a href={getLoginUrl()}>Commencer</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">L'IA qui vous élève</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              UNIALIST
            </span>
            <br />
            Votre assistant universel
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            L'IA qui vous éclaire et vous élève. Assistance universelle qui comprend votre métier,
            apprend de vous, et vous propose des solutions meilleures que ce que vous imaginez.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg h-12 px-8" asChild>
              <a href={getLoginUrl()}>
                Essai gratuit 14 jours
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
              <a href="#demo">Voir la démo</a>
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            Sans carte bancaire • Annulation en 1 clic
          </p>
        </div>
      </section>

      {/* Valeurs clés */}
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <Brain className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Apprentissage continu</h3>
            <p className="text-muted-foreground">
              L'IA apprend de chaque interaction et devient de plus en plus pertinente avec le temps.
            </p>
          </Card>
          
          <Card className="p-6 border-accent/20 hover:border-accent/40 transition-colors">
            <Shield className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sécurité totale</h3>
            <p className="text-muted-foreground">
              Vos données sont chiffrées, hébergées en Europe, et vous gardez le contrôle absolu.
            </p>
          </Card>
          
          <Card className="p-6 border-secondary/20 hover:border-secondary/40 transition-colors">
            <TrendingUp className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Amélioration mesurable</h3>
            <p className="text-muted-foreground">
              Suivez votre progression : temps gagné, argent économisé, productivité accrue.
            </p>
          </Card>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="features" className="container py-24 bg-secondary/5 rounded-3xl my-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl">Comment ça marche ?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            En 3 étapes simples, votre IA devient votre meilleur allié professionnel
          </p>
        </div>
        
        <div className="grid gap-12 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Vous vous présentez</h3>
            <p className="text-muted-foreground">
              Dites à l'IA votre métier, vos défis, vos objectifs. Une conversation naturelle, rien de plus.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">L'IA apprend de vous</h3>
            <p className="text-muted-foreground">
              À chaque interaction, elle comprend mieux vos habitudes, vos préférences, votre façon de travailler.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Elle vous élève</h3>
            <p className="text-muted-foreground">
              L'IA anticipe vos besoins, propose des améliorations, et vous fait gagner un temps précieux.
            </p>
          </div>
        </div>
      </section>

      {/* Fonctionnalités principales */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl">
            Plus qu'un chatbot, un véritable{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              compagnon intelligent
            </span>
          </h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Actions automatisées",
              description: "Génération de factures, devis, emails... L'IA fait le travail répétitif pour vous.",
            },
            {
              icon: Brain,
              title: "Suggestions intelligentes",
              description: "L'IA analyse vos patterns et propose des optimisations que vous n'auriez pas vues.",
            },
            {
              icon: Users,
              title: "Adapté à votre métier",
              description: "Mécanicien, entrepreneur, développeur... L'IA parle votre langage professionnel.",
            },
            {
              icon: Shield,
              title: "Permissions granulaires",
              description: "Vous décidez exactement ce que l'IA peut faire. Suspension en 1 clic.",
            },
            {
              icon: TrendingUp,
              title: "Évolution continue",
              description: "Plus vous l'utilisez, plus elle devient pertinente et efficace.",
            },
            {
              icon: CheckCircle2,
              title: "Résultats mesurables",
              description: "Dashboard complet : temps gagné, argent économisé, tâches automatisées.",
            },
          ].map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="container py-24 bg-muted/30 rounded-3xl my-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl">Ils ont déjà franchi le pas</h2>
          <p className="text-muted-foreground text-lg">Des professionnels comme vous, qui ont choisi de s'élever</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              name: "Marc D.",
              role: "Mécanicien",
              content: "J'ai gagné 15h par semaine en automatisant mes factures et commandes. L'IA connaît mes tarifs mieux que moi !",
              rating: 5,
            },
            {
              name: "Sophie L.",
              role: "Entrepreneur",
              content: "Mon CA a augmenté de 30% grâce aux suggestions de l'IA. Elle m'a fait voir des opportunités que je ne voyais pas.",
              rating: 5,
            },
            {
              name: "Thomas R.",
              role: "Développeur",
              content: "Le code review automatique et les suggestions d'optimisation m'ont fait progresser énormément. Un vrai mentor IA.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Tarification */}
      <section id="pricing" className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl">Tarification simple et transparente</h2>
          <p className="text-muted-foreground text-lg">Choisissez le plan qui vous convient</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Basic */}
          <Card className="p-8 border-2">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">9.99€</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">50 messages/jour</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">1 profil métier</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Fonctions de base</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full" asChild>
              <a href={getLoginUrl()}>Commencer</a>
            </Button>
          </Card>

          {/* Premium */}
          <Card className="p-8 border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
              Populaire
            </div>
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">29.99€</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Messages illimités</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Tous les profils métiers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Personnalisation avancée</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Actions automatisées</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Support prioritaire</span>
              </li>
            </ul>
            <Button className="w-full" asChild>
              <a href={getLoginUrl()}>Commencer</a>
            </Button>
          </Card>

          {/* Enterprise */}
          <Card className="p-8 border-2">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">Sur mesure</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Tout Premium +</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Équipes illimitées</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Profils personnalisés</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Intégrations sur mesure</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Support dédié</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full" asChild>
              <a href="mailto:contact@example.com">Nous contacter</a>
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container py-24">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-primary/20">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl">
            Prêt à vous élever ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez les professionnels qui ont choisi de gagner du temps, d'augmenter leur productivité,
            et de se concentrer sur ce qui compte vraiment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg h-12 px-8" asChild>
              <a href={getLoginUrl()}>
                Essai gratuit 14 jours
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            ✓ Sans carte bancaire ✓ Annulation en 1 clic ✓ Support français
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-6 w-6" />}
                <span className="font-bold">{APP_TITLE}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                L'IA qui vous élève et vous rend meilleur.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a></li>
                <li><a href="#demo" className="hover:text-foreground transition-colors">Démo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">RGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 {APP_TITLE}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

