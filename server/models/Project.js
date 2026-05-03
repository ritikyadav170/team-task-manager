import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
