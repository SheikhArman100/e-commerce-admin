import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campaign, Step, ContentItem, ContentContainerStyle } from '@/types/campaign.types';
import { toast } from 'sonner';

// Default campaigns that are available for everyone
const defaultCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Welcome Journey',
    userId: '123',
    steps: [
      {
        id: 'step-1',
        name: 'Welcome Screen',
        backgroundAssetId: null,
        contentContainerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: '#000000',
          borderWidth: 1,
          textColor: '#000000',
        },
        contentItems: [
          { type: 'TEXT_SNIPPET', id: 'ts-1', width: 280 }
          
        ],
        logic: [
          { questionId: 'q-2', optionValue: 'Technology', nextStepId: 'step-2' }
        ]
      },
      {
        id: 'step-2',
        name: 'Technology Path',
        backgroundAssetId: 'img-1',
        contentContainerStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderColor: '#ffffff',
          borderWidth: 1,
          textColor: '#ffffff',
        },
        contentItems: [],
        logic: [],
      },
    ],
    lastModified: new Date('2025-09-22T10:00:00Z').toISOString(),
    status: 'active',
  },
  {
    id: 'campaign-2',
    name: 'New User Onboarding',
    userId: '123',
    steps: [
      {
        id: 'c2-step-1',
        name: 'Get Started',
        backgroundAssetId: null,
        contentContainerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#3b82f6',
          borderWidth: 3,
          textColor: '#1f2937',
        },
        contentItems: [{ type: 'TEXT_SNIPPET', id: 'ts-1', width: 280 }],
        logic: []
      }
    ],
    lastModified: new Date('2025-09-22T11:30:00Z').toISOString(),
    status: 'inactive',
  }
];

// Store for all campaign data with localStorage persistence
interface CampaignsDataState {
  campaigns: Campaign[];
  initializeCampaigns: () => void;
  getCampaigns: () => Campaign[];
  getCampaign: (id: string) => Campaign | undefined;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
}

export const useCampaignsDataStore = create<CampaignsDataState>()(
  persist(
    (set, get) => ({
      campaigns: [],

      initializeCampaigns: () => {
        const currentCampaigns = get().campaigns;
        if (currentCampaigns.length === 0) {
          // Initialize with default campaigns if none exist
          set({ campaigns: [...defaultCampaigns] });
        }
      },

      getCampaigns: () => get().campaigns,

      getCampaign: (id: string) => {
        return get().campaigns.find(c => c.id === id);
      },

      addCampaign: (campaign: Campaign) => {
        set((state) => ({
          campaigns: [...state.campaigns, campaign]
        }));
      },

      updateCampaign: (id: string, updates: Partial<Campaign>) => {
        set((state) => ({
          campaigns: state.campaigns.map(campaign =>
            campaign.id === id
              ? { ...campaign, ...updates, lastModified: new Date().toISOString() }
              : campaign
          )
        }));
      },

      deleteCampaign: (id: string) => {
        set((state) => ({
          campaigns: state.campaigns.filter(campaign => campaign.id !== id)
        }));
      },
    }),
    {
      name: 'campaigns-data-store',
      // Persist everything
      partialize: (state) => state,
    }
  )
);

interface CampaignState {
  // Current user
  currentUserId: string | null;
  setCurrentUserId: (userId: string) => void;

  // Current campaign being edited
  currentCampaign: Campaign | null;
  setCurrentCampaign: (campaign: Campaign | null) => void;

  // Draft campaign (single object for current user)
  draftCampaign: Campaign | null;
  saveDraftCampaign: (campaign: Campaign) => void;
  getDraftCampaign: () => Campaign | null;
  removeDraftCampaign: () => void;
  clearDraft: () => void;

  // Campaign editing actions
  updateCampaignName: (name: string) => void;
  updateCampaignSteps: (steps: Step[]) => void;
  updateStep: (stepId: string, updates: Partial<Step>) => void;
  addStep: () => void;
  deleteStep: (stepId: string) => void;
  updateStepName: (stepId: string, name: string) => void;
  updateStyle: (stepId: string, style: Partial<ContentContainerStyle>) => void;
  setBackground: (stepId: string, assetId: string | null) => void;
  addContent: (stepId: string, item: Omit<ContentItem, 'width' | 'height'>) => void;
  removeContent: (stepId: string, index: number) => void;
  reorderContent: (stepId: string, dragIndex: number, hoverIndex: number) => void;
  resizeContent: (stepId: string, index: number, size: { width: number; height: number }) => void;
  updateLogic: (stepId: string, questionId: string, optionValue: string, nextStepId: string | null) => void;

  // Reset current campaign
  resetCurrentCampaign: () => void;
}

