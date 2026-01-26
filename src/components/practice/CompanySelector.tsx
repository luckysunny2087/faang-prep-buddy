import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/types/interview';
import { 
  featuredCompanies, 
  companyCategoryLabels, 
  CompanyCategory,
  CompanyInfo,
  searchCompanies 
} from '@/data/technologies';
import { Building2, Search, X, Check, Globe, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanySelectorProps {
  selectedCompany: Company | null;
  onSelect: (company: Company | null) => void;
}

// FAANG companies to show as featured chips
const faangCompanyIds = ['amazon', 'google', 'meta', 'apple', 'netflix', 'microsoft'];

interface DatabaseCompany {
  id: string;
  name: string;
  category: string;
  description: string | null;
  interview_focus: string | null;
}

export function CompanySelector({ selectedCompany, onSelect }: CompanySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CompanyCategory | 'all'>('all');
  const [customCompany, setCustomCompany] = useState('');
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [databaseCompanies, setDatabaseCompanies] = useState<DatabaseCompany[]>([]);

  // Fetch user-added companies from database
  useEffect(() => {
    const fetchDatabaseCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, category, description, interview_focus')
        .order('name');
      
      if (error) {
        console.error('Error fetching companies:', error);
      } else if (data) {
        setDatabaseCompanies(data);
      }
    };

    fetchDatabaseCompanies();
  }, []);

  // Merge static companies with database companies
  const allCompanies = useMemo(() => {
    const staticCompanyNames = new Set(featuredCompanies.map(c => c.name.toLowerCase()));
    
    // Convert database companies to CompanyInfo format, excluding duplicates
    const dbCompaniesAsInfo: CompanyInfo[] = databaseCompanies
      .filter(c => !staticCompanyNames.has(c.name.toLowerCase()))
      .map(c => ({
        id: c.name.toLowerCase().replace(/\s+/g, '-'),
        name: c.name,
        category: (c.category as CompanyCategory) || 'enterprise',
        description: c.description || 'User-added company',
        interviewFocus: c.interview_focus || undefined,
      }));
    
    return [...featuredCompanies, ...dbCompaniesAsInfo];
  }, [databaseCompanies]);

  // Get FAANG companies for quick selection
  const faangCompanies = useMemo(() => 
    featuredCompanies.filter(c => faangCompanyIds.includes(c.id)),
    []
  );

  // Filter companies based on search and category
  const filteredCompanies = useMemo(() => {
    let companies = searchQuery 
      ? allCompanies.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allCompanies;
    
    if (activeCategory !== 'all') {
      companies = companies.filter(c => c.category === activeCategory);
    }
    
    return companies;
  }, [searchQuery, activeCategory, allCompanies]);

  // Group companies by category for display
  const companiesByCategory = useMemo(() => {
    const grouped: Record<CompanyCategory, CompanyInfo[]> = {
      'big-tech': [],
      'consulting': [],
      'finance': [],
      'indian-it': [],
      'enterprise': [],
      'retail': [],
      'automotive': [],
      'healthcare': [],
    };
    
    filteredCompanies.forEach(company => {
      if (grouped[company.category]) {
        grouped[company.category].push(company);
      }
    });
    
    return grouped;
  }, [filteredCompanies]);

  // Check if selected company is a known company
  const selectedCompanyInfo = useMemo(() => 
    selectedCompany ? allCompanies.find(c => c.id === selectedCompany || c.name === selectedCompany) : null,
    [selectedCompany, allCompanies]
  );

  const handleSelectCompany = (companyId: string) => {
    onSelect(companyId);
    setOpen(false);
    setSearchQuery('');
  };

  // Add new company to database
  const handleAddCustomCompany = async (companyName: string) => {
    if (!companyName.trim()) return;

    setIsAddingCompany(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: companyName.trim(),
          category: 'enterprise',
          description: 'Community-added company',
          added_by: user?.id || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Duplicate - company already exists, just select it
          toast.info('Company already exists in the database');
        } else {
          throw error;
        }
      } else {
        // Add to local state
        setDatabaseCompanies(prev => [...prev, data]);
        toast.success(`"${companyName}" added to company database!`);
      }

      // Select the company
      handleSelectCompany(companyName.trim());
    } catch (err: any) {
      console.error('Error adding company:', err);
      toast.error('Failed to add company. Using it anyway.');
      // Still select the company even if saving failed
      handleSelectCompany(companyName.trim());
    } finally {
      setIsAddingCompany(false);
      setCustomCompany('');
    }
  };

  const getCompanyColor = (companyId: string) => {
    switch (companyId) {
      case 'amazon': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'google': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'meta': return 'bg-blue-600/10 text-blue-600 border-blue-600/30';
      case 'apple': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/30';
      case 'netflix': return 'bg-red-600/10 text-red-600 border-red-600/30';
      case 'microsoft': return 'bg-sky-500/10 text-sky-500 border-sky-500/30';
      default: return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Target Company (Optional)
            <Badge variant="secondary" className="ml-2 text-xs">
              {allCompanies.length}+ companies
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Select from our database or add a new company for everyone to use
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search/Select Popover */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-11"
              >
                {selectedCompany ? (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{selectedCompanyInfo?.name || selectedCompany}</span>
                    {!selectedCompanyInfo && (
                      <Badge variant="secondary" className="ml-2 text-xs">Custom</Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Search or enter any company...</span>
                )}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Search companies..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty>
                    <div className="p-4 text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        No company found. Add it to our database:
                      </p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., My Company Inc."
                          value={customCompany || searchQuery}
                          onChange={(e) => setCustomCompany(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const companyName = customCompany || searchQuery;
                            handleAddCustomCompany(companyName);
                          }}
                          disabled={isAddingCompany}
                        >
                          {isAddingCompany ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This will add the company to our database for everyone to use
                      </p>
                    </div>
                  </CommandEmpty>
                  
                  {/* Category Filter */}
                  {!searchQuery && (
                    <div className="p-2 border-b">
                      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as CompanyCategory | 'all')}>
                        <TabsList className="grid grid-cols-4 h-auto gap-1">
                          <TabsTrigger value="all" className="text-xs px-2 py-1">All</TabsTrigger>
                          <TabsTrigger value="big-tech" className="text-xs px-2 py-1">Big Tech</TabsTrigger>
                          <TabsTrigger value="consulting" className="text-xs px-2 py-1">Consulting</TabsTrigger>
                          <TabsTrigger value="finance" className="text-xs px-2 py-1">Finance</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  )}

                  {/* Company List */}
                  {Object.entries(companiesByCategory).map(([category, companies]) => {
                    if (companies.length === 0) return null;
                    if (activeCategory !== 'all' && activeCategory !== category) return null;
                    
                    return (
                      <CommandGroup key={category} heading={companyCategoryLabels[category as CompanyCategory]}>
                        {companies.map((company) => (
                          <CommandItem
                            key={company.id}
                            value={company.id}
                            onSelect={() => handleSelectCompany(company.id)}
                            className="flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <span>{company.name}</span>
                              <span className="text-xs text-muted-foreground">{company.description}</span>
                            </div>
                            {selectedCompany === company.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    );
                  })}

                  {/* Add New Company Option */}
                  {searchQuery && !filteredCompanies.some(c => c.name.toLowerCase() === searchQuery.toLowerCase()) && (
                    <CommandGroup heading="Add New Company">
                      <CommandItem
                        value={`add-${searchQuery}`}
                        onSelect={() => handleAddCustomCompany(searchQuery)}
                        className="flex items-center gap-2"
                        disabled={isAddingCompany}
                      >
                        {isAddingCompany ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 text-primary" />
                        )}
                        <div className="flex flex-col">
                          <span>Add "{searchQuery}" to database</span>
                          <span className="text-xs text-muted-foreground">Save for everyone to use</span>
                        </div>
                      </CommandItem>
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Quick Select: FAANG Companies */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Quick select popular companies:</p>
            <div className="flex flex-wrap gap-2">
              {faangCompanies.map((company) => {
                const isSelected = selectedCompany === company.id;
                return (
                  <button
                    key={company.id}
                    onClick={() => onSelect(isSelected ? null : company.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                      isSelected 
                        ? getCompanyColor(company.id)
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    {company.name}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Selected Company Display */}
          {selectedCompany && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold",
                  selectedCompanyInfo ? getCompanyColor(selectedCompany) : "bg-primary/10 text-primary"
                )}>
                  {selectedCompanyInfo?.name.charAt(0) || selectedCompany.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{selectedCompanyInfo?.name || selectedCompany}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedCompanyInfo?.interviewFocus || 'General interview preparation'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onSelect(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
