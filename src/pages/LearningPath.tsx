import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, Sparkles, Loader2, ChevronRight, BookOpen, Target, GraduationCap, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PathStage {
    title: string;
    description: string;
    topics: string[];
}

interface LearningPathData {
    title: string;
    description: string;
    stages: PathStage[];
}

const LearningPath = () => {
    const [expertiseLevel, setExpertiseLevel] = useState("");
    const [learningFocus, setLearningFocus] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [targetCompany, setTargetCompany] = useState("");
    const [timeline, setTimeline] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pathData, setPathData] = useState<LearningPathData | null>(null);

    const generatePath = async () => {
        if (!expertiseLevel || !learningFocus) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('interview-ai', {
                body: {
                    action: 'generate-learning-path',
                    context: {
                        expertiseLevel,
                        learningFocus,
                        targetRole,
                        targetCompany,
                        timeline
                    }
                }
            });

            if (error) throw error;

            if (data.error) {
                toast.error(data.error);
                return;
            }

            setPathData(data);
            toast.success("Personalized path generated!");
        } catch (error) {
            console.error("Error generating path:", error);
            toast.error("Failed to generate learning path. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!pathData) return;

        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(22);
        doc.setTextColor(33, 33, 33);
        doc.text(pathData.title, 14, 22);

        // Add Description
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        const splitDescription = doc.splitTextToSize(pathData.description, 180);
        doc.text(splitDescription, 14, 32);

        // Add Stages
        const tableData = pathData.stages.map((stage, index) => [
            `Stage ${index + 1}: ${stage.title}`,
            stage.description,
            stage.topics.join(", ")
        ]);

        autoTable(doc, {
            startY: 45 + (splitDescription.length * 5),
            head: [['Stage', 'Description', 'Core Topics']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [63, 81, 181] },
            styles: { fontSize: 10, cellPadding: 5 },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 80 },
                2: { cellWidth: 50 },
            }
        });

        doc.save(`${pathData.title.replace(/\s+/g, '_')}_Roadmap.pdf`);
        toast.success("PDF roadmap downloaded!");
    };

    return (
        <Layout>
            <div className="min-h-screen bg-background py-16">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                                AI <span className="gradient-text">Learning Path</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Tell us your current expertise and what you want to master.
                                Our AI will craft a personalized roadmap to help you land your dream tech role.
                            </p>
                        </motion.div>
                    </div>

                    {!pathData ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl mx-auto"
                        >
                            <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle>Path Preferences</CardTitle>
                                    <CardDescription>Customize your learning journey</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="level" className="text-sm font-medium">Expertise Level</Label>
                                        <Select onValueChange={setExpertiseLevel} value={expertiseLevel}>
                                            <SelectTrigger id="level">
                                                <SelectValue placeholder="Select your current level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Junior (0-2 years)">Junior (0-2 years)</SelectItem>
                                                <SelectItem value="Mid-Level (2-5 years)">Mid-Level (2-5 years)</SelectItem>
                                                <SelectItem value="Senior (5+ years)">Senior (5+ years)</SelectItem>
                                                <SelectItem value="Staff/Principal">Staff/Principal</SelectItem>
                                                <SelectItem value="Switching Careers">Switching Careers</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="focus" className="text-sm font-medium">Learning Focus</Label>
                                        <Input
                                            id="focus"
                                            placeholder="e.g., System Design, React Native, Distributed Systems"
                                            value={learningFocus}
                                            onChange={(e) => setLearningFocus(e.target.value)}
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="role" className="text-sm font-medium">Target Role (Optional)</Label>
                                            <Input
                                                id="role"
                                                placeholder="e.g., Frontend Engineer"
                                                value={targetRole}
                                                onChange={(e) => setTargetRole(e.target.value)}
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company" className="text-sm font-medium">Target Company (Optional)</Label>
                                            <Input
                                                id="company"
                                                placeholder="e.g., Google"
                                                value={targetCompany}
                                                onChange={(e) => setTargetCompany(e.target.value)}
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="timeline" className="text-sm font-medium">Preparation Timeline</Label>
                                        <Select onValueChange={setTimeline} value={timeline}>
                                            <SelectTrigger id="timeline">
                                                <SelectValue placeholder="How much time do you have?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2 weeks (Crash Course)">2 weeks (Crash Course)</SelectItem>
                                                <SelectItem value="1 Month (Standard Prep)">1 Month (Standard Prep)</SelectItem>
                                                <SelectItem value="3 Months (Deep Dive)">3 Months (Deep Dive)</SelectItem>
                                                <SelectItem value="Self-Paced">Self-Paced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full h-12 text-lg font-semibold group"
                                        onClick={generatePath}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Analyzing with AI...
                                            </>
                                        ) : (
                                            <>
                                                Generate Roadmap
                                                <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center bg-muted/30 p-6 rounded-2xl border border-border/50">
                                <div>
                                    <h2 className="text-2xl font-bold font-display mb-2">{pathData.title}</h2>
                                    <p className="text-muted-foreground">{pathData.description}</p>
                                </div>
                                <Button variant="outline" onClick={() => setPathData(null)}>
                                    Generate New Path
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pathData && pathData.stages && Array.isArray(pathData.stages) && pathData.stages.map((stage, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="h-full border-border/50 hover-lift relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <span className="text-6xl font-bold">{index + 1}</span>
                                            </div>
                                            <CardHeader>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        <BookOpen className="h-4 w-4" />
                                                    </div>
                                                    <CardTitle className="text-lg">Stage {index + 1}: {stage.title}</CardTitle>
                                                </div>
                                                <CardDescription>{stage.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        <Target className="h-3 w-3" />
                                                        Core Topics
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {stage.topics.map((topic, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-muted rounded text-xs font-medium border border-border/50"
                                                            >
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-4 mt-auto">
                                                <Button variant="ghost" className="w-full text-xs h-8 justify-between hover:bg-primary/5 hover:text-primary">
                                                    Explore Resources
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 text-center">
                                <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Ready to start practicing?</h3>
                                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                    Take the first step in your learning path by starting a simulated AI interview
                                    for the topics you've just discovered.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button size="lg" onClick={() => window.location.href = '/practice'}>Start AI Interview</Button>
                                    <Button size="lg" variant="outline" onClick={downloadPDF}>
                                        <Download className="mr-2 h-5 w-5" />
                                        Save Path as PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default LearningPath;
