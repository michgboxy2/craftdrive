import mongoose, { HookNextFunction } from "mongoose";

interface UserAttrs {
  first_name: string;
  last_name: string;
  email: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  first_name: string;
  last_name: string;
  email: string;
}

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
