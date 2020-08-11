import mongoose, { HookNextFunction } from "mongoose";
import { Password } from "../services/password";

interface AuthAttrs {
  email: string;
  password: string;
  user: string;
}

interface AuthModel extends mongoose.Model<AuthDoc> {
  build(attrs: AuthAttrs): AuthDoc;
}

export interface AuthDoc extends mongoose.Document {
  email: string;
  password: string;
  user: string;
}

const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

AuthSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

AuthSchema.statics.build = (attrs: AuthAttrs) => {
  return new Auth(attrs);
};

const Auth = mongoose.model<AuthDoc, AuthModel>("Auth", AuthSchema);

export { Auth };
