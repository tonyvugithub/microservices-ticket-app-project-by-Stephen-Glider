import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  //Abstract query methods
  build(attrs: TicketAttrs): TicketDoc;
  findByIdAndPreviousVersion(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

//Called by the class
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, //This is to make sure that the id save in orders' Ticket DB has the same _id as in tickets' Ticket DB
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByIdAndPreviousVersion = (data: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: data.id,
    version: data.version - 1, //When receive the event, look to see if there is a previous version in DB
  });
};

//Called by an object. Ticket Document method to check if a ticket is reserved
ticketSchema.methods.isReserved = async function () {
  //this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    //A reserved order should have one of these below status aka not cancelled
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  //!! is to convert to boolean type
  return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  'Ticket',
  ticketSchema
);
