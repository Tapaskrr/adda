import { useState } from 'react'
import './App.css'

function App() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState([])
  const [quizQuestions, setQuizQuestions] = useState([])

  const verses = [
    {
      reference: "भजन संहिता 68:19 (BIS)",
      explanation: "धन्य है प्रभु, जो दिन-प्रतिदिन हमारे बोझ उठाता है; वही हमारा उद्धारकर्ता है।"
    },
    {
      reference: "भजन संहिता 55:22 (BIS)",
      explanation: "अपनी चिन्ता यहोवा पर डाल दे, वही तुझे सम्भालेगा; वह धर्मी को कभी गिरने न देगा।"
    },
    {
      reference: "भजन संहिता 37:5 (BIS)",
      explanation: "अपने मार्ग यहोवा को सौंप दे और उस पर भरोसा रख, वही सब कुछ पूरा करेगा।"
    },
    {
      reference: "नीतिवचन 16:3 (BIS)",
      explanation: "अपने काम यहोवा को सौंप दे, तब तेरी योजनाएँ सफल होंगी।"
    },
    {
      reference: "नीतिवचन 4:23 (BIS)",
      explanation: "सबसे अधिक अपने मन की रक्षा कर, क्योंकि जीवन का स्रोत वही है।"
    }
  ]

  const getRandomOptions = (correctIndex, allVerses) => {
    const correctVerse = allVerses[correctIndex]
    const otherVerses = allVerses.filter((_, index) => index !== correctIndex)
    
    // Randomly select 3 other verses
    const shuffledOthers = [...otherVerses].sort(() => Math.random() - 0.5)
    const selectedOthers = shuffledOthers.slice(0, 3)
    
    // Combine correct answer with random wrong answers
    const allOptions = [correctVerse, ...selectedOthers]
    
    // Shuffle all options randomly
    return allOptions.sort(() => Math.random() - 0.5)
  }

  const generateQuizQuestions = () => {
    const shuffledIndices = [...Array(verses.length).keys()].sort(() => Math.random() - 0.5)
    const selectedIndices = shuffledIndices.slice(0, 5) // Take 5 random verses
    
    return selectedIndices.map(verseIndex => {
      const options = getRandomOptions(verseIndex, verses)
      const correctAnswerIndex = options.findIndex(option => 
        option.reference === verses[verseIndex].reference
      )
      
      return {
        verseReference: verses[verseIndex].reference,
        correctExplanation: verses[verseIndex].explanation,
        options: options.map(option => option.explanation),
        correct: correctAnswerIndex
      }
    })
  }

  const startQuiz = () => {
    const newQuizQuestions = generateQuizQuestions()
    setQuizQuestions(newQuizQuestions)
    setShowQuiz(true)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnsweredQuestions([])
  }

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correct
    
    if (isCorrect) {
      setScore(score + 1)
    }
    
    setAnsweredQuestions([...answeredQuestions, {
      questionIndex: currentQuestion,
      selectedAnswer: answerIndex,
      isCorrect: isCorrect
    }])
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const handleClose = () => {
    setShowQuiz(false)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnsweredQuestions([])
    setQuizQuestions([])
  }

  const getOptionStyle = (index) => {
    if (selectedAnswer === null) return {}
    
    const isCorrect = index === quizQuestions[currentQuestion].correct
    const isSelected = index === selectedAnswer
    
    if (isSelected && isCorrect) {
      return { backgroundColor: '#4CAF50', color: 'white' }
    } else if (isSelected && !isCorrect) {
      return { backgroundColor: '#f44336', color: 'white' }
    } else if (isCorrect) {
      return { backgroundColor: '#4CAF50', color: 'white' }
    }
    
    return {}
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', textAlign: 'center', marginTop: '2rem', marginBottom: '3rem' }}>
        welcome to adda
      </h1>

      {!showQuiz ? (
        <button 
          onClick={startQuiz}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          QUIZ
        </button>
      ) : showResult ? (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Quiz Completed!</h2>
          <div style={{ fontSize: '1.5rem', margin: '2rem 0' }}>
            Your Score: {score} / {quizQuestions.length}
          </div>
          <div style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Percentage: {Math.round((score / quizQuestions.length) * 100)}%
          </div>
          <button 
            onClick={handleClose}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2>Question {currentQuestion + 1} of {quizQuestions.length}</h2>
            <div style={{ fontSize: '1.3rem', color: '#2c3e50', marginBottom: '1rem', fontWeight: 'bold' }}>
              Verse Reference: {quizQuestions[currentQuestion].verseReference}
            </div>
            <div style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem' }}>
              Which explanation matches this verse reference?
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  padding: '1rem',
                  margin: '0.5rem 0',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: selectedAnswer === null ? 'pointer' : 'default',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  ...getOptionStyle(index)
                }}
              >
                {option}
              </div>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={handleClose}
                style={{
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button 
                onClick={handleNext}
                style={{
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
