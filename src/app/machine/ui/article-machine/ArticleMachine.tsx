import { selectEditor } from '@/store/slice/adminSlice';
import React from 'react';
import { useSelector } from 'react-redux';

interface ArticleMachineProps {
  article: string;
  changeFunction: (value: string) => void;
}

const ArticleMachine: React.FC<ArticleMachineProps> = ({ article, changeFunction }) => {
  const editor = useSelector(selectEditor);
  return (
    <div>
      {editor ? (
        <div className="flex gap-1">
          <span>Код:</span>
          <input
            type="text"
            placeholder="Артикул товару"
            value={article}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeFunction(e.target.value);
            }}
          />
        </div>
      ) : (
        <span>Код: {article}</span>
      )}
    </div>
  );
};

export default ArticleMachine;