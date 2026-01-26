import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Building2 } from 'lucide-react';
import { CompanyCategory, companyCategoryLabels } from '@/data/technologies';

interface CompanyFormData {
  name: string;
  category: CompanyCategory;
  description: string;
  interviewFocus: string;
}

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  isLoading: boolean;
}

export function AddCompanyDialog({
  open,
  onOpenChange,
  initialName,
  onSubmit,
  isLoading,
}: AddCompanyDialogProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: initialName,
    category: 'enterprise',
    description: '',
    interviewFocus: '',
  });

  // Update name when initialName changes
  useState(() => {
    setFormData(prev => ({ ...prev, name: initialName }));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateField = (field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Add Company Details
          </DialogTitle>
          <DialogDescription>
            Provide details about the company to generate more relevant interview questions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Acme Corporation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Industry Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => updateField('category', value as CompanyCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(companyCategoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="e.g., Leading provider of cloud-based enterprise solutions..."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Brief description of what the company does
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interview-focus">Interview Focus Areas</Label>
            <Textarea
              id="interview-focus"
              value={formData.interviewFocus}
              onChange={(e) => updateField('interviewFocus', e.target.value)}
              placeholder="e.g., System design, scalability, microservices, AWS expertise..."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Key topics and skills emphasized in interviews at this company
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add & Use Company'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
