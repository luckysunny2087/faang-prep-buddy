import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Code2,
  Layout as LayoutIcon,
  MessageSquare,
  Users,
  Search,
  Video,
  FileText,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'react-router-dom';
import { useUserResources } from '@/hooks/useUserResources';
import ResourceCard from '@/components/resources/ResourceCard';

const categories = [
  {
    id: 'coding',
    title: 'Coding & Algorithms',
    icon: Code2,
    description: 'Master data structures, algorithms, and problem-solving techniques.',
    resources: [
      { name: 'LeetCode', description: 'The golden standard for coding interview prep.', link: 'https://leetcode.com', type: 'Practice' },
      { name: 'AlgoMonster', description: 'Focuses on pattern-based learning for FAANG.', link: 'https://algomonster.com', type: 'Course' },
      { name: 'NeetCode', description: 'Comprehensive video solutions for popular problems.', link: 'https://neetcode.io', type: 'Video' },
      { name: 'Codeforces', description: 'Competitive programming for advanced algorithmic depth.', link: 'https://codeforces.com', type: 'Platform' }
    ]
  },
  {
    id: 'system-design',
    title: 'System Design',
    icon: LayoutIcon,
    description: 'Learn how to design scalable, distributed systems for millions of users.',
    resources: [
      { name: 'System Design Primer', description: 'Most popular GitHub repo for learning system design.', link: 'https://github.com/donnemartin/system-design-primer', type: 'GitHub' },
      { name: 'ByteByteGo', description: 'Visual and easy-to-digest system design lessons.', link: 'https://bytebytego.com', type: 'Newsletter' },
      { name: 'Grokking the System Design Interview', description: 'The original course that started it all.', link: 'https://www.designgurus.io', type: 'Course' },
      { name: 'High Scalability', description: 'Articles on how real-world companies scale.', link: 'http://highscalability.com', type: 'Blog' }
    ]
  },
  {
    id: 'behavioral',
    title: 'Behavioral & Culture',
    icon: MessageSquare,
    description: 'Win the culture fit and soft skills portion of the interview.',
    resources: [
      { name: 'STAR Method Guide', description: 'How to structure your behavioral answers.', link: 'https://ca.indeed.com/career-advice/interviewing/how-to-use-the-star-method', type: 'Guide' },
      { name: 'Amazon Leadership Principles', description: 'Crucial for any Amazon interview.', link: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles', type: 'Official' },
      { name: 'Tech Interview Handbook', description: 'Excellent behavioral questions and answers.', link: 'https://www.techinterviewhandbook.org/behavioral-interview-questions/', type: 'Book' }
    ]
  },
  {
    id: 'mock-interviews',
    title: 'Mock Interviews',
    icon: Video,
    description: 'Practice with real people to calm your nerves and get feedback.',
    resources: [
      { name: 'Pramp', description: 'Free peer-to-peer technical mock interviews.', link: 'https://www.pramp.com', type: 'Platform' },
      { name: 'Interviewing.io', description: 'Anonymous mocks with engineers from top companies.', link: 'https://interviewing.io', type: 'Platform' },
      { name: 'Exponent', description: 'Specializes in PM and design mock interviews.', link: 'https://www.tryexponent.com', type: 'Prep' }
    ]
  },
  {
    id: 'community',
    title: 'Community & Insights',
    icon: Users,
    description: 'Stay updated with latest trends and connect with other candidates.',
    resources: [
      { name: 'Blind', description: 'Anonymous social network for tech professionals.', link: 'https://www.teamblind.com', type: 'Social' },
      { name: 'Reddit r/cscareerquestions', description: 'Large community for career advice.', link: 'https://www.reddit.com/r/cscareerquestions/', type: 'Reddit' },
      { name: 'LeetCode Discuss', description: 'Find the latest interview experiences for specific companies.', link: 'https://leetcode.com/discuss/', type: 'Forum' }
    ]
  }
];

type StatusFilter = 'all' | 'completed' | 'saved_for_later';

const Resources = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const { getStatus, markCompleted, saveForLater, isLoggedIn } = useUserResources();

  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'completed' || filter === 'saved_for_later') {
      setStatusFilter(filter);
    }
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const filteredCategories = categories
    .map(category => ({
      ...category,
      resources: category.resources.filter(resource => {
        const matchesSearch =
          resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (statusFilter === 'all') return true;
        return getStatus(resource.name) === statusFilter;
      })
    }))
    .filter(category => category.resources.length > 0);

  const filterButtons: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Saved for Later', value: 'saved_for_later' },
  ];

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
                Interview <span className="gradient-text">Resources Hub</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                A curated collection of the best tools, courses, and communities to help you
                land your dream role at top tech companies.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    className="pl-10 h-12 bg-background border-border/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  {filterButtons.map(fb => (
                    <Button
                      key={fb.value}
                      variant={statusFilter === fb.value ? 'default' : 'ghost'}
                      size="sm"
                      className="text-xs h-10"
                      onClick={() => setStatusFilter(fb.value)}
                    >
                      {fb.label}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/4" />
        </section>

        {/* Resources Grid */}
        <section className="py-16 container">
          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-16 last:mb-0">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">{category.title}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.resources.map((resource, resIndex) => (
                  <motion.div
                    key={resource.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: resIndex * 0.05 }}
                  >
                    <ResourceCard
                      resource={resource}
                      category={category.title}
                      status={getStatus(resource.name)}
                      isLoggedIn={isLoggedIn}
                      onMarkCompleted={() => markCompleted({ name: resource.name, category: category.title, link: resource.link })}
                      onSaveForLater={() => saveForLater({ name: resource.name, category: category.title, link: resource.link })}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-20">
              <div className="mb-4 text-muted-foreground italic">No resources found</div>
              <Button variant="ghost" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>Clear Filters</Button>
            </div>
          )}
        </section>

        {/* Contribution CTA */}
        <section className="py-20 border-t border-border/50 bg-muted/20">
          <div className="container text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Know a great resource?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We are always looking to expand our collection. If you have a resource that helped
              you in your interview journey, let us know and we'll add it to the hub.
            </p>
            <Button variant="outline" size="lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Suggest a Resource
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Resources;
