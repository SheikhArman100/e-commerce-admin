import React, { useState, useRef } from 'react';
import type { TextSnippet } from '../types/campaign.types';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface TextSnippetLibraryProps {
  textSnippets: TextSnippet[];
  onAddTextSnippet: (snippet: TextSnippet) => void;
  onUpdateTextSnippet: (snippet: TextSnippet) => void;
  onDeleteTextSnippet?: (snippetId: string) => void;
  onAddToStep: (snippetId: string) => void;
}

const TextSnippetForm: React.FC<{
  snippet?: TextSnippet;
  onSave: (snippet: TextSnippet) => void;
  onCancel: () => void;
}> = ({ snippet, onSave, onCancel }) => {
  const [name, setName] = useState(snippet?.name || '');
  const [text, setText] = useState(snippet?.text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    let newText: string;
    let insertedText: string;

    if (selectedText) {
      // Wrap selected text
      insertedText = selectedText;
      newText = `${beforeText}<${tag}>${selectedText}</${tag}>${afterText}`;
    } else {
      // Insert at cursor with placeholder
      insertedText = tag.startsWith('h') ? `Heading ${tag.slice(1)}` : 'Paragraph text';
      newText = `${beforeText}<${tag}>${insertedText}</${tag}>${afterText}`;
    }

    setText(newText);

    // Set cursor position after the inserted tag
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + `<${tag}>`.length + insertedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const handleSave = () => {
    if (!name.trim() || !text.trim()) return;

    const newSnippet: TextSnippet = {
      id: snippet?.id || `ts-${Date.now()}`,
      name: name.trim(),
      text: text.trim(),
    };

    onSave(newSnippet);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="snippet-name">Snippet Name</Label>
            <Input
              id="snippet-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter snippet name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="snippet-text">Snippet Text</Label>

            {/* Formatting Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-md border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertTag('h1')}
                className="h-7 px-2 text-xs"
                title="Heading 1"
              >
                H1
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertTag('h2')}
                className="h-7 px-2 text-xs"
                title="Heading 2"
              >
                H2
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertTag('h3')}
                className="h-7 px-2 text-xs"
                title="Heading 3"
              >
                H3
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertTag('h4')}
                className="h-7 px-2 text-xs"
                title="Heading 4"
              >
                H4
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertTag('h5')}
                className="h-7 px-2 text-xs"
                title="Heading 5"
              >
                H5
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertTag('h6')}
                className="h-7 px-2 text-xs"
                title="Heading 6"
              >
                H6
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertTag('p')}
                className="h-7 px-2 text-xs"
                title="Paragraph"
              >
                P
              </Button>
            </div>

            <Textarea
              ref={textareaRef}
              id="snippet-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Enter the text content for this snippet. Use the buttons above to add formatting."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} variant="primary">
              {snippet ? 'Update' : 'Add'} Snippet
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TextSnippetLibrary: React.FC<TextSnippetLibraryProps> = ({
  textSnippets,
  onAddTextSnippet,
  onUpdateTextSnippet,
  onDeleteTextSnippet,
  onAddToStep
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<TextSnippet | null>(null);

  const handleAddSnippet = (snippet: TextSnippet) => {
    onAddTextSnippet(snippet);
    setIsAdding(false);
  };

  const handleUpdateSnippet = (snippet: TextSnippet) => {
    onUpdateTextSnippet(snippet);
    setEditingSnippet(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Text Snippets</h3>
        <Button onClick={() => setIsAdding(true)} variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Snippet
        </Button>
      </div>

      {isAdding && (
        <TextSnippetForm
          onSave={handleAddSnippet}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {editingSnippet && (
        <TextSnippetForm
          snippet={editingSnippet}
          onSave={handleUpdateSnippet}
          onCancel={() => setEditingSnippet(null)}
        />
      )}

      <div className="space-y-3">
        {textSnippets.map((snippet) => (
          <Card key={snippet.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col-reverse justify-start items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold text-foreground mb-2">
                    {snippet.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-3">
                    Text Snippet
                  </CardDescription>
                  <div className="p-4 bg-muted rounded-lg border text-sm text-foreground whitespace-pre-wrap font-mono">
                    {snippet.text}
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 flex-shrink-0 w-full">
                  <Button
                    onClick={() => onAddToStep(snippet.id)}
                    variant="primary"
                    size="sm"
                    className="h-8"
                  >
                    + Add to Step
                  </Button>
                  <Button
                    onClick={() => setEditingSnippet(snippet)}
                    variant="ghost"
                    size="icon"
                    title="Edit snippet"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  {onDeleteTextSnippet && (
                    <Button
                      onClick={() => onDeleteTextSnippet(snippet.id)}
                      variant="ghost"
                      size="icon"
                      title="Delete snippet"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {textSnippets.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50 bg-muted rounded-full flex items-center justify-center">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <CardTitle className="text-lg text-foreground mb-2">No text snippets</CardTitle>
            <CardDescription className="text-center">
              Add reusable text content for your campaigns to save time and maintain consistency.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
