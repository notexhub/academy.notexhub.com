const mongoose = require('mongoose');

// Absolute paths to models (using require for script)
const MONGODB_URI = 'mongodb://localhost:27017/notexhub';

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  duration: { type: String }
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  isFree: { type: Boolean, default: false },
  bannerBase64: { type: String },
  modules: [ModuleSchema]
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Course.deleteMany({}); // Clear existing

  const courses = [
    {
      title: 'কমপ্লিট ওয়েভ ডেভেলপমেন্ট (MERN)',
      description: 'বেসিক থেকে অ্যাডভান্সড লেভেল পর্যন্ত শিখুন রিয়েল লাইফ প্রজেক্টের মাধ্যমে।',
      isFree: false,
      bannerBase64: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
      modules: [
        { title: 'Introduction to HTML & CSS', youtubeUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE', duration: '12:00' },
        { title: 'Mastering JavaScript ES6', youtubeUrl: 'https://www.youtube.com/watch?v=ncRSTW3C2BY', duration: '45:00' },
        { title: 'React.js Fundamentals', youtubeUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', duration: '30:00' }
      ]
    },
    {
      title: 'গ্রাফিক্স ডিজাইন মাস্টারক্লাস',
      description: 'ইলাস্ট্রেটর এবং ফটোশপ দিয়ে প্রফেশনাল ডিজাইন শিখুন।',
      isFree: true,
      bannerBase64: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600',
      modules: [
        { title: 'Photoshop Basics', youtubeUrl: 'https://www.youtube.com/watch?v=IyR_uysg_9s', duration: '15:00' },
        { title: 'Logo Design Concepts', youtubeUrl: 'https://www.youtube.com/watch?v=zOgsYpC_JMQ', duration: '20:00' }
      ]
    },
    {
      title: 'ডিজিটাল মার্কেটিং সলিউশন',
      description: 'সোশাল মিডিয়া মার্কেটিং এবং এসইও এর পূর্ণাঙ্গ গাইড।',
      isFree: false,
      bannerBase64: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
      modules: [
        { title: 'Facebook Ad Campaigns', youtubeUrl: 'https://www.youtube.com/watch?v=3-M92_8oG3Y', duration: '10:00' },
        { title: 'Keyword Research Strategy', youtubeUrl: 'https://www.youtube.com/watch?v=nIbeoU0N9uY', duration: '18:00' }
      ]
    }
  ];

  await Course.insertMany(courses);
  console.log('Dummy courses seeded successfully!');
  mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
