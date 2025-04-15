import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { Play, Rocket, Users, CheckCircle, Star, ChevronRight, Github, Linkedin } from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';
import { FeatureCard } from '../components/features/FeatureCard';
import { features } from '../data/features';
import { Navigation } from '../components/layout/Navigation';

export const Home: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background overflow-x-hidden">
      <div className="floating-grid" />
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-5xl lg:text-6xl font-montserrat font-bold leading-tight text-glow">
                <TypeAnimation
                  sequence={[
                    'Sprint smarter.',
                    1000,
                    'Move faster.',
                    1000,
                    'Deliver better.',
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="gradient-text"
                />
              </h1>
              <p className="text-xl text-text-secondary dark:text-dark-text-secondary">
                AI-powered micro tracking, workload balance, and risk predictions — all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <MagneticButton>
                  <button className="btn-primary card-shine">
                    <Rocket className="w-5 h-5" />
                    Get Started Free
                  </button>
                </MagneticButton>
                <MagneticButton>
                  <button className="btn-secondary">
                    <Play className="w-5 h-5" />
                    Watch 60s Demo
                  </button>
                </MagneticButton>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                perspective={1000}
                scale={1.02}
                transitionSpeed={2000}
                className="will-change-transform"
              >
                <div className="aspect-video rounded-xl glassmorphism shadow-2xl overflow-hidden animate-float card-shine">
                  <img
                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                    alt="Sprint Planning Dashboard"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Tilt>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={ref} className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl font-montserrat font-bold text-center mb-16 gradient-text"
          >
            Powerful Features for Modern Teams
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-[300px]"
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users />, stat: "10,000+", label: "Active Teams" },
              { icon: <CheckCircle />, stat: "1M+", label: "Tasks Completed" },
              { icon: <Star />, stat: "99.9%", label: "Satisfaction Rate" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-block text-primary dark:text-dark-primary mb-4 pulse-effect">
                  {item.icon}
                </div>
                <div className="text-4xl font-bold mb-2 gradient-text">{item.stat}</div>
                <div className="text-text-secondary dark:text-dark-text-secondary">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="diagonal-section">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-montserrat font-bold mb-8">
            You don't need another Kanban board.<br />You need control.
          </h2>
          <MagneticButton>
            <button className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white card-shine">
              Create Your First Sprint — It's Free
              <ChevronRight className="w-5 h-5" />
            </button>
          </MagneticButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card dark:bg-dark-card py-16 px-4 neon-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Rocket className="w-6 h-6 text-primary dark:text-dark-primary" />
                <span className="ml-2 font-montserrat font-bold">SprintMaster</span>
              </div>
              <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
                Made for agile teams, built for flow.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Integrations", "Pricing", "Changelog"]
              },
              {
                title: "Company",
                links: ["About", "Careers", "Blog", "Contact"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "API", "Status"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-montserrat font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};