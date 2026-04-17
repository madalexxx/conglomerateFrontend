import { motion } from "framer-motion";
import {
  Radio,
  Zap,
  Shield,
  Code,
  Globe,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "Decentralized Messaging",
    description:
      "Distributed network architecture ensures your communications bypass traditional infrastructure limitations.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Ultra-Low Latency",
    description:
      "Sub-millisecond message routing optimized for time-critical communications worldwide.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Lock,
    title: "Military-Grade Encryption",
    description:
      "End-to-end encryption with zero-knowledge architecture and quantum-resistant algorithms.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Code,
    title: "Universal Integration",
    description:
      "Seamless APIs and webhooks compatible with any platform, protocol, or legacy system.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Mesh network spanning multiple continents with automatic failover and redundancy.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Enterprise Reliability",
    description:
      "99.99% uptime SLA with dedicated infrastructure and 24/7 operations monitoring.",
    gradient: "from-pink-500 to-rose-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              connect securely
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Powerful features designed to help you build secure, reliable communications infrastructure
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="group relative p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
