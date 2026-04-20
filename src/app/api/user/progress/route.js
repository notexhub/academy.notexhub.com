import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const t = cookies().get('notex_session')?.value;
    if (!t) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await verifyToken(t);
    
    await dbConnect();
    const { courseId, moduleId } = await req.json();
    
    const dbUser = await User.findById(user.userId);
    const existingIdx = dbUser.progress.findIndex(p => p.courseId.toString() === courseId);
    
    if (existingIdx > -1) {
      if (!dbUser.progress[existingIdx].completedModules.includes(moduleId)) {
        dbUser.progress[existingIdx].completedModules.push(moduleId);
      }
    } else {
      dbUser.progress.push({ courseId, completedModules: [moduleId] });
    }
    
    await dbUser.save();
    return NextResponse.json({ success: true, progress: dbUser.progress });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
