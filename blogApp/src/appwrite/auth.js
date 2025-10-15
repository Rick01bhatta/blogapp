import conf from "../config/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    const userAccount = await this.account.create(ID.unique(), email, password, name);
    if (userAccount) {
      // if account created then direct login
      return this.login({ email, password });
    }
    return userAccount;
  }

  async login({ email, password }) {
    return this.account.createEmailPasswordSession(email, password);
    // if using older SDK, keep this:
    // return this.account.createSession(email, password);
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      if (error.code === 401) {
        // no active session (guest user)
        return null;
      }
      console.log("Appwrite Service :: getCurrentUser :: error", error);
      return null;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite Service:: logout:: error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
