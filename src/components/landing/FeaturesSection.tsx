import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Code, MessageSquare, BarChart3, Target, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Questions',
    description: 'Dynamic questions generated based on your role, level, and technology stack.',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Feedback',
    description: 'Get instant, detailed feedback on your answers with improvement suggestions.',
  },
  {
    icon: Code,
    title: 'Technical & Behavioral',
    description: 'Cover all interview types: coding, system design, behavioral, and domain knowledge.',
  },
  {
    icon: Target,
    title: 'Company-Specific Prep',
    description: 'Tailored practice for Amazon, Google, Meta, Apple, Netflix, and Microsoft.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your improvement with detailed analytics and readiness scores.',
  },
  {
    icon: Zap,
    title: 'Adaptive Learning',
    description: 'Questions adapt to your performance, focusing on areas that need work.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform covers all aspects of technical interview preparation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover-lift bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
