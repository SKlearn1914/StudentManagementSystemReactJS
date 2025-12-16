import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';

const experiences = [
  {
    type: 'work',
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    period: '2022 - Present',
    description: 'Leading development of enterprise web applications, mentoring junior developers, and architecting scalable solutions.',
    achievements: [
      'Improved application performance by 40%',
      'Led a team of 5 developers',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
    ],
  },
  {
    type: 'work',
    title: 'Full Stack Developer',
    company: 'Digital Solutions Ltd.',
    period: '2020 - 2022',
    description: 'Developed and maintained multiple client projects using React, Node.js, and cloud technologies.',
    achievements: [
      'Built 15+ production applications',
      'Achieved 98% client satisfaction rate',
      'Reduced bug reports by 50%',
    ],
  },
  {
    type: 'work',
    title: 'Frontend Developer',
    company: 'Creative Studios',
    period: '2019 - 2020',
    description: 'Created responsive and interactive user interfaces for various web applications.',
    achievements: [
      'Developed 20+ responsive websites',
      'Improved page load speed by 35%',
      'Implemented modern UI/UX practices',
    ],
  },
  {
    type: 'education',
    title: 'Master of Computer Science',
    company: 'University of Technology',
    period: '2017 - 2019',
    description: 'Specialized in Software Engineering and Web Technologies with focus on modern development practices.',
    achievements: [
      'GPA: 3.9/4.0',
      'Research on Web Performance Optimization',
      'Published 2 papers on Frontend Architecture',
    ],
  },
  {
    type: 'education',
    title: 'Bachelor of Computer Science',
    company: 'State University',
    period: '2013 - 2017',
    description: 'Comprehensive study of computer science fundamentals and software development.',
    achievements: [
      'GPA: 3.7/4.0',
      "Dean's List for 6 semesters",
      'Led university coding club',
    ],
  },
];

const certifications = [
  'AWS Certified Solutions Architect',
  'Google Cloud Professional Developer',
  'MongoDB Certified Developer',
  'React Advanced Certification',
];

export function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-white mb-4">Experience & Education</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            My professional journey and educational background
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 via-blue-600 to-cyan-500"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative mb-12 md:mb-24 md:flex ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className="md:w-5/12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-cyan-500 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      {exp.type === 'work' ? (
                        <Briefcase className="text-white" size={20} />
                      ) : (
                        <GraduationCap className="text-white" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl text-white">{exp.title}</h3>
                      <p className="text-cyan-400">{exp.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-400 mb-4">
                    <Calendar size={16} />
                    <span className="text-sm">{exp.period}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.2 + i * 0.1 }}
                        className="flex items-start space-x-2 text-sm text-gray-400"
                      >
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Center dot */}
              <div className="hidden md:flex md:w-2/12 justify-center items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="w-4 h-4 rounded-full bg-cyan-400 relative z-10"></div>
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="absolute inset-0 w-4 h-4 rounded-full bg-cyan-400"
                  ></motion.div>
                </motion.div>
              </div>

              {/* Empty space on the other side */}
              <div className="hidden md:block md:w-5/12"></div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 text-2xl text-white mb-4">
              <Award className="text-cyan-400" size={28} />
              <h3>Certifications</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-cyan-500 transition-all text-center"
              >
                <Award className="text-cyan-400 mx-auto mb-3" size={32} />
                <p className="text-white">{cert}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
