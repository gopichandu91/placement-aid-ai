import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { motion } from "framer-motion";
import { TrendingUp, FileText, Target, Brain } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";

const COLORS = ["hsl(190, 95%, 50%)", "hsl(260, 70%, 60%)", "hsl(150, 70%, 45%)", "hsl(38, 92%, 55%)"];

const Dashboard = () => {
  const { user } = useAuth();

  const { data: predictions } = useQuery({
    queryKey: ["predictions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prediction_history")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: resumes } = useQuery({
    queryKey: ["resumes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume_analysis")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const latestPrediction = predictions?.[0];
  const latestResume = resumes?.[0];

  const classificationData = predictions
    ? [
        { name: "High", value: predictions.filter((p) => p.classification === "High").length },
        { name: "Medium", value: predictions.filter((p) => p.classification === "Medium").length },
        { name: "Low", value: predictions.filter((p) => p.classification === "Low").length },
      ].filter((d) => d.value > 0)
    : [];

  const recentPredictions = (predictions || []).slice(0, 5).map((p) => ({
    name: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    probability: p.probability,
  }));

  const stats = [
    { label: "Predictions Made", value: predictions?.length || 0, icon: Target, color: "text-primary" },
    { label: "Resume Analyses", value: resumes?.length || 0, icon: FileText, color: "text-accent" },
    { label: "Latest Score", value: latestPrediction ? `${latestPrediction.probability}%` : "—", icon: TrendingUp, color: "text-success" },
    { label: "ATS Score", value: latestResume ? `${latestResume.ats_score}%` : "—", icon: Brain, color: "text-warning" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your placement readiness</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {recentPredictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-lg font-display font-semibold text-foreground mb-4">Recent Predictions</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={recentPredictions}>
                  <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(210, 20%, 92%)" }}
                  />
                  <Bar dataKey="probability" fill="hsl(190, 95%, 50%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {classificationData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-lg font-display font-semibold text-foreground mb-4">Classification Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={classificationData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {classificationData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {classificationData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Empty state */}
        {(!predictions || predictions.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-12 text-center"
          >
            <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">No predictions yet</h3>
            <p className="text-muted-foreground mb-6">Start by making your first placement prediction</p>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <Target className="w-4 h-4" />
              Make Prediction
            </Link>
          </motion.div>
        )}

        {/* Suggestions from latest prediction */}
        {latestPrediction?.suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Latest Recommendations</h3>
            <ul className="space-y-3">
              {(latestPrediction.suggestions as string[]).map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
