import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimation extends Document {
  name: string;
  path: string;
  description:string;
  fileName:string;
  createdAt: Date;
  updatedAt: Date;
}

const AnimationSchema: Schema = new Schema({
  name: { type: String },
  description: { type: String },
  fileName: { type: String },
  path: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.model<IAnimation>('Animation', AnimationSchema);
