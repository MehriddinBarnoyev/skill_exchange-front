"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";


export default function Home() {



  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-foreground text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Share your skills, learn something new!
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Connect with others, exchange knowledge, and grow together.
            </p>
            
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Sign up",
                icon: Users,
                description: "Create your account",
              },
              {
                title: "Add your skills",
                icon: BookOpen,
                description: "List what you can teach",
              },
              {
                title: "Match with others",
                icon: Zap,
                description: "Find people with complementary skills",
              },
              {
                title: "Exchange & grow",
                icon: ArrowRight,
                description: "Learn and teach in return",
              },
            ].map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <step.icon className="h-6 w-6" />
                    <span>
                      Step {index + 1}: {step.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            Popular Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Programming",
              "Cooking",
              "Photography",
              "Language Learning",
              "Graphic Design",
              "Music",
              "Fitness",
              "Writing",
            ].map((skill) => (
              <Button key={skill} variant="outline" className="text-lg">
                {skill}
              </Button>
            ))}
          </div>
        </div>
      </section>

     

      {/* User Reviews Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alice Johnson",
                skill: "Photography",
                review:
                  "I've learned so much about photography in just a few weeks!",
              },
              {
                name: "Bob Smith",
                skill: "Cooking",
                review:
                  "Teaching others has made me a better cook. Highly recommend!",
              },
              {
                name: "Carol Davis",
                skill: "Programming",
                review:
                  "Found a great mentor who helped me land my first dev job!",
              },
            ].map((review, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{review.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Learned: {review.skill}
                  </p>
                  <p>&ldquo;{review.review}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
