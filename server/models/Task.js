import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
    dueDate: { type: Date },
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
