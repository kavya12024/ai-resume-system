import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLogOut, FiMic, FiVolume2, FiCheck } from 'react-icons/fi';

const API_URL = 'http://localhost:5001/api';

export default function InterviewPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [skills, setSkills] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const startInterview = async () => {
    if (!skills || skills.length === 0) {
      alert('Please enter or extract skills first');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/interview/generate-question`,
        {
          skills: typeof skills === 'string' ? skills : skills.join(', '),
          question_count: 1
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setCurrentQuestion(response.data.question);
        setInterviewStarted(true);
        setQuestionCount(questionCount + 1);
        setUserAnswer('');
        setScore(null);
        setFeedback('');
      }
    } catch (err) {
      alert('Failed to generate question: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please provide an answer');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/interview/evaluate-answer`,
        {
          question: currentQuestion,
          answer: userAnswer
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const scoreValue = response.data.score;
        setScore(scoreValue);
        setFeedback(response.data.feedback);
        
        // Add to history
        setInterviewHistory([
          ...interviewHistory,
          {
            question: currentQuestion,
            answer: userAnswer,
            score: scoreValue,
            feedback: response.data.feedback
          }
        ]);

        // Update overall score
        const newOverall = (overallScore * (questionCount - 1) + scoreValue) / questionCount;
        setOverallScore(Math.round(newOverall * 100) / 100);
      }
    } catch (err) {
      alert('Failed to evaluate answer: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getNextQuestion = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/interview/generate-question`,
        {
          skills: typeof skills === 'string' ? skills : skills.join(', '),
          question_count: questionCount + 1
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setCurrentQuestion(response.data.question);
        setQuestionCount(questionCount + 1);
        setUserAnswer('');
        setScore(null);
        setFeedback('');
      }
    } catch (err) {
      alert('Failed to generate question: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const endInterview = () => {
    setInterviewStarted(false);
    setCurrentQuestion('');
    setUserAnswer('');
    setScore(null);
    setFeedback('');
    setQuestionCount(0);
    setOverallScore(0);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Mock Interview</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {!interviewStarted ? (
          // Pre-Interview Setup
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Interview Setup</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Skills (comma-separated)
              </label>
              <textarea
                value={typeof skills === 'string' ? skills : skills.join(', ')}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Python, React, Node.js, SQL"
                rows="4"
              />
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400"
            >
              {loading ? 'Starting Interview...' : 'Start Mock Interview'}
            </button>
          </div>
        ) : (
          // Interview Session
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Interview Area */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Question {questionCount}</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-lg text-gray-800 font-medium">{currentQuestion}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer</label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={score !== null}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                    placeholder="Type your answer here..."
                    rows="6"
                  />
                </div>

                {score === null ? (
                  <button
                    onClick={submitAnswer}
                    disabled={loading || !userAnswer.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400"
                  >
                    {loading ? 'Evaluating...' : 'Submit Answer'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="text-sm text-gray-600">Score</p>
                      <p className="text-3xl font-bold text-green-600">{score}/100</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Feedback</p>
                      <p className="text-gray-700">{feedback}</p>
                    </div>

                    <button
                      onClick={getNextQuestion}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400"
                    >
                      {loading ? 'Loading Next Question...' : 'Next Question'}
                    </button>

                    <button
                      onClick={endInterview}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition"
                    >
                      End Interview
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Interview Stats</h3>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Questions Answered</p>
                  <p className="text-3xl font-bold text-blue-600">{interviewHistory.length}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <p className="text-3xl font-bold text-green-600">{overallScore.toFixed(1)}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {interviewHistory.length > 0
                      ? (interviewHistory.reduce((sum, item) => sum + item.score, 0) / interviewHistory.length).toFixed(1)
                      : '0'}
                  </p>
                </div>
              </div>

              {interviewHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-800 mb-3">History</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {interviewHistory.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                        <p className="font-medium text-gray-700">Q{index + 1}: {item.score}/100</p>
                        <p className="text-gray-600 truncate">{item.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
