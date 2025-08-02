import { createFileRoute, Link } from "@tanstack/react-router";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Network, Clock, Puzzle, Github } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

export function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Whitelist signup:", formData);
    setIsModalOpen(false);
    // Reset form
    setFormData({ name: "", email: "", projectType: "" });
  };

  const features = [
    {
      icon: Network,
      title: "Dialogue Editor",
      description:
        "A node-based dialogue tree editor, for example for story-driven games with branching narrative.",
    },
    {
      icon: Clock,
      title: "Global Timeline",
      description:
        "A visual description of the relationships between different events and stories in your world.",
    },
    {
      icon: Puzzle,
      title: "Modular Workspace",
      description:
        "Customize your workspace to match your personal workflow. Describe complex relationships with data tables.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-dot-white/[0.2] bg-dot-black/[0.2] dark:bg-dot-white/[0.2]" />
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Cursor Follower */}
      <div
        className="fixed w-6 h-6 bg-primary/20 rounded-full pointer-events-none z-50 transition-all duration-150 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            {/*<Badge variant="secondary" className="mb-6">
              <Palette className="w-4 h-4 mr-2" />
              World Building Platform
            </Badge>*/}

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              StoryBread
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              A web-based environment for creating and managing your worlds.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-transparent"
              >
                <a
                  href="https://github.com/peque-studio/storybread"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 w-5 h-5" />
                  Source Code
                </a>
              </Button>

              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
              >
                Join Beta Waitlist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-transparent"
              >
                <Link to="/editor">Try Demo</Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="text-center">
                  <feature.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Baked in <span className="font-medium">Peque Studio</span>
            </p>
          </div>
        </div>
      </div>

      {/* Whitelist Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Join the Beta Waitlist
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">
                What type of world are you building?
              </Label>
              <Textarea
                id="project"
                placeholder="Tell us about your project (game, story, campaign, etc.)"
                value={formData.projectType}
                onChange={(e) =>
                  setFormData({ ...formData, projectType: e.target.value })
                }
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              Join Waitlist
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
