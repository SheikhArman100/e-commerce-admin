import React, { useState } from 'react';
import type { Step } from '../types/campaign.types';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CampaignLeftPanelProps {
  steps: Step[];
  selectedStepId: string | null;
  onSelectStep: (id: string) => void;
  onAddStep: () => void;
  onDeleteStep: (id: string) => void;
  onUpdateStepName: (id: string, newName: string) => void;
}

const EditableStepName: React.FC<{step: Step, onUpdateStepName: (id: string, newName: string) => void}> = ({ step, onUpdateStepName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(step.name);

    const handleSave = () => {
        onUpdateStepName(step.id, name);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-1">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="w-full bg-background text-foreground text-sm border-border focus:border-primary"
                    autoFocus
                />
                <Button
                    onClick={handleSave}
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary/80 h-6 w-6"
                >
                    <CheckIcon className="w-3 h-3" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between group">
            <span className="truncate  text-sm">{step.name}</span>
            <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-5 w-5"
            >
                <PencilIcon className="w-3 h-3" />
            </Button>
        </div>
    );
};


export const CampaignLeftPanel: React.FC<CampaignLeftPanelProps> = ({
  steps,
  selectedStepId,
  onSelectStep,
  onAddStep,
  onDeleteStep,
  onUpdateStepName
}) => {
  const [stepPendingDeletion, setStepPendingDeletion] = useState<string | null>(null);

  return (
    <aside className="w-64 bg-card text-foreground flex flex-col shadow-sm border-r border-border h-full">
      {/* Header */}
      <div className="p-3 border-b border-border bg-muted/30 flex-shrink-0">
        <h2 className="text-base font-semibold text-foreground">Campaign Steps</h2>
        <p className="text-xs text-muted-foreground mt-1">Manage your campaign flow</p>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-2">
          {steps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No steps yet</p>
              <p className="text-xs mt-1">Add your first step below</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {steps.map((step, index) => (
                <li key={step.id}>
                  {stepPendingDeletion === step.id ? (
                    <div className="bg-destructive/10 p-3 rounded-md text-center border border-destructive/20">
                      <p className="font-medium text-sm text-foreground mb-2">Delete this step?</p>
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() => {
                            onDeleteStep(step.id);
                            setStepPendingDeletion(null);
                          }}
                          variant="destructive"
                          size="sm"
                          className="h-7 px-3"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => setStepPendingDeletion(null)}
                          variant="outline"
                          size="sm"
                          className="h-7 px-3"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => onSelectStep(step.id)}
                      className={`flex items-center p-2.5 rounded-md cursor-pointer group transition-all duration-200 ${
                        selectedStepId === step.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted shadow-sm'
                      }`}
                    >
                      <div className={`flex-shrink-0 rounded-full h-6 w-6 flex items-center justify-center font-semibold text-xs bg-primary-foreground text-primary`}>
                        {index + 1}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <EditableStepName step={step} onUpdateStepName={onUpdateStepName} />
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStepPendingDeletion(step.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive h-6 w-6"
                        aria-label={`Delete step ${step.name}`}
                        title={`Delete step ${step.name}`}
                      >
                        <TrashIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20 flex-shrink-0">
        <Button
          onClick={onAddStep}
          className="w-full"
          variant="primary"

        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>
    </aside>
  );
};
