import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Flame, Star } from "lucide-react";

interface PlanSwitcherProps {
  value: string;
  onChange: (value: string) => void;
}

const PlanSwitcher = ({ value, onChange }: PlanSwitcherProps) => (
  <div className="flex justify-center mb-10">
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="h-12 p-1 bg-muted/50 border border-border/50">
        <TabsTrigger value="all" className="px-5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          All Plans
        </TabsTrigger>
        <TabsTrigger value="trial" className="px-5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Rocket className="h-4 w-4 text-blue-500" />
          Basic
        </TabsTrigger>
        <TabsTrigger value="monthly" className="px-5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Flame className="h-4 w-4 text-orange-500" />
          Pro
        </TabsTrigger>
        <TabsTrigger value="yearly" className="px-5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Star className="h-4 w-4 text-purple-500" />
          Elite
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
);

export default PlanSwitcher;
