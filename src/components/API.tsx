import { shuffleArray } from "./utils";

export type Question = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
};

export type QuestionExt = Question & { answers: string[] };

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export const fetchQuizData = async (
    amount: number,
    difficulty: Difficulty
  ): Promise<QuestionExt[]> => {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=9&difficulty=${difficulty}&type=multiple`;
    const data = await (await fetch(url)).json();
    return data.results.map((question: Question) => ({
      ...question,
      answers: shuffleArray([
        ...question.incorrect_answers,
        question.correct_answer
      ])
    }));  
};

