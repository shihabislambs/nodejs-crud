import { Model } from 'objection';
import * as bcrypt from 'bcrypt';

export default class User extends Model {
  public static async isUsernameAvailable(username: string): Promise<boolean> {
    const res = await this.query().findOne({ username });
    if (res) {
      return false;
    }
    return true;
  }

  public readonly id!: number;
  public password: string;

  static get tableName() {
    return 'users';
  }

  public async $beforeInsert() {
    this.password = await this.hashPassword(this.password);
  }

  private async hashPassword(password: string) {
    const normalizePassword = password.trim();
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash(normalizePassword, salt);
    return hash;

  }

  public async comparePassword(password: string): Promise<boolean> {
    const user = this as User;
    if (!user.password) {
        return false;
    }
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, user.password, function (err, isMatch: boolean) {
            if (err) {
                return reject(err);
            }
            resolve(isMatch);
        });
    });
  }
}
