import { buildMongoId, userModule } from '@label/core';
import { userDtoType } from '../types/userDtoType';
import { buildUserRepository } from '../repository';
import { hasher } from '../../../lib/hasher';
import { jwtSigner } from '../../../lib/jwtSigner';
import { mailer } from '../../../lib/mailer';
import { wordings } from '../../../wordings';

export { userService };

const userService = {
  async login(user: userDtoType) {
    const userRepository = buildUserRepository();
    const storedUser = await userRepository.findByEmail(user.email);
    const isPasswordValid = await hasher.compare(
      user.password,
      storedUser.password,
    );
    if (!isPasswordValid) {
      throw new Error(
        `The received password does not match the stored one for ${user.email}`,
      );
    }
    const token = jwtSigner.sign(storedUser._id);
    return {
      token,
    };
  },
  async resetPasswordRequest(email: string) {
    const userRepository = buildUserRepository();
    const storedUser = await userRepository.findByEmail(email);
    const resetPasswordRequestToken = jwtSigner.sign(storedUser._id);
    const resetPasswordLink = `${process.env.WEBAPP_URL}/reset-password/${resetPasswordRequestToken}`;
    const text = `${wordings.resetPasswordMailText}${resetPasswordLink}`;
    await mailer.sendMail({
      to: email,
      subject: wordings.resetPasswordMailSubject,
      text: text,
    });
  },
  async signUpUser(user: userDtoType) {
    const hashedPassword = await hasher.hash(user.password);
    const userRepository = buildUserRepository();
    const newUser = userModule.lib.buildUser({
      email: user.email,
      password: hashedPassword,
    });
    return userRepository.insert(newUser);
  },
  async resetPassword(password: string, resetPasswordToken: string) {
    const userId = jwtSigner.verifyToken(resetPasswordToken);
    const userRepository = buildUserRepository();
    const userMongoId = buildMongoId(userId);
    const user = await userRepository.findById(userMongoId);
    const hashedPassword = await hasher.hash(password);
    return await userRepository.updatePassword(user, hashedPassword);
  },
};
