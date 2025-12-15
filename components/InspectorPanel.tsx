import React, { useState } from 'react';
import type { Step, ImageAsset, Question, TextSnippet, ButtonContent, ContentContainerStyle, ContentItem } from '../types/campaign.types';
import { ImageLibrary } from './ImageLibrary';
import { QuestionBank } from './QuestionBank';
import { TextSnippetLibrary } from './TextSnippetLibrary';
import { ButtonLibrary } from './ButtonLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';


interface InspectorPanelProps {
  selectedStep: Step | undefined;
  imageAssets: ImageAsset[];
  questions: Question[];
  textSnippets: TextSnippet[];
  buttons: ButtonContent[];
  onStyleChange: (style: Partial<ContentContainerStyle>) => void;
  onAddContent: (item: Omit<ContentItem, 'width' | 'height'>) => void;
  onSetBackground: (assetId: string | null) => void;
  onAddImageAsset: (asset: ImageAsset) => void;
  onRemoveImageAsset?: (assetId: string) => void;
  onAddQuestion: (question: Question) => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onAddTextSnippet: (snippet: TextSnippet) => void;
  onUpdateTextSnippet: (snippet: TextSnippet) => void;
  onDeleteTextSnippet?: (snippetId: string) => void;
  onAddButton: (button: ButtonContent) => void;
  onUpdateButton: (button: ButtonContent) => void;
  onDeleteButton?: (buttonId: string) => void;
}

interface ImageLibraryProps {
  imageAssets: ImageAsset[];
  selectedStep?: Step | undefined;
  onAddImageAsset: (asset: ImageAsset) => void;
  onSelectImage: (assetId: string | null) => void;
  onRemoveImageAsset?: (assetId: string) => void;
}

const StyleInspector: React.FC<{ style: ContentContainerStyle, onChange: (style: Partial<ContentContainerStyle>) => void }> = ({ style, onChange }) => {
    return (
        <div className="space-y-6">
            {/* Colors Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <CardTitle className="text-sm font-semibold text-foreground">Colors</CardTitle>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="background-color" className="text-xs font-medium text-muted-foreground">Background</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="background-color"
                                type="color"
                                value={style.backgroundColor.startsWith('rgba') ? '#ffffff' : style.backgroundColor}
                                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                                className="w-12 h-8 p-1 border rounded cursor-pointer"
                            />
                            <span className="text-xs text-muted-foreground font-mono">
                                {style.backgroundColor.startsWith('rgba') ? style.backgroundColor : style.backgroundColor.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="text-color" className="text-xs font-medium text-muted-foreground">Text</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="text-color"
                                type="color"
                                value={style.textColor}
                                onChange={(e) => onChange({ textColor: e.target.value })}
                                className="w-12 h-8 p-1 border rounded cursor-pointer"
                            />
                            <span className="text-xs text-muted-foreground font-mono">
                                {style.textColor.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Border Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <CardTitle className="text-sm font-semibold text-foreground">Border</CardTitle>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="border-color" className="text-xs font-medium text-muted-foreground">Border Color</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="border-color"
                                type="color"
                                value={style.borderColor}
                                onChange={(e) => onChange({ borderColor: e.target.value })}
                                className="w-12 h-8 p-1 border rounded cursor-pointer"
                            />
                            <span className="text-xs text-muted-foreground font-mono">
                                {style.borderColor.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="border-width" className="text-xs font-medium text-muted-foreground">Thickness</Label>
                            <span className="text-xs text-muted-foreground font-mono">{style.borderWidth}px</span>
                        </div>
                        <Input
                            id="border-width"
                            type="range"
                            min="0"
                            max="20"
                            value={style.borderWidth}
                            onChange={(e) => onChange({ borderWidth: parseInt(e.target.value) })}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0px</span>
                            <span>20px</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Separator /> */}

            {/* Preview Section */}
            {/* <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <CardTitle className="text-sm font-semibold text-gray-900">Preview</CardTitle>
                </div>

                <Card className="border-2" style={{
                    backgroundColor: style.backgroundColor,
                    borderColor: style.borderColor,
                    borderWidth: style.borderWidth,
                    color: style.textColor
                }}>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium">Content Box Preview</p>
                        <p className="text-xs opacity-75 mt-1">This is how your content will appear</p>
                    </CardContent>
                </Card>
            </div> */}
        </div>
    );
};

export const InspectorPanel: React.FC<InspectorPanelProps> = (props) => {
  const { selectedStep, onStyleChange, onAddContent, onSetBackground, onAddImageAsset, onRemoveImageAsset, onAddQuestion, onUpdateQuestion, onDeleteQuestion, onAddTextSnippet, onUpdateTextSnippet, onDeleteTextSnippet, onAddButton, onUpdateButton, onDeleteButton } = props;
  const [activeTab, setActiveTab] = useState('library');
  const [activeLibraryTab, setActiveLibraryTab] = useState('images');

  if (!selectedStep) {
    return <aside className="w-96 bg-card border-l border-border"></aside>;
  }

  const renderLibraryContent = () => {
    switch(activeLibraryTab) {
      case 'images':
        return <ImageLibrary imageAssets={props.imageAssets} selectedStep={selectedStep} onAddImageAsset={onAddImageAsset} onSelectImage={onSetBackground} onRemoveImageAsset={onRemoveImageAsset} />;
      case 'questions':
        return <QuestionBank questions={props.questions} onAddQuestion={onAddQuestion} onUpdateQuestion={onUpdateQuestion} onDeleteQuestion={onDeleteQuestion} onAddToStep={(id:any) => onAddContent({ type: 'QUESTION', id })} />;
      case 'text':
        return <TextSnippetLibrary textSnippets={props.textSnippets} onAddTextSnippet={onAddTextSnippet} onUpdateTextSnippet={onUpdateTextSnippet} onDeleteTextSnippet={onDeleteTextSnippet} onAddToStep={(id:any) => onAddContent({ type: 'TEXT_SNIPPET', id })} />;
      case 'buttons':
        return <ButtonLibrary buttons={props.buttons} onAddButton={onAddButton} onUpdateButton={onUpdateButton} onDeleteButton={onDeleteButton} onAddToStep={(id:any) => onAddContent({ type: 'BUTTON', id })} />;
      default:
        return null;
    }
  }

  return (
    <aside className="w-96 bg-card border-l border-border flex flex-col z-10 overflow-y-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2" variant="line">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="inspector">Inspector</TabsTrigger>
        </TabsList>

        <div className="flex-grow overflow-y-auto">
          <TabsContent value="library" className="mt-0">
            <Tabs value={activeLibraryTab} onValueChange={setActiveLibraryTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
              </TabsList>
              <div className="p-4">{renderLibraryContent()}</div>
            </Tabs>
          </TabsContent>
          <TabsContent value="inspector" className="mt-0">
            <Card className="m-4">
              <CardHeader>
                <CardTitle>Content Box Styles</CardTitle>
              </CardHeader>
              <CardContent>
                <StyleInspector style={selectedStep.contentContainerStyle} onChange={onStyleChange} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};
