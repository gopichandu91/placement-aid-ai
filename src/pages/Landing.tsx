import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Target, FileText, BarChart3, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Target, title: "Placement Prediction", description: "AI-powered scoring algorithm analyzes your academic profile and predicts placement probability with actionable insights." },
  { icon: FileText, title: "Resume Analyzer", description: "Get ATS compatibility scores, identify missing skills, and receive tailored improvement suggestions for your target role." },
  { icon: BarChart3, title: "Smart Dashboard", description: "Track your progress with interactive charts, prediction history, and personalized career recommendations." },
  { icon: Shield, title: "Secure & Private", description: "Your data is encrypted and protected. Only you can access your predictions and resume analyses." },
  { icon: Zap, title: "Instant Results", description: "Get real-time predictions and analysis within seconds. No waiting, no queues." },
  { icon: Brain, title: "AI Suggestions", description: "Receive personalized improvement roadmaps based on your strengths and weaknesses." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold gradient-text">CareerPredict AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-bg text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] gradient-bg pointer-events-none" />

        <div className="container relative text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
              <Zap className="w-3.5 h-3.5 text-primary" />
              AI-Powered Placement Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6">
              Predict Your
              <span className="gradient-text block">Career Path</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Get placement probability predictions, ATS-optimized resume analysis, and personalized improvement roadmaps — all powered by intelligent algorithms.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gradient-bg text-primary-foreground font-semibold rounded-xl px-8 h-12 hover:opacity-90 transition-opacity">
                  Start Predicting
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 border-border text-foreground hover:bg-secondary">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">A complete placement intelligence toolkit designed for engineering students</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 hover:glow-border transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12 text-center glow-border"
          >
            <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-float" />
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Ready to predict your future?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of engineering students who are taking control of their career journey.</p>
            <Link to="/auth">
              <Button size="lg" className="gradient-bg text-primary-foreground font-semibold rounded-xl px-8 h-12 hover:opacity-90 transition-opacity">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-bg flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-display font-semibold gradient-text">CareerPredict AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CareerPredict AI. Built for engineering students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
