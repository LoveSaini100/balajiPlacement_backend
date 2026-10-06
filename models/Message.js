import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderRole: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      required: true
    },
    senderName: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      required: [true, 'Message text is required']
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
