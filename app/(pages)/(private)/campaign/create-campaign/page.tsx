'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageAsset, Question, QuestionType, TextSnippet, ButtonContent } from '@/types/campaign.types';
import { ArrowLeftIcon, PencilIcon, CheckIcon, PanelLeftIcon, PanelRightIcon, SaveIcon, RefreshCwIcon } from '@/components/icons';
import { CampaignLeftPanel } from '@/components/CampaignLeftPanel';
import { Canvas } from '@/components/Canvas';
import { InspectorPanel } from '@/components/InspectorPanel';
import { useCampaignStore } from '@/stores/campaignStore';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { ScreenLoader } from '@/components/screen-loader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';

const initialImageAssets: ImageAsset[] = [
  { id: 'img-1', name: 'Mountain View', url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2070&auto=format&fit=crop' },
  { id: 'img-2', name: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2070&auto=format&fit=crop' },
];

const initialQuestions: Question[] = [
  { id: 'q-1', text: 'What is your name?', type: QuestionType.TEXT, placeholder: 'Enter your full name' },
  { id: 'q-2', text: 'Which topic are you interested in?', type: QuestionType.DROPDOWN, options: ['Technology', 'Health', 'Science'] },
  { id: 'q-3', text: 'What is your date of birth?', type: QuestionType.DATE },
  { id: 'q-4', text: 'Please provide your signature', type: QuestionType.SIGN, placeholder: 'Sign here' },
];

const initialTextSnippets: TextSnippet[] = [
  { id: 'ts-1', name: 'Welcome Message', text: 'Welcome to our campaign!' },
  { id: 'ts-2', name: 'Thank You', text: 'Thank you for your submission.' },
];

const initialButtons: ButtonContent[] = [
  { id: 'btn-signin', text: 'Sign In', isDefault: true },
  { id: 'btn-next', text: 'Next', isDefault: true },
  { id: 'btn-prev', text: 'Prev', isDefault: true },
];

export default function CreateCampaign() {
  const router = useRouter();
  const {
    currentUserId,
    setCurrentUserId,
    currentCampaign,
    setCurrentCampaign,
    addStep,
    deleteStep,
    updateStepName,
    updateStyle,
    setBackground,
    addContent,
    removeContent,
    reorderContent,
    resizeContent,
  } = useCampaignStore();

  const createCampaignMutation = useCreateCampaign();

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Mobile drawer states
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  // Global assets (could also be moved to store if needed)
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>(initialImageAssets);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [textSnippets, setTextSnippets] = useState<TextSnippet[]>(initialTextSnippets);
  const [buttons, setButtons] = useState<ButtonContent[]>(initialButtons);

  // Set current user ID on mount (in a real app, this would come from auth)
  useEffect(() => {
    if (!currentUserId) {
      // In a real app, get this from your auth system
      const userId = '123'; // Mock user ID - matches existing campaigns
      setCurrentUserId(userId);
    }
  }, [currentUserId, setCurrentUserId]);

  // Load from draft if available, otherwise create fresh campaign
  useEffect(() => {
    if (currentUserId) {
      const { getDraftCampaign } = useCampaignStore.getState();
      const draft = getDraftCampaign();

      if (draft) {
        // Load existing draft campaign
        setCurrentCampaign(draft);

        // Load assets from draft if available
        if (draft.imageAssets) setImageAssets(draft.imageAssets);
        if (draft.questions) setQuestions(draft.questions);
        if (draft.textSnippets) setTextSnippets(draft.textSnippets);
        if (draft.buttons) setButtons(draft.buttons);
      } else {
        // Create new campaign - no draft available
        const newCampaign = {
          id: `campaign-${Date.now()}`,
          name: 'New Campaign',
          userId: currentUserId,
          status: 'inactive' as const,
          lastModified: new Date().toISOString(),
          steps: [
            {
              id: `step-${Date.now()}`,
              name: 'Welcome Screen',
              backgroundAssetId: null,
              contentContainerStyle: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: '#000000',
                borderWidth: 2,
                textColor: '#000000',
              },
              contentItems: [],
              logic: [],
            },
          ],
          imageAssets: initialImageAssets,
          questions: initialQuestions,
          textSnippets: initialTextSnippets,
        };
        setCurrentCampaign(newCampaign);
      }
    }
  }, [currentUserId, setCurrentCampaign]);

  // Set selected step when campaign changes
  useEffect(() => {
    if (currentCampaign && !selectedStepId) {
      setSelectedStepId(currentCampaign.steps[0]?.id || null);
    }
  }, [currentCampaign, selectedStepId]);

  // Auto-save drafts every 1 second
  useEffect(() => {
    if (currentCampaign) {
      const timeoutId = setTimeout(() => {
        const { saveDraftCampaign } = useCampaignStore.getState();

        // Include current assets in the campaign before saving
        const campaignWithAssets = {
          ...currentCampaign,
          imageAssets,
          questions,
          textSnippets,
          buttons,
        };

        saveDraftCampaign(campaignWithAssets);
        setLastSaved(new Date().toLocaleString());
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [currentCampaign, imageAssets, questions, textSnippets, buttons]);

  const selectedStep = currentCampaign?.steps.find(step => step.id === selectedStepId) || undefined;

  const handleBackToList = useCallback(() => {
    router.push('/campaign');
  }, [router]);

  const handleSelectStep = useCallback((id: string) => {
    setSelectedStepId(id);
  }, []);

  const handleAddImageAsset = useCallback((asset: ImageAsset) => {
    setImageAssets(prev => [...prev, asset]);
  }, []);

  const handleAddQuestion = useCallback((question: Question) => {
    setQuestions(prev => [...prev, question]);
  }, []);

  const handleUpdateQuestion = useCallback((updatedQuestion: Question) => {
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  }, []);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  }, []);

  const handleAddTextSnippet = useCallback((snippet: TextSnippet) => {
    setTextSnippets(prev => [...prev, snippet]);
  }, []);

  const handleUpdateTextSnippet = useCallback((updatedSnippet: TextSnippet) => {
    setTextSnippets(prev => prev.map(s => s.id === updatedSnippet.id ? updatedSnippet : s));
  }, []);

  const handleDeleteTextSnippet = useCallback((snippetId: string) => {
    setTextSnippets(prev => prev.filter(s => s.id !== snippetId));
  }, []);

  const handleAddButton = useCallback((button: ButtonContent) => {
    setButtons(prev => [...prev, button]);
  }, []);

  const handleUpdateButton = useCallback((updatedButton: ButtonContent) => {
    setButtons(prev => prev.map(b => b.id === updatedButton.id ? updatedButton : b));
  }, []);

  const handleDeleteButton = useCallback((buttonId: string) => {
    setButtons(prev => prev.filter(b => b.id !== buttonId));
  }, []);



  // Wrapper functions for Canvas and InspectorPanel
  const handleRemoveContent = useCallback((index: number) => {
    if (selectedStepId) removeContent(selectedStepId, index);
  }, [selectedStepId, removeContent]);

  const handleReorderContent = useCallback((dragIndex: number, hoverIndex: number) => {
    if (selectedStepId) reorderContent(selectedStepId, dragIndex, hoverIndex);
  }, [selectedStepId, reorderContent]);

  const handleResizeContent = useCallback((index: number, size: { width: number; height: number }) => {
    if (selectedStepId) resizeContent(selectedStepId, index, size);
  }, [selectedStepId, resizeContent]);

  const handleStyleChange = useCallback((style: any) => {
    if (selectedStepId) updateStyle(selectedStepId, style);
  }, [selectedStepId, updateStyle]);

  const handleAddContent = useCallback((item: any) => {
    if (selectedStepId) addContent(selectedStepId, item);
  }, [selectedStepId, addContent]);

  const handleSetBackground = useCallback((assetId: string | null) => {
    if (selectedStepId) setBackground(selectedStepId, assetId);
  }, [selectedStepId, setBackground]);

  const handleCampaignNameChange = useCallback((newName: string) => {
    if (currentCampaign) {
      setCurrentCampaign({
        ...currentCampaign,
        name: newName,
        lastModified: new Date().toISOString(),
      });
    }
  }, [currentCampaign, setCurrentCampaign]);

  const handleReset = useCallback(async () => {
    if (!currentCampaign) return;

    setIsResetting(true);
    try {
      // Add 500ms loading effect
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear draft campaign from store
      const { clearDraft } = useCampaignStore.getState();
      clearDraft();

      // Create new fresh campaign directly
      const newCampaign = {
        id: `campaign-${Date.now()}`,
        name: 'New Campaign',
        userId: currentUserId!,
        status: 'inactive' as const,
        lastModified: new Date().toISOString(),
        steps: [
          {
            id: `step-${Date.now()}`,
            name: 'Welcome Screen',
            backgroundAssetId: null,
            contentContainerStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#000000',
              borderWidth: 2,
              textColor: '#000000',
            },
            contentItems: [],
            logic: [],
          },
        ],
        imageAssets: initialImageAssets,
        questions: initialQuestions,
        textSnippets: initialTextSnippets,
      };

      // Set the new campaign
      setCurrentCampaign(newCampaign);

      // Reset selected step
      setSelectedStepId(null);

      // Clear last saved time
      setLastSaved(null);

      console.log('Campaign reset successfully');
    } catch (error) {
      console.error('Failed to reset campaign:', error);
    } finally {
      setIsResetting(false);
    }
  }, [currentCampaign, currentUserId, setCurrentCampaign]);

  const handleSaveCampaign = useCallback(async () => {
    if (!currentCampaign) return;

    setIsSaving(true);
    try {
      // Add 500ms loading effect
      await new Promise(resolve => setTimeout(resolve, 500));

      // Prepare campaign data for API
      const campaignData = {
        name: currentCampaign.name,
        userId: currentCampaign.userId,
        status: 'active' as const,
        steps: currentCampaign.steps,
        imageAssets,
        questions,
        textSnippets,
        buttons,
      };

      // Create campaign via API
      await createCampaignMutation.mutateAsync(campaignData);

      // Show success toast
      toast.success('Campaign saved successfully!', {
        description: `"${currentCampaign.name}" has been created and is now active.`,
      });

      // Campaign saved successfully

      // Clear draft campaign from store
      const { clearDraft } = useCampaignStore.getState();
      clearDraft();

      // Clear current campaign
      setCurrentCampaign(null);

      // Redirect to campaign list
      router.push('/campaign');
    } catch (error) {
      console.error('Failed to save campaign:', error);
      toast.error('Failed to save campaign', {
        description: 'Please try again or contact support if the problem persists.',
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentCampaign, router, setCurrentCampaign, createCampaignMutation]);





  if (!currentCampaign) {
    return (
      <ScreenLoader title='Loading template'/>
    );
  }

  // Editable Campaign Name Component
  const EditableCampaignName: React.FC<{ name: string; onNameChange: (name: string) => void }> = ({ name, onNameChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);

    const handleSave = () => {
      if (editName.trim()) {
        onNameChange(editName.trim());
      }
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditName(name);
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="text-xl font-bold text-foreground bg-background border-border"
            autoFocus
          />
          <Button
            onClick={handleSave}
            variant="ghost"
            size="icon"
            className="text-primary hover:text-primary/80"
          >
            <CheckIcon className="w-5 h-5" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
        <h1 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h1>
        <PencilIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 h-full lg:h-[calc(100vh-var(--header-height)-40px)] shadow-sm rounded-lg lg:overflow-y-auto">
      {/* Consistent Header for All Devices */}
      <header className="bg-card border-b border-border p-2 flex flex-col lg:flex-row items-start lg:items-center gap-3 justify-between shrink-0">
        <div className="flex items-center w-full ">
          <Button
            onClick={handleBackToList}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className='hidden lg:block'>Back to Campaigns</span>
          </Button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <div className='w-full '>
            <EditableCampaignName name={currentCampaign.name} onNameChange={handleCampaignNameChange} />
            <p className="text-xs text-muted-foreground">
              Creating New Campaign
              {lastSaved && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  • Auto-saved {lastSaved}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className=" w-full flex items-center justify-end gap-2">
          <Button
            onClick={handleReset}
            disabled={isResetting}
            variant="ghost"
            size="sm"
          >
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            {isResetting ? 'Resetting...' : 'Reset'}
          </Button>
          <Button
            onClick={handleSaveCampaign}
            disabled={isSaving}
            variant="primary"
            size="sm"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Campaign'}
          </Button>

        </div>
      </header>

      {/* Panel Toggle Buttons - Mobile Only */}
      <div className="bg-muted/30 border-b border-border p-2 flex items-center justify-center gap-2 z-20 shrink-0 lg:hidden">
        <Button
          onClick={() => setShowLeftDrawer(!showLeftDrawer)}
          variant="outline"
          size="sm"
          className="text-muted-foreground hover:text-primary"
        >
          <PanelLeftIcon className="w-4 h-4 mr-2" />
          Steps
        </Button>
        <Button
          onClick={() => setShowRightDrawer(!showRightDrawer)}
          variant="outline"
          size="sm"
          className="text-muted-foreground hover:text-primary"
        >
          <PanelRightIcon className="w-4 h-4 mr-2" />
          Inspector
        </Button>
      </div>
      {/* Responsive Main Layout */}
      <main className="flex flex-1 min-h-0 relative h-full">
        {/* Mobile Layout with Drawers */}
        <div className="flex flex-1 lg:hidden h-full">
          {/* Left Drawer */}
          <Sheet open={showLeftDrawer} onOpenChange={setShowLeftDrawer}>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Campaign Steps</SheetTitle>
              </SheetHeader>
              <CampaignLeftPanel
                steps={currentCampaign.steps}
                selectedStepId={selectedStepId}
                onSelectStep={handleSelectStep}
                onAddStep={addStep}
                onDeleteStep={deleteStep}
                onUpdateStepName={updateStepName}
              />
            </SheetContent>
          </Sheet>

          {/* Canvas - Full Width and Height on Mobile */}
          <div className="flex-1 h-full overflow-hidden">
            <div className="h-full w-full relative ">
              <Canvas
                step={selectedStep}
                imageAssets={imageAssets}
                questions={questions}
                textSnippets={textSnippets}
                buttons={buttons}
                onRemoveContent={handleRemoveContent}
                onReorderContent={handleReorderContent}
                onResizeContent={handleResizeContent}
              />
            </div>
          </div>

          {/* Right Drawer */}
          <Sheet open={showRightDrawer} onOpenChange={setShowRightDrawer}>
            <SheetContent side="right" className="w-[90vw] sm:w-80 p-0">
              <SheetHeader className="sr-only ">
                <SheetTitle>Content Inspector</SheetTitle>
              </SheetHeader>
              <InspectorPanel
                selectedStep={selectedStep}
                imageAssets={imageAssets}
                questions={questions}
                textSnippets={textSnippets}
                buttons={buttons}
                onStyleChange={handleStyleChange}
                onAddContent={handleAddContent}
                onSetBackground={handleSetBackground}
                onAddImageAsset={handleAddImageAsset}
                onAddQuestion={handleAddQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onAddTextSnippet={handleAddTextSnippet}
                onUpdateTextSnippet={handleUpdateTextSnippet}
                onDeleteTextSnippet={handleDeleteTextSnippet}
                onAddButton={handleAddButton}
                onUpdateButton={handleUpdateButton}
                onDeleteButton={handleDeleteButton}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Layout - Original Three Panel */}
        <div className="hidden lg:flex flex-1">
          <CampaignLeftPanel
            steps={currentCampaign.steps}
            selectedStepId={selectedStepId}
            onSelectStep={handleSelectStep}
            onAddStep={addStep}
            onDeleteStep={deleteStep}
            onUpdateStepName={updateStepName}
          />
          <Canvas
            step={selectedStep}
            imageAssets={imageAssets}
            questions={questions}
            textSnippets={textSnippets}
            buttons={buttons}
            onRemoveContent={handleRemoveContent}
            onReorderContent={handleReorderContent}
            onResizeContent={handleResizeContent}
          />
          <InspectorPanel
            selectedStep={selectedStep}
            imageAssets={imageAssets}
            questions={questions}
            textSnippets={textSnippets}
            buttons={buttons}
            onStyleChange={handleStyleChange}
            onAddContent={handleAddContent}
            onSetBackground={handleSetBackground}
            onAddImageAsset={handleAddImageAsset}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onAddTextSnippet={handleAddTextSnippet}
            onUpdateTextSnippet={handleUpdateTextSnippet}
            onDeleteTextSnippet={handleDeleteTextSnippet}
            onAddButton={handleAddButton}
            onUpdateButton={handleUpdateButton}
            onDeleteButton={handleDeleteButton}
          />
        </div>
      </main>
    </div>
  );
}
