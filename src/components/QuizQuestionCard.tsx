interface QuestionProps {
    question: string;
  }
  
const Question: React.FC<QuestionProps> = ({
    question,
    ...props
}) => {
    return (
        <p
        dangerouslySetInnerHTML={{ __html: question }}
        {...props}
        />
    );
};

interface AnswerProps {
    answer: string;
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    state?: "neutral" | "correct" | "incorrect";
    value?: string;
}

const Answer: React.FC<AnswerProps> = ({
    answer,
    children,
    state = "neutral",
    ...props
    }) => {
    return (
        <button className={["answer", state].join(" ")}
        dangerouslySetInnerHTML={{ __html: answer }}
        {...props}>
        {children}
        </button>
    );
};

export type AnswerType = {
    answer: string;
    correctAnswer: string;
    isCorrect: boolean;
    question: string;
};

type QuestionCardProps = {
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  question: string;
  qNumber: number;
  userAnswer: AnswerType | undefined;
  totalQuestions: number;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  answers,
  callback,
  question,
  qNumber,
  userAnswer,
  totalQuestions,
}) => (
  <div className="card">
    <p className="qNumber">
      Question {qNumber} / {totalQuestions}
    </p>
    <Question question={question} />
    <div>
      {answers.map((answer) => (
        <div className="answers" key={answer}>
            <Answer
            answer={answer}
            // state="neutral"
            state={userAnswer === undefined
              ? "neutral"
              : userAnswer.isCorrect
              ? "correct"
              : userAnswer.answer === answer
              ? "incorrect"
              : "neutral"
            }
            disabled={(answer===userAnswer?.answer)?true:false}
            value={answer}
            onClick={callback}
          >
          </Answer>
        </div>        
      ))}
    </div>
  </div>
);