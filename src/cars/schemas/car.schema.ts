import * as mongoose from 'mongoose';
// tslint:disable-next-line: no-duplicate-imports
import { Schema, Document } from 'mongoose';

export enum CarType {
  SEDAN = 'sedan',
  COUPE = 'coupe',
  MINIVAN = 'minivan',
  HATCHBACK = 'hatchback',
  TRUCK = 'truck',
  PICKUP_TRUCK = 'pickup truck',
  CROSSOVER = 'crossover',
}

export enum CarStatus {
  UNAVAILABLE = 'unavailable',
  FREE = 'free',
}

export interface ICar extends Document {
  numberPlate: string;
  type: CarType;
  modelType: string;
  soldAt: Date;
  mileage: number;
  status: CarStatus;
}

const carSchema: Schema = new Schema({
  numberPlate: { type: String, required: true },
  type: { type: String, required: true },
  modelType: { type: String, required: true },
  soldAt: { type: Date, required: true },
  mileage: { type: Number, requried: true },
  status: { type: String, required: true },
});

export default mongoose.model<ICar>('Car', carSchema);
