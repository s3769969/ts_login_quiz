import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../store";
import "./../styles.css";
import { fetchQuizData, QuestionExt, Difficulty } from "./API";
import { logoutAction, stateAction } from "./LoginSlice";
import { AnswerType, QuestionCard} from "./QuizQuestionCard";

//properties of quizstate
interface QuizState {
    isStarted: boolean;
    isLoaded: boolean;
    qNumber: number;
    qCount: number;
    questions: QuestionExt[];
    userAnswers: AnswerType[],
    score: number;
    completed: boolean;
    results: boolean;
}

const initialState: QuizState = {
    isStarted: false,
    isLoaded: false,
    qNumber: 0,
    qCount: 0,
    questions: [],
    userAnswers: [],
    score: 0,
    completed: false,
    results: false
};

//define action for quiz
type QuizAction =
  | { type: "start" | "restart" | "error"}
  | { type: "field"; fieldName: string; payload: any }
  | { type: "updateAnswer"; fieldName: string; index: number; payload: AnswerType };

//manage state in QuizState
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
    switch (action.type) {
      case "field": {
        console.log(action)
        return {
          ...state,
          [action.fieldName]: action.payload
        };
      }case "updateAnswer": {
        console.log(action)
        const newAnswers = [...state.userAnswers]; 
        newAnswers[action.index] = action.payload
        //scoring logic
        if(state.userAnswers[action.index] !== undefined){
          if(newAnswers[action.index] !== state.userAnswers[action.index]){
            if(action.payload.isCorrect){            
              state.score += 1
            }else if(state.userAnswers[action.index].isCorrect){
              state.score -= 1
            }else{}
          }
        }else{
          if(action.payload.isCorrect){            
            state.score += 1
          }
        }
        if(newAnswers.length === state.qCount){
          state.completed = true
        }
        return {
          ...state,
          userAnswers: newAnswers
        };
      }
      case "start": {
        return {
          ...state,
          isLoaded: true,
          isStarted: true
        };
      }
      case "restart": {
        return {
          ...state,
          isLoaded: false,
          isStarted: false,
          qNumber: 0,
          qCount: 0,
          questions: [],
          userAnswers: [],
          score: 0,
          completed: false,
          results: false
        };
      }
      case "error": {
        return {
          ...state,
          isLoaded: false,
          isStarted: false
        };
      }
      default:
        return state;
    }
  };

//main quiz function
function Quiz() {  
    const isLoggedIn = useSelector((state: RootState) => state.authentication.isLoggedIn)
    const [state, dispatch] = React.useReducer(quizReducer, initialState);
    const { isStarted, questions, userAnswers, qNumber, qCount, isLoaded, score, completed, results} = state;    
    const dispatch2 = useDispatch()

    //update result state to true
    const getResult = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {        
          dispatch({
            type: "field",
            fieldName: "results",
            payload: true
          })
        } catch (error) {
            dispatch({ type: "error" });
        }
    };

    //revert all quizstate to default values
    const onRestart = async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const res = await fetchQuizData(10, Difficulty.HARD);
      console.log(res)
      console.log(state)      
      try {
          dispatch({ type: "restart" });     
      } catch (error) {
          dispatch({ type: "error" });
      }
  };

  //fetch quiz data and update total question count in state
  const onStart = async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const res = await fetchQuizData(10, Difficulty.HARD);
      console.log(res)
      console.log(state)      
      try {
          dispatch({
            type: "field",
            fieldName: "questions",
            payload: res
          })
          dispatch({
            type: "field",
            fieldName: "qCount",
            payload: res.length
          })
          dispatch({ type: "start" });          
      } catch (error) {
          dispatch({ type: "error" });
      }
  };

  //update qNumber in state to 1 index lower until when at 0
  const prev = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(state)
    try {        
      dispatch({
        type: "field",
        fieldName: "qNumber",
        payload: (qNumber > 0) ? qNumber - 1 : qNumber
      })
    } catch (error) {
        dispatch({ type: "error" });
    }
  };

  //update qNumber in state to 1 index higher until when at qCount-1
  const next = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(state)
    try {
      dispatch({
        type: "field",
        fieldName: "qNumber",
        payload: (qNumber < qCount-1) ? qNumber + 1 : qNumber
      })
    } catch (error) {
        dispatch({ type: "error" });
    }
  };

  //create answer object of AnswerType and update answer in userAnswers[] state
  //method will also update score state if changes occur
  const updateAnswer = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(e.target)
    console.log(state)
    let a = e.currentTarget.value;
    let ca = questions[qNumber].correct_answer;
    let q = questions[qNumber].question;
    let correct = (a === ca) ? true: false;

    const answerObject = {
      answer: a,
      correctAnswer: ca,
      isCorrect: correct,
      question: q,
    };
    try {
      dispatch({
        type: "updateAnswer",
        fieldName: 'userAnswers',
        index: qNumber,
        payload: answerObject
      })
  } catch (error) {
      dispatch({ type: "error" });
  }
  };

  const logout =  (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch2(logoutAction());
  };

  const navigate = useNavigate();

    return (
      <div className="App">
      <div className="quiz-container">
        <div>         
        <button onClick={()=>navigate("/home")}>Home</button>
            <button onClick={logout}>Logout</button>
            <br></br>
            <hr></hr>
            <br></br>
        </div>
        {/* Display results if result state id true
        else show QuestionCard if quiz is started
        else show Start Quiz buttons */}
        {!isLoggedIn ? (
            <Navigate to="/home"></Navigate>
          ) :
        state.results === true ? (
        <div>
          You scored: {score} / {qCount}
          <br></br>
          <button onClick={onRestart}>Try Another Quiz</button>
          </div>) :
        state.isStarted ? (
          <div>
            <QuestionCard
             answers={questions[qNumber].answers}
             callback={updateAnswer}
             question={questions[qNumber].question}
             qNumber={qNumber + 1}
             userAnswer={state.userAnswers ? state.userAnswers[qNumber] : undefined}
             totalQuestions={qCount}
             />
            <br></br>
            {state.qNumber === 0 ? (<></>) : (
            <button onClick={prev}>Prev</button>)}
            {state.qNumber === qCount-1 || state.userAnswers[qNumber] === undefined ? (<></>) : (
            <button onClick={next}>Next</button>)}
            {state.completed ? (<button onClick={getResult}>Submit Answers</button>) : (
            <></>)}
          </div> 
        ) : (
          <div>
            <button onClick={onStart}>Start Quiz</button>
          </div>                  
       )}
      </div>
      </div>
      );
}

export default Quiz;