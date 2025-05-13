
import React from 'react';
import styles from '../styles.module.css';

interface PromptSuggestionsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ prompts, onPromptClick }) => {
  return (
    <div className={styles.prompt}>
      <div className="text-[#00FFD1] mb-2">Sample Inquiries:</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {prompts.map((prompt, index) => (
          <button 
            key={index}
            className={styles.promptButton}
            onClick={() => onPromptClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
