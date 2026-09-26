import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Course, CourseLesson, CourseAssignment, QuizQuestion } from '../types';
import {
  GraduationCap,
  Play,
  CheckCircle,
  Award,
  BookOpen,
  PlusCircle,
  Send,
  Video,
  FileText,
  HelpCircle,
  X,
  ChevronRight,
  Clock,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TrainingView: React.FC = () => {
  const { currentUser, isAdmin, isManager, isRepresentative, canUploadCoursework } = useAuth();
  const { courses, submissions, createCourse, submitQuiz, submitAssignment } = useData();

  // Active view: 'list' or 'course_details'
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);

  // Active tab inside course: 'lessons' | 'assignment' | 'quiz'
  const [courseTab, setCourseTab] = useState<'lessons' | 'assignment' | 'quiz'>('lessons');

  // Assignment text state
  const [assignmentText, setAssignmentText] = useState<string>('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState<boolean>(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  // Create Course Modal State (Owner / Manager)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Field Sales & Closing');
  const [newBadgeTitle, setNewBadgeTitle] = useState('Fiber Specialist Certification');
  const [newDesc, setNewDesc] = useState('');
  const [newLevel, setNewLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newHours, setNewHours] = useState(2);

  // Lessons inside new course
  const [newLessons, setNewLessons] = useState<
    { title: string; durationMinutes: number; videoUrl?: string; content: string; keyTakeaways: string[] }[]
  >([
    {
      title: 'Module 1: Opening Script & Neighborhood Notice',
      durationMinutes: 15,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Master the 7-second curb opening and step back 2 paces to eliminate door resistance.',
      keyTakeaways: ['Step back 2 paces', 'Disrupt with infrastructure update language'],
    },
  ]);

  // Assignment inside new course
  const [newAssignTitle, setNewAssignTitle] = useState('Field Pitch Roleplay Response');
  const [newAssignInstructions, setNewAssignInstructions] = useState(
    'Submit your verbatim 45-second pitch overcoming the legacy cable speed objection.'
  );

  // Quiz questions inside new course
  const [newQuizQuestions, setNewQuizQuestions] = useState<
    { question: string; options: string[]; correctAnswerIndex: number; explanation: string }[]
  >([
    {
      question: 'What makes Fiber download/upload speeds unique compared to coaxial cable?',
      options: [
        'Fiber is purely wireless',
        'Fiber offers 100% symmetrical upload speeds via glass laser strands',
        'Coaxial cable uses less electricity',
        'No difference',
      ],
      correctAnswerIndex: 1,
      explanation: 'Symmetrical uploads allow smooth Zoom calls, fast security cam backups, and zero lag.',
    },
  ]);

  // Check user submission for active course
  const userSubmission = submissions.find(
    (s) => s.courseId === activeCourse?.id && s.userId === currentUser?.id
  );

  const handleOpenCourse = (c: Course) => {
    setActiveCourse(c);
    setActiveLessonIdx(0);
    setCourseTab('lessons');
    setQuizResult(null);
    setQuizAnswers({});
    const sub = submissions.find((s) => s.courseId === c.id && s.userId === currentUser?.id);
    if (sub?.assignmentAnswer) {
      setAssignmentText(sub.assignmentAnswer);
      setAssignmentSubmitted(true);
    } else {
      setAssignmentText('');
      setAssignmentSubmitted(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!activeCourse) return;
    const res = await submitQuiz(activeCourse.id, quizAnswers);
    setQuizResult(res);
    if (res.passed) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !assignmentText.trim()) return;
    await submitAssignment(activeCourse.id, assignmentText);
    setAssignmentSubmitted(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please provide a course title.');
      return;
    }

    await createCourse({
      title: newTitle,
      category: newCategory,
      badgeTitle: newBadgeTitle,
      description: newDesc || 'In-house sales and operations training module.',
      estimatedHours: newHours,
      level: newLevel,
      lessons: newLessons.map((l, i) => ({
        id: `lesson_${Date.now()}_${i}`,
        ...l,
      })),
      assignment: {
        id: `assign_${Date.now()}`,
        title: newAssignTitle,
        instructions: newAssignInstructions,
        deliverableType: 'pitch_script',
        maxPoints: 100,
      },
      quiz: newQuizQuestions.map((q, i) => ({
        id: `quiz_${Date.now()}_${i}`,
        ...q,
      })),
      published: true,
    });

    setShowCreateModal(false);
    // Reset modal
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Internal Academy & Schooling
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            FiberBlitz Training & Certification
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            School-style coursework, field video modules, script assignments, and interactive certification
            quizzes created in-house by leadership.
          </p>
        </div>

        {/* Create Course button for Admins & Managers */}
        {canUploadCoursework && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5px]" />
            <span>Upload & Make Coursework</span>
          </button>
        )}
      </div>

      {/* VIEW 1: COURSE BROWSER / LIST */}
      {!activeCourse ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-black text-white">Required Curriculum & Field Certifications</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">{courses.length} Modules Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course) => {
              const sub = submissions.find(
                (s) => s.courseId === course.id && s.userId === currentUser?.id
              );
              const isCompleted = sub?.status === 'completed' || sub?.quizPassed;

              return (
                <div
                  key={course.id}
                  onClick={() => handleOpenCourse(course)}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-5 sm:p-6 space-y-4 cursor-pointer transition-all hover:scale-[1.01] shadow-lg group relative overflow-hidden"
                >
                  {/* Top Badge & Level */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.estimatedHours} hrs</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Syllabus / Curriculum Highlights */}
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Modules: {course.lessons.length} Lessons</span>
                      <span>Quiz & Script Assignment Included</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Earn: "{course.badgeTitle}"</span>
                    </div>
                  </div>

                  {/* Completion Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-500">Instructor: {course.authorName}</span>
                    {isCompleted ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Certified Passed</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Start Coursework</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: ACTIVE COURSE ROOM (SCHOOL WORK, VIDEOS, QUIZZES, ASSIGNMENTS) */
        <div className="space-y-6">
          {/* Back button & Course Title */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveCourse(null)}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-3 rounded-xl bg-slate-900 border border-slate-800"
            >
              ← Back to All Courses
            </button>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              {activeCourse.category}
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-white">{activeCourse.title}</h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {activeCourse.description}
            </p>

            {/* Course Tabs: Lessons & Videos vs Assignment vs Quiz */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setCourseTab('lessons')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  courseTab === 'lessons'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Lessons & Video Lectures ({activeCourse.lessons.length})</span>
              </button>

              {activeCourse.assignment && (
                <button
                  onClick={() => setCourseTab('assignment')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    courseTab === 'assignment'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Written Assignment {assignmentSubmitted && '✓'}</span>
                </button>
              )}

              {activeCourse.quiz && activeCourse.quiz.length > 0 && (
                <button
                  onClick={() => setCourseTab('quiz')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    courseTab === 'quiz'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Interactive Exam / Quiz ({activeCourse.quiz.length} Qs)</span>
                </button>
              )}
            </div>
          </div>

          {/* TAB CONTENT 1: LESSONS & VIDEOS */}
          {courseTab === 'lessons' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Lesson Selector */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Course Modules
                </span>
                <div className="space-y-2">
                  {activeCourse.lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonIdx(idx)}
                      className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-2.5 text-xs ${
                        activeLessonIdx === idx
                          ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 font-bold'
                          : 'bg-slate-950/50 hover:bg-slate-800/50 text-slate-300 border border-slate-800/80'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="line-clamp-1">{lesson.title}</p>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {lesson.durationMinutes} mins
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Video & Reading Material */}
              <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
                {activeCourse.lessons[activeLessonIdx] && (
                  <>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        Lesson {activeLessonIdx + 1} of {activeCourse.lessons.length}
                      </span>
                      <h3 className="text-xl font-black text-white mt-1">
                        {activeCourse.lessons[activeLessonIdx].title}
                      </h3>
                    </div>

                    {/* In-Platform Video Player Simulation / Embed */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex items-center justify-center group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-transparent flex flex-col justify-end p-6">
                        <div className="flex items-center gap-3">
                          <button className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-cyan-500/40">
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          </button>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              Play Interactive Field Lecture
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Duration: {activeCourse.lessons[activeLessonIdx].durationMinutes} minutes • 1080p HD
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lesson Notes / Script */}
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Field Scripts & Key Takeaways
                      </span>
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                        {activeCourse.lessons[activeLessonIdx].content}
                      </div>

                      {activeCourse.lessons[activeLessonIdx].keyTakeaways?.length > 0 && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-2">
                          <span className="text-[11px] font-bold text-cyan-400 uppercase">
                            Key Rules for the Turf:
                          </span>
                          <ul className="space-y-1.5">
                            {activeCourse.lessons[activeLessonIdx].keyTakeaways.map((point, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: WRITTEN ASSIGNMENT */}
          {courseTab === 'assignment' && activeCourse.assignment && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto space-y-5">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Course Assignment
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {activeCourse.assignment.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                  {activeCourse.assignment.instructions}
                </p>
              </div>

              {assignmentSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-bold">Assignment Submitted & Approved!</span>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-line">
                    {assignmentText}
                  </div>
                  <button
                    onClick={() => setAssignmentSubmitted(false)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Edit & Re-submit Response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAssignmentSubmit} className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">
                    Your Response / Door Script Submission:
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Type your field objection response here..."
                    value={assignmentText}
                    onChange={(e) => setAssignmentText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Assignment to Leadership</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT 3: INTERACTIVE QUIZ */}
          {courseTab === 'quiz' && activeCourse.quiz && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto space-y-6">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  School Certification Exam
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Certification Quiz: {activeCourse.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Passing score is 70%+. Pass to unlock your official "{activeCourse.badgeTitle}" credential.
                </p>
              </div>

              {quizResult && (
                <div
                  className={`p-5 rounded-2xl border ${
                    quizResult.passed
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  } text-center space-y-2`}
                >
                  <div className="text-3xl font-black">{quizResult.score}%</div>
                  <h4 className="text-sm font-bold">
                    {quizResult.passed ? '🎉 Congratulations! You Passed!' : 'Need Review. Try Again!'}
                  </h4>
                  <p className="text-xs max-w-md mx-auto">
                    {quizResult.passed
                      ? `You have earned the "${activeCourse.badgeTitle}" credential for your field badge profile!`
                      : 'Review the modules above and re-take the questions to reach 70%.'}
                  </p>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {activeCourse.quiz.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                        {q.question}
                      </h4>
                    </div>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = quizAnswers[q.id] === optIndex;
                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() =>
                              setQuizAnswers((prev) => ({
                                ...prev,
                                [q.id]: optIndex,
                              }))
                            }
                            className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-200 font-semibold'
                                : 'bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizResult && (
                      <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Grade My Exam & Submit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: UPLOAD & CREATE COURSEWORK (OWNER / MANAGER ONLY) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Leadership Academy Studio
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Upload & Author In-House Coursework
              </h3>
              <p className="text-xs text-slate-400">
                Create full course modules, lecture video embeds, assignments, and quizzes.
              </p>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Symmetrical Speeds & Objection Neutralization"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Field Sales & Closing">Field Sales & Closing</option>
                    <option value="Technical Fiber Knowledge">Technical Fiber Knowledge</option>
                    <option value="Operations & Dispatch">Operations & Dispatch</option>
                    <option value="Leadership & Team Culture">Leadership & Team Culture</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Badge Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Fiber Closer"
                    value={newBadgeTitle}
                    onChange={(e) => setNewBadgeTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Course Summary</label>
                <textarea
                  rows={2}
                  placeholder="Explain what the field reps will learn in this coursework..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Lesson Module Creator */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Module 1: Video & Lecture Notes
                </span>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Lesson Title</label>
                  <input
                    type="text"
                    value={newLessons[0]?.title}
                    onChange={(e) => {
                      const updated = [...newLessons];
                      updated[0].title = e.target.value;
                      setNewLessons(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Video Lecture URL (YouTube Embed or direct video link)
                  </label>
                  <input
                    type="text"
                    value={newLessons[0]?.videoUrl}
                    onChange={(e) => {
                      const updated = [...newLessons];
                      updated[0].videoUrl = e.target.value;
                      setNewLessons(updated);
                    }}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Lecture Script & Notes</label>
                  <textarea
                    rows={3}
                    value={newLessons[0]?.content}
                    onChange={(e) => {
                      const updated = [...newLessons];
                      updated[0].content = e.target.value;
                      setNewLessons(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              {/* Assignment Prompt */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Written Assignment Prompt
                </span>
                <input
                  type="text"
                  value={newAssignTitle}
                  onChange={(e) => setNewAssignTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mb-2"
                />
                <textarea
                  rows={2}
                  value={newAssignInstructions}
                  onChange={(e) => setNewAssignInstructions(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs"
                >
                  Publish to Academy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
