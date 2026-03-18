import Header from '../components/layout/Header';
import TaskList from '../components/tasks/TaskList';
import ParticleBackground from '../components/ui/ParticleBackground';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 dark:from-yellow-950/10 via-transparent to-transparent pointer-events-none transition-colors duration-300" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
            My <span className="text-yellow-500">Tasks</span>
          </h1>
          <p className="text-gray-500 dark:text-zinc-500 mt-1 transition-colors duration-300">Track, manage, and complete your work.</p>
        </div>

        <TaskList />
      </main>
    </div>
  );
};

export default DashboardPage;