const createNewCampaign = (): Campaign => ({
  id: `campaign-${Date.now()}`,
  name: 'New Campaign',
  userId: '123',
  status: 'inactive',
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
});

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      currentCampaign: null,
      draftCampaign: null,

      setCurrentUserId: (userId) => set({ currentUserId: userId }),

      setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),

      saveDraftCampaign: (campaign) =>
        set(() => ({
          draftCampaign: { ...campaign, lastModified: new Date().toISOString() }
        })),

      getDraftCampaign: () => get().draftCampaign,

      removeDraftCampaign: () =>
        set({ draftCampaign: null }),

      clearDraft: () =>
        set({ draftCampaign: null }),

      updateCampaignName: (name) =>
        set((state) => ({
          currentCampaign: state.currentCampaign
            ? { ...state.currentCampaign, name, lastModified: new Date().toISOString() }
            : null
        })),

      updateCampaignSteps: (steps) =>
        set((state) => ({
          currentCampaign: state.currentCampaign
            ? { ...state.currentCampaign, steps, lastModified: new Date().toISOString() }
            : null
        })),

      updateStep: (stepId, updates) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s =>
            s.id === stepId ? { ...s, ...updates } : s
          );
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      addStep: () =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const newStep: Step = {
            id: `step-${Date.now()}`,
            name: `New Step ${state.currentCampaign.steps.length + 1}`,
            backgroundAssetId: null,
            contentContainerStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#000000',
              borderWidth: 1,
              textColor: '#000000',
            },
            contentItems: [],
            logic: [],
          };
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: [...state.currentCampaign.steps, newStep],
              lastModified: new Date().toISOString()
            }
          };
        }),

      deleteStep: (stepId) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const newSteps = state.currentCampaign.steps.filter(step => step.id !== stepId);
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: newSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      updateStepName: (stepId, name) =>
        get().updateStep(stepId, { name }),

      updateStyle: (stepId, style) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s =>
            s.id === stepId
              ? { ...s, contentContainerStyle: { ...s.contentContainerStyle, ...style } }
              : s
          );
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      setBackground: (stepId, assetId) =>
        get().updateStep(stepId, { backgroundAssetId: assetId || null }),

      addContent: (stepId, item) =>
        set((state) => {
          if (!state.currentCampaign) return state;

          const step = state.currentCampaign.steps.find(s => s.id === stepId);
          if (!step) return state;

          // Estimate height for different content types
          const getEstimatedHeight = (type: string) => {
            switch (type) {
              case 'QUESTION': return 80; // Label + input field
              case 'TEXT_SNIPPET': return 60; // Text content
              case 'BUTTON': return 50; // Button height
              default: return 40;
            }
          };

          // Calculate current total height
          const currentHeight = step.contentItems.reduce((total, contentItem) => {
            return total + (contentItem.height || getEstimatedHeight(contentItem.type));
          }, 0);

          // Available height in phone screen (rough estimate: 500px content area)
          const maxHeight = 500;
          const newItemHeight = getEstimatedHeight(item.type);

          if (currentHeight + newItemHeight > maxHeight) {
            // Show toast message when there's not enough space
            toast.error('Not enough space', {
              description: 'The campaign screen is full. Remove some content or go to next step.',
            });
            return state; // Don't add the item
          }

          const updatedSteps = state.currentCampaign.steps.map(s =>
            s.id === stepId
              ? {
                  ...s,
                  contentItems: [...s.contentItems, { ...item, width: undefined, height: undefined }]
                }
              : s
          );
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      removeContent: (stepId, index) =>
        set((state) => {
          console.log('Removing content at index', index, 'from step', stepId);
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s =>
            s.id === stepId
              ? { ...s, contentItems: s.contentItems.filter((_, i) => i !== index) }
              : s
          );
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      reorderContent: (stepId, dragIndex, hoverIndex) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s => {
            if (s.id === stepId) {
              const newItems = [...s.contentItems];
              const [draggedItem] = newItems.splice(dragIndex, 1);
              newItems.splice(hoverIndex, 0, draggedItem);
              return { ...s, contentItems: newItems };
            }
            return s;
          });
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      resizeContent: (stepId, index, size) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s => {
            if (s.id === stepId) {
              const newItems = s.contentItems.map((item, i) =>
                i === index ? { ...item, width: size.width, height: size.height } : item
              );
              return { ...s, contentItems: newItems };
            }
            return s;
          });
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      updateLogic: (stepId, questionId, optionValue, nextStepId) =>
        set((state) => {
          if (!state.currentCampaign) return state;
          const updatedSteps = state.currentCampaign.steps.map(s => {
            if (s.id === stepId) {
              const otherLogic = (s.logic || []).filter(l =>
                !(l.questionId === questionId && l.optionValue === optionValue)
              );
              const newLogic = nextStepId
                ? [...otherLogic, { questionId, optionValue, nextStepId }]
                : otherLogic;
              return { ...s, logic: newLogic };
            }
            return s;
          });
          return {
            currentCampaign: {
              ...state.currentCampaign,
              steps: updatedSteps,
              lastModified: new Date().toISOString()
            }
          };
        }),

      resetCurrentCampaign: () => set({ currentCampaign: null }),
    }),
    {
      name: 'campaign-store',
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { currentCampaign, ...persistState } = state;
        return persistState;
      },
    }
  )
);

// Helper functions
export const createCampaign = () => {
  const campaign = createNewCampaign();
  useCampaignStore.getState().setCurrentCampaign(campaign);
  return campaign;
};

export const loadCampaignForEditing = (campaignId: string) => {
  // This would typically fetch from API, but for now we'll use mock data
  const mockCampaign: Campaign = {
    id: campaignId,
    name: 'Loaded Campaign',
    userId: '123',
    status: 'active',
    lastModified: new Date().toISOString(),
    steps: [
      {
        id: 'step-1',
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
  };
  useCampaignStore.getState().setCurrentCampaign(mockCampaign);
  return mockCampaign;
};
