import * as mongoose from 'mongoose';
// tslint:disable-next-line: no-duplicate-imports
import { Schema, Document } from 'mongoose';

import Car, { CarType } from '../../cars/schemas/car.schema';

export enum DeliveryStatus {
  DONE = 'done',
  PENDING = 'pending',
  FREE = 'free',
}

export interface IRoute extends Document {
  departure: string;
  arrival: string;
  distance: number;
  type: CarType;
  earnings: number;
  startedAt: Date;
  deliveredAt: Date;
  status: DeliveryStatus;
  car: mongoose.Schema.Types.ObjectId;
}

const routeSchema: Schema = new Schema({
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  distance: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  startedAt: { type: Date },
  deliveredAt: { type: Date },
  earnings: { type: Number },
  car: { ref: Car, type: mongoose.Schema.Types.ObjectId, default: null },
});

export default mongoose.model<IRoute>('Route', routeSchema);
