import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== STUDENTS ====================

// Get all students
app.get('/make-server-569d7c76/students', async (c) => {
  try {
    const students = await kv.getByPrefix('student:');
    return c.json({ success: true, data: students });
  } catch (error) {
    console.log('Error fetching students:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single student
app.get('/make-server-569d7c76/students/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const student = await kv.get(`student:${id}`);
    
    if (!student) {
      return c.json({ success: false, error: 'Student not found' }, 404);
    }
    
    return c.json({ success: true, data: student });
  } catch (error) {
    console.log('Error fetching student:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create student
app.post('/make-server-569d7c76/students', async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    
    const student = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`student:${id}`, student);
    return c.json({ success: true, data: student });
  } catch (error) {
    console.log('Error creating student:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update student
app.put('/make-server-569d7c76/students/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existingStudent = await kv.get(`student:${id}`);
    if (!existingStudent) {
      return c.json({ success: false, error: 'Student not found' }, 404);
    }
    
    const updatedStudent = {
      ...existingStudent,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`student:${id}`, updatedStudent);
    return c.json({ success: true, data: updatedStudent });
  } catch (error) {
    console.log('Error updating student:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete student
app.delete('/make-server-569d7c76/students/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`student:${id}`);
    return c.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.log('Error deleting student:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== SUBJECTS ====================

// Get all subjects
app.get('/make-server-569d7c76/subjects', async (c) => {
  try {
    const subjects = await kv.getByPrefix('subject:');
    return c.json({ success: true, data: subjects });
  } catch (error) {
    console.log('Error fetching subjects:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create subject
app.post('/make-server-569d7c76/subjects', async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    
    const subject = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`subject:${id}`, subject);
    return c.json({ success: true, data: subject });
  } catch (error) {
    console.log('Error creating subject:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update subject
app.put('/make-server-569d7c76/subjects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existingSubject = await kv.get(`subject:${id}`);
    if (!existingSubject) {
      return c.json({ success: false, error: 'Subject not found' }, 404);
    }
    
    const updatedSubject = {
      ...existingSubject,
      ...body,
      id,
    };
    
    await kv.set(`subject:${id}`, updatedSubject);
    return c.json({ success: true, data: updatedSubject });
  } catch (error) {
    console.log('Error updating subject:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete subject
app.delete('/make-server-569d7c76/subjects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`subject:${id}`);
    return c.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    console.log('Error deleting subject:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== BULK OPERATIONS ====================

// Import data (students and subjects)
app.post('/make-server-569d7c76/import', async (c) => {
  try {
    const { students = [], subjects = [] } = await c.req.json();
    
    // Import students
    for (const student of students) {
      const id = student.id || generateId();
      await kv.set(`student:${id}`, { ...student, id });
    }
    
    // Import subjects
    for (const subject of subjects) {
      const id = subject.id || generateId();
      await kv.set(`subject:${id}`, { ...subject, id });
    }
    
    return c.json({ 
      success: true, 
      message: `Imported ${students.length} students and ${subjects.length} subjects` 
    });
  } catch (error) {
    console.log('Error importing data:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Export data
app.get('/make-server-569d7c76/export', async (c) => {
  try {
    const students = await kv.getByPrefix('student:');
    const subjects = await kv.getByPrefix('subject:');
    
    return c.json({ 
      success: true, 
      data: { students, subjects } 
    });
  } catch (error) {
    console.log('Error exporting data:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Clear all data
app.delete('/make-server-569d7c76/clear-all', async (c) => {
  try {
    const students = await kv.getByPrefix('student:');
    const subjects = await kv.getByPrefix('subject:');
    
    const studentKeys = students.map(s => `student:${s.id}`);
    const subjectKeys = subjects.map(s => `subject:${s.id}`);
    
    if (studentKeys.length > 0) {
      await kv.mdel(studentKeys);
    }
    if (subjectKeys.length > 0) {
      await kv.mdel(subjectKeys);
    }
    
    return c.json({ 
      success: true, 
      message: `Cleared ${studentKeys.length} students and ${subjectKeys.length} subjects` 
    });
  } catch (error) {
    console.log('Error clearing data:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== SEED DATA ====================

// Initialize with default subjects
app.post('/make-server-569d7c76/seed', async (c) => {
  try {
    const defaultSubjects = [
      { name: 'Object Oriented Programming', code: 'CS301', credits: 4, semester: 3 },
      { name: 'Data Structures & Algorithms', code: 'CS302', credits: 4, semester: 3 },
      { name: 'Operating Systems', code: 'CS303', credits: 4, semester: 3 },
      { name: 'Computer Networks', code: 'CS304', credits: 3, semester: 3 },
      { name: 'Database Management Systems', code: 'CS305', credits: 4, semester: 4 },
      { name: 'Software Engineering', code: 'CS306', credits: 3, semester: 4 },
      { name: 'Web Technologies', code: 'CS307', credits: 3, semester: 4 },
      { name: 'Computer Architecture', code: 'CS308', credits: 3, semester: 4 },
    ];
    
    for (const subject of defaultSubjects) {
      const id = generateId();
      await kv.set(`subject:${id}`, { ...subject, id, createdAt: new Date().toISOString() });
    }
    
    return c.json({ success: true, message: 'Default subjects seeded successfully' });
  } catch (error) {
    console.log('Error seeding data:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
