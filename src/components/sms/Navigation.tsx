import { GraduationCap, Users, BookOpen, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'students' | 'subjects';
  setActiveTab: (tab: 'dashboard' | 'students' | 'subjects') => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'subjects' as const, label: 'Subjects', icon: BookOpen },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <GraduationCap className="text-blue-600" size={32} />
            <h1 className="text-xl text-gray-900">Student Management System</h1>
          </div>

          <div className="flex space-x-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
