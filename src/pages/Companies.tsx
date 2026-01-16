import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { companies } from '@/data/technologies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Building2, Users, Briefcase, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const companyDetails: Record<string, {
    fullDescription: string;
    difficulty: "Easy" | "Medium" | "Hard" | "Expert";
    interviewStages: string[];
    topRoles: string[];
    headquarters: string;
}> = {
    amazon: {
        fullDescription: "Known for its 16 Leadership Principles, Amazon's interview process heavily weighs behavioral questions and scalable system design.",
        difficulty: "Hard",
        interviewStages: ["Online Assessment", "Technical Phone Screen", "Virtual Onsite (5-6 rounds)"],
        topRoles: ["SDE I/II/III", "Solutions Architect", "Product Manager"],
        headquarters: "Seattle, WA"
    },
    google: {
        fullDescription: "Google focuses on 'Googleyness' and strong algorithmic problem-solving skills. They look for general cognitive ability and role-related knowledge.",
        difficulty: "Expert",
        interviewStages: ["Recruiter Call", "Technical Phone Screen (1-2)", "Onsite (4-5 rounds)"],
        topRoles: ["Software Engineer", "Site Reliability Engineer", "UX Designer"],
        headquarters: "Mountain View, CA"
    },
    meta: {
        fullDescription: "Meta values speed and impact. Their coding interviews are fast-paced, and system design focuses on product-level scalability.",
        difficulty: "Hard",
        interviewStages: ["Technical Phone Screen", "Onsite (Coding, Design, Behavioral)"],
        topRoles: ["Software Engineer", "Data Engineer", "Product Designer"],
        headquarters: "Menlo Park, CA"
    },
    apple: {
        fullDescription: "Apple interviews are team-specific. They value privacy, craftsmanship, and a deep understanding of their ecosystem.",
        difficulty: "Hard",
        interviewStages: ["Technical Screen", "Team Interviews", "Onsite Presentation"],
        topRoles: ["Hardware Engineer", "Software Engineer", "Product Manager"],
        headquarters: "Cupertino, CA"
    },
    netflix: {
        fullDescription: "Netflix looks for stunning colleagues. Their culture of 'Freedom and Responsibility' is central to their behavioral interviews.",
        difficulty: "Expert",
        interviewStages: ["Technical Screen", "Onsite (Culture & Technical Focus)"],
        topRoles: ["Senior Software Engineer", "Content Analyst", "Data Scientist"],
        headquarters: "Los Gatos, CA"
    },
    microsoft: {
        fullDescription: "Microsoft emphasizes a growth mindset. They look for collaborative problem-solvers who can build software for billions.",
        difficulty: "Medium",
        interviewStages: ["Technical Screen", "Onsite (4-5 rounds)"],
        topRoles: ["Software Engineer", "Program Manager", "Azure Consultant"],
        headquarters: "Redmond, WA"
    }
};

const Companies = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                {/* Page Hero */}
                <section className="relative py-20 overflow-hidden border-b border-border/50 bg-muted/30">
                    <div className="container relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl"
                        >
                            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-6">
                                Explore <span className="gradient-text">Top Companies</span>
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                Master the interview process for the world's leading technology companies.
                                Get insights into their culture, interview stages, and what they look for in candidates.
                            </p>

                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search companies..."
                                    className="pl-10 h-12 bg-background border-border/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Background Decorative Blur */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/4" />
                </section>

                {/* Companies Grid */}
                <section className="py-16 container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCompanies.map((company, index) => {
                            const details = companyDetails[company.id] || {
                                fullDescription: company.description,
                                difficulty: "Medium",
                                interviewStages: ["Initial Screen", "Onsite"],
                                topRoles: ["Software Engineer"],
                                headquarters: "Global"
                            };

                            return (
                                <motion.div
                                    key={company.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full flex flex-col hover-lift border-border/50 group overflow-hidden">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110 ${company.id === 'amazon' ? 'bg-orange-500/10 text-orange-500' :
                                                        company.id === 'google' ? 'bg-blue-500/10 text-blue-500' :
                                                            company.id === 'meta' ? 'bg-blue-600/10 text-blue-600' :
                                                                company.id === 'apple' ? 'bg-gray-500/10 text-gray-700 dark:text-gray-300' :
                                                                    company.id === 'netflix' ? 'bg-red-600/10 text-red-600' :
                                                                        'bg-sky-500/10 text-sky-500'
                                                    }`}>
                                                    {company.name.charAt(0)}
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${details.difficulty === 'Expert' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        details.difficulty === 'Hard' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {details.difficulty}
                                                </div>
                                            </div>
                                            <CardTitle className="text-2xl font-display group-hover:text-primary transition-colors">
                                                {company.name}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-1.5 mt-1">
                                                <Building2 className="h-3.5 w-3.5" />
                                                HQ: {details.headquarters}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 space-y-6">
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {details.fullDescription}
                                            </p>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Users className="h-4 w-4 text-primary" />
                                                    <span>Interview Stages</span>
                                                </div>
                                                <ul className="space-y-1.5">
                                                    {details.interviewStages.map((stage, i) => (
                                                        <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                                            <div className="h-1 w-1 rounded-full bg-border" />
                                                            {stage}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Briefcase className="h-4 w-4 text-primary" />
                                                    <span>Common Roles</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {details.topRoles.map((role, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded bg-muted text-[10px] font-medium uppercase tracking-wider">
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full mt-6"
                                                onClick={() => navigate(`/practice?company=${company.id}`)}
                                            >
                                                Start Prep
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filteredCompanies.length === 0 && (
                        <div className="text-center py-20">
                            <div className="mb-4 text-muted-foreground italic">No companies found matching "{searchQuery}"</div>
                            <Button variant="ghost" onClick={() => setSearchQuery("")}>Clear Search</Button>
                        </div>
                    )}
                </section>

                {/* Bottom CTA */}
                <section className="py-20 bg-primary/5">
                    <div className="container text-center">
                        <h2 className="text-3xl font-display font-bold mb-6">Want personalized practice?</h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Tell us about your target company and role, and our AI will generate
                            a custom interview track just for you.
                        </p>
                        <Button size="lg" onClick={() => navigate('/practice')}>
                            Build My Interview Plan
                            <GraduationCap className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Companies;
