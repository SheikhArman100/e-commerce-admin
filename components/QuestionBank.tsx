import React, { useState } from 'react';
import type { Question } from '../types/campaign.types';
import { QuestionType } from '../types/campaign.types';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface QuestionBankProps {
  questions: Question[];
  onAddQuestion: (question: Question) => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onAddToStep: (questionId: string) => void;
}

const QuestionForm: React.FC<{
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}> = ({ question, onSave, onCancel }) => {
  const [text, setText] = useState(question?.text || '');
  const [type, setType] = useState<QuestionType>(question?.type || QuestionType.TEXT);
  const [placeholder, setPlaceholder] = useState((question && 'placeholder' in question) ? question.placeholder || '' : '');
  const [options, setOptions] = useState<string[]>((question && 'options' in question) ? question.options || [] : []);

  const handleSave = () => {
    if (!text.trim()) return;

    let newQuestion: Question;

    if (type === QuestionType.TEXT) {
      newQuestion = {
        id: question?.id || `q-${Date.now()}`,
        text: text.trim(),
        type: QuestionType.TEXT,
        placeholder: placeholder.trim() || undefined,
      };
    } else if (type === QuestionType.DROPDOWN) {
      newQuestion = {
        id: question?.id || `q-${Date.now()}`,
        text: text.trim(),
        type: QuestionType.DROPDOWN,
        options: options.filter(opt => opt.trim()),
      };
    } else if (type === QuestionType.DATE) {
      newQuestion = {
        id: question?.id || `q-${Date.now()}`,
        text: text.trim(),
        type: QuestionType.DATE,
        placeholder: placeholder.trim() || undefined,
      };
    } else {
      // SIGN type
      newQuestion = {
        id: question?.id || `q-${Date.now()}`,
        text: text.trim(),
        type: QuestionType.SIGN,
        placeholder: placeholder.trim() || undefined,
      };
    }

    onSave(newQuestion);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Input
              id="question-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your question"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-type">Question Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as QuestionType)}>
              <SelectTrigger id="question-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={QuestionType.TEXT}>Text Input</SelectItem>
                <SelectItem value={QuestionType.DROPDOWN}>Dropdown</SelectItem>
                <SelectItem value={QuestionType.DATE}>Date Picker</SelectItem>
                <SelectItem value={QuestionType.SIGN}>Signature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(type === QuestionType.TEXT || type === QuestionType.SIGN) && (
            <div className="space-y-2">
              <Label htmlFor="placeholder-text">Placeholder Text</Label>
              <Input
                id="placeholder-text"
                type="text"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                placeholder={type === QuestionType.SIGN ? "Enter signature placeholder (e.g., 'Please sign here')" : "Enter placeholder text"}
              />
            </div>
          )}

          {type === QuestionType.DROPDOWN && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button onClick={addOption} variant="ghost" size="sm">
                  + Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      onClick={() => removeOption(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="primary">
              {question ? 'Update' : 'Add'} Question
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddToStep
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleAddQuestion = (question: Question) => {
    onAddQuestion(question);
    setIsAdding(false);
  };

  const handleUpdateQuestion = (question: Question) => {
    onUpdateQuestion(question);
    setEditingQuestion(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Question Bank</h3>
        <Button onClick={() => setIsAdding(true)} variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {isAdding && (
        <QuestionForm
          onSave={handleAddQuestion}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {editingQuestion && (
        <QuestionForm
          question={editingQuestion}
          onSave={handleUpdateQuestion}
          onCancel={() => setEditingQuestion(null)}
        />
      )}

      <div className="space-y-3">
        {questions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col-reverse justify-start items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold text-foreground mb-2">
                    {question.text}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-3">
                    Type: <span className="font-medium">{question.type}</span>
                    {'placeholder' in question && question.placeholder && (
                      <span className="ml-2">• Placeholder: {question.placeholder}</span>
                    )}
                  </CardDescription>
                  {'options' in question && question.options && question.options.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground font-medium mb-2">Options:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full border"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end space-x-2  flex-shrink-0  w-full">
                  <Button
                    onClick={() => onAddToStep(question.id)}
                    variant="primary"
                    size="sm"
                    className="h-8"
                  >
                    + Add to Step
                  </Button>
                  <Button
                    onClick={() => setEditingQuestion(question)}
                    variant="ghost"
                    size="icon"
                    title="Edit question"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  {onDeleteQuestion && (
                    <Button
                      onClick={() => onDeleteQuestion(question.id)}
                      variant="ghost"
                      size="icon"
                      title="Delete question"
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

      {questions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50 bg-muted rounded-full flex items-center justify-center">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <CardTitle className="text-lg text-foreground mb-2">No questions in bank</CardTitle>
            <CardDescription className="text-center">
              Add questions to collect user responses from your campaign participants.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
