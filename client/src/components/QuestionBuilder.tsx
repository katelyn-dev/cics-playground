import React, {useRef, useState} from 'react';
import { v4 as uuid } from 'uuid';

type QuestionType = 'text' | 'single-choice' | 'multiple-choice';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
}

interface Option {
  value: string;
}

const QuestionBuilder: React.FC = () => {
  const question: Question = {
    id: uuid(),
    type: 'text',
    text: '',
    options: [],
  };

  const [questions, setQuestions ] = useState<Question[]>([]);

  const addQuestion = (questionType: QuestionType) => {
    const question: Question = {
      id: uuid(),
      type: questionType,
      text: '',
      options: [],
    };
    setQuestions([...questions, question]);
  };

  const updateQuestion = (questionId: string, property: keyof Question, value: any) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        question[property] = value;
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const addOption = (questionId: string) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        question.options = [...question.options, ''];
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        question.options = question.options.filter((_, i) => i !== optionIndex);
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const jsonQuestions = JSON.stringify(questions);
    console.log(jsonQuestions);
  };

  return (
    <div>
      <h2>Question Builder</h2>
      <button onClick={() => addQuestion('text')}>Add Text Question</button>
      <button onClick={() => addQuestion('single-choice')}>Add Single Choice Question</button>
      <button onClick={() => addQuestion('multiple-choice')}>Add Multiple Choice Question</button>

      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <input
              type="text"
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
            />

            {question.type === 'single-choice' && (
              <div>
                {question.options.map((option, i) => (
                  <div key={i}>
                    <input
                      type="text"
                      placeholder="Enter option"
                      value={option}
                      onChange={(e) => updateQuestion(question.id, 'options', [...question.options.slice(0, i), e.target.value, ...question.options.slice(i + 1)])}
                    />
                    <button onClick={() => removeOption(question?.id, i)}>X</button>
                  </div>
                ))}
                <button onClick={() => addOption(question?.id)}>+</button>
              </div>
            )}

            {question.type === 'multiple-choice' && (
              <div>
                {question.options.map((option, i) => (
                  <div key={i}>
                    <input
                      type="checkbox"
                      checked={option === 'true'}
                      onChange={(e) => updateQuestion(question.id, 'options', [...question.options.slice(0, i), e.target.checked, ...question.options.slice(i + 1)])}
                    />
                    <label>{option}</label>
                  </div>
                ))}
                <button onClick={() => addOption(question?.id)}>+</button>
              </div>
            )}
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default QuestionBuilder;